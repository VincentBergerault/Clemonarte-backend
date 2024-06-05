import bcrypt from "bcrypt";

describe("getUsers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return admin user in production environment", async () => {
    process.env.PROD = "true";
    process.env.ADMIN_LOGIN = "adminuser";
    process.env.ADMIN_PWD = "adminpassword";

    const mockHash = "hashed_admin_password";
    jest.spyOn(bcrypt, "hashSync").mockImplementation(() => mockHash);

    // Delete cache and Re import to apply new environment variable
    delete require.cache[require.resolve("../../dist/config/users.js")];
    const getUsers = require("../../dist/config/users.js").default;

    const user = getUsers();

    expect(bcrypt.hashSync).toHaveBeenCalledWith("adminpassword", 10);
    expect(user).toEqual([
      {
        id: 19749871374,
        username: "adminuser",
        password: mockHash,
        role: "admin",
      },
    ]);
  });

  it("should return test user in non-production environment", async () => {
    delete process.env.PROD;

    // Delete cache and Re import to apply new environment variable
    delete require.cache[require.resolve("../../dist/config/users.js")];
    const getUsers = require("../../dist/config/users.js").default;

    const mockHash = "hashed_test_password";
    jest.spyOn(bcrypt, "hashSync").mockImplementation(() => mockHash);

    const user = getUsers();

    expect(await bcrypt.hashSync).toHaveBeenCalledWith("testpwd", 10);
    expect(user).toEqual([
      {
        id: 1,
        username: "testlogin",
        password: mockHash,
        role: "admin",
      },
    ]);
  });
});
