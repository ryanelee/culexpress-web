'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterBreadCrumbs
 * @description
 * # masterBreadCrumbs
 */
angular.module('culAdminApp')
  .directive('masterBreadCrumbs', ["$location", "$timeout", "menuInfoService",
      function ($location, $timeout, menuInfoService) {
          return {
              templateUrl: "views/templates/master/breadcrumb_tpl.html",
              restrict: 'E',
              replace: true,
              $scope: true,
              link: function postLink($scope, $element, attrs) {
                  $scope.btnTransfer = function (route) {
                      if (!!route.url) {
                          $location.path(route.url);
                      }
                  }
                  var _refresh = function () {
                      var _menus = [{
                          icon: "fa-home",
                          tip: null,
                          title: "首页",
                          url: "/"
                      }];
                      $scope.routePath = menuInfoService.getMenuInfo($location.path()).routePath;
                      $scope.routePath = _menus.concat($scope.routePath);
                      console.log($scope.routePath);
                  }
                  $scope.$on("$routeChangeSuccess", function () {
                      _refresh();
                  });
                  _refresh();
              }
          };
      }]);
