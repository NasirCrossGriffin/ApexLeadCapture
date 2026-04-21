express = require('express')
const router = express.Router()
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
dotenv = require("dotenv").config();
const multer = require("multer");

const client = new S3Client({ 
    region: "us-east-1",

    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },

    endpoint: "https://s3.amazonaws.com", 
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  console.log("Upload route accessed")
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;

    const key = `public/uploads/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await client.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({
      message: "Upload successful",
      key,
      url: fileUrl
    });

    console.log("Upload Successful");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router
