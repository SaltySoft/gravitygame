define([
    './object',
    './player'
], function (Obj, Player) {
    var Planet = Obj.create();

    Planet.extend({

    });
    Planet.include({
        type: "planet",
        init: function (layer, obj) {
            var base = this;
            base.layer = layer;
            base.extend(obj);
            base.traits = {
                x: obj.x ? obj.x : 0,
                y: obj.y ? obj.y : 0,
                radius: obj.radius,
                mass: 10,
                color: "red",
                influence: obj.influence || 500
            };

        },
        settraits: function (x, y) {
            var base = this;

            base.traits.x = x;
            base.traits.y = y;
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

            var x = base.traits.x;
            var y = base.traits.y;
            var radius = base.traits.radius;
            var rad = gengine.createRadialGradient(base.traits.x, base.traits.y, radius + 500, "white", "rgba(255,255,0,0.5)");

            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + base.traits.influence,
                fill_style: rad
            });
        },
        draw: function (gengine) {
            var base = this;
            var x = base.traits.x;
            var y = base.traits.y;
            var radius = base.traits.radius;

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
                fill_style: base.traits.color
            });


        }
    });

    return Planet;
});