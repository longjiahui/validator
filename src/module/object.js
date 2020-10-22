module.exports = {
    install(v){
        return {
            getVal(val, key){
                let keys = key.split('.')
                for(let k of keys){
                    val = val?.[k]
                }
                return val
            },
            // 转义 $
            dealPrefix$(str){
                let $amount = /^\$+/.exec(str)?.[0]?.length || 0
                if($amount > 1){
                    return str.slice(1)
                }else{
                    return str
                }
            },
            dealSuffix$(str){
                return str?.replace(/\$\$$/g, '$')
            },
            doObjectRule(rule){
                // 预处理一下'$subItem' '$or' 的情况 ...
                rule = {...rule}
                let rules = []
                let keys = Object.keys(rule)
                if(keys.includes('$subItem')){
                    // $subItem
                    let subItemRule = rule.$subItem
                    delete rule.$subItem
                    rules.push(async val=>{
                        let newRule = {}
                        Object.keys(val).forEach(k=>{
                            newRule[k] = subItemRule
                        })
                        // console.log('subItem: ', val, newRule)
                        return v.v(val, newRule)
                    })
                }
                if(keys.includes('$or')){
                    let orRule = rule.$or
                    delete rule.$or
                    rules.push(val=>{
                        return v.checkOr(orRule.map(r=>{
                            return v.v(val, r)
                        }))
                    })
                }
                keys = Object.keys(rule)
                rules.push(val=>{
                    return v.checkAnd(keys.map(async k=>{
                        // 处理 $$$subItem=>$$subItem的情况
                        let localK = this.dealPrefix$(k)
                        let isKeyMustExists = true
                        // 获取结尾$的数量
                        let $amount = /\$+$/.exec(k)?.[0]?.length || 0
                        if($amount % 2 === 0){
                            // 双数转义
                            localK = this.dealSuffix$(localK)
                        }else{
                            // 单数可选
                            isKeyMustExists = false
                            localK = k.slice(0, -1)
                            localK = this.dealSuffix$(localK)
                        }
                        let subVal = k === '$'?val:this.getVal(val, localK)
                        if(isKeyMustExists && subVal === undefined){
                            // 这个key一定要存在而不存在这个key
                            // console.debug('a key that must exist but not exist')
                            return false
                        }else if(subVal !== undefined){
                            return v.v(subVal, rule[k])
                        }else{
                            return true
                        }
                    }))
                })
                return rules
            },
            parseRule(rule){
                let parsedRule = null
                if(rule && typeof rule === 'object' && rule.constructor.name === 'Object'){
                    parsedRule = this.doObjectRule(rule)
                }
                return parsedRule
            }
        }
    }
}