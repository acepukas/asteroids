/*global define:true, my:true */

define(['underscore','myclass','app/util'],
function(_,my,util){
    
    var Shape = my.Class({

        constructor : function(conf) {
            if(!(this instanceof Shape)) {
                return new Shape(conf);
            }

            _.extend(this,conf);
            this.state = 'default';
            this.bbox = null;
        },

        draw : function() {
            var state = this.states[this.state],
                stage = this.gameElement.get('stage'),
                direction = this.gameElement.get('direction'),
                position = this.gameElement.get('position'),

                ctx = stage.getCtx(),

                params = {
                    scale: state.scale,
                    points: state.points,
                    dir : direction,
                    pos : position,
                    callback : function(point,method){
                        ctx[method](point.x,point.y);
                    }
                };

            ctx.save();
            this.drawStyles(state.drawStyles,ctx);
            ctx.beginPath();
            this.bbox = util.plotShapeData(params);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },

        drawStyles : function(styles,ctx) {
            _.each(styles,function(val,key) {
               ctx[key] = val;
            });
        },

        drawBoundingBox : function(params) {
            var ctx = params.stage.getCtx();
            ctx.lineWidth = 1;
            ctx.strokeStyle="#ffff00";
            ctx.strokeRect(
                this.bbox.bounds.x,
                this.bbox.bounds.y,
                this.bbox.bounds.w,
                this.bbox.bounds.h
            );
        },

        toString : function thisToString() {
            return (this.constructor.toString()).
                replace(/(\n|\r)/g,'').
                replace(/^.*instanceof ([a-zA-Z]*).*$/,'$1');
        }

    });

    return Shape;
});
