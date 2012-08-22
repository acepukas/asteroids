/*global define:true, my:true */

define(['my.class','app/vector','app/util'],
function(my,Vector,util){

    var HumanControlled = my.Class({

        constructor : function(config) {
            if(!(this instanceof HumanControlled)) {
                return new HumanControlled(config);
            }

            this.motionElement = config.motionElement;
            this.stage = config.stage,
            this.turnrate = (!!config.turnrate) ?
                util.tr(config.turnrate) :
                util.tr(8);
            this.mef = config.motionElementFactory;

            this.engine = new Vector();
            this.readyToFire = true;
            this.firingRate = 1000/6;
            this.thrust = 0.3;

        },

        getMotionElement : function() {
            return this.motionElement;
        },
        
        setMotionElement : function(motionElement) {
            this.motionElement = motionElement;
        },

        update : function() {
            this.keyEvents();
        },

        keyEvents : function() {

            var keys = this.stage.getKeys();

            this.updateSpeed(keys.up);

            if(keys.up) {
                this.getMotionElement().getHeading().combine(this.engine);
            }

            if(keys.left) {
                this.setDirection(-this.turnrate); 
            }

            if(keys.right) {
                this.setDirection(this.turnrate); 
            }

            this.getMotionElement().setDirection(this.getDirection());

            if(keys.space) {
                this.fireProjectile(); 
            }
        },

        updateSpeed : function (thrustEngaged) {
            this.engine.mag = (thrustEngaged) ? this.thrust : 0;
        },

        setDirection : function(step) {
            var d = this.engine.dir + step;
            if(Math.abs(d) > Math.PI) { d = -(d - (d % Math.PI)); }
            this.engine.dir = d;
        },

        fireProjectile : function  () {
            var that = this;
            if(that.readyToFire) {
                that.readyToFire = false;
                var source = this.getMotionElement();
                var me = that.mef.createElement('projectile',[source]);
                that.stage.addMotionElement(me);
                setTimeout(function() {
                    that.readyToFire = true;   
                },that.firingRate);
            }
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
