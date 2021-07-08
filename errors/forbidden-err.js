const { ERR_CODE_FORBIDDEN } = require('../utils/constants');

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_CODE_FORBIDDEN;
  }
}

module.exports = ConflictErr;
