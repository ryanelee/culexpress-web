'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:ticketTable
 * @description
 * # ticketTable
 */
angular.module('culAdminApp')
  .directive('ticketTable', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/ticket-table_tpl.html",
          restrict: 'E',
          replace: true,
          scope: {
              data: "=ngData"
          },
          link: function postLink($scope, $element, attrs) {
              $scope.title = attrs.title;
              $scope.desc = attrs.desc;

              $scope.criticalTotal = $.grep($scope.data.dataList, function (n) { return n.priority == 1 }).length;

              //other fn
              $element.find(".widget-header-toolbar").kingAdminCommon();
          }
      };
  }]);
