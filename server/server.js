import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ftp from "basic-ftp";
import dotenv from "dotenv";
import history from "connect-history-api-fallback";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ====== Upload directory ======
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ====== Multer setup ======
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ====== FTP upload helper ======
async function uploadToFTP(localFilePath, remoteFileName) {
  if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASS) {
    return { success: false, message: "FTP credentials not set" };
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: process.env.FTP_SECURE === "true",
    });

    await client.ensureDir("/uploads");
    await client.uploadFrom(localFilePath, `uploads/${remoteFileName}`);
    console.log(`✅ Uploaded to FTP: uploads/${remoteFileName}`);
    return { success: true };
  } catch (err) {
    console.error("❌ FTP Upload Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    client.close();
  }
}

// ====== Serve uploaded files ======
app.use("/uploads", express.static(UPLOAD_DIR));

// ====== File upload route ======
app.post("/upload", upload.array("files", 5), async (req, res) => {
  const uploadedFiles = [];

  for (let file of req.files) {
    const localPath = `/uploads/${file.filename}`;
    const ftpResult = await uploadToFTP(file.path, file.filename);

    uploadedFiles.push({
      originalName: file.originalname,
      filename: file.filename,
      sizeKB: (file.size / 1024).toFixed(2),
      localPath,
      ftp: ftpResult,
    });
  }

  res.json({ ok: true, files: uploadedFiles });
});

// ====== Serve React build safely ======
const REACT_BUILD_DIR = path.join(__dirname, "../client/dist");
if (fs.existsSync(REACT_BUILD_DIR)) {
  // Use history fallback for React Router
  app.use(history());
  app.use(express.static(REACT_BUILD_DIR));
}

// ====== Start server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
