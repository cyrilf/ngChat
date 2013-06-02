'use strict';

/**
 * ngChatCtrl
 */
function ngChatCtrl($scope, socket) {

  $scope.messages = [];

  /**
   * At the very beginning, we say to the server:
   * "Hey it's me and I'm called `username` (from localstorage)"
   * or '' if no username is in localstorage
   */

  socket.emit('hello', {
    username: localStorage.username || ''
  });

  /**
   * Socket events listeners
   */

  // When the server emit a init event
  // it means that everything is ready.
  // It give us our username and a list of connected user
  socket.on('init', function (data) {
    $scope.username    = data.username;
    $scope.newUsername = data.username;
    $scope.users       = data.users;

    // Warn us if our old username (in localstorage) is used by someone else
    var usernameAlreadyUsed = (localStorage.username &&
      (localStorage.username !== data.username));
    if (usernameAlreadyUsed) {
      var content = 'Sorry, your username is already used or is invalid.' +
        ' We picked a new one for you, you\'re free to change it now.';
      addMessage('system', content);
    }
  });

  // When someone a sends message
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

  // When someone changes his username
  socket.on('change:username', function (data) {
    changeUsername(data.oldUsername, data.newUsername);
  });

  // When a new user connects
  socket.on('new:user', function (user) {
    var content = user.username + ' is here.';
    addMessage('system', content);
    $scope.users.push(user);
  });

  // When a user disconnnects
  socket.on('leave:user', function (userLeave) {
    var content = userLeave.username + ' has just left.';
    addMessage('system', content);
    $scope.users = _.reject($scope.users, function removeUser(user) {
      return (user.username === userLeave.username);
    });
  });

  /**
   * Methods
   */

  /**
   * Change a username
   * @param  {String} oldUsername old username
   * @param  {String} newUsername new username
   */
  var changeUsername = function(oldUsername, newUsername) {
    var user = _.findWhere($scope.users, {username: oldUsername});
    user.username = newUsername;
    var content = oldUsername + ' changed his username to ' + newUsername + '.';
    addMessage('system', content);
  };

  /**
   * Add a message to the messages
   * @param  {String} username username of the sender
   * @param  {String} content  content of the message
   */
  var addMessage = function (username, content) {
    $scope.messages.push({
      user: username,
      content: content
    });
  };

  /**
   * Methods called in public side (attached to $scope)
   */

  /**
   * Change your username
   */
  $scope.changeUsername = function() {
    // Because ng-repeat create a new scope for each item
    // we're using "this" instead of "$scope".
    // (and "self" is used on the callback)
    var self = this;
    socket.emit('change:username', {
      username: this.newUsername
    }, function (error) {
      if (error) {
        addMessage('system', error.message);
      } else {
        changeUsername($scope.username, self.newUsername);
        $scope.username = self.newUsername;
        localStorage.username = $scope.username;
        self.displayChangeUsername = false;
      }
    });
  };

  /**
   * Send a message
   */
  $scope.sendMessage = function() {
    var message = $scope.message.trim();
    if (message !== '') {
      socket.emit('send:message', {
        message: message
      }, function(error) {
        if(error) {
          addMessage('system', error.message);
        } else {
          addMessage($scope.username, message);
          $scope.message = '';
        }
      });
    }
  };
}