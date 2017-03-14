const RiotApi = require('../riot')
const rp = require('request-promise')
const stringify = require('json-stringify')

module.exports = function(msg, ...args) {
  let name = args[0]
  let url = RiotApi.urls.getSummoner(name)

  msg.channel.send('retrieving ranked data for ' + name)
  msg.channel.send(url)

  rp.get({
    uri: url,
    transform: function (body, res) {
      let data = JSON.parse(body)
      return data[name]['id']
    }
  })
  .then(function (id) {
    let url = RiotApi.urls.getSummonerLeague(id)
    return rp.get({
      uri: url,
      transform: function (body, res) {
        let data = JSON.parse(body)
        let rankData = data[id.toString()]
        logger.debug('rankData', rankData)
        return rankData
      }
    })
  })
  .then(function (data) {
    let out = stringify(data, null, 2, {offset: 4})
    msg.channel.send(out, {split: true})
  })
  .catch((err) => {
    logger.error(err)
  })
}

