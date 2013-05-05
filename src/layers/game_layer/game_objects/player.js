define([
    'class',
    './object'
], function (Class, Obj) {
    var Player = Obj.create();

    Player.include({
        init: function (x,y) {
            var base = this;

            base.position = {
                x: 0,
                y: 0,
                speedX: 0,
                speedY: 0
            };

            if (x !== undefined && y != undefined) {
                base.position.x = x;
                base.position.y = y;
            }
        },
        logic: function (layer) {
            var base = this;
            base.inputs = layer.inputs_engine;

            if (base.position.speedX < 0)
                base.position.speedX += 0.025;
            if (base.position.speedX > 0)
                base.position.speedX -= 0.025;3
            if (base.position.speedY < 0)
                base.position.speedY += 0.025;
            if (base.position.speedY > 0)
                base.position.speedY -= 0.025;

            if (base.inputs.keyPressed(65)) {
                base.position.speedX -= 0.05;
            }
            if (base.inputs.keyPressed(68)) {
                base.position.speedX += 0.05;
            }
            if (base.inputs.keyPressed(87)) {
                base.position.speedY -= 0.05;
            }
            if (base.inputs.keyPressed(83)) {
                base.position.speedY += 0.05;
            }

            base.position.x += base.position.speedX;
            base.position.y += base.position.speedY;

        },
        draw: function (gengine) {
            var base = this;
            gengine.drawCircle({
                x: base.position.x,
                y: base.position.y,
                radius: 3 + Math.abs(base.position.speedX) + Math.abs(base.position.speedY) * 10
            });
        },
        physics: function (layer) {

        }
    });

    return Player;
});