/*global requirejs:true */

requirejs.config({
    baseUrl : './scripts/lib',
    paths : {
        app : '../app',
        jquery : 'jquery-1.8.1.min',
        underscore : 'underscore-min'
    },
    shim : {
        underscore : {
            exports : '_' 
        }
    }
});

requirejs(['app/game'],
function(game) {
    game.start();
});
