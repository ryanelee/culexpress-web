'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:UserEditCtrl
 * @description
 * # UserEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseListCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          warehouseService.getWarehouse(function(data){
              console.log('data')
              console.log(data)
          })

          // 返回列表
          $scope.back = function () {
              $location.path('/system/warehouselist').search({});
          }
      }]);
