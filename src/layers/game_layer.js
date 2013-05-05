define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine',
    './game_layer/game_objects/planet'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine, Planet) {
    var GameLayer = Layer.create();

    GameLayer.include({
        init: function (game) {
            var base = this;
            base.game = game;
            base.camera = {
                x: 0,
                y: 0,
                distance: 100
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);

            base.objects = [];
            console.log(game);
            var planet =  Planet.init(base, {
                x: 100,
                y: 100,
                radius: 100
            });
            base.objects.push(planet);
            var planet =  Planet.init(base, {
                x: 300,
                y: 200,
                radius: 10
            });
            base.objects.push(planet);
            var planet =  Planet.init(base, {
                x: 400,
                y: 500,
                radius: 20
            });
            base.objects.push(planet);
            base.objects.push(planet);
            var planet =  Planet.init(base, {
                x: -200,
                y: 300,
                radius: 30
            });
            base.objects.push(planet);
        },
        cameraPos: function (params) {
            var base = this;
            if (params.x)
                base.camera.x = params.x;
            if (params.y)
                base.camera.y = params.y;
        },
        inputs: function () {
            var base = this;
            base.inputs_engine.run();

        },
        physics: function () {
            var base = this;
            base.physics_engine.run();
        },
        draw: function () {
            var base = this;
            base.camera.x -= 0.5;
            base.graphics_engine.run();
        }
    });

    return GameLayer;
});