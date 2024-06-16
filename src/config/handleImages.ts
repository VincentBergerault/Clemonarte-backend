import { Blob } from "buffer";
import mime from "mime-types";
import fs from "fs";

export const imageToBlob = (
  imagePath: string
): Promise<{ blob: Blob; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const mimeType = mime.lookup(imagePath);
    if (!mimeType) {
      reject(new Error("Could not determine MIME type"));
      return;
    }

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const blob = new Blob([data], { type: mimeType });
      resolve({ blob, mimeType });
    });
  });
};
