/*global define:true, my:true */

define(['underscore','myclass','app/util'],
function(_,my,util){

    var canvas = null;
    
    var Shape = my.Class({

        constructor : function(conf) {
            if(!(this instanceof Shape)) {
                return new Shape(conf);
            }

            _.extend(this,conf);
            this.state = 'default';
            canvas = this.gameElement.get('stage').getCanvas();
        },

        draw : function() {
            canvas.drawShape(_.extend({
                direction: this.gameElement.get('direction'),
                position: this.gameElement.get('position')
            },this.states[this.state]));
        },

        toString : function thisToString() {
            return (this.constructor.toString()).
                replace(/(\n|\r)/g,'').
                replace(/^.*instanceof ([a-zA-Z]*).*$/,'$1');
        }

    });

    return Shape;
});
