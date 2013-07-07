define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var StartMenu = MenuLayer.create();

    StartMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("Gravity game", 0.5, 0.5, 0, -50, true);
            base.addButton("New game", 0.5, 0.5, -75, 0, 150, 30, "#BF3030", function () {
                base.game.clearLayers();
                base.game.newGame();
            });
        }
    });

    return StartMenu;
});