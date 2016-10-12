'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryDetailCtrl
 * @description
 * # WarehouseInventoryDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseInventoryDetailCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger',
      function ($scope, $location, $window,  inventoryService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          $scope.tempItemNumber = $location.search().itemNumber || "";

          var _timeout = null;
          $scope.checkItemNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempItemNumber) {
                          inventoryService.getInfo($scope.tempItemNumber, function (result) {
                              if (!!result) {
                                  $scope.data = result;
                              }
                              $scope.tempItemNumber = "";
                              console.log($scope.data);
                          });
                      } else {
                          $scope.tempItemNumber = "";
                      }
                  })
              }, 1000);
          }

          $scope.checkItemNumber();

          $scope.btnOpenDetail = function (item, type) {
              switch (type) {
                  case "customerdetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
              }
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }
      }]);
