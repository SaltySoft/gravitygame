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
        distanceToVector: function (vector) {
            var base = this;
            var x = (base.traits.x - vector.x);
            var y = (base.traits.y - vector.y);
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
        },
        interractWith: function (layer, obj) {

            var object = this;
            var base = obj;
            var distance = base.distanceTo(object);
            if (!layer.inputs_engine.keyPressed(32)) {
                var force = base.gravityTo(object);
                var unit = base.unitVectorTo(object);
                var unitx = unit.x;
                var unity = unit.y;

                var g = base.gravityVectorTo(object);
                var addx = g.x;
                var addy = g.y;

                var screen_pos = object.getScreenPos();
                var lineto = {
                    x: Math.round(screen_pos.x + (force * unitx) * 10000),
                    y: Math.round(screen_pos.y + (force * unity) * 10000)
                };

                base.forceLine = {
                    origin: screen_pos,
                    dest: lineto
                };

                base.unforceLine = {
                    origin: $.extend(true, {}, screen_pos),
                    dest: $.extend(true, {}, lineto)
                };
                var tangent = {
                    x: -unit.y,
                    y: unit.x
                };

                var active_planet = distance < base.traits.radius + 500 ||  object.closest_planet.distanceTo(base) < 1000 &&
                    (distance < base.traits.radius + 500 || object.closest_distance < object.closest_planet.traits.radius + 500);

                if (active_planet && !layer.inputs_engine.keyPressed(192)) {
                    var angle = Math.atan(tangent.y / tangent.x);
                    object.addAngle(angle, 1 / distance);
                    object.addCenter({
                        x: base.traits.x,
                        y: base.traits.y
                    });
                }

                if (active_planet) {
                    object.traits.accelerationX += addx;
                    object.traits.accelerationY += addy
                    if (base.traits.radius + 50 > distance) {
                        object.traits.speedX *= 0.95 + (0.05 * (distance) / (base.traits.radius + 100));
                        object.traits.speedY *= 0.95 + (0.05 * (distance) / (base.traits.radius + 100));
                    }
                }
            }
        }
    });

    return Obj;
});