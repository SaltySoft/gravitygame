define([
    './object',
    './player',
    './energy_orb',
    '../vector'
], function (Obj, Player, EnergyOrb, Vector) {
    var Planet = Obj.create();

    Planet.extend({

    });
    Planet.include({
        type: "planet",
        addOrb: function (type, i) {
            var base = this;
            type = type ? type : "energy";
            i = i !== undefined ? i : 0;
            var orb = EnergyOrb.init(base.layer, {
                x: base.x + Math.cos(Math.random() * 2 * Math.PI) * (base.radius + 50 + Math.random() * 300),
                y: base.y + Math.sin(Math.random() * 2 * Math.PI) * (base.radius + 50 + Math.random() * 300),
                radius: 20,
                center: base,
                type: type
            });
            switch (type) {
                case "water" :
                    base.water_counts++;
                    break;
                case "acid" :
                    base.acid_counts++;
                    break;
                case "earth":
                    base.earth_counts++;
                    break;
                default:
                    break;
            }
            base.orbs.push(orb);
        },
        init: function (layer, obj) {
            var base = this;
            base.temperature = 0;
            base.layer = layer;
            $.proxy(base.father.init, base)();
            base.extend(obj);
            base.radius = obj.radius;
            base.mass = 10;
            base.water_counts = 0;
            base.acid_counts = 0;
            base.earth_counts = 0;
            base.planet_type = obj.planet_type ? obj.planet_type : "energy";
            base.influence = obj.influence || 300;
            base.speed = 50 * (obj.speed_factor ? obj.speed_factor : 1);
            base.destination = obj.destination ? obj.destination : false;
            base.orbs = [];
            base.origin_orbs = 0;
            base.grav_influence = base.destination ? 20000 : 15000;
            base.alive = false;
            base.active = false;
            base.previous_active = false;
            var orb_type = "energy";
            switch (base.planet_type) {
                case "water":
                    base.origin_orbs = 20 + 10 * Math.random();
                    orb_type = "water";
                    break;
                case "energy":
                    base.origin_orbs = 50;
                    orb_type = "energy";
                    break;
                case "acid":
                    base.origin_orbs = 20 + 10 * Math.random();
                    orb_type = "acid";
                    break;
                case "shield":
                    base.origin_orbs = 20 + 10 * Math.random();
                    orb_type = "shield";
                    break;
                case "earth":
                    base.origin_orbs = 20 + 10 * Math.random();
                    orb_type = "earth";
                    break;
                case "life":
                    base.origin_orbs = 0;
                    orb_type = "none";
                    break;
                case "sun":
                    base.origin_orbs = 200;
                    orb_type = "energy";
                    break;
                default:
                    base.origin_orbs = 50;
                    orb_type = "energy";
                    break;
            }

            for (var i = 0; i < base.origin_orbs; i++) {
                base.addOrb(orb_type, i);
            }
            if (base.center && base.center.x && base.center.y) {
                base.x = base.center.x + Math.cos(i / 25 * Math.PI) * (base.orbit_distance);
                base.y = base.center.y + Math.sin(i / 25 * Math.PI) * (base.orbit_distance);

            }



            base.angle = obj.angle ? obj.angle : Math.random() * Math.PI * 2;
            base.image_disx = 0;
            base.image_ddx = 1;
            base.image_disy = 0;
            base.image_factor = 0;

            if (base.planet_type == "life") {
                console.log("INIT PLANET L", layer);
            }

            base.previous_alive = false;
            base.warmup = 0;
        },
        setVector: function (x, y) {
            var base = this;

            base.x = x;
            base.y = y;
        },
        setRadius: function (r) {
            var base = this;
            base.radius = r;
        },
        physics: function (layer) {
            var base = this;
            base.layer = layer;
            if (layer.game.debugging && layer.inputs_engine.keyPressed(16)) {
                base.water_counts = 10;
                base.earth_counts = 10;
                base.acid_counts = 10;
            }

            if (base.planet_type == "sun")
                base.temperature = base.orbs.length > base.radius / 2 ? 1000 : base.orbs.length / (base.radius / 2) * 1000;
            else if (base.planet_type == "life") {
                base.temperature = base.water_counts / 10;
            } else {
                base.temperature = base.origin_orbs > 0 ? base.orbs.length / base.origin_orbs * 1000 : 0;
            }

            if (base.destination)
                base.influence = base.orbs.length * 2000;
            else if (base.planet_type == "life") {
                base.influence = (base.water_counts / 10 + base.acid_counts / 10 + base.earth_counts / 10 ) / 3 * 500;
            } else {
                base.influence = base.origin_orbs > 0 ? base.orbs.length / base.origin_orbs * 10000 : 0;
            }
            if (base.center !== undefined) {
                if (base.center.x && base.center.y) {
                    base.x = base.center.x + Math.cos(base.angle) * ( base.orbit_distance);
                    base.y = base.center.y + Math.sin(base.angle) * ( base.orbit_distance);
                }
                base.angle += base.speed / base.orbit_distance;
            }
            for (var k in base.orbs) {
                base.orbs[k].physics();
            }

            if (base.planet_type == "life" && base.center && Vector.distance(base.center, base) < base.center.influence &&
                base.water_counts >= 10 && base.earth_counts >= 10 && base.acid_counts >= 10) {

                if (base.warmup == 500) {
                    base.alive = true;
                    base.warming = false;
                } else {
                    base.warming = true;
                    base.warmup += 1;
                }

                if (!base.previous_alive) {
                    layer.player.score += 1000;
                }
            }
            base.previous_alive = base.alive;

        },
        predraw: function (gengine) {
            var base = this;

            var x = base.x;
            var y = base.y;
            var radius = base.radius;
            var rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "rgba(255,255,255,0.5)", "rgba(255,255,0,0.1)");

            switch (base.planet_type) {
                case "energy":
                    rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(255,255,100,0.5)");
                    base.color = "rgb( " + (255 * base.temperature / 1000) + ",  " + (255 * base.temperature / 1000) + ", " + (255 * base.temperature / 1000) + ")";
                    break;
                case "water":
                    rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(0,0,255,0.5)");
                    base.color = "rgb(0, 0, " + (255 * base.temperature / 1000) + ")";
                    break;
                case "acid":
                    rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(0,255,0,0.5)");
                    base.color = "rgb(0, " + (255 * base.temperature / 1000) + ", 0)";
                    break;
                case "shield":
                    rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(255,0,255,0.5)");
                    base.color = "rgb(0, " + (255 * base.temperature / 1000) + ", " + (255 * base.temperature / 1000) + ")";
                    break;
                case "earth":
                    rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(255,0,255,0.5)");
                    base.color = "rgb(0, " + (255 * base.temperature / 1000) + ", " + (255 * base.temperature / 1000) + ")";
                    break;
                case "life":
                    rad = base.alive ? gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgb(100, 255, 255)") : gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgb(255, 255, 255)");
                    base.color = base.alive ? "white" : "rgb(" + (100 * base.earth_counts / 10 + 50 ) + ", " + (100 * base.acid_counts / 10 + 50) + ", " + (100 * base.water_counts / 10 + 50) + ")";
                    break;
                default:
                    break;
            }
            ;

            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + base.influence,
                fill_style: rad
            });
            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + base.grav_influence,
                line_width: 1
            });
            if (!base.destination) {
                gengine.drawCircle({
                    x: x,
                    y: y,
                    radius: radius,
                    line_width: 1
                });
            }

        },
        draw: function (gengine) {
            var base = this;
            var x = base.x;
            var y = base.y;
            var radius = base.radius;
            base.color = "rgb(0, 0, 0)";
            if (base.destination) {
               base.color = "rgb(" + Math.round(255 * (base.temperature / 1000)) + ", " + Math.round(255 * (base.temperature / 1000)) + ", " + Math.round(255 * ( base.temperature / 1000)) + ")";

            }

            if (!base.destination) {
                gengine.drawCircle({
                    x: x,
                    y: y,
                    radius: radius,
                    fill_style: base.color
                });
            }

            if (base.planet_type != "life" || !base.alive)
                for (var k in base.orbs) {
                    base.orbs[k].draw(gengine);
                }
            if (base.planet_type == "life" && base.alive) {
                gengine.drawCircle({
                    x: x,
                    y: y,
                    radius: radius * 30,
                    fill_style: "rgba(255,255,255,0.3)"
                });
            }
            if (base.destination) {
                var disp = base.influence > 0 ? base.influence / 20000: 0.01;

                base.radius = 500 * disp;
                gengine.drawImage("sun.png", base.x, base.y, 500 * disp, 512 * disp, 4608 / 9 * base.image_disx, 0, 512, 512);
                if (base.image_factor % 10 == 0) {

                    if (base.image_disx > 7) {
                        base.image_ddx = -1;
                    }
                    if (base.image_disx < 2) {
                        base.image_ddx = 1;
                    }
                    base.image_disx += base.image_ddx;

                }
                base.image_factor++;
                base.image_factor %= 100;


            }
            base.previous_active = base.active;
            base.active = false;
        }
    });

    return Planet;
});