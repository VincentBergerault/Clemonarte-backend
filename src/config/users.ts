import bcrypt from "bcrypt";
import { IUser } from "../utils/types";

const ADMIN_LOGIN = process.env.ADMIN_LOGIN as string;
const ADMIN_PWD = process.env.ADMIN_PWD as string;

const getUsers = (): IUser[] => {
  if (process.env.PROD) {
    return [
      {
        id: 19749871374,
        username: ADMIN_LOGIN,
        password: bcrypt.hashSync(ADMIN_PWD, 10), // Hash the admin password
        role: "admin",
      },
    ];
  } else {
    return [
      {
        id: 1,
        username: "testlogin",
        password: bcrypt.hashSync("testpwd", 10), // Hash the test password
        role: "admin",
      },
    ];
  }
};

export default getUsers;
