'use strict';

angular
    .module('culwebApp')
    .controller('MyQuestionsController', ['$scope', '$state', 'Customer', 'OrderSvr', 
        function ($scope, $state, customer, orderSvr) {

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
                $state.go('customer.questiondetail', { questionid: questionItem.messageNumber });
            }

            $scope.deleteQuestion = function (number) {
                if (!number) return false;
                alertify.confirm('确认','确定要删除问题[' + number + ']?', 
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
                },function(){
                    alertify.error('已取消删除!');
                });
            }



            /* add question*/

            var model = $scope.model = {
                customerNumber: currentUser.customerNumber,
                messageType: null,
                receivedWarehouseNumber: null,
                receiveTrackingNumber: '',
                orderNumber: '',
                deliveryTrackingNumber: '',
                message: ''
            };


            $scope.submitQuestion = function () {
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