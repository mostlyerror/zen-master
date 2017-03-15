//{
  //"name": "Xin Zhao's Heralds",
  //"tier": "BRONZE",
  //"queue": "RANKED_SOLO_5x5",
  //"entries": [
    //{
      //"playerOrTeamId": "24095381",
      //"playerOrTeamName": "ogbg",
      //"division": "V",
      //"leaguePoints": 44,
      //"wins": 50,
      //"losses": 67,
      //"isHotStreak": false,
      //"isVeteran": true,
      //"isFreshBlood": false,
      //"isInactive": false
    //}
  //]
//}
module.exports = function (json, res) {
  const data = json[id.toString()]
  const rankData = data[0]
  const { tier, queue, entries: [{wins, losses, division, leaguePoints}] } = rankData
  return {
    tier: tier,
    queue: queue,
    wins: wins,
    losses: losses,
    division: division,
    leaguePoints: leaguePoints,
  }
}


