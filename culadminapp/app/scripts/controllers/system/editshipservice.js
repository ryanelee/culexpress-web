'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ShipserviceEditCtrl
 * @description
 * # ShipserviceEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ShipserviceEditCtrl', ['$scope', '$location', '$window', 'plugMessenger','shipService','warehouseService','channelService',
        function($scope, $location, $window, plugMessenger, shipService, warehouseService,channelService) {
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
            } else {
                $scope.form = {
                    status: "1",
                    RMBExchangeRate: "7.00",
                    split_roundup: "0.10",
                    merge_roundup: "0.10",
                    shipFeeList: [],
                    carrierList: [],
                    warehouseList: [],
                    channelList: []
                }
            }

            /**
             * 仓库列表
             */
            warehouseService.getWarehouse(function (result) {
                $scope.warehouseList = result;
                console.log($scope.warehouseList)
            });

            shipService.getGoodCategory(function (result){
                $scope.goodCategoryList = result.data;
            })

            channelService.getAllChannelList(function (result) {
                $scope.channelList = result.data.data;
            })
            // 返回列表
            $scope.back = function() {
                $location.path('/system/shipservicelist').search({});
            }

            /**
             * 新增转运服务
             * @return {[type]}      [description]
             */
            $scope.saveShipservice= function() {
                _shipserviceFilter();
                shipService.createShipservice($scope.form, function(res) {
                    if (res.code == '000') {
                        plugMessenger.success("创建成功");
                        $location.path('/system/shipservicelist')
                    } else {
                        plugMessenger.success(" 创建失败：" + req.msg);
                    }
                })
            }

            //更新转运服务
            $scope.update = function() {
                _shipserviceFilter();
                getFormWarehouseList();
                getFormChannelList();
                getFormCarrierList();
                shipService.updateShipservice($scope.form, function(res) {
                    if (res.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path('/system/shipservicelist')
                    } else {
                        plugMessenger.success("更新失败" + req.msg);
                    }
                })
            }

            // 新增和更新数据选项
            var _shipserviceFilter = function () {
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
                
                // 普通客户人民币
                var item1 = {
                    isVip: 0,
                    firstWeight: $scope.form.firstWeightRMB,
                    continuedWeight: $scope.form.continuedWeightRMB,
                    currency: 'RMB'
                }
                $scope.form.shipFeeList.push(item1)
                // VIP客户人民币
                var item2 = {
                    isVip: 1,
                    firstWeight: $scope.form.firstWeightRMBVip,
                    continuedWeight: $scope.form.continuedWeightRMBVip,
                    currency: 'RMB'
                }
                $scope.form.shipFeeList.push(item2)
                // Vip客户美元
                var item3 = {
                    isVip: 1,
                    firstWeight: $scope.form.firstWeightUSDVip,
                    continuedWeight: $scope.form.continuedWeightUSDVip,
                    currency: 'USD'
                }
                $scope.form.shipFeeList.push(item3)
                $scope.form.warehouseList = $scope.warehouseList
            }

            //记录选项状态更改
            $scope.enableSubFunc = function(currentFunc){
                if (!currentFunc)
                return;
                if (currentFunc.status == 1)
                    currentFunc.close = false;
                else{
                    currentFunc.close = true;
                }
            };

            // 仓库启用列表
            var getFormWarehouseList = function(){
                if (!$scope.warehouseList)
                    return;
                for (var i = 0; i < $scope.warehouseList.length; i++){
                    if ($scope.warehouseList[i].status == 1)
                        $scope.form.warehouseList.push($scope.warehouseList[i])
                }           
            }

            // 渠道启用列表
            var getFormChannelList = function(){
                if (!$scope.channelList)
                    return;
                for (var i = 0; i < $scope.channelList.length; i++){
                    if ($scope.channelList[i].status == 1)
                        $scope.form.channelList.push($scope.channelList[i])
                }              
            }

            // 商品主类别启用列表
            var getFormCarrierList = function(){
                if (!$scope.carrierList)
                    return;
                for (var i = 0; i < $scope.carrierList.length; i++){
                    if ($scope.carrierList[i].status == 1){
                        $scope.form.carrierList.push($scope.carrierList[i]);
                        $scope.form.carrierList[i].children = [];
                        for (var i = 0; j < $scope.carrierList[i].children.length; i++){
                            if ($scope.carrierList[i].children[j].status == 1){
                                $scope.form.carrierList[i].children.push($scope.carrierList[i].children[j]);
                            }
                        }
                    }                     
                }              
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