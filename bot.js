//const request = require('superagent')
const Discord = require('discord.js')
const pry     = require('pryjs')
const fs      = require('fs')
const util    = require('util')
//const getJSON = require('get-json')
//const Q       = require('q')
//const request = require('request')
//const deferredGet = Q.nfbind(request)
const rp = require('request-promise')
//const prettyjson = require('prettyjson')
const stringify = require('json-stringify')

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
const RiotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34'
const bot = new Discord.Client()

const RiotApi = {
  baseUrl: 'https://na.api.pvp.net/api/lol/na',
  apiString: `?api_key=${RiotApiKey}`,
  urls: {
    getSummoner: (name) => {
      return `${RiotApi.baseUrl}/v1.4/summoner/by-name/${name}${RiotApi.apiString}`
    },
    getSummonerLeague: (id) => {
      return `${RiotApi.baseUrl}/v2.5/league/by-summoner/${id}${RiotApi.apiString}`
    }
  }
}

let db = {
  misc: {},
  summoners: {}
}

bot.on('ready', () => {

  logger.info("My body is ready..")

  // load shrek.txt into memory
  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err
    const lines = buf.toString().split('\n\n')
    db.misc['shrek'] = lines
    logger.info("shrek.txt loaded")
  })
  
  registerCommand('zm', 'help', (msg, ...args) => {
    msg.channel.send('fu!')
  })

  registerCommand('zm', 'rank', (msg, ...args) => {
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
      //logger.debug(data)
      //logger.debug(msg)
      let out = stringify(data, null, 2, {offset: 4})
      msg.channel.send(out, {split: true})
    })
    .catch((err) => {
      logger.error(err)
    })
  })
})

function registerCommand (prefix, command, callback) {
  bot.on('message', (msg) => {
    // prevent botception
    if (msg.author.bot) return false

      // split message into prefix, command, and arguments
      let parsed = msg.content.split(' ')
      let [prefix, cmd] = parsed.splice(0, 2)
      let args = (parsed.length ? parsed : [])

      // fire the registered handler
      if (msg.content.startsWith(prefix) && (cmd === command)) callback(msg, args)
  })
}

// random int between low, high exclusive
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low)) + low
}

// zm start <name> -> name
function lastArg(msg) {
  const splitContent = msg.content.split(" ")
  return splitContent[splitContent.length - 1]
}

bot.login(discordToken)

// show line number of this pesky warning/error!
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack)
})

