define([
    'class'
], function (Class) {
    var PhysicsEngine = Class.create();


    PhysicsEngine.extend({

    });
    PhysicsEngine.include({
        init: function (layer) {
            var base = this;
            base.layer = layer;
        },
        run: function () {
            var base = this;
            for (var k in base.layer.objects) {
                base.layer.objects[k].physics(base.layer.game);
            }
        }
    });


    return PhysicsEngine
});