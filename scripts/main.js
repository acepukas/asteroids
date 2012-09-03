/*global requirejs:true */

requirejs.config({
    baseUrl : './scripts/lib',
    paths : {
        app : '../app',
        jquery : 'jquery-1.8.1.min',
        underscore : 'underscore-min',
        handlebars : 'handlebars-1.0.0.beta.6'
    },
    shim : {
        underscore : {
            exports : '_' 
        },
        handlebars : {
            exports : 'Handlebars' 
        }
    }
});

requirejs(['app/game'],
function(game) {
    game.start();
});
