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
                    addQuietZone: "2",
                    barHeight: "100",
                    barWidth: "2",
                    showHRI: "false",
                    bgColor: "#FFFFFF",
                    color: "#000000",
                    moduleSize: "20",
                    output: "css",
                    posX: "0",
                    posY: "0"
                }

                $scope.$on("print-inboundPackage.action", function (e, trackingNumbers) {
                    if (!angular.isArray(trackingNumbers)) $scope.trackingNumbers = [trackingNumbers];
                    else $scope.trackingNumbers = trackingNumbers;
                    $scope.dataList = [];
                    $.each($scope.trackingNumbers, function (index, trackingNumber) {
                        warehouseService.getInboundPackageDetail(trackingNumber, function (result) {
                            if (typeof result == Array) {
                                result.forEach(function (e) {
                                   result.receipt = result.trackingNumber.substr(result.trackingNumber.length-6, 6);
                                })
                            }
                            if(result){
                                result.receipt = result.trackingNumber.substr(result.trackingNumber.length-6, 6);
                            }

                            var _count = 6 - result.transactionNumber.toString().length;
                            for (var i = 0; i < _count; i++) {
                                result.transactionNumber = "0" + result.transactionNumber.toString();
                            }
                            result.receiptNumber = trackingNumber;
                            $scope.dataList.push(result);
                            $scope.dataOne = result;
                            var _diffBarCodeOptions = { barHeight: "100", fontSize: "26" };
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
                            $.each($element.find("div[itemNumber]"), function (index, el) {
                                $(el).barcode($(el).attr("itemNumber"), "code128", barCodeSettings);
                            });
                            $element.children().jqprint();
                        }, 500);
                    }
                }
            }
        };
    }]);
