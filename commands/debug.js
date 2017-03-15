const stringify = require('json-stringify')

module.exports = function (db) {
  return function (msg, ...args) {
    let out = stringify(db, null, 2, {offset: 4})
    msg.channel.send(out, {split: true, code: true})
  }
}
