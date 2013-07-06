define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("Gravity game",  base.game.canvas.width / 2,  base.game.canvas.height / 2 - 300, true);
            base.addButton("New game",  base.game.canvas.width / 2 - 100, base.game.canvas.height / 2, 200, 50, "#BF3030", function () {
                base.game.clearLayers();
                base.game.newGame();
            });
        }
    });

    return StartMenu;
});