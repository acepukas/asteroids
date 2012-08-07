/*global define:true, my:true */

define(['my.class','app/vector','app/util'],
function(my,Vector,util){

    var HumanControlled = my.Class({

        constructor : function(config) {
            if(!(this instanceof HumanControlled)) {
                return new HumanControlled(config);
            }

            this.motionElement = config.motionElement;
            this.stage = this.motionElement.getStage();
            this.engine = new Vector();
            this.thrust = 0.3;
            this.turnrate = (!!config.turnrate) ? util.tr(config.turnrate) : util.tr(8);

        },

        getMotionElement : function() {
            return this.motionElement;
        },
        
        setMotionElement : function(motionElement) {
            this.motionElement = motionElement;
        },

        updatePosition : function() {
            this.getMotionElement().updatePosition();
        },

        update : function() {
            this.keyEvents();
            this.updatePosition();
            this.getMotionElement().draw();
        },

        keyEvents : function() {
            this.updateSpeed(this.stage.getKeys().up);
            if(this.stage.getKeys().up) {
                this.getMotionElement().getHeading().combine(this.engine);
            }
            if(this.stage.getKeys().left) { this.setDirection(-this.turnrate); }
            if(this.stage.getKeys().right) { this.setDirection(this.turnrate); }
            this.getMotionElement().setDirection(this.getDirection());
        },

        updateSpeed : function (thrustEngaged) {
            this.engine.mag = (thrustEngaged) ? this.thrust : 0;
        },

        setDirection : function(step) {
            var d = this.engine.dir + step;
            if(Math.abs(d) > Math.PI) { d = -(d - (d % Math.PI)); }
            this.engine.dir = d;
        },

        getDirection : function() {
            return this.engine.dir;
        },

        getPosition : function() {
            return this.getMotionElement().getPosition();
        },

        toString : function() {
            var out = this.getMotionElement().toString(),
                o = [];
                out += '<br />';
            o.push('thrust:   ' + util.round(this.engine.mag,5));
            o.push('engine:   ' + this.engine);
            out += o.join('<br />');
            return out;
        }

    });

    return HumanControlled;

});
