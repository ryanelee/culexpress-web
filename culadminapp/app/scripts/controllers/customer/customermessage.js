'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:CustomerMessageCtrl
 * @description
 * # CustomerMessageCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('CustomerMessageCtrl', ["$scope", "$location", "customerService", "$window", "plugMessenger", "userService","storage",
      function ($scope, $location, customerService, $window, plugMessenger, userService,storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.tpl_status = {
              editPoint: false
          }

          $scope.customerNumber = $location.search().customerNumber;
          customerService.getDetail($scope.customerNumber, function (result) {
              $scope.data = result;
              _buildUpload($('#uploadImg'), "images");
          });

          $scope.btnPrev = function () {
            storage.session.setValue("historyFlag",1);
            $window.sessionStorage.setItem("historyFlag", 1);                 
            $window.history.back();
          }
          $scope.btnMessagePush = function () {
            if (!$scope.message.message) {
                plugMessenger.info("请填写留言信息");
                return;
            }

            $scope.message.messageType = 29;
            $scope.message.images = $scope.data.images;
            $scope.message.customerNumber = $scope.customerNumber;
            customerService.addCustomerMessage($scope.message).then(function (result) {
                //$scope.refreshMessage();
                $scope.message.message = "";
                $scope.data.images = "";
                $("#uploadImg_show").attr('src',''); 
            })
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
                        $scope.data[key] = data.result.url;
                    });
                });
            }
            //----------upload file END----------
      }]);
