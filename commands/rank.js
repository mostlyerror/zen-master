const RiotApi = require('../riot')
const rp = require('request-promise')
const stringify = require('json-stringify')
const pry = require('pryjs')
const logger = require('../logger')
const rankEntryTransform = require('../transforms/rankEntry')

module.exports = function(msg, ...args) {
  let name = args[0]
  let url = RiotApi.urls.getSummoner(name)
  rp.get({
    uri: url,
    json: true,
    transform: function (json, res) {
      return json[name]['id']
    }
  })
  .then(function (id) {
    let url = RiotApi.urls.getSummonerLeagueEntry(id)
    return rp.get({
      uri: url,
      json: true,
      transform:rankEntryTransform,
    })
  })
  .then(function (rankData) {
    msg.channel.send(stringify(rankData, null, 2, {offset: 4}))
  })
  .catch((err) => {
    logger.error(err)
    msg.channel.send('oops! something went wrong.')
  })
}

