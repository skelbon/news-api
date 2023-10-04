const db = require('./db/connection')

exports.fetchTopics = ()=>{
    return db.query(`SELECT * FROM topics;`).then(({rows})=>{
        return rows
    })
}

exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id]).then(({rows})=>{
        return rows[0] ?? Promise.reject(404)
    })
}

exports.fetchAllArticles = ()=>{
    return db.query(`SELECT CAST(COUNT(comments) AS INT) AS 
                    comment_count, articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes, articles.article_id FROM articles 
                    LEFT JOIN comments 
                    ON articles.article_id = comments.article_id  
                    GROUP BY articles.article_id 
                    ORDER BY articles.created_at DESC;`
                    )
    .then(({rows})=>{
        return rows
    })
}

exports.fetchAllArticleComments = (article_id)=>{

    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id]).then(({rows})=>{
        if(!rows[0]) return Promise.reject(404)
        return Promise.resolve(article_id)
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