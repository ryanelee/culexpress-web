'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SystemLoginLogListCtrl
 * @description
 * # SystemLoginLogListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SystemLoginLogListCtrl', ["$scope", "$location", "LogService", "plugMessenger",
      function ($scope, $location, LogService, plugMessenger) {
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
              keywordType: "emailAddress",
              result: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
              }
              if (!!$scope.searchBar.result) {
                  _options["result"] = $scope.searchBar.result;
              }
              if (!!$scope.searchBar.keywords) {
                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              var _options = _filterOptions();
              LogService.getLoginList(angular.copy(_options), function (result) {
                  $scope.dataList = result.data;
                  $scope.pagination.totalCount = result.pageInfo.totalCount;
              });
          }

          $scope.btnSearch = function () {
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.getData();
      }]);
