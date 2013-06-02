/**
 * Router for the entry point
 */
var rootController = require('../controllers/rootController');

module.exports = function(app) {
  app.get('/', rootController.index);
};