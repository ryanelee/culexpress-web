'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printOrder
 * @description
 * # printOrder
 */
angular.module('culAdminApp')
  .directive('printOrder', ["$timeout", "orderService", function ($timeout, orderService) {
      return {
          templateUrl: "views/templates/common/print-order_tpl.html",
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

              $scope.$on("print-order.action", function (e, orderNumbers) {
                  if (!angular.isArray(orderNumbers)) $scope.orderNumbers = [orderNumbers];
                  else $scope.orderNumbers = orderNumbers;
                  $scope.printDate = new Date();
                  $scope.dataList = [];
                  $scope.packagesList = [];
                  var _options = {
                      pageInfo: {
                          pageSize: 99999,
                          pageIndex: 1
                      },
                      orderNumber: orderNumbers
                  }
                  orderService.getList(_options, function (result) {
                    //   console.log("result>"+JSON.stringify(result));
                      $scope.dataList = result.data;
                    //console.log(result.data);
                      $.each($scope.dataList, function (i, _data) {
                          _data._shippingFeeTotal = 0;
                          $.each(_data.outboundPackages, function (i, outboundPackage) {
                              _data._shippingFeeTotal += outboundPackage.shippingFee;
                          });
                          _data._shippingFeeTotal = _data._shippingFeeTotal.toFixed(2);
                      });

                      _render();
                  });
                  //$.each($scope.orderNumbers, function (index, ordeNumber) {
                  //    orderService.getDetail(ordeNumber, function (result) {
                  //        $scope.dataList.push(result);
                  //        _render();
                  //    });
                  //});
              });

              var _render = function () {
                  if ($scope.orderNumbers.length == $scope.dataList.length) {
                      $timeout(function () {
                          $.each($element.find("div[orderNumber]"), function (index, el) {
                              $(el).barcode($(el).attr("orderNumber"), "code128", barCodeSettings);
                          });

                          $.each($element.find("div[trackingNumber]"), function (index, el) {
                              $(el).barcode($(el).attr("trackingNumber"), "code128", barCodeSettings);
                          });

                          $element.children().jqprint();
                      }, 500);
                  }
              }
          }
      };
  }]);
