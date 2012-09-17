/*global define:true, my:true */

/**
 *
 * @class:MotionElement
 * @description Contains all necessary components for tracking 2d motion of
 *              an object on the x and y axis, using vector math.
 *
 */

define(['underscore','myclass','app/point','app/vector','app/util'],
function(_,my,Point,Vector,util){

    var prvt = {};
    var stage = null;

    var MotionElement = my.Class({

        constructor : function(conf) {
            if(!(this instanceof MotionElement)) {
                return new MotionElement(conf);
            }

            _.each(conf,this.proxy(function(val,key) {
                this[key] = val; 
            }));

            stage = this.gameElement.get('stage');

            this.position = new Point(
                stage.getBounds().x2/2,
                stage.getBounds().y2/2
            );

            this.direction = 0;

            this.heading = new Vector();

            this.mass = conf.mass || 2000;
            this.maxSpeed = conf.maxSpeed || 12;
            this.friction = stage.getFriction();

        },

        proxy : function(fn) {
            var self = this;
            return function () {
                fn.apply(self,arguments);
            }
        },

        update : function() {
            this.updatePosition();
        },

        updatePosition : function() {
            this.heading = this.calcFinalVelocity(this.heading,-this.friction);
            this.heading.mag = this.restrictVelocity(this.heading.mag);
            this.position = this.heading.combineCartesian(this.position);
        },

        restrictVelocity : function(v) {
            // restrict velocity
            var minSpeed = 0.1;
            v = (v >= this.maxSpeed) ? this.maxSpeed : v;
            v = (v <= minSpeed) ? minSpeed : v;
            return v;
        },

        calcFinalVelocity : function(vector, force) {
            
            var vel = 0,
                t = stage.getTime(),
                accel = util.getAcceleration(force,this.mass,t);

            vector.mag += util.getVelocity(vel,accel,t);
            return vector;
        }

    });

    return MotionElement;
});
