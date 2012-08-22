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

        createElement : function (elementName,args) {

            var element = null;
            switch (elementName) {
                case 'ship':
                    element = this.createShip.apply(this,args);
                    break;
                case 'projectile':
                    element = this.createProjectile.apply(this,args);
                    break;
            }

            return element;
        },

        createShip : function () {

            var me = new MotionElement({
                stage:this.stage,
                shape:new Ship(2),
                maxSpeed:15,
                mass:500
            });

            me.setBehavior(new HumanControlled({
                stage:this.stage,
                motionElementFactory:this,
                turningRate:8,
                motionElement:me
            }));

            return me;

        },

        createProjectile : function(source) {

            var me = new MotionElement({
                shape:new Projectile(1),
                stage:this.stage,
                maxSpeed:100,
                mass:600
            });

            me.setBehavior(new ProjectileBehavior({
                stage:this.stage,
                startSpeed:10,
                motionElement:me,
                source:source
            }));

            return me;
        }
    });

    return MotionElementFactory;

});
