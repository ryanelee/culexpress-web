/*!
* jquery.counterup.js 1.0
*
* Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
* Released under the GPL v2 License
*
* Date: Nov 26, 2013
*/

//加法      
function FloatAdd(arg1, arg2) { var r1, r2, m; try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 } try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 } m = Math.pow(10, Math.max(r1, r2)); return (arg1 * m + arg2 * m) / m; }
//减法      
function FloatSub(arg1, arg2) {
    var r1, r2, m, n; try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 } try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 } m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度         
    n = (r1 >= r2) ? r1 : r2; return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//乘法      
function FloatMul(arg1, arg2) { var m = 0, s1 = arg1.toString(), s2 = arg2.toString(); try { m += s1.split(".")[1].length } catch (e) { } try { m += s2.split(".")[1].length } catch (e) { } return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m); }
//除法     
function FloatDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2; try { t1 = arg1.toString().split(".")[1].length } catch (e) { } try { t2 = arg2.toString().split(".")[1].length } catch (e) { } with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", "")); return (r1 / r2) * pow(10, t2 - t1);
    }
}

(function ($) {
    "use strict";

    $.fn.counterUp = function (options) {

        // Defaults
        var settings = $.extend({
            'time': 400,
            'delay': 10
        }, options);

        return this.each(function () {

            // Store the object
            var $this = $(this);
            var $settings = settings;

            var counterUpper = function () {
                var nums = [];
                var divisions = $settings.time / $settings.delay;
                var num = $this.text();
                var isComma = /[0-9]+,[0-9]+/.test(num);
                num = num.replace(/,/g, '');
                var isInt = /^[0-9]+$/.test(num);
                var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
                var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

                // Generate list of incremental numbers to display
                for (var i = divisions; i >= 1; i--) {

                    // Preserve as int if input was int
                    var newNum = parseInt(Math.round(num / divisions * i));

                    // Preserve float if input was float
                    if (isFloat) {
                        newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
                    }

                    // Preserve commas if input had commas
                    if (isComma) {
                        while (/(\d+)(\d{3})/.test(newNum.toString())) {
                            newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                        }
                    }

                    nums.unshift(newNum);
                }
                $this.data('counterup-nums', nums);
                $this.text('0');

                // Updates the number until we're done
                var f = function () {
                    $this.text($this.data('counterup-nums').shift());
                    if ($this.data('counterup-nums').length) {
                        setTimeout($this.data('counterup-func'), $settings.delay);
                    } else {
                        delete $this.data('counterup-nums');
                        $this.data('counterup-nums', null);
                        $this.data('counterup-func', null);
                    }
                };
                $this.data('counterup-func', f);

                // Start the count up
                setTimeout($this.data('counterup-func'), $settings.delay);
            };

            // Perform counts when the element gets into view
            $this.waypoint(counterUpper, { offset: '100%', triggerOnce: true });
        });

    };

})(jQuery);