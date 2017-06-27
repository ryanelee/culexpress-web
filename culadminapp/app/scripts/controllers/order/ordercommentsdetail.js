'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderDetailCtrl
 * @description
 * # OrderDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderCommentsDetailCtrl', ["$scope", "$location", "$window", "orderService", "addressService", "customerMessageService", "plugMessenger",
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
            $scope.data = [];
            $scope.refreshMessage = function() {
                customerMessageService.getDetail($location.search().orderMessageNumber, function(result) {
                    $scope.data.messageLogs = [];
                    if (!!result) {
                        $scope.data = result.data
                        $scope.data.messageLogs = result.data.messageLogs;
                        $scope.data.messageLogs.forEach(function (e) {
                            if (e.images && e.images.indexOf(",") >= 0) {
                                e.images = e.images.split(',');
                            } else {
                                e.images = [e.images];
                            }
                        })
                        console.log('refreshMessage')
                        console.log($scope.data)
                    }
                    _buildUpload($('#uploadImg'), "_images");
                });
            }
            $scope.refreshMessage();

            $scope.btnEditOrderItems = function() {
                $scope._editOrderItemsData = JSON.parse(JSON.stringify($scope.data.orderItems));
                $scope._editOrderItems = true;
            }

            $scope.cloneAddress = null;
            $scope.btnEditOrderAddress = function(address) {
                $scope.cloneAddress = angular.copy(address);

                address._edit = true;
            }


            $scope.btnMessagePush = function() {
                if (!!$scope._message) {
                    customerMessageService.push({
                        "messageNumber": $location.search().orderMessageNumber,
                        "message": $scope._message,
                        "images": $scope.data._images
                    }, function(result) {
                        $scope.refreshMessage();
                        $scope._message = "";
                        $scope.data._images = "";
                        $("#uploadImg_show").attr('src',''); 
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
                        // $scope.btnPrev();
                        $window.location.reload();
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.sessionStorage.setItem("historyFlag", 1);                
                $window.history.back();
            }

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "orderdetail":
                        $location.search({ orderNumber: item.orderNumber });
                        $location.path("/order/orderdetail");
                        break;
                    case "customerdetail":
                        $location.search({ customerNumber: item.customer.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            //----------upload file START----------
            var _buildUpload = function ($el, key) {
                //console.log("key" + key);
                var _$panel = $el.parents(".fileupload-buttonbar:first");
                $el.fileupload({
                    url: cul.apiPath + '/files/upload',
                    type: "post",
                    headers: {
                        token: sessionStorage.getItem("token")
                    }
                }).bind('fileuploadprogress', function (e, result) {
                    var progress = parseInt(result.loaded / result.total * 100, 10);
                    _$panel.find("#progress").css('width', progress + '%');
                }).bind('fileuploaddone', function (e, data) {
                    _$panel.find("#file_btn_text").text("重新上传");
                    $scope.$apply(function () {
                        //console.log("上传结束");
                        $scope.data[key] = data.result.url;
                        // $scope.data[key + "Url"] = data.result.url;
                        console.log( $scope.data[key]);

                    });
                });
            }
            //----------upload file END----------
        }
    ]);