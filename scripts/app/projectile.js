/*global define:true, my:true */
define(['myclass','underscore','app/shape','app/util'],
function(my,_,Shape,util) {

    var config = {},
    
        Projectile = my.Class(Shape,{

        constructor : function(conf) {
            if(!(this instanceof Projectile)) {
                return new Projectile(conf);
            }

            config = conf;

            var points = util.generateCircPoints(16,3),

                states = {
                    'default':{
                        'points':points,
                        'scale':config.scale*1.3,
                        'drawStyles':{
                            'lineWidth':2.0,
                            'lineCap':'round',
                            'lineJoin':'round',
                            'strokeStyle':'#111'
                        }
                    },
                    'state1':{
                        'points':points,
                        'scale':config.scale,
                        'drawStyles':{
                            'lineWidth':2.0,
                            'lineCap':'round',
                            'lineJoin':'round',
                            'strokeStyle':'#111'
                        }
                    },
                    'state2':{
                        'points':points,
                        'scale':config.scale,
                        'drawStyles':{
                            'lineWidth':2.0,
                            'lineCap':'round',
                            'lineJoin':'round',
                            'strokeStyle':'#111'
                        }
                    },
                    'state3':{
                        'points':points,
                        'scale':config.scale,
                        'drawStyles':{
                            'lineWidth':2.0,
                            'lineCap':'round',
                            'lineJoin':'round',
                            'strokeStyle':'#111'
                        }
                    },
                    'state4':{
                        'points':points,
                        'scale':config.scale,
                        'drawStyles':{
                            'lineWidth':2.0,
                            'lineCap':'round',
                            'lineJoin':'round',
                            'strokeStyle':'#111'
                        }
                    }
                },

                grad = util.gradient('006699','ff6666',4),

                key = null,
                i = 0,
                that = this,
                loop = null;

            for(key in states) {
                if(states.hasOwnProperty(key)) {
                    states[key].drawStyles.fillStyle = '#'+grad[i];
                    i++;
                }
            }

            this.state = 'default';
            this.stateKeys = _.keys(states);
            this.statePointer = 0;

            loop = util.initTimingLoop(50,function(time){
                that.state = that.nextState();
            });

            setInterval(loop,0);

            Projectile.Super.call(this,{
                'states':states,
                gameElement:config.gameElement
            });

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
