# Multiplayer Bowling Alley System API's

#####  Requirements:

 - NodeJS
 - Express
 - Sqlite3

#####  How to run:
 - Go to the root directory
 - Run ```npm install```
 - Run ```node app.js```
 - By default the server will start at ```http://localhost:8099/```

#####  Onboard the players in a game
This API will send the lane number("lane_number") and the name("name") of the players("players") in the request object. In the response, it must send the game id("game_id") and the player id("player_id") as mentioned below. Please ensure that the players are sorted based on the insertion order in the response object.
```
POST /api/onboard
```
Request Object (Sample):
```
{
    "lane_number": 3, -------> integer
        "players": [{
        "name": "A" -------> string
    }, { 
    "name": "B" -------> string
    }]
}
 ```                                   
Response Code: 201

Response Body (Sample):
```
{
    "game": {
        "id": 1, -------> integer
        "lane_number": 3 -------> integer
    },
    "player_details": [
        {
            "player": {
                "id": 1, -------> integer
                "name": "A" -------> string
            } 
        },
        {
            "player": {
                "id": 2,
                "name": "B"
            } 
        }
    ]
}
 ```

#####      Game Play
This API will get called whenever a player("player_id") bowls in the alley and will send the number of pins dropped("pins_hit_count") in the request object. It will get called twice for one player for one set. Then the same API will get called for the next player twice and so on. The response must contain the current score("current_score" -> represents their score from the sets they have played till that time) and information about the sets("sets" -> comprises of the strategy field ("strategy_name") which represents the strategy for each set) of ALL the players. Please ensure that the players are sorted based on the insertion order in the response object.
```
POST /api/play
```
######    1. Player 1, Set 1, First Play:

Request Object:
```
{ 
    "game_id": 1, -------> integer 
    "player_id": 1, -------> integer
    "pins_hit_count": 8 -------> integer
}
 ```
Response Code: 200

Response Body:
```
{
    "game": {
        "id": 1,
        "lane_number": 3
    },
    "player_details": [
        { 
            "player": {
                "id": 1, 
                "name": "A" 
            }, 
            "sets": [{
                "strategy_name": "SIMPLE" -------> ENUM ("SIMPLE","STRIKE","SPARE")
            }],
            "current_score": 8
        },
        { 
            "player": {
                "id": 2, 
                "name": "B" 
            }, 
            "sets": [],
            "current_score": 0
        }
    ]
}
   ```                                 
######        2. Player 1, Set 1, Second Play:

Request Object:
```
{ 
    "game_id": 1, -------> integer 
    "player_id": 1, -------> integer
    "pins_hit_count": 2 -------> integer
}
   ```                                 
Response Code: 200

Response Body:
```
{
    "game": {
        "id": 1,
        "lane_number": 3
    },
    "player_details": [
        { 
            "player": {
                "id": 1, 
                "name": "A" 
            }, 
            "sets": [{
                "strategy_name": "SPARE"
            }],
            "current_score": 15
        },
        { 
            "player": {
                "id": 2, 
                "name": "B" 
            }, 
            "sets": [],
            "current_score": 0
        }
    ]
}
```                             
######    3. Player 2, Set 1, First Play:

Request Object:
```
{ 
    "game_id": 1, -------> integer 
    "player_id": 2, -------> integer
    "pins_hit_count": 10 -------> integer
}
```                                    
Response Code: 200

Response Body:
```
{
    "game": {
        "id": 1,
        "lane_number": 3
    },
    "player_details": [
        {
            "player": {
                "id": 1, 
                "name": "A" 
            }, 
            "sets": [{
                "strategy_name": "SPARE"
            }],
            "current_score": 15
        },
        { 
            "player": {
                "id": 2, 
                "name": "B" 
            }, 
            "sets": [{
                "strategy_name": "STRIKE"
            }],
            "current_score": 20
        }
    ]
}
 ```                                   
Then player 1 will play since it was a STRIKE. Thus, the game will go 