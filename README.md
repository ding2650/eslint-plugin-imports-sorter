# ESLint-plugins-imports-sorter

> 用于校验代码中通过``import``引入资源顺序的ESLint插件。


### 使用方式

1、安装

```js
npm install -d eslint-plugin-imports-sorter
```

2、配置插件

```ts
// 当前项目中的eslint配置文件：.eslintrc.js
/* 支持的rule配置：[level，config] */
interface Config {
  /* 
		不同引入方式换行分割
    默认: true
	*/
  isCheckEmptyLine: boolean
  /* 
		校验层级
    默认: false
	*/
  isCheckDeepth: boolean
  /* 
    绝对路径别名
    默认: ['src','@']
  */
  alias: Array<string>
}
module.exports = {
  extends:[
		/* your extends */
		'plugin:imports-sorter/recommended'
	],
	/* 如果需要自定义配置 */
	rules:[
		/* your rules config */
    'imports-sorter/sorter': [2, {
				isCheckEmptyLine:true,
				isCheckDeepth:true,
 				alias: ['src','lib','@'],
		}],
	]
}

```

3、重新加载窗口

mac：``command + shift + p``，搜索``reload window``

4、说明

- 由于绝对路径和带层级的第三方库无法区分，比如 'loadsh/omit' 和'src/utils' 因此，对于绝对路径资源的判定，取决于``alias``中的值。

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

