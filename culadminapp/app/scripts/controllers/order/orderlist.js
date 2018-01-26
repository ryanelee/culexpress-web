'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderListCtrl
 * @description 
 * # OrderListCtrl 
 * Controller of the culAdminApp
 */ 
angular.module('culAdminApp')
    .controller('OrderListCtrl', ["$timeout", "$window", "$scope", "$rootScope", "$location", "$filter", "orderService", "warehouseService", "plugMessenger", "storage", "$compile",
        function ($timeout, $window, $scope, $rootScope, $location, $filter, orderService, warehouseService, plugMessenger, storage, $compile) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            // console.log(23,$window.sessionStorage.getItem("role"))

            $scope.dataList = [];
            $scope.orderNumberList = [];
            $scope.deleteMessage = "";
            //新导出逻辑
            var _token = sessionStorage.getItem("token");
            _token = !!_token ? encodeURIComponent(_token) : null
            console.log(_token);
            $("#form_export").attr("action", cul.apiPath + "/order/list/export?Token=" + _token);
            $("#form_exportUSPS").attr("action", cul.apiPath + "/order/list/export/usps?Token=" + _token);
            $("#form_exportHT").attr("action", cul.apiPath + "/order/list/export/ht?Token=" + _token);
            $scope.exportUrl = "";
            $scope.pagination = { 
                pageSize: "20",  
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                selectedAll: false,
                keywordType: "customerNumber",
                orderStatus: "",
                orderType:"",
                printStatus: "",
                warehouseNumber: "",
                shipServiceId: 0,
                isFastOrder: undefined,
                startDate: "",
                startTime_HH: "0",
                startTime_mm: "",
                startTime_ss: "",
                endDate: "",
                endTime_HH: "0",
                endTime_mm: "",
                endTime_ss: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

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
                if (!!$scope.searchBar.startDate) {
                    $scope.searchBar.startDate.setHours($scope.searchBar.startTime_HH !== "" ? $scope.searchBar.startTime_HH : 0);
                    $scope.searchBar.startDate.setMinutes($scope.searchBar.startTime_mm !== "" ? $scope.searchBar.startTime_mm : 0);
                    $scope.searchBar.startDate.setSeconds($scope.searchBar.startTime_ss !== "" ? $scope.searchBar.startTime_ss : 0);
                }
                if (!!$scope.searchBar.endDate) {
                    $scope.searchBar.endDate.setHours($scope.searchBar.endTime_HH !== "" ? $scope.searchBar.endTime_HH : 23);
                    $scope.searchBar.endDate.setMinutes($scope.searchBar.endTime_mm !== "" ? $scope.searchBar.endTime_mm : 59);
                    $scope.searchBar.endDate.setSeconds($scope.searchBar.endTime_ss !== "" ? $scope.searchBar.endTime_ss : 59);
                }
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                }
                if (!!$scope.searchBar.orderStatus) {
                    _options["orderStatus"] = $scope.searchBar.orderStatus;
                } else {
                    _options["exceptOrderStatus"] = ['Void'];
                }
                if (!!$scope.searchBar.printStatus) {
                    _options["printStatus"] = $scope.searchBar.printStatus;
                } 
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                } 
                if (!!$scope.searchBar.shipServiceId) {
                    _options["shipServiceId"] = $scope.searchBar.shipServiceId;
                }
                if (!!$scope.searchBar.orderType) {
                    _options["orderType"] = $scope.searchBar.orderType;
                }
                
                if ($scope.searchBar.isFastOrder == true) {
                    _options["isFastOrder"] = 1;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                    if ($scope.searchBar.keywordType == 'orderNumber') {
                        if ($scope.searchBar.keywords.indexOf('\n') >= 0) {
                            _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords.split('\n')
                        }

                    }
                    // if ($scope.searchBar.keywordType == 'outBoundTrackingNumber') {
                    //     if ($scope.searchBar.keywords.indexOf('\n') >= 0) {
                    //         _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords.split('\n')
                    //     }

                    // }
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = _filterOptions();
                console.log("_options",_options)
                orderService.getList(angular.copy(_options), function (result) {
                    $scope.dataList = result.data;
                    // console.log($scope.dataList)
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit('changeMenu');

                    $.each($scope.dataList, function (i, item) {
                        item._selected = $.grep($scope.selectedListCache, function (n) { return n.orderNumber == item.orderNumber }).length > 0;
                    });
                    $scope.searchBar.selectedAll = $.grep($scope.dataList, function (n) { return n._selected == true }).length == $scope.dataList.length;
                });
                var _orderNumbers = [];
                $.each($scope.selectedListCache, function (i, item) {
                    _orderNumbers.push(item.orderNumber);
                });
                if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
                //新导出逻辑
                $scope.exportOptions = $.extend({ token: _token }, _options);
                
            }

            $scope.btnSearch = function () {

                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
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
                //新导出逻辑
                $scope.exportOptions = $.extend({ token: _token }, _options);
            }

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "orderdetail":
                        $location.search({ orderNumber: item.orderNumber });
                        $location.path("/order/orderdetail");
                        break;
                    case "customerdetail":
                        $location.search({ customerNumber: item.customer.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.delSomeOrder = function () {
                //每次执行批量删除时，将之前的选中记录清理掉。
                $scope.orderNumberList = [];
                $scope.dataList.forEach(function (e) {
                    if (e._selected == true) {
                        $scope.orderNumberList.push(e.orderNumber)
                    }
                })
                if (!$scope.orderNumberList[0]) {
                    plugMessenger.info("请选择需要删除的订单");
                    return;
                } else {
                    // plugMessenger.template($compile($("#confirm-modal").html())($scope));
                    $scope.btnDelete($scope.orderNumberList)
                } 
            }

            $scope.btnDeleteApproval = function (item, event) {
                $scope.item = item;
                plugMessenger.template($compile($("#confirm-modal").html())($scope));
            }

            $scope.btnDelete = function (item, event) {
                $scope.searchOrder = {};
                if (item instanceof Array) {
                    $scope.searchOrder.orderNumberList = item;
                } else {
                    item.deleteMessage = $scope.deleteMessage;
                    $scope.searchOrder.orderNumber = item.orderNumber;
                    if (!$scope.deleteMessage) {
                        return plugMessenger.info("删除原因不能为空");
                    }
                }
                $scope.searchOrder.deleteMessage = $scope.deleteMessage;
                // plugMessenger.confirm("确定要删除订单吗？(删除后不可恢复)", function (isOK) {
                    // if (!!isOK) {
                        $(event.currentTarget).parents("#confirm-modal").modal("hide");
                        orderService.delete($scope.searchOrder, function (result) {
                            if (result.success == true) {
                                plugMessenger.info("删除成功");
                                // $("#confirm-modal").modal("hide");
                                // $(event.currentTarget).parents("#confirm-modal").modal("hide");
                                item.deleteMessage = "";
                                $scope.deleteMessage = "";
                                $scope.getData();
                                $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.orderNumber != item.orderNumber });
                            } else {
                                // plugMessenger.info(result);
                            }
                        });
                    // }
                // });
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

            $scope.btnCancel = function (event) {
                // $("#confirm-modal").modal("hide");
                $(event.currentTarget).parents("#confirm-modal").modal("hide");
            }

        }]);