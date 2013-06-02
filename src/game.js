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
            $("html").css("overflow", "hidden");
            $("body").css("overflow", "hidden");
            base.canvas = document.createElement("canvas");
            base.context = base.canvas.getContext("2d");
            $(base.canvas).css("background-color", "black");

//            $(base.canvas).css("background-image", "url('src/resources/space02.gif')");
            base.canvas.width = $(document).width();
            base.canvas.height = $(document).height();
            $(base.canvas).attr("oncontextmenu", "return false;");
            $(document).css("overflow", "hidden");
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
                base.context.clearRect(0, 0, base.canvas.width, base.canvas.height);
                if (base.layers.length > 0) {
                    base.layers[base.layers.length - 1].run();
                }
            }, 1);

        },
        run: function () {
            var base = this;
            base.animate();
        }
    });

    return Game;
});