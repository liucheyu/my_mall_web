此專案為，以人人開源為根基，所建構&修改的後台

## 問題集
+ npm install有顯示node-sass錯誤時，修改package.json中node-sass的依賴版本，和node的版本[對照](https://www.npmjs.com/package/node-sass)
+ npm install時，node-sass sass-loader版本解不了時
```
npm install --legacy-peer-deps
#npm install --force
```

+ 不同電腦環境執行npm intall時，會莫名去抓不同環境的proxy
npm config set proxy false
npm config delete proxy
npm config set https-proxy null
npm config set proxy null
npm config get https-proxy
npm config get proxy

npm config rm proxy
npm config rm http-proxy

```
刪除package-lock.json

## firebase
```
npm install firebase
```

```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "{}",
  authDomain: "{}",
  projectId: "{}",
  storageBucket: "{}",
  messagingSenderId: "{}",
  appId: "{}",
  measurementId: "{}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
```

要使用filebase上傳文件



#### 为了更好的服务国内用户，renren-fast-vue仓库已迁移到Gitee，新的仓库地址 https://gitee.com/renrenio/renren-ui ，以后会在 https://gitee.com/renrenio/renren-ui 里面进行更新维护，感谢支持！ :smiley:
<br>

## renren-fast-vue
- renren-fast-vue基于vue、element-ui构建开发，实现[renren-fast](https://gitee.com/renrenio/renren-fast)后台管理前端功能，提供一套更优的前端解决方案
- 前后端分离，通过token进行数据交互，可独立部署
- 主题定制，通过scss变量统一一站式定制
- 动态菜单，通过菜单管理统一管理访问路由
- 数据切换，通过mock配置对接口数据／mock模拟数据进行切换
- 发布时，可动态配置CDN静态资源／切换新旧版本
- 演示地址：[http://demo.open.renren.io/renren-fast](http://demo.open.renren.io/renren-fast) (账号密码：admin/admin)

![输入图片说明](https://images.gitee.com/uploads/images/2019/0305/133529_ff15f192_63154.png "01.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0305/133537_7a1b2d85_63154.png "02.png")


## 说明文档
项目开发、部署等说明都在[wiki](https://github.com/renrenio/renren-fast-vue/wiki)中。


## 更新日志
每个版本的详细更改都记录在[release notes](https://github.com/renrenio/renren-fast-vue/releases)中。
