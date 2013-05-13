/**
 *                      .d8888b.  888               888
 *                     d88P  Y88b 888               888
 *                     888    888 888               888
 *   88888b.   .d88b.  888        88888b.   8888b.  888888
 *   888 "88b d88P"88b 888        888 "88b     "88b 888
 *   888  888 888  888 888    888 888  888 .d888888 888
 *   888  888 Y88b 888 Y88b  d88P 888  888 888  888 Y88b.
 *   888  888  "Y88888  "Y8888P"  888  888 "Y888888  "Y888
 *                 888
 *            Y8b d88P      A simple chat
 *             "Y88P"
 */

/**
 * Require dependencies
 */
var app            = module.exports = require('express')();
var http           = require('http');
var server         = http.createServer(app);

/**
 * Require our files
 */
var appManager     = require('./utils/appManager');
var routeManager   = require('./utils/routeManager');
var socketManager  = require('./utils/socketManager');

/**
 * App configuration
 */
appManager.configure(app);

/**
 * Routes
 */
routeManager.init(app);

/**
 * Configure socket.io and
 * create a socket on a client connection
 */
socketManager.configure(server);

/**
 * Launch server
 */
var port = process.env.PORT || 2377;
server.listen(port, function() {
  console.log("ngChat is ready, you can chat at http://%s:%d",
    server.address().address, server.address().port);
});