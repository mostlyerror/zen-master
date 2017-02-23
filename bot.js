const Discord = require('discord.js')
const pry     = require('pryjs')
const fs      = require('fs')
const util    = require('util')
const getJSON = require('get-json')

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
  urls: {
    getSummoner: (name) => {
      return `${RiotApi.baseUrl}/v1.4/summoner/by-name/${name}?api_key=${RiotApi.apiKey}`
    },
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
  
  registerCommand('zm', 'help', (msg, ...args) => {
    logger.debug(msg, args)
    msg.channel.send('fu!')
  })

  registerCommand('zm', 'rank', (msg, ...args) => {
    let name = args[0]
    msg.channel.send(RiotApi.urls.getSummoner(name))
  })
})

function registerCommand (prefix, command, callback) {
  client.on('message', (msg) => {
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

client.login(discordToken)

// show line number of this pesky warning/error!
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack)
})

