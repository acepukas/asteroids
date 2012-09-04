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
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111'
                    }
                },
                'state1':{
                    'points':points,
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111'
                    }
                },
                'state2':{
                    'points':points,
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111'
                    }
                },
                'state3':{
                    'points':points,
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111'
                    }
                },
                'state4':{
                    'points':points,
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':2.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111'
                    }
                }
            };

            var grad = util.gradient('006699','ff6666',4);

            var key = null;
            var i = 0;
            for(key in states) {
                if(states.hasOwnProperty(key)) {
                    states[key].drawStyles.fillStyle = '#'+grad[i];
                    i++;
                }
            }

            this.state = 'default';
            this.stateKeys = _.keys(states);
            this.statePointer = 0;

            var that = this;
            var loop = util.initTimingLoop(50,function(time){
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
