'use strict';

angular
    .module('culwebApp')
    .controller('LoginController', ['$rootScope', '$scope', 'AuthService', '$state', '$window',
        function ($rootScope, $scope, AuthService, $state, $window) {
            $scope.rememberMe = false;
            $scope.loginError = undefined;
            $scope.showLoginError = false;
            console.log(1)
            // $window.localStorage.removeItem('user')
            $scope.user = angular.fromJson($window.localStorage.getItem('user'))
            $scope.emailAddress = $scope.user ? $scope.user.emailAddress : ''
            if($scope.user && $scope.user.rememberMe){
            $scope.password = $scope.user.password
            }
            $scope.login = function () {
              console.log('aaaaaa')
                if ($('.state-error').length > 0) return;
                var loginData = {
                    emailAddress: $scope.emailAddress,
                    password: $scope.password,
                    rememberMe: $scope.rememberMe
                };

                $scope.$root.isLogined = false;
                AuthService.login(loginData)
                    .then(function (result) {
                        if (result.data && result.data.photoUrl === null) {

                            if (result.data.gender === 'M')
                                result.data.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-male.jpg';
                            else
                                result.data.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-female.jpg';
                        }
                        AuthService.clearStorage();
                        AuthService.addStorage(angular.extend(result.data, { password: $scope.password }), loginData.rememberMe);

                        if (result.headers('Token')) {
                            if (loginData.rememberMe) {
                                $window.localStorage.setItem('user', angular.toJson(loginData));
                                localStorage.setItem('cul-token', result.headers('Token'));
                            }
                            // else {
                            sessionStorage.setItem('cul-token', result.headers('Token'));
                            // }
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
