/*global define:true */

define(['app/stage','app/physics','app/actorfactory','jquery'],
function(Stage,Physics,ActorFactory) {

    return {
        start : function(){

            var physics = new Physics({
                  gravity: {x:0,y:0},
                  scale: 10,
                  debug: true
                }),

                stage = new Stage({
                  'physics':physics
                }),

                maxObjs = 20,
                af;

            af = new ActorFactory({
              'stage':stage
            });

            var ship = af.createActor({
              actorType: 'ship',
              position: stage.getCenterPoint(),
              angle: 0,
              radius: 5
            });

            stage.addActor(ship);

            stage.initAnim();
        }
    };

});
