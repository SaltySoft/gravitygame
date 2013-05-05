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
                var distance = base.distanceTo(object);

                var force = base.gravityTo(object);
                var unit = base.unitVectorTo(object);
                var unitx = unit.x;
                var unity = unit.y;

                var g = base.gravityVectorTo(object);
                var addx = g.x;
                var addy = g.y;

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



                if (Math.abs(distance - base.traits.radius - 10) <= 2) {
                    base.traits.color = "green";
                    object.state = Player.states.WALKING;
                    object.current_planet = base;
                } else {
                    base.traits.color = "red";
                    if (object.state == Player.states.FLYING) {
                        object.traits.accelerationX += addx;
                        object.traits.accelerationY += addy;
                    }

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