const { connect, closeDatabase, clearDatabase } = require('./tests/mongoMemoryServer');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
