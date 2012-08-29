/*global define:true, my:true  */

define(['my.class','app/shape','app/util'],
function(my,Shape,util) {

    var Ship = my.Class(Shape,{

        constructor : function(scale) {
            if(!(this instanceof Ship)) {
                return new Ship(scale);
            }

            var states = {
                'default':{
                    'points':[
                        {x:-20, y:  0}, // tail
                        {x:-10, y: 15},
                        {x: -2, y: 15},
                        {x: 40, y:  0}, // nose
                        {x: -2, y:-15},
                        {x:-10, y:-15}
                    ],
                    'scale':scale,
                    'drawStyles':{
                        'lineWidth':3.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111',
                        'fillStyle':'#666666'
                    }
                }
            };
            
            Ship.Super.call(this,states);
        }

    });

    return Ship;

});
