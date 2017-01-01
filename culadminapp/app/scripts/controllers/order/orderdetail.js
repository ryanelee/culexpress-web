'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderDetailCtrl
 * @description
 * # OrderDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('OrderDetailCtrl', ["$scope", "$location", "$window", "orderService", "addressService", "customerMessageService", "plugMessenger",
      function ($scope, $location, $window, orderService, addressService, customerMessageService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.isPrintDetail = !!$location.search().print;

          orderService.getDetail($location.search().orderNumber, function (result) {
              $scope.data = result;
              console.log(result);
              $.each($scope.data.shipToAddresses, function (i, address) {
                  address._trackingNumbers = [];
                  $.each($scope.data.outboundPackages, function (i, outboundPackage) {
                      if (outboundPackage.address.transactionNumber == address.transactionNumber) {
                          address._trackingNumbers.push(outboundPackage.trackingNumber);
                      }
                  });
              });

              $scope.data._shippingFeeTotal = 0;
              $.each($scope.data.outboundPackages, function (i, outboundPackage) {
                  $scope.data._shippingFeeTotal += outboundPackage.shippingFee;
              });
              $scope.data._shippingFeeTotal = $scope.data._shippingFeeTotal.toFixed(2);

              $scope.refreshMessage();
          });

          $scope.refreshMessage = function () {
              customerMessageService.getDetail($scope.data.orderMessageNumber, function (result) {
                  $scope.data.messageLogs = [];
                  if (!!result) {
                      $scope.data.messageLogs = result.messageLogs;
                  }
              });
          }

          $scope.btnEditOrderItems = function () {
              $scope._editOrderItemsData = JSON.parse(JSON.stringify($scope.data.orderItems));
              $scope._editOrderItems = true;
          }

          $scope.cloneAddress = null;
          $scope.btnEditOrderAddress = function (address) {
              $scope.cloneAddress = angular.copy(address);
              address._edit = true;
          }
          $scope.btnSaveAddress = function (address) {
              if (!!address.receivePersonName && 
                  !!address.cellphoneNumber &&
                  !!address.address1 &&
                  !!address.receiveCompanyName &&
                  !!address.zipcode) {
                  addressService.update(address, function (result) {
                      if (result.success == true) {
                          address._edit = false;
                          $scope.cloneAddress = null;
                          plugMessenger.success("收货地址保存成功。");
                      }
                  });
              } else {
                  plugMessenger.info("收货地址没有填写全，不能提交更改。");
              }
          }
          $scope.btnCancelAddress = function (address) {
              for (var key in $scope.cloneAddress) {
                  if (key != "$$hashKey") address[key] = $scope.cloneAddress[key];
              }
              address._edit = false;
              $scope.cloneAddress = null;
          }

          $scope.btnOrderItems_Oper = function (type, index) {
              switch (type) {
                  case "add":
                      $scope.data.orderItems.push({
                          "itemBrand": "",
                          "description": "",
                          "quantity": "",
                          "unitprice": ""
                      });
                      break;
                  case "del":
                      $scope.data.orderItems[index] = null;
                      $scope.data.orderItems = $.grep($scope.data.orderItems, function (n) { return !!n });
                      break;
                  case "repeat":
                      var _repeatData = $.grep($scope._editOrderItemsData, function (n) { return n.transactionNumber == $scope.data.orderItems[index].transactionNumber });
                      if (_repeatData.length > 0) _repeatData = _repeatData[0];
                      for (var key in $scope.data.orderItems[index]) {
                          if (key != "$$hashKey") {
                              $scope.data.orderItems[index][key] = _repeatData[key];
                          }
                      }
                      break;
                  case "cancel":
                      $scope._editOrderItems = false;
                      $scope.data.orderItems = $scope._editOrderItemsData;
                      break;
              }
          }

          $scope.btnMessagePush = function () {
              if (!!$scope._message) {
                  customerMessageService.push({
                      "messageNumber": $scope.data.orderMessageNumber,
                      "message": $scope._message
                  }, function (result) {
                      $scope.refreshMessage();
                      $scope._message = "";
                  });
              }
          }

          $scope.btnSave = function () {
              var data = $scope.data;
              orderService.update({
                  "orderNumber": data.orderNumber,
                  "orderStatus": data.orderStatus,
                  "printStatus": data.printStatus,
                  "payDate": data.payDate,
                  "paied": data.paied,
                  "priceAdjustMemo": data.priceAdjustMemo,
                  "orderItems": data.orderItems
              }, function (result) {
                  if (!result.message) {
                      plugMessenger.success("保存成功");
                      $scope.btnPrev();
                  }
              });
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }
      }]);
