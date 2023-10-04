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
        .then(({body})=>{
            expect(body).toEqual({message: 'Path not found'})
        })
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
                expect(topic).toMatchObject({slug : expect.any(String), description: expect.any(String)})
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
        .get('/api/articles/3').then(({body})=>{
            expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
              })
        })
    })
    test('sould return an error status 400 with appropriate message if the id is invalid', ()=>{
        return request(app)
        .get('/api/articles/invalid_id')
        .expect(400)
        .then(({body})=>{
           expect(body).toEqual({ message: 'Invalid article_id - the article does not exist or your article_id is malformed' }) 
        })
    })

    test('should return an error status 400 with appropriate message if the id does not exist', ()=>{
        return request(app)
        .get('/api/articles/9999')
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({ message: 'Invalid article_id - the article does not exist or your article_id is malformed' })
        })
    })
})

describe('GET /api/articles', ()=>{
    test('should return status code 200', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
    })
    test('should return an array of all articles in the articles table', ()=>{
        return request(app)
        .get('/api/articles').then(({body})=>{
            expect(body.length).toBe(13)
        })
    })
    test('articles should have all the correct properties', ()=>{
        return request(app)
        .get('/api/articles').then(({body})=>{
            body.forEach((article)=> {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        comment_count: expect.any(Number),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                      })
                )
            })
        })
    })
    test('articles should be ordered by date in descending order', ()=>{
        return request(app)
        .get('/api/articles').then(({body})=>{
            expect(body).toBeSortedBy( 'created_at', {descending: true})
        })
    })
})

