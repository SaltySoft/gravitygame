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
    var GameLayer = Layer.create();

    GameLayer.include({
        init: function (game) {
            var base = this;
            base.game = game;
            base.camera = {
                x: -500,
                y: -500,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom: 0.1
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);

            base.objects = [];
            base.planets = [];
            base.orbs = [];
            console.log(game);
            base.mobile_objects = [];

            base.level = LevelGenerator.generate(base, {
                planets: 10
            });

            base.player = base.level.player;
            base.objects.push(base.player);
            base.mobile_objects.push(base.player);

            for (var k in base.level.planets) {
                base.objects.push(base.level.planets[k]);
                base.planets.push(base.level.planets[k]);
            }

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
            var won = true;
            for (var k in base.planets) {
                var planet = base.planets[k];
                if (Vector.distance(planet, base.level.sun) > base.level.sun.influence) {
                    won = false;
                }
            }

            if (won) {
                base.game.won();
            }

        },
        inputs: function () {
            var base = this;
            base.inputs_engine.run();

        },
        physics: function () {
            var base = this;
            if ((base.player.x) < base.camera.x + 50) {
                base.camera.x = (base.player.x) - 50;
            }

            if ((base.player.y) < base.camera.y + 50) {
                base.camera.y = (base.player.y) - 50;
            }

            if ((base.player.x) > base.camera.x + base.game.canvas.width / base.camera.zoom - 50) {
                base.camera.x = (base.player.x) - base.game.canvas.width / base.camera.zoom + 50;
            }

            if ((base.player.y) > base.camera.y + base.game.canvas.height / base.camera.zoom - 50) {
                base.camera.y = (base.player.y) - base.game.canvas.height / base.camera.zoom + 50;
            }

            if (base.inputs_engine.buttonPressed(2)) {
                var new_zoom = base.camera.zoom + base.inputs_engine.mouse_move.y / 500;
                if (new_zoom <= 2 && new_zoom >= 0.01) {
                    base.camera.x += base.game.canvas.width / (base.camera.zoom) / 2 - base.game.canvas.width / (new_zoom) / 2;
                    base.camera.y += base.game.canvas.height / (base.camera.zoom) / 2 - base.game.canvas.height / (new_zoom) / 2;


                    base.camera.zoom = new_zoom;
                }


            }

            if (base.inputs_engine.buttonPressed(3)) {
                base.camera.x -= base.inputs_engine.mouse_move.x / base.camera.zoom;
                base.camera.y -= base.inputs_engine.mouse_move.y / base.camera.zoom;

            }

            base.physics_engine.run();
            for (var k in base.planets)
                base.planets[k].physics();
        },
        draw: function () {
            var base = this;

            base.graphics_engine.run();
            for (var k in base.orbs)
                base.orbs[k].draw(base.graphics_engine);

            var context = base.game.context;
            context.font = "22px verdana";
            context.fillStyle = "white";
            context.fillText("Energy orbs (fuel) : " + (base.player.orbs_count).toFixed(2), 10, 30);
            base.inputs_engine.draw();
        }
    });

    return GameLayer;
});