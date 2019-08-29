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

### example

#### 基本

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    work:{
        name: '老师',
        salary: 12000,
    }
};
new Validator().validate(obj, {
    'id*': 'number',
    name: 'string',
    work: {
        'name*': 'string',
        salary: 'number?'
    }
}).then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

说明:
- `key`结尾加上`*`表示该路径必须存在，即`val[key] !== undefined`
- 校验规则结尾添加`?`表示在验证时会先验证是否为`null`，是即通过
- 已经初始化几种校验方法。['string', 'number', 'boolean', 'object', 'array', 'null', 'completeNull', 'completeUndefined', 'function', 'any']
    - `null`是指`val == null`的验证方法
    - `completeNull`是指`val === null`的验证方法
    - `completeUndefined`是指`val === undefined`的验证方法
    - `any`会在任何情况返回`true`

#### 通过`.`来取值

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    work:{
        name: '老师',
        salary: 12000,
    }
};
new Validator().validate(obj, {
    'id*': 'number',
    name: 'string',
    'work.name*': 'string',
    'work.salary': 'number?'
    //可以一直嵌套下去
}).then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

#### 规则的与和或

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    work:{
        name: '老师',
        salary: 12000,
    }
};
new Validator().validate(obj, {
    'id*': {or:['number', 'string']},//表示Id可以是字符串也可以是数字
    // 将or换成and即为and
    // 'id*':{and:['number', 'string']},//表示为数字的同时为string，当然这不可能校验成功
    name: 'string',
    'work.name*': 'string',
    'work.salary': 'number?'
    //可以一直嵌套下去
}).then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

#### 初始化Validator时自定义验证规则

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
let person = {
    'id*': {or:['number', 'string']},
    'name*': 'string',
    children: 'array?'
    //递归的情况在下面会说到
}
//这个方法的写法与上面的对象等价
person = (val, ctx, validator)=>{
    return validator.validate(val, {
        'id*': {or:['number', 'string']},
        'name*': 'string',
        children: 'array?'
    });
}
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        children: 'array?'
        //递归的情况在下面会说到
    },
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

说明:
- 校验方法得参数说明
    - `val`本次要校验的内容
    - `ctx`校验的环境参数
        - 当执行`...`遍历情况时的ctx会包含`key`值或`index`值
        - 一般情况是整个变量
    - `validator`是当前这个Validator的实例

#### 使用`...`遍历iterable的变量

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        children: {
            //.表示自身
            '.': 'array?',
            // children的每个子元素都必须满足'object'规则
            '...': 'object'
        }
    }
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

#### 使用`[ ]`来扩展规则的使用

##### 在字符串中使用`[ ]`

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        children: 'array[object]?',
        //这种方式与上面的写法等价
        //等价于
        /*
        children: {
            '.': 'array?',
            '...': 'object'
        }
        */
    }
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

说明:
- `[ ]`包住的类型`object`用来验证子元素
- `array`用来验证父元素
- `array[object?]`表示子元素可以为`null/undefined`,`array[object]?`表示children本身可以为`null/undeinfed`,或两者皆可同时使用 

##### 包住规则本身

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        children: {or: ['null', ['object']],
        //当数组中只有一个规则，则将规则验证与所有的子元素，等价于
        /*
        children: 'array[object]'
        */
    }
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

说明:
- 如果要验证数组且只验证第一个元素的情况,使用`any`,如`['string', 'any']`表示该数组第一个元素为字符串，其余不验证
- `['string', 'number']`则表示该数组第一个元素为字符串，第二个元素为数值，其余不验证
- `['string']`表示验证该数组的所有子元素是否为字符串

#### 处理递归的情况

只需要对上面的例子稍作修改即可

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        //可以在规则中引用自定义的规则
        children: 'array[person]?',
    }
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

#### 在规则中返回Promise

```javascript
import Validator from 'biangvalidator';
let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        //可以在规则中引用自定义的规则
        children: (val, ctx, validator)=>{
            let _this = this;
            return new Promise((resolve, reject)=>{
                //3s 后返回
                setTimeout(()=>{
                    resolve(validator.validate(val, 'array[person]?'));
                }, 3000);
            });
        },
    }
}).validate(obj, 'person').then(()=>{
    //valid
}).catch(err=>{
    //invalid
});
```

说明:
- 这次validate过程将会在3s后返回