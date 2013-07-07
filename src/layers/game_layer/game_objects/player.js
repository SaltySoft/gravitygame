define([
    'jquery',
    'class',
    './object',
    '../vector'
], function ($, Class, Obj, Vector) {
    var Player = Obj.create();

    Player.extend({
        states: {
            FLYING: 0,
            WALKING: 1
        }
    });

    Player.include({

        init: function (layer, obj) {
            var base = this;
            $.proxy(base.father.init, base)(layer, obj);
            base.x = 0;
            base.y = 0;
            base.radius = 10;

            base.inverse = false;
            base.angle_count = 0;
            base.angle_sum = 0;
            base.running = false;
            base.current_planet = undefined;
            base.state = Player.states.FLYING;
            base.angle_correction = false;
            base.center = {
                x: undefined,
                y: undefined
            };

            base.temperature = 0;

            base.center_count = 0;

            if (obj !== undefined && obj.x !== undefined && obj.y !== undefined) {
                base.x = obj.x;
                base.y = obj.y;
            }
            base.just_inversed = false;


            base.mouse_attracted = false;
            base.mouse_position = { x: 0, y: 0 };

            base.orbs_count = base.layer.game.debugging ? 1000 : 5;
            base.water_orbs = base.layer.game.debugging ? 100 : 0;
            base.acid_orbs = base.layer.game.debugging ? 100 : 0;
            base.earth_orbs = base.layer.game.debugging ? 100 : 0;
            base.shield_orbs = base.layer.game.debugging ? 100 : 0;
            base.moved = false;
            base.orbs = [];
            base.orbs_consumption = 0;
            base.score = 0;
            base.previous_closest = 0;
        },
        addAngle: function (angle, weight) {
            var base = this;
            weight *= weight * weight;
            base.angle_sum += angle * weight;
            base.angle_count += weight;
        },
        addCenter: function (vector, weight) {
            var base = this;
            if (base.center.x == undefined) {
                base.center.x = 0;
                base.center.y = 0;
            }

            base.center.x += vector.x;
            base.center.y += vector.y;
            base.center_count += 1;
        },
        logic: function (layer) {
            var base = this;
            base.inputs = layer.inputs_engine;

            base.accelOffsetX = 0;
            base.accelOffsetY = 0;

            if (base.inputs.keyPressed(87) && base.closest_distance && base.closest_distance < 2000) {
                base.running = true;
                base.accel_jet = 0.5;
            }
            else if (base.inputs.keyPressed(83) && base.closest_distance && base.closest_distance < 2000) {
                base.running = true;
                base.accel_jet = -0.5;
            }
            else {
                base.running = false;
                base.accel_jet = 0;
            }


            if (base.inputs.keyPressed(69)) {
                base.angle += 0.2;
            }
            if (base.inputs.keyPressed(81)) {
                base.angle -= 0.2;
            }

            if (base.inputs.keyPressed(49)) {
                if (!base.just_inversed)
                    base.inverse = !base.inverse;
                base.just_inversed = true;
            } else {
                base.just_inversed = false;
            }

            if (base.layer.running && base.inputs.buttonPressed(1)) {
                base.mouse_attracted = true;
                base.mouse_position = base.inputs.mouse_position;
                if (!base.moved) {
                    base.acid_orbs = 0;
                    base.water_orbs = 0;
                    base.earth_orbs = 0;
                }
                base.moved = true;
            } else {
                base.mouse_attracted = false;
            }
            base.closest_distance = -1;


        },
        draw: function (gengine) {
            var base = this;
            gengine.drawCircle({
                x: base.x,
                y: base.y,
                radius: 5 / base.layer.camera.zoom,
                fill_style: "blue",
                stroke_style: "#FFAA88"
//                angle: base.angle
            });


            if (base.layer.game.debugging) {
                gengine.beginPath();
                gengine.moveTo({x: base.x, y: base.y});
                gengine.lineTo({
                    x: base.x + base.accelerationX * 1000,
                    y: base.y + base.accelerationY * 1000
                }, "blue", 2);
                gengine.closePath();
                gengine.beginPath();
                gengine.moveTo({x: base.x, y: base.y});
                gengine.lineTo({
                    x: base.x + base.speedX * 20,
                    y: base.y + base.speedY * 20
                }, "green", 2);
                gengine.closePath();
            }
            var context = base.layer.game.context;
            context.font = "18px verdana";
            context.fillStyle = "white";
            var metrics = context.measureText("Score : " + Math.round(base.score) + " points");
            context.fillText("Score : " + Math.round(base.score) + " points", base.layer.game.canvas.width - metrics.width - 10, 28);

            for (var k in base.active_planets) {
                gengine.beginPath();
                gengine.moveTo({x: base.x, y: base.y});
                gengine.lineTo({
                    x: base.active_planets[k].x,
                    y: base.active_planets[k].y
                }, "blue", 1);
            }
            gengine.beginPath();
            gengine.moveTo({x: base.x, y: base.y});
            gengine.lineTo({
                x: base.layer.level.sun.x,
                y: base.layer.level.sun.y
            }, "rgba(255, 255, 255, 0.1)", 1);

            if (base.mouse_attracted) {
                gengine.beginPath();
                gengine.moveTo({x: base.x, y: base.y});
                gengine.lineTo({
                    x: base.layer.inputs_engine.mouse_position.x,
                    y: base.layer.inputs_engine.mouse_position.y
                }, "rgba(255, 0, 0, 0.3)", 3);
            }


            for (var k in base.layer.level.life_planets) {
                gengine.beginPath();
                gengine.moveTo({x: base.x, y: base.y});
                gengine.lineTo({
                    x: base.layer.level.life_planets[k].x,
                    y: base.layer.level.life_planets[k].y
                }, "rgba(0, 100, 255, 0.1)", 1);
            }

            base.forces = [];

            base.accelerationX = 0;
            base.accelerationY = 0;

        },

        physics: function (layer) {
            var base = this;
            base.active_planets = [];
            var in_influence = false;
            for (var k in layer.planets) {
                layer.planets[k].closest = false;
                layer.planets[k].close = false;
                var distance = base.distanceTo(layer.planets[k]) - layer.planets[k].radius;
                if (distance < base.closest_distance || base.closest_distance == -1) {
                    base.closest_distance = distance;
                    base.closest_planet = layer.planets[k];
                }
                var planet = layer.planets[k];
                if (distance < planet.grav_influence + planet.radius) {
//                    planet.close = true;
                }
                if (distance <= planet.influence + planet.radius && distance >= 10 + planet.radius) {
                    if (base.temperature < 20 || base.temperature > 24)
                        base.temperature += base.temperature < 22 ? 2 : -2;
                    else
                        base.temperature = 20;
                    in_influence = true;
                }
                else if (distance < 10 + planet.radius) {
                    if (base.temperature < 500) {
                        base.temperature += 1;
                    }
                }
                if (!in_influence) {
                    if (base.temperature > -273) {
                        base.temperature -= 0.02;
                    }
                } else {
                    base.color = "blue";
                }
            }
            base.closest_planet.closest = true;
            base.closest_planet.close = true;

            for (var k in layer.planets) {
                base.interractWith(layer, layer.planets[k]);
            }

            if (base.speedX != 0) {
                base.angle = Math.atan(base.speedY / base.speedX);
                if (base.speedX < 0)
                    base.angle += Math.PI;
                if (base.speedY < 0)
                    base.angle += 2 * Math.PI;
            }


            var mouse_add = {
                x: 0,
                y: 0
            };

            if (base.mouse_attracted && base.orbs_count > 0) {
                var vector_to_mouse = {
                    x: base.mouse_position.x - base.x,
                    y: base.mouse_position.y - base.y
                };


                vector_to_mouse = Vector.normalize(vector_to_mouse);
                var distance = Vector.distance(base, base.mouse_position);

                vector_to_mouse = Vector.coeff_mult(vector_to_mouse, 1);

                mouse_add.x = vector_to_mouse.x * 10;
                mouse_add.y = vector_to_mouse.y * 10;

                base.orbs_count -= 0.01;

            }
//            if (base.layer.inputs_engine.pressed_buttons.length == 0)
//                base.angle += base.layer.inputs_engine.mouse_move.x / 75;


            base.speedX += base.accelerationX + Math.cos(base.angle) * base.accel_jet + mouse_add.x;
            base.speedY += base.accelerationY + Math.sin(base.angle) * base.accel_jet + mouse_add.y;
            base.speed = Math.sqrt(base.speedX * base.speedX + base.speedY * base.speedY);
            var speed_vect = {
                x: base.speedX,
                y: base.speedY
            }
            if (base.closest_planet) {
                var distance = base.distanceTo(base.closest_planet);
                if (distance < base.closest_planet.radius) {
                    var unit = base.closest_planet.unitVectorTo(base);
                    base.x -= (base.closest_planet.radius - distance) * unit.x;
                    base.y -= (base.closest_planet.radius - distance) * unit.y;
                    var unit_speed = Vector.normalize(speed_vect);

                    base.speedX -= base.speed * unit.x / 10;
                    base.speedY -= base.speed * unit.y / 10;

                    //Player loses score when on planet.
                    base.score -= base.score > 50 ? 50 : base.score;
                    if (base.previous_closest >= base.closest_planet.radius + 10) {
                        base.layer.graphics_engine.notification("Don't touch planets ! You'll disturb its nature. Malus : 50pts", 1000);
                    }
                } else if (distance < base.closest_planet.radius + 5) {
                    base.speedX *= 0.9;
                    base.speedY *= 0.9;
                } else {
                    if (Math.abs(Vector.distance(base, base.closest_planet) - base.previous_closest) < 10 && base.moved) {
                        base.score += base.closest_distance / 1000;
                    }
                }

                base.previous_closest = Vector.distance(base, base.closest_planet);
            }
            var speed_f = 1;
            if (base.layer.inputs_engine.keyPressed(65) && base.orbs_count > 0.1) {
                speed_f = 10;
                base.orbs_count -= 0.01;
            }

            base.x += base.speedX * speed_f + base.offsetx;
            base.y += base.speedY * speed_f + base.offsety;


            if (base.closest_planet) {
                if (base.closest_planet.destination) {
                    if (base.layer.inputs_engine.keyPressed(13)) {
                        if (base.orbs_count > 25) {
                            base.closest_planet.addOrb();
                            base.closest_planet.addOrb();
                            base.orbs_count -= 2;
                            base.score += 5;
                        }
                    }
                }
                if (base.closest_planet.planet_type == "life") {
                    if (base.layer.inputs_engine.keyPressed(13)) {
                        if (base.water_orbs > 0 && base.closest_planet.water_counts < 10) {
                            base.closest_planet.addOrb("water");
                            base.water_orbs -= 1;
                            base.score += 10;
                            if (base.closest_planet.water_counts >= 10) {
                                base.score += 100;
                            }
                        }
                        if (base.acid_orbs > 0 && base.closest_planet.acid_counts < 10) {
                            base.closest_planet.addOrb("acid");
                            base.acid_orbs -= 1;
                            base.score += 10;
                            if (base.closest_planet.acid_counts >= 10) {
                                base.score += 100;
                            }
                        }
                        if (base.earth_orbs > 0 && base.closest_planet.earth_counts < 10) {
                            base.closest_planet.addOrb("earth");
                            base.earth_orbs -= 1;
                            base.score += 10;
                            if (base.closest_planet.earth_counts >= 10) {
                                base.score += 100;
                            }
                        }
                    }
                }
            }

            var orbs = base.closest_planet.orbs;
            if (base.closest_planet.planet_type != "life" && !base.closest_planet.destination) {
                for (var k in orbs) {
                    var orb = orbs[k];
                    var d = base.distanceTo(orb);
                    var u = base.unitVectorTo(orb);
                    if (d < 10000 &&
                        ((orb.type === "water" && base.water_orbs < 10) ||
                            (orb.type === "earth" && base.earth_orbs < 10) ||
                            (orb.type === "acid" && base.acid_orbs < 10) ||
                            orb.type === "energy")) {
                        orb.offsetx += d > 10 ? u.x * (base.speed + 5) : 0;
                        orb.offsety += d > 10 ? u.y * (base.speed + 5) : 0;
                    }
                    if (d < 900) {
                        if (orb.type === "energy") {
                            base.orbs_count++;
                            base.score += 1;
                            orbs.splice(k, 1);
                        }
                        if (orb.type == "water" && base.water_orbs < 10) {
                            base.water_orbs++;
                            base.closest_planet.water_counts--;
                            base.score += 10;
                            orbs.splice(k, 1);
                        }
                        if (orb.type == "acid" && base.acid_orbs < 10) {
                            base.acid_orbs++;
                            base.closest_planet.acid_counts--;
                            base.score += 10;
                            orbs.splice(k, 1);
                        }
                        if (orb.type == "earth" && base.earth_orbs < 10) {
                            base.earth_orbs++;
                            base.closest_planet.earth_counts--;
                            base.score += 10;
                            orbs.splice(k, 1);
                        }
                        if (orb.type == "shield" && base.shield_orbs < 10) {
                            base.shield_orbs++;
                            orbs.splice(k, 1);
                        }

                    }
                }
            }


            base.offsetx = 0;
            base.offsety = 0;
            base.angle_count = 0;
            base.center = {
                x: 0,
                y: 0
            };
            base.center_count = 0;
            base.angle_sum = 0;
            base.angle_correction = false;
            base.closest_distance = -1;
            if (base.planet && !base.moved) {
                base.x = base.planet.x + base.planet.radius + 100;
                base.y = base.planet.y + base.planet.radius + 100;
                base.speedX = 0;
                base.speedY = 0;
                base.accelerationX = 0;
                base.accelerationY = 0;
            }
            base.layer.game.score = Math.round(base.score);
        }
    });

    return Player;
});