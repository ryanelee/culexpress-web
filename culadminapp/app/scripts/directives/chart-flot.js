'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:chartFlot
 * @description
 * # chartFlot
 */
angular.module('culAdminApp')
  .directive('chartFlot', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/chart-flot_tpl.html",
          restrict: 'E',
          replace: true,
          scope: {
              data: "=ngData",
              filter: "=ngFilter"
          },
          link: function postLink($scope, $element, attrs) {
              $scope.title = attrs.title;
              $scope.desc = attrs.desc;
              var $flot = null;
              $scope.currentTab = {
                  period: "week"
              }
              if (!!$scope.filter && angular.isArray($scope.filter)) {
                  $.each($scope.filter, function (index, item) {
                      $scope.currentTab[item.key] = item.options[0].key;
                  });
              }

              $scope.btnTransferTab = function (type, category) {
                  $scope.currentTab[category] = type;
                  //callback trigger
                  $scope.$emit(attrs.ngFilterTrigger, $scope.currentTab, _buildFlotChart);
              }

              var _buildFlotChart = function (data) {
                  $scope.data = data;
                  var flotParams = {},
                      dataList = angular.copy($scope.data.dataList);
                  switch ($scope.currentTab.period) {
                      case "week":
                          for (var i = 0; i < dataList.length; i++) {
                              dataList[i] = $.extend({
                                  lines: { show: true, fill: true, },
                                  points: { show: true, fill: true, fillColor: "#fafafa" }
                              }, dataList[i]);
                          }
                          flotParams = {
                              series: {
                                  lines: {
                                      fillColor: { colors: [{ opacity: 0.1 }, { opacity: 0.1 }] }
                                  }
                              },
                              colors: ["#E7A13D", "#FF3300"],
                              xaxis: { timeformat: "%a" }
                          }
                          break;
                      case "month":
                          dataList[0] = $.extend({
                              bars: { show: true, fill: false, barWidth: 0.1, align: "center", lineWidth: 18 }
                          }, dataList[0]);
                          flotParams = {
                              series: {
                                  lines: { show: true, fill: false },
                                  points: { show: true, fill: true, fillColor: "#fafafa" }
                              },
                              colors: ["rgba(217,217,217, 0.3)", "#d7ea2b"],
                          }
                          break;
                      case "year":
                          flotParams = {
                              series: {
                                  lines: { show: true, fill: false },
                                  points: { show: true, fill: true, fillColor: "#fafafa" }
                              },
                              colors: ["#d9d9d9", "#5399D6"],
                              xaxis: { minTickSize: [1, "month"], },
                          }
                          break;
                  }
                  //build plot
                  $flot = $.plot($element.find("#chart-control"), dataList, $.extend(true, {
                      series: {
                          lines: { lineWidth: 2, },
                          points: { lineWidth: 3, },
                          shadowSize: 0
                      },
                      grid: {
                          hoverable: true,
                          clickable: true,
                          borderWidth: 0,
                          tickColor: "#E4E4E4"
                      },
                      yaxis: { font: { color: "#555" }, ticks: 8 },
                      xaxis: {
                          mode: "time",
                          timezone: "browser",
                          minTickSize: [1, "day"],
                          font: { color: "#555" },
                          tickColor: "#fafafa",
                          autoscaleMargin: 0.02
                      },
                      legend: {
                          labelBoxBorderColor: "transparent",
                          backgroundColor: "transparent"
                      },
                      tooltip: true,
                      tooltipOpts: { content: '%s: %y' }
                  }, flotParams));
              }

              _buildFlotChart($scope.data);

              //other fn
              $element.find(".widget-header-toolbar").kingAdminCommon();
          }
      };
  }]);
