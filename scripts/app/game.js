/*global define:true */

define(['app/stage','app/actorfactory','app/util'],
function(Stage,ActorFactory,util) {

  var stage = new Stage();

  return {
    start : function(){
      this.addShip();

      // adding asteroids
      var i = 0, l = 10;
      for(i=0;i<l;i+=1) {
        this.addAsteroid();
      }

      stage.setContactListeners({
        BeginContact : function(contact) {
          var a = contact.GetFixtureA().GetBody().GetUserData(),
              b = contact.GetFixtureB().GetBody().GetUserData();
              
          if(a === 'ship' || b === 'ship') {
            console.info('ship collided');
          }
        }
      });

      stage.initAnim();
    },

    addAsteroid : function() {
      var bnds = stage.getBounds(),
          position = {
            x: util.randRange(bnds.x1,bnds.x2),
            y: util.randRange(bnds.y1,bnds.y2)
          },
          angularVelocity = 15;

      stage.createActor({
        actorType: 'asteroid',
        position: position,
        angle: util.randRange(0,360),
        initialForce: util.randRange(10,20),
        angularVelocity: util.randRange(-angularVelocity,angularVelocity),
        radius: 5
      });
    },

    addShip : function() {
      stage.createActor({
        actorType: 'ship',
        position: stage.getCenterPoint(),
        angle: 0,
        radius: 4
      });
    }
  };

});
