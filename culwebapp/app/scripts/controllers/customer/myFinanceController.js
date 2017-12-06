
'use strict';

angular
    .module('culwebApp')
    .controller('MyFinanceController', ['$scope', '$stateParams', '$window', '$location', 'Customer', 'AuthService',
        function ($scope, $stateParams, $window, $location, customer, AuthService) {
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
                .then(function (result) {
                    $scope.currentUser.accountBalance = result.data.accountBalance;
                    AuthService.setUser($scope.currentUser);
                });

            // customer.getFinanceLog(1, $scope.currentUser.customerNumber, 1,100)
            //     .then(function (result) {
            //         if(result && result.data && result.data.data && result.data.data.length > 0){
            //             let alipay_eligible_refund = [];
            //             $.each(result.data.data,function(){
            //                 if(this.operationType == '充值' && this.status == 1 
            //                     && this.alipay_trade_status == 'TRADE_FINISHED' && this.alipay_currency == 'RMB'
            //                     && (Math.abs(new Date(Date.now()).getMonth() - (new Date(this.indate)).getMonth() ) < 3) ){
            //                         alipay_eligible_refund.push({
            //                             alipay_total_fee: this.alipay_total_fee,
            //                             alipay_trade_no: this.alipay_trade_no
            //                         });
            //                 }
            //             });

            //             $scope.alipay_eligible_refund = alipay_eligible_refund;
            //         }
            // });

            var model = $scope.model = {

            },
                operationType = 1;

            if ($scope.currentTabId === 'debit') {
                operationType = 2;
            }

            $scope.userPay = function () {
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

            function isInt(n){
                if(n !== n) return false;
                return parseInt(n) === n || n % 1 !== 0;
            }

            $scope.preApplyRefund_success = false;
            $scope.preApplyRefund = function () {
                $scope.preApplyRefund_success = false;

                var currentCustomer = AuthService.getUser();
                if (!currentCustomer) {
                    alertify.alert('提醒', '请先登录.', 'warning');
                    return false;
                }

                if (!model.refundAmount) {
                    alertify.alert('提醒', '请输入退款金额.', 'warning');
                    return false;
                }

                var parsedRefundAmount = parseFloat(model.refundAmount);

                if (!isInt(parsedRefundAmount)) {
                    alertify.alert("实际退款金额格式不正确,请输入数字金额");
                    return false;
                }
                if (parsedRefundAmount < 100) {
                    alertify.alert('提醒', '退款金额不能小于100', 'warning');
                    return false;
                }
                if ($scope.currentUser.accountBalance < 120) {
                    alertify.alert('提醒', '您账户余额至少需要￥120: 最小退款金额￥100, 单次退款手续费￥20.', 'warning');
                    return false;
                }
                
                if (parsedRefundAmount + 20 > $scope.currentUser.accountBalance) {
                    alertify.alert('提醒', '您账户余额至少需要￥' + parseFloat(parsedRefundAmount + 20).toFixed(2) + ': 申请退款金额￥'+ parsedRefundAmount.toFixed(2) + ',单次退款手续费￥20.', 'warning');
                    return false;
                }

                $scope.preApplyRefund_success = true;
            };

            $scope.applyRefund = function () {
                var currentCustomer = AuthService.getUser();
                if (!currentCustomer) {
                    alertify.alert('提醒', '请先登录.', 'warning');
                    return false;
                }
                if(!model.alipayAccount){
                    alertify.alert('提醒', '请输入支付宝账号.', 'warning');
                    return false;
                }
                if(!model.alipayAccountRepeat){
                    alertify.alert('提醒', '请再输入一次支付宝账号.', 'warning');
                    return false;
                }
                if(model.alipayAccount.trim().toLowerCase() !== model.alipayAccountRepeat.trim().toLowerCase()){
                    alertify.alert('提醒', '两次输入的支付宝账号不一致,请重新输入', 'warning');
                    return false;
                }
                if(!model.acceptTerms){
                    alertify.alert('提醒', '请勾选选择框确认输入了正确的支付宝账号', 'warning');
                    return false;
                }
                if (!model.refundAmount) {
                    alertify.alert('提醒', '请输入退款金额.', 'warning');
                    return false;
                }
                var parsedRefundAmount = parseFloat(model.refundAmount);
                
                if (!isInt(parsedRefundAmount)) {
                    alertify.alert("实际退款金额格式不正确,请输入数字金额");
                    return false;
                }
                if (parsedRefundAmount < 100) {
                    alertify.alert('提醒', '退款金额不能小于100', 'warning');
                    return false;
                }
                if ($scope.currentUser.accountBalance < 120) {
                    alertify.alert('提醒', '您账户余额至少需要￥120: 最小退款金额￥100, 单次退款手续费￥20.', 'warning');
                    return false;
                }

                if (parsedRefundAmount + 20 > $scope.currentUser.accountBalance) {
                    alertify.alert('提醒', '您账户余额至少需要￥' + parseFloat(parsedRefundAmount + 20).toFixed(2) + ': 申请退款金额￥'+ parsedRefundAmount.toFixed(2) + ',单次退款手续费￥20.', 'warning');
                    return false;
                }
                // if( !$scope.alipay_eligible_refund || $scope.alipay_eligible_refund.length < 1){
                //     alertify.alert('提醒', '您没有近期支付宝充值交易,暂时无法提交提款申请.请联系客户.', 'warning');
                //     return false;
                // }

                // var alipay_batch_amount = 0;
                // var alipay_batch_no = 0;
                // var alipay_detail_data = '';
                
                // $.each($scope.alipay_eligible_refund, function(){
                //     if(alipay_batch_amount >= model.refundAmount) return false;
                //     if(!this.alipay_trade_no) return false;

                //     var alipay_detail_refundAmount = this.alipay_total_fee;
                //     if(alipay_detail_refundAmount + alipay_batch_amount > model.refundAmount){
                //         alipay_detail_refundAmount = model.refundAmount - alipay_batch_amount;
                //     }
                //     alipay_detail_data += this.alipay_trade_no.trim() + '^' + alipay_detail_refundAmount + '^' + '协商退款#';
                //     alipay_batch_amount += this.alipay_total_fee;                    
                //     alipay_batch_no += 1;
                // });

                // if( alipay_batch_amount < model.refundAmount){
                //     alertify.alert('提醒', '您近期支付宝充值交易总额为['+ alipay_batch_amount +']少于您期望的提款金额['+ model.refundAmount +'],请修改申请金额或请联系客户.', 'warning');
                //     return false;
                // }

                // alipay_detail_data = alipay_detail_data.slice(0,-1)//remove last #
                var data = [{
                    customerNumber: $scope.currentUser.customerNumber,
                    requestAmount: parsedRefundAmount.toFixed(2),
                    alipay_account: model.alipayAccount,
                    // alipay_batch_no: alipay_batch_no,
                    // alipay_detail_data: alipay_detail_data
                }];

                customer.saveWithdrawRequest(data)
                    .then(function (result) {
                        if(result && result.data && result.data.code === '000'){
                            // 提款申请成功后再关闭model
                            $('#withdraw_modal').modal('hide');
                            alertify.alert('提交成功', '成功提交提款申请,通过财务审核后将会返款到您的支付宝账号', 'success');
                        }
                    });
            }

            $scope.myWithdrawListData = [];
            var loadWithdrawList = function (index,callback) {
                customer.getWithdrawRquestList(index, 10, $scope.currentUser.customerNumber)
                    .then(function (result) {
                        callback && callback(result);
                    });
            }

            $scope.onWithdrawPaged = function (pageIndex) {
                loadFinanceLog(pageIndex, function () {
                    $scope.myWithdrawListData = result.data.data;
                    $scope.pagedOptions.total = result.data.data.pageInfo.totalCount;
                });
            }

            $scope.myfinanceListData = [];
            $scope.pagedDebitOptions = $scope.pagedOptions = {
                total: 0,
                size: 10
            }
            var loadFinanceLog = function (index, callback) {
                customer.getFinanceLog(index, $scope.currentUser.customerNumber, operationType)
                    .then(function (result) {
                        callback && callback(result);
                    });
            }


            $scope.onPaged = function (pageIndex) {
                loadFinanceLog(pageIndex, function () {
                    $scope.myfinanceListData = result.data.data;
                    $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                });
            }


            $scope.myDebitListData = []


            $scope.onDebitPaged = function (pageIndex) {
                loadFinanceLog(pageIndex, function (result) {
                    $scope.myDebitListData = result.data.data;
                    $scope.pagedDebitOptions.total = result.data.pageInfo.totalCount;
                });
            }
            if ($location.path() === '/customer/myfinancedetail/recharge' || $location.path() === '/customer/myfinancedetail/debit') {
                loadFinanceLog(1, function (result) {
                    if (operationType === 1) {
                        $scope.myfinanceListData = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    } else if (operationType === 2) {
                        $scope.myDebitListData = result.data.data;
                        $scope.pagedDebitOptions.total = result.data.pageInfo.totalCount;
                    }
                });
            }

            if ($location.path() === '/customer/mywithdrawrequest') {
                loadWithdrawList(1, function (result) {
                    $scope.myWithdrawListData = result.data.data.data;
                    $scope.pagedOptions.total = result.data.data.pageInfo.totalCount;
                });
            }

        }
    ]);