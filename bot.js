const Discord = require('discord.js')
const fs      = require('fs')
const util    = require('util')
const logger = require('./logger')

// commands
const rankCommand = require('./commands/rank')
const helpCommand = require('./commands/help')


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4'
const bot = new Discord.Client()

let db = {
  misc: {},
  summoners: {}
}

bot.on('ready', () => {

  logger.info("My body is ready..")

  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err
    const lines = buf.toString().split('\n\n')
    db.misc['shrek'] = lines
    logger.info("shrek.txt loaded")
  })
  
  registerCommand('zm', 'rank', rankCommand)
  registerCommand('zm', 'help', helpCommand)
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

