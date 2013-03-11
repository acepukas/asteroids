/*global define:true, my:true */

define(['myclass','jquery','Box2D'],
function(my) {

  // abbreviations for common Box2D classes/vars
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2World = Box2D.Dynamics.b2World,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2_dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody,
      b2_staticBody = Box2D.Dynamics.b2Body.b2_staticBody,
      b2_kinematicBody = Box2D.Dynamics.b2Body.b2_kinematicBody;

  var Physics = my.Class({

    constructor : function(config) {
      if(!(this instanceof Physics)) {
        return new Physics(config);
      }

      this.config = config;
    },

    initialize : function() {
      var grav = this.config.gravity || {x:0,y:10},
          gravVec = new b2Vec2(grav.x,grav.y);

      // create world object
      this.world = new b2World(gravVec,true) // true = sleep allowed
      this.density = this.config.density || 1.0;
      this.friction = this.config.friction || 0.5;
      this.restitution = this.config.restitution || 0.5;

      if(typeof this.config.scale !== 'undefined' &&
        this.config.scale !== null &&
        !!this.config.scale) {
        this.scale = this.config.scale; 
      } else {
        this.scale = 30;
      }

      if(typeof this.config.debug !== 'undefined' && this.config.debug !== null &&
        !!this.config.debug) {
        this.setUpDebugDraw();
      }
    },

    setUpDebugDraw : function() {
    
      var debugDraw = new b2DebugDraw(),
        debugCanvas = $('<canvas id="b2d-debug">').appendTo('body'),
        jqWindow = $(window),
        resize = function() {
          debugCanvas.attr('width',jqWindow.width());
          debugCanvas.attr('height',jqWindow.height());
        };

      resize();

      jqWindow.resize(resize);

      debugDraw.SetSprite(debugCanvas.get(0).getContext('2d'));
      debugDraw.SetDrawScale(this.scale);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit,b2DebugDraw.e_jointBit);
      this.world.SetDebugDraw(debugDraw);
    },

    getScale : function() {
      return this.scale;
    },

    getWorld : function() {
      return this.world;
    },

    createBody : function(config) {

      var fixDef,
          fixDefShape,
          bodyDef,
          body,
          position,
          bodyType,
          bodyTypes = {
            'dynamic': b2_dynamicBody,
            'static': b2_staticBody,
            'kinematic' b2_kinematicBody
          };

      fixDef = new b2FixtureDef();
      fixDef.density = this.density;
      fixDef.friction = this.friction;
      fixDef.restitution = this.restitution;

      if(config.shapeType === 'circle') {

        fixDef.shape = new b2CircleShape(config.radius || 10);

      } else if(config.shapeType === 'polygon') {

        fixDefShape = new b2PolygonShape();

        if(!!config.box) {

          fixDefShape.SetAsBox(config.box.width,config.box.height);

        } else if (!!config.vertices) {

          fixDefShape.SetAsArray(config.vertices,config.vertices.length);
        }

        fixDef.shape = fixDefShape;
      }

      // define shape and position
      bodyDef = new b2BodyDef();

      bodyType = bodyTypes[config.bodyType||'static'];
      bodyDef.type = bodyType;
      
      position = config.position || {x:0,y:0};
      bodyDef.position.x = (position.x||0)/this.scale;
      bodyDef.position.y = (position.y||0)/this.scale;
      bodyDef.angle = config.direction || 0;

      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      // FIXME: These if statements should be moved to the
      // body wrapper base class
      if(!!config.initialForce) {
        var vecx = util.toCartesianX(config.initialForce,bodyDef.angle);
        var vecy = util.toCartesianY(config.initialForce,bodyDef.angle);
        body.SetLinearVelocity(new b2Vec2(vecx,vecy),body.GetWorldCenter());
      }

      if(!!config.angularVelocity) {
        body.SetAngularVelocity(util.tr(config.angularVelocity));
      }

      return body;
    }

  });

  return Physics;

});
