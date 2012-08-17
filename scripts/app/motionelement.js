/*global define:true, my:true */

/**
 *
 * @class:MotionElement
 * @description Contains all necessary components for tracking 2d motion of
 *              an object on the x and y axis, using vector math.
 *
 */

define(['my.class','app/point','app/vector','app/util'],
function(my,Point,Vector,util){

    var MotionElement = my.Class({

        constructor : function(config) {
            if(!(this instanceof MotionElement)) {
                return new MotionElement(config);
            }

            this.stage = config.stage;

            this.shape = config.shape;

            this.position = new Point(
                this.stage.getBounds().x2/2,
                this.stage.getBounds().y2/2
            );

            this.dir = 0;

            this.heading = new Vector();
            this.mass = config.mass || 2000;
            this.maxSpeed = config.mxspd || 12;
        },

        update : function() {
            this.updatePosition();
        },

        updatePosition : function() {
            this.heading = this.calcFinalVelocity(this.heading,-this.stage.getFriction());
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
                t = this.stage.getTime(),
                accel = util.getAcceleration(force,this.mass,t);

            vector.mag += util.getVelocity(vel,accel,t);
            return vector;
        },

        getHeading : function() {
            return this.heading;
        },

        getPosition : function() {
            return this.position;
        },

        getShape : function() {
            return this.shape;
        },
        
        setShape : function(shape) {
            this.shape = shape;
        },

        setDirection : function(dir) {
            this.dir = dir;
        },

        getStage : function() {
            return this.stage;
        },

        render : function() {

            this.getShape().draw({
                ctx:this.stage.getCtx(),
                position:this.position,
                dir:this.dir
            });

        },

        toString : function() {
            var o = [];
            o.push('motionElement info:');
            o.push('position: ' + this.position);
            o.push('heading:  ' + this.heading);
            return o.join('<br />');
        }

    });

    return MotionElement;
});
