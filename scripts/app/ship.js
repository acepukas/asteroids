/*global define:true, my:true  */

define(['my.class','app/shape','app/util'],
function(my,Shape,util) {

    var Ship = my.Class(Shape,{

        constructor : function(scale) {
            if(!(this instanceof Ship)) {
                return new Ship(scale);
            }

            var points = [
                {x:-20, y:  0}, // tail
                {x:-10, y: 15},
                {x: -2, y: 15},
                {x: 40, y:  0}, // nose
                {x: -2, y:-15},
                {x:-10, y:-15}
            ];
            
            Ship.Super.call(this,scale,points);
        },

        draw : function(params){
            var ctx = params.ctx;

            ctx.save();
            this.restoreBackground(params);
            ctx.fillStyle="#666666";
            ctx.strokeStyle="#111";
            ctx.lineWidth = 3.0;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            this.plotShapeData(params);
            ctx.closePath();
            this.saveBackground(params);
            ctx.fill();
            ctx.stroke();
            // this.drawBoundingBox(params);
            ctx.restore();
        }

    });

    return Ship;

});
