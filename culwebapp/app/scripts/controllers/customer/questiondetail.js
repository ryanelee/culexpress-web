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
            $scope.data._status = "";
            $scope.questionCatgories = [];
            $scope.questionWarehouses = [];


            var loadQuestionData = function() {
                customer
                    .getQuestionInfo(questionid)
                    .then(function(result) {
                        $scope.data = result.data;
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
                if ($scope.data.questionMessage) {
                    orderSvr
                        .saveMessage(questionid, $scope.data.questionMessage)
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