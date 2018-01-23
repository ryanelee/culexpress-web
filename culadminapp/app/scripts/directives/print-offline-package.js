'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printPackage
 * @description
 * # printPackage
 */
angular.module('culAdminApp')
  .directive('printOfflinePackage', ["$timeout", "warehouseService", function ($timeout, warehouseService) {
      return {
          templateUrl: "views/templates/common/print-package_offline.html",
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

              $scope.$on("print-offline-package.action", function (e, orderNumbers) {
                  if (!angular.isArray(orderNumbers)) $scope.orderNumbers = [orderNumbers];
                  else $scope.orderNumbers = orderNumbers;
                  $scope.dataList = [];
                  warehouseService.getOutboundPackageList({
                      "orderNumber": $scope.orderNumbers
                  }, function (result) {
                    //   console.log(result);
                      var _orderItems = {};
                      $.each(result.data, function (index, row) {
                          if (!_orderItems[row.orderNumber]) {
                              _orderItems[row.orderNumber] = row.items;
                          } else {
                              $.each(row.items, function (i, item) {
                                  if ($.grep(_orderItems[row.orderNumber], function (n) {
                                  return n.XTProductType == item.XTProductType &&
                                         n.category == item.category &&
                                         n.description == item.description &&
                                         n.itemBrand == item.itemBrand &&
                                         n.orderNumber == item.orderNumber &&
                                         n.property1 == item.property1 &&
                                         n.property2 == item.property2 &&
                                         n.property3 == item.property3 &&
                                         n.property4 == item.property4 &&
                                         n.property5 == item.property5 &&
                                         n.quantity == item.quantity &&
                                         n.unitprice == item.unitprice
                                  }).length == 0) {
                                      _orderItems[row.orderNumber].push(item);
                                  }
                              });
                          }
                      });
                      $.each(result.data, function (index, item) {
                          item.orderItems = _orderItems[item.orderNumber];

                          //item._shippingFeeTotal = 0;
                          //$.each(item.outboundPackages, function (i, outboundPackage) {
                          //    item._shippingFeeTotal += outboundPackage.shippingFee;
                          //});
                          //item._shippingFeeTotal = item._shippingFeeTotal.toFixed(2);
                      });
                      $scope.dataList = result.data;
                      _render();
                  });
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
