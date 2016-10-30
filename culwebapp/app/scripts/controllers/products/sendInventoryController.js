'use strict';

angular
    .module('culwebApp')
    .controller('SendInventoryCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, orderSvr) {
            $scope.$root.wizardOptions = {};
            var source = $scope.source = {
                searchKeyItems: [
                    {
                        key: 'receiptNumber',
                        text: '寄件单据编号'
                    },
                    {
                        key: 'itemNumber',
                        text: '商品编号'
                    },
                    {
                        key: 'upccode',
                        text: 'UPC'
                    }
                ],
                categories: [],
                subCategories: [],
                dataList: [],
            };

            var queryPara = $scope.queryPara = {
                searchKeyName: 'receiptNumber',
                dateRange: '',
                exceptStatus: [1]
            };


            $scope.pagedOptions = {
                total: 0,
                size: 10
            }

            function initDateControl() {
                $('input.date-control').datepicker({
                    format: 'yyyy/mm/dd',
                    todayHighlight: true,
                    autoclose: true,
                    language: 'zh-CN'
                });
            }
            initDateControl();

            var getRangeDate = function (date, rangeVal) {
                if (!rangeVal) rangeVal = 0;
                var oneDayMilliseconds = 3600000 * 24,
                    rangeDayMilliseconds = oneDayMilliseconds * rangeVal,
                    newDate = new Date(date.getTime() + rangeDayMilliseconds);
                return {
                    dateFrom: $filter('date')(newDate, 'yyyy-MM-ddT00:00:00.000') + 'Z',
                    dateTo: date.toISOString()
                }
            };

            function getDateQueryPara() {
                var dateInval = queryPara.dateRange;
                if (!dateInval || dateInval === 'range') { return false; }
                if (dateInval > 1) {
                    return getRangeDate(new Date(), dateInval * -1);
                }
                return getRangeDate(new Date());
            }

            $scope.searchData = function () {
                var dateObj = getDateQueryPara();
                if (!!dateObj) {
                    queryPara.inDateFrom = dateObj.dateFrom;
                    queryPara.inDateTo = dateObj.dateTo;
                }

                if (queryPara.dateRange === 'range') {
                    queryPara.inDateFrom = queryPara.dateFromString + 'T00:00:00.000Z';
                    queryPara.inDateTo = queryPara.dateToString + 'T23:59:59.000Z';
                }

                for (var i = 0, ii = source.searchKeyItems.length; i < ii; i++) {
                    if (source.searchKeyItems[i].key !== queryPara.searchKeyName) {
                        delete queryPara[source.searchKeyItems[i].key];
                    }
                }

                $scope.loadListData(1);
            }

            $scope.deleteInventory = function (dataItem) {
                alertify.confirm('确认','确定删除',
                    function (isConfirm) {
                        orderSvr.deleteTransportItem(dataItem.receiptNumber).then(function (result) {
                            if (!result.message) {
                                alertify.success('删除成功!');
                                $scope.loadListData();
                            } else {
                                alertify.alert('提示', result.message, 'error');
                            }
                        }, function (result) {
                            alertify.alert('提示', result.data.message, 'error');
                        });
                },function(){
                    alertify.error('已取消删除!');
                });
            }

            $scope.loadListData = function (index) {
                $scope.pagedOptions.index = index;
                var queryParams = $.extend({
                    pageInfo: {
                        pageIndex: index || 1,
                        pageSize: $scope.pagedOptions.size
                    }
                }, queryPara);

                orderSvr.getTransportItems(queryParams)
                    .then(function (result) {
                        source.dataList = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    });
            }
            $scope.loadListData();

            $scope.onPaged = function (pageIndex) {
                $scope.loadListData(pageIndex);
            }
            $scope.redirectTo = function () {
                $state.go('customer.sendiedit');
            }

            $scope.redirectToBatch = function () {
                $state.go('customer.sendibatch');
            }

            $scope.redirectToDetail = function (sendiNumber) {
                $state.go('customer.sendidetail', { id: sendiNumber });
            }

        }
    ]);