'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceDetailReportListCtrl
 * @description
 * # FinanceDetailReportListCtrl 
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('FinanceDetailReportListCtrl', ["$scope", "$location", "$filter", "customerService", "settlementService", "plugMessenger",
        function ($scope, $location, $filter, customerService, settlementService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ]; 
            $scope.path = cul.apiPath;
            $scope.data = [];
            $scope.customerNumber = $location.search().customerNumber;



            settlementService.vipReport({ "customerNumber": $scope.customerNumber }, function (result) {
                console.log('result',result);
                $scope.data = result.data;
            });
            //   settlementService.reportList({ "customerNumber": $scope.customerNumber }, function (result) {
            //       $.each(result.data, function (index, item) { item.year = item.reportDate.split("-")[0]; });
            //       var _result = _.groupBy(result.data, function (item) { return item.year; });
            //       for (var key in _result) {
            //           $scope.data.push({ "year": key, "list": _result[key] });
            //       }
            //   });
        }]);
