'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:AddressListCtrl
 * @description
 * # AddressListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('AddressListCtrl', ["$scope", "$location", "addressService", "plugMessenger","$rootScope", function ($scope, $location, addressService, plugMessenger,$rootScope) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $location.search({ trackingNumber: null });

      $scope.dataList = [];
      $scope.pagination = {
          pageSize: "20",
          pageIndex: 1,
          totalCount: 0
      }
      /*search bar*/
      $scope.searchBar = {
          keywordType: "customerNumber",
          countryCode: "",
          accountBalance: "",
          startDate: "",
          endDate: "",
          opened: {
              startDate: false,
              endDate: false
          }
      }

      $scope.getData = function () {
          var _options = {
              "pageInfo": $scope.pagination
          }
          _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
          addressService.getList(_options, function (result) {
              $scope.dataList = result.data;
              $scope.pagination.totalCount = result.pageInfo.totalCount;
              $rootScope.$emit('changeMenu');
          });
      }

      $scope.btnSearch = function () {
          $scope.dataList = [];
          $scope.pagination.pageIndex = 1;
          $scope.pagination.totalCount = 0;
          $scope.getData();
      }
      $scope.btnSearch()

      $scope.btnOpenDetail = function (type, address) {
          switch (type) {
              case "customer":
                  $location.search({ customerNumber: address.customerNumber });
                  $location.path("/customer/customerdetail");
                  break;
              case "address":
                  $location.search({ transactionNumber: address.transactionNumber });
                  $location.path("/customer/addressdetail");
                  break;
          }
      }

      $scope.btnVerification = function (address, index) {
          var _address = angular.copy(address);
          _address.verifyMark = _address.verifyMark == 0 ? 1 : 0;
          _address._verifyMark = _address.verifyMark == 0 ? "未验证" : "已验证";
          addressService.update(_address, function (result) {
              if (result.success == true) {
                  if (_address.verifyMark == 1) plugMessenger.success("验证成功");
                  else plugMessenger.success("验证取消");
                  $scope.dataList[index] = _address;
              } else {
                  plugMessenger.error("验证失败： " + result.message);
              }
          });
      }
/*
      $scope.btnDelete = function (address) {
          addressService.delete(address.transactionNumber, function (result) {
              if (result.success == true) {
                  plugMessenger.success("删除成功");
                  $scope.getData();
              }
          });
      } */
      
      $scope.btnDelete = function (address) {
            plugMessenger.confirm("确认删除该地址吗?", function (isOk) {
                if (isOk) {
                  addressService.delete(address.transactionNumber, function (result) {
              if (result.success == true) {
                  plugMessenger.success("删除成功");
                  $scope.getData();
              }
                  })
                }
            });
          }

  }]);
