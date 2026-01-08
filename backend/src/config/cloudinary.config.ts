import { v2 as cloudinary } from "cloudinary";
import { Env } from "./env.config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

const STORAGE_PARAMS = {
  folder: "spend-wise",
  allowed_formats: ["jpg", "png", "jpeg"],
  resource_type: "image" as const,
  quality: "auto:good" as const,
};

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    ...STORAGE_PARAMS,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);
    if (!isValid) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});
