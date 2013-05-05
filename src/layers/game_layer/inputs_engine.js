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
        run: function () {

        }
    });


    return InputsEngine
});