'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
  .directive('masterTopToolbar', ["$http", "userService", function ($http, userService) {
      return {
          templateUrl: "views/templates/master/top_tpl.html",
          restrict: 'E',
          replace: true,
          $scope: true,
          link: function postLink($scope, $element, attrs) {
              $scope.btnLogout = function () {
                  userService.logout(function () {
                      $scope.$root.userInfo = null;
                  });
              }
          }
      };
  }]);
