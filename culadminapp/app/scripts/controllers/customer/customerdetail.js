'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:CustomerDetailCtrl
 * @description
 * # CustomerDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('CustomerDetailCtrl', ["$scope", "$location", "customerService", "$window", "plugMessenger", "userService",
      function ($scope, $location, customerService, $window, plugMessenger, userService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.tpl_status = {
              editPoint: false
          }

          $scope.customerNumber = $location.search().customerNumber;
          customerService.getDetail($scope.customerNumber, function (result) {
              $scope.data = result;
          });

          $scope.btnSave = function () {
              var data = $scope.data;
              customerService.update($scope.data, function (result) {
                  if (!result.message) {
                      plugMessenger.success("保存成功");
                      $scope.btnPrev();
                  }
              });
          }

          $scope.btnResetPassword = function () {
              userService.resetPassword({
                  "emailAddress": $scope.data.emailAddress
              }, function (result) {
                  if (result.success == true) {
                      plugMessenger.success("密码重置成功");
                  }
              });
          }

          $scope.btnReference = function (action) {
              switch (action) {
                  case "clear":
                      //TODO: 取消推荐人
                      break;
              }
          }

          $scope.btnEditPoint = function () {
              customerService.updatePoint({
                  "customerNumber": $scope.data.customerNumber,
                  "myPoint": $scope.data.myPoint
                  //TODO: 积分调整理由?
              }, function (result) {
                  if (result.success == true) {
                      $scope.tpl_status.editPoint = false;
                      plugMessenger.success("积分调整成功");
                  }
              });
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $scope.btnClearReference = function () {
              customerService.clearReference($scope.data.customerNumber, function (result) {
                  if (result.success == true) {
                      $scope.data.reference = null;
                      plugMessenger.success("推荐关系已取消");
                  }
              });
          }
      }]);
