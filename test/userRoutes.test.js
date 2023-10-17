const assert = require('assert')
const request = require('supertest')
// const app = require('../frontend/src/app.vue')
const app = require('../backend/server.js')
const UserModel = require('../backend/models/userModel')

describe('User Routes', () => {
  // describe('POST /login', () => {
  //   it('should return a JWT token on successful login', async () => {
  //     const user = new UserModel({
  //       email: 'test@example.com',
  //       password: 'password123',
  //       username: 'testuser'
  //     })
  //     await user.save()

  //     const response = await request(app)
  //       .post('/login')
  //       .send({ email: 'test@example.com', password: 'password123' })
  //       .expect(200)

  //     assert.ok(response.body.token)
  //   })

  //   it('should return a 401 status code on invalid credentials', async () => {
  //     const response = await request(app)
  //       .post('/login')
  //       .send({ email: 'test@example.com', password: 'wrongpassword' })
  //       .expect(401)

  //     assert.equal(response.body.message, 'Invalid email or password')
  //   })
  // })

  describe('POST user/signup', () => {
    it('should create a new user and return a JWT token', async () => {
      const response = await request(app)
        .post('user/signup')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          username: 'newuser'
        })
        .expect(200)

      assert.ok(response.body.token)

      const user = await UserModel.findOne({ email: 'newuser@example.com' })
      assert.ok(user)
      assert.equal(user.username, 'newuser')
    })

    it('should return a 409 status code if the email is already in use', async () => {
      const user = new UserModel({
        email: 'existinguser@example.com',
        password: 'password123',
        username: 'existinguser'
      })
      await user.save()

      const response = await request(app)
        .post('user/signup')
        .send({
          email: 'existinguser@example.com',
          password: 'password123',
          username: 'newuser'
        })
        .expect(409)

      assert.equal(response.body.message, 'Email already in use')
    })
  })
})