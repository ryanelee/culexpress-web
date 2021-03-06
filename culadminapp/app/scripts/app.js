'use strict';

/**
 * @ngdoc overview
 * @name culAdminApp
 * @description
 * # culAdminApp
 *
 * Main module of the application.
 */
angular
    .module('culAdminApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        "ui.bootstrap",
        'warehourseFilters',
        'ui.select',
        'ngSanitize'
    ])
    .config(["$routeProvider", function($routeProvider) {
        $routeProvider
            .when('/', {
                cache: false,
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/templates/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/invoice', {
                templateUrl: 'views/templates/invoice.html',
                controller: 'InvoiceCtrl'
            })
            .when('/knowledgebase', {
                templateUrl: 'views/templates/knowledgebase.html',
                controller: 'KnowledgebaseCtrl'
            })
            .when('/inbox', {
                templateUrl: 'views/templates/inbox.html',
                controller: 'InboxCtrl'
            })
            .when('/warehouse/dashboard', {
                templateUrl: 'views/warehouse/dashboard.html',
                controller: 'WarehouseDashboardCtrl'
            })
            .when('/warehouse/receipt', {
                templateUrl: 'views/warehouse/receipt.html',
                controller: 'ReceiptCtrl'
            })
            .when('/warehouse/receipt2', {
                templateUrl: 'views/warehouse/receipt2.html',
                controller: 'Receipt2Ctrl'
            })
              .when('/warehouse/deleteReceiptLog', {
                templateUrl: 'views/warehouse/deleteReceiptLog.html',
                controller: 'DeleteReceiptLogCtrl'
            })
            .when('/warehouse/receiptNoASN', {
                templateUrl: 'views/warehouse/receiptNoASN.html',
                controller: 'ReceiptNoASNCtrl'
            })
            .when('/warehouse/receiptedit2', {
                templateUrl: 'views/warehouse/receiptedit2.html',
                controller: 'ReceiptEdit2Ctrl'
            })
            .when('/warehouse/receiptdetail2', {
                templateUrl: 'views/warehouse/receiptdetail2.html',
                controller: 'ReceiptDetail2Ctrl'
            })
            .when('/warehouse/receiptcheck2', {
                templateUrl: 'views/warehouse/receiptcheck2.html',
                controller: 'ReceiptCheck2Ctrl'
            })
            .when('/warehouse/receiptexception', {
                templateUrl: 'views/warehouse/receiptexception.html',
                controller: 'ReceiptExceptionCtrl'
            })
            .when('/warehouse/receiptexceptionedit', {
                templateUrl: 'views/warehouse/receiptexceptionedit.html',
                controller: 'ReceiptExceptionEditCtrl'
            })
            .when('/warehouse/receiptstaff', {
                templateUrl: 'views/warehouse/receiptstaff.html',
                controller: 'ReceiptStaffCtrl'
            })
            .when('/warehouse/receiptexceptiondetail', {
                templateUrl: 'views/warehouse/receiptexceptiondetail.html',
                controller: 'ReceiptExceptionDetailCtrl'
            })
            .when('/warehouse/editreceipt', {
                templateUrl: 'views/warehouse/editreceipt.html',
                controller: 'EditReceiptCtrl'
            }) 
            .when('/warehouse/shelf', {
                templateUrl: 'views/warehouse/shelf.html',
                controller: 'WarehouseShelfCtrl'
            })
            .when('/warehouse/shelfdetail', {
                templateUrl: 'views/warehouse/shelfdetail.html',
                controller: 'WarehouseShelfDetailCtrl'
            })
            .when('/warehouse/onshelf', {
                templateUrl: 'views/warehouse/onshelf.html',
                controller: 'WarehouseOnShelfCtrl'
            })
            .when('/warehouse/onshelfdetail', {
                templateUrl: 'views/warehouse/onshelfdetail.html',
                controller: 'WarehouseOnShelfDetailCtrl'
            })
            .when('/warehouse/onshelfdetailbatch', {
                templateUrl: 'views/warehouse/onshelfdetailbatch.html',
                controller: 'WarehouseOnShelfDetailBatchCtrl'
            })
            .when('/warehouse/shelfmanagement', {
                templateUrl: 'views/warehouse/shelfmanagement.html',
                controller: 'WarehouseShelfManagementCtrl'
            })
            .when('/warehouse/shelfmanagementcreate', {
                templateUrl: 'views/warehouse/shelfmanagementcreate.html',
                controller: 'WarehouseShelfManagementCreateCtrl'
            })
            .when('/warehouse/shelfmanagementdetail', {
                templateUrl: 'views/warehouse/shelfmanagementdetail.html',
                controller: 'WarehouseShelfManagementDetailCtrl'
            })
            .when('/warehouse/bucket', {
                templateUrl: 'views/warehouse/bucket.html',
                controller: 'WarehouseBucketCtrl'
            })
            .when('/warehouse/bucketedit', {
                templateUrl: 'views/warehouse/bucketedit.html',
                controller: 'WarehouseBucketEditCtrl'
            })
            //.when('/warehouse/editshelf', {
            //    templateUrl: 'views/warehouse/editshelf.html',
            //    controller: 'WarehouseEditshelfCtrl'
            //})
            .when('/warehouse/inventory', {
                templateUrl: 'views/warehouse/inventory.html',
                controller: 'WarehouseInventoryCtrl'
            })
            .when('/warehouse/inventoryTime', {
                templateUrl: 'views/warehouse/inventoryTime.html',
                controller: 'InventoryTimeCtrl'
            })


            .when('/warehouse/inventorycheck', {
                templateUrl: 'views/warehouse/inventorycheck.html',
                controller: 'WarehouseInventoryCheckCtrl'
            })

            
            .when('/warehouse/inventoryloglist', {
                templateUrl: 'views/warehouse/inventoryloglist.html',
                controller: 'WarehouseInventoryLogListCtrl'
            })
            .when('/warehouse/inventoryfrozen', {
                templateUrl: 'views/warehouse/inventoryfrozen.html',
                controller: 'WarehouseInventoryFrozenCtrl'
            })
            .when('/warehouse/inventoryadjust', {
                templateUrl: 'views/warehouse/inventoryadjust.html',
                controller: 'WarehouseInventoryAdjustCtrl'
            })
            .when('/warehouse/inventoryadjustweight', {
                templateUrl: 'views/warehouse/inventoryadjustweight.html',
                controller: 'WarehouseInventoryAdjustWeightCtrl'
            })
            .when('/warehouse/inventorydetail', {
                templateUrl: 'views/warehouse/inventorydetail.html',
                controller: 'WarehouseInventoryDetailCtrl'
            })
            .when('/warehouse/picking', {
                templateUrl: 'views/warehouse/picking.html',
                controller: 'WarehousePickingCtrl'
            })
            .when('/warehouse/editpicking', {
                templateUrl: 'views/warehouse/editpicking.html',
                controller: 'WarehouseEditpickingCtrl'
            })
            .when('/warehouse/package', {
                templateUrl: 'views/warehouse/package.html',
                controller: 'WarehousePackageCtrl'
            })

            .when('/warehouse/editpackage', {
                templateUrl: 'views/warehouse/editpackage.html',
                controller: 'WarehouseEditpackageCtrl'
            })
            .when('/warehouse/registerpackageonline', {
                templateUrl: 'views/warehouse/registerpackageonline.html',
                controller: 'RegisterPackageOnlineCtrl'
            })
            .when('/warehouse/registerpackageoffline', {
                templateUrl: 'views/warehouse/registerpackageoffline.html',
                controller: 'RegisterPackageOfflineCtrl'
            })
            .when('/warehouse/shipping', {
                templateUrl: 'views/warehouse/shipping.html',
                controller: 'WarehouseShippingCtrl'
            })
            .when('/warehouse/editshipping', {
                templateUrl: 'views/warehouse/editshipping.html',
                controller: 'WarehouseEditshippingCtrl'
            })
            .when('/customer/customerdetail', {
                templateUrl: 'views/customer/customerdetail.html',
                controller: 'CustomerDetailCtrl'
            })
            .when('/customer/customermessage', {
                templateUrl: 'views/customer/customermessage.html',
                controller: 'CustomerMessageCtrl'
            })
            .when('/customer/customerlist', {
                templateUrl: 'views/customer/customerlist.html',
                controller: 'CustomerListCtrl'
            })
            .when('/customer/dashboard', {
                templateUrl: 'views/customer/dashboard.html',
                controller: 'CustomerDashboardCtrl'
            })
            .when('/customer/addresslist', {
                templateUrl: 'views/customer/addresslist.html',
                controller: 'AddressListCtrl'
            })
            .when('/customer/addressdetail', {
                templateUrl: 'views/customer/addressdetail.html',
                controller: 'AddressDetailCtrl'
            })
               .when('/customer/twAddressdetail', {
                templateUrl: 'views/customer/twAddressdetail.html',
                controller: 'TwAddressDetailCtrl'
            })
            .when('/customer/faqmanagement', {
                templateUrl: 'views/customer/faqmanagement.html',
                controller: 'FAQManagementCtrl'
            })
            .when('/customer/messagelist', {
                templateUrl: 'views/customer/messagelist.html',
                controller: 'MessageListCtrl'
            })
            .when('/customer/faqdetail', {
                templateUrl: 'views/customer/faqdetail.html',
                controller: 'FAQDetailCtrl'
            })
            .when('/customer/arrearslist', {
                templateUrl: 'views/customer/arrearslist.html',
                controller: 'ArrearslistCtrl'
            })
            .when('/customer/paydetail', {
                templateUrl: 'views/customer/paydetail.html',
                controller: 'PayDetailCtrl'
            })
            .when('/customer/idauth', {
                templateUrl: 'views/customer/idauth.html',
                controller: 'IdAuthCtrl'
            })
            .when('/customer/idauthcul', {
                templateUrl: 'views/customer/idauth-cul.html',
                controller: 'IdAuthCulCtrl'
            })
            .when('/customer/idauthtw', {
                templateUrl: 'views/customer/idauth-tw.html',
                controller: 'IdAuthTwCtrl'
            })
            .when('/order/orderlist', {
                templateUrl: 'views/order/orderlist.html',
                controller: 'OrderListCtrl'
            })
            .when('/order/orderexport', {
                templateUrl: 'views/order/orderexport.html',
                controller: 'OrderExportCtrl'
            })
            .when('/order/orderprint', {
                templateUrl: 'views/order/orderprint.html',
                controller: 'OrderPrintCtrl'
            })
            .when('/order/orderdetail', {
                templateUrl: 'views/order/orderdetail.html',
                controller: 'OrderDetailCtrl'
            })
            .when('/order/orderofflineimport', {
                templateUrl: 'views/order/orderofflineimport.html',
                controller: 'OrderOfflineImportCtrl'
            })
            .when('/order/orderpackagebatchupdate', {
                templateUrl: 'views/order/orderpackagebatchupdate.html',
                controller: 'OrderPackageBatchUpdateCtrl'
            })
            .when('/order/ordertrackbatchupdate', {
                templateUrl: 'views/order/ordertrackbatchupdate.html',
                controller: 'OrderTrackBatchUpdateCtrl'
            })
            .when('/order/ordercomments', {
                templateUrl: 'views/order/ordercomments.html',
                controller: 'OrderCommentsCtrl'
            })
            .when('/order/ordercommentsdetail', {
                templateUrl: 'views/order/ordercommentsdetail.html',
                controller: 'OrderCommentsDetailCtrl'
            })
            .when('/finance/financelist', {
                templateUrl: 'views/finance/financelist.html',
                controller: 'FinanceListCtrl'
            })
            .when('/finance/warehousePay', {
                templateUrl: 'views/finance/finance-warehouse-pay.html',
                controller: 'FinanceWarehousePayCtrl'
            })

            .when('/finance/financedetail', {
                templateUrl: 'views/finance/financedetail.html',
                controller: 'FinanceDetailCtrl'
            })
            .when('/finance/financedetail/pay', {
                templateUrl: 'views/finance/financedetail-pay.html',
                controller: 'FinanceDetailPayCtrl'
            })
            .when('/finance/financedetail/recharge', {
                templateUrl: 'views/finance/financedetail-rechange.html',
                controller: 'FinanceDetailRechangeCtrl'
            })
            .when('/finance/arriveCount', { //入库统计
                templateUrl: 'views/finance/arrivecount.html',
                controller: 'ArriveCountCtrl'
            })
            .when('/finance/financeout', { //出库统计
                templateUrl: 'views/finance/finance-out.html',
                controller: 'FinanceOutCtrl'
            })
            .when('/finance/financetotal', { //财务总计
                templateUrl: 'views/finance/finance-total.html',
                controller: 'FinanceTotalCtrl'
            })
            .when('/finance/financerecord', { //消费统计记录
                templateUrl: 'views/finance/finance-record.html',
                controller: 'FinanceRecordCtrl'
            })
            .when('/finance/deletelist', { //删货统计
                templateUrl: 'views/finance/deletelist.html',
                controller: 'DeleteListCtrl'
            })
            .when('/finance/pointlog', { //调分记录
                templateUrl: 'views/finance/finance-pointlog.html',
                controller: 'PointLogCtrl'
            })
            .when('/finance/refundlist', { //返还运费
                templateUrl: 'views/finance/refundshipping-verify.html',
                controller: 'RefundShippingVerifyCtl'
            })
            .when('/finance/customerwithdraw', { //返还运费
                templateUrl: 'views/finance/customer-withdrawRequest.html',
                controller: 'CustomerWithdrawCtl'
            })
            .when('/system/operationloglist', {
                templateUrl: 'views/system/operationloglist.html',
                controller: 'SystemOperationLogListCtrl'
            })
            .when('/system/loginloglist', {
                templateUrl: 'views/system/loginloglist.html',
                controller: 'SystemLoginLogListCtrl'
            })
            .when('/system/rolelist', {
                templateUrl: 'views/system/rolelist.html',
                controller: 'SysRoleListCtrl'
            })
            .when('/system/warehouselist', {
                templateUrl: 'views/system/warehouselist.html',
                controller: 'WarehouseListCtrl'
            })
            .when('/system/editwarehouse', {
                templateUrl: 'views/system/editwarehouse.html',
                controller: 'EditWarehouseCtrl'
            })
            .when('/system/editrole', {
                templateUrl: 'views/system/editrole.html',
                controller: 'SysRoleEditCtrl'
            })
            .when('/system/usergrouplist', {
                templateUrl: 'views/system/usergrouplist.html',
                controller: 'SysUserGroupListCtrl'
            })
            .when('/system/uglist', {
                templateUrl: 'views/system/uglist.html',
                controller: 'UGListCtrl'
            })
            .when('/system/editusergroup', {
                templateUrl: 'views/system/editusergroup.html',
                controller: 'SysUserGroupEditCtrl'
            })
            .when('/system/userlist', {
                templateUrl: 'views/system/userlist.html',
                controller: 'UserListCtrl'
            })
            .when('/system/edituser', {
                templateUrl: 'views/system/edituser.html',
                controller: 'UserEditCtrl'
            })
            .when('/system/categerylist', {
                templateUrl: 'views/system/categerylist.html',
                controller: 'CategerylistCtrl'
            })
            .when('/system/maincategerylist', {
                templateUrl: 'views/system/maincategerylist.html',
                controller: 'MainCategerylistCtrl'
            })
            .when('/system/editcategery', {
                templateUrl: 'views/system/editcategery.html',
                controller: 'EditCategeryCtrl'
            })
            .when('/system/channelist', {
                templateUrl: 'views/system/channelist.html',
                controller: 'ChannelCtrl'
            })
            .when('/system/editchannel', {
                templateUrl: 'views/system/editchannel.html',
                controller: 'ChannelEditCtrl'
            })
            .when('/system/shipservicelist', {
                templateUrl: 'views/system/shipservicelist.html',
                controller: 'ShipserviceCtrl'
            })
            .when('/system/editshipservice', {
                templateUrl: 'views/system/editshipservice.html',
                controller: 'ShipserviceEditCtrl'
            })
            .when('/web/announce', {
                templateUrl: 'views/web/announce.html',
                controller: 'AnnounceCtrl'
            })
            .when('/web/newAnnounce', { //新增布告
                templateUrl: 'views/web/new-announce.html',
                controller: 'AnnounceCtrl'
            })
            .when('/web/updateAnnounce', { //更新布告
                templateUrl: 'views/web/new-announce.html',
                controller: 'UpdateAnnounceCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(["$rootScope", "$location", "userService", function($rootScope, $location, userService) {
        $rootScope.userInfo = userService.getUserInfo();
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.$emit('changeMenu');
            ga("send", "pageview", { page: $location.path() });
        })
    }]);