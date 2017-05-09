'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:EditreceiptCtrl
 * @description
 * # EditreceiptCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('EditReceiptCtrl', ['$scope', '$location', "warehouseService", "plugMessenger",
      function ($scope, $location, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.data = {
              trackingNumber: angular.copy($location.search().trackingNumber || "")
          }
          $scope._trackingNumber = "";

          $scope.tpl_status = {
              warehouseList: [],
              isExist: false
          }

          $scope.getPackageDetail = function () {
              if (!!$scope.data.trackingNumber && $scope._trackingNumber != $scope.data.trackingNumber) {
                  warehouseService.getInboundPackageDetail($scope.data.trackingNumber, function (result) {
                      if (result == null) {
                          //新增
                          var _newNumber = angular.copy($scope.data.trackingNumber);
                          $scope.data = { trackingNumber: _newNumber }
                          $scope._trackingNumber = "";
                          $scope.tpl_status.isExist = false;
                      } else {
                          //修改
                          $scope.data = result;
                          $scope._trackingNumber = angular.copy($scope.data.trackingNumber);
                          $scope.tpl_status.isExist = true;
                      }
                  });
              }
          }

          $scope.hotKey = function (event) {
              switch (event.keyCode) {
                  case 13:  //enter
                      $scope.getPackageDetail();
                      break;
              }
          }

          warehouseService.getWarehouse(function (result) {
              $scope.tpl_status.warehouseList = result;
              $scope.getPackageDetail();
          });

          $scope.btnSave = function (callback) {
              var _weight = parseFloat($scope.data.packageWeight);
              if ($scope.data.trackingNumber == null) { plugMessenger.info("请输入入库单号"); return; }
              if ($scope.data.warehouseNumber == null) { plugMessenger.info("请选择收货仓库"); return; }
              if ($scope.data.carrierName == null) { plugMessenger.info("请选择快递公司"); return; }
              if ($scope.data.customerNumber == null) { plugMessenger.info("请输入客户编号"); return; }
              if ($scope.data.receiveIdentity == null) { plugMessenger.info("请输入客户标示"); return; }
              if ($scope.data.packageDescription == null) { plugMessenger.info("请输入运单内容"); return; }
              //if ($scope.data.location == null) { plugMessenger.info("请输入仓库位置"); return; }
              if (_weight.toString() == "NaN" || _weight <= 0) { plugMessenger.info("请正确输入包裹重量"); return; }
              $scope.data.status = "Inbound";
              $scope.data.inboundDate = Date.now();
              $scope.data.inboundUserName = $scope.$root.userInfo.userName;
              $scope.data.OnshelfDate = Date.now();
              $scope.data.OnshelfUserName = $scope.$root.userInfo.userName;
              warehouseService.updateInboundPackageDetail($scope.data, function (result) {
                  if (result.success == true) {
                      plugMessenger.success("保存成功");
                      if (typeof (callback) == "function") {
                          callback();
                      } else {
                          //$scope.cancelEdit();
                          _clearAndFocus();
                      }
                  }
              });
          }

          $scope.cancelEdit = function () {
              $location.path('/warehouse/receipt');
          }

          $scope.btnSaveAndPrint = function () {
            //   $scope.btnSave(function () {
                //$scope.data.trackingNumber = "1z9002034234234"
                  $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
                //   _clearAndFocus();
            //   });
          }

          $scope.btnPrint = function () {
              $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
          }

          var _clearAndFocus = function () {
              $("#txtTrackingNumber").focus();
              $scope._trackingNumber = "";
              $scope.tpl_status.isExist = false;
              $scope.data = {};
          }

          $scope.$on("$destroy", function () {
              $location.search("trackingNumber", null);
          });
      }]);
