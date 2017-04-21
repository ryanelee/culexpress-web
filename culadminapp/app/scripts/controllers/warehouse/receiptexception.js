'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptExceptionCtrl
 * @description
 * # ReceiptExceptionCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ReceiptExceptionCtrl', ['$rootScope', '$scope', '$location', "$filter", '$window', 'warehouseService', 'shelfService', 'receiptService', 'plugMessenger',
        function ($rootScope, $scope, $location, $filter, $window, warehouseService, shelfService, receiptService, plugMessenger) {
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
                keywordType: "receiptNumber",
                warehouseNumber: "",
                sendType: "",
                status: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? new Date($scope.searchBar.startDate) : "",
                    "dateTo": !!$scope.searchBar.endDate ? new Date($scope.searchBar.endDate) : ""
                }
                if (!!$scope.searchBar.sendType) {
                    _options["sendType"] = $scope.searchBar.sendType;
                }
                if (!!$scope.searchBar.status) {
                    _options["status"] = $scope.searchBar.status;
                }
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    if ($scope.searchBar.keywordType == "customerNumber"
                        && $scope.customer_ids != undefined
                        && parseInt($scope.customer_ids) !== 0
                        && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                        $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                    }

                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }

                console.log(_options);
                return angular.copy(_options);
            }

            $scope.getData = function () {
                receiptService.getExceptionList(_filterOptions(), function (result) {
                    var _data = result.data;
                    if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                        _data = _data.filter(function (x) {
                            return $scope.customer_ids.split(",").includes(x.customerNumber);
                        });
                    }

                    $scope.dataList = _data;
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnPrev = function () {
                $window.history.back();
            }

            $scope.btnOpenDetail = function (type, item) {
                switch (type) {
                    case "receiptDetail":
                        $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/receiptdetail2");
                        break;
                    case "customerDetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                    case "exceptionDetail":
                        $location.search({ exceptionNumber: item.exceptionNumber });
                        $location.path("/warehouse/receiptexceptiondetail");
                        break;
                }
            }

            $scope.btnAction = function (type, item) {
                switch (type) {
                    case "exceptionRegister":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                        $location.path('/warehouse/receiptexceptionedit');
                        break;
                    case "staff":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber, staff: "staff" });
                        $location.path('/warehouse/receiptstaff');
                        break;
                    case "close":
                        plugMessenger.confirm("请确认是否关闭异常？", function (isOK) {
                            if (isOK) {
                                receiptService.exceptionEdit({
                                    customerNumber: item.customerNumber,
                                    warehouseNumber: item.warehouseNumber,
                                    exceptionNumber: item.exceptionNumber,
                                    status: 2
                                }, function (result) {
                                    if (result.success) {
                                        plugMessenger.success("关闭成功");
                                        $scope.getData();
                                    }
                                });
                            }
                        });
                        break;
                    case "delete":
                        plugMessenger.confirm("请确认是否删除该记录？", function (isOK) {
                            if (isOK) {
                                receiptService.exceptionEdit({
                                    customerNumber: item.customerNumber,
                                    warehouseNumber: item.warehouseNumber,
                                    exceptionNumber: item.exceptionNumber,
                                    status: -1
                                }, function (result) {
                                    if (result.success) {
                                        plugMessenger.success("删除成功");
                                        $scope.getData();
                                    }
                                });
                            }
                        });
                        break;
                }
            }
            // $scope.getData();
        }]);
