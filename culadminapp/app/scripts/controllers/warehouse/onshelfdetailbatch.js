'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfDetailBatchCtrl
 * @description
 * # WarehouseOnShelfDetailBatchCtrl
 * Controller of the culAdminApp 
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfDetailBatchCtrl', ['$scope', '$location', '$window', 'shelfService', 'inventoryService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, shelfService, inventoryService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.data = null;
            $scope.receiptNumber = null;
            $scope.shelfInput = true;
            $scope.isOnShelf = false;
            $scope.shelfNumber = "";
            $scope.receiptNumber = "";
            $scope.shelfList = [];

            // 校验架位
            $scope.isExpecial = function () {
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    if (staffFlag != 'D') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("员工包裹必须以D开头");
                        return false;
                    } 
                }
                if ($scope.isUnusual == 2) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    if (staffFlag != 'C') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("异常包裹必须以C开头");
                        return false;
                    }
                }
                return true;
            }

            var _checkShelf = function () {
                var options = {
                    shelfNumber: $scope.shelfNumber,
                    pageInfo: {
                        pageIndex: 1,
                        pageSize: "20",
                        totalCount: 0
                    }
                }
                shelfService.getList(options, function (result) {
                    $scope.shelfList = result.data
                    console.log($scope.shelfList)
                    if ($scope.shelfList.length > 0) {
                        $scope.shelfInput = false;
                        $timeout(function () {
                            $window.document.getElementById('receiptNumber').focus();
                        }, 300);
                    } else {
                        plugMessenger.error("架位" + $scope.shelfNumber + "不存在，请重新输入");
                        $scope.shelfNumber = "";
                        $timeout(function () {
                            $window.document.getElementById('shelfNumber').focus();
                        }, 300);
                    }
                });
            }
            
            // 录入架位编号并enter
            $scope.keydownShelfNumber = function (event) {
                let shelfNumber = document.getElementById("shelfNumber").value;
                $scope.shelfNumber = shelfNumber
                if (!!$scope.shelfNumber) {
                    switch (event.keyCode) {
                        case 13:  //enter
                            _checkShelf();
                            break;
                    }
                }
            }

            // 录入入库单号并enter
            $scope.keydownReceiptNumber = function (event) {
                let rNumber = document.getElementById("receiptNumber").value;
                $scope.receiptNumber = rNumber
                if (!!$scope.receiptNumber) {
                    switch (event.keyCode) {
                        case 13:  //enter
                            $scope.checkReceiptNumber();
                            break;
                    }
                }  
            }

            $scope.checkReceiptNumber = function () {
                $scope.data = null
                if (!!$scope.receiptNumber) {
                    // 根据入库单号取单个商品,并判断是否已经上架
                    inventoryService.getInfoByReceiptNumber($scope.receiptNumber, function (result) {
                        if (!result.message) {
                            $scope.data = result;
                            //display shelf # if have been on shelf.
                            if (result && result.inventoryList && result.inventoryList.length > 0 && result.inventoryList[0].shelfNumber && $scope._itemType == "S1") {
                                $scope.isOnShelf = true;
                                plugMessenger.error("该商品已经上架，不允许重复上架");
                            } else {
                                // 还未上架，直接上架
                                $scope.btnSave();
                            }
                        }
                        $scope.receiptNumber = "";
                    });
                } else {
                    $scope.receiptNumber = "";
                }
            }

            // 上架
            $scope.btnSave = function (type) {
                if (!$scope.shelfNumber) {
                    plugMessenger.error("架位号不能为空");
                    return;
                }

                if ($scope.isExpecial() == false)
                    return;

                var data = {
                    itemNumber: $scope.data.itemNumber,
                    customerNumber: $scope.data.customerNumber,
                    receiveIdentity: $scope.data.receiveIdentity,
                    weight: $scope.data.weight,
                    shelfNumber: $scope.shelfNumber,
                    receiptNumber: $scope.receiptNumber,
                    itemCount: 1,
                    emailAddress: $scope.data.emailAddress
                }

                 //  商品上架
                shelfService.onshelfForInbound(data, function (result) {
                    if (result.success) {
                        plugMessenger.success("上架成功");
                        $scope.data = null;
                        $scope.receiptNumber = "";
                        $timeout(function () {
                            $window.document.getElementById('receiptNumber').focus();
                        }, 1000);
                    } else {
                        // 上架失败则停留在录入单号界面，并将错误信息反馈给操作员，操作员点击确认后进入架位录入页面。
                        plugMessenger.confirm("单号【 " + data.receiptNumber + " 】上架失败，是否重新输入架位再进行批量上架？", function (isOK) {
                            if (isOK) {
                                $scope.shelfInput = true;
                                $scope.receiptNumber = "";
                                $scope.shelfNumber = "";
                                $timeout(function () {
                                    $window.document.getElementById('shelfNumber').focus();
                                }, 300);
                            } else {
                                $scope.shelfInput = false;
                                $scope.receiptNumber = "";
                                $timeout(function () {
                                    $window.document.getElementById('receiptNumber').focus();
                                }, 300);
                            }
                        });
                    }
                });
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1); 
                $window.history.back();
            }
        }
    ]);