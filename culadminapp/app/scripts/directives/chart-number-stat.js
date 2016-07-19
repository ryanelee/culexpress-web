'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:chartNumberStat
 * @description
 * # chartNumberStat
 */
angular.module('culAdminApp')
  .directive('chartNumberStat', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/chart-number-stat_tpl.html",
          restrict: 'E',
          replace: true,
          scope: {
              data: "=ngData"
          },
          link: function postLink($scope, $element, attrs) {
              $timeout(function () {
                  var sparklineNumberChart = function () {

                      var params = {
                          width: '140px',
                          height: '30px',
                          lineWidth: '2',
                          lineColor: '#1D92AF',
                          fillColor: false,
                          spotRadius: '2',
                          highlightLineColor: '#aedaff',
                          highlightSpotColor: '#71aadb',
                          spotColor: false,
                          minSpotColor: false,
                          maxSpotColor: false,
                          disableInteraction: false
                      }

                      $.each($element.find(".inlinesparkline"), function (index, el) {
                          $(el).sparkline($scope.data[index].values, params);
                      });
                  }

                  sparklineNumberChart();
              });
          }
      }
  }]);
