define([
    'class'
], function (Class) {
    var Obj = Class.create();

    Obj.extend({
        x: 0,
        y: 0
    });
    Obj.include({
        init: function (layer, obj) {
            var base = this;
            base.traits = {
                x: obj.x ? obj.x : 0,
                y: obj.y ? obj.y : 0
            };
            base.layer = layer;
        },
        logic: function () {

        },
        draw: function (gengine) {

        },
        physics: function (layer) {

        },
        getScreenPos: function () {
            var base = this;
            return {
                x: Math.round(base.traits.x - base.layer.camera.x),
                y: Math.round(base.traits.y - base.layer.camera.y)
            };
        }
    });

    return Obj;
});