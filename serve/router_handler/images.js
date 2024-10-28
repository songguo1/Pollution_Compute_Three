const db = require("../db/index");
const { client: Client, ossConfig: Config } = require("../oss/oss");

const imageHandler = {
  upload: async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.cc("没有上传文件。", 1);
    }
    /**
     * @filePath 文件临时路径
     * @fileName 文件名
     */
    const filePath = file.path;
    const fileName = file.filename;

    // 上传文件到OSS
    const result = await Client.put(fileName, filePath);
    const imageUrl = `https://${Config.bucket}.${Config.region}.aliyuncs.com/${fileName}`;

    // 保存文件路径到MySQL
    res.json({
      msg: "上传成功",
      imageUrl: imageUrl,
    });
  },
};

module.exports = imageHandler;
