'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseEditshelfCtrl
 * @description
 * # WarehouseEditshelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseEditshelfCtrl', ['$scope', '$location',
      function ($scope, $location) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.cancelEdit = function () {
              $location.path('/warehouse/shelf');
          }
      }]);
