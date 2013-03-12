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
    'app/asteroid',
    'app/asteroidbehavior',
    'app/gameElement'
] , function(
    _,
    my,
    util,
    MotionElement,
    Ship,
    HumanControlled,
    Projectile,
    ProjectileBehavior,
    Asteroid,
    AsteroidBehavior,
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
                    this.compProps.physics = config.physics;
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
                    physics : config.physics,
                    'components' : c
                });

            return ge;
        },

        createShip : function () {

            return this.generateGameElement([
                {name:'motionElement',construct:MotionElement,compProps:{maxSpeed:15,minSpeed:1.9,mass:500}},
                {name:'shape',construct:Ship,compProps:{scale:2}},
                {name:'behavior',construct:HumanControlled,compProps:{turnrate:10}}
            ]);

        },

        createAsteroid : function() {
            
            return this.generateGameElement([
                {name:'motionElement',construct:MotionElement,compProps:{direction:util.randRange(0,360),minSpeed:util.randRange(10,200)/100,maxSpeed:2,mass:10000,type:'asteroid'}},
                {name:'shape',construct:Asteroid,compProps:{scale:1}},
                {name:'behavior',construct:AsteroidBehavior,compProps:{}}
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
