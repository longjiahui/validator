import type { Module, Rule } from '../typings/index'

export default {
    getParser() {
        return {
            parseRule(rule) {
                let parsedRule: Rule | undefined
                if (typeof rule === 'boolean') {
                    parsedRule = (val, v, errorDescription) =>
                        val === rule
                            ? undefined
                            : v.joinError(errorDescription, 'boolean error')
                }
                return parsedRule
            },
        }
    },
} as Module
