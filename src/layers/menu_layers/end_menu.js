define([
    'class',
    '../menu_layer'
], function (Classe, MenuLayer) {
    var EndMenu = MenuLayer.create();

    EndMenu.include({
        menu_init: function () {
            var base = this;

            base.addText("You won",  base.game.canvas.width / 2,  base.game.canvas.height / 2 - 300, true);
            base.addText("Your score : " + base.game.score + " points",  base.game.canvas.width / 2,  base.game.canvas.height / 2 - 200, true);
            base.addButton("New game",  base.game.canvas.width / 2 - 100, base.game.canvas.height / 2, 200, 50, "#BF3030", function () {
                base.game.clearLayers();
                base.game.newGame();
            });

            base.addButton("Main menu",  base.game.canvas.width / 2 - 100, base.game.canvas.height / 2 + 60, 200, 50, "#BF3030", function () {
                base.game.startMenu();
            });
            console.log(base.game.score);
        }
    });

    return EndMenu;
});