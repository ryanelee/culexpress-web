'use strict';

/**
 * @ngdoc service
 * @name culwebApp.addressSvr
 * @description
 * # addressSvr
 * Service in the culwebApp.
 */
angular.module('culwebApp')
    .service('addressSvr', ['$http', function ($http) {
        var self = this;

        self.submitAddresInfo = function (addresInfo) {
            return $http.post(cul.apiPath + '/receiveaddress', {
                customerNumber: addresInfo.customerNumber,
                receiveCompanyName: addresInfo.receiveCompanyName,
                emailAddress: addresInfo.emailAddress,
                receivePersonName: addresInfo.receivePersonName,
                cellphoneNumber: addresInfo.cellphoneNumber,
                address1: addresInfo.address1,
                address2: addresInfo.address2 || '',
                city: addresInfo.city,
                area: addresInfo.area,
                zipcode: addresInfo.zipcode,
                stateOrProvince: addresInfo.stateOrProvince,
                telephoneNumber: addresInfo.telephoneNumber,
                note: addresInfo.note,
                addressType: addresInfo.addressType,
                //countrycode: addresInfo.countrycode || '',
                idCard: addresInfo.idCard || '',
                idCardFront: addresInfo.idCardFront || '',
                idCardBack: addresInfo.idCardBack || '',
                idCardFrontUrl: addresInfo.idCardFrontUrl || '',
                idCardBackUrl: addresInfo.idCardBackUrl || ''
            });
        }

        self.getAddressList = function (index, querPara) {
            return $http.post(cul.apiPath + '/receiveaddress/list', {
                pageInfo: {
                    pageIndex: index || 1,
                    pageSize: 10
                },
                userName: querPara.userName,
                emailAddress: querPara.emailAddress,
                customerNumber: querPara.customerNumber,
                //verifyMark: querPara.verifyMark
            });
        }

        self.getAddressInfo = function (addressKey) {
            return $http.get(cul.apiPath + '/receiveaddress/' + addressKey);
        }
        self.checkAddress = function (obj) {
            return $http.post(cul.apiPath + '/address/checkAddress', obj);
        }
        self.delAddressInfo = function (addressKeysString) {
            return $http.delete(cul.apiPath + '/receiveaddress?number=' + addressKeysString);
        }

        self.updateAddressInfo = function (addressInfo) {
            return $http.put(cul.apiPath + '/receiveaddress', addressInfo);
        }
        self.getDistrict = function (obj) {
            return $http.post(cul.apiPath + '/address/district', obj);
        }

        // AngularJS will instantiate a singleton by calling "new" on this function
    }]);
