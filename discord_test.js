
const util = require('util');
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


const discordToken = 'Mjc5Nzc4NjA4MDg2Nzc3ODU3.C3_2QA.nosV5EIvvl8ageIAGoWDlbTUqp4';
const riotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34';
const client = new Discord.Client();

client.on('ready', () => {
  logger.info("My body is ready..");
  const channel = client.channels.find('type', 'text');
  logger.debug(util.inspect(channel));
});

// in the future, a dispatch function of sorts
//let commands = {};

const prefix = 'zm';


client.login(discordToken);
