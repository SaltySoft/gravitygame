define([
    'class',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine'
], function (Class, InputsEngine, PhysicsEngine, GraphicsEngine) {
    var Layer = Class.create();

    Layer.include({
        init: function (game) {
            var base = this;
            base.game = game;

            base.game = game;
            base.camera = {
                x: 0,
                y: 0,
                distance: 100,
                speedX: 0,
                speedY: 0,
                zoom: 1
            };
            base.inputs_engine = InputsEngine.init(base);
            base.physics_engine = PhysicsEngine.init(base);
            base.graphics_engine = GraphicsEngine.init(base);

            base.texts = [];
            base.photos = [];
            base.buttons = [];
            if (game.running) {
                base.inputs_engine.requestLocks();
            }
            base.elements = [];

            base.initializeLayer(game);
        },
        initializeLayer: function () {
        },
        inputs: function () {
        },
        physics: function () {
        },
        draw: function () {
        },
        logic: function () {
        },
        run: function (last) {
            var base = this;
            if (last) {
                base.inputs();
                base.logic();
                base.physics();
            }
            base.draw();
            base.drawOverlays();
            base.layerRun(last);
        },
        resetSize: function (widthchange, heightchange) {
            var base = this;

        },
        layerRun: function (last) {
        },
        drawText: function (text, x, y, ofx, ofy, centered, color, font) {
            var base = this;

            var x = x * base.game.canvas.width;
            var y = y * base.game.canvas.height;

            color = color ? color : "white";
            font = "normal 18px verdana";

            var context = base.game.context;
            context.fillStyle = color;
            context.font = font;
            if (centered) {
                var metrics1 = context.measureText(text);
                x = x - metrics1.width / 2;
            }

            context.fillText(text, x + ofx, y + ofy);
        },
        drawButton: function (element) {
            var base = this;
            var context = base.game.context;

            var mx = base.inputs_engine.mouse_position_scr.x;
            var my = base.inputs_engine.mouse_position_scr.y;

            var x = element.x * base.game.canvas.width + element.ofx;
            var y = element.y * base.game.canvas.height + element.ofy;
            var width = element.width;
            var height = element.height;

            if (mx > x && mx < x + width && my > y && my < y + height) {
                context.fillStyle = "gray";
                if (base.inputs_engine.buttonPressed(1) && !element.active) {
                    element.active = true;
                }
                if (!base.inputs_engine.buttonPressed(1) && element.active) {
                    element.active = false;
                    if (element.callback) {
                        element.callback();
                    }
                }


            } else {
                context.fillStyle = element.color;
                element.active = false;
            }
            if (element.active) {
                context.fillStyle = "#225E79";
            }

            context.fillRect(x, y, width, height);
            base.drawText(element.text, element.x, element.y, element.ofx + width / 2, element.ofy + height - 9, true);

        },
        drawOverlays: function () {
            var base = this;
            if (base.is_menu)
                base.graphics_engine.drawCache();

            for (var k in base.elements) {
                var element = base.elements[k];

                if (element.type === "text") {
                    base.drawText(element.text, element.x, element.y, element.ofx, element.ofy, element.centered, element.color, element.font);
                }
                if (element.type === "button") {
                    base.drawButton(element);
                }
            }
            base.inputs_engine.draw();
        },
        addImage: function (resource, x, y, width, height) {

        },
        addText: function (text, x, y, ofx, ofy, centered, color, font) {
            var base = this;

            base.elements.push({
                type: "text",
                text: text,
                centered: centered,
                x: x,
                y: y,
                ofx: ofx,
                ofy: ofy,
                font: font,
                color: color
            });
        },
        inputs: function () {
            var base = this;
            base.inputs_engine.run();
        },
        addButton: function (text, x, y, ofx, ofy, width, height, color, callback) {
            var base = this;

            base.elements.push({
                type: "button",
                text: text,
                width: width,
                height: height,
                x: x,
                y: y,
                ofx: ofx,
                ofy: ofy,
                color: color,
                callback: callback
            });
        }
    });

    return Layer;
});