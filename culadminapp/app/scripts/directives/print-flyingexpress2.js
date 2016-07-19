﻿'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printFlyingExpress2
 * @description
 * # printFlyingExpress2
 */
angular.module('culAdminApp')
  .directive('printFlyingExpress2', ["$timeout", "warehouseService", function ($timeout, warehouseService) {
      return {
          templateUrl: "views/templates/common/print-flyingexpress2_tpl.html",
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

              $scope.$on("print-flying-express2.action", function (e, orderNumbers) {
                  if (!angular.isArray(orderNumbers)) $scope.orderNumbers = [orderNumbers];
                  else $scope.orderNumbers = orderNumbers;
                  $scope.dataList = [];

                  warehouseService.getOutboundPackageList({
                      "orderNumber": $scope.orderNumbers
                  }, function (result) {
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
                      });
                      $.each(result.data, function (index, item) {
                          //组合XTProductType数据
                          var xtProductTypeTotal = {};
                          item._xtProductTypeTotal = [];
                          if (!!item.items) {
                              $.each(item.items, function (index, _item) {
                                  var xtProductType = _item.XTProductType;
                                  if (!!xtProductType) {
                                      if (!xtProductTypeTotal[xtProductType]) xtProductTypeTotal[xtProductType] = _item.quantity;
                                      else xtProductTypeTotal[xtProductType] += _item.quantity;
                                  }
                              });
                              for (var key in xtProductTypeTotal) {
                                  item._xtProductTypeTotal.push({
                                      "type": key,
                                      "total": xtProductTypeTotal[key]
                                  });
                              }
                          }
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
