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
                x: Math.round(base.traits.x - base.layer.camera.x) * base.layer.camera.zoom,
                y: Math.round(base.traits.y - base.layer.camera.y) * base.layer.camera.zoom
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
            if (distance < 500) {
                var coeff = (200 * (distance / 500))
            } else {
                var coeff = 200;
            }
            var force = (0.9 * base.traits.mass + object.traits.mass) / coeff;
            return force;
        },
        unitVectorTo: function (object) {
            var base = this;
            var x = (base.traits.x - object.traits.x);
            var y = (base.traits.y - object.traits.y);
            var unitx = x / Math.sqrt(x * x + y * y);
            var unity = y / Math.sqrt(x * x + y * y);
            return {
                x: unitx,
                y: unity
            };
        },
        unitVectorToVector: function (vector) {
            var base = this;
            var x = (base.traits.x - vector.x);
            var y = (base.traits.y - vector.y);
            var unitx = x / Math.sqrt(x * x + y * y);
            var unity = y / Math.sqrt(x * x + y * y);
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
        },
        getSpeed: function () {
            var base = this;
            return Math.sqrt(base.traits.speedX * base.traits.speedX + base.traits.speedY * base.traits.speedY);
        },
        calcSpeed: function (speedX, speedY) {
            return Math.sqrt(speedX * speedX + speedY * speedY);
        }
    });

    return Obj;
});