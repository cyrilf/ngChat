var userModel = require('../models/user');

/**
 * SocketManager
 * - Configure socket.io
 * - Handle the socket connection
 * @type {Object}
 */
var SocketManager = {
  /**
   * Configure the socket.io connection
   * @param  {Object} server A server object
   */
  configure: function(server) {
    var io = require('socket.io').listen(server);

    // Development
    io.configure('development', function(){
      io.set('transports', ['websocket']);
    });

    // Production (following Heroku recommendations)
    io.configure('production', function () {
      io.set("transports", ["xhr-polling"]);
      io.set("polling duration", 10);
    });

    // Handle new socket connection
    io.sockets.on('connection', SocketManager.handleSocket);
  },

  /**
   * Handle the socket connection and listen for event
   * @param  {Object} socket the socket from the conenction
   */
  handleSocket: function(socket) {
    // Generate a new username
    var username = userModel.generateUsername();

    // Send the username and the list of connected users
    socket.emit('init', {
      username: username,
      users: userModel.users
    });

    // Notify other clients that a new user is here
    socket.broadcast.emit('new:user', {
      username: username
    });

    // Validate and notify a username change
    socket.on('change:username', function (data, callback) {
      if (userModel.claim(data.username)) {
        var oldUsername = username;
        userModel.remove(oldUsername);

        username = data.username;

        socket.broadcast.emit('change:username', {
          oldUsername: oldUsername,
          newUsername: username
        });

        callback(true);
      } else {
        callback(false);
      }
    });

    // Send a message to all users (broadcast)
    socket.on('send:message', function(data) {
      socket.broadcast.emit('send:message', {
        user: username,
        content: data.message
      });
    });

    // Notify all users that someone has disconnected
    socket.on('disconnect', function() {
      socket.broadcast.emit('leave:user', {
        username: username
      });
      userModel.remove(username);
    });
  }
};

module.exports = SocketManager;