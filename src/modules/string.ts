import { Module, RuleArg } from '../typings'

export default {
    getParser(v) {
        return {
            parseRule(rule) {
                let parsedRule: RuleArg | undefined
                if (rule) {
                    // 匹配上了规则之后一定要修改parsedRule
                    if (typeof rule === 'string') {
                        // 处理|| && 的情况
                        // 需要先处理|| 再处理&& 的情况，因为&&的优先度更高，所以应该将&&的两边划分为一个规则
                        const orRules = rule.split('||')
                        if (orRules.length > 1) {
                            parsedRule = { $or: orRules.map((r) => r.trim()) }
                        } else {
                            const orRule = orRules[0]
                            const andRules = orRule.split('&&')
                            if (andRules.length > 1) {
                                parsedRule = andRules.map((r) => r.trim())
                            } else {
                                const andRule = andRules[0]

                                // 一般的string规则
                                // 先处理$结尾的情况
                                if (/\$$/.test(andRule)) {
                                    parsedRule = {
                                        $or: ['null', andRule.slice(0, -1)],
                                    }
                                } else {
                                    // 处理 array[xx]的情况
                                    let itemType = /^array\[(.+)\]\$?$/.exec(
                                        andRule
                                    )?.[1]
                                    if (itemType) {
                                        parsedRule = {
                                            $: 'array',
                                            $subItem: itemType,
                                        }
                                    } else {
                                        // 处理常数判断的问题 =10, >10 之类的，不能处理===的情况，都是==的判断
                                        // 如果要判断类型需要使用'string && =10'
                                        // 判断= 的情况
                                        let res = /^=(.+)$/.exec(andRule)
                                        if (!res) {
                                            // 判断> < >= <=的情况 只能是数值
                                            res = /^([><]|>=|<=)\s*(\d+)$/.exec(
                                                andRule
                                            )
                                            if (!res) {
                                                parsedRule = v.getRule(andRule)
                                                if (!parsedRule) {
                                                    parsedRule = (_val) =>
                                                        'rule not found: ' +
                                                        andRule
                                                }
                                            } else {
                                                // > < >= <=的情况 数值
                                                let op = res[1]
                                                let cond = res[2]
                                                parsedRule = (val) =>
                                                    eval(
                                                        JSON.stringify(val) +
                                                            op +
                                                            cond
                                                    )
                                                        ? ''
                                                        : 'number expression error'
                                            }
                                        } else {
                                            // = 的情况
                                            let cond = res[1]
                                            parsedRule = (val) =>
                                                val == cond
                                                    ? ''
                                                    : '= not fullfill'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return parsedRule
            },
        }
    },
} as Module
