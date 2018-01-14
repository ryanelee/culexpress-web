'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderOfflineImportCtrl
 * @description
 * # OrderOfflineImportCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp') 
  .controller('OrderOfflineImportCtrl', ["$scope", "$timeout", "$filter", "orderService", "warehouseService", "plugMessenger",
      function ($scope, $timeout, $filter, orderService, warehouseService, plugMessenger) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      $scope.stepIndex = 1;
      $scope.stepValidation = [];
      $scope.btnNextEnable = false;

      $scope.tpl_status = {
          step3: 1
      }

      var $wizard = null;
      $timeout(function () {
          $wizard = $("#offline-order-wizard");
          $wizard.wizard({ clickableSteps: false })
          $wizard.on('change', function (e, data) {
              if (data.direction == "next") {
                  if (!$scope.stepValidation[data.step - 1]) {
                      switch (data.step) {
                          case 1:
                              plugMessenger.info("请上传线下订单Excel文件");
                              break;
                          case 2:
                              plugMessenger.info("文件检查未通过，请返回上一步重新上传");
                              break;
                      }
                      return false;
                  }
                  if (data.step == 3) {         //检查List
                      var errorMessage = null;
                      $.each($scope.dataList, function (index, item) {
                          if (item.actualTotalWeight == null || item.actualTotalWeight == 0) {
                              errorMessage = "订单编号为“" + item.orderNumber + "”的订单，没有填写实际订单重量。";
                              return false;
                          }
                      })
                      if (!!errorMessage) {
                          plugMessenger.error(errorMessage);
                          return false;
                      }
                  } else if (data.step == 4) {  //检查Form
                  }
                  switch (data.step) {
                      case 1:
                          _stepFunction[1]();
                          break;
                      case 2:
                          _stepFunction[2]();
                          break;
                      case 3:
                          _stepFunction[3]();
                          break;
                      case 4:
                          _stepFunction[4]();
                          break;
                  }

                  $timeout(function () {
                      $scope.stepIndex = data.step + 1;
                      if ($scope.stepIndex == 4) {
                          $scope.validPaymentPrice();
                      } else {
                          $scope.btnNextEnable = false;
                      }
                  });
              } else {
                  $timeout(function () {
                      $scope.stepIndex = data.step - 1;
                      $scope.btnNextEnable = true;
                  });
              }
          }).on('finished', function () {
              //alert('Your account has been created.');
          });

          $('.wizard-wrapper .btn-next').click(function () {
              $wizard.wizard('next');
          });

          $('.wizard-wrapper .btn-prev').click(function () {
              $wizard.wizard('previous');
          });

          $('.wizard-wrapper .btn-checkout').click(function () {
              plugMessenger.confirm("确定要出库吗？", function (isOK) {
                  if (isOK) $wizard.wizard('next');
              });
          });

          _stepFunction[0]();
      });

      var _stepFunction = [
          //step 1
          function () {
              Dropzone.autoDiscover = false;
              $(".dropzone").dropzone({
                  url: cul.apiPath + "/files/upload",
                  addRemoveLinks: true,
                  maxFilesize: 3,
                  maxFiles: 1,
                  acceptedFiles: '.xls, .xlsx',
                  headers: {
                      token: sessionStorage.getItem("token")
                  },
                  dictDefaultMessage: "点击此处上传线下订单Excel。",
                  dictFallbackMessage: "您的浏览器不支持拖放文件上传方式。",
                  dictFileTooBig: "所选的文件太大({{filesize}}MiB)。 文件最大限制：{{maxFilesize}}MiB。",
                  dictInvalidFileType: "您不能上传该类型的文件。",
                  dictResponseError: "文件上传失败，错误代码 {{statusCode}}",
                  dictCancelUpload: "取消上传",
                  dictCancelUploadConfirmation: "您确定要取消这次上传吗？",
                  dictRemoveFile: "删除文件",
                  dictMaxFilesExceeded: "您不能上传更多文件。",
                  success: function (_result) {
                      $timeout(function () {
                          var result = JSON.parse(_result.xhr.response)
                          $scope.fileId = result.filePath;
                          $scope.stepValidation[0] = true;
                          $wizard.wizard('next');
                      });
                  }
              });
              $scope.btnNextEnable = true;
          },
          //step 2
          function () {
              $('#precheckProgressBar').progressbar({
                  done: function () {
                      $timeout(function () {
                          orderService.offlineOrderCheckExcel($scope.fileId, function (result) {
                              if (result.success == true) {
                                  $scope.stepValidation[1] = true;
                                  $scope.btnNextEnable = true;
                                  $scope.excelErrorMessage = "";
                              } else {
                                  $scope.stepValidation[1] = false;
                                  $scope.excelErrorMessage = result.message;
                              }
                          });
                      });
                  }
              });
          },
          //step 3
          function () {
              $('#createOrderProgressBar').progressbar({
                  done: function () {
                      $timeout(function () {
                          $scope.tpl_status.step3 = 2;
                          orderService.offlineOrderCreateExcel($scope.fileId, function (result) {
                              $.each(result, function (index, item) {
                                  item.actualTotalWeight = 0;
                                  $.each(item.outboundPackages, function (i, pkg) {
                                      item.actualTotalWeight += pkg.actualWeight || 0;
                                  });
                                  item.actualTotalWeight = item.actualTotalWeight.toFixed(2);
                              });
                              $scope.dataList = result;

                              $scope.pagination.totalCount = $scope.dataList.totalCount;
                              $scope.stepValidation[2] = true;
                              $scope.btnNextEnable = true;
                          });
                      });
                  }
              });
              //orderService
          },
          //step 4
          function () {
              //var orderNumbers = [];
              //$.each($scope.dataList, function (i, item) {
              //    orderNumbers.push(item.orderNumber);
              //})
              orderService.settlementForOffline($scope.dataList[0].batchNumber, function (result) {
                  $scope.paymentInfo = {
                      paymentType: "2",
                      totalWeight: 0,
                      shippingFee: 0
                  }
                  $.each(result, function (i, item) {
                      $.each($scope.dataList, function (j, order) {
                          if (order.orderNumber == item.orderNumber) {
                              order = $.extend(order, item);
                              return false;
                          }
                      });
                      $scope.paymentInfo.totalWeight += item.totalWeight;
                      $scope.paymentInfo.shippingFee += item.totalCount;
                  });
              });

              $scope.stepValidation[3] = true;
              $scope.validPaymentPrice();
          },
          //step 5
          function () {
              $scope.paymentErrorMessage = "";
              //var orderArray = [];
              //$.each($scope.dataList, function (index, item) {
              //    var row = {
              //        "orderNumber": item.orderNumber,
              //        "orderStatus": "Paid",
              //        "payType": $scope.paymentInfo.paymentType,
              //        "payDate": $filter("date")(Date.now(), "yyyy-MM-dd HH:mm:ss"),
              //        "paied": $filter("number")($scope.paymentPrice / $scope.paymentInfo.shippingFee * item.totalCount, 2),
              //        "eventCode": 102
              //    };
              //    orderArray.push(row);
              //});
              //orderService.batchUpdate(orderArray, function (result) {
              //    if (!!result.message) {
              //        $scope.paymentErrorMessage = result.message;
              //    }
              //});
              orderService.outbound({
                  "batchNumber": $scope.dataList[0].batchNumber,
                  "paied": $scope.paymentPrice,
                  "payType": $scope.paymentInfo.paymentType
              }, function (result) {
                  if (!!result.message) {
                      $scope.paymentErrorMessage = result.message;
                  }
              });
          }
      ]


      //step 3
      $scope.dataList = [];
      $scope.pagination = {
          pageSize: "20",
          pageIndex: 1,
          totalCount: 0
      }
      $scope.openDetail = function (item) {
          orderService.getDetail(item.orderNumber, function (result) {
              $scope.editOrderInfo = angular.copy($.extend(true, item, result));
              $scope.editOrderInfo.message = "";
              //attach trackingNumber to item. Added By Dyllon;
              if (!!$scope.editOrderInfo.orderItems) {
                  $.each($scope.editOrderInfo.orderItems, function (i, item) {
                      $.each($scope.editOrderInfo.outboundPackages, function (i, pkg) {
                          if ($.grep(pkg.items, function (n) { return n.transactionNumber == item.transactionNumber }).length > 0) {
                              item.trackingNumber = pkg.trackingNumber;
                              return false;
                          }
                      });
                  });
              }

              $("#offlineOrderDetailModal").modal("show");
          });
      }
      $scope.btnRemoveOrder = function (item) {
          plugMessenger.confirm("确定要删除吗？", function (isOK) {
              if (isOK) {
                  orderService.delete(item.orderNumber, function (result) {
                      if (result.success == true) {
                          $scope.dataList = $.grep($scope.dataList, function (n) { return n.orderNumber != item.orderNumber });
                      }
                  });
              }
          });
      }
      //$scope.btnEditAddPackage = function () {
      //    orderService.generatePackageNumber({
      //        "trackingNumber": "UMI",
      //        "orderNumber": $scope.editOrderInfo.orderNumber
      //    },function (result) {
      //        $scope.editOrderInfo.outboundPackages.push({
      //            trackingNumber: result.trackingNumber,
      //            actualWeight: null,
      //        });
      //    });
      //}
      $scope.btnSaveDetail = function () {
          orderService.updateOutboundPackageAndMessage({
              "orderNumber": $scope.editOrderInfo.orderNumber,
              "orderMessageNumber": $scope.editOrderInfo.orderMessageNumber,
              "message": $scope.editOrderInfo.message || "",
              "outboundPackages": $scope.editOrderInfo.outboundPackages
          }, function (result) {
              if (result.success == true) {
                  $.each($scope.dataList, function (i, item) {
                      if (item.orderNumber == $scope.editOrderInfo.orderNumber) {
                          $scope.editOrderInfo.actualTotalWeight = 0;
                          $.each($scope.editOrderInfo.outboundPackages, function (i, item) {
                              $scope.editOrderInfo.actualTotalWeight += parseFloat(item.actualWeight || 0);
                          });
                          $scope.editOrderInfo.actualTotalWeight = $scope.editOrderInfo.actualTotalWeight.toFixed(2);
                          $scope.dataList[i] = angular.copy($scope.editOrderInfo);
                          return false;
                      }
                  });
                  $("#offlineOrderDetailModal").modal("hide");
              }
          });
      }
    //   $scope.btnPrint = function (item) {
    //       $("<div></div>").barcode(item.trackingNumber, "code128", {
    //           addQuietZone: "1",
    //           barHeight: "50",
    //           barWidth: "1",
    //           bgColor: "#FFFFFF",
    //           color: "#000000",
    //           moduleSize: "5",
    //           output: "css",
    //           posX: "10",
    //           posY: "20"
    //       }).jqprint();
    //   }
 
      $scope.btnSplitPackage = function (item) {
          warehouseService.outboundPackageSplit({
              "trackingNumber": item.trackingNumber,
          }, function (result) {
              $scope.editOrderInfo.outboundPackages.push(result);
          });
      }

      $scope.btnRemovePackage = function (item) {
          plugMessenger.confirm("确定要删除该包裹吗？", function (isOK) {
              if (isOK) {
                  orderService.deleteOutboundPackage([item.trackingNumber], function (result) {
                      if (result.success == true) {
                          $scope.editOrderInfo.outboundPackages = $.grep($scope.editOrderInfo.outboundPackages, function (n) { return n.trackingNumber != item.trackingNumber });
                      }
                  });
              }
          });
      }

      $scope.validPaymentPrice = function () {
          $scope.btnNextEnable = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test($scope.paymentPrice);
      }

      $scope.btnBatchQuery = function () {
        $scope.stepIndex = 3;
        $scope.selectedListCache = [];

        if (!$scope.searchBatchNumber) return false;
          orderService.getList({
              "pageInfo": {
                  "pageSize": 9999,
                  "pageIndex": 1
              },
              "batchNumber": $scope.searchBatchNumber || ""
          }, function (result) {
              if (!!result.data) {
                  if (result.data.length > 0) {
                      $scope.dataList = [];
                      $.each(result.data, function (index, item) {
                          if (item.orderStatus == "Unpaid") {
                              item.customerNumber = item.customer.customerNumber;
                              item.id = item.referenceOrderNumber;
                              item.actualTotalWeight = 0;
                              //item.outboundPackages = item.outboundPackage;
                              $.each(item.outboundPackages, function (i, pkg) {
                                  item.actualTotalWeight += pkg.actualWeight;
                              });
                              item.actualTotalWeight = item.actualTotalWeight.toFixed(2);
                              //item.warehouseNumber
                              $scope.dataList.push(item);
                          }
                      });
                      if ($scope.dataList.length == 0) {
                          plugMessenger.info("该批号对应的订单都已完成支付");
                          return false;
                      }
                      $wizard.data("wizard").selectedItem({ step: 3 });
                      $scope.tpl_status.step3 = 2;
                      $scope.stepValidation[2] = true;
                      $scope.btnNextEnable = true;
                  } else {
                      plugMessenger.info("您输入的的订单批号不存在");
                  }
              }
          });
      };
      $scope.selectedListCache = [];

      $scope.btnSelectedItem = function(item) {
        if (!!item) {
            if (!item._selected) {
                $scope.searchBar.selectedAll = false;
            }
        } else {
            $.each($scope.dataList, function(i, item) {
                item._selected = $scope.searchBar.selectedAll;
            });
        }
        //将当前页所有选中的item缓存到$scope.selectedListCache中（并去重）。
        $.each($scope.dataList, function(i, item) {
            var isExists = $.grep($scope.selectedListCache, function(n) { return n.orderNumber == item.orderNumber }).length > 0;
            if (!!item._selected && isExists == false) {
                $scope.selectedListCache.push(angular.copy(item));
            } else if (!item._selected && isExists == true) {
                $scope.selectedListCache = $.grep($scope.selectedListCache, function(n) { return n.orderNumber != item.orderNumber });
            }
        });
    }

      $scope.btnClearSelectedListCache = function() {
        $scope.selectedListCache = [];
        $scope.searchBar.selectedAll = false;
        $.each($scope.dataList, function(i, item) {
            item._selected = false;
        });
    };

    $scope.btnPrint = function(item, type) {            
        var _print = function() {
            switch (type) {
                case "package":
                    $scope.$broadcast("print-offline-package.action", item.orderNumber);
                    break;
                case "trackingNumber":
                    $scope.$broadcast("print-tracking-number.action", item);
                    break;
            }
        };

        _print();
    };

    $scope.btnPrintBatch = function(type) {
        var orderNumbers = [];
        var selectedList = angular.copy($scope.selectedListCache);
        $.each($scope.selectedListCache, function(index, item) {
            orderNumbers.push(item.orderNumber);
        });
        var _print = function() {
            if (orderNumbers.length > 0) {
                switch (type) {
                    case "package":
                        $scope.$broadcast("print-offline-package.action", orderNumbers);
                        break;
                    case "trackingNumber":
                        // _printTrackingNumbers(selectedList);
                        $scope.$broadcast("print-tracking-number.action", selectedList);
                        break;
                }
            }
        }

        if ($scope.selectedListCache.length == 0) {

            $.each($scope.dataList, function (i, item) {
                orderNumbers.push(item.orderNumber);
                selectedList.push(item);
            });
        };

        _print();
    };
  }]);
