﻿'use strict';
/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfManagementCtrl
 * @description
 * # WarehouseShelfManagementCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseShelfManagementCtrl', ['$timeout', '$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService', 'plugMessenger', 'storage',
        function ($timeout, $window, $rootScope, $scope, $location, warehouseService, shelfService, plugMessenger, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.warehouseList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.getWarehouseName = function (warehouseNumber) {
                var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
                return !!warehouse ? warehouse.warehouseName : "";
            }

            /*search bar*/
            $scope.searchBar = {
                keywordType: !!$location.search().receiptNumber ? "receiptNumber" : "shelfNumber",
                keywords: $location.search().receiptNumber || "",
                warehouseNumber: "",
            }

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }

            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
                $scope.warehouseList = result;
            });

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination
                }

                if (!!$scope.searchBar.type) {
                    _options["type"] = $scope.searchBar.type;
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

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                console.log(_filterOptions())
                shelfService.getList(_filterOptions(), function (result) {
                    var _data = result.data;
                    _data.forEach(function (e) {
                        if (e.type == "C") {
                            e._type = "异常包裹"
                        }
                        if (e.type == "D") {
                            e._type = "员工包裹"
                        }
                    })
                    // $scope.tempData = angular.copy(_data)

                    // $scope.arr1 = [];
                    // $scope.arr2 = [];
                    // $scope.arr3 = [];
                    // $scope.arr4 = [];
                    // $scope.tempData.forEach(function (e) {
                    //     if (e.type = 'A') {
                    //         $scope.arr1.push(e);
                    //     } else if (e.type = 'B') {
                    //         $scope.arr2.push(e);
                    //     } else if (e.type = 'C') {
                    //         $scope.arr3.push(e);
                    //     } else {
                    //         $scope.arr4.push(e);
                    //     }
                    // })
                    // $scope.arr1 = _.sortBy($scope.arr1, function (e) {
                    //     return e.shelfNumber
                    // })
                    // $scope.arr2 = _.sortBy($scope.arr1, function (e) {
                    //     return e.shelfNumber
                    // })
                    // $scope.arr3 = _.sortBy($scope.arr1, function (e) {
                    //     return e.shelfNumber
                    // })
                    // $scope.arr4 = _.sortBy($scope.arr1, function (e) {
                    //     return e.shelfNumber
                    // })

                    // _data = _.compact($scope.arr1, $scope.arr2, $scope.arr3, $scope.arr4);


                    if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                        _data = _data.filter(function (x) {
                            return $scope.customer_ids.split(",").includes(x.customerNumber)
                        });
                    }

                    $scope.dataList = _data;

                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }

            $timeout(function () {
                // $scope.getData();
            }, 500);

            $scope.btnSearch = function () {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnAction = function (type, item) {
                switch (type) {
                    case "detail":
                        if (!!item) $location.search({ warehouseNumber: item.warehouseNumber, shelfNumber: item.shelfNumber });
                        $location.path("/warehouse/shelfmanagementdetail");
                        break;
                    case "create":
                        $location.path("/warehouse/shelfmanagementcreate");
                        break;
                }
            }

            $scope.btnPrint = function (item) {
                $scope.$broadcast("print-helper.action", "shelf-management-tag", { shelfNumber: item.shelfNumber });
            }

            $scope.deleteShelf = function (item) {
                if (item.itemCount > 0) {
                    plugMessenger.info("该架位还有包裹，不允许删除");
                    return;
                }
                plugMessenger.confirm("确认删除架位" + item.shelfNumber + "吗?", function (isOK) {
                    if (isOK) {
                        shelfService.deleteShelf(item, function (result) {
                            //console.log(result);
                            if (result.code == '000') {
                                plugMessenger.success("操作成功");
                                $scope.getData();
                            }
                        })

                    }
                })


            }
        }
    ]);