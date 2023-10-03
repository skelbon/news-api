const {fetchTopics} = require('./app.model')
const endpoints = require('./endpoints.json')

exports.getTopics = (req, res, next)=>{
    fetchTopics().then((topics)=>{
        if (!topics[0]) {
            res.status(200).send({message: 'The topics table is empty', data: topics})
        }
        res.status(200).send({topics})
    })
}

exports.getApiDescription = (req, res, next)=>{
    res.status(200).send(endpoints)
}


