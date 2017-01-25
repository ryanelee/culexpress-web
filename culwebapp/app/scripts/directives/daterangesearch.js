'use strict';

angular.module('culwebApp')
  .directive('daterangeSearch', ['$rootScope', '$filter', function ($rootScope, $filter) {
      return {
          restrict: 'EAC',
          template: '<div class="form-group"><label>{{label}}：</label>'
          + '<select class="form-control"  ng-model="rangItem" ng-options="rangeItem as rangeItem.text for rangeItem in dateRangeList"></select> '
          + '<a href="javascript:void(0)" ng-click="btnSearch()" class="btn-u bg-color-ffb">{{btnText}}</a></div> ',
          scope: {
              onSearch: '&',
              label: '@',
              btnText: '@'
          },
          link: function ($scope, $element, attrs) {
              var dateNow = new Date(),
                  yearLimit = 4,
                  getRangeDate = function (date, rangeVal) {
                      if (!rangeVal) rangeVal = 0;
                      var oneDayMilliseconds = 3600000 * 24,
                          rangeDayMilliseconds = oneDayMilliseconds * rangeVal,
                          newDate = new Date(date.getTime() + rangeDayMilliseconds);
                      return {
                          begin: $filter('date')(newDate, 'yyyy-MM-ddT00:00:00.000') + 'Z',
                          end: date.toISOString()
                      }
                  },
                  dateList = [{
                      key: 'today',
                      text: '今天',
                      range: function () {
                          return getRangeDate(new Date());
                      }
                  },
                  {
                      key: 'last3Day',
                      text: '最近3天',
                      range: function () {
                          return getRangeDate(new Date(), -3);
                      }
                  },
                  {
                      key: 'last7Day',
                      text: '最近7天',
                      range: function () {
                          return getRangeDate(new Date(), -7);
                      }
                  },
                  {
                      key: 'last30Day',
                      text: '最近30天',
                      range: function () {
                          return getRangeDate(new Date(), -30);
                      }
                  },
                  {
                      key: 'last60Day',
                      text: '最近60天',
                      range: function () {
                          return getRangeDate(new Date(), -60);
                      }
                  }];

              if (!!attrs.allowEmpty) {
                  dateList.push({
                      key: 'all',
                      text: '所有预报',
                      range: function () {
                          return {
                              begin: '',
                              end: ''
                          };
                      }
                  })
              }

              if (!!attrs.yearLimit) {
                  yearLimit = parseInt(attrs.yearLimit) || 0;
              }


              for (var i = 0, ii = yearLimit; i < ii; i++) {
                  var yearVal = (dateNow.getFullYear() - i);
                  dateList.push({
                      key: 'year' + yearVal,
                      text: yearVal + '年',
                      range: function () {
                          return getRangeDate(dateNow, i * 365 * -1)
                      }
                  });
              }

              $scope.dateRangeList = dateList;
              $scope.rangItem = dateList[0];

              $scope.btnSearch = function () {
                  var searchHandler = $scope.onSearch();

                  if (searchHandler) {
                      searchHandler($scope.rangItem.range());
                  }
              }
          }
      }

  }]);
