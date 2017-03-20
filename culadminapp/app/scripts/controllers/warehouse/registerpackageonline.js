'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:RegisterPackageOnlineCtrl
 * @description
 * # RegisterPackageOnlineCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('RegisterPackageOnlineCtrl', ['$scope', '$location', '$window', 'orderService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, orderService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          $scope.tempOutboundPackageNumber = $location.search().trackingNumber || "";
          console.log($scope.tempOutboundPackageNumber)
          var _timeout = null;
          $scope.checkInboundPackageNumber = function () {
              console.log('1')
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempOutboundPackageNumber) {
                          console.log('23')
                          orderService.getList({
                              receiveTrackingNumber: $scope.tempInboundPackageNumber
                          }, function (result) {
                            console.log('12348')
                            console.log(result)
                              if (!!result && !!result.data && result.data.length > 0) {
                                  if (!$scope.data) {
                                      $scope.data = result.data[0];
                                  }
                                  var _checked = false;
                                  $.each($scope.data.inboundPackages, function (index, item) {
                                      if (!item.checked) {
                                          item.checked = item.trackingNumber == $scope.tempInboundPackageNumber;
                                          _checked = true;
                                      }
                                  });
                                  
                                  //todo: 根据 _checked 调用提示音
                                  if ($.grep($scope.data.inboundPackages, function (n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                                      //success
                                  } else if(_checked == true){
                                      //match
                                  } else {
                                      //no match
                                  }
                              }
                              $scope.tempInboundPackageNumber = "";
                          });
                      } else {
                          $scope.tempInboundPackageNumber = "";
                      }
                  })
              }, 1000);
          }

          $scope.checkInboundPackageNumber();

          $scope.btnPrint = function (item) {
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
          }

          $scope.btnEditAddPackage = function () {
              orderService.generatePackageNumber(function (result) {
                  $scope.data.outboundPackages.push({
                      trackingNumber: result[0].trackingNumber,
                      actualWeight: null,
                  });
              });
          }

          $scope.btnSplitPackage = function (item) {
              warehouseService.outboundPackageSplit({
                  "trackingNumber": item.trackingNumber,
              }, function (result) {
                  result.checked = true
                  $scope.data.outboundPackages.push(result);
              });
          }

          $scope.btnSave = function () {

              if (!!$scope.data && $scope.data.inboundPackages.length > 0) {
                  if ($.grep($scope.data.inboundPackages, function (n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                      var _count = 0;
                      var checkedPackages = $scope.data.outboundPackages;
                      var _callback = function () {
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
                  } else {
                      plugMessenger.info("订单包裹尚未完成扫描");
                  }
              }
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }

          var _reset = function () {
              $scope.data = null;
              $scope.tempOutboundPackageNumber = "";
          }
      }]);
