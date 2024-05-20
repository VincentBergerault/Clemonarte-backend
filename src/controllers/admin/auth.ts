import express, { Request, Response, Router } from "express";
import { IUser } from "../../utils/types";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router: Router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id: number) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

const users: IUser[] = [
  {
    id: 19749871374,
    username: "admin",
    password: "admin", // This should be a hashed password
    role: "admin",
  },
];

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  const user = users.find((u) => u.username === username);
  if (!user || password !== user.password) {
    return res.status(401).send("Invalid credentials");
  }
  const token = generateToken(user.id);

  res.cookie("CLEMONARTE_TOKEN", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    sameSite: "strict",
  });

  res.json({ message: "Logged in!" });
});

router.get("/verify-token", (req, res) => {
  const token = req.cookies.CLEMONARTE_TOKEN;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, JWT_SECRET, (err: any) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    res.send("Token is valid");
  });
});

router.get("/logout", (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 1 }); // Clear the cookie by setting expiration to 1ms
  res.json({ message: "Logged out" });
});

export default router;
