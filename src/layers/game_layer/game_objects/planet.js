define([
    './object',
    './player',
    './energy_orb'
], function (Obj, Player, EnergyOrb) {
    var Planet = Obj.create();

    Planet.extend({

    });
    Planet.include({
        type: "planet",
        init: function (layer, obj) {
            var base = this;
            $.proxy(base.father.init, base)();

            base.extend(obj);
            base.radius = obj.radius;
            base.mass = 10;
            base.color = "red";
            base.influence = obj.influence || 500;

            for (var i = 0; i < 50; i++) {
                var orb = EnergyOrb.init(layer, {
                    x : base.x + Math.cos(i / 25 * Math.PI) * (base.radius + 50 + Math.random() * 300),
                    y : base.y + Math.sin(i / 25 * Math.PI) * (base.radius + 50 + Math.random() * 300),
                    radius : 10,
                    center: base
                });
                layer.orbs.push(orb);
            }

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

        },
        predraw: function (gengine) {
            var base = this;

            var x = base.x;
            var y = base.y;
            var radius = base.radius;
            var rad = gengine.createRadialGradient(base.x, base.y, radius + 500, "white", "rgba(255,255,0,0.5)");

            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + base.influence,
                fill_style: rad
            });
        },
        draw: function (gengine) {
            var base = this;
            var x = base.x;
            var y = base.y;
            var radius = base.radius;

            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + 50,
                line_width: 3,
                stroke_style: 'black',
                fill_style: "grey"
            });
            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius,
                line_width: 3,
                stroke_style: 'green',
                fill_style: base.color
            });
            for (var k in base.orbs) {
//                base.orbs[k].draw(gengine);
            }

        }
    });

    return Planet;
});