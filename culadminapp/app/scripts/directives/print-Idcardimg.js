'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printIdcardImg
 * @description
 * # printIdcardImg
 */
angular.module('culAdminApp')
    .directive('printIdcardImg', ["$timeout", function($timeout) {
        return {
            templateUrl: "views/templates/common/print-idcardimg_tpl.html",
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

                $scope.$on("print-idcardImg.action", function(e, data) {
                    console.log('hahahahah ')
                    $scope.dataList = data.data;
                    _render();
                });

                var _render = function() {
                    if ($scope.dataList.length == $scope.dataList.length) {
                        //console.log($scope.dataList);
                        $timeout(function() {
                            $element.children().jqprint();
                        }, 1000);
                    }
                }
            }
        };
    }]);