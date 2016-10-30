'use strict';

angular
    .module('culwebApp')
    .controller('MyHomeController', ['$scope', '$state', '$http', '$anchorScroll', '$window', '$rootScope', 'AuthService', 'Customer',
    function ($scope, $state, $http, $anchorScroll, $window, $rootScope, AuthService, Customer) {
        if (!$rootScope.currentUser) {
            $rootScope.currentUser = JSON.parse(AuthService.getStorage(AuthService.userInfoKey));
        };

        if ($rootScope.currentUser === undefined || $rootScope.currentUser === null) {
            $rootScope.isLogined = false;
            $state.go('login');
            return;
        };
        var _refreshUser = function () {
            $scope.currentUser = $rootScope.currentUser;
            $scope.$root.isLackProfile = !$scope.currentUser.firstName || !$scope.currentUser.lastName;
        }
        $scope.$on("MyHomeCtrl.RefreshUser", function (e) {
            _refreshUser();
        })
        _refreshUser();

        $rootScope.isLogined = true;


        $scope.source = {
            menus: null
        }

        var model = $scope.model={
            userProfilePercent:0
        };

        $http.get(cul.apiHost + 'api/customer/profilepercent/' + $scope.currentUser.customerNumber)
        .then(function (result) {
            model.userProfilePercent = result.data.percent;
        });



        //$scope.$root.currentUser.isVip = true;//TODO 这里只是为了测试
        $scope.applyVip = function () {
            $state.go('customer.myaccount', { anchorid: 'profile', apply: true });
        }




        $('#file').on('change', function () {
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function () {
                    $scope.currentUser.photoUrl = event.target.result;
                });
            }
            reader.readAsDataURL(this.files[0]);
        })

        $('#userPhotoModal').on('shown.bs.modal', function () {
            $('#file').get(0).value = null;
        })

        $scope.updateAvatar = function () {
            var fileInfo = $('#file').get(0).files[0];
            if (!fileInfo) {
                alertify.alert('提示', '请先选择头像');
                return false;
            }


            var form = new FormData();
            form.append('file', $('#file').get(0).files[0]);
            $http.post(cul.apiPath + '/files/upload', form, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (result) {
                if (result && result.filePath) {
                    var avatarUrl = cul.apiHost + (result.filePath || '').replace(new RegExp('\\\\', 'g'), '/'),
                        userData = $.extend(true, {}, $scope.currentUser);

                    if (!!result.url) avatarUrl = result.url;

                    $.extend(userData, {
                        photoUrl: avatarUrl,
                        photo: result.filePath
                    });

                    Customer.updateCustomerProfile(userData, function (data) {
                        if (data && data.success) {
                            $('#userPhotoModal').modal('hide');
                        }
                    })
                }
            })
            .error(function () {
            });

        }


    }]);