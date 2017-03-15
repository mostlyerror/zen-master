const Discord = require('discord.js')
const fs      = require('fs')
const util    = require('util')
const logger = require('./logger')

// commands
const rankCommand = require('./commands/rank')
const helpCommand = require('./commands/help')
const registerCommand = require('./commands/register')
const debugCommand = require('./commands/debug') // dump in-memory db


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4'
const bot = new Discord.Client()

let db = {
  misc: {},
  summoners: {},
  userToSummonerMap: {},
}

bot.on('ready', () => {

  logger.info("My body is ready..")

  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err
    const lines = buf.toString().split('\n\n')
    db.misc['shrek'] = lines
    logger.info("shrek.txt loaded")
  })
  
  attachCommandHandler('zm', 'rank',     rankCommand(db))
  attachCommandHandler('zm', 'help',     helpCommand)
  attachCommandHandler('zm', 'register', registerCommand(db))
  attachCommandHandler('zm', 'debug',    debugCommand(db))
})

function attachCommandHandler (prefix, command, callback) {
  bot.on('message', (msg) => {
    // prevent botception
    if (msg.author.bot) return false
    const parsedMessage = parseMessage(msg)

    // fire the attached handler
    if (msg.content.startsWith(prefix) && (parsedMessage.command === command)) {
      callback(msg, parsedMessage.args)
    }
  })
}

// splits message into prefix, command, and arguments
function parseMessage(msg) {
  let parsed = msg.content.split(' ')
  let [prefix, cmd] = parsed.splice(0, 2)
  let args = (parsed.length ? parsed : [])
  return {
    prefix: prefix,
    command: cmd,
    args: args
  }
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

