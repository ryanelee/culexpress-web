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

            var lackNames = false;
            if(($scope.currentUser.firstName == null || $scope.currentUser.firstName == undefined)
            && ($scope.currentUser.lastName == null || $scope.currentUser.lastName == undefined)){
                lackNames = true;
            }

            $scope.$root.isLackProfile = lackNames;

            if ($scope.currentUser && $scope.currentUser.photoUrl === null) {
                if ($scope.currentUser.gender === 'M')
                    $scope.currentUser.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-male.jpg';
                else
                    $scope.currentUser.photoUrl = '/assets/img/culwebapp/customer/profile/no-photo-female.jpg';
            }
        }
        $scope.$on("MyHomeCtrl.RefreshUser", function (e) {
            _refreshUser();
        })
        _refreshUser();

        $rootScope.isLogined = true;
        $scope.referURL = $window.location.origin + "/#/register/" + $scope.currentUser.customerNumber;

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
            .then(function (result) {
                if (result && result.data && result.data.filePath) {
                    var avatarUrl = cul.apiHost + (result.data.filePath || '').replace(new RegExp('\\\\', 'g'), '/'),
                        userData = $.extend(true, {}, $scope.currentUser);

                    if (!!result.url) avatarUrl = result.url;

                    $.extend(userData, {
                        photoUrl: avatarUrl,
                        photo: result.data.filePath
                    });

                    Customer.updateCustomerProfile(userData, function (data) {
                        if (data && data.data && data.data.success) {
                            $('#userPhotoModal').modal('hide');
                        }
                    })
                }
            },function () {
            });

        }

        //登入广告管理
        $scope.webAnnounce = [{
            title:"",
            content:""
        }];
        var obj = {type:1,status:1};
        $scope.getWebAnnounce = function(obj) {
            $http.post(cul.apiPath + '/web/getWebAnnounce',obj).then(function (result) {
                $scope.webAnnounce = result.data.data.data;
            });
        }
        $scope.getWebAnnounce();
    }]);
