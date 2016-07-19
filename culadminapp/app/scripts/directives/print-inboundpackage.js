'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printInboundPackage
 * @description
 * # printInboundPackage
 */
angular.module('culAdminApp')
  .directive('printInboundPackage', ["$timeout", "warehouseService", function ($timeout, warehouseService) {
      return {
          templateUrl: "views/templates/common/print-inboundpackage_tpl.html",
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

              $scope.$on("print-inboundPackage.action", function (e, trackingNumbers) {
                  if (!angular.isArray(trackingNumbers)) $scope.trackingNumbers = [trackingNumbers];
                  else $scope.trackingNumbers = trackingNumbers;
                  $scope.dataList = [];

                  $.each($scope.trackingNumbers, function (index, trackingNumber) {
                      warehouseService.getInboundPackageDetail(trackingNumber, function (result) {
                          var _count = 6 - result.transactionNumber.toString().length;
                          for (var i = 0; i < _count; i++) {
                              result.transactionNumber = "0" + result.transactionNumber.toString();
                          }
                          $scope.dataList.push(result);
                          _render();
                      });
                  });
              });

              var _render = function () {
                  if ($scope.trackingNumbers.length == $scope.dataList.length) {
                      $timeout(function () {
                          $element.children().jqprint();
                      }, 500);
                  }
              }
          }
      };
  }]);
