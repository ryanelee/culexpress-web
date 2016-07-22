'use strict';

angular
    .module('culwebApp')
    .controller('MyQuestionsController', ['$scope', '$state', 'Customer', 'OrderSvr', 'SweetAlert',
    function ($scope, $state, customer, orderSvr, SweetAlert) {

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
                    $scope.model.messageType = result.data[0].typeID;
                });
            orderSvr.getWarehouses().then(function (result) {
                $scope.questionWarehouses = [result.data[2]];//TODO这里暂时只获取了OR仓库
                $scope.model.receivedWarehouseNumber = result.data[2].warehouseNumber;
            });
        }

        loadQuestionList();

        $scope.onPaged = function (pageIndex) {
            loadQuestionList(pageIndex);
        }
        $scope.redirectToDetail = function (questionItem) {
            $state.go('customer.questiondetail', { questionid: questionItem.messageNumber });
        }

        $scope.deleteQuestion = function (number) {
            if (!number) return false;
            SweetAlert.swal({
                title: "确定要删除问题[" + number + "]?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    customer.delQuestion(number)
                        .then(function (result) {
                            if (result.data.success) {
                                SweetAlert.swal('提示', '删除成功.', 'success');
                                loadQuestionList();
                            }
                        }, function (result) {
                            if (result.data.message) {
                                SweetAlert.swal('错误', result.data.message, 'error');
                            }
                        });

                }
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
            if (!model.message) {
                SweetAlert.swal('提示', '请您先填写问题详细描述。', 'warning');
                return false;
            }

            customer.addQuestion($scope.model).then(function (result) {
                if (!!result.data.messageNumber) {
                    SweetAlert.swal('提示', '问题已经提交成功，我们将尽快为您处理.', 'success');
                    $state.go('customer.myquestions');
                }
            }, function (result) {
                if (result.data && result.data.message) {
                    SweetAlert.swal('错误', result.data.message, 'error');
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
        /* end add question*/

    }]);