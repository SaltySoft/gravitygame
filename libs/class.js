define([
    'jquery'
], function ($) {
//    var Class = function () {
//        var klass = function () {
//            this.init.apply(this, arguments);
//        };
//        klass.fn = klass.prototype;
//        klass.fn.parent = klass;
//
//        klass.fn.init = function () {
//        };
//
//        klass.extend = function (obj) {
//            var extended = obj.extended;
//            for (var i in obj) {
//                klass[i] = obj[i];
//            }
//            if (extended) {
//                extended(klass);
//            }
//        };
//
//        klass.include = function (obj) {
//            var included = obj.included;
//            for (var i in obj) {
//                klass.fn[i] = obj[i];
//            }
//            if (included) {
//                included(klass);
//            }
//        };
//
//        return klass;
//    };
    var Class = {
        inherited: function (object) {
        },
        created: function () {
        },
        prototype: {
            init: function () {
            },
            extend: function(o){
                var extended = o.extended;
                $.extend(this, o);
                if (extended) extended(this);
            },
            include: function(o){
                var included = o.included;
                $.extend(this.prototype, o);
                if (included) included(this);
            }
        },
        create: function () {
            var object = Object.create(this);
            object.parent = this;
            object.prototype = object.fn = Object.create(this.prototype);
            object.created();
            this.inherited(object);
            return object;
        },
        init: function () {
            var instance = Object.create(this.prototype);
            instance.parent = this;
            instance.father = instance.parent.parent.fn;
            instance.init.apply(instance, arguments);
            return instance;
        },
        extend: function(o){
            var extended = o.extended;
            $.extend(this, o);
            if (extended) extended(this);
        },
        include: function(o){
            var included = o.included;
            $.extend(this.prototype, o);
            if (included) included(this);
        }
    };

    return Class;
});