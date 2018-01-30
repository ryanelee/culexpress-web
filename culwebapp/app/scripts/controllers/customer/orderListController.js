'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderListCtrl
 * @description 
 * # OrderListCtrl 
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('OrderListCtrl', ["$timeout", "$window", "$scope", "$rootScope", "$location", "$filter", "OrderSvr", "orderService", "warehouseService", "$compile","$state",
        function ($timeout, $window, $scope, $rootScope, $location, $filter, orderSvr, orderService, warehouseService, $compile, $state) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.orderNumberList = [];
            $scope.deleteMessage = "";
            //新导出逻辑
            var _token = sessionStorage.getItem("cul-token");
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
                orderType: "",
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
                }
                return angular.copy(_options);
            }

            var _getPrintStatus = function (printStatus) {
                var printTitle = '';
                switch (printStatus) {
                    case 'Printed':
                        printTitle = '已打印';
                        break;
                    case 'UnPrinted':
                        printTitle = '未打印';
                        break;
                }
                return printTitle;
            }

            $scope.pagedOptions = {
                total: 0,
                size: 10
            }
            $scope.pageSize = 10;

            $scope.searchKeyItems = [{
                key: 'orderNumber',
                text: '订单编号'
            }, {
                key: 'referenceOrderNumber',
                text: '客户关联号'
            }, {
                key: 'outBoundTrackingNumber',
                text: 'cul包裹编号'
            }
            ];
            var queryPara = $scope.queryPara = {
                searchKeyName: 'orderNumber',
                orderStatus: ''
            };

            // yyyy-mm-dd
            var _getDate = function (dateStr) {
                var year = dateStr.substr(0, 4);
                var month = dateStr.substr(5, 2) - 1;
                var day = dateStr.substr(8, 2);
                return new Date(year, month, day);
            };

            $scope.redirectToDetail = function (orderItem) {
                $state.go('customer.orderdetail', { id: orderItem.orderNumber });
            }
            
            $scope.queryOrder = function (index, paras) {
                var pageSize = $scope.pageSize;
                $scope.pagedOptions.index = index;
                $scope.pagedOptions.size = pageSize;

                var dateFrom = !!$scope.queryPara.startDate ? _getDate($scope.queryPara.startDate).toISOString() : "";
                var dateTo = !!$scope.queryPara.endDate ? _getDate($scope.queryPara.endDate).toISOString() : "";

                orderSvr
                    .getOrderList(index, angular.extend({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        orderStatus: $scope.queryPara.orderStatus,
                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        orderType: 0
                    }, paras || {}), pageSize)
                    .then(function (result) {
                        if (result.data) {
                            $scope.exportOptions = $.extend({ token: _token }, {
                                customerNumber: $scope.$root.currentUser.customerNumber,
                                orderStatus: $scope.queryPara.orderStatus,
                                dateFrom: dateFrom,
                                dateTo: dateTo
                            }, paras || {}
                            );

                            $.each(result.data.data, function (index, item) {
                                item._printStatus = _getPrintStatus(item.printStatus);
                                item._shipToAddresses = [];
                                $.each(item.shipToAddresses, function (i, address) {
                                    var _str = address.receivePersonName;
                                    if (!!address.cellphoneNumber) _str += '(' + address.cellphoneNumber + ')';
                                    if (item.shipServiceId != 9 && address.item != 10) {
                                        _str += address.address1;
                                    } else {
                                        _str = _str + address.addressPinyin + address.address1_before;
                                    }
                                    if (!!address.receiveCompanyName) _str += address.receiveCompanyName;
                                    if (!!address.zipcode) _str += '(' + address.zipcode + ')';
                                    if ($.grep(item._shipToAddresses, function (n) { return n == _str }).length == 0) {
                                        item._shipToAddresses.push(_str);
                                    }
                                });
                                // CUL包裹单号list
                                item._outboundTrackingNumbers = [];
                                if (item.outboundPackages) {
                                    $.each(item.outboundPackages, function (i, outboundPackage) {
                                        item._outboundTrackingNumbers.push(outboundPackage.trackingNumber);
                                    });
                                }
                                // 入库单号list
                                item._inboundTrackingNumbers = [];

                                if (item.inboundPackages && item.inboundPackages.length > 0) {
                                    $.each(item.inboundPackages, function (i, inboundPackage) {
                                        item._inboundTrackingNumbers.push(inboundPackage.trackingNumber);
                                    });
                                }
                            });
                            $scope.dataList = result.data.data;
                            $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                        }
                    });
            }
            $scope.queryOrder();


            $scope.rangSearch = function (rangeItem) {
                $scope.queryPara = {
                    searchKeyName: 'orderNumber',
                    orderStatus: 'Unpaid'
                };

                $scope.queryOrder(1, angular.extend($scope.queryPara, {
                    dateFrom: rangeItem.begin,
                    dateTo: rangeItem.end
                }));
            }
            $scope.searchOrder = function () {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.queryOrder(1, $scope.queryPara);
            }


            $scope.onPaged = function (pageIndex) {
                $scope.queryOrder(pageIndex);
            }

            $scope.changeQueryStaus = function (status) {
                $scope.queryPara.orderStatus = status || '';
                $scope.queryOrder(1, $scope.queryPara);
            }


            // $scope.btnSearch = function () {

            //     $scope.selectedListCache = [];
            //     $scope.dataList = [];
            //     $scope.pagination.pageIndex = 1;
            //     $scope.pagination.totalCount = 0;
            //     $scope.getData();
            // }

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

            /** 批量删除 */
            $scope.delSomeOrder = function () {
                var isDel = true;
                //每次执行批量删除时，将之前的选中记录清理掉。
                $scope.orderNumberList = [];
                $scope.dataList.forEach(function (e) {
                    if (e._selected == true) {
                        if (e.orderStatus != 'Unpaid') {
                            isDel = false;
                        }
                        $scope.orderNumberList.push(e.orderNumber)
                    }
                })
                setTimeout(function() {
                    if (!$scope.orderNumberList[0]) {
                        alertify.alert('提示', '请选择需要删除的订单', 'warning');
                        return;
                    } else if (isDel == false){
                        alertify.alert('提示', '只能删除未支付状态的订单！', 'warning');
                        return;
                    } else {
                        $scope.btnDelete($scope.orderNumberList);
                    }
                }, 200);
            }

            $scope.btnDeleteApproval = function (item, event) {
                $scope.item = item;
                $('#del-modal').modal('show');
            }

            $scope.btnDelete = function (item, event) {
                $scope.searchOrder = {};
                if (item instanceof Array) {
                    $scope.searchOrder.orderNumberList = item;
                } else {
                    item.deleteMessage = $scope.deleteMessage;
                    $scope.searchOrder.orderNumber = item.orderNumber;
                    if (!$scope.deleteMessage) {
                        return alertify.alert('提示', '删除原因不能为空', 'warning');
                    }
                }
                $scope.searchOrder.deleteMessage = $scope.deleteMessage;
                $('#del-modal').modal('hide');
                alertify.confirm("确定删除订单吗？(删除后不可恢复)", 
                function () {
                    orderService.delete($scope.searchOrder, function (result) {
                        if (result.success == true) {
                            alertify.success('删除成功!');
                            item.deleteMessage = "";
                            $scope.deleteMessage = "";
                            $scope.queryOrder();
                            $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.orderNumber != item.orderNumber });
                        } else {
                        }
                    });
                },
                function () {});
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

        }]);