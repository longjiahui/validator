const defaultPresetRules = require('./presetRules')

module.exports = class {
    constructor(presetRules){
        let rules = Object.assign({}, defaultPresetRules, presetRules)
        // typeof presetRules should be object
        let keys = Object.keys(rules || {})
        this.presetRules = {}
        keys.forEach(k=>{
            this.addPresetRule(k, rules[k])
        })
    }

    addPresetRule(key, rule){
        this.presetRules[key.toUpperCase()] = rule
    }
    getPresetRule(key){
        return this.presetRules[key.toUpperCase()]
    }

    getVal(val, key){
        if(key === '$'){
            return val
        }else{
            let keys = key.split('.')
            for(let k of keys){
                val = val?.[k]
            }
            return val
        }
    }

    // 转义 $
    dealPrefix$(str){
        return str?.replace(/^\$\$/g, '$')
    }
    dealSuffix$(str){
        return str?.replace(/\$\$$/g, '$')
    }

    doObjectRule(rule){
        // 预处理一下'$spread' '$or' 的情况 ...
        let rules = []
        let keys = Object.keys(rule)
        if(keys.includes('$spread')){
            // $spread
            let spreadRule = rule.$spread
            delete rule.$spread
            rules.push(async val=>{
                let newRule = {}
                Object.keys(val).forEach(k=>{
                    newRule[k] = spreadRule
                })
                // console.log('spread: ', val, newRule)
                return this.validate(val, newRule)
            })
        }
        if(keys.includes('$or')){
            let orRule = rule.$or
            delete rule.$or
            rules.push(val=>{
                return this.checkOr(orRule.map(r=>{
                    return this.validate(val, r)
                }))
            })
        }
        keys = Object.keys(rule)
        rules.push(val=>{
            return this.checkAnd(keys.map(async k=>{
                let isKeyMustExists = true
                k = this.dealSuffix$(k)
                if(k === '$'){
                }else if(/\$$/.test(k)){
                    // 可选
                    isKeyMustExists = false
                    k = k.slice(0, -1)
                }
                let subVal = this.getVal(val, k)
                if(isKeyMustExists && subVal === undefined){
                    // 这个key一定要存在而不存在这个key
                    // console.debug('a key that must exist but not exist')
                    return false
                }
                return this.validate(subVal, rule[k])
            }))
        })
        return rules
    }

    checkAnd(promises){
        return Promise.all(promises).then(reses=>{
            return !reses.includes(false)
        })
    }
    // a||b <==> !(!a&&!b)
    checkOr(promises){
        function invert(promise){
            return promise.then(res=>!res)
        }
        return invert(this.checkAnd(promises?.map(p=>invert(p))))
    }

    pasreRule(rule){
        let parsedRule = null
        let matched = rule
        if(rule){
            // 匹配上了规则之后一定要修改parsedRule
            if(typeof rule === 'string'){
                // 先处理$结尾的情况
                if(/\$$/.test(rule)){
                    parsedRule = {$or: ['null', rule.slice(0, -1)]}
                }
                // 处理array的情况
                else{
                    let itemType = /^array\[(.+)\]\$?$/.exec(rule)?.[1]
                    if(itemType){
                        parsedRule = {
                            $: 'array',
                            $spread: itemType
                        }
                    }else{
                        // 处理or and 的情况
                        parsedRule = this.getPresetRule(rule)
                    }
                }
                    
            }else if(rule instanceof RegExp){
                parsedRule = val=>rule.test(val)
            }else if(rule instanceof Array){
                // [...] 表示and
                parsedRule = val=>this.checkAnd(rule.map(async r=>this.validate(val, r)))
            }else if(typeof rule === 'object'){
                parsedRule = this.doObjectRule(rule)
            }else{
                matched = false
            }
        }
        return {
            matched,
            parsedRule,
        }
    }

    async validate(val, rule){
        // prehandle rule
        let { matched, parsedRule } = this.pasreRule(rule)
        if(matched){
            return this.validate(val, parsedRule)
        }else{
            // 每条规则都会到这里验证
            if(rule && typeof rule === 'function'){
                // console.debug(val, parsedRule, await parsedRule.call(this, val, this))
                return rule.call(this, val, this)
            }
        }
    }
}
