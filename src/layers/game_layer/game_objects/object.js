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
            base.x = obj && obj.x ? obj.x : 0;
            base.y = obj && obj.y ? obj.y : 0;


            for (var k in obj) {
                base[k] = obj[k];
            }

            base.speed = obj && obj.speed ? obj.speed : 0;
            base.speedX = obj && obj.speedX ? obj.speedX : 0;
            base.speedY = obj && obj.speedY ? obj.speedY : 0;
            base.accelerationX = obj && obj.accelerationX ? obj.accelerationX : 0;
            base.accelerationY = obj && obj.accelerationY ? obj.accelerationY : 0;
            base.mass = obj && obj.mass ? obj.mass : 0;
            base.angle = obj && obj.angle ? obj.angle : 0;
            base.speed_control = obj && obj.speed_control ? obj.speed_control : 0;
            base.accel_jet = obj && obj.accel_jet ? obj.accel_jet : 0;
            base.radius = obj && obj.radius ? obj.radius : 50;
            base.offsetx = obj && obj.offsetx ? obj.offsetx : 50;
            base.offsety = obj && obj.offsety ? obj.offsety : 50;


            base.layer = layer;
            base.active_planets = [];

            base.forces = [];
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
                x: Math.round(base.x - base.layer.camera.x) * base.layer.camera.zoom,
                y: Math.round(base.y - base.layer.camera.y) * base.layer.camera.zoom
            };
        },
        distanceTo: function (object) {
            var base = this;
            var x = (base.x - object.x);
            var y = (base.y - object.y);
            var distance = Math.sqrt(x * x + y * y);
            return distance;
        },
        gravityTo: function (object) {
            var base = this;
            var distance = base.distanceTo(object);
            if (distance > 20 + object.radius) {
                var coeff = distance / 100;
            } else {
                var coeff = distance * distance * 100;
            }
            var force = 0.8 * (base.mass + object.mass);


            return force;
        },
        unitVectorTo: function (object) {
            var base = this;
            var x = (base.x - object.x);
            var y = (base.y - object.y);
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
            return Math.sqrt(base.speedX * base.speedX + base.speedY * base.speedY);
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

//                var active_planet = distance < base.radius + 500 || object.closest_planet.distanceTo(base) < 1000 &&
//                    (distance < base.radius + 500 || object.closest_distance < object.closest_planet.radius + 500);

                var active_planet = distance < base.radius + base.grav_influence;

//                if (active_planet && !layer.inputs_engine.keyPressed(192)) {
//                    var angle = Math.atan(tangent.y / tangent.x);
//                    object.addAngle(angle, 1 / distance);
//                    object.addCenter({
//                        x: base.x,
//                        y: base.y
//                    });
//                }

                if (active_planet) {
                    object.active_planets.push(base);

                    if (base.radius >= distance) {
                        addx = 0;
                        addy = 0;
                    }

                    object.accelerationX += addx;
                    object.accelerationY += addy;

                    base.forces.push({
                        x: addx,
                        y: addy
                    });
                    base.active = true;
                }
            }
        }
    });

    return Obj;
});