/*global define:true, my:true */
define(['jquery'],function($){

    var bboffset = 5;

    return {

        type : function(obj) {
            return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
        },

        tr : function (theta) {
            return theta * (Math.PI/180);
        },

        td : function (theta) {
            return theta * (180/Math.PI);
        },

        round : function(num,decimals) {
            var base10 = Math.pow(10,decimals);
            return Math.round(num*base10)/base10;
        },

        getVelocity : function(v,a,t) {
            return v + (a*(+new Date() - t));
        },

        getAcceleration : function (f,m) {
            if(f === 0) { return 0; }
            return f/m;
        },

        padRight : function(num,padding){
            var numstr = num.toString(),
                result = numstr.split('.');

            padding -= (result[1]) ? result[1].length : 0;
            result = this.strOfChars(padding,'0');
            return numstr + result;
        },

        strOfChars : function(num,char) {
            var str = [];
            while(num--) {
                str.push(char);
            }
            return str.join('');
        },

        /**
        *
        * @method:cacheResult
        * @description: Cache the result of an anonymous function that is intended to 
        *               run only once. Must return a value that is truthy, otherwise,
        *               the key will not register as flaged as storing data, thus, not
        *               returning a cached value
        *
        *               Example Usage:
        *               pnts = $G.U.cacheResult(function() {
        *                   pnts.rc = new vec(size,$G.U.tr(90)).toPoint();
        *                   pnts.lc = new vec(size,-$G.U.tr(90)).toPoint();
        *                   pnts.nc = new vec(100,0).toPoint();
        *                   return pnts;
        *               });
        *
        *               Note: Can not be relied upon to use variables manipulated
        *               within anonymous function, within preceding parent scope.
        *
        */
        cacheResult : function cacheResult(fn,context) {
            var thisfn = cacheResult,
                fncode = fn.toString(),
                storedfn = null;

            if(!thisfn.fnresults) { thisfn.fnresults = {}; }
            
            return (!thisfn.fnresults[fncode]) ?
                thisfn.fnresults[fncode] = fn.call(context||window) :
                thisfn.fnresults[fncode];
        },

        calcAngle : function(p) {
            return this.round(Math.atan2(p.y,p.x),5);
        },
        
        calcMagnitude : function(p) {
            return this.round(Math.sqrt(Math.pow(p.x,2)+Math.pow(p.y,2)),5);
        },

        toPolar : function(p){
            return {'mag':this.calcMagnitude(p),'dir':this.calcAngle(p)};
        },

        toCartesianX : function(mag,dir){
            return this.round(mag * Math.cos(dir),5);
        },

        toCartesianY : function(mag,dir){
            return this.round(mag * Math.sin(dir),5);
        },

        toCartesian : function (vec) {
            return {'x':this.toCartesianX(vec.mag,vec.dir),'y':this.toCartesianY(vec.mag,vec.dir)};
        },

        generateCircPoints : function (numOfPoints,mag) {
            var points = [],
                dirStep = 360 / numOfPoints,
                a = 0;
            
            for(a = 0; a < 360; a+= dirStep) {
                points.push(this.toCartesian({dir:this.tr(a),mag:mag}));
            }

            return points;
        },

        scale : function(point,scale){
            point.x *= scale;
            point.y *= scale;
        },

        translate : function(point,toPos){
            point.x += toPos.x;
            point.y += toPos.y;
        },

        rotate : function(point,dir){
            var vec = this.toPolar(point);
            vec.dir += dir;
            return this.toCartesian(vec);
        },

        plotPoints : function(params) {
            var ps = params.points,
                l = ps.length,
                i = l,
                tp = null,
                x1=Infinity,
                y1=Infinity,
                x2=-Infinity,
                y2=-Infinity,
                dir = params.dir,
                pos = params.pos,
                scale = params.scale;

            while(i--) {
                tp = ps[i];
                tp = this.rotate(tp,dir);
                this.scale(tp,scale);
                this.translate(tp,pos);
                if(i===l) {
                    params.callback(tp,'moveTo');
                } else {
                    params.callback(tp,'lineTo');
                }
                if(tp.x<x1) {x1 = tp.x;}
                if(tp.y<y1) {y1 = tp.y;}
                if(tp.x>x2) {x2 = tp.x;}
                if(tp.y>y2) {y2 = tp.y;}
            }

            tp = i = l = null;
            return this.getBoundsAndBlitZone(x1,x2,y1,y2);
        },

        plotText : function(params){
            var ctx = params.stage.getCtx(),
                pos = params.motionElement.getPosition(),
                textMetrics = null,
                height = 48,
                x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0;

            ctx.font = height.toString() + "px serif";
            ctx.textBaseline = "top";
            ctx.fillText(params.shapeData,pos.x,pos.y);
            textMetrics = ctx.measureText(params.shapeData);

            x1 = pos.x;
            y1 = pos.y;
            x2 = pos.x + textMetrics.width;
            y2 = pos.y + height;

            return this.getBoundsAndBlitZone(x1,x2,y1,y2);

        },

        getBoundsAndBlitZone : function(x1,x2,y1,y2) {
            return {
                'bounds':{x:x1,y:y1,w:(x2-x1),h:(y2-y1)},
                'blitZone':{x:x1-bboffset,y:y1-bboffset,w:(x2-x1)+(bboffset*2),h:(y2-y1)+(bboffset*2)}
            };
        },

        plotShapeData : function(params) {
            var p = params.points,
                shDtType = this.type(p),
                funcs = {'array':this.plotPoints,'string':this.plotText};
            return funcs[shDtType].call(this,params);
        },

        addPoints : function(p1,p2) {
            return {x:p1.x+p2.x,y:p1.y+p2.y};
        },


        initTimingLoop : function(timing,callback) {
            var time = +new Date();
            return function() {
                if((+new Date())-time > timing) {
                    callback(time);
                    time = +new Date();
                }
            };
        },

        cleanTemplate : function(selector) {
            return $.trim($(selector).html()).
                replace(/\n/mg,'').
                replace(/\s{2,}/g,'');
        },

        rgbComponents : function (hexColor) {
            var c = {};
            c.r = parseInt(hexColor.substr(0,2),16);
            c.g = parseInt(hexColor.substr(2,2),16);
            c.b = parseInt(hexColor.substr(4,2),16);
            return c;
        },

        numSteps : function (num1,num2,steps) {

            var num = -(num1 - num2),
                step = num/steps,
                degs = [num1],
                curStep = 0,
                i = 0;

            for(i = 1; i < steps; i++) {
                curStep += step;
                degs.push(Math.round(num1 + curStep));
            }
            
            degs.push(num2);

            return degs;
        },

        numToHex2digit : function (num) {
            var place = (num < 16) ? '0' : '';
            return place + num.toString(16);
        },

        gradient : function (c1,c2,steps) {

            c1 = this.rgbComponents(c1);
            c2 = this.rgbComponents(c2);

            var rSteps = this.numSteps(c1.r,c2.r,steps),
                gSteps = this.numSteps(c1.g,c2.g,steps),
                bSteps = this.numSteps(c1.b,c2.b,steps),

                degs = [],

                i = 0,

                r,g,b;
            
            for(i = 0; i < rSteps.length; i++) {
                r = this.numToHex2digit(rSteps[i]);
                g = this.numToHex2digit(gSteps[i]);
                b = this.numToHex2digit(bSteps[i]);
                degs.push(r+g+b);
            }
            
            return degs;
            
        },

        cap : function(subject) {
            return subject.replace(/^([a-z])(.*)$/,function(orig,first,rest){
                return first.toUpperCase() + rest;
            });
        }

    };
    
});
