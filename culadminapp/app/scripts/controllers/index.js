'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MainIndexCtrlCtrl
 * @description
 * # IndexCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('IndexCtrl', ['$scope', function ($scope) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      $('.content-wrapper').css('min-height', $('.wrapper').outerHeight(true) - $('.top-bar').outerHeight(true));

      $scope.userInfo = null;
  }]);
