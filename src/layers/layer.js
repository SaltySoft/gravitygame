define([
    'class'
], function (Class) {
    var Layer = Class.create();

    Layer.include({
        init: function (game) {
            var base = this;
            base.game = game;
            base.initializeLayer();
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
        }
    });

    return Layer;
});