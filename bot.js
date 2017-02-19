const request = require('superagent');
const Discord = require('discord.js');
const pry     = require('pryjs');
const fs      = require('fs');
const util    = require('util');

function log(level, ...args) {
  console.log(`[${level}]\t${new Date().toISOString()} ${args}`);
}

const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => {
    console.log(util.inspect(args));
  },
  error: (...args) => { log('ERROR', args) },
};


let data = {
  urls: {},
  misc: {}
};

const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';
const riotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34';
const client = new Discord.Client();

client.on('ready', () => {
  logger.info("My body is ready..");

  // this should pull from a database
  // then "failover" to request from Riot API
  // local database acts as a cache, kinda

  // load shrek.txt into memory
  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err;
    const lines = buf.toString().split('\n\n');
    data.misc['shrek'] = lines;
    logger.info("shrek.txt loaded");
  });
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
    if (command === "summoner") {
      
      logger.debug('msg.content', msg.content);

      const splitContent = msg.content.split(" ");
      const summonerName = splitContent[splitContent.length - 1];

      // look up summoner data in cache first
      let summonerData = data.summoners[summonerName];

      if (summonerData !== undefined) {

        msg.reply("Here you go...");
        msg.channel.send(summonerData);
        msg.channel.send(" ..homo.");

      } else {

        const summonerByNameURL = `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${summonerName}?api_key=${riotApiKey}`;
        logger.info("Requesting URL", summonerByNameURL);

        request
          .get(summonerByNameURL)
          .set('Accept', 'application/json')
          .end(function(err, res){
            logger.debug(res.req.res);

            summonerData = res.req.res.text;
            data.summoners[summonerData] = summonerData;
            //let summonerData = JSON.parse(res.req.res.text);
            msg.reply("Here you go...");
            msg.channel.send(summonerData);
            msg.channel.send(" ..homo.");
          });
      }
    }

    if (command === "cache") {
      msg.channel.send("```\n", 'asdfasfasf test', "\n```\n");
    }

    // http://knowyourmeme.com/memes/shrek-is-love-shrek-is-life
    if (command === "shrek") {
      let i = randomInt(0, data.misc.shrek.length);
      const text = data.misc.shrek[i];
      msg.channel.send(text, {tts: true});
    }

    //if (content === "reset") { msg.reply("resetting available champion pool"); }
  }
});

// random int between low, high exclusive
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}


client.login(discordToken);
