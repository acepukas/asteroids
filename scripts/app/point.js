/*global define:true, my:true */

define(['my.class'],
function(my){

    var Point = my.Class({

        constructor : function(x,y) {
            if(!(this instanceof Point)) {
                return new Point(x,y);
            }

            this.x = x || 0;
            this.y = y || 0;
        },

        toString : function(){
            return '{x:'+Math.round(this.x)+',y:'+Math.round(this.y)+'}';
        }

    });

    return Point;

});
