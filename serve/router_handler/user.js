//与用户相关路由的处理函数

const db = require("../db/index.js");
const bcrypt = require("bcrypt");

// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");

const userHandler = {
  register: (req, res) => {
    // console.log(req.body)

    //验证用户名与密码是否为空
    const adminInfo = req.body;
    if (!adminInfo.name || !adminInfo.password) {
      return res.json({
        status: 400,
        msg: "用户名或密码为空",
      });
    }

    //验证用户名是否为空
    const sqlStr = "select * from admin where user=?";
    db.query(sqlStr, adminInfo.name, (err, results) => {
      //执行 SQL 语句失败
      if (err) {
        return res.status(400).json({
          status: 400,
          msg: err.message,
        });
      }

      //用户名被占用
      if (res.length > 0) {
        return res.status(400).json({
          status: 400,
          msg: "用户名被占用",
        });
      }

      //若不为空，用异步方法将密码哈希化
      bcrypt.hash(adminInfo.password, 10, (err, hash) => {
        if (err) {
          // 错误处理
          return res.status(500).json({
            status: 500,
            msg: "密码加密错误",
          });
        }
        // 密码加密成功，存储 hash 到数据库
        adminInfo.password = hash;
        // ...继续处理，比如存储用户信息到数据库
      });

      //成功加密后，将用户名与密码插入数据表中
      let sqlStr = "insert into admin set ?";
      db.query(
        sqlStr,
        {
          user: adminInfo.name,
          password: adminInfo.password,
        },
        (err, results) => {
          if (err){
            return res.status(400).json({
              status: 400,
              msg: err.message,
            });
          }
            

          //验证数据表是否成功插入数据
          if (results.affectedRows !== 1) return results.send("注册用户失败，稍后重试");

          //若成功注册，则返回
          res.status(200).json({
            status: 200,
            message: "注册成功",
            name: adminInfo.name,
            password: adminInfo.password,
            identify: adminInfo.identity,
          });
        }
      );
    });
  },

  //登录路由处理函数
  login: (req, res) => {
    const { name, password } = req.body;
    //查询数据库
    const sqlStr = "select * from admin where user=?";
    db.query(sqlStr, name, (err, results) => {
      if (err) return res.cc(err);
      if (results.length != 1) return res.cc("登录失败");
      //密码匹配
      bcrypt.compare(password, results[0].password, (err, res) => {
        if (err) return res.cc("密码错误");
      });
      // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
      const user = {
        name: results[0].user,
        identify: results[0].identify
    }

      // 导入配置文件
      const config = require("../config");

      // 生成 Token 字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: "10h", // token 有效期为 10 个小时
      });

      res.json({
        status: 200,
        message: '登录成功',
        token: 'Bearer ' + tokenStr
    })
    });
  },
};

// router.get

// exports.register=(req,res)=>{
//     ...
// }

// exports.login=(req,res)=>{
//     ...
// }

module.exports = userHandler;
