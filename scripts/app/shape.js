/*global define:true, my:true */

define(['my.class','app/util'],
function(my,util){

    var Shape = my.Class({

        constructor : function(states) {
            if(!(this instanceof Shape)) {
                return new Shape(states);
            }

            this.states = states;

            this.bbox = null;
        },

        draw : function(params) {
            var state = params.state || 'default';
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
            util.foreach(styles,function(key,val) {
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
        }

    });

    return Shape;
});
