'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceDetailInstructionCtrl
 * @description
 * # FinanceDetailInstructionCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('FinanceDetailInstructionCtrl', ["$scope", "$location", "$filter", "customerService", "settlementService", "plugMessenger",
      function ($scope, $location, $filter, customerService, settlementService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.data = [];
          $scope.customerNumber = $location.search().customerNumber;

          customerService.getDetail($scope.customerNumber, function (result) {
              $scope.customer = result;
          });

          settlementService.instruction({ "customerNumber": $scope.customerNumber }, function (result) {
              $scope.data = result;
          });
      }]);
