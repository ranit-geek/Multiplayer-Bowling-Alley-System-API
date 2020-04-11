var db = require('../dao/db')
var queries = require('../dao/queries')


var onboardPlayers = async function(req){
    let users = req.body.players
    let players = []
    users.forEach(element => {
        players.push([element.name,req.body.lane_number,1,0,0,0,"[]",0])
    });
    await db.writeManyQuery(queries.insertToUsers,players)
}

var getPlayers = async function(lane_number){
    return await db.readQuery(queries.readUsers,[lane_number])
}

module.exports={
    onboardPlayers,
    getPlayers
}