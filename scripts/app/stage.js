/*global define:true, my:true */

define([
    'myclass',
    'jquery',
    'handlebars',
    'app/canvaswrapper',
    'app/util'
], function(
    my,
    $,
    Handlebars,
    CanvasWrapper,
    util
){

    var Stage = my.Class((function () {

        // tracks key status
        var keys = {
                right:false,
                left:false,
                up:false,
                down:false,
                space:false
            },

            keymap = {
                k37:'left',
                k39:'right',
                k38:'up',
                k40:'down',
                k32:'space'
            },

            // stores 
            time = 0,

            // global friction
            friction = 1.5,

            // canvas context object
            canvas = null,

            // stores a list of motion objects
            gameElements = [],

            // speed for logic loop which runs 
            // independently of animation loop
            gamespeed = Math.round(1000/50),

            // info obj for output
            consoleData = {infoItems:[]},
            
            // output template
            infoPanelTemplate = Handlebars.compile(util.cleanTemplate('#info-panel-template')),
            
            // DOM node for information output
            infoPanel = $('#infoPanel'),

            renderInterval = null,

            gameLoopInterval = null;

        // set up key event listeners
        $(document).keydown(function(e) {
            try {
                keys[keymap['k'+e.which]]=true;
            } catch(ex) {}
        });
        
        $(document).keyup(function(e) {
            try {
                keys[keymap['k'+e.which]]=false;
            } catch(ex) {}
        });

        return {

            constructor : function(physics) {
                if(!(this instanceof Stage)) {
                    return new Stage(physics);
                }
                this.physics = physics;
            },

            init: function() {
                canvas = new CanvasWrapper('#canvas');
            },

            initAnim : function() {

                var gameLoop = util.initTimingLoop(gamespeed,this.update,this);
                gameLoopInterval = setInterval(gameLoop,0);

                $('.stopanim').click($.proxy(function(){
                    this.stopAnim();
                },this));

                canvas.initRenderLoop(this.render,this);

            },

            stopAnim : function() {
                clearInterval(gameLoopInterval);
            },

            getCanvas : function() {
                return canvas;
            },

            getTime : function() {
                return time;
            },

            setTime : function (time_arg) {
                time = time_arg;
            },

            getBounds : function() {
                return canvas.getBounds();
            },

            getKeys : function() {
                return keys;
            },

            getFriction : function() {
                return friction;
            },

            update : function(updTime) {
                this.updateGameElements(updTime);
                var world = this.physics.getWorld(),
                    frameRate = 1/60;

                // run physics simulation
                world.Step(
                  frameRate,
                  8, // velocity iterations
                  3  // position iterations
                );

                world.DrawDebugData();
                world.ClearForces();
            },

            render : function(time) {
                this.setTime(time);
                canvas.clear();
                this.renderGameElements();
                this.updateInfoPanel();
            },

            updateGameElements : function(updTime) {
                var i = gameElements.length;
                while(i--) {
                    if(!!gameElements[i]) {
                        gameElements[i].update(updTime);
                        this.correctPosition(gameElements[i]);
                        // this.detectCollisions(gameElements[i]);
                    }
                }
            },

            renderGameElements : function() {
                var i = gameElements.length;
                while(i--) {
                    if(!!gameElements[i]) {
                        gameElements[i].render();
                    }
                }
            },

            correctPosition : function(ge) { // getionElement as arg
                var bounds = this.getBounds();
                if(ge) {
                    var body = ge.get('body'),
                        op = body.GetPosition(),
                        scale = this.physics.getScale(),
                        x = op.x * scale,
                        y = op.y * scale;
                    
                    if(x > bounds.x2) { body.SetPosition(this.physics.b2Vec2(bounds.x1/scale,op.y)); }
                    if(y > bounds.y2) { body.SetPosition(this.physics.b2Vec2(op.x,bounds.y1/scale)); }
                    if(x < bounds.x1) { body.SetPosition(this.physics.b2Vec2(bounds.x2/scale,op.y)); }
                    if(y < bounds.y1) { body.SetPosition(this.physics.b2Vec2(op.x,bounds.y2/scale)); }
                }
            },

            detectCollisions : function(ge) {
                _.each(gameElements,function(item) {
                    if(!item || !ge) return;

                    if(item !== ge) {
                        var distance = util.distanceBetweenPoints(ge.get('position'),item.get('position'));
                        var selfCollisionRadius = ge.get('collisionRadius');
                        var itemCollisionRadius = item.get('collisionRadius');
                        if(distance < (selfCollisionRadius + itemCollisionRadius)){
                            ge.get('motionElement').collisionDetected(item);
                        }
                    }
                });
            },

            addGameElement : function(ge) {
                gameElements.push(ge);
            },

            removeGameElement : function(ge) {
                var i = gameElements.length;

                while(i--) {
                    if(gameElements[i] === ge) {
                        gameElements.splice(i,1); 
                    }
                }
                
            },

            getNumOfGameElements : function() {
                return gameElements.length;
            },

            getFps : function() {
                return util.round(1000/(Date.now()-this.getTime()),0);
            },

            updateInfoPanel : function() {
                consoleData.infoItems = [];
                var main = gameElements[0],
                    el = main.get('className'),
                    pos = main.get('position'),
                    heading = main.get('heading');
                
                consoleData.infoItems.push({label:el + ' Position',value:pos});
                // consoleData.infoItems.push({label:el + ' Heading',value:heading});
                // consoleData.infoItems.push({label:'fps',value:this.getFps()});
                infoPanel.html(infoPanelTemplate(consoleData));
            }
        };

    }()));

    return Stage;
});
