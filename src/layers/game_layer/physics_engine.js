define([
    'class'
], function (Class) {
    var PhysicsEngine = Class.create();


    PhysicsEngine.extend({

    });
    PhysicsEngine.include({
        init: function (layer) {
            var base = this;
            base.layer = layer;
            base.inputs_engine = layer.inputs_engine;
            base.camera = layer.camera;
        },
        camera_control: function () {
            var base = this;

            if (base.camera.speedX < 0) {
                base.camera.speedX += 0.05;
            }
            if (base.camera.speedX > 0) {
                base.camera.speedX -= 0.05;
            }
            if (base.camera.speedY < 0) {
                base.camera.speedY += 0.05;
            }
            if (base.camera.speedY > 0) {
                base.camera.speedY -= 0.05;
            }
            if (Math.abs(base.camera.speedX) < 0.05) {
                base.camera.speedX = 0;
            }
            if (Math.abs(base.camera.speedY) < 0.05) {
                base.camera.speedY = 0;
            }
            if (base.inputs_engine.keyPressed(37)) {
                base.camera.speedX -= 0.1;
            }
            if (base.inputs_engine.keyPressed(39)) {
                base.camera.speedX += 0.1;
            }
            if (base.inputs_engine.keyPressed(38)) {
                base.camera.speedY -= 0.1;
            }
            if (base.inputs_engine.keyPressed(40)) {
                base.camera.speedY += 0.1;
            }
            base.camera.x += base.camera.speedX;
            base.camera.y += base.camera.speedY;
        },
        run: function () {
            var base = this;
            base.camera_control();

            for (var k in base.layer.objects) {
                base.layer.objects[k].physics(base.layer.game);
            }
        }
    });


    return PhysicsEngine
});