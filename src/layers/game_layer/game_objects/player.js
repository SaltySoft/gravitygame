define([
    'class',
    './object'
], function (Class, Obj) {
    var Player = Obj.create();

    Player.extend({
        states: {
            FLYING: 0,
            WALKING : 1
        }
    });

    Player.include({

        init: function (layer, obj) {
            var base = this;
            base.layer = layer;
            base.traits = {
                x: 0,
                y: 0,
                speedX: 0,
                speedY: 0,
                accelerationX: 0,
                accelerationY: 0,
                mass: 10,
                angle: 0
            };
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
            if (base.inputs.keyPressed(65)) {
                base.accelOffsetX = -0.05;
            }
            if (base.inputs.keyPressed(68)) {
                base.accelOffsetX = 0.05;
            }
            if (base.inputs.keyPressed(87)) {
                base.accelOffsetY = -0.05;
            }
            if (base.inputs.keyPressed(83)) {
                base.accelOffsetY = 0.05;
            }






        },
        draw: function (gengine) {
            var base = this;
            gengine.drawCircle({
                x: base.traits.x,
                y: base.traits.y,
                radius: 10
            });



        },
        physics: function (layer) {
            var base = this;

            base.traits.x += base.traits.speedX;
            base.traits.y += base.traits.speedY;

            if (base.state == Player.states.FLYING) {


                base.traits.speedX += base.traits.accelerationX + base.accelOffsetX;
                base.traits.speedY += base.traits.accelerationY + base.accelOffsetY;
            } else {
                base.traits.speedX = 0;
                base.traits.speedY = 0;

            }






            base.traits.accelerationX = 0;
            base.traits.accelerationY = 0;

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