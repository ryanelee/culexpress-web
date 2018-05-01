'use strict';

/**
 * @ngdoc directive 
 * @name culAdminApp.directive:printflyingExpress
 * @description
 * # printflyingExpress
 */
angular.module('culAdminApp')
  .directive('printFlyingExpress', ["$timeout", "warehouseService", function ($timeout, warehouseService) {
      return {
          templateUrl: "views/templates/common/print-flyingexpress_tpl.html",
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

              $scope.$on("print-flying-express.action", function (e, orderNumbers) {
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
                                  return n.XTProductType === item.XTProductType &&
                                         n.category === item.category &&
                                         n.description === item.description &&
                                         n.itemBrand === item.itemBrand &&
                                         n.orderNumber === item.orderNumber &&
                                         n.property1 === item.property1 &&
                                         n.property2 === item.property2 &&
                                         n.property3 === item.property3 &&
                                         n.property4 === item.property4 &&
                                         n.property5 === item.property5 &&
                                         n.quantity === item.quantity &&
                                         n.unitprice === item.unitprice
                                  }).length === 0) {
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
                      //printSet();
                      $element.children().jqprint();
                  }, 500);
              }

              //打印设置（模板高度调整）
              var printSet = function () {
                  var innerHeight = {
                      cm: 25.6,     //设置A4纸内高尺寸（厘米）
                      px: $element.children("#page-height").css({ "height": "25.6cm" }).height()   //获取转换为像素的内高尺寸
                  }
                  $element.children("div[id='print_FLYINGExpress_Template']").each(function (index, el) {
                      var _$el = $(el);
                      if (_$el.height() > innerHeight.px - 100) {
                          _$el.css({ "height": innerHeight.cm * 2 + "cm" });
                          _$el.children("#logo").css({ "height": "1cm" });
                          _$el.children("table:first").css({ "height": (innerHeight.cm - 1) + "cm" });
                          _$el.children("hr").remove(); //去除中线
                      } else {
                          _$el.css({ "height": innerHeight.cm + "cm" });
                      }
                  });
              }
          }
      };
  }]);
