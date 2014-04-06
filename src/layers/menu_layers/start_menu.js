define([
    'class',
    '../menu_layer'
], function(Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function() {
            var base = this;

            base.addText("You're the only survivor from a former great alien race", 0.5, 1, 0, -80, true);
            base.addText("Click the New game button to bring life to a new solar system", 0.5, 1, 0, -60, true);

            base.addText("Gravity game", 0.5, 0.5, 0, -80, true);
            base.addButton("New game", 0.5, 0.5, -75, -66, 150, 30, "#BF3030", function() {
                base.game.clearLayers();
                base.game.newGame();
            });
            base.addButton("Scores", 0.5, 0.5, -75, -33, 150, 30, "#BF3030", function() {

                base.game.scoresMenu();
            });

            base.addButton("Toggle music", 0.5, 0.5, -75, 33, 150, 30, "#BF3030", function() {
                if (base.game.music_playing) {
                    base.game.stopMusic();
                } else {
                    base.game.startMusic();
                }
            });

            base.addButton("Vol-", 0.5, 0.5, -75, 66, 74, 30, "#BF3030", function() {
                base.game.volumeDown();
            });
            base.addButton("Vol+", 0.5, 0.5, 0, 66, 74, 30, "#BF3030", function() {
                base.game.volumeUp();
            });

            base.bg = new Image();
            base.bg.src = "resources/menu.png";
            base.bg_width = 0;
            base.bg_height = 0;
            base.offx = 0;
            base.offy = 0;
            $(base.bg).load(function() {
                base.resetSize();
            });
        },
        drawBackground: function() {
            var base = this;

            var ctx = base.game.context;

            ctx.drawImage(base.bg, base.offx, base.offy);
        },
        resetSize: function(widthchange, heightchange) {
            var base = this;
            var dd = $(document);

            base.offy = dd.height() / 2 - base.bg.height / 2;
            base.offx = dd.width() / 2 - base.bg.width / 2;
        }
    });

    return StartMenu;
});