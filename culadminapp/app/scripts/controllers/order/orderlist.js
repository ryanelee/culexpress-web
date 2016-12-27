'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderListCtrl
 * @description
 * # OrderListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderListCtrl', ["$window", "$scope", "$rootScope", "$location", "$filter", "orderService", "warehouseService", "plugMessenger", function($window, $scope, $rootScope, $location, $filter, orderService, warehouseService, plugMessenger) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.dataList = [];
        $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;
        //新导出逻辑
        var _token = sessionStorage.getItem("token");
        _token = !!_token ? encodeURIComponent(_token) : null
        $("#form_export").attr("action", cul.apiPath + "/order/list/export?Token=" + _token);
        $("#form_exportUSPS").attr("action", cul.apiPath + "/order/list/export/usps?Token=" + _token);
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

        warehouseService.getWarehouse(function(result) {
            if (result.length == 1) {
                $scope.searchBar.warehouseList = result;
                $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
            } else {
                $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
            }
        });

        warehouseService.getShippingChannelList(function(result) {
            if (result.length == 1) {
                $scope.searchBar.shippingChannelList = result;
                $scope.searchBar.shipServiceId = $scope.searchBar.shippingChannelList[0].shipServiceId;
            } else {
                $scope.searchBar.shippingChannelList = [{ shipServiceId: 0, shipServiceName: "全部" }].concat(result);
            }
        });

        var _filterOptions = function() {
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
            if ($scope.searchBar.isFastOrder == true) {
                _options["isFastOrder"] = 1;
            }
            if (!!$scope.searchBar.keywords) {
                if ($scope.searchBar.keywordType == "customerNumber" &&
                    parseInt($scope.customer_ids) !== 0 &&
                    !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                    $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                }

                _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
            }
            return angular.copy(_options);
        }

        $scope.getData = function() {
            var _options = _filterOptions();
            orderService.getList(angular.copy(_options), function(result) {
                var _data = result.data;
                // console.log(_data);
                if (parseInt($scope.customer_ids) !== 0) {
                    _data = _data.filter(function(x) {
                        return $scope.customer_ids.split(",").includes(x.customerNumber)
                    });
                }

                $scope.dataList = _data;

                $scope.pagination.totalCount = result.pageInfo.totalCount;
                $rootScope.$emit("changeMenu");

                $.each($scope.dataList, function(i, item) {
                    item._selected = $.grep($scope.selectedListCache, function(n) { return n.orderNumber == item.orderNumber }).length > 0;
                });
                $scope.searchBar.selectedAll = $.grep($scope.dataList, function(n) { return n._selected == true }).length == $scope.dataList.length;
            });
            var _orderNumbers = [];
            $.each($scope.selectedListCache, function(i, item) {
                _orderNumbers.push(item.orderNumber);
            });
            if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
            //新导出逻辑
            $scope.exportOptions = $.extend({ token: _token }, _options);
        }

        $scope.btnSearch = function() {

            $scope.selectedListCache = [];
            $scope.dataList = [];
            $scope.pagination.pageIndex = 1;
            $scope.pagination.totalCount = 0;
            $scope.getData();
        }

        $scope.selectedListCache = [];

        $scope.btnSelectedItem = function(item) {
            if (!!item) {
                if (!item._selected) {
                    $scope.searchBar.selectedAll = false;
                }
            } else {
                $.each($scope.dataList, function(i, item) {
                    item._selected = $scope.searchBar.selectedAll;
                });
            }
            //将当前页所有选中的item缓存到$scope.selectedListCache中（并去重）。
            $.each($scope.dataList, function(i, item) {
                var isExists = $.grep($scope.selectedListCache, function(n) { return n.orderNumber == item.orderNumber }).length > 0;
                if (!!item._selected && isExists == false) {
                    $scope.selectedListCache.push(angular.copy(item));
                } else if (!item._selected && isExists == true) {
                    $scope.selectedListCache = $.grep($scope.selectedListCache, function(n) { return n.orderNumber != item.orderNumber });
                }
            });
            var _orderNumbers = [];
            var _options = _filterOptions();
            $.each($scope.selectedListCache, function(i, item) {
                _orderNumbers.push(item.orderNumber);
            });
            _options.orderNumber = _orderNumbers;
            if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
            //新导出逻辑
            $scope.exportOptions = $.extend({ token: _token }, _options);
        }

        $scope.btnOpenDetail = function(item, type) {
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

        $scope.btnDelete = function(item) {
            plugMessenger.confirm("确定要删除订单吗？(删除后不可恢复)", function(isOK) {
                if (!!isOK) {
                    orderService.delete(item.orderNumber, function() {
                        $scope.getData();
                        $scope.selectedListCache = $.grep($scope.selectedListCache, function(n) { return n.orderNumber != item.orderNumber });
                    });
                }
            });
        }

        $scope.btnClearSelectedListCache = function() {
            $scope.selectedListCache = [];
            $scope.searchBar.selectedAll = false;
            $.each($scope.dataList, function(i, item) {
                item._selected = false;
            });
            var _options = _filterOptions();
            //新导出逻辑
            $scope.exportOptions = $.extend({ token: _token }, _options);
        }

        $scope.getData();
    }]);