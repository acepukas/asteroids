/*global define:true, my:true */
define(['my.class','app/shape','app/util'],
function(my,Shape,util) {
    
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

            this.time = +new Date();
            this.state = 'default';

            Projectile.Super.call(this,states);

        },

        draw : function(params) {
            if((+new Date()) - this.time > 100) {
                this.time = (+new Date());
                this.state = (this.state === 'default') ? 'alternate' : 'default';
            }

            params.state = this.state;
            Projectile.Super.prototype.draw.call(this,params);
        }

    });

    return Projectile;

});
