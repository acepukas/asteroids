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
            this.direction = this.direction || 0;

            var bodyConfig = {
              shapeType: 'circle',
              bodyType: 'dynamic',
              position: this.position,
              angle: this.direction,
              radius: this.collisionRadius
            };
            
            if(this.type === 'asteroid') {
              bodyConfig.initialForce = 5;
              bodyConfig.angularVelocity = util.randRange(-30,30);
            }

            this.body = this.physics.createBody(bodyConfig);
        },

        update : function(time) {
            this.position.x = this.body.GetPosition().x * this.physics.getScale();
            this.position.y = this.body.GetPosition().y * this.physics.getScale();
            this.direction = this.body.GetAngle();
        }

    });

    return MotionElement;
});
