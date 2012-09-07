/*global define:true, my:true */

/**
 *
 * @class:MotionElement
 * @description Contains all necessary components for tracking 2d motion of
 *              an object on the x and y axis, using vector math.
 *
 */

define(['underscore','my.class','app/point','app/vector','app/util'],
function(_,my,Point,Vector,util){

    var config = {};

    var MotionElement = my.Class({

        constructor : function(conf) {
            if(!(this instanceof MotionElement)) {
                return new MotionElement(conf);
            }

            config = _.extend(config,conf);
            var stage = config.gameElement.getStage();

            config.position = new Point(
                stage.getBounds().x2/2,
                stage.getBounds().y2/2
            );

            config.dir = 0;

            config.heading = new Vector();

            config.mass = conf.mass || 2000;
            config.maxSpeed = conf.maxSpeed || 12;
            config.friction = config.gameElement.getStage().getFriction();

        },

        update : function() {
            this.updatePosition();
        },

        updatePosition : function() {
            config.heading = this.calcFinalVelocity(config.heading,-config.friction);
            config.heading.mag = this.restrictVelocity(config.heading.mag);
            config.position = config.heading.combineCartesian(config.position);
        },

        restrictVelocity : function(v) {
            // restrict velocity
            var minSpeed = 0.1;
            v = (v >= config.maxSpeed) ? config.maxSpeed : v;
            v = (v <= minSpeed) ? minSpeed : v;
            return v;
        },

        calcFinalVelocity : function(vector, force) {
            
            var vel = 0,
                t = config.gameElement.getStage().getTime(),
                accel = util.getAcceleration(force,config.mass,t);

            vector.mag += util.getVelocity(vel,accel,t);
            return vector;
        },

        getHeading : function() {
            return config.heading;
        },

        setHeading : function(heading) {
             config.heading = heading;
        },

        getPosition : function() {
            return config.position;
        },

        setPosition : function(pos) {
            config.position = pos;
        },

        setDirection : function(dir) {
            config.dir = dir;
        },

        getDirection : function() {
            return config.dir;
        },

        getStage : function() {
            return config.stage;
        }

    });

    return MotionElement;
});
