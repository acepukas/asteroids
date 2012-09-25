/*global define:true, my:true */

define(['myclass','jquery','handlebars','app/util'],
function(my,$,Handlebars,util){

    var Stage = my.Class((function () {

        // tracks key status
        var that = null, // for closure issues when scope is needed
        
            keys = {
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

            // stores stage boundries in 
            // order to correct object position
            bounds = {},

            // stores 
            time = 0,

            // global friction
            friction = 1,

            // canvas context object
            ctx = null,

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
            
        // paul irish's requestAnimationFrame shim
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       || 
                    window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame    || 
                    window.oRequestAnimationFrame      || 
                    window.msRequestAnimationFrame     || 
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
        }());
            
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

            constructor : function(width) {
                if(!(this instanceof Stage)) {
                    return new Stage(width);
                }
                
                // capture this as that
                that = this;
                that.width = width;

            },

            init: function() {
                ctx = that.setUpCanvas();
            },

            initAnim : function() {

                var gameLoop = util.initTimingLoop(gamespeed,that.update);
                gameLoopInterval = setInterval(gameLoop,0);

                $('.stopanim').click($.proxy(function(){
                    this.stopAnim();
                },this));

                (function animLoop() {
                    window.requestAnimFrame(animLoop);
                    that.render(Date.now());
                }());

            },

            stopAnim : function() {

                // clearInterval(renderInterval);
                clearInterval(gameLoopInterval);
                
            },

            getCtx : function() {
                return ctx;
            },

            getTime : function() {
                return time;
            },

            setTime : function (time_arg) {
                time = time_arg;
            },

            getBounds : function() {
                return bounds;
            },

            getKeys : function() {
                return keys;
            },

            getFriction : function() {
                return friction;
            },

            update : function() {
                that.positionGameElements();
            },

            render : function(time) {
                that.setTime(time);
                that.clear();
                that.renderGameElements();
                that.updateInfoPanel();
            },

            positionGameElements : function() {
                var i = gameElements.length;
                while(i--) {
                    gameElements[i].update(this);
                    that.correctPosition(gameElements[i]);
                }
            },

            renderGameElements : function() {
                var i = gameElements.length;
                while(i--) {
                    gameElements[i].render();
                }
            },

            setUpCanvas : function() {
                var canvas = $('canvas')[0],
                    wh = that.getCanvasSize(that.width);
                
                canvas.width = wh[0];
                canvas.height = wh[1];
                ctx = canvas.getContext("2d");

                bounds.x1 = 0;
                bounds.y1 = 0;
                bounds.x2 = canvas.width;
                bounds.y2 = canvas.height;

                that.clear = function() {
                    ctx.clearRect(bounds.x1,bounds.y1,bounds.x2,bounds.y2);
                };

                return ctx;
            },
            
            getCanvasSize : function(sz) {
                var w = sz,
                    h = w * 9 / 16;
                return [w,h];
            },

            correctPosition : function(ge) { // getionElement as arg
                if(ge) {
                    var p = ge.get('position');
                    if(p.x > bounds.x2) { p.x = bounds.x1; }
                    if(p.y > bounds.y2) { p.y = bounds.y1; }
                    if(p.x < bounds.x1) { p.x = bounds.x2; }
                    if(p.y < bounds.y1) { p.y = bounds.y2; }
                }
            },

            addGameElement : function(ge) {
                gameElements.push(ge);
            },

            removeGameElement : function(ge) {
                var i = gameElements.length;

                while(i--) {
                    if(gameElements[i] === ge) {
                        gameElements.splice(1,i); 
                    }
                }
                
            },

            getFps : function() {
                return util.round(1000/(+new Date()-time),0);
            },

            updateInfoPanel : function() {
                consoleData.infoItems = [];
                var main = gameElements[0],
                    el = main.get('className'),
                    pos = main.get('position'),
                    heading = main.get('heading');
                
                consoleData.infoItems.push({label:el + ' Position',value:pos});
                consoleData.infoItems.push({label:el + ' Heading',value:heading});
                // consoleData.infoItems.push({label:'fps',value:this.getFps()});
                infoPanel.html(infoPanelTemplate(consoleData));
            }
        };

    }()));

    return Stage;
});
