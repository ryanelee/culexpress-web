'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptCheck2Ctrl
 * @description
 * # ReceiptCheck2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptCheck2Ctrl', ['$scope', '$location', '$window', 'receiptService', 'plugMessenger', '$timeout', '$compile',
      function ($scope, $location, $window, receiptService, plugMessenger, $timeout, $compile) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = null;

          $scope.tempReceiptNumber = $location.search().receiptNumber || "";
          $scope.tempItemNumber = "";
          $scope.checkedItemsForFailed = [];

          var _timeout = null;
          $scope.checkReceiptNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempReceiptNumber) {
                          receiptService.getDetail($scope.tempReceiptNumber, function (result) {
                              $scope.data = null;
                              if (!result.message) {
                                  $scope.data = result;
                              }
                              $scope.tempReceiptNumber = "";
                          });
                      } else {
                          $scope.tempReceiptNumber = "";
                      }
                  })
              }, 1000);
          }
          $scope.checkReceiptNumber();

          $scope.checkItemNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope.tempItemNumber) {
                          receiptService.checkItem($scope.tempItemNumber, function (result, status) {
                              var _$success_alert = $("#check_success_alert"),
                                  _$fail_alert = $("#check_fail_alert");
                              _$success_alert.hide();
                              _$fail_alert.hide();
                              if (!!result) {
                                  var isExists = false;
                                  //加入正确的商品
                                  _.each($scope.data.items, function (item) {
                                      if (item.upccode == $scope.tempItemNumber || item.itemNumber == $scope.tempItemNumber) {
                                          item._isShow = true;
                                          if (item.scanCount == null) item.scanCount = 0;
                                          item.scanCount++;
                                          isExists = true;
                                      }
                                  });
                                  if (isExists) {
                                      var _title = "已清点商品 {0} x 1".replace("{0}", $scope.tempItemNumber);
                                      _$success_alert.text(_title);
                                      _$success_alert.show();
                                  } else {
                                      var _title = "商品 {0} 不在该收获单据中".replace("{0}", $scope.tempItemNumber);
                                      _$fail_alert.text(_title);
                                      _$fail_alert.show();
                                      //加入错误的商品
                                      $scope.checkedItemsForFailed.push(_title);
                                  }
                              } else {
                                  plugMessenger.error("商品不存在");
                              }
                              $scope.tempItemNumber = "";
                          });
                      } else {
                          $scope.tempItemNumber = "";
                      }
                  });
              }, 1000);
          }

          $scope.btnSave = function () {
              var _items = [],
                  scanTotal = 0;
              _.each($scope.data.items, function (item) {
                  if (item._isShow) {
                      _items.push({
                          itemNumber: item.itemNumber,
                          scanCount: item.scanCount,
                          weight: item.weight
                      });
                      scanTotal += item.scanCount;
                  }
              });
              var _send = function () {
                  receiptService.checkForOffline({
                      "receiptNumber": $scope.data.receiptNumber,
                      "items": _items
                  }, function (result, status) {
                      if (status == 200) {
                          plugMessenger.success("操作成功");
                          $scope.btnPrev();
                      }
                  });
              }
              if ($scope.data.itemCount > scanTotal) {
                  plugMessenger.confirm("应收货商品数量为" + $scope.data.itemCount + "，实际清点商品为" + scanTotal + "。请确认是否部分收货？", function (isOK) {
                      if (isOK) {
                          _send();
                      }
                  });
              } else {
                  _send();
              }
          }

          $scope.btnFailedItemsDetail = function () {
              plugMessenger.template($compile($("#failedItemsDetail").html())($scope));
          }

          $scope.btnException = function () {
              $location.search({ "receiptNumber": $scope.data.receiptNumber });
              $location.path("warehouse/receiptexceptionedit");
          }

          $scope.btnFailedItemsClose = function (event) {
              $(event.currentTarget).parents("#confirm-modal").modal("hide");
          }

          $scope.btnPrev = function () {
              $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
          }

          $scope.btnPrint = function (type, item) {
              switch (type) {
                  case "inbound":
                      $scope.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: item.receiptNumber, number: item.scanCount });
                      break;
                  case "exception":
                      $scope.$broadcast("print-helper.action", "receipt-tag-exception-log", { data: $scope.checkedItemsForFailed });
                      break;
              }
          }

          $('#tip_receiptNumber_receipcheck2').popover({
              container: 'body',
              placement: 'top',
              html: true,
              trigger: 'hover',
              title: '',
              content: "请扫描收货单据编号。<br/>海淘包裹请扫描包裹上面的快递跟踪编号，<br/>比如UPS是1z开头的14-18位条码。<br/>VIP客户寄送库存单据请扫描ASN开头的条码。"
          });
      }]);
