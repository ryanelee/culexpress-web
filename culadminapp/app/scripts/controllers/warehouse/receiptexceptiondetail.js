'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptExceptionDetailCtrl
 * @description
 * # ReceiptExceptionDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptExceptionDetailCtrl', ['$scope', '$location', '$window', 'receiptService', 'plugMessenger', '$timeout',
      function ($scope, $location, $window, receiptService, plugMessenger, $timeout) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          receiptService.getExceptionDetail($location.search().exceptionNumber, function (result) {
              $scope.data = result;
              $scope.data._sendtype = receiptService.mapping.sendType($scope.data.sendtype);
              $scope.data._type = receiptService.mapping.type($scope.data.type);
              $scope.data._status = receiptService.mapping.status($scope.data.status);
          });

          $scope.btnOpenDetail = function (type, item) {
              switch (type) {
                  case "customerDetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
              }
          }

          $scope.btnAction = function (action) {
              switch (action) {
                  case "close":
                      receiptService.exceptionEdit({
                          customerNumber: $scope.data.customerNumber,
                          warehouseNumber: $scope.data.warehouseNumber,
                          exceptionNumber: $scope.data.exceptionNumber,
                          status: 2
                      }, function (result) {
                          if (result.success) {
                              plugMessenger.success("关闭成功");
                              $scope.btnPrev();
                          }
                      });
                      break;
              }
          }

          $scope.btnPrint = function (item) {
              switch ($scope.data.sendtype) {
                  case 1:   //寄送库存
                      $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
                      break;
                  case 2:   //海淘包裹
                      $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
                      break;
              }
          }

          $scope.btnPrev = function () {
              $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
          }
      }]);
