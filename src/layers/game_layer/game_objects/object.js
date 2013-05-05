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
        },
        distanceTo: function (object) {
            var base = this;
            var x = (base.traits.x - object.traits.x);
            var y = (base.traits.y - object.traits.y);
            var distance = Math.sqrt(x * x + y * y);
            return distance;
        },
        gravityTo: function (object) {
            var base = this;
            var distance = base.distanceTo(object);
            var force = (base.traits.mass + object.traits.mass) / (distance * distance * 1000);
            return force;
        },
        unitVectorTo: function (object) {
            var base = this;
            var x = (base.traits.x - object.traits.x);
            var y = (base.traits.y - object.traits.y);
            var unitx = x / (x * x + y * y);
            var unity = y / (x * x + y * y);
            return {
                x: unitx,
                y: unity
            };
        },
        gravityVectorTo: function (object) {
            var base = this;
            var unit = base.unitVectorTo(object);
            var force = base.gravityTo(object);
            return  {
                x: unit.x * force,
                y: unit.y * force
            };
        }
    });

    return Obj;
});