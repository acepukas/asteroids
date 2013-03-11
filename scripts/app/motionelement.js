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
              util.randRange(0,stage.getBounds().x2),
              util.randRange(0,stage.getBounds().y2)
            );

            this.collisionRadius = this.collisionRadius || 5;
            this.minSpeed = this.minSpeed || 0;
            this.direction = this.direction || 0;
            this.heading = new Vector();

            this.mass = this.mass || 2000;
            this.maxSpeed = this.maxSpeed || 12;
            this.friction = stage.getFriction();

            var fixDef = new Box2D.Dynamics.b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.5;
            fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.collisionRadius);

            // define shape and position
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.x = this.position.x/this.SCALE;
            bodyDef.position.y = this.position.y/this.SCALE;
            bodyDef.angle = this.direction;

            var body = this.world.CreateBody(bodyDef);
            this.body = body;
            var fixture = body.CreateFixture(fixDef);
            // this.fixture = fixture; // maybe not needed

            if(this.type === 'asteroid') {
              // apply initial force
              var sp = 5; // speed
              var vecx = util.toCartesianX(sp,this.direction);
              var vecy = util.toCartesianY(sp,this.direction);
              body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(vecx,vecy),body.GetWorldCenter());
              body.SetAngularVelocity(util.tr(-12));
            }
        },

        update : function(time) {
            this.position.x = this.body.GetPosition().x * this.SCALE;
            this.position.y = this.body.GetPosition().y * this.SCALE;
            this.direction = this.body.GetAngle();
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
