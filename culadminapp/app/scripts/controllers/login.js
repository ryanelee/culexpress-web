'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$element", "userService", "plugMessenger",
      function ($scope, $rootScope, $element, userService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.model = {
              username: "",
              password: "",
              remember: false
          }

          $scope.btnLogin = function () {
              userService.login($scope.model,
              function (errorMessage) {
                  //success message
                  if (!errorMessage) plugMessenger.success("登录成功");
                  $rootScope.$broadcast("refresh.menus");
              });
          }
      }]);
