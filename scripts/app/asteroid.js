/*global define:true, my:true  */

define(['underscore','myclass','app/actor','app/util'],
function(_,my,Actor,util) {

  Asteroid = my.Class(Actor,{

    constructor : function(config) {
      if(!(this instanceof Asteroid)) {
          return new Asteroid(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);

      var points = util.generateCircPoints(8,this.attributes.radius);

      var i = 0, l = points.length;
      for(i=0;i<l;i+=1) {
          points[i].x += util.randRange(-2,2);
          points[i].y += util.randRange(-2,2);
      }

      this.attributes.states = {
        'default':{
          'points':points,
          'scale':this.attributes.drawScale || 10,
          'drawStyles':{
            'lineWidth':9.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#222',
            'fillStyle':'#333'
          }
        }
      };

      Asteroid.Super.call(this,this.attributes);
    }

  });

  return Asteroid;

});

