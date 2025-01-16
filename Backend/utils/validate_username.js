function isUsernameValid(username) {
    // Regular expression to check for spaces
    const spaceRegex = /\s/;
    return !spaceRegex.test(username);
  }

  module.exports = isUsernameValid