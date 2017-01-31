﻿'use strict';

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
                    console.log($scope.trackingNumbers);
                    $.each($scope.trackingNumbers, function (index, trackingNumber) {
                        warehouseService.getInboundPackageDetail(trackingNumber, function (result) {
                            console.log(result);
                            var _count = 6 - result.transactionNumber.toString().length;
                            for (var i = 0; i < _count; i++) {
                                result.transactionNumber = "0" + result.transactionNumber.toString();
                            }
                            result.receiptNumber = trackingNumber;
                            console.log(trackingNumber)
                            console.log(index);
                            $scope.dataList.push(result);
                            $scope.dataOne = {};
                            var _diffBarCodeOptions = { barHeight: "40", fontSize: "16" };
                            _render($element.find("#receipt-tag-inbound-tag"), _diffBarCodeOptions);
                            // break;
                            //   _render();
                        });
                    });
                });
                // var _render = function (_$targetElement, diffBarCodeOptions) {
                //     $timeout(function () {
                //         $.each(_$targetElement.find("div[barcodeNumber]"), function (index, el) {
                //             $(el).barcode($(el).attr("barcodeNumber"), "code128", $.extend(angular.copy(barCodeSettings), diffBarCodeOptions || {}));
                //         });

                //         _$targetElement.children().jqprint();
                //     }, 500);
                // }

                var _render = function () {
                    if ($scope.trackingNumbers.length == $scope.dataList.length) {
                        $timeout(function () {
                      $.each($element.find("div[receiptNumber]"), function (index, el) {
                              $(el).barcode($(el).attr("receiptNumber"), "code128", barCodeSettings);
                          });
                            $element.children().jqprint();
                        }, 500);
                    }
                }
            }
        };
    }]);
