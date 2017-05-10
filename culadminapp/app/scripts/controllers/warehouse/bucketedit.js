'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseBucketEditCtrl
 * @description
 * # WarehouseBucketEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseBucketEditCtrl', ['$scope', '$location', '$window', 'warehouseService', 'bucketService', 'plugMessenger',
      function ($scope, $location, $window, warehouseService, bucketService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $scope.data = {
              detail: [],
              packageList: []
          };

          $scope.tpl_status = {
              actionType: "bucket", //bucket; package;
              bucketNumber: $location.search().bucketNumber || "",
              readonly: $location.search().readonly || ""
          }

          if (!!$scope.tpl_status.bucketNumber) {
              bucketService.getDetail($scope.tpl_status.bucketNumber, function (result) {
                  $scope.data = result;
              });
              $("#bucket-title").text("编辑" + $scope.tpl_status.bucketNumber);
          }

          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
              $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
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
                  if (!!_box) _array.push(_box.name);
                  if (!!_bag) _array.push(_bag.name);
                  $("#package-title").text(_array.join(" > "));
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
                          var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                              _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                              _selected_bag = _.findWhere(_bags, { _selected: true });
                          //删除box或bag下的当前操作的package
                          _selected_bag.packages = _.filter(_selected_bag.packages, function (pkg) { return pkg != item });
                          //删除packageList的当前操作的package
                          $scope.data.packageList = _.filter($scope.data.packageList, function (pkg) { return pkg.trackingNumber != item });
                          //如果当前操作的包裹是编辑状态下的包裹，则清除编辑状态。
                          if (!!$scope._selectedPackage && $scope._selectedPackage.trackingNumber == item) $scope._selectedPackage = null;
                          break;
                  }
              }
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
              bucketService.create($scope.data, function (result) {
                  if (!result.message) {
                      plugMessenger.success("创建成功");
                      $scope.btnPrev();
                  }
              });
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }

          $scope.btnClose = function () {
              bucketService.close($scope.tpl_status.bucketNumber, function (result) {
                  if (!result.message) {
                      plugMessenger.success("总单关闭成功");
                      $scope.btnPrev();
                  }
              });
          }

          var _timeout = null,
              _cacheCurrentResult = null;
          $scope.checkTrackingNumber = function () {
              if (!!_timeout) clearTimeout(_timeout);
              _timeout = setTimeout(function () {
                  $scope.$apply(function () {
                      if (!!$scope._selectedPackage && !!$scope._selectedPackage.trackingNumber) {
                          bucketService.checkPackage($scope._selectedPackage.trackingNumber, function (result) {
                              if (!!result.msg) {
                                  plugMessenger.info(result.msg);
                                  $scope._selectedPackage = null;
                                  _cacheCurrentResult = null;
                              } else {
                                  $scope._selectedPackage.trackingNumber = result.trackingNumber;
                                  //$scope._selectedPackage.weight = result.actualWeight;
                                  $scope._selectedPackage.weight = "";
                                  _cacheCurrentResult = result;
                              }
                          });
                      }
                  })
              }, 1000);
          }
           $scope._totalWeight= 0;
           $scope.totalWeight = function () {
                $scope.data.packageList.forEach(function(element) {
                    $scope._totalWeight = parseInt(parseInt($scope._totalWeight || 0) + element.weight);
                }, this);
           }
          $scope.btnSaveByPackage = function () {
              var _pallet = _.findWhere($scope.data.detail, { _selected: true }),
                  _bags = _.isArray(_pallet.bags) && _pallet.bags.length > 0 ? _pallet.bags : _.findWhere(_pallet.boxes, { _selected: true }).bags,
                  _selected_bag = _.findWhere(_bags, { _selected: true });
              if (!$scope._selectedPackage) return;
              //修改当前bag下的package
              if (!!_.findWhere(_selected_bag.packages, { trackingNumber: $scope._selectedPackage.trackingNumber })) {
                  var _package = _.findWhere($scope.data.packageList, { trackingNumber: $scope._selectedPackage.trackingNumber });
                  _package.weight = $scope._selectedPackage.weight;
              } else if (!_.findWhere($scope.data.packageList, { trackingNumber: $scope._selectedPackage.trackingNumber })) {
                  if (_cacheCurrentResult.actualWeight - 1 < $scope._selectedPackage.weight && _cacheCurrentResult.actualWeight + 1 > $scope._selectedPackage.weight) {
                      $scope.data.packageList.push({
                          "trackingNumber": $scope._selectedPackage.trackingNumber,
                          "weight": $scope._selectedPackage.weight
                      });
           
                      if (!_.isArray(_selected_bag.packages)) _selected_bag.packages = [$scope._selectedPackage.trackingNumber];
                      else _selected_bag.packages.push($scope._selectedPackage.trackingNumber);
                      $scope._selectedPackage = null;
                  } else {
                      plugMessenger.info("包裹编号" + $scope._selectedPackage.trackingNumber + "无法装袋:出库重量和打包重量不匹配。");
                      return;
                  }
              } else {
                  plugMessenger.info("包裹[" + $scope._selectedPackage.trackingNumber + "]已存在当前总单中，但不存在于正在操作的Bag中。");
                  return;
              }
              $scope._selectedPackage = null;
              $scope.totalWeight();
          }

          $scope.btnPrevByPackage = function () {
              $scope._selectedPackage = null;
              $scope.tpl_status.actionType = "bucket";
          }
      }]);

