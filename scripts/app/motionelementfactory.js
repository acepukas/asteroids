/*global define:true, my:true */

define(['my.class','app/motionelement','app/ship','app/humancontrolled','app/projectile','app/projectilebehavior'],
function(my,MotionElement,Ship,HumanControlled,Projectile,ProjectileBehavior) {

    var MotionElementFactory = my.Class({

        constructor : function(config) {
            if(!(this instanceof MotionElementFactory)) {
                return new MotionElementFactory(config);
            }

            this.stage = config.stage;

        },

        createElement : function (elConf) {
            var elType = elConf.type || 'null';
            var createMethod = 'create'+this.cap(elType);
            if(this[createMethod]){
                return this[createMethod](elConf.config);
            }
            return null;
        },

        cap : function(subject) {
            return subject.replace(/^([a-z])(.*)$/,function(orig,first,rest){
                return first.toUpperCase() + rest;
            });
        },

        createShip : function () {

            var me = new MotionElement({
                stage:this.stage,
                shape:new Ship(2),
                maxSpeed:15,
                mass:500
            });

            me.setBehavior(new HumanControlled({
                motionElementFactory:this,
                turningRate:8,
                motionElement:me
            }));

            return me;

        },

        createProjectile : function(config) {

            var me = new MotionElement({
                stage:this.stage,
                shape:new Projectile(1.3),
                maxSpeed:100,
                mass:600
            });

            me.setBehavior(new ProjectileBehavior({
                startSpeed:15,
                motionElement:me,
                initDistance:90,
                source:(config.source || null)
            }));

            return me;
        }
    });

    return MotionElementFactory;

});
