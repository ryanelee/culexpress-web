'use strict';

/**
 * @ngdoc function\
 * @name culAdminApp.controller:OrderOfflineImportCtrl
 * @description
 * # OrderOfflineImportCtrl
 * Controller of the culAdminApp
 */
angular.module('culwebApp')
    .controller('OrderOfflineImportCtrl', ["$scope", "$timeout", "$filter", "OrderSvr", "orderService", "AuthService",
        function ($scope, $timeout, $filter, OrderSvr, orderService, AuthService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            console.log('123456', sessionStorage.getItem("cul-token"));
            loadFileinput();
            function loadFileinput() { //初始化 fileinput
                console.log('are you coming');
                $("#orderfile").fileinput({
                    language: 'zh', //设置语言
                    headers: {
                        Token: sessionStorage.getItem("cul-token")
                    },
                    //uploadUrl: "report/photo/add",//上传的地址
                    uploadUrl: cul.apiPath + "/files/upload?Token=" + encodeURIComponent(sessionStorage.getItem("cul-token")), //上传的地址
                    allowedFileExtensions: ["xlsx", "xls"], //接收的文件后缀
                    browseOnZoneClick: true, //是否启用 点击预览区进行【文件浏览/选择】操作。默认为假。
                    minFileCount: 1, //同一时间上传的最小
                    maxFileCount: 1, //同一时间上传的最大数量
                    resizePreference: 'height',
                    overwriteInitial: false,
                    uploadLabel: "上传",
                    browseLabel: "选择文件",
                    dropZoneTitle: "点击",
                    dropZoneClickTitle: "选择文件",
                    browseClass: "btn btn-primary", //按钮样式
                    //showUpload: false, //是否显示上传按钮
                    showCaption: false, //是否显示标题
                    showUploadedThumbs: 'false',
                    resizeImage: true

                });
            }


            $('#orderfile').on('fileuploaded', function (event, data, previewId, index) {
                console.log(' data.response.url;', data);
                if ($scope.fileId !== data.response.filePath) {
                    $scope.fileId = data.response.filePath;
                    $scope.offlineOrderCheckExcel();
                }
                // console.log('previewId', previewId);
                // console.log('data', data);
                // console.log('index', index);
                // var form = data.form,
                //     files = data.files,
                //     extra = data.extra,
                //     response = data.response,
                //     reader = data.reader;
                // $scope.data.urls.push(response.url)
            });
            $scope.offlineOrderCheckExcel = function () {
                // $timeout(function () {
                orderService.offlineOrderCheckExcel($scope.fileId, function (result) {
                    if (result.success == true) {
                        $scope.offlineOrderCreateExcel();
                    } else {
                        $('#orderfile').fileinput('clear');
                        alertify.error('文件上传失败,请删除重新上传:' + result.message);
                    }
                    // });
                });
            }



            $scope.offlineOrderCreateExcel = function () {
                // $timeout(function () {

                orderService.offlineOrderCreateExcel({ fileId: $scope.fileId, customerNumber: AuthService.getUser().customerNumber }, function (result) {
                    $.each(result, function (index, item) {
                        item.actualTotalWeight = 0;
                        $.each(item.outboundPackages, function (i, pkg) {
                            item.actualTotalWeight += pkg.actualWeight || 0;
                        });
                        item.actualTotalWeight = item.actualTotalWeight.toFixed(2);
                    });
                    $scope.dataList = result;
                    $scope.pagination.totalCount = $scope.dataList.totalCount;
                });
            }


        }]);
