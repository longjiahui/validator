import type { Validator } from '..'
import type { default as presetRules } from '../presetRules'

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

export type PresetRules = keyof typeof presetRules

export interface RuleExtend {
    base: Rule
    string: string
    boolean: boolean
    regexp: RegExp
    number: number
}

export type GetRuleArg<T> = T[keyof T]
export type RuleArg =
    | PresetRules
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

// export type ObjectRules<T extends object> = Partial<
//   Record<keyof T extends string ? `${keyof T}$` | keyof T : never, RuleArg>
// >
export type ObjectRules<T extends object> = Partial<{
    [k in keyof T extends string
        ? `${keyof T}$` | keyof T
        : never]: k extends keyof T
        ? T[k] extends object
            ? ObjectRules<T[k]> | RuleArg
            : RuleArg
        : RuleArg
}>

export interface RuleParser {
    parseRule(rule: RuleArg): Rule | undefined
}

export {}
