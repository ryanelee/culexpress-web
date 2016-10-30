'use strict';

angular
    .module('culwebApp')
    .controller('ForgetController', ['$scope', '$location', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'Customer',
        function ($scope, $location, $compile, $timeout, $state, $stateParams, $filter, Customer) {

            $scope.confirmEmail = true;
            $scope.resetConfirm = true;
            $scope.emailSuccessefull = false;


            var queryPara = $location.search(),
                model = $scope.model = {
                    emailAddress: '',
                    loginName: queryPara['mail'],
                    uuid: queryPara['uid'],
                    password1: '',
                    password2: ''
                };

            $scope.reset = function () {
                if (!model.password1) {
                    alertify.alert('提示', '请输入密码。');
                    return false;
                }
                if (!model.password1) {
                    alertify.alert('提示', '请输入确认密码。');
                    return false;
                }

                if (model.password1 !== model.password2) {
                    alertify.alert('提示', '两次输入的密码不一样，请重新输入。');
                    return false;
                }

                Customer.
                    resetPasswordEmail(model.loginName, model.password1, model.uuid)
                    .then(function (result) {
                        if (result) {
                            alertify.alert('提示', '密码重置成功。');
                            $state.go('login');
                        }
                    }, function (result) {
                        if (result) {
                            alertify.alert('错误', result.message);
                        }
                    });
            }





            $scope.sendEmail = function () {
                if (!model.emailAddress) {
                    alertify.alert('提示', '请输入您注册时的电子邮箱地址。');
                    return false;
                }

                var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                if (model.emailAddress && !regEmail.test(model.emailAddress)) {
                    alertify.alert('提醒', '邮箱格式输入错误，请重新输入.');
                    return false;
                }

                Customer.sendForgetPasswordEmail(model.emailAddress)
                    .then(function (result) {
                        $scope.confirmEmail = false;
                        $scope.emailSuccessefull = true;
                    }, function (result) {
                        if (result) {
                            alertify.alert('错误', result.message);
                        }
                    })
            }

        }]);