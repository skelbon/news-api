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
           expect(body).toEqual({message: 'Bad request'}) 
        })
    })

    test('should return an error status 400 with appropriate message if the id does not exist', ()=>{
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({ message: 'Not found' })
        })
    })
    test('sould return an article with a comment_count property reflecting the number of comments the article has recieved', ()=>{
        return request(app)
        .get('/api/articles/3').then(({body})=>{
            expect(body).toEqual({
                comment_count: 2,
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                body: 'some gifs',
                topic: 'mitch',
                author: 'icellusedkars',
                created_at: '2020-11-03T09:12:00.000Z',
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                votes: 0
              })
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
    test('should return articles filtered by topic if topic is included in query', ()=>{
        return request(app)
        .get('/api/articles?topic=mitch').then(({body})=>{
            expect(body.length).toBe(12)
            body.forEach((article)=>{
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test('should return no articles if filtered by topic if no article with that topic exists', ()=>{
        return request(app)
        .get('/api/articles?topic=no_topic').then(({body})=>{
            expect(body.length).toBe(0)
        })
    })
    test('should respond with articles sorted by whichever field is given in the sort_by query descending by default', ()=>{
        return request(app)
        .get('/api/articles?sort_by=comment_count').then(({body})=>{
            expect(body).toBeSortedBy('comment_count',{descending : true})
        })
    })
    test('should respond with status 400 when passed a bad query request', ()=>{
        return request(app)
        .get('/api/articles?sort_by=tite&order=asc')
        .expect(400)
    })
    test('should respond with articles sorted in ascending order when passed order=asc as a query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=title&order=asc').then(({body})=>{
            expect(body).toBeSortedBy('title',{ascending : true})
        })
    })
})

describe('GET /api/articles/:article_id/comments', ()=>{
    test('should return a 200 status code', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
    })
    test('should return an error status 400 with appropriate message if the id is invalid', ()=>{
        return request(app)
        .get('/api/articles/invalid_id/comments')
        .expect(400)
        .then(({body})=>{
           expect(body).toEqual({message: 'Bad request'}) 
        })
    })
    test('should return a 404 status code with an empty array if the article_id is valid but does not exist',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({ message: 'Not found' })
        })
    })
    test('should return a 200 status code with an empty array if the article_id is valid exists and there are no comments',()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual([])
        })
    })
    test('should return all the comments for a given article in descending date order', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual(
                [
                    {
                      "article_id": 3,
                      "author": "icellusedkars",
                      "body": "Ambidextrous marsupial",
                      "comment_id": 11,
                      "created_at": "2020-09-19T23:10:00.000Z",
                      "votes": 0
                    },
                    {
                      "article_id": 3,
                      "author": "icellusedkars",
                      "body": "git push origin master",
                      "comment_id": 10,
                      "created_at": "2020-06-20T07:24:00.000Z",
                      "votes": 0
                    }
                ]
            )
            expect(body.comments).toBeSortedBy('created_at',{descending : true})

        })
    })
})

describe('POST /api/articles/:article_id/comments', ()=>{
    test('returns a status code 200 when passed a correctly formatted article object to an existing article', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            username: "butter_bridge",
          }
        return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
        .expect(200)
    })
    test('should return the posted comment when successful', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            username: "butter_bridge",
          }
        return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
        .then(({body})=>{
            expect(body).toEqual(
                {
                  "article_id": 3,
                  "author": "butter_bridge",
                  "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  "comment_id": expect.any(Number),
                  "created_at": expect.any(String),
                  "votes": 0
                }
              )
        })
    })
    test('should return status code 404 when passed a valid but non existing article_id', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            username: "butter_bridge",
          }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
    })
    test('should return status code 404 when passed a valid but non existing article_id', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            username: "butter_bridge",
          }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
    })
    test('should return status code 400 when passed a malformed comment object', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            usernme: "butter_bridge",
          }
        return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
    })
    test('should return status code 404 when passed a comment from an unregistered user', ()=>{
        const newComment = {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            username: "butter_b#idge",
          }
        return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
    })
})

describe('PATCH /api/articles/:article_id', ()=>{
    test('retruns status code 200 when given a valid and existing article_id and a valid vote object', ()=>{
        const vote = { inc_votes : 1}
        return request(app)
        .patch('/api/articles/3')
        .send(vote)
        .expect(200)
    })

    test('should return the article with the vote field appropriately updated when passed a positive inc_vote value', ()=>{
        const vote = { inc_votes : 50}
        let originalVoteCount
        return request(app)
        .get('/api/articles/3').then(({body})=>{
            originalVoteCount = body.votes
        }).then(()=>{
            return request(app)
            .patch('/api/articles/3')
            .send(vote).then(({body})=>{
                expect(body.votes).toEqual(originalVoteCount + vote.inc_votes)
            })
        })
    })

    test('should return the article with the vote field appropriately updated when passed a negative inc_vote value', ()=>{
        const vote = { inc_votes : -100}
        let originalVoteCount
        return request(app)
        .get('/api/articles/3').then(({body})=>{
            originalVoteCount = body.votes
        }).then(()=>{
            return request(app)
            .patch('/api/articles/3')
            .send(vote).then(({body})=>{
                expect(body.votes).toEqual(originalVoteCount + vote.inc_votes)
            })
        })
    })

    test('should return a 400 status code if passed an object of the wrong format/invalid object', ()=>{
        const malformedVote= { in_vote : 1}
        let originalVoteCount
        return request(app)
        .get('/api/articles/3').then(({body})=>{
            originalVoteCount = body.votes
        }).then(()=>{
            return request(app)
            .patch('/api/articles/3')
            .send(malformedVote)
            .expect(400)
        })
    })
    
    test('should return a 404 not found status code if passed the id of an article that does not exist', ()=>{
        const vote = { inc_votes : 1}
        let originalVoteCount
        return request(app)
        .patch('/api/articles/999')
        .send(vote)
        .expect(404)
    })
    
    test('should return a 400 bad request status code if passed an invalid article_id', ()=>{
        const vote = { inc_votes : 1}
        let originalVoteCount
        return request(app)
        .patch('/api/articles/invalid_id')
        .send(vote)
        .expect(400)
    })
})

describe('DELETE /api/comments/:comment_id', ()=>{
    test('should respond with a status code 204 given a valid and existent comment_id',()=>{
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    })
    test('should respond with a status code 400 if passed a non intger comment_id ',()=>{
        return request(app)
        .delete('/api/comments/bad_id')
        .expect(400)
    })
    test('should respond with a status code 404 if passed a non existent comment_id ',()=>{
        return request(app)
        .delete('/api/comments/33333')
        .expect(404)
    })
})

describe('GET /api/users', ()=>{
    test('should respond with status code 200', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
    })
    test('should return an array of objects with username, name & avater props', ()=>{
        return request(app)
        .get('/api/users')
        .then(({body})=>{
            body.forEach((user)=>{
                expect(user).toEqual(
                    expect.objectContaining(
                        {
                            username: expect.any(String), 
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        }
                    )
                )
            })
        })
    })
})


