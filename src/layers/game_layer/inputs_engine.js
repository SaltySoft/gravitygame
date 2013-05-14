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
                x: 0,
                y: 0
            };
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
            base.last_position = {
                x: 0,
                y: 0
            };
            base.scr_last_position = {
                x: 0,
                y: 0
            };
            base.scr_mouse_position = {
                x: 0,
                y: 0
            };

            base.scr_mouse_move = {
                x: 0,
                y: 0
            };
            $(layer.game.canvas).mousemove(function (e) {
                base.scr_mouse_position = {
                    x: e.pageX - $(base.layer.game.canvas).offset().left,
                    y: e.pageY - $(base.layer.game.canvas).offset().top
                };


                base.mouse_position = {
                    x: (e.pageX - $(base.layer.game.canvas).offset().left) / base.layer.camera.zoom + base.layer.camera.x,
                    y: (e.pageY - $(base.layer.game.canvas).offset().top) / base.layer.camera.zoom + base.layer.camera.x
                };

                base.mouse_move = {
                    x: base.mouse_position.x - base.last_position.x,
                    y: base.mouse_position.y - base.last_position.y
                };

                base.scr_mouse_move = {
                    x: base.scr_mouse_position.x - base.scr_last_position.x,
                    y: base.scr_mouse_position.y - base.scr_last_position.y
                };

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
            if (base.mouse_position.x == base.last_position.x && base.mouse_position.y == base.last_position.y) {
                base.mouse_move = {
                    x: 0,
                    y: 0
                };
            }

            if (base.scr_mouse_position.x == base.scr_last_position.x && base.scr_mouse_position.y == base.scr_last_position.y) {
                base.scr_mouse_move = {
                    x: 0,
                    y: 0
                };
            }
            base.last_position = base.mouse_position;
            base.scr_last_position = base.scr_mouse_position;
        }
    });


    return InputsEngine
});