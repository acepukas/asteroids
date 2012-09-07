/*global define:true, my:true */

define(
[
    'underscore',
    'my.class',
    'app/util',
    'app/motionelement',
    'app/ship',
    'app/humancontrolled',
    'app/projectile',
    'app/projectilebehavior',
    'app/gameElement'
]
, function(
    _,
    my,
    util,
    MotionElement,
    Ship,
    HumanControlled,
    Projectile,
    ProjectileBehavior,
    GameElement
) {

    var config = {};

    var GameElementFactory = my.Class({

        constructor : function(conf) {
            if(!(this instanceof GameElementFactory)) {
                return new GameElementFactory(conf);
            }

            config = _.extend(config,conf);

        },

        createElement : function (elConf) {
            var elType = elConf.type || 'null';
            var createMethod = 'create'+util.cap(elType);
            if(this[createMethod]){
                return this[createMethod](elConf.config);
            }
            return null;
        },

        createShip : function () {

            var ge = new GameElement({
                gameElementFactory : this,
                stage : config.stage
            });

            var shared = {
                gameElement : ge
            };

            ge.setShape(new Ship(_.extend({
                scale: 2
            },shared)));

            ge.setMotionElement(new MotionElement(_.extend({
                maxSpeed:15,
                mass:500
            },shared)));

            ge.setBehavior(new HumanControlled(_.extend({
                turnrate:8
            },shared)));

            return ge;

        },

        createProjectile : function(config) {

            var me = new MotionElement({
                stage:this.stage,
                shape:new Projectile(2.5),
                maxSpeed:100,
                mass:600
            });

            me.setBehavior(new ProjectileBehavior({
                startSpeed:15,
                motionElement:me,
                initDistance:90,
                source:(config.source || null)
            }));

            return me;
        }
    });

    return GameElementFactory;

});
