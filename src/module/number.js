module.exports = {
    install(){
        return {
            parseRule(rule){
                let parsedRule = null
                if(typeof rule === 'number'){
                    if(isNaN(rule)){
                        parsedRule = val=>isNaN(rule)
                    }else{
                        parsedRule = val=>val === rule
                    }
                }
                return parsedRule
            }
        }
    }
}