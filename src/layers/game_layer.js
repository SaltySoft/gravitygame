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
            base.running = base.game.focused;
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
                if (!planet.alive && planet.planet_type == "life") {
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
            if (base.running) {
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
                    var new_zoom = base.camera.zoom + (base.inputs_engine.mouse_move.y > 0 ? 0.001 : -0.001);
                    if (new_zoom <= 2 && new_zoom >= 0.005) {
                        base.camera.x += base.game.canvas.width / (base.camera.zoom) / 2 - base.game.canvas.width / (new_zoom) / 2;
                        base.camera.y += base.game.canvas.height / (base.camera.zoom) / 2 - base.game.canvas.height / (new_zoom) / 2;


                        base.camera.zoom = new_zoom;
                    }
                }


                if (base.inputs_engine.buttonPressed(3)) {
                    base.camera.x -= base.inputs_engine.mouse_move.x / base.camera.zoom;
                    base.camera.y -= base.inputs_engine.mouse_move.y / base.camera.zoom;

                }
                if (base.player.closest_planet) {
                    var cplanet = base.player.closest_planet;
                    var vector = {
                        x: base.camera.x + base.game.canvas.width / 2 / base.camera.zoom,
                        y: base.camera.y + base.game.canvas.height / 2 / base.camera.zoom
                    };
                    var distance = Vector.distance(cplanet, vector);
                    base.camera.speedX *= 0.95;
                    base.camera.speedY *= 0.95;
                    if (distance > 5 / base.camera.zoom) {
                        var unit_to_planet = cplanet.unitVectorTo(vector);
                        if (Vector.lgth({ x: base.camera.speedX, y: base.camera.speedY}) < 2 * base.player.closest_planet.speed * base.player.closest_planet.orbit_distance) {
                                base.camera.speedX += unit_to_planet.x * 5;
                                base.camera.speedY += unit_to_planet.y * 5;
                        }

                    } else {
                        base.camera.speedX = 0;
                        base.camera.speedY = 0;
                        base.camera.x = cplanet.x - base.game.canvas.width / 2 / base.camera.zoom;
                        base.camera.y = cplanet.y - base.game.canvas.height / 2 / base.camera.zoom;
                    }
                }

                base.camera.x += base.camera.speedX;
                base.camera.y += base.camera.speedY;

                base.physics_engine.run();
                for (var k in base.planets)
                    base.planets[k].physics();
            }

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
            var context = base.game.context;
            context.font = "22px verdana";
            context.fillStyle = "white";
            context.fillText("Water orbs : " + (base.player.water_orbs).toFixed(2), 10, 60);

            context.font = "22px verdana";
            context.fillStyle = "white";
            context.fillText("Aminate acid orbs : " + (base.player.acid_orbs).toFixed(2), 10, 90);

            context.font = "22px verdana";
            context.fillStyle = "white";
            context.fillText("Shield orbs : " + (base.player.shield_orbs).toFixed(2), 10, 120);

            context.font = "20px verdana";
            context.fillStyle = "white";
            context.fillText("FullScreen", base.game.canvas.width - 120, base.game.canvas.height - 15);

            if (!base.running) {
                context.font="50px verdana";
                context.fillStyle = "white";
                var text = "Click on the screen to play";
                var metrics = context.measureText(text);
                context.fillText( "Click on the screen to play", base.game.canvas.width / 2 - metrics.width / 2, base.game.canvas.height / 2 - 25);
            }

            base.inputs_engine.draw();
        },
        pauseGame: function () {
            var base = this;
            base.running = false;
        },
        unPauseGame: function () {
            var base = this;
            base.running = true;
        }
    });

    return GameLayer;
});