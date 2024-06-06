import { connect, closeDatabase, clearDatabase } from "./mongoMemoryServer";

beforeAll(async () => {
  await connect();
  process.env.NODE_ENV = "test";
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
