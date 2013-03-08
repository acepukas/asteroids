/*global define:true */

define(['app/stage','app/gameelementfactory','jquery'],
function(Stage,GameElementFactory) {

    var SCALE = 10, // scale for Box2D world
        gravity = new Box2D.Common.Math.b2Vec2(0,0),
        world = new Box2D.Dynamics.b2World(gravity,true), // Box2D world
        debugDraw = new Box2D.Dynamics.b2DebugDraw(),
        debugCanvas = $('#debugCanvas'),
        debugCanvasRaw = debugCanvas.get(0);

    debugCanvasRaw.width=$(window).width();
    debugCanvasRaw.height=$(window).height();

    debugDraw.SetSprite(debugCanvas.get(0).getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit,Box2D.Dynamics.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    return {
        start : function(){
            var stage = new Stage(world,SCALE);
            var maxObjs = 20;
            stage.init();
            var gef = new GameElementFactory({
              'stage':stage,
              'world':world,
              'SCALE':SCALE
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
