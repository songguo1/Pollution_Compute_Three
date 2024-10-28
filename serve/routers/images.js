const express= require('express')
const router=express.Router()
const imageHandler=require('../router_handler/images.js')
const multer=require('multer')

//磁盘存储引擎，可以控制文件的存储，省略的话这些文件会保存在内存中，不会写入磁盘
const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/files"); // 指定文件保存的路径
      },
      filename: function (req, file, cb) {
        const originalname = Buffer.from(file.originalname, "binary").toString(
          "utf-8"
        ); // 将原始文件名进行utf-8编码处理
        cb(null, originalname); // 生成保存的文件名
      },
})
const upload=multer({storage:storage})

router.post('/upload',upload.single('image'),imageHandler.upload)

module.exports=router