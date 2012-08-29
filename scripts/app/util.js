/*global define:true, my:true */
define(function(){

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
            var l = params.shapeData.length,
                i = l,
                tp = null,
                x1=Infinity,
                y1=Infinity,
                x2=-Infinity,
                y2=-Infinity,
                bboffset = 5;

            while(i--) {
                tp = params.shapeData[i];
                tp = this.rotate(tp,params.dir);
                this.scale(tp,params.scale);
                this.translate(tp,params.position);
                if(i===l) {
                    params.ctx.moveTo(tp.x,tp.y);
                } else {
                    params.ctx.lineTo(tp.x,tp.y);
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
            var ctx = params.ctx,
                pos = params.position,
                textMetrics = null,
                height = 48,
                bboffset = 5,
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
            var shDtType = this.type(params.shapeData),
                funcs = {'array':this.plotPoints,'string':this.plotText};
            return funcs[shDtType].call(this,params);
        },

        addPoints : function(p1,p2) {
            return {x:p1.x+p2.x,y:p1.y+p2.y};
        },

        foreach : function(object,callback) {
            var key = null;
            for(key in object) {
                if(object.hasOwnProperty(key)) {
                    callback(key,object[key]);
                }
            } 
        }

    };
    
});
