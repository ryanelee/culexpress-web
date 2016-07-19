'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.warehouse/inventorySvr
 * @description
 * # warehouse/inventorySvr
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('inventorySvr', function () {
      var mockData = [{
          id: '1',
          transOrderNumber: '1Z46YW43YW00190570',
          number: 'GX369',
          userId: 'bravura',
          tag: 'KFCF',
          weight: 5.6,
          isChanged: true,
          ceatetime: '10/13/2015 8:04:21 AM',
          days: 0,
          location: 'f6',
          creator: 'OPT',
          memo: ''
      }, {
          id: '2',
          transOrderNumber: '781434431241',
          number: 'AD985',
          userId: 'gulch',
          tag: 'AFXD',
          weight: 14.7,
          isChanged: true,
          ceatetime: '10/13/2015 8:03:52 AM',
          days: 0,
          location: 'f6',
          creator: 'OPT',
          memo: ''
      }, {
          id: '3',
          transOrderNumber: '1ZR450950336732478',
          number: 'BO426',
          userId: 'yuya1987',
          tag: 'CHTN',
          weight: 3.6,
          isChanged: true,
          ceatetime: '10/13/2015 8:03:15 AM',
          days: 0,
          location: 'f5',
          creator: 'OPT',
          memo: ''
      }];
      // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;
      self.getInventoryList = function (queryData, index, size) {
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
