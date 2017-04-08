'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehousePackageCtrl
 * @description
 * # WarehousePackageCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehousePackageCtrl', ['$window','$rootScope','$scope', '$location', 'warehouseService', 'orderService','plugMessenger',
      function ($window,$rootScope,$scope, $location, warehouseService, orderService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $location.search({ trackingNumber: null });

          $scope.dataList = [];
          $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

          //新导出逻辑
          var _token = sessionStorage.getItem("token");
          _token = !!_token ? encodeURIComponent(_token) : null
          $("#form_export_order").attr("action", cul.apiPath + "/order/list/export?Token=" + _token);
          $("#form_export_send").attr("action", cul.apiPath + "/outboundpackage/list/export?Token=" + _token);

          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }
          /*search bar*/
          $scope.searchBar = {
              selectedAll: false,
              keywordType: "customerNumber",
              orderStatus: "Processing",
              warehouseNumber: "",
              exportStatus: "UnExported"
          }

          warehouseService.getWarehouse(function (result) {
              if (result.length == 1) {
                  $scope.searchBar.warehouseList = result;
                  $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
              } else {
                  $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
              }
          });

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination
              }
              if (!!$scope.searchBar.orderStatus) {
                  _options["orderStatus"] = $scope.searchBar.orderStatus;
              } else {
                  _options["exceptOrderStatus"] = ['Void'];
              }
              if (!!$scope.searchBar.warehouseNumber) {
                  _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
              }
              if (!!$scope.searchBar.exportStatus) {
                  _options["exportStatus"] = $scope.searchBar.exportStatus;
              }
              if (!!$scope.searchBar.keywords) {
                  if ($scope.searchBar.keywordType == "customerNumber"
                      && $scope.customer_ids != undefined
                      && parseInt($scope.customer_ids) !== 0
                      && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                      $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                  }

                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              var _options = _filterOptions();
              warehouseService.getOutboundPackageList($.extend(angular.copy(_options), { hasWeight: true }), function (result) {
                  var _data = result.data;           
                  if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                      _data = _data.filter(function(x){
                          return $scope.customer_ids.split(",").includes(x.customerNumber);
                      });
                  }

                  $scope.dataList = _data;

                  $scope.pagination.totalCount = result.pageInfo.totalCount;
                  $rootScope.$emit("changeMenu");

                  $.each($scope.dataList, function (i, item) {
                      item._selected = $.grep($scope.selectedListCache, function (n) { return n.trackingNumber == item.trackingNumber }).length > 0;
                  });
                  $scope.searchBar.selectedAll = $.grep($scope.dataList, function (n) { return n._selected == true }).length == $scope.dataList.length;
              });
              var _trackingNumbers = [],
                  _orderNumber = [];
              $.each($scope.selectedListCache, function (i, item) {
                  _trackingNumbers.push(item.trackingNumber);
                  _orderNumber.push(item.orderNumber);
              });
              if (_trackingNumbers.length > 0) _options.trackingNumber = _trackingNumbers.join(",");
              if (_orderNumber.length > 0) _options.orderNumber = _orderNumber.join(",");
              //新导出逻辑
              $scope.exportOptions = $.extend({ token: _token }, _options);
          }

          $scope.btnSearch = function () {
              $scope.selectedListCache = [];
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.selectedListCache = [];

          $scope.btnSelectedItem = function (item) {
              if (!!item) {
                  if (!item._selected) {
                      $scope.searchBar.selectedAll = false;
                  }
              } else {
                  $.each($scope.dataList, function (i, item) {
                      item._selected = $scope.searchBar.selectedAll;
                  });
              }
              //将当前页所有选中的item缓存到$scope.selectedListCache中（并去重）。
              $.each($scope.dataList, function (i, item) {
                  var isExists = $.grep($scope.selectedListCache, function (n) { return n.trackingNumber == item.trackingNumber }).length > 0;
                  if (!!item._selected && isExists == false) {
                      $scope.selectedListCache.push(angular.copy(item));
                  } else if (!item._selected && isExists == true) {
                      $scope.selectedListCache = $.grep($scope.selectedListCache, function (n) { return n.trackingNumber != item.trackingNumber });
                  }
              });
              var _options = _filterOptions();
              var _trackingNumbers = [],
                  _orderNumber = [];
              $.each($scope.selectedListCache, function (i, item) {
                  _trackingNumbers.push(item.trackingNumber);
                  _orderNumber.push(item.orderNumber);
              });
              if (_trackingNumbers.length > 0) _options.trackingNumber = _trackingNumbers.join(",");
              if (_orderNumber.length > 0) _options.orderNumber = _orderNumber.join(",");
              //新导出逻辑
              $scope.exportOptions = $.extend({ token: _token }, _options);
          }

          $scope.btnOpenDetail = function (item, type) {
              switch (type) {
                  case "orderdetail":
                      $location.search({ orderNumber: item.orderNumber });
                      $location.path("/order/orderdetail");
                      break;
                  case "customerdetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
                  case "trackingNumber":
                      $location.search({ trackingNumber: item.trackingNumber });
                      if (item.orderType == 0) {
                          $location.path("/warehouse/registerpackageoffline");
                      } else if (item.orderType == 1) {
                          $location.path("/warehouse/registerpackageonline");
                      }
                      break;
              }
          }

          $scope.btnClearSelectedListCache = function () {
              $scope.selectedListCache = [];
              $scope.searchBar.selectedAll = false;
              $.each($scope.dataList, function (i, item) {
                  item._selected = false;
              });
              var _options = _filterOptions();
              //新导出逻辑
              $scope.exportOptions = $.extend({ token: _token }, _options);
          }

          $scope.getData();

          $scope.addPackage = function (type) {
              switch (type) {
                  case "online":
                      $location.path('/warehouse/registerpackageonline');
                      break;
                  case "offline":
                      $location.path('/warehouse/registerpackageoffline');
                      break;
              }

          }

          $scope.btnPrint = function (item, type) {
              var _print = function () {
                  switch (type) {
                      case "order":
                          $scope.$broadcast("print-order.action", item.orderNumber);
                          break;
                      case "package":
                          $scope.$broadcast("print-package.action", item.orderNumber);
                          break;
                      case "flyingexpress":
                          $scope.$broadcast("print-flying-express.action", item.orderNumber);
                          break;
                      case "flyingexpress2":
                          $scope.$broadcast("print-flying-express2.action", item.orderNumber);
                          break;
                      case "trackingNumber":
                          _printTrackingNumbers(item);
                          break;
                  }
              }
              if (item.printStatus == "Printed") {
                  _print();
              } else {
                  switch (type) {
                      case "flyingexpress":
                      case "flyingexpress2":
                          plugMessenger.confirm("订单将变为已打印状态,请确认是否打印？", function (isOK) {
                              if (isOK) {
                                  var orderArray = [{
                                      "orderNumber": item.orderNumber,
                                      "printStatus": "Printed"
                                  }];
                                  orderService.batchUpdate(orderArray, function (result) {
                                      _print();
                                  });
                              }
                          });
                          break;
                      default:
                          _print();
                          break;
                  }
              }
          }

          $scope.btnBatchOutBound = function () {
              var trackingNumbers = [];
              $.each($scope.selectedListCache, function (i, item) {
                  trackingNumbers.push(item.trackingNumber);
              });
              if (trackingNumbers.length == 0) {
                  plugMessenger.info("请选择包裹后在执行该操作!");
              } else {
                  plugMessenger.confirm("包裹将变为已出库状态，请确认是否继续操作？", function (isOK) {
                      if (isOK) {
                          warehouseService.outboundPackageShip(trackingNumbers, function (result) {
                              if (result.success == true) {
                                  plugMessenger.success("出库成功!");
                                  $scope.selectedListCache = [];
                                  $scope.dataList = [];
                                  //$scope.pagination.pageIndex = 1;
                                  //$scope.pagination.totalCount = 0;
                                  $scope.getData();
                              }
                          });
                      }
                  });
              }
          }

          $('#tip_batchOutbound').popover({
              container: 'body',
              placement: 'top',
              html: true,
              trigger: 'hover',
              title: '',
              content: "点击此按钮将修改包裹状态为已出库，打包记录将自动从上面的列表中消失。如果要查看已出库包裹，请到订单查询页面查看。"
          });
      }]);
