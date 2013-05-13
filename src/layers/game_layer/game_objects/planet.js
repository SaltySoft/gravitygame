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
            base.x = obj.x ? obj.x : 0;
            base.y =  obj.y ? obj.y : 0;
            base.radius = obj.radius;
            base.mass = 10;
            base.color = "red";
            base.influence = obj.influence || 500;

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


        }
    });

    return Planet;
});