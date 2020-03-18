export default {
    truthy(val){
        return !!val;
    },
    truthyString(val){
        return !!val && typeof val === 'string';
    },
    falsy(val){
        return !val;
    },
    object(val){
        return val && typeof val === 'object';
    },
    number(val){
        return typeof val === 'number';
    },
    string(val){
        return typeof val === 'string';
    },
    boolean(val){
        return typeof val === 'boolean';
    },
    null(val){
        return val == null;
    },
    completeNull(val){
        return val === null;
    },
    completeUndefined(val){
        return val === undefined;
    },
    function(val){
        return typeof val === 'function';
    },
    array(val){
        return val instanceof Array;
    },
    any(){
        return true;
    }
}