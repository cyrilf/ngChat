var _ = require('underscore');
/**
 * userModel
 * - Management of the username
 * @type {Object}
 */
var userModel = {
  // List of users
  users: [],

  /**
   * Claim a username
   * @param  {String} username the username wanted
   * @return {Boolean}         is the username already used or no ?
   */
  claim : function(username) {
    var userAlreadyExist = _.find(this.users, function findUser(user) {
      return (user.username === username);
    });
    if (!username || userAlreadyExist) {
      return false;
    } else {
      var newUser = {
        username: username
      };
      this.users.push(newUser);
      return true;
    }
  },

  /**
   * Generate a username
   * @return {String} usernme generated
   */
  generateUsername: function() {
    var username;
    var nextUserId = 1;

    do {
      username = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!this.claim(username));

    return username;
  },

  /**
   * Remove a user (on disconnection)
   * @param  {String} username username to remove
   */
  remove: function(username) {
    this.users = _.reject(this.users, function removeUser(user) {
      return (user.username === username);
    });
  }
};

module.exports = userModel;