const request = require('superagent')
const Discord = require('discord.js')
const pry     = require('pryjs')
const fs      = require('fs')
const util    = require('util')

function log(level, ...args) {
  console.log(`[${level}]\t${new Date().toISOString()} ${args}`)
}

const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => {
    console.log(util.inspect(args))
  },
  error: (...args) => { log('ERROR', args) },
}


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4'
const client = new Discord.Client()

const RiotApi = {

  apiKey: '98b67977-fba4-4435-88a0-461acf65bb34',
  baseUrl: 'https://na.api.pvp.net/api/lol/na',

  getSummoner: function (name) {
    const url = `${this.baseUrl}/v1.4/summoner/by-name/${name}?api_key=${this.apiKey}`
    request
    .get(url)
    .end(function (err, res){
      if (err) throw err
      let data =  JSON.parse(res.req.res.text)
      data.summonersData[name] = data
      return data
    })
  },

  getSummonerRank: function (id) {
    const url = `${this.baseUrl}/v2.5/league/by-summoner/${name}?api_key=${this.apiKey}`
    request
    .get(url)
    .end(function (err, res) {
      if (err) throw err
      let data =  JSON.parse(res.req.res.text)
      data.summonerRanks[id] = data
      return data
    })
  }
}

let db = {
  misc: {},
  summoners: {}
}

client.on('ready', () => {
  logger.info("My body is ready..")

  // load shrek.txt into memory
  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err
    const lines = buf.toString().split('\n\n')
    db.misc['shrek'] = lines
    logger.info("shrek.txt loaded")
  })
  
  registerCommand('zm', 'help', (msg, args) => {
    msg.channel.send('fu!');
  })
})

function registerCommand (prefix, cmd, callback) {
  client.on('message', (msg) => {
    let [command, args] = parseMessage(msg)
    if (msg.content.startsWith(prefix) && (cmd === command)) {
      callback(msg, args)
    }
  })
}

function parseMessage (msg) {
  const split = msg.content.split(' ')
  return [split[1], split.slice(2, split.length)]
}


//client.on('message', (msg) => {
  //logger.info(msg.author.username, msg.content)

  //// only handle zm <message>
  //if (msg.content.startsWith(prefix)) {
    //// prevent botception
    //if (msg.author.bot) return

    //const command = msg.content.split(' ')[1]
    ////logger.info("Command was " + command)

    //if (command === "start") {
      //const summonerName = lastArg(msg)

      ////// data lookup for the message sender's league id
      ////let name = msg.author.name
      ////let summonerID = data.summonerNameIdMap[name]
      ////if (!summonerID) {
        ////// request the ID by name from riot
        ////summonerId = requestSummonerId(name)
        ////data.summonerNameIdMap[name] = summonerId
        ////// store in data hash
      ////} else {
      ////}
    //}

    //if (command === "ping") msg.reply("pong")

    //// zm summoner <summonerName>
    //if (command === "summoner") {

      //const name = lastArg(msg)
      //let data = db.summoners[name]

      //if (data) 
        //msg.channel.send(data)
      //else 
      //{
        //let data = RiotApi.getSummonerByName(name)
        //db.summoners[name] = data
        //msg.channel.send(data)
      //}

    //}


    //if (command === "rank") {
      //const summonerName = lastArg(msg)
      //let summonerData = db.summoners[summonerName]
      //if (summonerData)
      //{
        ////let id = data.summoners[summonerName]['id']
      //}
      //else
      //{
        //let summonerData = RiotApi.getSummonerByName(summonerName)
        //db.summoners[summonerName] = summonerData
        //let id = summonerData['id']
        //if (!db.summoners) db.summoners = {}
        //db.summoners[id] = summonerData
        //let rank = RiotApi.getSummonerRank(id)
        //summonerData.rank = rank
        //logger.debug(rank)
        //msg.channel.send(rank)
      //}
    //}

    //// nsfw http://knowyourmeme.com/memes/shrek-is-love-shrek-is-life
    //if (command === "shrek") {
      //let i = randomInt(0, db.misc.shrek.length)
      //const text = db.misc.shrek[i]
      //msg.channel.send(text, {tts: true})
    //}
  //}
//})

// random int between low, high exclusive
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low)) + low
}

// zm start <name> -> name
function lastArg(msg) {
  const splitContent = msg.content.split(" ")
  return splitContent[splitContent.length - 1]
}


client.login(discordToken)

// show line number of this pesky warning/error!
//process.on("unhandledRejection", err => {
  //console.error("Uncaught Promise Error: \n" + err.stack)
//})

