define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine',
    './game_layer/game_objects/planet',
    './game_layer/game_objects/player'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine, Planet, Player) {
    var GameLayer = Layer.create();

    GameLayer.include({
        init: function (game) {
            var base = this;
            base.game = game;
            base.camera = {
                x: 0,
                y: 0,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom : 1
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);

            base.objects = [];
            console.log(game);
            var planet = Planet.init(base, {
                x: 500,
                y: 500,
                radius: 100
            });
            base.objects.push(planet);


            base.mobile_objects = [];

//
            var planet =  Planet.init(base, {
                x: 3000,
                y: 3000,
                radius: 100
            });
            base.objects.push(planet);
//            var planet =  Planet.init(base, {
//                x: 243,
//                y: 100,
//                radius: 10
//
//            });
//            base.objects.push(planet);
//            var planet =  Planet.init(base, {
//                x: 675,
//                y: 344,
//                radius: 10
//            });
//            base.objects.push(planet);
//            var planet =  Planet.init(base, {
//                x: 150,
//                y: 500,
//                radius: 10
//            });
//            base.objects.push(planet);
            base.player = Player.init(base, {
                x: 400,
                y: 400
            });

            base.objects.push(base.player);
            base.mobile_objects.push(base.player);
        },
        cameraPos: function (params) {
            var base = this;
            if (params.x)
                base.camera.x = params.x;
            if (params.y)
                base.camera.y = params.y;

        },
        logic: function () {
            var base = this;


            for (var k in base.objects) {
                base.objects[k].logic(base);
            }
        },
        inputs: function () {
            var base = this;
            base.inputs_engine.run();
        },
        physics: function () {
            var base = this;

            if (base.player.traits.x < base.camera.x - 30) {
                base.camera.x = base.player.traits.x - 30;
            }
            if (base.player.traits.x > base.camera.x + base.game.canvas.width + 30) {
                base.camera.x = base.player.traits.x + 30 - base.game.canvas.width;
            }

            if (base.player.traits.y < base.camera.y - 30) {
                base.camera.y = base.player.traits.y - 30;
            }
            if (base.player.traits.y > base.camera.y + base.game.canvas.height - 30) {
                base.camera.y = base.player.traits.y + 30 - base.game.canvas.height;
            }
            if (base.inputs_engine.buttonPressed(2)) {
                if (base.inputs_engine.mouse_move.y < 0) {
                    base.camera.zoom -= 0.01;
                }
                if (base.inputs_engine.mouse_move.y > 0) {
                    base.camera.zoom += 0.01;
                }
            }


            base.physics_engine.run();
        },
        draw: function () {
            var base = this;

            base.graphics_engine.run();
        }
    });

    return GameLayer;
});