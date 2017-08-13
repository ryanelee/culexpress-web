'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfDetailCtrl
 * @description
 * # WarehouseShelfDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseShelfDetailCtrl', ['$scope', '$location', '$window', 'shelfService', 'warehouseService', 'plugMessenger',
        function($scope, $location, $window, shelfService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            
            $scope.data = {
                itemNumber: "",
                originShelfNumber: "",
                warehouseName: "",
                targetShelfNumber: "",
                warehouseNumber: "",
                moveItemCount: ""
            };

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }

            /*search bar*/
            $scope.searchBar = {
                keywordType: !!$location.search().receiptNumber ? "receiptNumber" : "shelfNumber",
                keywords: $location.search().receiptNumber || "",
                warehouseNumber: "",
            }

            $scope.warehouseList = [];
            warehouseService.getWarehouse(function(result) {
                $scope.warehouseList = result;
                $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
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
                    $scope.data = _data[0];
                    $scope.data.originShelfNumber = _data[0].shelfNumber;
                    $scope.data.moveItemCount = _data[0].itemCount
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                });
            }

            $scope.btnSearch = function() {[];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
             $scope.btnSearch();
            $scope.btnSave = function(type) {
                if ($scope.data.moveItemCount <= 0) {
                    plugMessenger.error("移动数量不能小于等于0");
                    return;
                }
                if (!$scope.data.targetShelfNumber) {
                    plugMessenger.error("目标价位不能为空");
                    return;
                }
                var data = {
                    itemNumber: $scope.data.itemNumber,
                    originShelfNumber: $scope.data.originShelfNumber,
                    targetShelfNumber: $scope.data.targetShelfNumber,
                    warehouseNumber: $scope.data.warehouseNumber,
                    warehouseName: $scope.data.warehouseName,
                    moveItemCount: $scope.data.moveItemCount
                }
                shelfService.onshelfForMove(data, function(result) {
                    if (!result.message) {
                        plugMessenger.success("操作成功");
                        $scope.btnPrev();
                        
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.sessionStorage.setItem("historyFlag", 1);                 
                $window.history.back();
            }

            $('#tip_originShelfNumber').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "填000将会只添加商品到目标架位"
            });
        }
    ]);