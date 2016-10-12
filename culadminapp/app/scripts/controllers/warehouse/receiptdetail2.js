'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptDetail2Ctrl
 * @description
 * # ReceiptDetail2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptDetail2Ctrl', ['$scope', '$location', '$window', 'receiptService', 'plugMessenger', '$timeout',
      function ($scope, $location, $window, receiptService, plugMessenger, $timeout) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;
          $scope.tempReceiptNumber = $location.search().receiptNumber;

          receiptService.getDetail($scope.tempReceiptNumber, function (result) {
              $scope.data = null;
              if (!result.message) {
                  $scope.data = result;
              }
          });

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $scope.btnOpenDetail = function (item, type) {
              switch (type) {
                  case "customerDetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
              }
          }

          $scope.btnPrint = function (item) {
              switch ($scope.data.sendType) {
                  case 1:   //寄送库存
                      break;
                  case 2:   //海淘包裹
                      break;
              }
          }
      }]);
