import jwt from "jsonwebtoken";
import { getUsers } from "@/src/config/users"; // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (data: any) => {
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: "1d" });
};

export function verifyToken(token): any {
  const users = getUsers();
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject({ status: 401, message: "Unauthorized" });
      }

      const user = users.find((u) => u.id === decoded.data!.userID);

      if (!user) {
        return reject({ status: 401, message: "Unauthorized" });
      }

      resolve({ status: 200, decoded, user });
    });
  });
}
