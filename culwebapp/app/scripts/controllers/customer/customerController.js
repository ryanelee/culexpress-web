'use strict';

angular
    .module('culwebApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        //commit by clark 取消默认跳转到用户中心，如果不取消会覆盖App.js跳转到首页的定义
        //$urlRouterProvider
        //    .otherwise('customer/myhome');

        $stateProvider
            .state('customer.myhome', {
                url: '/myhome',
                templateUrl: 'views/customer/dashboard.html',
                controller: function () { }
            })
            .state('customer.shippingnotice', {
                url: '/shippingnotice',
                templateUrl: 'views/customer/shippingnotice.html',
                controller: function () { }
            })
            .state('customer.shippingnoticelist', {
                url: '/shippingnoticelist/:status',
                templateUrl: 'views/customer/shippingnoticelist.html',
                controller: function () { }
            })
            .state('customer.myorders', {
                url: '/myorders/:status',
                templateUrl: 'views/customer/order_myorders.html',
                controller: function () { }
            })
            .state('customer.orderdetail', {
                url: '/orderdetail/:id',
                templateUrl: 'views/customer/order_detail.html',
                controller: function () { }
            })
            .state('customer.ordertrack', {
                url: '/ordertrack/:trackNumber',
                templateUrl: 'views/customer/order_track.html',
                controller: function () { }
            })
            .state('customer.ordertracking', {
                url: '/ordertracking/:trackNumber',
                templateUrl: 'views/customer/order_tracking.html',
                controller: function () { }
            })
            .state('customer.orderhistory', {
                url: '/orderhistory',
                templateUrl: 'views/customer/order_orderhistory.html',
                controller: function () { }
            })
            .state('customer.submitorder', {
                url: '/submitorder/:ids',
                templateUrl: 'views/customer/order_submitorder.html',
                controller: function () { }
            })
            .state('customer.myaccount', {
                url: '/myaccount/:anchorid?apply',
                templateUrl: 'views/customer/myaccount.html',
                controller: function () { }
            })
            .state('customer.myaddress', {
                url: '/myaddress/:addressId',
                templateUrl: 'views/customer/myaddress.html',
                controller: function () { }
            })
            .state('customer.myfinance', {
                url: '/myfinance',
                templateUrl: 'views/customer/myfinance.html',
                controller: function () { }
            })
            .state('customer.myfinancedetail', {
                url: '/myfinancedetail/:tabId',
                templateUrl: 'views/customer/myfinancedetail.html',
                controller: function () { }
            })
            .state('customer.myquestions', {
                url: '/myquestions',
                templateUrl: 'views/customer/myquestions.html',
                controller: 'MyQuestionsController'
            })
            .state('customer.askquestion', {
                url: '/askquestion',
                templateUrl: 'views/customer/askquestion.html',
                controller: 'MyQuestionsController'
            })
            .state('customer.questiondetail', {
                url: '/question/:questionid',
                templateUrl: 'views/customer/questiondetail.html',
                controller: 'QuestionDetailCtrl'
            })
            .state('customer.products', {
                url: '/products',
                templateUrl: 'views/products/products.html',
                controller: 'ProductsCtrl'
            })
            .state('customer.productedit', {
                url: '/productedit/:id',
                templateUrl: 'views/products/product_edit.html',
                controller: 'ProductEditCtrl'
            }).
            state('customer.billingreport', {
                url: '/billingreport',
                templateUrl: 'views/billing/report.html',
                controller: 'BillingReportCtrl'
            });



    });