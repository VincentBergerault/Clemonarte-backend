import express, { Request, Response, Router } from "express";
import { IUser } from "@/src/types/types";
import { getUsers } from "@/src/config/users";
import { generateToken, verifyToken } from "@/src/config/authScripts";
import bcrypt from "bcrypt";

const router: Router = express.Router();

const COOKIE_NAME = process.env.COOKIE_NAME as string;

const users: IUser[] = getUsers();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).send({ message: "Invalid credentials" });
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

router.get("/verify-token", (req: Request, res: Response) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  verifyToken(token)
    .then(({ status, decoded, user }) => {
      res.status(status).send({
        message: "Token is valid",
        user: { username: decoded.data.username },
      });
    })
    .catch(({ status, message }) => {
      res.status(status).json({ message });
    });
});

router.get("/logout", (req: Request, res: Response) => {
  res.cookie(COOKIE_NAME, "", {
    maxAge: 1,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
});

export default router;
