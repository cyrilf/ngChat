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
  },

  /**
   * Validate a username
   * A valid username is :
   *   + Not a forbidden one
   *   + Aplha and Numeric
   *   + @ . + _ - are accepted symbols
   *   + Between 2 and 35 chars long
   * @param  {String} username  the username to validate
   * @return {Boolean}          Is the username valid ?
   */
  validateUsername: function(username) {
    // Check if the username is not a forbidden one
    var forbiddenUsernames = [
      'system'
    ];
    var isForbiddenUsername = _.find(forbiddenUsernames, function(forbiddenUsername) {
      return (forbiddenUsername == username);
    });

    if(isForbiddenUsername) {
      return false;
    }

    // Check if it's a valid username
    var validUsername = /^[a-zA-Z0-9@\.\+ _-]{2,35}$/;
    if(!validUsername.test(username)) {
      return false;
    }

    return true;
  }
};

module.exports = userModel;