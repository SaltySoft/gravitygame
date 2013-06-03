define([
    'jquery',
    'class'
], function ($, Class) {
    var InputsEngine = Class.create();


    InputsEngine.extend({

    });
    InputsEngine.include({
        init: function (layer) {
            var base = this;
            base.layer = layer;
            base.pressed_keys = [];
            base.pressed_buttons = [];
            base.mouse_move = {
                x: 0,
                y: 0
            };

            base.mouse_position = {
                x: layer.game.canvas.width / 2,
                y: layer.game.canvas.height / 2
            };

            base.mouse_position_scr = {
                x: layer.game.canvas.width / 2,
                y: layer.game.canvas.height / 2
            }
            $("body").keydown(function (e) {
                if ($.inArray(e.keyCode, base.pressed_keys) == -1) {
                    base.pressed_keys.push(e.keyCode);
                }

            });
            $("body").keyup(function (e) {
                base.pressed_keys.push(e.keyCode);
                var new_pressed_keys = [];
                for (var k in base.pressed_keys) {
                    if (base.pressed_keys[k] != e.keyCode) {
                        new_pressed_keys.push(base.pressed_keys[k]);
                    }
                }
                base.pressed_keys = new_pressed_keys;
            });
            $(layer.game.canvas).mousedown(function (e) {
                if ($.inArray(e.which, base.pressed_buttons) == -1)
                    base.pressed_buttons.push(e.which);
            });

            $(layer.game.canvas).mouseup(function (e) {
                var new_pressed_keys = [];
                for (var k in base.pressed_buttons) {
                    if (base.pressed_buttons[k] != e.which) {
                        new_pressed_keys.push(base.pressed_buttons[k]);
                    }
                }
                base.pressed_buttons = new_pressed_keys;
            });
//            base.last_position = {
//                x: 0,
//                y: 0
//            };
//            base.scr_last_position = {
//                x: 0,
//                y: 0
//            };
//            base.scr_mouse_position = {
//                x: 0,
//                y: 0
//            };
//
//            base.scr_mouse_move = {
//                x: 0,
//                y: 0
//            };
//            $(layer.game.canvas).mousemove(function (e) {
//                base.scr_mouse_position = {
//                    x: e.pageX - $(base.layer.game.canvas).offset().left,
//                    y: e.pageY - $(base.layer.game.canvas).offset().top
//                };
//
//
//                base.mouse_position = {
//                    x: (e.pageX - $(base.layer.game.canvas).offset().left) / base.layer.camera.zoom + base.layer.camera.x,
//                    y: (e.pageY - $(base.layer.game.canvas).offset().top) / base.layer.camera.zoom + base.layer.camera.x
//                };
//
//                base.mouse_move = {
//                    x: base.mouse_position.x - base.last_position.x,
//                    y: base.mouse_position.y - base.last_position.y
//                };
//
//                base.scr_mouse_move = {
//                    x: base.scr_mouse_position.x - base.scr_last_position.x,
//                    y: base.scr_mouse_position.y - base.scr_last_position.y
//                };
//
//            });
            base.lockMouse();
            $(layer.game.canvas).click(function () {
                base.requestLocks();
            });

        },
        keyPressed: function (keyCode) {
            var base = this;

            var contained = false;
            for (var k in base.pressed_keys) {
                if (base.pressed_keys[k] == keyCode) {
                    contained = true;
                }
            }
            return contained;
        },
        buttonPressed: function (button) {
            var base = this;
            var contained = false;
            for (var k in base.pressed_buttons) {
                if (base.pressed_buttons[k] == button) {
                    contained = true;
                }
            }
            return contained;
        },
        run: function () {
            var base = this;
            var camera = base.layer.camera;
            base.mouse_position = {
                x: (base.mouse_position_scr.x / base.layer.camera.zoom + camera.x),
                y: (base.mouse_position_scr.y / base.layer.camera.zoom + camera.y)
            };

        },
        fullscreenChange: function () {
            var base = this;
            var elem = base.layer.game.canvas;
            if (document.webkitFullscreenElement === elem ||
                document.mozFullscreenElement === elem ||
                document.mozFullScreenElement === elem) { // Older API upper case 'S'.
                // Element is fullscreen, now we can request pointer lock
                elem.requestPointerLock = elem.requestPointerLock ||
                    elem.mozRequestPointerLock ||
                    elem.webkitRequestPointerLock;
                elem.requestPointerLock();
            }
            base.layer.game.resetSize();
        },
        pointerLockChange: function () {
            var base = this;

            var elem = base.layer.game.canvas;
            if (document.mozPointerLockElement === elem ||
                document.webkitPointerLockElement === elem) {
            }
        },
        lockMouse: function () {
            var base = this;
            var elem = base.layer.game.canvas;

            if (!base.locked) {
                document.addEventListener("mousemove", function (e) {
                    var movementX = e.movementX ||
                            e.mozMovementX ||
                            e.webkitMovementX ||
                            0,
                        movementY = e.movementY ||
                            e.mozMovementY ||
                            e.webkitMovementY ||
                            0;
                    base.mouse_move = {
                        x: movementX,
                        y: movementY
                    };
                    if (base.mouse_position_scr.x + movementX > 0 && base.mouse_position_scr.x + movementX < base.layer.game.canvas.width)
                        base.mouse_position_scr.x += movementX;
                    if (base.mouse_position_scr.y + movementY > 0 && base.mouse_position_scr.y + movementY < base.layer.game.canvas.height)
                        base.mouse_position_scr.y += movementY;
                }, false);
            }

            base.locked = true;
            document.addEventListener('fullscreenchange', $.proxy(base.fullscreenChange, base), false);
            document.addEventListener('mozfullscreenchange', $.proxy(base.fullscreenChange, base), false);
            document.addEventListener('webkitfullscreenchange', $.proxy(base.fullscreenChange, base), false);

            document.addEventListener('pointerlockchange', $.proxy(base.pointerLockChange, base), false);
            document.addEventListener('mozpointerlockchange', $.proxy(base.pointerLockChange, base), false);
            document.addEventListener('webkitpointerlockchange', $.proxy(base.pointerLockChange, base), false);

            // Start by going fullscreen with the element.  Current implementations
            // require the element to be in fullscreen before requesting pointer
            // lock--something that will likely change in the future.

        },
        requestLocks: function () {
            var base = this;
            var elem = base.layer.game.canvas;
//            if (base.mouse_position_scr.x > base.layer.game.canvas.width - 500 && base.mouse_position_scr.y > base.layer.game.canvas.height - 500) {
//                elem.requestFullscreen = elem.requestFullscreen ||
//                    elem.mozRequestFullscreen ||
//                    elem.mozRequestFullScreen || // Older API upper case 'S'.
//                    elem.webkitRequestFullscreen;
//                elem.requestFullscreen();
//
//            }

            elem.requestPointerLock = elem.requestPointerLock ||
                elem.mozRequestPointerLock ||
                elem.webkitRequestPointerLock;
            // Ask the browser to lock the pointer
            elem.requestPointerLock();
        },
        draw: function () {
            var base = this;
//            if (base.pressed_buttons.length > 0)
            base.layer.graphics_engine.drawCircle({
                x: base.mouse_position.x,
                y: base.mouse_position.y,
                fill_style: "white",
                radius: 5 / base.layer.camera.zoom
            });
        }
    });


    return InputsEngine;
});