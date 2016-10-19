'use strict';

angular
    .module('culwebApp')
    .controller('SendiEditCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'SweetAlert', 'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, SweetAlert, orderSvr) {
            $scope.$root.wizardOptions = {};

            $scope.wizardOptions = {
                verified: true,
                footer: false,
                sequenced: false
            }

            var source = $scope.source = {
                warehouses: [],
                products: [],
                selectedProducts: [],
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
            };


            function loadSourceData() {
                orderSvr
                    .getWarehouses()
                    .then(function (result) {
                        if (!window.sessionStorage.getItem('cache_warehouse')) {
                            window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                        }
                        source.warehouses = $filter('filter')(result.data, function (dataItem) { return dataItem.warehouseShortName === 'OR' });
                        model.warehouseNumber = source.warehouses[0].warehouseNumber;
                    });
            }


            $scope.wizardValid = function (index, step) {

            };

            $scope.wizardSubmit = function () {
                $scope.submit();
            }

            $scope.wizardPrev = function () {
                $scope.wizardOptions.jumpTo(1);
            }

            $scope.wizardTo = function (stepIndex) {
                $scope.wizardOptions.jumpTo(stepIndex, function (wizardSteps) {
                    wizardSteps.eq(stepIndex - 1).removeClass('hide');
                    if (stepIndex == 2) {
                        wizardSteps.eq(2).addClass('hide');

                    } else if (stepIndex == 3) {
                        wizardSteps.eq(1).addClass('hide');
                    }
                }, function () {
                    if (stepIndex === 2) {
                        source.selectedProducts = getSelectedProducts();
                        return preSubmit();
                    }
                });
            }

            $scope.pagedOptions = {
                total: 0,
                size: 10
            }

            $scope.onPaged = function (pageIndex) {
                $scope.loadListData(pageIndex);
            }

            var queryPara = $scope.queryPara = {
                searchKeyName: 'productNumber',
                exceptStatus: [0]
            };
            $scope.redirectTo = function (itemNumber) {
                $state.go('customer.productedit', { id: itemNumber });
            }
            $scope.searchProducts = function () {
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
                        source.products = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    });
            }

            $scope.checkedAll = false;
            $scope.checkedAllEvent = function () {
                $scope.checkedAll = selectAll(source.products, 'checked', !$scope.checkedAll);
            }

            $scope.singleChecked = function (dataItem) {
                $scope.checkedAll = singleSelect(dataItem, 'checked', source.products)
            }

            $scope.selectAll = false;
            $scope.selectAllEvent = function () {
                $scope.selectAll = selectAll(source.selectedProducts, 'selected', !$scope.selectAll);
            }

            $scope.singleSelected = function (dataItem) {
                $scope.selectAll = singleSelect(dataItem, 'selected', source.selectedProducts)
            }

            var selectAll = function (sourceList, propertyName, checkField) {
                $.each(sourceList, function () {
                    this[propertyName] = checkField;
                });
                return checkField;
            }, singleSelect = function (dataItem, propertyName, sourceList) {
                var status = dataItem[propertyName],
                    selectedItems = $filter('filter')(sourceList, function (dataItem) {
                        return dataItem[propertyName] === true;
                    });
                if (status === false) return false;
                return selectedItems.length === sourceList.length;
            }, getSelectedProducts = function () {
                return $filter('filter')(source.products, function (dataItem) {
                    return dataItem.checked === true;
                });
            }, preSubmit = function () {
                if (!source.selectedProducts || !source.selectedProducts.length) {
                    SweetAlert.swal('提示', '请选择您要寄送的商品!', 'warning');
                    return false;
                }
            }, removeSelectedPreSubmitProducts = function () {
                var notDelRow = $filter('filter')(source.selectedProducts, function (dataItem) {
                    return dataItem.selected !== true;
                });
                source.selectedProducts = notDelRow;
            };

            $scope.removeProducts = function () {
                var selectedItems = $filter('filter')(source.selectedProducts, function (dataItem) {
                    return dataItem.selected === true;
                });
                if (!selectedItems || !selectedItems.length) {
                    SweetAlert.swal('提示', '请选择您要移除的商品!', 'warning');
                    return false;
                }

                if (selectedItems.length === source.selectedProducts.length) {
                    SweetAlert.swal('提示', '请至少保留一个商品!', 'warning');
                    return false;
                }

                removeSelectedPreSubmitProducts(selectedItems);
            }



            var model = $scope.model = {
                "customerNumber": $scope.$root.currentUser.customerNumber,
                "receiptNumber": "ASN",
                "type": 1,
                "warehouseNumber": "1",
                "memo": "",
                "carrierName": "",
                "items": [
                    // { "itemNumber": "S2KX00210000003", "sendCount": 1 },
                    // { "itemNumber": "S2KX00210000018", "sendCount": 1 }
                ]
            };

            $scope.submit = function () {
                for (var i = 0, ii = source.selectedProducts.length; i < ii; i++) {
                    var productItem = source.selectedProducts[i];
                    if (productItem.sendCount === undefined) {
                        SweetAlert.swal('提示', '请输入寄送数量，并且必须大于0 !', 'warning');
                        return false;
                    }
                    if (productItem.sendCount < 1) {
                        SweetAlert.swal('提示', '寄送数量不能小于1 !', 'warning');
                        return false;
                    }
                }
                model.items = source.selectedProducts;


                orderSvr.transportItem(model)
                    .then(function (result) {
                        if (!!result.data.transactionNumber) {
                            $state.go('customer.sendinventory');
                        }
                    });
            }



            loadSourceData();
            $scope.loadListData();

            $scope.redirectToBatch = function () {
                $state.go('customer.sendibatch');
            }

            //start upload file
            $scope.batchCreate = {
                fileInfo: null,
                fileVerified: false,
                upload: function () {
                    var self = this,
                        fileInfo = $('#batchCrateFile').get(0).files[0];
                    if (!fileInfo) {
                        SweetAlert.swal('提示', '请选择需要批量寄送库存的Excel文件', 'warning');
                        return false;
                    }
                    var form = new FormData();
                    form.append('file', $('#batchCrateFile').get(0).files[0]);

                    orderSvr.batchTransportUpload(form)
                        .then(function (result) {
                            self.fileInfo = result.data;
                            $timeout(function () {
                                $scope.batchCreate.verify();
                            }, 100);
                        });
                },
                verify: function () {

                    $scope.batchCreate.status = 'precheck';
                    var self = this;
                    orderSvr.batchTransportVerify(self.fileInfo.filePath)
                        .then(function (result) {
                            self.fileVerified = !!result.data.success;
                            if (!self.fileVerified) {

                                $scope.batchCreate.status = 'precheckError';
                                $scope.batchCreate.errorText = result.data.message;
                                return false;
                            }
                            else {

                                $scope.batchCreate.status = 'precheckSuccess';
                                $scope.batchCreate.fileVerified = true;
                            }
                        });
                },
                submit: function () {

                    $scope.batchCreate.status = 'presubmit';
                    var self = this;
                    orderSvr.batchTransportCreate(self.fileInfo.filePath)
                        .then(function (result) {
                            if (!result.data.success) {

                                $scope.batchCreate.status = 'presubmitError';
                                $scope.batchCreate.errorText = result.data.message;
                                return false;
                            }
                            else {

                                $scope.batchCreate.status = 'submitSuccess';
                                $state.go('customer.sendinventory');
                            }
                        });
                }
            }



            //end upload file
        }
    ]);