/*global requirejs:true */

requirejs.config({
    baseUrl : './scripts/lib',
    paths : {
        app : '../app',
        jquery : 'jquery-1.8.1.min',
        underscore : 'underscore-min',
        handlebars : 'handlebars-1.0.0.beta.6',
        myclass : 'my.class',
        Box2D : 'Box2D'
    },
    shim : {
        underscore : {
            exports : '_' 
        },
        handlebars : {
            exports : 'Handlebars' 
        },
        myclass : {
            exports : 'my' 
        },
        Box2D : {
            exports : 'Box2D'
        }
    }
});

requirejs(['app/game','Box2D','jquery'],
function(app) {
    $(document).ready(function() {
      app.start();
    })
});
