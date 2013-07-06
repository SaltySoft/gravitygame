define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("Pause menu",  base.game.canvas.width / 2,  base.game.canvas.height / 2 - 400, true);
            base.addText("Current score : " + base.game.score,  base.game.canvas.width / 2,  base.game.canvas.height / 2 - 300, true);
            base.addButton("Resume",  base.game.canvas.width / 2 - 100, base.game.canvas.height / 2 - 200, 200, 50, "#BF3030", function () {
                base.game.popLayer();
            });
            base.addButton("Main menu",  base.game.canvas.width / 2 - 100, base.game.canvas.height / 2 - 150, 200, 50, "#BF3030", function () {
                base.game.startMenu();
            });

        }
    });

    return StartMenu;
});