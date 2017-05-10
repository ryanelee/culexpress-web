'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$element", "userService", "plugMessenger",
        function($scope, $rootScope, $location, $element, userService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.search = {};
            $scope.resetFlag = '0'

            $scope.model = {
                username: "",
                password: "",
                remember: false
            }

            $scope.btnLogin = function() {
                userService.login($scope.model,
                    function(errorMessage) {
                        //success message
                        if (!errorMessage && $scope.resetFlag == '0') {
                            plugMessenger.success("登录成功");
                            $rootScope.$broadcast("refresh.menus");
                            $location.path('/')
                        } else if (!errorMessage && $scope.resetFlag == '1') {
                            $scope.search.resetFlag = '1';
                            $scope.search.emailAddress = $rootScope.userInfo.emailAddress;
                            userService.resetPassword($scope.search, function(result) {
                                if (result.success) {
                                    plugMessenger.success("重置成功");
                                } else {
                                    userService.logout();
                                    plugMessenger.error("重置失败,请在次尝试");
                                }
                            })
                        }
                    });
            }

            $scope.reset = function() {
                $scope.resetFlag = '1'
            }

            $scope.resetPassword = function() {
                if (!$scope.search.password) {
                    plugMessenger.error("新密码不能为空");
                } else if ($scope.search.password != $scope.search.repassword) {
                    plugMessenger.error("两次输入不一致");
                } else {
                    $scope.btnLogin();
                }
            }



        }
    ]);