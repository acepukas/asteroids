/*global define:true, my:true */

define([
    'myclass',
    'app/vector',
    'app/point',
    'app/util'
] , function(
    my,
    Vector,
    Point,
    util
) {

    var AsteroidBehavior = my.Class({

        constructor : function(config) {
            if(!(this instanceof AsteroidBehavior)) {
                return new AsteroidBehavior(config);
            }
            
            _.extend(this,config);
            this.initialize();
        },

        initialize : function() {
            var stage = this.gameElement.get('stage');
            var bounds = stage.getBounds();

            var x = util.randRange(bounds.x1,bounds.x2)
            var y = util.randRange(bounds.y1,bounds.y2)
            var pos = new Point(x,y);
            this.gameElement.set('position',pos);

            var direction = util.tr(util.randRange(0,360));
            var mag = this.gameElement.get('minSpeed');
            var heading = new Vector(mag,direction);
            this.gameElement.set('heading',heading);

            this.turnRate = util.randRange(5) / 10;
        },

        update : function() {

            if(!!this.gameElement) {
                var direction = this.gameElement.get('direction');
                this.gameElement.set('direction',direction+util.tr(this.turnRate));
            }

        },

        collision : function(collider){
            if(!!this.gameElement && collider.className === 'Projectile') {
                var stage = this.gameElement.get('stage');
                stage.removeGameElement(this.gameElement);
                stage.removeGameElement(collider);
            }
        }

    });

    return AsteroidBehavior;

});
