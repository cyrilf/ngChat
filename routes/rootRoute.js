/**
 * Router for the entry point
 */
var rootController = require('../controllers/root');

module.exports = function(app) {
  app.get('/', rootController.index);
};