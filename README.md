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
    // 等同于
    // const valid = await validator.v('15600001111', 'mobile')
    // true
})()
```

### 默认的测试函数 Default Test Functions

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

一条规则可以是字符串，正则表达式，数组，对象或者自定义函数

#### 使用字符串

##### 调用默认/自定义的测试函数

```javascript
validator.v('12', 'number')
```

##### 逻辑与/或的字符串写法
```javascript
assert(!await validator.v([1, 2], 'object && number'))
assert(await validator.v([1, 2], 'object && array'))
assert(!await validator.v([1, 2], 'string || number'))
assert(await validator.v([1, 2], 'object || number'))
```

##### 简单表达式(判断相等/表达式)
```javascript
// >
assert(await validator.validate(12, '>10'))  
// >=
assert(await validator.validate(12, '>=12'))
// <=
assert(await validator.validate(12, '<=12'))
// =
assert(await validator.validate(12, '=12'))
assert(await validator.validate('12', '=12'))
assert(await validator.validate('abcdefg', '=abcdefg'))
// 如果要判断类型，则需要使用 && 来进行指定
assert(!await validator.validate(12, 'string && =12'))
assert(await validator.validate(12, 'number && =12'))
```

#### 使用数组表示逻辑与

```javascript
validator.v('12', ['string', /1/, /2/])
```

#### 使用对象

```javascript
validator.v({
    a: '12',
    b: 12,
    c: null
}, {
    b: 'number',
    a: 'string',
    c: null
})
```

##### 使用$

```javascript
validator.v({
    a: '123124124',
    b: 1241231,
    c: null
}, {
    // key后加$ 表示可以不存在，否则必须存在
    a$: 'string',
    b: 'number',
    // 字符规则后加$表示可以为null/undefined
    c: 'number$',
    // $表示被验证的对象本身
    $: 'object',
    // $subItem 表示当前验证被验证对象/数组下的所有值，表示...obj或...array
    $subItem: 'truthy',
    // $or 表示一条规则，表示验证对象需要至少符合数组内的任一项
    $or: ['string' , 'object'],
})
```

##### 使用$来描述复杂的require关系

```javascript
validator.v({
    a: '123124124',
    b: 1241231,
    c: null
}, {
    //当a存在是 c必须存在，a不存在时，c也可以不存在
    a$: 'string',
    b: 'number',
    c$: 'null',
    $(val){
        if(val.a){
            return val.c !== undefined
        }else{
            return true
        }
    }
}
```

##### 使用字符串[]来描述数组中的类型

```javascript
/*
array[number]规则表示{
    $: 'array',
    $subItem: 'number'
} 的语法糖
*/
validator.v([12, 13, 12343], 'array[number]')
```

#### 递归验证的例子
```javascript
validator.addPresetRule('person', {
    name: 'truthyString',
    age: 'number',
    children$: 'array[person]$'
})
validator.addPresetRule('people', 'array[person]')
const data = [{
    name: '龙一',
    age: 55,
    children: [{
        name: '龙二',
        age: 32
    }]
}, {
    name: '落一',
    age: 45,
    children: [{
        name: '落二',
        age: 12
    }]
}]
validator.v(data, 'people')
```

#### 转义$

```javascript
validator.v({
    a$: 1,
}, {
    a$$: 'number',
})// Promise.resolve(true)

await validator.v({
    $: 1,
}, {
    $$: 'number',
})// Promise.resolve(true)

!await validator.v({
    $subItem: 1,
}, {
    $$subItem: 'string',
})// Promise.resolve(false)
```