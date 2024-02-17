import jwt from "jsonwebtoken";

// Your secret key
const SECRET_KEY = "your_secret_key";

export default defineEventHandler((event) => {
  if (event.context.params?.chapterSlug === "admin") {
    // Read counter cookie
    const authCookie = getCookie(event, "AUTH_CLEMONARTE") || "";

    if (authCookie === "") {
      throw createError({
        statusCode: 403,
        statusMessage: "A token is required for authentication",
      });
    }
    try {
      const decoded = jwt.verify(authCookie, SECRET_KEY);
      console.log(decoded);
      event.context.auth = decoded;
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid Token",
      });
    }
  }
});
