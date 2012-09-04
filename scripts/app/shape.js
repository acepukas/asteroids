/*global define:true, my:true */

define(['underscore','my.class','app/util'],
function(_,my,util){

    var Shape = my.Class({

        constructor : function(states) {
            if(!(this instanceof Shape)) {
                return new Shape(states);
            }

            this.states = states;

            this.bbox = null;
        },

        draw : function(params) {
            var state = this.state || 'default';
            state = this.states[state];
            var ctx = params.ctx;

            params.scale = state.scale;
            params.shapeData = state.points;

            ctx.save();
            this.setDrawStyle(ctx,state.drawStyles);
            ctx.beginPath();
            this.plotShapeData(params);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },

        setDrawStyle : function(ctx,styles) {
            _.each(styles,function(val,key) {
                ctx[key] = val;
            })
        },

        plotShapeData : function(params) {
            this.bbox = util.plotShapeData(params);
        },

        drawBoundingBox : function(params) {
            var ctx = params.ctx;
            ctx.lineWidth = 1;
            ctx.strokeStyle="#ffff00";
            ctx.strokeRect(
                this.bbox.bounds.x,
                this.bbox.bounds.y,
                this.bbox.bounds.w,
                this.bbox.bounds.h
            );
        },

        toString : function() {
            if(!arguments.callee.className) {
                arguments.callee.className = (''+this.constructor).
                    replace(/(\n|\r)/g,'').
                    replace(/^.*instanceof ([a-zA-Z]*).*$/,'$1');
            }
            return arguments.callee.className;
        }

    });

    return Shape;
});
