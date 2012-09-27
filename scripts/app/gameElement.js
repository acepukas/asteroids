/*global define:true, my:true */

define(['underscore','myclass','app/util'],
function(_,my,util) {

    var componentMap = {
        'stage' : 'stage',
        'className' : 'className',
        'heading' : 'motionElement.heading',
        'position' : 'motionElement.position',
        'direction' : 'motionElement.direction'
    },

        GameElement = my.Class({

        constructor : function(conf) {
            if(!(this instanceof GameElement)) {
                return new GameElement(conf);
            }

            var that = this,
            // copy components array
                comps = conf.components.slice();
            // then remove from config before merging
            delete conf.components;
            // merge conf into object's 'this' scope
            _.extend(that,conf);
            // instantiate each component
            _.each(comps,function(item) {
                that[item.name] = item.init(that);
            });
            
            that.className = that.shape.toString();
        },

        update : function(time) {
            this.behavior.update();
            this.motionElement.update(time);
        },

        render : function() {
            this.shape.draw(this);
        },

        get : function(key,parent) {
            if(!!componentMap[key]) {
                var subkey = '',
                    curobj = this,
                    path = this.objectPath(key),
                    i = 0, l = path.length;
                    if(parent) { l=l-1; }
                for(i=0;i<l;i+=1) {
                    subkey = path[i];
                    curobj = curobj[subkey];
                }

                return curobj;

            }
            return null;
        },

        objectPath : function (key) {
            return componentMap[key].split('.');
        },

        set : function(key,value) {
            var path = this.objectPath(key),
                lastObjKey = path.pop(),
                parent = this.get(key,true);
            parent[lastObjKey] = value;
        },

        toString : function() {
            return this.className;
        }

    });

    return GameElement;

});
