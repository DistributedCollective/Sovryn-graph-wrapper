/* eslint-env jest */
import { v4 as uuidv4 } from 'uuid'
const app = require('./app.js')
const supertest = require('supertest')
const request = supertest(app)

const requestTemplate = {
  requestID: uuidv4()
}

it('testing to See if Jest Works', () => {
  expect(1).toBe(1)
})

it('gets the test endpoint', async done => {
  // send a GET request to the /test endpoint
  const res = await request.get('/sov-treasury-dashboard-db-read/test')
  expect(res.status).toBe(200)
  expect(res.body.message).toBe('Pass!')
  done()
})

it('posts a request to the Hello Sovryn endpoint', async done => {
  // send a POST request to the /otpSendSMS endpoint
  const res = await request.post('/sov-treasury-dashboard-db-read/helloSovryn').send(requestTemplate)
  expect(res.status).toBe(200)
  expect(res.body.reqStatus).toBe('SUCCESS')
  expect(res.body.data.message).toBe('Hello Sovryn!')
  expect(res.body.data.timestamp)
  done()
})

it('posts a request to the To The Moon endpoint', async done => {
  // send a POST request to the /otpSendSMS endpoint
  const res = await request.post('/sov-treasury-dashboard-db-read/toTheMoon').send(requestTemplate)
  expect(res.status).toBe(200)
  expect(res.body.reqStatus).toBe('SUCCESS')
  expect(res.body.data.message).toBe('To The Moon!')
  expect(res.body.data.timestamp)
  done()
})
