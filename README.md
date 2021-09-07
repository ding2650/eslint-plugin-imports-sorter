**# ESLint-plugins-imports-sorter**

> 用于校验代码中通过``import``引入资源顺序的ESLint插件。



**### 使用方式**

1、安装

```js
npm install -s eslint-plugin-imports-sorter
```

2、配置插件

```js
// 当前项目中的eslint配置文件：.eslintrc.js
...
module.exports = {
	...,
  extends:[..."your extends",'plugin:imports-sorter/recommed']
	...
}

```

3、重新加载窗口

mac：``command + shift + p``，搜索``reload window``

