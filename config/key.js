process.env.NODE_ENV === 'prod'
  ? (module.exports = require('./prod'))
  : (module.exports = require('./dev'))
