//const RiotApi = require('../riot')
//const rp = require('request-promise')
//const stringify = require('json-stringify')
//const logger = require('../logger')

module.exports = function (db) {
  return function(msg, ...args) {
    let userName = msg.author.username
    // username matches summoner name if no args
    // TODO investigate why the double array
    let summonerName = (args.length ? args[0][0] : userName)
    db.userToSummonerMap[userName] = summonerName
    msg.channel.send(`@${userName} registered as summoner: ${summonerName}`, {code: true})

    //TODO pre-fetch summoner ID here

  //let name = (args[0].length ? args[0] : msg.author.username)
  //rp.get({
    //uri: RiotApi.urls.getSummoner(name),
    //json: true,
    //transform: function (json, res) {
      //const status = json['status']['status_code']
      //if (status === 404) throw(`Couldn't find summoner named ${name}`)
      //return json[name]['id']
    //}
  //})
  //.then(function (id) {
    //return rp.get({
      //uri: RiotApi.urls.getSummonerLeagueEntry(id),
      //json: true,
      //transform: rankEntryTransform(id),
    //})
  //})
  //.then(function (rankData) {
    //msg.channel.send(stringify(rankData, null, 2, {offset: 4}))
  //})
  //.catch((err) => {
    //logger.error(err)
    //let out =  "Oops! Something went wrong..\n"
        //out += err.message
    //msg.channel.send(out)
  //})
  }
}
