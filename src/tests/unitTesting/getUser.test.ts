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
    process.env.NODE_ENV = "production";
    process.env.ADMIN_LOGIN = "adminuser";
    process.env.ADMIN_PWD = "adminpassword";

    const mockHash = "hashed_admin_password";
    jest.spyOn(bcrypt, "hashSync").mockImplementation(() => mockHash);

    // Re-import to apply new environment variable
    const { getUsers } = await import("../../config/users");

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
    process.env.NODE_ENV = "test";

    // Re-import to apply new environment variable
    const { getUsers } = await import("../../config/users");

    const mockHash = "hashed_test_password";
    jest.spyOn(bcrypt, "hashSync").mockImplementation(() => mockHash);

    const user = getUsers();

    expect(bcrypt.hashSync).toHaveBeenCalledWith("testpwd", 10);
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
