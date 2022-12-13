const request = require('supertest');
const app = require("../app");
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require("../db/data/test-data");

afterAll(() => 
  db.end()
);

beforeEach(() => seed(testData));

describe('API',() => {
  test("404: if no page is found return status 404", () => {
    return request(app)
      .get("/asjdfh")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Page Not Found" });
      });
  });

  describe("3. GET /api/topics", () => {
    test("200, Respond with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  }); // End of '3. GET /api/topics'

  describe("4. GET /api/articles", () => {
    test("200, Respond with an array of articles objects", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("Return array is sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "created_at", descending: true });
        });
    });
  }); // End of '4. GET /api/articles'

  describe("5. GET /api/articles/article_id", () => {
    test("200, Respond with an array of articles objects", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          console.log(article)
          expect(article).toHaveLength(1);
          expect(article[0]).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
        });
    });

    test('404, Respond with non-existent IDs', () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("ID Not Exist");
        });
    });

  }); // End of 5. GET /api/articles/article_id
})