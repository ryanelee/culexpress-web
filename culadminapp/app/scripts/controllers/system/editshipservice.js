'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ShipserviceEditCtrl
 * @description
 * # ShipserviceEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ShipserviceEditCtrl', ['$scope', '$location', '$window', 'plugMessenger','channelService',
        function($scope, $location, $window, plugMessenger, channelService) {
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
                    status: '1'
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
                    if (!$scope.form.channelName) {
                        plugMessenger.info("请输入渠道名称!");
                        return;
                    }
                    if (!$scope.form.clearAddress) {
                        plugMessenger.info("请输入清关地址!");
                        return;
                    }
                    if (!$scope.form.channelDesc) {
                        plugMessenger.info("请输入渠道描述!");
                        return;
                    }
                    channelService.createChannel($scope.form, function(res) {
                        if (res.code == '000') {
                            plugMessenger.success("创建成功");
                            $location.path('/system/channelist')
                        } else {
                            plugMessenger.success(" 创建失败：" + req.msg);
                        }
                    })
                }
                //更新仓库
            $scope.update = function() {
                channelService.updateChannel($scope.form, function(res) {
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