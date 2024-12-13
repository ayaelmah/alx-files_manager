const knex = require('knex');
const mockKnex = require('mock-knex');
const dbClient = require('../utils/db');

mockKnex.mock(knex);

describe('dB client', () => {
  it('sould query the database', async () => {
    const knexQuery = knex('users').select('*');
    const mockTracker = mockKnex.getTracker();

    mockTracker.install();
    mockTracker.on('query', (query) => {
      query.response([{ id: 1, name: 'test' }]);
    });

    const result = await knexQuery;
    expect(result).toStrictEqual([{ id: 1, name: 'test' }]);
    mockTracker.uninstall();
  });

  it('should throw error when db query fails', async () => {
    const knexQuery = knex('users').select('*');
    const mockTracker = mockKnex.getTracker();

    mockTracker.install();
    mockTracker.on('query', (query) => {
      query.reject(new Error('DB error'));
    });

    await expect(knexQuery).rejects.toThrow('DB error');
    mockTracker.uninstall();
  });
});
