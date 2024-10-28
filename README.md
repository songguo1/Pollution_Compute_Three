# pollution_detection
场地污染检测平台
## 1.技术路线
本系统开发与运行基于Windows操作系统。使用软件和操作平台包含但不限于Chrome、Postman、Windows平台等。以下将围绕前端、后端、数据层等方面对平台技术手段进行详细阐述。

|项目|内容|
|:---|:---|
|体系结构|B/S架构|
|开发平台|Node.js、阿里云等|
|开发工具|VSCode、Postman等|
|开发语言|	HTML、CSS、JavaScript等|
|运行环境|	Windows上的Edge等|
|数据库|	MySQL|
|主要技术|	Vue、GIS、Three.js| 

1. 后端API接口开发

    1. Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，它允许开发者使用JavaScript编写服务器端代码。Express是一个轻量级、灵活的Node.js Web应用框架，它为构建Web应用提供了丰富的HTTP工具。设计数据库模式，包括表结构、字段、索引等。使用mysql模块连接MySQL数据库。

    2. ArcGIS Server 是由ESRI公司开发的一个强大的服务器端GIS（地理信息系统）软件，它允许用户在服务器上发布、管理和访问地理信息、地图、功能和分析工具，在ArcMap中，通过“共享为”>“服务”>“发布服务”来配置服务属性，包括服务名称、描述和元数据，选择ArcGIS Server实例信息，以便发布服务。发布服务：使用“分析”功能检查地图文档是否适合发布，确保没有潜在问题，在确认没有分析错误后，点击“发布”开始发布过程。发布完成后，使用ArcGIS Server管理器来管理服务，如启动、停止、编辑属性等。

    3. 使用cors解决跨域问题，使用body-parser解析请求体，使用multer处理文件上传，使用ali-oss处理与阿里云对象存储服务的交互后端，ali-oss SDK提供了方便的API接口，支持Node.js、浏览器、React Native等多种环境。阿里云对象存储服务（Object Storage Service，简称OSS）是阿里云提供的一种海量、安全、低成本、高可靠的云存储服务。它允许用户在云端存储和访问各种类型的数据，包括文本、图片、音频、视频等，如下图为OSS管理控制台，开通服务后，创建一个存储空间，通过阿里云提供的控制台、API或SDK等方式上传文件。

2. Web前端开发

    1. 选择Vue作为前端框架。Vue.js（通常简称为Vue）是一个用于构建用户界面的开源JavaScript框架。它是由前Google工程师尤雨溪（Evan You）于2014年创建，并自那时以来得到了社区和企业的广泛支持。Vue的设计目的是易于上手，同时也能够强大到驱动复杂的单页应用（SPA）。

    2. 选择ElementUI作为UI组件库，集成Three.js用于3D图形渲染，使用ArcGIS API for JavaScript处理地图数据。集成天地图API提供地图服务，使用handsontable实现表格编辑功能，使用xlsx处理Excel文件。ArcGIS API for JavaScript是Esri推出的一套用于在网页上创建地图和地理信息应用的JavaScript库。它允许开发者利用ArcGIS服务和资源构建丰富的、交互式的地图应用程序，如图4-3是其基础的对象模型。

    3. 功能实现：编写Vue组件，使用ElementUI组件构建界面，集成Three.js实现3D效果，使用ArcGIS API for JavaScript和天地图API实现地图相关功能，使用handsontable和xlsx实现表格编辑和Excel文件处理。
   
    4. 数据交互：设计API接口，与后端进行数据交互，使用axios或其他HTTP库发起请求，处理前端路由和状态管理。

