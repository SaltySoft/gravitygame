define([
    'class'
], function (Class) {
    var Obj = Class.create();

    Obj.extend({
        x: 0,
        y: 0
    });
    Obj.include({
        init: function (x, y) {
            var base = this;
            if (x !== undefined && y != undefined) {
                base.x = x;
                base.y = y;
            } else {
                base.x = 0;
                base.y = 0;
            }
        },
        logic: function () {

        },
        draw: function (gengine) {

        },
        physics: function (layer) {

        }
    });

    return Obj;
});