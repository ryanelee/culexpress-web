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

            $scope.data = {
                detail: [],
                packageList: []
            };
            $scope.bagTotalWeight = 0;

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

                    if (!!$scope.data) {
                        if ($scope.data.packageList[0]) {
                            $scope.data.packageList.forEach(function (e1) {
                                $scope.bagTotalWeight += e1.weight || 0;
                            })
                        }
                    }
                });

                $("#bucket-title").text("编辑" + $scope.tpl_status.bucketNumber);
            }

            warehouseService.getWarehouse(function (result) {
                $scope.warehouseList = result;
                $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
            });
            /**
             * 发货渠道
             */
            warehouseService.getShippingChannelList(function (result) {
                if (result.length == 1) {
                    $scope.shippingChannelList = result;
                    $scope.data.shipServiceId = $scope.shippingChannelList[0].shipServiceId;
                } else {
                    $scope.shippingChannelList = [{ shipServiceId: 0, shipServiceName: "全部" }].concat(result);
                    $scope.data.shipServiceId = $scope.shippingChannelList[0].shipServiceId;
                }
            });

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
                    //console.log(_bag);
                    // if (!!_bag) {
                    //     if (_bag.packages && _bag.packages[0]) {
                    //         _bag.packages.forEach((e) => {
                    //             if ($scope.data.packageList[0]) {
                    //                 $scope.data.packageList.forEach(function(e1) {
                    //                     if (e == e1.trackingNumber) {
                    //                         $scope.bagTotalWeight += e1.weight || 0;
                    //                     }
                    //                 })
                    //             }
                    //         })
                    //     } 
                    // }
                    if (!!_box) _array.push(_box.name);
                    if (!!_bag) _array.push(_bag.name);


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
                    console.log("2323");
                    console.log(level);
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
                            console.log('23')

                            var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                                _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                                _selected_bag = _.findWhere(_bags, { _selected: true });
                            //删除box或bag下的当前操作的package
                            _selected_bag.packages = _.filter(_selected_bag.packages, function (pkg) { return pkg.trackingNumber != item.trackingNumber });
                            //删除packageList的当前操作的package
                            $scope.data.packageList = _.filter($scope.data.packageList, function (pkg) { return pkg.trackingNumber != item.trackingNumber });
                            //如果当前操作的包裹是编辑状态下的包裹，则清除编辑状态。
                            if (!!$scope._selectedPackage && $scope._selectedPackage.trackingNumber == item.trackingNumber) $scope._selectedPackage = null;
                            $scope.btnSave();
                            break;
                    }
                }
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1);
                $window.history.back();
            }

            $scope.btnClose = function () {
                if ($scope.data.flightNo == "" && $scope.data.flightNo.length <= 0) {
                    $scope.errorFlightNo = "关闭前请输入航班号！"
                    return;
                }
                var _callback = function () {
                    plugMessenger.success("总单关闭成功");
                }

                plugMessenger.confirm("确认关闭出库总单吗？", function (isOK) {
                    if (isOK) {
                        var _options = {
                            "bucketNumber": $scope.tpl_status.bucketNumber,
                            "flightNo": $scope.data.flightNo
                        }

                        bucketService.close(_options, function (result) {
                            if (!result.message) {
                                _callback();
                                // 获取包裹信息
                                $scope.data.packageList.forEach(function (pkg) {
                                    orderService.getOutboundPackage(pkg.trackingNumber, function (result) {
                                        $scope.packages = result;
                                        $scope.packages.status = "Send";

                                        orderService.updateOutboundPackage($scope.packages, function (result) {
                                            if (!result.message) {
                                                $scope.btnPrev();
                                            }
                                        })
                                    });
                                });
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
                // $scope.data.flightNo = $scope.flightNo;
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
                    var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                        _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                        _selected_bag = _.findWhere(_bags, { _selected: true });
                    //删除box或bag下的当前操作的package
                    var _duplicatePackage = _.filter(_selected_bag.packages, function (pkg) { return pkg.trackingNumber == $scope._selectedPackage.trackingNumber });

                    if (_duplicatePackage && _duplicatePackage.length > 0) {
                        plugMessenger.info("CUL包裹单号[" + $scope._selectedPackage.trackingNumber + "]已经扫描到当前Bag!");
                        document.getElementById('key_trackingNumber').focus();
                        document.getElementById('key_trackingNumber').select();
                        return;
                    };

                    document.getElementById('key_weight').focus();
                }
            };

            // $scope.checkTrackingNumber = function () {
            //     if (!!_timeout) clearTimeout(_timeout);
            //     _timeout = setTimeout(function () {
            //         $scope.$apply(function () {
            //             if (!!$scope._selectedPackage && !!$scope._selectedPackage.trackingNumber) {
            //                 bucketService.checkPackage($scope._selectedPackage.trackingNumber, function (result) {
            //                     if (!!result.msg) {
            //                         plugMessenger.info(result.msg);
            //                         $scope._selectedPackage = null;
            //                         _cacheCurrentResult = null;
            //                         return false;
            //                     } else {
            //                         $scope._selectedPackage.trackingNumber = result.trackingNumber;
            //                         //$scope._selectedPackage.weight = result.actualWeight;
            //                         $scope._selectedPackage.weight = "";
            //                         _cacheCurrentResult = result;
            //                         return true;
            //                     }
            //                 });
            //             }

            //             return false;
            //         });
            //     }, 1000);
            // }
            $scope._totalWeight = 0;
            $scope.totalWeight = function () {
                $scope.data.packageList.forEach(function (element) {
                    $scope._totalWeight = parseInt(parseInt($scope._totalWeight || 0) + element.weight);
                }, this);
            }


            $scope.btnSaveByPackage = function () {
                if ($scope._selectedPackage == undefined || $scope._selectedPackage.trackingNumber == undefined) {
                    plugMessenger.info("请输入包裹单号.");
                    document.getElementById('key_trackingNumber').focus();
                    return;
                }

                // if (!!$scope._selectedPackage && $scope._selectedPackage.weight <= 0) {
                //     plugMessenger.info("包裹重量必须大于0.");
                //     document.getElementById('key_weight').focus();
                //     return;
                // }

                bucketService.checkPackage($scope._selectedPackage.trackingNumber, function (result) {
                    console.log(result)
                    //  待返回订单号字段，打印翔通面单。
                    if (!!result.msg) {
                        plugMessenger.info(result.msg);
                        $scope._selectedPackage = null;
                        _cacheCurrentResult = null;
                        document.getElementById('key_trackingNumber').focus();
                        $scope.btnSave();
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
                            // _package.weight = $scope._selectedPackage.weight;
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

                                $scope.data.packageList.push(_successPackage);

                                if (!_.isArray(_selected_bag.packages)) {
                                    _selected_bag.packages = [_successPackage];
                                }
                                else {
                                    _selected_bag.packages.push(_successPackage);
                                }
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
            $scope.btnCheckWeight  = function () {
                console.log($scope.data.packageList)
                let allowDevision = parseInt(parseInt(cul.bagWeight || 0) + 1);
                if ($scope.data.packageList.length > 0 && $scope._selectedPackage.totalWeight != undefined){
                    if ($scope._totalWeight - 1 <= $scope._selectedPackage.totalWeight && $scope._totalWeight + 1 >= $scope._selectedPackage.totalWeight) {
                        plugMessenger.info("校验成功！");
                    } else {
                        plugMessenger.info("称重重量[" + $scope._selectedPackage.totalWeight + "]不等于包裹总重量["+ $scope._totalWeight +"]!");
                        document.getElementById('key_trackingNumber').focus();
                        return;
                    }
                } else {
                    plugMessenger.info("还没有包裹");
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
                    }
                });
            }
            /**
             * 查询仓库和发货渠道对应的已打包包裹的数量和总重量
             */
            $scope.getSummaryInboundPackage = function () {
                console.log($scope.data)
                bucketService.getSummaryInboundPackage($scope.data, function (result) {
                    // console.log(result)
                })
            }
        }
    ]);