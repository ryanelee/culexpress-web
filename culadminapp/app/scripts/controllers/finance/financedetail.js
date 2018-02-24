'use strict';

/**
 * @ngdoc function 
 * @name culAdminApp.controller:FinanceDetailCtrl
 * @description  
 * # FinanceDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('FinanceDetailCtrl', ["$scope", "$location", "$filter", "$window", "customerService", "warehouseService", "plugMessenger",
        function ($scope, $location, $filter, $window, customerService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.data = {}
            $scope.customerNumber = $location.search().customerNumber;
            $scope.tpl_status = { date: Date.now() }

            customerService.getDetail($scope.customerNumber, function (result) {
                $scope.data.customer = result;
            });
            $scope.flag = 0;

            customerService.getUnpaid({
                customerNumber: $scope.customerNumber
            }, function (result) {
                $scope.flag = 1;
                $scope.data.unpaid = result;
            });


            $scope.btnPay = function (action) {

                switch (action) {
                    case "offline":
                        if (!$scope.data.unpaid) {
                            plugMessenger.info("准备中，请稍后几秒尝试");
                        }
                        $location.search({ customerNumber: $location.search().customerNumber, orderType: "offline", paid: $scope.data.unpaid.offLineCount });
                        $location.path("/finance/financedetail/pay");
                        break;
                    case "online":
                        if (!$scope.data.unpaid) {
                            plugMessenger.info("准备中，请稍后几秒尝试");
                        }
                        $location.search({ customerNumber: $location.search().customerNumber, orderType: "online", paid: $scope.data.unpaid.onLineCount });
                        $location.path("/finance/financedetail/pay");
                        break;
                    case "refund":
                        $location.search({ customerNumber: $location.search().customerNumber, orderType: "refund" });
                        $location.path("/finance/financedetail/pay");
                        break;
                    case "recharge":
                        $location.search({ customerNumber: $location.search().customerNumber, orderType: "refund" });
                        $location.path("/finance/financedetail/recharge");
                        break;
                }
            }


            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                    case "orderdetail":
                        $location.search({ orderNumber: item.orderNumber });
                        $location.path("/order/orderdetail");
                        break;
                }
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1); $window.history.back();
            }

            $("[id='tip_online_order']").popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "海淘订单只能通过客户余额支付，请确保客户账户余额足够支付，单笔订单支付请查看最近活动页面。"
            });
            $("[id='tip_offline_order']").popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "如果客户通过现金转账等方式支付费用，请点击手动支付按钮进行记录，单笔订单支付请查看最近活动页面。"
            });
        }
    ]);