/*global define:true, my:true */

define(['myclass','underscore','app/util','app/actor'],
function(my,_,util,Actor) {

  var attributes = {},
      
      actorTypes = {
        'Actor':Actor
      // , 'Ship':Ship
      // , 'Asteroid':Asteroid
      // , 'Projectile':Projectile
      },


  ActorFactory = my.Class({

    constructor : function(config) {
      if(!(this instanceof ActorFactory)) {
        return new ActorFactory(config);
      }

      attributes = _.extend(attributes,config);

      attributes.physics = attributes.stage.getPhysics();
      this.initialize();

    },

    initialize : function() {
    
    },

    createActor : function(config) {
      var type = util.cap(config.actorType || 'actor');
      
      if(!(type in actorTypes)) return null;

      config = _.extend(config,attributes);

      // TODO: attach common default attributes to actors here for convenience

      return actorTypes[type](config);
    }

  });

  return ActorFactory;

});
