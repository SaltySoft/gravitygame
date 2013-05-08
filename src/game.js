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
            $("html").css("padding", "0px");
            $("body").css("padding", "0px");
            $("html").css("margin", "0px");
            $("body").css("margin", "0px");
            base.canvas = document.createElement("canvas");
            $(base.canvas).css("background-color", "black");
            base.canvas.width = $(document).width() - 15;
            base.canvas.height = $(document).height() - 15;

            base.layers = [];
            $(container).append(base.canvas);
            base.context = base.canvas.getContext('2d');
            var game_layer = GameLayer.init(base)
            base.addLayer(game_layer);
            if (window.mozRequestAnimationFrame)
                base.anfunc = window.mozRequestAnimationFrame;
            else if (window.requestAnimationFrame)
                base.anfunc = window.requestAnimationFrame;
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
                base.anfunc.call(window, base.animate.bind(base));


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