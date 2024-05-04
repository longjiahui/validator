import { Module, Rule } from '../typings'

export default {
    getParser(v) {
        return {
            parseRule(rule) {
                let parsedRule: Rule | undefined
                if (rule instanceof Array) {
                    // [...] 表示and
                    parsedRule = (val, v) =>
                        v.checkAnd(rule.map(async (r) => v.v(val, r, true)))
                }
                return parsedRule
            },
        }
    },
} as Module
