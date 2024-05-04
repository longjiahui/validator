import { Module, Rule, RuleArg, RuleParser } from '../typings'

export default {
    getParser(v) {
        const ret = {
            getVal(val: any, key: string) {
                let keys = (key as string).split('.')
                for (let k of keys) {
                    val = val?.[k]
                }
                return val
            },
            // 转义 $
            dealPrefix$(str: string | undefined) {
                str = str || ''
                let $amount = /^\$+/.exec(str)?.[0]?.length || 0
                if ($amount > 1) {
                    return str.slice(1)
                } else {
                    return str
                }
            },
            dealSuffix$(str: string | undefined) {
                str = str || ''
                return str.replace(/\$\$$/g, '$')
            },
            doObjectRule(rule: RuleArg) {
                // 预处理一下'$subItem' '$or' 的情况 ...
                if (
                    rule &&
                    !(rule instanceof Array) &&
                    !(rule instanceof RegExp) &&
                    typeof rule === 'object'
                ) {
                    rule = { ...rule }
                    let rules: Rule[] = []
                    let keys = Object.keys(rule)
                    if (keys.includes('$subItem')) {
                        // $subItem
                        let subItemRule = rule.$subItem
                        delete rule.$subItem
                        rules.push(async (val) => {
                            let newRule: RuleArg = {}
                            Object.keys(val).forEach((k) => {
                                newRule[k as keyof typeof newRule] =
                                    subItemRule as any
                            })
                            // console.log('subItem: ', val, newRule)
                            return v.v(val, newRule, true).then((d) => {
                                if (d) {
                                    return `$subItem: ${d}`
                                }
                            })
                        })
                    }
                    if (keys.includes('$or')) {
                        let orRule = rule.$or || []
                        delete rule.$or
                        rules.push((val) => {
                            return v.checkOr(
                                orRule.map(async (r) => {
                                    return v.v(val, r, true)
                                })
                            )
                        })
                    }
                    keys = Object.keys(rule)
                    rules.push((val, v, err) => {
                        return v.checkAnd(
                            keys.map(async (k) => {
                                // 处理 $$$subItem=>$$subItem的情况
                                let localK = this.dealPrefix$(k)
                                let isKeyMustExists = true
                                // 获取结尾$的数量
                                let $amount = /\$+$/.exec(k)?.[0]?.length || 0
                                if ($amount % 2 === 0) {
                                    // 双数转义
                                    localK = this.dealSuffix$(localK)
                                } else {
                                    // 单数可选
                                    isKeyMustExists = false
                                    localK = k.slice(0, -1)
                                    localK = this.dealSuffix$(localK)
                                }
                                let subVal =
                                    k === '$' ? val : this.getVal(val, localK)
                                if (isKeyMustExists && subVal === undefined) {
                                    // 这个key一定要存在而不存在这个key
                                    // console.debug('a key that must exist but not exist')
                                    return `${localK} is required!`
                                } else if (subVal !== undefined) {
                                    return v.v(
                                        subVal,
                                        rule[k as keyof typeof rule],
                                        true
                                    )
                                } else {
                                    return ''
                                }
                            })
                        )
                    })
                    return rules
                } else {
                    return []
                }
            },
            parseRule(rule: Parameters<RuleParser['parseRule']>[0]) {
                let parsedRule: RuleArg | undefined
                if (
                    rule &&
                    typeof rule === 'object' &&
                    rule.constructor.name === 'Object'
                ) {
                    parsedRule = this.doObjectRule(rule)
                }
                return parsedRule
            },
        }
        return ret
    },
} as Module
