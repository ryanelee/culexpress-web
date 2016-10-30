'use strict';

angular
    .module('culwebApp')
    .controller('ProductEditCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, orderSvr) {
            $scope.$root.wizardOptions = {};
            $scope.current = {
                category: null,
                subCategory: null,
                itemNumber: $stateParams.id,
                isEdit: !!$stateParams.id
            }

            $scope.wizardOptions = {
                verified: true,
                mode: 'disable',
                nextText: '下一步',
                prevText: '上一步',
                submitText: '提交'
            }

            $scope.wizardValid = function (index, step) {
                if (index == 1) {
                    if (!!$scope.current.isEdit) {
                        return true;
                    }
                    if (!$scope.model.category) {
                        alertify.alert('提示', '请选择商品类别。', 'warning');
                        return false;
                    }
                    if (!$scope.model.subcategory) {
                        alertify.alert('提示', '请选择商品子类别。', 'warning');
                        return false;
                    }
                }
                if (index == 2) {
                    if (!$scope.model.brand) {
                        alertify.alert('提示', '商品品牌不能为空。', 'warning');
                        return false;
                    }
                    if (!$scope.model.upccode) {
                        alertify.alert('提示', 'UPC代码不能为空。', 'warning');
                        return false;
                    }
                    if (!$scope.model.description) {
                        alertify.alert('提示', '商品描述不能为空。', 'warning');
                        return false;
                    }
                    $timeout(function () {
                        initSlider();
                        if (!!$scope.current.isEdit) {
                            setEditImages($scope.model.link);
                        }
                    }, 200);
                }
            };

            $scope.wizardSubmit = function () {
                $scope.submit();
            }


            var model = $scope.model = {
                "customerNumber": $scope.$root.currentUser.customerNumber,
                "category": '',
                "subcategory": '',
                "brand": '',
                "upccode": '',
                "keywords": '',
                "description": '',
                "length": '',
                "width": '',
                "height": '',
                "weight": '',
                "link": '',
                "properties": []
            };

            $scope.source = {
                categories: [],
                subCategories: []
            };


            //编辑时要获取一次数据
            if (!!$scope.current.isEdit) {

                orderSvr.getProduct($scope.current.itemNumber)
                    .then(function (result) {
                        var newModel = result.data;
                        $scope.model = newModel;
                        if (!!$scope.source.categories.length) {
                            setEditGoodsCategory();
                        }
                        else {
                            $scope.loadGoodsCategory();
                        }
                        setEditProperty(newModel.properties);
                    });

                setTimeout(function () {
                    $scope.wizardOptions.jumpTo(2);
                }, 200);
            }

            var setEditGoodsCategory = function () {

                var queriedCategory = $filter('filter')($scope.source.categories, function (categoryItem) {
                    return categoryItem.cateid === $scope.model.category;
                })[0];
                $scope.current.category = queriedCategory;

                if (!!queriedCategory) {
                    $scope.source.subCategories = queriedCategory.sub;
                }

                var queriedSubCategory = $filter('filter')($scope.source.subCategories, function (categoryItem) {
                    return categoryItem.cateid === $scope.model.subcategory;
                })[0];

                $scope.current.subCategory = queriedSubCategory;
            }, setEditProperty = function (properties) {
                temp.properties = properties;
            }, setEditImages = function (imagesString) {
                var imgs = imagesString.split(',');
                $.each(imgs, function () {
                    $scope.addImage(this);
                });
            };


            $scope.loadGoodsCategory = function () {
                orderSvr.getGoodsCategories()
                    .then(function (result) {
                        $scope.source.categories = result.data;
                        if ($scope.current.isEdit) {
                            setEditGoodsCategory();
                        }
                    });
            }
            $scope.loadGoodsCategory();

            $scope.selectedCategory = function (val, categoryItem) {
                $scope.current.category = categoryItem;
                $scope.current.subCategory = null;
                var currentItem = $filter('filter')($scope.source.categories, function (categoryItem) {
                    return categoryItem.cateid === val;
                })[0];
                if (!!currentItem) {
                    $scope.source.subCategories = currentItem.sub;
                }
                model.category = categoryItem.cateid;
            }

            $scope.selectedSubCategory = function (categoryItem) {
                $scope.current.subCategory = categoryItem;
                model.subcategory = categoryItem.cateid;
            }

            $scope.submit = function () {
                if (!$scope.model.length || !$scope.model.width || !$scope.model.height) {
                    alertify.alert('提示', '请填写商品包装的原始尺寸。', 'warning');
                    return false;
                }
                if ($scope.model.length < 0 || $scope.model.width < 0 || $scope.model.height < 0) {
                    alertify.alert('提示', '商品包装尺寸不能小于0。', 'warning');
                    return false;
                }

                if (!$scope.model.weight) {
                    alertify.alert('提示', '请填写商品包装的原始重量。', 'warning');
                    return false;
                }
                if (!$scope.model.weight) {
                    alertify.alert('提示', '商品重量不能小于0', 'warning');
                    return false;
                }


                if (!!temp.properties.length) {
                    model.properties = temp.properties;
                }

                if (!!temp.images.length) {
                    $scope.model.link = model.link = temp.images.join(',');
                }

                orderSvr.submitProduct($scope.model)
                    .then(function (result) {
                        if (!!result.data.transactionNumber) {
                            $state.go('customer.products');
                        }
                    }, function (result) {
                        alertify.alert('错误', result.data.message, 'warning');
                    });
            }


            //bengin manage properties

            var temp = $scope.temp = {
                property: '',
                properties: [],
                image: '',
                images: []
            };

            $scope.addProperty = function () {
                if (!!temp.property) {
                    if (temp.property.indexOf(':') < 0) {
                        alertify.alert('提示', '属性格式错误!', 'warning');
                        return false;
                    }

                    if (temp.properties.length >= 5) {
                        alertify.alert('提示', '您最多可以为每个商品添加5个属性。', 'warning');
                        return false;
                    }

                    temp.properties.push({
                        number: temp.properties.length + 1,
                        propertyName: temp.property.split(':')[0],
                        propertyValue: temp.property.split(':')[1]
                    });
                    temp.property = '';
                }
            }

            $scope.removeProperty = function (propertyItem) {
                var index = temp.properties.indexOf(propertyItem);
                if (index >= 0) {
                    temp.properties.splice(index, 1);
                }
            }

            //end manage properties

            //bengin manage images
            function initSlider() {
                jQuery(".owl-slider-v4").owlCarousel({
                    items: 3,
                    itemsDesktop: [1000, 3],
                    itemsTablet: [600, 2],
                    itemsMobile: [479, 1]
                });
                initActionBar();
                iniViewer();
            }

            function initActionBar() {
                var actionTmpl = '<div class="action-bar">' +
                    '<a class="btn-remove"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></a>' +
                    '</div>';
                $('.owl-slider-v4 .owl-item')
                    .hover(function () {
                        $(this).append(actionTmpl);

                        $(this).find('.btn-remove').off('click').on('click', function () {
                            var slider = $('.owl-slider-v4').data('owlCarousel'),
                                index = $(this).closest('.owl-item').index();
                            slider.removeItem(index);
                            $scope.removeImage(index);

                            initActionBar();
                        });
                    }, function () {
                        $(this).find('.action-bar').remove();
                    });
            }

            function iniViewer() {
                $('.owl-slider-v4 .owl-wrapper').viewer();
            }

            $scope.addImage = function (imageUrl) {
                if (!!imageUrl) temp.image = imageUrl;
                if (!!temp.image) {
                    if (temp.image.indexOf('http') < 0) {
                        alertify.alert('提示', '图片格式错误!', 'warning');
                        return false;
                    }

                    if (temp.images.length >= 5) {
                        alertify.alert('提示', '每个商品最多可以指定5个图片链接。', 'warning');
                        return false;
                    }

                    temp.images.push(temp.image);

                    $timeout((function (imgUrl) {
                        var slider = $('.owl-slider-v4').data('owlCarousel');
                        slider.addItem('<div class="item"><img src="' + imgUrl + '" alt=""></div>');
                        temp.image = '';

                        initActionBar();
                        iniViewer();
                    })(temp.image));
                }
            }

            $scope.removeImage = function (imageIndex) {
                if (imageIndex >= 0) {
                    temp.images.splice(imageIndex, 1);
                }
            }

            //end manage images



            //start upload file
            $scope.batchCreate = {
                fileInfo: null,
                fileVerified: false,
                status: '',
                errorText: '',
                upload: function () {
                    var self = this,
                        fileInfo = $('#batchCrateFile').get(0).files[0];
                    var form = new FormData();
                    form.append('file', fileInfo);

                    orderSvr.batchProductsUpload(form)
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
                    orderSvr.batchProductsVerify(self.fileInfo.filePath)
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
                    orderSvr.batchProductsCreate(self.fileInfo.filePath)
                        .then(function (result) {
                            if (!result.data.success) {

                                $scope.batchCreate.status = 'presubmitError';
                                $scope.batchCreate.errorText = result.data.message;
                                return false;
                            }
                            else {

                                $scope.batchCreate.status = 'submitSuccess';
                                $state.go('customer.products');
                            }
                        });

                }
            }

            //end upload file

        }
    ]).
    controller('ProductInventoryCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, orderSvr) {

            var model = $scope.model = {};

            $scope.pagedOptions = {
                total: 0,
                size: 10
            };


            $scope.onPaged = function (pageIndex) {
                $scope.loadListData(pageIndex);
            }

            $scope.loadListData = function (index) {
                $scope.pagedOptions.index = index;

                var queryParams = {
                    pageInfo: {
                        pageIndex: index || 1,
                        pageSize: $scope.pagedOptions.size
                    },
                    itemNumber: $stateParams.id
                };

                orderSvr.getItemInventory(queryParams)
                    .then(function (result) {
                        model.items = result.data.data;
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                    });
            }
            //$scope.loadListData();
            $scope.loadListData();

            $scope.redirectToList = function () {
                $state.go('customer.products');
            }

            $scope.redirectToDetail = function (sendiNumber) {
                $state.go('customer.sendidetail', { id: sendiNumber });
            }
        }
    ]);