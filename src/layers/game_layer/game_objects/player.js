define([
    'class',
    './object'
], function (Class, Obj) {
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
        },
        addAngle: function (angle) {
            var base = this;
            base.angle_sum += angle;
            base.angle_count++;
        },
        addCenter: function (vector) {
            var base = this;
            if (base.center.x == undefined) {
                base.center.x = 0;
                base.center.y = 0;
            }
            base.center.x += vector.x;
            base.center.y += vector.y;
            base.center_count++;
        },
        logic: function (layer) {
            var base = this;
            base.inputs = layer.inputs_engine;

            base.accelOffsetX = 0;
            base.accelOffsetY = 0;

            if (base.inputs.keyPressed(87)) {
                base.running = true;
                base.traits.accel_jet = 0.1;
            }
            else if (base.inputs.keyPressed(83)) {
                base.running = true;
                base.traits.accel_jet = -0.1;
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
            var context = base.layer.game.context;
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.beginPath();
            context.strokeStyle = "black";
            var screen_pos = base.getScreenPos();
            context.moveTo(screen_pos.x, screen_pos.y);
            context.lineTo(screen_pos.x + base.traits.speedX * 10, screen_pos.y + base.traits.speedY * 10);
            context.stroke();
            context.closePath();
            context.beginPath();
            context.moveTo(screen_pos.x, screen_pos.y);
            context.strokeStyle = "blue";
            context.lineTo(screen_pos.x + base.traits.accelerationX * 1000, screen_pos.y + base.traits.accelerationY * 1000);
            context.stroke();
            context.closePath();
            base.traits.accelerationX = 0;
            base.traits.accelerationY = 0;
        },
        physics: function (layer) {
            var base = this;


            if (base.layer.inputs_engine.keyPressed(16) && base.getSpeed() != 0) {

                base.traits.angle = Math.atan(base.traits.speedY / base.traits.speedX);
                if (base.traits.speedX < 0)
                    base.traits.angle += Math.PI;
                if (base.traits.speedY < 0)
                    base.traits.angle += 2 * Math.PI;
            } else {
                base.center.x /= base.center_count;
                base.center.y /= base.center_count;
                if (base.center.x) {
                    var unit = base.unitVectorToVector(base.center);
                    var angle = Math.atan(-unit.x / unit.y);
                    base.traits.angle = angle;
                    if (unit.y < 0)
                        base.traits.angle += Math.PI;
                    if (-unit.x < 0)
                        base.traits.angle += 2 * Math.PI;
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
                } else {
                    console.log("not in planet");
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

        }
    });

    return Player;
});