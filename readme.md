### react 自定义模板(多页)



#### 项目运行
* 本地开发：npm run start
* 打包开发环境: npm run dev
* 打包生产环境: npm run build
* 刷新线上cdn： npm run cdn

注意：
1. webpack 是有加上BundleAnalyzerPlugin的，可以访问http://127.0.0.1:8889 去查看打包文件的资源依赖情况以及依赖的大小。
2. 目前没有打开eslint
3. AlloyLever强制开启，AlloyLever.vConsole(true);

#### 接口相关
#### 部署相关

#### 关于mock
1. mock目录下的每一个文件对应着每一个接口
2. mock文件的文件名对应接口的路径，例如：host/api/getUser,那么对应的mock文件的命名应该是 api-getUser;用“-”来替换“/”
3. 每次修改mock的数据后，都得重新跑一下 npm run start,因为mock的数据在启动本地服务监听mock接口的时候，执行了一次获取，后面mock的数据变动的时候，并不会去重新获取。

#### 关于build/project.config.js
<!-- 1. common[Object]，这个是所有page页会自动引入的一个资源，手动抽取公共资源，然后会放到optimization.splitChunks.cacheGroups里面 -->
2. page[Object]
    * path:page的目录
3. widget[Object]
    * path:widget的目录
4. css[Object]
    * path:css的目录
5. js[Object]
    * path:js的目录
6. mock[Object]
    * path:mock的目录
    * isuse: true | false,是否开启mock
7. cdnUrls[Array]
    * 需要刷cdn的地址

#### 项目目录
```
├── README.md
├── build //构建
│   ├── dev-server.js
│   ├── dist_prod
│   ├── project.config.js
│   ├── webpack.config.base.js
│   ├── webpack.config.dev.js
│   └── webpack.config.prod.js
├── mock //mock 数据
│   └── temp-mock.js
├── package-lock.json
├── package.json
├── postcss.config.js //postcss 配置
└── src //静态资源目录
    ├── css
    ├── font
    ├── js
    ├── page //页面
    └── widget //组件
```


