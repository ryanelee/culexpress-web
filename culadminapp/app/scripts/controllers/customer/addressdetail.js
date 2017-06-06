'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:AddressListCtrl
 * @description
 * # AddressListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('AddressDetailCtrl', ["$scope", "$location", "addressService", "plugMessenger", "$window",
        function($scope, $location, addressService, plugMessenger, $window) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.transactionNumber = $location.search().transactionNumber;
            $scope.tpl_status = {
                provinceList: [],
                apiPath: cul.apiPath
            }

            $scope.search = {};
            $scope.search.parentid = 0;
            $scope.search.province = {};

            $scope.provinces = [];
            $scope.citys = [];
            $scope.areas = [];
            $scope.getProvince = function(province, city, area) {
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.provinces = data.data.data;
                    if (province) {
                        $scope.provinces.forEach(function(e) {
                            if (province.indexOf(e.name) >= 0) {
                                $scope.data.stateOrProvince = e;
                            }
                        })
                        if (city) {
                            $scope.getCity(city, area);
                        }
                    }
                })
            }
            $scope.getProvince();

            $scope.getCity = function(city, area) {
                $scope.search.parentid = $scope.data.stateOrProvince.id;
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.citys = data.data.data;
                    if (city) {
                        $scope.citys.forEach(function(e) {
                            if (city.indexOf(e.name) >= 0) {
                                $scope.data.city = e;
                            }
                        })
                        if (area) {
                            $scope.getArea(area);
                        }
                    }

                })
            }
            $scope.getArea = function(area) {
                $scope.search.parentid = $scope.data.city.id;
                addressService.getDistrict($scope.search).then(function(data) {
                    $scope.areas = data.data.data;
                    if (area) {
                        $scope.areas.forEach(function(e) {
                            if (area.indexOf(e.name) >= 0) {
                                $scope.data.area = e;
                            }
                        })
                    }
                })
            }


            // $scope.getProvince();
            // $scope.change = function() {
            //     console.log($scope.data.stateOrProvince)
            // }




            $scope.init = function() {
                addressService.getDetail($scope.transactionNumber, function(result) {
                    console.log(result);
                    $scope.data = result;
                    $scope._province = result.stateOrProvince;
                    $scope._city = result.city;
                    $scope._area = result.area;
                    $scope.getProvince($scope._province, $scope._city, $scope._area)
                        // _changeProvince();
                    _buildUpload($('#fileupload_front'), "idCardFront");
                    _buildUpload($('#fileupload_back'), "idCardBack");
                });
            }

            $scope.init();

            var _changeProvince = function() {
                var _selectedProvince = $.grep($scope.tpl_status.provinceList, function(n) { return n.name == $scope.data.stateOrProvince });
                if (_selectedProvince.length > 0) $scope.tpl_status.cities = [{ name: "请选择" }].concat(_selectedProvince[0].cities);
            }

            $scope.changeProvince = function() {
                $scope.data.city = "请选择";
                _changeProvince()
            }

            $scope.btnSave = function() {
                $scope.data.stateOrProvince = $scope.data.stateOrProvince.name;
                $scope.data.city = $scope.data.city.name;
                $scope.data.area = $scope.data.area.name;
                if ($scope.data.city == "") {
                    plugMessenger.info("收货地址没有填写完整");
                    return;
                }
                addressService.update($scope.data, function(result) {
                    if (!result.message) {
                        plugMessenger.success("保存成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrev = function() {
               
                $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
            }

            $scope.btnPrint = function() {
                $scope.$broadcast("print-idcard.action", { data: [$scope.data] });
            }



            //----------upload file START----------
            var _buildUpload = function($el, key) {
                    //console.log("key" + key);
                    var _$panel = $el.parents(".fileupload-buttonbar:first");
                    $el.fileupload({
                        url: cul.apiPath + '/files/upload',
                        type: "post",
                        headers: {
                            token: sessionStorage.getItem("token")
                        }
                    }).bind('fileuploadprogress', function(e, result) {
                        var progress = parseInt(result.loaded / result.total * 100, 10);
                        _$panel.find("#progress").css('width', progress + '%');
                    }).bind('fileuploaddone', function(e, data) {
                        _$panel.find("#file_btn_text").text("重新上传");
                        $scope.$apply(function() {
                            //console.log("上传结束");
                            $scope.data[key] = data.result.url;
                            $scope.data[key + "Url"] = data.result.url;

                        });
                    });
                }
                //----------upload file END----------
        }
    ]);