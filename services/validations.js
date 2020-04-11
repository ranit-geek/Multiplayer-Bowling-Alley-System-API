var Joi = require("joi")

var validateOnboarding = function(payload){
    const schema = {
        lane_number : Joi.number().greater(0).required(), 
        players :Joi.array().items(Joi.object({ name: Joi.string().min(1).required()})).min(1).required()
    }
    return Joi.validate(payload,schema)
}




var validateGamePlay = function(payload){
    const schema = {
        game_id : Joi.number().greater(0).required(), 
        player_id : Joi.number().greater(0).required(), 
        pins_hit_count : Joi.number().greater(-1).less(11).required(),
    }
    return Joi.validate(payload,schema)
}
module.exports = {
    validateOnboarding,
    validateGamePlay
}