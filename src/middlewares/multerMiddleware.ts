import multer, { FileFilterCallback } from "multer";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_PATH,
} from "../common/constants.js";
import path from "node:path";
import { Request } from "express";
import { getApiError } from "../common/HttpResponse.js";

const storage = multer.diskStorage({
  destination: UPLOAD_PATH,
  filename: function (_req, file, cb) {
    const newFileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype && ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  if (file.originalname?.match(ALLOWED_EXTENSIONS)) {
    return cb(null, true);
  }
  throw getApiError("UNSUPPORTED_MEDIA_TYPE");
};

const ImageUploader = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 5,
    fieldNameSize: 100,
    fieldSize: 1024 * 1024, //1MB
    parts: 6,
  },
  fileFilter: imageFileFilter,
});

export { ImageUploader };
