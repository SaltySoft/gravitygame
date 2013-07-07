define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var EndMenu = MenuLayer.create();

    EndMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("You won", 0.5, 0.5, 0, -70, true);
            base.addText("Your score : " + base.game.score + " points", 0.5, 0.5, 0, -30, true);
            base.addButton("New game", 0.5, 0.5, -75, 0, 150, 30, "#BF3030", function () {
                base.game.clearLayers();
                base.game.newGame();
            });

            base.addButton("Main menu", 0.5, 0.5, -75, 33, 150, 30, "#BF3030", function () {
                base.game.startMenu();
            });
            console.log(base.game.score);
        }
    });

    return EndMenu;
});