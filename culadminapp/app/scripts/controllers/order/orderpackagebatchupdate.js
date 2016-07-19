'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderPackageBatchUpdateCtrl
 * @description
 * # OrderPackageBatchUpdateCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderPackageBatchUpdateCtrl', ["$scope", "$timeout", "orderService", "plugMessenger", function ($scope, $timeout, orderService, plugMessenger) {
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
            $wizard = $("#order-package-wizard");
            $wizard.on('change', function (e, data) {
                if (data.direction == "next") {
                    if (!$scope.stepValidation[data.step - 1]) {
                        switch (data.step) {
                            case 1:
                                plugMessenger.info("请上传更新包裹物流Excel文件");
                                break;
                            case 2:
                                plugMessenger.info("文件检查未通过，请返回上一步重新上传");
                                break;
                        }
                        return false;
                    }
                }
                $timeout(function () {
                    $scope.stepIndex = data.step + (data.direction == "previous" ? -1 : 1);
                    $scope.btnNextEnable = false;
                });
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
                }
            });

            $('.wizard-wrapper .btn-next').click(function () {
                $wizard.wizard('next');
            });

            $('.wizard-wrapper .btn-prev').click(function () {
                $wizard.wizard('previous');
            });

            $('.wizard-wrapper .btn-update').click(function () {
                plugMessenger.confirm("确定要更新吗？", function (isOK) {
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
                  dictDefaultMessage: "点击此处上传更新包裹物流Excel。",
                  dictFallbackMessage: "您的浏览器不支持拖放文件上传方式。",
                  dictFileTooBig: "所选的文件太大({{filesize}}MiB)。 文件最大限制：{{maxFilesize}}MiB。",
                  dictInvalidFileType: "您不能上传该类型的文件。",
                  dictResponseError: "文件上传失败，错误代码 {{statusCode}}",
                  dictCancelUpload: "取消上传",
                  dictCancelUploadConfirmation: "您确定要取消这次上传吗？",
                  dictRemoveFile: "删除文件",
                  dictMaxFilesExceeded: "你不能上传更多文件。",
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
                          if (!!$scope.fileId) {
                              $scope.stepValidation[1] = true;
                              $scope.btnNextEnable = true;
                              $scope.excelErrorMessage = "";
                          } else {
                              $scope.stepValidation[1] = false;
                              $scope.excelErrorMessage = "预检测未通过";
                          }
                      });
                  }
              });
          },
          //step 3
          function () {
              orderService.orderPackageUpdateByExcel($scope.fileId, function (result) {
                  if (result == "import successfully") {
                      $scope.stepValidation[2] = true;
                      $scope.btnNextEnable = true;
                      $scope.excelErrorMessage = "";
                  } else {
                      $scope.stepValidation[2] = false;
                      $scope.excelErrorMessage = result || "包裹更新失败!";
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
                $scope.editOrderInfo = $.extend(true, item, result);
                $("#offlineOrderDetailModal").modal("show");
            });
        }
        $scope.btnRemoveOrder = function (item) {
            plugMessenger.confirm("确定要删除吗？", function (isOK) {
                if (isOK)
                    $scope.dataList = $.grep($scope.dataList, function (n) { return n.orderNumber != item.orderNumber });
            });
        }
        $scope.btnEditAddPackage = function () {
            orderService.generatePackageNumber(function (result) {
                $scope.editOrderInfo.outboundPackages.push({
                    trackingNumber: result,
                    actualWeight: null,
                });
            });
        }
        $scope.btnSaveDetail = function () {
            orderService.update($scope.editOrderInfo, function (result) {
                if (result == true) {
                    $.each($scope.dataList, function (i, item) {
                        if (item.orderNumber == $scope.editOrderInfo.orderNumber) {
                            $scope.editOrderInfo.actualTotalWeight = 0;
                            $.each($scope.editOrderInfo.outboundPackages, function (i, item) {
                                $scope.editOrderInfo.actualTotalWeight += parseFloat(item.actualWeight || 0);
                            });
                            $scope.dataList[i] = angular.copy($scope.editOrderInfo);
                            return false;
                        }
                    });
                    $("#offlineOrderDetailModal").modal("hide");
                }
            });
        }
        $scope.btnRemovePackage = function (item) {
            if (!!item.actualTotalWeight) {
                plugMessenger.confirm("确定要删除该包裹吗？", function (isOK) {
                    if (isOK)
                        $scope.editOrderInfo.outboundPackages = $.grep($scope.editOrderInfo.outboundPackages, function (n) { return n.trackingNumber != item.trackingNumber });
                });
            }
        }
    }]);
