/*global define:true, my:true */

define(['my.class','app/util'],
function(my,util){

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
            
            // DOM node for information output
            infoPanel = document.getElementById('infoPanel');
            
        // set up key event listeners
        document.addEventListener('keydown',function(e) {

            if(e.keyCode===37) { keys.left=true; }
            if(e.keyCode===39) { keys.right=true; }
            if(e.keyCode===38) { keys.up=true; }
            if(e.keyCode===40) { keys.down=true; }
            if(e.keyCode===32) { keys.space=true; }

        }, false);

        document.addEventListener('keyup',function(e) {

            if(e.keyCode===37) { keys.left=false; }
            if(e.keyCode===39) { keys.right=false; }
            if(e.keyCode===38) { keys.up=false; }
            if(e.keyCode===40) { keys.down=false; }
            if(e.keyCode===32) { keys.space=false; }

        }, false);

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
                
                var initTimingLoop = function(timing,callback) {
                    var time = +new Date();
                    return function() {
                        if((+new Date())-time > timing) {
                            callback(time);
                            time = +new Date();
                        }
                    };
                };

                var renderLoop = initTimingLoop(framerate,that.render);
                var gameLoop = initTimingLoop(gamespeed,that.update);

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
                // that.clear();
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
                var canvas = document.getElementById('canvas'),
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

            updateInfoPanel : function() {
                var fps = util.round(1000/(+new Date()-time),0),
                    out = '<p>'+motionElements[0]+'</p>';
                    out += '<p>fps :     ' + fps + '</p>';
                // var out = '';
                infoPanel.innerHTML = out;
            }
        };

    }()));

    return Stage;
});
