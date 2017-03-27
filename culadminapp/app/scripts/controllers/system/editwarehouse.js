'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:EditWarehouseCtrl
 * @description
 * # EditWarehouseCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('EditWarehouseCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
        function ($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            console.log('123456789')
            $scope.form = $location.search().item;
            console.log($scope.form);

            // warehouseService.getWarehouse(function (data) {
            //     console.log('data')
            //     console.log(data)
            // })
            // 提交表单的数据
            // $scope.form = {
            //     status: '1',
            //     type: 'P',
            //     freeStatus: '0'
            // }
            // 返回列表
            $scope.back = function () {
                $location.path('/system/warehouselist').search({});
            }
        }]);