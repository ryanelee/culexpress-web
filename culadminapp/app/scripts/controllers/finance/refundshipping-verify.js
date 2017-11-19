'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderListCtrl
 * @description
 * # OrderListCtrl 
 * Controller of the culAdminApp
 */ 
angular.module('culAdminApp')
    .controller('RefundShippingVerifyCtl', ["$timeout", "$window", "$scope", "$rootScope", "$location", "$filter", "plugMessenger","$compile","storage","customerService","warehouseService",
        function ($timeout, $window, $scope, $rootScope, $location, $filter, plugMessenger, $compile,storage, customerService, warehouseService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            /*search bar*/
            $scope.searchBar = {
                selectedAll: false,
                keywordType: "customerNumber",
                warehouseNumber: "",
                shipServiceId: 0
            }

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }

            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });

            warehouseService.getShippingChannelList(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.shippingChannelList = result;
                    $scope.searchBar.shipServiceId = $scope.searchBar.shippingChannelList[0].shipServiceId;
                } else {
                    $scope.searchBar.shippingChannelList = [{ shipServiceId: 0, shipServiceName: "全部" }].concat(result);
                }
            });

            var _filterOptions = function () {
                var _options = {
                };

                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                } 
                if (!!$scope.searchBar.shipServiceId) {
                    _options["shipServiceId"] = $scope.searchBar.shipServiceId;
                }

                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = _filterOptions();
                customerService.getRefundList(angular.copy(_options), function (result) {
                    if(!result || !result.data || result.data.length < 1) return;

                    $scope.dataList = result.data;

                    $.each($scope.dataList, function (i, item) {
                        item.rownumber = i + 1;
                        if(item.tariffMoney == null) item.tariffMoney = 0;
                        if(item.payment == null) item.payment = 0;

                        item.refundAmount = parseFloat((item.paied + item.usedPoint) - (item.actualShippingFee + item.insuranceFee + item.tip + item.tariffMoney + item.payment)).toFixed(2);
                        item._selected = $.grep($scope.selectedListCache, function (n) { return n.orderNumber == item.orderNumber }).length > 0;
                    });

                    $scope.searchBar.selectedAll = $.grep($scope.dataList, function (n) { return n._selected == true }).length == $scope.dataList.length;
                });
                var _orderNumbers = [];
                $.each($scope.selectedListCache, function (i, item) {
                    _orderNumbers.push(item.orderNumber);
                });
                if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
                
            }

            $scope.btnSearch = function () {

                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.getData();
            }

            $scope.selectedListCache = [];

            $scope.btnSelectedItem = function (item) {
                if (!!item) {
                    if (!item._selected) {
                        $scope.searchBar.selectedAll = false;
                    }
                } else {
                    $.each($scope.dataList, function (i, item) {
                        item._selected = $scope.searchBar.selectedAll;
                    });
                }
                //将当前页所有选中的item缓存到$scope.selectedListCache中（并去重）。
                $.each($scope.dataList, function (i, item) {
                    var isExists = $.grep($scope.selectedListCache, function (n) { return n.orderNumber == item.orderNumber }).length > 0;
                    if (!!item._selected && isExists == false) {
                        $scope.selectedListCache.push(angular.copy(item));
                    } else if (!item._selected && isExists == true) {
                        $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.orderNumber != item.orderNumber });
                    } 
                });
                var _orderNumbers = [];
                var _options = _filterOptions();
                $.each($scope.selectedListCache, function (i, item) {
                    _orderNumbers.push(item.orderNumber);
                });
                _options.orderNumber = _orderNumbers;
                if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
            }

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "orderdetail":
                        $location.search({ orderNumber: item.orderNumber });
                        $location.path("/order/orderdetail");
                        break;
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnSingleRefund = function(item){
                if(!item) return;

                plugMessenger.confirm("确定要退款吗?", function (isOK) {
                    if (!!isOK) {

                        var data = {
                            orderList:[
                                {
                                    orderNumber: item.orderNumber,
                                    customerNumber: item.customerNumber,
                                    actualShippingFee: item.actualShippingFee,
                                    orderStatus: item.orderStatus,
                                    shippingFee: item.shippingFee,
                                    totalCount: item.totalCount,
                                    refundAmount: item.refundAmount
                                }
                            ]
                        };

                        customerService.refundShippingFee(data, function (result) {
                            if (result.success == true) {
                                plugMessenger.info("退款成功");
                                $scope.getData();
                                $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.orderNumber != item.orderNumber });
                            } else {
                                // plugMessenger.info(result);
                            }
                        });
                    }
                });
            }

            $scope.btnBatchRefund = function(){
                if(!$scope.selectedListCache) return;

                plugMessenger.confirm("确定要退款吗?", function (isOK) {
                    if (!!isOK) {

                        var data = {
                            orderList:[]
                        };
                        $.each($scope.selectedListCache, function (i, item) {
                            data.orderList.push(
                                {
                                    orderNumber: item.orderNumber,
                                    customerNumber: item.customerNumber,
                                    actualShippingFee: item.actualShippingFee,
                                    orderStatus: item.orderStatus,
                                    shippingFee: item.shippingFee,
                                    totalCount: item.totalCount,
                                    refundAmount: item.refundAmount
                                }
                            );
                        });
 
                        customerService.refundShippingFee(data, function (result) {
                            if (result.success == true) {
                                plugMessenger.info("退款成功");
                                $scope.getData();
                                $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.orderNumber != item.orderNumber });
                            } else {
                                // plugMessenger.info(result);
                            }
                        });
                    }
                });
            }

            $scope.btnClearSelectedListCache = function () {
                $scope.selectedListCache = [];
                $scope.searchBar.selectedAll = false;
                $.each($scope.dataList, function (i, item) {
                    item._selected = false;
                });
                var _options = _filterOptions();
                //新导出逻辑
                $scope.exportOptions = $.extend({ token: _token }, _options);
            }

            $timeout(function () {
                $scope.getData();
            }, 500);

        }]);