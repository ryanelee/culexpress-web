'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ChannelEditCtrl
 * @description
 * # ChannelEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('EditCategeryCtrl', ['$scope', '$location', '$window', 'plugMessenger', 'channelService', 'ItemService',
        function ($scope, $location, $window, plugMessenger, channelService, ItemService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];





            $scope.mainFlag = true;

            $scope.form = {};

            $scope.form = $location.search().item;
            console.log("form", $scope.form);
            // console.log("$scope.form.name",$scope.form.mainName);
            $scope.flag = $location.search().flag;
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
            $scope.back = function () {
                $location.path('/system/categerylist').search({});
            }


            $scope.changeMain = function () {
                $scope.mainFlag = !$scope.mainFlag;
            }

            ItemService.getItemCategoryList({}, function (result) {
                $scope.CategoryList = result.data.data;
                $scope.mainCategory = _.uniq(result.data.data, 'mainName');
                console.log("$scope.mainCategory",$scope.mainCategory)
            });




            /**
             * 保存渠道数据
             * @return {[type]}      [description]
             */
            $scope.saveCategory = function () {
                if (!$scope.mainFlag) {
                    var maxCategory = _.max($scope.mainCategory, function (stooge) { return stooge.mainSequence; });
                    console.log("maxCategory",maxCategory);
                    var mainItem = {}
                    mainItem.sequence = Number(maxCategory.mainSequence) + 1;
                    mainItem.parentid = null;
                    mainItem.name = $scope.form.newMainName;

                    var item = {}
                    item.sequence = $scope.form.sequence
                    item.name = $scope.form.name;
                    $scope.model = {
                        mainItem: mainItem,
                        item: item
                    }

                }else{
                    
                    console.log("3212345");
                    // return;
                    var item = {};
                    var updateItem = {};
                    item.sequence = $scope.form.sequence
                    item.name = $scope.form.name;



                    $scope.CategoryList.forEach(function(e){
                        if(e.parentid == $scope.form.parentid){
                            item.parentid = e.parentid;
                            if(e.parentid == $scope.form.parentid){
                                updateItem = angular.copy(e);
                            }
                        }
                    })
                    var tempCategoryList = $scope.CategoryList.filter(function(e){
                         return e.mainName == $scope.form.mainName
                    })
                    console.log("tempCategoryList",tempCategoryList)
                    var tempItem = _.max(tempCategoryList, function (e) { return e.sequence; });
                    console.log("tempItem",tempItem)
                    console.log("updateItem",updateItem)
                    updateItem.sequence = Number(tempItem.sequence) + 1;
                    $scope.model = {
                        updateItem: updateItem,
                        item: item
                    }
 
                }
                console.log($scope.model);
                // if (!$scope.form.channelName) {
                //     plugMessenger.info("请输入渠道名称!");
                //     return;
                // }
                // if (!$scope.form.clearAddress) {
                //     plugMessenger.info("请输入清关地址!");
                //     return;
                // } 
                // if (!$scope.form.channelDesc) {
                //     plugMessenger.info("请输入渠道描述!");
                //     return;
                // }
                // return;
                ItemService.insertItemCategory($scope.model , function (res) {
                    console.log("res",res);
                    if (res.data.code == '000') {
                        plugMessenger.success("创建成功");
                        $location.path('/system/categerylist')
                    } else {
                        plugMessenger.error("创建失败: "+res.data.msg);
                    }
                })
            }
            //更新仓库
            $scope.update = function () {
                ItemService.updateItemCategory($scope.form, function (res) {
                    if (res.data.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path('/system/categerylist')
                    } else {
                        plugMessenger.success("更新失败" + req.msg);
                    }
                })
            }

        }
    ]);