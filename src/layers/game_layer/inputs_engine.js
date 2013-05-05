define([
    'class'
], function (Class) {
    var InputsEngine = Class.create();


    InputsEngine.extend({

    });
    InputsEngine.include({
        init: function (layer) {
            var base = this;
            base.layer = layer;
        },
        run: function () {

        }
    });


    return InputsEngine
});