define([
    'class',
    '../menu_layer',
    'amplify'
], function (Classe, MenuLayer) {
    var EndMenu = MenuLayer.create();

    function compare(o1, o2) {
        return - o1.score + o2.score;
    }

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
            var scores = amplify.store("gravitygame_scores");

            if (!scores) {
                scores = [];
            }

            var current_score = {
                score: base.game.score,
                date: new Date()
            };

            scores.push(current_score);
            scores.sort(compare);

            amplify.store("gravitygame_scores", scores);
        }
    });

    return EndMenu;
});