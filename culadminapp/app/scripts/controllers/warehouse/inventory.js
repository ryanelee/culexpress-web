'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryCtrl
 * @description
 * # WarehouseInventoryCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseInventoryCtrl', ['$timeout', '$rootScope', '$scope', '$location', '$window', 'warehouseService', 'inventoryService',"storage",
        function ($timeout, $rootScope, $scope, $location, $window, warehouseService, inventoryService,storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.sendTypes = [
                { key: "", value: "全部" },
                { key: 1, value: "寄送库存" },
                { key: 2, value: "海淘包裹" },
                { key: "3", value: "异常包裹" },
                { key: "4", value: "员工包裹" },
            ]

            $scope.dataList = [];
    // keywordType: "receiptNumber",
            /*search bar*/
            $scope.searchBar = {
                keywordType: "itemNumber",
                warehouseNumber: "",
                inventoryCondition: "",
                inventoryConditionValue: "0",
                categoryId: "",
                categorySubId: "",
                sendType: "",
            
                dateRange: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
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
            });

            inventoryService.getCategoryList(function (result) {
                if (!!result) {
                    $scope.searchBar.categoryList = [{ cateid: "", name: "全部" }].concat(result);
                    $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
                }
            });

            $scope.changeCategory = function () {
                $scope.searchBar.categorySubId = "";
                $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
                var currentCategory = _.findWhere($scope.searchBar.categoryList, { cateid: $scope.searchBar.categoryId });
                if (!!currentCategory) {
                    $scope.searchBar.categorySubList = $scope.searchBar.categorySubList.concat(currentCategory.sub || []);
                }
            }

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? new Date($scope.searchBar.startDate) : "",
                    //   "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "dateTo": !!$scope.searchBar.endDate ? new Date($scope.searchBar.endDate) : "",
                    //   "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                }
                if (!!$scope.searchBar.categoryId) {
                    _options["itemCategory"] = $scope.searchBar.categoryId;
                }

                if (!!$scope.searchBar.sendType) {
                    _options["sendType"] = $scope.searchBar.sendType;
                }
                if (!!$scope.searchBar.isUnusual) {
                    _options["isUnusual"] = $scope.searchBar.isUnusual;
                }

                if (!!$scope.searchBar.categorySubId) {
                    _options["itemSubCategory"] = $scope.searchBar.categorySubId;
                }

                switch ($scope.searchBar.inventoryCondition) {
                    case ">":
                        _options["inventoryFrom"] = $scope.searchBar.inventoryConditionValue;
                        break;
                    case "<":
                        _options["inventoryTo"] = $scope.searchBar.inventoryConditionValue;
                        break;
                    case "=":
                        _options["inventory"] = $scope.searchBar.inventoryConditionValue;
                        break;
                }

                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                 storage.session.setObject("searchBar", $scope.searchBar);
                inventoryService.getList(_filterOptions(), function (result) {

                    var __data = result.data;
                    var _data = [];

                    if (!$scope.searchBar.isUnusual && $scope.searchBar.sendType == 2) {
                        __data.map(function (e) {
                            if (e.isUnusual != 1 && e.isUnusual != 2) {
                                _data.push(e);
                            }
                        })
                    } else {
                        _data = __data;
                    }

                    _data.forEach(function (e) {
                        if (e.sendType == 2) {
                            e._sendType = "海淘包裹"
                        }
                        if (e.sendType == 1) {
                            e._sendType = "寄送库存"
                        }
                        if (e.sendType == 2 && e.isUnusual == 1) {
                            e._sendType = "员工包裹"
                        }
                        if (e.sendType == 2 && e.isUnusual == 2) {
                            e._sendType = "异常包裹"
                        }
                    })

                     if ($scope.searchBar.isUnusual == 2) {
                        $scope.searchBar.sendType = $scope.sendTypes[3].key;
                    }
                      if ($scope.searchBar.isUnusual == 1) {
                        $scope.searchBar.sendType =  $scope.sendTypes[4].key;
                    }

                    $scope.dataList = _data;
                    //console.log( $scope.dataList);
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                });
            }

            $timeout(function(){
                // $scope.getData();
            },500);
            
            $scope.btnSearch = function () {

                if ($scope.searchBar.sendType == 3) {
                    $scope.searchBar.isUnusual = 2;
                    $scope.searchBar.sendType = 2;
                }
                if ($scope.searchBar.sendType == 4) {
                    $scope.searchBar.isUnusual = 1;
                    $scope.searchBar.sendType = 2;
                }



                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnAction = function (type, item) {
                if (!!item) $location.search({ itemNumber: item.itemNumber });
                switch (type) {
                    case "frozen":
                        $location.path("/warehouse/inventoryfrozen");
                        break;
                    case "adjust":
                        $location.path("/warehouse/inventoryadjust");
                        break;
                    case "logs":
                        $location.path("/warehouse/inventoryloglist");
                        break;
                    case "detail":
                        $location.path("/warehouse/inventorydetail");
                        break;
                }
            }
        }]);

