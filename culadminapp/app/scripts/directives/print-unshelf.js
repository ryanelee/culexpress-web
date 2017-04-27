'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printUnshelf
 * @description
 * # printUnshelf
 */
angular.module('culAdminApp')
    .directive('printUnshelf', ["$timeout", "shelfService", function($timeout, shelfService) {
        return {
            templateUrl: "views/templates/common/print-unshelf_tpl.html",
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

                $scope.$on("print-unshelf.action", function(e, warehouseNumber) {
                    $scope.dataList = [];
                    shelfService.getUnshelfList({ warehouseNumber: warehouseNumber }, function(result) {
                        $scope.dataList = _.groupBy(result, function(item) { return item.sendType });
                        console.log(result)
                            //   debugger;
                        $scope.currentDate = Date.now();
                        _render();
                    });
                });

                var _render = function() {
                    $timeout(function() {
                        $.each($element.find("div[trackingNumber]"), function(index, el) {
                            $(el).barcode($(el).attr("trackingNumber"), "code128", barCodeSettings);
                        });

                        $element.children().jqprint();
                    }, 500);
                }
            }
        };
    }]);