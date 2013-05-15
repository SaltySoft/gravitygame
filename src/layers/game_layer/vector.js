define([
    'jquery',
    'class'
], function ($, Class) {
    var Vector = Class.create();

    Vector.extend({
        add: function (vector1, vector2) {
            return {
                x: vector1.x + vector2.x,
                y: vector1.y + vector2.y
            };
        },
        substract: function (vector1, vector2) {
            return {
                x: vector1.x - vector2.x,
                y: vector1.y - vector2.y
            };
        },
        coeff_mult: function (vector, coeff) {
            return {
                x: vector.x * coeff,
                y: vector.y * coeff
            };
        },
        normalize: function (vector) {
            var size = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            return {
                x: vector.x / size,
                y: vector.y / size
            };
        },
        distance: function (vector1, vector2) {
            var vector = Vector.substract(vector2, vector1);
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        },
        lgth: function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }
    });

    return Vector;

});