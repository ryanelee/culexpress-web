'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:chartMiniStat
 * @description
 * # chartMiniStat
 */
angular.module('culAdminApp')
  .directive('chartMiniStat', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/chart-mini-stat_tpl.html",
          restrict: 'E',
          replace: true,
          scope: true,
          link: function postLink($scope, $element, attrs) {
              $scope.chartType = attrs.type;

              //char datasoure
              $scope.chartList = [{ id: "chart1", title: "LIKES", css: "stat-color-orange", value: "81,450", chartValues: [20, 10, 36, 48, 25, 91, 70, 26, 82], barColor: "#CE7B11" },
                                  { id: "chart2", title: "SUBSCRIBERS", css: "stat-color-blue", value: "150,743", chartValues: [16, 23, 45, 98, 15, 64, 88, 42, 99], barColor: "#1D92AF" },
                                  { id: "chart3", title: "CUSTOMERS", css: "stat-color-seagreen", value: "43,748", chartValues: [77, 55, 69, 44, 22, 19, 87, 22, 65], barColor: "#3F7577" }];

              $timeout(function () {
                  $.each($scope.chartList, function (index, chart) {
                      //var values = getRandomValues();
                      var params = {
                          type: 'bar',
                          barWidth: 5,
                          height: 25,
                          barColor: chart.barColor
                      }

                      $element.find("#" + chart.id + " .mini-bar-chart").sparkline(chart.chartValues, params);
                  });
              });
          }
      };
  }]);
