/**
 * RootController
 * @type {Object}
 */
var RootController = {

  index: function(req, res, next) {
    res.render('index');
  }
};

module.exports = RootController;