/*global define:true, my:true */

define(['underscore','my.class','app/util'],
function(_,my,util) {

    var config = {};

    var GameElement = my.Class({

        constructor : function(conf) {
            if(!(this instanceof GameElement)) {
                return new GameElement(conf);
            }

            config = _.extend(config,conf);
            this.name = ''+config.shape;

        },

        getStage : function() {
            return config.stage;
        },
        
        setStage : function(stage) {
            config.stage = stage;
        },

        getMotionElement : function() {
            return config.motionElement;
        },
        
        setMotionElement : function(motionElement) {
            config.motionElement = motionElement;
            return this;
        },

        getShape : function() {
            return config.shape;
        },
        
        setShape : function(shape) {
            config.shape = shape;
            return this;
        },

        getBehavior : function() {
            return config.behavior;
        },
        
        setBehavior : function(behavior) {
            config.behavior = behavior;
            return this;
        },

        getName : function() {
            return this.name;
        },
        
        setName : function(name) {
            this.name = name;
        },

        update : function() {
            config.behavior.update();
            config.motionElement.update();
        },

        render : function() {
            config.shape.draw(config);
        }

    });

    return GameElement;

});
