/*global define:true, my:true */

/**
 *
 * @class:MotionElement
 * @description Contains all necessary components for tracking 2d motion of
 *              an object on the x and y axis, using vector math.
 *
 */

define([
    'jquery',
    'underscore',
    'myclass',
    'app/point',
    'app/vector',
    'app/util'
],function(
    $,
    _,
    my,
    Point,
    Vector,
    util
){

    var MotionElement = my.Class({

        constructor : function(conf) {
            if(!(this instanceof MotionElement)) {
                return new MotionElement(conf);
            }

            _.each(conf,$.proxy(function(val,key) {
                this[key] = val; 
            },this));

            var stage = this.gameElement.get('stage');

            this.position = new Point(
                stage.getBounds().x2/2,
                stage.getBounds().y2/2
            );
            
            this.collisionRadius = this.collisionRadius || 10;
            this.minSpeed = this.minSpeed || 0;
            this.direction = 0;
            this.heading = new Vector();

            this.mass = this.mass || 2000;
            this.maxSpeed = this.maxSpeed || 12;
            this.friction = stage.getFriction();
        },

        update : function(time) {
            this.updatePosition(time);
        },

        updatePosition : function(time) {
            this.heading = this.calcFinalVelocity(this.heading,-this.friction,time);
            this.heading.mag = this.restrictVelocity(this.heading.mag);
            this.position = this.heading.combineCartesian(this.position);
        },

        restrictVelocity : function(v) {
            // restrict velocity
            v = (v >= this.maxSpeed) ? this.maxSpeed : v;
            v = (v <= this.minSpeed) ? this.minSpeed : v;
            return v;
        },

        calcFinalVelocity : function(vector, force, time) {
            
            var vel = 0,
                t = time,
                accel = util.getAcceleration(force,this.mass,t);

            vector.mag += util.getVelocity(vel,accel,t);
            return vector;
        },

        collisionDetected : function(collider) {
            if(!!this.gameElement) {
                var beh = this.gameElement.get('behavior');
                if(!!beh.collision) {
                    beh.collision(collider);
                }
            }
        }

    });

    return MotionElement;
});
