'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfCtrl
 * @description
 * # WarehouseOnShelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfCtrl', ['$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService',
        function($window, $rootScope, $scope, $location, warehouseService, shelfService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.warehouseList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.isUnusual = $location.search().isUnusual;
            console.log("is" + $scope.isUnusual);


            $scope.isExpecial = function() {
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    console.log(staffFlag);
                    if (staffFlag != 'D') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("员工包裹必须以D开头");
                    }
                }
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    console.log(staffFlag);
                    if (staffFlag != 'C') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("异常包裹必须以C开头");
                    }
                }
            }

            $scope.getWarehouseName = function(warehouseNumber) {
                var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
                return !!warehouse ? warehouse.warehouseName : "";
            }

            /*search bar*/
            $scope.searchBar = {
                keywordType: "receiptNumber",
                warehouseNumber: "",
                sendType: "",
                shelfStatus: "",


                dateRange: "",
                startDate: "",
                endDate: "",
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

            warehouseService.getWarehouse(function(result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
                $scope.warehouseList = result;
            });

            var _filterOptions = function() {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "inboundDateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "inboundDateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                }

                if (!!$scope.searchBar.sendType) {
                    _options["sendType"] = $scope.searchBar.sendType;
                }
                if (!!$scope.searchBar.isUnusual) {
                    _options["isUnusual"] = $scope.searchBar.isUnusual;
                }
                if (!!$scope.searchBar.shelfStatus) {
                    _options["shelfStatus"] = $scope.searchBar.shelfStatus;
                }
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
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
                shelfService.getTransportList(_filterOptions(), function(result) {
                    var _data = result.data;
                    _data.forEach(function(e) {
                        if (e.sendType == 2 && e.isUnusual == 1) {
                            e._sendType = "员工包裹"
                        }
                        if (e.sendType == 2 && e.isUnusual == 2) {
                            e._sendType = "异常包裹"
                        }
                    })
                    if (parseInt($scope.customer_ids) !== 0) {
                        _data = _data.filter(function(x) {
                            return $scope.customer_ids.split(",").includes(x.customerNumber);
                        });
                    }

                    $scope.dataList = _data;

                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }
            $scope.getData();

            $scope.btnSearch = function() {
                console.log($scope.searchBar.sendType)
                if ($scope.searchBar.sendType == 3) {
                    $scope.searchBar.isUnusual = 1;
                    $scope.searchBar.sendType = 2;
                }
                if ($scope.searchBar.sendType == 4) {
                    console.log('你妹的')
                    $scope.searchBar.isUnusual = 2;
                    $scope.searchBar.sendType = 2;
                }
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnAction = function(type, item) {
                switch (type) {
                    case "receipt":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/receipt2");
                        break;
                    case "shelf":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/shelf");
                        break;
                    case "onshelf":
                        if (!!item && item.sendType == 2) $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/onshelfdetail");
                        break;
                }
            }

            $scope.btnPrint = function(warehouseNumber) {
                $scope.$broadcast("print-unshelf.action", warehouseNumber);
            }
        }
    ]);