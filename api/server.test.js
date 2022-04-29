const db = require("../data/dbConfig");
const server = require("./server");
const request = require("supertest");

const Users = require("./auth/users-model");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

// Write your tests here

test("sanity", () => {
  expect(true).toBe(true);
});
describe(`/register`, () => {
  test(`[POST] /register exists`, async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "nate", password: "1234" });
    expect(res.status).toBe(201);
  });
  test(`[POST] /register assigns id`, async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "nate", password: "1234" });
    expect(res.body).toHaveProperty("id", 1);
  });
});

describe(`/login`, () => {
  test(`[POST] /login requires username and password`, async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "nate" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username and password required");
    const createUser = await request(server)
      .post("/api/auth/register")
      .send({ username: "nate", password: "1234" });
    const correctRes = await request(server)
      .post("/api/auth/login")
      .send({ username: "nate", password: "1234" });
    expect(correctRes.status).toBe(200);
  });
  test(`[POST] /login returns token`, async () => {
    const createUser = await request(server).post('/api/auth/register').send({username: "nate", password: "1234"})
    const login = await request(server).post('/api/auth/login').send({username: "nate", password: "1234"})
    expect(login.body).toHaveProperty('token')
  })
});

describe(`/jokes`, () => {
  test(`[GET] /jokes requires authenticated access`, async () => {
    const res = await request(server).post('/api/jokes')
  expect(res.status).toBe(401)
  })
  test(`[GET] /jokes correct failure message`, async () => {
    const res = await (await request(server).get('/api/jokes').set('Authorization', 'blah'))
    expect(res.body.message).toMatch('token invalid');
  })
})
