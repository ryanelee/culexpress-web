'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderPrintCtrl
 * @description
 * # OrderPrintCtrl 
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('OrderPrintCtrl', ["$timeout", "$window", "$scope", "$rootScope", "OrderSvr", "orderService", "warehouseService", "$location","$state",
        function ($timeout, $window, $scope, $rootScope, orderSvr, orderService, warehouseService, $location, $state) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];

            /*search bar*/
            $scope.searchBar = {
                type: "single",
                channel: "0",
                batchChannel: "0",
                selectedAll: false,

                keywordType: "customerNumber",
                orderStatus: "",
                printStatus: "",
                orderType: "",
                // printStatus: "UnPrinted",
                warehouseNumber: "",
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

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }

            $scope.channelFilter = [
                { title: "小包裹身份证渠道", value: "0" },
                { title: "小包裹CA", value: "" },
                { title: "大包裹新", value: "" },
                { title: "USPS渠道", value: "" }
            ];

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
                if ($scope.searchBar.isFastOrder == true) {
                    _options["isFastOrder"] = 1;
                }
                if ($scope.searchBar.orderType) {
                    _options["orderType"] = $scope.searchBar.orderType;
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
                text: '出库包裹编号'
            }
            ];
            var queryPara = $scope.queryPara = {
                searchKeyName: 'orderNumber',
                dateRange: 'last6Months',
                orderStatus: '',

            };

            $scope.redirectToDetail = function (orderItem) {
                $state.go('customer.orderdetail', { id: orderItem.orderNumber });
            }

            $scope.queryOrder = function (index, paras) {
                var pageSize = $scope.pageSize;
                $scope.pagedOptions.index = index;
                $scope.pagedOptions.size = pageSize;
                orderSvr
                    .getOrderList(index, angular.extend({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        orderStatus: $scope.queryPara.orderStatus,
                        orderType: 0
                    }, paras || {}
                    ), pageSize)
                    .then(function (result) {
                        if (result.data) {
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


                            // $.each($scope.dataList, function (i, item) {
                            //     item._selected = $.grep($scope.selectedListCache, function (n) { return n.orderNumber == item.orderNumber }).length > 0;
                            // });
                            // $scope.searchBar.selectedAll = $.grep($scope.dataList, function (n) { return n._selected == true }).length == $scope.dataList.length;
                        }
                    });
                // var _orderNumbers = [];
                // $.each($scope.selectedListCache, function (i, item) {
                //     _orderNumbers.push(item.orderNumber);
                // });
                // if (_orderNumbers.length > 0) _options.orderNumber = _orderNumbers.join(",");
                // //新导出逻辑
                // $scope.exportOptions = $.extend({ token: _token }, _options);
            }
            $scope.queryOrder();

            $scope.rangSearch = function (rangeItem) {
                $scope.queryPara = {
                    searchKeyName: 'orderNumber',
                    dateRange: 'last6Months',
                    orderStatus: '',
                };

                $scope.queryOrder(1, angular.extend($scope.queryPara, {
                    dateFrom: rangeItem.begin,
                    dateTo: rangeItem.end
                }));
            }
            $scope.searchOrder = function () {
                $scope.queryOrder(1, $scope.queryPara);
            }


            $scope.onPaged = function (pageIndex) {
                $scope.queryOrder(pageIndex);
            }

            $scope.changeQueryStaus = function (status) {
                $scope.queryPara.orderStatus = status || '';
                $scope.queryOrder(1, $scope.queryPara);
            }

            $scope.btnSearch = function () {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
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

            $scope.btnPrint = function (item, type) {
                var _print = function () {
                    switch (type) {
                        case "order":
                            $scope.$broadcast("print-order.action", item.orderNumber);
                            break;
                        case "package":
                            $scope.$broadcast("print-package.action", item.orderNumber);
                            break;
                        case "flyingexpress":
                            $scope.$broadcast("print-flying-express.action", item.orderNumber);
                            break;
                        case "flyingexpress2":
                            $scope.$broadcast("print-flying-express2.action", item.orderNumber);
                            break;
                        case "trackingNumber":
                            $scope.$broadcast("print-tracking-number.action", item);
                            break;
                    }
                }
                if (item.printStatus == "Printed") {
                    _print();
                } else {
                    switch (type) {
                        case "order":
                        case "flyingexpress":
                        case "flyingexpress2":
                            _print();
                            break;
                        default:
                            _print();
                            break;
                    }
                }
            }

            /** 批量打印 */
            $scope.btnPrintBatch = function (type) {
                var orderNumbers = [];
                var selectedList = angular.copy($scope.selectedListCache);
                $.each($scope.selectedListCache, function (index, item) {
                    orderNumbers.push(item.orderNumber);
                });
                var _print = function () {
                    if (orderNumbers.length > 0) {
                        switch (type) {
                            case "order":
                                $scope.$broadcast("print-order.action", orderNumbers);
                                break;
                            case "trackingNumber":
                                $scope.$broadcast("print-tracking-number.action", selectedList);
                                break;
                        }
                    }
                }
                
                if ($scope.selectedListCache.length == 0) {
                    var _options = $.extend(true, _filterOptions(), {
                        "pageInfo": {
                            "pageSize": 99999,
                            "pageIndex": 1,
                        },
                    })
                    orderService.getList(_options, function (result) {
                        $.each(result.data, function (i, item) {
                            orderNumbers.push(item.orderNumber);
                            selectedList.push(item);
                        });
                        _print();
                    });
                } else {
                    _print();
                }
            }

            var _printTrackingNumbers = function (data) {
                if (!data) return;
                if (!angular.isArray(data)) data = [data];
                var trackingNumbers = [];
                $.each(data, function (i, item) {
                    $.each(item.outboundPackages, function (i, pkg) {
                        trackingNumbers.push(pkg.trackingNumber);
                    });
                });
                var _$el = $("<div></div>").append("<div trackingNumber=\"" + trackingNumbers.join("\"></div><div trackingNumber=\"") + "\"></div>");
                $.each(_$el.find("[trackingNumber]"), function (i, _el) {
                    $(_el).barcode($(_el).attr("trackingNumber"), "code128", {
                        addQuietZone: "1",
                        barHeight: "50",
                        barWidth: "1",
                        bgColor: "#FFFFFF",
                        color: "#000000",
                        moduleSize: "5",
                        output: "css",
                        posX: "10",
                        posY: "20"
                    });
                });
                _$el.jqprint();
            }

            $scope.btnClearSelectedListCache = function () {
                $scope.selectedListCache = [];
                $scope.searchBar.selectedAll = false;
                $.each($scope.dataList, function (i, item) {
                    item._selected = false;
                });
            }

            //打印空白翔通单据
            $scope.btnPrintEmptyFlyingExpress = function () {
                $scope.$broadcast("print-flying-express-empty", "show");
            }
        }
    ]);