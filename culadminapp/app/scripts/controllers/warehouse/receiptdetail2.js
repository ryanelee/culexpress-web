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
                 //console.log($scope.data);
              }
          });

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

          $scope.linkToShelfDetail = function (item) {
              $location.search({ shelfNumber: item.shelfNumber,warehouseNumber: item.warehouseNumber });            
              $location.path("/warehouse/shelfmanagementdetail");
          }

          $scope.btnPrint = function (item) {
              switch ($scope.data.sendType) {
                  case 1:   //寄送库存
                      $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item.receiptNumber });
                      break;
                  case 2:   //海淘包裹
                    //   $scope.$root.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: item.receiptNumber, number: 1 });
                    $scope.$broadcast("print-inboundPackage.action", item.receiptNumber);
                      break;
              }
          }
      }]);
