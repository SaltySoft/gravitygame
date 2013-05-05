define([
    './object'
], function (Obj) {
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
                x : obj.x ? obj.x : 0,
                y : obj.y ? obj.y : 0,
                radius: obj.radius,
                mass: 10000000,
                color: "red"
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
            for (var k in layer.mobile_objects)
            {
                var object = layer.mobile_objects[k];
                var x = (base.traits.x -  object.traits.x);
                var y = (base.traits.y -  object.traits.y);
                var distance = Math.sqrt(x*x + y*y);

                var force = (base.traits.mass + object.traits.mass) / (distance * distance * 1000);

                var unitx = x / (x*x + y*y);
                var unity = y / (x*x + y*y);

                var addx = unitx * force;
                var addy = unity * force;

                var screen_pos = object.getScreenPos();
                var lineto = {
                    x: Math.round(screen_pos.x + (force * unitx) * 100000),
                    y: Math.round(screen_pos.y + (force * unity) * 100000)
                };

                base.forceLine = {
                    origin: screen_pos,
                    dest: lineto
                };

                base.unforceLine = {
                    origin: $.extend(true, {}, screen_pos),
                    dest: $.extend(true, {}, lineto)
                };



                if (Math.abs(distance - base.traits.radius) <= 5) {
                    base.speedX = -base.speedX;
                    base.speedY = -base.speedY;

                    base.unforceLine.dest.x = screen_pos.x - (object.traits.accelerationX * unitx) * 10000;
                    base.unforceLine.dest.y = screen_pos.y - (object.traits.accelerationY * unitx) * 10000;
                    base.traits.color = "green";
                } else {
                    base.traits.color = "red";
                    object.traits.accelerationX += addx;
                    object.traits.accelerationY += addy;
                }

            }
        },
        draw: function (gengine) {
            var base = this;


            var x = base.traits.x;
            var y = base.traits.y;
            var radius = base.traits.radius;



            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius,
                line_width: 3,
                stroke_style: 'green',
                fill_style: base.traits.color
            });

            var context = base.layer.game.context;
            context.lineWidth = 2;
            context.strokeStyle = "blue";
            context.beginPath();
            context.moveTo(base.forceLine.origin.x, base.forceLine.origin.y);
            context.lineTo(base.forceLine.dest.x, base.forceLine.dest.y);
            context.moveTo(base.forceLine.origin.x, base.forceLine.origin.y);
            context.lineTo(base.unforceLine.dest.x, base.unforceLine.dest.y);
            context.stroke();


        }
    });

    return Planet;
});