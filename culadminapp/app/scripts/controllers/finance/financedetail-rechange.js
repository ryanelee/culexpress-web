﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceDetailPayCtrl
 * @description
 * # FinanceDetailPayCtrl
 * Controller of the culAdminApp 
 */
angular.module('culAdminApp')
    .controller('FinanceDetailRechangeCtrl', ["$scope", "$location", "$filter", "$window", "customerService", "warehouseService", "plugMessenger", "orderService",
        function($scope, $location, $filter, $window, customerService, warehouseService, plugMessenger, orderService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = {
                rechargeChannel: "4",
                memo: ""
            }

            $scope.search = {};
            $scope.maxTotal

            $scope.checkOrderNumber = function() {
                $scope.maxTotal = 0;
                $scope.search.customerNumber = $scope.data.customer.customerNumber;
                if (!$scope.search.orderNumber) {
                    plugMessenger.error("订单编号必须填写");
                    return;
                }
                $scope.flag = '0'
                orderService.checkOrderNumber($scope.search).then(function(result) {
                    if (result.data.code == '999') {
                        $scope.search.orderNumber = "";
                        plugMessenger.error(result.data.msg);
                        return;
                    }
                    if (result.data.code == '000') {
                        //console.log(result.data);
                        $scope.tmpData = {};
                        $scope.tmpData = result.data.data[0]
                        $scope.data.tempCustomerNumber = result.data.data[0].customerNumber
                        $scope.maxTotal = $scope.tmpData.paied;
                    }
                })
            }


            $scope.tpl_status = {
                customerNumber: $location.search().customerNumber,
                orderNumber: $location.search().orderNumber,
                packageNumber: $location.search().packageNumber,
                orderType: $location.search().orderType,
                fee: $location.search().paid,
                date: Date.now()
            }

            $scope.reloadPaymentDetail = function() {
                $scope.data.fee = $scope.tpl_status.fee;
            }

            switch ($scope.tpl_status.orderType) {
                case "offline":
                    $scope.tpl_status._orderType = { "sortTitle": "手动", "title": "手动支付", "orderType": "线下订单", "helper": "批量手动支付不支持支付部分费用，请通过最近活动页面手动支付单笔订单。" };
                    $scope.reloadPaymentDetail();
                    break;
                case "online":
                    $scope.tpl_status._orderType = { "sortTitle": "余额", "title": "余额支付", "orderType": "海淘订单", "helper": "批量余额支付不支持支付部分费用，请通过最近活动页面余额支付单笔订单。" };
                    $scope.reloadPaymentDetail();
                    break;
                case "refund":
                    $scope.tpl_status._orderType = { "sortTitle": "退款", "title": "退还运费", "orderType": "退还运费", "helper": "退还金额将充值到客户账户余额中。" };
                    break;
            }

            customerService.getDetail($scope.tpl_status.customerNumber, function(result) {
                $scope.data.customer = result;
            });


            $scope.btnSave = function() {
                // if ($scope.data.fee <= 0) {
                //     plugMessenger.info("请填写正确的金额（金额必须大于0元）");
                //     return;
                // }
                if ($scope.data.memo == "") {
                    plugMessenger.info("请填写支付备注信息");
                    return;
                }

                var operationType = "3";//金额大于0视为赠送
                if($scope.data.fee < 0)
                    operationType = "1";//金额小于

                customerService.refundRecharge({
                    "customerNumber": $scope.tpl_status.customerNumber,
                    "operationType": operationType, //固定不动，4代表退运费
                    "memo": $scope.data.memo,
                    "payment": $scope.data.fee //支付金额
                }, function(result) {
                    if (!result.message) {
                        plugMessenger.success("充值成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
            }

            $("[id='tip_pay_fee']").popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: $scope.tpl_status._orderType.helper
            });
        }
    ]);