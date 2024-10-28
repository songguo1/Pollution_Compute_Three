const db = require("../db/index");

const projHandler = {
projAdd: (req, res) => {
  const fields = {};
  if (req.body.code) fields.code = req.body.code;
  if (req.body.name) fields.name = req.body.name;
  if (req.body.type) fields.type = req.body.type;
  if (req.body.address) fields.address = req.body.address;
  if (req.body.manager) fields.manager = req.body.manager;
  if (req.body.date) fields.date = req.body.date;
  if (req.body.progress) fields.progress = req.body.progress;
  if (req.body.user) fields.user = req.body.user;
  if (req.body.lon) fields.lon = req.body.lon;
  if (req.body.lat) fields.lat = req.body.lat;
  if (req.body.imageUrl) fields.imageUrl = req.body.imageUrl;

  // 检查 code 是否已经存在
  const checkSql = "SELECT * FROM proj WHERE code = ?";
  db.query(checkSql, [fields.code], (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) return res.status(400).json("code 已存在，添加失败");

    // 如果 code 不存在，则插入新项目
    const insertSql = "INSERT INTO proj SET ?";
    db.query(insertSql, fields, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("添加失败");
      res.json(fields);
    });
  });
},




  projPlus: (req, res) => {
    const fields = {};
    if (req.body.msg) fields.msg = req.body.msg;
    if (req.body.lon) fields.lon = req.body.lon;
    if (req.body.lat) fields.lat = req.body.lat;
    if (req.body.code) fields.code = req.body.code;
    if (req.body.user) fields.user=req.body.user;

    const sql = "update proj set msg=?,lon=?,lat=? where code=? and user=?";
    db.query(sql, [fields.msg,fields.lon,fields.lat,fields.code,fields.user], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("添加失败");
      res.json(fields);
    });
  },

  projAll: (req, res) => {
    
    const sql = "select * from proj where user=?";
    console.log(req)
    db.query(sql,[req.body.name], (err, results) => {
      if (err) return res.status(404).json(err);
      if (results.length === 0) return res.status(200).json([]);
      res.status(200).json(results);
    });
  },

  projEdit: (req, res) => {

    const sql = "update proj set ? where code=? and user=?";
    db.query(sql, [req.body, req.body.code,req.body.user], (err, results) => {
      if (err) return res.status(400).json(err);
      if (results.affectedRows !== 1) return res.status(400).json("添加失败");
      res.json(req.body);
    });
  },

  projDelete: (req, res) => {

    const sql = "delete from proj where code = ? and user=?";
    db.query(sql, [req.body.code,req.body.user], (err, results) => {
      if (err) return res.status(400).json(err);
      if (results.affectedRows !== 1) return res.status(400).json("删除失败");
      res.json("删除成功");
    });
  },
};

module.exports=projHandler
