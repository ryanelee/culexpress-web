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


          addressService.getProvinceList(function (data) {
              $scope.tpl_status.provinceList = data;

              addressService.getDetail($scope.transactionNumber, function (result) {
                  $scope.data = result;

                  _changeProvince();
                  _buildUpload($('#fileupload_front'), "idCardFront");
                  _buildUpload($('#fileupload_back'), "idCardBack");
              });
          });

          var _changeProvince = function () {
              var _selectedProvince = $.grep($scope.tpl_status.provinceList, function (n) { return n.name == $scope.data.stateOrProvince });
              if (_selectedProvince.length > 0) $scope.tpl_status.cities = [{ name: "请选择" }].concat(_selectedProvince[0].cities);
          }

          $scope.changeProvince = function () {
              $scope.data.city = "请选择";
              _changeProvince()
          }

          $scope.btnSave = function () {
              if ($scope.data.city == "请选择") {
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
                      $scope.data[key] = data.result.filePath;
                      $scope.data[key + "Url"] = data.result.url;
                  });
              });
          }
          //----------upload file END----------
      }]);
