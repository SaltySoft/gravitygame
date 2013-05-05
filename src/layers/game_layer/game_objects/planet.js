define([
    'class'
], function (Class) {
    var Planet = Class.create();

    Planet.extend({

    });
    Planet.include({
        type: "planet",
        init: function (layer, obj) {
            var base = this;
            base.layer = layer;
            base.extend(obj);

        },
        setPosition: function (x, y) {
            var base = this;

            base.x = x;
            base.y = y;
        },
        setRadius: function (r) {
            var base = this;
            base.radius = r;
        },
        physics: function () {
            var base = this;

        },
        draw: function (gengine) {
            var base = this;


            var x = base.x;
            var y = base.y;
            var radius = base.radius;

            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius,
                line_width: 3,
                stroke_style: 'green',
                fill_style: '#00ff00'
            });
        }
    });

    return Planet;
});