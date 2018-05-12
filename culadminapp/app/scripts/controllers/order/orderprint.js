'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderPrintCtrl
 * @description
 * # OrderPrintCtrl 
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderPrintCtrl', ["$timeout", "$window", "$scope", "$rootScope", "orderService", "warehouseService", "$location", "plugMessenger", "customerMessageService",
        function($timeout, $window, $scope, $rootScope, orderService, warehouseService, $location, plugMessenger, customerMessageService) {
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
                orderType:"",
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
            }

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
                if ($scope.searchBar.orderType) {
                    _options["orderType"] =$scope.searchBar.orderType;
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

            $scope.getData = function() {
                orderService.getList(_filterOptions(), function(result) {
                    $scope.dataList = result.data;
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit('changeMenu');

                    $.each($scope.dataList, function(i, item) {
                        item._selected = $.grep($scope.selectedListCache, function(n) { return n.orderNumber == item.orderNumber }).length > 0;
                    });
                    $scope.searchBar.selectedAll = $.grep($scope.dataList, function(n) { return n._selected == true }).length == $scope.dataList.length;

                });
            }

            $timeout(function() {
                $scope.getData();
            }, 500);

            $scope.btnSearch = function() {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
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

            $scope.btnPrint = function(item, type) {            
                var _print = function() {
                    switch (type) {
                        case "order":
                            // plugMessenger.confirm("订单将变为已打印状态,请确认是否打印？", function(isOK) {
                            //     var orderNumbers = [];
                            //     orderNumbers.push(item.orderNumber)
                            //     if (isOK) {
                            $scope.$broadcast("print-order.action", item.orderNumber);
                            // }
                            // }); 
                            break;
                        case "package":
                            $scope.$broadcast("print-package.action", item.orderNumber);
                            break;
                        case "flyingexpress":
                            $scope.$broadcast("print-flying-express.action", item.orderNumber);
                            break;
                        case "flyingexpress_new":
                            $scope.$broadcast("print-flying-express-new.action", item.orderNumber);
                            break;
                        case "flyingexpress_blank":
                            $scope.$broadcast("print-flying-express-blank.action", item.orderNumber);
                            break;
                        case "flyingexpress2":
                            $scope.$broadcast("print-flying-express2.action", item.orderNumber);
                            break;
                        case "trackingNumber":
                            //  _printTrackingNumbers(item);
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
                        case "flyingexpress_new":
                        case "flyingexpress_blank":
                        console.log("item",item);
                            if(item.orderType == 1 && (!item.payDate || item.orderStatus.toUpperCase() === "UNPAID" || item.orderStatus.toUpperCase() === "VOID" )){
                                plugMessenger.info("未支付或者已删除的线上订单不能打印.")
                                break;
                            }
                            plugMessenger.confirm("订单将变为已打印状态,请确认是否打印？", function(isOK) {
                                if (isOK) {
                                    orderService.printOrder(item.orderNumber, function(result) {
                                        if (item.orderStatus === "WaybillUpdated"){
                                            var order = {
                                                orderNumber:item.orderNumber,
                                                orderStatus:"WaybillUpdated",
                                            }
                                        } else {
                                            var order = {
                                                orderNumber:item.orderNumber,
                                                orderStatus:"Processing",
                                            }
                                        }   
                                        orderService.update(order, function(result) {
                                            _print();
                                        });
                                    });
                                }
                            });
                            break;
                        default:
                            _print();
                            break;
                    }
                }
            }
            $scope.btnPrintBatch = function(type) {
                var orderNumbers = [];
                var selectedList = angular.copy($scope.selectedListCache);
                $.each($scope.selectedListCache, function(index, item) {
                    orderNumbers.push(item.orderNumber);
                });
                var _print = function() {
                    if (orderNumbers.length > 0) {
                        switch (type) {
                            case "order":
                                $scope.$broadcast("print-order.action", orderNumbers);
                                break;
                            case "package":
                                $scope.$broadcast("print-package.action", orderNumbers);
                                break;
                            case "flyingexpress":
                                $scope.$broadcast("print-flying-express.action", orderNumbers);
                                break;
                            case "flyingexpress_new":
                                $scope.$broadcast("print-flying-express-new.action", orderNumbers);
                                break;
                            case "flyingexpress_blank":
                                $scope.$broadcast("print-flying-express-blank.action", orderNumbers);
                                break;
                            case "flyingexpress2":
                                $scope.$broadcast("print-flying-express2.action", orderNumbers);
                                break;
                            case "trackingNumber":
                                // _printTrackingNumbers(selectedList);
                                $scope.$broadcast("print-tracking-number.action", selectedList);
                                break;
                        }
                    }
                }
                var _checkConfirm = function() {
                    switch (type) {
                        case "order":
                        case "flyingexpress":
                        case "flyingexpress2":
                            var declinePrint = false;
                            $.each(selectedList, function(i, _item) {
                                console.log(_item);
                                if(_item.orderType == 1 && (!_item.payDate || _item.orderStatus.toUpperCase() === "UNPAID" || _item.orderStatus.toUpperCase() === "VOID" )){
                                    plugMessenger.info("未支付或者已删除的线上订单[" + _item.orderNumber + "]不能打印.")
                                    declinePrint = true;
                                    return;
                                }
                            });

                            if(declinePrint) break;
                            
                            plugMessenger.confirm("订单将变为已打印状态,请确认是否打印？", function(isOK) {
                                if (isOK) {
                                    var orderArray = [];
                                    var orderList = [];
                                    $.each(selectedList, function(i, _item) {
                                        orderArray.push(_item.orderNumber);
                                        orderList.push({orderNumber:_item.orderNumber,orderStatus:"Processing"})
                                        
                                    });
                                    console.log(orderArray);
                                    orderService.printOrder(orderArray, function(result) {
                                        orderService.batchUpdate(orderList, function(result) {
                                            _print();
                                        });
                                    });
                                }
                            });
                            break;
                        default:
                            _print();
                            break;
                    }
                }
                if ($scope.selectedListCache.length == 0) {
                    var _options = $.extend(true, _filterOptions(), {
                        "pageInfo": {
                            "pageSize": 99999,
                            "pageIndex": 1,
                        },
                        //"printStatus": ""
                    })
                    orderService.getList(_options, function(result) {
                        $.each(result.data, function(i, item) {
                            orderNumbers.push(item.orderNumber);
                            selectedList.push(item);
                        });
                        _checkConfirm();
                    });
                } else {
                    _checkConfirm();
                }
            }

            var _printTrackingNumbers = function(data) {
                if (!data) return;
                if (!angular.isArray(data)) data = [data];
                var trackingNumbers = [];
                $.each(data, function(i, item) {
                    $.each(item.outboundPackages, function(i, pkg) {
                        trackingNumbers.push(pkg.trackingNumber);
                    });
                });
                var _$el = $("<div></div>").append("<div trackingNumber=\"" + trackingNumbers.join("\"></div><div trackingNumber=\"") + "\"></div>");
                $.each(_$el.find("[trackingNumber]"), function(i, _el) {
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

            $scope.btnClearSelectedListCache = function() {
                $scope.selectedListCache = [];
                $scope.searchBar.selectedAll = false;
                $.each($scope.dataList, function(i, item) {
                    item._selected = false;
                });
            }

            //打印空白翔通单据
            $scope.btnPrintEmptyFlyingExpress = function() {
                $scope.$broadcast("print-flying-express-empty", "show");
            }
        }
    ]);