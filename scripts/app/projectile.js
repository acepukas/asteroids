/*global define:true, my.true */
define(['my.class','app/shape','app/util'],
function(my,Shape,util) {
    
    var Projectile = my.Class(Shape,{

        constructor : function(scale) {
            if(!(this instanceof Projectile)) {
                return new Projectile(scale);
            }

            var points = [
                {x: 0, y:-6},
                {x: 4, y:-4},
                {x: 6, y: 0},
                {x: 4, y: 4},
                {x: 0, y: 6},
                {x:-4, y: 4},
                {x:-6, y: 0},
                {x:-4, y:-4}
            ];

            Projectile.Super.call(this,scale,points);

        },

        draw : function  (params) {
            var ctx = params.ctx;

            ctx.save();
            // this.restoreBackground(params);
            ctx.fillStyle="#996666";
            ctx.strokeStyle="#611";
            ctx.lineWidth = 2.0;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            this.plotShapeData(params);
            ctx.closePath();
            // this.saveBackground(params);
            ctx.fill();
            ctx.stroke();
            // this.drawBoundingBox(params);
            ctx.restore();
        }

    });

    return Projectile;

});
