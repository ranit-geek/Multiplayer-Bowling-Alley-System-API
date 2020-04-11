var db = require('../dao/db')
var queries = require('../dao/queries')

var updateScore = async function (req,player){
    let set = player[0]["setNumber"]
    let playCount = player[0]["setChance"]
    let prevPoint = player[0]["prevPoint"]
    let totalPoint = player[0]["points"]
    let bonus = player[0]["bonusRound"]
    let setStrategies = JSON.parse(player[0]["sets"])
    console.log(setStrategies)

    if(playCount === 0 && req.body.pins_hit_count ===10 && set <= 10){
        //strike
        await handleStrike(req,bonus,totalPoint,set,setStrategies)
    }
    else if(playCount === 1 && req.body.pins_hit_count+prevPoint === 10 && set <= 10 ){
        //spare
        await handleSpare(req,bonus,totalPoint,set,playCount,setStrategies)
    }
    else if(set <= 10){
        //simple
        await handleSimple(req,bonus,totalPoint,set,prevPoint,playCount,setStrategies)
    }

}

var handleStrike = async function(req,bonus,totalPoint,set,setStrategies){
    let point
    if(bonus === 0){
        point = totalPoint + req.body.pins_hit_count+10
        setStrategies.push({"strategy_name":"STRIKE"})
    }
    else{
        point = totalPoint + req.body.pins_hit_count
    }
    if(set === 10){
        bonus++
    }
    await db.writeQuery(queries.updateUser,[set+1,0,0,point,JSON.stringify(setStrategies),bonus,req.body.player_id])
}

var handleSpare =async function(req,bonus,totalPoint,set,playCount,setStrategies){
    let point
    if(bonus === 0){
        point = totalPoint+req.body.pins_hit_count+5
        if(setStrategies.length === set){
            setStrategies.pop()
            setStrategies.push({"strategy_name":"SPARE"})
        }
        
    }
    else{
        point = totalPoint+req.body.pins_hit_count
    }
    if(set === 10){
        bonus++
    }
    await db.writeQuery(queries.updateUser,[set+1,playCount-1,0,point,JSON.stringify(setStrategies),bonus,req.body.player_id])
}

var handleSimple =async function(req,bonus,totalPoint,set,prevPoint,playCount,setStrategies){
    if(playCount === 0){
        playCount++
        prevPoint = req.body.pins_hit_count
        
        setStrategies.push({"strategy_name":"SIMPLE"})
        console.log("after"+setStrategies)
    }
    else{
        playCount--
        set++
        prevPoint = 0
        
    }
    await db.writeQuery(queries.updateUser,[set,playCount,prevPoint,totalPoint+req.body.pins_hit_count,JSON.stringify(setStrategies),bonus,req.body.player_id])
}

module.exports={
    updateScore
}