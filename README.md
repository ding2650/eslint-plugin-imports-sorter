# ESLint-plugins-imports-sorter

> 用于校验代码中通过``import``引入资源顺序的ESLint插件。


### 使用方式

1、安装

```js
npm install -d eslint-plugin-imports-sorter
```

2、配置插件

```js
// 当前项目中的eslint配置文件：.eslintrc.js
/* 支持的rule配置：[level，isNeedEmptyLine] */
/* isNeedEmptyLine:{
	type:booean,
	desc:不同引入方式之间是否需要换行分割
} */
module.exports = {
  extends:[
		/* your extends */
		'plugin:imports-sorter/recommended'
	],
	rules:[
		/* your rules */
    'imports-sorter/sorter': [2, true],
	]
}

```

3、重新加载窗口

mac：``command + shift + p``，搜索``reload window``

4、说明

- 由于绝对路径和带层级的第三方库无法区分，比如 'loadsh/omit' 和'src/utils' 因此，目前暂时约定绝对路径均为'src/xxx' 或者'@/xxx'形式。

- 目前支持三类权重的比对：第三方库 >  绝对路径引入的资源 > 相对路径引用的资源。权重相等的情况下，会比对层级进行排序。

eg:
```ts
/* error */
import BB from './B1/B/BB';
import AA from './A/AA';
import CC from './C2/C/CC/CCC';
import DD from './D';

/* right */
import DD from './D'
import AA from './A/AA'
import BB from './B1/B/BB'
import CC from './C2/C/CC/CCC'
```

- 校验React类型文件中React引入是否置顶。@sdx

5、TodoList
- ts编译
- 添加层级校验自定义配置
- 添加自定义权重匹配规则
