/*global define:true, my:true */

define(['underscore','myclass','app/vector','app/util'],
function(_,my,Vector,util){

    var HumanControlled = my.Class({

        constructor : function(conf) {
            if(!(this instanceof HumanControlled)) {
                return new HumanControlled(conf);
            }

            _.extend(this,conf);

            this.turnrate = (!!conf.turnrate) ?
                util.tr(conf.turnrate) :
                util.tr(8);

            this.engine = new Vector();
            this.readyToFire = true;
            this.firingRate = 1000/6;
            this.thrust = 0.3;

        },

        update : function() {
            this.keyEvents();
        },

        keyEvents : function() {

            var stage = this.gameElement.get('stage'),
                keys = stage.getKeys(),
                heading = this.gameElement.get('heading');

            this.updateSpeed(keys.up);

            if(keys.up) {
                heading.combine(this.engine);
            }

            if(keys.left) {
                this.setDirection(-this.turnrate); 
            }

            if(keys.right) {
                this.setDirection(this.turnrate); 
            }

            this.gameElement.set('direction',this.getDirection());

            if(keys.space) {
                this.fireProjectile(stage); 
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

        getDirection : function() {
            return this.engine.dir;
        },

        fireProjectile : function(stage) {
            var that = this,
                mo = null,
                ge = null;
            if(that.readyToFire) {
                mo = this.gameElement;
                that.readyToFire = false;
                ge = that.gameElementFactory.createElement({
                    type:'projectile',
                    config:{
                        source:mo
                    }
                });
                stage.addGameElement(ge);
                setTimeout(function() {
                    that.readyToFire = true;   
                },that.firingRate);
            }
        }/*,

        toString : function() {
            var out = this.getMotionElement().toString(),
                o = [];
                out += '<br />';
            o.push('thrust:   ' + util.round(this.engine.mag,5));
            o.push('engine:   ' + this.engine);
            out += o.join('<br />');
            return out;
        }*/

    });

    return HumanControlled;

});
