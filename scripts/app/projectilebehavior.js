/*global define:true, my:true */

define(['myclass','app/vector','app/point','app/util'],
function(my,Vector,Point,util) {

    var ProjectileBehavior = my.Class({

        constructor : function(config) {
            if(!(this instanceof ProjectileBehavior)) {
                return new ProjectileBehavior(config);
            }
            
            _.extend(this,config);
            this.birthTime = +(new Date());
            this.initialize();
        },

        initialize : function() {
            if(!!this.source) {
                var so = this.source,
                    dir = so.get('direction'),
                    heading = new Vector(this.startSpeed,dir).combine(so.get('heading')),
                    startVector = new Vector(this.initDistance,dir),
                    pos = new Point(util.addPoints(startVector.getPoint(),so.get('position')));
                this.gameElement.set('heading',heading);
                this.gameElement.set('position',pos);
            }
        },

        update : function(stage) {
            if((+(new Date()) - this.birthTime) > 700) {
                stage.removeGameElement(this.gameElement);
            }
        }

    });

    return ProjectileBehavior;

});
