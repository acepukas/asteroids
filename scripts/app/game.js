/*global define:true */

define(['app/stage','app/gameelementfactory','app/physics','jquery'],
function(Stage,GameElementFactory,Physics) {

    return {
        start : function(){

            var physics = new Physics({
                  gravity: {x:0,y:0},
                  scale: 10,
                  debug: true
                }),

                stage = new Stage(physics),
                maxObjs = 20,
                gef;

            stage.init();

            gef = new GameElementFactory({
              'stage':stage,
              'physics':physics
            });

            var ge = gef.createElement({
                type:'ship'
            });
            stage.addGameElement(ge);

            var addAsteroid = function() {
                if(stage.getNumOfGameElements() < maxObjs) {
                    var asteroid = gef.createElement({
                        type:'asteroid'
                    });
                    stage.addGameElement(asteroid);
                }
            };

            var i = 0, l = maxObjs;
            for(i=0;i<l;i+=1) {
                addAsteroid();
            }

            setInterval(function() {
                addAsteroid();
            },1000);

            stage.initAnim();
        }
    };

});
