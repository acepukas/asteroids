/*global define:true, my:true */

define(['underscore','my.class','app/util'],
function(_,my,util){

    var config = {
        state:'default'
    };

    var Shape = my.Class({

        constructor : function(conf) {
            if(!(this instanceof Shape)) {
                return new Shape(conf);
            }

            config = _.extend(conf,config);
            this.bbox = null;
        },

        draw : function() {
            var state = config.states[config.state];
            var stage = config.gameElement.getStage();
            var mo = config.gameElement.getMotionElement();

            var ctx = stage.getCtx();

            var params = {
                scale: state.scale,
                points: state.points,
                dir : mo.getDirection(),
                pos : mo.getPosition(),
                callback : function(point,method){
                    ctx[method](point.x,point.y);
                }
            };

            ctx.save();
            this.setDrawStyle(state.drawStyles,ctx);
            ctx.beginPath();
            this.bbox = util.plotShapeData(params);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },

        setDrawStyle : function(styles,ctx) {
            _.each(styles,function(val,key) {
               ctx[key] = val;
            })
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

        getState : function() {
            return config.state;
        },
        
        setState : function(state) {
            config.state = state;
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
