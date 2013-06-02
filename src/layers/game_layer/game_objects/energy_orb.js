define([
    './object'
], function (Obj) {
    var EnergyOrb = Obj.create();

    EnergyOrb.extend({

    });

    EnergyOrb.include({
        init: function (layer, obj) {
            var base = this;
            $.proxy(base.father.init, base)(layer, obj);
            var toMex = base.x - base.center.x;
            var toMey = base.y - base.center.y;
            if (base.y - base.center.y != 0)
                base.angle = Math.atan(toMey / toMex);
            else {
                base.angle = 0;
            }
            if (toMex < 0)
                base.angle += Math.PI;
            if (toMey < 0)
                base.angle += 2 * Math.PI;

            base.offsetx = 0;
            base.offsety = 0;
            console.log("angle", base.angle);
            base.distance = (base.center.radius + 50 + Math.random() * 300)
            base.speed = Math.random() * 0.005 + 0.001;
        },
        physics: function () {
            var base = this;
            if (base.center && base.center.closest) {
                base.x = base.center.x + Math.cos(base.angle) * (20 * (Math.cos(base.angle * base.distance / 20) + 1) + base.distance) + base.offsetx;
                base.y = base.center.y + Math.sin(base.angle) * (20 * (Math.cos(base.angle * base.distance / 20) + 1) + base.distance ) + base.offsety;


                base.angle +=base.speed;
            }
        },
        draw: function (gengine) {
            var base = this;
            if (base.center && base.center.closest) {
                var rad = gengine.createRadialGradient(base.x, base.y, base.radius, "rgba(100,100,255,0.5)", "white");
                gengine.beginPath();

                gengine.drawCircle({
                    x: base.x,
                    y: base.y,
                    radius: base.radius,
                    fill_style: rad
                });

                gengine.closePath();
            }

        }
    });



    return EnergyOrb;
});