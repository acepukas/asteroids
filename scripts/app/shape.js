/*global define:true, my:true */

define(['my.class','app/util'],
function(my,util){

    var Shape = my.Class({

        constructor : function(scale,shapeData) {
            if(!(this instanceof Shape)) {
                return new Shape(scale,shapeData);
            }

            this.scale = scale;
            this.shapeData = shapeData;
            this.bbox = null;
            this.imgData = null;
        },

        getBbox : function() {
            return this.bbox;
        },
        
        setBbox : function(bbox) {
            this.bbox = bbox;
        },

        getShapeData : function() {
            return this.shapeData;
        },
        
        setShapeData : function(shapeData) {
            this.shapeData = shapeData;
        },

        getScale : function() {
            return this.scale;
        },
        
        setScale : function(scale) {
            this.scale = scale;
        },

        draw : function(params) {
            var ctx = params.ctx,
                pos = params.position;
            ctx.save();
            ctx.fillStyle="#FFF";
            ctx.translate(pos.x,pos.y);
            ctx.fillText("Shape: basic shape object.",0,0);
            ctx.restore();
        },

        plotShapeData : function(params) {
            params.scale = this.scale;
            params.shapeData = this.shapeData;
            this.bbox = util.plotShapeData(params);
        },

        saveBackground : function(params) {
            this.imgData = params.ctx.getImageData(
                this.bbox.blitZone.x,
                this.bbox.blitZone.y,
                this.bbox.blitZone.w,
                this.bbox.blitZone.h
            );
        },

        restoreBackground : function(params) {
            if(this.bbox !== null) {
                params.ctx.putImageData(
                    this.imgData,
                    this.bbox.blitZone.x,
                    this.bbox.blitZone.y
                );
            }
        },

        drawBoundingBox : function(params) {
            var ctx = params.ctx;
            ctx.lineWidth = 1;
            ctx.strokeStyle="#ffff00";
            ctx.strokeRect(
                this.bbox.bounds.x,
                this.bbox.bounds.y,
                this.bbox.bounds.w,
                this.bbox.bounds.h
            );
        }

    });

    return Shape;
});
