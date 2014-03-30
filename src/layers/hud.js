define([
    './layer',
    './game_layer/vector'
], function(Layer, Vector) {
    var HudLayer = Layer.create();

    HudLayer.include({
        initializeLayer: function() {
            var base = this;
        },
        setup: function(layer) {
            var base = this;
            base.layer = layer;

            var images = {};

            images.eorb = new Image();
            images.eorb.src = "resources/orb_energy.png";
            images.worb = new Image();
            images.worb.src = "resources/orb_water.png";
            images.torb = new Image();
            images.torb.src = "resources/orb_earth.png";
            images.aorb = new Image();
            images.aorb.src = "resources/orb_acid.png";
            images.norb = new Image();
            images.norb.src = "resources/orb_absent.png";
            images.battery = new Image();
            images.battery.src = "resources/battery.png";
            images.lightning = new Image();
            images.lightning.src = "resources/lightning.png";

            base.images = images;
            base.show_hints = false;
        },
        drawPlayerInformation: function() {
            var base = this;

            var canvas = base.layer.game.canvas;
            var posy = 5;
            var posx = 5;
            var height = 110;
            var width = 250;

            var ctx = base.layer.game.context;
            var player = base.layer.player;

            ctx.fillStyle = "rgba(255,255,255,0.2);";
            ctx.strokeStyle = "rgba(255,255,255,0.5);";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(posx, posy, width, height);
            ctx.fill();
            ctx.stroke();

            ctx.font = "15px verdana";
            ctx.fillStyle = "white";


            for (var i = 0; i < player.water_orbs; i++) {
                ctx.drawImage(base.images.worb, posx + 5 + i * 20, posy + 3);
            }
            while (i < 10) {
                ctx.drawImage(base.images.norb, posx + 5 + i * 20, posy + 3);
                i++;
            }
            for (var i = 0; i < player.acid_orbs; i++) {
                ctx.drawImage(base.images.aorb, posx + 5 + i * 20, posy + 23);
            }
            while (i < 10) {
                ctx.drawImage(base.images.norb, posx + 5 + i * 20, posy + 23);
                i++;
            }
            for (var i = 0; i < player.earth_orbs; i++) {
                ctx.drawImage(base.images.torb, posx + 5 + i * 20, posy + 43);
            }
            while (i < 10) {
                ctx.drawImage(base.images.norb, posx + 5 + i * 20, posy + 43);
                i++;
            }

            ctx.drawImage(base.images.battery, posx + 5, posy + 75);
            ctx.fillText((player.orbs_count).toFixed(2), posx + 40, posy + 98);
        },


        drawPlanetInformation: function() {
            var base = this;
            var canvas = base.layer.game.canvas;
            var posy = canvas.height - 110;
            var posx = 5;
            var height = 115;
            var width = 250;

            var ctx = base.layer.game.context;
            var player = base.layer.player;

            ctx.fillStyle = "rgba(255,255,255,0.2);";
            ctx.strokeStyle = "rgba(255,255,255,0.5);";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(posx, posy - 10, width, height);
            ctx.fill();
            ctx.stroke();
            ctx.font = "15px verdana";
            ctx.fillStyle = "white";
            if (player.closest_planet && Vector.distance(player.closest_planet, player) <= player.closest_planet.radius + player.closest_planet.grav_influence) {

                var planet = player.closest_planet;


                ctx.fillText("Planet type : " + player.closest_planet.planet_type, 10, posy + 10);
                ctx.fillText("Distance : " + Vector.distance(player.closest_planet, player).toFixed(2), 10, posy + 30);
                if (player.closest_planet.destination) {
                    ctx.fillText("[Enter] : drop energy orbs", 10, posy + 50);
                }


                var line_y = posy + 35;
                if (player.closest_planet.planet_type == "energy") {
                    ctx.drawImage(base.images.eorb, 10, line_y);
                    ctx.fillText(planet.orbs.length + " left", 40, line_y + 15);
                }
                if (player.closest_planet.planet_type == "earth") {
                    ctx.drawImage(base.images.torb, 10, line_y);
                    ctx.fillText(planet.orbs.length + " left", 40, line_y + 15);
                }
                if (player.closest_planet.planet_type == "water") {
                    ctx.drawImage(base.images.worb, 10, line_y);
                    ctx.fillText(planet.orbs.length + " left", 40, line_y + 15);
                }
                if (player.closest_planet.planet_type == "acid") {
                    ctx.drawImage(base.images.aorb, 10, line_y);
                    ctx.fillText(planet.orbs.length + " left", 40, line_y + 15);
                }
                if (planet.planet_type == "life") {
                    ctx.drawImage(base.images.worb, 10, line_y);
                    ctx.fillText(planet.water_counts + "/10", 35, line_y + 15);
                    ctx.drawImage(base.images.torb, 85, line_y);
                    ctx.fillText(planet.earth_counts + "/10", 105, line_y + 15);
                    ctx.drawImage(base.images.aorb, 155, line_y);
                    ctx.fillText(planet.acid_counts + "/10", 175, line_y + 15);
                    ctx.drawImage(base.images.lightning, 10, line_y + 23);
                    if (planet.distanceTo(planet.center) < planet.center.influence)
                        ctx.fillText("Touched by sunrays", 35, line_y + 40);
                    else
                        ctx.fillText("Untouched by sunrays", 35, line_y + 40);
                    if (planet.warming) {
                        ctx.fillText("Planet currently warming " + Math.round(planet.warmup / 500 * 100) + "%", 10, line_y + 55);
                    }
                    if (planet.acid_counts < 10 || planet.earth_counts < 10 || planet.water_orbs < 10)
                        ctx.fillText("[Enter] : drop orbs", 10, line_y + 60);
                }
            } else {
                ctx.fillText("No near planet", 10, posy + 10);
            }
        },
        drawObjectives: function() {
            var base = this;

            var canvas = base.layer.game.canvas;
            var height = 110;
            var width = 250;
            var posx = canvas.width - 5 - width;
            var posy = canvas.height - 5 - height;

            var ctx = base.layer.game.context;
            var player = base.layer.player;

            ctx.fillStyle = "rgba(255,255,255,0.2);";
            ctx.strokeStyle = "rgba(255,255,255,0.5);";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(posx, posy, width, height);
            ctx.fill();
            ctx.stroke();

            ctx.font = "15px verdana";
            ctx.fillStyle = "white";
            ctx.fillText("Objectives", posx + 5, posy + 20);
            ctx.fillText(base.layer.alive_planets + "/" + base.layer.life_planets + " planets to revive", posx + 5, posy + 40);
            if (base.layer.warming_planets > 0)
                ctx.fillText(base.layer.warming_planets + " planets planets warming", posx + 5, posy + 60);
            ctx.fillText(base.layer.warmup_percentage + "% of success", posx + 5, posy + 80);
        },
        drawHints: function() {
            var base = this;

            var canvas = base.layer.game.canvas;



            var ctx = base.layer.game.context;
            var player = base.layer.player;

            ctx.font = "15px verdana";
            ctx.fillStyle = "white";

            var hints = [
                "To win this game :",
                "First: gather materials and energy orbs by orbiting around other planets",
                "Second: drop materials to life planets (indicated by your radars in GREEN)",
                "Third: make the sun rays reach those planets to revive them by dropping energy orbs on the sun (radar: yellow)",
                "",
                "[Scroll] Zoom In/Out",
                "[Left click] Hold to run engine and accelerate towards the pointer (costs energy)",
                "[P] Pause menu",
                "[Escape] Pause and unlock mouse"
            ];

            var posx = canvas.width / 2;
            var posy = canvas.height - hints.length * 20;

            if (base.show_hints) {


                ctx.font = "15px verdana";
                ctx.fillStyle = "white";
                var max_width = 0;
                var pos = 0;
                for (var k in hints) {
                    ctx.font = "15px verdana";
                    ctx.fillStyle = "white";
                    var metrics = ctx.measureText(hints[k]);
                    if (max_width < metrics.width)
                        max_width = metrics.width;
                    ctx.fillText(hints[k], posx + 5 - metrics.width / 2, posy + pos);
                    pos += 20
                }

                ctx.fillStyle = "rgba(255,255,255,0.2);";
                ctx.strokeStyle = "rgba(255,255,255,0.5);";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.rect(canvas.width / 2 - (max_width + 10) / 2, posy - 20, max_width + 10, hints.length * 20 + 10);
                ctx.fill();
                ctx.stroke();

            } else {
                var text = "[H] Show commands help";
                var metrics = ctx.measureText(text);
                ctx.fillText(text, posx + 5 - metrics.width / 2, canvas.height - 20);
            }




        },

        draw: function() {
            var base = this;
            base.drawPlanetInformation();
            base.drawPlayerInformation();
            base.drawObjectives();
            base.drawHints();

            if (base.layer.inputs_engine.keyPressed(72)) {
                if (!base.hpressed) {
                    base.show_hints = !base.show_hints;
                    base.hpressed = true;
                }
            } else {
                base.hpressed = false;
            }
        }
    });

    return HudLayer;
});