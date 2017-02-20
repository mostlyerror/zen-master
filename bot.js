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


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';
const client = new Discord.Client();
const prefix = 'zm';

const RiotApi = {
  apiKey: '98b67977-fba4-4435-88a0-461acf65bb34',
  baseUrl: 'https://na.api.pvp.net/api/lol/na/v1.4',
  getSummoner: function (name) {
    const url = `${this.baseUrl}/summoner/by-name/${name}?api_key=${this.apiKey}`;
    request
    .get(url)
    .end(function(err, res){
      if (err) throw err;
      let data =  JSON.parse(res.req.res.text);
      return data;
    });
  },
}


let data = {
  summoners: {},
  misc: {}
};


client.on('ready', () => {
  logger.info("My body is ready..");

  RiotApi.getSummoner('jasonwaterfallz');

  // load shrek.txt into memory
  fs.readFile('shrek.txt', (err, buf) => {
    if (err) throw err;
    const lines = buf.toString().split('\n\n');
    data.misc['shrek'] = lines;
    logger.info("shrek.txt loaded");
  });
});


client.on('message', (msg) => {
  logger.info(msg.author.username, msg.content);

  // only handle zm <message>
  if (msg.content.startsWith(prefix)) {
    // prevent botception
    if (msg.author.bot) return;

    const command = msg.content.split(' ')[1];

    logger.info("Command was " + command);

    if (command === "start") {
      const summonerName = lastArg(msg);

      //// data lookup for the message sender's league id
      //let name = msg.author.name;
      //let summonerID = data.summonerNameIdMap[name];
      //if (!summonerID) {
        //// request the ID by name from riot
        //summonerId = requestSummonerId(name);
        //data.summonerNameIdMap[name] = summonerId;
        //// store in data hash
      //} else {
      //}
    }

    if (command === "ping") msg.reply("pong");

    // zm summoner <summonerName>
    if (command === "summoner") {
      const summonerName = lastArg(msg);
      let summonerData = data.summoners[summonerName];
      if (summonerData !== undefined) {
        msg.channel.send(summonerData);
      } else {
        let summonerData = RiotApi.getSummonerByName(summonerName);
        data.summoners[summonerName] = summonerData;
        msg.channel.send(summonerData);
      }
    }

    if (command === "stats") {
      //const splitContent = msg.content.split(" ");
      //const name = splitContent[splitContent.length - 1];
      //const url = data.urls.summonerByName(name);

      //request
      //.get(url)
      //.then(function(res, err){
        //const json = res.res.req.res.text;
        //const parsed = JSON.parse(json);
        //return parsed[name]['id'];
      //})
      //.then(function(id) {
        //const url = data.urls.summonerStatsById(id);
        //request
        //.get(url)
        //.then(function(res, err) {
          //const json = res.res.req.res.text;
          //const parsed = JSON.parse(json);
          //console.log(util.inspect(parsed));

          //msg.channel.send(parsed);
        //})
      //})
      //.catch(function (err) {
        //console.log('error happened?', err);
      //});

    }

    // http://knowyourmeme.com/memes/shrek-is-love-shrek-is-life
    if (command === "shrek") {
      let i = randomInt(0, data.misc.shrek.length);
      const text = data.misc.shrek[i];
      msg.channel.send(text, {tts: true});
    }

    //if (command === "cache") {
      //msg.channel.send("```\n", 'asdfasfasf test', "\n```\n");
    //}
    //
    //if (content === "reset") { msg.reply("resetting available champion pool"); }
  }
});

// random int between low, high exclusive
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}

// zm start <name> -> name
function lastArg(msg) {
  const splitContent = msg.content.split(" ");
  return splitContent[splitContent.length - 1];
}

client.login(discordToken);
