'use strict';

/**
 * @ngdoc function
 * @name culwebApp.controller:MyaddresscontrollerCtrl
 * @description
 * # MyaddresscontrollerCtrl
 * Controller of the culwebApp
 */
angular.module('culwebApp')
  .controller('MyAddressController', ['$rootScope', '$scope', '$state', '$timeout', '$q', '$http', '$filter', 'addressSvr', '$stateParams', '$element', 'Customer', 'SweetAlert',
      function ($rootScope, $scope, $state, $timeout, $q, $http, $filter, addressSvr, $stateParams, $element, Customer, SweetAlert) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.provinceList = [];


          var rebindStateOrProvince = function (stateOrProvinceVal, cityVal) {
              if ($scope.provinceList.length <= 0) {
                  loadAddressData();
              }
              else {
                  $timeout(function () {
                      $scope.data.stateOrProvince = stateOrProvinceVal;
                      if (!!angular.isString(stateOrProvinceVal)) {
                          var querItem = $filter('filter')($scope.provinceList, function (item) { return item.name === stateOrProvinceVal || item.name === stateOrProvinceVal + '省'; })[0];
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
                              $scope.selectedCity = $filter('filter')($scope.data.stateOrProvince.cities, function (item) { return item.name === cityVal || item.name === cityVal + '市'; })[0];
                          }
                      }
                      else {
                          $scope.selectProvince();
                      }
                  }, 200);
              }
          }


          var loadAddressData = function () {
              var localData = window.localStorage.getItem('cul_data_province');
              if (!!localData) {
                  $scope.provinceList = JSON.parse(localData);
                  rebindStateOrProvince($scope.provinceList[0]);
              }
              else {
                  Customer.retrieveProvinceList(function (data) {
                      window.localStorage.setItem('cul_data_province', JSON.stringify(data));
                      $scope.provinceList = data;

                      if (!$stateParams.addressId) {
                          rebindStateOrProvince($scope.provinceList[0]);
                      }
                  }, function (error) {
                      if (error.data.message) {
                          console.error(error.data.message)
                      }
                  });
              }
          }
          loadAddressData();


          $scope.selectProvince = function () {
              $scope.selectedCity = $scope.data.stateOrProvince.cities[0];
          }

          var data = $scope.data = {
              customerNumber: $rootScope.currentUser.customerNumber
          };

          var addAddress = function () {
              $scope.data.stateOrProvince = $scope.data.stateOrProvince.name;
              $scope.data.city = $scope.selectedCity.name;
              $scope.data.addressType = 1;
              addressSvr
                  .submitAddresInfo($scope.data)
                  .then(function (result) {
                      if (result.data) {
                          if (!$scope.$root.isAddressList) {
                              $scope.$root.goback();
                          } else {
                              $state.go('customer.myaccount', { anchorid: 'addressbook' })
                          }
                      }
                  }, function (result) {
                      if (result.data.message) {
                          SweetAlert.swal('错误', result.data.message, 'error');
                      }
                  });
          }, updateAddress = function () {
              $scope.data.stateOrProvince = $scope.data.stateOrProvince.name;
              $scope.data.city = $scope.selectedCity.name;
              $scope.data.addressType = 1;
              addressSvr
                  .updateAddressInfo($scope.data)
                  .then(function (result) {
                      if (result.data.success) {
                          $state.go('customer.myaccount', { anchorid: 'addressbook' })
                      }
                  }, function (result) {
                      if (result.data.message) {
                          SweetAlert.swal('错误', result.data.message, 'error');
                      }
                  });
          }, precheck = function () {
              var canSubmit = true;
              $element.find('.required').each(function () {
                  var labelName = $(this).text(),
                      inputDom = $(this).parent().find('input');
                  if (!inputDom.val() && canSubmit) {
                      SweetAlert.swal('提醒', '请输入' + labelName + '.', 'warning');
                      canSubmit = false;
                  }
              });

              $element.find('input.email').each(function () {
                  var inputDom = $(this);
                  var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                  if (inputDom.val() && !regEmail.test(inputDom.val())) {
                      SweetAlert.swal('提醒', '邮箱格式输入错误，请重新输入.', 'warning');
                      canSubmit = false;
                  }
              });

              return canSubmit;
          }


          $scope.state = {
              showCardFront: true,
              showCardBack: true
          };

          var executeUpload = function (name, file, markObj) {
              if (!markObj.upload) return false;
              var form = new FormData();
              form.append(name, file);

              $http.post(cul.apiPath + '/files/upload', form, {
                  transformRequest: angular.identity,
                  headers: { 'Content-Type': undefined }
              }).success(function (result) {
                  if (!!result.filePath) {
                      markObj.result = true;
                      $scope.data[markObj.dataProp || name] = result.filePath;
                      markObj.url = result.url;

                      markObj.hookHandler && markObj.hookHandler();
                  }
              }).error(function () {
                  markObj.error = true;

                  markObj.hookHandler && markObj.hookHandler(false);
              });
              return true;
          },
          uploadIdCardImage = function (modelName, callback, dataProp) {
              //var frontFile = $(id).get(0).files[0],
              //    cardBackFile = $('#idCardBack').get(0).files[0];

              var frontFile = $('#' + modelName).get(0).files[0];
              //,cardBackFile = $('#idCardBack').get(0).files[0]

              var mark = {
                  dataProp: dataProp || modelName,
                  upload: !!frontFile, result: false, error: false, hookHandler: function (result) {
                      if (result === false) {
                          callback && callback(false);
                      }
                      else {
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

          $('#idCardFront').on('change', function () {
              //var reader = new FileReader();
              //reader.onload = function (event) {
              //    if (!!$('#img-idCardFront').length) {
              //        $('#img-idCardFront').attr('src', event.target.result);
              //    }
              //}
              //reader.readAsDataURL(this.files[0]);

              uploadIdCardImage('idCardFront', function (obj) {
                  $scope.data.idCardFrontUrl = obj.url;
                  $scope.state.showCardFront = false;
                  //$('#img-idCardFront').attr('src', obj.url);
              })

          });
          $('#idCardBack').on('change', function () {
              //var reader = new FileReader();
              //reader.onload = function (event) {
              //    if (!!$('#img-idCardBack').length) {
              //        $('#img-idCardBack').attr('src', event.target.result);
              //    }
              //}
              //reader.readAsDataURL(this.files[0]);
              uploadIdCardImage('idCardBack', function (obj) {
                  $scope.data.idCardBackUrl = obj.url;
                  $scope.state.showCardBack = false;
                  //$('#img-idCardBack').attr('src', obj.url);
              });
          });

          $scope.submitAddress = function () {
              if (!precheck()) return false;

              if ($stateParams.addressId) {
                  updateAddress();
              } else {
                  addAddress();
              }
          }



          if ($stateParams.addressId) {
              addressSvr
                  .getAddressInfo($stateParams.addressId)
                  .then(function (result) {
                      if (result.data) {
                          $timeout(function () {
                              $scope.data = result.data;
                              rebindStateOrProvince($scope.data.stateOrProvince, $scope.data.city);
                              $scope.$apply(function () {
                                  if (!!$scope.data.idCardFront) $scope.state.showCardFront = false;
                                  if (!!$scope.data.idCardBack) $scope.state.showCardBack = false;
                              })
                          });
                      }
                  }, function (error) {
                      if (error.data.message) {
                          console.error(error.data.message)
                      }
                  });
          }


      }]);
