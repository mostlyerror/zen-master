const request = require('superagent');
const util = require('util');
const apiKey = '98b67977-fba4-4435-88a0-461acf65bb34';

const riotApi = {
  urls: {
    summonerByName: (name) => {
      return `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${name}?api_key=${apiKey}`;
    },
    summonerStatsById: (id, season='SEASON2017') => {
return `https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/${id}/summary?season=${season}&&api_key=${apiKey}`;
    },
  }
};

const name = 'jasonwaterfallz';

// request.get(riotApi.urls.summonerByName(name));

// get summoner data object from riot
let url = riotApi.urls.summonerByName(name);
request
  .get(url)
  .then(function(res, err){
    const json = res.res.req.res.text;
    const parsed = JSON.parse(json);
    return parsed[name]['id'];
  })
    // get the summoner stats summary from riot
  .then(function(id) {
    let url = riotApi.urls.summonerStatsById(id);
    request
      .get(url)
      .then(function(res, err) {
        const json = res.res.req.res.text;
        const parsed = JSON.parse(json);
	console.log(util.inspect(parsed));
      })
  })
  .catch(function (err) {
    console.log('error happened?', err);
  });

