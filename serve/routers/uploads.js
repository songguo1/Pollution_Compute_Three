const express = require("express");
const multer = require("multer");
const router = express.Router();
const fileHandler = require("../router_handler/uploads.js");

// 设置multer存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files"); // 指定文件保存的路径
  },
  filename: function (req, file, cb) {
    const originalname = Buffer.from(file.originalname, "binary").toString(
      "utf-8"
    ); // 将原始文件名进行utf-8编码处理
    cb(null, originalname); // 生成保存的文件名
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), fileHandler.uploadFile);
router.get("/download/template", fileHandler.downloadTemplate);
router.get("/download/oss/:fileName", fileHandler.downloadFile);
router.post("/fileList", fileHandler.FileList);

module.exports = router;
