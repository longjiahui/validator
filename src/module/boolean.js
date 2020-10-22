module.exports = {
    install(){
        return {
            parseRule(rule){
                let parsedRule = null
                if(typeof rule === 'boolean'){
                    parsedRule = val=>val === rule
                }
                return parsedRule
            }
        }
    }
}