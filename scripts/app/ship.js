/*global define:true, my:true  */

define(['underscore','myclass','app/actor','app/util'],
function(_,my,Actor,util) {

  var attributes = {},

  Ship = my.Class(Actor,{

    constructor : function(config) {
      if(!(this instanceof Ship)) {
          return new Ship(config);
      }

      attributes = _.extend(attributes,config);

      attributes.state = 'default';

      attributes.states = {
        'default':{
          'points':[
            {x:-20, y:  0}, // tail
            {x:-10, y: 15},
            {x: -2, y: 15},
            {x: 40, y:  0}, // nose
            {x: -2, y:-15},
            {x:-10, y:-15}
          ],
          'scale':attributes.drawScale || 2,
          'drawStyles':{
            'lineWidth':3.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#111',
            'fillStyle':'#666666'
          }
        }
      };

      attributes.readyToFire = true;
      attributes.firingRate = 1000/6;
      attributes.force = 10000;
      attributes.turnrate = (!!attributes.turnrate) ?
        util.tr(attributes.turnrate) :
        util.tr(6);
      
      Ship.Super.call(this,attributes);
    },

    update : function() {

      var keys = attributes.stage.getKeys(),
          localVector,
          worldVector,
          angle;

      if(keys.up) {
        localVector = attributes.physics.b2Vec2(attributes.force,0);
        worldVector = this.body.GetWorldVector(localVector);
        this.body.ApplyForce(worldVector,this.body.GetWorldCenter());
      }

      if(keys.left) {
        angle = this.body.GetAngle();
        angle = this.adjustDirection(angle,-attributes.turnrate);
        this.body.SetAngle(angle);
      }

      if(keys.right) {
        angle = this.body.GetAngle();
        angle = this.adjustDirection(angle,attributes.turnrate);
        this.body.SetAngle(angle);
      }

      Ship.Super.prototype.update.call(this);
    },

    adjustDirection : function(angle,step) {
      var d = angle + step;
      if(Math.abs(d) > Math.PI) { d = -(d - (d % Math.PI)); }
      return d;
    }

  });

  return Ship;

});
