'use strict';

angular
    .module('culwebApp')
    .controller('MyAccountController', ['$scope', '$stateParams', '$filter', 'Customer', '$rootScope', '$state', 'addressSvr', 'SweetAlert', '$location', 'AuthService',
    function ($scope, $stateParams, $filter, Customer, $rootScope, $state, addressSvr, SweetAlert, $location, AuthService) {
        if (App) {
            // App.init();
            if (Masking) Masking.initMasking();
            App.initScrollBar();
            if (RegForm) RegForm.initRegForm();
            if (Validation) Validation.initValidation();
            if (CheckoutForm) CheckoutForm.initCheckoutForm();
        }



        var loadAddressData = function () {
            var localData = window.localStorage.getItem('cul_data_province');
            if (!localData) {
                Customer.retrieveProvinceList(function (data) {
                    window.localStorage.setItem('cul_data_province', JSON.stringify(data));
                }, function (error) {
                    if (error.data.message) {
                        console.error(error.data.message)
                    }
                });
            }
        }
        loadAddressData();




        $scope.isApply = !!$stateParams.apply || $rootScope.currentUser.vipStatus === 'Applied';

        //router for external entries
        $scope.activateProfileTab = 'active in'
        $scope.activatePasswordTab = '';
        $scope.activateAddressTab = '';
        $scope.activateEarnPointTab = '';

        if ($stateParams.anchorid != null && $stateParams.anchorid != undefined) {
            if ($stateParams.anchorid === 'passwordTab') {
                $scope.activateProfileTab = '';
                $scope.activatePasswordTab = 'active in';
            }
            else if ($stateParams.anchorid === 'addressbook') {
                $scope.activateProfileTab = '';
                $scope.activateAddressTab = 'active in';
            }
            else if ($stateParams.anchorid === 'earnpoint') {
                $scope.activateProfileTab = '';
                $scope.activateEarnPointTab = 'active in';
            }
        };

        $scope.profileError = undefined;
        $scope.showProfileError = false;
        $scope.profileInfo = undefined;
        $scope.showProfileInfo = false;


        var model = $scope.model = {
            customerNumber: $scope.$root.currentUser.customerNumber
        };

        $scope.currentCities = [];

        $scope.initProfile = function () {




            Customer.getCustomerInfo(model.customerNumber)
                .then(function (result) {
                    if (result.data) {
                        $(document).off('.datepicker.data-api');

                        $('input.control-date').datepicker({
                            format: 'yyyy/mm/dd',
                            todayHighlight: true,
                            autoclose: true,
                            language: 'zh-CN'
                        });


                        $('input.control-date').on('blur', function () {
                            var control = this;
                            setTimeout(function () {
                                if (!$(control).val()) {
                                    $(control).val($scope.model.birthday || $scope.model.oldBirthday);
                                    if (!$scope.model.birthday) {
                                        $scope.model.birthday = $scope.model.oldBirthday;
                                    }
                                }
                            }, 50);
                        });




                        $scope.model = angular.extend({}, result.data, {
                            oldBirthday: $filter('date')(result.data.birthday, 'yyyy/MM/dd'),
                            birthday: $filter('date')(result.data.birthday, 'yyyy/MM/dd')
                        });

                        Customer.retrieveProvinceList(function (data) {
                            var countryList = [{ code: 'CHN', name: '中国' }, { code: 'OTHER', name: '其他' }];
                            $scope.countryList = countryList;

                            if ($scope.model.countryCode) {
                                for (var i = 0, ii = $scope.countryList.length; i < ii; i++) {
                                    if ($scope.countryList[i].code === $scope.model.countryCode) {
                                        $scope.selectedCountry = $scope.countryList[i];
                                    }
                                }
                            }
                            else {
                                $scope.selectedCountry = $scope.countryList[0];
                            }

                            $scope.provinceList = data;

                            if ($scope.model.stateOrProvince) {
                                for (var i = 0, ii = $scope.provinceList.length; i < ii; i++) {
                                    var provinceItem = $scope.provinceList[i];
                                    if (provinceItem.name === $scope.model.stateOrProvince) {
                                        $scope.selectedProvince = provinceItem;
                                    }

                                    if ($scope.model.city && provinceItem.cities) {
                                        for (var j = 0, jj = provinceItem.cities.length; j < jj; j++) {
                                            if (provinceItem.cities[j].name === $scope.model.city)
                                                $scope.selectedCity = provinceItem.cities[j];
                                        }
                                    }
                                    else if (provinceItem.cities) {
                                        $scope.selectedCity = provinceItem.cities[0];
                                    }
                                }
                            }
                            else {
                                $scope.selectedProvince = $scope.provinceList[0];
                                $scope.selectedCity = $scope.selectedProvince.cities[0];
                            }
                            $scope.currentCities = $scope.selectedProvince.cities;
                        },
                        function (error) {

                        }
                    );
                    }
                });

        };
        $scope.selectedCity = {};
        $scope.reloadCityData = function (countryItem) {
            $scope.currentCities = countryItem.cities;
            $scope.selectedCity = countryItem.cities[0];
            $scope.selectedProvince = countryItem;
        }


        $scope.selectedCityHandler = function (city) {
            $scope.selectedCity = city;
        }


        $scope.saveProfile = function () {

            var url = $scope.model.companySite;
            if (url && !new RegExp('(http[s]{0,1})://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?').test(url)) {
                SweetAlert.swal('错误', '请填写正确的公司网址,如：http://www.culexpress.com/ 或 https://www.culexpress.com/', 'error');
                return false;
            }


            $scope.model.countryCode = $scope.selectedCountry.code;
            $scope.model.countryName = $scope.selectedCountry.name;
            if ($scope.model.countryCode === 'CHN') {
                $scope.model.stateOrProvince = $scope.selectedProvince.name;
                $scope.model.city = $scope.selectedCity.name || '';
            }
            else {
                $scope.model.stateOrProvince = '';
                $scope.model.city = '';
            }

            $scope.model.lastEditUserName = $rootScope.currentUser.userID;
            console.log($scope.model);
            console.log($rootScope.isLackProfile);
            Customer.updateCustomerProfile(
                $scope.model,
                function (data) {
                    $scope.profileError = undefined;
                    $scope.showProfileError = false;
                    $scope.profileInfo = '保存成功';
                    $scope.showProfileInfo = true;


                    var localUserString = AuthService.getStorage(AuthService.userInfoKey),
                        userData = JSON.parse(localUserString);

                    $scope.$root.currentUser = angular.extend(userData, $scope.model);

                    AuthService.clearStorage();
                    AuthService.addStorage(angular.extend($scope.$root.currentUser, { password: userData.password }), true);

                    if ($rootScope.isLackProfile) {
                        $rootScope.isLackProfile = false;
                        $state.go('customer.myhome');
                    }


                    if ($scope.isApply && $rootScope.currentUser.vipStatus !== 'Applied') {
                        Customer.applyVIP($scope.$root.currentUser.customerNumber)
                            .then(function (result) {
                                if (result.data) {
                                    SweetAlert.swal('提示', '您的申请已经发送成功, 我们需要1-2个工作日审核你的资格. 有任何疑问请联系客服.', 'success');
                                }
                            }, function (result) {
                                SweetAlert.swal('错误', result.data.message, 'error');
                            });
                        //$scope.$root.currentUser.isVip = true;//TODO 这里只是为了测试
                    }

                },
                function (error) {
                    $scope.profileInfo = undefined;
                    $scope.showProfileInfo = false;
                    $scope.profileError = error;
                    $scope.showProfileError = true;
                }
            );
        };


        $scope.pagedOptions = {
            total: 0,
            size: 10
        }

        $scope.addressListData = [];

        var resfreshAddressList = function (index) {
            addressSvr.getAddressList(index, {
                userName: $rootScope.currentUser.userName,
                emailAddress: $rootScope.currentUser.emailAddress,
                customerNumber: $rootScope.currentUser.customerNumber
            })
            .then(function (result) {
                if (result.data) {
                    $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    $scope.addressListData = result.data.data;
                }
            });
        }
        resfreshAddressList();

        $scope.onPaged = function (pageIndex) {
            resfreshAddressList(pageIndex);
        }


        $scope.redirectToEdit = function (addressItem) {
            $scope.$root.isAddressList = true;
            $state.go('customer.myaddress', { addressId: addressItem.transactionNumber });
        }

        $scope.redirectToAdd = function () {
            $scope.$root.isAddressList = true;
            $state.go('customer.myaddress');
        }

        $scope.deleteAddress = function (addressItem) {
            SweetAlert.swal({
                title: "确定要删除?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    addressSvr
                        .delAddressInfo(addressItem.transactionNumber)
                        .then(function (result) {
                            if (result.data.success) {
                                SweetAlert.swal('提示', '删除成功.', 'success');
                                resfreshAddressList();
                            }
                        }, function (result) {
                            if (result.data.message) {
                                SweetAlert.swal('错误', result.data.message, 'error');
                            }
                        });
                }
            });
        }

        $scope.changePassword = function () {
            if ($scope.model.newPassword !== $scope.model.passwordConfirm) {
                SweetAlert.swal('错误', '两次输入的密码不一样，请重新输入.', 'error');
                $scope.model.passwordConfirm = '';
                $scope.model.newPassword = '';

                return false;
            }
            Customer.changePassword($scope.model.password, $scope.model.passwordConfirm, $rootScope.currentUser.emailAddress)
                .then(function (result) {
                    if (result.data.success) {
                        SweetAlert.swal({
                            title: '提示',
                            text: '密码修改成功，请重新登录.',
                            type: "success"
                        }, function () {
                            localStorage.removeItem('user_info');
                            AuthService.logout(function () {
                                $location.path('/login');
                            });
                        });
                    }
                    $scope.model.password = '';
                    $scope.model.passwordConfirm = '';
                    $scope.model.newPassword = '';
                }, function (result) {
                    if (result.data.message) {
                        SweetAlert.swal('错误', result.data.message, 'error');
                        $scope.model.password = '';
                        $scope.model.passwordConfirm = '';
                        $scope.model.newPassword = '';
                    }
                });

        }

    }]);
