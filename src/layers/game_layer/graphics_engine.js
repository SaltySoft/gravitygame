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

        },

        run: function () {
            var base = this;
            var canvas = base.layer.game.canvas;
            base.context = base.layer.game.context;
            base.context.clearRect(0, 0, canvas.width, canvas.height);
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
            context.beginPath();
            context.arc(params.x - base.layer.camera.x, params.y - base.layer.camera.y, params.radius, 0, 2 * Math.PI, false);
            if (params.fill_style)
                context.fillStyle = params.fill_style;
            else
                context.fillStyle = 'gray';

            context.fill();
            if (params.line_width)
                context.lineWidth = params.line_width;
            else
                context.lineWidth = 1;
            if (params.stroke_style)
                context.strokeStyle = params.stroke_style;
            else
                context.strokeStyle = "#000000";
            if (params.line_width)
                context.stroke();
            if (params.angle !== undefined ) {
                context.beginPath();
                context.moveTo(params.x - base.layer.camera.x, params.y - base.layer.camera.y);
                var x = Math.cos(params.angle) * params.radius;
                var y = Math.sin(params.angle) * params.radius;
                context.lineTo(params.x - base.layer.camera.x + x, params.y - base.layer.camera.y + y);
                context.strokeStyle = "black";
                context.lineWidth = 3;
                context.stroke();
            }


        },
        drawImage: function () {

        }
    });


    return GraphicsEngine
});