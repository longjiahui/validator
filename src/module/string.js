module.exports = {
    install(v){
        return {
            parseRule(rule){
                let parsedRule = null
                if(rule){
                    // 匹配上了规则之后一定要修改parsedRule
                    if(typeof rule === 'string'){
                        // 先处理$结尾的情况
                        if(/\$$/.test(rule)){
                            parsedRule = {$or: ['null', rule.slice(0, -1)]}
                        }else{
                            let itemType = /^array\[(.+)\]\$?$/.exec(rule)?.[1]
                            if(itemType){
                                parsedRule = {
                                    $: 'array',
                                    $subItem: itemType
                                }
                            }else{
                                // 处理or and 的情况
                                parsedRule = v.getPresetRule(rule)
                            }
                        }
                    }
                }
                return parsedRule
            }
        }
    }
}