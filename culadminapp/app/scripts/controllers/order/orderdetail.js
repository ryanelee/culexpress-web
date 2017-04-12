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
        function($scope, $location, $window, orderService, addressService, customerMessageService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.search = {};
            $scope.search.parentid = 0;
            $scope.provinces = [];
            $scope.citys = [];
            $scope.areas = [];
            $scope.getProvince = function(province, city, area, address) {
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.provinces = data.data.data;
                    if (province) {
                        $scope.provinces.forEach(function(e) {
                            if (province.indexOf(e.name) >= 0) {
                                address.province = e;
                                $scope.search.province = e
                            }
                        })
                        if (city) {
                            $scope.getCity(city, area, address);
                        }
                    }
                })
            }
            $scope.getProvince();

            $scope.getCity = function(city, area, address) {
                // if (address || address.province || address.province.id)
                //     return;
                address.area = "";
                address.city = "";
                $scope.search.parentid = address.province.id;
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.citys = data.data.data;
                    if (city) {
                        $scope.citys.forEach(function(e) {
                            if (city.indexOf(e.name) >= 0) {
                                address.city = e;
                                $scope.search.city = e
                            }
                        })
                        if (area) {
                            $scope.getArea(area, address);
                        }
                    }

                })
            }
            $scope.getArea = function(area, address) {
                // if (address || address.city || address.city.id)
                //     return;
                $scope.search.parentid = address.city.id;
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.areas = data.data.data;
                    if (area) {
                        $scope.areas.forEach(function(e) {
                            if (area.indexOf(e.name) >= 0) {
                                address.area = e;
                                $scope.search.area = e
                            }
                        })
                    }
                })
            }


            $scope.provinceList = [];




            $scope.isPrintDetail = !!$location.search().print;

            $scope.isShow = false;
            orderService.getDetail($location.search().orderNumber, function(result) {
                console.log(result)
                $scope.data = result;
                $scope.result = result;
                if ($scope.data.shipToAddresses && $scope.data.shipToAddresses[0]) {
                    $scope.data.shipToAddresses.forEach(function(e) {
                        var province = e.stateOrProvince;
                        var city = e.city;
                        var area = e.area;
                        $scope.getProvince(province, city, area, e);
                    })
                }


                if (result._printStatus == "未打印") {
                    $scope.isShow = true;
                };
                $.each($scope.data.shipToAddresses, function(i, address) {
                    address._trackingNumbers = [];
                    $.each($scope.data.outboundPackages, function(i, outboundPackage) {
                        if (outboundPackage.address.transactionNumber == address.transactionNumber) {
                            address._trackingNumbers.push(outboundPackage.trackingNumber);
                        }
                    });
                });

                $scope.data._shippingFeeTotal = 0;
                $.each($scope.data.outboundPackages, function(i, outboundPackage) {
                    $scope.data._shippingFeeTotal += outboundPackage.shippingFee;
                });
                $scope.data._shippingFeeTotal = $scope.data._shippingFeeTotal.toFixed(2);

                $scope.refreshMessage();
            });

            $scope.refreshMessage = function() {
                customerMessageService.getDetail($scope.data.orderMessageNumber, function(result) {
                    $scope.data.messageLogs = [];
                    if (!!result) {
                        $scope.data.messageLogs = result.messageLogs;
                    }
                });
            }

            $scope.btnEditOrderItems = function() {
                $scope._editOrderItemsData = JSON.parse(JSON.stringify($scope.data.orderItems));
                $scope._editOrderItems = true;
            }

            $scope.cloneAddress = null;
            $scope.btnEditOrderAddress = function(address) {
                $scope.cloneAddress = angular.copy(address);

                address._edit = true;
            }
            $scope.btnSaveAddress = function(address) {
                console.log(address);
                // return;
                if (!!address.receivePersonName &&
                    !!address.cellphoneNumber &&
                    !!address.address1_before &&
                    !!address.city &&
                    !!address.zipcode) {
                    console.log(address);
                    address.stateOrProvince = address.province.name;
                    address.city = address.city.name;
                    address.area = address.area.name;

                    if (address.stateOrProvince.indexOf("区") < 0 && address.stateOrProvince.indexOf("市") < 0) {
                        if (!address.area) {
                            plugMessenger.info("收货地址没有填写全，不能提交更改。");
                            return;
                        }
                    } else {
                        address.area = " ";
                    }
                    address.address1 = address.address1_before
                    address.transactionNumber = address.addressNumber;
                    console.log(address);
                    // return;
                    addressService.update(address, function(result) {
                        if (result.success == true) {
                            address._edit = false;
                            $scope.cloneAddress = null;
                            plugMessenger.success("收货地址保存成功。");
                            setTimeout(function() {
                                $window.location.reload();
                            }, 300)
                        }
                    });
                } else {
                    plugMessenger.info("收货地址没有填写全，不能提交更改。");
                }
            }
            $scope.btnCancelAddress = function(address) {
                for (var key in $scope.cloneAddress) {
                    if (key != "$$hashKey") address[key] = $scope.cloneAddress[key];
                }
                address._edit = false;
                $scope.cloneAddress = null;
            }

            $scope.btnOrderItems_Oper = function(type, index) {
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
                        $scope.data.orderItems = $.grep($scope.data.orderItems, function(n) { return !!n });
                        break;
                    case "repeat":
                        var _repeatData = $.grep($scope._editOrderItemsData, function(n) { return n.transactionNumber == $scope.data.orderItems[index].transactionNumber });
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

            $scope.btnMessagePush = function() {
                if (!!$scope._message) {
                    customerMessageService.push({
                        "messageNumber": $scope.data.orderMessageNumber,
                        "message": $scope._message
                    }, function(result) {
                        $scope.refreshMessage();
                        $scope._message = "";
                    });
                }
            }

            $scope.btnSave = function() {
                var data = $scope.data;
                orderService.update({
                    "orderNumber": data.orderNumber,
                    "orderStatus": data.orderStatus,
                    "printStatus": data.printStatus,
                    "payDate": data.payDate,
                    "paied": data.paied,
                    "priceAdjustMemo": data.priceAdjustMemo,
                    "orderItems": data.orderItems
                }, function(result) {
                    if (!result.message) {
                        plugMessenger.success("保存成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.history.back();
            }
        }
    ]);