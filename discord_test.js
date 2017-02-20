
const util = require('util');
const request = require('superagent');
const Discord = require('discord.js');
const pry     = require('pryjs');

function log(level, ...args) {
  console.log(`[${level}] ${new Date().toISOString()} ${args}`);
}

const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => { 
    console.log('DEBUG', util.inspect(args));
  },
  error: (...args) => { log('ERROR', args) },
};


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';
const riotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34';
const client = new Discord.Client();
let data = {
  urls: {
    summoner: (name) => {
      return `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${name}?api_key=${riotApiKey}`;
    },
    summonerStatsSummary: (id, season='SEASON2017') => {
return `https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/${id}/summary?season=${season}&&api_key=${riotApiKey}`;
    },
  },
  misc: {}
};


client.on('ready', () => {
  const chan = client.channels.find('type', 'text');
  //const splitContent = msg.content.split(" ");
  //const name = splitContent[splitContent.length - 1];
  const name = 'bluespermwhale';
  const url = data.urls.summoner(name);

  request
  .get(url)
  .then(function(res, err){
    const json = res.res.req.res.text;
    const parsed = JSON.parse(json);
    return parsed[name]['id'];
  })
  .then(function(id) {
    const url = data.urls.summonerStatsSummary(id);
    request
    .get(url)
    .then(function(res, err) {
      const json = res.res.req.res.text;

      const parsed = JSON.parse(json);
      const out = JSON.stringify(parsed['playerStatSummaries'], null, 4);
      chan.send(out, {split: true});
    })
    .catch((err) => { logger.error(err) });
  })
  .catch((err) => { logger.error(err) });
});

//function sendJSON(channel, json, opts={}) {
  //// merge split options with provided
  //channel.send(out, split
//}

// in the future, a dispatch function of sorts
//let commands = {};

const prefix = 'zm';


client.login(discordToken);
