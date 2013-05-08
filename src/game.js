define([
    'jquery',
    'class',
    './layers/game_layer'
], function ($, Class, GameLayer) {
    var Game = Class.create();

    Game.extend({
        layers: []
    });
    Game.include({
        init: function (container) {
            var base = this;

            base.canvas = document.createElement("canvas");
            base.canvas.width = 1000;
            base.canvas.height = 1000;

            base.layers = [];
            $(container).append(base.canvas);
            base.context = base.canvas.getContext('2d');
            var game_layer = GameLayer.init(base)
            base.addLayer(game_layer);
        },
        addLayer: function (layer) {
            this.layers.push(layer);
        },
        popLayer: function () {
            this.layers.pop();
        },
        animate: function (timestamp) {
            var base = this;

            setTimeout(function () {
                window.requestAnimationFrame(base.animate.bind(base));
                base.layers[base.layers.length - 1].run();
            }, 1);

        },
        run: function () {
            var base = this;
            base.animate();
        }
    });

    return Game;
});