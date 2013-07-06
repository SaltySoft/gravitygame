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
            var lifes = 0;
            var acids = 0;
            var earths = 0;
            var lives = [];
            for (var i = 0; i < 100; i++) {

                var planet_rand = Math.round(Math.random() * 10);
                var planet_type = "";


                if (earths < 25) {
                    if (Math.random() * (5 - earths) < 0.7) {
                        planet_type = "earth";
                        earths++;
                    }
                }
                else if (lifes < 3) {
                    if (Math.random() * (3 - lifes) < 0.7) {
                        planet_type = "life";
                        lifes++;
                    }
                } else if (acids < 25) {
                    if (Math.random() * (5 - acids) < 0.7) {
                        planet_type = "acid";
                        acids++;
                    }
                } else if (waters < 25) {
                    if (Math.random() * (5 - waters) < 0.7) {
                        planet_type = "water";
                        waters++;
                    }
                }
                if (planet_type !== "") {
                    switch (planet_rand) {
                        case 0, 1:
                            planet_type = "water";
                            waters++;
                            break;
                        case 2, 3:
                            planet_type = "acid";
                            acids++;
                            break;
                        case 4, 5:
                            planet_type = "earth";
                            earths++;
                            break;
                        case 3:


                            break;
                        default:
                            energies++
                            break;
                    }
                }


                var radius = 500 + 200 * Math.random()
                var speed = 0.5 + (Math.random() * 1.5);
                var planet = Planet.init(layer, {
                    center: center,
                    orbit_distance: i * (2 * radius + 4 * 4000) + (center.radius + 40000) /*+ ( 500 * (Math.random()))*/,
                    speed_factor: speed,
                    radius: radius,
                    planet_type: planet_type,
                    angle: 0
                });
                planets.push(planet);
                if (planet.planet_type == "life") {
                    lives.push(planet);
                }

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
            life_planets: lives,
            sun: center
        };
    };


    return {
        generate: generate
    };
});