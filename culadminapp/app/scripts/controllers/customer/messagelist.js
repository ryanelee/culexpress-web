'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MessageListCtrl
 * @description
 * # MessageListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('MessageListCtrl', ["$scope", "$rootScope", "$location", "faqService", "warehouseService", "plugMessenger", "$route",
        function($scope, $rootScope, $location, faqService, warehouseService, plugMessenger, $route) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            //clear location search
            $location.search({ customerNumber: null, messageNumber: null });

            $scope.dataList = [];
            $scope.pagination = {
                    pageSize: "20",
                    pageIndex: 1,
                    totalCount: 0
                }
                /*search bar*/
            $scope.searchBar = {
                keywordType: "customerNumber",
                messageType: "",
                status: "",
                receivedWarehouseNumber: " ",
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
                if (!!$scope.searchBar.messageType) {
                    _options["messageType"] = $scope.searchBar.messageType;
                }
                if (!!$scope.searchBar.status) {
                    _options["status"] = $scope.searchBar.status;
                }
                if (!!$scope.searchBar.receivedWarehouseNumber) {
                    _options["receivedWarehouseNumber"] = $scope.searchBar.receivedWarehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function() {
                var _options = _filterOptions();
                //console.log(_options);
                faqService.getList(angular.copy(_options), function(result) {
                    $scope.dataList = result.data;
                    //console.log(result.data)
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");

                    $.each($scope.dataList, function(i, item) {
                        var _messageType = $.grep($scope.searchBar.messageTypeData, function(n) { return n.typeID == item.messageType });
                        if (_messageType.length > 0) item._messageType = _messageType[0].typeName;
                        switch (item.status) {
                            case "0":
                            case "Closed":
                                item._status = "已关闭";
                                break;
                            case "1":
                            case "Processing":
                                item._status = "待处理";
                                break;
                            case "ForwardWH":
                                item._status = "转交仓库";
                                break;
                        }
                        var _receivedWarehouse = $.grep($scope.searchBar.warehouseList, function(n) { return n.warehouseNumber == item.receivedWarehouseNumber });
                        if (_receivedWarehouse.length > 0) item._receivedWarehouseName = _receivedWarehouse[0].warehouseName;
                    });
                });
            }

            $scope.btnSearch = function() {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnOpenDetail = function(item, type) {
                switch (type) {
                    case "faqdetail":
                        $location.search({ messageNumber: item.messageNumber });
                        $location.path("/customer/faqdetail");
                        break;
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnCloseFAQ = function(item) {
                if (item.status == 0) {
                    return;
                }
                var _update = function() {
                    faqService.update({
                        "messageNumber": item.messageNumber,
                        "messageType": item.messageType,
                        "status": "Closed"
                    }, function(result) {
                        if (result.success == true) {
                            //关闭问题时同时刷新top-bar上的留言条数
                            $rootScope.getmessageList();
                            $route.reload();
                            plugMessenger.success("处理成功");
                        }
                    })
                }
                plugMessenger.confirm("确认关闭该问题?", function(isOk) {
                    if (isOk) _update();
                })
            }

            faqService.getMessageType(7, function(result) {
                //console.log(result);
                $scope.searchBar.messageTypeData = [{ "typeID": "", "typeName": "全部" }].concat(result);
            });

            warehouseService.getWarehouse(function(result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.receivedWarehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    //console.log(result)
                    //   result = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                    $scope.searchBar.warehouseList = result
                    $scope.searchBar.warehouseList = [{ warehouseNumber: " ", warehouseName: "全部" }].concat(result);
                    //   console.log($scope.searchBar.warehouseList[0].warehouseNumber);

                    //   $scope.searchBar.receivedWarehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                }
            });

            var _reloadData = setInterval(function() {
                $scope.$apply(function() {
                    if (!!$scope.searchBar.messageTypeData && !!$scope.searchBar.warehouseList) {
                        $scope.getData();
                        clearInterval(_reloadData);
                    }
                });
            }, 500);

            //   $scope.reloadRoute = function () {
            //       $window.location.reload();
            //       console.log("重新加载");
            //   };

        }
    ]);