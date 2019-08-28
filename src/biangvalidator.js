
import defaultTestFuncs from './defaultTestFuncs';
import extend from 'extend';

/**[{
    '.': 'object',
    'xx': 'number',
    'xx': 'string',
    'xx': {or: ['number', 'string']},// ||
    'xx' : {and: ['number', 'string']}// && 
    'xx' : {or: [{and: [xx, xx]}, xx]}//
    'xx.xx': ['null', 'string', (val)=>{
        return val && val.length < 10;
    }],//null/string的同时 limit 为10
}] */

export default class BiangValidator{
    constructor(testFuncs){
        if(!testFuncs){
            testFuncs = {};
        }
        Object.assign(testFuncs, defaultTestFuncs);
        let keys = Object.keys(testFuncs);
        let upperCaseTestFuncs = {};
        keys.forEach((key)=>{
            upperCaseTestFuncs[key.toUpperCase()] = testFuncs[key];
        });
        this._testFuncs = upperCaseTestFuncs;
        /* _testFuncs:{
            testString(val){
                return typeof val === 'string';
            }
        }*/
    }

    validate(val, by){
        if(typeof by === 'string'){
            //默认对当前val进行 test
            by = {'.': by};       
        }
        if(!by || typeof by !== 'object'){
            throw 'args error';
        }
        let _this = this;
        let keys = Object.keys(by);
        let  promises = [];
        keys.forEach(key => {
            let region;
            let rule;
            try{
                rule = by[key];
                function wrap(promise){
                    return new Promise((resovle, reject)=>{
                        promise.then(()=>{
                            resovle();
                        }).catch((msg) => {
                            let theRule = msg && msg.rule;
                            let desc = msg && msg.desc;
                            let error = `error: ${key}, rule: ${_this.dumpRule(rule)}, theRule: ${_this.dumpRule(theRule)}, desc: ${desc}`;
                            reject({error, key, rule: rule, theRule: theRule, _origin: msg});
                        });
                    });
                }
                //'...' 解构数组或object
                // 以后修改将 promise 合并成一个返回
                if(key === '...'){
                    function error(){
                        return wrap(Promise.reject({desc: `can't spread target`}));
                    }
                    if(val){
                        if(val instanceof Array){
                            val.forEach((item, index) => {
                                promises.push(wrap(this.testRule(item, rule, {...val, _index: index})));
                            });
                        }else if(typeof val === 'object'){
                            let keys = Object.keys(val);
                            keys.forEach(key => {
                                promises.push(wrap(this.testRule(val[key], rule, {...val, _key: key})));
                            });
                        }else{
                            promises.push(error());
                        }
                    }else{
                        promises.push(error());
                    }
                }else{
                    //path后面带*是必须存在的path
                    let path = key;
                    let isMustExists = /\*$/.test(path);
                    path = isMustExists?path.slice(0, path.length - 1):path;
                    region = this.getVal(val, path);
                    if(region === undefined){
                        if(isMustExists){
                            promises.push(wrap(Promise.reject({desc: 'path is unavailable which is nesessary'})));
                        }
                    }else{
                        promises.push(wrap(this.testRule(region, rule, val)));
                    }
                }
            }catch(err){
                throw `path: ${key}, rule: ${this.dumpRule(rule)}, error: ${err}`
            }
        });
        return Promise.all(promises);
    }

    dumpRule(rule){
        if(rule){
            if(typeof rule  === 'string'){
                return rule;
            }else if(typeof rule === 'object'){
                return JSON.stringify(rule, (k, v)=>{
                    if(typeof v === 'function'){
                        return '[Function]';
                    }
                    return v;
                });
            }else if(typeof rule === 'function'){
                return '[Function]';
            }
        }
        return '';
    }

    getVal(val, path){
        if(!path){
            throw 'blank path';
        }
        if(path === '.'){
            return val;
        }else{
            let keys = path.split('.');
            keys.forEach(key => {
                if(!val || typeof val !== 'object'){
                    //try accessing to a blank val
                    return undefined;
                }
                val = val[key];
            });
            return val;
        }
    }

    //语法糖处理
    _preHandleRule(origin){
        let rule = origin;
        if(origin && typeof origin === 'object'){
            rule = extend(true, {}, origin);
        }
        //预处理，如果是结尾？作为可选类型
        if(typeof origin === 'string'){
            let optional = false;
            if(/\?$/.test(rule)){
                optional = true;
                rule = rule.slice(0, rule.length - 1);
            }
            // []表示 ...的额外类型验证,例如 array[string]
            let exec = /^(\S+)\[(\S+)\]$/.exec(rule);
            if(exec && exec.length === 3){
                let type = exec[1];
                let childrenType = exec[2];
                rule = (val)=>{
                    return this.validate(val, {
                        '.': type,
                        '...': childrenType
                    });
                };
            }
            if(optional){
                rule = {or: ['null', rule]}
            }
        }
        //预处理，如果是对象，则转换成validate的参数的函数
        //如果有or或and 的key 且value是数组则放行，不处理
        if(typeof origin === 'object' && !(origin.or instanceof Array) && !(origin.and instanceof Array)){
            let obj = rule;
            rule = (val)=>{
                return this.validate(val, obj);
            }
        }
        //预处理，如果是数组
        if(origin instanceof Array){
            rule = 'array';
            if(origin.length > 0){
                if(origin.length === 1){
                    rule = {
                        '...': origin[0]
                    }
                }else if(origin.length > 1){
                    rule = {};
                    origin.forEach((item, index)=>{
                        rule[index] = item;
                    });
                }
                rule = this._preHandleRule(rule);
            }
        }
        return rule;
    }

    testRule(val, rule, ctx){
        let ret = true;
        if(rule){
            rule = this._preHandleRule(rule);
            if(typeof rule === 'string'){
                let testFunc = this.getTestFunc(rule);
                if(testFunc){
                    try{
                        // testfunc可以返回promise
                        ret = testFunc.call(this, val, ctx);
                    }catch(err){
                        throw `RULE EXCEPTION: ${this.dumpRule(rule)}, FOR: ${err}`;
                    }
                }else{
                    throw `can't find rule: ${this.dumpRule(rule)}`;
                }
            }else if(typeof rule === 'function'){
                ret = rule.call(this, val, ctx);
            }else if(typeof rule === 'object'){
                //这里的or和and的value数组不属于规则，会由testOrRules/testAndRules展开数组后将再调用testRule测试下面的规则
                if(rule.or && rule.or instanceof Array){
                    //testOrRules   
                    return this.testOrRules(val, rule.or, ctx);
                }else if(rule.and && rule.and instanceof Array){
                    //testAndRules
                    return this.testAndRules(val, rule.and, ctx);
                }else{
                    throw `bad rule: ${this.dumpRule(rule)}`
                }
            }
        }else{
            throw `blank rule`;
        }
        if(ret instanceof Promise){
            return ret;
        }
        return ret?Promise.resolve():Promise.reject({val, rule});
    }

    getTestRulesPromises(val, rules, ctx){
        if(rules && rules instanceof Array){
            let promises = [];
            rules.forEach(rule => {
                let ret = this.testRule(val, rule, ctx);
                if(ret){
                    if(ret instanceof Promise){
                        promises.push(ret);
                    }else{
                        promises.push(ret?Promise.resolve():Promise.reject({val, rule}));
                    }
                }
            });
            return promises;
        }else{
            throw `blank rules`;
        }
    }

    //返回Promise
    testAndRules(val, rules, ctx){
        return Promise.all(this.getTestRulesPromises(val, rules, ctx));
    }
    //返回Promise
    testOrRules(val, rules, ctx){
        return Promise.or(this.getTestRulesPromises(val, rules, ctx));
    }

    getTestFunc(name){
        if(name && this._testFuncs){
            let funcName = name.toUpperCase();
            let rule = this._testFuncs[funcName];
            rule = this._preHandleRule(rule);
            if(typeof rule === 'function'){
                return rule;
            }else{
                throw `${funcName} is not function type`;
            }
        }
        return null;
    }
}

//promise or
// a && b === !a || !b
// a || b === !a && !b
Promise.or = (promises)=>{
    let wraps = [];
    function wrap(promise){
        return new Promise((resolve, reject)=>{
            promise.then(res=>{
                reject(res);
            }).catch(err=>{
                resolve(err);
            })
        });
    }
    if(promises && promises.length > 0){
        promises.forEach(promise =>{
            wraps.push(wrap(promise));
        })
        return wrap(Promise.all(wraps));
    }
    return Promise.resolve();
};

// test
// let tester = new Tester({
//     testNaN(val, ctx){
//         return isNaN(val);
//     },
//     testObject(val){
//         return val && typeof val === 'object';
//     },
//     testString(val){
//         return val && typeof val === 'string';
//     }
// });

// let obj = {
//     a: 'asd;lfkasjdflaksdjfalsdkfaskldfj',
//     b: 'asd;lfkasjdflaksdjfalsdkfaskldfj',
//     c: {
//         a: 'asd;lfkasjdflaksdjfalsdkfaskldfj',
//         b: 'asd;lfkasjdflaksdjfalsdkfaskldfj',
//     },
// };

// tester.test(obj, {
//     '.': 'object',
//     'a': {and:['object', (val)=>{
//         return val.length < 10;
//     }]}
// }).then(()=>{
//     console.log('checked');
// }).catch(({error, key, rule, theRule})=>{
//     console.log(error);
// });
// let obj = [12, 13, 14, 15];
// new Tester().test(obj, {
//     '.': 'array',
//     '...': ({item, index})=>{
//         return item < 12
//     }
// }).then(()=>{
//     console.log('checked')
// }).catch(error=>{
//     console.log(error.error);
// })

// export default AValidator;