/*global define:true */

define(['app/stage','app/motionelement','app/shape','app/ship','app/humancontrolled'],
function(Stage,MotionElement,Shape,Ship,HumanControlled) {

    return {
        start : function(){
            var stage = new Stage(1000,'./gfx/tile3.jpg',function(stage) {
                var me = new HumanControlled({
                    motionElement : new MotionElement({
                        'stage':stage,
                        shape:new Ship(2),
                        mass:500,
                        maxSpeed:10
                    }),
                    turningRate:8
                });
                stage.addMotionElement(me);
            });
            stage.init();
        }
    };

});
