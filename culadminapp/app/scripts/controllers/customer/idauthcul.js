'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:IdAuthCtrl
 * @description
 * # IdAuthCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('IdAuthCulCtrl', ["$scope", "$location", "addressService", "plugMessenger", "$rootScope", "$compile", "customerMessageService", "storage",
        function ($scope, $location, addressService, plugMessenger, $rootScope, $compile, customerMessageService, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.api = cul.apiPath;

            $location.search({ trackingNumber: null });

            $scope.dataList = [];
            $scope.validateType = 1;
            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                keywordType: "customerNumber",
                countryCode: "",
                accountBalance: "",
                startDate: "",
                endDate: "",
                verifyMark: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }
            $scope.idRemarkError = "";
            $scope.idRemark = "";

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

            $scope.btnPrint = function () {
                $scope.$broadcast("print-idcard.action", { data: $scope.dataList });
            }

            // 批量下载 （pdf下载后转图片）
            $scope.btnDownload = function () {
                $scope.$broadcast("print-idcardImg.action", { data: $scope.dataList });
            }

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",

                }
                 if (!!$scope.searchBar.verifyMark) {
                _options["verifyMark"] = $scope.searchBar.verifyMark;
            }
                _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                addressService.getList(_options, function (result) {
                    $scope.dataList = result.data;
                    $scope.dataList.forEach(function (data) {
                        data._verifyMark = _verifyMark_(data.verifyMark);
                    })
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit('changeMenu');
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
            $scope.btnSearch()

            $scope.btnOpenDetail = function (type, address) {
                switch (type) {
                    case "customer":
                        $location.search({ customerNumber: address.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                    case "address":
                        $location.search({ transactionNumber: address.transactionNumber });
                        $location.path("/customer/addressdetail");
                        break;
                }
            }

            $scope.btnVerification = function (address, index, flag) {
                $scope._address = angular.copy(address);
                $scope.index = index;
                if (flag == 0) {
                    $scope.validateType = 0;
                    $scope.idRemark = $scope._address.idRemark;
                } else {
                    $scope.idRemark = "";
                }
                plugMessenger.template($compile($("#tplValidate_approval_form").html())($scope));
            }
            $scope.btnVerificationCancle = function (address, index) {
                var _address = angular.copy(address);
                index = index;
                // 状态0： 未验证
                _address.verifyMark = 0;
                _address._verifyMark = _verifyMark_(_address.verifyMark);
                plugMessenger.confirm("确认取消验证吗?", function (isOk) {
                    if (isOk) {
                        addressService.update(_address, function (result) {
                            if (result.success == true) {
                                if (_address.verifyMark == 1) plugMessenger.success("取消验证成功");
                                else plugMessenger.success("验证取消");
                                $scope.dataList[index] = _address;
                                //  $scope.createMessageLog("身份认证通过");

                            } else {
                                plugMessenger.error("取消验证失败： " + result.message);
                            }
                        });
                    }
                })
            }
            var _verifyMark_ = function (verifyMark) {
                switch (verifyMark) {
                    case -1:
                        return "验证失败";
                    case 0:
                        return "未验证";
                    case 1:
                        return "验证通过";
                    default:
                        return
                }
            }
            $scope.btnDelete = function (address) {
                plugMessenger.confirm("确认删除该地址吗?", function (isOk) {
                    if (isOk) {
                        addressService.delete(address.transactionNumber, function (result) {
                            if (result.success == true) {
                                plugMessenger.success("删除成功");
                                $scope.getData();
                            }
                        })
                    }
                });
            }


            $scope.createMessageLog = function (message) {
                if (!$scope._address.messageNumber) {
                    return;
                }
                customerMessageService.push({
                    "messageNumber": $scope._address.messageNumber,
                    "message": message
                }, function (result) {

                })
            }



            $scope.btnApprove = function (event) {
                // 验证通过
                if ($scope.validateType == 1) {
                    $scope._address.verifyMark = 1;
                    $scope._address._verifyMark = _verifyMark_($scope._address.verifyMark);
                    $scope._address.idRemark == "";
                    $scope.idRemark = "";
                    addressService.update($scope._address, function (result) {
                        if (result.success == true) {

                            $scope.dataList[$scope.index] = $scope._address;
                            plugMessenger.success("成功");
                            $(event.currentTarget).parents("#confirm-modal").modal("hide");
                            $scope.createMessageLog("身份认证通过");

                        } else {
                            plugMessenger.error("失败： " + result.message);
                        }
                    });
                }
                // 验证失败
                if ($scope.validateType == 0) {
                    $scope._address.idRemark = $scope.idRemark;
                    if ($scope._address.idRemark == "") {
                        $scope.idRemarkError = "请输入备注"
                        return
                    }
                    $scope._address.verifyMark = -1;
                    $scope._address._verifyMark = _verifyMark_($scope._address.verifyMark);
                    addressService.update($scope._address, function (result) {
                        $scope.createMessageLog("身份认证失败: " + $scope._address.idRemark);
                        if (result.success == true) {
                            $scope.dataList[$scope.index] = $scope._address;
                            plugMessenger.success("成功");
                            $(event.currentTarget).parents("#confirm-modal").modal("hide");
                        } else {
                            plugMessenger.error("失败： " + result.message);
                        }
                    });
                    $scope.idRemark = "";
                }
            }
            $scope.btnCancel = function (event) {
                $scope.validateType = 1;
                $(event.currentTarget).parents("#confirm-modal").modal("hide");
            }




        }]);