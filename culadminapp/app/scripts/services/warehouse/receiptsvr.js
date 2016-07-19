'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.warehouse/receipt
 * @description
 * # warehouse/receipt
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('receiptSvr', function () {

      var mockData = [{
          id: '1',
          expressCompany: 'USPS',
          expressNumber: '9305520111400942053639',
          number: 'IB872',
          userId: '我们都是好崽崽',
          tag: 'LYEG',
          desc: '运动鞋',
          isChanged: false,
          ceatetime: '10/13/2015 12:58:44 PM',
          memo: ''
      }, {
          id: '2',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '3',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '4',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '5',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '6',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '7',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '8',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '9',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '10',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '11',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '12',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '13',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '14',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '15',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '16',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '17',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }, {
          id: '18',
          expressCompany: 'USPS',
          expressNumber: '9405509699938855243795',
          number: 'GS840',
          userId: 'kingeast',
          tag: 'JYKF',
          desc: '1052931-2',
          isChanged: false,
          ceatetime: '10/13/2015 12:37:16 PM',
          memo: ''
      }, {
          id: '19',
          expressCompany: 'ONTRAC',
          expressNumber: 'C11286135772961',
          number: 'II400',
          userId: 'cangfenglin',
          tag: 'MHVB',
          desc: '婴儿油，勺子，盒子，乳垫',
          isChanged: false,
          ceatetime: '10/13/2015 12:33:31 PM',
          memo: ''
      }];
      // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;
      self.getReceiptList = function (queryData, index, size) {
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
