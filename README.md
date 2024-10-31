# ![logo](./client//src//assets//images/logo.png)

> 这个项目是参赛项目，当时指导老师只给了大致思路，所有需求分析和项目实现路线都是边敲边想的，所以有时候实现的效果与后续的方法有冲突，只能不断试错然后推翻重来，可谓历经挫折，然后比赛又迫在眉睫，然后一个月赶工做出来，代码相当屎山，许多代码不是面向需求而是面向展示效果，高耦合乱内聚，许多设计理念在现在看来相当勾史，所以说代码仅供参考。2024 年全国大学生测绘学科创新创业智能大赛创新开发组没获得奖项，的确是，学生一个月赶工写的项目怎么能比得上那些老师手上现成的项目，不过易智瑞GIS开发竞赛倒是给了一个安慰奖。

## 简介

本项目旨在构建一个 Web 端的场地污染检测在线计算与分析平台，用于分析和可视化老旧厂房土壤和水体污染数据。平台结合了 GIS 和 Web 三维显示技术，为用户提供高效、直观的环境监测与管理解决方案。

## 项目地址

https://github.com/songguo1/Pollution_Compute_Three

## 项目演示视频



## 项目结构

client/: 前端项目目录，使用 Vue.js 框架开发。
server/: 后端项目目录，使用 Node.js 和 Express 框架开发。

## 安装与部署

### 前端 (client)

克隆前端项目代码库到本地：
```
git clone https://github.com/songguo1/Pollution_Compute_Three.git
cd client
```
安装项目依赖 

```
npm install
```
运行项目：

```
npm run serve
```

### 后端 (server)

克隆后端项目代码库到本地：
```
git clone https://github.com/songguo1/Pollution_Compute_Three.git
cd server
```
安装项目依赖：
```
npm install
```

运行：
```
npm serve
```

### 配置环境变量：

#### **MySQL 数据库配置**

- `DB_HOST`: MySQL 数据库服务器地址。
- `DB_USER`: MySQL 数据库用户名。
- `DB_PASSWORD`: MySQL 数据库密码。
- `DB_NAME`: MySQL 数据库名称。

#### **OSS 配置**

- `OSS_ACCESS_KEY_ID`: 阿里云 OSS 访问密钥 ID。
- `OSS_ACCESS_KEY_SECRET`: 阿里云 OSS 访问密钥 Secret。
- `OSS_ENDPOINT`: 阿里云 OSS  endpoint。
- `OSS_BUCKET_NAME`: 阿里云 OSS 存储空间名称。

#### **JWT 配置**

- `JWT_SECRET_KEY`: JWT 加密密钥。

### 部署文档：



### 易智瑞GIS开发竞赛提交资料：

https://pan.baidu.com/s/1RRuWVrSqtXgtrRkabdiD_g?pwd=od7e 

### 全国大学生测绘学科创新创业智能大赛提交材料：

https://pan.baidu.com/s/15mCvCg1wqYPr14KenvJzfg?pwd=yh68 
