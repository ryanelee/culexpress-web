'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseEditpackageCtrl
 * @description
 * # WarehouseEditpackageCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseEditpackageCtrl', ['$scope', '$location',
      function ($scope, $location) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $scope.cancelEdit = function () {
              $location.path('/warehouse/package');
          }
      }]);

