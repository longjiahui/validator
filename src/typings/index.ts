import type { Validator } from '..'

export type Rule<D = any> = (
    val: D,
    v: Validator,
    errorDescription?: string
) => PromiseLike<string | void | undefined> | string | void | undefined
export type RuleReturn = ReturnType<Rule>
export type AwaitedRuleReturn = Awaited<RuleReturn>
export interface Module {
    getParser(v: Validator): RuleParser
}

export interface RuleExtend {
    base: Rule
    string: string
    boolean: boolean
    regexp: RegExp
    number: number
}

export type GetRuleArg<T> = T[keyof T]
export type RuleArg =
    | GetRuleArg<RuleExtend>
    | {
          /** for object recursive*/
          [k: string]: RuleArg | undefined
          $or?: RuleArg[]
          $subItem?: RuleArg
      }
    | /*for and */ RuleArg[]
    | {
          $or?: RuleArg[]
          $subItem?: RuleArg
      }

export interface RuleParser {
    parseRule(rule: RuleArg): Rule | undefined
}

export {}
