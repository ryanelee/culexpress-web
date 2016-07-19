'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.shippingSvr
 * @description
 * # shippingSvr
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('shippingSvr', function () {
      var mockData = [{
          id: '1',
          transOrderNumber: '20151014D08',
          number: 'IC318',
          userId: 'larryliudai',
          tag: 'LYVJ',
          weight: 1.7,
          ceatetime: '10/15/2015 2:06:29 AM',
          days: 0,
          location: 'DAI',
          custMemo: '',
          memo: ''
      }, {
          id: '2',
          transOrderNumber: '20151014D07',
          number: 'IC318',
          userId: 'larryliudai',
          tag: 'LYVJ',
          weight: 0.9,
          ceatetime: '10/15/2015 2:05:58 AM',
          days: 0,
          location: 'DAI',
          custMemo: '',
          memo: ''
      }, {
          id: '3',
          transOrderNumber: '20151014D06',
          number: 'IC318',
          userId: 'larryliudai',
          tag: 'LYVJ',
          weight: 0.8,
          ceatetime: '10/13/2015 8:03:15 AM',
          days: 0,
          location: 'DAI',
          custMemo: '',
          memo: ''
      }];
      // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;
      self.getShippingList = function (queryData, index, size) {
          var dataList = [];
          var skip = ((index - 1) * size);
          for (var i = skip; i < size + skip; i++) {
              if (i >= mockData.length) {
                  break;
              } else {
                  dataList.push(mockData[i]);
              }
          }
          return { total: mockData.length, list: dataList };
      }
  });