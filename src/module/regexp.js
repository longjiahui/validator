module.exports = {
    install(){
        return {
            parseRule(rule){
                let parsedRule = null
                if(rule instanceof RegExp){
                    parsedRule = val=>rule.test(val)
                }
                return parsedRule
            }
        }
    }
}