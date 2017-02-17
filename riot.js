const request = require('superagent');

const apiKey = '98b67977-fba4-4435-88a0-461acf65bb34';


// TODO : accept this from the command line?
const summonerName = 'jasonwaterfallz';


// find the current game that the summoner is in
const url = `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${summonerName}?api_key=${apiKey}`;


console.log('requesting ' + url);
request
  .get(url)
  .set('Accept', 'application/json')
  .end(function(err, res){
    let summonerData = JSON.parse(res.req.res.text);
    console.log(summonerData);
  });

