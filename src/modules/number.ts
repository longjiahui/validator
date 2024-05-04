import { Module, Rule } from '../typings'

export default {
    getParser() {
        return {
            parseRule(rule) {
                let parsedRule: Rule | undefined
                if (typeof rule === 'number') {
                    if (isNaN(rule)) {
                        parsedRule = (val, v, error) =>
                            isNaN(val) ? '' : v.joinError(error, 'number error')
                    } else {
                        parsedRule = (val, v, err) =>
                            val === rule ? '' : v.joinError(err, 'number error')
                    }
                }
                return parsedRule
            },
        }
    },
} as Module
