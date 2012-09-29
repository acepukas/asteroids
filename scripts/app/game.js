/*global define:true */

define(['app/stage','app/gameelementfactory'],
function(Stage,GameElementFactory) {

    return {
        start : function(){
            var stage = new Stage(1000);
            stage.init();
            var gef = new GameElementFactory({'stage':stage});

            var ge = gef.createElement({
                type:'ship'
            });
            stage.addGameElement(ge);

            var addAsteroid = function() {
                if(stage.getNumOfGameElements() < 15) {
                    var asteroid = gef.createElement({
                        type:'asteroid'
                    });
                    stage.addGameElement(asteroid);
                }
            };

            var i = 0, l = 10;
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
