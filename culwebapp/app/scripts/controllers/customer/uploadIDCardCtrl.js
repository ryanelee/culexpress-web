'use strict';

angular
    .module('culwebApp')
    .controller('uploadIDCardCtrl', ['$rootScope', '$scope', 'AuthService', '$state', 'Customer', "$http",
        function ($rootScope, $scope, AuthService, $state, Customer, $http) {
            console.log("身份证上传")
            $scope.data = {};
            console.log(cul.apiPath);
            $scope.data.urls = [];



            loadFileinput()
            function loadFileinput() {//初始化 fileinput
                $("#file").fileinput({
                    language: 'zh',//设置语言
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/customermessage/uploadImage",//上传的地址
                    allowedFileExtensions: ["jpg", "png", "gif", 'jpeg'],//接收的文件后缀
                    browseOnZoneClick: true,  //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 2,//同一时间上传的最小
                    maxFileCount: 2,//同一时间上传的最大数量
                    resizePreference: 'height',
                    overwriteInitial: false,
                    uploadLabel: "上传",
                    browseLabel: "选择图片",
                    dropZoneTitle: "点击",
                    dropZoneClickTitle: "选择图片",
                    browseClass: "btn btn-primary", //按钮样式
                    //showUpload: false, //是否显示上传按钮
                    showCaption: false,//是否显示标题
                    showUploadedThumbs: 'false',
                    resizeImage: true

                });
            }
            console.log('miximix')


            // $('#file').on('fileselect', function (event, numFiles, label) {
            //     console.log("fileselect");
            // });

            $('#file').on('fileclear', function (event) {
                console.log("fileclear");
                $scope.data.urls = [];
            });

            $('#file').on('filereset', function (event) {
                console.log("filereset");
            });

            $('#file').on('fileuploaded', function (event, data, previewId, index) {
                var form = data.form, files = data.files, extra = data.extra,
                    response = data.response, reader = data.reader;
                console.log(response.url);
                $scope.data.urls.push(response.url)
            });

            $('#file').on('filesuccessremove', function (event, id) {
                $('#file').fileinput('clear');
                $scope.data.urls = [];
            });


            $scope.submit = function () {
                if (!$scope.data.trackingNumber) {
                    alertify.alert('提示', '<p style="color:red">请填写所有必填项.<p>');
                    return;
                } else if (!$scope.data.urls[0]) {
                    alertify.alert('提示', '<p style="color:red">请上传身份证正反面.<p>');
                    return
                }
                else {
                    $http.post(cul.apiPath + '/customermessage/uploadIdCard', $scope.data).then(function (data) {
                      if(data.status == 200){
                          alertify.alert(data.data.msg)
                      }

                    })
                }

            }

        }]);