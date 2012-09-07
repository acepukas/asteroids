/*global define:true, my:true */

define(['underscore','my.class','app/vector','app/util'],
function(_,my,Vector,util){

    var config = {};

    var HumanControlled = my.Class({

        constructor : function(conf) {
            if(!(this instanceof HumanControlled)) {
                return new HumanControlled(conf);
            }

            config = _.extend(config,conf);

            config.turnrate = (!!conf.turnrate) ?
                util.tr(conf.turnrate) :
                util.tr(8);

            config.engine = new Vector();
            config.readyToFire = true;
            config.firingRate = 1000/6;
            config.thrust = 0.3;

        },

        getMotionElement : function() {
            return config.gameElement.getMotionElement();
        },

        update : function(stage) {
            this.keyEvents(stage);
        },

        keyEvents : function(stage) {

            var keys = config.gameElement.getStage().getKeys();

            this.updateSpeed(keys.up);

            if(keys.up) {
                this.getMotionElement().getHeading().combine(config.engine);
            }

            if(keys.left) {
                this.setDirection(-config.turnrate); 
            }

            if(keys.right) {
                this.setDirection(config.turnrate); 
            }

            this.getMotionElement().setDirection(this.getDirection());

            if(keys.space) {
                // this.fireProjectile(stage); 
            }
        },

        updateSpeed : function (thrustEngaged) {
            config.engine.mag = (thrustEngaged) ? config.thrust : 0;
        },

        setDirection : function(step) {
            var d = config.engine.dir + step;
            if(Math.abs(d) > Math.PI) { d = -(d - (d % Math.PI)); }
            config.engine.dir = d;
        },

        fireProjectile : function  (stage) {
            var that = this;
            if(that.readyToFire) {
                that.readyToFire = false;
                var me = that.mef.createElement({
                    type:'projectile',
                    config:{
                        source:that.getMotionElement()
                    }
                });
                stage.addMotionElement(me);
                setTimeout(function() {
                    that.readyToFire = true;   
                },that.firingRate);
            }
        },

        getDirection : function() {
            return config.engine.dir;
        },

        getPosition : function() {
            return this.getMotionElement().getPosition();
        },

        toString : function() {
            var out = this.getMotionElement().toString(),
                o = [];
                out += '<br />';
            o.push('thrust:   ' + util.round(config.engine.mag,5));
            o.push('engine:   ' + config.engine);
            out += o.join('<br />');
            return out;
        }

    });

    return HumanControlled;

});
