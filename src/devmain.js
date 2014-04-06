requirejs.config({
    baseUrl: './src',
    paths: {
        'jquery': '../libs/jquery',
        'class': '../libs/class',
        'vector': '../layers/game_layer/vector',
        'amplify': '../libs/amplify.min'
    },
    shim: {}
});

requirejs([
    'jquery',
    './game'
], function($, Game) {
    if (typeof Object.create !== "function")
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };

    var container = $("#container");

    var game = Game.init(container);

    game.run();

});