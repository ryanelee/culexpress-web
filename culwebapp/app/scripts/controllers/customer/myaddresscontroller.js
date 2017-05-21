'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:MyaddresscontrollerCtrl
 * @description
 * # MyaddresscontrollerCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
    .controller('MyAddressController', ['$rootScope', '$scope', '$state', '$timeout', '$q', '$http', '$filter', 'addressSvr', '$stateParams', '$element', 'Customer', '$window', 'AuthService',
        function($rootScope, $scope, $state, $timeout, $q, $http, $filter, addressSvr, $stateParams, $element, Customer, $window, AuthService) {
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
            $scope.getProvince = function(province, city, area) {
                addressSvr.getDistrict($scope.search).then(function(data) {
                    $scope.provinces = data.data.data;
                    if (province) {
                        $scope.provinces.forEach(function(e) {
                            if (province.indexOf(e.name) >= 0) {
                                $scope.search.province = e;
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
                $scope.search.parentid = $scope.search.province.id;
                addressSvr.getDistrict($scope.search).then(function(data) {
                    $scope.citys = data.data.data;
                    if (city) {
                        $scope.citys.forEach(function(e) {
                            if (city.indexOf(e.name) >= 0) {
                                $scope.search.city = e;
                            }
                        })
                        if (area) {
                            $scope.getArea(area);
                        }
                    }

                })
            }
            $scope.getArea = function(area) {
                $scope.search.parentid = $scope.search.city.id;
                addressSvr.getDistrict($scope.search).then(function(data) {
                    $scope.areas = data.data.data;
                    if (area) {
                        $scope.areas.forEach(function(e) {
                            if (area.indexOf(e.name) >= 0) {
                                $scope.search.area = e;
                            }
                        })
                    }
                })
            }


            $scope.provinceList = [];


            var rebindStateOrProvince = function(stateOrProvinceVal, cityVal) {
                if ($scope.provinceList.length <= 0) {
                    loadAddressData();
                } else {
                    $timeout(function() {
                        $scope.data.stateOrProvince = stateOrProvinceVal;
                        if (!!angular.isString(stateOrProvinceVal)) {
                            var querItem = $filter('filter')($scope.provinceList, function(item) { return item.name === stateOrProvinceVal || item.name === stateOrProvinceVal + '省'; })[0];
                            if (!!querItem) $scope.data.stateOrProvince = querItem;
                            else {
                                $scope.data.stateOrProvince = {
                                    id: stateOrProvinceVal,
                                    name: stateOrProvinceVal,
                                    cities: [{
                                        id: cityVal,
                                        name: cityVal
                                    }]
                                };
                            }
                        }


                        if (!!cityVal) {
                            if (!!angular.isString(cityVal)) {
                                $scope.selectedCity = $filter('filter')($scope.data.stateOrProvince.cities, function(item) { return item.name === cityVal || item.name === cityVal + '市'; })[0];
                            }
                        } else {
                            $scope.selectProvince();
                        }
                    }, 200);
                }
            }


            var loadAddressData = function() {
                var localData = window.localStorage.getItem('cul_data_province');
                if (!!localData) {
                    $scope.provinceList = JSON.parse(localData);
                    rebindStateOrProvince($scope.provinceList[0]);
                } else {
                    Customer.retrieveProvinceList(function(data) {
                        window.localStorage.setItem('cul_data_province', JSON.stringify(data));
                        $scope.provinceList = data;

                        if (!$stateParams.addressId) {
                            rebindStateOrProvince($scope.provinceList[0]);
                        }
                    }, function(error) {
                        if (error.data.message) {
                            console.error(error.data.message)
                        }
                    });
                }
            }
            loadAddressData();


            $scope.selectProvince = function() {
                // console.log($scope.data.stateOrProvince.cities);
                // $scope.selectedCity = $scope.data.stateOrProvince.cities[0];
            }

            var data = $scope.data = {
                customerNumber: AuthService.getUser().customerNumber
            };

            var addAddress = function() {
                    // $scope.data.stateOrProvince = $scope.data.stateOrProvince.name;
                    // $scope.data.city = $scope.selectedCity.name;
                    $scope.data.stateOrProvince = $scope.search.province.name;
                    $scope.data.city = $scope.search.city.name;
                    if ($scope.search.area) {
                        $scope.data.area = $scope.search.area.name;
                    }
                    if(!$scope.data.stateOrProvince 
                    || !$scope.data.city 
                    || !$scope.data.idCard){
                          alertify.alert('错误', '请填写必填项');
                    }
                    $scope.data.addressType = 1;
                    addressSvr
                        .submitAddresInfo($scope.data)
                        .then(function(result) {
                            if (result.data) {
                                if (!$scope.$root.isAddressList) {
                                    $scope.$root.goback();
                                } else {
                                    $state.go('customer.myaccount', { anchorid: 'addressbook' })
                                }
                            }
                        }, function(result) {
                            if (result.data.message) {
                                alertify.alert('错误', result.data.message, 'error');
                            }
                        });
                },
                updateAddress = function() {
                    // $scope.data.stateOrProvince = $scope.data.stateOrProvince.name;
                    // $scope.data.city = $scope.selectedCity.name;
                    $scope.data.stateOrProvince = $scope.search.province.name;
                    $scope.data.city = $scope.search.city.name;
                    if ($scope.search.area) {
                        $scope.data.area = $scope.search.area.name;
                    }
                    $scope.data.addressType = 1;
                    addressSvr
                        .updateAddressInfo($scope.data)
                        .then(function(result) {
                            if (result.data.success) {
                                $window.history.back();
                                // $state.go('customer.myaccount', { anchorid: 'addressbook' })
                            }
                        }, function(result) {
                            if (result.data.message) {
                                alertify.alert('错误', result.data.message, 'error');
                            }
                        });
                },
                precheck = function() {
                    var canSubmit = true;
                    $element.find('.required').each(function() {
                        var labelName = $(this).text(),
                            inputDom = $(this).parent().find('input');
                        if (!inputDom.val() && canSubmit) {
                            alertify.alert('提醒', '请输入' + labelName + '.', 'warning');
                            canSubmit = false;
                        }
                    });

                    $element.find('input.email').each(function() {
                        var inputDom = $(this);
                        var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                        if (inputDom.val() && !regEmail.test(inputDom.val())) {
                            alertify.alert('提醒', '邮箱格式输入错误，请重新输入.', 'warning');
                            canSubmit = false;
                        }
                    });

                    return canSubmit;
                }


            $scope.state = {
                showCardFront: true,
                showCardBack: true
            };

            var executeUpload = function(name, file, markObj) {
                    if (!markObj.upload) return false;
                    var form = new FormData();
                    form.append(name, file);

                    $http.post(cul.apiPath + '/files/upload', form, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).then(function(result) {
                        if (!!result.data.filePath) {
                            markObj.result = true;
                            var key = markObj.dataProp || name;
                            $scope.data[key] = result.data.filePath;
                            $scope.data[key + 'Url'] = result.data.url;
                            markObj.url = result.data.url;

                            markObj.hookHandler && markObj.hookHandler();
                        }
                    }, function() {
                        markObj.error = true;
                        markObj.hookHandler && markObj.hookHandler(false);
                    });
                    return true;
                },
                uploadIdCardImage = function(modelName, callback, dataProp) {
                    //var frontFile = $(id).get(0).files[0],
                    //    cardBackFile = $('#idCardBack').get(0).files[0];

                    var frontFile = $('#' + modelName).get(0).files[0];
                    //,cardBackFile = $('#idCardBack').get(0).files[0]

                    var mark = {
                        dataProp: dataProp || modelName,
                        upload: !!frontFile,
                        result: false,
                        error: false,
                        hookHandler: function(result) {
                            if (result === false) {
                                callback && callback(false);
                            } else {
                                callback && callback(mark);
                            }
                        }
                    };

                    mark.upload = executeUpload(modelName, frontFile, mark);
                    //mark.back.upload = executeUpload('idCardBack', cardBackFile, mark.back);

                    //if (mark.front.upload === false && mark.back.upload === false) {
                    //    callback && callback();
                    //    return false;
                    //}

                    //var mark = {
                    //    front: { upload: !!cardFrontFile, result: false, error: false },
                    //    back: { upload: !!cardBackFile, result: false, error: false }
                    //};

                    //mark.front.upload = executeUpload('idCardFront', cardFrontFile, mark.front);
                    //mark.back.upload = executeUpload('idCardBack', cardBackFile, mark.back);

                    //if (mark.front.upload === false && mark.back.upload === false) {
                    //    callback && callback();
                    //    return false;
                    //}




                    //var timer = setInterval(function () {
                    //    //一共两次反向逻辑
                    //    //1、第1次反向
                    //    var resultFront = !mark.front.upload, resultBack = !mark.back.upload;
                    //    //2、第2次反向
                    //    if (!resultFront) resultFront = !!mark.front.result || !!mark.front.error;
                    //    if (!resultBack) resultBack = !!mark.back.result || !!mark.back.error;

                    //    if (resultFront && resultBack) {
                    //        clearInterval(timer);
                    //        callback && callback(mark);
                    //    }
                    //});
                }

            $('#idCardFront').on('change', function() {
                //var reader = new FileReader();
                //reader.onload = function (event) {
                //    if (!!$('#img-idCardFront').length) {
                //        $('#img-idCardFront').attr('src', event.target.result);
                //    }
                //}
                //reader.readAsDataURL(this.files[0]);

                uploadIdCardImage('idCardFront', function(obj) {
                    $scope.data.idCardFrontUrl = obj.url;
                    $scope.state.showCardFront = false;
                    //$('#img-idCardFront').attr('src', obj.url);
                })

            });
            $('#idCardBack').on('change', function() {
                //var reader = new FileReader();
                //reader.onload = function (event) {
                //    if (!!$('#img-idCardBack').length) {
                //        $('#img-idCardBack').attr('src', event.target.result);
                //    }
                //}
                //reader.readAsDataURL(this.files[0]);
                uploadIdCardImage('idCardBack', function(obj) {
                    $scope.data.idCardBackUrl = obj.url;
                    $scope.state.showCardBack = false;
                    //$('#img-idCardBack').attr('src', obj.url);
                });
            });

            $scope.submitAddress = function() {
                if (!precheck()) return false;

                if ($stateParams.addressId) {
                    updateAddress();
                } else {
                    addAddress();
                }
            }
            //console.log($stateParams.addressId);
            if ($stateParams.addressId) {
                addressSvr
                    .getAddressInfo($stateParams.addressId)
                    .then(function(result) {
                        if (result.data) {
                            $timeout(function() {
                                $scope.data = result.data;

                                var province = result.data.stateOrProvince;
                                var city = result.data.city;
                                var area = result.data.area;
                                $scope.getProvince(province, city, area);


                                // rebindStateOrProvince($scope.data.stateOrProvince, $scope.data.city);
                                $scope.$apply(function() {
                                    if (!!$scope.data.idCardFront) $scope.state.showCardFront = false;
                                    if (!!$scope.data.idCardBack) $scope.state.showCardBack = false;
                                })
                            });
                        }
                    }, function(error) {
                        if (error.data.message) {
                            console.error(error.data.message)
                        }
                    });
            }

            if ($stateParams.addressId) {
                addressSvr
                    .checkAddress({ addressNumber: $stateParams.addressId })
                    .then(function(result) {
                        if (result.data.code == '999') {
                            alertify.alert('提示', result.data.msg, 'error');
                            $scope.changeAddress = '0'
                        }
                    })
            }


        }
    ]);