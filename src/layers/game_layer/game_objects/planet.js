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
            $.proxy(base.father.init, base)();
            base.extend(obj);
            base.radius = obj.radius;
            base.mass = 10;
            base.water_counts = 0;
            base.acid_counts = 0;
            base.earth_counts = 0;
            base.planet_type = obj.planet_type ? obj.planet_type : "energy";
            base.influence = obj.influence || 300;
            base.speed = 0.0005 * (obj.speed_factor ? obj.speed_factor : 1);
            base.destination = obj.destination ? obj.destination : false;
            base.orbs = [];
            base.origin_orbs = 0;
            base.grav_influence = 900;
            base.alive = false;
            var orb_type = "energy";
            switch (base.planet_type) {
                case "water":
                    base.origin_orbs = 5 + 10 * Math.random();
                    orb_type = "water";
                    break;
                case "energy":
                    base.origin_orbs = 50;
                    orb_type = "energy";
                    break;
                case "acid":
                    base.origin_orbs = 5 + 10 * Math.random();
                    orb_type = "acid";
                    break;
                case "shield":
                    base.origin_orbs = 5 + 10 * Math.random();
                    orb_type = "shield";
                    break;
                case "earth":
                    base.origin_orbs = 5 + 10 * Math.random();
                    orb_type = "earth";
                    break;
                case "life":
                    base.origin_orbs = 0;
                    orb_type = "none";
                    break;
                case "sun":
                    base.origin_orbs = 0;
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
            if (base.planet_type == "sun")
                base.temperature = base.orbs.length > base.radius / 2 ? 1000 : base.orbs.length / (base.radius / 2) * 1000;
            else if (base.planet_type == "life") {
                base.temperature = base.water_counts / 10;
            } else {
                base.temperature = base.origin_orbs > 0 ? base.orbs.length / base.origin_orbs * 1000 : 0;
            }

            if (base.destination)
                base.influence = base.orbs.length * 50;
            else if (base.planet_type == "life") {
                base.influence = (base.water_counts / 10 + base.acid_counts / 10 + base.earth_counts / 10 ) / 3 * 500;
            } else {
                base.influence = base.origin_orbs > 0 ? base.orbs.length / base.origin_orbs * 1000 : 0;
            }
            if (base.center !== undefined) {
                if (base.center.x && base.center.y) {
                    base.x = base.center.x + Math.cos(base.angle) * ( base.orbit_distance);
                    base.y = base.center.y + Math.sin(base.angle) * ( base.orbit_distance);
                }
                base.angle += base.speed;
            }
            for (var k in base.orbs) {
                base.orbs[k].physics();
            }

            if (base.planet_type == "life" && base.center && Vector.distance(base.center, base) < base.center.influence &&
                base.water_counts >= 10 && base.earth_counts >= 10 && base.acid_counts >= 10) {
                base.alive = true;
            }

        },
        predraw: function (gengine) {
            var base = this;

            var x = base.x;
            var y = base.y;
            var radius = base.radius;
            var rad = gengine.createRadialGradient(base.x, base.y, radius + base.influence, "white", "rgba(255,255,0,0.5)");

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
            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius,
                line_width: 1
            });
        },
        draw: function (gengine) {
            var base = this;
            var x = base.x;
            var y = base.y;
            var radius = base.radius;

//            gengine.drawCircle({
//                x: x,
//                y: y,
//                radius: radius + 50,
//                line_width: 3,
//                stroke_style: 'black',
//                fill_style: "grey"
//            });
            if (base.destination)
                base.color = "rgb(" + Math.round(255 * (base.temperature / 1000)) + ", " + Math.round(255 * (base.temperature / 1000)) + ", " + Math.round(255 * ( base.temperature / 1000)) + ")";
//            else {
//                base.color = "rgb(150, 200, 150)";
//            }
            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius,
                fill_style: base.color
            });
            if (base.planet_type != "life" || !base.alive)
                for (var k in base.orbs) {
                    base.orbs[k].draw(gengine);
                }

        }
    });

    return Planet;
});