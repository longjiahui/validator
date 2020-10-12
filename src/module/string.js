module.exports = {
    install(v){
        return {
            parseRule(rule){
                let parsedRule = null
                if(rule){
                    // 匹配上了规则之后一定要修改parsedRule
                    if(typeof rule === 'string'){
                        // 处理|| && 的情况
                        rule = rule.split('&&')
                        if(rule.length > 1){
                            parsedRule = rule.map(r=>r.trim())
                        }else{
                            rule = rule[0]
                            rule = rule.split('||')
                            if(rule.length > 1){
                                parsedRule = {$or: rule.map(r=>r.trim())}
                            }else{
                                rule = rule[0]

                                // 一般的string规则
                                // 先处理$结尾的情况
                                if(/\$$/.test(rule)){
                                    parsedRule = {$or: ['null', rule.slice(0, -1)]}
                                }else{
                                    // 处理 array[xx]的情况
                                    let itemType = /^array\[(.+)\]\$?$/.exec(rule)?.[1]
                                    if(itemType){
                                        parsedRule = {
                                            $: 'array',
                                            $subItem: itemType
                                        }
                                    }else{
                                        // 处理常数判断的问题 =10, >10 之类的，不能处理===的情况，都是==的判断
                                        // 如果要判断类型需要使用'string && =10'
                                        // 判断= 的情况
                                        let res = /^=\s*(\S+)$/.exec(rule)
                                        if(!res){
                                            // 判断> < >= <=的情况 只能是数值
                                            res = /^([><]|>=|<=)\s*(\d+)$/.exec(rule)
                                            if(!res){
                                                parsedRule = v.getPresetRule(rule)
                                            }else{
                                                // > < >= <=的情况 数值
                                                let op = res[1]
                                                let cond = res[2]
                                                parsedRule = val=>eval(JSON.stringify(val) + op + cond)
                                            }
                                        }else{
                                            // = 的情况
                                            let cond = res[1]
                                            parsedRule = val=>val == cond
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return parsedRule
            }
        }
    }
}