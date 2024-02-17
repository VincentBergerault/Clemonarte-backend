import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";
const users = [{ username: "admin", password: "password" }];

interface IRequestBody {
  username: String;
  password: String;
}

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<IRequestBody>(event);
  // Authentication logic (replace this with your actual logic)
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const token = jwt.sign({ userId: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    setCookie(event, "AUTH_CLEMONARTE", token);
    return { message: "Authentication succesfull" };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Username or password incorrect",
    });
  }
});
