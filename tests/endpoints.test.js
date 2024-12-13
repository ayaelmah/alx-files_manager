const { testRequest } = global;

describe('GET /status', () => {
    it('should return status OK', async () => {
        const response = await testRequest.get('/status');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });

describe('GET /stats', () => {
    it('should return stats', async () => {
        const response = await testRequest.get('/stats');
        expect(response.body).toHaveProperty('totalFiles');
        expect(response.body).toHaveProperty('totalUsers');
    });
});

describe('POST /users', () => {
    it('should create a new user', async () => {
        const user = {
            username: 'testuser',
            password: 'testpass'
        };
        const response = await testRequest.post('/users').send(user);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});
    
describe('GET /connect', () => {
    it('should connect to redis', async () => {
        const response = await testRequest.get('/connect');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Connected');
    });
});

describe('GET /disconnect', () => {
    it('should disconnect to redis', async () => {
        const response = await testRequest.get('/disconnect');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Disconnected');
    });
});

describe('GET /users/me', () => {
    it('should return the current user', async () => {
        const response = await testRequest.get('/users/me').set('Authorization', 'Basic testtoken');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username');
    });
});

describe('POST /files', () => {
    it('should upload a file', async () => {
        const file = Buffer.from('test file content');
        const response = await testRequest.post('/files').attach('file', file, 'file.txt');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});

describe('GET /files/:id', () => {
    it('should return a file by id', async () => {
        const response = await testRequest.get('/files/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
    });
});

describe('GET /files', () => {
    it('should return files', async () => {
        const response = await testRequest.get('/files').query({ page: 1, limit: 10 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('files');
        expect(response.body.files.length).toBeLessThanOrEqual(10);
    });
});

describe('PUT /files/:id/publish', () => {
    it('should publish a file', async () => {
        const response = await testRequest.put('/files/1/publish');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isPublic', true);
    });
});

describe('PUT /files/:id/unpublish', () => {
    it('should unpublish a file', async () => {
        const response = await testRequest.put('/files/1/unpublish');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isPublic', false);
    });
});

describe('GET /files/:id/data', () => {
    it('should return file data', async () => {
        const response = await testRequest.get('/files/1/data).query({ size: 500 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});
