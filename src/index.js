const defaultPresetRules = require('./presetRules')
const utils = require('./utils')
const stringMod = require('./module/string')
const arrayMod = require('./module/array')
const regexpMod = require('./module/regexp')
const objectMod = require('./module/object')
const numberMod = require('./module/number')
const booleanMod = require('./module/boolean')

module.exports = class {
    constructor(presetRules){
        let rules = Object.assign({}, defaultPresetRules, presetRules)
        // typeof presetRules should be object
        let keys = Object.keys(rules || {})
        this.presetRules = {}
        keys.forEach(k=>{
            this.addPresetRule(k, rules[k])
        })
        Object.assign(this, utils)
        this.ruleParsers = []

        this.use(booleanMod)
        this.use(objectMod)
        this.use(stringMod)
        this.use(arrayMod)
        this.use(regexpMod)
        this.use(numberMod)
    }

    use(mod){
        let parser = mod?.install.call(this, this)
        if(parser){
            this.ruleParsers.push(parser)
        }
    }

    addPresetRule(key, rule){
        this.presetRules[key.toUpperCase()] = rule
    }
    addPresetRules(rules){
        Object.keys(rules).forEach(k=>{
            this.addPresetRule(k, rules[k])
        })
    }
    getPresetRule(key){
        return this.presetRules[key.toUpperCase()]
    }

    v(...rest){
        return this.validate(...rest)
    }
    
    async validate(val, rule){
        for(let parser of this.ruleParsers){
            let parsedRule = parser.parseRule(rule)
            if(parsedRule){
                return this.validate(val, parsedRule)
            }
        }
        // 每条规则都会到这里验证
        if(rule && typeof rule === 'function'){
            // console.debug(val, parsedRule, await parsedRule.call(this, val, this))
            return rule.call(this, val, this)
        }
    }
}
