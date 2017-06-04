'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderdetailCtrl
 * @description
 * # OrderdetailCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('OrderdetailCtrl', ['$scope', '$rootScope', 'OrderSvr', '$stateParams', '$state', '$location', 'AuthService',
        function($scope, $rootScope, orderSvr, $stateParams, $state, $location, AuthService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.imageArr = [];
            $scope.images;

            // $scope.$on('$viewContentLoaded', function () {
            //     loadFileinput();
            // });

            loadFileinput()

            function loadFileinput() {//初始化 fileinput
                $("#file1").fileinput({
                    language: 'zh',//设置语言
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/customermessage/uploadImage",//上传的地址
                    // uploadUrl: cul.apiPath + "/customermessage/uploadImage?customNumber=" + $scope.customNumber,//上传的地址
                    allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'],//接收的文件后缀
                    browseOnZoneClick: true,  //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 1,//同一时间上传的最小
                    maxFileCount: 10,//同一时间上传的最大数量
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
            var orderId = $stateParams.id;


            AuthService.getCustomerMessage({ customerNumber: AuthService.getUser().customerNumber }).then(function(result) {
                $scope.currentUser = result.data
            })

            $scope.data = {};
            $scope.data.orderMessageInfo = {};
            if (orderId) {
                orderSvr
                    .getOrderInfo(orderId)
                    .then(function(result) {
                        $scope.data = result.data;
                        // console.log($scope.data)
                        loadOrderMessage();
                    });
            }

            
            $scope.redirectToTrack = function() {
                if (orderId) {
                    $location.path('/ordertracking/' + orderId);
                }
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
                if ($scope.data.orderMessage) {
                    $scope.data.orderMessageInfo = {
                        orderMessageNumber: $scope.data.orderMessageNumber,
                        messageContent: $scope.data.orderMessage,
                        images: $scope.images
                    }
                    console.log($scope.data.orderMessageInfo)
                    orderSvr
                        .saveMessage($scope.data.orderMessageInfo)
                        .then(function(result) {
                            if (result.data) {
                                alertify.alert('提示', '留言成功.');
                                loadOrderMessage();
                            }
                        }, function(result) {
                            if (result.data && result.data.message) {
                                alertify.alert('错误', result.data.message, 'error');
                            }
                        });

                }
            }
            $scope.orderMessages = [];
            var loadOrderMessage = function() {
                orderSvr
                    .getMessage($scope.data.orderMessageNumber)
                    .then(function(result) {
                        if (result.data) {
                            $scope.orderMessages = result.data.messageLogs;
                        }
                    })

            }

            $scope.deleteOrder = function(number) {
                if (!number) return false;

                alertify.confirm('确认', '确定要取消订单[' + number + ']?',
                    function() {
                        orderSvr.deleteOrder(number)
                            .then(function(result) {
                                if (result.data.success) {
                                    alertify.success('取消订单成功.');
                                    returnToOrderList();
                                }
                            }, function(result) {
                                if (result.data.message) {
                                    alertify.alert('错误', result.data.message, 'error');
                                    returnToOrderList();
                                }
                            });
                    },
                    function() {
                        alertify.error('已放弃取消订单!');
                    });
            }

            $scope.payOrder = function(orderItem) {
                if (!orderItem) return false;
                if (!orderItem.totalCount) {
                    alertify.alert('提示', '订单还未计价,不能支付!', 'warning');
                    return false;
                }
                //运费不足状态下支付，扣除所欠费用即可
                if (orderItem.orderStatus == "Arrears") {
                    // orderItem.totalCount = orderItem.shippingFeeAdjust
                    orderItem.totalCount = Math.abs(orderItem.shippingFeeAdjust)
                }

                if ($scope.currentUser.accountBalance < orderItem.totalCount) {
                    alertify.alert('提示', '您需要支付' + orderItem.totalCount + '元，但您的余额已不足，为' + $scope.$root.currentUser.accountBalance + ',请先充值!', 'warning');
                    return false;
                }

                alertify.confirm('确认', '您将被扣款' + orderItem.totalCount + '元，确定支付订单?',
                    function() {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });

                        var currentUser = AuthService.getUser();

                        orderSvr.paymentOrder(orderItem.orderNumber)
                            .then(function(result) {
                                if (result.data.success) {
                                    alertify.success('支付成功.');

                                    //支付之后刷新一下全局余额
                                    $scope.$root.autologin(function(result) {
                                        if (currentUser) {
                                            currentUser.accountBalance = result.accountBalance;
                                        }
                                        return false;
                                    });


                                    returnToOrderList();
                                }

                            }, function(result) {
                                if (result.data.message) {
                                    alertify.alert('错误', result.data.message, 'error');
                                }
                            });
                    },
                    function() {
                        alertify.error('已取消支付订单!');
                    });
            }


            var returnToOrderList = function() {
                $state.go('customer.myorders');
            }



            $scope.redirectToAddressInfo = function(addressItem) {
                $state.go('customer.myaddress', { addressId: addressItem.addressNumber });
            }

        }
    ]);