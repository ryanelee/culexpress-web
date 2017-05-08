'use strict';

angular
    .module('culwebApp')
    .controller('MyQuestionsController', ['$scope', '$state', 'Customer', 'OrderSvr',
        function ($scope, $state, customer, orderSvr) {

            $scope.imageArr = [];
            $scope.images;

            $scope.$on('$viewContentLoaded', function () {
                loadFileinput();
            });

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

            var currentUser = $scope.currentUser = $scope.$root.currentUser;


            $scope.pagedOptions = {
                total: 0,
                size: 10
            }
            $scope.questionList = [];
            $scope.questionCatgories = [];
            $scope.questionWarehouses = [];
            var loadQuestionList = function (index) {
                customer
                    .getQuestionList(index, currentUser.customerNumber)
                    .then(function (result) {
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                        $scope.questionList = result.data.data;
                    });
                customer.getQuestionCategories()
                    .then(function (result) {
                        $scope.questionCatgories = result.data;
                        model.messageType = result.data[0].typeID;
                    });
                orderSvr.getWarehouses().then(function (result) {
                    $scope.questionWarehouses = result.data;
                    $scope.model.receivedWarehouseNumber = result.data[0].warehouseNumber;
                });
            }



            $scope.onPaged = function (pageIndex) {
                loadQuestionList(pageIndex);
            }
            $scope.redirectToDetail = function (questionItem) {
                customer.updateMessageOperation({ messageNumber: questionItem.messageNumber }).then(function(data) {
                    //console.log(data)
                    // $location.path('customer/question/' + item.messageNumber)
                     $state.go('customer.questiondetail', { questionid: questionItem.messageNumber });

                })
               
            }

            $scope.deleteQuestion = function (number) {
                if (!number) return false;
                alertify.confirm('确认', '确定要删除问题[' + number + ']?',
                    function () {
                        customer.delQuestion(number)
                            .then(function (result) {
                                if (result.data.success) {
                                    alertify.success('删除成功.');
                                    loadQuestionList();
                                }
                            }, function (result) {
                                if (result.data.message) {
                                    alertify.alert('错误', result.data.message, 'error');
                                }
                            });
                    }, function () {
                        alertify.error('已取消删除!');
                    });
            }



            /* add question*/

            var model = $scope.model = {
                customerNumber: currentUser.customerNumber,
                messageType: null,
                receivedWarehouseNumber: null,
                receiveTrackingNumber: '',
                deliveryTrackingNumber: '',
                message: ''
                // images:$scope.imageArr
            };


            $scope.submitQuestion = function () {
                $scope.imageArr.forEach(function (e, index) {
                    if (index == 0) {
                        $scope.images = e;
                    } else {
                        $scope.images = $scope.images + "," + e;
                    }
                })
                $scope.model.images = $scope.images;
                if (!$scope.model.message) {
                    alertify.alert('提示', '请您先填写问题详细描述。', 'warning');
                    return false;
                }

                customer.addQuestion($scope.model).then(function (result) {
                    if (!!result.data.messageNumber) {
                        alertify.alert('提示', '问题已经提交成功，我们将尽快为您处理.', 'success');
                        $state.go('customer.myquestions');
                    }
                }, function (result) {
                    if (result.data && result.data.message) {
                        alertify.alert('错误', result.data.message, 'error');
                    }
                });
            }


            $scope.resetForm = function () {
                $scope.model = {
                    customerNumber: currentUser.customerNumber,
                    messageType: $scope.questionCatgories[0].typeID,
                    receivedWarehouseNumber: $scope.questionWarehouses[0].warehouseNumber,
                    receiveTrackingNumber: '',
                    orderNumber: '',
                    deliveryTrackingNumber: '',
                    message: ''
                }
            }

            loadQuestionList();
            /* end add question*/







        }]);
