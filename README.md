# 验证变量 Validation variable [NPM](https://www.npmjs.com/package/@anfo/validator) | [Github](https://github.com/longjiahui/validator#readme)

# 特性

- 递归验证规律的变量 Recursively verify the variables of the law
- 语法简单 Simple syntax
- 支持异步操作 Support asynchronous operation

# Usage

```bash
npm install @anfo/validator
```

### Basic
```javascript
const Validator = require('@anfo/validator')
// import Validator from '@anfo/validator'

const validator = new Validator({
    // 指定一些具名测试函数 Specify some named test functions
    mobile(val){
        return /^1[3456789]\d{9}$/.test(val) 
    }
})

;(async ()=>{
    const valid = await validator.validate('15600001111', 'mobile')
    // true
})()
```

### 默认的预设 Default preset

- truthy - 真值
- falsy - 假值
- object - 对象
- number - 数值
- string - 字符串
- truthyString - 非空字符串
- boolean - 布尔值
- null - null/undefined
- completeNull - null
- completeUndefined - undefined
- function - function
- array - array
- any - 任何类型

```javascript
module.exports = {
    truthy(val){
        return !!val
    },
    truthyString(val){
        return !!val && typeof val === 'string'
    },
    falsy(val){
        return !val
    },
    object(val){
        return val && typeof val === 'object'
    },
    number(val){
        return typeof val === 'number'
    },
    string(val){
        return typeof val === 'string'
    },
    boolean(val){
        return typeof val === 'boolean'
    },
    null(val){
        return val == null
    },
    completeNull(val){
        return val === null
    },
    completeUndefined(val){
        return val === undefined
    },
    function(val){
        return typeof val === 'function'
    },
    array(val){
        return val instanceof Array
    },
    any(){
        return true
    }
}
```


### 规则的写法

一条规则可以是字符串，正则表达式，数组或者自定义函数

##### 使用字符串调用默认/自定义的规则

```javascript
validator.validate({
    a: '12',
    b: 12,
    c: null
}, {
    a: 'string',
    b: 'number',
    c: /1234$/, 
})
```

##### 使用数组表示逻辑与

```javascript
validator.validate({
    
})
```