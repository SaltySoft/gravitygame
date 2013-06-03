define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine',
    './game_layer/game_objects/planet',
    './game_layer/game_objects/player',
    './game_layer/level_generator',
    './game_layer/vector'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine, Planet, Player, LevelGenerator, Vector) {
    var MenuLayer = Layer.create();

    MenuLayer.include({
        init: function (game) {
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
            context.font="100px verdana";
            context.fillStyle = "white";
            context.fillText("You won ", base.game.canvas.width / 2 - 200, base.game.canvas.height / 2);
        }
    });

    return MenuLayer;
});