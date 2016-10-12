'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryAdjustCtrl
 * @description
 * # WarehouseInventoryAdjustCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseInventoryAdjustCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger',
      function ($scope, $location, $window,  inventoryService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          $scope.tempItemNumber = $location.search().itemNumber || "";

          var _timeout = null;
          $scope.checkItemNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempItemNumber) {
                          inventoryService.getDetail($scope.tempItemNumber, function (result) {
                              if (result.length > 0) {
                                  $scope.data = {
                                      itemNumber: result[0].itemNumber,
                                      warehouseNumber: result[0].warehouseNumber,
                                      inventory: result[0].inventory,
                                      reason: ""
                                  }
                              }
                              $scope.tempItemNumber = "";
                          });
                      } else {
                          $scope.tempItemNumber = "";
                      }
                  })
              }, 1000);
          }

          $scope.checkItemNumber();

          $scope.btnSave = function (type) {
              if (!$scope.data.inventory) {
                  plugMessenger.info("请填写正确的数量");
                  return;
              }
              inventoryService.adjust($scope.data, function (result) {
                  if (result.success) {
                      plugMessenger.success("操作成功");
                      $scope.btnPrev();
                  }
              });
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $('#tip_itemNumber').popover({
              container: 'body',
              placement: 'top',
              html: true,
              trigger: 'hover',
              title: '',
              content: "请扫描商品编号<br/>S1开头为海淘包裹<br/>S2开头为VIP客户寄送库存商品"
          });
      }]);
