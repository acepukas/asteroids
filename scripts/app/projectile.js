/*global define:true, my:true */
define(['my.class','underscore','app/shape','app/util'],
function(my,_,Shape,util) {
    
    var Projectile = my.Class(Shape,{

        constructor : function(scale) {
            if(!(this instanceof Projectile)) {
                return new Projectile(scale);
            }

            var points = util.generateCircPoints(16,3);

            states = {
                'default':{
                    'points':points,
                    'scale':scale*1.3,
                    'drawStyles':{
                        'lineWidth':3.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#d71',
                        'fillStyle':'#c60'
                    }
                },
                'alternate':{
                    'points':points,
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#a33',
                        'fillStyle':'#922'
                    }
                }
            };

            this.state = 'default';
            this.stateKeys = _.keys(states);
            this.statePointer = 0;

            var that = this;
            var loop = util.initTimingLoop(100,function(time){
                that.state = that.nextState();
            });

            setInterval(loop,0);

            Projectile.Super.call(this,states);

        },

        nextState : function() {
            if(this.statePointer >= this.stateKeys.length) {
                this.statePointer = 0;
            }

            return this.stateKeys[this.statePointer++];
        }

    });

    return Projectile;

});
