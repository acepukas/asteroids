/*global define:true, my: true */

/**
 *
 * @class:Vector 
 * @description: Object contains vector magnitude and direction as well as 
 *               vector operations. This vector object is only effective as a 2d vector.
 */

define(['myclass','app/util'],
function(my,util) {

    var Vector = my.Class({

        constructor : function (mag,dir) {
            if(!(this instanceof Vector)) {
                return new Vector(mag,dir);
            }

            this.mag = mag || 0;
            this.dir = dir || 0;

        },

        combine : function(vec) {
            // cp = combined point
            var cp = this.combineCartesian(vec.getPoint());

            this.mag = this.calcMagnitude(cp);
            this.dir = this.calcAngle(cp);
            return this;
        },

        combineCartesian: function(point){
            point.x += this.getX();
            point.y += this.getY();
            return point;
        },

        calcAngle : function(p) {
            return util.calcAngle(p);
        },
        
        calcMagnitude : function(p) {
            return util.calcMagnitude(p);
        },

        getX: function() {
            return util.toCartesianX(this.mag,this.dir);
        },

        getY: function() {
            return util.toCartesianY(this.mag,this.dir);
        },

        getPoint: function() {
            return {"x":this.getX(),"y":this.getY()};
        },

        toNormal : function() {
            var p = this.toPoint();

            p.x = p.x / this.mag;
            p.y = p.y / this.mag;

            return p.toVector();
        },

        toString : function() {
            return '{magnitude:'+util.padRight(util.round(this.mag,3),3) +
                   ',direction:'+util.round(util.td(this.dir),2)+'}';
        }

    });

    return Vector;
});
