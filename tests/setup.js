const request = require('supertest');
const app = require('../app');

global.testRequest = request(app);
