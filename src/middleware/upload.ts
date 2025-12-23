import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Yuklash papkasining mavjudligini ta'minlash
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Umumiy rasm formatlari va PDF fayllarini ruxsat berish
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm va PDF fayllar ruxsat etiladi! Qo'llab-quvvatlanadigan formatlar: PNG, JPG, JPEG, GIF, WebP, PDF"));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB cheklov (PDF qo'llab-quvvatlash uchun oshirilgan)
  },
  fileFilter: fileFilter,
});
