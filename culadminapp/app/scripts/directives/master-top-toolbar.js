'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
  .directive('masterTopToolbar', ["$http", "userService", "$location", 
    function ($http, userService, $location) {
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
              };

              $scope.btnViewMessageList = function () {
                  $location.path("/customer/messagelist");
              }

              $scope.btnViewMessage = function () {
                  $location.path("/customer/faqdetail").search({messageNumber:"JK01220161214210558"});
              }

              $scope.btnViewCustomer = function () {
                  $location.path("/customer/customerdetail").search({customerNumber:"JK012"});
              }

              $scope.btnViewCustomerList = function () {
                  $location.path("/customer/customerlist");
              }
          }
      };
  }]);
