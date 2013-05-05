define([
    'class'
], function (Class) {
    var Object = new Class();

    Object.extend({
        x: 0,
        y: 0
    });
    Object.include({
        init: function (x, y) {
            var base = this;
            if (x !== undefined && y != undefined) {
                base.x = x;
                base.y = y;
            }
        },
        draw: function (game) {

        },
        physics: function (game) {

        }
    });

    return Object;
});