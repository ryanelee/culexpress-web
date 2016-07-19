'use strict';

angular
    .module('culwebApp')
    .controller('ProductEditCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'SweetAlert',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, SweetAlert) {
            $scope.wizardOptions = {
                verified: true,
                mode: 'disable',
                nextText: '下一步',
                prevText: '上一步',
                submitText: '提交'
            }

            $scope.wizardValid = function (index, step) {

            }

        }])