const db = require('./db/connection')
const format = require('pg-format')

exports.fetchTopics = ()=>{
    return db.query(`SELECT * FROM topics;`).then(({rows})=>{
        return rows
    })
}
 
exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT CAST(COUNT(comments) AS INT) AS comment_count,articles.article_id, articles.title,articles.body, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes, articles.article_id FROM articles 
    LEFT JOIN comments
    ON articles.article_id=comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id;`, [article_id]).then(({rows})=>{
        return rows[0] ?? Promise.reject(404)
    })
}

exports.fetchAllArticles = (topic, sort_by='created_at', order='DESC')=>{

    const validSortBys = [
        'created_at', 
        'title',
        'author', 
        'aritcle_id', 
        'topic', 
        'votes',
        'comment_count'
    ]

    if (!validSortBys.includes(sort_by)) return Promise.reject(400)
    const queryArr= []

    
    
    let queryStr = `SELECT CAST(COUNT(comments) AS INT) AS 
    comment_count, articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes, articles.article_id FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `
    
    if(topic) {
        queryStr += `WHERE topic= %L ` 
        queryArr.push(topic)
    }
    
    queryArr.push(sort_by)
    queryArr.push(order) 
    
    queryStr += `GROUP BY articles.article_id` 
    queryStr += sort_by==='comment_count' ? `ORDER BY %I %s;`
: `ORDER BY articles.%I %s;`
    return db.query(format(queryStr, ...queryArr))
    .then(({rows})=>{
        return rows
    })
}

exports.fetchAllArticleComments = (article_id)=>{

    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id]).then(({rows})=>{
        if(!rows[0]) return Promise.reject(404)
        return article_id
    }).then((article_id)=>{ 
        return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`, [article_id])})
    .then(({rows})=>{
        return rows 
    })
}

exports.insertComments = (comment,article_id)=>{
        return db.query(`INSERT INTO comments (author, body, article_id) 
                    VALUES ($1,$2,$3) RETURNING *;
                    `, [comment.username, comment.body, article_id]).then(({rows})=>{
                        return rows[0]
                    })
}

exports.updateArticleVotes = (newVote, article_id)=>{
    return db.query(`UPDATE articles
                    SET votes = votes + $1
                    WHERE article_id=$2
                    RETURNING *;`, [newVote, article_id]).then(({rows})=>{
                        return rows[0] ?? Promise.reject(404)
                    })
}

exports.removeCommentById = (comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id=$1`,[comment_id]).then(({rowCount})=>{
        return rowCount===0 ? Promise.reject(404) : Promise.resolve()
    })
    
}

exports.fetchAllUsers = ()=>{
    return db.query(`SELECT * FROM users;`).then(({rows})=>{
        return rows
    })
}
