/*global define:true, my:true */

define(
[
    'underscore',
    'myclass',
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

    var config = {},

        GameElementFactory = my.Class({

        constructor : function(conf) {
            if(!(this instanceof GameElementFactory)) {
                return new GameElementFactory(conf);
            }

            config = _.extend(config,conf);

        },

        createElement : function (elConf) {
            var elType = elConf.type || 'null',
                createMethod = 'create'+util.cap(elType);
            if(this[createMethod]){
                return this[createMethod](elConf.config || {});
            }
            return null;
        },

        getComponentConf : function(configs) {
            var that = this;
            _.each(configs,function(conf) {
                conf.init = function(gameElement) {
                    this.compProps.gameElement = gameElement;
                    this.compProps.gameElementFactory = that;
                    return new conf.construct(conf.compProps);
                };
            });
            return configs;
        },

        generateGameElement : function(compConfs) {

            var that = this,
                c = this.getComponentConf(compConfs),
                ge = new GameElement({
                    gameElementFactory : that,
                    stage : config.stage,
                    'components' : c
                });

            return ge;
        },

        createShip : function () {

            return this.generateGameElement([
                {name:'motionElement',construct:MotionElement,compProps:{maxSpeed:15,mass:500}},
                {name:'shape',construct:Ship,compProps:{scale:2}},
                {name:'behavior',construct:HumanControlled,compProps:{turnrate:8}}
            ]);

        },

        createProjectile : function(conf) {

            return this.generateGameElement([
                {name:'motionElement',construct:MotionElement,compProps:{maxSpeed:100,mass:500}},
                {name:'shape',construct:Projectile,compProps:{scale:2.5}},
                {name:'behavior',construct:ProjectileBehavior,compProps:{startSpeed:15,initDistance:90,source:(conf.source || null)}}
            ]);
        }

    });

    return GameElementFactory;
});
