const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const endpoints = require('../endpoints.json')

beforeEach(()=>{
    return seed(testData)
})
afterAll(()=>{
    return db.end()
})
describe('GET /*', ()=>{
    test('should return a 404 status when an attempt to access a non existent endpoint is made', ()=>{
        return request(app)
        .get('/non-existing')
        .expect(404)
    })
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
describe('GET /api', ()=>{
    test('should return an object with all valid endpoints and their methods as properties',()=>{
        return request(app)
        .get('/api')
        .then(({body})=>{
            const appRouteNames = []
            app._router.stack.forEach((r)=>{
                if(r.route && r.route.path){
                    if(r.route.path !== '/*'){ //exclude invalid endpoints
                        Object.keys(r.route.methods)
                        .forEach((method) => {
                            appRouteNames.push(`${method.toUpperCase()} ${r.route.path}`)
                        })
                    }
                } 
            })
            let hasAllProperties = true
            appRouteNames.forEach((route)=>{
                if (!Object.keys(endpoints).includes(route)) hasAllProperties = false
            })
            expect(hasAllProperties).toBe(true)
        })
    })
})

describe('GET /api/articles/:article_id', ()=>{
    test('sould return an article given the correct id or an empty array if no such id exists', ()=>{
        return request(app)
        .get('/api/articles/3').then((res)=>{
            console.log(res.body)
        })
        
    })
})