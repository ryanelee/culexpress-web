'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ChannelCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'channelService', 'plugMessenger',"storage",
        function($scope, $location, $window, sysroleService, customerService, channelService, plugMessenger,storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            /*search bar*/
            $scope.searchBar = {
                status: "",
                keywordType: "channelName"
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
                channelService.getChannelList(_filterOptions(), function(result) {
                    $scope.dataList = result.data.data;
                    $scope.pagination.totalCount = result.data.pageInfo.totalCount;
                });
            }
            $scope.btnSearch = function() {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
            $scope.getData();

            // 新建渠道跳转
            $scope.addChannel = function() {
                $location.path('/system/editchannel').search({});
            }
            // 修改渠道
            $scope.edit = function(item) {
                if (!!item) $location.search({ item: item, flag: "edit" });
                $location.path('/system/editchannel')
            }

            $scope.detail  = function(item) {
                if (!!item) $location.search({ item: item, flag: "detail" });
                $location.path('/system/editchannel')
            }

            $scope.delete = function(item) {
                plugMessenger.confirm("确认删除该渠道吗?", function(isOk) {
                    if (isOk) {
                        channelService.deleteChannel({ channelId: item.channelId }, function(res) {
                            if (res.code == '000') {
                                plugMessenger.success("删除成功");
                                $scope.getData();
                            } else {
                                plugMessenger.error("删除失败");

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

