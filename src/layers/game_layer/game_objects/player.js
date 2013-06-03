define([
    'jquery',
    'class',
    './object',
    'vector'
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
            console.log(base);
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

            base.orbs_count = 3;
            base.moved = false;
            base.orbs = [];
            base.orbs_consumption = 0;
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

            if (base.inputs.keyPressed(87)) {
                base.running = true;
                base.accel_jet = 0.5;
            }
            else if (base.inputs.keyPressed(83)) {
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

            if (base.inputs.buttonPressed(1)) {
                base.mouse_attracted = true;
                base.mouse_position = base.inputs.mouse_position;
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
                fill_style: "#FFAA88",
                stroke_style: "#FFAA88",
                angle: base.angle
            });


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

            var context = base.layer.game.context;
            context.font = "22px verdana";
            context.fillStyle = "white";
            context.fillText(Math.round(base.temperature) + " degrees", 10, 60);


            base.forces = [];

            base.accelerationX = 0;
            base.accelerationY = 0;

        },

        physics: function (layer) {
            var base = this;
            var in_influence = false;
            for (var k in layer.planets) {
                layer.planets[k].closest = false;
                var distance = base.distanceTo(layer.planets[k]) - layer.planets[k].radius;
                if (distance < base.closest_distance || base.closest_distance == -1) {
                    base.closest_distance = distance;
                    base.closest_planet = layer.planets[k];
                }
                var planet = layer.planets[k];

                if (distance <= planet.influence + planet.radius && distance >= 10 + planet.radius)
                {
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
                    in_influence = true;
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

            for (var k in layer.planets) {
                base.interractWith(layer, layer.planets[k]);
            }

            if (base.layer.inputs_engine.keyPressed(16)) {

                base.angle = Math.atan(base.speedY / base.speedX);
                if (base.speedX < 0)
                    base.angle += Math.PI;
                if (base.speedY < 0)
                    base.angle += 2 * Math.PI;
            } else {
//                base.center.x /= base.center_count;
//                base.center.y /= base.center_count;
//                if (base.center.x) {
//                    var unit = base.unitVectorTo(base.closest_planet);
//                    var angle = Math.atan(-unit.x / unit.y);
//                    base.angle = angle;
//                    if (unit.y < 0)
//                        base.angle += Math.PI;
//                    if (-unit.x < 0)
//                        base.angle += 2 * Math.PI;
//                    if (base.inverse)
//                        base.angle += Math.PI;
//                }
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

                vector_to_mouse = Vector.coeff_mult(vector_to_mouse, 1/*distance > 100 ? (distance) / 5000 : 0.2*/);

                mouse_add.x = vector_to_mouse.x * 0.9;
                mouse_add.y = vector_to_mouse.y * 0.9;

                base.orbs_count -= 0.01;

            }
//            if (base.layer.inputs_engine.pressed_buttons.length == 0)
//                base.angle += base.layer.inputs_engine.mouse_move.x / 75;

            base.speedX += base.accelerationX + Math.cos(base.angle) * base.accel_jet + mouse_add.x;
            base.speedY += base.accelerationY + Math.sin(base.angle) * base.accel_jet + mouse_add.y;

            base.x += base.speedX + base.offsetx;
            base.y += base.speedY + base.offsety;
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
                    base.speedX -= unit_speed.x * 0.5;
                    base.speedY -= unit_speed.y * 0.5;
                }


            }

            if (base.closest_planet) {
                if (base.closest_planet.destination) {
                    if (base.layer.inputs_engine.keyPressed(13)) {
                        if (base.orbs_count >= 25) {
                            base.closest_planet.addOrb();
                            base.closest_planet.addOrb();
                            base.orbs_count -= 2;
                        }
                    }
                }
            }

            var orbs = base.closest_planet.orbs;
            for (var k in orbs) {
                var orb = orbs[k];
                var d = base.distanceTo(orb);
                var u = base.unitVectorTo(orb);
                if (d < 15) {
                    base.orbs_count++;
                    orbs.splice(k, 1);
                }
                if (d < 500) {
                    orb.offsetx += d > 10 ? u.x * 30 * 150 / (d > 100 ? d : 100) : 0;
                    orb.offsety += d > 10 ? u.y * 30 * 150 / (d > 100 ? d : 100) : 0;
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
            }
        }
    });

    return Player;
});