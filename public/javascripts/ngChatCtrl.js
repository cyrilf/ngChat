'use strict';

/**
 * ngChatCtrl
 */
function ngChatCtrl($scope, socket) {

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
  socket.on('new:user', function (data) {
    var content = 'User ' + data.username + ' is here.';
    sendMessage('system', content);

    $scope.users.push(data.username);
  });

  // When a user disconnnect
  socket.on('leave:user', function (data) {
    var content = 'User ' + data.username + ' has just left.';
    sendMessage('system', content);

    var user;
    for (var i = 0, l = $scope.users.length; i < l; i++) {
      user = $scope.users[i];
      if (user === data.username) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });

  /**
   * Methods
   */

  /**
   * Send a message from a user
   * @param  {String} username username of the sender
   * @param  {String} content  content of the message
   */
  var sendMessage = function (username, content) {
    $scope.messages.push({
      user: username,
      content: content
    });
  };

  /**
   * Methods called in public side (attached to $scope)
   */

  $scope.messages = [];

  /**
   * Send a message
   */
  $scope.sendMessage = function() {
    socket.emit('send:message', {
      message: $scope.message
    });

    sendMessage($scope.username, $scope.message);
    $scope.message = '';
  };
}