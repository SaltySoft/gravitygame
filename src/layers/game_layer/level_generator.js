define([
    './game_objects/planet',
    './game_objects/player'
], function (Planet, Player) {

    var generate = function (layer, params) {
        var planets = [];
        var objects = [];
        var player;

        var center = Planet.init(layer, {
            x: 500,
            y: 500,
            radius: 500,
            destination: true
        });
        planets.push(center);


        if (params !== undefined && params.planets !== undefined) {
            for (var i = 0; i < params.planets; i++) {

                var planet = Planet.init(layer, {
                    center: center,
                    orbit_distance: (i + 1) * 500 + ( 100 * (Math.random() * 1.5)),
                    speed_factor: 0.5 + (Math.random() * 1.5),
                    radius: 100 * Math.random()
                });
                planets.push(planet);

            }
            planets.push(planet);
        }
        var last_planet = planets[planets.length - 1];
        player = Player.init(layer, {
            planet: center
        });
        return {
            planets: planets,
            objects: objects,
            player: player,
            generate: generate
        };
    };


    return {
        generate: generate
    };
});