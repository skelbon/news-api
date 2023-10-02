const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')

beforeEach(()=>{
    return seed(testData)
})
afterAll(()=>{
    return db.end()
})

describe('GET /api/topics', ()=>{
    test('should return 200 status code', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('should return the 3 topics from the table in nc_news_test db', ()=>{
        return request(app)
        .get('/api/topics')
        .then(({body})=>{
            expect(body.topics).toHaveLength(3)
        })
    })
    test('should return the topics from the table in nc_news_test db with both properties, slug and description', ()=>{
        return request(app)
        .get('/api/topics')
        .then(({body})=>{
            const topicsArr = body.topics
            const exampleTopic = {
                description: 'what books are made of',
                slug: 'paper'
              }
            topicsArr.forEach((topic)=> {
                for (const key of Object.keys((exampleTopic))){
                    expect(Object.hasOwn(topic, key))
                }
            })
        })
    })
    

})