一个验证js变量的工具

# features

- 支持递归的属性
- 高度自定义
- 语法简易
- 支持异步操作

# Install

```shell
// 安装
npm i biangavalidator
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

# API

### Constructor `Validator(testFuncs: Object)`

```javascript
let obj1 = {
        count: 0,
    },
let validator = new Validator({
    countable(val){
        return val && val.count && isNumber(val.count);
    }
});

validator.validate(objc, 'countable').then(()=>{
    console.log('valid');
}).catch(err=>{
    console.log('invalid');
});

// output valid
```

### methods `validate(targetToBeTest: any, rule)`

- rule
  - String: 搜索已经注册的测试函数, 默认注册的测试函数有
    - truthy: 真值
    - truthyString: 非空字符串
    - falsy: 假值
    - object: 对象
    - number: 数值
    - string: 字符串
    - boolean: 布尔值
    - null: null/undefined
    - completeNull: null
    - completeUndefined: undefined
    - function: 函数
    - array: 数组
    - any: 任何值
    - 字符测试函数后添加`?`表示亦可为`null`
      - e.g. `'name': 'string?'`即`'name": {or:[string, null]}`的语法糖
    - 字符测试函数后添加`[type]`可进行额外验证
      - e.g. `'children': 'array[person]'` 即 `'children': val=>this.validate({'.': 'array', '...': 'person'})`的语法糖
  - RegExp: 使用该正则表达式测试待测试的对象
  - Function: 使用该函数测试待测试对象，函数可以返回`Promise`
    - e.g. val => val && val.count && isNumber(val.count)
  - Object: 配置复杂规则

#### `配置规则 key`

- 点`.`表示自身
  - e.g. `'.': 'string'` 表示自身是个字符串
- 三点`...`表示deconstruct操作
  - e.g. `'...': 'string'` 表示自身下的所有value为字符串（只向下析构一层），只有当该对象为可deconstruct的变量时才会生效，否则会报错。
- 当key为`'or'`或者`'and'`同时value是数组类型的时候会对数组内的value进行逻辑或或逻辑与操作
  - e.g. `'name': {or:['string', 'null']}`表示`name`可以是字符串或`null/undefined`
- 除了上面三种情况的其余字符串表示获取那个key值
  - e.g. `'name': 'string'` 表示当前对象向下取name域的值为string类型
  - 在key后添加'?'表示该参数并不是必须的，否则表示该参数是必须的

#### `配置规则 value`

与rule的类型一致，可以是String, RegExp, Function, Object，当value是Object的情况下会递归进行复杂配置的校验，

### methods `registerTestFunc(name: String, func: Function)`

添加新的测试函数

### 提供一个递归的例子

```javascript
// 假设有一个如此递归的家谱
let obj = {
    name: '张三',
    age: 54,
    children: [{
        name: '张四',
        age: 23,
        children: [{
            name: '张五',
            age: 'asdfasdgasdfasdf',
            children: [{
                name: '张六',
            }]
        }]
    }]
}; 
//为了检查出张六缺少了age，而张五的age并非数字可以这么做
new Validator({
    person(val){
        return this.validate(val, {
            name: 'truthyString',
            age: 'number',
            //children key不是必须的，如果出现children，chidlren可以为null
            'children?': 'array[person]?',
        })
    }
}).validate(obj, 'person');
```