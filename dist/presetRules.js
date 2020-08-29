"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.undefined = mod.exports;
  }
})(void 0, function (module) {
  "use strict";

  module.exports = {
    truthy(val) {
      return !!val;
    },

    truthyString(val) {
      return !!val && typeof val === 'string';
    },

    falsy(val) {
      return !val;
    },

    object(val) {
      return val && typeof val === 'object';
    },

    number(val) {
      return typeof val === 'number';
    },

    string(val) {
      return typeof val === 'string';
    },

    boolean(val) {
      return typeof val === 'boolean';
    },

    null(val) {
      return val == null;
    },

    completeNull(val) {
      return val === null;
    },

    completeUndefined(val) {
      return val === undefined;
    },

    function(val) {
      return typeof val === 'function';
    },

    array(val) {
      return val instanceof Array;
    },

    any() {
      return true;
    }

  };
});