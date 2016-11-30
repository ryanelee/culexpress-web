'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptNoASNCtrl
 * @description
 * # ReceiptNoASNCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ReceiptNoASNCtrl', ['$scope', '$location', '$window', 'receiptService', 'warehouseService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, receiptService, warehouseService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = {};
            $scope.warehouseList = [];
            $scope.flag = '0'


            $scope.checkReceiveIdentity = function () {
                $scope.flag = '0'
                receiptService.checkReceiveIdentity($scope.data).then(function (result) {
                    console.log(result);
                    if (result.data.code == '999') {
                        plugMessenger.error(result.data.msg);
                        return;
                    }
                    if (result.data.code == '000') {
                        $scope.data.customerNumber = result.data.data[0].customerNumber
                    }
                })
            }

            $scope.checkInboundPackage = function () {
                receiptService.checkInboundPackage($scope.data).then(function (result) {
                    $scope.flag = '0'
                    console.log(result);
                    if (result.data.code == '999') {
                        plugMessenger.error(result.data.msg);
                        return;
                    }
                    if (result.data.code == '000') {
                        if ($scope.data.customerNumber) {
                            $scope.flag = '1'
                        }
                    }
                })
            }


            warehouseService.getWarehouse(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var detail = {}
                    $scope.data.warehouseNumber = result[0].warehouseNumber
                    detail['key'] = result[i].warehouseNumber
                    detail['value'] = result[i].warehouseName;
                    $scope.warehouseList.push(detail);
                }
                console.log($scope.warehouseList);
            });


            $scope.inboundpackage = function () {
                warehouseService.inboundpackage($scope.data).then(function (result) {
                    if (result.status == 200) {
                        $scope.btnSave()
                    }
                })
            }


            $scope.btnSave = function () {
                var _callback = function (result) {
                    if (!result.message) {
                        plugMessenger.success("登记成功，请到收货管理页面打印清单");
                        $scope.data = null;
                    } else {
                        plugMessenger.success("货物预报成功，入库失败，请到收货仓库入库");
                    }
                }
                receiptService.saveForOnline($scope.data, _callback);
            }


            $scope.btnSaveAndPrint = function () {
                if (!$scope.data.receiveIdentity
                    || !$scope.data.customerNumber
                    || !$scope.data.trackingNumber
                    || !$scope.data.carrierName
                    || !$scope.data.warehouseNumber
                    || !$scope.data.packageWeight
                    || !$scope.data.packageDescription) {
                    plugMessenger.error("请填写所有必填项");
                    return;
                } else {
                    $scope.data.weight = $scope.data.packageWeight
                    $scope.data.receiptNumber = $scope.data.trackingNumber
                    $scope.inboundpackage()
                }

            }




            // $scope.btnPrint = function (item) {
            //     $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item });
            // }





            $scope.btnPrev = function () {
                $window.history.back();
            }
        }]);