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
            base.layer = layer;
            base.traits = {
                x: 0,
                y: 0,
                speed: 0,
                speedX: 0,
                speedY: 0,
                accelerationX: 0,
                accelerationY: 0,
                mass: 1,
                angle: 0,
                speed_control: 0,
                accel_jet: 0,
                radius: 10,
                offsetx: 0,
                offsety: 0
            };
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
                base.traits.x = obj.x;
                base.traits.y = obj.y;
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
                base.traits.accel_jet = 0.15;
            }
            else if (base.inputs.keyPressed(83)) {
                base.running = true;
                base.traits.accel_jet = -0.15;
            }
            else {
                base.running = false;
                base.traits.accel_jet = 0;
            }


            if (base.inputs.keyPressed(69)) {
                base.traits.angle += 0.2;
            }
            if (base.inputs.keyPressed(81)) {
                base.traits.angle -= 0.2;
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
                x: base.traits.x,
                y: base.traits.y,
                radius: base.traits.radius,
                angle: base.traits.angle,
                fill_style: "white"
            });
            var screen_pos = base.traits;

            gengine.beginPath();
            gengine.moveTo({x: screen_pos.x, y: screen_pos.y});
            gengine.lineTo({
                x: screen_pos.x + base.traits.accelerationX * 1000,
                y: screen_pos.y + base.traits.accelerationY * 1000
            }, "blue", 2);
            gengine.closePath();
            gengine.beginPath();
            gengine.moveTo({x: screen_pos.x, y: screen_pos.y});
            gengine.lineTo({
                x: screen_pos.x + base.traits.speedX * 20,
                y: screen_pos.y + base.traits.speedY * 20
            }, "green", 2);
            gengine.closePath();


            base.forces = [];

            base.traits.accelerationX = 0;
            base.traits.accelerationY = 0;
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
                var unit = base.unitVectorToVector(vector);
                var angle = Math.atan(-unit.x / unit.y);
                base.traits.angle = angle;
                if (unit.y < 0)
                    base.traits.angle += Math.PI;
                if (-unit.x < 0)
                    base.traits.angle += 2 * Math.PI;
                if (base.inverse)
                    base.traits.angle += Math.PI;
            } else if (base.distanceTo(base.closest_planet) > base.closest_planet.traits.radius + 50 && base.getSpeed() != 0) {

                base.traits.angle = Math.atan(base.traits.speedY / base.traits.speedX);
                if (base.traits.speedX < 0)
                    base.traits.angle += Math.PI;
                if (base.traits.speedY < 0)
                    base.traits.angle += 2 * Math.PI;
            } else {
                base.center.x /= base.center_count;
                base.center.y /= base.center_count;
                if (base.center.x) {
                    var unit = base.unitVectorTo(base.closest_planet);
                    var angle = Math.atan(-unit.x / unit.y);
                    base.traits.angle = angle;
                    if (unit.y < 0)
                        base.traits.angle += Math.PI;
                    if (-unit.x < 0)
                        base.traits.angle += 2 * Math.PI;
                    if (base.inverse)
                        base.traits.angle += Math.PI;
                }
            }


            base.traits.speedX += base.traits.accelerationX + Math.cos(base.traits.angle) * base.traits.accel_jet;
            base.traits.speedY += base.traits.accelerationY + Math.sin(base.traits.angle) * base.traits.accel_jet;


            base.traits.x += base.traits.speedX + base.traits.offsetx;
            base.traits.y += base.traits.speedY + base.traits.offsety;

            if (base.closest_planet) {
                var distance = base.distanceTo(base.closest_planet);
                if (distance < base.closest_planet.traits.radius) {
                    var unit = base.unitVectorTo(base.closest_planet);
                    base.traits.x += (base.closest_planet.traits.radius - distance) * unit.x;
                    base.traits.y += (base.closest_planet.traits.radius - distance) * unit.y;
                }
            }

            base.traits.offsetx = 0;
            base.traits.offsety = 0;
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