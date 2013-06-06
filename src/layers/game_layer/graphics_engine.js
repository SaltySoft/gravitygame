define([
    'class'
], function (Class) {
    var GraphicsEngine = Class.create();


    GraphicsEngine.extend({

    });
    GraphicsEngine.include({
        init: function (layer) {
            var base = this;
            base.layer = layer;
            base.camera = layer.camera;
            base.images = [];
        },

        run: function () {
            var base = this;
            var canvas = base.layer.game.canvas;
            base.context = base.layer.game.context;

            for (var k in base.layer.objects) {
                if (base.layer.objects[k].predraw)
                    base.layer.objects[k].predraw(base);
            }
            for (var k in base.layer.objects) {
                base.layer.objects[k].draw(base);
            }
        },
        drawCircle: function (params) {
            var base = this;

            var context = base.context;

            var zoom = base.camera.zoom;

            if (params.fill_style)
                context.fillStyle = params.fill_style;
            else
                context.fillStyle = 'gray';


            if (params.line_width)
                context.lineWidth = params.line_width;
            else
                context.lineWidth = 1;
            if (params.stroke_style !== undefined)
                context.strokeStyle = params.stroke_style;
            else
                context.strokeStyle = "#FFFFFF";

            if (params.line_width) {
                context.beginPath();
                context.arc(params.x * zoom - base.layer.camera.x * zoom, params.y * zoom - base.layer.camera.y * zoom, params.radius * zoom, 0, 2 * Math.PI, false);
                context.stroke();
                context.closePath();
            }
            if (params.fill_style) {
                context.beginPath();
                context.arc(params.x * zoom - base.layer.camera.x * zoom, params.y * zoom - base.layer.camera.y * zoom, params.radius * zoom, 0, 2 * Math.PI, false);
                context.fill();
                context.closePath();
            }

            if (params.angle !== undefined) {
                context.beginPath();
                context.moveTo((params.x - base.layer.camera.x) * zoom, (params.y - base.layer.camera.y) * zoom);
                var x = Math.cos(params.angle) * params.radius;
                var y = Math.sin(params.angle) * params.radius;
                context.lineTo((params.x - base.layer.camera.x + x) * zoom, (params.y - base.layer.camera.y + y) * zoom);
                context.strokeStyle = "black";
                context.lineWidth = 3;
                context.stroke();
            }


        },
        beginPath: function () {
            var base = this;
            base.context.beginPath();
        },
        moveTo: function (vector) {
            var base = this;
            var context = base.context;

            context.moveTo((vector.x - base.camera.x) * base.camera.zoom, (vector.y - base.camera.y) * base.camera.zoom);
//            context.moveTo(vector.x, vector.y);
        },
        lineTo: function (vector, color, line_width) {
            var base = this;
            var context = base.context;

            context.lineWidth = line_width !== undefined ? line_width : 3;
            context.strokeStyle = color !== undefined ? color : "green";
            context.lineTo((vector.x - base.camera.x) * base.camera.zoom, (vector.y - base.camera.y) * base.camera.zoom);
            context.stroke();
        },
        arcTo: function (from, to, color, line_width) {
            var base = this;
            var context = base.context;
            context.lineWidth = line_width !== undefined ? line_width : 3;
            context.strokeStyle = color !== undefined ? color : "green";
            context.arcTo(from.x, from.y, to.x, to.y, 2);
            context.stroke();

        },
        drawImage: function (name, x, y, width, height, startx, starty, ssizex, ssizey) {
            var base = this;
            var context = base.context;
            if (base.images[name] === undefined) {
                var image = new Image();
                image.src = "resources/" + name;
                base.images[name] = image;

            } else {
                var image = base.images[name];
            }

            width = width ? width : image.width;
            height = height ? height : image.height;
            startx = startx ? startx : 0;
            starty = starty ? starty : 0;
            ssizex = ssizex ? ssizex : 0;
            ssizey = ssizey ? ssizey : 0;

            context.drawImage(image,
                startx,
                starty,
                ssizex,
                ssizey,
                (x - base.camera.x) * base.camera.zoom - width * base.camera.zoom / 2,
                (y - base.camera.y) * base.camera.zoom - height * base.camera.zoom / 2,
                width * base.camera.zoom,
                height * base.camera.zoom
            );
//            context.drawImage(image, 0, 0);
        },
        createRadialGradient: function (x, y, radius, color1, color2) {
            var base = this;
            var ctx = this.context;
            var rad = ctx.createRadialGradient((x - base.camera.x) * base.camera.zoom, (y - base.camera.y) * base.camera.zoom, radius * base.camera.zoom, (x - base.camera.x) * base.camera.zoom, (y - base.camera.y) * base.camera.zoom, 0);
            rad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            rad.addColorStop(0.5, color2);
            rad.addColorStop(1, color1);
            return rad;
        },
        closePath: function () {
            var base = this;
            base.context.closePath();
        }
    });


    return GraphicsEngine
});