'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryDetailCtrl
 * @description
 * # WarehouseInventoryDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseInventoryDetailCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger',
        function ($scope, $location, $window, inventoryService, plugMessenger) {
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
                            inventoryService.getInfo($scope.tempItemNumber, function (result) {
                                if (!!result) {
                                    $scope.data = result;
                                    //console.log($scope.data.inventoryList.shelfList);

                                    if ($scope.data.inventoryList[0]) {
                                        $scope.data.inventoryList.forEach(function (e1) {
                                            if (e1.shelfList && e1.shelfList[0]) {
                                                e1.shelfList.forEach(function (e) {
                                                    if (e.sendType == '1') {
                                                        e._sendType = "线下订单"
                                                    }
                                                    if (e.sendType == '2') {
                                                        e._sendType = "海淘订单"
                                                    }
                                                    if (e.shelfNumber.substr(0, 1) == 'C') {
                                                        e._sendType = "异常订单"
                                                    }
                                                    if (e.shelfNumber.substr(0, 1) == 'D') {
                                                        e._sendType = "员工包裹"
                                                    }
                                                })
                                            }

                                        })
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

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
            }
        }]);
