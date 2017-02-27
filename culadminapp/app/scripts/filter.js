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
