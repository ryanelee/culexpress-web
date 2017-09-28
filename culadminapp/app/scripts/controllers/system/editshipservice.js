'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ShipserviceEditCtrl
 * @description
 * # ShipserviceEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ShipserviceEditCtrl', ['$scope', '$location', '$window', 'plugMessenger','shipService',
        function($scope, $location, $window, plugMessenger, shipService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.form = {};

            $scope.form = $location.search().item;

            if ($scope.form) {
                // $scope.flag = '1'
                $scope.flag = $location.search().flag;
                console.log($scope.flag)
            } else {
                $scope.form = {
                    status: '1',
                    RMBExchangeRate: '7.00',
                    shipFeeList: [],
                    carrierList: []
                }
            }

            // 返回列表
            $scope.back = function() {
                $location.path('/system/shipservicelist').search({});
            }

            /**
             * 保存渠道数据
             * @return {[type]}      [description]
             */
            $scope.saveShipservice= function() {
                    if (!$scope.form.shipServiceName) {
                        plugMessenger.info("请输入服务名称!");
                        return;
                    }
                    if (!$scope.form.serviceSummary) {
                        plugMessenger.info("请输入服务简介!");
                        return;
                    }
                    if (!$scope.form.firstWeightRMB) {
                        plugMessenger.info("请输入普通用户人名币首重费用!");
                        return;
                    }
                    if (!$scope.form.continuedWeightRMB) {
                        plugMessenger.info("请输入普通用户人名币续重费用!");
                        return;
                    }
                    if (!$scope.form.firstWeightRMBVip) {
                        plugMessenger.info("请输入VIP用户人名币首重费用!");
                        return;
                    }
                    if (!$scope.form.continuedWeightRMBVip) {
                        plugMessenger.info("请输入VIP用户人名币续重费用!");
                        return;
                    }
                    if (!$scope.form.insuranceFeeRate) {
                        plugMessenger.info("请输入自购报费税率!");
                        return;
                    }
                    if (!$scope.form.RMBExchangeRate) {
                        plugMessenger.info("请输入人名币汇率!");
                        return;
                    }
                    if (!$scope.form.estimatedTime1) {
                        plugMessenger.info("请输入递送时间!");
                        return;
                    }
                    if (!$scope.form.estimatedTime2) {
                        plugMessenger.info("请输入递送时间!");
                        return;
                    }
                    if (!$scope.form.maxWeight) {
                        plugMessenger.info("请输入最大重量(磅)!");
                        return;
                    }
                    if (!$scope.form.split_roundup) {
                        plugMessenger.info("请输入分箱进位>=!");
                        return;
                    }
                    if (!$scope.form.merge_roundup) {
                        plugMessenger.info("请输入最大重量(磅)!");
                        return;
                    }
                    if (!$scope.form.split_roundup) {
                        plugMessenger.info("请输入合箱进位>=!");
                        return;
                    }
                    
                    // 普通客户人民币
                    let item1 = {
                        isVip: 0,
                        firstWeight: $scope.form.firstWeightRMB,
                        continuedWeight: $scope.form.continuedWeightRMB,
                        currency: 'RMB'
                    }
                    $scope.form.shipFeeList.push(item1)
                    // VIP客户人民币
                    let item2 = {
                        isVip: 1,
                        firstWeight: $scope.form.firstWeightRMBVip,
                        continuedWeight: $scope.form.continuedWeightRMBVip,
                        currency: 'RMB'
                    }
                    $scope.form.shipFeeList.push(item2)
                    // Vip客户美元
                    let item3 = {
                        isVip: 1,
                        firstWeight: $scope.form.firstWeightUSDVip,
                        continuedWeight: $scope.form.continuedWeightUSDVip,
                        currency: 'USD'
                    }
                    $scope.form.shipFeeList.push(item3)
                    shipService.createShipservice($scope.form, function(res) {
                        if (res.code == '000') {
                            plugMessenger.success("创建成功");
                            $location.path('/system/shipservicelist')
                        } else {
                            plugMessenger.success(" 创建失败：" + req.msg);
                        }
                    })
                }
                //更新仓库
            $scope.update = function() {
                shipService.updateChannel($scope.form, function(res) {
                    if (res.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path('/system/channelist')
                    } else {
                        plugMessenger.success("更新失败" + req.msg);
                    }
                })
            }

            $('#tip_RMB').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "每1美元兑换人民币汇率"
            });

            $('#tip_fweight').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "每分箱一次计入运费的箱子重量"
            });

            $('#tip_split').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "分箱小数点进位标准(>=x)"
            });

            $('#tip_merge').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "合箱小数点进位标准(>=x)"
            });
        }
    ]);