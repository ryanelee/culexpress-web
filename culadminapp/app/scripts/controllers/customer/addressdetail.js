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
        function ($scope, $location, addressService, plugMessenger, $window) {
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
            $scope.tempProvinces = [];
            $scope.citys = [];
            $scope.tempCitys = [];
            $scope.tempAreas = [];
            $scope.areas = [];
            $scope.getProvince = function (province, city, area) {
                addressService.getDistrict($scope.search).then(function (data) {
                    $scope.tempProvinces = data.data.data;
                    $scope.tempProvinces.forEach(function (e) {
                        var detail = {};
                        detail.name = e.name;
                        $scope.provinces.push(detail);
                        if (province && province.indexOf(e.name) >= 0) {
                            $scope.data.stateOrProvince = e.name;
                            $scope.getCity(city, area);
                        }
                        // $scope.provinces.push(e.name);
                        // console.log("-->" + JSON.stringify($scope.selectedProvince));
                    })
                })
            }


            $scope.getCity = function (city, area) {
                $scope.selectedArea = {}
                var flag = 0;
                $scope.citys = [];
                $scope.search.parentid;
                $scope.tempProvinces.forEach(function (e) {

                    // console.log($scope.search.selectedProvince);
                    if ($scope.data.stateOrProvince == e.name) {
                        $scope.search.parentid = e.id;
                    }
                })
                if ($scope.search.parentid) {
                    addressService.getDistrict($scope.search).then(function (data) {
                        $scope.tempCitys = data.data.data;
                        $scope.tempCitys.forEach(function (e) {
                            var detail = {};
                            detail.name = e.name
                            $scope.citys.push(detail);

                            if (city && city.indexOf(e.name) >= 0) {
                                $scope.data.city = e.name;
                                $scope.getArea(area);
                            }
                            // $scope.citys.push(e.name);
                        })
                    })
                }
            };

            // $scope.getCity();
            $scope.getArea = function (area) {
                $scope.areas = [];
                $scope.tempCitys.forEach(function (e) {
                    //console.log($scope.data);
                    if ($scope.data.city && $scope.data.city.indexOf(e.name) >= 0) {
                        $scope.search.parentid = e.id;
                        addressService.getDistrict($scope.search).then(function (data) {

                            $scope.tempAreas = data.data.data;
                            $scope.tempAreas.forEach(function (e) {
                                var detail = {};
                                detail.name = e.name
                                $scope.areas.push(detail);
                                if (area && e.name == area) {
                                    $scope.data.area = e.name
                                }
                                // $scope.areas.push(e.name);
                            })
                        })
                    }
                })
            }

            // $scope.getProvince();

            $scope.init = function () {
                console.log("wonderful world");
                addressService.getDetail($scope.transactionNumber, function (result) {
                    $scope.data = result;
                    $scope._province = result.stateOrProvince;
                    $scope._city = result.city;
                    $scope._area = result.area;
                    $scope.getProvince($scope._province, $scope._city, $scope._area)
                    _changeProvince();
                    _buildUpload($('#fileupload_front'), "idCardFront");
                    _buildUpload($('#fileupload_back'), "idCardBack");
                });
            }

            $scope.init();

            var _changeProvince = function () {
                var _selectedProvince = $.grep($scope.tpl_status.provinceList, function (n) { return n.name == $scope.data.stateOrProvince });
                if (_selectedProvince.length > 0) $scope.tpl_status.cities = [{ name: "请选择" }].concat(_selectedProvince[0].cities);
            }

            $scope.changeProvince = function () {
                var _selectedProvince = $.grep($scope.tpl_status.provinceList, function (n) { return n.name == $scope.data.stateOrProvince });

                $scope.getCity();
                //$scope.data.city = "请选择";
                //_changeProvince();
            }

            $scope.changeCity = function(){
                $scope.getArea();
            };

            $scope.btnSave = function () {
                console.log("保存信息")
                console.log($scope.data);
                if ($scope.data.city == "") {
                    plugMessenger.info("收货地址没有填写完整");
                    return;
                }
                addressService.update($scope.data, function (result) {
                    if (!result.message) {
                        plugMessenger.success("保存成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrev = function () {
                $window.history.back();
            }

            //----------upload file START----------
            var _buildUpload = function ($el, key) {
                console.log("key"+key);
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
                        console.log("上传结束");
                        $scope.data[key] = data.result.url;
                        $scope.data[key+"Url"] = data.result.url;
                    });
                });
            }
            //----------upload file END----------
        }]);
