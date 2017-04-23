'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfCtrl
 * @description
 * # WarehouseShelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseShelfCtrl', ['$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService',
        function($window, $rootScope, $scope, $location, warehouseService, shelfService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.warehouseList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.getWarehouseName = function(warehouseNumber) {
                var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
                return !!warehouse ? warehouse.warehouseName : "";
            }

            /*search bar*/
            $scope.searchBar = {
                keywordType: !!$location.search().receiptNumber ? "receiptNumber" : "shelfNumber",
                keywords: $location.search().receiptNumber || "",
                warehouseNumber: "",
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
                    "pageInfo": $scope.pagination
                }

                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    if ($scope.searchBar.keywordType == "customerNumber" &&
                        $scope.customer_ids != undefined &&
                        parseInt($scope.customer_ids) !== 0 &&
                        !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                        $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                    }

                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function() {
                    shelfService.getOnshelfList(_filterOptions(), function(result) {
                        var _data = result.data;
                        if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                            _data = _data.filter(function(x) {
                                return $scope.customer_ids.split(",").includes(x.customerNumber);
                            });
                        }

                        $scope.dataList = _data;
                        console.log($scope.dataList);
                        $scope.pagination.totalCount = result.pageInfo.totalCount;
                        $rootScope.$emit("changeMenu");
                    });
                }
                //   $scope.getData();

            $scope.btnSearch = function() {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnAction = function(type, item) {
                switch (type) {
                    case "edit":
                        if (!!item) $location.search({ shelfNumber: item.shelfNumber, itemNumber: item.itemNumber, warehouseName: item.warehouseName });
                        $location.path("/warehouse/shelfdetail");
                        break;
                }
            }

            $scope.btnPrev = function() {
                $window.history.back();
            }

            $scope.btnPrint = function(warehouseNumber) {
                $scope.$broadcast("print-unshelf.action", warehouseNumber);
            }

            $scope.getData();
        }
    ]);