/**
 * Global configuration
 * This file is used server/client side
 * @type {Object}
 */

(function(exports) {
  var Conf = {
    // Server port
    port: 2377,

    // Messages used in our chat
    messages: {
      usernameAlreadyTaken:  'This username is already taken, please choose another one.',
      usernameInvalid:       'The username isn\'t valid.'
                              + '\n A valid username is :'
                                + '\n Not a forbidden one'
                                + '\n / Aplha and Numeric'
                                + '\n /  @ . + _ - symbols are accepted'
                                + '\n / Between 2 and 35 chars long',

      messageInvalid: 'Your message is too long or invalid, it wasn\'t sent.',

      initBadUsername: 'Sorry, your username is already used or is invalid.'
                       + ' We picked a new one for you, you\'re free to change it now.',
      newUser:         '<%= username %> is here.',
      leaveUser:       '<%= username %> has just left.',
      changeUsername:  '<%= oldUsername %> changed his username to <%= newUsername %>.'
    },

    // Config about the chat
    robotName:        'system',
    defaultUsername:  'Guest ',

    // Validation
    validUsername: {
      regex: /^[a-zA-Z0-9@\.\+ _-]{2,35}$/
    },
    validMessage: {
      length: {
        min: 0,
        max: 350
      }
    }
  };

  exports.Conf = Conf;
})((typeof module === 'undefined' || module.exports === 'undefined') ? this : module.exports);