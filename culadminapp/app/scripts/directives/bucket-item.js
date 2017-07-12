'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:bucketItem
 * @description
 * # bucketItem
 */
angular.module('culAdminApp')
  .directive('bucketItem', ["$timeout", function ($timeout) {
      return {
          templateUrl: "views/templates/common/bucket-item_tpl.html",
          restrict: 'E',
          replace: true,
          scope: {
              type: "@type",
              data: "=ngData",
              disabled: "=ngDisabled",
              callback_check: "&ngFnCheck",
              callback_add: "&ngFnAdd",
              callback_remove: "&ngFnRemove",
          },
          link: function postLink($scope, $element, attrs) {
              $scope.$on("bucket-item-selected", function (e, selected,level) {
                  //onsole.log($scope.type + " " + selected);
                  switch (level) {
                      case "pallet":
                          $scope.isSelected = $scope.data.name == selected;
                          break;
                      case "box":
                          if ($scope.type != "pallet") {
                              $scope.isSelected = $scope.data.name == selected;
                          }
                          break;
                      //case "bag":
                      case "package":
                          if ($scope.type != "pallet" && $scope.type != "box" && $scope.type != "bag") {
                              $scope.isSelected = $scope.data.name == selected;
                          }
                          break;
                  }
                  //console.log($scope.isSelected);
              });
              /**
             * 打印翔通面单
             */
            $scope.btnPrint = function(item, type) {
                console.log(item)            
                var _print = function() {
                    switch (type) {
                        case "flyingexpress":
                            $scope.$broadcast("print-flying-express.action", item.orderNumber);
                            break;
                    }
                }
            }
          }
      };
  }]);
