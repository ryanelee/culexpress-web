'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MSGListCtrl
 * @description
 * # MSGListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('MSGListCtrl', ["$scope", "$filter", "faqService", "storage",function ($scope, $filter, faqService,storage) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $scope.dataList = [];
      $scope.pagination = {
          pageSize: "20",
          pageIndex: 1,
          totalCount: 0
      }
      /*search bar*/
      $scope.searchBar = {
          keywordType: "messageNumber",
          startDate: "",
          endDate: "",
          opened: {
              startDate: false,
              endDate: false
          }
      }
          $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //   storage.session.setObject("searchBar", $scope.searchBar);


      faqService.getMessageType(7, function (result) {
          $scope.searchBar.messageTypeData = result;
      });

      $scope.getData = function () {
          storage.session.setObject("searchBar", $scope.searchBar);
          var _options = {
              "pageInfo": $scope.pagination,
              "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
              "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : ""
          }
          _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
          faqService.getList(_options, function (result) {
              $scope.dataList = result.data;
              $scope.pagination.totalCount = result.pageInfo.totalCount;

              $.each($scope.dataList, function (index, item) {
                  var messageType = $.grep($scope.searchBar.messageTypeData, function (n) { return n.typeID == $scope.dataList[0].messageType });
                  if (messageType.length > 0) messageType = messageType[0];
                  item._typeName = messageType.typeName;
              });
          });
      }

      $scope.btnSearch = function () {
          $scope.dataList = [];
          $scope.pagination.pageIndex = 1;
          $scope.pagination.totalCount = 0;
          $scope.getData();
      }
  }]);
