define([
    'jquery',
    'class',
    './object'
], function ($, Class, Obj) {
    var Player = Obj.create();

    Player.extend({
        states: {
            FLYING: 0,
            WALKING: 1
        }
    });

    Player.include({

        init: function (layer, obj) {
            var base = this;
            $.proxy(base.father.init, base)(layer, obj);
            base.radius = 10;
            console.log(base);
            base.inverse = false;
            base.angle_count = 0;
            base.angle_sum = 0;
            base.running = false;
            base.current_planet = undefined;
            base.state = Player.states.FLYING;
            base.angle_correction = false;
            base.center = {
                x: undefined,
                y: undefined
            };
            base.center_count = 0;

            if (obj !== undefined && obj.x !== undefined && obj.y !== undefined) {
                base.x = obj.x;
                base.y = obj.y;
            }
            base.just_inversed = false;
        },
        addAngle: function (angle, weight) {
            var base = this;
            weight *= weight * weight;
            base.angle_sum += angle * weight;
            base.angle_count += weight;
        },
        addCenter: function (vector, weight) {
            var base = this;
            if (base.center.x == undefined) {
                base.center.x = 0;
                base.center.y = 0;
            }

            base.center.x += vector.x;
            base.center.y += vector.y;
            base.center_count += 1;
        },
        logic: function (layer) {
            var base = this;
            base.inputs = layer.inputs_engine;

            base.accelOffsetX = 0;
            base.accelOffsetY = 0;

            if (base.inputs.keyPressed(87)) {
                base.running = true;
                base.accel_jet = 0.15;
            }
            else if (base.inputs.keyPressed(83)) {
                base.running = true;
                base.accel_jet = -0.15;
            }
            else {
                base.running = false;
                base.accel_jet = 0;
            }


            if (base.inputs.keyPressed(69)) {
                base.angle += 0.2;
            }
            if (base.inputs.keyPressed(81)) {
                base.angle -= 0.2;
            }

            if (base.inputs.keyPressed(49)) {
                if (!base.just_inversed)
                    base.inverse = !base.inverse;
                base.just_inversed = true;
            } else {
                base.just_inversed = false;
            }

            if (base.inputs.buttonPressed(1)) {
                base.mouse_angle = true;
            } else {
                base.mouse_angle = false;
            }
            base.closest_distance = -1;


        },
        draw: function (gengine) {
            var base = this;
            gengine.drawCircle({
                x: base.x,
                y: base.y,
                radius: base.radius,
                angle: base.angle,
                fill_style: "white"
            });
            var screen_pos = base;

            gengine.beginPath();
            gengine.moveTo({x: screen_pos.x, y: screen_pos.y});
            gengine.lineTo({
                x: screen_pos.x + base.accelerationX * 1000,
                y: screen_pos.y + base.accelerationY * 1000
            }, "blue", 2);
            gengine.closePath();
            gengine.beginPath();
            gengine.moveTo({x: screen_pos.x, y: screen_pos.y});
            gengine.lineTo({
                x: screen_pos.x + base.speedX * 20,
                y: screen_pos.y + base.speedY * 20
            }, "green", 2);
            gengine.closePath();


            base.forces = [];

            base.accelerationX = 0;
            base.accelerationY = 0;
        },

        physics: function (layer) {
            var base = this;
            for (var k in layer.planets) {
                var distance = base.distanceTo(layer.planets[k]);
                if (distance < base.closest_distance || base.closest_distance == -1) {
                    base.closest_distance = distance;
                    base.closest_planet = layer.planets[k];
                }
            }

            for (var k in layer.planets) {
                base.interractWith(layer, layer.planets[k]);
            }

            if (base.mouse_angle) {
                var inputs = layer.inputs_engine;
                var vector = {
                    x: (inputs.mouse_position.x / layer.camera.zoom + layer.camera.x),
                    y: (inputs.mouse_position.y / layer.camera.zoom + layer.camera.y)
                }
                var unit = base.unitVectorTo(vector);
                var angle = Math.atan(-unit.x / unit.y);
                base.angle = angle;
                if (unit.y < 0)
                    base.angle += Math.PI;
                if (-unit.x < 0)
                    base.angle += 2 * Math.PI;
                if (base.inverse)
                    base.angle += Math.PI;
            } else if (base.distanceTo(base.closest_planet) > base.closest_planet.radius + 50 && base.getSpeed() != 0) {

                base.angle = Math.atan(base.speedY / base.speedX);
                if (base.speedX < 0)
                    base.angle += Math.PI;
                if (base.speedY < 0)
                    base.angle += 2 * Math.PI;
            } else {
                base.center.x /= base.center_count;
                base.center.y /= base.center_count;
                if (base.center.x) {
                    var unit = base.unitVectorTo(base.closest_planet);
                    var angle = Math.atan(-unit.x / unit.y);
                    base.angle = angle;
                    if (unit.y < 0)
                        base.angle += Math.PI;
                    if (-unit.x < 0)
                        base.angle += 2 * Math.PI;
                    if (base.inverse)
                        base.angle += Math.PI;
                }
            }


            base.speedX += base.accelerationX + Math.cos(base.angle) * base.accel_jet;
            base.speedY += base.accelerationY + Math.sin(base.angle) * base.accel_jet;


            base.x += base.speedX + base.offsetx;
            base.y += base.speedY + base.offsety;

            if (base.closest_planet) {
                var distance = base.distanceTo(base.closest_planet);
                if (distance < base.closest_planet.radius) {
                    var unit = base.unitVectorTo(base.closest_planet);
                    base.x += (base.closest_planet.radius - distance) * unit.x;
                    base.y += (base.closest_planet.radius - distance) * unit.y;
                }
            }

            base.offsetx = 0;
            base.offsety = 0;
            base.angle_count = 0;
            base.center = {
                x: 0,
                y: 0
            };
            base.center_count = 0;
            base.angle_sum = 0;
            base.angle_correction = false;
            base.closest_distance = -1;
        }
    });

    return Player;
});