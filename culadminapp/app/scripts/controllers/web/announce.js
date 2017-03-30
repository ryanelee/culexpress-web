'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfManagementCtrl
 * @description
 * # WarehouseShelfManagementCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('AnnounceCtrl', ['$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService', 'customerService', 'plugMessenger',
        function ($window, $rootScope, $scope, $location, warehouseService, shelfService, customerService, plugMessenger) {
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
                keywordType: "title",
                type: "",
                status: "",
                opened: {
                    openTime: false,
                    endDate: false,
                    start: false,
                    end: false
                }
            }



            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }

            // warehouseService.getWarehouse(function (result) {
            //     if (result.length == 1) {
            //         $scope.searchBar.warehouseList = result;
            //         $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
            //     } else {
            //         $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
            //     }
            //     $scope.warehouseList = result;
            // });

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination
                }

                if (!!$scope.searchBar.type) {
                    _options["type"] = $scope.searchBar.type;
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
                return angular.copy(_options);
            }

            $scope.getData = function () {
                customerService.getWebAnnounce(_filterOptions(), function (result) {
                    console.log(result);
                    $scope.dataList = result.data.data;
                    $scope.pagination.totalCount = result.data.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }
            $scope.getData();


            $scope.btnSearch = function () {
                console.log('23')
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
                        $location.path("/web/newAnnounce");
                        break;
                }
            }

            $scope.btnPrint = function (item) {
                $scope.$broadcast("print-helper.action", "shelf-management-tag", { shelfNumber: item.shelfNumber });
            }

            $scope.btnSave = function () {
                console.log('13')
                customerService.createWebAnnounce($scope.data, function (result) {
                    if (result.code = '000') {
                        plugMessenger.success("创建成功");
                        $location.path('/web/announce')
                    } else {
                        plugMessenger.error("创建失败");

                    }
                })
            }



            $scope.btnPrev = function () {
                $window.history.back();
            }

            //路由
            $scope.update = function (item) {
                if (!!item) $location.search({ item: item });
                $location.path("/web/updateAnnounce");
            }


            //更新

            $scope.updateAnnounce = function () {
                console.log(123)
                customerService.updateWebAnnounce($scope.data, function (result) {
                    if (result.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path("/web/announce");
                    }
                })
            }

              console.log("wonder")
            $scope.changeOpenAll = function (type) {
                console.log(type)
                if (type == 1 || type == 3) {
                    $scope.data.openAll = 0
                    // $scope.openFlag = 0
                } else {
                    $scope.data.openAll = 1
                    
                    // $scope.openFlag = 1
                }
            }




            $scope.btnDelete = function (announce) {
                console.log(announce);
                plugMessenger.confirm("确认删除吗" + announce.title + "？", function (isOk) {
                    if (isOk) {
                        customerService.deleteWebAnnounce(announce, function (result) {
                            if (result.code == '000') {
                                plugMessenger.success("删除成功");
                                $scope.getData();
                            }
                        })
                    }
                });
            }
        }]);


angular.module('culAdminApp')
    .controller('UpdateAnnounceCtrl', ['$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService', 'customerService', 'plugMessenger',
        function ($window, $rootScope, $scope, $location, warehouseService, shelfService, customerService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.flag = '1';

            $scope.data = $location.search().item;

            $scope.btnPrev = function () {
                $window.history.back();
            }

            //更新

            $scope.updateAnnounce = function () {
                console.log(123)
                customerService.updateWebAnnounce($scope.data, function (result) {
                    if (result.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path("/web/announce");
                    }
                })
            }

            console.log("wonder")
            $scope.changeOpenAll = function (type) {
                console.log(type)
                if (type == 1 || type == 3) {
                    $scope.data.openAll = 0
                    $scope.openFlag = 1
                } else {
                    $scope.openFlag = 0
                }
            }



        }]);
