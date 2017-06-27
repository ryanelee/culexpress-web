'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:IdAuthCtrl
 * @description
 * # IdAuthCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('IdAuthCtrl', ["$scope", "$location", "addressService", "plugMessenger", "$rootScope", "$compile", "customerMessageService", "storage",
        function ($scope, $location, addressService, plugMessenger, $rootScope, $compile, customerMessageService, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            console.log(1234567)
            console.log($location.search().authType);
        }]);