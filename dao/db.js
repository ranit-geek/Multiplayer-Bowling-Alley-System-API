const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')
const queries = require('./queries')

db.serialize(()=>{
    db.run(queries.createUserTable)
    db.run(queries.createGamesTable)
})

var readQuery = function (sql, params){
    return new Promise((resolve, reject)=>{
        db.all(sql,params,(err, rows)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(rows)
            }
        })
    })
}

var writeQuery = function(sql,params){
    return new Promise((resolve,reject)=>{
        db.run(sql,params,(err)=>{
            if(err){
                reject(err)
            }
            resolve(this.changes)
        })
    })
}

var writeManyQuery = function(sql,params){
    return new Promise((resolve,reject)=>{
        let placeholders = params.map((param) =>`("${param[0]}",${param[1]},${param[2]},${param[3]},${param[4]},${param[5]},"${param[6]}",${param[7]})`).join(',')
        
        db.run(sql+placeholders,params,(err)=>{
            if(err){
                reject(err)
            }
            resolve(this.changes)
        })
    })
}

module.exports = {
    readQuery,
    writeQuery, 
    writeManyQuery,
}