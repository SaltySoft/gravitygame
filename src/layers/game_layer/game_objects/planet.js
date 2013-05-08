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
                    object.closest_planet = base;
                }
                if (!layer.inputs_engine.keyPressed(32)) {

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

                    if (main_grav) {
                        var angle = Math.atan(tangent.y / tangent.x);
                        object.addAngle(angle);
                        object.addCenter({
                            x: base.traits.x,
                            y: base.traits.y
                        });
                    }

                    if (distance < base.traits.radius + 500) {


                        object.traits.accelerationX += addx;
                        object.traits.accelerationY += addy
                        if (base.traits.radius + 50 > distance) {
                            object.traits.speedX *= 0.95 + (0.05 * (distance) / (base.traits.radius + 100));
                            object.traits.speedY *= 0.95 + (0.05 * (distance) / (base.traits.radius + 100));
                        }
                        if (distance < base.traits.radius) {
                            base.traits.color = "green";
                        } else {
                            base.traits.color = "red";
                        }
                    }


                }
            }
        },
        predraw: function (gengine) {
            var base = this;
            var x = base.traits.x;
            var y = base.traits.y;
            var radius = base.traits.radius;
            var ctx = base.layer.game.context;
            var screen_pos = base.getScreenPos();
            var radgrad = ctx.createRadialGradient(screen_pos.x, screen_pos.y, radius + 500, screen_pos.x, screen_pos.y, 0);
            radgrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            radgrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.2)');
            radgrad.addColorStop(1, 'rgba(255, 255, 255, 0.7)');


            gengine.drawCircle({
                x: x,
                y: y,
                radius: radius + 500,
                fill_style: radgrad
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