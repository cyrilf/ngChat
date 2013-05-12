/**
 * userModel
 * - Management of the username
 * @type {Object}
 */
var userModel = {
  // List of usernames used
  usernames: [],

  /**
   * Claim a username
   * @param  {String} username the username wanted
   * @return {Boolean}         is the username already used or no ?
   */
  claim : function(username) {
    if (!username || this.usernames[username]) {
      return false;
    } else {
      this.usernames[username] = true;
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
   * Remove a username (on disconnection)
   * @param  {String} username username to remove
   */
  remove: function(username) {
    var currentUsername;
    for(var i = 0, l = this.usernames.length; i < l; i++) {
      currentUsername = this.usernames[i];
      if(currentUsername === username) {
        delete currentUsername;
      }
    }
  }
};

module.exports = userModel;