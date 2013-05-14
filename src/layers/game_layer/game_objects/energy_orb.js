define([
    'jquery',
    './object'
], function ($, Obj) {
    var EnergyOrb = Obj.create();

    EnergyOrb.include({
        init: function (layer, obj) {
            var base = this;
            $.proxy(base.father.init, base)(layer, obj);
        },
        physics: function () {

        },
        draw: function (gengine) {
            var base = this;
            gengine.beginPath();

            gengine.drawCircle({
                x: base.x,
                y: base.y,
                radius: base.radius,
                angle: base.angle,
                fill_style: "white"
            });

            gengine.closePath();
        }
    });

    return EnergyOrb;
});