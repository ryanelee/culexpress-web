'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printUnshelf
 * @description
 * # printUnshelf
 */
angular.module('culAdminApp')
    .directive('printIdcard', ["$timeout", function($timeout) {
        return {
            templateUrl: "views/templates/common/print-idcard_tpl.html",
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

                $scope.$on("print-idcard.action", function(e, data) {
                    console.log("开始")
                    console.log(data)
                    $scope.dataList = data.data;
                    // if ($scope.dataList.length == 1) {
                    //     console.log('这是为什么呢')
                    //     $scope.falg = 1;
                    //     $scope.data = $scope.dataList[0]
                    // }
                    // $scope.idCardBackUrl = images.images.idCardBackUrl;
                    // $scope.idCardFrontUrl = images.images.idCardFrontUrl;
                    _render();
                });

                var _render = function() {
                    if ($scope.dataList.length == $scope.dataList.length) {
                        console.log($scope.dataList);
                        $timeout(function() {
                            $element.children().jqprint();
                        }, 1000);
                    }
                }
            }
        };
    }]);