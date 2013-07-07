define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("Pause menu", 0.5, 0.5, 0, -100, true);
            base.addText("Current score : " + base.game.score, 0.5, 0.5, 0, +100, true);
            base.addButton("Resume",0.5, 0.5, -75, -83, 150, 30, "#BF3030", function () {
                base.game.popLayer();
            });
            base.addButton("Main menu", 0.5, 0.5, -75, -50, 150, 30, "#BF3030", function () {
                base.game.startMenu();
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