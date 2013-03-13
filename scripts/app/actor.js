/*global define:true, my:true */

define(['myclass','app/util','underscore'],
function(my,util,_) {

  var attributes = {},

      Actor = my.Class({

    constructor : function(config) {
      if(!(this instanceof Actor)) {
        return new Actor(config);
      }

      attributes = _.extend(attributes,config);
      this.initialize();
    },

    initialize : function() {

      this.scale = attributes.physics.getScale();

      attributes.state = 'default';

      // create Box2D body object
      var bodyConfig = {
        shapeType: 'circle',
        bodyType: 'dynamic',
        position: attributes.position,
        angle: attributes.angle,
        radius: attributes.radius
      }

      this.body = attributes.physics.createBody(bodyConfig);

      // create vector graphic
      var vectorStates = {
        'default':{
          'points':util.generateCircPoints(8,attributes.radius*this.scale),
          'scale':attributes.drawScale || 1,
          'drawStyles':{
            'lineWidth':3.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#111',
            'fillStyle':'#666666'
          }
        }
      };

      this.setStates(vectorStates);

    },

    update : function() {
      var bpos = this.body.GetPosition();
      attributes.position.x = bpos.x * this.scale;
      attributes.position.y = bpos.y * this.scale;
      attributes.angle = this.body.GetAngle();
    },

    setStates : function(states) {
      attributes.states = states;
    },

    getStates : function() {
      return attributes.states;
    },

    render : function() {
      var canvas = attributes.stage.getCanvas();
      canvas.drawShape(_.extend({
          direction: attributes.angle,
          position: attributes.position
      },attributes.states[attributes.state]));
    }

  });

  return Actor;

});
