import express, { Request, Response, Router } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router: Router = express.Router();

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const users: IUser[] = [
  {
    id: 1,
    username: "admin",
    password: "admin", // This should be a hashed password
    role: "admin",
  },
];

// Get all items

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  const user = users.find((u) => u.username === username);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    res.json({ message: "Logged in!" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 1 }); // Clear the cookie by setting expiration to 1ms
  res.json({ message: "Logged out" });
});

module.exports = router;
