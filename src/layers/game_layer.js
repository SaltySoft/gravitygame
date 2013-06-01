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
                x: -500,
                y: -500,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom:0.4
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);

            base.objects = [];
            base.planets = [];
            base.orbs = [];
            console.log(game);
//            var planet = Planet.init(base, {
//                x: 500,
//                y: 500,
//                radius: 100
//            });
//            base.objects.push(planet);
//            base.planets.push(planet);

            base.mobile_objects = [];

//
            var planet = Planet.init(base, {
                x: 500,
                y: 500,
                radius: 100
            });
            base.objects.push(planet);
            base.planets.push(planet);
            var planet =  Planet.init(base, {
                x: 50,
                y: 50,
                radius: 80,
                center : planet,
                orbit_distance: 1000
            });
            base.objects.push(planet);
            base.planets.push(planet);

            var planet =  Planet.init(base, {
                x: 1500,
                y: 1500,
                radius: 200,
                center : planet,
                orbit_distance: 2000

            });
            base.objects.push(planet);
            base.planets.push(planet);
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
                x: 100,
                y: 100
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
                var new_zoom = base.camera.zoom + base.inputs_engine.scr_mouse_move.y / 500;
                if (new_zoom <= 2 && new_zoom >= 0.01)
                    base.camera.zoom = new_zoom;
                console.log(base.inputs_engine.scr_mouse_position);
            }

            base.physics_engine.run();
            for (var k in base.planets)
                base.planets[k].physics();

            for (var k in base.orbs)
                base.orbs[k].physics();
        },
        draw: function () {
            var base = this;

            base.graphics_engine.run();
            for (var k in base.orbs)
                base.orbs[k].draw(base.graphics_engine);

            var context = base.game.context;
            context.font="22px verdana";
            context.fillStyle = "white";
            context.fillText(base.player.orbs_count + " orbs collected", 10, 30);
        }
    });

    return GameLayer;
});