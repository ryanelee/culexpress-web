'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:Receipt2Ctrl
 * @description
 * # Receipt2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderCommentsCtrl', ['$rootScope', '$scope', '$location', "$filter", '$window', 'warehouseService', 'orderService', 'receiptService', 'plugMessenger', 'storage',
        function ($rootScope, $scope, $location, $filter, $window, warehouseService, orderService, receiptService, plugMessenger, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                keywordType: "orderNumber",
                keywords: $location.search().orderNumber || "",
                questionStatus: "",
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

            $scope.questionStatusList = [
                { key: "", value: "全部" },
                { key: "Closed", value: "已处理" },
                { key: "Processing", value: "未处理" }
            ]
            /**
             * 收货仓库
             */
            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
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
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["receivedWarehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.questionStatus) {
                    _options["status"] = $scope.searchBar.questionStatus;
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

            $scope.getData = function () {
                var _options = _filterOptions();
                orderService.getOrderCommentsList(angular.copy(_options), function (result) {
                    $scope.dataList = result.data;
                    // console.log($scope.dataList)
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $scope.dataList.forEach(function(e) {
                        e._massage = e.messageLogs[e.messageLogs.length-1].message
                    });
                });
            }

            $scope.btnSearch = function () {

                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
            /**
             * 查看详情
             */
            $scope.btnOpenDetail = function (type, item) {
                switch (type) {
                    case "receiptDetail":
                        $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/receiptdetail2");
                        break;
                    case "ordercommentsdetail":
                        $location.search({ orderMessageNumber: item.messageNumber });
                        $location.path("/order/ordercommentsdetail");
                        break;
                }
            }

            $scope.btnAction = function (type, item) {
            switch (type) {
                case "exception":
                    $location.path('/warehouse/receiptexception');
                    break;
                case "inbound":
                    if (!!item) $location.search({ receiptNumber: item.receiptNumber, inboundStatus: item.inboundStatus });
                    $location.path('/warehouse/receiptedit2');
                    break;
                case "check":
                    if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                    $location.path('/warehouse/receiptcheck2');
                    break;
                case "delete":
                    plugMessenger.confirm("请确认是否删除该记录？", function (isOK) {
                        if (isOK) {
                            // receiptService.delete({
                            //     "receiptNumber": [item.receiptNumber]
                            // }, function (result) {
                            //     if (result.success == true) {
                            //         plugMessenger.success("删除成功");
                            //         $scope.getData();
                            //     }
                            // });
                        }
                    });
                    break;
                }
            }
        }
    ]);