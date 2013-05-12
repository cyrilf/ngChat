/**
 * AppManager
 * Do the configuration for the app
 * Handle the routes
 * @type {Object}
 */
var AppManager = {
  /**
   * Configure the app
   * @param  {Object} app The app
   */
  configure: function(app) {
    var express = require('express');

    app.configure(function() {
      app.set('views', __dirname + '/../views');
      app.set('view engine', 'jade');
      app.set('view options', {
        layout: false
      });
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.static(__dirname + '/../public'));
      app.use(app.router);
    });

    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function() {
      app.use(express.errorHandler());
    });
  }
};

module.exports = AppManager;