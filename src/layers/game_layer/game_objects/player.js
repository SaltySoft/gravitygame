define([
    'jquery',
    'class',
    './object',
    '../vector'
], function($, Class, Obj, Vector) {
    var Player = Obj.create();

    Player.extend({
        states: {
            FLYING: 0,
            WALKING: 1
        }
    });

    Player.include({

        init: function(layer, obj) {
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
            base.mouse_position = {
                x: 0,
                y: 0
            };

            base.has_to_fill = true;
            base.orbs_count = base.layer.game.debugging ? 1000 : 100;
            base.water_orbs = base.layer.game.debugging ? 10 : 0;
            base.acid_orbs = base.layer.game.debugging ? 10 : 0;
            base.earth_orbs = base.layer.game.debugging ? 10 : 0;
            base.shield_orbs = base.layer.game.debugging ? 10 : 0;
            base.moved = true;
            base.orbs = [];
            base.orbs_consumption = 0;
            base.score = 0;
            base.previous_closest = 0;
            base.show_radar = true;
            base.radar_key = false;
            base.last_pos = [];
            base.cur_frame = 0;

            base.positionned = false;
        },
        addAngle: function(angle, weight) {
            var base = this;
            weight *= weight * weight;
            base.angle_sum += angle * weight;
            base.angle_count += weight;
        },
        addCenter: function(vector, weight) {
            var base = this;
            if (base.center.x == undefined) {
                base.center.x = 0;
                base.center.y = 0;
            }

            base.center.x += vector.x;
            base.center.y += vector.y;
            base.center_count += 1;
        },
        logic: function(layer) {
            var base = this;
            if (!base.positionned) {
                base.x = base.layer.level.sun.x + 15000;
                base.y = base.layer.level.sun.y;
                base.speedY = 400;
                base.positionned = true;
            }
            base.inputs = layer.inputs_engine;

            base.accelOffsetX = 0;
            base.accelOffsetY = 0;

            if (base.inputs.keyPressed(87) && base.closest_distance && base.closest_distance < 2000) {
                base.running = true;
                base.accel_jet = 0.5;
            } else if (base.inputs.keyPressed(83) && base.closest_distance && base.closest_distance < 2000) {
                base.running = true;
                base.accel_jet = -0.5;
            } else {
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
                if (!base.moved)
                    base.layer.graphics_engine.showMainHint("[Left click] Hold to run the engine");
            }
            base.closest_distance = -1;

            if (base.layer.inputs_engine.keyPressed(82)) {
                if (!base.radar_key) {
                    base.radar_key = true;
                    base.show_radar = !base.show_radar;
                }
            } else {
                base.radar_key = false;
            }
            base.state = [];
            base.target_lifes = [];
            for (var k in base.layer.level.life_planets) {
                var p = base.layer.level.life_planets[k];
                if (p.water_counts < 10 && p.acid_counts < 10 && p.earth_counts < 10)
                    base.target_lifes.push(p);
            }
            if (base.orbs_count < 200 && base.has_to_fill || base.orbs_count < 40) {
                base.state.push("energy_search");
                if (base.orbs_count < 40) {
                    base.has_to_fill = true;
                }
            } else {
                if ((base.water_orbs < 10 || base.acid_orbs < 10 || base.earth_orbs < 10) && base.target_lifes.length > 0) {
                    base.state.push("materials_search");
                    if (base.water_orbs < 10)
                        base.state.push("water_search");
                    if (base.acid_orbs < 10)
                        base.state.push("acid_search");
                    if (base.earth_orbs < 10)
                        base.state.push("earth_search");
                } else {
                    if (base.target_lifes.length > 0)
                        base.state.push("life_search");
                    else
                        base.state.push("sun_warmup");
                }
            }
        },
        draw: function(gengine) {
            var base = this;
            // gengine.drawCircle({
            //     x: base.x,
            //     y: base.y,
            //     radius: 5 / base.layer.camera.zoom,
            //     fill_style: "blue",
            //     stroke_style: "#FFAA88"
            // });



            var i = base.last_pos.length;
            for (var k in base.last_pos) {
                var alpha = i-- * base.speed / 30000;
                var radius = ((30 - i)) / base.layer.camera.zoom * Math.sqrt(base.speed) / 75 * base.layer.camera.zoom * 100;
                radius = radius > 0 ? radius : 0;


                gengine.drawCircle({
                    y: base.last_pos[k].y,
                    x: base.last_pos[k].x,
                    radius: radius,
                    fill_style: "rgba(255,100,70," + alpha + ")",
                    stroke_style: "#FFAA88"
                });
            }
            var toX = (-base.x + base.inputs.mouse_position.x);
            var toY = (-base.y + base.inputs.mouse_position.y);
            base.speed_vector = Vector.normalize({
                x: toX,
                y: toY
            });
            base.ac_angle = base.ac_angle || 0;
            if (base.inputs.buttonPressed(1)) {

                var aim = Math.atan(toX / toY);
                if (toY > 0)
                    aim += Math.PI;
                aim = -aim;
                base.ac_angle = aim;
            } else {
                base.ac_angle = base.angle + Math.PI / 2;
            }

            if (base.inputs.buttonPressed(1) || base.inputs.keyPressed(16)) {
                var j = 10;

                for (var i = 0; i < 10; i++) {
                    var alpha = j / 40;
                    var radius = j / 2 * 100;
                    var fillstyle = "rgba(255,255,255," + alpha + ")";
                    var color = "#FFAA88";
                    if (base.inputs.keyPressed(16)) {
                        if (!base.inputs.buttonPressed(1))
                            base.speed_vector = Vector.normalize({
                                x: base.speedX,
                                y: base.speedY
                            });
                        var fillstyle = "rgba(100,100,255," + alpha * 2 + ")";
                    }

                    gengine.drawCircle({
                        x: base.x - (base.speed_vector.x * 5 * i / base.layer.camera.zoom + base.speed_vector.x * 10 / base.layer.camera.zoom),
                        y: base.y - (base.speed_vector.y * 5 * i / base.layer.camera.zoom + base.speed_vector.y * 10 / base.layer.camera.zoom),
                        radius: radius,
                        fill_style: fillstyle,
                        stroke_style: color
                    });
                    j--;
                }
            }

            gengine.drawImageCentered("ship.png", base.x, base.y, 75, base.ac_angle);



            if (base.layer.game.debugging) {
                gengine.beginPath();
                gengine.moveTo({
                    x: base.x,
                    y: base.y
                });
                gengine.lineTo({
                    x: base.x + base.accelerationX * 1000,
                    y: base.y + base.accelerationY * 1000
                }, "blue", 2);
                gengine.closePath();
                gengine.beginPath();
                gengine.moveTo({
                    x: base.x,
                    y: base.y
                });
                gengine.lineTo({
                    x: base.x + base.speedX * 20,
                    y: base.y + base.speedY * 20
                }, "green", 2);
                gengine.closePath();
            }
            var context = base.layer.game.context;

            for (var k in base.active_planets) {
                gengine.beginPath();
                gengine.moveTo({
                    x: base.x,
                    y: base.y
                });
                gengine.lineTo({
                    x: base.active_planets[k].x,
                    y: base.active_planets[k].y
                }, "blue", 1);
            }
            gengine.beginPath();
            gengine.moveTo({
                x: base.x,
                y: base.y
            });
            var normalized_vector = Vector.normalize({
                x: (base.layer.level.sun.x - base.x),
                y: (base.layer.level.sun.y - base.y)
            });
            if (base.show_radar) {
                radars = {
                    targets: [],
                    energy: {
                        distance: -1,
                        target: undefined
                    },
                    water: {
                        distance: -1,
                        target: undefined
                    },
                    earth: {
                        distance: -1,
                        target: undefined
                    },
                    acid: {
                        distance: -1,
                        target: undefined
                    }

                };
                //All planets radar
                for (var k in base.layer.level.planets) {
                    var target = base.layer.level.planets[k];
                    var distance = base.distanceTo({
                        x: target.x,
                        y: target.y
                    });

                    var color = "black";
                    switch (target.planet_type) {
                        case "water":
                            if ((distance < radars.water.distance || radars.water.distance < 0) && target.orbs.length > 0) {
                                if (base.state.indexOf("water_search") !== -1) {
                                    color = "rgba(0,0,255," + (500000 / distance) + ")";
                                    radars.water.distance = distance;
                                    radars.water.target = {
                                        x: target.x,
                                        y: target.y,
                                        color: color
                                    };
                                }
                            }
                            break;
                        case "energy":
                            if ((distance < radars.energy.distance || radars.energy.distance < 0) && target.orbs.length > 0) {
                                if (base.state.indexOf("energy_search") !== -1) {
                                    radars.energy.distance = distance;
                                    color = "rgba(255,150,0," + (100000 / distance) + ")";
                                    radars.energy.target = {
                                        x: target.x,
                                        y: target.y,
                                        color: color
                                    };
                                }
                            }
                            break;
                        case "acid":
                            if ((distance < radars.acid.distance || radars.acid.distance < 0) && target.orbs.length > 0) {
                                if (base.state.indexOf("acid_search") !== -1) {
                                    radars.acid.distance = distance;
                                    color = "rgba(0,255,0," + (50000 / distance) + ")";
                                    radars.acid.target = {
                                        x: target.x,
                                        y: target.y,
                                        color: color
                                    };
                                }
                            }
                            break;
                        case "earth":
                            if ((distance < radars.earth.distance || radars.earth.distance < 0) && target.orbs.length > 0) {
                                if (base.state.indexOf("earth_search") !== -1) {
                                    radars.earth.distance = distance;
                                    color = "rgba(255,0,0," + (50000 / distance) + ")";
                                    radars.earth.target = {
                                        x: target.x,
                                        y: target.y,
                                        color: color
                                    };
                                }
                            }
                            break;
                        case "life":
                            if (base.state.indexOf("life_search") !== -1 && (target.water_counts < 10 && target.earth_counts < 10 && target.acid_counts < 10)) {
                                color = "rgba(255,255,255," + (500000 / distance) + ")";
                                radars.targets.push({
                                    x: target.x,
                                    y: target.y,
                                    color: color
                                });
                            }
                            break;
                        case "sun":
                            color = "rgba(255,255,0," + (50000 / distance) + ")";
                            if (base.state.indexOf("sun_warmup") !== -1)
                                radars.targets.push({
                                    x: target.x,
                                    y: target.y,
                                    color: color
                                });
                            break;
                        default:
                            break;
                    };
                }

                if (radars.energy.target)
                    radars.targets.push(radars.energy.target);
                if (radars.acid.target)
                    radars.targets.push(radars.acid.target);
                if (radars.water.target)
                    radars.targets.push(radars.water.target);
                if (radars.earth.target)
                    radars.targets.push(radars.earth.target);

                for (var k in radars.targets) {
                    var target = radars.targets[k];
                    gengine.beginPath();

                    var normalized_vector = Vector.normalize({
                        x: (target.x - base.x),
                        y: (target.y - base.y)
                    });

                    gengine.moveTo({
                        x: base.x,
                        y: base.y
                    });

                    gengine.radarTo({
                        x: base.x,
                        y: base.y
                    }, {
                        x: base.x + normalized_vector.x * 50 / base.layer.camera.zoom,
                        y: base.y + normalized_vector.y * 50 / base.layer.camera.zoom
                    }, target.color, 2, Math.PI / 10);
                }


                if (base.mouse_attracted) {
                    gengine.beginPath();
                    gengine.moveTo({
                        x: base.x,
                        y: base.y
                    });
                    gengine.lineTo({
                        x: base.layer.inputs_engine.mouse_position.x,
                        y: base.layer.inputs_engine.mouse_position.y
                    }, "rgba(255, 0, 0, 0.3)", 3);
                }



                //Hint
                base.layer.graphics_engine.addHint("[R] Hide Radar");
            } else {
                base.layer.graphics_engine.addHint("[R] Show Radar");
            }

            base.forces = [];

            base.accelerationX = 0;
            base.accelerationY = 0;

        },

        physics: function(layer) {
            var base = this;
            base.active_planets = [];
            // ++base.cur_frame;
            // base.cur_frame = base.cur_frame % 5;
            if (true || base.cur_frame == 0) {

                if (base.last_pos.length > 30)
                    base.last_pos.shift();
                base.last_pos.push({
                    x: base.x,
                    y: base.y
                });

            }


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
                } else if (distance < 10 + planet.radius) {
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

            base.speed = Math.sqrt(base.speedX * base.speedX + base.speedY * base.speedY);

            if (base.mouse_attracted && base.orbs_count > 0) {
                var vector_to_mouse = {
                    x: base.mouse_position.x - base.x,
                    y: base.mouse_position.y - base.y
                };
                vector_to_mouse = Vector.normalize(vector_to_mouse);
                vector_to_mouse = Vector.coeff_mult(vector_to_mouse, 1);
                if (base.speed < 500) {
                    mouse_add.x = vector_to_mouse.x * 10;
                    mouse_add.y = vector_to_mouse.y * 10;
                    base.orbs_count -= 0.1;
                } else {
                    base.speedX *= 0.99;
                    base.speedY *= 0.99;
                }
                if (base.orbs_count < 0) {
                    base.orbs_count = 0;
                }
            }




            base.speedX += base.accelerationX + Math.cos(base.angle) * base.accel_jet + mouse_add.x;
            base.speedY += base.accelerationY + Math.sin(base.angle) * base.accel_jet + mouse_add.y;
            base.speed = Math.sqrt(base.speedX * base.speedX + base.speedY * base.speedY);

            if (base.closest_planet) {
                var distance = base.distanceTo(base.closest_planet);
                if (distance < base.closest_planet.radius) {
                    var unit = base.closest_planet.unitVectorTo(base);
                    base.x -= (base.closest_planet.radius - distance) * unit.x;
                    base.y -= (base.closest_planet.radius - distance) * unit.y;

                    base.speedX -= base.speed * unit.x / 10;
                    base.speedY -= base.speed * unit.y / 10;
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
            base.warp_add = base.warp_add || {
                x: 0,
                y: 0
            };

            if (base.inputs.keyPressed(16) && base.orbs_count > 0) {
                speed_f = 5;
                base.orbs_count -= 0.05;
            }
            base.x += base.speedX * speed_f + base.offsetx + base.warp_add.x;
            base.y += base.speedY * speed_f + base.offsety + base.warp_add.y;
            base.warp_add.x *= 0.9;
            base.warp_add.y *= 0.9;
            if (base.closest_planet) {
                if (base.closest_distance < base.closest_planet.influence)
                    base.layer.graphics_engine.addHint("[Space] Leave the planet's orbital influence");
                if (base.closest_planet.destination) {
                    base.layer.graphics_engine.addHint("[Enter] Increase sun rays influence (consumes energy)");
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
                    base.layer.graphics_engine.addHint("[Enter] Drop collected materials to help life come to this planet");
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
            if (base.closest_planet.planet_type != "life" && (!base.closest_planet.destination || base.layer.inputs_engine.keyPressed(90))) {

                if (base.closest_planet.planet_type == "energy") {
                    base.layer.graphics_engine.addHint("Orbit around this planet to increase your ship's ENERGY");
                }
                if (base.closest_planet.planet_type == "water") {
                    base.layer.graphics_engine.addHint("Orbit around this planet to fill your WATER tanks");
                }
                if (base.closest_planet.planet_type == "acid") {
                    base.layer.graphics_engine.addHint("Orbit around this planet to fill your AMINATE ACIDS tanks");
                }
                if (base.closest_planet.planet_type == "earth") {
                    base.layer.graphics_engine.addHint("Orbit around this planet to fill your EARTH tanks");
                }

                for (var k in orbs) {
                    var orb = orbs[k];
                    var d = base.distanceTo(orb);
                    var u = base.unitVectorTo(orb);
                    if (d < 30000 &&
                        ((orb.type === "water" && base.water_orbs < 10) ||
                            (orb.type === "earth" && base.earth_orbs < 10) ||
                            (orb.type === "acid" && base.acid_orbs < 10) ||
                            orb.type === "energy")) {
                        orb.offsetx += d > 10 ? u.x * (base.speed + 10) : 0;
                        orb.offsety += d > 10 ? u.y * (base.speed + 10) : 0;
                    }
                    if (d < 1000) {

                        if (orb.type === "energy") {

                            base.orbs_count++;
                            base.score += 1;
                            orbs.splice(k, 1);
                            if (base.orbs_count >= 200 && base.has_to_fill) {
                                base.has_to_fill = false;
                            }

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