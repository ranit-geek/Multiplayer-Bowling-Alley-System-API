module.exports = {
    createUserTable : "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,name varchar(255),lane Integer,setNumber Integer,setChance Integer,prevPoint Integer,points Integer, sets Blob,bonusRound Integer);",
    createGamesTable : "CREATE TABLE games (id INTEGER PRIMARY KEY AUTOINCREMENT,lane_number Integer);",
    insertToUsers : "INSERT INTO users (name,lane,setNumber,setChance,prevPoint,points,sets,bonusRound) VALUES",
    readUsers : "select id,name from users where lane = (?)",
    findGamesByLane : "select * from games where lane_number = (?)",
    insertToGame : "INSERT INTO games (lane_number) VALUES(?)",
    findGames : "select * from games where id = (?)",
    findUserFromGame : "select * from users where lane = (?) and id = (?)",
    updateUser : "UPDATE users SET setNumber = (?),setChance = (?), prevPoint = (?), points = (?),sets = (?),bonusRound = (?) WHERE id = (?)",
    readAllUsersByLane : "select * from users where lane = (?)"
}