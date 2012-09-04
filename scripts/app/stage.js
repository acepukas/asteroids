/*global define:true, my:true */

define(['my.class','jquery','handlebars','app/util'],
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

            // stores stage oundries in 
            // order to correct object position
            bounds = {},

            // stores 
            time = 0,

            // global friction
            friction = 1,

            // canvas context object
            ctx = null,

            // stores a list of motion objects
            motionElements = [],

            // 60 frames per second
            // seems that to register as 60, + 10 is needed
            framerate = Math.round(1000/72),

            gamespeed = Math.round(1000/50),

            // info obj for output
            consoleData = {infoItems:[]},
            
            // output template
            infoPanelTemplate = Handlebars.compile(util.cleanTemplate('#info-panel-template')),
            
            // DOM node for information output
            infoPanel = $('#infoPanel');
            
        // set up key event listeners
        $(document).keydown(function(e) {
            try {
                keys[keymap['k'+e.which]]=true;
            } catch(e) {}
        });
        
        $(document).keyup(function(e) {
            try {
                keys[keymap['k'+e.which]]=false;
            } catch(e) {}
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

                var renderLoop = util.initTimingLoop(framerate,that.render);
                var gameLoop = util.initTimingLoop(gamespeed,that.update);

                setInterval(renderLoop,0);
                setInterval(gameLoop,0);

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
                that.positionMotionElements();
            },

            render : function(time) {
                that.setTime(time);
                that.clear();
                that.renderMotionElements();
                that.updateInfoPanel();
            },

            positionMotionElements : function() {
                var i = motionElements.length;
                while(i--) {
                    motionElements[i].update();
                    that.correctPosition(motionElements[i]);
                }
            },

            renderMotionElements : function() {
                var i = motionElements.length;
                while(i--) {
                    motionElements[i].render();
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
                    ctx.save();
                    ctx.clearRect(bounds.x1,bounds.y1,bounds.x2,bounds.y2);
                    ctx.restore();
                };

                return ctx;
            },
            
            getCanvasSize : function(sz) {
                var w = sz,
                    h = w * 9 / 16;
                return [w,h];
            },

            correctPosition : function(mo) { // motionElement as arg
                if(mo) {
                    var p = mo.getPosition();
                    if(p.x > bounds.x2) { p.x = bounds.x1; }
                    if(p.y > bounds.y2) { p.y = bounds.y1; }
                    if(p.x < bounds.x1) { p.x = bounds.x2; }
                    if(p.y < bounds.y1) { p.y = bounds.y2; }
                }
            },

            addMotionElement : function(mo) {
                motionElements.push(mo);
            },

            removeMotionElement : function(mo) {
                var i = motionElements.length;

                while(i--) {
                    if(motionElements[i] === mo) {
                        motionElements.splice(1,i); 
                    }
                }
                
            },

            getFps : function() {
                return util.round(1000/(+new Date()-time),0);
            },

            updateInfoPanel : function() {
                consoleData.infoItems = [];
                var mo = motionElements[0];
                var el = mo.getName();
                
                consoleData.infoItems.push({label:el + ' Position',value:mo.getPosition()});
                consoleData.infoItems.push({label:el + ' Heading',value:mo.getHeading()});
                consoleData.infoItems.push({label:'fps',value:this.getFps()});
                infoPanel.html(infoPanelTemplate(consoleData));
            }
        };

    }()));

    return Stage;
});
