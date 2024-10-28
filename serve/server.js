const express=require('express')
const app=express()

//配置cors跨域
const cors=require('cors')
app.use(cors())

app.use(express.json())
//配置解析表单数据的中间件
app.use(express.urlencoded({extended:false}))

// 响应数据的中间件
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, status = 1) {
      res.send({
        // 状态
        status,
        // 状态描述，判断 err 是 错误对象 还是 字符串
        message: err instanceof Error ? err.message : err,
      })
    }
    next()
})

const joi = require('@hapi/joi')

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 未知错误
  res.cc(err);
});
//将./public目录下的文件暴露为静态文件
app.use(express.static('public'))

//导入注册登录路由模块
const usersRouter=require("./routers/user.js")
app.use('/api/user',usersRouter)

const projsRouter=require('./routers/projs.js')
app.use('/api/proj',projsRouter)

const imagesRouter=require('./routers/images.js')
app.use('/api/image',imagesRouter)

const uploadRouter=require('./routers/uploads.js')
app.use('/api/file',uploadRouter)


app.listen(3000,()=>{
    console.log('serve is running on port 3000')
})