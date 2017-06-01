'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:UserListCtrl
 * @description
 * # UserListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('UserListCtrl', ["$scope", "$location", "userService", "plugMessenger","storage",
        function ($scope, $location, userService, plugMessenger,storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                active: "",
                userName: ""
            }
               $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = {
                    "pageInfo": $scope.pagination,
                    'active': $scope.searchBar.active,
                    'userName': $scope.searchBar.userName,
                    'customerNumber': 'null'
                }
                userService.getList(_options, function (result) {
                    var _data = result.data;
                    $scope.dataList = result.data;
                    // .filter(function(x) {
                    //     return x.customerNumber == null;
                    // });
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                });
            }

            $scope.btnSearch = function () {

                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.addReceipt = function () {
                $location.path('/system/edituser').search({});
            }

            $scope.edit = function (id) {
                $location.path('/system/edituser').search({ userId: id });
            }

            // 删除用户
            $scope.del = function (id) {
                plugMessenger.confirm("确认删除该员工吗?", function (isOk) {
                    if (isOk) {
                        userService.delete(id, function (res) {
                            if (res.success) {
                                plugMessenger.success("删除成功");
                                $scope.getData();
                            }
                        })
                    }
                });
            }

            $scope.btnResetPassword = function (email) {
                plugMessenger.confirm("确认重置密码吗?", function (isOk) {
                    if (isOk) {
                        userService.resetPassword({
                            "emailAddress": email
                        }, function (result) {
                            if (result.success == true) {
                                plugMessenger.success("密码重置成功");
                            }
                        });
                    }
                })
            }

            $scope.goToRolePage = function (role) {
                $location.path('/system/editrole').search({ roleId: role.role_id });
            };

            // $scope.getData();
        }
    ]).filter('activeStr', function () {
        return function (active) {
            var str = '已激活';
            if (active == 0) {
                str = '未激活';
            } else if (active == '-1') {
                str = '已禁用'
            }
            return str;
        }
    });