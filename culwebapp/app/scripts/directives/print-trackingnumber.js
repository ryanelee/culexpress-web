'use strict';

/**
 * @ngdoc directive
 * @name culwebApp.directive:printFlyingExpress2
 * @description
 * # printFlyingExpress2
 */
angular.module('culwebApp')
  .directive('printTrackingNumber', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/print-trackingnumber_tpl.html",
          restrict: 'E',
          replace: true,
          scope: true,
          link: function postLink($scope, $element, attrs) {
              var barCodeSettings = {
                  addQuietZone: "1",
                  barHeight: "25",
                  barWidth: "1",
                  bgColor: "#FFFFFF",
                  color: "#000000",
                  moduleSize: "5",
                  output: "css",
                  posX: "10",
                  posY: "20"
              }

              $scope.$on("print-tracking-number.action", function (e, data) {
                  $scope.dataList = [];
                  if (!data) return;
                    if (!angular.isArray(data)) data = [data];
                    $.each(data, function(i, item) {
                        var _isFastOrder = item.isFastOrder;
                        var _shipServiceId = item.shipServiceId;
                        $.each(item.outboundPackages, function(i,pkg) {
                            pkg._isFastOrder = _isFastOrder;
                            pkg._shipServiceId = _shipServiceId;
                            $scope.dataList.push(pkg);
                        });
                    });
                  _render();
              });

              var _render = function () {
                  $timeout(function () {
                      $.each($element.find("div[trackingNumber]"), function (index, el) {
                          $(el).barcode($(el).attr("trackingNumber"), "code128", barCodeSettings);
                      });

                      $element.children().jqprint();
                  }, 500);
              }
          }
      };
  }]);
