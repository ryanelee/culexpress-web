'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:OrderdetailCtrl
 * @description
 * # OrderdetailCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
  .controller('QuestionDetailCtrl', ['$scope', 'Customer', 'OrderSvr', '$stateParams', '$state', '$location', 'SweetAlert',
      function ($scope, customer, orderSvr, $stateParams, $state, $location, SweetAlert) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          var currentUser = $scope.currentUser = $scope.$root.currentUser;

          var questionid = $stateParams.questionid;
          $scope.data = {};
          $scope.questionCatgories = [];
          $scope.questionWarehouses = [];


          var loadQuestionData = function () {
              customer
                 .getQuestionInfo(questionid)
                 .then(function (result) {
                     $scope.data = result.data;
                 });
          }

          if (questionid) {
              loadQuestionData();

              customer.getQuestionCategories()
                  .then(function (result) {
                      $scope.questionCatgories = result.data;
                  });
              orderSvr.getWarehouses()
                  .then(function (result) {
                      $scope.questionWarehouses = result.data;
                  });
          }
          $scope.submitMessage = function () {
              if ($scope.data.questionMessage) {
                  orderSvr
                      .saveMessage(questionid, $scope.data.questionMessage)
                      .then(function (result) {
                          if (result.data) {
                              SweetAlert.swal('提示', '留言成功.');
                              loadQuestionData();
                          }
                      }, function (result) {
                          if (result.data && result.data.message) {
                              SweetAlert.swal('错误', result.data.message, 'error');
                          }
                      });

              }
          }

      }]);
