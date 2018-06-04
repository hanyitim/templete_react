### react 自定义模板
> 本人比较信奉“折腾”和“偷懒”原则，所以在当前各种脚手架，各种项目初始化模板满天飞的一个大时代，还是觉得要自己搞一套好一点，至少我折腾过

#### 目录
```
├── build
│   ├── dev-server.js  //本地开发服务
│   ├── project.config.js    //项目相关配置
│   ├── webpack.config.base.js  
│   ├── webpack.config.dev.js
│   └── webpack.config.prod.js
├── mock
│   └── temp-mock.js   //mock数据模板
├── package-lock.json
├── package.json
├── postcss.config.js  //css兼容配置
├── readme.md
├── .babelrc //babel配置
├── .eslintrc // eslint 配置
└── src
    ├── css
    │   └── base.css //全局css配置
    ├── page  //页面
    │   └── temp_index
    │       ├── index.html
    │       ├── index.jsx
    │       └── index.less
    └── widget //组件
        └── temp_widget
            ├── index.jsx
            └── index.less
```

