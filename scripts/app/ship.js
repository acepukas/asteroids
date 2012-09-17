/*global define:true, my:true  */

define(['underscore','myclass','app/shape','app/util'],
function(_,my,Shape,util) {

    var config = {},

        Ship = my.Class(Shape,{

        constructor : function(conf) {
            if(!(this instanceof Ship)) {
                return new Ship(conf);
            }

            config = _.extend(config,conf);

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
                    'scale':config.scale,
                    'drawStyles':{
                        'lineWidth':3.0,
                        'lineCap':'round',
                        'lineJoin':'round',
                        'strokeStyle':'#111',
                        'fillStyle':'#666666'
                    }
                }
            };
            
            Ship.Super.call(this,{
                'states':states,
                gameElement:config.gameElement
            });
        }

    });

    return Ship;

});
