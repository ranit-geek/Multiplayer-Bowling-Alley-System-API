var db = require('../dao/db')
var queries = require('../dao/queries')

var createGame = async function(req){
    let games = await db.readQuery(queries.findGamesByLane,[req.body.lane_number])
    console.log(games)
    if(games.length === 0){
        await db.writeQuery(queries.insertToGame,[req.body.lane_number])
    }

}

var getCurrentGame = async function(lane_id){
    return await db.readQuery(queries.findGamesByLane,[lane_id])

}

module.exports={
    createGame,
    getCurrentGame
}