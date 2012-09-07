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
            stage.initAnim();
        }
    };

});
