# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### 一些命令
- 项目demo https://gitee.com/tyl-lsm/news-ui?_from=gitee_search
- npx create-react-app newssystem
- cnpm i sass 要使用sass的话要安装sass
- 配置反向代理 创建 src/setupProxy.js 安装中间件 http-proxy-middleware

### react-router-dom@6
- react-router-dom6.x版本中，不再通过component指定组件，通过element进行配置。因此将<Route>中的component改为element即可
- 路由守卫也写法也不一样  <Route path="/" element={ localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" /> } ></Route>
- 嵌套路由参考 https://zhuanlan.zhihu.com/p/474568055

### json-server 接口模拟
- npm install -g json-server
- 创建一个json文件 json-server --watch db.json
- put:会将修改的数据全部替换； patch:只会修改数据的某一部分；

### 受控非受控
- 受控非受控组件 受控: 外部状态改变了内部能相应改变  非受控: 第一次受到影响后面不会再改变 
- antd 组件属性中 前面写了 default 的是非受控 想要变成受控就要看看有没有去掉default的属性

### useState
-  set之后会把会把render函数重新执行一遍 而useEffect看依赖的值有没有变化
-  如果有依赖的值且变化了 才会再执行一遍
             