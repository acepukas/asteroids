/*global define:true, my:true */

define(['myclass'],
function(my) {

  var Actor = my.Class({

    constructor : function(config) {
      if(!(this instanceof Actor)) {
        return new Actor(config);
      }

      this.config = config;
      this.initialize();
    },

    initialize : function() {
    
    }

  });

  return Actor;

});
