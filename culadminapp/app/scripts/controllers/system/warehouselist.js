'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysRoleEditCtrl
 * @description
 * # SysRoleEditCtrl
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
          // 新建仓库
          $scope.addWarehouse = function () {
              $location.path('/system/editwarehouse').search({});
          }
          // 修改仓库
          $scope.edit = function (id) {
              $location.path('/system/editwarehouse').search({ groupId: id });
          }
          // 返回列表
          $scope.back = function () {
              //$location.path('/system/rolelist');
              $window.history.back();
          }
  
          

      }]);
