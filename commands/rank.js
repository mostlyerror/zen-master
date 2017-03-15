const RiotApi = require('../riot')
const rp = require('request-promise')
const stringify = require('json-stringify')
const pry = require('pryjs')
const logger = require('../logger')
const rankEntryTransform = require('../transforms/rankEntry')

module.exports = function (db) {
  return function(msg, ...args) {
    const username = msg.author.username
    let name = db.userToSummonerMap[username] || username
    rp.get({
      uri: RiotApi.urls.getSummoner(name),
      json: true,
      resolveWithFullResponse: true,
      transform: function (json, res) {
        if (res.statusCode === 404) throw(`Couldn't find summoner named ${name}`)
        return json[name]['id']
      }
    })
    .then(function (id) {
      return rp.get({
        uri: RiotApi.urls.getSummonerLeagueEntry(id),
        json: true,
        transform: rankEntryTransform(id),
      })
    })
    .then(function (rankData) {
      msg.channel.send(stringify(rankData, null, 2, {offset: 4}), {code: true})
    })
    .catch((err) => {
      logger.error(err)
      let out =  "Oops! Something went wrong..\n"
          out += err.message
      msg.channel.send(out, {code: true})
    })
  }
}

