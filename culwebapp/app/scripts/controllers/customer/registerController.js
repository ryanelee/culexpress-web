'use restrict';


angular
    .module('culwebApp')
    .controller('RegisterController', ['$rootScope', '$scope','$location', '$state', '$stateParams','AuthService',
    function ($rootScope, $scope, $location, $state, $stateParams, AuthService) {

        $scope.userType = AuthService.userTypes.culwebapp_user;
        $scope.registerError = '';
        $scope.showRegisterError = false;
        $scope.customerNumber = $location.search().cid || '';
        $scope.model = {
            registed: false,
            email: ''
        };

        if ($stateParams.reference !== undefined){
            $scope.customerNumber = $stateParams.reference;
        }
        
        $scope.register = function () {
            if ($('.state-error').length > 0) return;

            var registerData = {
                userName: $scope.userName,
                password: $scope.password,
                emailAddress: $scope.emailAddress,
                gender: $scope.gender,
                reference: $scope.customerNumber,
                userType: AuthService.userTypes.culwebapp_user,
                countryCode: 'USA'
            };


            var key = CryptoJS.lib.WordArray.random(128 / 8);

            var bodyData = {
                data: CryptoJS.AES.encrypt(JSON.stringify(registerData), key.toString()).toString(),
                key: key.toString()
            };

            AuthService.register(registerData,
                function (user) {
                    if (!!user) {
                        $scope.model.registed = true;
                        $scope.model.email = registerData.emailAddress;
                    }


                    //var loginData = {
                    //    emailAddress: user.emailAddress,
                    //    password: $scope.password,
                    //    rememberMe: true
                    //};

                    //var key = CryptoJS.lib.WordArray.random(128 / 8);

                    //var requestData = {
                    //    data: CryptoJS.AES.encrypt(JSON.stringify(loginData), key.toString()).toString(),
                    //    key: key.toString()
                    //};

                    //AuthService
                    //    .login(loginData)
                    //    .then(function (result) {
                    //        if (result.data && result.data.photo === null) {
                    //            if (result.data.gender === 'M')
                    //                result.data.photo = '/assets/img/culwebapp/customer/profile/no-photo-male.jpg';
                    //            else
                    //                result.data.photo = '/assets/img/culwebapp/customer/profile/no-photo-female.jpg';
                    //        }
                    //        AuthService.clearStorage();
                    //        AuthService.addStorage(angular.extend(result.data, { password: $scope.password }), loginData.rememberMe);

                    //        if (result.headers('Token')) {
                    //            if (loginData.rememberMe) {
                    //                localStorage.setItem('cul-token', result.headers('Token'));
                    //            }
                    //            else {
                    //                sessionStorage.setItem('cul-token', result.headers('Token'));
                    //            }
                    //        }

                    //        $scope.$root.currentUser = result.data;
                    //        $scope.$root.isLackProfile = !result.data.firstName || !result.data.lastName;
                    //        $rootScope.isLogined = true;
                    //        $state.go('customer.myaccount', { anchorid: 'profile' });
                    //    },
                    //    function (result) {
                    //        if (result.data && result.data.message)
                    //            $scope.showRegisterError = true;
                    //        $scope.registerError = result.data.message;
                    //    });
                },
                function (err) {
                    $scope.showRegisterError = true;
                    $scope.registerError = err.message;
                });
        };
    }
    ]);