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
            $scope.warehouseList = [];
            // 默认禁用
            $scope.setListDefault = function(list) {
                list.forEach(function(item){
                    item.itemStatus = "2"
                    if (item.children){
                        item.children.forEach(function(item3) {
                            item.itemStatus = "2"
                        })
                    }
                })
            }
            
            $scope.initList = function () {
                warehouseService.getWarehouse(function (result) {
                    var warehouse = {
                        name: '发货仓库',
                        children: []
                    }
                    warehouse.children = result;
                    $scope.warehouseList.push(warehouse);
                    $scope.setListDefault($scope.warehouseList);
                    channelService.getAllChannelList(function (result) {
                        $scope.carrierList = result.data.data;
                        $scope.setListDefault($scope.carrierList);
                        shipService.getGoodCategory(function (result){
                            $scope.goodCategoryList = result.data;
                            $scope.setListDefault($scope.goodCategoryList);
                            if ($scope.form) {
                                $scope.getValidWarehouseList();
                                $scope.getValidCarrierList();
                                $scope.getValidCategoryList();
                            } 
                        }); 
                    });
                });  
            }
            $scope.initList();

            $scope.getValidWarehouseList = function () {
                if ($scope.form.warehouseList) {
                    $scope.form.warehouseList.forEach(function(item){
                        $scope.warehouseList[0].children.forEach(function(item2){
                            if (item2.warehouseNumber == item.warehouseNumber){
                                item2.itemStatus = "1"
                                $scope.warehouseList[0].itemStatus = "1"
                                $scope.warehouseList[0].close = true;
                            }
                        })
                    })
                }
            }

            $scope.getValidCarrierList = function () {
                if ($scope.form.carrierList) {
                    $scope.form.carrierList.forEach(function(item){
                        $scope.carrierList.forEach(function(item2){
                            if (item.channelId == item2.channelId){
                                item2.itemStatus = "1"
                            }
                        })
                    })
                }
            }

            $scope.getValidCategoryList = function () {;
                if ($scope.form.categoryList) {
                    $scope.form.categoryList.forEach(function(item){
                        if ($scope.goodCategoryList){
                            $scope.goodCategoryList.forEach(function(item2){
                                if (item.itemCategory == item2.cateid){
                                    item2.itemStatus = "1"
                                    return
                                }
                                if (item2.children){
                                    item2.children.forEach(function(item3) {
                                        if (item.itemCategory == item3.cateid){
                                            item3.itemStatus = "1"
                                            return
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }

            // true - "1" false - "0"
            var valTrans = function(value) {
                switch(value){
                    case true:
                       return 1
                    case false:
                       return 0
                    default:
                       return 0
                }
            }
            // "1" - true "0" - false
            var transVal = function(value) {
                switch(value){
                    case 1:
                       return true
                    case 0:
                       return false
                    default:
                       return false
                }
            }

            // update时
            $scope.initData = function() {
                // 计算规则
                if ($scope.form.shipFeeList) {
                    if ($scope.form.shipFeeList.length > 0) {
                        var shipFeeList = $scope.form.shipFeeList
                        shipFeeList.forEach(function(item){
                            // 普通客户
                            if (item.isVip == 0) {
                                $scope.form.firstWeightRMB = item.firstWeight
                                $scope.form.continuedWeightRMB = item.continuedWeight
                            } else {
                                if (item.currency === "RMB") {
                                    $scope.form.firstWeightRMBVip = item.firstWeight
                                    $scope.form.continuedWeightRMBVip = item.continuedWeight
                                } else if (item.currency === "USD") {
                                    $scope.form.firstWeightUSDVip = item.firstWeight
                                    $scope.form.continuedWeightUSDVip = item.continuedWeight
                                }
                            }
                        })
                    }
                }
                if ($scope.form.estimatedTime) {
                    var split1 = $scope.form.estimatedTime.indexOf("-");
                    $scope.form.estimatedTime1 = Number($scope.form.estimatedTime.substring(0,split1));
                    var split2 = $scope.form.estimatedTime.indexOf("个");
                    split1 = split1 + 1;
                    $scope.form.estimatedTime2 = Number($scope.form.estimatedTime.substring(split1,split2));
                }  
                $scope.form.needIDCard = transVal($scope.form.needIDCard);
                $scope.form.requireEnglish4Name = transVal($scope.form.requireEnglish4Name);
                $scope.form.requireEnglish4Address = transVal($scope.form.requireEnglish4Address);
            }

            if ($scope.form) {
                // $scope.flag = '1'
                $scope.flag = $location.search().flag;
                $scope.initData();
            } else {
                $scope.form = {
                    status: 1,
                    RMBExchangeRate: "7.00",
                    split_roundup: "0.10",
                    merge_roundup: "0.10",
                    taxIncluded: "0",
                    shipFeeList: [],
                    categoryList: [],
                    warehouseList: [],
                    carrierList: []
                }
            }

            /**
             * 新增转运服务
             * @return {[type]}      [description]
             */
            $scope.saveShipservice= function() {
                if (_shipserviceFilter() === false) {
                    return;
                } else {
                    $scope.getFormWarehouseList();
                    $scope.getFormCarrierList();
                    $scope.getFormCategoryList();
                    $scope.form.estimatedTime = $scope.form.estimatedTime1 + "-" + $scope.form.estimatedTime2 + "个工作日";
                    $scope.form.needIDCard = valTrans($scope.form.needIDCard);
                    $scope.form.requireEnglish4Name = valTrans($scope.form.requireEnglish4Name);
                    $scope.form.requireEnglish4Address = valTrans($scope.form.requireEnglish4Address);
                    shipService.createShipservice($scope.form, function(res) {
                        if (res.code == '000') {
                            plugMessenger.success("创建成功");
                            $location.path('/system/shipservicelist')
                        } else {
                            plugMessenger.success(" 创建失败：" + req.msg);
                        }
                    })
                }
            }

            //更新转运服务
            $scope.update = function() {
                if (_shipserviceFilter() === false) {
                    return;
                } else {
                    $scope.getFormWarehouseList();
                    $scope.getFormCarrierList();
                    $scope.getFormCategoryList();
                    $scope.form.estimatedTime = $scope.form.estimatedTime1 + "-" + $scope.form.estimatedTime2 + "个工作日";
                    $scope.form.needIDCard = valTrans($scope.form.needIDCard);
                    $scope.form.requireEnglish4Name = valTrans($scope.form.requireEnglish4Name);
                    $scope.form.requireEnglish4Address = valTrans($scope.form.requireEnglish4Address);

                    shipService.updateShipservice($scope.form, function(res) {
                        if (res.code == '000') {
                            plugMessenger.success("更新成功");
                            $location.path('/system/shipservicelist')
                        } else {
                            plugMessenger.success("更新失败" + req.msg);
                        }
                    })
                }
            }

            // 新增和更新数据选项
            var _shipserviceFilter = function () {
                if (!$scope.form.shipServiceName) {
                    plugMessenger.info("请输入服务名称!");
                    return false;
                }
                if (!$scope.form.serviceSummary) {
                    plugMessenger.info("请输入服务简介!");
                    return false;
                }
                if (!$scope.form.firstWeightRMB) {
                    plugMessenger.info("请输入普通用户人民币首重费用!");
                    return false;
                }
                if (!$scope.form.continuedWeightRMB) {
                    plugMessenger.info("请输入普通用户人民币续重费用!");
                    return false;
                }
                if (!$scope.form.firstWeightRMBVip) {
                    plugMessenger.info("请输入VIP用户人民币首重费用!");
                    return false;
                }
                if (!$scope.form.continuedWeightRMBVip) {
                    plugMessenger.info("请输入VIP用户人民币续重费用!");
                    return false;
                }
                if (!$scope.form.insuranceFeeRate) {
                    plugMessenger.info("请输入自购报费税率!");
                    return false;
                }
                if (!$scope.form.RMBExchangeRate) {
                    plugMessenger.info("请输入人民币汇率!");
                    return false;
                }
                if (!$scope.form.estimatedTime1) {
                    plugMessenger.info("请输入递送时间!");
                    return false;
                }
                if (!$scope.form.estimatedTime2) {
                    plugMessenger.info("请输入递送时间!");
                    return false;
                }
                if (!$scope.form.maxWeight) {
                    plugMessenger.info("请输入最大重量(磅)!");
                    return false;
                }
                if (!$scope.form.split_roundup) {
                    plugMessenger.info("请输入分箱进位>=!");
                    return false;
                }
                if (!$scope.form.merge_roundup) {
                    plugMessenger.info("请输入合箱进位>=!");
                    return false;
                }
                $scope.form.shipFeeList = [];
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
                return true;
            }

            //记录选项状态更改
            $scope.enableSubFunc = function(currentFunc, sign){
                if (!currentFunc)
                return;

                if (currentFunc.itemStatus === "1")
                    currentFunc.close = true;
                else{
                    currentFunc.close = false;
                }
                if(currentFunc.children && currentFunc.children.length > 0){
                    if (currentFunc.itemStatus == "1") {
                        currentFunc.close = true;
                        if (sign == "warehouseList") {
                            currentFunc.children.forEach(function (item) {
                                item.itemStatus = "1";
                            })
                        }
                    } else{
                        currentFunc.close = false;
                        currentFunc.children.forEach(function (item) {
                            item.itemStatus = "2";
                        })
                    }
                }
            };

            // 仓库启用列表
            $scope.getFormWarehouseList = function(){
                $scope.form.warehouseList = [];
                if (!$scope.warehouseList)
                    return false;
                for (var i = 0; i < $scope.warehouseList[0].children.length; i++){
                    if ($scope.warehouseList[0].children[i].itemStatus === "1") {
                        $scope.form.warehouseList.push($scope.warehouseList[0].children[i])
                    }      
                }   
            }

            // 渠道启用列表
            $scope.getFormCarrierList = function(){
                $scope.form.carrierList = [];
                if (!$scope.carrierList)
                    return false;
                for (var i = 0; i < $scope.carrierList.length; i++){
                    if ($scope.carrierList[i].itemStatus === "1")
                        $scope.form.carrierList.push($scope.carrierList[i])
                }              
            }

            // 商品主类别启用列表
            $scope.getFormCategoryList = function(){;
                $scope.form.categoryList = [];
                if (!$scope.goodCategoryList)
                    return false;
                for (var i = 0; i < $scope.goodCategoryList.length; i++){
                    if ($scope.goodCategoryList[i].itemStatus === "1"){ 
                        var item1 = {
                            itemCategory: ''
                        }  
                        item1.itemCategory = $scope.goodCategoryList[i].cateid
                        $scope.form.categoryList.push(item1);
                        if ($scope.goodCategoryList[i].children){
                            for (var j = 0; j < $scope.goodCategoryList[i].children.length; j++){
                                if ($scope.goodCategoryList[i].children[j].itemStatus === "1"){ 
                                    var item2 = {
                                        itemCategory: ''
                                    } 
                                    item2.itemCategory = $scope.goodCategoryList[i].children[j].cateid    
                                    $scope.form.categoryList.push(item2);
                                }
                            }
                        }
                    }                     
                }        
            }

            // 返回列表
            $scope.back = function() {
                $location.path('/system/shipservicelist').search({});
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