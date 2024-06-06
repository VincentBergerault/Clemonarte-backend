import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUsers } from "@/src/config/users"; // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = process.env.COOKIE_NAME as string;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("test env");

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  const users = getUsers();
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = users.find((u) => u.id === decoded.data.userID);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // TODO res.auth = true;
    next();
  });
};

export default authMiddleware;
