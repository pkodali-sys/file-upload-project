import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const utcTime = new Date().toISOString().replace(/[:.]/g, "-"); 
    cb(null, `${base}-${utcTime}${ext}`);
  }
});

const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Upload endpoint
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    localPath: `/uploads/${file.filename}`,
    sizeKB: (file.size / 1024).toFixed(2),
    uploadTime: new Date().toISOString(),

  }));
  res.json({ ok: true, files });
});

// List files with pagination and search
app.get("/files", (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const allFiles = fs.readdirSync(UPLOAD_DIR).map((filename) => {
    const filePath = path.join(UPLOAD_DIR, filename);
    const stats = fs.statSync(filePath);
    const uploadTime = stats.birthtime instanceof Date ? stats.birthtime.toISOString() : new Date().toISOString();

    return {
      filename,
      originalName: filename.split("-").slice(1).join("-"), // remove unique prefix
      localPath: `/uploads/${filename}`,
      sizeKB: (stats.size / 1024).toFixed(2),
      uploadTime
    };
  });

  const filteredFiles = search
    ? allFiles.filter((f) =>
        f.originalName.toLowerCase().includes(search.toLowerCase())
      )
    : allFiles;

  const startIndex = (page - 1) * limit;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + Number(limit));

  res.json({
    ok: true,
    files: paginatedFiles,
    total: filteredFiles.length,
    page: Number(page),
    limit: Number(limit),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
