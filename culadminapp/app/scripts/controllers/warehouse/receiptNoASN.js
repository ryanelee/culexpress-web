'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptNoASNCtrl
 * @description
 * # ReceiptNoASNCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptNoASNCtrl', ['$scope', '$location', '$window', 'receiptService', 'plugMessenger', '$timeout',
      function ($scope, $location, $window, receiptService, plugMessenger, $timeout) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          

          $scope.btnPrev = function () {
              $window.history.back();
          }
      }]);
