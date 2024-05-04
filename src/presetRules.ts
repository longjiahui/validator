import { Rule } from './typings'

export default {
    truthy(val) {
        return !!val ? '' : 'not truthy'
    },
    truthyString(val) {
        return !!val && typeof val === 'string' ? '' : 'not truthyString'
    },
    falsy(val) {
        return !val ? '' : 'not falsy'
    },
    object(val) {
        return val && typeof val === 'object' ? '' : 'not object'
    },
    number(val) {
        return typeof val === 'number' ? '' : 'not number'
    },
    string(val) {
        return typeof val === 'string' ? '' : 'not string'
    },
    boolean(val) {
        return typeof val === 'boolean' ? '' : 'not boolean'
    },
    null(val) {
        return val == null ? '' : 'not null'
    },
    completeNull(val) {
        return val === null ? '' : 'not complete null'
    },
    completeUndefined(val) {
        return val === undefined ? '' : 'not undefined'
    },
    function(val) {
        return typeof val === 'function' ? '' : 'not function'
    },
    array(val) {
        return val instanceof Array ? '' : 'not array'
    },
    any() {
        return ''
    },
} as Partial<Record<any, Rule>>
