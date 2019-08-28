!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.BiangValidator=t():e.BiangValidator=t()}("undefined"==typeof self?this:self,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=u(r(1)),o=u(r(2));function u(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(r,!0).forEach(function(t){f(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function f(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var s=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),t||(t={}),Object.assign(t,n.default);var r=Object.keys(t),o={};r.forEach(function(e){o[e.toUpperCase()]=t[e]}),this._testFuncs=o}var t,r,u;return t=e,(r=[{key:"validate",value:function(e,t){var r=this;if("string"==typeof t&&(t={".":t}),!t||"object"!==a(t))throw"args error";var n=this,o=Object.keys(t),u=[];return o.forEach(function(o){var i,f;try{var l=function(e){return new Promise(function(t,r){e.then(function(){t()}).catch(function(e){var t=e&&e.rule,u=e&&e.desc,i="error: ".concat(o,", rule: ").concat(n.dumpRule(f),", theRule: ").concat(n.dumpRule(t),", desc: ").concat(u);r({error:i,key:o,rule:f,theRule:t,_origin:e})})})};if(f=t[o],"..."===o){var s=function(){return l(Promise.reject({desc:"can't spread target"}))};e?e instanceof Array?e.forEach(function(t,n){u.push(l(r.testRule(t,f,c({},e,{_index:n}))))}):"object"===a(e)?Object.keys(e).forEach(function(t){u.push(l(r.testRule(e[t],f,c({},e,{_key:t}))))}):u.push(s()):u.push(s())}else{var p=o,y=/\*$/.test(p);p=y?p.slice(0,p.length-1):p,void 0===(i=r.getVal(e,p))?y&&u.push(l(Promise.reject({desc:"path is unavailable which is nesessary"}))):u.push(l(r.testRule(i,f,e)))}}catch(e){throw"path: ".concat(o,", rule: ").concat(r.dumpRule(f),", error: ").concat(e)}}),Promise.all(u)}},{key:"dumpRule",value:function(e){if(e){if("string"==typeof e)return e;if("object"===a(e))return JSON.stringify(e,function(e,t){return"function"==typeof t?"[Function]":t});if("function"==typeof e)return"[Function]"}return""}},{key:"getVal",value:function(e,t){if(!t)throw"blank path";return"."===t?e:(t.split(".").forEach(function(t){e&&"object"===a(e)&&(e=e[t])}),e)}},{key:"_preHandleRule",value:function(e){var t=this,r=e;if(e&&"object"===a(e)&&(r=(0,o.default)(!0,{},e)),"string"==typeof e){var n=!1;/\?$/.test(r)&&(n=!0,r=r.slice(0,r.length-1));var u=/^(\S+)\[(\S+)\]$/.exec(r);if(u&&3===u.length){var i=u[1],c=u[2];r=function(e){return t.validate(e,{".":i,"...":c})}}n&&(r={or:["null",r]})}if(!("object"!==a(e)||e.or instanceof Array||e.and instanceof Array)){var f=r;r=function(e){return t.validate(e,f)}}return r}},{key:"testRule",value:function(e,t,r){var n=!0;if(!t)throw"blank rule";if("string"==typeof(t=this._preHandleRule(t))){var o=this.getTestFunc(t);if(!o)throw"can't find rule: ".concat(this.dumpRule(t));try{n=o.call(this,e,r)}catch(e){throw"RULE EXCEPTION: ".concat(this.dumpRule(t),", FOR: ").concat(e)}}else if("function"==typeof t)n=t.call(this,e,r);else{if("object"===a(t)){if(t.or&&t.or instanceof Array)return this.testOrRules(e,t.or,r);if(t.and&&t.and instanceof Array)return this.testAndRules(e,t.and,r);throw"bad rule: ".concat(this.dumpRule(t))}if(t instanceof Array)return this.testAndRules(e,t.and,r)}return n instanceof Promise?n:n?Promise.resolve():Promise.reject({val:e,rule:t})}},{key:"getTestRulesPromises",value:function(e,t,r){var n=this;if(t&&t instanceof Array){var o=[];return t.forEach(function(t){var u=n.testRule(e,t,r);u&&(u instanceof Promise?o.push(u):o.push(u?Promise.resolve():Promise.reject({val:e,rule:t})))}),o}throw"blank rules"}},{key:"testAndRules",value:function(e,t,r){return Promise.all(this.getTestRulesPromises(e,t,r))}},{key:"testOrRules",value:function(e,t,r){return Promise.or(this.getTestRulesPromises(e,t,r))}},{key:"getTestFunc",value:function(e){if(e&&this._testFuncs){var t=e.toUpperCase(),r=this._testFuncs[t];if("function"==typeof(r=this._preHandleRule(r)))return r;throw"".concat(t," is not function type")}return null}}])&&l(t.prototype,r),u&&l(t,u),e}();t.default=s,Promise.or=function(e){var t=[];function r(e){return new Promise(function(t,r){e.then(function(e){r(e)}).catch(function(e){t(e)})})}return e&&e.length>0?(e.forEach(function(e){t.push(r(e))}),r(Promise.all(t))):Promise.resolve()}},function(e,t,r){"use strict";function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o={object:function(e){return e&&"object"===n(e)},number:function(e){return"number"==typeof e},string:function(e){return"string"==typeof e},boolean:function(e){return"boolean"==typeof e},null:function(e){return null==e},completeNull:function(e){return null===e},completeUndefined:function(e){return void 0===e},function:function(e){return"function"==typeof e},array:function(e){return e instanceof Array}};t.default=o},function(e,t,r){"use strict";var n=Object.prototype.hasOwnProperty,o=Object.prototype.toString,u=Object.defineProperty,i=Object.getOwnPropertyDescriptor,c=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===o.call(e)},f=function(e){if(!e||"[object Object]"!==o.call(e))return!1;var t,r=n.call(e,"constructor"),u=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!r&&!u)return!1;for(t in e);return void 0===t||n.call(e,t)},a=function(e,t){u&&"__proto__"===t.name?u(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if("__proto__"===t){if(!n.call(e,t))return;if(i)return i(e,t).value}return e[t]};e.exports=function e(){var t,r,n,o,u,i,s=arguments[0],p=1,y=arguments.length,b=!1;for("boolean"==typeof s&&(b=s,s=arguments[1]||{},p=2),(null==s||"object"!=typeof s&&"function"!=typeof s)&&(s={});p<y;++p)if(null!=(t=arguments[p]))for(r in t)n=l(s,r),s!==(o=l(t,r))&&(b&&o&&(f(o)||(u=c(o)))?(u?(u=!1,i=n&&c(n)?n:[]):i=n&&f(n)?n:{},a(s,{name:r,newValue:e(b,i,o)})):void 0!==o&&a(s,{name:r,newValue:o}));return s}}]).default});