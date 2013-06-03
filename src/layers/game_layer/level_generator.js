define([
    './game_objects/planet',
    './game_objects/player'
], function (Planet, Player) {

    var generate = function (layer, params) {
        var planets = [];
        var objects = [];
        var player;

        var center = Planet.init(layer, {
            x: layer.game.canvas.width / 2 / layer.camera.zoom,
            y: layer.game.canvas.height / 2 / layer.camera.zoom,
            radius: 300,
            destination: true,
            planet_type: "sun"
        });
        planets.push(center);


        if (params !== undefined && params.planets !== undefined) {
            for (var i = 0; i < 50; i++) {

                var planet = Planet.init(layer, {
                    center: center,
                    orbit_distance: i * 500 + (center.radius + 2500) + ( 2000 * (Math.random() * 1.5)),
                    speed_factor: 0.5 + (Math.random() * 1.5),
                    radius: 100 + 200 * Math.random()
                });
                planets.push(planet);

            }
            planets.push(planet);
        }

        player = Player.init(layer, {
            planet: center
        });
        return {
            planets: planets,
            objects: objects,
            player: player,
            generate: generate,
            sun : center
        };
    };


    return {
        generate: generate
    };
});