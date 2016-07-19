'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseEditshippingCtrl
 * @description
 * # WarehouseEditshippingCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseEditshippingCtrl', ['$scope', '$location',
      function ($scope, $location) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $scope.cancelEdit = function () {
              $location.path('/warehouse/shipping');
          }
      }]);