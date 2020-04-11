var express = require('express');
var router = express.Router();
var db = require('../dao/db')
var queries = require('../dao/queries')
var playerService = require('../services/players')
var gameService = require('../services/games')
var scoreboardService = require('../services/scoreboard')
var validate = require('../services/validations')

router.post('/onboard',async function(req, res, next) {

  let validationResults = validate.validateOnboarding(req.body)
  if(validationResults.error !== null){
    res.status(400)
    res.send(validationResults.error.message)
    return
  }
  await playerService.onboardPlayers(req)
  await gameService.createGame(req)
  let response = {}
  let findGame = await gameService.getCurrentGame(req.body.lane_number)
  response.game = findGame[0]
  response.player_details = []
  let results = await playerService.getPlayers(req.body.lane_number)
  results.forEach(ele => {
    response.player_details.push({"player":ele})
    
  })
  res.status(201)
  res.send(response)
})

router.post('/play',async function(req, res, next) {
  let validationResults = validate.validateGamePlay(req.body)
  if(validationResults.error !== null){
    res.status(400)
    res.send(validationResults.error.message)
    return
  }
  let game = await db.readQuery(queries.findGames,[req.body.game_id])
  if(game.length === 0){
    res.status(404)
    res.send("Invalid game id")
    return
  }
  let player = await db.readQuery(queries.findUserFromGame,[game[0]["lane_number"],req.body.player_id])
  if(player.length === 0){
    res.status(404)
    res.send("Invalid player id")
    return
  }
  if(player[0]["prevPoint"] + req.body.pins_hit_count > 10){
    res.status(404)
    res.send("Invalid hit number")
    return
  }
console.log(req.body)
  if(player[0]["bonusRound"] === 1){
    console.log("here")
    player[0]["setNumber"] = 10
    player[0]["setChance"] = 1
    player[0]["prevPoint"] = 0
    player[0]["bonusRound"] = 2

  }
  await scoreboardService.updateScore(req,player)
  let response = {}
  response.game = game[0]
  response.player_details = []
  let players = await db.readQuery(queries.readAllUsersByLane,[game[0].lane_number])
  players.forEach(ele=>{

    response.player_details.push(  { 
      "player": {
          "id": ele.id, 
          "name": ele.name 
      }, 
      "sets": JSON.parse(ele.sets),
      "current_score": ele.points
  })
  })
  if(player[0]["setNumber"]  >10){
    res.status(409)
  }else{
    res.status(200)
  }
  
  res.send(response)

})



module.exports = router;
