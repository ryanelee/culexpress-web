angular.module('warehourseFilters', []).filter('adviceStatus', function () {
    var adviceStatus = {
        "1": "待反馈",
        "2": "已反馈"
    };
    return function (input) {
        return adviceStatus[input] || input;
    };
})