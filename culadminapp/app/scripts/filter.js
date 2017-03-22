angular.module('warehourseFilters', []).filter('adviceStatus', function () {
    var adviceStatus = {
        "1": "待反馈",
        "2": "已反馈"
    };
    return function (input) {
        return adviceStatus[input] || input;
    };
}).filter('_sendType', function () {
    var sendType = {
        "1": "大客户",
        "2": "海淘客户"
    };
    return function (input) {
        return sendType[input] || input;
    };
}).filter('webType', function () {
    var _webType = {
        1: "登入广告",
        2: "普通公告",
        3: "促销活动"
    };
    return function (input) {
        return _webType[input] || input;
    };
}).filter('webstatus', function () {
    var _webstatus = {
        0: "禁用",
        1: "启用"
    };
    return function (input) {
        return _webstatus[input] || input;
    };
}).filter('webopenAll', function () {
    var _webopenAll = {
        0: "所有可见",
        1: "登录后可见"
    };
    return function (input) {
        return _webType[input] || input;
    };
}).filter('_orderStatus', function () {
    var orderStatus = {
        "Canceled": "取消",
        "Unpaid": "未支付",
        "Paid": "已支付",
        "Processing": "处理中",
        "Arrears": "签出",
        "Shipped": "已出库",
        "Arrived": "已送达",
        "Void": "已删除",
        "PartialShipped": "部分出库"
    };
    return function (input) {
        return orderStatus[input] || input;
    };
}).filter('_shipService', function () {
    var orderStatus = {
        "1": "标准包裹服务",
        "3": "特快服务A",
        "4": "特快服务B",
        "5": "标准邮寄服务A",
        "6": "标准邮寄服务B",
        "7": "标准邮寄服务C",
        "8": "身份证渠道",
        "9": "美国邮政 USPS特快",
        "10": "美国邮政USPS PRIORITY MAIL"
    };
    return function (input) {
        return orderStatus[input] || input;
    };
}).filter('_question', function () {
    var question = {
        "Closed": "已关闭",
        "Processing": "待处理",
        "ForwardWH": "转交仓库"
    };
    return function (input) {
        return question[input] || input;
    };
}).filter('cutText', function(){
    return function (value, wordwise, max ,tail) {
        if(!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise){
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1){
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' ...');
    }
});

// angular.module('ngFilters').filter('cutText', function(){
//     return function (value, wordwise, max ,tail) {
//         if(!value) return '';

//         max = parseInt(max, 10);
//         if (!max) return value;
//         if (value.length <= max) return value;

//         value = value.substr(0, max);
//         if (wordwise){
//             var lastspace = value.lastIndexOf(' ');
//             if (lastspace != -1){
//                 if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
//                     lastspace = lastspace - 1;
//                 }
//                 value = value.substr(0, lastspace);
//             }
//         }

//         return value + (tail || ' ...');
//     }
// });

