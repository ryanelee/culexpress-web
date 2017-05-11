'use strict';

angular
    .module('culwebApp')
    .controller('MyFinanceController', ['$scope', '$stateParams', '$window', '$location', 'Customer', 'AuthService',
        function($scope, $stateParams, $window, $location, customer, AuthService) {
            if (App) {
                App.init();
                App.initCounter();
                App.initScrollBar();
            }

            $scope.currentTabId = $stateParams.tabId || 'recharge';

            $scope.currentUser = AuthService.getUser();


            //$scope.$root.autologin(function (result) {
            //    $scope.currentUser.accountBalance = result.accountBalance;
            //    return false;
            //});

            customer.getCustomerInfo($scope.currentUser.customerNumber)
                .then(function(result) {
                    $scope.currentUser.accountBalance = result.data.accountBalance;
                });


            var model = $scope.model = {

                },
                operationType = 1;

            if ($scope.currentTabId === 'debit') {
                operationType = 2;
            }

            $scope.userPay = function() {
                var currentCustomer = AuthService.getUser();
                if (!currentCustomer) {
                    alertify.alert('提醒', '请先登录.', 'warning');
                    return false;
                }
                if (!model.payAmount) {
                    alertify.alert('提醒', '请输入充值金额.', 'warning');
                    return false;
                }
                if (model.payAmount < 0.1) {
                    alertify.alert('提醒', '充值金额不能小于0.1', 'warning');
                    return false;
                }
                window.open('rechargepage.html?ra=' + encodeURIComponent(model.payAmount) + '&cn=' + encodeURIComponent(currentCustomer.customerNumber));
            }


            $scope.myfinanceListData = [];
            $scope.pagedDebitOptions = $scope.pagedOptions = {
                total: 0,
                size: 10
            }
            var loadFinanceLog = function(index, callback) {
                customer.getFinanceLog(index, $scope.currentUser.customerNumber, operationType)
                    .then(function(result) {
                        //console.log(result);
                        callback && callback(result);
                    });
            }


            $scope.onPaged = function(pageIndex) {
                loadFinanceLog(pageIndex, function() {
                    $scope.myfinanceListData = result.data.data;
                    $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                });
            }


            $scope.myDebitListData = []


            $scope.onDebitPaged = function(pageIndex) {
                loadFinanceLog(pageIndex, function(result) {
                    $scope.myDebitListData = result.data.data;
                    $scope.pagedDebitOptions.total = result.data.pageInfo.totalCount;
                });
            }
            if ($location.path() === '/customer/myfinancedetail/recharge' || $location.path() === '/customer/myfinancedetail/debit') {
                loadFinanceLog(1, function(result) {
                    if (operationType === 1) {
                        $scope.myfinanceListData = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    } else if (operationType === 2) {
                        $scope.myDebitListData = result.data.data;
                        $scope.pagedDebitOptions.total = result.data.pageInfo.totalCount;
                    }
                });
            }

        }
    ]);