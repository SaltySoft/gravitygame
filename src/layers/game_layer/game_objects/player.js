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
                radius : 10,
                offsetx: 0,
                offsety: 0
            };
            base.running = false;
            base.current_planet = undefined;
            base.state = Player.states.FLYING;

            if (obj !== undefined && obj.x !== undefined && obj.y !== undefined) {
                base.traits.x = obj.x;
                base.traits.y = obj.y;
            }
        },
        logic: function (layer) {
            var base = this;
            base.inputs = layer.inputs_engine;

//            if (base.traits.speedX < 0)
//                base.traits.speedX += 0.025;
//            if (base.traits.speedX > 0)
//                base.traits.speedX -= 0.025;3
//            if (base.traits.speedY < 0)
//                base.traits.speedY += 0.025;
//            if (base.traits.speedY > 0)
//                base.traits.speedY -= 0.025;

            base.accelOffsetX = 0;
            base.accelOffsetY = 0;

            if (base.inputs.keyPressed(87)) {
                base.running = true;
                base.traits.accel_jet = 0.1;
            }
            else if (base.inputs.keyPressed(83)) {
                base.running = true;
                base.traits.accel_jet -= 0.01;
            }
            else {
                base.running = false;
                base.traits.accel_jet = 0;
            }


            if (base.inputs.keyPressed(69)) {
                base.traits.angle += 0.1;
            }
            if (base.inputs.keyPressed(81)) {
                base.traits.angle -= 0.1;
            }
            base.closest_distance = -1;


        },
        draw: function (gengine) {
            var base = this;
            gengine.drawCircle({
                x: base.traits.x,
                y: base.traits.y,
                radius: base.traits.radius,
                angle: base.traits.angle
            });


        },
        physics: function (layer) {
            var base = this;

            base.traits.speedX += base.traits.accelerationX + Math.cos(base.traits.angle) * base.traits.accel_jet;
            base.traits.speedY += base.traits.accelerationY + Math.sin(base.traits.angle) * base.traits.accel_jet;
            base.traits.x += base.traits.speedX + base.traits.offsetx;
            base.traits.y += base.traits.speedY + base.traits.offsety;
            base.traits.accelerationX = 0;
            base.traits.accelerationY = 0;
            base.traits.offsetx = 0;
            base.traits.offsety = 0;

            var context = base.layer.game.context;
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.beginPath();
            var screen_pos = base.getScreenPos();
            context.moveTo(screen_pos.x, screen_pos.y);
//            context.lineTo(screen_pos.x + base.traits.speedX, screen_pos.y + base.traits.speedY);
            context.lineTo(0, 0);
            context.stroke();
        }
    });

    return Player;
});