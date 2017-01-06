'use strict';

angular
    .module('culwebApp')
    .controller('LoginController', ['$rootScope', '$scope', 'AuthService', '$state',
    function ($rootScope, $scope, AuthService, $state) {
        $scope.rememberMe = false;
        $scope.loginError = undefined;
        $scope.showLoginError = false;

        $scope.login = function () {
          $scope.showLoginError = false;
          $scope.loginError = '';
          if (!$scope.emailAddress) {
            $scope.showLoginError = true;
            $scope.loginError = '请输入注册时填入的邮箱地址';
            return;
          } else {
            if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test($scope.emailAddress)) {
              $scope.showLoginError = true;
              $scope.loginError = '请输入有效的邮箱地址(比如:JonDoe@gmail.com)';
              return;
            }
          }
          if (!$scope.password) {
            $scope.showLoginError = true;
            $scope.loginError = '请输入您的密码';
            return;
          } else {
            if ($scope.password.length < 6 || $scope.password.length > 20) {
              $scope.showLoginError = true;
              $scope.loginError = '密码长度为6-20位';
              return;
            }
          }
            var loginData = {
                emailAddress: $scope.emailAddress,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            };

            $scope.$root.isLogined = false;
            AuthService.login(loginData)
                .then(function (result) {
                    if (result.data && result.data.photoUrl === null) {
                        console.log(result.data);
                        if (result.data.gender === 'M')
                            result.data.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-male.jpg';
                        else
                            result.data.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-female.jpg';
                    }
                    AuthService.clearStorage();
                    AuthService.addStorage(angular.extend(result.data, { password: $scope.password }), loginData.rememberMe);

                    if (result.headers('Token')) {
                        if (loginData.rememberMe) {
                            localStorage.setItem('cul-token', result.headers('Token'));
                        }
                        else {
                            sessionStorage.setItem('cul-token', result.headers('Token'));
                        }
                    }

                    $scope.$root.currentUser = result.data;

                    $rootScope.isLackProfile = !result.data.firstName || !result.data.lastName;
                    $rootScope.isLogined = true;


                    if ($scope.$root.isLackProfile) {
                        $state.go('customer.myaccount', { anchorid: 'profile' });
                    } else {
                        $state.go('customer.myhome');
                    }
                },
                function (result) {
                    $scope.showLoginError = true;
                    $scope.loginError = result.data.message;
                });
        };
    }]);
