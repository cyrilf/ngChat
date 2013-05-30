'use strict';

/**
 * ngChatCtrl
 */
function ngChatCtrl($scope, socket) {

  $scope.messages = [];

  /**
   * Socket events listeners
   */

  // Create content for a new user
  socket.on('init', function (data) {
    $scope.username = data.username;
    $scope.newUsername = data.username;
    $scope.users    = data.users;
  });

  // When someone has sent a message
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

  // When someone change his username
  socket.on('change:username', function (data) {
    changeUsername(data.oldUsername, data.newUsername);
  });

  // When a new user is connected
  socket.on('new:user', function (user) {
    var content = 'User ' + user.username + ' is here.';
    addMessage('system', content);
    $scope.users.push(user);
  });

  // When a user disconnnect
  socket.on('leave:user', function (userLeave) {
    var content = 'User ' + userLeave.username + ' has just left.';
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
    var message = 'User ' + oldUsername + ' changed his username to ' + newUsername;
    addMessage('system', message);
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
    }, function (usernameChanged) {
      if (!usernameChanged) {
        var message = 'This username is already taken, choose another one';
        addMessage('system', message);
      } else {
        changeUsername($scope.username, self.newUsername);
        $scope.username = self.newUsername;
        self.displayChangeUsername = false;
      }
    });
  };

  /**
   * Send a message
   */
  $scope.sendMessage = function() {
    var message = $scope.message.trim();
    if(message !== '') {
      socket.emit('send:message', {
        message: message
      });

      addMessage($scope.username, message);
    }
    $scope.message = '';
  };
}