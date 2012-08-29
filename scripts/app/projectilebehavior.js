/*global define:true, my:true */

define(['my.class','app/vector','app/point','app/util'],
function(my,Vector,Point,util) {

    var ProjectileBehavior = my.Class({

        constructor : function(config) {
            if(!(this instanceof ProjectileBehavior)) {
                return new ProjectileBehavior(config);
            }

            if(config.source) {
                this.source = config.source;
            }

            if(config.initDistance) {
                this.initDistance = config.initDistance;
            }

            if(config.startSpeed) {
                this.startSpeed = config.startSpeed; 
            }

            if(config.motionElement) {
                this.motionElement = config.motionElement; 
            }

            this.birthTime = +(new Date());

            this.initialize();
        },

        getMotionElement : function() {
            return this.motionElement;
        },
        
        setMotionElement : function(motionElement) {
            this.motionElement = motionElement;
        },

        initialize : function() {
            var initDistance = this.initDistance;
            var dir = this.source.getDirection();
            var heading = new Vector(this.startSpeed,dir).combine(this.source.getHeading());
            this.motionElement.setHeading(heading);
            var startVector = new Vector(initDistance,dir);
            pos = new Point(util.addPoints(startVector.getPoint(),this.source.getPosition()));
            this.motionElement.setPosition(pos);
        },

        update : function(stage) {
            if((+(new Date()) - this.birthTime) > 700) {
                stage.removeMotionElement(this.getMotionElement());
            }
        }

    });

    return ProjectileBehavior;

});
