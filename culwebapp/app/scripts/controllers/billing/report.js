'use strict';

angular
    .module('culwebApp')
    .controller('BillingReportCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', 'settlementSvr', '$filter', 'AuthService',
        function($scope, $compile, $timeout, $state, $stateParams, settlementSvr, $filter, AuthService) {

            $scope.currentDate = (new Date()).toLocaleDateString();
            var source = $scope.source = {
                    searchKeyItems: [{
                        key: 'orderNumber',
                        text: '订单编号'
                    }, {
                        key: 'customerNumber',
                        text: '客户关联号'
                    }, {
                        key: 'packageNumber',
                        text: 'CUL包裹单号'
                    }, {
                        key: 'settlementNumber',
                        text: '结算编号'
                    }],
                    transactionTypes: [{
                        key: 1,
                        text: '运费'
                    }, {
                        key: 2,
                        text: '寄送库存'
                    }, {
                        key: 3,
                        text: '仓储费用'
                    }, {
                        key: 4,
                        text: '调整费用'
                    }],
                    dateRangeCategories: [{
                        key: 'lastDay',
                        text: '最近天数',
                        childs: [{
                                key: 'last3day',
                                val: 3,
                                text: '最近3天'
                            },
                            {
                                key: 'last7day',
                                val: 7,
                                text: '最近7天'
                            },
                            {
                                key: 'last30day',
                                val: 30,
                                text: '最近30天'
                            },
                            {
                                key: 'last90day',
                                val: 90,
                                text: '最近90天'
                            },
                            {
                                key: 'last180day',
                                val: 180,
                                text: '最近180天'
                            }
                        ]
                    }, {
                        key: 'customRange',
                        text: '自定义时间范围'
                    }],
                    recentList: [],
                    historyList: [],
                    excelReportData: [{
                        year: '2016',
                        months: [{
                            'reportDate': '2016-05',
                            "filePathUrl": "http://cultest.oss-cn-shenzhen.aliyuncs.com/KX109/settlementReport_574202f0-a45e-4c9e-a4be-46281d19ff1c.xlsx"
                        }]
                    }],
                    discount: 0,
                    instructionData: []
                },
                getRangeDate = function(date, rangeVal) {
                    if (!rangeVal) rangeVal = 0;
                    var oneDayMilliseconds = 3600000 * 24,
                        rangeDayMilliseconds = oneDayMilliseconds * rangeVal,
                        newDate = new Date(date.getTime() + rangeDayMilliseconds);
                    return {
                        begin: $filter('date')(newDate, 'yyyy-MM-ddT00:00:00.000') + 'Z',
                        end: date.toISOString()
                    }
                };


            $scope.paid = function() {
                alertify.alert('确认', '请确定是否支付' + model.arrears + '美元?',
                    function() {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });

                        var currentCustomer = AuthService.getUser();
                        if (!currentCustomer) {
                            alertify.alert('提醒', '请先登录.', 'warning');
                            return false;
                        }
                        window.open('rechargepage.html?vippay=1&ra=' + encodeURIComponent(model.arrears) + '&cn=' + encodeURIComponent(currentCustomer.customerNumber));
                    },
                    function() {
                        alertify.error('已取消支付!');
                    });

                // SweetAlert.swal({
                //     title: "您确定支付" + model.arrears + "美元?",
                //     type: "warning",
                //     showCancelButton: true,
                //     confirmButtonColor: "#DD6B55",
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //     closeOnConfirm: false
                // }, function (isConfirm) {
                //     if (isConfirm) {
                //         $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                //         var customerNumber = $scope.$root.currentUser.customerNumber;
                //         window.open('rechargepage.html?vippay=1&ra=' + encodeURIComponent(model.arrears) + '&cn=' + encodeURIComponent(customerNumber));
                //         //settlementSvr.pay($scope.$root.currentUser.customerNumber, model.arrears)
                //         //.then(function (result) {
                //         //    if (result) {
                //         //        SweetAlert.swal('提示', '支付成功.', 'success');
                //         //    }
                //         //}, function (result) {
                //         //    SweetAlert.swal('提示', '支付失败.' + result.data.message, 'error');
                //         //});
                //     }
                // });
            }




            var model = $scope.model = {
                    arrears: 0
                },
                query = $scope.query = {

                },
                current = $scope.current = {
                    searchKeyName: 'orderNumber',
                    advanced: false
                };

            var loadUnpaid = function() {
                settlementSvr.getUnpaid(AuthService.getUser().customerNumber)
                    .then(function(result) {
                        if (!!result.data) {
                            $scope.model.arrears = result.data.offLineCount;
                        }
                    });
            }
            loadUnpaid();

            $scope.toggle = function() {
                current.advanced = !current.advanced;
                if (current.advanced) {
                    current.dateRangeCategory = source.dateRangeCategories[0];
                    current.dateRange = current.dateRangeCategory.childs[0];

                    $('.control-date').datepicker({
                        format: 'yyyy/mm/dd',
                        todayHighlight: true,
                        autoclose: true,
                        language: 'zh-CN'
                    });
                }
            }

            $scope.toggleDateRangeCategory = function() {
                if (current.dateRangeCategory.key === 'customRange') {
                    current.dateRange = null;
                } else {
                    current.dateRange = current.dateRangeCategory.childs[0];
                }
                $scope.setDateRange();
            }

            $scope.setDateRange = function() {
                var range = {};
                if (!!current.dateRange) {
                    var dateRange = getRangeDate(new Date(), current.dateRange.val * -1);;
                    range = {
                        dateFrom: dateRange.begin,
                        dateTo: dateRange.end
                    }
                } else {
                    var startDateString = $('.control-date.begin').val(),
                        endDateString = $('.control-date.end').val();
                    if (startDateString && endDateString) {
                        range = {
                            dateFrom: new Date(startDateString).toISOString(),
                            dateTo: new Date(endDateString).toISOString()
                        }
                    }
                }
                angular.extend(query, range);
            }


            $scope.pagedOptions = {
                recent: {
                    total: 0,
                    size: 10
                },
                history: {
                    total: 0,
                    size: 10
                }
            }

            $scope.onRecentPaged = function(pageIndex) {
                $scope.search(pageIndex);
            }

            $scope.search = function(index) {
                $scope.setDateRange();
                $.extend(true, query, {
                    pageInfo: {
                        pageIndex: index || 1,
                        pageSize: $scope.pagedOptions.recent.size
                    }
                });

                settlementSvr.getList(query)
                    .then(function(result) {
                        if (!!result && !!result.data) {
                            $scope.pagedOptions.recent.total = result.data.pageInfo.totalCount;
                            source.recentList = result.data.data;
                        }
                    })
            }
            $scope.search();

            var loadReportExcelData = function() {
                var getReportGroupData = function(list) {
                    var reportList = [];
                    for (var i = 0, ii = (list || []).length; i < ii; i++) {
                        var year = (list[i].reportDate || '').split('-')[0],
                            queried = $filter('filter')(reportList, function(reportItem) {
                                return (reportItem.reportDate || '').indexOf(year) >= 0;
                            })[0];

                        if (!queried) {
                            reportList.push({
                                title: year + '',
                                year: year,
                                months: [angular.copy(list[i])]
                            })
                        } else {
                            queried.months.push(angular.copy(list[i]))
                        }
                    }
                    return reportList;
                }

                settlementSvr.getExcelList(AuthService.getUser().customerNumber)
                    .then(function(result) {
                        ////todo test data，使用正式数据后需要删除
                        //if (!result.data || !result.data.length) {
                        //    result.data = [{
                        //        'reportDate': '2016-05',
                        //        "filePathUrl": "http://cultest.oss-cn-shenzhen.aliyuncs.com/KX109/settlementReport_574202f0-a45e-4c9e-a4be-46281d19ff1c.xlsx"
                        //    }, {
                        //        'reportDate': '2015-01',
                        //        "filePathUrl": "http://cultest.oss-cn-shenzhen.aliyuncs.com/KX109/settlementReport_574202f0-a45e-4c9e-a4be-46281d19ff1c.xlsx"
                        //    }];
                        //}
                        source.excelReportData = getReportGroupData(result.data.data);
                    });
            }


            var loadInstructionData = function() {
                settlementSvr.instruction(AuthService.getUser().currentUser.customerNumber)
                    .then(function(result) {
                        source.discount = result.data.discount;
                        source.instructionData = result.data.instructions;
                    });
            }




            $scope.onHistoryPaged = function(pageIndex) {
                $scope.loadHistoryList(pageIndex);
            }

            $scope.loadHistoryList = function(index) {
                $.extend(query, {
                    pageIndex: index || 1,
                    pageSize: $scope.pagedOptions.size
                });

                settlementSvr.getPaymentHistory(index, AuthService.getUser().customerNumber)
                    .then(function(result) {
                        source.historyList = result.data.data;
                        $scope.pagedOptions.history.total = result.data.pageInfo.totalCount;
                    });

                //TODO
            }


            // Tab Region
            $scope.tab = {
                current: 'recent'
            }
            $scope.selectTab = function(tabName) {
                $scope.tab.current = tabName;
                if (tabName === 'download') {
                    loadReportExcelData();
                } else if (tabName === 'caption') {
                    loadInstructionData();
                } else if (tabName === 'history') {
                    $scope.loadHistoryList();
                }
            }
        }
    ]);