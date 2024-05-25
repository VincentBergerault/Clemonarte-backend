import express, { Request, Response, Router } from "express";
import { IUser } from "../../utils/types";
import { userInfo } from "os";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router: Router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN as string;
const ADMIN_PWD = process.env.ADMIN_PWD as string;
const COOKIE_NAME = process.env.COOKIE_NAME as string;

const generateToken = (data: any) => {
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: "30d" });
};

const users: IUser[] = process.env.PROD
  ? [
      {
        id: 19749871374,
        username: ADMIN_LOGIN,
        password: ADMIN_PWD, // This should be a hashed password
        role: "admin",
      },
    ]
  : [
      {
        id: 1,
        username: "testlogin",
        password: "testpwd", // This should be a hashed password
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
  const token = generateToken({ userID: user.id, username: username });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    sameSite: "strict",
  });

  res.json({ message: "Logged in!" });
});

router.get("/verify-token", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    if (!users.find((u) => u.id === decoded.data.userID)) {
      return res.status(401).send("Unauthorized");
    }

    res.json({
      message: "Token is valid",
      user: { username: decoded.data.username },
    });
  });
});

router.get("/logout", (req: Request, res: Response) => {
  res.cookie(COOKIE_NAME, "", { maxAge: 1 }); // Clear the cookie by setting expiration to 1ms
  res.json({ message: "Logged out" });
});

export default router;
