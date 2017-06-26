'use strict';

angular
    .module('culwebApp')
    .controller('uploadIDCardCtrl', ['$rootScope', '$location', '$scope', 'AuthService', '$state', 'Customer', "$http", "$window", "addressSvr",
        function ($rootScope, $location, $scope, AuthService, $state, Customer, $http, $window, addressSvr) {
            if ($window.sessionStorage.flag != 1) {
                $window.sessionStorage.flag = 1;
                //window.location.reload();
            } else {
                $window.sessionStorage.flag++;
            }

            $scope.data = {};
            $scope.data.urls = [];
            $scope.data.idForever = 0;
            $scope.customNumber = ""
            $scope.flag = '0'

            loadFileinputTw();

            $scope.checkNumber = function () {
                if (!$scope.data.trackingNumber) {
                    alertify.alert("提示", "CUL包裹单号不能为空");
                    return;
                }
                $scope.customNumber = "";
                $scope.flag = '0'
                Customer.checkTrackingNumber($scope.data).then(function (data) {
                    if (data.data.code == '999') {
                        alertify.alert("提示", data.data.msg)
                        return
                    }
                    if (data.data.code == '000') {
                        $scope.customNumber = data.data.data.customerNumber
                        $scope.flag = '1'
                        loadFileinput()
                    }

                })
            }

            // $('#datetimepicker').datetimepicker({
            //     // language: 'zh',
            //     format: 'YYYY-MM-DD',
            //     viewMode: 'years'
            // });
            // $('#datetime').datetimepicker({
            //     // language: 'zh',
            //     format: 'YYYY-MM-DD',
            //     viewMode: 'years'
            // });



            // $scope.getShow = function() {
            //     $('#datetimepicker').datetimepicker('show');
            // }

            function loadFileinput() { //初始化 fileinput
                $("#file").fileinput({
                    language: 'zh', //设置语言
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/customermessage/uploadImage?customNumber=" + $scope.customNumber, //上传的地址
                    allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'], //接收的文件后缀
                    browseOnZoneClick: true, //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 2, //同一时间上传的最小
                    maxFileCount: 2, //同一时间上传的最大数量
                    resizePreference: 'height',
                    overwriteInitial: false,
                    uploadLabel: "上传",
                    browseLabel: "选择图片",
                    dropZoneTitle: "点击",
                    dropZoneClickTitle: "选择图片",
                    browseClass: "btn btn-primary", //按钮样式
                    //showUpload: false, //是否显示上传按钮
                    showCaption: false, //是否显示标题
                    showUploadedThumbs: 'false',
                    resizeImage: true

                });
            }

            // $('#file').on('fileselect', function (event, numFiles, label) {
            //     console.log("fileselect");
            // });

            $('#file').on('fileclear', function (event) {
                //console.log("fileclear");
                $scope.data.urls = [];
            });

            $('#file').on('filereset', function (event) {
                //console.log("filereset");
            });

            $('#file').on('fileuploaded', function (event, data, previewId, index) {
                var form = data.form,
                    files = data.files,
                    extra = data.extra,
                    response = data.response,
                    reader = data.reader;
                //console.log(response.url);
                $scope.data.urls.push(response.url)
            });

            $('#file').on('filesuccessremove', function (event, id) {
                $('#file').fileinput('clear');
                $scope.data.urls = [];
            });

            function loadFileinputTw() { //初始化 fileinput
                $("#fileTw").fileinput({
                    language: 'zh', //设置语言
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/customermessage/uploadImage?customNumber=" + $scope.customNumber, //上传的地址
                    allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'], //接收的文件后缀
                    browseOnZoneClick: true, //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 2, //同一时间上传的最小
                    maxFileCount: 2, //同一时间上传的最大数量
                    resizePreference: 'height',
                    overwriteInitial: false,
                    uploadLabel: "上传",
                    browseLabel: "选择图片",
                    dropZoneTitle: "点击",
                    dropZoneClickTitle: "选择图片",
                    browseClass: "btn btn-primary", //按钮样式
                    //showUpload: false, //是否显示上传按钮
                    showCaption: false, //是否显示标题
                    showUploadedThumbs: 'false',
                    resizeImage: true

                });
            }

             $('#fileTw').on('fileclear', function (event) {
                //console.log("fileclear");
                $scope.data.urls = [];
            });

            $('#fileTw').on('filereset', function (event) {
                //console.log("filereset");
            });

            $('#fileTw').on('fileuploaded', function (event, data, previewId, index) {
                var form = data.form,
                    files = data.files,
                    extra = data.extra,
                    response = data.response,
                    reader = data.reader;
                $scope.data.urls.push(response.url)
            });

            $('#fileTw').on('filesuccessremove', function (event, id) {
                $('#fileTw').fileinput('clear');
                $scope.data.urls = [];
            });
            /**
             * cul客户
             */
            $scope.submit = function () {
                if (!$scope.data.trackingNumber && !$scope.data.cellphoneNumber && !$scope.data.receivePersonName && !$scope.data.emailAddress) {
                    alertify.alert('提示', '<p style="color:red">请填写所有必填项.<p>');
                    return;
                } else if (!$scope.data.urls[0]) {
                    alertify.alert('提示', '<p style="color:red">请上传身份证正反面.<p>');
                    return
                } else if ($scope.data.idForever == 0 && !$scope.data.deadline) {
                    alertify.alert('提示', '<p style="color:red">必须选择永久或则填写身份证有效期.<p>');
                    return
                } else if ($scope.data.idForever == 0 && $scope.data.deadline) {
                    var idExpired = new Date($scope.data.deadline);
                    var now = new Date();

                    if (idExpired.getTime() < now.getTime()) {
                        alertify.alert('提示', '<p style="color:red">身份证已经过期,请检查身份证有效截止日期是否输入正确.<p>');
                        return;
                    }
                }
                $scope.data.authType = 1
                $http.post(cul.apiPath + '/customermessage/uploadIdCard', $scope.data).then(function (data) {
                    if (data.status == 200) {
                        alertify.alert('提示', data.data.msg);
                        // if (!AuthService.isLogined()) {
                        //     $location.path('/login');
                        // }
                    }

                })
            }

            /**
             * 淘宝微信客户
             */

            $scope.submitTw = function () {
                if (!$scope.data.cellphoneNumber && !$scope.data.receivePersonName && !$scope.data.emailAddress) {
                    alertify.alert('提示', '<p style="color:red">请填写所有必填项.<p>');
                    return;
                } else if (!$scope.data.urls[0]) {
                    alertify.alert('提示', '<p style="color:red">请上传身份证正反面.<p>');
                    return
                } else if ($scope.data.idForever == 0 && !$scope.data.deadline) {
                    alertify.alert('提示', '<p style="color:red">必须选择永久或则填写身份证有效期.<p>');
                    return
                } else if ($scope.data.idForever == 0 && $scope.data.deadline) {
                    var idExpired = new Date($scope.data.deadline);
                    var now = new Date();

                    if (idExpired.getTime() < now.getTime()) {
                        alertify.alert('提示', '<p style="color:red">身份证已经过期,请检查身份证有效截止日期是否输入正确.<p>');
                        return;
                    }
                }
                $scope.data.authType = 2;
                addressSvr.addReceiveAddressTw($scope.data).then(function (data) {
                    if (data.status == 200) {
                        alertify.alert('提示', "提交成功");
                    }
                })
                // authType:2
                // $scope.data.authType = 2;
                // $http.post(cul.apiPath + '/addReceiveAddressTw', $scope.data).then(function (data) {
                //     if (data.status == 200) {
                //         alertify.alert('提示', data.data.msg);
                //     }

                // })
            }
        }
    ]);