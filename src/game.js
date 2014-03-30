define([
    'jquery',
    'class',
    './layers/game_layer',
    './layers/menu_layer',
    './layers/menu_layers/start_menu',
    './layers/menu_layers/end_menu',
    './layers/menu_layers/scores_menu',
    'amplify'
], function($, Class, GameLayer, MenuLayer, StartMenu, EndMenu, ScoreMenu) {
    var Game = Class.create();

    Game.extend({
        layers: []
    });
    Game.include({
        init: function(container) {
            var base = this;
            base.focused = false;
            base.debugging = true;
            $("html").css("padding", "0px");
            $("body").css("padding", "0px");
            $("html").css("margin", "0px");
            $("body").css("margin", "0px");
            $("html").css("overflow", "hidden");
            $("body").css("overflow", "hidden");
            base.sound_container = $(".sound");

            base.canvas = document.createElement("canvas");
            base.context = base.canvas.getContext("2d");
            $(base.canvas).css("background-color", "black");

            base.resetSize();
            $(base.canvas).attr("oncontextmenu", "return false;");
            $(document).css("overflow", "hidden");
            $(window).resize(function() {
                base.resetSize();



            });
            base.layers = [];
            $(container).append(base.canvas);
            base.context = base.canvas.getContext('2d');
            if (window.mozRequestAnimationFrame)
                base.anfunc = window.mozRequestAnimationFrame;
            else if (window.requestAnimationFrame)
                base.anfunc = window.requestAnimationFrame;
            base.score = 0;

            base.startMenu();
            base.current_music = 0;
            base.music_playing = false;
            if (base.sound_container) {
                base.sound_container.bind("ended", function() {
                    base.current_music++;
                    base.current_music %= 3;
                    base.sound_container.html('<source src="resources/music/circus_' + base.current_music + '.mp3" type="audio/mpeg">');
                    base.sound_container[0].volume = 0.2;
                    base.sound_container[0].play();
                });
            }
            base.volume = 0.2;
            if (!amplify.store("music_off"))
                base.startMusic();
        },
        resetSize: function() {
            var base = this;
            var oldw = base.canvas.width;
            var oldh = base.canvas.height;
            base.canvas.width = $(document).width();
            base.canvas.height = $(window).height();

            var widthchange = base.canvas.width - oldw;
            var heightchange = base.canvas.height - oldh;

            for (var k in base.layers) {
                base.layers[k].resetSize(widthchange, heightchange);
            }
        },
        startMenu: function() {
            var base = this;
            base.clearLayers();

            var layer = StartMenu.init(base);
            base.addLayer(layer);
        },
        scoresMenu: function() {
            var base = this;
            var layer = ScoreMenu.init(base);
            base.addLayer(layer);
        },
        won: function(score) {
            var base = this;
            base.score = score;
            base.running = true;
            var layer = EndMenu.init(base);
            base.addLayer(layer);
        },
        startMusic: function() {
            var base = this;

            if (base.sound_container) {
                base.music_playing = true;
                base.sound_container.html('<source src="resources/music/circus_' + base.current_music + '.mp3" type="audio/mpeg">');
                base.sound_container[0].volume = base.volume;

                base.sound_container[0].play();
                amplify.store("music_off", false);
            }
        },
        volumeDown: function() {
            var base = this;
            base.volume -= 0.05;
            if (base.volume < 0) {
                base.volume = 0;
            }
            if (base.sound_container) {
                base.sound_container[0].volume = base.volume;
            }
        },
        volumeUp: function() {
            var base = this;
            base.volume += 0.05;
            if (base.volume > 1) {
                base.volume = 1;
            }
            if (base.sound_container) {
                base.sound_container[0].volume = base.volume;
            }
        },
        stopMusic: function() {
            var base = this;
            if (base.sound_container) {
                base.sound_container[0].pause();
                base.music_playing = false;
                amplify.store("music_off", true);
            }
        },
        newGame: function() {
            var base = this;
            var game_layer = GameLayer.init(base)
            base.addLayer(game_layer);
        },
        clearLayers: function() {
            var base = this;
            base.layers = [];
        },
        addLayer: function(layer) {
            this.layers.push(layer);
        },
        popLayer: function() {
            this.layers.pop();
        },
        animate: function(timestamp) {
            var base = this;

            setTimeout(function() {
                base.anfunc.call(window, base.animate.bind(base));
                base.context.clearRect(0, 0, base.canvas.width, base.canvas.height);
                for (var k in base.layers) {
                    var last = false;
                    if (k == base.layers.length - 1) {
                        last = true;
                    }
                    base.layers[k].run(last);
                }
            }, 1);

        },
        run: function() {
            var base = this;
            base.animate();
        }
    });

    return Game;
});