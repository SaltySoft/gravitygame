define([
    'class',
    '../menu_layer',
    'amplify'
], function (Class, MenuLayer) {
    var ScoresMenu = MenuLayer.create();

    ScoresMenu.include({
        menu_init: function () {
            var base = this;
            base.inputs_engine.requestLocks();
            base.addText("High Scores", 0.5, 0.5, 0, -100, true);

            var scores = amplify.store("gravitygame_scores");
            if (scores) {
                for (var i = 0; i < (scores.length > 10 ? 10 : scores.length); i++) {
                    var date = new Date(scores[i].date);
                    var score = scores[i].score;
                    base.addText((date.getDate() < 10 ? "0" : "") +  date.getDate() + "/" +
                        (date.getMonth() < 10 ? "0" : "") + date.getMonth() + "/" +
                        date.getFullYear() + " at " +
                        (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() +
                        " --- " + Math.round(score) +  " points"
                        , 0.5, 0.5, 0, -60 +  i * 20, true);
                }
            } else {
                base.addText("No scores yet", 0.5, 0.5, 0, -50, true);
            }


            base.addButton("Main menu", 0.5, 0.7,-75, 0, 150, 30, "#BF3030", function () {
                base.game.popLayer();
            });

            base.bg = new Image();
            base.bg.src = "resources/menu.png";
            base.bg_width = 0;
            base.bg_height = 0;
            base.offx = 0;
            base.offy = 0;
            $(base.bg).load(function () {
                base.resetSize();
            });

        },
        drawBackground: function () {
            var base = this;

            var ctx = base.game.context;

            ctx.drawImage(base.bg, base.offx, base.offy);
        },
        resetSize: function (widthchange, heightchange) {
            var base = this;
            var dd = $(document);

            base.offy = dd.height() / 2 - base.bg.height / 2;
            base.offx = dd.width() / 2 - base.bg.width / 2;
        }
    });

    return ScoresMenu;
});