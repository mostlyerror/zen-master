const RiotApi = require('../riot')
const rp = require('request-promise')
const stringify = require('json-stringify')
const pry = require('pryjs')
const logger = require('../logger')

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
      transform: function (json, res) {
        const data = json[id.toString()]
        const rankData = data[0]
        const { tier, queue, entries: [{wins, losses, division, leaguePoints}] } = rankData
        return {
          tier: tier,
          queue: queue,
          wins: wins,
          losses: losses,
          division: division,
          leaguePoints: leaguePoints,
        }
      }
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

