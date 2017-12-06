'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderListCtrl
 * @description
 * # OrderListCtrl 
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('CustomerWithdrawCtl', ["$timeout", "$window", "$scope", "$rootScope", "$location", "$filter", "plugMessenger", "storage", "$compile", "customerService",
        function ($timeout, $window, $scope, $rootScope, $location, $filter, plugMessenger, storage, $compile, customerService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                keywordType: "customerNumber",
                status: ""
            }

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination
                };

                if (!!$scope.searchBar.status) {
                    _options["status"] = $scope.searchBar.status;
                }

                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = _filterOptions();
                customerService.getWithdrawRequestList(angular.copy(_options), function (result) {
                    if (!result || !result.data || result.data.length < 1) return;

                    // $.each(result.data.data,function(){
                    //     if(this.status == 'P')
                    //         this.statusName = '未审核';
                    //     else if(this.status == 'A')
                    //         this.statusName = '已接受';
                    //     else if(this.status == 'R')
                    //         this.statusName = '已退款';
                    //     else if(this.status == 'D')
                    //         this.statusName = '已拒绝';
                    //     else 
                    //         this.statusName = '已拒绝';
                    // })

                    $scope.dataList = result.data.data;
                    $scope.pagination.totalCount = result.data.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnAccept = function (item) {
                if (!item) return;

                plugMessenger.confirm("确定要接受提款申请吗?", function (isOK) {
                    if (!!isOK) {

                        var data = {
                            transactionNumber: item.transactionNumber,
                            customerNumber: item.customerNumber,
                            refundAmount: item.requestAmount,
                            status: 'A'
                            // alipay_refund_batch_num:item.alipay_refund_batch_num,
                            // alipay_refund_detail_data:item.alipay_refund_detail_data
                        };

                        customerService.confirmWithdrawRequest(data, function (result) {
                            if (result.code == '000') {
                                plugMessenger.info("操作成功");
                                $scope.getData();
                            } else {
                                plugMessenger.info(result.msg);
                            }
                        });
                    }
                });
            }

            $scope.btnDeclineWithNote = function (item) {
                $scope.item = item;
                plugMessenger.template($compile($("#decline_note_form").html())($scope));
            }

            $scope.btnDecline = function(event, item){
                if(!item) return;
                plugMessenger.confirm("确定要拒绝提款申请吗?", function (isOK) {
                    $("#confirm-modal").modal("hide");
                    if (!!isOK) {
                        var data = {
                            transactionNumber: item.transactionNumber,
                            status: 'D',
                            note: $scope.declineNote,
                            customerNumber: item.customerNumber,
                            requestAmount: item.requestAmount,
                            memo: "管理员拒绝提现申请",
                            operationType: "4",
                            payment: -(Number(item.requestAmount) + 20)
                            // alipay_refund_batch_num:item.alipay_refund_batch_num,
                            // alipay_refund_detail_data:item.alipay_refund_detail_data
                        };

                        customerService.updateWithdrawRequest(data, function (result) {
                            $scope.declineNote = "";
                            if (result.code == '000') {
                                $(event.currentTarget).parents("#confirm-modal").modal("hide");
                                plugMessenger.info("操作成功");
                                $scope.getData();
                            } else {
                                plugMessenger.info(result.msg);
                            }
                        });
                    }
                });
            }

            $scope.btnConfirmWithNote = function (item) {
                $scope.item = item;
                $scope.confirmRefundAmount = item.requestAmount;
                plugMessenger.template($compile($("#confirm_refund_form").html())($scope));
            }
             
            /**
             *  取消退款
             */
            $scope.btnCancelWithNote = function (item) {
                if (!item) return;
                plugMessenger.confirm("确定要取消提款申请吗?", function (isOK) {
                    $("#confirm-modal").modal("hide");
                    if (!!isOK) {
                        var data = {
                            transactionNumber: item.transactionNumber,
                            status: 'C',
                            note: $scope.declineNote,
                            customerNumber: item.customerNumber,
                            requestAmount: item.requestAmount,
                            memo: "管理员取消提现申请",
                            operationType: "1",
                            payment: -(Number(item.requestAmount) + 20)
                        };
                        customerService.updateWithdrawRequest(data, function (result) {
                            $scope.declineNote = "";
                            if (result.code == '000') {
                                plugMessenger.info("操作成功");
                                $scope.getData();
                            } else {
                                plugMessenger.info(result.msg);
                            }
                        });
                    }
                })
            }

            function isInt(n) {
                if (n !== n) return false;
                return parseInt(n) === n || n % 1 !== 0;
            }

            $scope.btnConfirm = function (item) {
                if (!item) return;

                if (!$scope.confirmRefundAmount) {
                    return plugMessenger.info("实际退款金额不能为空");
                }

                var parsedRefundAmount = parseFloat($scope.confirmRefundAmount);

                if (!isInt(parsedRefundAmount)) {
                    return plugMessenger.info("实际退款金额格式不正确,请输入数字金额");
                }

                // if (parsedRefundAmount + 20 > item.accountBalance) {
                //     plugMessenger.info('提醒', '您账户余额至少需要￥' + parseFloat(parsedRefundAmount + 20).toFixed(2) + ': 申请退款金额￥'+ parsedRefundAmount.toFixed(2) + ',单次退款手续费￥20.', 'warning');
                //     return false;
                // }

                if (parsedRefundAmount.toFixed(2) != item.requestAmount && !$scope.confirmNote) {
                    return plugMessenger.info("实际退款不等于申请金额,必须输入备注信息");
                }

                plugMessenger.confirm("确定通知客户已完成退款吗?", function (isOK) {
                    if (!!isOK) {
                        $("#confirm-modal").modal("hide");

                        var data = {
                            transactionNumber: item.transactionNumber,
                            refundAmount: parsedRefundAmount.toFixed(2),
                            status: 'R',
                            customerNumber: item.customerNumber,
                            note: $scope.confirmNote
                            // alipay_refund_batch_num:item.alipay_refund_batch_num,
                            // alipay_refund_detail_data:item.alipay_refund_detail_data
                        };

                        customerService.updateWithdrawRequest(data, function (result) {
                            if (result.code == "000") {
                                plugMessenger.info("操作成功");
                                $("#confirm-modal").modal("hide");
                                $scope.getData();
                            } else {
                                plugMessenger.info(result.msg);
                            }
                        });

                        // var data = {
                        //     transactionNumber:item.transactionNumber,
                        //     customerNumber: item.customerNumber,
                        //     refundAmount:parsedRefundAmount.toFixed(2),
                        //     status: 'R',
                        //     note: $scope.confirmNote
                        //     // alipay_refund_batch_num:item.alipay_refund_batch_num,
                        //     // alipay_refund_detail_data:item.alipay_refund_detail_data
                        // };

                        // customerService.confirmWithdrawRequest(data, function (result) {
                        //     $scope.confirmNote = "";
                        //     $scope.confirmRefundAmount = "";

                        //     if (result.code == '000') {                                
                        //         plugMessenger.info("操作成功");
                        //         $scope.getData();
                        //     } else {
                        //         plugMessenger.info(result.msg);
                        //     }
                        // });
                    }
                });
            }

            $scope.btnCancel = function (event) {
                $(event.currentTarget).parents("#confirm-modal").modal("hide");
            }

            $timeout(function () {
                $scope.getData();
            }, 500);

        }]);