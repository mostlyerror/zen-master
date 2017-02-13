
const Discord = require('discord.js');
var LolApi = require('leagueapi');

const client = new Discord.Client();
const token = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';

function log(level, ...args) {
  console.log(`[${level}] ${new Date().toISOString()} ${args}`);
}

const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => { log('DEBUG', args) },
  error: (...args) => { log('ERROR', args) },
};

let globalData = {};

client.on('ready', () => {
  logger.info("My body is ready..");
 
  LolApi.init('t98b67977-fba4-4435-88a0-461acf65bb34', 'na');

  logger.info("Fetching champions..");


  LolApi.getChampions(true, function(err, champs) {
    logger.info(champs);
    globalData.champs = champs;
  });
});

let commands = {};

const prefix = 'zm';

client.on('message', (msg) => {
  logger.info(msg.author.username, msg.content);

  if (msg.content.startsWith(prefix)) {

    // prevent botception
    if (msg.author.bot) return;

    let content = msg.content.split(' ')[1];
    
    logger.debug(content);

    if (content === "ping") msg.reply("pong");

    if (content === "reset") msg.reply("resetting available champion pool");

    // add shrek thing
    // http://knowyourmeme.com/memes/shrek-is-love-shrek-is-life

  }
});


client.login(token);
