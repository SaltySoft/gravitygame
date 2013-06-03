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
            radius: 1000,
            destination: true,
            planet_type: "sun"
        });
        planets.push(center);


        if (params !== undefined && params.planets !== undefined) {
            var waters = 0;
            var energies = 0;
            var shields = 0;
            var acids = 0;
            for (var i = 0; i < 15; i++) {

                var planet_rand = Math.round(Math.random() * 7);
                console.log(planet_rand);
                var planet_type = "energy";
                switch (planet_rand) {
                    case 1, 2:
                        planet_type = "water";
                        waters++;
                        break;
                    case 2, 3:
                        planet_type = "acid";
                        acids++;
                        break;
                    case 4, 5:
                        planet_type = "earth";
                        acids++;
                        break;
                    case 6:
                        planet_type = "life";
                        shields++;
                        break;
                    default:
                        energies++
                        break;
                }

                var planet = Planet.init(layer, {
                    center: center,
                    orbit_distance: i * 4000 + (center.radius + 2000) /*+ ( 500 * (Math.random()))*/,
                    speed_factor: 0.5 + (Math.random() * 1.5),
                    radius: 500 + 200 * Math.random(),
                    planet_type: planet_type
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