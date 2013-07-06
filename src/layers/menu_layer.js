define([
    'class',
    './layer',
    './game_layer/inputs_engine',
    './game_layer/physics_engine',
    './game_layer/graphics_engine'
], function (Class, Layer, InputsEngine, PhysicsEngine, GraphicsEngine) {
    var MenuLayer = Layer.create();

    MenuLayer.include({
        init: function (game, score) {
            var base = this;
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
            base.score = score;

            base.texts = [];
            base.photos = [];
            base.buttons = [];
            base.elements = [];
            if (game.running) {
                base.inputs_engine.requestLocks();
            }
            base.menu_init();
        },
        menu_init: function () {

        },
        logic: function () {
            var base = this;

        },
        drawText: function (text, x, y, centered, color, font) {
            var base = this;
            color = color ? color : "white";
            font = font ? font : "30px verdana";

            var context = base.game.context;
            context.fillStyle = color;
            context.font = font;
            if (centered) {
                var metrics1 = context.measureText(text);
                x = x - metrics1.width / 2;
            }

            context.fillText(text, x, y);
        },
        drawButton: function (element) {
            var base = this;
            var context = base.game.context;

            var mx = base.inputs_engine.mouse_position_scr.x;
            var my = base.inputs_engine.mouse_position_scr.y;
            if (mx > element.x && mx < element.x + element.width && my > element.y && my < element.y + element.height) {
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

            context.fillRect(element.x, element.y, element.width, element.height);
            base.drawText(element.text, element.x + element.width /2, element.y + element.height / 2 + 12, true);

        },
        draw: function () {
            var base = this;
            base.graphics_engine.drawCache();

            for (var k in base.elements) {
                var element = base.elements[k];

                if (element.type === "text") {
                    base.drawText(element.text, element.x, element.y, element.centered, element.color, element.font);
                }
                if (element.type === "button") {
                    base.drawButton(element);
                }
            }
            base.inputs_engine.draw();
        },
        addImage: function (resource, x, y, width, height) {

        },
        addText: function (text, x, y, centered, color, font) {
            var base = this;

            base.elements.push({
                type: "text",
                text: text,
                centered: centered,
                x:x,
                y:y,
                font:font,
                color: color
            });
        },
        inputs: function () {
            var base= this;
            base.inputs_engine.run();
        },
        addButton: function (text, x, y, width, height, color, callback) {
            var base = this;

            base.elements.push({
                type: "button",
                text: text,
                width: width,
                height: height,
                x:x,
                y:y,
                color: color,
                callback: callback
            });
        },
        pauseGame: function () {
            var base = this;
            base.running = false;
        },
        unPauseGame: function () {
            var base = this;
            base.running = true;
        }
    });

    return MenuLayer;
});