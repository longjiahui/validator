一个验证js变量的工具

# features

- 支持递归的属性
- 高度自定义
- 语法简易
- 支持异步操作

# Install

```shell
// 安装
npm install biangavalidator
```
```javascript
// es6
import Validator from 'biangvalidator';

// commonjs(node.js)
const Validator = require('biangvalidator');
```
```html
<script src="biangvalidator.js"></script>
```
通过script导入时，会暴露`BiangValidator`全局变量

# Usages

## 基本用法

```javascript
let obj = {
    id: 1,
    name: '张三',
    age: 34,
    children: [{
        id: 2,
        name: '张子',
        age: 12,
    },{
        id: 3,
        name: '张女',
        age: 10,
    }]
};

let validator = new Validator({
    person:{
        'id*': 'number',
        'name*': 'string',
        'age*': 'number',
        children: 'array[person]?',
    },
});

validator.validate(obj, 'person',).then(()=>{
    console.log('checked');
}).catch(err=>{
    console.error(err);
});
```

#### 构造器说明 BiangValidator(rules)

- rules（Object) : rules是校验方法，key表示校验方法的名称，value表示校验方法，value可以是Function、Object、String
	- Function : (val)=>Boolean
	- Object: key表示字段名字，value表示校验方法，校验方法可以是Function、Object、String
		- 用{or: [rule1, rule2]}表示一个or逻辑的rule
		- 用{and: [rule1, rule2]}表示一个and逻辑的rule
	- String: 校验方法的名字表示调用某个校验方法。

