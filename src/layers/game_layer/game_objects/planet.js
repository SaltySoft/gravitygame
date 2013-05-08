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
            for (var k in layer.mobile_objects) {
                var object = layer.mobile_objects[k];
                var distance = base.distanceTo(object);
                var main_grav = false;
                if (distance < object.closest_distance || object.closest_distance == -1) {
                    main_grav = true;
                    object.closest_distance = distance;
                }
                if (main_grav && !layer.inputs_engine.keyPressed(32)) {

                    var force = base.gravityTo(object);
                    var unit = base.unitVectorTo(object);
                    var unitx = unit.x;
                    var unity = unit.y;

                    var g = base.gravityVectorTo(object);
                    var addx = g.x;
                    var addy = g.y;

                    var screen_pos = object.getScreenPos();
                    var lineto = {
                        x: Math.round(screen_pos.x + (force * unitx) * 10000),
                        y: Math.round(screen_pos.y + (force * unity) * 10000)
                    };

                    base.forceLine = {
                        origin: screen_pos,
                        dest: lineto
                    };

                    base.unforceLine = {
                        origin: $.extend(true, {}, screen_pos),
                        dest: $.extend(true, {}, lineto)
                    };
                    var interval = base.traits.radius - distance;
                    var vector = {
                        x: -unit.x * interval,
                        y: -unit.y * interval
                    };

                    var tangent = {
                        x: -unit.y,
                        y: unit.x
                    };


                    var angle = Math.atan(tangent.y / tangent.x);
                    if (base.traits.y > object.traits.y)
                        object.traits.angle = angle + Math.PI;
                    else
                        object.traits.angle = angle;

                    if (distance <= base.traits.radius) {
                        base.traits.color = "green";
                        var speed = object.calcSpeed(object.traits.speedX + addx, object.traits.speedY + addy);
                        object.traits.x -= speed * unit.x;
                        object.traits.y -= speed * unit.y;
                    } else {
                        base.traits.color = "red";
                    }
                    object.traits.accelerationX += addx;
                    object.traits.accelerationY += addy
                    if (base.traits.radius + 200 > distance) {
                        object.traits.speedX *= 0.95 + (0.05 * (distance) / (base.traits.radius + 200));
                        object.traits.speedY *= 0.95 + (0.05 * (distance) / (base.traits.radius + 200));
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
                radius:  + 200,
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