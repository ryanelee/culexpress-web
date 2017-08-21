'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:EditChannelCtrl
 * @description
 * # EditChannelCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('EditChannelCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
        function($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.form = {};

            $scope.form = $location.search().item;

            if ($scope.form) {
                $scope.flag = '1'
            } else {
                $scope.form = {
                    status: '1'
                }
            }

            // 返回列表
            $scope.back = function() {
                $location.path('/system/channelist').search({});
            }

            /**
             * 保存渠道数据
             * @return {[type]}      [description]
             */
            $scope.saveChannel= function() {
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
                        if (!res.message) {
                            plugMessenger.success("保存成功");
                            $location.path('/system/channelist')
                        }
                    })
                }
                //更新仓库
            $scope.update = function() {
                warehouseService.updateChannel($scope.form, function(res) {
                    if (res.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path('/system/channelist')
                    } else {
                        plugMessenger.success("更新失败" + req.msg);
                    }
                })
            }

        }
    ]);