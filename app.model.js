const db = require('./db/connection')

exports.fetchTopics = ()=>{
    return db.query(`SELECT * FROM topics;`).then(({rows})=>{
        return rows
    })
}

exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id]).then(({rows})=>{
        return rows[0] ?? Promise.reject() 
    }).catch((err)=>{
        return Promise.reject({ message: 'Invalid article_id - the article does not exist or your article_id is malformed' })
    })
}


