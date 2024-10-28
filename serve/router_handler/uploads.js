const fs = require("fs");
const path = require("path");
const db = require("../db");
const { client: Client, ossConfig: Config } = require("../oss/oss");

const fileHandler = {
  uploadFile: async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.cc("没有上传文件。", 1);
    }
/**
 * @filePath 文件临时路径
 * @fileName 文件名
 */
    const filePath = file.path;
    const fileName = file.filename;;

    try {
      // 上传文件到OSS
      const result = await Client.put(fileName, filePath);

      // 保存文件路径到MySQL
      const filePathInDb = `https://${Config.bucket}.${Config.region}.aliyuncs.com/${fileName}`;
      const sql = `INSERT INTO oss (code, user,date, path,filename) VALUES (?,?, ?, ?,?) ON DUPLICATE KEY UPDATE path = VALUES(path)`;
      const field = {};
      if (req.body.code) field.code = req.body.code;
      if (req.body.user) field.user = req.body.user;
      if (req.body.date) field.date = req.body.date;
      field.filename = fileName;
      field.path = filePathInDb;

      db.query(
        sql,
        [field.code, field.user, field.date, field.path, field.filename],
        (error, results) => {
          if (error) {
            return res.cc(error);
          }
          if (results.affectedRows === 0) {
            res.cc("文件上传成功，但记录未插入或更新", 1);
          } else {
            res.send({
              message: fileName,
              status: 0,
            });
          }
        }
      );
    } catch (error) {
      res.cc(error);
    } finally {
      // 删除临时文件
      fs.unlink(filePath, (err) => {
        if (err) {
          res.cc("临时文件删除失败", 1);
        }
      });
    }
  },
  FileList: async (req, res) => {
    const sql = `SELECT * FROM oss WHERE user = ? and code=?`;
    const params = [req.body.user, req.body.code];
    db.query(sql, params, (error, results) => {
      if (error) {
        return res.cc(error);
      }
      if (results.length === 0) {
        res.cc("没有找到文件", 1);
      } else {
        res.send(results);
      }
    });
  },
  downloadFile: async (req, res) => {
    try {
      const fileName = req.params.fileName;

      // 从OSS下载文件
      const result = await Client.get(fileName);

      // 设置响应类型
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // 发送文件内容
      res.send(result.content);
    } catch (error) {
      res.cc(error);
    }
  },

  downloadTemplate: async (req, res) => {
    try {
      // 获取文件路径
      const filePath = "Template/Template.xlsx";

      // 从 OSS 下载文件
      const result = await Client.get(filePath);

      // 设置响应类型为 Excel
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // 设置响应头部，以便用户可以下载文件
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Template.xlsx"
      );

      // 发送文件内容
      // 将流转换为Buffer // 使用stream-to-buffer库或者node-fetch
      //   let buffer = await new Promise((resolve, reject) => {
      //     const stream = result.stream;
      //     const chunks = [];
      //     stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      //     stream.on("end", () => resolve(Buffer.concat(chunks)));
      //     stream.on("error", reject);
      //   }); // 发送Buffer作为响应
      res.send(result.content);
    } catch (error) {
      res.cc(error);
    }
  },
};

module.exports = fileHandler;
