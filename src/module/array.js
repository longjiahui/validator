module.exports = {
    install(v){
        return {
            parseRule(rule){
                let parsedRule = null
                if(rule instanceof Array){
                    // [...] 表示and
                    parsedRule = val=>v.checkAnd(rule.map(async r=>v.v(val, r)))
                }
                return parsedRule
            }
        }
    }
}