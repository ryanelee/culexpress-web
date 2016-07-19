'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:chartSecondaryStat
 * @description
 * # chartSecondaryStat
 */
angular.module('culAdminApp')
  .directive('chartSecondaryStat', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/chart-secondary-stat_tpl.html",
          restrict: 'E',
          replace: true,
          scope: true,
          link: function postLink($scope, $element, attrs) {
              $scope.data = null;
              if (!!attrs.data && typeof(attrs.data) == "string") {
                  $scope.data = JSON.parse(attrs.data);
              }
              if (!$scope.data) return;
              $element.find(".inlinesparkline").sparkline($scope.data.values || [], {
                  width: '' + $element.find('.secondary-stat-item').innerWidth() + '',
                  height: '60px',

                  spotRadius: '2',
                  spotColor: false,
                  minSpotColor: false,
                  maxSpotColor: false,

                  lineWidth: 1,
                  lineColor: "rgba(255,255,255, 0.2)",
                  fillColor: 'rgba(255,255,255, 0.1)',
                  highlightLineColor: '#fff',
                  highlightSpotColor: '#fff',
                  disableInteraction: true
              });

              $element.find('.secondary-stat-item').css({ "background-color": $scope.data.backgroundColor });
          }
      };
  }]);
