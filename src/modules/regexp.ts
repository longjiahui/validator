import { Module, Rule } from '../typings'

export default {
    getParser() {
        return {
            parseRule(rule) {
                let parsedRule: Rule | undefined
                if (rule instanceof RegExp) {
                    parsedRule = (val, v, err) =>
                        (typeof val === 'string' &&
                            (rule.test(val)
                                ? ''
                                : v.joinError(err, 'regexp error'))) ||
                        ''
                }
                return parsedRule
            },
        }
    },
} as Module
