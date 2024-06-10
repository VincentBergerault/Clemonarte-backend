import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/src/config/authScripts";

const COOKIE_NAME = process.env.COOKIE_NAME as string;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  verifyToken(token)
    .then(({}) => {
      // TODO: res.auth = true;
      next();
    })
    .catch(({ status, message }) => {
      res.status(status).json({ message });
    });
};

export default authMiddleware;
