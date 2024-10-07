export type * from "./typings"
import type {
  AwaitedRuleReturn,
  Module,
  Rule,
  RuleArg,
  RuleParser,
} from "./typings"
import boolean from "./modules/boolean"
import object from "./modules/object"
import string from "./modules/string"
import array from "./modules/array"
import regexp from "./modules/regexp"
import number from "./modules/number"
import presetRules from "./presetRules"

export class Validator {
  rules: Partial<Record<any, RuleArg>> = {}
  parsers: RuleParser[] = []

  constructor(
    public options: {
      logger?: Console
      // level?: keyof Console
    } = {
      // level: 'log',
    }
  ) {
    this.use(boolean)
    this.use(object)
    this.use(string)
    this.use(array)
    this.use(regexp)
    this.use(number)
    this.addRules(presetRules)
  }

  checkAnd(promises: Promise<AwaitedRuleReturn>[]): Promise<AwaitedRuleReturn> {
    return Promise.all(promises).then((reses) => {
      return reses.filter((r) => !!r).join(";")
    })
  }
  // a||b <==> !(!a&&!b)
  checkOr(promises: Promise<AwaitedRuleReturn>[]) {
    function invert(promise: Promise<AwaitedRuleReturn>) {
      return promise.then((res) => (res ? "" : "checkOr: !some is true"))
    }
    return invert(this.checkAnd((promises || []).map((p) => invert(p))))
  }

  use(mod: Module) {
    let parser = mod.getParser(this)
    if (parser) {
      this.parsers.push(parser)
    }
  }

  addRule(key: any, rule: RuleArg) {
    this.rules[key] = rule
  }
  addRules(rules: Partial<Record<any, Rule>>) {
    Object.keys(rules).forEach((k) => {
      if (rules[k]) {
        this.addRule(k, rules[k]!)
      }
    })
  }
  getRule(key: any) {
    return this.rules[key]
  }

  v(...rest: Parameters<typeof this.validate>) {
    return this.validate(...rest)
  }

  async validate(
    val: any,
    rule: RuleArg,
    silent: boolean = false
  ): Promise<AwaitedRuleReturn> {
    for (let parser of this.parsers) {
      let parsedRule = parser.parseRule(rule)
      if (parsedRule) {
        const ret = await this.validate(val, parsedRule, true)
        if (ret && !silent) {
          this.options.logger?.error(ret)
        }
        return ret
      }
    }
    // 每条规则都会到这里验证
    if (rule && typeof rule === "function") {
      const ret = await rule.call(this, val, this)
      if (ret && !silent) {
        this.options.logger?.error(ret)
      }
      return ret
    }
  }

  joinError(...rest: (string | undefined | null)[]) {
    return rest.filter((d) => !!d).join("\n")
  }
}
