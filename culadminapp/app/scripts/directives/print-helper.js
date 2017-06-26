'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printHelper
 * @description
 * # printHelper
 */
angular.module('culAdminApp')
  .directive('printHelper', ["$timeout", "receiptService", function ($timeout, receiptService) {
      return {
          templateUrl: "views/templates/common/print-helper_tpl.html",
          restrict: 'E',
          replace: true,  
          scope: true,
          link: function postLink($scope, $element, attrs) {
              var barCodeSettings = {
                  addQuietZone: "1",
                  barHeight: "50",
                  barWidth: "1",
                  bgColor: "#FFFFFF",
                  color: "#000000",
                  moduleSize: "5",
                  output: "css",
                  posX: "10",
                  posY: "20"
              }

              $scope.$on("print-helper.action", function (e, type, options) {
                  var _diffBarCodeOptions = {};
                  switch (type) {
                      case "receipt-tag-inbound-tag":
                          receiptService.getDetail(options.receiptNumber, function (result) {
                              $scope.data = result;
                              $scope.data._number = options.number;
                              _diffBarCodeOptions = { barHeight: "40", fontSize: "16" };
                              _render($element.find("#" + type), _diffBarCodeOptions);
                          });
                          break;
                      case "receipt-tag-check-tag":
                          receiptService.getDetail(options.receiptNumber, function (result) {
                              $scope.data = result;
                              _diffBarCodeOptions = { barHeight: "40", fontSize: "16" };
                              _render($element.find("#" + type), _diffBarCodeOptions);
                          });
                          break
                      case "receipt-tag-exception-tag":
                          $scope.data = { exceptionNumber: options.exceptionNumber };                       
                          _diffBarCodeOptions = { barHeight: "40", fontSize: "16" };
                          _render($element.find("#" + type), _diffBarCodeOptions);
                          break;
                      case "receipt-tag-exception-log":
                          $scope.data = options.data;
                          _render($element.find("#" + type));
                          break;
                      case "shelf-management-tag":
                          $scope.data = { shelfNumber: options.shelfNumber };
                          _diffBarCodeOptions = { barHeight: "50", fontSize: "10" };
                          _render($element.find("#" + type), _diffBarCodeOptions);
                          break;
                  }
              });

              var _render = function (_$targetElement, diffBarCodeOptions) {
                  $timeout(function () {
                      $.each(_$targetElement.find("div[barcodeNumber]"), function (index, el) {
                          $(el).barcode($(el).attr("barcodeNumber"), "code128", $.extend(angular.copy(barCodeSettings), diffBarCodeOptions || {}));
                      });

                      _$targetElement.children().jqprint();
                  }, 500);
              }
          }
      };
  }]);
