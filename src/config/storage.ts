import multer, { StorageEngine } from "multer";
import path from "path";

export const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
