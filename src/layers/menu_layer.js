define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine) {
    var MenuLayer = Layer.create();

    MenuLayer.include({
        init: function (game, score) {
            var base = this;
            base.game = game;
            base.camera = {
                x: 0,
                y: 0,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom: 1
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);
            base.score = score;
        },
        logic: function () {
            var base = this;
            if (base.inputs_engine.keyPressed(32)) {
                base.game.clearLayers();
                base.game.newGame();
            }
        },
        draw: function () {
            var base = this;
            var context = base.game.context;
            base.graphics_engine.drawCache();
            context.font = "30px verdana";
            context.fillStyle = "white";
            var metrics1 = context.measureText("You won")
            var metrics2 = context.measureText("Your score :" + base.score + " points")
            context.fillText("You won", base.game.canvas.width / 2 - metrics1.width /2, base.game.canvas.height / 2 - 300);
            context.fillText("Your score :" + base.score + " points", base.game.canvas.width / 2 - metrics2.width / 2, base.game.canvas.height / 2 - 200);
        }
    });

    return MenuLayer;
});