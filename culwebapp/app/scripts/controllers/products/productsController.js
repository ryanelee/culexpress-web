'use strict';

angular
    .module('culwebApp')
    .controller('ProductsCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter',  'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, orderSvr) {
            $scope.$root.wizardOptions = {};
            var source = $scope.source = {
                searchKeyItems: [
                    {
                        key: 'itemNumber',
                        text: '商品编号'
                    },
                    {
                        key: 'upccode',
                        text: 'UPC'
                    }, {
                        key: 'brand',
                        text: '品牌'
                    }, {
                        key: 'description',
                        text: '商品描述'
                    }],
                categories: [],
                subCategories: [],
                dataList: [],
            };

            $scope.current = {
                category: null,
                subCategory: null
            };

            $scope.loadGoodsCategory = function () {
                orderSvr.getGoodsCategories()
                    .then(function (result) {
                        $scope.source.categories = result.data;
                    });
            }
            $scope.loadGoodsCategory();

            $scope.selectedCategory = function () {
                var categoryItem = $scope.current.category;
                $scope.source.subCategories = [];
                $scope.current.subCategory = null;

                if (!!categoryItem) {
                    $scope.source.subCategories = categoryItem.sub;
                    $scope.current.subCategory = categoryItem.sub[0];
                    $scope.selectedSubCategory();
                }
                queryPara.category = !!categoryItem ? categoryItem.cateid : "";
            }

            $scope.selectedSubCategory = function () {
                var categoryItem = $scope.current.subCategory;
                queryPara.subCategory = !!categoryItem ? categoryItem.cateid : "";
            }

            $scope.rangSearch = function (rangeItem) {
                queryPara.dateFrom = rangeItem.begin;
                queryPara.dateTo = rangeItem.end;
            }

            var queryPara = $scope.queryPara = {
                searchKeyName: 'itemNumber',
                category: '',
                subCategory: '',
                dateRange: '',
                inventoryOperator: '',
                exceptStatus: [0]
            };

            $scope.pagedOptions = {
                total: 0,
                size: 10
            };
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


            $scope.searchProducts = function () {
                var dateObj = getDateQueryPara();
                if (!!dateObj) {
                    queryPara.dateFrom = dateObj.dateFrom;
                    queryPara.dateTo = dateObj.dateTo;
                }

                if (queryPara.dateRange === 'range' && queryPara.dateFromString && queryPara.dateToString) {
                    queryPara.dateFrom = queryPara.dateFromString + 'T00:00:00.000Z';
                    queryPara.dateTo = queryPara.dateToString + 'T23:59:59.000Z';
                }

                // if (!!queryPara.inventory && !/^[<>=][0-9]+/.test(queryPara.inventory)) {
                //     queryPara.inventory = queryPara.inventoryCompare + queryPara.inventory;
                // }

                for (var i = 0, ii = source.searchKeyItems.length; i < ii; i++) {
                    if (source.searchKeyItems[i].key !== queryPara.searchKeyName) {
                        delete queryPara[source.searchKeyItems[i].key];
                    }
                }

                $scope.loadListData(1);
            }

            $scope.loadListData = function (index) {
                $scope.pagedOptions.index = index;
                var queryParams = $.extend({
                    pageInfo: {
                        pageIndex: index || 1,
                        pageSize: $scope.pagedOptions.size
                    }
                }, queryPara);

                orderSvr.getProducts(queryParams)
                    .then(function (result) {
                        source.dataList = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    });
            }
            $scope.loadListData();

            $scope.onPaged = function (pageIndex) {
                $scope.loadListData(pageIndex);
            }

            $scope.deleteProducts = function () {
                var itemNumbers = [];
                for (var i = 0, ii = source.dataList.length; i < ii; i++) {
                    if (!!source.dataList[i].checked) {
                        itemNumbers.push(source.dataList[i].itemNumber);
                    }
                }

                alertify.confirm('确认','您选择了' + itemNumbers.length + '个商品，确定删除？',
                    function () {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                        orderSvr.deleteProducts(itemNumbers).then(function (result) {
                            alertify.success('删除成功!');
                            $scope.loadListData(1);
                        });
                    },function(){
                        alertify.error('已取消删除!');
                    });
            }


            $scope.redirectTo = function (itemNumber) {
                $state.go('customer.productedit', { id: itemNumber });
            }

            $scope.redirectToBatch = function () {
                $state.go('customer.productbatch');
            }

            $scope.redirectToInvetory = function (itemNumber) {
                $state.go('customer.productinventory', { id: itemNumber });
            }

            $scope.redirectToDetail = function (sendiNumber) {
                $state.go('customer.sendidetail', { id: sendiNumber });
            }


        }
    ]);