/*global requirejs:true */

requirejs.config({
    baseUrl : 'scripts/lib',
    paths : {
        app : '../app'
    }
});

requirejs(['app/game'],
function(game) {
    game.start();
});
