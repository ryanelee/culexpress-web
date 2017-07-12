'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:CustomerDetailCtrl
 * @description
 * # CustomerDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('CustomerDetailCtrl', ["$scope", "$location", "customerService", "$window", "plugMessenger", "userService", "storage",
        function ($scope, $location, customerService, $window, plugMessenger, userService, storage) {
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

            $scope.btnSave = function () {
                var data = $scope.data;
                customerService.update($scope.data, function (result) {
                    if (!result.message) {
                        plugMessenger.success("保存成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnResetPassword = function () {
                plugMessenger.confirm("确认要重置密码吗？", function (isOK) {
                    if (isOK) {
                        userService.resetPassword({
                            "emailAddress": $scope.data.emailAddress
                        }, function (result) {
                            if (result.success == true) {
                                plugMessenger.success("密码重置成功");
                            }
                        });
                    }
                });
            }

            $scope.btnReference = function (action) {
                switch (action) {
                    case "clear":
                        //TODO: 取消推荐人
                        break;
                }
            }

            $scope.btnEditPoint = function () {
                if ($scope.data.pointNote) {
                    return plugMessenger.info("请填写积分调整理由");
                }
                customerService.updatePoint({
                    "customerNumber": $scope.data.customerNumber,
                    "changePoint": $scope.data.changePoint,
                    "pointNote": $scope.data.pointNote,
                    "backFlag": '1'
                    //TODO: 积分调整理由?
                }, function (result) {
                    if (result.success == true) {
                        $scope.tpl_status.editPoint = false;
                        plugMessenger.success("积分调整成功");
                        $window.location.reload();
                    }
                });
            }

            $scope.btnPrev = function () {
                storage.session.setValue("historyFlag", 1);
                $window.sessionStorage.setItem("historyFlag", 1); $window.history.back();
            }

            $scope.btnClearReference = function () {
                customerService.clearReference($scope.data.customerNumber, function (result) {
                    if (result.success == true) {
                        $scope.data.reference = null;
                        plugMessenger.success("推荐关系已取消");
                    }
                });
            }

            $scope.btnMessagePush = function () {
                if (!$scope.message.message) {
                    plugMessenger.info("请填写留言信息");
                    return;
                }

                $scope.message.messageType = 29;
                $scope.message.images = $scope.data.images;
                console.log($scope.message);
                customerService.addCustomerMessage($scope.message).then(function (result) {
                    //$scope.refreshMessage();
                    $scope.message.message = "";
                    $scope.data.images = "";
                    $("#uploadImg_show").attr('src', '');
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
                        console.log($scope.data[key]);
                    });
                });
            }
            //----------upload file END----------
        }]);
