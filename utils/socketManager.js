var userModel = require('../models/user');

/**
 * SocketManager
 * - Handle the socket connection
 * @type {Object}
 */
var SocketManager = {
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
      users: userModel.usernames
    });

    // Notify other clients that a new user is here
    socket.broadcast.emit('new:user', {
      username: username
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