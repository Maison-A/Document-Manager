const assert = require('assert')
const request = require('supertest')
const app = require('../backend/server.js')
const UserModel = require('../backend/models/userModel')

// Helper function to generate random email
const getRandomEmail = () => `test${Math.random().toString(36).substring(7)}@example.com`

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
      const randomEmail = getRandomEmail()
      const response = await request(app)
        .post('user/signup')
        .send({
          email: randomEmail,
          password: 'password123',
          username: `user_${randomEmail.split('@')[0]}`
        })
        .expect(200)

      assert.ok(response.body.token)

      const user = await UserModel.findOne({ email: randomEmail })
      assert.ok(user)
      assert.equal(user.email, randomEmail)
    })

    it('should return a 409 status code if the email is already in use', async () => {
      const randomEmail = getRandomEmail()
      const user = new UserModel({
        email: randomEmail,
        password: 'password123',
        username: `user_${randomEmail.split('@')[0]}`
      })
      await user.save()

      const response = await request(app)
        .post('user/signup')
        .send({
          email: randomEmail,
          password: 'password123',
          username: `user2_${randomEmail.split('@')[0]}`
        })
        .expect(409)

      assert.equal(response.body.message, 'Email already in use')
    })
  })
})

