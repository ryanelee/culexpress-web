'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('CategerylistCtrl', ['$scope', '$location', '$window', 'sysroleService', 'ItemService', 'channelService', 'plugMessenger',"storage",
        function($scope, $location, $window, sysroleService, ItemService, channelService, plugMessenger,storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS', 
                'Karma'
            ];

            $scope.dataList = [];
            /*search bar*/
            $scope.searchBar = {
                status: "",
                keywordType: "mainName"
            }
            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

            var _filterOptions = function() {
                var _options = {
                    "pageInfo": $scope.pagination
                }
                if (!!$scope.searchBar.status) {
                    _options["status"] = $scope.searchBar.status;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function() {
                storage.session.setObject("searchBar", $scope.searchBar);
                ItemService.getItemCategoryList(_filterOptions(), function(result) {
                    $scope.dataList = result.data.data;
                    console.log("$scope.dataList",$scope.dataList)
                });
            }
            $scope.btnSearch = function() {
                console.log('search')
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
            $scope.getData();

            // 新建仓库跳转
            $scope.addChannel = function() {
                    $location.path('/system/editchannel').search({});
                }
                // 修改仓库
            $scope.edit = function(item) {
                if (!!item) $location.search({ item: item, flag: "update" });
                $location.path('/system/editchannel')
            }
            $scope.del = function(warehouseNumber) {
                    //console.log(warehouseNumber);
                    // return;
                    plugMessenger.confirm("确认删除该仓库吗?", function(isOk) {
                        if (isOk) {
                            warehouseService.deleteWarehouse({ warehouseNumber: warehouseNumber }, function(res) {
                                if (res.code == '000') {
                                    plugMessenger.success("删除成功");
                                    $scope.getData();
                                } else {
                                    plugMessenger.error("删除出错");

                                }
                            })
                        }
                    });
                }
                // 返回列表
            $scope.back = function() {
                //$location.path('/system/rolelist');
                $window.sessionStorage.setItem("historyFlag", 1);                 
                $window.history.back();
            }
        }
    ]);

