define([
    'class',
    './layer'
], function (Class, Layer) {
    var MenuLayer = Layer.create();

    MenuLayer.include({
        initializeLayer: function () {
            var base = this;
            base.is_menu = true;
            base.menu_init();
        },
        menu_init: function () {

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