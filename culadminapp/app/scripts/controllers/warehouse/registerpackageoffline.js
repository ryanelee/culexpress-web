﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:RegisterPackageOfflineCtrl
 * @description
 * # RegisterPackageOfflineCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('RegisterPackageOfflineCtrl', ['$scope', '$location', '$window', 'orderService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, orderService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          $scope.tempOutboundPackageNumber = $location.search().trackingNumber || "";
          
          var _timeout = null;
          $scope.checkOutboundPackageNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempOutboundPackageNumber) {
                          orderService.getList({
                              outBoundTrackingNumber: $scope.tempOutboundPackageNumber
                          }, function (result) {
                              if (!!result && !!result.data && result.data.length > 0) {
                                  if (!$scope.data) {
                                      $scope.data = result.data[0];
                                  }
                                  var _checked = false;
                                  $.each($scope.data.outboundPackages, function (index, item) {
                                      if (!item.checked) {
                                          item.checked = item.trackingNumber == $scope.tempOutboundPackageNumber;
                                          _checked = true;
                                      }
                                  });

                                  //todo: 根据 _checked 调用提示音
                                  if ($.grep($scope.data.outboundPackages, function (n) { return n.checked == true }).length == $scope.data.outboundPackages.length) {
                                      //success
                                  } else if (_checked == true) {
                                      //match
                                  } else {
                                      //no match
                                  }
                                  $scope.weightChanged();
                              }
                              $scope.tempOutboundPackageNumber = "";
                          });
                      } else {
                          $scope.tempOutboundPackageNumber = "";
                      }
                  })
              }, 1000);
          }

          $scope.checkOutboundPackageNumber();

          $scope.btnPrint = function (type, item) {
              switch (type) {
                  case "flyingexpress":
                      $scope.$broadcast("print-flying-express.action", item.orderNumber);
                      break;
                  case "trackingNumber":
                      $("<div></div>").barcode(item.trackingNumber, "code128", {
                          addQuietZone: "1",
                          barHeight: "50",
                          barWidth: "1",
                          bgColor: "#FFFFFF",
                          color: "#000000",
                          moduleSize: "5",
                          output: "css",
                          posX: "10",
                          posY: "20"
                      }).jqprint();
                      break;
              }
          }

          $scope.btnSplitPackage = function (item) {
              warehouseService.outboundPackageSplit({
                  "trackingNumber": item.trackingNumber,
              }, function (result) {
                  result.checked = true
                  $scope.data.outboundPackages.push(result);
              });
          }

          $scope.weightChanged = function () {
              $scope.outboundEnable = $.grep($scope.data.outboundPackages, function (n) { return !!n.actualWeight && n.checked == true }).length == $scope.data.outboundPackages.length;
          }

          $scope.btnSave = function (callback) {
              if (!!$scope.data && $scope.data.outboundPackages.length > 0) {
                  var _count = 0;
                  var checkedPackages = $.grep($scope.data.outboundPackages, function (n) { return n.checked == true });
                  var _callback = callback || function () {
                      plugMessenger.success("保存成功");
                      //$window.history.back();
                      _reset();
                  }
                  //记录当前已扫描包裹的重量，并新增轨迹信息：完成称重,已计算出运费
                  $.each(checkedPackages, function (i, pkg) {
                      orderService.updateOutboundPackage(pkg, function (result) {
                          if (!result.message) {
                              _count++;
                              if (_count == checkedPackages.length) {
                                  _callback();
                              }
                          }
                      })
                  });
              }
          }

          $scope.btnOutBound = function () {
              if (!!$scope.data && $scope.data.outboundPackages.length > 0) {
                  //当订单中所有包裹都完成称重后
                  if ($.grep($scope.data.outboundPackages, function (n) { return !!n.actualWeight }).length == $scope.data.outboundPackages.length) {
                      $scope.btnSave(function () {
                          //修改订单状态为已出库，同时在前台轨迹跟踪页面可以看到"完成出库操作,发往机场"的信息
                          var outboundPackages = [];
                          $.each($scope.data.outboundPackages, function (i, pkg) {
                              outboundPackages.push(pkg.trackingNumber);
                          });
                          warehouseService.outboundPackageShip(outboundPackages, function (result) {
                              if (result.success == true) {
                                  plugMessenger.success("出库成功");
                                  //$window.history.back();
                                  _reset();
                              }
                          });
                      });
                  } else {
                      plugMessenger.info("订单还有包裹没有称重");
                  }
              }
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $('#tip_umipackage').popover({
              container: 'body',
              placement: 'top',
              html: true,
              trigger: 'hover',
              title: '',
              content: "请扫描UMI包裹编号，比如UMI100000001"
          });

          $('#tip_outbound').popover({
              container: 'body',
              placement: 'top',
              html: true,
              trigger: 'hover',
              title: '',
              content: "订单中所有包裹完成打包后，点击此按钮将修改订单为已出库状态。客户可以在轨迹跟踪页面看到包裹完成出库操作的信息。"
          });

          var _reset = function () {
              $scope.data = null;
              $scope.tempOutboundPackageNumber = "";
          }
      }]);
