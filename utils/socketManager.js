var userModel = require('../models/userModel');
var Conf      = require('../public/javascripts/conf').Conf;

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

    // The user send us his username (from localstorage)
    socket.on('hello', function(data) {

      var username = data.username;

      // If no username has been sent or the username isn't valid or is already taken,
      // we generate a new one.
      if(!userModel.validateUsername(username) || !userModel.claim(username)) {
        username = userModel.generateUsername();
      }

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
        var error = {};

        // Validate the username
        if(userModel.validateUsername(data.username)) {

          // Check if the username isn't already taken.
          if(userModel.claim(data.username)) {

            var oldUsername = username;
            userModel.remove(oldUsername);

            username = data.username;

            socket.broadcast.emit('change:username', {
              oldUsername: oldUsername,
              newUsername: username
            });

            // Everything's fine. Username changed.
            callback();
          } else {
            error.message = Conf.messages.usernameAlreadyTaken;
            callback(error);
          }
        } else {
          error.message = Conf.messages.usernameInvalid;
          callback(error);
        }
      });

      // Send a message to all users (broadcast)
      socket.on('send:message', function (data, callback) {
        if(userModel.validateMessage(data.message)) {
          socket.broadcast.emit('send:message', {
            user: username,
            content: data.message
          });

          callback();
        } else {
          var error = {
            message: Conf.messages.messageInvalid
          };
          callback(error);
        }
      });

      // Notify all users that someone has disconnected
      socket.on('disconnect', function() {
        socket.broadcast.emit('leave:user', {
          username: username
        });
        userModel.remove(username);
      });
    });
  }
};

module.exports = SocketManager;