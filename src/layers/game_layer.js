define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine',
    './game_layer/game_objects/planet',
    './game_layer/game_objects/player',
    './game_layer/level_generator',
    './game_layer/vector',
    './menu_layers/pause_menu',
    './hud'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine, Planet, Player, LevelGenerator, Vector, PauseMenu, HudLayer) {
    var GameLayer = Layer.create();

    GameLayer.include({
        initializeLayer: function (game) {
            var base = this;
            base.game = game;
            base.camera = {
                x: -500,
                y: -500,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom: 0.01
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
            base.paused = false;


            base.hud_layer = HudLayer.init(base.game);
            base.hud_layer.setup(base);

            base.alive_planets = 0;
            base.life_planets = 0;
            base.warming_planets = 0;
            for (var k in base.planets) {
                if (base.planets[k].planet_type == "life") {
                    base.life_planets++;
                }
            }
            base.warmup_percentage = 0;
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

            if (base.last) {
                base.paused = false;
            }

            for (var k in base.objects) {
                base.objects[k].logic(base);
            }
            var won = true;
            base.alive_planets = 0;
            base.warmup_percentage = 0;
            base.warming_planets = 0;
            for (var k in base.planets) {
                var planet = base.planets[k];
                if (!planet.alive && planet.planet_type == "life") {
                    won = false;
                }
                if (planet.planet_type == "life" && planet.alive) {
                    base.alive_planets++;
                    base.warmup_percentage += 1;
                }
                if (planet.planet_type == "life" && planet.warming) {
                    base.warming_planets++;
                    base.warmup_percentage += planet.warmup / 500;
                }
            }

            base.warmup_percentage = Math.round(base.warmup_percentage / base.life_planets * 100);

            if (won) {
                base.finished = true;
                base.game.won(Math.round(base.player.score));
            }

            if (base.game.debugging) {
                if (base.inputs_engine.keyPressed(8)) {
                    base.finished = true;
                    base.game.won(Math.round(50000 + Math.random() * 5000));
                }
            }

            if (base.inputs_engine.keyPressed(80)) {
                base.pauseMenu();
            }

        },
        inputs: function () {
            var base = this;
            base.inputs_engine.run();

        },
        pauseMenu: function () {
            var base = this;
            if (!base.finished) {
                base.paused = true;
                base.game.running = true;

                var pause_layer = PauseMenu.init(base.game);
                base.game.addLayer(pause_layer);
            }
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


                if (base.inputs_engine.buttonPressed(2) && Math.abs(base.inputs_engine.mouse_move.y) > 0.5) {
                    var new_zoom = base.camera.zoom + (base.inputs_engine.mouse_move.y > 0 ? 0.025 * base.camera.zoom : -0.025 * base.camera.zoom);
                    if (new_zoom <= 2 && new_zoom >= 0.0005) {
                        base.camera.x += base.game.canvas.width / (base.camera.zoom) / 2 - base.game.canvas.width / (new_zoom) / 2;
                        base.camera.y += base.game.canvas.height / (base.camera.zoom) / 2 - base.game.canvas.height / (new_zoom) / 2;


                        base.camera.zoom = new_zoom;
                    }
                }


                if (base.inputs_engine.buttonPressed(3)) {
                    if (!base.previous_right_button) {
                        base.planet_centered = !base.planet_centered;
                    }

                    base.previous_right_button = true;
                } else {
                    base.previous_right_button = false;
                }


                if (!base.planet_centered) {
//                    base.camera.x -= base.inputs_engine.mouse_move.x / base.camera.zoom ;
//                    base.camera.y -= base.inputs_engine.mouse_move.y / base.camera.zoom;

                    var camera_center = {
                        x: base.camera.x + base.game.canvas.width / 2 / base.camera.zoom,
                        y: base.camera.y + base.game.canvas.height / 2 / base.camera.zoom
                    };
                    var vector = base.player.unitVectorTo(camera_center);
                    var speed = base.player.calcSpeed();

                    if (false && base.player.distanceTo(camera_center) > 500 + speed * 2) {
                        base.camera.x += vector.x * ((speed * 2) || 200);
                        base.camera.y += vector.y * ((speed * 2) || 200);
                    } else {
                        base.camera.x = base.player.x - base.game.canvas.width / 2 / base.camera.zoom;
                        base.camera.y = base.player.y - base.game.canvas.height / 2 / base.camera.zoom;
                    }


                } else {
                    if (base.player.closest_planet) {
                        var cplanet = base.player.closest_planet;
                        var vector = {
                            x: base.camera.x + base.game.canvas.width / 2 / base.camera.zoom,
                            y: base.camera.y + base.game.canvas.height / 2 / base.camera.zoom
                        };
                        var distance = Vector.distance(cplanet, vector);
                        base.camera.speedX *= 0.95;
                        base.camera.speedY *= 0.95;
                        var unit_to_planet = cplanet.unitVectorTo(vector);
                        if (distance > Vector.calcSpeed(base.camera.speedX, base.camera.speedY) + 100) {

                            if (Vector.lgth({ x: base.camera.speedX, y: base.camera.speedY}) < 30 * base.player.closest_planet.speed * base.player.closest_planet.orbit_distance) {
                                base.camera.speedX += unit_to_planet.x * 15;
                                base.camera.speedY += unit_to_planet.y * 15;
                            }
                            console.log("j", Vector.calcSpeed(base.camera.speedX, base.camera.speedY), distance, base.camera.speedX, base.camera.speedY);
                            base.camera.x += base.camera.speedX;
                            base.camera.y += base.camera.speedY;
                        } else {
                            console.log(Vector.calcSpeed(base.camera.speedX, base.camera.speedY), distance, base.camera.speedX, base.camera.speedY);
                            base.camera.x = cplanet.x - base.game.canvas.width / 2 / base.camera.zoom;
                            base.camera.y = cplanet.y - base.game.canvas.height / 2 / base.camera.zoom;

                        }
                    }


                }

                base.physics_engine.run();
                for (var k in base.planets)
                    base.planets[k].physics(base);
            }

        },
        draw: function () {
            var base = this;
            for (var k in base.orbs)
                base.orbs[k].draw(base.graphics_engine);

            base.hud_layer.draw();
            base.inputs_engine.draw();
            base.graphics_engine.run();
        },
        layerRun: function (last) {
            var base = this;
            base.last = last;
            if (!base.running) {
                if (!base.paused) {
                    base.pauseMenu();
                }
            }

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