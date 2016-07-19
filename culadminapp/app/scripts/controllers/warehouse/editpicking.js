'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseEditpickingCtrl
 * @description
 * # WarehouseEditpickingCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseEditpickingCtrl', ['$scope', '$location',
      function ($scope, $location) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $scope.cancelEdit = function () {
              $location.path('/warehouse/picking');
          }
      }]);
