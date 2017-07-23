'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FAQDetailCtrl
 * @description
 * # FAQDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('FAQDetailCtrl', ["$scope", "$rootScope", "$location", "$window", "faqService", "warehouseService", "customerMessageService", "plugMessenger",
        function ($scope, $rootScope, $location, $window, faqService, warehouseService, customerMessageService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.messageTypeList = [];
            $scope.search = {};
            $scope.tpl_status = {
                messageNumber: $location.search().messageNumber,
                messageTypeData: [],
                warehouseList: []
            }

            faqService.getMessageType(7, function (result) {
                $scope.tpl_status.messageTypeData = [{ "typeID": "", "typeName": "全部" }].concat(result);
                result.forEach(function (data) {
                    if (data.typeID == '19' || data.typeID == '20' ||
                        data.typeID == '21' || data.typeID == '22' ||
                        data.typeID == '23' || data.typeID == '24' ||
                        data.typeID == '25' || data.typeID == '26') {
                        $scope.messageTypeList.push(data);
                    }
                })

            });
            // faqService.getMessageType();
            warehouseService.getWarehouse(function (result) {
                $scope.tpl_status.warehouseList = result;
            });

            faqService.getDetail($scope.tpl_status.messageNumber, function (result) {
                if (result && result.images)
                    $scope.images = result.images.split(',');
                $scope.data = result;
                faqService.getMessagelog({ messageNumber: $scope.tpl_status.messageNumber }, function (logs) {
                    $scope.logs = logs.data;
                    var _messageType = $.grep($scope.tpl_status.messageTypeData, function (n) { return n.typeID == $scope.data.messageType });
                    if (_messageType.length > 0) $scope.data._messageType = _messageType[0].typeName;
                    switch ($scope.data.status) {
                        case "0":
                        case "Closed":
                            $scope.data._status = "已关闭";
                            break;
                        case "1":
                        case "Processing":
                            $scope.data._status = "待处理";
                            break;
                        case "ForwardWH":
                            $scope.data._status = "转交仓库";
                            break;
                    }
                    var _receivedWarehouse = $.grep($scope.tpl_status.warehouseList, function (n) { return n.warehouseNumber == $scope.data.receivedWarehouseNumber });
                    if (_receivedWarehouse.length > 0) $scope.data._receivedWarehouseName = _receivedWarehouse[0].warehouseName;
                    $scope.refreshMessage();
                })
                _buildUpload($('#uploadImg'), "_images");
            });

            $scope.refreshMessage = function () {
                customerMessageService.getDetail($scope.tpl_status.messageNumber, function (result) {
                    $scope.messageLogs = [];
                    if (!!result) {
                        $scope.messageLogs = result.data.messageLogs;
                        if ($scope.messageLogs) {
                            $scope.messageLogs.forEach(function (e) {
                                if (e.images && e.images.indexOf(",") >= 0) {
                                    e.images = e.images.split(',');
                                } else {
                                    e.images = [e.images];
                                }
                            })
                        }
                    }
                });
            }

            $scope.btnMessagePush = function () {
                if (!!$scope._message) {
                    customerMessageService.push({
                        "messageNumber": $scope.tpl_status.messageNumber,
                        "message": $scope._message,
                        "images": $scope.data._images
                    }, function (result) {
                        $scope.refreshMessage();
                        $scope._message = "";
                        $scope.data._images = "";
                        $("#uploadImg_show").attr('src', '');
                        faqService.updateMessageOperation({ messageNumber: $scope.tpl_status.messageNumber }).then(function (data) {
                            $scope.$emit("message")
                        });
                    });
                }
            }
            $scope.delMessageBtn = function (item) {
                plugMessenger.confirm("确定要删除该留言吗？", function (isOK) {
                    if (isOK) {
                        faqService.deleteMessageOperation({ transactionNumber: item.transactionNumber }).then(function (data) {
                            $scope.refreshMessage();
                        });
                    }
                })
            }

            //查看客户信息
            $scope.btnOpenDetail = function (type, item) {
                switch (type) {
                    case "customerDetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnViewCustomer = function (orderNumber) {
                $location.path("/order/orderdetail").search({ orderNumber: orderNumber });
                return;
            }

            $scope.setMessageLog = function () {
                if (!$scope.search.messageType) {
                    plugMessenger.error("请选择转交问题");
                    return;
                }
                $scope.search.messageNumber = $scope.data.messageNumber;
                $scope.search.typeId = $scope.search.messageType.typeID;
                $scope.search.typeName = $scope.search.messageType.typeName;
                faqService.setMessagelog($scope.search, function (data) { })
            }

            $scope.btnUpdateStatus = function (status) {
                var _update = function () {
                    faqService.update({
                        "messageNumber": $scope.data.messageNumber,
                        "messageType": $scope.data.messageType,
                        "status": status
                    }, function (result) {
                        if (result.success == true) {
                            //关闭问题时同时刷新top-bar上的留言条数
                            $rootScope.getmessageList();
                            plugMessenger.success("处理成功");
                            $scope.btnPrev();
                        }
                    });
                }
                switch (status) {
                    case "Closed":
                        if ($scope.data.status == 0 || $scope.data.status == "Closed") {
                            return;
                        } else {
                            plugMessenger.confirm("确认关闭该问题?", function (isOk) {
                                if (isOk) _update();
                            })
                        }
                        break;
                    case "ForwardWH":
                        if ($scope.data.status == "ForwardWH") {
                            return;
                        } else {
                            plugMessenger.confirm("请确认转交该问题到仓库处理?", function (isOk) {
                                if (isOk) _update();
                            })
                        }
                        break;
                }

            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1); $window.history.back();
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
        }
    ]);

