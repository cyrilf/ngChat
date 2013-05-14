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
    $scope.users = data.users;
  });

  // When someone has sent a message
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
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
   * Send a message
   */
  $scope.sendMessage = function() {
    socket.emit('send:message', {
      message: $scope.message
    });

    addMessage($scope.username, $scope.message);
    $scope.message = '';
  };
}