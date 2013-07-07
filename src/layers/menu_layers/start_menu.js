define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("Gravity game", 0.5, 0.5, 0, -50, true);
            base.addButton("New game", 0.5, 0.5, -75, -33, 150, 30, "#BF3030", function () {
                base.game.clearLayers();
                base.game.newGame();
            });
            base.addButton("Toggle music", 0.5, 0.5, -75, 33, 150, 30, "#BF3030", function () {
                if (base.game.music_playing) {
                    base.game.stopMusic();
                } else {
                    base.game.startMusic();
                }
            });

            base.addButton("Vol-", 0.5, 0.5, -75, 66, 74, 30, "#BF3030", function () {
                base.game.volumeDown();
            });
            base.addButton("Vol+", 0.5, 0.5, 0, 66, 74, 30, "#BF3030", function () {
                base.game.volumeUp();
            });
        }
    });

    return StartMenu;
});