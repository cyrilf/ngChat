/**
 * RouteManager
 * - Handle the routes
 */
var RouteManager = {
  /**
   * Init the routes
   * @param  {Object} app The app
   */
  init: function(app) {
    require('../routes/rootRoute')(app);
  }
};

module.exports = RouteManager;