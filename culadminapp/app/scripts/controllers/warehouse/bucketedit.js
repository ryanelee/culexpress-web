'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseBucketEditCtrl
 * @description
 * # WarehouseBucketEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseBucketEditCtrl', ['$scope', '$location', '$window', 'warehouseService', 'bucketService', 'plugMessenger', 'orderService',
        function ($scope, $location, $window, warehouseService, bucketService, plugMessenger, orderService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.cul = {};
            $scope.cul.bagWeight = 1;
            $scope.data = {
                detail: [],
                packageList: []
            };
            $scope.selectPkgTotalWeight = 0;
            $scope.selectPkgTotalCount = 0;

            $scope.tpl_status = {
                actionType: "bucket", //bucket; package;
                bucketNumber: $location.search().bucketNumber || "",
                readonly: $location.search().readonly || "",
                editFlightNo: $location.search().editFlightNo || "",
                editBucket: $location.search().editBucket || "",
                createBucket: $location.search().createBucket || ""
            }

            $scope.errorFlightNo = "";
            $scope.flightNo = "";
            $scope.packages = {};

            if (!!$scope.tpl_status.bucketNumber) {
                bucketService.getDetail($scope.tpl_status.bucketNumber, function (result) {
                    $scope.data = result;
                    // console.log("result", result);
                    if ($scope.data.detail[0]) {
                        $scope.data.detail.forEach(function (e) {
                            e.totalWeight = 0;
                            if (e.boxes && e.boxes[0]) {
                                e.boxes.forEach(function (e1) {
                                    if (e1.bags && e1.bags[0]) {
                                        e1.bags.forEach(function (e2) {
                                            e2.totalWeight = 0;
                                            if (e2.packages && e2.packages[0]) {
                                                e2.packages.forEach(function (e3) {
                                                    $scope.selectPkgTotalWeight += e3.weight;
                                                    $scope.selectPkgTotalCount ++;
                                                    $scope.data.packageList.forEach(function (e4) {
                                                        if (e3 == e4.trackingNumber) {
                                                            e2.readonly = $location.search().readonly || ""
                                                            e.readonly = $location.search().readonly || ""
                                                            e2.totalWeight += e4.weight;
                                                            e.totalWeight += e4.weight;
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                                // if(e.bags && e.bags[0]){
                                //     e.bags
                                //     e.bags.packages
                                // }
                            }
                        })
                    }

                    // if (!!$scope.data) {
                    //     if ($scope.data.packageList[0]) {
                    //         $scope.data.packageList.forEach(function (e1) {
                    //             $scope.selectPkgTotalWeight += e1.weight || 0;
                    //         })
                    //     }
                    // }
                });

                $("#bucket-title").text("编辑" + $scope.tpl_status.bucketNumber);
            }
            $scope.getShippingChannelList = function () {
                warehouseService.getShippingChannelList(function (result) {
                    if (result.length == 1) {
                        $scope.shippingChannelList = result;
                        $scope.data.shipServiceId = $scope.shippingChannelList[0].shipServiceId;
                    } else {
                        $scope.shippingChannelList = [{ shipServiceId: 0, shipServiceName: "全部" }].concat(result);
                        $scope.data.shipServiceId = $scope.shippingChannelList[0].shipServiceId;
                    }
                });
                $scope.getSummaryInboundPackage();
            }


            $scope.$on('$viewContentLoaded', function () {
                $scope.getWarehouse();
            });
            
            $scope.getWarehouse = function () {
                warehouseService.getWarehouse(function (result) {
                    $scope.warehouseList = result;
                    $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
                    $scope.getShippingChannelList()
                });
            }


            /**
             * 发货渠道
             */


            $scope.callback = {
                check: function (item, resource, level) {
                    if (!item) return;
                    if (_.isObject(item)) {
                        //bucket, box, bag
                        if (!_.findWhere(resource, { name: item.name, _selected: true })) {
                            var _recursion_clear_selected = function (items) {
                                _.each(items, function (_item) {
                                    delete _item._selected;
                                    for (var key in _item) {
                                        if (_.isArray(_item[key])) _recursion_clear_selected(_item[key]);
                                    }
                                });
                            };
                            _recursion_clear_selected(resource);
                            item._selected = true;
                            $scope.$broadcast("bucket-item-selected", item.name, level);
                        }
                    } else {
                        //package
                        $scope._selectedPackage = angular.copy(_.findWhere($scope.data.packageList, { trackingNumber: item }));
                        $scope.$broadcast("bucket-item-selected", $scope._selectedPackage.trackingNumber);
                    }
                },
                add: function (item, resource) {
                    if (!item) return;

                    $scope.callback.check(item, resource);
                    $scope.tpl_status.actionType = "package";
                    var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                        _box = null,
                        _bag = null,
                        _array = [_pallet.name];
                    if (_.isArray(_pallet.bags) && _pallet.bags.length > 0) {
                        _bag = _.findWhere(_pallet.bags, { _selected: true });
                    } else {
                        _box = _.findWhere(_pallet.boxes, { _selected: true });
                        _bag = _.findWhere(_box.bags, { _selected: true });
                    }
                    // if (!!_bag) {
                    //     if (_bag.packages && _bag.packages[0]) {
                    //         _bag.packages.forEach((e) => {
                    //             if ($scope.data.packageList[0]) {
                    //                 $scope.data.packageList.forEach(function(e1) {
                    //                     if (e == e1.trackingNumber) {
                    //                         $scope.selectPkgTotalWeight += e1.weight || 0;
                    //                     }
                    //                 })
                    //             }
                    //         })
                    //     } 
                    // }
                    if (!!_box) _array.push(_box.name);
                    if (!!_bag) _array.push(_bag.name);

                    $scope.totalWeight()
                    $("#package-title").text(_array.join(" > "));
                    setTimeout(function () {
                        $("#key_trackingNumber").focus();
                    }, 100)
                },
                remove: function (item, level) {
                    if (!item) return;
                    if (!!item.boxes && item.boxes.length > 0) {
                        plugMessenger.info("该{0}已经装载[{1}]个Box，清空后才能删除。".replace("{0}", level).replace("{1}", item.boxes.length));
                        return;
                    }
                    if (!!item.bags && item.bags.length > 0) {
                        plugMessenger.info("该{0}已经装载[{1}]个Bag，清空后才能删除。".replace("{0}", level).replace("{1}", item.bags.length));
                        return;
                    }
                    if (!!item.packages && item.packages.length > 0) {
                        plugMessenger.info("该{0}已经装载[{1}]个包裹，清空后才能删除。".replace("{0}", level).replace("{1}", item.packages.length));
                        return;
                    }
                    switch (level) {
                        case "pallet":
                            $scope.data.detail = _.filter($scope.data.detail, function (pallet) { return pallet.$$hashKey != item.$$hashKey });
                            break;
                        case "box":
                            var _pallet = _.findWhere($scope.data.detail, { _selected: true });
                            _pallet.boxes = _.filter(_pallet.boxes, function (box) { return box.$$hashKey != item.$$hashKey });
                            if (_pallet.boxes.length == 0) _pallet.boxes = null;
                            break;
                        case "bag":
                            var _pallet = _.findWhere($scope.data.detail, { _selected: true });
                            if (_.isArray(_pallet.bags) && _pallet.bags.length > 0) {
                                _pallet.bags = _.filter(_pallet.bags, function (bag) { return bag.$$hashKey != item.$$hashKey });
                                if (_pallet.bags.length == 0) _pallet.bags = null;
                            } else {
                                var _box = _.findWhere(_pallet.boxes, { _selected: true });
                                _box.bags = _.filter(_box.bags, function (bag) { return bag.$$hashKey != item.$$hashKey });
                            }
                            break;
                        case "package":
                            //控制扫描包裹号keydown触发删除动作
                            if ($scope._selectedPackage && $scope._selectedPackage.weight == undefined) {
                                break;
                            }

                            var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                                _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                                _selected_bag = _.findWhere(_bags, { _selected: true });
                            //删除box或bag下的当前操作的package
                            _selected_bag.packages = _.filter(_selected_bag.packages, function (pkg) { return pkg.trackingNumber != item.trackingNumber });
                            //删除packageList的当前操作的package
                            $scope.data.packageList = _.filter($scope.data.packageList, function (pkg) { return pkg.trackingNumber != item.trackingNumber });
                            //如果当前操作的包裹是编辑状态下的包裹，则清除编辑状态。
                            if (!!$scope._selectedPackage && $scope._selectedPackage.trackingNumber == item.trackingNumber) $scope._selectedPackage = null;
                            $scope.totalWeight()
                            $scope.refesh();
                            break;
                    }
                }
            }
            $scope.refesh = function () {
                if (!!$scope.tpl_status.bucketNumber) {
                    bucketService.update($scope.data, function (result) {
                        if (!result.message) {
                            plugMessenger.success("修改成功");
                        }
                    });
                    return;
                }
            }
            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1);
                $window.history.back();
            }

            $scope.btnClose = function () {

                if (!$scope.data.packageList || $scope.data.packageList.length == 0) {
                    plugMessenger.info("该总单没有扫描任何包裹不能关闭!");
                    return;
                }

                if ($scope.data.flightNo == "" && $scope.data.flightNo.length <= 0) {
                    $scope.errorFlightNo = "关闭前请输入航班号！"
                    return;
                }
                var _callback = function () {
                    plugMessenger.success("总单关闭成功");
                    $scope.btnPrev();
                }

                plugMessenger.confirm("所有已扫描包裹将变为已出库状态,确认关闭出库总单吗？", function (isOK) {
                    if (isOK) {
                        var _options = {
                            "bucketNumber": $scope.tpl_status.bucketNumber,
                            "flightNo": $scope.data.flightNo
                        }
                        bucketService.close(_options, function (result) {
                            // console.log("result", result);

                            if (!result.message) {
                                var trackingNumbers = [];
                                $.each($scope.data.packageList, function (i, item) {
                                    trackingNumbers.push(item.trackingNumber);
                                });

                                warehouseService.outboundPackageShip(trackingNumbers, function (result) {
                                    if (result.success == true) {
                                       _callback();
                                    }
                                });
                                // bucketService.updateculBucket($scope.data.packageList, function (result) {
                                //     _callback();
                                // })
                                // 获取包裹信息
                                // $scope.data.packageList.forEach(function (pkg) {
                                //     orderService.getOutboundPackage(pkg.trackingNumber, function (result) {
                                //         $scope.packages = result;
                                //         $scope.packages.status = "Shipped";

                                //         orderService.updateOutboundPackage($scope.packages, function (result) {
                                //             if (!result.message) {
                                //                 $scope.btnPrev();
                                //             }
                                //         })
                                //     });
                                // });
                            }
                        });
                    }
                });
            }

            $scope.btnAdd = function (type) {
                var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                    _createObj = function (resource) {
                        var _newNumber = 1;
                        if (resource.length > 0) {
                            var _name = resource[resource.length - 1].name;
                            _newNumber = parseFloat(_name.substring(_name.lastIndexOf("-") + 1)) + 1;
                        }
                        return {
                            "name": "{0}-{1}".replace("{0}", type).replace("{1}", _newNumber)
                        }
                    }
                switch (type) {
                    case "pallet":
                        $scope.data.detail.push(_createObj($scope.data.detail));
                        break;
                    case "box":
                        if (!_pallet.bags || _pallet.bags.length == 0) {
                            if (!_pallet.boxes) _pallet.boxes = [];
                            _pallet.boxes.push(_createObj(_pallet.boxes));
                        } else {
                            plugMessenger.info("请将Pallet下的Bag清理后再创建Box");
                        }
                        break;
                    case "bag":
                        if (!_pallet.boxes || _pallet.boxes.length == 0) {
                            if (!_pallet.bags) _pallet.bags = [];
                            _pallet.bags.push(_createObj(_pallet.bags));
                        } else {
                            var _box = _.findWhere(_pallet.boxes, { _selected: true });
                            if (!!_box) {
                                if (!_box.bags) _box.bags = [];
                                _box.bags.push(_createObj(_box.bags));
                            } else {
                                plugMessenger.info("请指定Box再创建Bag");
                            }
                        }
                        break;
                }
            }

            $scope.btnSave = function () {
                //修改总单
                if (!!$scope.tpl_status.bucketNumber) {
                    bucketService.update($scope.data, function (result) {
                        if (!result.message) {
                            plugMessenger.success("修改成功");
                            $scope.btnPrev();
                        }
                    });

                    return;
                }

                //新建
                bucketService.create($scope.data, function (result) {
                    if (!result.message) {
                        plugMessenger.success("创建成功");
                        $scope.btnPrev();
                    }
                });
            }

            var _timeout = null,
                _cacheCurrentResult = null;

            $scope.keydownTrackingNumber = function (event) {

                if (event.keyCode === 13) {
                    // var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                    //     _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                    //     _selected_bag = _.findWhere(_bags, { _selected: true });
                    // //删除box或bag下的当前操作的package
                    // var _duplicatePackage = _.filter(_selected_bag.packages, function (pkg) { return pkg.trackingNumber == $scope._selectedPackage.trackingNumber });

                    // if (_duplicatePackage && _duplicatePackage.length > 0) {
                    //     plugMessenger.info("CUL包裹单号[" + $scope._selectedPackage.trackingNumber + "]已经扫描到当前Bag!");
                    //     document.getElementById('key_trackingNumber').focus();
                    //     document.getElementById('key_trackingNumber').select();
                    //     return;
                    // };
                    $scope.btnSaveByPackage();

                    // document.getElementById('key_weight').focus();
                }
            };


            $scope.checkWeight = function (event) {
                if (event.keyCode === 13) {
                    $scope.btnCheckWeight();
                }
            };
            $scope.totalWeight = function () {
                $scope.selectPkgTotalWeight = 0;
                $scope.selectPkgTotalCount = 0;
                $scope.data.packageList.forEach(function (element) {
                    $scope.selectPkgTotalCount ++;
                    $scope.selectPkgTotalWeight = parseFloat(parseFloat($scope.selectPkgTotalWeight || 0) + element.weight);
                }, this);
            }


            $scope.btnSaveByPackage = function () {
                if ($scope._selectedPackage == undefined || $scope._selectedPackage.trackingNumber == undefined) {
                    plugMessenger.info("请输入包裹单号.");
                    document.getElementById('key_trackingNumber').focus();
                    return;
                }

                bucketService.checkPackage($scope._selectedPackage.trackingNumber, function (result) {
                    //  待返回订单号字段，打印翔通面单。
                    if (!!result.msg) {
                        plugMessenger.info(result.msg);
                        $scope._selectedPackage = null;
                        _cacheCurrentResult = null;
                        document.getElementById('key_trackingNumber').focus();
                        // $scope.btnSave();
                        return;
                    } else {
                        $scope._selectedPackage.trackingNumber = result.trackingNumber;
                        _cacheCurrentResult = result;

                        var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                            _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                            _selected_bag = _.findWhere(_bags, { _selected: true });
                        if (!$scope._selectedPackage) return;
                        //修改当前bag下的package 
                        if (!!_.findWhere(_selected_bag.packages, { trackingNumber: $scope._selectedPackage.trackingNumber })) {
                            var _package = _.findWhere($scope.data.packageList, { trackingNumber: $scope._selectedPackage.trackingNumber });
                        } else if (!_.findWhere($scope.data.packageList, { trackingNumber: $scope._selectedPackage.trackingNumber })) {
                            if (_cacheCurrentResult.actualWeight <= 0) {
                                plugMessenger.info("CUL包裹单号" + $scope._selectedPackage.trackingNumber + "无法装袋:该包裹还未打包称重。");
                                $scope._selectedPackage = null;
                                _cacheCurrentResult = null;
                                document.getElementById('key_trackingNumber').focus();
                                return;
                            } else {
                                var _successPackage = angular.copy($scope._selectedPackage);
                                _successPackage.weight = _cacheCurrentResult.actualWeight;
                                _successPackage.orderNumber = _cacheCurrentResult.orderNumber

                                if (!_.isArray(_selected_bag.packages)) {
                                    _selected_bag.packages = [_successPackage];
                                    // $scope.data.packageList= [_successPackage];
                                }
                                else {
                                    _selected_bag.packages.push(_successPackage);
                                    // $scope.data.packageList.push(_successPackage);
                                }

                                $scope.data.packageList = _selected_bag.packages;
                            }
                            // else if (_cacheCurrentResult.actualWeight - 1 < $scope._selectedPackage.weight && _cacheCurrentResult.actualWeight + 1 > $scope._selectedPackage.weight) {
                            //     var _successPackage = angular.copy($scope._selectedPackage);
                            //     _successPackage.weight = _cacheCurrentResult.actualWeight;

                            //     $scope.data.packageList.push(_successPackage);

                            //     if (!_.isArray(_selected_bag.packages)) {
                            //         _selected_bag.packages = [_successPackage];
                            //     }
                            //     else {
                            //         _selected_bag.packages.push(_successPackage);
                            //     }
                            // } else {
                            //     plugMessenger.info("CUL包裹单号" + $scope._selectedPackage.trackingNumber + "无法装袋:出库重量和打包重量不匹配。");
                            //     $scope._selectedPackage = null;
                            //     _cacheCurrentResult = null;
                            //     document.getElementById('key_trackingNumber').focus();
                            //     return;
                            // }
                        } else {
                            plugMessenger.info("包裹[" + $scope._selectedPackage.trackingNumber + "]已存在当前总单中。");
                            $scope._selectedPackage = null;
                            _cacheCurrentResult = null;
                            document.getElementById('key_trackingNumber').focus();
                            return;
                        }
                        _cacheCurrentResult = null;
                        $scope._selectedPackage = null;
                        $scope.totalWeight();
                        document.getElementById('key_trackingNumber').focus();
                    }
                });
            }
            /**
             * 总重量校验
             */

            $scope.btnCheckWeight = function () {
                if(!$scope._selectedPackage || !$scope._selectedPackage.totalWeight || $scope._selectedPackage.totalWeight < 0){
                    plugMessenger.info("称重重量无效!")
                    return;
                }

                var sumWeight = _.reduce($scope.data.packageList, function (m, n) {
                    return m + n.weight;
                }, 0);
                // let allowDevision = parseFloat(parseFloat($scope.cul.bagWeight || 0) + 1);
                if ($scope.data.packageList.length > 0 && $scope._selectedPackage.totalWeight != undefined) {
                    var compareWeight = parseFloat(sumWeight) + parseFloat($scope.cul.bagWeight);
                    if ((compareWeight - parseFloat($scope._selectedPackage.totalWeight)) < 1 && (compareWeight - parseFloat($scope._selectedPackage.totalWeight)) > -1) {
                        // if ($scope.selectPkgTotalWeight - allowDevision <= $scope._selectedPackage.totalWeight && $scope.selectPkgTotalWeight + allowDevision >= $scope._selectedPackage.totalWeight) {
                        plugMessenger.info("校验成功！");
                    } else {
                        // plugMessenger.info("称重重量[" + $scope._selectedPackage.totalWeight + "]不等于包裹总重量[" + $scope.selectPkgTotalWeight + "]!")
                        plugMessenger.error("重量校验失败![称重重量" + $scope._selectedPackage.totalWeight + "磅]和[包裹加袋子重量"+ compareWeight +"磅]的误差必须小于正负1磅!");
                        document.getElementById('key_trackingNumber').focus();
                        return;
                    }
                } else {
                    plugMessenger.info("还没有装袋包裹");
                    document.getElementById('key_trackingNumber').focus();
                    return;
                }
            }

            $scope.btnPrevByPackage = function () {
                $scope._selectedPackage = null;
                $scope.tpl_status.actionType = "bucket";
            }

            $scope.btnUpdate = function () {
                if ($scope.flightNo == "" && $scope.flightNo.length <= 0) {
                    $scope.errorFlightNo = "请输入航班号！"
                    return;
                }
                var _options = {
                    "bucketNumber": $scope.tpl_status.bucketNumber,
                    "flightNo": $scope.flightNo
                }
                bucketService.update(_options, function (result) {
                    if (!result.message) {
                        plugMessenger.success("修改成功！");
                        $scope.btnPrev();
                    }
                });
            }
            /**
             * 查询仓库和发货渠道对应的已打包包裹的数量和总重量
             */
            $scope.pkgCount = [];
            $scope.getSummaryInboundPackage = function () {
                bucketService.getSummaryInboundPackage($scope.data, function (result) {
                    $scope.pkgCount = result.data.data
                    $scope.pkgCount.PackageCount = 0;
                    $scope.pkgCount.PackageTotalWeight = 0;
                    if (!!$scope.pkgCount) {
                        $scope.pkgCount.forEach(function (element) {
                            $scope.pkgCount.PackageCount = $scope.pkgCount.PackageCount + element.PackageCount
                            $scope.pkgCount.PackageTotalWeight = $scope.pkgCount.PackageTotalWeight + element.PackageTotalWeight
                        });
                    }
                })
            }
        }
    ]);