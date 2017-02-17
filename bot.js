const request = require('superagent');
const Discord = require('discord.js');
const pry     = require('pryjs');

function log(level, ...args) {
  console.log(`[${level}] ${new Date().toISOString()} ${args}`);
}

const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => { log('DEBUG', args) },
  error: (...args) => { log('ERROR', args) },
};

let data = {};

const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';
const riotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34';
const client = new Discord.Client();

client.on('ready', () => {
  logger.info("My body is ready..");

  // this should pull from a database
  // then "failover" to request from Riot API
  // local database acts as a cache, kinda
});

// in the future, a dispatch function of sorts
//let commands = {};

const prefix = 'zm';

client.on('message', (msg) => {
  logger.info(msg.author.username, msg.content);

  // only handle zm <message>
  if (msg.content.startsWith(prefix)) {

    // prevent botception
    if (msg.author.bot) return;

    const command = msg.content.split(' ')[1];

    logger.info("Command was " + command);

    if (command === "ping") msg.reply("pong");

    // zm summoner <summonerName>
    if (command.startsWith("summoner")) {
      
      logger.debug('msg.content', msg.content);

      const splitContent = msg.content.split(" ");
      const summonerName = splitContent[splitContent.length - 1];

      //logger.debug('splitContent', splitContent);
      //logger.debug('summonerName', summonerName);

      // find the current game that the summoner is in
      const summonerByNameURL = `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${summonerName}?api_key=${riotApiKey}`;
      logger.info("Requesting URL", summonerByNameURL);
      request
        .get(summonerByNameURL)
        .set('Accept', 'application/json')
        .end(function(err, res){
          let summonerData = res.req.res.text;
          //let summonerData = JSON.parse(res.req.res.text);
          logger.debug(summonerData);

          msg.reply("Here you go...");
          msg.channel.send(summonerData);
          msg.channel.send(" ..homo.");
        });
    }

    //if (content === "reset") { msg.reply("resetting available champion pool"); }

    // add shrek thing
    // http://knowyourmeme.com/memes/shrek-is-love-shrek-is-life
  }
});

client.login(discordToken);
