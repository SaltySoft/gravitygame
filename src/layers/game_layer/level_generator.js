define([
    './game_objects/planet',
    './game_objects/player'
], function (Planet, Player) {
//    var planets = [];
//    var objects = [];
//    var player = {};

    var generate = function (layer, params) {
        var planets = [];
        var objects = [];
        var player;

        var center = Planet.init(layer, {
            x: 500,
            y: 500,
            radius: 100
        });
        planets.push(center);


        if (params !== undefined && params.planets !== undefined) {
            for (var i = 0; i < params.planets; i++) {

                var planet = Planet.init(layer, {
                    center: center,
                    orbit_distance:  (i + 1) * 500 + ( 100 * (Math.random() * 1.5)),
                    speed_factor: 0.5 + (Math.random() * 1.5),
                    radius: 100 * Math.random()
                });
                planets.push(planet);

            }
        }

        player = Player.init(layer, {
                x: 100,
                y: 100
            });
        return {
            planets: planets,
            objects: objects,
            player : player,
            generate : generate
        };
    };




    return {
//        planets: planets,
//        objects: objects,
//        player : player,
        generate : generate
    };
});