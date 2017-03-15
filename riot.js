// riot.js
const RiotApiKey = '98b67977-fba4-4435-88a0-461acf65bb34'
const RiotApi = {
  baseUrl: 'https://na.api.pvp.net/api/lol/na',
  apiString: `?api_key=${RiotApiKey}`,
  urls: {
    getSummoner: (name) => {
      return `${RiotApi.baseUrl}/v1.4/summoner/by-name/${name}${RiotApi.apiString}`
    },
    getSummonerLeague: (id) => {
      return `${RiotApi.baseUrl}/v2.5/league/by-summoner/${id}${RiotApi.apiString}`
    },
    getSummonerLeagueEntry: (id) => {
      return `${RiotApi.baseUrl}/v2.5/league/by-summoner/${id}/entry${RiotApi.apiString}`
    },
  }
}

module.exports = RiotApi
