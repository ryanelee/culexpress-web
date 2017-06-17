'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderdetailCtrl
 * @description 
 * # OrderdetailCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('QuestionDetailCtrl', ['$scope', 'Customer', 'OrderSvr', '$stateParams', '$state', '$location', 'AuthService',
        function($scope, customer, orderSvr, $stateParams, $state, $location, AuthService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            var currentUser = $scope.currentUser = AuthService.getUser();

            var questionid = $stateParams.questionid;
            $scope.data = {};
            $scope.data.questionMessageInfo = {};
            $scope.data._status = "";
            $scope.questionCatgories = [];
            $scope.questionWarehouses = [];

            $scope.imageArr = [];
            $scope.images;

            // $scope.$on('$viewContentLoaded', function () {
            //     loadFileinput();
            // });

            loadFileinput()

            function loadFileinput() {//初始化 fileinput
                $("#file2").fileinput({
                    language: 'zh',//设置语言
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/customermessage/uploadImage",//上传的地址
                    // uploadUrl: cul.apiPath + "/customermessage/uploadImage?customNumber=" + $scope.customNumber,//上传的地址
                    allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'],//接收的文件后缀
                    browseOnZoneClick: true,  //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 1,//同一时间上传的最小
                    maxFileCount: 1,//同一时间上传的最大数量
                    resizePreference: 'height',
                    overwriteInitial: false,
                    uploadLabel: "上传",
                    browseLabel: "选择图片",
                    dropZoneTitle: "点击",
                    dropZoneClickTitle: "选择图片",
                    browseClass: "btn btn-primary", //按钮样式
                    //showUpload: false, //是否显示上传按钮
                    showCaption: false,//是否显示标题
                    showUploadedThumbs: 'false',
                    resizeImage: true

                }).on('fileuploaded', function (event, data) {
                    $scope.imageArr.push(data.response.url);
                });
            }

            var loadQuestionData = function() {
                customer
                    .getQuestionInfo(questionid)
                    .then(function(result) {
                        $scope.data = result.data;
                        console.log($scope.data)
                        //Processing -- 处理中, Closed -- 已关闭, ForwardWH -- 转交仓库
                        if ($scope.data.status == "Processing") {
                            $scope.data._status = "处理中";
                        } else if ($scope.data.status == "Closed") {
                            $scope.data._status = "已关闭";
                        } else {
                            $scope.data._status = "转交仓库";
                        }
                    });
            }

            if (questionid) {
                loadQuestionData();

                customer.getQuestionCategories()
                    .then(function(result) {
                        $scope.questionCatgories = result.data;
                    });
                orderSvr.getWarehouses()
                    .then(function(result) {
                        $scope.questionWarehouses = result.data;
                    });
            }
            $scope.submitMessage = function() {
                // 处理上传图片
                $scope.imageArr.forEach(function (e, index) {
                    if (index == 0) {
                        $scope.images = e;
                    } else {
                        $scope.images = $scope.images + "," + e;
                    }
                })
                console.log("questionid")
                if ($scope.data.questionMessage) {
                    $scope.data.questionMessageInfo = {
                        orderMessageNumber: questionid,
                        messageContent: $scope.data.questionMessage,
                        images: $scope.images
                    }
                    console.log($scope.data.questionMessageInfo)
                    orderSvr
                        .saveMessageBack($scope.data.questionMessageInfo)
                        .then(function(result) {
                            if (result.data) {
                                alertify.alert('提示', '留言成功.');
                                loadQuestionData();
                            }
                        }, function(result) {
                            if (result.data && result.data.message) {
                                alertify.alert('错误', result.data.message, 'error');
                            }
                        });
                }
            }

        }
    ]);