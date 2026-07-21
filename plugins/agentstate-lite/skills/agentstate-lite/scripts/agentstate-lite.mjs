#!/usr/bin/env node
import { createRequire as ___createRequire } from 'node:module';
const require = ___createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "../../node_modules/kind-of/index.js"(exports2, module2) {
    var toString = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      if (val === void 0) return "undefined";
      if (val === null) return "null";
      var type = typeof val;
      if (type === "boolean") return "boolean";
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "symbol") return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val)) return "array";
      if (isBuffer(val)) return "buffer";
      if (isArguments(val)) return "arguments";
      if (isDate(val)) return "date";
      if (isError(val)) return "error";
      if (isRegexp(val)) return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        // Set, Map, WeakSet, WeakMap
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        // 8-bit typed arrays
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        // 16-bit typed arrays
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        // 32-bit typed arrays
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        // iterators
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    function isGeneratorFn(name, val) {
      return ctorName(name) === "GeneratorFunction";
    }
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// ../../node_modules/is-extendable/index.js
var require_is_extendable = __commonJS({
  "../../node_modules/is-extendable/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isExtendable(val) {
      return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
    };
  }
});

// ../../node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS({
  "../../node_modules/extend-shallow/index.js"(exports2, module2) {
    "use strict";
    var isObject3 = require_is_extendable();
    module2.exports = function extend(o) {
      if (!isObject3(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject3(obj)) {
          assign(o, obj);
        }
      }
      return o;
    };
    function assign(a, b) {
      for (var key in b) {
        if (hasOwn4(b, key)) {
          a[key] = b[key];
        }
      }
    }
    function hasOwn4(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }
});

// ../../node_modules/section-matter/index.js
var require_section_matter = __commonJS({
  "../../node_modules/section-matter/index.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var extend = require_extend_shallow();
    module2.exports = function(input, options2) {
      if (typeof options2 === "function") {
        options2 = { parse: options2 };
      }
      var file = toObject(input);
      var defaults = { section_delimiter: "---", parse: identity };
      var opts = extend({}, defaults, options2);
      var delim = opts.section_delimiter;
      var lines = file.content.split(/\r?\n/);
      var sections = null;
      var section = createSection();
      var content = [];
      var stack = [];
      function initSections(val) {
        file.content = val;
        sections = [];
        content = [];
      }
      function closeSection(val) {
        if (stack.length) {
          section.key = getKey(stack[0], delim);
          section.content = val;
          opts.parse(section, sections);
          sections.push(section);
          section = createSection();
          content = [];
          stack = [];
        }
      }
      for (var i = 0; i < lines.length; i++) {
        var line2 = lines[i];
        var len = stack.length;
        var ln = line2.trim();
        if (isDelimiter(ln, delim)) {
          if (ln.length === 3 && i !== 0) {
            if (len === 0 || len === 2) {
              content.push(line2);
              continue;
            }
            stack.push(ln);
            section.data = content.join("\n");
            content = [];
            continue;
          }
          if (sections === null) {
            initSections(content.join("\n"));
          }
          if (len === 2) {
            closeSection(content.join("\n"));
          }
          stack.push(ln);
          continue;
        }
        content.push(line2);
      }
      if (sections === null) {
        initSections(content.join("\n"));
      } else {
        closeSection(content.join("\n"));
      }
      file.sections = sections;
      return file;
    };
    function isDelimiter(line2, delim) {
      if (line2.slice(0, delim.length) !== delim) {
        return false;
      }
      if (line2.charAt(delim.length + 1) === delim.slice(-1)) {
        return false;
      }
      return true;
    }
    function toObject(input) {
      if (typeOf(input) !== "object") {
        input = { content: input };
      }
      if (typeof input.content !== "string" && !isBuffer(input.content)) {
        throw new TypeError("expected a buffer or string");
      }
      input.content = input.content.toString();
      input.sections = [];
      return input;
    }
    function getKey(val, delim) {
      return val ? val.slice(delim.length).trim() : "";
    }
    function createSection() {
      return { key: "", data: "", content: "" };
    }
    function identity(val) {
      return val;
    }
    function isBuffer(val) {
      if (val && val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/common.js
var require_common = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/common.js"(exports2, module2) {
    "use strict";
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    function isObject3(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }
      return target;
    }
    function repeat(string, count) {
      var result = "", cycle;
      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }
      return result;
    }
    function isNegativeZero(number) {
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
    }
    module2.exports.isNothing = isNothing;
    module2.exports.isObject = isObject3;
    module2.exports.toArray = toArray;
    module2.exports.repeat = repeat;
    module2.exports.isNegativeZero = isNegativeZero;
    module2.exports.extend = extend;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/exception.js
var require_exception = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/exception.js"(exports2, module2) {
    "use strict";
    function YAMLException(reason, mark) {
      Error.call(this);
      this.name = "YAMLException";
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "");
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack || "";
      }
    }
    YAMLException.prototype = Object.create(Error.prototype);
    YAMLException.prototype.constructor = YAMLException;
    YAMLException.prototype.toString = function toString(compact) {
      var result = this.name + ": ";
      result += this.reason || "(unknown reason)";
      if (!compact && this.mark) {
        result += " " + this.mark.toString();
      }
      return result;
    };
    module2.exports = YAMLException;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/mark.js
var require_mark = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/mark.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    function Mark(name, buffer, position, line2, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line2;
      this.column = column;
    }
    Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;
      if (!this.buffer) return null;
      indent = indent || 4;
      maxLength = maxLength || 75;
      head = "";
      start = this.position;
      while (start > 0 && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1) {
        start -= 1;
        if (this.position - start > maxLength / 2 - 1) {
          head = " ... ";
          start += 5;
          break;
        }
      }
      tail = "";
      end = this.position;
      while (end < this.buffer.length && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1) {
        end += 1;
        if (end - this.position > maxLength / 2 - 1) {
          tail = " ... ";
          end -= 5;
          break;
        }
      }
      snippet = this.buffer.slice(start, end);
      return common.repeat(" ", indent) + head + snippet + tail + "\n" + common.repeat(" ", indent + this.position - start + head.length) + "^";
    };
    Mark.prototype.toString = function toString(compact) {
      var snippet, where = "";
      if (this.name) {
        where += 'in "' + this.name + '" ';
      }
      where += "at line " + (this.line + 1) + ", column " + (this.column + 1);
      if (!compact) {
        snippet = this.getSnippet();
        if (snippet) {
          where += ":\n" + snippet;
        }
      }
      return where;
    };
    module2.exports = Mark;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type.js
var require_type = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "defaultStyle",
      "styleAliases"
    ];
    var YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    function compileStyleAliases(map) {
      var result = {};
      if (map !== null) {
        Object.keys(map).forEach(function(style) {
          map[style].forEach(function(alias) {
            result[String(alias)] = style;
          });
        });
      }
      return result;
    }
    function Type(tag, options2) {
      options2 = options2 || {};
      Object.keys(options2).forEach(function(name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
        }
      });
      this.tag = tag;
      this.kind = options2["kind"] || null;
      this.resolve = options2["resolve"] || function() {
        return true;
      };
      this.construct = options2["construct"] || function(data) {
        return data;
      };
      this.instanceOf = options2["instanceOf"] || null;
      this.predicate = options2["predicate"] || null;
      this.represent = options2["represent"] || null;
      this.defaultStyle = options2["defaultStyle"] || null;
      this.styleAliases = compileStyleAliases(options2["styleAliases"] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
    }
    module2.exports = Type;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema.js
var require_schema = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Type = require_type();
    function compileList(schema, name, result) {
      var exclude = [];
      schema.include.forEach(function(includedSchema) {
        result = compileList(includedSchema, name, result);
      });
      schema[name].forEach(function(currentType) {
        result.forEach(function(previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
            exclude.push(previousIndex);
          }
        });
        result.push(currentType);
      });
      return result.filter(function(type, index) {
        return exclude.indexOf(index) === -1;
      });
    }
    function compileMap() {
      var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;
      function collectType(type) {
        result[type.kind][type.tag] = result["fallback"][type.tag] = type;
      }
      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }
    function Schema(definition) {
      this.include = definition.include || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];
      this.implicit.forEach(function(type) {
        if (type.loadKind && type.loadKind !== "scalar") {
          throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
      });
      this.compiledImplicit = compileList(this, "implicit", []);
      this.compiledExplicit = compileList(this, "explicit", []);
      this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    Schema.DEFAULT = null;
    Schema.create = function createSchema() {
      var schemas, types;
      switch (arguments.length) {
        case 1:
          schemas = Schema.DEFAULT;
          types = arguments[0];
          break;
        case 2:
          schemas = arguments[0];
          types = arguments[1];
          break;
        default:
          throw new YAMLException("Wrong number of arguments for Schema.create function");
      }
      schemas = common.toArray(schemas);
      types = common.toArray(types);
      if (!schemas.every(function(schema) {
        return schema instanceof Schema;
      })) {
        throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
      }
      if (!types.every(function(type) {
        return type instanceof Type;
      })) {
        throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      return new Schema({
        include: schemas,
        explicit: types
      });
    };
    module2.exports = Schema;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/str.js
var require_str = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/str.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/seq.js
var require_seq = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/seq.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/map.js
var require_map = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/map.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema/failsafe.js
var require_failsafe = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema/failsafe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      explicit: [
        require_str(),
        require_seq(),
        require_map()
      ]
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/null.js
var require_null = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/null.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlNull(data) {
      if (data === null) return true;
      var max = data.length;
      return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/bool.js
var require_bool = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/bool.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlBoolean(data) {
      if (data === null) return false;
      var max = data.length;
      return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    function isBoolean(object) {
      return Object.prototype.toString.call(object) === "[object Boolean]";
    }
    module2.exports = new Type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/int.js
var require_int = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/int.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    function isHexCode(c) {
      return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
    }
    function isOctCode(c) {
      return 48 <= c && c <= 55;
    }
    function isDecCode(c) {
      return 48 <= c && c <= 57;
    }
    function resolveYamlInteger(data) {
      if (data === null) return false;
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max) return false;
      ch = data[index];
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        if (index + 1 === max) return true;
        ch = data[++index];
        if (ch === "b") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (ch !== "0" && ch !== "1") return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (!isHexCode(data.charCodeAt(index))) return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "_") return false;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      if (!hasDigits || ch === "_") return false;
      if (ch !== ":") return true;
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }
    function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0") return 0;
      if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
      }
      if (value.indexOf(":") !== -1) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseInt(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0" + obj.toString(8) : "-0" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/float.js
var require_float = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/float.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    function resolveYamlFloat(data) {
      if (data === null) return false;
      if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === "_") {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      var value, sign, base, digits;
      value = data.replace(/_/g, "").toLowerCase();
      sign = value[0] === "-" ? -1 : 1;
      digits = [];
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else if (value === ".nan") {
        return NaN;
      } else if (value.indexOf(":") >= 0) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseFloat(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseFloat(value, 10);
    }
    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    function representYamlFloat(object, style) {
      var res;
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (common.isNegativeZero(object)) {
        return "-0.0";
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema/json.js
var require_json = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema/json.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_failsafe()
      ],
      implicit: [
        require_null(),
        require_bool(),
        require_int(),
        require_float()
      ]
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema/core.js
var require_core = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema/core.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_json()
      ]
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/timestamp.js
var require_timestamp = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/timestamp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    function resolveYamlTimestamp(data) {
      if (data === null) return false;
      if (YAML_DATE_REGEXP.exec(data) !== null) return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
      return false;
    }
    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
      if (match === null) throw new Error("Date resolve error");
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) {
          fraction += "0";
        }
        fraction = +fraction;
      }
      if (match[9]) {
        tz_hour = +match[10];
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 6e4;
        if (match[9] === "-") delta = -delta;
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta) date.setTime(date.getTime() - delta);
      return date;
    }
    function representYamlTimestamp(object) {
      return object.toISOString();
    }
    module2.exports = new Type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/merge.js
var require_merge = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/merge.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/binary.js
var require_binary = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/binary.js"(exports2, module2) {
    "use strict";
    var NodeBuffer;
    try {
      _require = __require;
      NodeBuffer = _require("buffer").Buffer;
    } catch (__) {
    }
    var _require;
    var Type = require_type();
    var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    function resolveYamlBinary(data) {
      if (data === null) return false;
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        if (code > 64) continue;
        if (code < 0) return false;
        bitlen += 6;
      }
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
      } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
      }
      if (NodeBuffer) {
        return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }
      return result;
    }
    function representYamlBinary(object) {
      var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
      } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(object) {
      return NodeBuffer && NodeBuffer.isBuffer(object);
    }
    module2.exports = new Type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/omap.js
var require_omap = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/omap.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    function resolveYamlOmap(data) {
      if (data === null) return true;
      var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey) pairHasKey = true;
            else return false;
          }
        }
        if (!pairHasKey) return false;
        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    module2.exports = new Type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/pairs.js
var require_pairs = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/pairs.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _toString = Object.prototype.toString;
    function resolveYamlPairs(data) {
      if (data === null) return true;
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        if (_toString.call(pair) !== "[object Object]") return false;
        keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null) return [];
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    module2.exports = new Type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/set.js
var require_set = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/set.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function resolveYamlSet(data) {
      if (data === null) return true;
      var key, object = data;
      for (key in object) {
        if (_hasOwnProperty.call(object, key)) {
          if (object[key] !== null) return false;
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    module2.exports = new Type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema/default_safe.js
var require_default_safe = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema/default_safe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_core()
      ],
      implicit: [
        require_timestamp(),
        require_merge()
      ],
      explicit: [
        require_binary(),
        require_omap(),
        require_pairs(),
        require_set()
      ]
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/js/undefined.js
var require_undefined = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/js/undefined.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptUndefined() {
      return true;
    }
    function constructJavascriptUndefined() {
      return void 0;
    }
    function representJavascriptUndefined() {
      return "";
    }
    function isUndefined(object) {
      return typeof object === "undefined";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/undefined", {
      kind: "scalar",
      resolve: resolveJavascriptUndefined,
      construct: constructJavascriptUndefined,
      predicate: isUndefined,
      represent: representJavascriptUndefined
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/js/regexp.js
var require_regexp = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/js/regexp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptRegExp(data) {
      if (data === null) return false;
      if (data.length === 0) return false;
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        if (modifiers.length > 3) return false;
        if (regexp[regexp.length - modifiers.length - 1] !== "/") return false;
      }
      return true;
    }
    function constructJavascriptRegExp(data) {
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }
      return new RegExp(regexp, modifiers);
    }
    function representJavascriptRegExp(object) {
      var result = "/" + object.source + "/";
      if (object.global) result += "g";
      if (object.multiline) result += "m";
      if (object.ignoreCase) result += "i";
      return result;
    }
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/regexp", {
      kind: "scalar",
      resolve: resolveJavascriptRegExp,
      construct: constructJavascriptRegExp,
      predicate: isRegExp,
      represent: representJavascriptRegExp
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/type/js/function.js
var require_function = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/type/js/function.js"(exports2, module2) {
    "use strict";
    var esprima;
    try {
      _require = __require;
      esprima = _require("esprima");
    } catch (_) {
      if (typeof window !== "undefined") esprima = window.esprima;
    }
    var _require;
    var Type = require_type();
    function resolveJavascriptFunction(data) {
      if (data === null) return false;
      try {
        var source = "(" + data + ")", ast = esprima.parse(source, { range: true });
        if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    function constructJavascriptFunction(data) {
      var source = "(" + data + ")", ast = esprima.parse(source, { range: true }), params = [], body;
      if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
        throw new Error("Failed to resolve function");
      }
      ast.body[0].expression.params.forEach(function(param) {
        params.push(param.name);
      });
      body = ast.body[0].expression.body.range;
      if (ast.body[0].expression.body.type === "BlockStatement") {
        return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      return new Function(params, "return " + source.slice(body[0], body[1]));
    }
    function representJavascriptFunction(object) {
      return object.toString();
    }
    function isFunction(object) {
      return Object.prototype.toString.call(object) === "[object Function]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/function", {
      kind: "scalar",
      resolve: resolveJavascriptFunction,
      construct: constructJavascriptFunction,
      predicate: isFunction,
      represent: representJavascriptFunction
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/schema/default_full.js
var require_default_full = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/schema/default_full.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = Schema.DEFAULT = new Schema({
      include: [
        require_default_safe()
      ],
      explicit: [
        require_undefined(),
        require_regexp(),
        require_function()
      ]
    });
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/loader.js
var require_loader = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/loader.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Mark = require_mark();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var CHOMPING_CLIP = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP = 3;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function is_EOL(c) {
      return c === 10 || c === 13;
    }
    function is_WHITE_SPACE(c) {
      return c === 9 || c === 32;
    }
    function is_WS_OR_EOL(c) {
      return c === 9 || c === 32 || c === 10 || c === 13;
    }
    function is_FLOW_INDICATOR(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromHexCode(c) {
      var lc;
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      lc = c | 32;
      if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) {
        return 2;
      }
      if (c === 117) {
        return 4;
      }
      if (c === 85) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
    }
    function charFromCodepoint(c) {
      if (c <= 65535) {
        return String.fromCharCode(c);
      }
      return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
      );
    }
    function setProperty(object, key, value) {
      if (key === "__proto__") {
        Object.defineProperty(object, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value
        });
      } else {
        object[key] = value;
      }
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    var i;
    function State(input, options2) {
      this.input = input;
      this.filename = options2["filename"] || null;
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.onWarning = options2["onWarning"] || null;
      this.legacy = options2["legacy"] || false;
      this.json = options2["json"] || false;
      this.listener = options2["listener"] || null;
      this.maxTotalMergeKeys = typeof options2["maxTotalMergeKeys"] === "number" ? options2["maxTotalMergeKeys"] : 1e4;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.totalMergeKeys = 0;
      this.documents = [];
    }
    function generateError(state, message) {
      return new YAMLException(
        message,
        new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart)
      );
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    var directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        state.tagMap[handle] = prefix;
      }
    };
    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;
      if (start < end) {
        _result = state.input.slice(start, end);
        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
              throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, "the stream contains non-printable characters");
        }
        state.result += _result;
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];
        if (state.maxTotalMergeKeys !== -1 && ++state.totalMergeKeys > state.maxTotalMergeKeys) {
          throwError(state, "merge keys exceeded maxTotalMergeKeys (" + state.maxTotalMergeKeys + ")");
        }
        if (!_hasOwnProperty.call(destination, key)) {
          setProperty(destination, key, source[key]);
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
      var index, quantity;
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, "nested arrays are not supported inside keys");
          }
          if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
            keyNode[index] = "[object Object]";
          }
        }
      }
      if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (_result === null) {
        _result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          throwError(state, "duplicated mapping key");
        }
        setProperty(_result, keyNode, valueNode);
        delete overridableKeys[keyNode];
      }
      return _result;
    }
    function readLineBreak(state) {
      var ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 10) {
        state.position++;
      } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
          state.position++;
        }
      } else {
        throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 10 && ch !== 13 && ch !== 0);
        }
        if (is_EOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
      }
      if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
      while (ch !== 0) {
        if (ch === 58) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }
        } else if (ch === 35) {
          preceding = state.input.charCodeAt(state.position - 1);
          if (is_WS_OR_EOL(preceding)) {
            break;
          }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;
        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = _kind;
      state.result = _result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 39) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 39) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 39) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 34) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 34) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        } else if (ch === 92) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readFlowCollection(state, nodeIndent) {
      var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 91) {
        terminator = 93;
        isMapping = false;
        _result = [];
      } else if (ch === 123) {
        terminator = 125;
        isMapping = true;
        _result = {};
      } else {
        return false;
      }
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(++state.position);
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === _line) && ch === 58) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
          _result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 124) {
        folding = false;
      } else if (ch === 62) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, "repeat of an indentation width identifier");
          }
        } else {
          break;
        }
      }
      if (is_WHITE_SPACE(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (is_WHITE_SPACE(ch));
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!is_EOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }
        if (state.lineIndent < textIndent) {
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              state.result += "\n";
            }
          }
          break;
        }
        if (folding) {
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) {
              state.result += " ";
            }
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
        } else {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;
        while (!is_EOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (ch !== 45) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!is_WS_OR_EOL(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "sequence";
        state.result = _result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line;
        _pos = state.position;
        if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
          if (ch === 63) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            atExplicitKey = false;
            allowCompact = true;
          } else {
            throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
          }
          state.position += 1;
          ch = following;
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!is_WS_OR_EOL(ch)) {
                throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              }
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              throwError(state, "can not read an implicit mapping pair; a colon is missed");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          } else if (detected) {
            throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else {
          break;
        }
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
          throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "mapping";
        state.result = _result;
      }
      return detected;
    }
    function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 33) return false;
      if (state.tag !== null) {
        throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      _position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 62);
        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, "unexpected end of the stream within a verbatim tag");
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, "named tag handle cannot contain such characters");
              }
              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, "tag suffix cannot contain exclamation marks");
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(_position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, "tag suffix cannot contain flow indicator characters");
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, "tag name cannot contain such characters: " + tagName);
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = "!" + tagName;
      } else if (tagHandle === "!!") {
        state.tag = "tag:yaml.org,2002:" + tagName;
      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }
      return true;
    }
    function readAnchorProperty(state) {
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 38) return false;
      if (state.anchor !== null) {
        throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an anchor node must contain at least one character");
      }
      state.anchor = state.input.slice(_position, state.position);
      return true;
    }
    function readAlias(state) {
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 42) return false;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an alias node must contain at least one character");
      }
      alias = state.input.slice(_position, state.position);
      if (!_hasOwnProperty.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }
      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
      if (state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                throwError(state, "alias node should not have any properties");
              }
            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
          if (state.result !== null && state.kind !== "scalar") {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }
          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];
            if (type.resolve(state.result)) {
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }
          if (!type.resolve(state.result)) {
            throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
          } else {
            state.result = type.construct(state.result);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          throwError(state, "unknown tag !<" + state.tag + ">");
        }
      }
      if (state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          throwError(state, "directive name must not be less than one character in length");
        }
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !is_EOL(ch));
            break;
          }
          if (is_EOL(ch)) break;
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(_position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        throwError(state, "end of the stream or a document separator is expected");
      } else {
        return;
      }
    }
    function loadDocuments(input, options2) {
      input = String(input);
      options2 = options2 || {};
      if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
          input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
          input = input.slice(1);
        }
      }
      var state = new State(input, options2);
      var nullpos = input.indexOf("\0");
      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, "null byte is not allowed in input");
      }
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 32) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function loadAll(input, iterator, options2) {
      if (iterator !== null && typeof iterator === "object" && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      var documents = loadDocuments(input, options2);
      if (typeof iterator !== "function") {
        return documents;
      }
      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }
    function load(input, options2) {
      var documents = loadDocuments(input, options2);
      if (documents.length === 0) {
        return void 0;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    function safeLoadAll(input, iterator, options2) {
      if (typeof iterator === "object" && iterator !== null && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      return loadAll(input, iterator, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    function safeLoad(input, options2) {
      return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.loadAll = loadAll;
    module2.exports.load = load;
    module2.exports.safeLoadAll = safeLoadAll;
    module2.exports.safeLoad = safeLoad;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml/dumper.js
var require_dumper = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml/dumper.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CHAR_TAB = 9;
    var CHAR_LINE_FEED = 10;
    var CHAR_CARRIAGE_RETURN = 13;
    var CHAR_SPACE = 32;
    var CHAR_EXCLAMATION = 33;
    var CHAR_DOUBLE_QUOTE = 34;
    var CHAR_SHARP = 35;
    var CHAR_PERCENT = 37;
    var CHAR_AMPERSAND = 38;
    var CHAR_SINGLE_QUOTE = 39;
    var CHAR_ASTERISK = 42;
    var CHAR_COMMA = 44;
    var CHAR_MINUS = 45;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_GREATER_THAN = 62;
    var CHAR_QUESTION = 63;
    var CHAR_COMMERCIAL_AT = 64;
    var CHAR_LEFT_SQUARE_BRACKET = 91;
    var CHAR_RIGHT_SQUARE_BRACKET = 93;
    var CHAR_GRAVE_ACCENT = 96;
    var CHAR_LEFT_CURLY_BRACKET = 123;
    var CHAR_VERTICAL_LINE = 124;
    var CHAR_RIGHT_CURLY_BRACKET = 125;
    var ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    var DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;
      if (map === null) return {};
      result = {};
      keys = Object.keys(map);
      for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
          tag = "tag:yaml.org,2002:" + tag.slice(2);
        }
        type = schema.compiledTypeMap["fallback"][tag];
        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }
        result[tag] = style;
      }
      return result;
    }
    function encodeHex(character) {
      var string, handle, length;
      string = character.toString(16).toUpperCase();
      if (character <= 255) {
        handle = "x";
        length = 2;
      } else if (character <= 65535) {
        handle = "u";
        length = 4;
      } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
      } else {
        throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
      }
      return "\\" + handle + common.repeat("0", length - string.length) + string;
    }
    function State(options2) {
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.indent = Math.max(1, options2["indent"] || 2);
      this.noArrayIndent = options2["noArrayIndent"] || false;
      this.skipInvalid = options2["skipInvalid"] || false;
      this.flowLevel = common.isNothing(options2["flowLevel"]) ? -1 : options2["flowLevel"];
      this.styleMap = compileStyleMap(this.schema, options2["styles"] || null);
      this.sortKeys = options2["sortKeys"] || false;
      this.lineWidth = options2["lineWidth"] || 80;
      this.noRefs = options2["noRefs"] || false;
      this.noCompatMode = options2["noCompatMode"] || false;
      this.condenseFlow = options2["condenseFlow"] || false;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = "";
      this.duplicates = [];
      this.usedDuplicates = null;
    }
    function indentString(string, spaces) {
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line2, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line2 = string.slice(position);
          position = length;
        } else {
          line2 = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line2.length && line2 !== "\n") result += ind;
        result += line2;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return "\n" + common.repeat(" ", state.indent * level);
    }
    function testImplicitResolving(state, str2) {
      var index, length, type;
      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];
        if (type.resolve(str2)) {
          return true;
        }
      }
      return false;
    }
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    function isPrintable(c) {
      return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
    }
    function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c) && c !== 65279 && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
    }
    function isPlainSafe(c, prev) {
      return isPrintable(c) && c !== 65279 && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && (c !== CHAR_SHARP || prev && isNsChar(prev));
    }
    function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 65279 && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
    }
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    var STYLE_PLAIN = 1;
    var STYLE_SINGLE = 2;
    var STYLE_LITERAL = 3;
    var STYLE_FOLDED = 4;
    var STYLE_DOUBLE = 5;
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
      if (singleLineOnly) {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
      } else {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
              i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
      }
      if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    function writeScalar(state, string, level, iskey) {
      state.dump = (function() {
        if (string.length === 0) {
          return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
          return "'" + string + "'";
        }
        var indent = state.indent * Math.max(1, level);
        var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(string2) {
          return testImplicitResolving(state, string2);
        }
        switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString2(string, lineWidth) + '"';
          default:
            throw new YAMLException("impossible error: invalid scalar style");
        }
      })();
    }
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
      var clip = string[string.length - 1] === "\n";
      var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
      var chomp = keep ? "+" : clip ? "" : "-";
      return indentIndicator + chomp + "\n";
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = (function() {
        var nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      })();
      var prevMoreIndented = string[0] === "\n" || string[0] === " ";
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
        var prefix = match[1], line2 = match[2];
        moreIndented = line2[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line2 !== "" ? "\n" : "") + foldLine(line2, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line2, width) {
      if (line2 === "" || line2[0] === " ") return line2;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line2)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line2.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line2.length - start > width && curr > start) {
        result += line2.slice(start, curr) + "\n" + line2.slice(curr + 1);
      } else {
        result += line2.slice(start);
      }
      return result.slice(1);
    }
    function escapeString2(string) {
      var result = "";
      var char, nextChar;
      var escapeSeq;
      for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char >= 55296 && char <= 56319) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 56320 && nextChar <= 57343) {
            result += encodeHex((char - 55296) * 1024 + nextChar - 56320 + 65536);
            i++;
            continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
      }
      return result;
    }
    function writeFlowSequence(state, level, object) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) _result += "," + (!state.condenseFlow ? " " : "");
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = "[" + _result + "]";
    }
    function writeBlockSequence(state, level, object, compact) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]";
    }
    function writeFlowMapping(state, level, object) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (index !== 0) pairBuffer += ", ";
        if (state.condenseFlow) pairBuffer += '"';
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level, objectKey, false, false)) {
          continue;
        }
        if (state.dump.length > 1024) pairBuffer += "? ";
        pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
        if (!writeNode(state, level, objectValue, false, false)) {
          continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = "{" + _result + "}";
    }
    function writeBlockMapping(state, level, object, compact) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        throw new YAMLException("sortKeys must be a boolean or a function");
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue;
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}";
    }
    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
          state.tag = explicit ? type.tag : "?";
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      var type = _toString.call(state.dump);
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = "*ref_" + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object Array]") {
          var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
          if (block && state.dump.length !== 0) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) return false;
          throw new YAMLException("unacceptable kind of an object to dump " + type);
        }
        if (state.tag !== null && state.tag !== "?") {
          state.dump = "!<" + state.tag + "> " + state.dump;
        }
      }
      return true;
    }
    function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
      if (object !== null && typeof object === "object") {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);
            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }
    function dump(input, options2) {
      options2 = options2 || {};
      var state = new State(options2);
      if (!state.noRefs) getDuplicateReferences(input, state);
      if (writeNode(state, 0, input, true, true)) return state.dump + "\n";
      return "";
    }
    function safeDump(input, options2) {
      return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.dump = dump;
    module2.exports.safeDump = safeDump;
  }
});

// ../../node_modules/js-yaml/lib/js-yaml.js
var require_js_yaml = __commonJS({
  "../../node_modules/js-yaml/lib/js-yaml.js"(exports2, module2) {
    "use strict";
    var loader = require_loader();
    var dumper = require_dumper();
    function deprecated(name) {
      return function() {
        throw new Error("Function " + name + " is deprecated and cannot be used.");
      };
    }
    module2.exports.Type = require_type();
    module2.exports.Schema = require_schema();
    module2.exports.FAILSAFE_SCHEMA = require_failsafe();
    module2.exports.JSON_SCHEMA = require_json();
    module2.exports.CORE_SCHEMA = require_core();
    module2.exports.DEFAULT_SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_FULL_SCHEMA = require_default_full();
    module2.exports.load = loader.load;
    module2.exports.loadAll = loader.loadAll;
    module2.exports.safeLoad = loader.safeLoad;
    module2.exports.safeLoadAll = loader.safeLoadAll;
    module2.exports.dump = dumper.dump;
    module2.exports.safeDump = dumper.safeDump;
    module2.exports.YAMLException = require_exception();
    module2.exports.MINIMAL_SCHEMA = require_failsafe();
    module2.exports.SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_SCHEMA = require_default_full();
    module2.exports.scan = deprecated("scan");
    module2.exports.parse = deprecated("parse");
    module2.exports.compose = deprecated("compose");
    module2.exports.addConstructor = deprecated("addConstructor");
  }
});

// ../../node_modules/js-yaml/index.js
var require_js_yaml2 = __commonJS({
  "../../node_modules/js-yaml/index.js"(exports2, module2) {
    "use strict";
    var yaml2 = require_js_yaml();
    module2.exports = yaml2;
  }
});

// ../../node_modules/gray-matter/lib/engines.js
var require_engines = __commonJS({
  "../../node_modules/gray-matter/lib/engines.js"(exports, module) {
    "use strict";
    var yaml = require_js_yaml2();
    var engines = exports = module.exports;
    engines.yaml = {
      parse: yaml.safeLoad.bind(yaml),
      stringify: yaml.safeDump.bind(yaml)
    };
    engines.json = {
      parse: JSON.parse.bind(JSON),
      stringify: function(obj, options2) {
        const opts = Object.assign({ replacer: null, space: 2 }, options2);
        return JSON.stringify(obj, opts.replacer, opts.space);
      }
    };
    engines.javascript = {
      parse: function parse(str, options, wrap) {
        try {
          if (wrap !== false) {
            str = "(function() {\nreturn " + str.trim() + ";\n}());";
          }
          return eval(str) || {};
        } catch (err) {
          if (wrap !== false && /(unexpected|identifier)/i.test(err.message)) {
            return parse(str, options, false);
          }
          throw new SyntaxError(err);
        }
      },
      stringify: function() {
        throw new Error("stringifying JavaScript is not supported");
      }
    };
  }
});

// ../../node_modules/strip-bom-string/index.js
var require_strip_bom_string = __commonJS({
  "../../node_modules/strip-bom-string/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(str2) {
      if (typeof str2 === "string" && str2.charAt(0) === "\uFEFF") {
        return str2.slice(1);
      }
      return str2;
    };
  }
});

// ../../node_modules/gray-matter/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/gray-matter/lib/utils.js"(exports2) {
    "use strict";
    var stripBom = require_strip_bom_string();
    var typeOf = require_kind_of();
    exports2.define = function(obj, key, val) {
      Reflect.defineProperty(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: val
      });
    };
    exports2.isBuffer = function(val) {
      return typeOf(val) === "buffer";
    };
    exports2.isObject = function(val) {
      return typeOf(val) === "object";
    };
    exports2.toBuffer = function(input) {
      return typeof input === "string" ? Buffer.from(input) : input;
    };
    exports2.toString = function(input) {
      if (exports2.isBuffer(input)) return stripBom(String(input));
      if (typeof input !== "string") {
        throw new TypeError("expected input to be a string or buffer");
      }
      return stripBom(input);
    };
    exports2.arrayify = function(val) {
      return val ? Array.isArray(val) ? val : [val] : [];
    };
    exports2.startsWith = function(str2, substr, len) {
      if (typeof len !== "number") len = substr.length;
      return str2.slice(0, len) === substr;
    };
  }
});

// ../../node_modules/gray-matter/lib/defaults.js
var require_defaults = __commonJS({
  "../../node_modules/gray-matter/lib/defaults.js"(exports2, module2) {
    "use strict";
    var engines2 = require_engines();
    var utils = require_utils();
    module2.exports = function(options2) {
      const opts = Object.assign({}, options2);
      opts.delimiters = utils.arrayify(opts.delims || opts.delimiters || "---");
      if (opts.delimiters.length === 1) {
        opts.delimiters.push(opts.delimiters[0]);
      }
      opts.language = (opts.language || opts.lang || "yaml").toLowerCase();
      opts.engines = Object.assign({}, engines2, opts.parsers, opts.engines);
      return opts;
    };
  }
});

// ../../node_modules/gray-matter/lib/engine.js
var require_engine = __commonJS({
  "../../node_modules/gray-matter/lib/engine.js"(exports2, module2) {
    "use strict";
    module2.exports = function(name, options2) {
      let engine = options2.engines[name] || options2.engines[aliase(name)];
      if (typeof engine === "undefined") {
        throw new Error('gray-matter engine "' + name + '" is not registered');
      }
      if (typeof engine === "function") {
        engine = { parse: engine };
      }
      return engine;
    };
    function aliase(name) {
      switch (name.toLowerCase()) {
        case "js":
        case "javascript":
          return "javascript";
        case "coffee":
        case "coffeescript":
        case "cson":
          return "coffee";
        case "yaml":
        case "yml":
          return "yaml";
        default: {
          return name;
        }
      }
    }
  }
});

// ../../node_modules/gray-matter/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/gray-matter/lib/stringify.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(file, data, options2) {
      if (data == null && options2 == null) {
        switch (typeOf(file)) {
          case "object":
            data = file.data;
            options2 = {};
            break;
          case "string":
            return file;
          default: {
            throw new TypeError("expected file to be a string or object");
          }
        }
      }
      const str2 = file.content;
      const opts = defaults(options2);
      if (data == null) {
        if (!opts.data) return file;
        data = opts.data;
      }
      const language = file.language || opts.language;
      const engine = getEngine(language, opts);
      if (typeof engine.stringify !== "function") {
        throw new TypeError('expected "' + language + '.stringify" to be a function');
      }
      data = Object.assign({}, file.data, data);
      const open3 = opts.delimiters[0];
      const close = opts.delimiters[1];
      const matter2 = engine.stringify(data, options2).trim();
      let buf = "";
      if (matter2 !== "{}") {
        buf = newline(open3) + newline(matter2) + newline(close);
      }
      if (typeof file.excerpt === "string" && file.excerpt !== "") {
        if (str2.indexOf(file.excerpt.trim()) === -1) {
          buf += newline(file.excerpt) + newline(close);
        }
      }
      return buf + newline(str2);
    };
    function newline(str2) {
      return str2.slice(-1) !== "\n" ? str2 + "\n" : str2;
    }
  }
});

// ../../node_modules/gray-matter/lib/excerpt.js
var require_excerpt = __commonJS({
  "../../node_modules/gray-matter/lib/excerpt.js"(exports2, module2) {
    "use strict";
    var defaults = require_defaults();
    module2.exports = function(file, options2) {
      const opts = defaults(options2);
      if (file.data == null) {
        file.data = {};
      }
      if (typeof opts.excerpt === "function") {
        return opts.excerpt(file, opts);
      }
      const sep = file.data.excerpt_separator || opts.excerpt_separator;
      if (sep == null && (opts.excerpt === false || opts.excerpt == null)) {
        return file;
      }
      const delimiter2 = typeof opts.excerpt === "string" ? opts.excerpt : sep || opts.delimiters[0];
      const idx = file.content.indexOf(delimiter2);
      if (idx !== -1) {
        file.excerpt = file.content.slice(0, idx);
      }
      return file;
    };
  }
});

// ../../node_modules/gray-matter/lib/to-file.js
var require_to_file = __commonJS({
  "../../node_modules/gray-matter/lib/to-file.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var stringify = require_stringify();
    var utils = require_utils();
    module2.exports = function(file) {
      if (typeOf(file) !== "object") {
        file = { content: file };
      }
      if (typeOf(file.data) !== "object") {
        file.data = {};
      }
      if (file.contents && file.content == null) {
        file.content = file.contents;
      }
      utils.define(file, "orig", utils.toBuffer(file.content));
      utils.define(file, "language", file.language || "");
      utils.define(file, "matter", file.matter || "");
      utils.define(file, "stringify", function(data, options2) {
        if (options2 && options2.language) {
          file.language = options2.language;
        }
        return stringify(file, data, options2);
      });
      file.content = utils.toString(file.content);
      file.isEmpty = false;
      file.excerpt = "";
      return file;
    };
  }
});

// ../../node_modules/gray-matter/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/gray-matter/lib/parse.js"(exports2, module2) {
    "use strict";
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(language, str2, options2) {
      const opts = defaults(options2);
      const engine = getEngine(language, opts);
      if (typeof engine.parse !== "function") {
        throw new TypeError('expected "' + language + '.parse" to be a function');
      }
      return engine.parse(str2, opts);
    };
  }
});

// ../../node_modules/gray-matter/index.js
var require_gray_matter = __commonJS({
  "../../node_modules/gray-matter/index.js"(exports2, module2) {
    "use strict";
    var fs12 = __require("fs");
    var sections = require_section_matter();
    var defaults = require_defaults();
    var stringify = require_stringify();
    var excerpt = require_excerpt();
    var engines2 = require_engines();
    var toFile = require_to_file();
    var parse2 = require_parse();
    var utils = require_utils();
    function matter2(input, options2) {
      if (input === "") {
        return { data: {}, content: input, excerpt: "", orig: input };
      }
      let file = toFile(input);
      const cached = matter2.cache[file.content];
      if (!options2) {
        if (cached) {
          file = Object.assign({}, cached);
          file.orig = cached.orig;
          return file;
        }
        matter2.cache[file.content] = file;
      }
      return parseMatter(file, options2);
    }
    function parseMatter(file, options2) {
      const opts = defaults(options2);
      const open3 = opts.delimiters[0];
      const close = "\n" + opts.delimiters[1];
      let str2 = file.content;
      if (opts.language) {
        file.language = opts.language;
      }
      const openLen = open3.length;
      if (!utils.startsWith(str2, open3, openLen)) {
        excerpt(file, opts);
        return file;
      }
      if (str2.charAt(openLen) === open3.slice(-1)) {
        return file;
      }
      str2 = str2.slice(openLen);
      const len = str2.length;
      const language = matter2.language(str2, opts);
      if (language.name) {
        file.language = language.name;
        str2 = str2.slice(language.raw.length);
      }
      let closeIndex = str2.indexOf(close);
      if (closeIndex === -1) {
        closeIndex = len;
      }
      file.matter = str2.slice(0, closeIndex);
      const block = file.matter.replace(/^\s*#[^\n]+/gm, "").trim();
      if (block === "") {
        file.isEmpty = true;
        file.empty = file.content;
        file.data = {};
      } else {
        file.data = parse2(file.language, file.matter, opts);
      }
      if (closeIndex === len) {
        file.content = "";
      } else {
        file.content = str2.slice(closeIndex + close.length);
        if (file.content[0] === "\r") {
          file.content = file.content.slice(1);
        }
        if (file.content[0] === "\n") {
          file.content = file.content.slice(1);
        }
      }
      excerpt(file, opts);
      if (opts.sections === true || typeof opts.section === "function") {
        sections(file, opts.section);
      }
      return file;
    }
    matter2.engines = engines2;
    matter2.stringify = function(file, data, options2) {
      if (typeof file === "string") file = matter2(file, options2);
      return stringify(file, data, options2);
    };
    matter2.read = function(filepath, options2) {
      const str2 = fs12.readFileSync(filepath, "utf8");
      const file = matter2(str2, options2);
      file.path = filepath;
      return file;
    };
    matter2.test = function(str2, options2) {
      return utils.startsWith(str2, defaults(options2).delimiters[0]);
    };
    matter2.language = function(str2, options2) {
      const opts = defaults(options2);
      const open3 = opts.delimiters[0];
      if (matter2.test(str2)) {
        str2 = str2.slice(open3.length);
      }
      const language = str2.slice(0, str2.search(/\r?\n/));
      return {
        raw: language,
        name: language ? language.trim() : ""
      };
    };
    matter2.cache = {};
    matter2.clearCache = function() {
      matter2.cache = {};
    };
    module2.exports = matter2;
  }
});

// ../../node_modules/axi-sdk-js/dist/cli.js
import { basename as basename2 } from "node:path";

// ../../node_modules/axi-sdk-js/dist/errors.js
var AxiError = class extends Error {
  code;
  suggestions;
  constructor(message, code, suggestions = []) {
    super(message);
    this.code = code;
    this.suggestions = suggestions;
    this.name = "AxiError";
  }
};
function exitCodeForError(error) {
  if (error instanceof AxiError && error.code === "VALIDATION_ERROR") {
    return 2;
  }
  return 1;
}

// ../../node_modules/axi-sdk-js/dist/output.js
import { homedir } from "node:os";

// ../../node_modules/@toon-format/toon/dist/index.mjs
var NULL_LITERAL = "null";
var DELIMITERS = {
  comma: ",",
  tab: "	",
  pipe: "|"
};
var DEFAULT_DELIMITER = DELIMITERS.comma;
function escapeString(value) {
  return value.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(/\t/g, `\\t`).replace(/[\u0000-\u001F]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function isBooleanOrNullLiteral(token) {
  return token === "true" || token === "false" || token === "null";
}
function normalizeValue(value) {
  if (value === null) return null;
  if (typeof value === "object" && value !== null && "toJSON" in value && typeof value.toJSON === "function") {
    const next = value.toJSON();
    if (next !== value) return normalizeValue(next);
  }
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (Object.is(value, -0)) return 0;
    if (!Number.isFinite(value)) return null;
    return value;
  }
  if (typeof value === "bigint") {
    if (value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) return Number(value);
    return value.toString();
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value instanceof Set) return Array.from(value).map(normalizeValue);
  if (value instanceof Map) return Object.fromEntries(Array.from(value, ([k, v]) => [String(k), normalizeValue(v)]));
  if (isPlainObject(value)) {
    const encodedValues = {};
    for (const key in value) if (Object.hasOwn(value, key)) encodedValues[key] = normalizeValue(value[key]);
    return encodedValues;
  }
  return null;
}
function isJsonPrimitive(value) {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function isJsonArray(value) {
  return Array.isArray(value);
}
function isJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isEmptyObject(value) {
  return Object.keys(value).length === 0;
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function isArrayOfPrimitives(value) {
  return value.length === 0 || value.every((item) => isJsonPrimitive(item));
}
function isArrayOfArrays(value) {
  return value.length === 0 || value.every((item) => isJsonArray(item));
}
function isArrayOfObjects(value) {
  return value.length === 0 || value.every((item) => isJsonObject(item));
}
var NUMERIC_LIKE_PATTERN = /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i;
var LEADING_ZERO_PATTERN = /^0\d+$/;
function isValidUnquotedKey(key) {
  return /^[A-Z_][\w.]*$/i.test(key);
}
function isIdentifierSegment(key) {
  return /^[A-Z_]\w*$/i.test(key);
}
function isSafeUnquoted(value, delimiter2 = DEFAULT_DELIMITER) {
  if (!value) return false;
  if (value !== value.trim()) return false;
  if (isBooleanOrNullLiteral(value) || isNumericLike(value)) return false;
  if (value.includes(":")) return false;
  if (value.includes('"') || value.includes("\\")) return false;
  if (/[[\]{}]/.test(value)) return false;
  if (/[\u0000-\u001F]/.test(value)) return false;
  if (value.includes(delimiter2)) return false;
  if (value.startsWith("-")) return false;
  return true;
}
function isNumericLike(value) {
  return NUMERIC_LIKE_PATTERN.test(value) || LEADING_ZERO_PATTERN.test(value);
}
var QUOTED_KEY_MARKER = Symbol("quotedKey");
function tryFoldKeyChain(key, value, siblings, options2, rootLiteralKeys, pathPrefix, flattenDepth) {
  if (options2.keyFolding !== "safe") return;
  if (!isJsonObject(value)) return;
  const { segments, tail, leafValue } = collectSingleKeyChain(key, value, flattenDepth ?? options2.flattenDepth);
  if (segments.length < 2) return;
  if (!segments.every((seg) => isIdentifierSegment(seg))) return;
  const foldedKey = buildFoldedKey(segments);
  const absolutePath = pathPrefix ? `${pathPrefix}.${foldedKey}` : foldedKey;
  if (siblings.includes(foldedKey)) return;
  if (rootLiteralKeys && rootLiteralKeys.has(absolutePath)) return;
  return {
    foldedKey,
    remainder: tail,
    leafValue,
    segmentCount: segments.length
  };
}
function collectSingleKeyChain(startKey, startValue, maxDepth) {
  const segments = [startKey];
  let currentValue = startValue;
  while (segments.length < maxDepth) {
    if (!isJsonObject(currentValue)) break;
    const keys = Object.keys(currentValue);
    if (keys.length !== 1) break;
    const nextKey = keys[0];
    const nextValue = currentValue[nextKey];
    segments.push(nextKey);
    currentValue = nextValue;
  }
  if (!isJsonObject(currentValue) || isEmptyObject(currentValue)) return {
    segments,
    tail: void 0,
    leafValue: currentValue
  };
  return {
    segments,
    tail: currentValue,
    leafValue: currentValue
  };
}
function buildFoldedKey(segments) {
  return segments.join(".");
}
function encodePrimitive(value, delimiter2) {
  if (value === null) return NULL_LITERAL;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  return encodeStringLiteral(value, delimiter2);
}
function encodeStringLiteral(value, delimiter2 = DEFAULT_DELIMITER) {
  if (isSafeUnquoted(value, delimiter2)) return value;
  return `"${escapeString(value)}"`;
}
function encodeKey(key) {
  if (isValidUnquotedKey(key)) return key;
  return `"${escapeString(key)}"`;
}
function encodeAndJoinPrimitives(values, delimiter2 = DEFAULT_DELIMITER) {
  return values.map((v) => encodePrimitive(v, delimiter2)).join(delimiter2);
}
function formatHeader(length, options2) {
  const key = options2?.key;
  const fields = options2?.fields;
  const delimiter2 = options2?.delimiter ?? ",";
  let header = "";
  if (key != null) header += encodeKey(key);
  header += `[${length}${delimiter2 !== DEFAULT_DELIMITER ? delimiter2 : ""}]`;
  if (fields) {
    const quotedFields = fields.map((f) => encodeKey(f));
    header += `{${quotedFields.join(delimiter2)}}`;
  }
  header += ":";
  return header;
}
function* encodeJsonValue(value, options2, depth2) {
  if (isJsonPrimitive(value)) {
    const encodedPrimitive = encodePrimitive(value, options2.delimiter);
    if (encodedPrimitive !== "") yield encodedPrimitive;
    return;
  }
  if (isJsonArray(value)) yield* encodeArrayLines(void 0, value, depth2, options2);
  else if (isJsonObject(value)) yield* encodeObjectLines(value, depth2, options2);
}
function* encodeObjectLines(value, depth2, options2, rootLiteralKeys, pathPrefix, remainingDepth) {
  const keys = Object.keys(value);
  if (depth2 === 0 && !rootLiteralKeys) rootLiteralKeys = new Set(keys.filter((k) => k.includes(".")));
  const effectiveFlattenDepth = remainingDepth ?? options2.flattenDepth;
  for (const [key, val] of Object.entries(value)) yield* encodeKeyValuePairLines(key, val, depth2, options2, keys, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
}
function* encodeKeyValuePairLines(key, value, depth2, options2, siblings, rootLiteralKeys, pathPrefix, flattenDepth) {
  const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
  const effectiveFlattenDepth = flattenDepth ?? options2.flattenDepth;
  if (options2.keyFolding === "safe" && siblings) {
    const foldResult = tryFoldKeyChain(key, value, siblings, options2, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
    if (foldResult) {
      const { foldedKey, remainder, leafValue, segmentCount } = foldResult;
      const encodedFoldedKey = encodeKey(foldedKey);
      if (remainder === void 0) {
        if (isJsonPrimitive(leafValue)) {
          yield indentedLine(depth2, `${encodedFoldedKey}: ${encodePrimitive(leafValue, options2.delimiter)}`, options2.indent);
          return;
        } else if (isJsonArray(leafValue)) {
          yield* encodeArrayLines(foldedKey, leafValue, depth2, options2);
          return;
        } else if (isJsonObject(leafValue) && isEmptyObject(leafValue)) {
          yield indentedLine(depth2, `${encodedFoldedKey}:`, options2.indent);
          return;
        }
      }
      if (isJsonObject(remainder)) {
        yield indentedLine(depth2, `${encodedFoldedKey}:`, options2.indent);
        const remainingDepth = effectiveFlattenDepth - segmentCount;
        const foldedPath = pathPrefix ? `${pathPrefix}.${foldedKey}` : foldedKey;
        yield* encodeObjectLines(remainder, depth2 + 1, options2, rootLiteralKeys, foldedPath, remainingDepth);
        return;
      }
    }
  }
  const encodedKey = encodeKey(key);
  if (isJsonPrimitive(value)) yield indentedLine(depth2, `${encodedKey}: ${encodePrimitive(value, options2.delimiter)}`, options2.indent);
  else if (isJsonArray(value)) yield* encodeArrayLines(key, value, depth2, options2);
  else if (isJsonObject(value)) {
    yield indentedLine(depth2, `${encodedKey}:`, options2.indent);
    if (!isEmptyObject(value)) yield* encodeObjectLines(value, depth2 + 1, options2, rootLiteralKeys, currentPath, effectiveFlattenDepth);
  }
}
function* encodeArrayLines(key, value, depth2, options2) {
  if (value.length === 0) {
    yield indentedLine(depth2, key != null ? `${encodeKey(key)}: []` : "[]", options2.indent);
    return;
  }
  if (isArrayOfPrimitives(value)) {
    yield indentedLine(depth2, encodeInlineArrayLine(value, options2.delimiter, key), options2.indent);
    return;
  }
  if (isArrayOfArrays(value)) {
    if (value.every((arr) => isArrayOfPrimitives(arr))) {
      yield* encodeArrayOfArraysAsListItemsLines(key, value, depth2, options2);
      return;
    }
  }
  if (isArrayOfObjects(value)) {
    const header = extractTabularHeader(value);
    if (header) yield* encodeArrayOfObjectsAsTabularLines(key, value, header, depth2, options2);
    else yield* encodeMixedArrayAsListItemsLines(key, value, depth2, options2);
    return;
  }
  yield* encodeMixedArrayAsListItemsLines(key, value, depth2, options2);
}
function* encodeArrayOfArraysAsListItemsLines(prefix, values, depth2, options2) {
  yield indentedLine(depth2, formatHeader(values.length, {
    key: prefix,
    delimiter: options2.delimiter
  }), options2.indent);
  for (const arr of values) if (isArrayOfPrimitives(arr)) {
    const arrayLine = encodeInlineArrayLine(arr, options2.delimiter);
    yield indentedListItem(depth2 + 1, arrayLine, options2.indent);
  }
}
function encodeInlineArrayLine(values, delimiter2, prefix) {
  const header = formatHeader(values.length, {
    key: prefix,
    delimiter: delimiter2
  });
  const joinedValue = encodeAndJoinPrimitives(values, delimiter2);
  if (values.length === 0) return header;
  return `${header} ${joinedValue}`;
}
function* encodeArrayOfObjectsAsTabularLines(prefix, rows, header, depth2, options2) {
  yield indentedLine(depth2, formatHeader(rows.length, {
    key: prefix,
    fields: header,
    delimiter: options2.delimiter
  }), options2.indent);
  yield* writeTabularRowsLines(rows, header, depth2 + 1, options2);
}
function extractTabularHeader(rows) {
  if (rows.length === 0) return;
  const firstRow = rows[0];
  const firstKeys = Object.keys(firstRow);
  if (firstKeys.length === 0) return;
  if (isTabularArray(rows, firstKeys)) return firstKeys;
}
function isTabularArray(rows, header) {
  for (const row2 of rows) {
    if (Object.keys(row2).length !== header.length) return false;
    for (const key of header) {
      if (!(key in row2)) return false;
      if (!isJsonPrimitive(row2[key])) return false;
    }
  }
  return true;
}
function* writeTabularRowsLines(rows, header, depth2, options2) {
  for (const row2 of rows) yield indentedLine(depth2, encodeAndJoinPrimitives(header.map((key) => row2[key]), options2.delimiter), options2.indent);
}
function* encodeMixedArrayAsListItemsLines(prefix, items, depth2, options2) {
  yield indentedLine(depth2, formatHeader(items.length, {
    key: prefix,
    delimiter: options2.delimiter
  }), options2.indent);
  for (const item of items) yield* encodeListItemValueLines(item, depth2 + 1, options2);
}
function* encodeObjectAsListItemLines(obj, depth2, options2) {
  if (isEmptyObject(obj)) {
    yield indentedLine(depth2, "-", options2.indent);
    return;
  }
  const entries = Object.entries(obj);
  const [firstKey, firstValue] = entries[0];
  const restEntries = entries.slice(1);
  if (isJsonArray(firstValue) && isArrayOfObjects(firstValue)) {
    const header = extractTabularHeader(firstValue);
    if (header) {
      yield indentedListItem(depth2, formatHeader(firstValue.length, {
        key: firstKey,
        fields: header,
        delimiter: options2.delimiter
      }), options2.indent);
      yield* writeTabularRowsLines(firstValue, header, depth2 + 2, options2);
      if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth2 + 1, options2);
      return;
    }
  }
  const encodedKey = encodeKey(firstKey);
  if (isJsonPrimitive(firstValue)) yield indentedListItem(depth2, `${encodedKey}: ${encodePrimitive(firstValue, options2.delimiter)}`, options2.indent);
  else if (isJsonArray(firstValue)) if (firstValue.length === 0) yield indentedListItem(depth2, `${encodedKey}: []`, options2.indent);
  else if (isArrayOfPrimitives(firstValue)) yield indentedListItem(depth2, `${encodedKey}${encodeInlineArrayLine(firstValue, options2.delimiter)}`, options2.indent);
  else {
    yield indentedListItem(depth2, `${encodedKey}${formatHeader(firstValue.length, { delimiter: options2.delimiter })}`, options2.indent);
    for (const item of firstValue) yield* encodeListItemValueLines(item, depth2 + 2, options2);
  }
  else if (isJsonObject(firstValue)) {
    yield indentedListItem(depth2, `${encodedKey}:`, options2.indent);
    if (!isEmptyObject(firstValue)) yield* encodeObjectLines(firstValue, depth2 + 2, options2);
  }
  if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth2 + 1, options2);
}
function* encodeListItemValueLines(value, depth2, options2) {
  if (isJsonPrimitive(value)) yield indentedListItem(depth2, encodePrimitive(value, options2.delimiter), options2.indent);
  else if (isJsonArray(value)) if (isArrayOfPrimitives(value)) yield indentedListItem(depth2, encodeInlineArrayLine(value, options2.delimiter), options2.indent);
  else {
    yield indentedListItem(depth2, formatHeader(value.length, { delimiter: options2.delimiter }), options2.indent);
    for (const item of value) yield* encodeListItemValueLines(item, depth2 + 1, options2);
  }
  else if (isJsonObject(value)) yield* encodeObjectAsListItemLines(value, depth2, options2);
}
function indentedLine(depth2, content, indentSize) {
  return " ".repeat(indentSize * depth2) + content;
}
function indentedListItem(depth2, content, indentSize) {
  return indentedLine(depth2, "- " + content, indentSize);
}
function applyReplacer(root, replacer) {
  const replacedRoot = replacer("", root, []);
  if (replacedRoot === void 0) return transformChildren(root, replacer, []);
  return transformChildren(normalizeValue(replacedRoot), replacer, []);
}
function transformChildren(value, replacer, path23) {
  if (isJsonObject(value)) return transformObject(value, replacer, path23);
  if (isJsonArray(value)) return transformArray(value, replacer, path23);
  return value;
}
function transformObject(obj, replacer, path23) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const childPath = [...path23, key];
    const replacedValue = replacer(key, value, childPath);
    if (replacedValue === void 0) continue;
    result[key] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
  }
  return result;
}
function transformArray(arr, replacer, path23) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const childPath = [...path23, i];
    const replacedValue = replacer(String(i), value, childPath);
    if (replacedValue === void 0) continue;
    const normalizedValue = normalizeValue(replacedValue);
    result.push(transformChildren(normalizedValue, replacer, childPath));
  }
  return result;
}
function encode(input, options2) {
  return Array.from(encodeLines(input, options2)).join("\n");
}
function encodeLines(input, options2) {
  const normalizedValue = normalizeValue(input);
  const resolvedOptions = resolveOptions(options2);
  return encodeJsonValue(resolvedOptions.replacer ? applyReplacer(normalizedValue, resolvedOptions.replacer) : normalizedValue, resolvedOptions, 0);
}
function resolveOptions(options2) {
  return {
    indent: options2?.indent ?? 2,
    delimiter: options2?.delimiter ?? DEFAULT_DELIMITER,
    keyFolding: options2?.keyFolding ?? "off",
    flattenDepth: options2?.flattenDepth ?? Number.POSITIVE_INFINITY,
    replacer: options2?.replacer
  };
}

// ../../node_modules/axi-sdk-js/dist/output.js
function collapseHomeDirectory(path23, homeDir = homedir()) {
  if (!path23.startsWith(homeDir)) {
    return path23;
  }
  return `~${path23.slice(homeDir.length)}`;
}
function homeHeaderOutput(options2) {
  return {
    bin: collapseHomeDirectory(options2.execPath ?? process.argv[1] ?? "", options2.homeDir),
    description: options2.description
  };
}
function errorOutput(message, code, suggestions = []) {
  const output = {
    error: message,
    code
  };
  if (suggestions.length > 0) {
    output.help = suggestions;
  }
  return output;
}
function renderOutput(output) {
  if (typeof output === "string") {
    return output;
  }
  return encode(output);
}
function renderError(message, code, suggestions = []) {
  return renderOutput(errorOutput(message, code, suggestions));
}

// ../../node_modules/axi-sdk-js/dist/update.js
import { spawn } from "node:child_process";
import { execFile } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { promisify } from "node:util";
var execFileAsync = promisify(execFile);
var REGISTRY_BASE = "https://registry.npmjs.org";
var REGISTRY_FETCH_TIMEOUT_MS = 2e4;
function parseSemver(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?(?:\+[0-9A-Za-z-.]+)?$/.exec(version.trim());
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split(".") : []
  };
}
function comparePrerelease(a, b) {
  if (a.length === 0 && b.length === 0)
    return 0;
  if (a.length === 0)
    return 1;
  if (b.length === 0)
    return -1;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if (index >= a.length)
      return -1;
    if (index >= b.length)
      return 1;
    const left = a[index];
    const right = b[index];
    const leftNumeric = /^\d+$/.test(left);
    const rightNumeric = /^\d+$/.test(right);
    if (leftNumeric && rightNumeric) {
      const delta = Number(left) - Number(right);
      if (delta !== 0)
        return delta < 0 ? -1 : 1;
    } else if (leftNumeric) {
      return -1;
    } else if (rightNumeric) {
      return 1;
    } else if (left !== right) {
      return left < right ? -1 : 1;
    }
  }
  return 0;
}
function compareSemver(a, b) {
  const parsedA = parseSemver(a);
  const parsedB = parseSemver(b);
  if (!parsedA || !parsedB) {
    if (a === b)
      return 0;
    return a < b ? -1 : 1;
  }
  if (parsedA.major !== parsedB.major) {
    return parsedA.major < parsedB.major ? -1 : 1;
  }
  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor < parsedB.minor ? -1 : 1;
  }
  if (parsedA.patch !== parsedB.patch) {
    return parsedA.patch < parsedB.patch ? -1 : 1;
  }
  return comparePrerelease(parsedA.prerelease, parsedB.prerelease);
}
function isUpdateAvailable(current, latest) {
  return compareSemver(latest, current) > 0;
}
var nodeFs = {
  existsSync,
  readFileSync: (path23, encoding) => readFileSync(path23, encoding)
};
function readNearestPackageJson(startPath, fs12 = nodeFs) {
  let dir = dirname(startPath);
  let previous = "";
  while (dir !== previous) {
    const packageJsonPath = join(dir, "package.json");
    if (fs12.existsSync(packageJsonPath)) {
      try {
        const parsed = JSON.parse(fs12.readFileSync(packageJsonPath, "utf-8"));
        if (typeof parsed.name === "string" && parsed.name.length > 0) {
          return {
            packageName: parsed.name,
            version: typeof parsed.version === "string" ? parsed.version : void 0,
            packageJsonPath
          };
        }
      } catch {
      }
    }
    previous = dir;
    dir = dirname(dir);
  }
  return {};
}
function detectInstallMethod(options2) {
  const env = options2.env ?? process.env;
  const path23 = options2.entry.replaceAll("\\", "/");
  if (path23.includes("/_npx/") || /\/dlx-[^/]+\//.test(path23) || path23.includes("/pnpm/dlx/") || path23.includes("/bun/install/cache/")) {
    return { kind: "npx" };
  }
  const homebrewFormula = homebrewFormulaFromPath(path23, env);
  if (homebrewFormula) {
    return { kind: "homebrew", formula: homebrewFormula };
  }
  const pnpmHome = normalizePathRoot(env.PNPM_HOME);
  if (isPathInsideRoot(path23, pnpmHome) || isKnownPnpmGlobalStore(path23, env)) {
    return { kind: "pnpm-global" };
  }
  if (isKnownNpmGlobalInstall(path23, env)) {
    return { kind: "npm-global" };
  }
  return { kind: "unknown" };
}
function normalizePathRoot(path23) {
  const normalized = path23?.replaceAll("\\", "/").replace(/\/+$/, "");
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function isPathInsideRoot(path23, root) {
  return root !== void 0 && (path23 === root || path23.startsWith(`${root}/`));
}
function homebrewFormulaFromPath(path23, env) {
  for (const root of homebrewCellarRoots(env)) {
    if (!isPathInsideRoot(path23, root)) {
      continue;
    }
    const relative = path23.slice(root.length).replace(/^\/+/, "");
    const formula = relative.split("/")[0];
    if (formula) {
      return formula;
    }
  }
  return null;
}
function homebrewCellarRoots(env) {
  const roots = [];
  const explicitCellar = normalizePathRoot(env.HOMEBREW_CELLAR);
  if (explicitCellar) {
    roots.push(explicitCellar);
  }
  const prefixes = [
    env.HOMEBREW_PREFIX,
    "/opt/homebrew",
    "/usr/local",
    "/home/linuxbrew/.linuxbrew"
  ];
  for (const prefix of prefixes) {
    const normalized = normalizePathRoot(prefix);
    if (normalized) {
      roots.push(`${normalized}/Cellar`);
    }
  }
  return [...new Set(roots)];
}
function isKnownPnpmGlobalStore(path23, env) {
  return pnpmGlobalStoreRoots(env).some((root) => {
    if (!isPathInsideRoot(path23, root)) {
      return false;
    }
    const relative = path23.slice(root.length).replace(/^\/+/, "");
    return /^\d+\/\.pnpm\//.test(relative);
  });
}
function pnpmGlobalStoreRoots(env) {
  const roots = [];
  const home2 = normalizePathRoot(env.HOME ?? env.USERPROFILE);
  if (home2) {
    roots.push(`${home2}/Library/pnpm/global`);
    roots.push(`${home2}/.local/share/pnpm/global`);
    roots.push(`${home2}/AppData/Local/pnpm/global`);
  }
  const localAppData = normalizePathRoot(env.LOCALAPPDATA);
  if (localAppData) {
    roots.push(`${localAppData}/pnpm/global`);
  }
  return [...new Set(roots)];
}
function isKnownNpmGlobalInstall(path23, env) {
  return npmGlobalNodeModulesRoots(env).some((root) => isPathInsideRoot(path23, root)) || isKnownVersionManagerNpmGlobal(path23, env);
}
function npmGlobalNodeModulesRoots(env) {
  const roots = [
    "/usr/local/lib/node_modules",
    "/usr/lib/node_modules",
    "/opt/homebrew/lib/node_modules",
    "/opt/local/lib/node_modules"
  ];
  const prefixes = [env.npm_config_prefix, env.NPM_CONFIG_PREFIX];
  for (const prefix of prefixes) {
    const normalized = normalizePathRoot(prefix);
    if (normalized) {
      roots.push(`${normalized}/lib/node_modules`, `${normalized}/node_modules`);
    }
  }
  const appData = normalizePathRoot(env.APPDATA);
  if (appData) {
    roots.push(`${appData}/npm/node_modules`);
  }
  const home2 = normalizePathRoot(env.HOME ?? env.USERPROFILE);
  if (home2) {
    roots.push(`${home2}/.npm-global/lib/node_modules`, `${home2}/.npm-packages/lib/node_modules`);
  }
  return [...new Set(roots)];
}
function isKnownVersionManagerNpmGlobal(path23, env) {
  return versionManagerNodeRoots(env).some((root) => isPathInsideRoot(path23, root) && path23.includes("/lib/node_modules/"));
}
function versionManagerNodeRoots(env) {
  const roots = [];
  const home2 = normalizePathRoot(env.HOME ?? env.USERPROFILE);
  if (home2) {
    roots.push(`${home2}/.nvm/versions/node`, `${home2}/.local/share/fnm/node-versions`, `${home2}/.asdf/installs/nodejs`, `${home2}/.nodenv/versions`, `${home2}/.local/share/mise/installs/node`, `${home2}/.volta/tools/image/node`);
  }
  const nvmDir = normalizePathRoot(env.NVM_DIR);
  if (nvmDir) {
    roots.push(`${nvmDir}/versions/node`);
  }
  const fnmDir = normalizePathRoot(env.FNM_DIR);
  if (fnmDir) {
    roots.push(`${fnmDir}/node-versions`);
  }
  return [...new Set(roots)];
}
function planUpgrade(method, packageName) {
  switch (method.kind) {
    case "npm-global":
      return {
        method: method.kind,
        command: `npm install -g ${packageName}@latest`,
        argv: ["npm", "install", "-g", `${packageName}@latest`]
      };
    case "pnpm-global":
      return {
        method: method.kind,
        command: `pnpm add -g ${packageName}@latest`,
        argv: ["pnpm", "add", "-g", `${packageName}@latest`]
      };
    case "homebrew":
      if (method.formula) {
        return {
          method: method.kind,
          command: `brew upgrade ${method.formula}`,
          argv: ["brew", "upgrade", method.formula]
        };
      }
      return {
        method: method.kind,
        command: `brew upgrade ${packageName}`,
        argv: null,
        note: "Could not determine the Homebrew formula automatically"
      };
    case "npx":
      return {
        method: method.kind,
        command: `npx -y ${packageName}@latest`,
        argv: null,
        note: "npx always runs the latest published version, so no install is needed"
      };
    case "unknown":
      return {
        method: method.kind,
        command: `npm install -g ${packageName}@latest`,
        argv: null,
        note: "Could not determine how this tool was installed"
      };
  }
}
function packageManagerExecutable(command, platform) {
  if (platform === "win32" && (command === "npm" || command === "pnpm" || command === "npx")) {
    return `${command}.cmd`;
  }
  return command;
}
function shouldUseWindowsPackageManagerShell(command, platform) {
  return platform === "win32" && (command === "npm" || command === "pnpm" || command === "npx");
}
async function npmViewVersion(packageName, platform = process.platform) {
  try {
    const command = packageManagerExecutable("npm", platform);
    const { stdout } = await execFileAsync(command, ["view", packageName, "version"], {
      timeout: 2e4,
      shell: shouldUseWindowsPackageManagerShell("npm", platform)
    });
    const version = stdout.trim();
    return version.length > 0 ? version : null;
  } catch {
    return null;
  }
}
function registryPath(packageName) {
  return packageName.startsWith("@") ? packageName.replace("/", "%2f") : packageName;
}
function notPublishedError(packageName) {
  return new AxiError(`${packageName} is not published to the npm registry`, "UPDATE_ERROR", [
    "Confirm the package name is correct",
    `Run \`npm view ${packageName} version\` to check manually`
  ]);
}
var RegistryNotFoundError = class extends Error {
};
async function withRegistryTimeout(timeoutMs, operation) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Registry fetch timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    timer.unref?.();
  });
  try {
    return await Promise.race([operation(controller.signal), timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
async function fetchRegistryVersion(fetchImpl, packageName, timeoutMs) {
  return withRegistryTimeout(timeoutMs, async (signal) => {
    const response = await fetchImpl(`${REGISTRY_BASE}/${registryPath(packageName)}/latest`, { headers: { accept: "application/json" }, signal });
    if (response.ok) {
      const data = await response.json();
      if (typeof data.version === "string" && data.version.length > 0) {
        return data.version;
      }
    } else if (response.status === 404) {
      throw new RegistryNotFoundError();
    }
    return null;
  });
}
async function fetchLatestVersion(packageName, options2 = {}) {
  const fetchImpl = options2.fetchImpl === void 0 ? globalThis.fetch : options2.fetchImpl ?? void 0;
  let registryNotFound = false;
  if (typeof fetchImpl === "function") {
    try {
      const version = await fetchRegistryVersion(fetchImpl, packageName, options2.fetchTimeoutMs ?? REGISTRY_FETCH_TIMEOUT_MS);
      if (version) {
        return version;
      }
    } catch (error) {
      if (error instanceof RegistryNotFoundError) {
        registryNotFound = true;
      } else if (error instanceof AxiError) {
        throw error;
      }
    }
  }
  const viewed = await (options2.npmView ?? ((name) => npmViewVersion(name, options2.platform)))(packageName);
  if (viewed) {
    return viewed;
  }
  if (registryNotFound) {
    throw notPublishedError(packageName);
  }
  throw new AxiError(`Could not reach the npm registry to check for updates to ${packageName}`, "UPDATE_ERROR", [
    "Check your network connection and try again",
    `Run \`npm view ${packageName} version\` to check manually`
  ]);
}
async function defaultRunInstall(plan, stdout, context) {
  const argv = plan.argv;
  if (!argv || argv.length === 0) {
    return { ok: false, message: "No runnable upgrade command" };
  }
  stdout.write(`running: ${plan.command}
`);
  return new Promise((resolve2) => {
    const [command, ...args] = argv;
    const child = spawn(packageManagerExecutable(command, context.platform), args, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: shouldUseWindowsPackageManagerShell(command, context.platform)
    });
    child.stdout?.on("data", (chunk) => {
      process.stderr.write(chunk);
    });
    child.stderr?.on("data", (chunk) => {
      process.stderr.write(chunk);
    });
    child.on("error", (error) => {
      resolve2({ ok: false, message: error.message });
    });
    child.on("close", (code) => {
      resolve2(code === 0 ? { ok: true } : { ok: false, message: `${plan.command} exited with code ${code}` });
    });
  });
}
function binNameFromArgv(invokedAs) {
  return basename(invokedAs ?? "tool") || "tool";
}
function resolveEntry(invokedAs, realpath) {
  if (!invokedAs) {
    return void 0;
  }
  try {
    return realpath(invokedAs);
  } catch {
    return invokedAs;
  }
}
function resolveInstalledVersion(invokedAs, realpath, fs12) {
  const installedEntry = resolveEntry(invokedAs, realpath);
  return installedEntry ? readNearestPackageJson(installedEntry, fs12).version : void 0;
}
function homebrewUpgradeOutput(options2) {
  const update = {
    package: options2.packageName,
    previous: options2.current,
    latest: options2.latest
  };
  if (options2.installedVersion) {
    update.installed = options2.installedVersion;
    update.available = isUpdateAvailable(options2.installedVersion, options2.latest);
  } else {
    update.action = "upgrade-command-ran";
    update.result = "installed version unknown";
  }
  return {
    update,
    command: options2.command
  };
}
function parseUpdateArgs(args, binName) {
  if (args.length === 0) {
    return "install";
  }
  if (args.length === 1 && (args[0] === "--check" || args[0] === "--dry-run")) {
    return "check";
  }
  const unknown = args.find((arg) => arg !== "--check" && arg !== "--dry-run");
  throw new AxiError(unknown ? `Unknown update option: ${unknown}` : "Invalid update arguments", "VALIDATION_ERROR", [
    `Run \`${binName} update --help\``,
    `Use \`${binName} update --check\` to check without installing`
  ]);
}
async function runUpdate(options2) {
  const invokedAs = options2.invokedAs ?? process.argv[1];
  const binName = binNameFromArgv(invokedAs);
  const mode = parseUpdateArgs(options2.args, binName);
  const platform = options2.platform ?? process.platform;
  const realpath = options2.realpath ?? ((path23) => realpathSync(path23));
  const entry = resolveEntry(invokedAs, realpath);
  const fs12 = options2.fs ?? nodeFs;
  const fromPackageJson = entry ? readNearestPackageJson(entry, fs12) : {};
  const packageName = options2.packageName ?? fromPackageJson.packageName;
  const current = options2.version ?? fromPackageJson.version;
  if (!packageName) {
    throw new AxiError("Could not determine the package name to update", "UPDATE_ERROR", [
      "Reinstall the tool from npm so its package.json is available",
      "Tool authors can pass `packageName` to runAxiCli()"
    ]);
  }
  if (!current) {
    throw new AxiError(`Could not determine the current version of ${packageName}`, "UPDATE_ERROR", [
      "Reinstall the tool from npm so its version is available",
      "Tool authors can pass `version` to runAxiCli()"
    ]);
  }
  const fetchLatest = options2.fetchLatest ?? ((name) => fetchLatestVersion(name, { platform }));
  const latest = await fetchLatest(packageName);
  const available = isUpdateAvailable(current, latest);
  if (mode === "check") {
    const output = {
      update: { package: packageName, current, latest, available }
    };
    if (available) {
      output.help = [`Run \`${binName} update\` to upgrade`];
    }
    return output;
  }
  if (!available) {
    return {
      update: `${packageName} is already on the latest version (${current})`
    };
  }
  const method = entry ? detectInstallMethod({ entry, env: options2.env }) : { kind: "unknown" };
  const plan = planUpgrade(method, packageName);
  if (!plan.argv) {
    const help = method.kind === "npx" ? `Re-run with \`${plan.command}\` to use the latest version` : `Run \`${plan.command}\` to upgrade`;
    return {
      update: {
        package: packageName,
        current,
        latest,
        available: true,
        action: "manual",
        ...plan.note ? { reason: plan.note } : {},
        run: plan.command
      },
      help: [help]
    };
  }
  const runInstall = options2.runInstall ?? defaultRunInstall;
  const result = await runInstall(plan, options2.stdout, { platform });
  if (!result.ok) {
    throw new AxiError(`Failed to upgrade ${packageName}`, "UPDATE_ERROR", [
      `Run \`${plan.command}\` manually`,
      ...result.message ? [result.message] : []
    ]);
  }
  if (method.kind === "homebrew") {
    return homebrewUpgradeOutput({
      packageName,
      current,
      latest,
      installedVersion: resolveInstalledVersion(invokedAs, realpath, fs12),
      command: plan.command
    });
  }
  return {
    update: `${packageName} upgraded ${current} -> ${latest}`,
    command: plan.command
  };
}

// ../../node_modules/axi-sdk-js/dist/cli.js
function defaultFormatError(error) {
  if (error instanceof AxiError) {
    return {
      output: `${renderError(error.message, error.code, error.suggestions)}
`,
      exitCode: exitCodeForError(error)
    };
  }
  const message = error instanceof Error ? error.message : String(error);
  return {
    output: `${renderError(message, "UNKNOWN")}
`,
    exitCode: 1
  };
}
function defaultUnknownCommand(command) {
  return `${renderError(`Unknown command: ${command}`, "VALIDATION_ERROR", [
    "Run `--help` to see available commands"
  ])}
`;
}
async function runAxiCli(options2) {
  options2.initialize?.();
  const stdout = options2.stdout ?? process.stdout;
  const argv = options2.argv ?? process.argv.slice(2);
  if (argv.length === 1 && argv[0] === "--help") {
    stdout.write(options2.topLevelHelp);
    if (!options2.commands.update) {
      if (options2.topLevelHelp.length > 0 && !options2.topLevelHelp.endsWith("\n")) {
        stdout.write("\n");
      }
      stdout.write(builtinCommandsHelp());
    }
    return;
  }
  if (argv.length === 1 && isVersionFlag(argv[0])) {
    if (!options2.version) {
      stdout.write(`${renderError("Version is not configured for this tool", "VALIDATION_ERROR")}
`);
      process.exitCode = 2;
      return;
    }
    stdout.write(`${options2.version}
`);
    return;
  }
  const command = argv[0];
  if (!command) {
    const context2 = await options2.resolveContext?.({
      command: void 0,
      args: []
    });
    await runHandler(options2.home, [], context2, stdout, options2, true);
    return;
  }
  if (command.startsWith("-")) {
    stdout.write(renderLeadingFlagError(command));
    process.exitCode = 2;
    return;
  }
  const args = argv.slice(1);
  if (command === "update" && !options2.commands.update) {
    await runBuiltinUpdate(args, stdout, options2);
    return;
  }
  if (args.includes("--help")) {
    const help = options2.getCommandHelp?.(command);
    if (help) {
      stdout.write(help);
      return;
    }
  }
  const handler = options2.commands[command];
  if (!handler) {
    stdout.write((options2.renderUnknownCommand ?? defaultUnknownCommand)(command));
    process.exitCode = 2;
    return;
  }
  const context = await options2.resolveContext?.({ command, args });
  await runHandler(handler, args, context, stdout, options2, false);
}
async function runHandler(handler, args, context, stdout, options2, isHomeView) {
  try {
    const output = await handler(args, context);
    stdout.write(`${renderCommandOutput(output, options2, isHomeView)}
`);
  } catch (error) {
    const formatted = (options2.formatError ?? defaultFormatError)(error);
    stdout.write(formatted.output);
    process.exitCode = formatted.exitCode;
  }
}
async function runBuiltinUpdate(args, stdout, options2) {
  if (args.length === 1 && args[0] === "--help") {
    stdout.write(builtinUpdateHelp());
    return;
  }
  try {
    const output = await runUpdate({
      args,
      stdout,
      packageName: options2.packageName,
      version: options2.version
    });
    stdout.write(`${renderOutput(output)}
`);
  } catch (error) {
    const formatted = (options2.formatError ?? defaultFormatError)(error);
    stdout.write(formatted.output);
    process.exitCode = formatted.exitCode;
  }
}
function resolveBinName() {
  return basename2(process.argv[1] ?? "tool") || "tool";
}
function builtinCommandsHelp() {
  const bin = resolveBinName();
  return `${renderOutput({
    "built-in": {
      update: `Upgrade \`${bin}\` to the latest published version`,
      "update --check": "Report current vs latest without installing"
    }
  })}
`;
}
function builtinUpdateHelp() {
  const bin = resolveBinName();
  return `${renderOutput({
    command: "update",
    description: `Upgrade \`${bin}\` to the latest published npm version`,
    flags: {
      "--check": "Report current vs latest and exit without installing"
    },
    examples: [`${bin} update`, `${bin} update --check`]
  })}
`;
}
function renderLeadingFlagError(flag) {
  const bin = basename2(process.argv[1] ?? "tool") || "tool";
  return `${renderError("Flags must come after the command", "VALIDATION_ERROR", [
    `Run \`${bin} <command> [args] [flags]\``,
    `Move \`${flag}\` after the command instead of before it`
  ])}
`;
}
function isVersionFlag(flag) {
  return flag === "-v" || flag === "-V" || flag === "--version";
}
function renderCommandOutput(output, options2, isHomeView) {
  if (!isHomeView) {
    return renderOutput(output);
  }
  const header = homeHeaderOutput({ description: options2.description });
  if (typeof output === "string") {
    return `${renderOutput(header)}
${output}`;
  }
  return renderOutput(mergeHomeHeader(header, output));
}
function mergeHomeHeader(header, output) {
  const rest = { ...output };
  delete rest.bin;
  delete rest.description;
  return {
    ...header,
    ...rest
  };
}

// ../../node_modules/axi-sdk-js/dist/hooks.js
function computeCodexConfigUpdate(content) {
  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  const normalized = content.length === 0 ? "" : content;
  if (normalized.trim().length === 0) {
    return [`[features]${newline}hooks = true${newline}`, true];
  }
  const lines = normalized.split(/\r?\n/);
  const updated = [...lines];
  let inFeatures = false;
  let sawFeatures = false;
  for (let index = 0; index < updated.length; index++) {
    const line2 = updated[index];
    const section = line2.match(/^\s*(\[{1,2})([^\]]+)(\]{1,2})\s*(?:#.*)?$/);
    if (section) {
      const isTableHeader = section[1] === "[" && section[3] === "]" || section[1] === "[[" && section[3] === "]]";
      if (!isTableHeader) {
        continue;
      }
      const sectionName = section[2].trim();
      if (inFeatures) {
        updated.splice(index, 0, "hooks = true");
        return [updated.join(newline), true];
      }
      inFeatures = sectionName === "features";
      sawFeatures ||= inFeatures;
      continue;
    }
    if (!inFeatures) {
      continue;
    }
    const flag = line2.match(/^\s*hooks\s*=\s*(true|false)\s*(?:#.*)?$/);
    if (!flag) {
      continue;
    }
    if (flag[1] === "true") {
      return [content, false];
    }
    updated[index] = line2.replace(/false/, "true");
    return [updated.join(newline), true];
  }
  if (sawFeatures) {
    const suffix = normalized.endsWith(newline) ? "" : newline;
    return [`${normalized}${suffix}hooks = true${newline}`, true];
  }
  const separator = normalized.endsWith(newline) ? newline : `${newline}${newline}`;
  return [
    `${normalized}${separator}[features]${newline}hooks = true${newline}`,
    true
  ];
}

// src/commands/init.ts
import { parseArgs } from "node:util";
import { existsSync as existsSync5 } from "node:fs";
import path13 from "node:path";

// ../core/src/bundle.ts
import path4 from "node:path";

// ../core/src/backend.ts
import { promises as fs2 } from "node:fs";
import path2 from "node:path";
import { randomUUID as randomUUID2 } from "node:crypto";

// ../core/src/frontmatter.ts
var import_gray_matter = __toESM(require_gray_matter(), 1);
function normalizeFrontmatter(data) {
  const out = { ...data };
  for (const [key, value] of Object.entries(out)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    } else if (key === "timestamp" && typeof value === "number" && Number.isFinite(value)) {
      out[key] = new Date(value).toISOString();
    }
  }
  return out;
}
var MalformedDocumentError = class extends Error {
  name = "MalformedDocumentError";
  /** The document id/path the malformed content belongs to (when the caller supplied one). */
  context;
  /** The underlying parser message, first line only — for compact per-doc reporting. */
  detail;
  constructor(context, cause) {
    const detail = ((cause instanceof Error ? cause.message : String(cause)).split("\n")[0] ?? "").trim();
    super(
      `malformed frontmatter${context ? ` in '${context}'` : ""}: ${detail} \u2014 fix the YAML or remove the file`
    );
    if (context !== void 0) this.context = context;
    this.detail = detail;
    if (cause !== void 0) this.cause = cause;
  }
};
function parseMarkdown(raw, context) {
  let parsed;
  try {
    parsed = (0, import_gray_matter.default)(raw, {});
  } catch (err) {
    throw new MalformedDocumentError(context, err);
  }
  const frontmatter = normalizeFrontmatter(parsed.data ?? {});
  return { frontmatter, body: parsed.content };
}
function stringifyWithData(data, body) {
  const engines2 = import_gray_matter.default.engines;
  const yaml2 = engines2.yaml.stringify(data).trim();
  const content = body ?? "";
  const newline = (value) => value.endsWith("\n") ? value : `${value}
`;
  if (yaml2 === "{}") return newline(content);
  return `---
${newline(yaml2)}---
${newline(content)}`;
}
function stringifyDoc(frontmatter, body) {
  return stringifyWithData(frontmatter, body);
}

// ../core/src/content-type.ts
var EXTENSION_CONTENT_TYPES = Object.freeze({
  // Text / markup / data (searchable + text-readable)
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  text: "text/plain; charset=utf-8",
  log: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  tsv: "text/tab-separated-values; charset=utf-8",
  json: "application/json; charset=utf-8",
  jsonl: "application/json; charset=utf-8",
  ndjson: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  yaml: "application/yaml; charset=utf-8",
  yml: "application/yaml; charset=utf-8",
  toml: "application/toml; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  cjs: "text/javascript; charset=utf-8",
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
  svg: "image/svg+xml",
  // Documents / archives / binary
  pdf: "application/pdf",
  zip: "application/zip",
  gz: "application/gzip",
  tar: "application/x-tar",
  wasm: "application/wasm",
  woff: "font/woff",
  woff2: "font/woff2"
});
function extensionOfDocKey(docKey) {
  const lastSegment = docKey.split("/").pop() ?? docKey;
  const dot = lastSegment.lastIndexOf(".");
  if (dot <= 0) return void 0;
  const ext = lastSegment.slice(dot + 1).toLowerCase();
  return ext.length > 0 ? ext : void 0;
}
function inferContentTypeFromDocKey(docKey) {
  const ext = extensionOfDocKey(docKey);
  if (!ext) return void 0;
  return EXTENSION_CONTENT_TYPES[ext];
}
var DEFAULT_BLOB_CONTENT_TYPE = "application/octet-stream";
function resolveContentType(key, override) {
  if (typeof override === "string" && override.trim() !== "") return override;
  return inferContentTypeFromDocKey(key) ?? DEFAULT_BLOB_CONTENT_TYPE;
}

// ../core/src/errors.ts
var InvalidInputError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidInputError";
  }
};

// ../core/src/paths.ts
var RESERVED_FILENAMES = ["index.md", "log.md"];
function toPosix(p) {
  return p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}
function isReservedFile(relPath) {
  const base = toPosix(relPath).split("/").pop() ?? "";
  return RESERVED_FILENAMES.includes(base);
}
function conceptIdFromPath(relPath) {
  const norm = toPosix(relPath).replace(/^\.?\//, "");
  return norm.endsWith(".md") ? norm.slice(0, -3) : norm;
}
function pathFromConceptId(id) {
  const norm = toPosix(id).replace(/^\.?\//, "").replace(/\.md$/, "");
  return `${norm}.md`;
}
function assertSafeConceptId(id) {
  if (typeof id !== "string" || id.trim() === "") {
    throw new InvalidInputError("Concept id must be a non-empty string.");
  }
  const norm = toPosix(id);
  if (norm.startsWith("/")) {
    throw new InvalidInputError(`Concept id must be bundle-relative, got absolute '${id}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new InvalidInputError(`Concept id must not contain '..' segments: '${id}'.`);
  }
}
function assertSafeBlobKey(key) {
  if (typeof key !== "string" || key.trim() === "") {
    throw new InvalidInputError("Blob key must be a non-empty string.");
  }
  const norm = toPosix(key);
  if (norm.startsWith("/")) {
    throw new InvalidInputError(`Blob key must be bundle-relative, got absolute '${key}'.`);
  }
  const segments = norm.split("/");
  if (segments.some((seg) => seg === "..")) {
    throw new InvalidInputError(`Blob key must not contain '..' segments: '${key}'.`);
  }
  if (segments.some((seg) => seg.startsWith("."))) {
    throw new InvalidInputError(`Blob key must not contain dot-prefixed segments: '${key}'.`);
  }
  const last = segments[segments.length - 1] ?? "";
  if (last === "") {
    throw new InvalidInputError(`Blob key must name a file, not end with '/': '${key}'.`);
  }
  if (segments.some((seg) => seg.toLowerCase().endsWith(".md"))) {
    throw new InvalidInputError(
      `Blob key '${key}' has a path segment ending in '.md' (checked case-insensitively, at any depth), which collides with the concept-document namespace \u2014 write it as a doc instead.`
    );
  }
}
function assertSafeReservedDir(dir) {
  if (typeof dir !== "string") {
    throw new InvalidInputError("Reserved-file directory must be a string.");
  }
  const norm = toPosix(dir);
  if (norm.startsWith("/")) {
    throw new InvalidInputError(`Reserved-file directory must be bundle-relative, got absolute '${dir}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new InvalidInputError(`Reserved-file directory must not contain '..' segments: '${dir}'.`);
  }
}

// ../core/src/filesystem-lock.ts
import { promises as fs, realpathSync as realpathSync2 } from "node:fs";
import { homedir as homedir2, hostname, tmpdir, userInfo } from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
var OWNER_FILE = "owner.json";
var DEFAULT_WAIT_MS = 5e3;
var DEFAULT_POLL_MS = 25;
var FilesystemMutationLockError = class extends Error {
  lockPath;
  owner;
  stale;
  malformed;
  constructor(message, details) {
    super(message);
    this.name = "FilesystemMutationLockError";
    this.lockPath = details.lockPath;
    this.owner = details.owner;
    this.stale = details.stale;
    this.malformed = details.malformed;
  }
};
function runtimeOwnerKey() {
  const uid = process.getuid?.();
  if (uid !== void 0) return `uid-${uid}`;
  let username = "unknown";
  try {
    username = userInfo().username;
  } catch {
  }
  return `user-${createHash("sha256").update(username).digest("hex").slice(0, 16)}`;
}
function canonicalExistingPath(value) {
  try {
    return realpathSync2(value);
  } catch {
    return path.resolve(value);
  }
}
function pathContains(root, candidate) {
  const rel = path.relative(root, candidate);
  return rel === "" || !rel.startsWith("..") && !path.isAbsolute(rel);
}
function filesystemMutationLockRoot(portableRoot) {
  const tempParent = canonicalExistingPath(process.platform === "win32" ? tmpdir() : "/tmp");
  const homeParent = canonicalExistingPath(homedir2());
  const ownerKey = runtimeOwnerKey();
  const candidates = [
    path.join(tempParent, `agentstate-lite-mutation-locks-${ownerKey}`),
    path.join(homeParent, ".agentstate", `mutation-locks-${ownerKey}`)
  ];
  if (portableRoot === void 0) return candidates[0];
  const portable = canonicalExistingPath(portableRoot);
  const selected = candidates.find((candidate) => !pathContains(portable, candidate));
  if (selected) return selected;
  throw new FilesystemMutationLockError(
    `cannot place filesystem mutation locks outside portable root '${portable}'`,
    { lockPath: portable, owner: null, stale: false, malformed: true }
  );
}
function explicitFilesystemMutationLockRoot(root, portableRoot) {
  const requested = path.resolve(root);
  if (portableRoot === void 0) return requested;
  const portable = canonicalExistingPath(portableRoot);
  if (!pathContains(portable, canonicalExistingPath(requested))) return requested;
  throw new FilesystemMutationLockError(
    `cannot place filesystem mutation locks outside portable root '${portable}'`,
    { lockPath: portable, owner: null, stale: false, malformed: true }
  );
}
function filesystemMutationLockPathInRoot(target, lockRoot) {
  const digest = createHash("sha256").update(path.resolve(target)).digest("hex");
  return path.join(lockRoot, `${digest}.lock`);
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function parseFilesystemMutationLockOwner(value) {
  if (!isObject(value)) return null;
  if (typeof value.pid !== "number" || !Number.isSafeInteger(value.pid) || value.pid <= 0 || typeof value.hostname !== "string" || value.hostname.length === 0 || typeof value.created_at_ms !== "number" || !Number.isFinite(value.created_at_ms) || typeof value.token !== "string" || value.token.length === 0 || typeof value.target !== "string" || value.target.length === 0) {
    return null;
  }
  return {
    pid: value.pid,
    hostname: value.hostname,
    created_at_ms: value.created_at_ms,
    token: value.token,
    target: value.target
  };
}
async function readOwner(lockPath) {
  try {
    return parseFilesystemMutationLockOwner(
      JSON.parse(await fs.readFile(path.join(lockPath, OWNER_FILE), "utf8"))
    );
  } catch {
    return null;
  }
}
function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code !== "ESRCH";
  }
}
function delay(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function positiveOption(value, fallback, name) {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 0) {
    throw new TypeError(`${name} must be a non-negative safe integer`);
  }
  return resolved;
}
function isPrivateFilesystemMutationLockRoot(facts) {
  const wrongOwner = facts.expectedUid !== void 0 && facts.ownerUid !== facts.expectedUid;
  const unsafeMode = facts.enforcePrivateMode && (facts.mode & 511) !== 448;
  return facts.directory && !facts.symbolicLink && !wrongOwner && !unsafeMode;
}
async function ensurePrivateLockRoot(root) {
  try {
    await fs.mkdir(root, { recursive: true, mode: 448 });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
  const stat2 = await fs.lstat(root);
  const uid = process.getuid?.();
  if (!isPrivateFilesystemMutationLockRoot({
    directory: stat2.isDirectory(),
    symbolicLink: stat2.isSymbolicLink(),
    ownerUid: stat2.uid,
    expectedUid: uid,
    mode: stat2.mode,
    enforcePrivateMode: process.platform !== "win32"
  })) {
    throw new FilesystemMutationLockError(
      `refusing unsafe filesystem mutation lock root '${root}'; it must be a private directory owned by this user`,
      { lockPath: root, owner: null, stale: false, malformed: true }
    );
  }
}
async function canonicalTargetInDirectory(directory, requestedBasename) {
  const requested = path.join(directory, requestedBasename);
  let requestedStat;
  try {
    requestedStat = await fs.lstat(requested);
  } catch (err) {
    if (err.code === "ENOENT") return requested;
    throw err;
  }
  const entries = await fs.readdir(directory);
  if (entries.includes(requestedBasename)) return requested;
  for (const entry of entries) {
    const candidate = path.join(directory, entry);
    const candidateStat = await fs.lstat(candidate);
    if (candidateStat.dev === requestedStat.dev && candidateStat.ino === requestedStat.ino) return candidate;
  }
  return requested;
}
function timeoutError(lockPath, owner) {
  const malformed = owner === null;
  const sameHost = owner?.hostname === hostname();
  const stale = owner !== null && sameHost && !processExists(owner.pid);
  let message;
  if (malformed) {
    message = `timed out waiting for filesystem mutation lock '${lockPath}'; its owner metadata is missing or malformed. Inspect and remove the lock only after confirming no process is mutating the target, then retry.`;
  } else if (stale) {
    message = `stale filesystem mutation lock '${lockPath}' belongs to absent PID ${owner.pid} on ${owner.hostname}. Inspect and remove the lock, then retry.`;
  } else {
    message = `timed out waiting for filesystem mutation lock '${lockPath}' held by PID ${owner.pid} on ${owner.hostname}; retry the mutation.`;
  }
  return new FilesystemMutationLockError(message, { lockPath, owner, stale, malformed });
}
async function acquireFilesystemMutationLock(target, options2 = {}) {
  const waitMs = positiveOption(options2.waitMs, DEFAULT_WAIT_MS, "waitMs");
  const pollMs = positiveOption(options2.pollMs, DEFAULT_POLL_MS, "pollMs");
  const targetResolved = path.resolve(target);
  const targetDir = path.dirname(targetResolved);
  const started = Date.now();
  await fs.mkdir(targetDir, { recursive: true });
  const canonicalDir = await fs.realpath(targetDir);
  const targetCanonical = await canonicalTargetInDirectory(canonicalDir, path.basename(targetResolved));
  const portableRoot = options2.portableRoot ? await fs.realpath(options2.portableRoot).catch(() => path.resolve(options2.portableRoot)) : void 0;
  const lockRoot = options2.lockRoot !== void 0 ? explicitFilesystemMutationLockRoot(options2.lockRoot, portableRoot) : filesystemMutationLockRoot(portableRoot);
  await ensurePrivateLockRoot(lockRoot);
  const lockPath = filesystemMutationLockPathInRoot(targetCanonical, lockRoot);
  const owner = {
    pid: process.pid,
    hostname: hostname(),
    created_at_ms: started,
    token: randomUUID(),
    target: targetCanonical
  };
  while (true) {
    try {
      await fs.mkdir(lockPath, { mode: 448 });
      try {
        await fs.writeFile(path.join(lockPath, OWNER_FILE), `${JSON.stringify(owner)}
`, {
          encoding: "utf8",
          flag: "wx",
          mode: 384
        });
      } catch (err) {
        await fs.rm(lockPath, { recursive: true, force: true }).catch(() => {
        });
        throw err;
      }
      return async () => {
        const current = await readOwner(lockPath);
        if (current?.token !== owner.token) {
          throw new FilesystemMutationLockError(
            `refusing to release filesystem mutation lock '${lockPath}' because its owner token changed; the mutation may have completed, inspect the lock before retrying.`,
            { lockPath, owner: current, stale: false, malformed: current === null }
          );
        }
        try {
          await fs.rm(lockPath, { recursive: true, force: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          throw new FilesystemMutationLockError(
            `mutation completed but filesystem lock '${lockPath}' could not be removed (${message}); inspect the lock before retrying.`,
            { lockPath, owner: current, stale: false, malformed: false }
          );
        }
      };
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
    if (Date.now() - started >= waitMs) throw timeoutError(lockPath, await readOwner(lockPath));
    await delay(pollMs);
  }
}
async function withFilesystemMutationLock(target, fn, options2 = {}) {
  const release = await acquireFilesystemMutationLock(target, options2);
  try {
    return await fn();
  } finally {
    await release();
  }
}

// ../core/src/versioning.ts
import { createHash as createHash2 } from "node:crypto";
function sha256Hex(input) {
  return createHash2("sha256").update(input, "utf8").digest("hex");
}
function contentVersion(doc2) {
  return `sha256:${sha256Hex(stringifyDoc(doc2.frontmatter, doc2.body ?? ""))}`;
}
function versionOfBytes(raw) {
  return `sha256:${sha256Hex(raw)}`;
}
function blobVersion(bytes) {
  return `sha256:${createHash2("sha256").update(bytes).digest("hex")}`;
}
function stripETagWrapper(raw) {
  let v = raw.trim();
  if (v.startsWith("W/")) v = v.slice(2);
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  return v;
}
function defaultActor() {
  return process.env.USER?.trim() || process.env.USERNAME?.trim() || process.env.LOGNAME?.trim() || "local";
}
var VersionConflict = class extends Error {
  name = "VersionConflict";
  /** The concept id whose write was rejected. */
  id;
  /** The version the caller expected the backend to currently hold (`null` = expected absent). */
  expected;
  /** The version the backend actually holds (`null` if the document does not exist). */
  actual;
  constructor(id, expected, actual) {
    super(
      `version conflict on '${id}': expected ${expected ?? "absent"}, found ${actual ?? "none"} (the document changed since you read it \u2014 re-read and retry)`
    );
    this.id = id;
    this.expected = expected;
    this.actual = actual;
  }
};

// ../core/src/backend.ts
function firstString(...vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return void 0;
}
async function pathExists(p) {
  try {
    await fs2.stat(p);
    return true;
  } catch {
    return false;
  }
}
async function pathIsFile(p) {
  try {
    return (await fs2.stat(p)).isFile();
  } catch {
    return false;
  }
}
function isAbsentFileError(err) {
  const code = err?.code;
  return code === "ENOENT" || code === "EISDIR";
}
async function atomicWrite(filePath, content) {
  const dir = path2.dirname(filePath);
  await fs2.mkdir(dir, { recursive: true });
  const tmp = path2.join(dir, `.${path2.basename(filePath)}.${process.pid}.${Date.now()}.${randomUUID2()}.tmp`);
  if (typeof content === "string") {
    await fs2.writeFile(tmp, content, "utf8");
  } else {
    await fs2.writeFile(tmp, content);
  }
  await fs2.rename(tmp, filePath);
}
async function safeReaddir(abs) {
  try {
    return await fs2.readdir(abs, { withFileTypes: true });
  } catch {
    return [];
  }
}
async function walkMarkdown(root, sub = "") {
  const abs = path2.join(root, sub);
  const entries = await safeReaddir(abs);
  const out = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const rel = sub === "" ? entry.name : `${sub}/${entry.name}`;
    if (entry.isDirectory()) {
      out.push(...await walkMarkdown(root, rel));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(toPosix(rel));
    }
  }
  return out;
}
async function walkBlobs(root, sub = "") {
  const abs = path2.join(root, sub);
  const entries = await safeReaddir(abs);
  const out = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const rel = sub === "" ? entry.name : `${sub}/${entry.name}`;
    if (entry.isDirectory()) {
      out.push(...await walkBlobs(root, rel));
    } else if (entry.isFile() && !entry.name.toLowerCase().endsWith(".md")) {
      out.push(toPosix(rel));
    }
  }
  return out;
}
function reservedPath(dir, name) {
  const d = toPosix(dir).replace(/^\.?\//, "").replace(/\/$/, "");
  return d === "" ? name : `${d}/${name}`;
}
var FilesystemBackend = class _FilesystemBackend {
  root;
  /**
   * Per-resolved-path promise chain serializing writes within this process before the
   * same-user cross-process filesystem lock is acquired.
   *
   * `write()`/`writeReserved()`'s compare-and-swap is check-then-write across two
   * `await`s (read the current version, then `atomicWrite`): without serialization, N
   * concurrent writers targeting the SAME file can all observe the SAME pre-write
   * version, all pass the CAS check, and all proceed to write — every writer reports
   * success, only the last write survives, and no `VersionConflict` is ever thrown to
   * trigger a caller's retry loop. Queuing each write's full check-then-write critical
   * section behind this per-key chain avoids needless polling between local callers.
   * `withFilesystemMutationLock` then makes the same critical section exclusive across
   * independent processes, so at most one writer can satisfy a given version premise.
   * Reads stay lock-free because target replacement is atomic.
   *
   * STATIC, not per-instance: `core/src/bundle.ts`'s `backendFor()` constructs a FRESH
   * `FilesystemBackend` on every bundle operation when the caller passes a bare
   * `{ root }` (no explicit `backend`) — which is the shape `serve`/`openBundle` use
   * for every request. An instance-level map would give every concurrent write its own
   * empty lock table and serialize nothing; a process-wide map keyed by the RESOLVED
   * absolute path is what actually makes concurrent writers to the same physical file
   * queue behind each other, regardless of how many `FilesystemBackend` objects front
   * them. Different bundle roots never collide because their resolved paths differ, so
   * sharing the map across instances cannot cross-serialize unrelated bundles.
   *
   * Keyed by the RESOLVED absolute path so both `write()` (concept documents) and
   * `writeReserved()` (`index.md`/`log.md`) share one queue per physical file — the
   * only thing that actually needs serializing is contention on the same bytes.
   *
   * The external runtime lock is used for conditional and unconditional mutations alike: an
   * unconditional writer must not move the target between another process's version
   * check and write. A crash leftover fails closed with inspectable owner metadata.
   */
  static locks = /* @__PURE__ */ new Map();
  constructor(root) {
    this.root = root;
  }
  /**
   * Run `fn` after any prior write queued under `key` has settled (success or
   * failure), guaranteeing at most one in-flight critical section per key at a time —
   * across ALL `FilesystemBackend` instances in this process (see `locks`'s doc
   * comment on why the map is static). Must be called with NO prior `await` in the
   * caller since acquiring the tail from the map and re-registering it happen
   * synchronously here — that is what makes concurrent callers queue in call order
   * rather than racing each other for the map entry. The chain entry is deleted once
   * it drains and no newer waiter has replaced it, so a long-lived `serve` process
   * does not accumulate one `Map` entry per ever-written file.
   */
  withLock(key, fn) {
    const locks = _FilesystemBackend.locks;
    const tail = locks.get(key) ?? Promise.resolve();
    const locked = () => withFilesystemMutationLock(key, fn, { portableRoot: this.root });
    const run = tail.then(locked, locked);
    const settled = run.then(
      () => void 0,
      () => void 0
    );
    locks.set(key, settled);
    void settled.then(() => {
      if (locks.get(key) === settled) locks.delete(key);
    });
    return run;
  }
  /**
   * Join `rel` onto the bundle root and resolve it. Belt-and-suspenders containment: even
   * though every caller here first validates the id/dir it derived `rel` from
   * ({@link assertSafeConceptId} / {@link assertSafeReservedDir}), this asserts the
   * REALIZED path still lands inside the bundle root before any `fs` call touches it, so
   * a future caller that skips the upstream guard cannot escape the bundle either.
   */
  abs(rel) {
    const rootResolved = path2.resolve(this.root);
    const resolved = path2.resolve(rootResolved, rel);
    if (resolved !== rootResolved && !resolved.startsWith(rootResolved + path2.sep)) {
      throw new InvalidInputError(`Path '${rel}' resolves outside the bundle root.`);
    }
    return resolved;
  }
  async read(id) {
    assertSafeConceptId(id);
    const rel = pathFromConceptId(id);
    const raw = await fs2.readFile(this.abs(rel), "utf8");
    const { frontmatter, body } = parseMarkdown(raw, rel);
    return { doc: { id, frontmatter, body }, version: versionOfBytes(raw) };
  }
  async readMany(ids) {
    for (const id of ids) assertSafeConceptId(id);
    const out = [];
    for (const id of ids) out.push(await this.read(id));
    return out;
  }
  /** Current version of the file at the already-resolved `absPath`, or `null` if absent. */
  async currentVersionAt(absPath) {
    try {
      return versionOfBytes(await fs2.readFile(absPath, "utf8"));
    } catch {
      return null;
    }
  }
  async write(id, doc2, options2 = {}) {
    assertSafeConceptId(id);
    const raw = stringifyDoc(doc2.frontmatter, doc2.body ?? "");
    const target = this.abs(pathFromConceptId(id));
    return this.withLock(target, async () => {
      if (options2.expectedVersion !== void 0) {
        const current = await this.currentVersionAt(target);
        if (current !== options2.expectedVersion) {
          throw new VersionConflict(id, options2.expectedVersion, current);
        }
      }
      await atomicWrite(target, raw);
      return versionOfBytes(raw);
    });
  }
  async delete(id, options2 = {}) {
    assertSafeConceptId(id);
    const target = this.abs(pathFromConceptId(id));
    return this.withLock(target, async () => {
      const current = await this.currentVersionAt(target);
      if (current === null) return false;
      if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
        throw new VersionConflict(id, options2.expectedVersion, current);
      }
      await fs2.unlink(target);
      return true;
    });
  }
  async versions(id) {
    assertSafeConceptId(id);
    const p = this.abs(pathFromConceptId(id));
    let raw;
    let mtime;
    try {
      raw = await fs2.readFile(p, "utf8");
      mtime = (await fs2.stat(p)).mtime;
    } catch {
      return [];
    }
    const { frontmatter } = parseMarkdown(raw, pathFromConceptId(id));
    const actor = firstString(frontmatter.updated_by, frontmatter.actor) ?? defaultActor();
    const timestamp = firstString(frontmatter.timestamp) ?? mtime.toISOString();
    return [{ version: versionOfBytes(raw), actor, timestamp }];
  }
  async exists(id) {
    assertSafeConceptId(id);
    return pathExists(this.abs(pathFromConceptId(id)));
  }
  async list(prefix) {
    const files = await walkMarkdown(this.root);
    const ids = [];
    for (const rel of files) {
      if (isReservedFile(rel)) continue;
      const id = conceptIdFromPath(rel);
      if (prefix && !id.startsWith(prefix)) continue;
      ids.push(id);
    }
    ids.sort((a, b) => a.localeCompare(b));
    return ids;
  }
  async readReserved(dir, name) {
    assertSafeReservedDir(dir);
    const p = this.abs(reservedPath(dir, name));
    if (!await pathExists(p)) return null;
    const content = await fs2.readFile(p, "utf8");
    return { content, version: versionOfBytes(content) };
  }
  async writeReserved(dir, name, content, options2 = {}) {
    assertSafeReservedDir(dir);
    const rel = reservedPath(dir, name);
    const target = this.abs(rel);
    return this.withLock(target, async () => {
      if (options2.expectedVersion !== void 0) {
        const current = await this.currentVersionAt(target);
        if (current !== options2.expectedVersion) {
          throw new VersionConflict(rel, options2.expectedVersion, current);
        }
      }
      await atomicWrite(target, content);
      return versionOfBytes(content);
    });
  }
  // ── blobs: opaque bytes + a content-type ──────────────────────────────────
  /** Current RAW-BYTES version of the blob at the already-resolved `absPath`, or `null` if absent. Reads with NO encoding — reusing the doc-shaped `currentVersionAt` would corrupt binary content via UTF-8 decoding (B1). */
  async currentBlobVersionAt(absPath) {
    try {
      return blobVersion(await fs2.readFile(absPath));
    } catch (err) {
      if (isAbsentFileError(err)) return null;
      throw err;
    }
  }
  async readBlob(key) {
    assertSafeBlobKey(key);
    let bytes;
    try {
      bytes = await fs2.readFile(this.abs(key));
    } catch (err) {
      if (isAbsentFileError(err)) return null;
      throw err;
    }
    return { bytes, contentType: resolveContentType(key), version: blobVersion(bytes) };
  }
  async writeBlob(key, bytes, _contentType, options2 = {}) {
    assertSafeBlobKey(key);
    const target = this.abs(key);
    return this.withLock(target, async () => {
      if (options2.expectedVersion !== void 0) {
        const current = await this.currentBlobVersionAt(target);
        if (current !== options2.expectedVersion) {
          throw new VersionConflict(key, options2.expectedVersion, current);
        }
      }
      await atomicWrite(target, bytes);
      return blobVersion(bytes);
    });
  }
  async deleteBlob(key, options2 = {}) {
    assertSafeBlobKey(key);
    const target = this.abs(key);
    return this.withLock(target, async () => {
      const current = await this.currentBlobVersionAt(target);
      if (current === null) return false;
      if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
        throw new VersionConflict(key, options2.expectedVersion, current);
      }
      await fs2.unlink(target);
      return true;
    });
  }
  async existsBlob(key) {
    assertSafeBlobKey(key);
    return pathIsFile(this.abs(key));
  }
  async listBlobs(prefix) {
    const keys = await walkBlobs(this.root);
    const filtered = prefix ? keys.filter((k) => k.startsWith(prefix)) : keys;
    filtered.sort((a, b) => a.localeCompare(b));
    return filtered;
  }
  capabilities() {
    return {
      history: false,
      enforced_cas: true,
      blobs: true,
      projections: true,
      backlinks: false
    };
  }
};

// ../core/src/index-marker.ts
var GENERATED_INDEX_MARKER = "<!-- agentstate-lite:generated-index:v1 -->";

// ../core/src/links.ts
import path3 from "node:path";
var MD_LINK_RE = /\[([^\]]*)\]\(([^)\s]+)\)/g;
function isExternalHref(href) {
  const h = href.trim();
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(h) || h.startsWith("mailto:") || h.startsWith("#");
}
function extractMarkdownLinks(body) {
  const out = [];
  for (const m of body.matchAll(MD_LINK_RE)) {
    if (typeof m.index === "number" && m.index > 0 && body[m.index - 1] === "!") continue;
    out.push({ text: m[1] ?? "", href: m[2] ?? "" });
  }
  return out;
}
function resolveConceptId(fromId, href) {
  const target = (href.split("#")[0] ?? "").split("?")[0]?.trim() ?? "";
  if (target === "" || isExternalHref(target)) return null;
  if (!target.endsWith(".md")) return null;
  let resolved;
  if (target.startsWith("/")) {
    resolved = target.slice(1);
  } else {
    const slash = fromId.lastIndexOf("/");
    const fromDir = slash >= 0 ? fromId.slice(0, slash) : "";
    resolved = path3.posix.join(fromDir, target);
  }
  resolved = resolved.replace(/^(\.\.\/)+/, "");
  if (isReservedFile(resolved)) return null;
  return resolved.replace(/\.md$/, "");
}
function relativeHref(fromId, target) {
  const t = target.trim();
  if (isExternalHref(t)) return t;
  const targetId = t.replace(/^\/+/, "").replace(/\.md$/, "");
  const slash = fromId.lastIndexOf("/");
  const fromDir = slash >= 0 ? fromId.slice(0, slash) : "";
  let rel = path3.posix.relative(fromDir, targetId);
  if (rel === "") rel = path3.posix.basename(targetId);
  return `${rel}.md`;
}
function parseLinksFromDoc(doc2) {
  const links = [];
  for (const raw of extractMarkdownLinks(doc2.body)) {
    const to = resolveConceptId(doc2.id, raw.href);
    if (to === null) continue;
    links.push({ from: doc2.id, to, text: raw.text, href: raw.href });
  }
  return links;
}

// ../core/src/query-filter.ts
function matchesFilter(doc2, filter) {
  if (filter.prefix && !doc2.id.startsWith(filter.prefix)) return false;
  if (filter.type && doc2.frontmatter.type !== filter.type) return false;
  if (filter.tags && filter.tags.length > 0) {
    const tags = Array.isArray(doc2.frontmatter.tags) ? doc2.frontmatter.tags : [];
    if (!filter.tags.every((tag) => tags.includes(tag))) return false;
  }
  if (filter.fields) {
    const frontmatter = doc2.frontmatter;
    for (const [key, expected] of Object.entries(filter.fields)) {
      const raw = frontmatter[key];
      const actual = raw === void 0 || raw === null ? [] : (Array.isArray(raw) ? raw : [raw]).map((value) => String(value));
      if (!actual.includes(expected)) return false;
    }
  }
  return true;
}

// ../core/src/bundle.ts
function backendFor(bundle) {
  return bundle.backend ?? new FilesystemBackend(bundle.root);
}
async function initBundle(root, options2 = {}) {
  const resolved = path4.resolve(root);
  const backend = new FilesystemBackend(resolved);
  if (await backend.readReserved("", "index.md") === null) {
    const okfVersion = options2.okfVersion ?? "0.1";
    const name = path4.basename(resolved);
    const body = `${GENERATED_INDEX_MARKER}
# ${name}

An Open Knowledge Format bundle.
`;
    try {
      await backend.writeReserved("", "index.md", stringifyWithData({ okf_version: okfVersion }, body), {
        expectedVersion: null
      });
    } catch (err) {
      if (!(err instanceof VersionConflict)) throw err;
    }
  }
  return { root: resolved };
}
async function writeDocVersioned(bundle, doc2, options2) {
  assertSafeConceptId(doc2.id);
  const rel = pathFromConceptId(doc2.id);
  if (isReservedFile(rel)) {
    throw new InvalidInputError(
      `'${doc2.id}' maps to a reserved file (${rel}); use the index/log accessors, not writeDoc.`
    );
  }
  const type = doc2.frontmatter?.type;
  if (typeof type !== "string" || type.trim() === "") {
    throw new InvalidInputError(`OKF \xA79.2: frontmatter.type is required and must be non-empty (concept '${doc2.id}').`);
  }
  const existingTs = doc2.frontmatter.timestamp;
  const timestamp = typeof existingTs === "string" && existingTs.trim() !== "" ? existingTs : (/* @__PURE__ */ new Date()).toISOString();
  const { type: _t, timestamp: _ts, ...rest } = doc2.frontmatter;
  const frontmatter = { type, ...rest, timestamp };
  const saved = { id: doc2.id, frontmatter, body: doc2.body ?? "" };
  const version = await backendFor(bundle).write(doc2.id, saved, options2);
  return { doc: saved, version };
}
async function readDocVersioned(bundle, id) {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new InvalidInputError(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
  }
  return backendFor(bundle).read(id);
}
async function readDoc(bundle, id) {
  return (await readDocVersioned(bundle, id)).doc;
}
async function docVersions(bundle, id) {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new InvalidInputError(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
  }
  return backendFor(bundle).versions(id);
}
async function deleteDoc(bundle, id, options2) {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new InvalidInputError(`'${id}' is a reserved file (${rel}); reserved files cannot be deleted.`);
  }
  return backendFor(bundle).delete(id, options2);
}
var isEnoent = (err) => err?.code === "ENOENT";
async function readManyExisting(backend, ids, onMalformed) {
  try {
    return await backend.readMany(ids);
  } catch (err) {
    const malformed = err instanceof MalformedDocumentError;
    if (!isEnoent(err) && !(malformed && onMalformed)) throw err;
    const out = [];
    for (const id of ids) {
      try {
        out.push(await backend.read(id));
      } catch (e) {
        if (isEnoent(e)) continue;
        if (e instanceof MalformedDocumentError && onMalformed) {
          onMalformed({ id, reason: e.detail });
          continue;
        }
        throw e;
      }
    }
    return out;
  }
}
async function scanMatching(backend, filter, onSkip) {
  const ids = await backend.list(filter.prefix);
  const results = [];
  for (const result of await readManyExisting(backend, ids, onSkip)) {
    if (!matchesFilter(result.doc, filter)) continue;
    results.push(result);
  }
  results.sort((a, b) => a.doc.id.localeCompare(b.doc.id));
  return results;
}
async function query(bundle, filter = {}, options2 = {}) {
  const scanned = await scanMatching(backendFor(bundle), filter, options2.onSkip);
  return scanned.map((r) => r.doc);
}
async function queryHeads(bundle, filter = {}, options2 = {}) {
  const backend = backendFor(bundle);
  if (backend.queryHeads) {
    const rows = (await backend.queryHeads(filter)).filter((r) => matchesFilter(r, filter));
    rows.sort((a, b) => a.id.localeCompare(b.id));
    return rows;
  }
  const scanned = await scanMatching(backend, filter, options2.onSkip);
  return scanned.map(({ doc: doc2, version }) => ({ id: doc2.id, frontmatter: doc2.frontmatter, version }));
}
function parseLinks(_bundle, doc2) {
  return parseLinksFromDoc(doc2);
}
function normalizeEdgeSelector(raw) {
  return toPosix(raw).replace(/^\.?\//, "");
}
function matchesEdgeSelector(value, selectors) {
  if (selectors === void 0) return true;
  for (const raw of selectors) {
    const normalized = normalizeEdgeSelector(raw);
    if (normalized.endsWith("/")) {
      if (value.startsWith(normalized)) return true;
    } else if (value === normalized.replace(/\.md$/, "")) {
      return true;
    }
  }
  return false;
}
function toSelectorList(v) {
  if (v === void 0) return void 0;
  return Array.isArray(v) ? v : [v];
}
async function queryEdges(bundle, filter = {}) {
  const fromSelectors = toSelectorList(filter.from);
  const toSelectors = toSelectorList(filter.to);
  const docs = await query(bundle);
  const edges = [];
  for (const doc2 of docs) {
    for (const link2 of parseLinksFromDoc(doc2)) {
      if (!matchesEdgeSelector(link2.from, fromSelectors)) continue;
      if (!matchesEdgeSelector(link2.to, toSelectors)) continue;
      if (filter.text !== void 0 && link2.text !== filter.text) continue;
      edges.push(link2);
    }
  }
  edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.text.localeCompare(b.text));
  return edges;
}
async function backlinks(bundle, target) {
  if (target.endsWith("/")) return [];
  return queryEdges(bundle, { to: target });
}
async function readBlob(bundle, key) {
  return backendFor(bundle).readBlob(key);
}
async function writeBlob(bundle, key, bytes, contentType, options2) {
  return backendFor(bundle).writeBlob(key, bytes, contentType, options2);
}
async function listBlobs(bundle, prefix) {
  return backendFor(bundle).listBlobs(prefix);
}
async function deleteBlob(bundle, key, options2) {
  return backendFor(bundle).deleteBlob(key, options2);
}

// ../core/src/freshness.ts
function parseTimestamp(ts) {
  if (ts instanceof Date) {
    const ms2 = ts.getTime();
    return Number.isNaN(ms2) ? null : ms2;
  }
  if (typeof ts === "number") {
    return Number.isFinite(ts) ? ts : null;
  }
  if (typeof ts !== "string" || ts.trim() === "") return null;
  const ms = Date.parse(ts);
  return Number.isNaN(ms) ? null : ms;
}
function freshness(doc2, options2 = {}) {
  const tsMs = parseTimestamp(doc2.frontmatter?.timestamp);
  if (tsMs === null) {
    return { verdict: "empty", reason: "no usable `timestamp` frontmatter" };
  }
  const now = (options2.now ?? /* @__PURE__ */ new Date()).getTime();
  const ageMs = now - tsMs;
  if (options2.dependsOn && options2.dependsOn.length > 0) {
    for (const dep of options2.dependsOn) {
      const depMs = parseTimestamp(dep);
      if (depMs !== null && depMs > tsMs) {
        return {
          verdict: "stale",
          ageMs,
          reason: `a dependency (${dep}) is newer than this concept`
        };
      }
    }
  }
  if (typeof options2.maxAgeMs === "number" && ageMs > options2.maxAgeMs) {
    return {
      verdict: "stale",
      ageMs,
      reason: `age ${ageMs}ms exceeds max ${options2.maxAgeMs}ms`
    };
  }
  return { verdict: "fresh", ageMs };
}

// ../core/src/memory-backend.ts
function snapshot(value) {
  return structuredClone(value);
}
function notFound(id) {
  const err = new Error(`no concept document '${id}'`);
  err.code = "ENOENT";
  return err;
}
function reservedKey(dir, name) {
  const d = toPosix(dir).replace(/^\.?\//, "").replace(/\/$/, "");
  return d === "" ? name : `${d}/${name}`;
}
var MemoryBackend = class {
  /** Concept id → revision chain, newest-first (index 0 is the head). */
  chains = /* @__PURE__ */ new Map();
  /** Reserved-file path → raw content. */
  reserved = /* @__PURE__ */ new Map();
  /** Blob key → current state. Separate from `chains` — a different namespace, no history. */
  blobs = /* @__PURE__ */ new Map();
  async read(id) {
    assertSafeConceptId(id);
    const head = this.chains.get(id)?.[0];
    if (!head) throw notFound(id);
    return { doc: snapshot(head.doc), version: head.version };
  }
  async readMany(ids) {
    for (const id of ids) assertSafeConceptId(id);
    return Promise.all(ids.map((id) => this.read(id)));
  }
  async write(id, doc2, options2 = {}) {
    assertSafeConceptId(id);
    const chain = this.chains.get(id);
    const current = chain?.[0]?.version ?? null;
    if (options2.expectedVersion !== void 0 && options2.expectedVersion !== current) {
      throw new VersionConflict(id, options2.expectedVersion, current);
    }
    const version = contentVersion(doc2);
    if (current === version) return version;
    const revision = {
      version,
      actor: options2.actor?.trim() || defaultActor(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      // Unlike `actor`, an unattested agent is simply absent — no default is applied.
      agent: options2.agent?.trim() || void 0,
      doc: snapshot(doc2)
    };
    this.chains.set(id, chain ? [revision, ...chain] : [revision]);
    return version;
  }
  async delete(id, options2 = {}) {
    assertSafeConceptId(id);
    const chain = this.chains.get(id);
    const current = chain?.[0]?.version ?? null;
    if (current === null) return false;
    if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
      throw new VersionConflict(id, options2.expectedVersion, current);
    }
    this.chains.delete(id);
    return true;
  }
  async exists(id) {
    assertSafeConceptId(id);
    return this.chains.has(id);
  }
  async list(prefix) {
    const ids = [...this.chains.keys()].filter((id) => !prefix || id.startsWith(prefix));
    ids.sort((a, b) => a.localeCompare(b));
    return ids;
  }
  async versions(id) {
    assertSafeConceptId(id);
    const chain = this.chains.get(id) ?? [];
    return chain.map(
      ({ version, actor, timestamp, agent }) => agent === void 0 ? { version, actor, timestamp } : { version, actor, timestamp, agent }
    );
  }
  async readReserved(dir, name) {
    assertSafeReservedDir(dir);
    const content = this.reserved.get(reservedKey(dir, name));
    if (content === void 0) return null;
    return { content, version: versionOfBytes(content) };
  }
  async writeReserved(dir, name, content, options2 = {}) {
    assertSafeReservedDir(dir);
    const key = reservedKey(dir, name);
    const existing = this.reserved.get(key);
    const current = existing === void 0 ? null : versionOfBytes(existing);
    if (options2.expectedVersion !== void 0 && options2.expectedVersion !== current) {
      throw new VersionConflict(key, options2.expectedVersion, current);
    }
    this.reserved.set(key, content);
    return versionOfBytes(content);
  }
  // ── blobs: opaque bytes + a content-type ──────────────────────────────────
  async readBlob(key) {
    assertSafeBlobKey(key);
    const entry = this.blobs.get(key);
    if (!entry) return null;
    return { bytes: new Uint8Array(entry.bytes), contentType: entry.contentType, version: entry.version };
  }
  async writeBlob(key, bytes, contentType, options2 = {}) {
    assertSafeBlobKey(key);
    const existing = this.blobs.get(key);
    const current = existing?.version ?? null;
    if (options2.expectedVersion !== void 0 && options2.expectedVersion !== current) {
      throw new VersionConflict(key, options2.expectedVersion, current);
    }
    const version = blobVersion(bytes);
    const resolvedType = resolveContentType(key, contentType);
    if (existing && existing.version === version && existing.contentType === resolvedType) {
      return version;
    }
    this.blobs.set(key, { bytes: new Uint8Array(bytes), contentType: resolvedType, version });
    return version;
  }
  async deleteBlob(key, options2 = {}) {
    assertSafeBlobKey(key);
    const existing = this.blobs.get(key);
    const current = existing?.version ?? null;
    if (current === null) return false;
    if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
      throw new VersionConflict(key, options2.expectedVersion, current);
    }
    this.blobs.delete(key);
    return true;
  }
  async existsBlob(key) {
    assertSafeBlobKey(key);
    return this.blobs.has(key);
  }
  async listBlobs(prefix) {
    const keys = [...this.blobs.keys()].filter((k) => !prefix || k.startsWith(prefix));
    keys.sort((a, b) => a.localeCompare(b));
    return keys;
  }
};

// ../core/src/remote-backend.ts
var RemoteError = class extends Error {
  /** The envelope's `code` field, or a status-derived guess when the envelope is missing/unparseable. */
  code;
  /** The raw HTTP status that produced this error. */
  status;
  constructor(message, code, status2) {
    super(message);
    this.name = "RemoteError";
    this.code = code;
    this.status = status2;
  }
};
function notFound2(id) {
  const err = new Error(`no concept document '${id}'`);
  err.code = "ENOENT";
  return err;
}
function extractVersion(res, context) {
  const xVersion = res.headers.get("x-version");
  if (xVersion) return xVersion;
  const etag = res.headers.get("etag");
  if (etag) return stripETagWrapper(etag);
  throw new RemoteError(
    `wire response for ${context} carried neither an X-Version nor an ETag header \u2014 the version is unknown, so compare-and-swap integrity cannot be guaranteed for a subsequent write. Likely cause: an intermediary (e.g. a CDN or compressing proxy) stripped the version header from the response.`,
    "VERSION_MISSING",
    res.status
  );
}
function assertValidExpectedVersion(expectedVersion) {
  if (expectedVersion === "") {
    throw new InvalidInputError(
      "expectedVersion must not be an empty string \u2014 pass a real version token, null (expect-absent create), or omit the option entirely (unconditional write)"
    );
  }
}
var RETRIABLE_STATUS = /* @__PURE__ */ new Set([500, 502, 503, 504]);
var RETRY_BASE_MS = 150;
var RETRY_CAP_MS = 2e3;
var RETRY_JITTER_MS = 100;
function retryDelayMs(attempt) {
  const backoff = Math.min(RETRY_CAP_MS, RETRY_BASE_MS * 2 ** attempt);
  return backoff + Math.floor(Math.random() * RETRY_JITTER_MS);
}
function delay2(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function encodeId(id) {
  return id.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}
function encodeBlobKey(key) {
  return key.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}
var RemoteBackend = class {
  baseUrl;
  bundle;
  fetchImpl;
  authToken;
  maxRetries;
  constructor(options2) {
    this.baseUrl = options2.baseUrl.replace(/\/+$/, "");
    this.bundle = options2.bundle;
    this.fetchImpl = options2.fetchImpl ?? ((request) => globalThis.fetch(request));
    this.authToken = options2.authToken;
    this.maxRetries = options2.maxRetries ?? 3;
  }
  /** Build the absolute URL for a bundle-relative wire path (e.g. `/docs/concepts/x`). */
  url(bundleRelativePath) {
    return `${this.baseUrl}/v0/bundles/${encodeURIComponent(this.bundle)}${bundleRelativePath}`;
  }
  async send(bundleRelativePath, init2 = {}) {
    if (this.authToken) {
      const headers = new Headers(init2.headers);
      headers.set("Authorization", `Bearer ${this.authToken}`);
      init2 = { ...init2, headers };
    }
    const url = this.url(bundleRelativePath);
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await this.fetchImpl(new Request(url, init2));
        if (RETRIABLE_STATUS.has(res.status) && attempt < this.maxRetries) {
          await delay2(retryDelayMs(attempt));
          continue;
        }
        return res;
      } catch (err) {
        if (attempt < this.maxRetries) {
          await delay2(retryDelayMs(attempt));
          continue;
        }
        throw err;
      }
    }
  }
  /** Parse a non-2xx response into the typed error the engine expects. */
  async toError(res, fallbackId) {
    let envelope = null;
    try {
      envelope = await res.json();
    } catch {
      envelope = null;
    }
    if (res.status === 412) {
      const expected = envelope?.error?.details?.expected ?? null;
      const actual = envelope?.error?.details?.actual ?? null;
      return new VersionConflict(fallbackId, expected, actual);
    }
    const message = envelope?.error?.message ?? `wire request failed with status ${res.status}`;
    const code = envelope?.error?.code ?? (res.status === 401 ? "AUTH_REQUIRED" : res.status >= 500 ? "RUNTIME" : "USAGE");
    return new RemoteError(message, code, res.status);
  }
  async read(id) {
    const res = await this.send(`/docs/${encodeId(id)}`, { method: "GET" });
    if (res.status === 404) throw notFound2(id);
    if (!res.ok) throw await this.toError(res, id);
    const version = extractVersion(res, `GET /docs/${id}`);
    const payload = await res.json();
    return { doc: { id: payload.id, frontmatter: payload.frontmatter, body: payload.body }, version };
  }
  async readMany(ids) {
    if (ids.length === 0) return [];
    const res = await this.send("/docs:read-many", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids })
    });
    if (res.status === 404) {
      let missing = [];
      try {
        const envelope = await res.json();
        missing = envelope.error.details?.missing ?? [];
      } catch {
      }
      throw notFound2(missing[0] ?? ids[0]);
    }
    if (!res.ok) throw await this.toError(res, ids[0] ?? "");
    const payload = await res.json();
    return payload.results.map((r) => ({
      doc: { id: r.id, frontmatter: r.frontmatter, body: r.body },
      version: r.version
    }));
  }
  async write(id, doc2, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = { "content-type": "application/json" };
    if (options2.expectedVersion === null) headers["If-None-Match"] = "*";
    else if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    if (options2.actor) headers["X-Actor"] = options2.actor;
    const res = await this.send(`/docs/${encodeId(id)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ frontmatter: doc2.frontmatter, body: doc2.body ?? "" })
    });
    if (!res.ok) throw await this.toError(res, id);
    const payload = await res.json();
    return payload.version;
  }
  async exists(id) {
    const res = await this.send(`/docs/${encodeId(id)}`, { method: "HEAD" });
    if (res.status === 404) return false;
    if (!res.ok) throw await this.toError(res, id);
    return true;
  }
  /**
   * THE `GET /docs` cursor pager — the pagination contract (the `cursor` param, the
   * `{ docs, next_cursor }` envelope) exists ONCE, here; {@link RemoteBackend.list} and
   * {@link RemoteBackend.queryHeads} are both thin row-mappings over it, so a wire
   * pagination change cannot make the two scans silently paginate differently.
   */
  async pageDocs(baseParams, mapRow, errorContext) {
    const rows = [];
    let cursor;
    for (; ; ) {
      const params = new URLSearchParams(baseParams);
      if (cursor) params.set("cursor", cursor);
      const qs = params.toString();
      const res = await this.send(`/docs${qs ? `?${qs}` : ""}`, { method: "GET" });
      if (!res.ok) throw await this.toError(res, errorContext);
      const payload = await res.json();
      for (const row2 of payload.docs) rows.push(mapRow(row2));
      if (!payload.next_cursor) break;
      cursor = payload.next_cursor;
    }
    return rows;
  }
  async list(prefix) {
    const params = new URLSearchParams();
    if (prefix) params.set("prefix", prefix);
    return this.pageDocs(params, (row2) => row2.id, prefix ?? "");
  }
  /**
   * The seam's OPTIONAL head-projection push-down, over the SAME `GET /docs` route
   * `list()` pages through — with `fields=frontmatter` (the wire's full-frontmatter
   * projection, in the protocol since v0) plus the `prefix`/`type`/repeated-`tag`
   * filter params the reference router evaluates server-side. A filtered scan therefore
   * crosses the wire as thin frontmatter rows: NO bodies, and non-matching docs never
   * leave the server. {@link QueryFilter.fields} equality is NOT pushed (the wire's
   * `fields` param is the projection selector — a recorded name collision, see
   * `docs/WIRE-PROTOCOL.md`); the engine's `queryHeads` re-filter covers it, per the
   * seam contract (over-returning is fine; semantics live in core).
   */
  async queryHeads(filter = {}) {
    const params = new URLSearchParams();
    params.set("fields", "frontmatter");
    if (filter.prefix) params.set("prefix", filter.prefix);
    if (filter.type) params.set("type", filter.type);
    for (const tag of filter.tags ?? []) params.append("tag", tag);
    return this.pageDocs(
      params,
      (row2) => ({ id: row2.id, frontmatter: row2.frontmatter, version: row2.version }),
      filter.prefix ?? ""
    );
  }
  async versions(id) {
    const res = await this.send(`/docs/${encodeId(id)}/versions`, { method: "GET" });
    if (!res.ok) throw await this.toError(res, id);
    const payload = await res.json();
    return payload.versions.map(
      (v) => v.agent === void 0 ? { version: v.version, actor: v.actor, timestamp: v.timestamp } : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent }
    );
  }
  async readReserved(dir, name) {
    const qs = dir ? `?dir=${encodeURIComponent(dir)}` : "";
    const res = await this.send(`/reserved/${name}${qs}`, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) throw await this.toError(res, `${dir}/${name}`);
    const version = extractVersion(res, `GET /reserved/${name}`);
    const payload = await res.json();
    return { content: payload.content, version };
  }
  async writeReserved(dir, name, content, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = { "content-type": "application/json" };
    if (options2.expectedVersion === null) headers["If-None-Match"] = "*";
    else if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    if (options2.actor) headers["X-Actor"] = options2.actor;
    const qs = dir ? `?dir=${encodeURIComponent(dir)}` : "";
    const res = await this.send(`/reserved/${name}${qs}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw await this.toError(res, `${dir}/${name}`);
    const payload = await res.json();
    return payload.version;
  }
  /**
   * `DELETE /docs/{id}`, `If-Match: <expectedVersion>` when given (no unwrapped/null branch
   * to send — {@link DeleteOptions} carries no expect-absent reading, unlike
   * {@link WriteOptions}) and NO `X-Actor` (a delete records no new revision to attribute).
   * `assertValidExpectedVersion` rejects `""` the same way `write` does. There is NO `404`
   * branch: an absent target is a normal `200 { deleted: false }` response by wire contract
   * (idempotency, AXI P6), never a rejection — `!res.ok` still routes a `412` through
   * `toError`'s existing `VersionConflict` reconstruction, and anything else through
   * `RemoteError`.
   */
  async delete(id, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = {};
    if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    const res = await this.send(`/docs/${encodeId(id)}`, { method: "DELETE", headers });
    if (!res.ok) throw await this.toError(res, id);
    const payload = await res.json();
    return payload.deleted;
  }
  // ── blobs: opaque bytes served by content-type (wire-protocol v0.1) ──────────
  //
  // Bytes cross the wire as the RAW request/response body — never JSON (B1): PUT
  // sends a `Uint8Array` directly as `BodyInit`, GET reads back via `arrayBuffer()`.
  // No `Buffer` anywhere in this module, so it stays browser/edge-runtime compatible.
  // Content-type rides `Content-Type`; the version rides `X-Version`/`ETag` (extractVersion),
  // exactly like docs.
  async readBlob(key) {
    const res = await this.send(`/blobs/${encodeBlobKey(key)}`, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) throw await this.toError(res, key);
    const version = extractVersion(res, `GET /blobs/${key}`);
    const contentType = res.headers.get("content-type") ?? DEFAULT_BLOB_CONTENT_TYPE;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { bytes, contentType, version };
  }
  async writeBlob(key, bytes, contentType, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = {};
    if (contentType) headers["content-type"] = contentType;
    if (options2.expectedVersion === null) headers["If-None-Match"] = "*";
    else if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    if (options2.actor) headers["X-Actor"] = options2.actor;
    const res = await this.send(`/blobs/${encodeBlobKey(key)}`, {
      method: "PUT",
      headers,
      body: bytes
    });
    if (!res.ok) throw await this.toError(res, key);
    const payload = await res.json();
    return payload.version;
  }
  /** `DELETE /blobs/{key}`, mirroring `delete`'s `If-Match`/no-404/no-actor posture exactly. */
  async deleteBlob(key, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = {};
    if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    const res = await this.send(`/blobs/${encodeBlobKey(key)}`, { method: "DELETE", headers });
    if (!res.ok) throw await this.toError(res, key);
    const payload = await res.json();
    return payload.deleted;
  }
  async existsBlob(key) {
    const res = await this.send(`/blobs/${encodeBlobKey(key)}`, { method: "HEAD" });
    if (res.status === 404) return false;
    if (!res.ok) throw await this.toError(res, key);
    return true;
  }
  async listBlobs(prefix) {
    const keys = [];
    let cursor;
    for (; ; ) {
      const params = new URLSearchParams();
      if (prefix) params.set("prefix", prefix);
      if (cursor) params.set("cursor", cursor);
      const qs = params.toString();
      const res = await this.send(`/blobs${qs ? `?${qs}` : ""}`, { method: "GET" });
      if (!res.ok) throw await this.toError(res, prefix ?? "");
      const payload = await res.json();
      keys.push(...payload.keys);
      if (!payload.next_cursor) break;
      cursor = payload.next_cursor;
    }
    return keys;
  }
};

// ../core/src/mutation.ts
var CAS_MAX_ATTEMPTS = 5;
async function versionedMutation(opts) {
  const maxAttempts = opts.maxAttempts ?? CAS_MAX_ATTEMPTS;
  for (let attempt = 0; ; attempt++) {
    const { state, version } = await opts.read();
    const decision = await opts.decide(state, attempt);
    if (decision.action === "done") {
      return { result: decision.result, version, wrote: false };
    }
    try {
      const newVersion = await opts.write(decision.next, version);
      return { result: decision.result, version: newVersion, wrote: true };
    } catch (err) {
      if (err instanceof VersionConflict && attempt < maxAttempts - 1) continue;
      throw err;
    }
  }
}

// ../core/src/kinds.ts
var CONVENTIONS_PREFIX = "conventions/";
var CONVENTION_TYPE = "Convention";
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}
function setOwn(record, key, value) {
  Object.defineProperty(record, key, { value, enumerable: true, configurable: true, writable: true });
}
function isScalar(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function describeShape(value) {
  if (Array.isArray(value)) return "an array";
  if (value === null) return "null";
  if (typeof value === "object") return "an object";
  return typeof value;
}
function toStringArrayLenient(value, path23, docId, warnings) {
  if (!Array.isArray(value)) {
    if (value !== void 0) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${docId}' has a non-list '${path23}' (${describeShape(value)}; expected a list of strings); ignoring it.`,
        field: path23,
        severity: "warning"
      });
    }
    return [];
  }
  const out = [];
  for (const v of value) {
    if (isScalar(v)) {
      out.push(String(v));
    } else {
      warnings.push({
        code: "KIND_CONVENTION_BAD_MEMBER",
        message: `kind convention '${docId}' has a non-scalar member (${describeShape(v)}) in '${path23}'; skipping it.`,
        field: path23,
        severity: "warning"
      });
    }
  }
  return out;
}
var RESERVED_KIND_FIELD_NAMES = ["type", "dir", "remote", "json", "help", "body-file"];
var RESERVED_FIELD_NAMES = new Set(RESERVED_KIND_FIELD_NAMES);
var VALID_FIELDS_KEYS = /* @__PURE__ */ new Set([
  "required",
  "optional",
  "values",
  "value_descriptions",
  "terminal",
  "descriptions"
]);
var MISPLACED_TOP_LEVEL_KEYS = /* @__PURE__ */ new Set(["enum", "enums", "values", "constraints"]);
var H1_RE = /^#\s+(.+?)\s*$/gm;
function splitSections(body) {
  const out = {};
  const matches = [...body.matchAll(H1_RE)];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const name = (current[1] ?? "").trim();
    const start = (current.index ?? 0) + current[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? body.length : body.length;
    setOwn(out, name, body.slice(start, end).trim());
  }
  return out;
}
function parseConventionDoc(doc2) {
  const fm = doc2.frontmatter;
  const governs = typeof fm.governs === "string" ? fm.governs.trim() : "";
  if (governs === "") {
    return { ok: false, reason: "missing or empty 'governs' field", warnings: [] };
  }
  const warnings = [];
  for (const key of MISPLACED_TOP_LEVEL_KEYS) {
    if (key in fm) {
      warnings.push({
        code: "KIND_CONVENTION_MISPLACED_KEY",
        message: `kind convention '${doc2.id}' declares a top-level '${key}' key, which core does not read; enum constraints go under 'fields.values.<field>: [...]', not '${key}'.`,
        field: key,
        severity: "warning"
      });
    }
  }
  const fieldsSource = fm.fields;
  let fieldsRaw = {};
  if (fieldsSource === void 0) {
  } else if (!isPlainObject2(fieldsSource)) {
    warnings.push({
      code: "KIND_CONVENTION_BAD_SHAPE",
      message: `kind convention '${doc2.id}' has a non-map 'fields' key (${describeShape(fieldsSource)}; expected a map with required/optional/values/value_descriptions/descriptions); ignoring it.`,
      field: "fields",
      severity: "warning"
    });
  } else {
    fieldsRaw = fieldsSource;
    for (const key of Object.keys(fieldsRaw)) {
      if (!VALID_FIELDS_KEYS.has(key)) {
        warnings.push({
          code: "KIND_CONVENTION_UNKNOWN_FIELDS_KEY",
          message: `kind convention '${doc2.id}' declares an unrecognized key 'fields.${key}' (valid keys: fields.required, fields.optional, fields.values, fields.value_descriptions, fields.terminal, fields.descriptions); ignoring it.`,
          field: `fields.${key}`,
          severity: "warning"
        });
      }
    }
  }
  const reservedFieldsIgnored = /* @__PURE__ */ new Set();
  const reservedFieldPaths = /* @__PURE__ */ new Set();
  const dropReserved = (name, semanticPath) => {
    if (!RESERVED_FIELD_NAMES.has(name)) return false;
    reservedFieldsIgnored.add(name);
    reservedFieldPaths.add(semanticPath);
    return true;
  };
  const required = toStringArrayLenient(fieldsRaw.required, "fields.required", doc2.id, warnings).filter(
    (f) => !dropReserved(f, `fields.required.${f}`)
  );
  const optional = toStringArrayLenient(fieldsRaw.optional, "fields.optional", doc2.id, warnings).filter(
    (f) => !dropReserved(f, `fields.optional.${f}`)
  );
  const valuesSource = fieldsRaw.values;
  const values = {};
  if (valuesSource !== void 0) {
    if (!isPlainObject2(valuesSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'fields.values' (${describeShape(valuesSource)}; expected a map of field name -> list of allowed values); ignoring it.`,
        field: "fields.values",
        severity: "warning"
      });
    } else {
      for (const [field, allowed] of Object.entries(valuesSource)) {
        if (dropReserved(field, `fields.values.${field}`)) continue;
        setOwn(values, field, toStringArrayLenient(allowed, `fields.values.${field}`, doc2.id, warnings));
      }
    }
  }
  const declaredFieldNames = /* @__PURE__ */ new Set([...required, ...optional]);
  for (const field of Object.keys(values)) {
    if (!declaredFieldNames.has(field)) {
      warnings.push({
        code: "KIND_CONVENTION_UNDECLARED_VALUES_FIELD",
        message: `kind convention '${doc2.id}' declares 'fields.values.${field}' but '${field}' is not in fields.required or fields.optional.`,
        field: `fields.values.${field}`,
        severity: "warning"
      });
    }
  }
  const valueDescriptionsSource = fieldsRaw.value_descriptions;
  const valueDescriptions = {};
  if (valueDescriptionsSource !== void 0) {
    if (!isPlainObject2(valueDescriptionsSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'fields.value_descriptions' (${describeShape(valueDescriptionsSource)}; expected a map of enum field -> allowed value -> non-empty description); ignoring it.`,
        field: "fields.value_descriptions",
        severity: "warning"
      });
    } else {
      for (const [field, rawValueDescriptions] of Object.entries(valueDescriptionsSource)) {
        const fieldPath = `fields.value_descriptions.${field}`;
        if (!isPlainObject2(rawValueDescriptions)) {
          warnings.push({
            code: "KIND_CONVENTION_BAD_SHAPE",
            message: `kind convention '${doc2.id}' has a non-map '${fieldPath}' (${describeShape(rawValueDescriptions)}; expected a map of allowed value -> non-empty description); ignoring it.`,
            field: fieldPath,
            severity: "warning"
          });
          continue;
        }
        if (!hasOwn(values, field)) {
          warnings.push({
            code: "KIND_CONVENTION_UNDECLARED_VALUE_DESCRIPTION_FIELD",
            message: `kind convention '${doc2.id}' declares '${fieldPath}' but '${field}' has no 'fields.values.${field}' enum declared; skipping it.`,
            field: fieldPath,
            severity: "warning"
          });
          continue;
        }
        const allowed = values[field];
        const parsed = {};
        for (const [value, rawDescription] of Object.entries(rawValueDescriptions)) {
          const valuePath = `${fieldPath}.${value}`;
          if (typeof rawDescription !== "string" || rawDescription.trim() === "") {
            warnings.push({
              code: "KIND_CONVENTION_BAD_MEMBER",
              message: `kind convention '${doc2.id}' has a malformed '${valuePath}' (${describeShape(rawDescription)}; expected a non-empty string); skipping it.`,
              field: valuePath,
              severity: "warning"
            });
            continue;
          }
          if (!allowed.includes(value)) {
            warnings.push({
              code: "KIND_CONVENTION_UNDECLARED_VALUE_DESCRIPTION_VALUE",
              message: `kind convention '${doc2.id}' declares '${valuePath}' but '${value}' is not one of the declared 'fields.values.${field}' values (${allowed.join(", ")}); skipping it.`,
              field: valuePath,
              severity: "warning"
            });
            continue;
          }
          setOwn(parsed, value, rawDescription.trim());
        }
        if (Object.keys(parsed).length > 0) setOwn(valueDescriptions, field, parsed);
      }
    }
  }
  const descriptionsSource = fieldsRaw.descriptions;
  const descriptions = {};
  if (descriptionsSource !== void 0) {
    if (!isPlainObject2(descriptionsSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'fields.descriptions' (${describeShape(descriptionsSource)}; expected a map of field name -> non-empty description); ignoring it.`,
        field: "fields.descriptions",
        severity: "warning"
      });
    } else {
      for (const [field, rawDescription] of Object.entries(descriptionsSource)) {
        if (dropReserved(field, `fields.descriptions.${field}`)) continue;
        if (typeof rawDescription !== "string" || rawDescription.trim() === "") {
          warnings.push({
            code: "KIND_CONVENTION_BAD_MEMBER",
            message: `kind convention '${doc2.id}' has a malformed 'fields.descriptions.${field}' (${describeShape(rawDescription)}; expected a non-empty string); skipping it.`,
            field: `fields.descriptions.${field}`,
            severity: "warning"
          });
          continue;
        }
        setOwn(descriptions, field, rawDescription.trim());
        if (!declaredFieldNames.has(field)) {
          warnings.push({
            code: "KIND_CONVENTION_UNDECLARED_DESCRIPTION_FIELD",
            message: `kind convention '${doc2.id}' declares 'fields.descriptions.${field}' but '${field}' is not in fields.required or fields.optional.`,
            field: `fields.descriptions.${field}`,
            severity: "warning"
          });
        }
      }
    }
  }
  const terminalSource = fieldsRaw.terminal;
  const terminal = {};
  if (terminalSource !== void 0) {
    if (!isPlainObject2(terminalSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'fields.terminal' (${describeShape(terminalSource)}; expected a map of field name -> list of terminal values); ignoring it.`,
        field: "fields.terminal",
        severity: "warning"
      });
    } else {
      for (const [field, terminalValues] of Object.entries(terminalSource)) {
        if (dropReserved(field, `fields.terminal.${field}`)) continue;
        setOwn(terminal, field, toStringArrayLenient(terminalValues, `fields.terminal.${field}`, doc2.id, warnings));
      }
    }
  }
  for (const field of Object.keys(terminal)) {
    if (!hasOwn(values, field)) {
      warnings.push({
        code: "KIND_CONVENTION_TERMINAL_UNDECLARED_FIELD",
        message: `kind convention '${doc2.id}' declares 'fields.terminal.${field}' but '${field}' has no 'fields.values.${field}' enum declared.`,
        field: `fields.terminal.${field}`,
        severity: "warning"
      });
      continue;
    }
    const allowed = values[field];
    for (const v of terminal[field]) {
      if (!allowed.includes(v)) {
        warnings.push({
          code: "KIND_CONVENTION_TERMINAL_VALUE",
          message: `kind convention '${doc2.id}' declares terminal value '${v}' for field '${field}' but it is not one of the declared 'fields.values.${field}' values (${allowed.join(", ")}).`,
          field: `fields.terminal.${field}`,
          severity: "warning"
        });
      }
    }
  }
  const linksSource = fm.links;
  let links;
  if (linksSource !== void 0) {
    if (!isPlainObject2(linksSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'links' key (${describeShape(linksSource)}; expected a map of link type name -> target kind); ignoring it.`,
        field: "links",
        severity: "warning"
      });
    } else {
      const parsed = {};
      for (const [linkType, target] of Object.entries(linksSource)) {
        const name = linkType.trim();
        if (name === "" || !isScalar(target) || String(target).trim() === "") {
          warnings.push({
            code: "KIND_CONVENTION_BAD_MEMBER",
            message: `kind convention '${doc2.id}' has a malformed 'links' entry ('${linkType}': ${describeShape(target)}; expected 'link type name: target kind'); skipping it.`,
            field: `links.${linkType}`,
            severity: "warning"
          });
          continue;
        }
        setOwn(parsed, name, String(target).trim());
      }
      if (Object.keys(parsed).length > 0) links = parsed;
    }
  }
  const linkDescriptionsSource = fm.link_descriptions;
  let linkDescriptions;
  if (linkDescriptionsSource !== void 0) {
    if (!isPlainObject2(linkDescriptionsSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'link_descriptions' key (${describeShape(linkDescriptionsSource)}; expected a map of declared link type name -> non-empty description); ignoring it.`,
        field: "link_descriptions",
        severity: "warning"
      });
    } else {
      const parsed = {};
      for (const [linkType, rawDescription] of Object.entries(linkDescriptionsSource)) {
        const name = linkType.trim();
        const semanticPath = `link_descriptions.${linkType}`;
        if (name === "" || typeof rawDescription !== "string" || rawDescription.trim() === "") {
          warnings.push({
            code: "KIND_CONVENTION_BAD_MEMBER",
            message: `kind convention '${doc2.id}' has a malformed '${semanticPath}' (${describeShape(rawDescription)}; expected a declared link type name with a non-empty string description); skipping it.`,
            field: semanticPath,
            severity: "warning"
          });
          continue;
        }
        if (!links || !hasOwn(links, name)) {
          warnings.push({
            code: "KIND_CONVENTION_UNDECLARED_LINK_DESCRIPTION",
            message: `kind convention '${doc2.id}' declares '${semanticPath}' but '${name}' is not declared in links.`,
            field: semanticPath,
            severity: "warning"
          });
          continue;
        }
        setOwn(parsed, name, rawDescription.trim());
      }
      if (Object.keys(parsed).length > 0) linkDescriptions = parsed;
    }
  }
  const expectsInboundSource = fm.expects_inbound;
  let expectsInbound;
  if (expectsInboundSource !== void 0) {
    if (!isPlainObject2(expectsInboundSource)) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has a non-map 'expects_inbound' key (${describeShape(expectsInboundSource)}; expected a map of link type name -> expected source kind); ignoring it.`,
        field: "expects_inbound",
        severity: "warning"
      });
    } else {
      const parsed = {};
      for (const [linkType, source] of Object.entries(expectsInboundSource)) {
        const name = linkType.trim();
        if (name === "" || !isScalar(source) || String(source).trim() === "") {
          warnings.push({
            code: "KIND_CONVENTION_BAD_MEMBER",
            message: `kind convention '${doc2.id}' has a malformed 'expects_inbound' entry ('${linkType}': ${describeShape(source)}; expected 'link type name: expected source kind'); skipping it.`,
            field: `expects_inbound.${linkType}`,
            severity: "warning"
          });
          continue;
        }
        setOwn(parsed, name, String(source).trim());
      }
      if (Object.keys(parsed).length > 0) expectsInbound = parsed;
    }
  }
  const sections = Array.isArray(fm.sections) ? fm.sections.filter((s) => typeof s === "string" && s.trim() !== "") : void 0;
  const title = typeof fm.title === "string" && fm.title.trim() !== "" ? fm.title.trim() : governs;
  let description;
  if (fm.description !== void 0) {
    if (typeof fm.description === "string" && fm.description.trim() !== "") {
      description = fm.description.trim();
    } else {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${doc2.id}' has an invalid 'description' (${describeShape(fm.description)}; expected a non-empty string); ignoring it.`,
        field: "description",
        severity: "warning"
      });
    }
  }
  const path23 = typeof fm.path === "string" && fm.path.trim() !== "" ? fm.path.trim() : void 0;
  const freshnessHorizon = typeof fm.freshness_horizon === "string" && fm.freshness_horizon.trim() !== "" ? fm.freshness_horizon.trim() : void 0;
  const kind2 = {
    id: doc2.id,
    title,
    governs,
    fields: { required, optional, values, valueDescriptions, terminal, descriptions }
  };
  if (description !== void 0) kind2.description = description;
  if (path23 !== void 0) kind2.path = path23;
  if (links !== void 0) kind2.links = links;
  if (linkDescriptions !== void 0) kind2.linkDescriptions = linkDescriptions;
  if (expectsInbound !== void 0) kind2.expectsInbound = expectsInbound;
  if (sections && sections.length > 0) kind2.sections = sections;
  if (freshnessHorizon !== void 0) kind2.freshnessHorizon = freshnessHorizon;
  return {
    ok: true,
    kind: kind2,
    reservedFieldsIgnored: [...reservedFieldsIgnored].sort(),
    reservedFieldPaths: [...reservedFieldPaths].sort(),
    warnings
  };
}
var HORIZON_RE = /^(\d+)(m|h|d)$/;
var HORIZON_UNIT_MS = { m: 6e4, h: 36e5, d: 864e5 };
function freshnessHorizonMs(kind2) {
  const raw = kind2.freshnessHorizon;
  if (raw === void 0) return void 0;
  const m = HORIZON_RE.exec(raw);
  if (!m) return void 0;
  const n = Number(m[1]);
  if (n <= 0) return void 0;
  const unit = m[2];
  return n * HORIZON_UNIT_MS[unit];
}
function isPresent(value) {
  if (value === void 0 || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
function validateAgainstKind(doc2, kind2) {
  const warnings = [];
  const fm = doc2.frontmatter;
  for (const field of kind2.fields.required) {
    if (!hasOwn(fm, field) || !isPresent(fm[field])) {
      warnings.push({
        code: "KIND_FIELD_MISSING",
        message: `'${kind2.governs}' requires a non-empty '${field}' field (declared by ${kind2.id}).`,
        field,
        severity: "warning"
      });
    }
  }
  for (const [field, allowed] of Object.entries(kind2.fields.values)) {
    if (!hasOwn(fm, field)) continue;
    const raw = fm[field];
    if (raw === void 0 || raw === null) continue;
    if (Array.isArray(raw)) {
      warnings.push({
        code: "KIND_FIELD_ARITY",
        message: `'${field}' is enum-restricted and takes exactly ONE value for '${kind2.governs}'; got ${raw.length} (${raw.map((v) => String(v)).join(", ")}).`,
        field,
        severity: "warning"
      });
    }
    const allowedStrs = allowed.map((v) => String(v));
    const actual = (Array.isArray(raw) ? raw : [raw]).map((v) => String(v));
    for (const v of actual) {
      if (!allowedStrs.includes(v)) {
        warnings.push({
          code: "KIND_FIELD_VALUE",
          message: `'${field}' value '${v}' is not one of the allowed values for '${kind2.governs}': ${allowedStrs.join(", ")}.`,
          field,
          severity: "warning"
        });
      }
    }
  }
  if (kind2.sections && kind2.sections.length > 0) {
    const sections = splitSections(doc2.body ?? "");
    for (const heading of kind2.sections) {
      if (!hasOwn(sections, heading)) {
        warnings.push({
          code: "KIND_SECTION_MISSING",
          message: `'${kind2.governs}' expects a '# ${heading}' body section (declared by ${kind2.id}).`,
          field: heading,
          severity: "warning"
        });
      }
    }
  }
  return warnings;
}
function defaultTimestampAndValidateAgainstRegistry(doc2, registry) {
  if (typeof doc2.frontmatter.timestamp !== "string" || doc2.frontmatter.timestamp.trim() === "") {
    doc2.frontmatter.timestamp = (/* @__PURE__ */ new Date()).toISOString();
  }
  const kind2 = registry.kinds.get(String(doc2.frontmatter.type));
  if (!kind2) return { warnings: [] };
  return { kind: kind2, warnings: validateAgainstKind(doc2, kind2) };
}
function isTerminal(kind2, frontmatter) {
  const fm = frontmatter;
  for (const [field, terminalValues] of Object.entries(kind2.fields.terminal)) {
    if (!hasOwn(fm, field)) continue;
    const raw = fm[field];
    if (raw === void 0 || raw === null) continue;
    const actual = (Array.isArray(raw) ? raw : [raw]).map((v) => String(v));
    if (actual.some((v) => terminalValues.includes(v))) return true;
  }
  return false;
}
function kindConventionDoc(kind2, prose, timestamp) {
  const fields = { required: kind2.fields.required, optional: kind2.fields.optional };
  if (Object.keys(kind2.fields.values).length > 0) fields.values = kind2.fields.values;
  const valueDescriptions = Object.fromEntries(
    Object.entries(kind2.fields.valueDescriptions ?? {}).filter(([field]) => hasOwn(kind2.fields.values, field)).map(([field, descriptions2]) => {
      const allowed = kind2.fields.values[field];
      const validDescriptions = Object.fromEntries(
        Object.entries(descriptions2).filter(
          ([value, description]) => hasOwn(descriptions2, value) && allowed.includes(value) && typeof description === "string" && description.trim() !== ""
        ).map(([value, description]) => [value, description.trim()])
      );
      return [field, validDescriptions];
    }).filter(([, descriptions2]) => Object.keys(descriptions2).length > 0)
  );
  if (Object.keys(valueDescriptions).length > 0) fields.value_descriptions = valueDescriptions;
  if (Object.keys(kind2.fields.terminal).length > 0) fields.terminal = kind2.fields.terminal;
  const descriptions = Object.fromEntries(
    Object.entries(kind2.fields.descriptions).filter((entry) => typeof entry[1] === "string" && entry[1].trim() !== "").map(([field, description]) => [field, description.trim()])
  );
  if (Object.keys(descriptions).length > 0) fields.descriptions = descriptions;
  const frontmatter = { type: CONVENTION_TYPE, title: kind2.title, governs: kind2.governs, timestamp };
  if (typeof kind2.description === "string" && kind2.description.trim() !== "") {
    frontmatter.description = kind2.description.trim();
  }
  if (kind2.path !== void 0) frontmatter.path = kind2.path;
  if (kind2.links && Object.keys(kind2.links).length > 0) frontmatter.links = kind2.links;
  const linkDescriptions = Object.fromEntries(
    Object.entries(kind2.linkDescriptions ?? {}).filter(
      (entry) => Boolean(kind2.links && hasOwn(kind2.links, entry[0])) && typeof entry[1] === "string" && entry[1].trim() !== ""
    ).map(([linkType, description]) => [linkType, description.trim()])
  );
  if (Object.keys(linkDescriptions).length > 0) frontmatter.link_descriptions = linkDescriptions;
  if (kind2.expectsInbound && Object.keys(kind2.expectsInbound).length > 0) {
    frontmatter.expects_inbound = kind2.expectsInbound;
  }
  frontmatter.fields = fields;
  if (kind2.sections && kind2.sections.length > 0) frontmatter.sections = kind2.sections;
  if (kind2.freshnessHorizon !== void 0) frontmatter.freshness_horizon = kind2.freshnessHorizon;
  return { id: kind2.id, frontmatter, body: prose };
}

// ../core/src/document-mutation.ts
var DEFAULT_MAX_ATTEMPTS = 5;
var KindConformanceError = class extends InvalidInputError {
  id;
  governs;
  violations;
  constructor(id, governs, violations) {
    super(`'${id}' does not satisfy the '${governs}' kind: ${violations.map((warning) => warning.message).join("; ")}`);
    this.name = "KindConformanceError";
    this.id = id;
    this.governs = governs;
    this.violations = violations;
  }
};
var DocumentNotFoundError = class extends Error {
  id;
  constructor(id) {
    super(`no concept document at id '${id}'`);
    this.name = "DocumentNotFoundError";
    this.id = id;
  }
};
function valuesEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((value, index) => valuesEqual(value, b[index]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const aRecord = a;
    const bRecord = b;
    const aKeys = Object.keys(aRecord);
    const bKeys = Object.keys(bRecord);
    return aKeys.length === bKeys.length && aKeys.every((key) => valuesEqual(aRecord[key], bRecord[key]));
  }
  return false;
}
function isNoopPatch(existing, candidate, compareTimestamp) {
  if (candidate.body !== existing.body) return false;
  if (compareTimestamp) return valuesEqual(existing.frontmatter, candidate.frontmatter);
  const { timestamp: _existingTimestamp, ...existingRest } = existing.frontmatter;
  const { timestamp: _candidateTimestamp, ...candidateRest } = candidate.frontmatter;
  return valuesEqual(existingRest, candidateRest);
}
function attributeCandidate(candidate, actor, persistActor) {
  if (!persistActor || actor === void 0) return candidate;
  return { ...candidate, frontmatter: { ...candidate.frontmatter, actor } };
}
function validateCandidate(id, candidate, registry, strict) {
  const result = defaultTimestampAndValidateAgainstRegistry({ id, ...candidate }, registry);
  if (strict && result.kind && result.warnings.length > 0) {
    throw new KindConformanceError(id, result.kind.governs, result.warnings);
  }
  return result;
}
function conforms(existing, registry) {
  const kind2 = registry.kinds.get(String(existing.frontmatter.type));
  if (!kind2) return false;
  return validateAgainstKind(existing, kind2).length === 0;
}
async function mutateDocument(opts) {
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;
  const persistActor = opts.persistActor ?? false;
  if (opts.mode === "create-only") {
    const candidate = attributeCandidate(await opts.buildCandidate(void 0), opts.actor, persistActor);
    const { warnings } = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
    const { doc: doc2, version } = await writeDocVersioned(opts.bundle, { id: opts.id, ...candidate }, {
      expectedVersion: null,
      actor: opts.actor
    });
    return { doc: doc2, changed: true, version, warnings };
  }
  const readExisting = async () => {
    try {
      const { doc: doc2, version } = await readDocVersioned(opts.bundle, opts.id);
      return { state: doc2, version };
    } catch (error) {
      if (error?.code === "ENOENT") return { state: void 0, version: null };
      throw error;
    }
  };
  if (opts.mode === "overwrite") {
    let savedDoc2;
    let warnings = [];
    const outcome2 = await versionedMutation({
      read: readExisting,
      decide: async (existing) => {
        const candidate = attributeCandidate(await opts.buildCandidate(existing), opts.actor, persistActor);
        const validated = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
        warnings = validated.warnings;
        if (!opts.strict && existing && warnings.length > 0 && conforms(existing, opts.registry)) {
          throw new KindConformanceError(opts.id, validated.kind.governs, warnings);
        }
        return { action: "write", next: { id: opts.id, ...candidate }, result: void 0 };
      },
      write: async (next, expectedVersion) => {
        const written = await writeDocVersioned(opts.bundle, next, { expectedVersion, actor: opts.actor });
        savedDoc2 = written.doc;
        return written.version;
      },
      maxAttempts
    });
    return { doc: savedDoc2, changed: true, version: outcome2.version, warnings };
  }
  let lastReadVersion = null;
  let savedDoc;
  const hardCas = opts.expectedVersion !== void 0;
  const outcome = await versionedMutation({
    read: async () => {
      const read = await readExisting();
      lastReadVersion = read.version;
      if (read.state === void 0 && onAbsent === "fail") throw new DocumentNotFoundError(opts.id);
      return read;
    },
    decide: async (existing) => {
      if (hardCas && lastReadVersion !== opts.expectedVersion) {
        throw new VersionConflict(opts.id, opts.expectedVersion, lastReadVersion);
      }
      const candidate = await opts.buildCandidate(existing);
      if (existing && isNoopPatch(existing, candidate, compareTimestamp)) {
        return { action: "done", result: { doc: existing, warnings: [] } };
      }
      const attributed = attributeCandidate(candidate, opts.actor, persistActor);
      const { warnings } = validateCandidate(opts.id, attributed, opts.registry, opts.strict);
      return { action: "write", next: { id: opts.id, ...attributed }, result: { warnings } };
    },
    write: async (next, expectedVersion) => {
      const written = await writeDocVersioned(opts.bundle, next, {
        expectedVersion: hardCas ? opts.expectedVersion : expectedVersion,
        actor: opts.actor
      });
      savedDoc = written.doc;
      return written.version;
    },
    maxAttempts: hardCas ? 1 : maxAttempts
  });
  return outcome.wrote ? { doc: savedDoc, changed: true, version: outcome.version, warnings: outcome.result.warnings } : { doc: outcome.result.doc, changed: false, version: outcome.version, warnings: [] };
}

// ../core/src/index-projection.ts
var IndexProjectionWriteError = class extends Error {
  name = "IndexProjectionWriteError";
  failed;
  completed;
  pending;
  constructor(failed, completed, pending, cause) {
    super(`index projection write failed at '${displayDir(failed)}'`, { cause });
    this.failed = failed;
    this.completed = completed;
    this.pending = pending;
  }
};
function displayDir(dir) {
  return dir === "" ? "index.md" : `${dir}/index.md`;
}
function inlineText(value) {
  if (typeof value !== "string") return void 0;
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed === "" ? void 0 : collapsed;
}
function escapeLabel(value) {
  return value.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}
function hrefSegment(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}
function ensureDirectory(map, dir) {
  const existing = map.get(dir);
  if (existing) return existing;
  const created = { direct: [], children: /* @__PURE__ */ new Set() };
  map.set(dir, created);
  return created;
}
function depth(dir) {
  return dir === "" ? 0 : dir.split("/").length;
}
function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function planIndexProjection(displayName, heads) {
  const directories = /* @__PURE__ */ new Map();
  ensureDirectory(directories, "");
  for (const head of heads) {
    assertSafeConceptId(head.id);
    const normalized = toPosix(head.id).replace(/^\.\//, "");
    const segments = normalized.split("/");
    const conceptName = segments.pop();
    let parent = "";
    for (const child of segments) {
      const next = parent === "" ? child : `${parent}/${child}`;
      ensureDirectory(directories, parent).children.add(child);
      ensureDirectory(directories, next);
      parent = next;
    }
    ensureDirectory(directories, parent).direct.push({ ...head, id: parent === "" ? conceptName : `${parent}/${conceptName}` });
  }
  const rootTitle = inlineText(displayName) ?? "bundle";
  const targets = [...directories.entries()].sort(([a], [b]) => compareText(a, b)).map(([dir, projection]) => {
    const groups = /* @__PURE__ */ new Map();
    const prefix = dir === "" ? "" : `${dir}/`;
    for (const head of projection.direct) {
      const fileName = head.id.slice(prefix.length);
      const type = inlineText(head.frontmatter.type) ?? "Concept";
      const title2 = inlineText(head.frontmatter.title) ?? fileName;
      const description = inlineText(head.frontmatter.description);
      const href = `${hrefSegment(fileName)}.md`;
      const bullet = `* [${escapeLabel(title2)}](${href})${description ? ` - ${description}` : ""}`;
      const group = groups.get(type) ?? [];
      group.push(bullet);
      groups.set(type, group);
    }
    const sections = [];
    for (const type of [...groups.keys()].sort()) {
      sections.push(`# ${type}

${groups.get(type).sort().join("\n")}
`);
    }
    if (projection.children.size > 0) {
      const bullets = [...projection.children].sort().map((child) => `* [${escapeLabel(child)}](${hrefSegment(child)}/index.md)`);
      sections.push(`# Subdirectories

${bullets.join("\n")}
`);
    }
    const title = dir === "" ? rootTitle : inlineText(dir.split("/").pop()) ?? "directory";
    const body = `${GENERATED_INDEX_MARKER}
# ${title}

${sections.join("\n")}`.trimEnd() + "\n";
    return { dir, body };
  });
  return { targets };
}
function markerOwnership(body) {
  const lines = body.split("\n");
  const exact = lines.filter((line2) => line2 === GENERATED_INDEX_MARKER).length;
  const markerLike = lines.filter(
    (line2) => /^\s*<!--\s*agentstate-lite:generated-index(?::[^>]*)?\s*-->\s*$/.test(line2)
  ).length;
  if (exact > 1) return { owned: false, reason: "duplicate-marker" };
  if (exact === 1 && markerLike === 1 && lines[0] === GENERATED_INDEX_MARKER) return { owned: true };
  if (markerLike > 0) return { owned: false, reason: "malformed-marker" };
  return { owned: false, reason: "unmarked" };
}
function inspectExisting(dir, content) {
  if (dir === "") {
    try {
      const { frontmatter, body } = parseMarkdown(content, "index.md");
      const keys = Object.keys(frontmatter);
      if (keys.length !== 1 || keys[0] !== "okf_version" || typeof frontmatter.okf_version !== "string") {
        return { owned: false, body, reason: "malformed-root" };
      }
      return {
        ...markerOwnership(body),
        body,
        okfVersion: frontmatter.okf_version
      };
    } catch {
      return { owned: false, body: content, reason: "malformed-root" };
    }
  }
  try {
    const { frontmatter, body } = parseMarkdown(content, `${dir}/index.md`);
    if (Object.keys(frontmatter).length > 0) {
      return { owned: false, body, reason: "nested-frontmatter" };
    }
    return { ...markerOwnership(body), body };
  } catch {
    return { owned: false, body: content, reason: "nested-frontmatter" };
  }
}
function desiredContent(dir, body, okfVersion) {
  return dir === "" ? stringifyWithData({ okf_version: okfVersion ?? "0.1" }, body) : body;
}
async function prepareIndexProjection(bundle, plan, options2 = {}) {
  const backend = backendFor(bundle);
  const targets = [];
  for (const planned of plan.targets) {
    const current = await backend.readReserved(planned.dir, "index.md");
    if (current === null) {
      targets.push({
        dir: planned.dir,
        content: desiredContent(planned.dir, planned.body),
        expectedVersion: null,
        disposition: "missing"
      });
      continue;
    }
    const ownership = inspectExisting(planned.dir, current.content);
    const content = desiredContent(planned.dir, planned.body, ownership.okfVersion);
    if (ownership.owned) {
      targets.push({
        dir: planned.dir,
        content,
        expectedVersion: current.version,
        disposition: current.content === content ? "unchanged" : "generated"
      });
    } else if (options2.force) {
      targets.push({
        dir: planned.dir,
        content,
        expectedVersion: current.version,
        disposition: "adopted",
        ...ownership.reason ? { reason: ownership.reason } : {}
      });
    } else {
      targets.push({
        dir: planned.dir,
        content,
        expectedVersion: current.version,
        disposition: "refused",
        ...ownership.reason ? { reason: ownership.reason } : {}
      });
    }
  }
  const refused = targets.filter((target) => target.disposition === "refused");
  return refused.length > 0 ? { ready: false, targets, refused } : { ready: true, targets, refused: [] };
}
function writableDisposition(disposition) {
  return disposition === "missing" || disposition === "generated" || disposition === "adopted";
}
async function applyIndexProjection(bundle, prepared, options2 = {}) {
  if (!prepared.ready) {
    throw new InvalidInputError("Cannot apply a refused index projection; re-prepare with explicit force to adopt it.");
  }
  const backend = backendFor(bundle);
  const unchanged = prepared.targets.filter((target) => target.disposition === "unchanged").map((target) => target.dir);
  const writable = prepared.targets.filter(
    (target) => writableDisposition(target.disposition)
  ).sort((a, b) => depth(b.dir) - depth(a.dir) || compareText(a.dir, b.dir));
  const completed = [];
  for (let index = 0; index < writable.length; index++) {
    const target = writable[index];
    try {
      const version = await backend.writeReserved(target.dir, "index.md", target.content, {
        expectedVersion: target.expectedVersion,
        ...options2.actor !== void 0 ? { actor: options2.actor } : {}
      });
      completed.push({ dir: target.dir, disposition: target.disposition, version });
    } catch (cause) {
      throw new IndexProjectionWriteError(
        target.dir,
        completed,
        writable.slice(index + 1).map((pending) => pending.dir),
        cause
      );
    }
  }
  return { completed, unchanged, pending: [] };
}

// ../core/src/kinds-load.ts
async function loadKinds(bundle) {
  const kinds2 = /* @__PURE__ */ new Map();
  const warnings = [];
  const docs = await query(bundle, { prefix: CONVENTIONS_PREFIX, type: CONVENTION_TYPE }, {
    onSkip: ({ id, reason }) => warnings.push({
      code: "KIND_CONVENTION_MALFORMED",
      message: `skipped kind convention '${id}' with unparseable frontmatter: ${reason}`,
      field: id,
      severity: "warning"
    })
  });
  for (const doc2 of docs) {
    const parsed = parseConventionDoc(doc2);
    if (!parsed.ok) {
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `skipped malformed kind convention '${doc2.id}': ${parsed.reason}`,
        field: doc2.id,
        severity: "warning"
      });
      continue;
    }
    const { kind: kind2, reservedFieldsIgnored, reservedFieldPaths } = parsed;
    warnings.push(...parsed.warnings);
    if (reservedFieldsIgnored.length > 0) {
      warnings.push({
        code: "KIND_RESERVED_FIELD",
        message: `kind convention '${doc2.id}' declares reserved field name(s) ${reservedFieldsIgnored.join(", ")} (reserved by the CLI: ${RESERVED_KIND_FIELD_NAMES.join("/")}); ignoring them \u2014 rename those domain fields before authoring instances.`,
        field: reservedFieldPaths.join(","),
        severity: "warning"
      });
    }
    if (kinds2.has(kind2.governs)) {
      warnings.push({
        code: "KIND_DUPLICATE_GOVERNS",
        message: `duplicate kind convention for '${kind2.governs}': '${doc2.id}' ignored, keeping the first-declared '${kinds2.get(kind2.governs).id}'.`,
        field: kind2.governs,
        severity: "warning"
      });
      continue;
    }
    if (kind2.freshnessHorizon !== void 0 && freshnessHorizonMs(kind2) === void 0) {
      warnings.push({
        code: "KIND_HORIZON_MALFORMED",
        message: `kind convention '${doc2.id}' has a malformed freshness_horizon '${kind2.freshnessHorizon}' (expected <n>(m|h|d)); ignoring it.`,
        field: "freshness_horizon",
        severity: "warning"
      });
    }
    kinds2.set(kind2.governs, kind2);
  }
  return { kinds: kinds2, warnings };
}

// ../board-git/src/errors.ts
var BOARD_GIT_ERROR_CODES = [
  "GIT_MISSING",
  "TRANSIENT",
  "GIT_BUSY",
  "NO_UPSTREAM",
  "AUTH_REQUIRED",
  "CONFLICT",
  "RUNTIME"
];
var BoardGitError = class extends Error {
  code;
  details;
  help;
  constructor(code, message, opts = {}) {
    super(message);
    this.name = "BoardGitError";
    this.code = code;
    if (opts.details !== void 0) this.details = opts.details;
    if (opts.help !== void 0) this.help = opts.help;
  }
};
function isBoardGitError(v) {
  if (typeof v !== "object" || v === null) return false;
  const candidate = v;
  return candidate.name === "BoardGitError" && typeof candidate.code === "string" && BOARD_GIT_ERROR_CODES.includes(candidate.code) && typeof candidate.message === "string";
}
function firstGitLine(f) {
  const line2 = f.stderr.split("\n").find((l) => l.trim().length > 0) ?? f.stdout.split("\n").find((l) => l.trim().length > 0) ?? "";
  return line2.trim();
}
function classifyGitError(f) {
  const op = f.args[0] ?? "git";
  const text = `${f.stderr}
${f.stdout}`;
  if (f.spawnErrorCode === "ENOENT") {
    return new BoardGitError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
      details: { op },
      help: "install git (https://git-scm.com/downloads), then re-run the command"
    });
  }
  if (f.timedOut || f.spawnErrorCode === "ETIMEDOUT") {
    return new BoardGitError("TRANSIENT", `git ${op} timed out \u2014 the network or repository may be slow; retry`, {
      details: { op, retryable: true }
    });
  }
  if (/index\.lock|Another git process seems to be running/i.test(text)) {
    return new BoardGitError(
      "GIT_BUSY",
      "another git process is using this repository \u2014 retry once it finishes",
      { details: { op, retryable: true } }
    );
  }
  if (op === "push" && (/\[rejected\].*\((?:fetch first|non-fast-forward)\)/i.test(text) || /Updates were rejected because (?:the remote contains work|the tip of your current branch is behind)/i.test(text))) {
    return new BoardGitError(
      "TRANSIENT",
      "a teammate pushed to the board at the same time \u2014 re-run sync to incorporate their changes and retry",
      { details: { op, retryable: true, reason: "non-fast-forward" } }
    );
  }
  if (/'origin' does not appear to be a git repository/i.test(text) || /No such remote:? '?origin'?/i.test(text) || /invalid upstream ['"]?origin\//i.test(text) || /origin\/[^\s]+ - not something we can merge/i.test(text) || /couldn'?t find remote ref/i.test(text) || /src refspec [^\s]+ does not match any/i.test(text)) {
    return new BoardGitError(
      "NO_UPSTREAM",
      "the board branch isn't linked to a remote yet \u2014 sync can't share it",
      { details: { op } }
    );
  }
  if (/authentication failed/i.test(text) || /could not read (Username|Password)/i.test(text) || /Permission denied \(publickey/i.test(text) || /returned error: 40[13]/i.test(text) || /Repository not found/i.test(text) || /does not appear to be a git repository/i.test(text) || /access denied|Invalid username or password/i.test(text)) {
    return new BoardGitError(
      "AUTH_REQUIRED",
      `git ${op} was denied access to the remote (or the repository is not visible to your credentials)`,
      { details: { op, best_effort: true } }
    );
  }
  if (/You are not currently on a branch|HEAD detached/i.test(text)) {
    return new BoardGitError(
      "RUNTIME",
      "the board worktree is in a detached-HEAD state \u2014 sync needs the board branch checked out",
      { details: { op, state: "detached-head" } }
    );
  }
  if (/needs merge/i.test(text) || /unmerged files/i.test(text) || /not possible because you have unmerged/i.test(text) || /Resolve all conflicts/i.test(text)) {
    return new BoardGitError("CONFLICT", "the board worktree has unresolved conflicts", { details: { op } });
  }
  if (/Could not resolve host|unable to access|Connection (refused|timed out|reset)|Operation timed out|network is unreachable|Failed to connect/i.test(
    text
  )) {
    return new BoardGitError("TRANSIENT", `git ${op} could not reach the remote \u2014 offline or the host is unreachable; retry`, {
      details: { op, retryable: true }
    });
  }
  const line2 = firstGitLine(f);
  return new BoardGitError("RUNTIME", `git ${op} failed${line2 ? `: ${line2}` : ""}`, {
    details: { op, exit_status: f.status }
  });
}

// ../board-git/src/porcelain.ts
import { spawnSync } from "node:child_process";
import {
  existsSync as existsSync2,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync as readFileSync2,
  readlinkSync,
  realpathSync as realpathSync3,
  rmSync,
  rmdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir as tmpdir2 } from "node:os";
import path5 from "node:path";
var BOARD_BRANCH = "board";
var BOARD_REMOTE = "origin";
var BOARD_REF = `${BOARD_REMOTE}/${BOARD_BRANCH}`;
var BUNDLE_DIR = ".agentstate-lite";
var RELATIVE_WORKTREE_CONFIG = ["-c", "worktree.useRelativePaths=true"];
var SCRUBBED_GIT_VARS = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"];
var LOCAL_TIMEOUT_MS = 3e4;
var NETWORK_TIMEOUT_MS = 6e4;
function gitEnv(rebase, connectTimeoutSeconds = 10, indexFile) {
  const env = { ...process.env };
  for (const v of SCRUBBED_GIT_VARS) delete env[v];
  if (indexFile) env.GIT_INDEX_FILE = indexFile;
  env.LC_ALL = "C";
  env.GIT_TERMINAL_PROMPT = "0";
  env.GIT_SSH_COMMAND = `ssh -o BatchMode=yes -o ConnectTimeout=${connectTimeoutSeconds}`;
  if (rebase) {
    env.GIT_EDITOR = "true";
    env.GIT_SEQUENCE_EDITOR = "true";
  }
  return env;
}
function runGit(dir, args, opts = {}) {
  const r = runGitBytes(dir, args, opts);
  return { status: r.status, stdout: r.stdout.toString("utf8"), stderr: r.stderr };
}
function runGitBytes(dir, args, opts = {}) {
  if (opts.timeoutMs !== void 0 && opts.timeoutMs <= 0) {
    throw classifyGitError({ args, status: null, stdout: "", stderr: "", timedOut: true });
  }
  const repositoryArgs = [
    ...opts.gitDir ? [`--git-dir=${opts.gitDir}`] : [],
    ...opts.workTree ? [`--work-tree=${opts.workTree}`] : []
  ];
  const r = spawnSync("git", ["-C", dir, "-c", "core.quotepath=off", ...repositoryArgs, ...args], {
    env: gitEnv(opts.rebase ?? false, opts.connectTimeoutSeconds, opts.indexFile),
    timeout: opts.timeoutMs ?? LOCAL_TIMEOUT_MS,
    input: opts.input,
    maxBuffer: 32 * 1024 * 1024
  });
  const stdout = r.stdout ?? Buffer.alloc(0);
  const stderr = (r.stderr ?? Buffer.alloc(0)).toString("utf8");
  if (r.error) {
    const code = r.error.code;
    throw classifyGitError({
      args,
      status: r.status ?? null,
      stdout: stdout.toString("utf8"),
      stderr,
      timedOut: code === "ETIMEDOUT",
      spawnErrorCode: code ?? "SPAWN"
    });
  }
  if (r.status === null) {
    throw classifyGitError({ args, status: null, stdout: stdout.toString("utf8"), stderr, timedOut: true });
  }
  return { status: r.status, stdout, stderr };
}
function failureOf(args, r) {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}
function mustGit(dir, args, opts = {}) {
  const r = runGit(dir, args, opts);
  if (r.status !== 0) throw classifyGitError(failureOf(args, r));
  return r.stdout;
}
var IDENTITY_FALLBACK_ACTOR = "agentstate-lite";
function slugifyActor(actor) {
  const slug = actor.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : IDENTITY_FALLBACK_ACTOR;
}
function hasResolvableIdentity(dir) {
  return runGit(dir, ["var", "GIT_AUTHOR_IDENT"]).status === 0 && runGit(dir, ["var", "GIT_COMMITTER_IDENT"]).status === 0;
}
function identityFlags(dir, actor) {
  if (hasResolvableIdentity(dir)) return [];
  const name = actor && actor.trim().length > 0 ? actor.trim() : IDENTITY_FALLBACK_ACTOR;
  return ["-c", `user.name=${name}`, "-c", `user.email=${slugifyActor(name)}@agentstate-lite.invalid`];
}
function repoTopLevel(dir) {
  if (!existsSync2(dir)) return null;
  const r = runGit(dir, ["rev-parse", "--show-toplevel"]);
  if (r.status !== 0) return null;
  const top = r.stdout.trim();
  return top.length > 0 ? top : null;
}
function worktreeGitPath(boardPath, relative) {
  const raw = mustGit(boardPath, ["rev-parse", "--git-path", relative]).trim();
  return path5.resolve(boardPath, raw);
}
function realOrSame(p) {
  try {
    return realpathSync3(p);
  } catch {
    return p;
  }
}
function gitCommonDir(dir) {
  const r = runGit(dir, ["rev-parse", "--git-common-dir"]);
  if (r.status !== 0) return null;
  const raw = r.stdout.trim();
  if (raw.length === 0) return null;
  return realOrSame(path5.isAbsolute(raw) ? raw : path5.resolve(dir, raw));
}
function sameGitCommonDir(a, b) {
  const aCommon = gitCommonDir(a);
  const bCommon = gitCommonDir(b);
  return aCommon !== null && bCommon !== null && aCommon === bCommon;
}
function worktreeRootResolves(boardPath) {
  const boardTop = repoTopLevel(boardPath);
  return boardTop !== null && realOrSame(boardTop) === realOrSame(boardPath);
}
function worktreeRootResolvesForOwner(boardPath, ownerTop) {
  return worktreeRootResolves(boardPath) && sameGitCommonDir(boardPath, ownerTop);
}
function rebaseWasFromBoardBranch(boardPath) {
  for (const state of ["rebase-merge", "rebase-apply"]) {
    const headNamePath = path5.join(worktreeGitPath(boardPath, state), "head-name");
    if (!existsSync2(headNamePath)) continue;
    try {
      if (readFileSync2(headNamePath, "utf8").trim() === `refs/heads/${BOARD_BRANCH}`) return true;
    } catch {
    }
  }
  return false;
}
function repairedWorktreeIsBoard(boardPath, ownerTop) {
  if (!worktreeRootResolvesForOwner(boardPath, ownerTop)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH) return true;
  return detectStaleRebase(boardPath) && rebaseWasFromBoardBranch(boardPath);
}
function isProvisioned(dir) {
  const top = repoTopLevel(dir);
  if (!top) return false;
  const boardPath = path5.join(top, BUNDLE_DIR);
  if (!existsSync2(boardPath) || !worktreeRootResolvesForOwner(boardPath, top)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}
function hasWorktreeSignature(dir) {
  const gitPath = path5.join(dir, ".git");
  if (!existsSync2(gitPath)) return false;
  try {
    return statSync(gitPath).isFile();
  } catch {
    return false;
  }
}
function repairWorktree(top, boardPath) {
  const r = runGit(top, [...RELATIVE_WORKTREE_CONFIG, "worktree", "repair", boardPath]);
  return r.status === 0;
}
function shellQuote(s) {
  return `'${s.replaceAll("'", "'\\''")}'`;
}
function moveAsideHelp(boardPath, note) {
  return `mv ${shellQuote(boardPath)} ${shellQuote(`${boardPath}.bak`)}  # ${note}`;
}
function isShallowRepository(top) {
  const r = runGit(top, ["rev-parse", "--is-shallow-repository"]);
  return r.status !== 0 || r.stdout.trim() !== "false";
}
function tryFastForwardAdoptLocalBoard(top, localSha, remoteSha) {
  if (localSha.length === 0 || remoteSha.length === 0) return false;
  if (isShallowRepository(top)) return false;
  const list2 = runGit(top, ["worktree", "list", "--porcelain"]);
  if (list2.status !== 0) return false;
  const lines = list2.stdout.split("\n");
  if (lines.includes(`branch refs/heads/${BOARD_BRANCH}`)) return false;
  for (const wt of lines.filter((l) => l.startsWith("worktree ")).map((l) => l.slice("worktree ".length))) {
    if (!existsSync2(wt)) continue;
    try {
      if (detectStaleRebase(wt) && rebaseWasFromBoardBranch(wt)) return false;
    } catch {
      return false;
    }
  }
  if (runGit(top, ["merge-base", "--is-ancestor", localSha, remoteSha]).status !== 0) return false;
  return runGit(top, ["update-ref", `refs/heads/${BOARD_BRANCH}`, remoteSha, localSha]).status === 0;
}
function trackedBoardRemnantPaths(top) {
  const branch = currentBranch(top);
  if (branch === "HEAD" || branch === BOARD_BRANCH) return null;
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  if (runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status !== 0) return null;
  if (runGit(top, ["cat-file", "-e", `${remoteRef}:${BUNDLE_DIR}`]).status === 0) return null;
  if (runGit(top, ["merge-base", "--is-ancestor", remoteRef, "HEAD"]).status !== 0) return null;
  const ls = runGit(top, ["ls-tree", "-r", "-z", "--name-only", "HEAD", "--", BUNDLE_DIR]);
  if (ls.status !== 0) return null;
  const paths = ls.stdout.split("\0").filter((p) => p.length > 0);
  return paths.length > 0 ? paths : null;
}
function boardWindowGuidance(top, originConfigured = true) {
  if (!originConfigured) {
    return {
      state: "pre-share-window",
      originConfigured,
      message: `a previously fetched '${BOARD_REF}' ref shows this project's board was shared, but no '${BOARD_REMOTE}' remote is configured here any more \u2014 '${BUNDLE_DIR}' is still the old folder committed on this branch, and sync cannot pull the shared board without the remote`,
      help: `git remote add ${BOARD_REMOTE} <url>  # restore the remote, 'git pull' once the cleanup PR merges, then re-run sync`
    };
  }
  const remnants = trackedBoardRemnantPaths(top);
  if (remnants !== null) {
    const plural = remnants.length !== 1;
    return {
      state: "window-remnant",
      originConfigured,
      trackedRemnants: remnants,
      message: `the '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE} and the folder-removal (cleanup) commit has already been pulled here, but ${remnants.length} ${plural ? "paths" : "path"} under '${BUNDLE_DIR}/' ${plural ? "are" : "is"} still tracked on this branch \u2014 a board commit merged over the removal re-added ${plural ? "them" : "it"}, so 'git pull' has nothing left to fix: untrack ${plural ? "those paths" : "that path"}, then re-run sync`,
      help: `git rm -r --cached -- ${BUNDLE_DIR} && git commit -m 'board: untrack leftover board paths', then mv ${BUNDLE_DIR} ${BUNDLE_DIR}.bak and re-run sync \u2014 it provisions the shared board; reconcile any docs from the backup afterwards with doc update`
    };
  }
  return {
    state: "pre-share-window",
    originConfigured,
    message: `the '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE}, but '${BUNDLE_DIR}' here is still the old folder committed on this branch \u2014 the folder-removal (cleanup) PR hasn't merged yet, or this clone hasn't pulled it: once it lands, run 'git pull', then run sync again`,
    help: "git pull  # after the cleanup PR merges, then re-run sync"
  };
}
function preShareWindowError(top, boardPath, originConfigured = true) {
  const guidance = boardWindowGuidance(top, originConfigured);
  const details = { path: boardPath, state: guidance.state };
  if (!guidance.originConfigured) details.origin_configured = false;
  if (guidance.trackedRemnants) {
    const shown = guidance.trackedRemnants.slice(0, 20);
    details.tracked_remnants = { shown: shown.length, total: guidance.trackedRemnants.length, rows: shown };
  }
  return new BoardGitError("RUNTIME", guidance.message, { details, help: guidance.help });
}
function existingDirRefusal(reason, boardPath, top) {
  const messages = {
    foreign: {
      message: `a non-empty '${BUNDLE_DIR}' directory already exists at ${boardPath} but is not the shared board checkout \u2014 move it aside, then re-run sync`,
      help: moveAsideHelp(boardPath, "then re-run sync; reconcile any local-only docs afterwards")
    },
    foreign_checkout: {
      message: `'${BUNDLE_DIR}' at ${boardPath} is git checkout machinery, but it belongs to a different git repository than ${top} \u2014 move it aside, then re-run sync to provision this repo's board from origin/board`,
      help: moveAsideHelp(boardPath, "then re-run sync; the existing checkout is untouched, just relocated")
    },
    unrepairable: {
      message: `'${BUNDLE_DIR}' at ${boardPath} looks like the board checkout with stale pointers that 'git worktree repair' could not fix (its git-internal registration is likely gone) \u2014 move it aside, then re-run sync to re-provision fresh from origin/board`,
      help: moveAsideHelp(boardPath, "then re-run sync; recover any local-only, unpushed docs from the backup afterwards")
    },
    wrong_branch: {
      message: `'${BUNDLE_DIR}' at ${boardPath} is git checkout machinery (a linked worktree or nested repo), but it is not checked out to the '${BOARD_BRANCH}' branch (nor mid-rebase from it) \u2014 it is likely used for something else \u2014 move it aside, then re-run sync to re-provision the board fresh from origin/board`,
      help: moveAsideHelp(boardPath, "then re-run sync; the existing checkout is untouched, just relocated")
    }
  };
  return new BoardGitError("RUNTIME", messages[reason].message, {
    details: { path: boardPath },
    help: messages[reason].help
  });
}
function provisionBoardWorktree(dir, budget = {}) {
  const top = repoTopLevel(dir);
  if (!top) return { kind: "no_repo" };
  const boardPath = path5.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };
  const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
  const deadline = Date.now() + (budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS);
  const networkOptions = () => ({
    timeoutMs: Math.max(0, deadline - Date.now()),
    connectTimeoutSeconds: budget.connectTimeoutSeconds
  });
  const runNetwork = (args) => {
    try {
      return runGit(top, args, networkOptions());
    } catch (err) {
      if (isBoardGitError(err) && err.code === "TRANSIENT") return null;
      throw err;
    }
  };
  let remoteState = "absent";
  let remoteBoardKnownAbsent = false;
  let liveFetch = false;
  if (hasOrigin) {
    const probe = runNetwork([
      "ls-remote",
      "--exit-code",
      BOARD_REMOTE,
      `refs/heads/${BOARD_BRANCH}`
    ]);
    if (probe?.status === 0) {
      const children = runGit(top, [
        "for-each-ref",
        "--format=%(refname)",
        `refs/remotes/${BOARD_REF}/`
      ]);
      let namespaceReady = children.status === 0;
      for (const child of children.stdout.split("\n").filter(Boolean)) {
        if (runGit(top, ["update-ref", "-d", child]).status !== 0) namespaceReady = false;
      }
      if (namespaceReady) {
        const fetch2 = runNetwork([
          "fetch",
          "--prune",
          "--no-tags",
          BOARD_REMOTE,
          `+refs/heads/${BOARD_BRANCH}:refs/remotes/${BOARD_REF}`
        ]);
        remoteState = fetch2?.status === 0 ? "absent" : "unknown";
        liveFetch = fetch2?.status === 0;
      } else {
        remoteState = "unknown";
      }
    } else if (probe?.status === 2) {
      remoteBoardKnownAbsent = true;
      runGit(top, ["update-ref", "-d", `refs/remotes/${BOARD_REF}`]);
    } else {
      remoteState = "unknown";
    }
  }
  const localBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]);
  const remoteBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  const hasLocal = localBoard.status === 0;
  const hasRemote = remoteBoard.status === 0 && !remoteBoardKnownAbsent;
  const localMatchesRemote = hasLocal && hasRemote && localBoard.stdout.trim().length > 0 && localBoard.stdout.trim() === remoteBoard.stdout.trim();
  if (!hasLocal && !hasRemote) {
    return {
      kind: "no_board",
      remoteState
    };
  }
  let ffAdopted;
  const adoptLocalBoard = () => {
    if (ffAdopted === void 0) {
      ffAdopted = hasRemote && liveFetch && tryFastForwardAdoptLocalBoard(top, localBoard.stdout.trim(), remoteBoard.stdout.trim());
    }
    return ffAdopted;
  };
  if (existsSync2(boardPath)) {
    if (readdirSync(boardPath).length > 0) {
      if (hasRemote && !hasWorktreeSignature(boardPath) && runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0) {
        throw preShareWindowError(top, boardPath, hasOrigin);
      }
      const hadSignature = hasWorktreeSignature(boardPath);
      let reason = "foreign";
      if (hadSignature) {
        if (worktreeRootResolves(boardPath) && !sameGitCommonDir(boardPath, top)) {
          reason = "foreign_checkout";
        } else {
          repairWorktree(top, boardPath);
        }
        if (repairedWorktreeIsBoard(boardPath, top)) return { kind: "repaired", boardPath };
        if (reason !== "foreign_checkout") {
          if (worktreeRootResolves(boardPath) && !sameGitCommonDir(boardPath, top)) {
            reason = "foreign_checkout";
          } else {
            reason = worktreeRootResolves(boardPath) ? "wrong_branch" : "unrepairable";
          }
        }
      }
      throw existingDirRefusal(reason, boardPath, top);
    }
    if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote && !adoptLocalBoard()) {
      return { kind: "local_board", boardPath, remoteExists: hasRemote };
    }
    rmdirSync(boardPath);
  }
  if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote && !adoptLocalBoard()) {
    return { kind: "local_board", boardPath, remoteExists: hasRemote };
  }
  const r = hasLocal ? runGit(top, [...RELATIVE_WORKTREE_CONFIG, "worktree", "add", boardPath, BOARD_BRANCH]) : runGit(top, [
    ...RELATIVE_WORKTREE_CONFIG,
    "worktree",
    "add",
    "--no-track",
    "-b",
    BOARD_BRANCH,
    boardPath,
    `refs/remotes/${BOARD_REF}`
  ]);
  if (r.status !== 0) {
    const list2 = runGit(top, ["worktree", "list", "--porcelain"]);
    if (list2.status === 0 && list2.stdout.split("\n").includes(`branch refs/heads/${BOARD_BRANCH}`)) {
      return { kind: "already", boardPath };
    }
    throw classifyGitError(failureOf(["worktree", "add"], r));
  }
  return { kind: "provisioned", boardPath, source: hasLocal && ffAdopted !== true ? "local" : "remote" };
}
function detectStaleRebase(boardPath) {
  return existsSync2(worktreeGitPath(boardPath, "rebase-merge")) || existsSync2(worktreeGitPath(boardPath, "rebase-apply"));
}
function abortStaleRebase(boardPath) {
  mustGit(boardPath, ["rebase", "--abort"], { rebase: true });
}
var UNKNOWN = "unknown";
function fmString(v) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN;
}
function isConceptDocPath(relPath) {
  return relPath.endsWith(".md") && !isReservedFile(relPath);
}
function nameStatusRows(out) {
  const fields = out.split("\0");
  if (fields.length > 0 && fields[fields.length - 1] === "") fields.pop();
  const rows = [];
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const letter = (fields[i] ?? "").trim().charAt(0);
    const relPath = fields[i + 1] ?? "";
    if (letter.length > 0 && relPath.length > 0) rows.push({ letter, relPath });
  }
  return rows;
}
function verbOf(letter) {
  if (letter === "A") return "added";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}
function enrichDocChange(boardPath, relPath, verb, rev, runOptions = {}, idPath = relPath) {
  const docId = conceptIdFromPath(idPath);
  let actor = UNKNOWN;
  let kind2 = UNKNOWN;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`], runOptions);
  if (shown.status === 0) {
    try {
      const { frontmatter } = parseMarkdown(shown.stdout, relPath);
      actor = fmString(frontmatter.actor);
      kind2 = fmString(frontmatter.type);
      const t = fmString(frontmatter.title);
      if (t !== UNKNOWN) title = t;
    } catch {
    }
  }
  return { docId, actor, verb, kind: kind2, title };
}
function primaryActor(docs) {
  if (docs.length === 0) return void 0;
  const actors = [...new Set(docs.map((d) => d.actor))];
  return actors.length === 1 ? actors[0] : void 0;
}
function commitSubject(docs) {
  if (docs.length === 0) return "board: bundle maintenance";
  const first = docs[0];
  if (docs.length === 1) return `board: ${first.actor} \u2014 ${first.verb} ${first.docId}`;
  const single = primaryActor(docs);
  if (single) return `board: ${single} \u2014 ${docs.length} docs`;
  const actorCount = new Set(docs.map((d) => d.actor)).size;
  return `board: ${docs.length} docs from ${actorCount} actors`;
}
function stageAndCommit(boardPath) {
  mustGit(boardPath, ["add", "-A"]);
  if (runGit(boardPath, ["diff", "--cached", "--quiet"]).status === 0) {
    return { committed: false, docs: [] };
  }
  const rows = nameStatusRows(mustGit(boardPath, ["diff", "--cached", "--name-status", "--no-renames", "-z"]));
  const docs = [];
  for (const { letter, relPath } of rows) {
    if (!isConceptDocPath(relPath)) continue;
    const verb = verbOf(letter);
    if (!verb) continue;
    docs.push(enrichDocChange(boardPath, relPath, verb, verb === "deleted" ? "HEAD" : ":0"));
  }
  const subject = commitSubject(docs);
  const bodyLines = docs.length > 0 ? docs.map((d) => `${d.verb} ${d.kind} ${d.docId}`) : rows.map((r) => `${r.letter} ${r.relPath}`);
  const message = `${subject}

${bodyLines.join("\n")}
`;
  mustGit(
    boardPath,
    [...identityFlags(boardPath, primaryActor(docs)), "commit", "--no-verify", "-F", "-"],
    { input: message }
  );
  const sha = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
  return { committed: true, sha, subject, docs };
}
function snapshotFilesystemFiles(root) {
  const files = [];
  const visit = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name.toLowerCase() === ".git") {
        throw new BoardGitError(
          "RUNTIME",
          `the bundle contains nested git control data at '${relPath}' \u2014 establish refuses because Git can silently omit or collapse files below that boundary`,
          { details: { nested_git_paths: [relPath] } }
        );
      }
      if (entry.isDirectory()) visit(path5.join(dir, entry.name), relPath);
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(relPath);
      else {
        throw new BoardGitError(
          "RUNTIME",
          `the bundle contains an unsupported filesystem entry at '${relPath}' \u2014 only files, directories, and symbolic links can be established safely`
        );
      }
    }
  };
  visit(root, "");
  return files.sort();
}
function assertBundleBytesMatchCommit(top, bundlePath, commit) {
  const listed = runGit(top, ["ls-tree", "-r", "-z", commit]);
  if (listed.status !== 0) throw classifyGitError(failureOf(["ls-tree", "-r", "-z", commit], listed));
  const mismatches = [];
  for (const row2 of listed.stdout.split("\0").filter(Boolean)) {
    const tab = row2.indexOf("	");
    if (tab < 0) continue;
    const [mode, type, oid] = row2.slice(0, tab).split(" ");
    const relPath = row2.slice(tab + 1);
    const absolute = path5.resolve(bundlePath, relPath);
    if (!absolute.startsWith(`${path5.resolve(bundlePath)}${path5.sep}`)) {
      mismatches.push(relPath);
      continue;
    }
    if (type !== "blob" || !oid) {
      mismatches.push(relPath);
      continue;
    }
    const stored = runGitBytes(top, ["cat-file", "blob", oid]);
    if (stored.status !== 0) {
      throw classifyGitError({
        args: ["cat-file", "blob", oid],
        status: stored.status,
        stdout: stored.stdout.toString("utf8"),
        stderr: stored.stderr
      });
    }
    try {
      const stat2 = lstatSync(absolute);
      const actual = mode === "120000" ? readlinkSync(absolute, { encoding: "buffer" }) : readFileSync2(absolute);
      if (mode === "120000" && !stat2.isSymbolicLink() || mode !== "120000" && !stat2.isFile()) {
        mismatches.push(relPath);
      } else if (!Buffer.from(actual).equals(stored.stdout)) {
        mismatches.push(relPath);
      }
    } catch {
      mismatches.push(relPath);
    }
  }
  if (mismatches.length > 0) {
    throw new BoardGitError(
      "RUNTIME",
      `bundle bytes differ from the Git snapshot at '${mismatches[0]}' \u2014 a Git attribute, clean/smudge filter, EOL rule, or concurrent writer may be rewriting content; no source backup was removed`,
      { details: { byte_mismatches: mismatches.slice(0, 20) } }
    );
  }
}
function snapshotBundleCommit(top, bundlePath) {
  const gitDir = mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim();
  const filesystemFiles = snapshotFilesystemFiles(bundlePath);
  const scratch = mkdtempSync(path5.join(tmpdir2(), "aslite-establish-index-"));
  const indexFile = path5.join(scratch, "index");
  const snapshotOptions = { gitDir, workTree: bundlePath, indexFile };
  try {
    mustGit(bundlePath, ["read-tree", "--empty"], snapshotOptions);
    mustGit(
      bundlePath,
      ["-c", "core.sparseCheckout=false", "-c", "core.sparseCheckoutCone=false", "add", "-f", "-A", "--", "."],
      snapshotOptions
    );
    const stagedRows = mustGit(bundlePath, ["ls-files", "--stage", "-z"], snapshotOptions).split("\0").filter(Boolean);
    const gitlinks = stagedRows.filter((row2) => row2.startsWith("160000 ")).map((row2) => row2.slice(row2.indexOf("	") + 1));
    if (gitlinks.length > 0) {
      throw new BoardGitError(
        "RUNTIME",
        `the bundle contains nested git checkout machinery at '${gitlinks[0]}' \u2014 establish refuses because Git would publish only a gitlink and omit that directory's files`,
        { details: { nested_git_paths: gitlinks } }
      );
    }
    const stagedFiles = stagedRows.map((row2) => row2.slice(row2.indexOf("	") + 1)).sort();
    if (stagedFiles.length !== filesystemFiles.length || stagedFiles.some((file, index) => file !== filesystemFiles[index])) {
      const staged = new Set(stagedFiles);
      const filesystem = new Set(filesystemFiles);
      throw new BoardGitError("RUNTIME", "Git did not capture every bundle file; nothing was published", {
        details: {
          omitted_paths: filesystemFiles.filter((file) => !staged.has(file)).slice(0, 20),
          unexpected_paths: stagedFiles.filter((file) => !filesystem.has(file)).slice(0, 20)
        }
      });
    }
    const tree = mustGit(bundlePath, ["write-tree"], snapshotOptions).trim();
    const emptyTree = mustGit(top, ["mktree"], { input: "" }).trim();
    const rows = nameStatusRows(
      mustGit(
        bundlePath,
        ["diff", "--cached", "--name-status", "--no-renames", "-z", emptyTree],
        snapshotOptions
      )
    );
    const docs = [];
    for (const { letter, relPath } of rows) {
      if (!isConceptDocPath(relPath)) continue;
      const verb = verbOf(letter);
      if (!verb) continue;
      docs.push(enrichDocChange(bundlePath, relPath, verb, ":0", snapshotOptions));
    }
    const subject = commitSubject(docs);
    const bodyLines = docs.length > 0 ? docs.map((d) => `${d.verb} ${d.kind} ${d.docId}`) : rows.map((r) => `${r.letter} ${r.relPath}`);
    const message = `${subject}

${bodyLines.join("\n")}
`;
    const sha = mustGit(top, [...identityFlags(top, primaryActor(docs)), "commit-tree", tree], {
      input: message
    }).trim();
    assertBundleBytesMatchCommit(top, bundlePath, sha);
    return { committed: true, sha, tree, subject, docs };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
var MAX_REBASE_STOPS = 1e3;
function fetchRebaseResolving(boardPath, exportDir) {
  mustGit(boardPath, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
  if (runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
    return { status: "no_upstream" };
  }
  const idFlags = identityFlags(boardPath);
  const r = runGit(boardPath, [...idFlags, "rebase", BOARD_REF], { rebase: true, timeoutMs: NETWORK_TIMEOUT_MS });
  if (r.status === 0) return { status: "clean" };
  if (!detectStaleRebase(boardPath)) throw classifyGitError(failureOf(["rebase", BOARD_REF], r));
  const listConflicted = () => mustGit(boardPath, ["diff", "--name-only", "-z", "--diff-filter=U"]).split("\0").filter((l) => l.length > 0);
  const byPath = /* @__PURE__ */ new Map();
  try {
    let stops = 0;
    while (detectStaleRebase(boardPath)) {
      if (++stops > MAX_REBASE_STOPS) {
        throw new BoardGitError(
          "RUNTIME",
          `sync's converging rebase did not terminate after ${MAX_REBASE_STOPS} stops \u2014 aborting to leave the board unchanged`
        );
      }
      const conflicted = listConflicted();
      if (conflicted.length === 0) {
        runGit(boardPath, [...idFlags, "rebase", "--skip"], { rebase: true });
        continue;
      }
      for (const relPath of conflicted) {
        const local = runGitBytes(boardPath, ["show", `:3:${relPath}`]);
        let exportPath = null;
        let bodyExportPath = null;
        const isDoc = isConceptDocPath(relPath);
        if (local.status === 0) {
          exportPath = path5.join(exportDir, relPath);
          mkdirSync(path5.dirname(exportPath), { recursive: true, mode: 448 });
          writeFileSync(exportPath, local.stdout, { mode: 384 });
          if (isDoc) {
            try {
              const decoded = local.stdout.toString("utf8");
              if (Buffer.from(decoded, "utf8").equals(local.stdout)) {
                const { body } = parseMarkdown(decoded, relPath);
                bodyExportPath = exportPath.replace(/\.md$/, ".body.md");
                writeFileSync(bodyExportPath, body, { mode: 384 });
              }
            } catch {
              bodyExportPath = null;
            }
          }
        }
        if (runGit(boardPath, ["cat-file", "-e", `refs/remotes/${BOARD_REF}:${relPath}`]).status === 0) {
          mustGit(boardPath, ["checkout", BOARD_REF, "--", relPath]);
          mustGit(boardPath, ["add", "--", relPath]);
        } else {
          mustGit(boardPath, ["rm", "-f", "--", relPath]);
        }
        byPath.set(relPath, {
          relPath,
          entry: isDoc ? conceptIdFromPath(relPath) : relPath,
          isDoc,
          exportPath,
          bodyExportPath
        });
      }
      const cont = runGit(boardPath, [...idFlags, "rebase", "--continue"], { rebase: true });
      if (cont.status !== 0 && !detectStaleRebase(boardPath)) {
        throw classifyGitError(failureOf(["rebase", "--continue"], cont));
      }
    }
  } catch (err) {
    try {
      mustGit(boardPath, ["rebase", "--abort"], { rebase: true });
    } catch {
    }
    throw err;
  }
  return { status: "resolved", conflicts: [...byPath.values()] };
}
function push(boardPath) {
  mustGit(boardPath, ["push", BOARD_REMOTE, BOARD_BRANCH], { timeoutMs: NETWORK_TIMEOUT_MS });
}
function pushBoardUpstream(top) {
  mustGit(top, ["push", "-u", BOARD_REMOTE, BOARD_BRANCH], { timeoutMs: NETWORK_TIMEOUT_MS });
}
function pushBoardCommit(top, commit) {
  mustGit(top, ["push", BOARD_REMOTE, `${commit}:refs/heads/${BOARD_BRANCH}`], {
    timeoutMs: NETWORK_TIMEOUT_MS
  });
}
function setBoardUpstream(boardPath) {
  mustGit(boardPath, ["branch", "--set-upstream-to", BOARD_REF, BOARD_BRANCH]);
}
function fetchOrigin(top) {
  return runGit(top, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS }).status === 0;
}
function fetchOriginRequired(top) {
  mustGit(top, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
}
function remoteBoardNamespaceBranches(top) {
  const r = runGit(top, ["ls-remote", "--heads", BOARD_REMOTE, `${BOARD_BRANCH}/*`], {
    timeoutMs: NETWORK_TIMEOUT_MS
  });
  if (r.status !== 0) throw classifyGitError(failureOf(["ls-remote"], r));
  return r.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).map((l) => l.split("	")[1] ?? "").filter((ref) => ref.startsWith("refs/heads/")).map((ref) => ref.slice("refs/heads/".length));
}
function boardNamespaceConflicts(top) {
  const local = runGit(top, ["for-each-ref", "--format=%(refname:short)", `refs/heads/${BOARD_BRANCH}/`]);
  const localNames = local.status === 0 ? local.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).map((n) => `${n} (local)`) : [];
  const remoteNames = remoteBoardNamespaceBranches(top).map((n) => `${n} (on ${BOARD_REMOTE})`);
  return [...localNames, ...remoteNames];
}
var GITIGNORE_ENTRY = `${BUNDLE_DIR}/`;
function withIgnoreEntry(content) {
  const covered = content.split("\n").some((l) => {
    const t = l.trim();
    return t === BUNDLE_DIR || t === `${BUNDLE_DIR}/` || t === `/${BUNDLE_DIR}` || t === `/${BUNDLE_DIR}/`;
  });
  if (covered) return content;
  let out = content;
  if (out.length > 0 && !out.endsWith("\n")) out += "\n";
  if (out.length > 0) out += "\n";
  out += `# the shared board \u2014 managed on the '${BOARD_BRANCH}' branch by aslite sync
${GITIGNORE_ENTRY}
`;
  return out;
}
function ensureBoardGitignoreWorkingTree(top) {
  const gitignorePath = path5.join(top, ".gitignore");
  let content = "";
  try {
    content = readFileSync2(gitignorePath, "utf8");
  } catch {
  }
  const updated = withIgnoreEntry(content);
  if (updated === content) return { changed: false, path: gitignorePath };
  writeFileSync(gitignorePath, updated);
  return { changed: true, path: gitignorePath };
}
function swallowReason(err) {
  switch (err.code) {
    case "GIT_MISSING":
      return "git-missing";
    case "NO_UPSTREAM":
      return "no-upstream";
    case "GIT_BUSY":
      return "busy";
    case "AUTH_REQUIRED":
      return "auth";
    case "TRANSIENT":
      return "network";
    case "CONFLICT":
      return "conflict";
    default:
      return "runtime";
  }
}
function ffPull(boardPath, budget = {}) {
  try {
    if (!repoTopLevel(boardPath)) return { updated: false, swallowed: "not-a-repo" };
    if (runGit(boardPath, ["symbolic-ref", "-q", "HEAD"]).status !== 0) {
      return { updated: false, swallowed: "detached-head" };
    }
    const before = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
    let fetchReason;
    const fetched = runGit(boardPath, ["fetch", "--prune", BOARD_REMOTE], {
      timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
      connectTimeoutSeconds: budget.connectTimeoutSeconds
    });
    if (fetched.status !== 0) {
      fetchReason = swallowReason(classifyGitError(failureOf(["fetch", "--prune"], fetched)));
    }
    const merged = runGit(boardPath, ["merge", "--ff-only", BOARD_REF]);
    if (merged.status !== 0) {
      const text = `${merged.stderr}
${merged.stdout}`;
      if (/Not possible to fast-forward/i.test(text) || /have diverged/i.test(text)) {
        return { updated: false, swallowed: "diverged" };
      }
      if (/local changes .* would be overwritten|Please commit your changes or stash/i.test(text)) {
        return { updated: false, swallowed: "dirty" };
      }
      return { updated: false, swallowed: swallowReason(classifyGitError(failureOf(["merge"], merged))) };
    }
    const after = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
    const result = { updated: after !== before };
    if (fetchReason !== void 0) result.swallowed = fetchReason;
    return result;
  } catch (err) {
    if (isBoardGitError(err)) return { updated: false, swallowed: swallowReason(err) };
    return { updated: false, swallowed: "runtime" };
  }
}
function unpushedCount(boardPath) {
  if (runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
    return null;
  }
  const out = mustGit(boardPath, ["rev-list", "--count", `${BOARD_REF}..HEAD`]).trim();
  const n = Number.parseInt(out, 10);
  return Number.isFinite(n) ? n : 0;
}
function currentHead(boardPath) {
  const r = runGit(boardPath, ["rev-parse", "HEAD"]);
  if (r.status !== 0) {
    throw classifyGitError({ args: ["rev-parse", "HEAD"], status: r.status, stdout: r.stdout, stderr: r.stderr });
  }
  return r.stdout.trim();
}
function currentBranch(top) {
  const r = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return r.status === 0 ? r.stdout.trim() : "HEAD";
}
function statusRows(dir, prefix) {
  const r = runGit(dir, ["status", "--porcelain", ...prefix ? ["--", prefix] : []]);
  if (r.status !== 0) return [];
  return r.stdout.split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0).map((l) => ({ status: l.slice(0, 2).trim(), path: l.slice(3) }));
}
function countUncommitted(boardPath, prefix) {
  return statusRows(boardPath, prefix).length;
}
function readDocBytesAtRef(dir, ref, relPath) {
  if (runGit(dir, ["cat-file", "-e", `${ref}:${relPath}`]).status !== 0) return null;
  const shown = runGitBytes(dir, ["show", `${ref}:${relPath}`]);
  if (shown.status !== 0) {
    throw classifyGitError({ args: ["show"], status: shown.status, stdout: "", stderr: shown.stderr });
  }
  return shown.stdout;
}

// ../board-git/src/channel.ts
import path7 from "node:path";

// ../board-git/src/flow.ts
import { existsSync as existsSync3, readFileSync as readFileSync3, renameSync, unlinkSync, writeFileSync as writeFileSync2 } from "node:fs";
import path6 from "node:path";
function refCommit(top, ref) {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", ref]);
  const value = r.stdout.trim();
  return r.status === 0 && value ? value : void 0;
}
function treeOf(top, commit) {
  return refCommit(top, `${commit}^{tree}`);
}
function isAncestor(top, ancestor, descendant) {
  return runGit(top, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}
function localBranchExists(top, name) {
  return runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`]).status === 0;
}
function resolveOriginRef(boardPath) {
  const r = runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  return r.status === 0 ? r.stdout.trim() : null;
}
function hasLocalOnlyBundle(dir) {
  const top = repoTopLevel(dir);
  if (!top) return false;
  return existsSync3(path6.join(top, BUNDLE_DIR, "index.md"));
}
function folderTreeAtHead(top) {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", `HEAD:${BUNDLE_DIR}`]);
  if (r.status !== 0) return null;
  const sha = r.stdout.trim();
  const t = runGit(top, ["cat-file", "-t", sha]);
  if (t.status !== 0 || t.stdout.trim() !== "tree") return null;
  return sha;
}
function folderPresentInCodeIndex(top) {
  const r = runGit(top, ["ls-files", "--", BUNDLE_DIR]);
  return r.status === 0 && r.stdout.trim().length > 0;
}
function behindBoardCommits(top, branch) {
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  if (runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status !== 0) return null;
  return mustGit(top, ["rev-list", `HEAD..${remoteRef}`, "--", BUNDLE_DIR]).split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
}
function pathLandedAbsentOnRemoteBranch(top, branch, relPath) {
  if (branch === "HEAD") return false;
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  const remoteBranchKnown = runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status === 0;
  return remoteBranchKnown && runGit(top, ["cat-file", "-e", `${remoteRef}:${relPath}`]).status !== 0;
}
function boardBranchRemnant(top) {
  return {
    sha: mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}`]).trim(),
    tree: mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}^{tree}`]).trim(),
    count: mustGit(top, ["rev-list", "--count", `refs/heads/${BOARD_BRANCH}`]).trim()
  };
}
function annotateLanded(boardPath, conflicts) {
  return conflicts.map((c) => ({
    ...c,
    landed: runGit(boardPath, ["cat-file", "-e", `HEAD:${c.relPath}`]).status === 0
  }));
}
var ESTABLISH_MARKER_KEY = "agentstate.establishCommit";
var COMMITTED_MARKER_KEY = "agentstate.establishCommittedShare";
function markerPath(top, key) {
  return path6.join(mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim(), key);
}
function readGitDirMarker(top, key) {
  try {
    const value = readFileSync3(markerPath(top, key), "utf8").trim();
    return /^[0-9a-f]{40,64}$/.test(value) ? value : void 0;
  } catch {
    return void 0;
  }
}
function writeGitDirMarker(top, key, commit) {
  const target = markerPath(top, key);
  const temporary = `${target}.tmp-${process.pid}`;
  writeFileSync2(temporary, `${commit}
`, { mode: 384 });
  renameSync(temporary, target);
}
function clearGitDirMarker(top, key) {
  clearGitDirMarkerVerified(top, key);
}
function gitDirMarkerPath(top, key) {
  return markerPath(top, key);
}
function clearGitDirMarkerVerified(top, key) {
  try {
    const target = markerPath(top, key);
    try {
      unlinkSync(target);
    } catch {
    }
    return !existsSync3(target);
  } catch {
    return false;
  }
}
function parseLsTreeZ(out) {
  return out.split("\0").filter((l) => l.length > 0).map((l) => {
    const tab = l.indexOf("	");
    const [mode = "", type = "", sha = ""] = l.slice(0, tab).split(" ");
    return { mode, type, sha, name: l.slice(tab + 1) };
  });
}
function treeSortKey(e) {
  return e.type === "tree" ? `${e.name}/` : e.name;
}
function boardCommitMessage(branch) {
  return `board: bundle shared from '${branch}' (files only)

One-time establishment: the bundle's current files, moved onto the dedicated '${BOARD_BRANCH}' branch.
The folder's history stays on '${branch}'.
`;
}
function createBoardRootCommit(top, treeSha, branch) {
  const sha = mustGit(top, [...identityFlags(top), "commit-tree", treeSha], {
    input: boardCommitMessage(branch)
  }).trim();
  mustGit(top, ["branch", BOARD_BRANCH, sha]);
  return sha;
}
function createRemovalCommit(top, message) {
  const headTree = mustGit(top, ["rev-parse", "HEAD^{tree}"]).trim();
  const entries = parseLsTreeZ(mustGit(top, ["ls-tree", "-z", headTree])).filter(
    (e) => e.name !== BUNDLE_DIR
  );
  const existing = entries.find((e) => e.name === ".gitignore");
  const base = existing ? mustGit(top, ["cat-file", "blob", existing.sha]) : "";
  const updated = withIgnoreEntry(base);
  if (updated !== base) {
    const blob = mustGit(top, ["hash-object", "-w", "--stdin"], { input: updated }).trim();
    if (existing) {
      existing.sha = blob;
    } else {
      entries.push({ mode: "100644", type: "blob", sha: blob, name: ".gitignore" });
    }
  }
  entries.sort((a, b) => treeSortKey(a) < treeSortKey(b) ? -1 : treeSortKey(a) > treeSortKey(b) ? 1 : 0);
  const mktreeInput = entries.map((e) => `${e.mode} ${e.type} ${e.sha}	${e.name}\0`).join("");
  const newTree = mustGit(top, ["mktree", "-z"], { input: mktreeInput }).trim();
  return mustGit(top, [...identityFlags(top), "commit-tree", newTree, "-p", "HEAD"], { input: message }).trim();
}

// ../board-git/src/channel.ts
var INDETERMINATE_TRACKED_REASON = `'${BUNDLE_DIR}/' is committed on the current branch, but ${BOARD_REMOTE} could not be checked for a shared '${BOARD_BRANCH}' branch \u2014 refusing to classify: an existing shared board must never be shadowed by guessing in-tree`;
var INDETERMINATE_UNTRACKED_REASON = `${BOARD_REMOTE} could not be checked for a shared '${BOARD_BRANCH}' branch and no previously fetched evidence exists \u2014 refusing to classify: mode-sensitive operations (establish, conversion) should refuse and retry when ${BOARD_REMOTE} is reachable; local reads are unaffected`;
function branchChannel() {
  return { kind: "channel", channel: { mode: "branch", branch: BOARD_BRANCH, remote: BOARD_REMOTE } };
}
function localOnlyChannel() {
  return { kind: "channel", channel: { mode: "local-only" } };
}
function probeRemoteBoardState(top, budget = {}) {
  const fetchedRef = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
  if (!hasOrigin) return fetchedRef ? "exists" : "absent";
  let probeStatus = null;
  try {
    probeStatus = runGit(top, ["ls-remote", "--exit-code", BOARD_REMOTE, `refs/heads/${BOARD_BRANCH}`], {
      timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
      connectTimeoutSeconds: budget.connectTimeoutSeconds
    }).status;
  } catch (err) {
    if (!isBoardGitError(err) || err.code !== "TRANSIENT") throw err;
    probeStatus = null;
  }
  if (probeStatus === 0) return "exists";
  if (probeStatus === 2) return "absent";
  return fetchedRef ? "exists" : "unknown";
}
function ownerRegistersBoardWorktree(top) {
  const r = runGit(top, ["worktree", "list", "--porcelain"]);
  if (r.status !== 0) return false;
  return r.stdout.split("\n").some((l) => l.startsWith("worktree ") && path7.basename(l.slice("worktree ".length).trim()) === BUNDLE_DIR);
}
function verifiedForeignBoardRoot(top) {
  const folderTree = folderTreeAtHead(top);
  if (folderTree === null) return false;
  if (refCommit(top, `refs/remotes/${BOARD_REF}`) === void 0) return false;
  const roots = runGit(top, ["rev-list", "--max-parents=0", `refs/remotes/${BOARD_REF}`]);
  if (roots.status !== 0) return false;
  const shas = roots.stdout.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
  if (shas.length === 0) return false;
  return shas.every((sha) => treeOf(top, sha) !== folderTree);
}
function dualBoardError(boardPath) {
  return new BoardGitError(
    "CONFLICT",
    `a shared '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE} AND '${BUNDLE_DIR}' is committed on the current branch with content that never seeded that branch \u2014 two competing board locations; nothing is safe to adopt automatically`,
    {
      details: { path: boardPath, state: "dual-board" },
      help: `choose one explicitly: keep the shared branch (reconcile the committed folder's docs onto it, then remove the folder from this branch), or keep the committed folder (coordinate with your team before retiring the remote '${BOARD_BRANCH}' branch)`
    }
  );
}
function detectBoardChannel(dir, options2 = {}) {
  const top = repoTopLevel(dir);
  if (!top) return localOnlyChannel();
  const boardPath = path7.join(top, BUNDLE_DIR);
  if (hasWorktreeSignature(boardPath)) {
    if (worktreeRootResolvesForOwner(boardPath, top)) return branchChannel();
    if (!worktreeRootResolves(boardPath) && ownerRegistersBoardWorktree(top)) return branchChannel();
  }
  const tracked = folderTreeAtHead(top) !== null;
  if (!tracked && localBranchExists(top, BOARD_BRANCH)) return branchChannel();
  const remote = options2.remoteBoardState ? options2.remoteBoardState(top) : probeRemoteBoardState(top, options2.budget);
  if (tracked) {
    if (remote === "exists") {
      if (trackedBoardRemnantPaths(top) === null && verifiedForeignBoardRoot(top)) {
        throw dualBoardError(boardPath);
      }
      throw preShareWindowError(top, boardPath, runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0);
    }
    if (remote === "absent") {
      return { kind: "channel", channel: { mode: "in-tree" } };
    }
    return { kind: "indeterminate", probe: "remote-board", folderTracked: true, reason: INDETERMINATE_TRACKED_REASON };
  }
  if (remote === "exists") return branchChannel();
  if (remote === "absent") return localOnlyChannel();
  return { kind: "indeterminate", probe: "remote-board", folderTracked: false, reason: INDETERMINATE_UNTRACKED_REASON };
}

// ../board-git/src/diff.ts
function diffDocsBetween(dir, fromRef, toRef, opts = {}) {
  const args = [
    "diff",
    "--name-status",
    "--no-renames",
    "-z",
    `${fromRef}..${toRef}`,
    ...opts.prefix ? ["--", opts.prefix] : []
  ];
  let out;
  if (opts.tolerateDiffFailure) {
    const r = runGit(dir, args);
    if (r.status !== 0) return [];
    out = r.stdout;
  } else {
    out = mustGit(dir, args);
  }
  const prefix = !opts.prefix ? void 0 : opts.prefix.endsWith("/") ? opts.prefix : `${opts.prefix}/`;
  const changes = [];
  for (const { letter, relPath } of nameStatusRows(out)) {
    let idPath = relPath;
    if (prefix !== void 0) {
      if (!relPath.startsWith(prefix)) continue;
      idPath = relPath.slice(prefix.length);
    }
    if (!isConceptDocPath(idPath)) continue;
    const verb = verbOf(letter);
    if (!verb) continue;
    changes.push(enrichDocChange(dir, relPath, verb, verb === "deleted" ? fromRef : toRef, {}, idPath));
  }
  return changes;
}
function changesSince(boardPath, token) {
  if (runGit(boardPath, ["cat-file", "-e", `${token}^{commit}`]).status !== 0) {
    return { ok: false, reason: "dangling" };
  }
  return { ok: true, changes: diffDocsBetween(boardPath, token, "HEAD") };
}
function originDocsBetween(boardPath, fromRef, toRef) {
  if (!fromRef || !toRef || fromRef === toRef) return [];
  return diffDocsBetween(boardPath, fromRef, toRef, { tolerateDiffFailure: true });
}

// ../board-git/src/cursor.ts
import { chmod, mkdir, readFile } from "node:fs/promises";
import { createHash as createHash3 } from "node:crypto";
import { basename as basename3, dirname as dirname2, join as join2, resolve } from "node:path";
var DIR_MODE = 448;
var REANCHOR_NOTE = "delta unavailable (history rewritten or repositioned)";
function normalizeRemoteUrl(url) {
  let u = url.trim().replace(/\/+$/, "");
  if (u.endsWith(".git")) u = u.slice(0, -".git".length);
  return u;
}
function normalizeSubpath(subpath) {
  return subpath.trim().replace(/^\.\//, "").replace(/^\/+/, "").replace(/\/+$/, "");
}
function bundleKey(src) {
  if ("remoteUrl" in src) {
    return `remote
${normalizeRemoteUrl(src.remoteUrl)}
${normalizeSubpath(src.subpath)}
${resolve(src.checkoutRoot)}`;
  }
  return `path
${resolve(src.root)}`;
}
function keyDigest(key) {
  return createHash3("sha256").update(key, "utf8").digest("hex").slice(0, 32);
}
var SELF_ACTORS_CAP = 64;
var EMPTY_STATE = {
  cursor: null,
  cache: null,
  marker: null,
  selfActors: null,
  autoPullAttemptAt: null,
  hookHintedAt: null
};
function isRecord(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isTimestamp(v) {
  return typeof v === "string" && Number.isFinite(Date.parse(v));
}
function isCount(v) {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}
function asCursor(v) {
  if (!isRecord(v)) return null;
  if (typeof v.tier !== "string" || v.tier.length === 0) return null;
  const token = v.token;
  const tokenOk = typeof token === "string" && token.length > 0 || typeof token === "number" && Number.isFinite(token);
  if (!tokenOk) return null;
  return { ...v };
}
function asDeltaRow(v) {
  if (!isRecord(v)) return null;
  for (const field of ["docId", "verb", "kind", "title", "actor"]) {
    if (typeof v[field] !== "string") return null;
  }
  return { ...v };
}
function asCache(v) {
  if (!isRecord(v)) return null;
  if (!isTimestamp(v.updatedAt)) return null;
  if (!Array.isArray(v.delta)) return null;
  const delta = [];
  for (const raw of v.delta) {
    const row2 = asDeltaRow(raw);
    if (row2 === null) return null;
    delta.push(row2);
  }
  if (!isCount(v.unpushedCount) || !isCount(v.uncommittedCount)) return null;
  if (v.note !== void 0 && typeof v.note !== "string") return null;
  return { ...v, delta };
}
function asMarker(v) {
  if (!isRecord(v)) return null;
  if (!isTimestamp(v.updatedAt)) return null;
  return { ...v };
}
function asSelfActors(v) {
  if (!Array.isArray(v)) return null;
  if (!v.every((a) => typeof a === "string" && a.length > 0)) return null;
  return [...v];
}
function freshOrNull(value, opts) {
  if (value === null) return null;
  if (opts?.maxAgeMs === void 0) return value;
  const now = (opts.now ?? (() => /* @__PURE__ */ new Date()))();
  const age = now.getTime() - Date.parse(value.updatedAt);
  return age > opts.maxAgeMs ? null : value;
}
function createSyncStore(options2) {
  const stateDir = () => typeof options2.stateDir === "function" ? options2.stateDir() : options2.stateDir;
  const statePath = (key) => join2(stateDir(), `${keyDigest(key)}.json`);
  const exportsDir = (key) => join2(stateDir(), "exports", keyDigest(key));
  async function readSyncState(key) {
    let raw;
    try {
      raw = await readFile(statePath(key), "utf8");
    } catch {
      return { ...EMPTY_STATE };
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ...EMPTY_STATE };
    }
    if (!isRecord(parsed)) return { ...EMPTY_STATE };
    if (parsed.key !== key) return { ...EMPTY_STATE };
    return {
      cursor: asCursor(parsed.cursor),
      cache: asCache(parsed.cache),
      marker: asMarker(parsed.marker),
      selfActors: asSelfActors(parsed.selfActors),
      autoPullAttemptAt: isTimestamp(parsed.autoPullAttemptAt) ? parsed.autoPullAttemptAt : null,
      hookHintedAt: isTimestamp(parsed.hookHintedAt) ? parsed.hookHintedAt : null
    };
  }
  async function writeSyncState(key, patch) {
    const next = { ...await readSyncState(key), ...patch };
    const dir = stateDir();
    const parent = dirname2(dir);
    await mkdir(parent, { recursive: true, mode: DIR_MODE });
    await chmod(parent, DIR_MODE);
    const record = {
      key,
      cursor: next.cursor ?? void 0,
      cache: next.cache ?? void 0,
      marker: next.marker ?? void 0,
      selfActors: next.selfActors ?? void 0,
      autoPullAttemptAt: next.autoPullAttemptAt ?? void 0,
      hookHintedAt: next.hookHintedAt ?? void 0
    };
    await options2.writeAtomic(dir, basename3(statePath(key)), JSON.stringify(record, null, 2) + "\n");
    return next;
  }
  return {
    statePath,
    exportsDir,
    readSyncState,
    writeSyncState,
    /** The stored cursor, or `null` (absent/malformed — never throws). Cursors do not age out. */
    async readCursor(key) {
      return (await readSyncState(key)).cursor;
    },
    /** The awareness cache, or `null` (absent/malformed/stale-past-`maxAgeMs` — never throws). */
    async readCache(key, opts) {
      return freshOrNull((await readSyncState(key)).cache, opts);
    },
    /** The board-pending marker, or `null` (absent/malformed/stale-past-`maxAgeMs` — never throws). */
    async readMarker(key, opts) {
      return freshOrNull((await readSyncState(key)).marker, opts);
    },
    /** Persist the cursor (verbatim — opaque token, unknown tiers untouched). */
    async writeCursor(key, cursor) {
      if (asCursor(cursor) === null) {
        throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
      }
      await writeSyncState(key, { cursor });
    },
    /** Persist the awareness cache the next `home` render reads. */
    async writeCache(key, cache) {
      if (asCache(cache) === null) {
        throw new TypeError(
          "cache must carry { updatedAt: ISO timestamp, delta: AwarenessDeltaRow[], unpushedCount, uncommittedCount }"
        );
      }
      await writeSyncState(key, { cache });
    },
    /**
     * Refresh the board-pending marker's timestamp (called by every pull step). Preserves any
     * extra fields a prior writer stored on the marker. Returns the marker as written.
     */
    async refreshMarker(key, now = () => /* @__PURE__ */ new Date()) {
      const current = (await readSyncState(key)).marker;
      const marker = { ...current ?? {}, updatedAt: now().toISOString() };
      await writeSyncState(key, { marker });
      return marker;
    },
    /** The self-actor list for a bundle key, or `[]` (absent/malformed — never throws). */
    async readSelfActors(key) {
      return (await readSyncState(key)).selfActors ?? [];
    },
    /**
     * Record actors THIS CLONE just committed (sync's commit step calls this — see
     * {@link SELF_ACTORS_CAP}'s doc for the whole "self" identity story). Merge-union with the
     * stored list, newest-last, deduped, capped to the NEWEST {@link SELF_ACTORS_CAP} entries.
     * `"unknown"` and empty strings are dropped at this one chokepoint (recording the placeholder
     * would make the U4 render hide a teammate's unattributed changes too). A call that changes
     * nothing skips the write.
     */
    async recordSelfActors(key, actors) {
      const current = (await readSyncState(key)).selfActors ?? [];
      const merged = [...current];
      for (const a of actors) {
        if (typeof a !== "string" || a.length === 0 || a === "unknown") continue;
        if (!merged.includes(a)) merged.push(a);
      }
      const capped = merged.slice(-SELF_ACTORS_CAP);
      if (capped.length === current.length && capped.every((a, i) => a === current[i])) {
        return current;
      }
      await writeSyncState(key, { selfActors: capped });
      return capped;
    },
    /**
     * Re-anchor after the CALLER's existence guard (U1's `git cat-file -e` before diffing) finds
     * the stored token gone — history was rewritten under the cursor. Atomically records the NEW
     * cursor (HEAD, minted by the caller) AND an awareness cache whose `note` is the honest
     * {@link REANCHOR_NOTE} with an EMPTY delta (the real delta is unknowable across a rewrite)
     * plus the caller's current backstop counts — so the miss is reported on the next render,
     * never a silent skip, and never fatal. Returns the cache as written.
     */
    async recordReanchor(key, cursor, counts, now = () => /* @__PURE__ */ new Date()) {
      if (asCursor(cursor) === null) {
        throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
      }
      const cache = {
        updatedAt: now().toISOString(),
        delta: [],
        unpushedCount: counts.unpushedCount,
        uncommittedCount: counts.uncommittedCount,
        note: REANCHOR_NOTE
      };
      await writeSyncState(key, { cursor, cache });
      return cache;
    },
    /** The last opportunistic auto-pull ATTEMPT timestamp, or `null` (absent/malformed — never throws). */
    async readAutoPullAttemptAt(key) {
      return (await readSyncState(key)).autoPullAttemptAt;
    },
    /**
     * Record an opportunistic auto-pull ATTEMPT (autopull.ts calls this BEFORE its network op —
     * see {@link SyncState.autoPullAttemptAt}: a failing/hanging pull must still back off for the
     * window).
     */
    async recordAutoPullAttempt(key, now = () => /* @__PURE__ */ new Date()) {
      await writeSyncState(key, { autoPullAttemptAt: now().toISOString() });
    },
    /** The one-time hook-install hint's shown-at timestamp, or `null` (absent/malformed — never throws). */
    async readHookHintedAt(key) {
      return (await readSyncState(key)).hookHintedAt;
    },
    /** Record that sync's one-time hook-install hint was shown for this clone (never shown again). */
    async recordHookHinted(key, now = () => /* @__PURE__ */ new Date()) {
      await writeSyncState(key, { hookHintedAt: now().toISOString() });
    }
  };
}

// ../board-git/src/engine.ts
import { existsSync as existsSync4, realpathSync as realpathSync4, statSync as statSync2 } from "node:fs";
import path8 from "node:path";
function realOrSame2(p) {
  try {
    return realpathSync4(p);
  } catch {
    return p;
  }
}
function isLinkedWorktree(p) {
  const r = runGit(p, ["rev-parse", "--absolute-git-dir", "--git-common-dir"]);
  if (r.status !== 0) return false;
  const [gitDirRaw, commonDirRaw] = r.stdout.trim().split("\n");
  if (!gitDirRaw || !commonDirRaw) return false;
  const commonDir = path8.isAbsolute(commonDirRaw) ? commonDirRaw : path8.resolve(p, commonDirRaw);
  return realOrSame2(gitDirRaw) !== realOrSame2(commonDir);
}
function hasGitFileSignature(p) {
  try {
    return statSync2(path8.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}
function retargetStaleBoardInteriorByPath(dir) {
  let cur = path8.resolve(dir);
  for (; ; ) {
    if (path8.basename(cur) === BUNDLE_DIR && hasGitFileSignature(cur)) {
      return path8.dirname(cur);
    }
    const parent = path8.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
function retargetBoardInterior(dir) {
  try {
    const top = repoTopLevel(dir);
    if (top && path8.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path8.dirname(top);
    }
  } catch {
  }
  return retargetStaleBoardInteriorByPath(dir) ?? dir;
}
function healStaleRebaseBeforeProvisioning(dir) {
  try {
    const top = repoTopLevel(dir);
    if (!top) return;
    const candidateBoardPath = path8.join(top, BUNDLE_DIR);
    if (!existsSync4(candidateBoardPath)) return;
    const boardTop = repoTopLevel(candidateBoardPath);
    if (!boardTop || realOrSame2(boardTop) !== realOrSame2(candidateBoardPath)) return;
    if (!isLinkedWorktree(candidateBoardPath)) return;
    if (detectStaleRebase(candidateBoardPath)) {
      abortStaleRebase(candidateBoardPath);
    }
  } catch {
  }
}
function resolveBundleKey(boardPath) {
  const checkoutRoot = realOrSame2(boardPath);
  const r = runGit(boardPath, ["remote", "get-url", BOARD_REMOTE]);
  if (r.status === 0 && r.stdout.trim().length > 0) {
    return bundleKey({ remoteUrl: r.stdout.trim(), subpath: "", checkoutRoot });
  }
  return bundleKey({ root: checkoutRoot });
}
function singleActor(docs) {
  if (docs.length === 0) return void 0;
  const actors = new Set(docs.map((d) => d.actor));
  return actors.size === 1 ? docs[0].actor : void 0;
}
function toDeltaRows(changes) {
  return changes.map((c) => ({ docId: c.docId, verb: c.verb, kind: c.kind, title: c.title, actor: c.actor }));
}
function provisionAnnouncement(outcome) {
  if (outcome.kind === "provisioned") {
    const detail = outcome.source === "remote" ? "materialized from origin/board" : "materialized from the local board branch";
    return { provisioned: `${outcome.boardPath} \u2014 ${detail}` };
  }
  if (outcome.kind === "repaired") {
    return { repaired: `${outcome.boardPath} \u2014 worktree pointers repaired` };
  }
  return void 0;
}

// ../board-git/src/autopull.ts
import path9 from "node:path";
import { realpathSync as realpathSync5, statSync as statSync3 } from "node:fs";
var AUTO_PULL_STALE_MS = 5 * 6e4;
var AUTO_PULL_BUDGET_MS = 2e3;
var AUTO_PULL_CONNECT_TIMEOUT_SECONDS = 2;
var NO_AUTOPULL_ENV = "AGENTSTATE_LITE_NO_AUTOPULL";
function realOrSame3(p) {
  try {
    return realpathSync5(p);
  } catch {
    return p;
  }
}
function hasGitFileSignature2(p) {
  try {
    return statSync3(path9.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}
function findBoardCandidate(start) {
  let cur = path9.resolve(start);
  for (; ; ) {
    if (path9.basename(cur) === BUNDLE_DIR && hasGitFileSignature2(cur)) {
      return { top: path9.dirname(cur), boardPath: cur };
    }
    const candidate = path9.join(cur, BUNDLE_DIR);
    if (hasGitFileSignature2(candidate)) return { top: cur, boardPath: candidate };
    const parent = path9.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
async function pullBoardAndRecord(store, boardPath, key, budget = {}, now = () => /* @__PURE__ */ new Date()) {
  const storedCursor = await store.readCursor(key);
  const startHead = currentHead(boardPath);
  const ff = ffPull(boardPath, budget);
  if (ff.swallowed) {
    return { swallowed: ff.swallowed, refreshed: false };
  }
  const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? startHead);
  if (delta.ok) {
    await store.writeCursor(key, { tier: "git", token: postPullHead });
    await store.writeCache(key, {
      updatedAt: now().toISOString(),
      delta: toDeltaRows(delta.changes),
      unpushedCount: unpushedCount(boardPath) ?? 0,
      uncommittedCount: countUncommitted(boardPath)
    });
  } else {
    await store.recordReanchor(
      key,
      { tier: "git", token: postPullHead },
      { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) },
      now
    );
  }
  return { refreshed: true };
}
async function maybeAutoPull(deps, dir, opts = {}) {
  try {
    const env = opts.env ?? process.env;
    if (env[NO_AUTOPULL_ENV]) return "disabled";
    const now = opts.now ?? (() => /* @__PURE__ */ new Date());
    const staleMs = opts.staleMs ?? AUTO_PULL_STALE_MS;
    const start = dir ?? process.cwd();
    const candidate = findBoardCandidate(start);
    if (!candidate) return "no-board";
    const boardPath = candidate.boardPath;
    if (opts.requireBoardBundle !== false) {
      const root = dir !== void 0 ? path9.resolve(dir) : await deps.resolveBundleRoot(start);
      if (!root || realOrSame3(root) !== realOrSame3(boardPath)) return "different-bundle";
    }
    const key = resolveBundleKey(boardPath);
    const state = await deps.store.readSyncState(key);
    const nowMs = now().getTime();
    const ageOk = (iso) => typeof iso === "string" && nowMs - Date.parse(iso) <= staleMs;
    if (ageOk(state.cache?.updatedAt)) return "fresh";
    if (ageOk(state.autoPullAttemptAt)) return "throttled";
    const gitTop = repoTopLevel(candidate.top);
    if (!gitTop || realOrSame3(path9.join(gitTop, BUNDLE_DIR)) !== realOrSame3(boardPath) || !isProvisioned(gitTop)) {
      return "no-board";
    }
    await deps.store.recordAutoPullAttempt(key, now);
    await deps.store.refreshMarker(key, now);
    const result = await pullBoardAndRecord(
      deps.store,
      boardPath,
      key,
      {
        fetchTimeoutMs: opts.budgetMs ?? AUTO_PULL_BUDGET_MS,
        connectTimeoutSeconds: opts.connectTimeoutSeconds ?? AUTO_PULL_CONNECT_TIMEOUT_SECONDS
      },
      now
    );
    return result.refreshed ? "pulled" : "skipped";
  } catch {
    return "error";
  }
}

// ../board-git/src/intree.ts
var IN_TREE_CURSOR_TIER = "git-intree";
function resolveInTreeUpstream(top) {
  const head = runGit(top, ["symbolic-ref", "-q", "--short", "HEAD"]);
  if (head.status !== 0) return { state: "none", reason: "detached-head" };
  const branch = head.stdout.trim();
  if (branch.length === 0) return { state: "none", reason: "detached-head" };
  const upstream = runGit(top, ["for-each-ref", "--format=%(upstream:short)", `refs/heads/${branch}`]);
  const ref = upstream.status === 0 ? upstream.stdout.trim() : "";
  if (ref.length === 0) return { state: "none", reason: "no-upstream" };
  const remoteR = runGit(top, ["config", "--get", `branch.${branch}.remote`]);
  const remoteName = remoteR.status === 0 ? remoteR.stdout.trim() : "";
  const remote = remoteName.length === 0 || remoteName === "." ? null : remoteName;
  return { state: "ok", config: { branch, ref, remote } };
}
function inTreeUpstreamSha(top, ref) {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  const sha = r.stdout.trim();
  return r.status === 0 && sha.length > 0 ? sha : null;
}
function inTreeBehindCount(top, upstream, prefix = BUNDLE_DIR) {
  const r = runGit(top, ["rev-list", "--count", `HEAD..${upstream}`, "--", prefix]);
  if (r.status !== 0) return null;
  const n = Number.parseInt(r.stdout.trim(), 10);
  return Number.isFinite(n) ? n : null;
}
function inTreeUnpushedCount(top, upstream, prefix = BUNDLE_DIR) {
  const r = runGit(top, ["rev-list", "--count", `${upstream}..HEAD`, "--", prefix]);
  if (r.status !== 0) return null;
  const n = Number.parseInt(r.stdout.trim(), 10);
  return Number.isFinite(n) ? n : null;
}
async function inTreeFetchAndRecord(store, top, key, budget = {}, now = () => /* @__PURE__ */ new Date()) {
  const resolution = resolveInTreeUpstream(top);
  if (resolution.state === "none") return { state: "no-upstream", reason: resolution.reason };
  const { ref, remote } = resolution.config;
  if (remote !== null) {
    let failure;
    try {
      const fetched = runGit(top, ["fetch", "--prune", remote], {
        timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
        connectTimeoutSeconds: budget.connectTimeoutSeconds
      });
      if (fetched.status !== 0) {
        failure = classifyGitError({
          args: ["fetch", "--prune", remote],
          status: fetched.status,
          stdout: fetched.stdout,
          stderr: fetched.stderr
        });
      }
    } catch (err) {
      if (!isBoardGitError(err)) throw err;
      failure = err;
    }
    if (failure) return { state: "fetch-failed", failure };
  }
  const sha = inTreeUpstreamSha(top, ref);
  if (sha === null) return { state: "unusable-upstream", ref };
  const prefix = BUNDLE_DIR;
  const unpushedCount2 = inTreeUnpushedCount(top, sha, prefix) ?? 0;
  const uncommittedCount = countUncommitted(top, prefix);
  const behind = inTreeBehindCount(top, sha, prefix) ?? 0;
  const stored = await store.readCursor(key);
  const token = stored && stored.tier === IN_TREE_CURSOR_TIER && typeof stored.token === "string" ? stored.token : void 0;
  if (token !== void 0) {
    const exists2 = runGit(top, ["cat-file", "-e", `${token}^{commit}`]).status === 0;
    const isAncestorOfUpstream = exists2 && runGit(top, ["merge-base", "--is-ancestor", token, sha]).status === 0;
    if (!isAncestorOfUpstream) {
      await store.recordReanchor(key, { tier: IN_TREE_CURSOR_TIER, token: sha }, { unpushedCount: unpushedCount2, uncommittedCount }, now);
      return {
        state: "refreshed",
        upstreamRef: ref,
        upstreamSha: sha,
        changes: [],
        behind,
        unpushedCount: unpushedCount2,
        uncommittedCount,
        reanchored: true
      };
    }
  }
  let baseline;
  if (token !== void 0) {
    baseline = token;
  } else {
    const mb = runGit(top, ["merge-base", "HEAD", sha]);
    baseline = mb.status === 0 && mb.stdout.trim().length > 0 ? mb.stdout.trim() : sha;
  }
  const changes = diffDocsBetween(top, baseline, sha, { prefix });
  await store.writeCursor(key, { tier: IN_TREE_CURSOR_TIER, token: sha });
  await store.writeCache(key, {
    updatedAt: now().toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount2,
    uncommittedCount
  });
  return {
    state: "refreshed",
    upstreamRef: ref,
    upstreamSha: sha,
    changes,
    behind,
    unpushedCount: unpushedCount2,
    uncommittedCount,
    reanchored: false
  };
}

// src/bundle.ts
import { promises as fs3 } from "node:fs";
import path10 from "node:path";

// src/errors.ts
var EXIT = {
  /** success or definitive no-op/empty */
  OK: 0,
  /** recoverable runtime error (5xx / transient) */
  RUNTIME: 1,
  /** usage error: bad/missing flags, parse failure, not-implemented */
  USAGE: 2,
  /** auth required: no/expired creds, refresh failed, audience mismatch */
  AUTH: 4,
  /** CAS / precondition conflict: head moved, expected-* mismatch */
  CONFLICT: 5,
  /** not found: doc_key / doc_id / concept id absent */
  NOT_FOUND: 6
};
var CODE_EXIT = {
  AUTH_REQUIRED: EXIT.AUTH,
  AUDIENCE_MISMATCH: EXIT.AUTH,
  NOT_FOUND: EXIT.NOT_FOUND,
  STALE_HEAD: EXIT.CONFLICT,
  ALREADY_EXISTS: EXIT.CONFLICT,
  UNSUPPORTED_MEDIA_TYPE: EXIT.USAGE,
  INTEGRITY_MISMATCH: EXIT.RUNTIME,
  NOT_IMPLEMENTED: EXIT.USAGE,
  USAGE: EXIT.USAGE,
  TRANSIENT: EXIT.RUNTIME,
  RUNTIME: EXIT.RUNTIME,
  FORBIDDEN: EXIT.USAGE,
  LAST_ADMIN: EXIT.CONFLICT,
  GIT_MISSING: EXIT.RUNTIME,
  NO_UPSTREAM: EXIT.RUNTIME,
  GIT_BUSY: EXIT.RUNTIME,
  CONFLICT: EXIT.CONFLICT
};
var CliError = class extends Error {
  code;
  exitCode;
  details;
  help;
  /** See CliErrorOptions.handled — the bin wrapper skips the stdout envelope when true. */
  handled;
  constructor(code, message, opts = {}) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = CODE_EXIT[code];
    this.handled = opts.handled ?? false;
    if (opts.details !== void 0) this.details = opts.details;
    if (opts.help !== void 0) this.help = opts.help;
  }
};
function toEnvelope(err) {
  const e = { code: err.code, message: err.message };
  if (err.details !== void 0) e.details = err.details;
  if (err.help !== void 0) e.help = err.help;
  return { error: e };
}
function classifyBundleError(err, remoteUrl) {
  if (err instanceof CliError) return err;
  if (isBoardGitError(err)) return cliErrorFromBoardGit(err);
  if (err instanceof InvalidInputError) return new CliError("USAGE", err.message);
  if (err instanceof MalformedDocumentError) return new CliError("RUNTIME", err.message);
  if (err instanceof VersionConflict) {
    return new CliError("STALE_HEAD", err.message, {
      details: { expected: err.expected, actual: err.actual }
    });
  }
  if (err instanceof RemoteError) {
    if (err.code === "AUTH_REQUIRED") {
      return new CliError("AUTH_REQUIRED", err.message, {
        help: `set AGENTSTATE_LITE_API_KEY=<key> and retry the same command against --remote ${remoteUrl ?? "<url>"}; an already-provisioned stored per-origin credential is also accepted`
      });
    }
    if (err.code === "RUNTIME" || err.code === "VERSION_MISSING") {
      return new CliError("RUNTIME", err.message);
    }
    if (err.code === "FORBIDDEN") {
      return new CliError("FORBIDDEN", err.message);
    }
    if (err.code === "NOT_FOUND") {
      return new CliError("NOT_FOUND", err.message);
    }
    if (err.code === "LAST_ADMIN") {
      return new CliError("LAST_ADMIN", err.message);
    }
    if (err.code === "RATE_LIMITED" || err.status === 429) {
      return new CliError("TRANSIENT", err.message, { details: { retryable: true, status: err.status } });
    }
    if (err.status >= 500) {
      return new CliError("RUNTIME", err.message);
    }
    return new CliError("USAGE", err.message);
  }
  return new CliError("RUNTIME", err instanceof Error ? err.message : String(err));
}
function toExit(err) {
  const cliErr = classifyBundleError(err);
  return { exitCode: cliErr.exitCode, envelope: toEnvelope(cliErr), handled: cliErr.handled };
}
function cliErrorFromBoardGit(err) {
  return new CliError(err.code, err.message, {
    ...err.details !== void 0 ? { details: err.details } : {},
    ...err.help !== void 0 ? { help: err.help } : {}
  });
}
function asHandled(err) {
  const classified = classifyBundleError(err);
  return new CliError(classified.code, classified.message, {
    details: classified.details,
    help: classified.help,
    handled: true
  });
}

// src/invocation.ts
import { fileURLToPath } from "node:url";
import { realpathSync as realpathSync6 } from "node:fs";
import { delimiter, join as join3 } from "node:path";
import { homedir as homedir3 } from "node:os";
var PACKAGE_NAME = "aslite";
var BIN_NAMES = ["aslite", "agentstate-lite"];
function collapseHomeDirectory2(p) {
  const home2 = homedir3();
  if (home2 && (p === home2 || p.startsWith(home2 + "/"))) {
    return "~" + p.slice(home2.length);
  }
  return p;
}
function realOrUndefined(p) {
  try {
    return realpathSync6(p);
  } catch {
    return void 0;
  }
}
function currentExecutableRealPath() {
  const fromModule = realOrUndefined(fileURLToPath(import.meta.url));
  if (fromModule) return fromModule;
  const argv1 = process.argv[1];
  return argv1 ? realOrUndefined(argv1) : void 0;
}
function binNameOnPath() {
  const exe = currentExecutableRealPath();
  if (!exe) return void 0;
  const dirs = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  for (const name of BIN_NAMES) {
    for (const dir of dirs) {
      const resolved = realOrUndefined(join3(dir, name));
      if (resolved && resolved === exe) return name;
    }
  }
  return void 0;
}
function isSkillBundlePath(exe) {
  const parts = exe.split("/");
  const base = parts[parts.length - 1];
  const parentDir = parts[parts.length - 2];
  return base === "agentstate-lite.mjs" && parentDir === "scripts";
}
function cliInvocation() {
  const onPath = binNameOnPath();
  if (onPath) return onPath;
  const exe = currentExecutableRealPath();
  if (exe && isSkillBundlePath(exe)) return collapseHomeDirectory2(exe);
  return `npx -y ${PACKAGE_NAME}`;
}
function binPath() {
  const exe = currentExecutableRealPath();
  return exe ? collapseHomeDirectory2(exe) : PACKAGE_NAME;
}
function hookCommand() {
  return binNameOnPath() ?? currentExecutableRealPath() ?? PACKAGE_NAME;
}

// src/config.ts
function normalizeServer(raw) {
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error(`invalid server URL: ${raw}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`server URL must use http or https: ${raw}`);
  }
  const path23 = url.pathname.replace(/\/+$/, "");
  return { base: url.origin + path23, resource: url.origin };
}

// src/credentials.ts
import { chmod as chmod2, mkdir as mkdir2, open, readFile as readFile2, rename, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { homedir as homedir4 } from "node:os";
import { join as join4 } from "node:path";
var CRED_DIR_NAME = ".agentstate";
var CRED_FILE_NAME = "okf-config.json";
var DIR_MODE2 = 448;
var FILE_MODE = 384;
function credentialsDir(home2 = homedir4()) {
  return join4(home2, CRED_DIR_NAME);
}
function credentialsPath(home2 = homedir4()) {
  return join4(credentialsDir(home2), CRED_FILE_NAME);
}
async function writeFileAtomic0600(dir, fileName, content) {
  await mkdir2(dir, { recursive: true, mode: DIR_MODE2 });
  await chmod2(dir, DIR_MODE2);
  const path23 = join4(dir, fileName);
  const tmpPath = join4(dir, `.${fileName}.${randomBytes(8).toString("hex")}.tmp`);
  const handle = await open(tmpPath, "wx", FILE_MODE);
  try {
    await handle.writeFile(content);
    await handle.chmod(FILE_MODE);
  } finally {
    await handle.close();
  }
  try {
    await rename(tmpPath, path23);
  } catch (err) {
    await unlink(tmpPath).catch(() => {
    });
    throw err;
  }
}
async function loadCredentials(home2 = homedir4()) {
  let raw;
  try {
    raw = await readFile2(credentialsPath(home2), "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const hasRemotes = parsed.remotes !== void 0 && parsed.remotes !== null && Object.keys(parsed.remotes).length > 0;
  if (!hasRemotes) return null;
  return parsed;
}
function isNonEmptyString(v) {
  return typeof v === "string" && v.length > 0;
}
async function getApiKeyForOrigin(origin, home2 = homedir4()) {
  const creds = await loadCredentials(home2);
  const key = creds?.remotes?.[origin]?.api_key;
  return isNonEmptyString(key) ? key : void 0;
}

// src/bundle.ts
async function exists(p) {
  try {
    await fs3.stat(p);
    return true;
  } catch {
    return false;
  }
}
function resolveTargetDir(dirFlag) {
  return path10.resolve(dirFlag ?? process.cwd());
}
async function findAncestorWithFile(start, filename) {
  let dir = path10.resolve(start);
  while (true) {
    if (await exists(path10.join(dir, filename))) return dir;
    const parent = path10.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
var CONVENTIONAL_BUNDLE_DIR_NAME = BUNDLE_DIR;
async function findBundleRoot(start) {
  let dir = path10.resolve(start);
  while (true) {
    if (await exists(path10.join(dir, "index.md"))) return dir;
    const conventional = path10.join(dir, CONVENTIONAL_BUNDLE_DIR_NAME);
    if (await exists(path10.join(conventional, "index.md"))) return conventional;
    const parent = path10.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
var PROJECT_BINDING_FILE_NAME = ".agentstate.json";
function bindingUriIntent(value) {
  if (/^[A-Za-z]:(?!\/\/)/.test(value)) return null;
  if (value.startsWith("//")) {
    return { detail: `protocol-relative URL ${value}` };
  }
  const match = /^([A-Za-z][A-Za-z0-9+.-]*):/.exec(value);
  if (!match) return null;
  const scheme = match[1].toLowerCase();
  if (scheme !== "http" && scheme !== "https") {
    return { detail: `unsupported URI scheme "${scheme}" in ${value}` };
  }
  try {
    const url = new URL(value);
    if (url.protocol === `${scheme}:`) return { detail: `remote URL ${value}`, suggestedRemote: value };
  } catch {
  }
  return { detail: `invalid ${scheme} URL ${value}` };
}
async function resolveProjectBinding(startDir = process.cwd()) {
  const dir = await findAncestorWithFile(startDir, PROJECT_BINDING_FILE_NAME);
  if (!dir) return null;
  const file = path10.join(dir, PROJECT_BINDING_FILE_NAME);
  let raw;
  try {
    raw = await fs3.readFile(file, "utf8");
  } catch (err) {
    throw new CliError(
      "USAGE",
      `could not read project binding ${file}: ${err instanceof Error ? err.message : String(err)}`,
      { help: `fix or remove ${file}` }
    );
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new CliError(
      "USAGE",
      `malformed project binding ${file}: invalid JSON (${err instanceof Error ? err.message : String(err)})`,
      { help: `fix or remove ${file}` }
    );
  }
  const rawBundle = parsed?.bundle;
  if (typeof rawBundle !== "string" || rawBundle.trim() === "") {
    throw new CliError(
      "USAGE",
      `malformed project binding ${file}: "bundle" must be a non-empty filesystem path`,
      { help: `fix or remove ${file}` }
    );
  }
  const trimmed = rawBundle.trim();
  const uriIntent = bindingUriIntent(trimmed);
  if (uriIntent) {
    const remote = uriIntent.suggestedRemote ?? "<url>";
    throw new CliError(
      "USAGE",
      `project binding ${file} cannot use ${uriIntent.detail}; URL bindings no longer activate remotes \u2014 pass --remote ${remote} explicitly or replace "bundle" with a filesystem path`,
      { help: `${cliInvocation()} <command> --remote ${remote}` }
    );
  }
  return { file, target: path10.resolve(dir, trimmed) };
}
function wrapTransportErrors(remote) {
  return async (request) => {
    try {
      return await globalThis.fetch(request);
    } catch (err) {
      throw new CliError(
        "RUNTIME",
        `could not reach the remote bundle at ${remote} (${err instanceof Error ? err.message : String(err)})`,
        { help: `${cliInvocation()} serve --dir <path>` }
      );
    }
  };
}
var API_KEY_ENV_VAR = "AGENTSTATE_LITE_API_KEY";
async function openRemoteBundle(remoteFlag) {
  let base;
  let origin;
  try {
    const resolved = normalizeServer(remoteFlag);
    base = resolved.base;
    origin = resolved.resource;
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} <command> --remote http://127.0.0.1:4818`
    });
  }
  const envKey = process.env[API_KEY_ENV_VAR]?.trim();
  const authToken = envKey || await getApiKeyForOrigin(origin);
  const backend = new RemoteBackend({
    baseUrl: base,
    bundle: "default",
    fetchImpl: wrapTransportErrors(base),
    authToken
  });
  return { root: base, backend };
}
var REMOTE_ENV_VAR = "AGENTSTATE_LITE_REMOTE";
async function resolveRemoteFlag(remoteFlag, dirFlag) {
  if (remoteFlag !== void 0) return remoteFlag;
  if (dirFlag !== void 0) return void 0;
  if (process.env[REMOTE_ENV_VAR] !== void 0) {
    const legacy = process.env[REMOTE_ENV_VAR]?.trim();
    throw new CliError(
      "USAGE",
      `${REMOTE_ENV_VAR} ambient remote selection is retired; pass --remote <url> explicitly`,
      { help: `${cliInvocation()} <command> --remote ${legacy || "<url>"}` }
    );
  }
  await resolveProjectBinding();
  return void 0;
}
async function canonicalBundleRoot(root, notFoundMessage, help) {
  if (!await exists(path10.join(root, "index.md"))) {
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
  try {
    return await fs3.realpath(root);
  } catch {
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
}
async function resolveLocalBundleTarget(dirFlag, startDir = process.cwd()) {
  if (dirFlag !== void 0) {
    const requested = path10.resolve(startDir, dirFlag);
    const canonicalRoot2 = await canonicalBundleRoot(
      requested,
      `no OKF bundle at ${requested} (no index.md)`,
      `${cliInvocation()} init --dir ${dirFlag}`
    );
    return { root: requested, canonicalRoot: canonicalRoot2, selectedBy: "explicit-dir" };
  }
  const binding = await resolveProjectBinding(startDir);
  if (binding) {
    const canonicalRoot2 = await canonicalBundleRoot(
      binding.target,
      `no OKF bundle at ${binding.target} (no index.md) \u2014 from project binding ${binding.file}`,
      `${cliInvocation()} init --dir ${binding.target}`
    );
    return {
      root: binding.target,
      canonicalRoot: canonicalRoot2,
      selectedBy: "project-binding",
      bindingFile: binding.file
    };
  }
  const discovered = await findBundleRoot(startDir);
  if (!discovered) {
    throw new CliError(
      "NOT_FOUND",
      `no OKF bundle found (no index.md, and no ${CONVENTIONAL_BUNDLE_DIR_NAME}/index.md, in the current directory or its ancestors)`,
      { help: `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}` }
    );
  }
  const canonicalRoot = await canonicalBundleRoot(
    discovered,
    `no OKF bundle at ${discovered} (no index.md)`,
    `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}`
  );
  return { root: discovered, canonicalRoot, selectedBy: "discovery" };
}
async function openBundle(dirFlag, remoteFlag) {
  if (remoteFlag !== void 0) {
    if (dirFlag !== void 0) {
      throw new CliError(
        "USAGE",
        "--remote and --dir are mutually exclusive",
        { help: `${cliInvocation()} <command> --remote <url>` }
      );
    }
    return openRemoteBundle(remoteFlag);
  }
  const target = await resolveLocalBundleTarget(dirFlag);
  return { root: target.root };
}

// src/args.ts
var QUOTED = /'([^']+)'/;
function stripAdvisory(msg) {
  const noPositionalHint = msg.split(". To specify a positional argument")[0] ?? msg;
  const noAmbiguousHint = noPositionalHint.split("\nDid you forget")[0] ?? noPositionalHint;
  return noAmbiguousHint.trim();
}
function translateParseArgsError(err) {
  if (!(err instanceof Error)) return null;
  const code = err.code;
  if (typeof code !== "string") return null;
  const tok = QUOTED.exec(err.message)?.[1];
  switch (code) {
    case "ERR_PARSE_ARGS_UNKNOWN_OPTION":
      return tok ? `unknown option '${tok}'` : stripAdvisory(err.message);
    case "ERR_PARSE_ARGS_INVALID_OPTION_VALUE": {
      const opt = tok ? tok.split(/\s+/)[0] ?? tok : void 0;
      if (/does not take an argument/.test(err.message))
        return opt ? `option '${opt}' takes no value` : stripAdvisory(err.message);
      return opt ? `option '${opt}' requires a value` : stripAdvisory(err.message);
    }
    case "ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL":
      return tok ? `unexpected argument '${tok}'` : stripAdvisory(err.message);
    default:
      return null;
  }
}
function parseOrUsage(parse2, command) {
  try {
    return parse2();
  } catch (err) {
    if (err instanceof CliError) throw err;
    const translated = translateParseArgsError(err);
    const raw = err instanceof Error ? err.message : String(err);
    const message = translated ?? stripAdvisory(raw);
    throw new CliError("USAGE", message, { help: `${cliInvocation()} ${command} --help` });
  }
}

// src/output.ts
function resolveMode(flags) {
  if (flags.json) return "json";
  return "default";
}
function render(value, mode) {
  switch (mode) {
    case "json":
      return `${JSON.stringify(value)}
`;
    case "default":
      return `${encode(value)}
`;
  }
}
function renderErrorEnvelope(envelope) {
  return `${encode(envelope)}
`;
}

// ../core/src/page.ts
var PAGE_REGISTRY_PREFIX = "pages-registry/";
var PAGE_ENTRY_PREFIX = "pages/";
var VIEW_REGISTRY_PREFIX = "views-registry/";
var VIEW_ENTRY_PREFIX = "views/";
var PAGE_TYPE_NAMES = ["Page", "View"];
function resolveBridgeCapability(value) {
  return value === "bundle-read" || value === "bundle-propose" ? value : "none";
}
function isPageTypeName(value) {
  return value === "Page" || value === "View";
}
var PAGE_SEGMENT = /^[A-Za-z0-9._-]+$/;
function hasSafePageSegments(value, prefix) {
  if (!value.startsWith(prefix) || value.length === prefix.length) return false;
  if (value.startsWith("/") || /[\\%?#]/.test(value)) return false;
  const segments = value.slice(prefix.length).split("/");
  return segments.every(
    (segment) => !segment.startsWith(".") && PAGE_SEGMENT.test(segment) && !segment.toLowerCase().endsWith(".md")
  );
}
function isRegistryIdUnder(id, prefix) {
  if (typeof id !== "string" || !hasSafePageSegments(id, prefix)) {
    return false;
  }
  try {
    assertSafeConceptId(id);
    return true;
  } catch {
    return false;
  }
}
function isEntryKeyUnder(entry, prefix) {
  if (typeof entry !== "string" || !hasSafePageSegments(entry, prefix)) return false;
  try {
    assertSafeBlobKey(entry);
    return true;
  } catch {
    return false;
  }
}
function isPageRegistryId(id) {
  return isRegistryIdUnder(id, PAGE_REGISTRY_PREFIX);
}
function isViewRegistryId(id) {
  return isRegistryIdUnder(id, VIEW_REGISTRY_PREFIX);
}
function isAnyRegistryId(id) {
  return isPageRegistryId(id) || isViewRegistryId(id);
}
function isPageEntryKey(entry) {
  return isEntryKeyUnder(entry, PAGE_ENTRY_PREFIX);
}
function isViewEntryKey(entry) {
  return isEntryKeyUnder(entry, VIEW_ENTRY_PREFIX);
}
function isAnyEntryKey(entry) {
  return isPageEntryKey(entry) || isViewEntryKey(entry);
}
function parseRegistration(id, frontmatter) {
  if (!isAnyRegistryId(id) || !isPageTypeName(frontmatter.type) || !isAnyEntryKey(frontmatter.entry)) return null;
  return { id, type: frontmatter.type, entry: frontmatter.entry };
}

// src/recipes.ts
import { isDeepStrictEqual } from "node:util";
var CONTEXT_NOTE_TYPE = "Context Note";
var CONTEXT_NOTE_KIND = {
  id: "conventions/context-note",
  title: CONTEXT_NOTE_TYPE,
  governs: CONTEXT_NOTE_TYPE,
  path: "context-notes/",
  fields: {
    required: ["title", "timestamp"],
    optional: ["description", "tags"],
    values: {},
    valueDescriptions: {},
    terminal: {},
    descriptions: {}
  },
  sections: ["Summary"],
  freshnessHorizon: "24h"
};
var CONTEXT_NOTE_SEED_BODY = '# Context Note\n\nAn agent\'s cross-session orientation note: what happened, what was decided, and what\'s still open. Create one with `new "Context Note" <id>` (scaffolds the `# Summary` section under `context-notes/`), read it with `doc read`, and edit it with `doc update` / `doc write`. `status` surfaces this kind\'s 24h freshness horizon across the bundle.\n\n## Declaring a kind convention\n\nA kind convention is a plain OKF doc (`type: Convention`) living under `conventions/`. Its FRONTMATTER is the only part core parses (this prose is not). Supported frontmatter keys:\n\n- `governs` (required, non-empty) \u2014 the `type` value this convention governs.\n- `title` (optional) \u2014 display title; defaults to `governs`.\n- `description` (optional) \u2014 the kind\'s purpose and intended use.\n- `path` (optional) \u2014 canonical bundle-relative path prefix instances are scaffolded under (e.g. `roadmap/`).\n- `fields.required` \u2014 list of field names an instance MUST carry (non-empty).\n- `fields.optional` \u2014 list of field names an instance MAY carry.\n- `fields.descriptions` \u2014 a MAP of `field name -> human guidance` for declared fields.\n- `fields.values` \u2014 a MAP of `field name -> list of allowed values`. This is the ONLY place an enum constraint goes \u2014 never a top-level `enum:`/`enums:`/`values:`/`constraints:` key, and never a field named directly at the top level either.\n- `sections` \u2014 list of expected level-1 (`# Heading`) body-section names. Declare only the headings EVERY instance must carry (this Context Note kind declares just `Summary`, the one section `new "Context Note"` scaffolds and every instance carries).\n- `freshness_horizon` \u2014 `<n>(m|h|d)`, e.g. `24h`, `30d`, `15m`.\n\nWorked example (a `Roadmap Item` kind, with an enum-restricted field and expected sections):\n\n```yaml\n---\ntype: Convention\ntitle: Roadmap Item\ngoverns: Roadmap Item\ndescription: A durable line of work that groups related tasks.\npath: roadmap/\nfields:\n  required: [title, status]\n  optional: [horizon]\n  values:\n    status: [planned, active, done]\n  descriptions:\n    title: A concise summary of the outcome.\n    status: The roadmap item\'s current lifecycle state.\n    horizon: The expected delivery window.\nsections: [Why, "Done when"]\nfreshness_horizon: 30d\n---\n```\n';
var CONTEXT_NOTES_SUMMARY = "Declares the built-in Context Note kind convention (title/timestamp required, 24h freshness horizon)";
var RECIPE_DESC_BODY = "# Context Notes\n\nInstalls the `Context Note` kind convention: a lightweight cross-session orientation note \u2014 what happened, what was decided, what's still open. Declares the `Context Note` type's required fields, the `# Summary` scaffold section, and a 24h freshness horizon.\n\nApplied by default on `init` (opt out with `init --recipe none`), or on demand with `recipe add context-notes`.\n";
var TASK_TYPE = "Task";
var TASK_KIND = {
  id: "conventions/task",
  title: TASK_TYPE,
  governs: TASK_TYPE,
  description: "A concrete unit of work that can be claimed, prioritized, assigned, and completed.",
  path: "tasks/",
  // The typed-edge vocabulary (decisions/typed-links-carrier): a task's dependency edge is a
  // link whose display text is exactly "depends on", targeting another Task. Declared here so
  // `kinds` teaches the vocabulary to any agent that orients — discovery shipped; validation
  // is a future consumer.
  links: { "depends on": TASK_TYPE },
  fields: {
    required: ["title", "status"],
    optional: ["priority", "assignee", "description"],
    values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] },
    valueDescriptions: {},
    // The terminal declaration (tasks/status-terminal-declaration.md): done/canceled are the
    // states past which a Task is no longer open — machinery (list --open, the status sweep's
    // exclusion + sort) ships together with the declaration for every new bundle.
    terminal: { status: ["done", "canceled"] },
    descriptions: {
      title: "A concise human-readable summary of the work.",
      status: "The task's current lifecycle state.",
      priority: "Relative urgency used to order the work; follow the bundle's adopted priority scale.",
      assignee: "The person or agent currently responsible for the task.",
      description: "The task's scope, context, acceptance criteria, and other working details."
    }
  },
  freshnessHorizon: "30d"
};
var TASK_SEED_BODY = '# Task\n\nA unit of work, composed entirely from lite primitives \u2014 no bespoke task engine.\nA task is a `type: Task` doc; its `status` is a validated enum; its DEPENDENCIES are\ntyped `depends on` cross-links to prerequisite task docs (the declared link type \u2014\nthe link graph IS the DAG, and `link show <id> --text "depends on"` shows both\ndirections); an atomic CLAIM is a compare-and-swap write flipping `status` to\n`in_progress` (a second claimer gets a VersionConflict). Query with `list --type Task`;\nlint/orphans/staleness via `status`.\n';
var WORK_TRACKING_SUMMARY = "Declares the built-in Task kind convention (title/status required, status enum, 'depends on' link type, 30d freshness horizon)";
var WORK_TRACKING_DESC_BODY = "# Work Tracking\n\nInstalls the `Task` kind convention: a unit of work with a validated `status` enum (todo/in_progress/blocked/done/canceled), scaffolded under `tasks/`. Status/priority/assignee are FIELDS of Task, not separate conventions or a bespoke task verb \u2014 dependencies, claiming, and querying all compose from existing generic primitives (`link add`, CAS `doc update`, `list --type Task`, `status`).\n\nApplied on demand with `recipe add work-tracking` (not part of `init`'s default \u2014 that stays `context-notes`).\n";
var ROADMAP_TYPE = "Roadmap";
var ROADMAP_ITEM_TYPE = "Roadmap Item";
var ROADMAP_KIND = {
  id: "conventions/roadmap",
  title: ROADMAP_TYPE,
  governs: ROADMAP_TYPE,
  // The typed-edge vocabulary: the spine's ownership edge is a link whose display text is exactly
  // "contains", targeting a Roadmap Item — declared so `kinds` teaches it and `link add`'s graph
  // lint validates it.
  links: { contains: ROADMAP_ITEM_TYPE },
  // No status field on the spine, so nothing to declare terminal (Brian's ruling on the
  // task board's `tasks/status-terminal-declaration.md`).
  fields: { required: ["title"], optional: [], values: {}, valueDescriptions: {}, terminal: {}, descriptions: {} }
};
var ROADMAP_SEED_BODY = "# Roadmap\n\nThe spine document: a single top-level roadmap doc that CONTAINS the bundle's Roadmap\nItems via typed links carrying the text `contains` (`link add <roadmap> <item> --text\ncontains`), making the whole roadmap \u2192 item \u2192 task chain one filtered query per hop\n(`link show <id> --text contains`). Progress is DERIVED, never stored: list the\ncontained items and read their statuses.\n";
var ROADMAP_ITEM_KIND = {
  id: "conventions/roadmap-item",
  title: ROADMAP_ITEM_TYPE,
  governs: ROADMAP_ITEM_TYPE,
  path: "roadmap-items/",
  links: { contains: "Task" },
  linkDescriptions: { contains: "Tasks whose delivery is governed by this roadmap commitment." },
  fields: {
    required: ["title", "status"],
    optional: ["description", "sequence"],
    values: { status: ["queued", "active", "done"] },
    valueDescriptions: {},
    // Brian's ruling (task board `tasks/status-terminal-declaration.md`): a done Roadmap Item
    // hides from `list --open`, consistent with Task's done/canceled.
    terminal: { status: ["done"] },
    descriptions: {}
  }
};
var ROADMAP_ITEM_SEED_BODY = '# Roadmap Item\n\nA durable line of work spanning multiple tasks \u2014 the granular form of the single\nroadmap spine doc. An item CONTAINS its tasks via links carrying the text `contains`;\nbacklinks from a task answer "which item owns this". An item\'s progress is DERIVED,\nnever stored: list its contained tasks and read their statuses (the rollup). `status`\ntracks the item itself: `queued` (not started) \u2192 `active` (any contained task moving)\n\u2192 `done` (all contained tasks done or canceled).\n';
var ROADMAP_SUMMARY = "Declares the Roadmap + Roadmap Item kind conventions (typed 'contains' links, roadmap \u2192 item \u2192 task; item status enum queued/active/done) \u2014 work-tracking's companion";
var ROADMAP_DESC_BODY = "# Roadmap\n\nInstalls the `Roadmap` and `Roadmap Item` kind conventions: roadmap-items-as-docs. A single\n`Roadmap` spine doc CONTAINS `Roadmap Item` docs; each item CONTAINS its `Task` docs \u2014 all\nvia typed links carrying the text `contains`, so the whole roadmap \u2192 item \u2192 task chain is\none filtered query per hop (`link show <id> --text contains`). An item's progress is derived\nfrom its contained tasks' statuses, never stored.\n\nApplied on demand with `recipe add roadmap` (not part of `init`'s default \u2014 that stays\n`context-notes`). Composes with the `work-tracking` recipe (the `Task` kind this recipe's\n`contains` vocabulary points at) \u2014 apply both for the full chain.\n\n## Pairing the Task kind (opt-in, one documented step)\n\nThe graph lint that answers \"which tasks have no owning Roadmap Item\" reads\n`expects_inbound` on the TASK kind's convention (`status` then reports\n`missing_expected_links`). A recipe applies via expect-absent CAS and never touches a doc\nthat already exists, so this recipe cannot patch your bundle's `conventions/task` \u2014 the\npairing is a deliberate one-step opt-in on the adopting bundle:\n\n```\nagentstate-lite pull --doc-key conventions/task.md --out task.md\n# edit task.md \u2014 add to the frontmatter:\n#   expects_inbound:\n#     contains: Roadmap Item\nagentstate-lite promote task.md --doc-key conventions/task.md --expected-version <version from the pull receipt>\n```\n\nWithout this step everything else still works (the `contains` vocabulary and its link-type\nvalidation come from THIS recipe's conventions); only the \"task lacks an owning item\" lint\nstays off.\n";
var [LEGACY_VIEW_KIND_NAME, VIEW_KIND_NAME] = PAGE_TYPE_NAMES;
function legacyRegistryAlias(id) {
  return id.startsWith(VIEW_REGISTRY_PREFIX) ? `${PAGE_REGISTRY_PREFIX}${id.slice(VIEW_REGISTRY_PREFIX.length)}` : null;
}
function legacyEntryAlias(key) {
  return key.startsWith(VIEW_ENTRY_PREFIX) ? `${PAGE_ENTRY_PREFIX}${key.slice(VIEW_ENTRY_PREFIX.length)}` : null;
}
function governsKind(doc2, kindName) {
  const governs = doc2.frontmatter["governs"];
  return typeof governs === "string" && governs.trim() === kindName;
}
async function findLegacyViewConvention(bundle) {
  const conventions = await query(bundle, { prefix: CONVENTIONS_PREFIX, type: "Convention" });
  for (const doc2 of conventions) {
    if (governsKind(doc2, LEGACY_VIEW_KIND_NAME)) return doc2.id;
  }
  return null;
}
async function applyRecipe(bundle, recipe2, now = (/* @__PURE__ */ new Date()).toISOString()) {
  await assertPortableTargetsCompatible(bundle, recipe2, now);
  const legacyConventionId = recipe2.docs.some((d) => governsKind(d, VIEW_KIND_NAME)) ? await findLegacyViewConvention(bundle) : null;
  let legacyRegistryIds = null;
  const legacyRegistryExists = async (id) => {
    legacyRegistryIds ??= new Set((await query(bundle, { prefix: PAGE_REGISTRY_PREFIX })).map((doc2) => doc2.id));
    return legacyRegistryIds.has(id);
  };
  const docs = [];
  for (const d of recipe2.docs) {
    if (legacyConventionId !== null && governsKind(d, VIEW_KIND_NAME)) {
      docs.push({ id: d.id, changed: false, legacy_present: legacyConventionId });
      continue;
    }
    const doc2 = { ...d, frontmatter: { ...d.frontmatter, timestamp: now } };
    let changed = true;
    try {
      await writeDocVersioned(bundle, doc2, { expectedVersion: null });
    } catch (err) {
      if (err instanceof VersionConflict) {
        changed = false;
      } else {
        throw err;
      }
    }
    docs.push({ id: doc2.id, changed });
  }
  const pages = [];
  for (const page of recipe2.pages) {
    const registryAlias = legacyRegistryAlias(page.registry.id);
    const entryAlias = legacyEntryAlias(page.entry);
    if (registryAlias !== null && entryAlias !== null && await legacyRegistryExists(registryAlias)) {
      const legacyBlob = await readBlob(bundle, entryAlias);
      if (legacyBlob !== null) {
        pages.push({
          registry_id: page.registry.id,
          entry: page.entry,
          registry_changed: false,
          entry_changed: false,
          changed: false,
          legacy_present: { registry: registryAlias, entry: entryAlias }
        });
        continue;
      }
    }
    const desiredBytes = Buffer.from(page.html, "utf8");
    let entryChanged = true;
    try {
      await writeBlob(bundle, page.entry, desiredBytes, void 0, { expectedVersion: null });
    } catch (err) {
      if (!(err instanceof VersionConflict)) throw err;
      const existing = await readBlob(bundle, page.entry);
      const sameBytes = existing !== null && Buffer.from(existing.bytes).equals(desiredBytes);
      const sameContentType = existing?.contentType === resolveContentType(page.entry);
      if (!sameBytes || !sameContentType) throw recipeAssetConflict(recipe2.id, page.entry);
      entryChanged = false;
    }
    const registry = {
      ...page.registry,
      frontmatter: { ...page.registry.frontmatter, timestamp: now }
    };
    let registryChanged = true;
    try {
      await writeDocVersioned(bundle, registry, { expectedVersion: null });
    } catch (err) {
      if (!(err instanceof VersionConflict)) throw err;
      const existing = await readDoc(bundle, registry.id);
      if (!sameInstalledDoc(existing, registry)) throw recipeAssetConflict(recipe2.id, `${registry.id}.md`);
      registryChanged = false;
    }
    pages.push({
      registry_id: registry.id,
      entry: page.entry,
      registry_changed: registryChanged,
      entry_changed: entryChanged,
      changed: registryChanged || entryChanged
    });
  }
  const references = [];
  for (const reference of recipe2.references) {
    const desired = {
      ...reference.doc,
      frontmatter: { ...reference.doc.frontmatter, timestamp: now }
    };
    let changed = true;
    try {
      await writeDocVersioned(bundle, desired, { expectedVersion: null });
    } catch (err) {
      if (!(err instanceof VersionConflict)) throw err;
      const existing = await readDoc(bundle, desired.id);
      if (!sameInstalledDoc(existing, desired)) throw recipeAssetConflict(recipe2.id, `${desired.id}.md`);
      changed = false;
    }
    references.push({ id: desired.id, changed });
  }
  const artifacts = [...docs, ...pages, ...references];
  const counts = {
    created: artifacts.filter((a) => a.changed).length,
    existing: artifacts.filter((a) => !a.changed && a.legacy_present === void 0).length,
    legacy_present: artifacts.filter((a) => a.legacy_present !== void 0).length
  };
  return {
    id: recipe2.id,
    version: recipe2.version,
    source: recipe2.source,
    docs,
    pages,
    references,
    counts,
    changed: docs.some((d) => d.changed) || pages.some((page) => page.changed) || references.some((reference) => reference.changed),
    warnings: recipe2.warnings
  };
}
async function assertPortableTargetsCompatible(bundle, recipe2, now) {
  const registries = /* @__PURE__ */ new Map();
  if (recipe2.pages.length > 0) {
    for (const prefix of [PAGE_REGISTRY_PREFIX, VIEW_REGISTRY_PREFIX]) {
      const registryDocs = await query(bundle, { prefix });
      for (const doc2 of registryDocs) registries.set(doc2.id, doc2);
    }
  }
  for (const page of recipe2.pages) {
    const existingBlob = await readBlob(bundle, page.entry);
    if (existingBlob) {
      const desiredBytes = Buffer.from(page.html, "utf8");
      const sameBytes = Buffer.from(existingBlob.bytes).equals(desiredBytes);
      const sameContentType = existingBlob.contentType === resolveContentType(page.entry);
      if (!sameBytes || !sameContentType) throw recipeAssetConflict(recipe2.id, page.entry);
    }
    const existingRegistry = registries.get(page.registry.id);
    if (existingRegistry) {
      const desiredRegistry = {
        ...page.registry,
        frontmatter: { ...page.registry.frontmatter, timestamp: now }
      };
      if (!sameInstalledDoc(existingRegistry, desiredRegistry)) {
        throw recipeAssetConflict(recipe2.id, `${page.registry.id}.md`);
      }
    }
  }
  const installedReferences = /* @__PURE__ */ new Map();
  if (recipe2.references.length > 0) {
    const referenceDocs = await query(bundle, { prefix: "references/" });
    for (const doc2 of referenceDocs) installedReferences.set(doc2.id, doc2);
  }
  for (const reference of recipe2.references) {
    const existing = installedReferences.get(reference.doc.id);
    if (!existing) continue;
    const desired = {
      ...reference.doc,
      frontmatter: { ...reference.doc.frontmatter, timestamp: now }
    };
    if (!sameInstalledDoc(existing, desired)) {
      throw recipeAssetConflict(recipe2.id, `${reference.doc.id}.md`);
    }
  }
}
function sameInstalledDoc(existing, desired) {
  const { timestamp: _existingTimestamp, ...existingFrontmatter } = existing.frontmatter;
  const { timestamp: _desiredTimestamp, ...desiredFrontmatter } = desired.frontmatter;
  return isDeepStrictEqual(existingFrontmatter, desiredFrontmatter) && existing.body === desired.body;
}
function recipeAssetConflict(recipeId, key) {
  return new CliError(
    "ALREADY_EXISTS",
    `recipe '${recipeId}' cannot install '${key}' because a different target already exists; the existing bundle content was left untouched`,
    { details: { recipe: recipeId, key } }
  );
}
async function appliedDocIds(bundle) {
  const docs = await query(bundle, { prefix: CONVENTIONS_PREFIX });
  return new Set(docs.map((d) => d.id));
}
function isRecipeApplied(recipe2, appliedIds) {
  return recipe2.docs.every((doc2) => appliedIds.has(doc2.id));
}

// src/recipe-parser.ts
var RESERVED_MANIFEST_KEYS = ["composes", "seeds", "requires"];
function nonEmptyString(v) {
  return typeof v === "string" ? v.trim() : "";
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
var REFERENCE_SEGMENT = /^[A-Za-z0-9._-]+$/;
function isSafeRecipeReferencePath(value) {
  if (!value.startsWith("references/") || !value.endsWith(".md") || /[\\%?#]/.test(value)) return false;
  const segments = value.slice("references/".length).split("/");
  return segments.every((segment) => !segment.startsWith(".") && REFERENCE_SEGMENT.test(segment));
}
function parseReferenceDeclarations(manifest, recipeId, source) {
  if (manifest.references === void 0) return { ok: true, references: [] };
  if (manifest.content_policy !== "definitions-only") {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe '${recipeId}' at '${source}' declares references but does not declare 'content_policy: definitions-only', which is required for portable assets`
      }
    };
  }
  if (!Array.isArray(manifest.references)) {
    return {
      ok: false,
      error: { code: "RECIPE_MALFORMED", message: `recipe '${recipeId}': 'references' must be a list` }
    };
  }
  const references = [];
  const targets = /* @__PURE__ */ new Set();
  for (const [index, value] of manifest.references.entries()) {
    if (typeof value !== "string" || value === "") {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${recipeId}': references[${index}] must be a non-empty path`
        }
      };
    }
    if (!isSafeRecipeReferencePath(value)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${recipeId}': Reference '${value}' must be a .md file under 'references/'`
        }
      };
    }
    const id = conceptIdFromPath(value);
    try {
      assertSafeConceptId(id);
    } catch {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${recipeId}' contains an unsafe Reference path` }
      };
    }
    if (isReservedFile(value)) {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${recipeId}' contains a reserved filename: '${value}'` }
      };
    }
    const target = id.toLowerCase();
    if (targets.has(target)) {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${recipeId}' declares duplicate Reference '${value}'` }
      };
    }
    targets.add(target);
    references.push({ path: value, id });
  }
  return { ok: true, references };
}
function parsePageDeclarations(manifest, recipeId, source) {
  if (manifest.pages === void 0) return { ok: true, pages: [] };
  if (manifest.content_policy !== "definitions-only") {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe '${recipeId}' at '${source}' declares pages but does not declare 'content_policy: definitions-only', which is required for portable assets`
      }
    };
  }
  if (!Array.isArray(manifest.pages)) {
    return {
      ok: false,
      error: { code: "RECIPE_MALFORMED", message: `recipe '${recipeId}': 'pages' must be a list` }
    };
  }
  const pages = [];
  const registries = /* @__PURE__ */ new Set();
  const entries = /* @__PURE__ */ new Set();
  for (const [index, value] of manifest.pages.entries()) {
    if (!isRecord2(value)) {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${recipeId}': pages[${index}] must be a map` }
      };
    }
    const registry = typeof value.registry === "string" ? value.registry : "";
    const entry = typeof value.entry === "string" ? value.entry : "";
    if (!registry || !entry) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${recipeId}': pages[${index}] requires non-empty 'registry' and 'entry' paths`
        }
      };
    }
    if (!registry.startsWith(VIEW_REGISTRY_PREFIX) && !registry.startsWith(PAGE_REGISTRY_PREFIX) || !registry.endsWith(".md")) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${recipeId}': View registry '${registry}' must be a .md file under '${VIEW_REGISTRY_PREFIX}' (or legacy '${PAGE_REGISTRY_PREFIX}')`
        }
      };
    }
    if (!entry.startsWith(VIEW_ENTRY_PREFIX) && !entry.startsWith(PAGE_ENTRY_PREFIX) || !entry.endsWith(".html")) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${recipeId}': View entry '${entry}' must be a .html file under '${VIEW_ENTRY_PREFIX}' (or legacy '${PAGE_ENTRY_PREFIX}')`
        }
      };
    }
    const registryId = registry.slice(0, -3);
    if (!isAnyRegistryId(registryId) || !isAnyEntryKey(entry) || isReservedFile(registry)) {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${recipeId}' contains an unsafe View path` }
      };
    }
    const registryTarget = registryId.toLowerCase();
    const entryTarget = entry.toLowerCase();
    if (registries.has(registryTarget) || entries.has(entryTarget)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${recipeId}' declares a duplicate View registry or entry at pages[${index}]`
        }
      };
    }
    registries.add(registryTarget);
    entries.add(entryTarget);
    pages.push({ registry, registryId, entry });
  }
  return { ok: true, pages };
}
function parseRecipeFiles(files, source) {
  const manifestFile = files.find((f) => f.path === "recipe.md");
  if (!manifestFile) {
    return {
      ok: false,
      error: { code: "RECIPE_MALFORMED", message: `recipe at '${source}' is missing its required recipe.md manifest` }
    };
  }
  const { frontmatter: manifest } = parseMarkdown(manifestFile.bytes);
  if (manifest.type !== "Recipe") {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe at '${source}': recipe.md must declare 'type: Recipe' (got '${String(manifest.type)}')`
      }
    };
  }
  const id = nonEmptyString(manifest.id);
  const title = nonEmptyString(manifest.title);
  const version = nonEmptyString(manifest.version);
  const summary = nonEmptyString(manifest.summary);
  const missing = [
    !id && "id",
    !title && "title",
    !version && "version",
    !summary && "summary"
  ].filter((v) => Boolean(v));
  if (missing.length > 0) {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe at '${source}': recipe.md is missing required non-empty field(s): ${missing.join(", ")}`
      }
    };
  }
  const contentPolicy = manifest.content_policy;
  if (contentPolicy !== void 0 && contentPolicy !== "definitions-only") {
    return {
      ok: false,
      error: {
        code: "RECIPE_MALFORMED",
        message: `recipe '${id}' at '${source}' has unsupported content_policy '${String(contentPolicy)}'`
      }
    };
  }
  const pageDeclarations = parsePageDeclarations(manifest, id, source);
  if (!pageDeclarations.ok) return pageDeclarations;
  const referenceDeclarations = parseReferenceDeclarations(manifest, id, source);
  if (!referenceDeclarations.ok) return referenceDeclarations;
  const declaredPageFiles = new Set(pageDeclarations.pages.flatMap((page) => [page.registry, page.entry]));
  const declaredReferenceFiles = new Set(referenceDeclarations.references.map((reference) => reference.path));
  const warnings = [];
  for (const key of RESERVED_MANIFEST_KEYS) {
    if (key in manifest) {
      warnings.push({
        code: "RECIPE_MANIFEST_RESERVED_KEY",
        message: `recipe '${id}' declares '${key}:' in recipe.md, which this version does not apply (reserved for a future composition surface) \u2014 it is declared but NOT applied, not silently ignored.`,
        field: key,
        severity: "warning"
      });
    }
  }
  const docs = [];
  const governsSeen = /* @__PURE__ */ new Map();
  const governsList = [];
  for (const file of files) {
    if (file.path === "recipe.md") continue;
    if (!file.path.startsWith(CONVENTIONS_PREFIX)) {
      if (declaredPageFiles.has(file.path)) continue;
      if (declaredReferenceFiles.has(file.path)) continue;
      if (contentPolicy === "definitions-only") {
        return {
          ok: false,
          error: {
            code: "RECIPE_UNSAFE_PATH",
            message: `recipe '${id}' violates definitions-only policy with undeclared file '${file.path}'`
          }
        };
      }
      continue;
    }
    const conceptId = conceptIdFromPath(file.path);
    try {
      assertSafeConceptId(conceptId);
    } catch {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${id}' contains an unsafe path '${file.path}'` }
      };
    }
    if (isReservedFile(file.path)) {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${id}' contains a reserved filename: '${file.path}'` }
      };
    }
    const { frontmatter, body } = parseMarkdown(file.bytes);
    const doc2 = { id: conceptId, frontmatter, body };
    if (frontmatter.type !== CONVENTION_TYPE) {
      if (contentPolicy === "definitions-only") {
        return {
          ok: false,
          error: {
            code: "RECIPE_MALFORMED",
            message: `recipe '${id}': '${doc2.id}' must declare 'type: ${CONVENTION_TYPE}'`
          }
        };
      }
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `recipe '${id}': skipped '${doc2.id}' (type '${String(frontmatter.type)}', expected '${CONVENTION_TYPE}').`,
        field: doc2.id,
        severity: "warning"
      });
      continue;
    }
    const governs = nonEmptyString(frontmatter.governs);
    if (!governs) {
      if (contentPolicy === "definitions-only") {
        return {
          ok: false,
          error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': '${doc2.id}' needs a non-empty 'governs'` }
        };
      }
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `recipe '${id}': skipped '${doc2.id}' (missing or empty 'governs' field).`,
        field: doc2.id,
        severity: "warning"
      });
      continue;
    }
    if (contentPolicy === "definitions-only") {
      const parsed = parseConventionDoc(doc2);
      if (!parsed.ok || parsed.warnings.length > 0) {
        const reasons = [!parsed.ok ? parsed.reason : "", ...parsed.warnings.map((warning) => warning.message)].filter(
          Boolean
        );
        return {
          ok: false,
          error: {
            code: "RECIPE_MALFORMED",
            message: `recipe '${id}': invalid Convention '${doc2.id}': ${reasons.join("; ")}`
          }
        };
      }
    }
    if (governsSeen.has(governs)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}' declares '${governs}' twice ('${governsSeen.get(governs)}' and '${doc2.id}')`
        }
      };
    }
    governsSeen.set(governs, doc2.id);
    governsList.push(governs);
    docs.push(doc2);
  }
  if (docs.length === 0) {
    return {
      ok: false,
      error: { code: "RECIPE_EMPTY", message: `recipe '${id}' at '${source}' declares zero valid convention docs` }
    };
  }
  const pages = [];
  for (const declaration of pageDeclarations.pages) {
    const registryFile = files.find((file) => file.path === declaration.registry);
    const entryFile = files.find((file) => file.path === declaration.entry);
    if (!registryFile || !entryFile) {
      const missingPath = !registryFile ? declaration.registry : declaration.entry;
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}' is missing declared View file '${missingPath}'` }
      };
    }
    if (entryFile.bytes.trim() === "") {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': View entry '${declaration.entry}' is empty` }
      };
    }
    const { frontmatter, body } = parseMarkdown(registryFile.bytes);
    if (!isPageTypeName(frontmatter.type)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.registry}' must declare 'type: View' (or legacy 'type: Page')`
        }
      };
    }
    if (!nonEmptyString(frontmatter.title)) {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': '${declaration.registry}' needs a title` }
      };
    }
    if (frontmatter.bridge !== "none" && frontmatter.bridge !== "bundle-read" && frontmatter.bridge !== "bundle-propose") {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.registry}' needs bridge: none, bridge: bundle-read, or bridge: bundle-propose`
        }
      };
    }
    if (frontmatter.entry !== declaration.entry) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.registry}' entry '${String(frontmatter.entry)}' does not match manifest entry '${declaration.entry}'`
        }
      };
    }
    pages.push({
      registry: { id: declaration.registryId, frontmatter, body },
      entry: declaration.entry,
      html: entryFile.bytes
    });
  }
  const references = [];
  for (const declaration of referenceDeclarations.references) {
    const referenceFile = files.find((file) => file.path === declaration.path);
    if (!referenceFile) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}' is missing declared Reference file '${declaration.path}'`
        }
      };
    }
    const { frontmatter, body } = parseMarkdown(referenceFile.bytes);
    if (frontmatter.type !== "Reference") {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.path}' must declare 'type: Reference'`
        }
      };
    }
    if (!nonEmptyString(frontmatter.title)) {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': '${declaration.path}' needs a title` }
      };
    }
    references.push({ doc: { id: declaration.id, frontmatter, body } });
  }
  const recipe2 = {
    id,
    title,
    version,
    summary,
    source,
    docs,
    pages,
    references,
    governs: governsList,
    warnings
  };
  if (contentPolicy === "definitions-only") recipe2.contentPolicy = contentPolicy;
  return { ok: true, recipe: recipe2 };
}

// src/recipe-ref.ts
import os from "node:os";
import path11 from "node:path";
function looksLikeRecipePath(ref) {
  return ref.includes("/") || ref.startsWith("~");
}
function expandRecipePath(ref) {
  if (ref === "~") return os.homedir();
  if (ref.startsWith("~/")) return path11.join(os.homedir(), ref.slice(2));
  return ref;
}

// src/recipe-source-builtin.ts
var PLACEHOLDER_TIMESTAMP = "1970-01-01T00:00:00.000Z";
function buildContextNotesFiles() {
  const conv = kindConventionDoc(CONTEXT_NOTE_KIND, CONTEXT_NOTE_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  return [
    {
      path: "recipe.md",
      bytes: stringifyDoc(
        { type: "Recipe", id: "context-notes", title: "Context Notes", version: "1", summary: CONTEXT_NOTES_SUMMARY },
        RECIPE_DESC_BODY
      )
    },
    { path: "conventions/context-note.md", bytes: stringifyDoc(conv.frontmatter, conv.body) }
  ];
}
function buildWorkTrackingFiles() {
  const conv = kindConventionDoc(TASK_KIND, TASK_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  return [
    {
      path: "recipe.md",
      bytes: stringifyDoc(
        { type: "Recipe", id: "work-tracking", title: "Work Tracking", version: "1", summary: WORK_TRACKING_SUMMARY },
        WORK_TRACKING_DESC_BODY
      )
    },
    { path: "conventions/task.md", bytes: stringifyDoc(conv.frontmatter, conv.body) }
  ];
}
function buildRoadmapFiles() {
  const roadmap = kindConventionDoc(ROADMAP_KIND, ROADMAP_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  const item = kindConventionDoc(ROADMAP_ITEM_KIND, ROADMAP_ITEM_SEED_BODY, PLACEHOLDER_TIMESTAMP);
  return [
    {
      path: "recipe.md",
      bytes: stringifyDoc(
        { type: "Recipe", id: "roadmap", title: "Roadmap", version: "1", summary: ROADMAP_SUMMARY },
        ROADMAP_DESC_BODY
      )
    },
    { path: "conventions/roadmap.md", bytes: stringifyDoc(roadmap.frontmatter, roadmap.body) },
    { path: "conventions/roadmap-item.md", bytes: stringifyDoc(item.frontmatter, item.body) }
  ];
}
var BUILTIN_FILES = {
  "context-notes": buildContextNotesFiles(),
  "work-tracking": buildWorkTrackingFiles(),
  roadmap: buildRoadmapFiles()
};
function builtinNames() {
  return Object.keys(BUILTIN_FILES);
}
function builtinRecipeSource() {
  return {
    kind: "builtin",
    async resolve(ref) {
      if (looksLikeRecipePath(ref)) return null;
      const files = BUILTIN_FILES[ref];
      if (!files) return null;
      return parseRecipeFiles(files, `builtin:${ref}`);
    }
  };
}
function resolveBuiltinSync(name) {
  const files = BUILTIN_FILES[name];
  if (!files) throw new Error(`resolveBuiltinSync: no built-in recipe named '${name}'`);
  const result = parseRecipeFiles(files, `builtin:${name}`);
  if (!result.ok) throw new Error(`resolveBuiltinSync: built-in '${name}' failed to parse: ${result.error.message}`);
  return result.recipe;
}
var CONTEXT_NOTES_RECIPE = resolveBuiltinSync("context-notes");

// src/recipe-source-filesystem.ts
import { promises as fs4 } from "node:fs";
import path12 from "node:path";
async function readRecipeDir(root) {
  const files = [];
  const rootReal = await fs4.realpath(root);
  const manifestPath = path12.join(root, "recipe.md");
  const manifestStat = await fs4.stat(manifestPath).catch(() => null);
  if (manifestStat?.isFile()) {
    const manifestReal = await fs4.realpath(manifestPath).catch(() => null);
    if (!manifestReal || manifestReal !== rootReal && !manifestReal.startsWith(rootReal + path12.sep)) {
      throw new RecipeUnsafePathSignal("recipe.md");
    }
    const bytes = await fs4.readFile(manifestPath, "utf8");
    files.push({ path: "recipe.md", bytes });
    const { frontmatter } = parseMarkdown(bytes);
    if (frontmatter.content_policy === "definitions-only" || frontmatter.pages !== void 0) {
      await walkRecipeFiles(root, "", rootReal, files, /* @__PURE__ */ new Set(["recipe.md"]));
      return files;
    }
  }
  const conventionsRoot = path12.join(root, "conventions");
  const conventionsStat = await fs4.stat(conventionsRoot).catch(() => null);
  if (conventionsStat?.isDirectory()) {
    await walkConventions(conventionsRoot, "conventions", rootReal, files);
  }
  return files;
}
async function walkRecipeFiles(dir, relPrefix, rootReal, out, skip) {
  const entries = await fs4.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path12.join(dir, entry.name);
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    if (skip.has(rel)) continue;
    if (entry.name.startsWith(".")) {
      throw new RecipeUnsafePathSignal(rel, "dot-entry");
    }
    if (entry.isDirectory()) {
      await walkRecipeFiles(abs, rel, rootReal, out, skip);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    const real = await fs4.realpath(abs).catch(() => null);
    if (!real || real !== rootReal && !real.startsWith(rootReal + path12.sep)) {
      throw new RecipeUnsafePathSignal(rel);
    }
    const stat2 = await fs4.stat(real).catch(() => null);
    if (!stat2?.isFile()) throw new RecipeUnsafePathSignal(rel);
    out.push({ path: rel, bytes: await fs4.readFile(abs, "utf8") });
  }
}
async function walkConventions(dir, relPrefix, rootReal, out) {
  const entries = await fs4.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path12.join(dir, entry.name);
    const rel = `${relPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      await walkConventions(abs, rel, rootReal, out);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    if (!rel.endsWith(".md")) continue;
    const real = await fs4.realpath(abs).catch(() => null);
    if (!real || real !== rootReal && !real.startsWith(rootReal + path12.sep)) {
      throw new RecipeUnsafePathSignal(rel);
    }
    out.push({ path: rel, bytes: await fs4.readFile(abs, "utf8") });
  }
}
var RecipeUnsafePathSignal = class extends Error {
  rel;
  reason;
  constructor(rel, reason = "symlink-escape") {
    super(`unsafe path '${rel}' (${reason})`);
    this.rel = rel;
    this.reason = reason;
  }
};
function filesRecipeSource() {
  return {
    kind: "files",
    async resolve(ref) {
      if (!looksLikeRecipePath(ref)) return null;
      const expanded = expandRecipePath(ref);
      const real = await fs4.realpath(path12.resolve(expanded)).catch(() => null);
      if (!real) {
        return { ok: false, error: { code: "RECIPE_NOT_FOUND", message: `no recipe folder at '${ref}'` } };
      }
      const stat2 = await fs4.stat(real).catch(() => null);
      if (!stat2 || !stat2.isDirectory()) {
        return { ok: false, error: { code: "RECIPE_UNSAFE_PATH", message: `'${ref}' is not a directory` } };
      }
      let files;
      try {
        files = await readRecipeDir(real);
      } catch (err) {
        if (err instanceof RecipeUnsafePathSignal) {
          const message = err.reason === "dot-entry" ? `recipe folder '${ref}' contains a dot-prefixed path, which the recipe grammar can never accept: '${err.rel}'` : `recipe folder '${ref}' contains a symlink escaping the recipe root: '${err.rel}'`;
          return { ok: false, error: { code: "RECIPE_UNSAFE_PATH", message } };
        }
        throw err;
      }
      return parseRecipeFiles(files, real);
    }
  };
}

// src/recipe-resolver.ts
var DEFAULT_SOURCES = [builtinRecipeSource(), filesRecipeSource()];
var DEFAULT_RECIPE_REF = "context-notes";
async function resolveRecipe(ref, sources = DEFAULT_SOURCES) {
  for (const source of sources) {
    const result = await source.resolve(ref);
    if (result) return result;
  }
  return {
    ok: false,
    error: {
      code: "RECIPE_NOT_FOUND",
      message: `unknown recipe '${ref}' (built-ins: ${builtinNames().join(", ")}; or a path to a recipe folder)`
    }
  };
}

// src/commands/init.ts
var INIT_USAGE = `agentstate-lite init \u2014 create (or open) an OKF knowledge bundle

Usage:
  agentstate-lite init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]

Options:
  --dir <path>            Directory to init the bundle in (default: the current directory)
  --okf-version <v>       OKF version stamped into the root index.md (default: 0.1)
  --recipe <name-or-path> Apply a recipe on create (default: context-notes; 'none' for a bare
                           bundle) \u2014 a built-in name or a path to a recipe folder; see
                           'agentstate-lite recipes' to list built-ins
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help
`;
function insideGitRepo(dir) {
  let cur = path13.resolve(dir);
  for (; ; ) {
    if (existsSync5(path13.join(cur, ".git"))) return true;
    const parent = path13.dirname(cur);
    if (parent === cur) return false;
    cur = parent;
  }
}
async function init(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs({
      args: argv,
      options: {
        dir: { type: "string" },
        "okf-version": { type: "string" },
        recipe: { type: "string" },
        // Declared (not just left to error out generically) so a misdirected `init --remote`
        // gets the SPECIFIC message below instead of parseArgs's generic unknown-option text.
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "init"
  );
  if (values.help) {
    stdout(INIT_USAGE);
    return;
  }
  if (values.remote) {
    throw new CliError(
      "USAGE",
      "the wire protocol has no create-bundle endpoint; run init on the server's directory",
      // Both halves of this two-step hint must resolve for the ACTUAL running executable (AXI
      // §7/§10) — a bare `agentstate-lite serve` here would be a phantom invocation under `npx`
      // or the skill-bundle channel. Found during the A3 audit (the plan's grep missed this one
      // because it looked for a bare-bin bypass, not a hardcode embedded AFTER an interpolation).
      { help: `${cliInvocation()} init --dir <path> (then ${cliInvocation()} serve --dir <path>)` }
    );
  }
  const root = resolveTargetDir(values.dir);
  const okfVersion = values["okf-version"]?.trim();
  const bundle = await initBundle(root, okfVersion ? { okfVersion } : {});
  const recipeRef = values.recipe?.trim() || DEFAULT_RECIPE_REF;
  let recipeApplied = "none";
  let warnings = [];
  if (recipeRef !== "none") {
    const loaded = await resolveRecipe(recipeRef);
    if (!loaded.ok) {
      throw new CliError("USAGE", loaded.error.message, { help: `${cliInvocation()} recipes` });
    }
    const result = await applyRecipe(bundle, loaded.recipe);
    recipeApplied = result.id;
    const registry = await loadKinds(bundle);
    const dupWarnings = registry.warnings.filter((w) => w.code === "KIND_DUPLICATE_GOVERNS");
    warnings = [...result.warnings, ...dupWarnings];
  }
  const receipt = { init: "ok", root: bundle.root, recipe: recipeApplied };
  if (warnings.length > 0) receipt.warnings = warnings;
  if (insideGitRepo(root)) {
    receipt.hint = `this bundle is local until shared \u2014 if the project already shares a board, \`${cliInvocation()} sync\` joins it (never init there, that mints a divergent second bundle); to start sharing this one, \`${cliInvocation()} sync --establish\``;
  }
  receipt.help = [
    `${cliInvocation()} new "Context Note" <id> --title <title>`,
    `${cliInvocation()} recipes  (list other capability recipes \u2014 e.g. work-tracking adds a Task kind)`
  ];
  stdout(render(receipt, resolveMode(values)));
}

// src/commands/doc/common.ts
import { fstatSync } from "node:fs";
var COMMON_OPTIONS = `Common options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; remote access is always explicit)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help`;
var DOC_USAGE = `agentstate-lite doc \u2014 write, patch, read, or delete a generic OKF concept document

Usage:
  agentstate-lite doc write   <id> --type <t> [options]        Create/overwrite a concept doc
  agentstate-lite doc update  <id> [options]                   Patch given fields of an existing doc
  agentstate-lite doc read    <id> [--out <p> | --body-out <p>] Read a doc (raw/body byte channels)
  agentstate-lite doc history <id>                             Show a doc's attributed version chain
  agentstate-lite doc delete  <id> [--expected-version <v>]    Hard-delete a doc (idempotent)

Run 'agentstate-lite doc <verb> --help' for a verb's full options.

${COMMON_OPTIONS}
`;
var DOC_WRITE_USAGE = `agentstate-lite doc write \u2014 create or overwrite a generic OKF concept document

Usage:
  agentstate-lite doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [options]

Idempotent: re-writing a doc with identical frontmatter + body is a no-op (exit 0, no error, no
duplication \u2014 a plain overwrite that converges to the same on-disk state).

Options:
  --type <t>           OKF concept type (non-empty)                          [required]
  --title <t>          Display title
  --description <d>    One-sentence summary
  --resource <uri>     Canonical URI of the underlying asset
  --tag <t>            A tag (repeatable)
  --timestamp <iso>    ISO-8601 last-change time (default: now)
  --body <s>           Markdown body inline
  --body-file <path>   Read the markdown body from a file (else: piped stdin)
  --blank-body         Required to deliberately overwrite an EXISTING doc's non-empty body with an
                       empty one when no other body source is given. --body (even --body "") and
                       --body-file always count as an explicit source; piped stdin counts ONLY when
                       it carries NON-EMPTY content \u2014 an empty pipe, a character device, or an
                       interactive TTY all count as "nothing given" here (pass --body "" to blank
                       explicitly instead). A NEW doc with no body source is always allowed \u2014 see
                       'doc update' to patch other fields while preserving the body.
  --replace-links      Required to overwrite an EXISTING doc's body when the new body would silently
                       DROP one or more of its outbound cross-links (links live in the body \u2014 OKF).
                       Without it, a body replace that drops a link is refused (exit 2, naming the
                       dropped link(s)); a new body that still contains the same link(s) never needs
                       this flag. SHORT-TERM guard \u2014 see 'link add'/'link show' to manage links.
  --strict             If a kind convention governs --type, reject (exit 2) instead of writing with
                       warnings when the doc does not satisfy it (default: warn-and-write, exit 0 \u2014
                       see 'agentstate-lite kinds')
  --actor <name>       Attribute this write: persisted as the doc's own 'actor' frontmatter field
                       (the per-doc attribution sync and its receipts read) and recorded in version
                       history by a persisting backend. Note doc write is a FULL replace: omitting
                       both --actor and AGENTSTATE_LITE_ACTOR on an overwrite drops any existing
                       actor field (reported in dropped_fields). Precedence: --actor >
                       AGENTSTATE_LITE_ACTOR > absent. A present-but-blank flag or environment value
                       is a USAGE error (exit 2).
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc write concepts/auth --type Concept --title "Auth flow" --body "How login works"
  echo "# Notes" | agentstate-lite doc write notes/x --type Note --title "Scratch"
`;
var DOC_UPDATE_USAGE = `agentstate-lite doc update \u2014 patch given fields of an EXISTING concept document

Usage:
  agentstate-lite doc update <id> [--<field> <value> ...] [--body <s> | --body-file <p>] [options]

Only the fields you pass change; everything else \u2014 including the body when no body source is given \u2014
is preserved verbatim. Idempotent: a patch that changes NOTHING (ignoring the auto-refreshed
timestamp) converges to changed:false (no write, no timestamp refresh).

Options:
  --title <t>            Replace the title
  --description <d>      Replace the description
  --tag <t>              Replace the WHOLE tag set (repeatable; passing --tag at all replaces every
                         existing tag rather than adding to them). It cannot CLEAR the set to empty.
  --type <t>             Replace the type
  --body <s>             Replace the body inline
  --body-file <path>     Replace the body, read from a file. If NEITHER --body nor --body-file is
                         given AND no other field flag is given either (e.g. 'cat body.md | ...
                         doc update <id>' with nothing else), piped stdin is used as the body \u2014 same
                         non-empty rule doc write's F1 guard uses (an empty pipe does not count). A
                         patch that DOES pass another field flag (--title/--description/--tag/--type/
                         a kind field) never reads stdin, even without --body/--body-file: it patches
                         only the given fields and leaves the body untouched.
  --replace-links         Required when a --body/--body-file replace would silently DROP one or more
                         of the doc's existing outbound cross-links (links live in the body \u2014 OKF).
                         Without it, such a replace is refused (exit 2, naming the dropped link(s));
                         a new body that still contains the same link(s) \u2014 the ordinary read-edit-
                         update cycle \u2014 never needs this flag. SHORT-TERM guard \u2014 see 'link add'/
                         'link show' to manage links.
  --keep-timestamp       Preserve the existing timestamp (default: refresh to now, since a patch is
                         a meaningful change \u2014 matches 'link add's policy)
  --strict               If a kind convention governs the resulting type, reject (exit 2) instead of
                         writing with warnings (default: warn-and-write, exit 0)
  --<field> <value>      Set a kind-declared field of the doc's type (e.g. --status done). The field
                         MUST be declared by the kind governing the doc's type \u2014 run 'agentstate-lite
                         kinds' to see them. An unknown field, or an out-of-enum value, is rejected
                         (exit 2, no write). Use 'doc write' to rewrite the whole doc if you must set
                         a not-yet-declared value.
  --expected-version <v> Optimistic compare-and-swap: patch ONLY if the doc still matches this token
                         (from a prior read/write/history receipt) \u2014 a conflict is STALE_HEAD (exit
                         5), NOT retried. Omit for a normal (auto-retrying) update. A present-but-
                         blank value is a USAGE error (exit 2), not "no CAS".
  --actor <name>         Attribute a substantive patch: sets the doc's 'actor' frontmatter field
                         (overwriting a previous actor) and threads to version history (see 'doc
                         history'). Precedence: --actor > AGENTSTATE_LITE_ACTOR > absent. With
                         neither source, the existing actor is preserved. Attribution is not a
                         patch by itself and cannot turn an identical patch into a write. A
                         present-but-blank flag or environment value is a USAGE error (exit 2).

Passing NO patchable field at all is a USAGE error (exit 2) \u2014 there is nothing to do.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc update tasks/42 --status done
  agentstate-lite doc update concepts/auth --title "Auth v2" --expected-version sha256:...
`;
var DOC_READ_USAGE = `agentstate-lite doc read \u2014 read a concept document (or pull its raw markdown bytes)

Usage:
  agentstate-lite doc read <id> [--out (<path> | -) | --body-out (<path> | -)] [options]

The default (no --out/--body-out) render shows EVERY frontmatter field \u2014 the standard keys plus any
kind-declared fields like status/priority \u2014 and truncates a large body (pointing at --out).

Options:
  --out <path>         Write the doc's raw markdown bytes to a file (bypasses context).
                       Use --out - to stream raw bytes to stdout (the receipt goes to stderr).
                       Over --remote, bytes are the canonical OKF re-serialization (no raw-bytes
                       wire endpoint yet \u2014 see docs/WIRE-PROTOCOL.md open questions).
                       For a local (--dir) bundle, a resolved --out path landing INSIDE the bundle
                       root gets a loud 'warning' field on the receipt: a non-reserved .md path
                       will be re-ingested as a concept doc on the next bundle walk; a reserved
                       filename (index.md/log.md) will instead CLOBBER that file outright; any
                       other (non-.md) path is inert (no warning) \u2014 the write still proceeds in
                       every case; not applicable to --out - or to --remote.
  --body-out <path>    Write ONLY the parsed markdown body (no YAML frontmatter) as UTF-8. The
                       receipt includes the version from the SAME read, so the safe edit cycle is:
                         agentstate-lite doc read <id> --body-out <path-outside-bundle> --json
                         # edit that file; copy the receipt's version
                         agentstate-lite doc update <id> --body-file <path-outside-bundle> \\
                           --expected-version <version>
                       Choose a unique path OUTSIDE the bundle: a .md target inside a local bundle
                       is refused below, so the safe-cycle path must never be bundle-relative.
                       Use --body-out - to stream body bytes to stdout (receipt/errors go to stderr).
                       An empty body is a valid zero-byte result. A .md target inside a local bundle
                       is refused: body-only markdown has no OKF frontmatter and would corrupt or
                       clobber bundle content. Choose a path outside the bundle (an in-bundle non-.md
                       target is inert and remains allowed).
  --field <name>       Print ONE frontmatter field's raw value to stdout, newline-terminated, no
                       TOON envelope and no other output \u2014 for scripting, e.g. capturing
                       head_version for a follow-up --expected-version write. A scalar prints
                       as-is (no quotes); an array/object prints as compact JSON. id/type/
                       head_version work too (head_version is the store's CAS token, not
                       frontmatter). An absent field, or a missing doc, reports the error to
                       STDERR instead (stdout stays reserved for the raw value); an absent field's
                       error lists the fields that DO exist. Mutually exclusive with --out and
                       --body-out.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc read concepts/auth
  agentstate-lite doc read concepts/auth --out ./auth.md
  agentstate-lite doc read concepts/auth --body-out <path-outside-bundle>
  agentstate-lite doc read concepts/auth --field head_version
`;
var DOC_HISTORY_USAGE = `agentstate-lite doc history \u2014 show a doc's attributed version chain (newest first)

Usage:
  agentstate-lite doc history <id> [--limit <n>] [options]

Lists version + actor + timestamp (and agent, when recorded) per revision, with a count. A
history-keeping backend (a remote deployment) returns the full chain and its real per-write
attribution; on an AUTH'D remote, actor is your authenticated principal (server-set, unforgeable)
and agent is the resolved advisory actor label from --actor or AGENTSTATE_LITE_ACTOR. A local
--dir bundle keeps no history, so it returns just the single current revision and reports the
file's OS owner as the actor (the filesystem backend keeps no per-write advisory actor label in
history; the doc's own 'actor' frontmatter field \u2014 persisted from --actor or
AGENTSTATE_LITE_ACTOR \u2014 is where per-doc attribution lives). The newest version is the token to
pass to --expected-version for an optimistic doc update/delete.

Options:
  --limit <n>           Cap the number of revisions returned, newest first (default: 20; 0 =
                        unlimited). A truncated result reports \`shown\` alongside the total
                        \`count\`, and a help line names the escape (a higher --limit, or 0 for
                        all). The newest revision is always included when truncated (it never
                        gets cut off the front).
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc history concepts/auth
  agentstate-lite doc history concepts/auth --limit 0
`;
var DOC_DELETE_USAGE = `agentstate-lite doc delete \u2014 hard-delete a concept document (idempotent)

Usage:
  agentstate-lite doc delete <id> [--expected-version <v>] [options]

Hard-delete (no tombstone) and idempotent: deleting an ABSENT id is SUCCESS (deleted:false, exit 0),
never an error. Reserved ids (index.md/log.md) are rejected (USAGE, exit 2). Non-cascading: it does
NOT touch other docs' links to/from the id (backlinks are derived \u2014 a dangling reference simply
stops resolving on the next graph walk) and does NOT append a log.md entry.

Options:
  --expected-version <v>  Compare-and-swap token from a prior read/write receipt (a stale token is a
                          CONFLICT, exit 5; omit for an unconditional delete)
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc delete notes/scratch
  agentstate-lite doc delete concepts/auth --expected-version sha256:...
`;
var BODY_PREVIEW_LIMIT = 1e3;
function hasRealStdinInput() {
  try {
    const stats = fstatSync(0);
    return stats.isFIFO() || stats.isFile() || stats.isSocket();
  } catch {
    return false;
  }
}
var STDIN_FIRST_BYTE_TIMEOUT_MS = 200;
var STDIN_SILENT_TIMEOUT = Symbol("agentstate-lite.stdin-silent-timeout");
var STDIN_SILENT_NOTE = `stdin was open but silent after ${STDIN_FIRST_BYTE_TIMEOUT_MS}ms \u2014 body treated as empty; use --body/--body-file for slow producers`;
function readStdinBounded(stream, timeoutMs) {
  return new Promise((resolve2, reject) => {
    const chunks = [];
    let gaveUp = false;
    function cleanup() {
      clearTimeout(timer);
      stream.removeListener("data", onData);
      stream.removeListener("end", onEnd);
      stream.removeListener("error", onError);
    }
    function onData(chunk) {
      clearTimeout(timer);
      chunks.push(chunk);
    }
    function onEnd() {
      if (gaveUp) return;
      cleanup();
      resolve2(Buffer.concat(chunks).toString("utf8"));
    }
    function onError(err) {
      if (gaveUp) return;
      cleanup();
      reject(err);
    }
    const timer = setTimeout(() => {
      gaveUp = true;
      cleanup();
      stream.pause();
      stream.unref?.();
      resolve2(STDIN_SILENT_TIMEOUT);
    }, timeoutMs);
    timer.unref();
    stream.on("data", onData);
    stream.on("end", onEnd);
    stream.on("error", onError);
  });
}
async function defaultReadStdin() {
  if (!hasRealStdinInput()) return void 0;
  return readStdinBounded(process.stdin, STDIN_FIRST_BYTE_TIMEOUT_MS);
}
function computeDroppedLinks(existingLinks, nextLinks) {
  const nextByTarget = /* @__PURE__ */ new Map();
  for (const l of nextLinks) {
    const bucket = nextByTarget.get(l.to);
    if (bucket) bucket.push(l);
    else nextByTarget.set(l.to, [l]);
  }
  const existingByTarget = /* @__PURE__ */ new Map();
  for (const l of existingLinks) {
    const bucket = existingByTarget.get(l.to);
    if (bucket) bucket.push(l);
    else existingByTarget.set(l.to, [l]);
  }
  const dropped = [];
  for (const [target, oldOccurrences] of existingByTarget) {
    const available = [...nextByTarget.get(target) ?? []];
    const unmatchedExact = [];
    for (const old of oldOccurrences) {
      const idx = available.findIndex((n) => n.text === old.text);
      if (idx >= 0) available.splice(idx, 1);
      else unmatchedExact.push(old);
    }
    for (const old of unmatchedExact) {
      if (available.length > 0) available.shift();
      else dropped.push(old);
    }
  }
  return dropped;
}
function guardDroppedLinks(bundle, existing, nextBody, replaceLinks) {
  if (replaceLinks) return;
  const existingLinks = parseLinks(bundle, existing);
  if (existingLinks.length === 0) return;
  const nextLinks = parseLinks(bundle, { ...existing, body: nextBody });
  const dropped = computeDroppedLinks(existingLinks, nextLinks);
  if (dropped.length === 0) return;
  const named = dropped.map((l) => `'${l.text}' -> ${l.to}`).join(", ");
  throw new CliError(
    "USAGE",
    `this body replace would silently drop ${dropped.length} outbound link(s) from '${existing.id}': ${named}. OKF cross-links live in the document body, so a full-body replace removes any link the new body doesn't repeat. Pass --replace-links to drop them deliberately, or keep them by including the same markdown link(s) in the new body, or re-add them afterward with '${cliInvocation()} link add ${existing.id} <to>'.`,
    {
      help: `${cliInvocation()} link add ${existing.id} <to>`,
      details: { dropped_links: dropped.map((l) => ({ to: l.to, text: l.text })) }
    }
  );
}
function readErrorToCliError(err, id, remoteUrl) {
  if (err?.code === "ENOENT") {
    return new CliError("NOT_FOUND", `no concept document at id '${id}'`, {
      help: `${cliInvocation()} list`
    });
  }
  return classifyBundleError(err, remoteUrl);
}

// src/commands/doc/write.ts
import { parseArgs as parseArgs2 } from "node:util";
import { promises as fs5 } from "node:fs";

// src/kind-write.ts
function buildCompletingUpdateCommand(id, violations, kind2) {
  if (!kind2) return void 0;
  const declaredFields = /* @__PURE__ */ new Set([...kind2.fields.required, ...kind2.fields.optional]);
  const seen = /* @__PURE__ */ new Set();
  const flags = [];
  for (const violation of violations) {
    const field = violation.field;
    if (!field || seen.has(field) || !declaredFields.has(field)) continue;
    seen.add(field);
    const allowed = kind2.fields.values[field];
    const placeholder = allowed && allowed.length > 0 ? `<${allowed.join("|")}>` : "<value>";
    flags.push(`--${field} ${placeholder}`);
  }
  if (flags.length === 0) return void 0;
  return `${cliInvocation()} doc update ${id} ${flags.join(" ")}`;
}
function kindConformanceCliError(error, registry, fallbackHelp, docExists) {
  const kind2 = registry.kinds.get(error.governs);
  const completing = docExists ? buildCompletingUpdateCommand(error.id, error.violations, kind2) : void 0;
  return new CliError("USAGE", error.message, {
    help: completing ?? fallbackHelp,
    details: { violations: error.violations }
  });
}
function defaultTimestampAndValidateKind(candidate, registry, opts) {
  const { kind: kind2, warnings } = defaultTimestampAndValidateAgainstRegistry(candidate, registry);
  if (kind2 && warnings.length > 0 && opts.strict) {
    throw kindConformanceCliError(
      new KindConformanceError(candidate.id, kind2.governs, warnings),
      registry,
      opts.helpOnReject,
      opts.docExists
    );
  }
  return warnings;
}

// src/mutate.ts
async function firePostPersist(hook2) {
  if (!hook2) return;
  try {
    await hook2();
  } catch {
  }
}
async function docExistsForMode(bundle, id, mode) {
  if (mode === "patch") return true;
  if (mode === "create-only") return false;
  try {
    await readDoc(bundle, id);
    return true;
  } catch {
    return false;
  }
}
async function translateMutationError(error, opts) {
  if (error instanceof KindConformanceError) {
    const docExists = await docExistsForMode(opts.bundle, opts.id, opts.mode);
    throw kindConformanceCliError(error, opts.registry, opts.helpOnKindReject, docExists);
  }
  if (error instanceof DocumentNotFoundError) {
    throw opts.errors.notFound?.() ?? new CliError("NOT_FOUND", error.message);
  }
  if (error instanceof VersionConflict) {
    if (opts.mode === "create-only") {
      throw opts.errors.alreadyExists?.() ?? new CliError("ALREADY_EXISTS", `'${opts.id}' already exists`);
    }
    throw opts.errors.staleHead?.(error) ?? new CliError("STALE_HEAD", error.message);
  }
  throw classifyBundleError(error, opts.remoteUrl);
}
async function mutateDoc(opts) {
  try {
    const result = await mutateDocument({
      bundle: opts.bundle,
      id: opts.id,
      mode: opts.mode,
      registry: opts.registry,
      strict: opts.strict,
      buildCandidate: opts.buildCandidate,
      onAbsent: opts.onAbsent,
      maxAttempts: opts.maxAttempts,
      compareTimestamp: opts.compareTimestamp,
      actor: opts.actor,
      persistActor: opts.persistActor,
      expectedVersion: opts.expectedVersion
    });
    if (result.changed) await firePostPersist(opts.onPersisted);
    return opts.mode === "patch" ? result : { doc: result.doc, version: result.version, warnings: result.warnings };
  } catch (error) {
    return await translateMutationError(error, opts);
  }
}

// src/legacy-page.ts
function isLegacyPageDoc(frontmatter) {
  return frontmatter["type"] === "Page";
}
var LEGACY_PAGE_REGISTRY_PREFIX = "pages-registry/";
var LEGACY_PAGE_BLOB_PREFIX = "pages/";
function isLegacyRegistryDocId(id) {
  return id.startsWith(LEGACY_PAGE_REGISTRY_PREFIX);
}
var LEGACY_PAGE_TYPE_HINT = "type 'Page' is the legacy name for the 'View' kind \u2014 existing Page docs keep working and never need migrating; author new dashboards with --type View.";

// src/board-attribution.ts
import path14 from "node:path";

// src/cursor.ts
import { homedir as homedir5 } from "node:os";
import { join as join5 } from "node:path";
var SYNC_STATE_DIR_NAME = "sync";
function syncStateDir(home2 = homedir5()) {
  return join5(credentialsDir(home2), SYNC_STATE_DIR_NAME);
}
var defaultSyncStore = createSyncStore({
  stateDir: () => syncStateDir(),
  writeAtomic: writeFileAtomic0600
});

// src/board-attribution.ts
function boardPostPersistHook(bundle, actor) {
  if (!actor || actor === "unknown") return void 0;
  if (bundle.backend !== void 0) return void 0;
  if (path14.basename(bundle.root) !== BUNDLE_DIR) return void 0;
  return async () => {
    try {
      await defaultSyncStore.recordSelfActors(resolveBundleKey(bundle.root), [actor]);
    } catch {
    }
  };
}

// src/actor.ts
var ACTOR_ENV = "AGENTSTATE_LITE_ACTOR";
function resolveActor(explicit, opts = {}) {
  const env = opts.env ?? process.env;
  const hasEnv = Object.prototype.hasOwnProperty.call(env, ACTOR_ENV);
  const source = explicit !== void 0 ? "--actor" : hasEnv ? ACTOR_ENV : void 0;
  const raw = explicit !== void 0 ? explicit : hasEnv ? env[ACTOR_ENV] ?? "" : void 0;
  if (raw === void 0) return void 0;
  const actor = raw.trim();
  if (!actor) {
    throw new CliError(
      "USAGE",
      `${source} was given an empty value \u2014 pass an actor identity or ${source === "--actor" ? "omit the flag" : `unset ${ACTOR_ENV}`}.`,
      opts.help ? { help: opts.help } : {}
    );
  }
  return actor;
}

// src/commands/doc/write.ts
async function docWrite(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const readStdin = deps.readStdin ?? defaultReadStdin;
  const { values, positionals } = parseOrUsage(
    () => parseArgs2({
      args: argv,
      options: {
        type: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        resource: { type: "string" },
        tag: { type: "string", multiple: true },
        timestamp: { type: "string" },
        body: { type: "string" },
        "body-file": { type: "string" },
        "blank-body": { type: "boolean" },
        "replace-links": { type: "boolean" },
        strict: { type: "boolean" },
        actor: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "doc write"
  );
  if (values.help) {
    stdout(DOC_WRITE_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc write requires a concept <id> positional", {
      help: `${cliInvocation()} doc write <id> --type <t>`
    });
  }
  const type = values.type?.trim();
  if (!type) {
    throw new CliError("USAGE", "--type <t> is required (OKF concepts must carry a non-empty type)", {
      help: `${cliInvocation()} doc write ${id} --type <t>`
    });
  }
  const actor = resolveActor(values.actor, { help: `${cliInvocation()} doc write ${id} --actor <name>` });
  let body;
  let bodySourceGiven;
  let stdinSilentTimeout = false;
  if (values.body !== void 0) {
    body = values.body;
    bodySourceGiven = true;
  } else if (values["body-file"]) {
    body = await fs5.readFile(values["body-file"], "utf8");
    bodySourceGiven = true;
  } else {
    const stdinRead = await readStdin();
    stdinSilentTimeout = stdinRead === STDIN_SILENT_TIMEOUT;
    const stdinBody = typeof stdinRead === "string" ? stdinRead : void 0;
    bodySourceGiven = stdinBody !== void 0 && stdinBody !== "";
    body = stdinBody ?? "";
  }
  const blankBody = Boolean(values["blank-body"]);
  const frontmatter = { type };
  if (values.title !== void 0) frontmatter.title = values.title;
  if (values.description !== void 0) frontmatter.description = values.description;
  if (values.resource !== void 0) frontmatter.resource = values.resource;
  if (values.tag && values.tag.length > 0) frontmatter.tags = values.tag;
  if (values.timestamp?.trim()) {
    const ts = values.timestamp.trim();
    if (Number.isNaN(Date.parse(ts))) {
      throw new CliError(
        "USAGE",
        `--timestamp ${JSON.stringify(ts)} is not a valid date/time (expected ISO-8601, e.g. 2026-07-03T12:00:00Z)`,
        { help: `${cliInvocation()} doc write ${id} --timestamp <iso>` }
      );
    }
    frontmatter.timestamp = ts;
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const isConventionPath = id.startsWith("conventions/");
  const replaceLinks = Boolean(values["replace-links"]);
  const registry = await loadKinds(bundle);
  let droppedFields = [];
  const result = await mutateDoc({
    bundle,
    id,
    mode: "overwrite",
    registry,
    remoteUrl: values.remote,
    strict: Boolean(values.strict),
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor,
    persistActor: true,
    // Board self-attribution (PR C): fires only after a substantive persisted write — never a
    // refused/failed one — and only for the conventional board bundle (see board-attribution.ts).
    onPersisted: boardPostPersistHook(bundle, actor),
    buildCandidate: (fresh) => {
      if (isConventionPath && fresh && fresh.frontmatter.type === "Convention") {
        const governs = typeof fresh.frontmatter.governs === "string" && fresh.frontmatter.governs.trim() ? fresh.frontmatter.governs : "(unknown)";
        throw new CliError(
          "USAGE",
          `refusing to overwrite kind convention '${id}' with 'doc write' \u2014 it replaces the whole document and would drop the convention's schema (governs/fields/path), un-declaring the '${governs}' kind. To change its title/body, use 'doc update' (it preserves the schema). To change the schema fields, use '${cliInvocation()} kind field "${governs}" add/remove <name>' (or edit the convention's markdown frontmatter directly).`,
          { help: `${cliInvocation()} doc update ${id} --title <t>` }
        );
      }
      if (!bodySourceGiven && !blankBody && fresh && fresh.body.trim() !== "") {
        throw new CliError(
          "USAGE",
          `'${id}' already has a non-empty body and no body source was given (--body, --body-file, or piped stdin) \u2014 refusing to silently blank it. Pass a body source, run '${cliInvocation()} doc update ${id}' to patch other fields while preserving the body, or pass --blank-body to blank it deliberately.`,
          {
            help: `${cliInvocation()} doc update ${id}`,
            details: { existing_body_chars: fresh.body.length }
          }
        );
      }
      if (fresh) guardDroppedLinks(bundle, fresh, body, replaceLinks);
      droppedFields = fresh ? Object.keys(fresh.frontmatter).filter(
        (k) => k !== "timestamp" && !(k in frontmatter) && !(k === "actor" && actor !== void 0)
      ) : [];
      return { frontmatter, body };
    },
    errors: {
      staleHead: (err) => new CliError(
        "STALE_HEAD",
        `'${id}' changed concurrently while re-checking outbound links (moved since ${err.expected ?? "absent"}; now ${err.actual ?? "absent"}) \u2014 retries exhausted; re-run the write.`,
        { help: `${cliInvocation()} doc read ${id}` }
      )
    }
  });
  const saved = result.doc;
  const receipt = {
    doc: "written",
    id: saved.id,
    type: saved.frontmatter.type,
    timestamp: saved.frontmatter.timestamp ?? null,
    // The content-addressed version token of this write — pass it back as `--expected-version` for a
    // later optimistic doc update/delete (see also `doc history`).
    version: result.version
  };
  if (droppedFields.length > 0) {
    receipt.dropped_fields = droppedFields;
    receipt.note = `'doc write' is a FULL replace and dropped ${droppedFields.length} frontmatter field(s) not re-supplied: ${droppedFields.join(", ")}. To change fields while preserving the rest (e.g. a status set by 'doc update' or 'new'), use '${cliInvocation()} doc update ${id}' instead.`;
  }
  if (stdinSilentTimeout) {
    receipt.note = receipt.note ? `${receipt.note}
${STDIN_SILENT_NOTE}` : STDIN_SILENT_NOTE;
  }
  if (result.warnings.length > 0) receipt.warnings = result.warnings;
  if (isLegacyPageDoc(saved.frontmatter)) receipt.hint = LEGACY_PAGE_TYPE_HINT;
  receipt.help = [`${cliInvocation()} doc read ${saved.id}`];
  stdout(render(receipt, resolveMode(values)));
}

// src/commands/doc/update.ts
import { promises as fs6 } from "node:fs";
import { parseArgs as parseArgs3 } from "node:util";
var DOC_UPDATE_FIELD_FLAGS = ["title", "description", "tag", "type", "body", "body-file"];
var DOC_UPDATE_VALUE_FLAGS = /* @__PURE__ */ new Set([
  "title",
  "description",
  "type",
  "body",
  "body-file",
  "dir",
  "remote",
  "expected-version",
  "actor"
]);
var DOC_UPDATE_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["keep-timestamp", "strict", "json", "replace-links"]);
function parseDocUpdateArgs(argv) {
  const { values: rawValues, tokens } = parseOrUsage(
    () => parseArgs3({
      args: argv,
      tokens: true,
      strict: false,
      // dynamic kind fields are unconfigured — strict:true would reject them
      allowPositionals: true,
      options: {
        title: { type: "string" },
        description: { type: "string" },
        type: { type: "string" },
        body: { type: "string" },
        "body-file": { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        "expected-version": { type: "string" },
        actor: { type: "string" },
        tag: { type: "string", multiple: true },
        "keep-timestamp": { type: "boolean" },
        strict: { type: "boolean" },
        "replace-links": { type: "boolean" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      }
    }),
    "doc update"
  );
  const std = {};
  const tags = [];
  const positionals = [];
  const kindFields = /* @__PURE__ */ new Map();
  const consumed = /* @__PURE__ */ new Set();
  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    if (tok.kind === "option-terminator") continue;
    if (tok.kind === "positional") {
      if (consumed.has(tok.index)) continue;
      positionals.push(tok.value);
      continue;
    }
    const name = tok.name;
    if (name === "help") continue;
    if (DOC_UPDATE_BOOLEAN_FLAGS.has(name)) {
      if (tok.value !== void 0) {
        throw new CliError("USAGE", `--${name} does not take a value (got --${name}=${tok.value})`, {
          help: `${cliInvocation()} doc update --help`
        });
      }
      continue;
    }
    if (DOC_UPDATE_VALUE_FLAGS.has(name)) {
      if (tok.value === void 0) {
        throw new CliError("USAGE", `--${name} requires a value`, { help: `${cliInvocation()} doc update --help` });
      }
      std[name] = tok.value;
      continue;
    }
    if (name === "tag") {
      if (tok.value === void 0) {
        throw new CliError("USAGE", "--tag requires a value", { help: `${cliInvocation()} doc update --help` });
      }
      tags.push(tok.value);
      continue;
    }
    let value;
    if (tok.value !== void 0) {
      value = tok.value;
    } else {
      const next = tokens[t + 1];
      if (next && next.kind === "positional" && next.index === tok.index + 1) {
        value = next.value;
        consumed.add(next.index);
      }
    }
    if (value === void 0) {
      throw new CliError("USAGE", `--${name} requires a value`, { help: `${cliInvocation()} doc update --help` });
    }
    const arr = kindFields.get(name) ?? [];
    arr.push(value);
    kindFields.set(name, arr);
  }
  return {
    help: Boolean(rawValues.help),
    json: Boolean(rawValues.json),
    dir: std.dir,
    remote: std.remote,
    keepTimestamp: Boolean(rawValues["keep-timestamp"]),
    strict: Boolean(rawValues.strict),
    replaceLinks: Boolean(rawValues["replace-links"]),
    title: std.title,
    description: std.description,
    tags: tags.length > 0 ? tags : void 0,
    type: std.type,
    body: std.body,
    bodyFile: std["body-file"],
    expectedVersion: std["expected-version"],
    actor: std.actor,
    positionals,
    kindFields
  };
}
async function docUpdate(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const readStdin = deps.readStdin ?? defaultReadStdin;
  const p = parseDocUpdateArgs(argv);
  if (p.help) {
    stdout(DOC_UPDATE_USAGE);
    return;
  }
  const id = p.positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc update requires a concept <id> positional", {
      help: `${cliInvocation()} doc update <id> --title <t>`
    });
  }
  if (p.positionals.length > 1) {
    throw new CliError(
      "USAGE",
      `doc update takes exactly one <id> positional, got ${p.positionals.length}: ${p.positionals.join(", ")}`,
      { help: `${cliInvocation()} doc update <id> --title <t>` }
    );
  }
  if (p.expectedVersion !== void 0 && p.expectedVersion.trim() === "") {
    throw new CliError(
      "USAGE",
      "--expected-version was given an empty value \u2014 pass a real version token (from a prior read/write receipt) or omit the flag for a normal (retrying) update.",
      { help: `${cliInvocation()} doc update ${id} --expected-version <v>` }
    );
  }
  const actor = resolveActor(p.actor, { help: `${cliInvocation()} doc update ${id} --actor <name>` });
  const otherFieldGiven = p.title !== void 0 || p.description !== void 0 || p.tags !== void 0 && p.tags.length > 0 || p.type !== void 0 || p.kindFields.size > 0;
  let stdinBody;
  let stdinSilentTimeout = false;
  if (p.body === void 0 && !p.bodyFile && !otherFieldGiven) {
    const raw = await readStdin();
    stdinSilentTimeout = raw === STDIN_SILENT_TIMEOUT;
    stdinBody = typeof raw === "string" && raw !== "" ? raw : void 0;
  }
  const anyFieldGiven = otherFieldGiven || p.body !== void 0 || Boolean(p.bodyFile) || stdinBody !== void 0;
  if (!anyFieldGiven) {
    throw new CliError(
      "USAGE",
      `doc update requires at least one field to patch (${DOC_UPDATE_FIELD_FLAGS.map((f) => `--${f}`).join("/")} or a kind-declared --<field>, e.g. --status)` + // The same silent-stdin signal doc write's receipt carries (see write.ts): when the probe
      // timed out, "nothing to patch" may really mean "your piped body arrived too late".
      (stdinSilentTimeout ? `. Note: ${STDIN_SILENT_NOTE}.` : ""),
      { help: `${cliInvocation()} doc update ${id} --title <t>` }
    );
  }
  const bundle = await openBundle(p.dir, await resolveRemoteFlag(p.remote, p.dir));
  const mode = resolveMode({ json: p.json });
  const registry = await loadKinds(bundle);
  const strict = p.strict || p.kindFields.size > 0;
  const result = await mutateDoc({
    bundle,
    id,
    mode: "patch",
    onAbsent: "fail",
    registry,
    remoteUrl: p.remote,
    strict,
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor,
    persistActor: true,
    expectedVersion: p.expectedVersion?.trim(),
    // Board self-attribution (PR C): a `changed: false` no-op never records (mutate.ts's
    // post-persist contract), so ambient attribution cannot manufacture a "self" actor.
    onPersisted: boardPostPersistHook(bundle, actor),
    buildCandidate: async (existingDoc) => {
      const existing = existingDoc;
      const nextFrontmatter = { ...existing.frontmatter };
      if (p.title !== void 0) nextFrontmatter.title = p.title;
      if (p.description !== void 0) nextFrontmatter.description = p.description;
      if (p.tags && p.tags.length > 0) nextFrontmatter.tags = p.tags;
      if (p.type !== void 0) nextFrontmatter.type = p.type.trim();
      if (!p.keepTimestamp) nextFrontmatter.timestamp = (/* @__PURE__ */ new Date()).toISOString();
      let nextBody = existing.body;
      if (p.body !== void 0) nextBody = p.body;
      else if (p.bodyFile) nextBody = await fs6.readFile(p.bodyFile, "utf8");
      else if (stdinBody !== void 0) nextBody = stdinBody;
      guardDroppedLinks(bundle, existing, nextBody, p.replaceLinks);
      if (p.kindFields.size > 0) {
        const resultType = p.type !== void 0 ? p.type.trim() : String(existing.frontmatter.type);
        const kind2 = registry.kinds.get(resultType);
        if (!kind2) {
          const governedKind = typeof existing.frontmatter.governs === "string" && existing.frontmatter.governs.trim() ? existing.frontmatter.governs : "<Kind>";
          const schemaHint = resultType === "Convention" ? ` To change a kind's SCHEMA (add/remove a declared field or enum value), use \`${cliInvocation()} kind field "${governedKind}" add/remove <name>\` (or edit the convention frontmatter directly).` : "";
          throw new CliError(
            "USAGE",
            `no kind governs type '${resultType}', so kind field(s) ${[...p.kindFields.keys()].map((f) => `--${f}`).join(", ")} cannot be patched here \u2014 only the standard fields (--title/--description/--tag/--type/--body/--body-file) are patchable on an ungoverned doc.` + schemaHint,
            { help: `${cliInvocation()} kinds` }
          );
        }
        const declared = [...kind2.fields.required, ...kind2.fields.optional];
        const unknown = [...p.kindFields.keys()].filter((f) => !declared.includes(f));
        if (unknown.length > 0) {
          throw new CliError(
            "USAGE",
            `unknown field(s) for kind '${kind2.governs}': ${unknown.join(", ")} (declared: ${declared.length > 0 ? declared.join(", ") : "none"}; standard patch flags: title, description, tag, type, body, body-file) \u2014 to ADD a field to the '${kind2.governs}' kind: \`${cliInvocation()} kind field "${kind2.governs}" add <name>\`.`,
            { help: `${cliInvocation()} kinds` }
          );
        }
        for (const [field, vals] of p.kindFields) {
          nextFrontmatter[field] = vals.length === 1 ? vals[0] : vals;
        }
      }
      return { frontmatter: nextFrontmatter, body: nextBody };
    },
    errors: {
      notFound: () => new CliError("NOT_FOUND", `no concept document at id '${id}'`, { help: `${cliInvocation()} list` }),
      staleHead: (err) => new CliError(
        "STALE_HEAD",
        `'${id}' has moved since --expected-version ${err.expected} was read (current: ${err.actual ?? "absent"}) \u2014 re-read and retry with the current version.`,
        { help: `${cliInvocation()} doc read ${id}`, details: { expected: err.expected, actual: err.actual } }
      )
    }
  });
  const receipt = {
    doc: "updated",
    id: result.doc.id,
    type: result.doc.frontmatter.type,
    timestamp: result.doc.frontmatter.timestamp ?? null,
    changed: result.changed,
    // The doc's version AFTER this patch (or its unchanged head on a no-op) — the token for a
    // subsequent `--expected-version` compare-and-swap.
    version: result.version
  };
  if (result.warnings.length > 0) receipt.warnings = result.warnings;
  if (isLegacyPageDoc(result.doc.frontmatter)) receipt.hint = LEGACY_PAGE_TYPE_HINT;
  receipt.help = [`${cliInvocation()} doc read ${result.doc.id}`];
  stdout(render(receipt, mode));
}

// src/commands/doc/read.ts
import { parseArgs as parseArgs4 } from "node:util";
import { promises as fs7 } from "node:fs";
import path15 from "node:path";

// src/autopull.ts
async function maybeAutoPull2(dir, opts = {}) {
  return maybeAutoPull({ store: defaultSyncStore, resolveBundleRoot: findBundleRoot }, dir, opts);
}
async function pullBoardAndRecord2(boardPath, key, budget = {}, now = () => /* @__PURE__ */ new Date()) {
  return pullBoardAndRecord(defaultSyncStore, boardPath, key, budget, now);
}

// src/commands/doc/read.ts
async function docRead(argv, deps) {
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const rawStdoutReserved = requestsStdoutByteChannel(argv);
  if (!rawStdoutReserved) return docReadInner(argv, deps);
  try {
    await docReadInner(argv, deps);
  } catch (err) {
    const { envelope, handled } = toExit(err);
    if (!handled) stderr(renderErrorEnvelope(envelope));
    throw handled ? err : asHandled(err);
  }
}
async function docReadInner(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d) => void process.stdout.write(d));
  const { values, positionals } = parseOrUsage(
    () => parseArgs4({
      args: argv,
      options: {
        out: { type: "string" },
        "body-out": { type: "string" },
        field: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "doc read"
  );
  if (values.help) {
    stdout(DOC_READ_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc read requires a concept <id> positional", {
      help: `${cliInvocation()} doc read <id>`
    });
  }
  const bodyOutValue = values["body-out"];
  const bodyOutPresent = bodyOutValue !== void 0;
  const outPresent = values.out !== void 0;
  const fieldPresent = values.field !== void 0;
  if (bodyOutPresent && (outPresent || fieldPresent)) {
    throw new CliError(
      "USAGE",
      "--body-out cannot be combined with --out or --field \u2014 each selects a different read channel.",
      { help: `${cliInvocation()} doc read ${id} --body-out (<path> | -)` }
    );
  }
  if (bodyOutPresent && bodyOutValue.trim() === "") {
    throw new CliError(
      "USAGE",
      "--body-out was given an empty value \u2014 pass a file path or '-' for stdout.",
      { help: `${cliInvocation()} doc read ${id} --body-out (<path> | -)` }
    );
  }
  if (values.field !== void 0 && values.out !== void 0 && values.out.trim() !== "") {
    throw new CliError(
      "USAGE",
      "--field and --out cannot be combined \u2014 both reserve stdout for a single raw value.",
      { help: `${cliInvocation()} doc read ${id} --field <name>` }
    );
  }
  if (values.field !== void 0 && values.field.trim() === "") {
    throw new CliError(
      "USAGE",
      "--field was given an empty value \u2014 pass a frontmatter field name (or id/type/head_version).",
      { help: `${cliInvocation()} doc read ${id} --field <name>` }
    );
  }
  const field = values.field?.trim();
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (deps.autoPull ?? maybeAutoPull2)(values.dir);
  const bundle = await openBundle(values.dir, remote);
  if (bodyOutPresent) {
    const bodyOut = bodyOutValue.trim();
    const streamMode2 = bodyOut === "-";
    if (!streamMode2) await assertSafeBodyOutTarget(bundle, bodyOut, id);
    const runToTarget2 = async () => {
      let parsed;
      let version;
      try {
        ({ doc: parsed, version } = await readDocVersioned(bundle, id));
      } catch (err) {
        throw readErrorToCliError(err, id, values.remote);
      }
      const bytes = Buffer.from(parsed.body, "utf8");
      const result = {
        doc: "read",
        id,
        body_out: bodyOut,
        size_bytes: bytes.byteLength,
        content_type: "text/markdown; charset=utf-8",
        version
      };
      if (streamMode2) {
        writeStdoutBytes(bytes);
        stderr(render(result, resolveMode(values)));
        return;
      }
      await fs7.writeFile(bodyOut, bytes);
      stdout(render(result, resolveMode(values)));
    };
    await runToTarget2();
    return;
  }
  if (field) {
    try {
      let parsed;
      let version;
      try {
        ({ doc: parsed, version } = await readDocVersioned(bundle, id));
      } catch (err) {
        throw readErrorToCliError(err, id, values.remote);
      }
      stdout(formatFieldValue(resolveField(parsed, version, field, id)));
    } catch (err) {
      const { envelope } = toExit(err);
      stderr(renderErrorEnvelope(envelope));
      throw asHandled(err);
    }
    return;
  }
  const out = values.out?.trim();
  if (!out) {
    let parsed;
    let version;
    try {
      ({ doc: parsed, version } = await readDocVersioned(bundle, id));
    } catch (err) {
      throw readErrorToCliError(err, id, values.remote);
    }
    const fm = parsed.frontmatter;
    const rec = { id: parsed.id };
    const KNOWN_ORDER = ["type", "title", "description", "resource", "tags", "timestamp"];
    const RESERVED_OUTPUT = /* @__PURE__ */ new Set(["id", "head_version", "body", "body_truncated", "body_chars", "help"]);
    for (const key of KNOWN_ORDER) {
      if (fm[key] !== void 0 && fm[key] !== null) rec[key] = fm[key];
    }
    for (const key of Object.keys(fm)) {
      if (KNOWN_ORDER.includes(key) || RESERVED_OUTPUT.has(key)) continue;
      if (fm[key] === void 0 || fm[key] === null) continue;
      rec[key] = fm[key];
    }
    rec.head_version = version;
    const body = parsed.body;
    if (body.length > BODY_PREVIEW_LIMIT) {
      rec.body = body.slice(0, BODY_PREVIEW_LIMIT);
      rec.body_truncated = true;
      rec.body_chars = body.length;
      rec.help = [`${cliInvocation()} doc read ${parsed.id} --out <file>`];
    } else {
      rec.body = body;
    }
    stdout(render(rec, resolveMode(values)));
    return;
  }
  const streamMode = out === "-";
  const runToTarget = async () => {
    let bytes;
    let rel;
    if (bundle.backend) {
      let parsed;
      try {
        parsed = await readDoc(bundle, id);
      } catch (err) {
        throw readErrorToCliError(err, id, values.remote);
      }
      bytes = Buffer.from(stringifyDoc(parsed.frontmatter, parsed.body), "utf8");
      rel = pathFromConceptId(id);
    } else {
      try {
        assertSafeConceptId(id);
        rel = pathFromConceptId(id);
        bytes = await fs7.readFile(path15.join(bundle.root, rel));
      } catch (err) {
        throw readErrorToCliError(err, id, values.remote);
      }
    }
    const contentType = inferContentTypeFromDocKey(rel) ?? "text/markdown; charset=utf-8";
    const result = {
      doc: "read",
      id,
      out,
      size_bytes: bytes.byteLength,
      content_type: contentType
    };
    if (streamMode) {
      writeStdoutBytes(bytes);
      stderr(render(result, resolveMode(values)));
      return;
    }
    const warning = inBundlePollutionWarning(bundle, out);
    if (warning) result.warning = warning;
    await fs7.writeFile(out, bytes);
    stdout(render(result, resolveMode(values)));
  };
  await runToTarget();
}
function requestsStdoutByteChannel(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === "--out" || arg === "--body-out") && argv[i + 1]?.trim() === "-") return true;
    if (arg?.startsWith("--out=") && arg.slice("--out=".length).trim() === "-") return true;
    if (arg?.startsWith("--body-out=") && arg.slice("--body-out=".length).trim() === "-") return true;
  }
  return false;
}
async function assertSafeBodyOutTarget(bundle, bodyOut, id) {
  if (bundle.backend) return;
  const lexicalTarget = path15.resolve(bodyOut);
  const rootReal = await fs7.realpath(path15.resolve(bundle.root)).catch(() => path15.resolve(bundle.root));
  const effectiveTarget = await effectiveOutputPath(lexicalTarget);
  const inside = (candidate, base) => candidate === base || candidate.startsWith(base + path15.sep);
  const unsafeLexical = inside(lexicalTarget, rootReal) && lexicalTarget.endsWith(".md");
  const unsafeEffective = inside(effectiveTarget, rootReal) && effectiveTarget.endsWith(".md");
  if (!unsafeLexical && !unsafeEffective) return;
  throw new CliError(
    "USAGE",
    `--body-out ${bodyOut} targets ${effectiveTarget}, a .md path INSIDE this bundle (${rootReal}); body-only markdown has no OKF frontmatter and cannot be written into the bundle.`,
    { help: `${cliInvocation()} doc read ${id} --body-out <path-outside-bundle>` }
  );
}
async function effectiveOutputPath(absoluteTarget) {
  let probe = absoluteTarget;
  const missingSuffix = [];
  while (true) {
    try {
      return path15.join(await fs7.realpath(probe), ...missingSuffix);
    } catch {
      const parent = path15.dirname(probe);
      if (parent === probe) return absoluteTarget;
      missingSuffix.unshift(path15.basename(probe));
      probe = parent;
    }
  }
}
function resolveField(parsed, version, field, id) {
  if (field === "head_version") return version;
  if (field === "id") return parsed.id;
  const fm = parsed.frontmatter;
  if (fm[field] !== void 0 && fm[field] !== null) return fm[field];
  const available = [
    "id",
    "head_version",
    ...Object.keys(fm).filter((key) => fm[key] !== void 0 && fm[key] !== null)
  ];
  throw new CliError("NOT_FOUND", `'${id}' has no field '${field}' \u2014 fields present: ${available.join(", ")}`, {
    help: `${cliInvocation()} doc read ${id}`,
    details: { field, available }
  });
}
function formatFieldValue(value) {
  if (typeof value === "object") return `${JSON.stringify(value)}
`;
  return `${String(value)}
`;
}
function inBundlePollutionWarning(bundle, out) {
  if (bundle.backend) return void 0;
  const resolvedOut = path15.resolve(out);
  const root = bundle.root;
  const isInside = resolvedOut === root || resolvedOut.startsWith(root + path15.sep);
  if (!isInside) return void 0;
  if (isReservedFile(resolvedOut)) {
    return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) at a reserved OKF filename \u2014 the write will CLOBBER that reserved file (index.md/log.md is never re-parsed as a concept doc). Pass a path outside the bundle if that is not intended.`;
  }
  if (!resolvedOut.endsWith(".md")) return void 0;
  return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) \u2014 the exported file will be re-ingested as a new concept doc on the next bundle walk (list/query/status). Pass a path outside the bundle if that is not intended.`;
}

// src/commands/doc/history.ts
import { parseArgs as parseArgs5 } from "node:util";
var DEFAULT_LIMIT = 20;
async function docHistory(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs5({
      args: argv,
      options: {
        limit: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "doc history"
  );
  if (values.help) {
    stdout(DOC_HISTORY_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc history requires a concept <id> positional", {
      help: `${cliInvocation()} doc history <id>`
    });
  }
  let limit = DEFAULT_LIMIT;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} doc history ${id} --limit 20`
      });
    }
    limit = Number(raw);
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  let versions;
  try {
    versions = await docVersions(bundle, id);
  } catch (err) {
    throw readErrorToCliError(err, id, values.remote);
  }
  if (versions.length === 0) {
    stdout(
      render(
        {
          id,
          count: 0,
          versions: [],
          help: `no version history for '${id}' \u2014 it has not been written to this bundle`
        },
        resolveMode(values)
      )
    );
    return;
  }
  const total = versions.length;
  const shown = limit > 0 ? versions.slice(0, limit) : versions;
  const truncated = shown.length < total;
  const out = {
    id,
    count: total,
    versions: shown.map(
      (v) => v.agent === void 0 ? { version: v.version, actor: v.actor, timestamp: v.timestamp } : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent }
    )
  };
  if (truncated) out.shown = shown.length;
  const help = [];
  if (truncated) {
    help.push(
      `showing ${shown.length} of ${total} \u2014 run \`${cliInvocation()} doc history ${id} --limit 0\` (or a higher --limit) for all`
    );
  }
  help.push(`${cliInvocation()} doc update ${id} --expected-version ${versions[0].version}`);
  out.help = help;
  stdout(render(out, resolveMode(values)));
}

// src/commands/doc/delete.ts
import { parseArgs as parseArgs6 } from "node:util";
async function docDelete(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs6({
      args: argv,
      options: {
        "expected-version": { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "doc delete"
  );
  if (values.help) {
    stdout(DOC_DELETE_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "doc delete requires a concept <id> positional", {
      help: `${cliInvocation()} doc delete <id>`
    });
  }
  if (isReservedFile(pathFromConceptId(id))) {
    throw new CliError(
      "USAGE",
      `'${id}' is a reserved file (index.md/log.md) \u2014 reserved files cannot be deleted.`,
      { help: `${cliInvocation()} doc delete --help` }
    );
  }
  const rawExpected = values["expected-version"];
  if (rawExpected !== void 0 && rawExpected.trim() === "") {
    throw new CliError(
      "USAGE",
      "--expected-version was given an empty value \u2014 pass a real version token (from a prior read/write receipt) or omit the flag for an unconditional delete.",
      { help: `${cliInvocation()} doc delete ${id} --expected-version <v>` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const expectedVersion = rawExpected?.trim();
  let deleted;
  try {
    deleted = await deleteDoc(bundle, id, expectedVersion ? { expectedVersion } : void 0);
  } catch (err) {
    if (err instanceof VersionConflict) {
      throw new CliError(
        "STALE_HEAD",
        `'${id}' has moved since --expected-version ${err.expected} was read (current: ${err.actual ?? "absent"}) \u2014 re-read and retry with the current version.`,
        {
          help: `${cliInvocation()} doc read ${id}`,
          details: { expected: err.expected, actual: err.actual }
        }
      );
    }
    throw classifyBundleError(err, values.remote);
  }
  const receipt = { doc: "deleted", id, deleted };
  receipt.help = [`${cliInvocation()} list`];
  stdout(render(receipt, mode));
}

// src/commands/doc.ts
async function doc(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "write") return docWrite(rest, deps);
  if (sub === "update") return docUpdate(rest, deps);
  if (sub === "read") return docRead(rest, deps);
  if (sub === "history") return docHistory(rest, deps);
  if (sub === "delete") return docDelete(rest, deps);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(DOC_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown doc subcommand: ${sub} (expected write|update|read|history|delete)`, {
    help: `${cliInvocation()} doc --help`
  });
}

// src/commands/promote.ts
import { parseArgs as parseArgs7 } from "node:util";
import { promises as fs8 } from "node:fs";
var PROMOTE_USAGE = `agentstate-lite promote \u2014 move a local file's bytes into the store (the reverse of 'doc read --out')

Usage:
  agentstate-lite promote <file> --doc-key <key> [options]

Routes by the --doc-key's target (checked case-insensitively):
  A key ending '.md' is a DOC: the file is parsed as an OKF concept (YAML frontmatter + markdown
  body) and written through the engine \u2014 doc id = the key minus '.md'. The file's OWN frontmatter
  is passed through verbatim (no CLI metadata flags on this route \u2014 edit the file locally, that is
  the whole loop). A governing kind convention is validated exactly like 'doc write' (warn-by-
  default; --strict rejects, exit 2, no write). --content-type is a USAGE error on this route.
  Any OTHER key is a BLOB: opaque bytes + a content-type, never parsed or normalized.

CAS: omitting --expected-version means EXPECT-ABSENT CREATE \u2014 the write succeeds only if <key> does
NOT already exist (the same create-only discipline 'new' uses). Updating an EXISTING target always
requires --expected-version <token> (from a prior 'pull'/'promote' receipt); a stale token is a
CONFLICT (exit 5) whose envelope carries the CURRENT version, so you can re-pull -> re-apply your
edit -> re-promote without a second discovery call.

Locally (--dir) this is a convenience \u2014 the files ARE the store \u2014 but a .md promote still doubles
as IMPORT+NORMALIZE (frontmatter key order, a defaulted timestamp, kind validation), same as 'doc
write'. Over --remote it is load-bearing: there is no other way to get bytes into a served bundle.

The receipt's content_type reports the WRITE-TIME resolution (override, else inferred from the
key's extension) \u2014 history-less backends (the local filesystem) do not persist an explicit
override and RE-INFER from the extension on every subsequent read, so a follow-up 'pull' may
report a different content_type than this receipt did; backends that keep state (a remote,
document-centric store) persist the override and pull reports it back unchanged.

Options:
  --doc-key <key>          Destination key (required) \u2014 ends '.md' -> doc route, else blob route
  --content-type <mime>    Blob route only (USAGE error with a .md key); default: inferred from the
                            key's extension, else application/octet-stream
  --expected-version <v>   Compare-and-swap token from a prior pull/promote receipt (omit = expect-
                            absent create; see CAS above)
  --strict                 Doc route only: reject (exit 2) instead of writing-with-warnings when a
                            kind convention governs the doc's type and it does not satisfy it
  --dir <path>              Bundle directory (default: discovered from the cwd)
  --remote <url>            Talk to a wire-protocol server instead of a local bundle (mutually
                            exclusive with --dir; remote access is always explicit)
  --json                    Emit compact JSON instead of TOON
  -h, --help                Show this help
`;
function isDocRouteKey(key) {
  return key.toLowerCase().endsWith(".md");
}
async function promote(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs7({
      args: argv,
      options: {
        "doc-key": { type: "string" },
        "content-type": { type: "string" },
        "expected-version": { type: "string" },
        strict: { type: "boolean" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "promote"
  );
  if (values.help) {
    stdout(PROMOTE_USAGE);
    return;
  }
  const file = positionals[0]?.trim();
  if (!file) {
    throw new CliError("USAGE", "promote requires a local <file> positional", {
      help: `${cliInvocation()} promote <file> --doc-key <key>`
    });
  }
  const key = values["doc-key"]?.trim();
  if (!key) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} promote ${file} --doc-key <key>`
    });
  }
  const docRoute = isDocRouteKey(key);
  if (docRoute && values["content-type"] !== void 0) {
    throw new CliError(
      "USAGE",
      `--content-type is a blob-route-only option; '${key}' ends in '.md' and routes through the doc engine, which passes through the file's OWN frontmatter instead (I9)`,
      { help: `${cliInvocation()} promote --help` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const expectedVersion = values["expected-version"] ?? null;
  if (docRoute) {
    await promoteDoc(file, key, bundle, { expectedVersion, strict: Boolean(values.strict) }, stdout, mode, values.remote);
    return;
  }
  await promoteBlob(file, key, bundle, { expectedVersion, contentType: values["content-type"] }, stdout, mode, values.remote);
}
async function promoteDoc(file, key, bundle, opts, stdout, mode, remoteUrl) {
  let raw;
  try {
    raw = await fs8.readFile(file, "utf8");
  } catch (err) {
    throw promoteFileReadError(err, file);
  }
  const { frontmatter, body } = parseMarkdown(raw);
  if (typeof frontmatter.type !== "string" || frontmatter.type.trim() === "") {
    throw new CliError(
      "USAGE",
      `'${file}' has no usable frontmatter (missing, or missing a non-empty 'type' field) \u2014 a promoted '.md' file must be a valid OKF concept document (YAML frontmatter starting with at least 'type: <Kind>'). See '${cliInvocation()} kinds' for declared kinds, or '${cliInvocation()} new "<Kind>" <id> ...' to scaffold one correctly.`,
      { help: `${cliInvocation()} new --help` }
    );
  }
  const canonicalPath = key.slice(0, -3) + ".md";
  const id = conceptIdFromPath(canonicalPath);
  const candidate = { id, frontmatter, body };
  const registry = await loadKinds(bundle);
  const warnings = defaultTimestampAndValidateKind(candidate, registry, {
    strict: opts.strict,
    helpOnReject: `${cliInvocation()} kinds`,
    // I9: an omitted --expected-version is an EXPECT-ABSENT create (the doc does not yet exist); a
    // present one implies the caller read the doc first to get that token, so it already exists.
    docExists: opts.expectedVersion !== null
  });
  let version;
  try {
    ({ version } = await writeDocVersioned(bundle, candidate, { expectedVersion: opts.expectedVersion }));
  } catch (err) {
    throw promoteWriteErrorToCliError(err, key, file, remoteUrl);
  }
  const receipt = {
    promote: "written",
    route: "doc",
    key,
    id: candidate.id,
    type: candidate.frontmatter.type,
    version,
    size_bytes: Buffer.byteLength(raw, "utf8")
  };
  if (warnings.length > 0) receipt.warnings = warnings;
  if (isLegacyPageDoc(candidate.frontmatter)) receipt.hint = LEGACY_PAGE_TYPE_HINT;
  receipt.help = [`${cliInvocation()} pull --doc-key ${key} --out <path>`];
  stdout(render(receipt, mode));
}
async function promoteBlob(file, key, bundle, opts, stdout, mode, remoteUrl) {
  let bytes;
  try {
    bytes = await fs8.readFile(file);
  } catch (err) {
    throw promoteFileReadError(err, file);
  }
  let version;
  try {
    version = await writeBlob(bundle, key, bytes, opts.contentType, { expectedVersion: opts.expectedVersion });
  } catch (err) {
    throw promoteWriteErrorToCliError(err, key, file, remoteUrl);
  }
  const receipt = {
    promote: "written",
    route: "blob",
    key,
    // The SAME resolution `writeBlob` used internally (`resolveContentType`, the ONE MIME source,
    // core's content-type.ts) — no extra round trip to read the blob back just to report it.
    content_type: resolveContentType(key, opts.contentType),
    version,
    size_bytes: bytes.byteLength
  };
  receipt.help = [`${cliInvocation()} pull --doc-key ${key} --out <path>`];
  stdout(render(receipt, mode));
}
function promoteFileReadError(err, file) {
  if (err?.code === "ENOENT") {
    return new CliError("USAGE", `no such file: '${file}'`, {
      help: `${cliInvocation()} promote <file> --doc-key <key>`
    });
  }
  return classifyBundleError(err);
}
function promoteWriteErrorToCliError(err, key, file, remoteUrl) {
  if (err instanceof CliError) return err;
  if (err instanceof VersionConflict) {
    const current = err.actual;
    if (err.expected === null) {
      return new CliError(
        "ALREADY_EXISTS",
        `'${key}' already exists \u2014 promote with no --expected-version means expect-absent CREATE, not an overwrite. Pass --expected-version ${current ?? "<token>"} (from a prior pull/promote receipt) to update it.`,
        {
          help: `${cliInvocation()} promote ${file} --doc-key ${key} --expected-version ${current ?? "<token>"}`,
          details: { expected: err.expected, actual: err.actual }
        }
      );
    }
    return new CliError(
      "STALE_HEAD",
      `'${key}' has moved since --expected-version ${err.expected} was read (current: ${current ?? "absent"}) \u2014 re-pull, re-apply your edit, and re-promote with the current version.`,
      {
        help: `${cliInvocation()} pull --doc-key ${key} --out <path>`,
        details: { expected: err.expected, actual: err.actual }
      }
    );
  }
  return classifyBundleError(err, remoteUrl);
}

// src/commands/pull.ts
import { parseArgs as parseArgs8 } from "node:util";
import { promises as fs9 } from "node:fs";
var PULL_USAGE = `agentstate-lite pull \u2014 pull a doc or blob's bytes out of the store (the reverse of 'promote')

Usage:
  agentstate-lite pull --doc-key <key> --out (<path> | -) [options]

Routes by the --doc-key's target (case-insensitive), symmetric with 'promote':
  A key ending '.md' is a DOC: delivered as the CANONICAL OKF re-serialization (core's ONE
  serializer), for BOTH --dir and --remote. For an engine-written doc this is byte-identical to the
  original; a hand-edited file with unusual YAML formatting round-trips to the canonical form, not
  its original bytes. The receipt's 'version' is the store's CURRENT version token (no byte-verify
  on this route, B7) \u2014 pass it straight to a follow-up 'promote --expected-version' to update it
  safely.
  Any OTHER key is a BLOB: raw bytes, self-verified against the returned version (a real integrity
  check \u2014 catches transport corruption over --remote too, not just a local tautology).

--out - streams raw bytes to stdout; the receipt goes to STDERR instead (the byte stream stays
pure), and any error also routes to stderr in that mode. --out <path> writes the file and prints the
receipt to stdout. A destination path landing INSIDE an open LOCAL bundle carries a loud 'warning'
field when it resolves to a '.md' or reserved (index.md/log.md) filename \u2014 the SAME risk
'doc read --out' warns about \u2014 regardless of whether the pulled bytes came from the doc or blob
route; an ordinary blob's own key naturally avoids this (it is not '.md'-shaped), so the warning
does not fire for typical blob pulls.

Options:
  --doc-key <key>       Source key (required)
  --out <path>          Write bytes to this local path
  --out -               Stream raw bytes to stdout; receipt -> stderr
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle (mutually
                         exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function isDocRouteKey2(key) {
  return key.toLowerCase().endsWith(".md");
}
async function pullDoc(bundle, key, remoteUrl) {
  const canonicalPath = key.slice(0, -3) + ".md";
  const id = conceptIdFromPath(canonicalPath);
  let result;
  try {
    result = await readDocVersioned(bundle, id);
  } catch (err) {
    throw readErrorToCliError(err, id, remoteUrl);
  }
  const raw = stringifyDoc(result.doc.frontmatter, result.doc.body);
  const bytes = Buffer.from(raw, "utf8");
  return {
    bytes,
    fields: {
      route: "doc",
      id: result.doc.id,
      type: result.doc.frontmatter.type,
      version: result.version,
      size_bytes: bytes.byteLength
    }
  };
}
async function pullBlob(bundle, key, remoteUrl) {
  let result;
  try {
    result = await readBlob(bundle, key);
  } catch (err) {
    throw classifyBundleError(err, remoteUrl);
  }
  if (result === null) {
    throw new CliError("NOT_FOUND", `no blob at key '${key}'`, {
      help: `${cliInvocation()} promote <file> --doc-key ${key}`
    });
  }
  const actual = blobVersion(result.bytes);
  if (actual !== result.version) {
    throw new CliError(
      "INTEGRITY_MISMATCH",
      `pulled bytes for '${key}' hash to ${actual}, but the store reported ${result.version} \u2014 the transfer may have been corrupted; retry the pull`,
      { details: { expected: result.version, actual } }
    );
  }
  return {
    bytes: result.bytes,
    fields: {
      route: "blob",
      content_type: result.contentType,
      version: result.version,
      size_bytes: result.bytes.byteLength
    }
  };
}
async function pull(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d) => void process.stdout.write(d));
  const { values, positionals } = parseOrUsage(
    () => parseArgs8({
      args: argv,
      options: {
        "doc-key": { type: "string" },
        out: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "pull"
  );
  if (values.help) {
    stdout(PULL_USAGE);
    return;
  }
  if (positionals.length > 0) {
    throw new CliError(
      "USAGE",
      `pull takes no positional arguments, got ${positionals.length}: ${positionals.join(", ")} (did you mean 'promote <file> --doc-key <key>'?)`,
      { help: `${cliInvocation()} pull --doc-key <key> --out <path>` }
    );
  }
  const key = values["doc-key"]?.trim();
  if (!key) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} pull --doc-key <key> --out <path>`
    });
  }
  const out = values.out?.trim();
  if (!out) {
    throw new CliError("USAGE", "--out (<path> | -) is required", {
      help: `${cliInvocation()} pull --doc-key ${key} --out <path>`
    });
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const streamMode = out === "-";
  const docRoute = isDocRouteKey2(key);
  const runToTarget = async () => {
    const result = docRoute ? await pullDoc(bundle, key, values.remote) : await pullBlob(bundle, key, values.remote);
    const receipt = { pull: "read", key, ...result.fields, out };
    const version = result.fields.version;
    const fileHint = streamMode ? "<file>" : out;
    receipt.help = [`${cliInvocation()} promote ${fileHint} --doc-key ${key} --expected-version ${version}`];
    if (streamMode) {
      writeStdoutBytes(result.bytes);
      stderr(render(receipt, mode));
      return;
    }
    const warning = inBundlePollutionWarning(bundle, out);
    if (warning) receipt.warning = warning;
    await fs9.writeFile(out, result.bytes);
    stdout(render(receipt, mode));
  };
  if (!streamMode) {
    await runToTarget();
    return;
  }
  try {
    await runToTarget();
  } catch (err) {
    const { envelope } = toExit(err);
    stderr(renderErrorEnvelope(envelope));
    throw asHandled(err);
  }
}

// src/commands/blobs.ts
import { parseArgs as parseArgs9 } from "node:util";
var BLOBS_USAGE = `agentstate-lite blobs \u2014 list the store's blob (non-document) keys

Usage:
  agentstate-lite blobs [--prefix <p>] [--limit <n>] [--dir <path> | --remote <url>]

Blobs are opaque byte artifacts (generated HTML, images, \u2026) addressed by key \u2014 the non-'.md' half
of the store that 'promote'/'pull'/'delete --doc-key' operate on individually. This lists their
KEYS; documents are listed by 'list'/'query' instead.

Options:
  --prefix <p>    Restrict to keys starting with this prefix
  --limit <n>     Cap the number of keys returned (default: 100; 0 = unlimited). A truncated result
                  reports 'shown' alongside the total 'count'.
  --dir <path>    Bundle directory (default: discovered from the cwd)
  --remote <url>  Talk to a wire-protocol server instead of a local bundle
                  (mutually exclusive with --dir; remote access is always explicit)
  --json          Emit compact JSON instead of TOON
  -h, --help      Show this help
`;
async function blobs(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs9({
      args: argv,
      options: {
        prefix: { type: "string" },
        limit: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "blobs"
  );
  if (values.help) {
    stdout(BLOBS_USAGE);
    return;
  }
  const DEFAULT_LIMIT4 = 100;
  let limit = DEFAULT_LIMIT4;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} blobs --limit 100`
      });
    }
    limit = Number(raw);
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const keys = (await listBlobs(bundle, values.prefix?.trim() || void 0)).slice().sort();
  const total = keys.length;
  const shownKeys = limit > 0 ? keys.slice(0, limit) : keys;
  const truncated = shownKeys.length < total;
  const out = { count: total, blobs: shownKeys };
  if (truncated) out.shown = shownKeys.length;
  const help = [];
  if (truncated) {
    help.push(
      `showing ${shownKeys.length} of ${total} \u2014 run \`${cliInvocation()} blobs --limit 0\` for all`
    );
  }
  help.push(
    total > 0 ? `${cliInvocation()} pull --doc-key <key> --out <path>` : `no blobs in the store \u2014 add one with \`${cliInvocation()} promote <file> --doc-key <key>\``
  );
  out.help = help;
  stdout(render(out, resolveMode(values)));
}

// src/commands/delete.ts
import { parseArgs as parseArgs10 } from "node:util";
var DELETE_USAGE = `agentstate-lite delete \u2014 hard-delete a doc or blob by its key (symmetric with promote/pull)

Usage:
  agentstate-lite delete --doc-key <key> [options]

Routes by the --doc-key's target (checked case-insensitively), symmetric with 'promote'/'pull':
  A key ending '.md' is a DOC: id = the key minus '.md' \u2014 deleted through the engine. A reserved id
  (index.md/log.md) is rejected as USAGE regardless of this route \u2014 reserved files were never
  deletable.
  Any OTHER key is a BLOB: opaque bytes, deleted directly (no OKF semantics to enforce).

'doc delete <id>' (see 'agentstate-lite doc --help') is the concept-native form for docs; this verb
exists because blob addressing lives only in the --doc-key family.

Idempotent: deleting an ABSENT key is SUCCESS (deleted:false, exit 0), never NOT_FOUND. Hard-delete
\u2014 no tombstone, non-cascading (other docs' links to/from the deleted id are left exactly as
written), and does NOT append a log.md entry.

Options:
  --doc-key <key>          Key to delete (required) \u2014 ends '.md' -> doc route, else blob route
  --expected-version <v>   Compare-and-swap token from a prior read/write/pull receipt (a stale
                            token is a CONFLICT, exit 5; omit for an unconditional delete)
  --dir <path>              Bundle directory (default: discovered from the cwd)
  --remote <url>            Talk to a wire-protocol server instead of a local bundle (mutually
                            exclusive with --dir; remote access is always explicit)
  --json                    Emit compact JSON instead of TOON
  -h, --help                Show this help
`;
function isDocRouteKey3(key) {
  return key.toLowerCase().endsWith(".md");
}
async function deleteCommand(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs10({
      args: argv,
      options: {
        "doc-key": { type: "string" },
        "expected-version": { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "delete"
  );
  if (values.help) {
    stdout(DELETE_USAGE);
    return;
  }
  if (positionals.length > 0) {
    throw new CliError(
      "USAGE",
      `delete takes no positional arguments, got ${positionals.length}: ${positionals.join(", ")}`,
      { help: `${cliInvocation()} delete --doc-key <key>` }
    );
  }
  const key = values["doc-key"]?.trim();
  if (!key) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} delete --doc-key <key>`
    });
  }
  const rawExpected = values["expected-version"];
  if (rawExpected !== void 0 && rawExpected.trim() === "") {
    throw new CliError(
      "USAGE",
      "--expected-version was given an empty value \u2014 pass a real version token (from a prior read/write/pull receipt) or omit the flag for an unconditional delete.",
      { help: `${cliInvocation()} delete --doc-key ${key} --expected-version <v>` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const expectedVersion = rawExpected?.trim();
  const docRoute = isDocRouteKey3(key);
  let deleted;
  try {
    if (docRoute) {
      const canonicalPath = key.slice(0, -3) + ".md";
      const id = conceptIdFromPath(canonicalPath);
      deleted = await deleteDoc(bundle, id, expectedVersion ? { expectedVersion } : void 0);
    } else {
      deleted = await deleteBlob(bundle, key, expectedVersion ? { expectedVersion } : void 0);
    }
  } catch (err) {
    throw deleteErrorToCliError(err, key, values.remote);
  }
  const receipt = {
    delete: "deleted",
    route: docRoute ? "doc" : "blob",
    key,
    deleted
  };
  receipt.help = [`${cliInvocation()} list`];
  stdout(render(receipt, mode));
}
function deleteErrorToCliError(err, key, remoteUrl) {
  if (err instanceof CliError) return err;
  if (err instanceof VersionConflict) {
    return new CliError(
      "STALE_HEAD",
      `'${key}' has moved since --expected-version ${err.expected} was read (current: ${err.actual ?? "absent"}) \u2014 re-read and retry with the current version.`,
      {
        help: `${cliInvocation()} delete --doc-key ${key} --expected-version ${err.actual ?? "<token>"}`,
        details: { expected: err.expected, actual: err.actual }
      }
    );
  }
  return classifyBundleError(err, remoteUrl);
}

// src/commands/link.ts
import { parseArgs as parseArgs11 } from "node:util";

// src/link-types.ts
function collectLinkDeclarations(registry) {
  const byText = /* @__PURE__ */ new Map();
  for (const kind2 of registry.kinds.values()) {
    if (!kind2.links) continue;
    for (const [text, target] of Object.entries(kind2.links)) {
      const list2 = byText.get(text) ?? [];
      list2.push({ governs: kind2.governs, target });
      byText.set(text, list2);
    }
  }
  return byText;
}

// src/commands/link.ts
var LINK_COMMON_OPTIONS = `Common options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; remote access is always explicit)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help`;
var LINK_USAGE = `agentstate-lite link \u2014 add a cross-link, show a concept's links + backlinks, or query the bundle's whole edge graph

Usage:
  agentstate-lite link add  <from> <to> [options]   Add a cross-link (idempotent)
  agentstate-lite link show <id> [options]          Show a concept's outbound links + derived backlinks
  agentstate-lite link list [options]               Query the whole bundle's derived edge list, filtered

Run 'agentstate-lite link <verb> --help' for a verb's full options.

${LINK_COMMON_OPTIONS}
`;
var LINK_ADD_USAGE = `agentstate-lite link add \u2014 append a cross-link from one concept to another (idempotent)

Usage:
  agentstate-lite link add <from> <to> [--text <t>] [--actor <name>] [options]

Idempotent: re-adding the same target with the same exact display text is a no-op \u2014 exit 0,
changed:false, no duplicate link, no timestamp refresh. Different text to the same target is a
distinct semantic edge and is added.

Graph lint: if this bundle declares a kind's 'links' vocabulary (see 'kinds --help') and --text
matches a declared type, the just-written link is checked against the actual source/target kinds;
a mismatch or a same-spelling-different-case near miss attaches a 'warnings' array to the success
envelope (exit 0 \u2014 the link is already written). An untyped --text (no declared match, any casing)
or a conventions-free bundle never warns.

Target-existence honesty (link add only, LOCAL bundles only): dangling links stay LEGAL \u2014 a link to
a target with no document yet is a forward-declaration, by design. When the target is absent at link
time, the success envelope attaches a 'warnings' array entry (code LINK_TARGET_ABSENT) so the receipt
tells the truth; a link to an existing target's receipt is unchanged. Checked only against a local
--dir bundle (confirming existence costs a read that would be an extra network round trip over
--remote), so a --remote link-add receipt never carries this signal.

Options:
  --text <t>           Link display text (default: the target id)
  --keep-timestamp     Preserve the source's existing timestamp (default: refresh to now,
                       since adding a cross-link is a meaningful change)
  --actor <name>       Attribute a newly-added link in the source doc and backend history.
                       Falls back to AGENTSTATE_LITE_ACTOR; an existing link remains a true no-op.
${LINK_COMMON_OPTIONS}

Examples:
  agentstate-lite link add tasks/review tasks/spec --text "depends on"
  agentstate-lite link show tasks/review
`;
var LINK_SHOW_USAGE = `agentstate-lite link show \u2014 show a concept's outbound links and derived backlinks

Usage:
  agentstate-lite link show <id> [--limit <n>] [--text <t>] [options]

Reports the concept's outbound links (core 'parseLinks') and its "cited by" backlinks (derived by
reversing the resolved link graph, never stored \u2014 core 'backlinks'), each row carrying the citing/
cited link's 'text' \u2014 the only relationship-type signal OKF's untyped edges carry.

Options:
  --text <t>           Filter outbound links AND backlinks to those whose text is EXACTLY <t>
                       (case-sensitive, not a substring match); empty/missing value is a usage
                       error. outbound_count/backlink_count report the FILTERED totals when set.
                       A filter that matches nothing is a valid empty result, not an error \u2014 its
                       help line names the distinct link texts that ARE present, so a near-miss
                       (typo/case) is visible.
  --limit <n>          Cap each of the outbound/backlink lists (default: 50; 0 = unlimited);
                       outbound_count/backlink_count always report the true (post-filter) totals
${LINK_COMMON_OPTIONS}

Examples:
  agentstate-lite link show tasks/review
  agentstate-lite link show tasks/review --text "depends on"
`;
var LINK_LIST_USAGE = `agentstate-lite link list \u2014 query the whole bundle's derived edge list, filtered

Usage:
  agentstate-lite link list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>] [options]

Queries the WHOLE bundle's derived edge list (the same edges 'link show' computes per-concept),
filtered \u2014 the atom a blast-radius/containment/ontology question reduces to. --from/--to each
accept a single concept id, a trailing-slash prefix ('tasks/' matches every id starting with that
literal string \u2014 one rule, no glob), or are repeatable for a union (OR) within that one flag;
giving BOTH --from and --to ANDs them. Dangling edges (a link to a doc that doesn't exist yet) are
included.

Options:
  --from <id|prefix/>  Restrict to edges whose source matches this id or prefix (repeatable \u2014
                       union/OR across repeats)
  --to <id|prefix/>    Restrict to edges whose target matches this id or prefix (repeatable \u2014
                       union/OR across repeats)
  --text <t>           Exact-match filter over the whole filtered edge set (same semantics as
                       'link show --text', scoped to --from/--to instead of one concept)
  --limit <n>          Cap the returned edge rows (default: 100; 0 = unlimited); count always
                       reports the true (post-filter) total
${LINK_COMMON_OPTIONS}

Examples:
  agentstate-lite link list --from tasks/
  agentstate-lite link list --to tasks/review --text "depends on"
`;
var LINK_ADD_MAX_ATTEMPTS = 5;
function docType(doc2) {
  return typeof doc2.frontmatter.type === "string" ? doc2.frontmatter.type : "";
}
async function lintLinkType(bundle, args) {
  const registry = await loadKinds(bundle);
  const declarations = collectLinkDeclarations(registry);
  if (declarations.size === 0) return [];
  const exact = declarations.get(args.text);
  if (exact && exact.length > 0) {
    let targetType;
    let targetResolved = true;
    try {
      targetType = docType(await readDoc(bundle, args.to));
    } catch (err) {
      if (err?.code === "ENOENT") {
        targetResolved = false;
      } else {
        throw classifyBundleError(err, args.remoteUrl);
      }
    }
    const matched = exact.find((d) => d.governs === args.sourceType) ?? exact[0];
    const sourceOk = exact.some((d) => d.governs === args.sourceType);
    const targetOk = !targetResolved || targetType === matched.target;
    if (!sourceOk || !targetOk) {
      return [
        {
          code: "LINK_TYPE_VIOLATION",
          message: `'${args.text}' is declared by '${matched.governs}' -> ${matched.target}; this link is ${args.sourceType || "(untyped)"} -> ${targetResolved ? targetType || "(untyped)" : "(unresolved)"}.`,
          field: "text",
          severity: "warning"
        }
      ];
    }
    return [];
  }
  for (const declaredText of declarations.keys()) {
    if (declaredText.toLowerCase() === args.text.toLowerCase()) {
      return [
        {
          code: "LINK_TYPE_CASE_VARIANT",
          message: `'${args.text}' is a case-variant of the declared link type '${declaredText}' \u2014 did you mean --text '${declaredText}'?`,
          field: "text",
          severity: "warning"
        }
      ];
    }
  }
  return [];
}
async function targetAbsentWarning(bundle, to, remoteUrl) {
  if (remoteUrl !== void 0) return void 0;
  try {
    await readDoc(bundle, to);
    return void 0;
  } catch (err) {
    if (err?.code !== "ENOENT") throw err;
    return {
      code: "LINK_TARGET_ABSENT",
      message: `target '${to}' has no document yet \u2014 this link is a forward-declaration (dangling links stay allowed); create it with \`${cliInvocation()} doc write ${to} --type <t>\`.`,
      field: "to",
      severity: "warning"
    };
  }
}
async function link(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "add") return linkAdd(rest, stdout);
  if (sub === "show") return linkShow(rest, stdout, deps.autoPull);
  if (sub === "list") return linkList(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(LINK_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown link subcommand: ${sub} (expected add|show|list)`, {
    help: `${cliInvocation()} link --help`
  });
}
function nearMissTextHint(textFilter, textsPresent, scope) {
  if (textsPresent.length === 0) {
    return `no links matched --text '${textFilter}'${scope} \u2014 this is a definitive empty result, not an error`;
  }
  const TEXTS_SHOWN = 8;
  const shown = textsPresent.slice(0, TEXTS_SHOWN).map((t) => `'${t}'`).join(", ");
  const more = textsPresent.length > TEXTS_SHOWN ? ` (+${textsPresent.length - TEXTS_SHOWN} more)` : "";
  return `no links matched --text '${textFilter}'${scope} (exact match) \u2014 link texts present here: ${shown}${more}`;
}
async function addLink(bundle, from, to, opts = {}) {
  const text = opts.text?.trim() || to;
  const href = relativeHref(from, to);
  const normalizedTo = resolveConceptId(from, href) ?? to.replace(/^\/+/, "").replace(/\.md$/, "");
  if (isReservedFile(pathFromConceptId(normalizedTo))) {
    throw new CliError(
      "USAGE",
      `'${to}' names a reserved OKF file (index.md/log.md), which is never a concept document and cannot be a link target`,
      { help: `${cliInvocation()} list` }
    );
  }
  let lastSource;
  let savedDoc;
  let sourceTypeAtWrite = "";
  try {
    const outcome = await versionedMutation({
      read: async () => {
        try {
          const { doc: doc2, version } = await readDocVersioned(bundle, from);
          return { state: doc2, version };
        } catch (err) {
          if (err?.code === "ENOENT") {
            throw new CliError("NOT_FOUND", `no source concept at id '${from}'`, {
              help: `${cliInvocation()} list`
            });
          }
          throw classifyBundleError(err, opts.remoteUrl);
        }
      },
      decide: (source) => {
        lastSource = source;
        const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo && l.text === text);
        if (already) return { action: "done", result: { changed: false } };
        const trimmed = source.body.replace(/\s*$/, "");
        const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})
`;
        const nextFrontmatter = { ...source.frontmatter };
        if (!opts.keepTimestamp) nextFrontmatter.timestamp = (/* @__PURE__ */ new Date()).toISOString();
        if (opts.actor !== void 0) nextFrontmatter.actor = opts.actor;
        sourceTypeAtWrite = docType(source);
        return {
          action: "write",
          next: { ...source, frontmatter: nextFrontmatter, body: nextBody },
          result: { changed: true }
        };
      },
      write: async (next, expectedVersion) => {
        try {
          const { doc: saved, version } = await writeDocVersioned(bundle, next, {
            expectedVersion,
            actor: opts.actor
          });
          savedDoc = saved;
          return version;
        } catch (err) {
          if (err instanceof VersionConflict) throw err;
          throw classifyBundleError(err, opts.remoteUrl);
        }
      },
      maxAttempts: LINK_ADD_MAX_ATTEMPTS
    });
    if (!outcome.wrote) {
      return { from: lastSource.id, normalizedTo, href, text, changed: false, version: outcome.version };
    }
    let warnings;
    try {
      warnings = await lintLinkType(bundle, {
        sourceType: sourceTypeAtWrite,
        text,
        to: normalizedTo,
        remoteUrl: opts.remoteUrl
      });
      const absent = await targetAbsentWarning(bundle, normalizedTo, opts.remoteUrl);
      if (absent) warnings.push(absent);
    } catch (err) {
      warnings = [
        {
          code: "LINK_LINT_UNAVAILABLE",
          message: `link was written, but link-metadata guidance was unavailable: ${err instanceof Error ? err.message : String(err)}`,
          field: "text",
          severity: "warning"
        }
      ];
    }
    return {
      from: savedDoc.id,
      normalizedTo,
      href,
      text,
      changed: true,
      version: outcome.version,
      warnings: warnings.length > 0 ? warnings : void 0
    };
  } catch (err) {
    if (err instanceof VersionConflict) {
      throw new CliError("STALE_HEAD", err.message, {
        help: `${cliInvocation()} link add ${from} ${to}`
      });
    }
    throw err;
  }
}
async function linkAdd(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs11({
      args: argv,
      options: {
        text: { type: "string" },
        "keep-timestamp": { type: "boolean" },
        actor: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "link add"
  );
  if (values.help) {
    stdout(LINK_ADD_USAGE);
    return;
  }
  const from = positionals[0]?.trim();
  const to = positionals[1]?.trim();
  if (!from || !to) {
    throw new CliError("USAGE", "link add requires <from> and <to> concept ids", {
      help: `${cliInvocation()} link add <from> <to>`
    });
  }
  const actor = resolveActor(values.actor, { help: `${cliInvocation()} link add ${from} ${to} --actor <name>` });
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const result = await addLink(bundle, from, to, {
    text: values.text,
    keepTimestamp: values["keep-timestamp"],
    remoteUrl: values.remote,
    actor
  });
  if (!result.changed) {
    stdout(
      render(
        {
          link: "exists",
          from: result.from,
          to: result.normalizedTo,
          changed: false,
          help: [`${cliInvocation()} link show ${result.normalizedTo}`]
        },
        mode
      )
    );
    return;
  }
  const receipt = {
    link: "added",
    from: result.from,
    to,
    href: result.href,
    text: result.text,
    changed: true,
    help: [`${cliInvocation()} link show ${to}`]
  };
  if (result.warnings && result.warnings.length > 0) receipt.warnings = result.warnings;
  stdout(render(receipt, mode));
}
async function linkShow(argv, stdout, autoPull) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs11({
      args: argv,
      options: {
        limit: { type: "string" },
        text: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "link show"
  );
  if (values.help) {
    stdout(LINK_SHOW_USAGE);
    return;
  }
  const DEFAULT_LIMIT4 = 50;
  let limit = DEFAULT_LIMIT4;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} link show <id> --limit 50`
      });
    }
    limit = Number(raw);
  }
  let textFilter;
  if (values.text !== void 0) {
    textFilter = values.text.trim();
    if (!textFilter) {
      throw new CliError("USAGE", "--text requires a non-empty value to filter on", {
        help: `${cliInvocation()} link show <id> --text <t>`
      });
    }
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "link show requires a concept <id>", {
      help: `${cliInvocation()} link show <id>`
    });
  }
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (autoPull ?? maybeAutoPull2)(values.dir);
  const bundle = await openBundle(values.dir, remote);
  let outbound = [];
  let exists2 = true;
  try {
    const source = await readDoc(bundle, id);
    outbound = parseLinks(bundle, source).map((l) => ({ to: l.to, text: l.text, href: l.href }));
  } catch (err) {
    if (err?.code !== "ENOENT") {
      throw classifyBundleError(err, values.remote);
    }
    exists2 = false;
  }
  const inbound = await backlinks(bundle, id);
  const textsPresent = textFilter === void 0 ? [] : [...new Set([...outbound, ...inbound].map((l) => l.text))].sort((a, b) => a.localeCompare(b));
  if (textFilter !== void 0) {
    outbound = outbound.filter((l) => l.text === textFilter);
  }
  const inboundMatched = textFilter !== void 0 ? inbound.filter((l) => l.text === textFilter) : inbound;
  const outboundShown = limit > 0 ? outbound.slice(0, limit) : outbound;
  const inboundShown = limit > 0 ? inboundMatched.slice(0, limit) : inboundMatched;
  const payload = {
    id,
    exists: exists2,
    outbound_count: outbound.length,
    outbound: outboundShown,
    backlink_count: inboundMatched.length,
    backlinks: inboundShown.map((l) => ({ from: l.from, text: l.text }))
  };
  if (textFilter !== void 0) payload.text_filter = textFilter;
  const help = [];
  if (outboundShown.length < outbound.length || inboundShown.length < inboundMatched.length) {
    help.push(
      `showing ${outboundShown.length}/${outbound.length} outbound + ${inboundShown.length}/${inboundMatched.length} backlinks \u2014 run \`${cliInvocation()} link show ${id} --limit 0\` for all`
    );
  }
  if (textFilter !== void 0 && outbound.length === 0 && inboundMatched.length === 0) {
    if (textsPresent.length > 0 || exists2) {
      help.push(nearMissTextHint(textFilter, textsPresent, " in either direction"));
    }
  }
  if (!exists2) {
    help.push(
      inboundMatched.length > 0 ? `'${id}' has no document yet but is cited by ${inboundMatched.length} \u2014 run \`${cliInvocation()} doc write ${id} --type <t>\` to create it` : `no concept at '${id}': it has no document and nothing links to it${textFilter !== void 0 ? ` matching --text '${textFilter}'` : ""}`
    );
  }
  if (help.length > 0) payload.help = help;
  stdout(render(payload, resolveMode(values)));
}
async function linkList(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs11({
      args: argv,
      options: {
        from: { type: "string", multiple: true },
        to: { type: "string", multiple: true },
        text: { type: "string" },
        limit: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "link list"
  );
  if (values.help) {
    stdout(LINK_LIST_USAGE);
    return;
  }
  let textFilter;
  if (values.text !== void 0) {
    textFilter = values.text.trim();
    if (!textFilter) {
      throw new CliError("USAGE", "--text requires a non-empty value to filter on", {
        help: `${cliInvocation()} link list --text <t>`
      });
    }
  }
  const fromValues = (values.from ?? []).map((v) => v.trim());
  if (fromValues.some((v) => v === "")) {
    throw new CliError("USAGE", "--from requires a non-empty id or prefix (got an empty/blank value)", {
      help: `${cliInvocation()} link list --from <id|prefix/>`
    });
  }
  const toValues = (values.to ?? []).map((v) => v.trim());
  if (toValues.some((v) => v === "")) {
    throw new CliError("USAGE", "--to requires a non-empty id or prefix (got an empty/blank value)", {
      help: `${cliInvocation()} link list --to <id|prefix/>`
    });
  }
  const DEFAULT_LIMIT4 = 100;
  let limit = DEFAULT_LIMIT4;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} link list --limit 100`
      });
    }
    limit = Number(raw);
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const scopeFilter = {};
  if (fromValues.length > 0) scopeFilter.from = fromValues;
  if (toValues.length > 0) scopeFilter.to = toValues;
  let scopedEdges;
  try {
    scopedEdges = await queryEdges(bundle, scopeFilter);
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const edges = textFilter !== void 0 ? scopedEdges.filter((e) => e.text === textFilter) : scopedEdges;
  const rows = edges.map((e) => ({ from: e.from, to: e.to, text: e.text }));
  const total = rows.length;
  const shownRows = limit > 0 ? rows.slice(0, limit) : rows;
  const truncated = shownRows.length < total;
  const out = { count: total, edges: shownRows };
  if (truncated) out.shown = shownRows.length;
  const help = [];
  if (truncated) {
    help.push(
      `showing ${shownRows.length} of ${total} \u2014 run \`${cliInvocation()} link list --limit 0\` (or a higher --limit) for all`
    );
  }
  if (textFilter !== void 0 && total === 0) {
    const textsPresent = [...new Set(scopedEdges.map((e) => e.text))].sort((a, b) => a.localeCompare(b));
    help.push(nearMissTextHint(textFilter, textsPresent, ""));
  }
  if (help.length > 0) out.help = help;
  stdout(render(out, resolveMode(values)));
}

// src/commands/list.ts
import { parseArgs as parseArgs12 } from "node:util";
var LIST_USAGE = `agentstate-lite list \u2014 query concepts over their frontmatter (alias: query)

Usage:
  agentstate-lite list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--fields <a,b>] [--open] [--limit <n>] [--dir <path>]

Options:
  --type <t>           Restrict to concepts whose frontmatter type equals this
  --tag <t>            Restrict to concepts carrying this tag (repeatable; ALL must match)
  --field <k=v>        Restrict to concepts whose frontmatter field k equals v (repeatable; ALL
                       flags/fields are ANDed). A COMMA in v is SET MEMBERSHIP (OR): --field
                       status=todo,in_progress matches EITHER value on that one field. Array fields
                       still match on membership; values are string-coerced (so an unquoted YAML
                       number like priority: 1 matches --field priority=1). Comma is therefore the
                       set separator \u2014 a literal comma inside one value can no longer be expressed
                       via --field (ids/enum values don't carry commas in practice); an empty member
                       (--field status=todo,,done) is a USAGE error.
  --prefix <p>         Restrict to concept ids starting with this bundle-relative prefix
  --fields <a,b,...>   Add extra frontmatter fields to each row (comma-separated; default schema is
                       id,type,title,timestamp). ALWAYS overrides kind-aware columns below. Each cell
                       is truncated to 80 chars \u2014 long content lives in \`doc read <id>\`.
  --open               Exclude concepts whose OWN kind declares a terminal set of field values
                       (see 'kinds --help') and whose frontmatter currently matches it (e.g. a Task
                       whose status is 'done'/'canceled', if the Task kind declares that terminal
                       set). Purely declaration-driven: an ungoverned type, a governed type with no
                       terminal declaration, or a doc missing the field are all INCLUDED. On a
                       bundle where NO kind declares a terminal set, --open filters nothing (a help
                       line says so, so the flag is never silently meaningless). Composes with
                       --type/--field/--prefix.
  --limit <n>          Cap the number of rows returned (default: 100; 0 = unlimited). A truncated
                       result reports \`shown\` alongside the total \`count\`.
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; remote access is always explicit)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help

A --type-scoped query of a kind-governed type projects that kind's declared fields as columns
({id, title, ...fields}) instead of the minimal schema; --fields overrides. An unscoped query, or a
query of an ungoverned type, always keeps the minimal {id,type,title,timestamp} schema.
`;
async function list(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs12({
      args: argv,
      options: {
        type: { type: "string" },
        tag: { type: "string", multiple: true },
        field: { type: "string", multiple: true },
        prefix: { type: "string" },
        fields: { type: "string" },
        open: { type: "boolean" },
        limit: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "list"
  );
  if (values.help) {
    stdout(LIST_USAGE);
    return;
  }
  const filter = {};
  if (values.type?.trim()) filter.type = values.type.trim();
  if (values.tag && values.tag.length > 0) filter.tags = values.tag;
  if (values.prefix?.trim()) filter.prefix = values.prefix.trim();
  const singleFields = {};
  const orFieldSets = {};
  if (values.field && values.field.length > 0) {
    for (const entry of values.field) {
      const eq = entry.indexOf("=");
      const key = eq >= 0 ? entry.slice(0, eq).trim() : "";
      if (eq < 0 || key === "") {
        throw new CliError("USAGE", `--field expects key=value (got '${entry}')`, {
          help: `${cliInvocation()} list --field status=done`
        });
      }
      const rawValue = entry.slice(eq + 1);
      const members = rawValue.split(",");
      if (members.some((m) => m === "")) {
        if (!rawValue.includes(",")) {
          throw new CliError(
            "USAGE",
            `--field ${key} has an empty value \u2014 expected --field ${key}=<value>, or comma-separated set membership --field ${key}=a,b`,
            { help: `${cliInvocation()} list --field status=done` }
          );
        }
        throw new CliError(
          "USAGE",
          `--field ${key} has an empty member in '${rawValue}' (comma is the set-membership separator \u2014 use 'a,b', not 'a,,b' or a leading/trailing comma)`,
          { help: `${cliInvocation()} list --field status=todo,in_progress` }
        );
      }
      if (members.length > 1) {
        orFieldSets[key] = members;
        delete singleFields[key];
      } else {
        singleFields[key] = rawValue;
        delete orFieldSets[key];
      }
    }
    if (Object.keys(singleFields).length > 0) filter.fields = singleFields;
  }
  const DEFAULT_LIMIT4 = 100;
  let limit = DEFAULT_LIMIT4;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)", {
        help: `${cliInvocation()} list --limit 100`
      });
    }
    limit = Number(raw);
  }
  const DEFAULT_KEYS = /* @__PURE__ */ new Set(["id", "type", "title", "timestamp"]);
  const extraFields = (values.fields?.trim() ? values.fields.split(",") : []).map((f) => f.trim()).filter((f) => f && !DEFAULT_KEYS.has(f));
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (deps.autoPull ?? maybeAutoPull2)(values.dir);
  const bundle = await openBundle(values.dir, remote);
  const skipped = [];
  let docs = await queryHeads(bundle, filter, { onSkip: (s) => skipped.push(s) });
  let registryCache;
  const getRegistry = async () => {
    registryCache ??= await loadKinds(bundle);
    return registryCache;
  };
  for (const [field, members] of Object.entries(orFieldSets)) {
    docs = docs.filter((d) => members.some((m) => matchesFilter(d, { fields: { [field]: m } })));
  }
  let openNoopReason;
  if (values.open) {
    const registry = await getRegistry();
    const anyTerminalDeclared = [...registry.kinds.values()].some(
      (k) => Object.keys(k.fields.terminal).length > 0
    );
    if (!anyTerminalDeclared) {
      openNoopReason = "no kind declares terminal values \u2014 --open filtered nothing";
    } else {
      docs = docs.filter((d) => {
        const kind2 = registry.kinds.get(typeof d.frontmatter.type === "string" ? d.frontmatter.type : "");
        if (!kind2) return true;
        return !isTerminal(kind2, d.frontmatter);
      });
    }
  }
  const COLUMN_CELL_CAP = 80;
  const cell = (v) => {
    if (v === void 0 || v === null) return "";
    const s = Array.isArray(v) ? v.join(",") : v;
    return typeof s === "string" && s.length > COLUMN_CELL_CAP ? s.slice(0, COLUMN_CELL_CAP) + "\u2026" : s;
  };
  const projectMinimal = (d) => {
    const row2 = {
      id: d.id,
      type: typeof d.frontmatter.type === "string" ? d.frontmatter.type : "",
      title: typeof d.frontmatter.title === "string" ? d.frontmatter.title : d.id.split("/").pop() ?? d.id,
      timestamp: typeof d.frontmatter.timestamp === "string" ? d.frontmatter.timestamp : ""
    };
    for (const f of extraFields) row2[f] = cell(d.frontmatter[f]);
    return row2;
  };
  const fieldsFlagGiven = values.fields !== void 0;
  let kindCols;
  if (!fieldsFlagGiven && filter.type && docs.length > 0) {
    const registry = await getRegistry();
    const kind2 = registry.kinds.get(filter.type);
    if (kind2) {
      const cols = [.../* @__PURE__ */ new Set([...kind2.fields.required, ...kind2.fields.optional])].filter(
        (f) => f !== "id" && f !== "title" && f !== "description"
      );
      if (cols.length > 0) kindCols = cols;
    }
  }
  const rows = kindCols ? docs.map((d) => {
    const fm = d.frontmatter;
    const row2 = {
      id: d.id,
      title: typeof fm.title === "string" ? fm.title : d.id.split("/").pop() ?? d.id
    };
    for (const c of kindCols) row2[c] = cell(fm[c]);
    return row2;
  }) : docs.map(projectMinimal);
  const total = rows.length;
  const shownRows = limit > 0 ? rows.slice(0, limit) : rows;
  const truncated = shownRows.length < total;
  const out = { count: total, docs: shownRows };
  if (truncated) out.shown = shownRows.length;
  const help = [];
  if (truncated) {
    help.push(
      `showing ${shownRows.length} of ${total} \u2014 run \`${cliInvocation()} list --limit 0\` (or a higher --limit) for all`
    );
  }
  if (skipped.length > 0) {
    out.skipped = skipped;
    help.push(
      `${skipped.length} document(s) skipped (unparseable frontmatter) \u2014 run \`${cliInvocation()} doc read <id>\` for the full error, then fix the YAML`
    );
  }
  if (openNoopReason) help.push(openNoopReason);
  if (!kindCols && !fieldsFlagGiven && !filter.type && docs.length > 0) {
    const first = docs[0].frontmatter.type;
    const uniformType = typeof first === "string" && first !== "" && docs.every((d) => d.frontmatter.type === first);
    if (uniformType) {
      const registry = await getRegistry();
      const kind2 = registry.kinds.get(first);
      if (kind2) {
        const cols = [.../* @__PURE__ */ new Set([...kind2.fields.required, ...kind2.fields.optional])].filter(
          (f) => f !== "id" && f !== "title" && f !== "description"
        );
        if (cols.length > 0) {
          const typeArg = /\s/.test(first) ? `"${first}"` : first;
          help.push(
            `all ${total} rows are '${first}' \u2014 \`${cliInvocation()} list --type ${typeArg}\` projects its ${cols.join("/")} columns`
          );
        }
      }
    }
  }
  if (total > 0) {
    help.push(`${cliInvocation()} doc read <id>`, `${cliInvocation()} link show <id>`);
  }
  if (help.length > 0) out.help = help;
  stdout(render(out, resolveMode(values)));
}

// src/commands/new.ts
import { parseArgs as parseArgs13 } from "node:util";
import { promises as fs10 } from "node:fs";
var NEW_USAGE = `agentstate-lite new \u2014 create a new instance of a bundle-declared kind

Usage:
  agentstate-lite new "<Kind>" <id> --<field> <value> [--<field> <value> ...] [--body-file <path>] [options]

The kind must be declared by a kind convention doc under conventions/ \u2014 run 'agentstate-lite kinds'
to list what a bundle declares. Supply each of the kind's required fields via --<field> <value>
(or --<field>=<value>); declared optional fields may be supplied the same way. Repeat a flag to
set an array value (e.g. --tags a --tags b). Any field not declared by the kind is a USAGE error.
The kind's declared body 'sections' (if any) are scaffolded as empty '# Heading' blocks; its
'path' prefix (if any) is prepended onto <id> unless <id> already carries it. Validation is
STRICT: a missing required field or a disallowed enum value rejects the write (exit 2) rather
than writing-with-a-warning.

'new' is CREATE-ONLY: if the (prefixed) <id> already carries a document, the write is rejected
(exit 5) instead of silently replacing it \u2014 run 'doc update' to patch an existing doc, or 'doc
write' to overwrite it outright and deliberately.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --actor <name>         Attribute this write: persisted as the doc's own 'actor' frontmatter field
                         (the per-doc attribution sync and its receipts read) and recorded in version
                         history by a persisting backend. Precedence: --actor >
                         AGENTSTATE_LITE_ACTOR > absent. A present-but-blank flag or environment
                         value is a USAGE error (exit 2).
  --body-file <path>   Read the initial Markdown body from a local file. When omitted, scaffold
                       the kind's declared sections as empty '# Heading' blocks. The supplied body
                       is validated strictly against those declared sections before anything is
                       written. This is a byte-ingress convenience; the bundle still stores an
                       ordinary OKF Markdown document.
  --link "<type>=<target-id>"
                         Repeatable. After the doc is created, add an outbound cross-link of this
                         TYPE to the given target id \u2014 through the exact same idempotent path
                         'link add --text "<type>"' uses (relative bundle-relative href; a
                         dangling target, i.e. one with no document yet, is allowed, same as
                         'link add'). A type not in this kind's declared 'links' vocabulary warns
                         but still adds the link (teach, never block). A malformed value (missing
                         '=', empty type, or empty target) is a USAGE error (exit 2) \u2014 checked
                         BEFORE the doc is written, so a malformed --link creates nothing. If a
                         link fails AFTER the doc was created (e.g. a reserved-file target), the
                         doc is NOT rolled back: the receipt's 'links' array names which entries
                         failed and the command exits non-zero.
  --no-prefix           Use <id> verbatim \u2014 do NOT auto-prepend the kind's declared path prefix
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function setOwn2(record, key, value) {
  Object.defineProperty(record, key, { value, enumerable: true, configurable: true, writable: true });
}
function hasOwn2(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}
var NEW_CONTROL_OPTIONS = {
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  link: { type: "string", multiple: true },
  "body-file": { type: "string" },
  "no-prefix": { type: "boolean" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" }
};
function resolveInstanceId(kind2, id) {
  if (!kind2.path) return id;
  const prefix = kind2.path.replace(/\/+$/, "") + "/";
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
}
function parseLinkFlagValue(raw) {
  const eq = raw.indexOf("=");
  if (eq < 0) {
    throw new CliError("USAGE", `--link value '${raw}' is missing '=' \u2014 expected the form "<type>=<target-id>"`, {
      help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"`
    });
  }
  const type = raw.slice(0, eq).trim();
  const target = raw.slice(eq + 1).trim();
  if (!type) {
    throw new CliError(
      "USAGE",
      `--link value '${raw}' has an empty link type \u2014 expected the form "<type>=<target-id>"`,
      { help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"` }
    );
  }
  if (!target) {
    throw new CliError(
      "USAGE",
      `--link value '${raw}' has an empty target id \u2014 expected the form "<type>=<target-id>"`,
      { help: `${cliInvocation()} new "<Kind>" <id> --link "<type>=<target-id>"` }
    );
  }
  return { type, target };
}
function controlFlagValue(val, flag) {
  if (typeof val === "boolean") {
    throw new CliError("USAGE", `--${flag} requires a value`, {
      help: `${cliInvocation()} new "<Kind>" <id> --${flag} <value>`
    });
  }
  return val;
}
function inboundLinkDecls(registry, kind2) {
  const inbound = [];
  for (const source of registry.kinds.values()) {
    if (source.governs === kind2.governs) continue;
    for (const [linkType, target] of Object.entries(source.links ?? {})) {
      if (target === kind2.governs) inbound.push({ source, linkType });
    }
  }
  return inbound.sort(
    (a, b) => a.source.governs.localeCompare(b.source.governs) || a.linkType.localeCompare(b.linkType)
  );
}
function kindIdPlaceholder(kind2, governs) {
  const slug = governs.toLowerCase().replace(/\s+/g, "-");
  const prefix = kind2?.path ? kind2.path.replace(/\/+$/, "") + "/" : "";
  return `${prefix}<${slug}>`;
}
function renderKindHelp(kind2, registry, inv) {
  const oneLine = (value) => value.trim().replace(/\s+/g, " ");
  const ownDescription = (record, key) => {
    if (!record || !hasOwn2(record, key) || typeof record[key] !== "string") return void 0;
    const description = oneLine(record[key]);
    return description === "" ? void 0 : description;
  };
  const ordinary = (field) => field !== "actor" && field !== "link";
  const req = [...new Set(kind2.fields.required.filter(ordinary))];
  const required = new Set(req);
  const opt = [...new Set(kind2.fields.optional.filter((field) => ordinary(field) && !required.has(field)))];
  const fieldRows = [
    ...req.map((field) => ({ field, requirement: "required" })),
    ...opt.map((field) => ({ field, requirement: "optional" }))
  ].map(({ field, requirement }) => {
    const allowed = hasOwn2(kind2.fields.values, field) && Array.isArray(kind2.fields.values[field]) ? kind2.fields.values[field] : void 0;
    const description = ownDescription(kind2.fields.descriptions, field);
    const descriptionsByValue = kind2.fields.valueDescriptions;
    const valueDescriptions = descriptionsByValue && hasOwn2(descriptionsByValue, field) ? descriptionsByValue[field] : void 0;
    const describedValues = allowed?.map((value) => ({ value, description: ownDescription(valueDescriptions, value) }));
    const hasValueDescriptions = describedValues?.some((entry) => entry.description !== void 0) ?? false;
    const fieldLine = `  --${field} <v>  ${requirement}`;
    if (!allowed || allowed.length === 0) return fieldLine + (description ? ` \u2014 ${description}` : "");
    if (!hasValueDescriptions) {
      return `${fieldLine}; allowed: ${allowed.join(" | ")}` + (description ? ` \u2014 ${description}` : "");
    }
    const valueRows = describedValues.flatMap((entry) => [
      `      - value: ${JSON.stringify(entry.value)}`,
      ...entry.description ? [`        description: ${JSON.stringify(entry.description)}`] : []
    ]);
    return fieldLine + (description ? ` \u2014 ${description}` : "") + "\n    allowed values:\n" + valueRows.join("\n");
  });
  const sectionLines = kind2.sections && kind2.sections.length > 0 ? kind2.sections.map((section) => `  # ${section}`).join("\n") : "  (none)";
  const pathLine = kind2.path ? `Id:  auto-prefixed with '${kind2.path.replace(/\/+$/, "")}/' unless <id> already carries it` : "Id:  used as-is (this kind declares no path prefix)";
  const outboundLines = Object.entries(kind2.links ?? {}).map(([t, target]) => {
    const description = ownDescription(kind2.linkDescriptions, t);
    return `  this kind may link:     "${t}" \u2192 ${target}${description ? ` \u2014 ${description}` : ""}`;
  });
  const inboundLines = inboundLinkDecls(registry, kind2).map(({ source, linkType }) => {
    const description = ownDescription(source.linkDescriptions, linkType);
    return `  other kinds link here:  ${source.governs} "${linkType}" \u2192 ${kind2.governs}` + (description ? ` \u2014 ${description}` : "");
  });
  const linksBlock = outboundLines.length + inboundLines.length > 0 ? `Links (typed edges declared by this bundle's conventions; write with --link "<type>=<target-id>" at create time, or link add --text "<type>" after the fact):
` + [...outboundLines, ...inboundLines].join("\n") + "\n" : "";
  return `${inv} new "${kind2.governs}" <id> \u2014 create a ${kind2.governs} instance

` + (kind2.description ? `Description:  ${kind2.description}
` : "") + `Fields (declared by the '${kind2.governs}' kind convention):
` + (fieldRows.length > 0 ? fieldRows.join("\n") + "\n" : "  (none)\n") + `Required body headings (level 1; exact Markdown):
${sectionLines}
` + linksBlock + `${pathLine}

Repeat a flag to set an array value (e.g. --tag a --tag b). Validation is STRICT.
To ADD a field to this kind, edit its convention doc (${inv} kinds names it; then pull \u2192 edit fields.optional \u2192 promote).

Options:
  --actor <name>   Attribute the write (overrides AGENTSTATE_LITE_ACTOR)
  --body-file <path>
                   Read the complete initial Markdown body from a local file; when omitted,
                   scaffold the declared body sections
  --link "<type>=<target-id>"
                   Repeatable: after creating this instance, add an outbound link of type
                   <type> to <target-id> (same idempotent path as 'link add'; a dangling
                   target is allowed)
  --no-prefix      Use <id> verbatim (skip the auto path prefix above)
  --dir <path>     Bundle directory (default: discovered from the cwd)
  --remote <url>   Talk to a wire-protocol server instead of a local bundle
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;
}
async function newCommand(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const pre = parseOrUsage(
    () => parseArgs13({ args: argv, strict: false, allowPositionals: true, options: NEW_CONTROL_OPTIONS }),
    "new"
  );
  const kindName = pre.positionals[0]?.trim();
  if (pre.values.help && !kindName) {
    stdout(NEW_USAGE);
    return;
  }
  if (!kindName) {
    throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
      help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`
    });
  }
  const preDir = controlFlagValue(pre.values.dir, "dir");
  const preRemote = controlFlagValue(pre.values.remote, "remote");
  let bundle;
  try {
    bundle = await openBundle(preDir, await resolveRemoteFlag(preRemote, preDir));
  } catch (err) {
    if (pre.values.help) {
      stdout(NEW_USAGE);
      return;
    }
    throw err;
  }
  const registry = await loadKinds(bundle);
  const kind2 = registry.kinds.get(kindName);
  if (!kind2) {
    if (pre.values.help) {
      stdout(NEW_USAGE);
      return;
    }
    const known = [...registry.kinds.keys()].sort();
    throw new CliError(
      "USAGE",
      known.length > 0 ? `unknown kind '${kindName}' (declared: ${known.join(", ")})` : `unknown kind '${kindName}' (no kinds declared in this bundle)`,
      { help: `${cliInvocation()} kinds` }
    );
  }
  if (pre.values.help) {
    stdout(renderKindHelp(kind2, registry, cliInvocation()));
    return;
  }
  const declaredFields = [...kind2.fields.required, ...kind2.fields.optional];
  const fieldNames = declaredFields.filter((f) => f !== "actor" && f !== "link");
  const fieldOptions = Object.fromEntries(
    fieldNames.map((f) => [f, { type: "string", multiple: true }])
  );
  const { values, positionals, tokens } = parseOrUsage(() => {
    try {
      return parseArgs13({
        args: argv,
        allowPositionals: true,
        strict: true,
        tokens: true,
        options: { ...fieldOptions, ...NEW_CONTROL_OPTIONS }
      });
    } catch (err) {
      if (err?.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
        const raw = /'([^']+)'/.exec(err.message)?.[1] ?? "";
        const field = raw.replace(/^--?/, "");
        if (field === "body") {
          throw new CliError(
            "USAGE",
            `'new' does not take --body \u2014 pass substantial initial Markdown with --body-file <path>, or omit it to scaffold the kind's declared sections as empty '# Heading' blocks.`,
            { help: `${cliInvocation()} new "${kindName}" <id>` }
          );
        }
        throw new CliError(
          "USAGE",
          `unknown field(s) for kind '${kind2.governs}': ${field}` + (declaredFields.length > 0 ? ` (declared: ${declaredFields.join(", ")})` : " (this kind declares no fields)") + ` \u2014 to ADD it to the '${kind2.governs}' kind: \`${cliInvocation()} kind field "${kind2.governs}" add ${field}\` (then re-run).`,
          { help: `${cliInvocation()} kinds` }
        );
      }
      throw err;
    }
  }, "new");
  const dynamicValues = /* @__PURE__ */ new Map();
  const dynamicFieldNames = new Set(fieldNames);
  for (const token of tokens) {
    if (token.kind !== "option" || !dynamicFieldNames.has(token.name) || token.value === void 0) continue;
    const accumulated = dynamicValues.get(token.name) ?? [];
    accumulated.push(token.value);
    dynamicValues.set(token.name, accumulated);
  }
  const id = positionals[1]?.trim();
  if (!id) {
    throw new CliError("USAGE", 'new requires "<Kind>" and <id> positionals', {
      help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>`
    });
  }
  if (positionals.length > 2) {
    throw new CliError(
      "USAGE",
      `new takes exactly "<Kind>" and <id>, got ${positionals.length} positionals: ${positionals.join(", ")}`,
      { help: `${cliInvocation()} new "<Kind>" <id> --<field> <value>` }
    );
  }
  const actor = resolveActor(values.actor, {
    help: `${cliInvocation()} new "<Kind>" <id> --actor <name>`
  });
  const linkFlags = values.link ?? [];
  const parsedLinks = linkFlags.map(parseLinkFlagValue);
  const bodyFile = values["body-file"];
  let suppliedBody;
  if (bodyFile !== void 0) {
    if (bodyFile.trim() === "") {
      throw new CliError("USAGE", "--body-file requires a non-empty path", {
        help: `${cliInvocation()} new "${kindName}" <id> --body-file <path>`
      });
    }
    try {
      suppliedBody = await fs10.readFile(bodyFile, "utf8");
    } catch (err) {
      throw new CliError(
        "USAGE",
        `could not read --body-file ${JSON.stringify(bodyFile)}: ${err instanceof Error ? err.message : String(err)}`,
        { help: `${cliInvocation()} new "${kindName}" <id> --body-file <path>` }
      );
    }
  }
  const frontmatter = { type: kind2.governs };
  for (const field of fieldNames) {
    const vals = dynamicValues.get(field);
    if (vals === void 0 || vals.length === 0) continue;
    setOwn2(frontmatter, field, vals.length === 1 ? vals[0] : vals);
  }
  const body = suppliedBody ?? (kind2.sections ?? []).map((heading) => `# ${heading}
`).join("\n");
  const targetId = values["no-prefix"] ? id : resolveInstanceId(kind2, id);
  const remote = values.remote;
  const result = await mutateDoc({
    bundle,
    id: targetId,
    mode: "create-only",
    registry,
    remoteUrl: remote,
    strict: true,
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor,
    persistActor: true,
    // Board self-attribution (PR C): fires only after the expect-absent CAS create persisted.
    onPersisted: boardPostPersistHook(bundle, actor),
    buildCandidate: () => ({ frontmatter, body }),
    errors: {
      alreadyExists: () => new CliError(
        "ALREADY_EXISTS",
        `'${targetId}' already exists \u2014 'new' only creates fresh instances of a kind and refuses to silently overwrite one. Run '${cliInvocation()} doc update ${targetId}' to patch it, or '${cliInvocation()} doc write ${targetId} --type ${kind2.governs}' to overwrite it outright and deliberately.`,
        { help: `${cliInvocation()} doc update ${targetId}` }
      )
    }
  });
  const saved = result.doc;
  const receipt = {
    new: "written",
    kind: kind2.governs,
    id: saved.id,
    type: saved.frontmatter.type,
    timestamp: saved.frontmatter.timestamp ?? null
  };
  const conventionWarningPrefix = `kind convention '${kind2.id}'`;
  const conventionWarnings = registry.warnings.filter(
    (warning) => warning.message.startsWith(conventionWarningPrefix)
  );
  if (conventionWarnings.length > 0) receipt.warnings = conventionWarnings;
  if (targetId !== id) {
    receipt.note = `id prefixed with the '${kind2.governs}' kind's path \u2192 '${targetId}' (you passed '${id}')`;
  }
  const linkResults = [];
  const satisfiedOutboundTypes = /* @__PURE__ */ new Set();
  let finalVersion = result.version;
  let firstLinkFailure;
  for (const { type, target } of parsedLinks) {
    const warnings = [];
    if (kind2.links && Object.keys(kind2.links).length > 0 && !hasOwn2(kind2.links, type)) {
      warnings.push({
        code: "LINK_TYPE_UNDECLARED_FOR_KIND",
        message: `'${type}' is not declared in the '${kind2.governs}' kind's link vocabulary (declared: ${Object.keys(kind2.links).join(", ")}) \u2014 added anyway.`,
        field: "text",
        severity: "warning"
      });
    }
    try {
      const added = await addLink(bundle, saved.id, target, { text: type, remoteUrl: remote, actor });
      finalVersion = added.version;
      if (added.warnings) warnings.push(...added.warnings);
      linkResults.push({
        type,
        target,
        changed: added.changed,
        href: added.href,
        ...warnings.length > 0 ? { warnings } : {}
      });
      satisfiedOutboundTypes.add(type);
    } catch (err) {
      const classified = classifyBundleError(err, remote);
      linkResults.push({
        type,
        target,
        error: { code: classified.code, message: classified.message },
        ...warnings.length > 0 ? { warnings } : {}
      });
      if (!firstLinkFailure) firstLinkFailure = classified;
    }
  }
  if (parsedLinks.length > 0) receipt.links = linkResults;
  receipt.version = finalVersion;
  if (isLegacyPageDoc(saved.frontmatter)) receipt.hint = LEGACY_PAGE_TYPE_HINT;
  const help = [`${cliInvocation()} doc read ${saved.id}`];
  const HINTS_PER_DIRECTION = 3;
  for (const { source, linkType } of inboundLinkDecls(registry, kind2).slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link from a ${source.governs}: ${cliInvocation()} link add ${kindIdPlaceholder(source, source.governs)} ${saved.id} --text "${linkType}"`
    );
  }
  const outboundLinkDecls = Object.entries(kind2.links ?? {}).filter(([linkType]) => !satisfiedOutboundTypes.has(linkType));
  for (const [linkType, target] of outboundLinkDecls.slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link to a ${target}: ${cliInvocation()} link add ${saved.id} ${kindIdPlaceholder(registry.kinds.get(target), target)} --text "${linkType}"`
    );
  }
  receipt.help = help;
  stdout(render(receipt, resolveMode({ json: Boolean(values.json) })));
  if (firstLinkFailure) {
    const failedCount = linkResults.filter((r) => r.error).length;
    throw asHandled(
      new CliError(
        firstLinkFailure.code,
        `'${saved.id}' was created, but ${failedCount} of ${parsedLinks.length} --link ${parsedLinks.length === 1 ? "entry" : "entries"} failed \u2014 see 'links' in the receipt above for details`,
        { help: firstLinkFailure.help }
      )
    );
  }
}

// src/commands/kinds.ts
import { parseArgs as parseArgs14 } from "node:util";
var KINDS_USAGE = `agentstate-lite kinds \u2014 list the kind conventions declared by this bundle

Usage:
  agentstate-lite kinds [--dir <path>] [--remote <url>]

A kind convention is a plain OKF doc (type: Convention) under conventions/ declaring a document
kind's purpose, required/optional fields and their descriptions, allowed enum values, typed-link vocabulary, expected body
sections, and an optional freshness horizon. See 'agentstate-lite new --help' to create an
instance of a declared kind.

Declaring a kind convention (frontmatter keys core reads \u2014 everything else is unread prose):
  governs              string   required \u2014 the 'type' value this convention governs
  title                string   optional \u2014 display title (defaults to governs)
  description          string   optional \u2014 the kind's purpose and intended use
  path                 string   optional \u2014 bundle-relative path prefix for instances
  fields.required      list     field names an instance MUST carry
  fields.optional      list     field names an instance MAY carry
  fields.descriptions  map      field name -> human guidance for a declared field
  fields.values        map      field name -> list of allowed values \u2014 the ONLY place an enum
                                 constraint goes; never a top-level enum/enums/values/constraints key
  fields.value_descriptions
                        map      enum field -> allowed value -> human guidance. Guidance only; it
                                 does not add transitions, guards, aliases, or validation behavior
  fields.terminal      map      field name -> subset of that field's values marking an instance
                                 "done" (e.g. status: [done, canceled]). A field named here SHOULD
                                 also be declared in fields.values (a coherence warning otherwise);
                                 a value named here that isn't one of that field's allowed values
                                 also warns. Drives 'list --open' (excludes terminal instances) and
                                 the 'status' command's missing_expected_links sweep (excludes them
                                 from the count/rows and its sort)
  links                map      link type name -> allowed TARGET kind, for typed edges instances
                                 of this kind may carry as link SOURCE (e.g. contains: Task). A
                                 link whose display text exactly matches a declared type is a
                                 typed edge; every other link is an untyped citation. Write typed
                                 edges with 'link add <from> <to> --text <type>' and query them
                                 with 'link show <id> --text <type>'
  link_descriptions    map      link type name -> human guidance for a relationship declared in
                                 this kind's links map. Guidance only; it adds no link requirement
                                 or graph-validation behavior
  expects_inbound      map      link type name -> expected SOURCE kind, declared on the kind the
                                 expectation is ABOUT (the link TARGET) \u2014 e.g. a 'Task' declaring
                                 {contains: "Roadmap Item"} expects every Task to have an inbound
                                 'contains' edge from a Roadmap Item. Drives the 'status' command's
                                 missing_expected_links lint; 'link add' also warns on a
                                 type-mismatched edge against any declared 'links'/'expects_inbound'
                                 vocabulary. Write-time is never blocked by this key.
  sections             list     expected body-section names; 'kinds' preserves these names in its
                                 sections output and also emits required_headings with the exact
                                 level-1 Markdown syntax (for example '# Requested decision')
  freshness_horizon    string   '<n>(m|h|d)', e.g. 24h, 30d, 15m
A misshaped or misplaced key here is a non-fatal registry warning (visible in 'kinds'/'status'
output), never a silent no-op. See 'agentstate-lite doc read conventions/context-note' on any
--init'd bundle for a full worked example with a values: enum and sections:.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function toRow(kind2) {
  const row2 = {
    governs: kind2.governs,
    required: kind2.fields.required,
    optional: kind2.fields.optional
  };
  if (kind2.description) row2.description = kind2.description;
  if (Object.keys(kind2.fields.descriptions).length > 0) row2.descriptions = kind2.fields.descriptions;
  if (Object.keys(kind2.fields.values).length > 0) row2.values = kind2.fields.values;
  if (Object.keys(kind2.fields.valueDescriptions ?? {}).length > 0) {
    row2.value_descriptions = kind2.fields.valueDescriptions;
  }
  if (Object.keys(kind2.fields.terminal).length > 0) row2.terminal = kind2.fields.terminal;
  if (kind2.links && Object.keys(kind2.links).length > 0) row2.links = kind2.links;
  if (kind2.linkDescriptions && Object.keys(kind2.linkDescriptions).length > 0) {
    row2.link_descriptions = kind2.linkDescriptions;
  }
  if (kind2.expectsInbound && Object.keys(kind2.expectsInbound).length > 0) row2.expects_inbound = kind2.expectsInbound;
  if (kind2.path) row2.path = kind2.path;
  if (kind2.sections && kind2.sections.length > 0) {
    row2.sections = kind2.sections;
    row2.required_headings = kind2.sections.map((section) => `# ${section}`);
  }
  if (kind2.freshnessHorizon) {
    row2.horizon = kind2.freshnessHorizon;
    const ms = freshnessHorizonMs(kind2);
    if (ms !== void 0) row2.horizon_ms = ms;
  }
  return row2;
}
async function kinds(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs14({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "kinds"
  );
  if (values.help) {
    stdout(KINDS_USAGE);
    return;
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const registry = await loadKinds(bundle);
  const rows = [...registry.kinds.values()].sort((a, b) => a.governs.localeCompare(b.governs)).map(toRow);
  const out = { count: rows.length, kinds: rows };
  if (registry.warnings.length > 0) out.warnings = registry.warnings;
  if (rows.length === 0) {
    out.help = [`${cliInvocation()} new "<Kind>" <id> --<field> <value>  (once a kind is declared)`];
  }
  stdout(render(out, resolveMode(values)));
}

// src/commands/kind.ts
import { parseArgs as parseArgs15 } from "node:util";
var RESERVED_FIELD_NAMES2 = /* @__PURE__ */ new Set(["type", "dir", "remote", "json", "help"]);
var KIND_USAGE = `agentstate-lite kind \u2014 edit a bundle's kind conventions (a kind's schema)

Usage:
  agentstate-lite kind field "<Kind>" add <name> [--required] [--values <a,b,c>] [options]
  agentstate-lite kind field "<Kind>" remove <name> [options]

Adds or removes a DECLARED field on the '<Kind>' kind's governing convention doc. The plural
'kinds' command LISTS what a bundle declares; this singular 'kind' command EDITS one (mirroring
'recipes'/'recipe'). A field added without --required is OPTIONAL; --values restricts it to an
enumerated set. Idempotent: adding an already-declared field (or removing an absent one) is a
no-op that exits 0. Preserves everything else on the convention (governs/path/sections/body, and
any fields.* sibling key this command does not own \u2014 e.g. a declared 'terminal' set).

Options:
  --required            Add the field as REQUIRED (default: optional). Ignored by 'remove'.
  --values <a,b,c>      Restrict the field to this comma-separated enum ('add' only)
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
  --actor <name>        Attribute this write
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function toStringList(v) {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}
function isRecord3(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function hasOwn3(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}
function setOwn3(record, key, value) {
  Object.defineProperty(record, key, { value, enumerable: true, configurable: true, writable: true });
}
function cloneRecord(record) {
  const clone = {};
  for (const [key, value] of Object.entries(record)) setOwn3(clone, key, value);
  return clone;
}
function deleteOwn(record, key) {
  return hasOwn3(record, key) && delete record[key];
}
async function kind(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs15({
      args: argv,
      allowPositionals: true,
      options: {
        required: { type: "boolean" },
        values: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        actor: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      }
    }),
    "kind"
  );
  if (values.help) {
    stdout(KIND_USAGE);
    return;
  }
  const helpHint = `${cliInvocation()} kind field "<Kind>" add <name>`;
  const subresource = positionals[0]?.trim();
  if (subresource !== "field") {
    throw new CliError(
      "USAGE",
      `kind: unknown or missing sub-resource '${subresource ?? ""}' \u2014 only 'field' is supported (edit a kind's declared fields)`,
      { help: helpHint }
    );
  }
  const kindName = positionals[1]?.trim();
  const action = positionals[2]?.trim();
  const fieldName = positionals[3]?.trim();
  if (!kindName) {
    throw new CliError("USAGE", 'kind field requires a "<Kind>"', { help: helpHint });
  }
  if (action !== "add" && action !== "remove") {
    throw new CliError("USAGE", `kind field "${kindName}" <action>: action must be 'add' or 'remove', got '${action ?? ""}'`, {
      help: helpHint
    });
  }
  if (!fieldName) {
    throw new CliError("USAGE", `kind field "${kindName}" ${action} requires a <name>`, { help: helpHint });
  }
  if (positionals.length > 4) {
    throw new CliError(
      "USAGE",
      `kind field takes exactly "<Kind>" <action> <name>, got extra: ${positionals.slice(4).join(", ")}`,
      { help: helpHint }
    );
  }
  if (RESERVED_FIELD_NAMES2.has(fieldName)) {
    throw new CliError(
      "USAGE",
      `'${fieldName}' is a reserved name and cannot be a kind field (type is stamped from the kind; dir/remote/json/help are control flags).`,
      { help: helpHint }
    );
  }
  if (action === "remove" && (values.required || values.values !== void 0)) {
    throw new CliError("USAGE", "--required/--values apply to 'add', not 'remove'", { help: helpHint });
  }
  if (values.actor !== void 0 && values.actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value \u2014 pass an actor identity or omit the flag.", {
      help: helpHint
    });
  }
  let enumVals;
  if (values.values !== void 0) {
    enumVals = values.values.split(",").map((v) => v.trim()).filter((v) => v.length > 0);
    if (enumVals.length === 0) {
      throw new CliError("USAGE", "--values was empty \u2014 pass a comma-separated list (e.g. --values todo,doing,done)", {
        help: helpHint
      });
    }
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const registry = await loadKinds(bundle);
  const target = registry.kinds.get(kindName);
  if (!target) {
    const known = [...registry.kinds.keys()].sort();
    throw new CliError(
      "USAGE",
      known.length > 0 ? `unknown kind '${kindName}' (declared: ${known.join(", ")})` : `unknown kind '${kindName}' (no kinds declared in this bundle)`,
      { help: `${cliInvocation()} kinds` }
    );
  }
  let computedRequired = [];
  let computedOptional = [];
  let computedValues = {};
  const result = await mutateDoc({
    bundle,
    id: target.id,
    mode: "patch",
    registry,
    strict: false,
    // this command EDITS the schema itself — it never validates against one
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor: values.actor?.trim(),
    buildCandidate: (existingDoc) => {
      const existing = existingDoc;
      const fm = existing.frontmatter;
      const currentGoverns = typeof fm.governs === "string" ? fm.governs.trim() : "";
      if (currentGoverns !== kindName) {
        throw new CliError(
          "STALE_HEAD",
          `'${target.id}' no longer governs '${kindName}' \u2014 it was concurrently renamed to govern '${currentGoverns || "(missing)"}'. Refusing to edit the wrong kind's schema; re-run '${cliInvocation()} kinds' to see the current declarations and retry against the right name.`,
          { help: `${cliInvocation()} kinds` }
        );
      }
      const fieldsObj = isRecord3(fm.fields) ? cloneRecord(fm.fields) : {};
      const required = toStringList(fieldsObj.required);
      const optional = toStringList(fieldsObj.optional);
      const valuesMap = hasOwn3(fieldsObj, "values") && isRecord3(fieldsObj.values) ? cloneRecord(fieldsObj.values) : {};
      const descriptionsMap = hasOwn3(fieldsObj, "descriptions") && isRecord3(fieldsObj.descriptions) ? cloneRecord(fieldsObj.descriptions) : void 0;
      const rawValueDescriptions = hasOwn3(fieldsObj, "value_descriptions") ? fieldsObj.value_descriptions : void 0;
      let valueDescriptionsMap;
      let valueDescriptionsChanged = false;
      let descriptionDeleted = false;
      if (action === "add") {
        const targetList = values.required ? required : optional;
        const otherList = values.required ? optional : required;
        const otherIdx = otherList.indexOf(fieldName);
        if (otherIdx >= 0) otherList.splice(otherIdx, 1);
        if (!targetList.includes(fieldName)) targetList.push(fieldName);
        if (enumVals) {
          const vals = enumVals;
          const prev = hasOwn3(valuesMap, fieldName) && Array.isArray(valuesMap[fieldName]) ? valuesMap[fieldName].map(String) : void 0;
          const same = !!prev && prev.length === vals.length && prev.every((v, i) => v === vals[i]);
          if (!same) setOwn3(valuesMap, fieldName, vals);
          if (isRecord3(rawValueDescriptions) && hasOwn3(rawValueDescriptions, fieldName)) {
            const rawFieldDescriptions = rawValueDescriptions[fieldName];
            if (isRecord3(rawFieldDescriptions)) {
              const retained = {};
              for (const [value, description] of Object.entries(rawFieldDescriptions)) {
                if (vals.includes(value)) setOwn3(retained, value, description);
              }
              if (Object.keys(retained).length !== Object.keys(rawFieldDescriptions).length) {
                valueDescriptionsMap = cloneRecord(rawValueDescriptions);
                if (Object.keys(retained).length > 0) setOwn3(valueDescriptionsMap, fieldName, retained);
                else deleteOwn(valueDescriptionsMap, fieldName);
                valueDescriptionsChanged = true;
              }
            }
          }
        }
      } else {
        for (const list2 of [required, optional]) {
          const idx = list2.indexOf(fieldName);
          if (idx >= 0) list2.splice(idx, 1);
        }
        deleteOwn(valuesMap, fieldName);
        if (descriptionsMap) descriptionDeleted = deleteOwn(descriptionsMap, fieldName);
        if (isRecord3(rawValueDescriptions) && hasOwn3(rawValueDescriptions, fieldName)) {
          const rawFieldDescriptions = rawValueDescriptions[fieldName];
          if (isRecord3(rawFieldDescriptions)) {
            valueDescriptionsMap = cloneRecord(rawValueDescriptions);
            deleteOwn(valueDescriptionsMap, fieldName);
            valueDescriptionsChanged = true;
          }
        }
      }
      computedRequired = required;
      computedOptional = optional;
      computedValues = valuesMap;
      const newFields = { ...fieldsObj };
      if (required.length > 0) newFields.required = required;
      else delete newFields.required;
      if (optional.length > 0) newFields.optional = optional;
      else delete newFields.optional;
      if (Object.keys(valuesMap).length > 0) newFields.values = valuesMap;
      else delete newFields.values;
      if (descriptionsMap && descriptionDeleted) {
        if (Object.keys(descriptionsMap).length > 0) newFields.descriptions = descriptionsMap;
        else delete newFields.descriptions;
      }
      if (valueDescriptionsMap && valueDescriptionsChanged) {
        if (Object.keys(valueDescriptionsMap).length > 0) newFields.value_descriptions = valueDescriptionsMap;
        else delete newFields.value_descriptions;
      }
      const newFm = { ...fm };
      if (Object.keys(newFields).length > 0) newFm.fields = newFields;
      else delete newFm.fields;
      return { frontmatter: newFm, body: existing.body };
    },
    errors: {
      notFound: () => new CliError(
        "NOT_FOUND",
        `the '${kindName}' kind's governing convention doc ('${target.id}') is declared by the registry but missing`,
        { help: `${cliInvocation()} kinds` }
      )
    }
  });
  const changed = result.changed ?? false;
  const after = changed ? (await loadKinds(bundle)).kinds.get(kindName) : target;
  const receipt = {
    kind: kindName,
    changed,
    action,
    field: fieldName,
    convention: target.id,
    required: after?.fields.required ?? computedRequired,
    optional: after?.fields.optional ?? computedOptional
  };
  const resultValues = after?.fields.values ?? computedValues;
  if (Object.keys(resultValues).length > 0) receipt.values = resultValues;
  receipt.help = [`${cliInvocation()} kinds`];
  stdout(render(receipt, resolveMode(values)));
}

// src/commands/recipes.ts
import { parseArgs as parseArgs16 } from "node:util";
var RECIPES_USAGE = `agentstate-lite recipes \u2014 list built-in recipes and whether each is applied

Usage:
  agentstate-lite recipes [--dir <path>] [--remote <url>]

A recipe is a folder ('recipe.md' manifest + 'conventions/*.md' docs) that 'recipe add
<name-or-path>' installs onto a bundle in one shot \u2014 idempotently (re-adding an already-applied
recipe is a changed:false no-op). A definitions-only portable recipe may also declare static
Reference docs and View registry/HTML pairs without carrying instances. This command lists the
BUILT-IN recipes shipped with the CLI; an external recipe (a path) is not enumerated here, only
path-addressed via 'recipe add <path>'.
'init' applies the default recipe ('context-notes') automatically unless '--recipe none' is
passed. See 'agentstate-lite kinds' for the LIVE per-bundle registry a recipe's docs feed into.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function toRow2(recipe2, applied) {
  return {
    name: recipe2.id,
    version: recipe2.version,
    applied,
    summary: recipe2.summary,
    docs: recipe2.docs.map((d) => d.id)
  };
}
async function recipes(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs16({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "recipes"
  );
  if (values.help) {
    stdout(RECIPES_USAGE);
    return;
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const appliedIds = await appliedDocIds(bundle);
  const rows = [];
  for (const name of builtinNames()) {
    const loaded = await resolveRecipe(name);
    if (!loaded.ok) continue;
    rows.push(toRow2(loaded.recipe, isRecipeApplied(loaded.recipe, appliedIds)));
  }
  stdout(
    render(
      { count: rows.length, recipes: rows, help: [`${cliInvocation()} recipe add <name-or-path>`] },
      resolveMode(values)
    )
  );
}

// src/commands/recipe.ts
import { parseArgs as parseArgs17 } from "node:util";
var RECIPE_USAGE = `agentstate-lite recipe \u2014 apply a recipe to this bundle

Usage:
  agentstate-lite recipe add <name-or-path> [--dir <path>] [--remote <url>]

Applies a recipe's definitions to the bundle. <name-or-path> is a built-in name (e.g.
'context-notes') or a path to a recipe folder (a path is anything containing '/' or starting
with '~' \u2014 a local folder literally named 'foo' is reachable only as './foo'). A recipe folder
is 'recipe.md' (type: Recipe manifest) plus one or more 'conventions/*.md' docs. A portable recipe
may opt into 'content_policy: definitions-only' and explicitly declare static 'type: Reference'
docs plus self-contained View registry/HTML pairs; instance data and undeclared files are then
rejected before any write.

Idempotent: a doc the recipe would install that already exists is left untouched (changed:false
for that doc) rather than erroring or overwriting \u2014 re-running 'recipe add' on an already-applied
recipe is a changed:false no-op overall, and never clobbers a bundle author's own hand-edit. See
'agentstate-lite recipes' to list built-ins and which are already applied, and 'agentstate-lite
kinds' for the resulting live per-bundle registry.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
async function recipe(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "add") return recipeAdd(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(RECIPE_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown recipe subcommand: ${sub} (expected add)`, {
    help: `${cliInvocation()} recipe --help`
  });
}
async function recipeAdd(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs17({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "recipe"
  );
  if (values.help) {
    stdout(RECIPE_USAGE);
    return;
  }
  const ref = positionals[0]?.trim();
  if (!ref) {
    throw new CliError("USAGE", "recipe add requires a <name-or-path> positional", {
      help: `${cliInvocation()} recipes`
    });
  }
  const loaded = await resolveRecipe(ref);
  if (!loaded.ok) {
    throw new CliError("USAGE", loaded.error.message, { help: `${cliInvocation()} recipes` });
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const result = await applyRecipe(bundle, loaded.recipe);
  const registry = await loadKinds(bundle);
  const dupWarnings = registry.warnings.filter((w) => w.code === "KIND_DUPLICATE_GOVERNS");
  const warnings = [...result.warnings, ...dupWarnings];
  const receipt = {
    // Reflect the aggregate no-op: an already-applied recipe re-add reports "already applied" rather
    // than a misleading "added" over its own `changed:false` (idempotency signalling, AXI P6).
    recipe: result.changed ? "added" : "already applied",
    id: result.id,
    version: result.version,
    source: result.source,
    changed: result.changed,
    docs: result.docs
  };
  if (result.pages.length > 0) receipt.pages = result.pages;
  if (result.references.length > 0) receipt.references = result.references;
  receipt.counts = result.counts;
  if (warnings.length > 0) receipt.warnings = warnings;
  receipt.help = [`${cliInvocation()} recipes`, `${cliInvocation()} kinds`];
  stdout(render(receipt, resolveMode(values)));
}

// src/commands/status.ts
import { parseArgs as parseArgs18 } from "node:util";
var STATUS_USAGE = `agentstate-lite status \u2014 read-only whole-bundle health report (bundle lint)

Usage:
  agentstate-lite status [--limit <n>] [--dir <path> | --remote <url>]

Runs, in ONE pass over the bundle: a kind-conformance lint (against any declared conventions/,
reusing the SAME validator 'doc write'/'new' use), an unresolved-link scan (a link whose target
isn't in the bundle \u2014 informational, since OKF permits links to not-yet-written knowledge; external
links are excluded entirely), an orphan scan (concept docs with zero inbound links from OTHER
concept docs), a freshness sweep over kinds that declare a horizon (a governed doc older than it is
'stale'; a governed doc with no usable timestamp \u2014 missing OR malformed \u2014 is counted
'no_timestamp'), and two graph lints over any declared 'links'/'expects_inbound' vocabulary (see
'kinds --help'): edges violating a declared typed-edge type ('link_type_violations') and kind
instances missing a declared inbound expectation ('missing_expected_links'). Duplicate-id detection
is not offered: an id IS its storage path, so ids are structurally unique.

Category semantics (one line each):
  malformed          A document whose YAML frontmatter cannot be parsed at all \u2014 it is skipped by
                      every scan (so it never blinds this report) and named here with the parser
                      error; fix its YAML or remove the file. This is the headline finding.
  kind_warnings      Frontmatter/section violations against a doc's OWN declared kind (a per-doc
                      lint; see 'kinds').
  conformance_debt   Count of GOVERNED DOCS carrying at least one FRONTMATTER-level kind violation
                      (a missing required field, an out-of-enum value, or wrong arity) \u2014 a per-DOC,
                      frontmatter-only signal, deliberately narrower than 'kind_warnings' (a
                      per-VIOLATION total that also counts body-section violations). Present (even
                      at 0) whenever the bundle declares any kind at all; absent on a
                      conventions-free bundle. See 'doc update' to fix a listed doc.
  unresolved_links   A link whose target isn't in the queried doc set \u2014 informational (OKF permits
                      links to not-yet-written knowledge), not broken.
  orphans            A concept doc with ZERO INBOUND links from OTHER concept docs. Outbound links
                      do NOT rescue a doc; a self-link does NOT rescue a doc; links from a reserved
                      file (index.md/log.md) can never count as a source (reserved files are
                      excluded from the queried doc set by design). Convention docs (type:
                      Convention) are EXPECTED, PERMANENT orphans \u2014 they are schema declarations,
                      not content, and nothing is expected to cite them \u2014 so they are NOT
                      special-cased out of the count or the rows; the 'type' column on each row is
                      how you tell schema from content at a glance.
  stale              A governed doc (its type has a declared kind with a freshness horizon) whose
                      timestamp is older than that horizon.
  no_timestamp       A governed doc with no usable timestamp (missing OR malformed) \u2014 it cannot be
                      judged stale or fresh at all, so it is counted separately from 'stale'.
  registry_warnings  Malformed convention docs THEMSELVES (loadKinds' own warnings) \u2014 a problem in
                      the schema declaration, not in a doc that kind governs.
  link_type_violations  An edge whose text EXACTLY matches a declared typed-edge vocabulary entry
                      (some kind's 'links' map) but the actual source and/or target doc's type
                      doesn't conform to that declaration \u2014 the same rule 'link add' warns on at
                      write time, applied bundle-wide.
  missing_expected_links  A kind instance whose OWN kind declares 'expects_inbound' but lacks at
                      least one conforming inbound edge (exact text match AND the citing doc's
                      type matches the expected source kind). Rows carry the instance's 'status'
                      field value when its kind declares one (the triage signal). An instance
                      whose OWN kind declares a terminal set of field values (see 'kinds --help')
                      AND whose frontmatter currently matches it is EXCLUDED from this count and
                      its rows (it's noise \u2014 a done/canceled instance doesn't need the expected
                      edge anymore); the top-level 'terminal_skipped' field counts the INSTANCES
                      skipped before this lint evaluated them \u2014 not findings suppressed (a skipped
                      instance might have linted clean anyway) \u2014 present only when > 0. A kind with no terminal
                      declaration is unaffected (every instance still counts, exactly as before
                      terminal declarations existed). Non-terminal instances sort first: by the
                      declared terminal set when the kind has one, else by the legacy hardcoded
                      status === "done" fallback.
  legacy_naming      Informational, never a warning: docs typed 'Page' (the legacy name for the
                      'View' kind) plus items still under the legacy pages-registry//pages/ id
                      prefixes \u2014 all fully supported, nothing migrates. Omitted when the bundle
                      carries none.

This is a whole-bundle read (one registry load + one query + one prefix-scoped blob listing,
batched) \u2014 acceptable for an explicitly batch-analysis command; over --remote it is one
whole-bundle fetch, not a per-doc round trip.

Exit is ALWAYS 0 once the analysis runs: findings are reports, not errors. (A --fail-on-findings CI
flag is a recorded future item, not built here.)

Options:
  --limit <n>             Cap each finding category's row list to <n> rows (default: 20; 0 = unlimited)
  --dir <path>            Bundle directory (default: discovered from the cwd)
  --remote <url>          Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help
`;
var DEFAULT_LIMIT2 = 20;
function cap(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
var FRONTMATTER_VIOLATION_CODES = /* @__PURE__ */ new Set(["KIND_FIELD_MISSING", "KIND_FIELD_VALUE", "KIND_FIELD_ARITY"]);
function docType2(doc2) {
  return typeof doc2.frontmatter.type === "string" ? doc2.frontmatter.type : "";
}
async function status(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs18({
      args: argv,
      options: {
        limit: { type: "string" },
        dir: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "status"
  );
  if (values.help) {
    stdout(STATUS_USAGE);
    return;
  }
  let limit = DEFAULT_LIMIT2;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)");
    }
    limit = Number(raw);
  }
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (deps.autoPull ?? maybeAutoPull2)(values.dir);
  const bundle = await openBundle(values.dir, remote);
  const malformedRows = [];
  const [registry, docs, legacyBlobKeys] = await Promise.all([
    loadKinds(bundle),
    query(bundle, {}, { onSkip: (s) => malformedRows.push({ id: s.id, reason: s.reason }) }),
    // legacy_naming audit (below): blob keys still under the legacy pages/ prefix — one extra
    // prefix-scoped listing on a command that is already an explicit whole-bundle read.
    listBlobs(bundle, LEGACY_PAGE_BLOB_PREFIX)
  ]);
  const byId = new Set(docs.map((d) => d.id));
  const docsById = new Map(docs.map((d) => [d.id, d]));
  const lintRows = [];
  const conformanceDebtDocs = /* @__PURE__ */ new Map();
  for (const doc2 of docs) {
    const kind2 = registry.kinds.get(docType2(doc2));
    if (!kind2) continue;
    for (const w of validateAgainstKind(doc2, kind2)) {
      lintRows.push({ id: doc2.id, field: w.field ?? "", code: w.code });
      if (FRONTMATTER_VIOLATION_CODES.has(w.code) && !conformanceDebtDocs.has(doc2.id)) {
        conformanceDebtDocs.set(doc2.id, docType2(doc2));
      }
    }
  }
  const linkTypeDeclarations = collectLinkDeclarations(registry);
  const unresolvedRows = [];
  const inbound = /* @__PURE__ */ new Set();
  const inboundEdges = /* @__PURE__ */ new Map();
  const linkTypeViolationRows = [];
  for (const doc2 of docs) {
    for (const l of parseLinksFromDoc(doc2)) {
      if (!byId.has(l.to)) {
        unresolvedRows.push({ from: doc2.id, href: l.href });
        continue;
      }
      if (l.to !== doc2.id) {
        inbound.add(l.to);
        const list2 = inboundEdges.get(l.to) ?? [];
        list2.push({ text: l.text, sourceType: docType2(doc2) });
        inboundEdges.set(l.to, list2);
      }
      const declared = linkTypeDeclarations.get(l.text);
      if (declared && declared.length > 0) {
        const sourceType = docType2(doc2);
        const targetType = docType2(docsById.get(l.to));
        const matched = declared.find((d) => d.governs === sourceType) ?? declared[0];
        const sourceOk = declared.some((d) => d.governs === sourceType);
        const targetOk = targetType === matched.target;
        if (!sourceOk || !targetOk) {
          linkTypeViolationRows.push({
            from: doc2.id,
            to: l.to,
            text: l.text,
            expected: `${matched.governs} -> ${matched.target}`
          });
        }
      }
    }
  }
  const orphanRows = [];
  for (const doc2 of docs) {
    if (!inbound.has(doc2.id)) orphanRows.push({ id: doc2.id, type: docType2(doc2) });
  }
  const now = /* @__PURE__ */ new Date();
  const staleRows = [];
  const noTimestampRows = [];
  for (const doc2 of docs) {
    const kind2 = registry.kinds.get(docType2(doc2));
    if (!kind2) continue;
    const horizonMs = freshnessHorizonMs(kind2);
    if (horizonMs === void 0) continue;
    const result = freshness(doc2, { maxAgeMs: horizonMs, now });
    if (result.verdict === "empty") {
      noTimestampRows.push({ id: doc2.id, type: docType2(doc2) });
    } else if (result.verdict === "stale") {
      staleRows.push({ id: doc2.id, age_ms: result.ageMs, horizon_ms: horizonMs });
    }
  }
  const missingExpectedRanked = [];
  let terminalSkipped = 0;
  for (const doc2 of docs) {
    const kind2 = registry.kinds.get(docType2(doc2));
    if (!kind2?.expectsInbound) continue;
    const terminalDeclared = Object.keys(kind2.fields.terminal).length > 0;
    if (terminalDeclared && isTerminal(kind2, doc2.frontmatter)) {
      terminalSkipped++;
      continue;
    }
    const edges = inboundEdges.get(doc2.id) ?? [];
    const missing = Object.entries(kind2.expectsInbound).filter(([text, sourceKind]) => !edges.some((e) => e.text === text && e.sourceType === sourceKind)).map(([text]) => text);
    if (missing.length === 0) continue;
    const row2 = { id: doc2.id };
    const declaresStatus = kind2.fields.required.includes("status") || kind2.fields.optional.includes("status");
    if (declaresStatus) row2.status = doc2.frontmatter.status;
    row2.missing = missing;
    const sortsFirst = terminalDeclared ? isTerminal(kind2, doc2.frontmatter) : row2.status === "done";
    missingExpectedRanked.push({ row: row2, sortsFirst });
  }
  missingExpectedRanked.sort((a, b) => {
    if (a.sortsFirst !== b.sortsFirst) return a.sortsFirst ? 1 : -1;
    return String(a.row.id).localeCompare(String(b.row.id));
  });
  const missingExpectedRows = missingExpectedRanked.map((e) => e.row);
  const pageTypedRows = docs.filter((doc2) => isLegacyPageDoc(doc2.frontmatter)).map((doc2) => ({ id: doc2.id }));
  const legacyPrefixRows = [
    ...docs.filter((doc2) => isLegacyRegistryDocId(doc2.id)).map((doc2) => ({ id: doc2.id, store: "doc" })),
    ...legacyBlobKeys.slice().sort().map((key) => ({ id: key, store: "blob" }))
  ];
  const malformed = cap(malformedRows, limit);
  const lint = cap(lintRows, limit);
  const unresolved = cap(unresolvedRows, limit);
  const orphans = cap(orphanRows, limit);
  const stale = cap(staleRows, limit);
  const noTimestamp = cap(noTimestampRows, limit);
  const registryLint = cap(
    registry.warnings.map((w) => ({ ...w })),
    limit
  );
  const linkTypeViolations = cap(linkTypeViolationRows, limit);
  const missingExpectedLinks = cap(missingExpectedRows, limit);
  const conformanceDebt = cap(
    [...conformanceDebtDocs].map(([id, type]) => ({ id, type })),
    limit
  );
  const out = {
    docs: docs.length,
    kinds: registry.kinds.size,
    malformed: malformed.total,
    kind_warnings: lint.total,
    unresolved_links: unresolved.total,
    orphans: orphans.total,
    stale: stale.total,
    no_timestamp: noTimestamp.total,
    registry_warnings: registryLint.total,
    link_type_violations: linkTypeViolations.total,
    missing_expected_links: missingExpectedLinks.total
  };
  if (terminalSkipped > 0) out.terminal_skipped = terminalSkipped;
  if (registry.kinds.size > 0) out.conformance_debt = conformanceDebt.total;
  if (malformed.total > 0) out.malformed_docs = malformed;
  if (lint.total > 0) out.kind_lint = lint;
  if (conformanceDebt.total > 0) {
    out.conformance_debt_docs = {
      ...conformanceDebt,
      help: `${cliInvocation()} doc update <id> --<field> <value>  \u2014 fix a listed doc's missing/invalid field(s); see '${cliInvocation()} kinds' for each governing kind's declared fields`
    };
  }
  if (unresolved.total > 0) out.unresolved = unresolved;
  if (orphans.total > 0) out.orphan_docs = orphans;
  if (stale.total > 0) out.stale_docs = stale;
  if (noTimestamp.total > 0) out.no_timestamp_docs = noTimestamp;
  if (linkTypeViolations.total > 0) out.link_type_violations_rows = linkTypeViolations;
  if (missingExpectedLinks.total > 0) out.missing_expected_links_rows = missingExpectedLinks;
  if (registryLint.total > 0) out.registry_lint = registryLint;
  const pageTyped = cap(pageTypedRows, limit);
  const legacyPrefix = cap(legacyPrefixRows, limit);
  if (pageTyped.total > 0 || legacyPrefix.total > 0) {
    const legacy = {
      note: "informational \u2014 'Page' is the legacy name for the 'View' kind; legacy-typed docs and old-prefix ids stay fully supported and never migrate. These counts size a future full deprecation.",
      page_typed_docs: pageTyped.total,
      legacy_prefix_items: legacyPrefix.total
    };
    if (pageTyped.total > 0) legacy.page_typed_rows = pageTyped;
    if (legacyPrefix.total > 0) legacy.legacy_prefix_rows = legacyPrefix;
    out.legacy_naming = legacy;
  }
  stdout(render(out, resolveMode(values)));
}

// src/commands/serve.ts
import { parseArgs as parseArgs19 } from "node:util";

// ../server/src/router.ts
var DEFAULT_LIST_LIMIT = 50;
function isEnoent2(err) {
  return typeof err === "object" && err !== null && err.code === "ENOENT";
}
function decodeId(rawPathTail) {
  return rawPathTail.split("/").map((seg) => decodeURIComponent(seg)).join("/");
}
function decodeBlobKey(rawPathTail) {
  return rawPathTail.split("/").map((seg) => decodeURIComponent(seg)).join("/");
}
function assertValidDocId(id) {
  assertSafeConceptId(id);
  if (isReservedFile(pathFromConceptId(id))) {
    throw new Error(`'${id}' is a reserved file, not a concept document`);
  }
}
function assertSafeDir(dir) {
  if (dir === "") return;
  const norm = toPosix(dir);
  if (norm.startsWith("/")) {
    throw new Error(`dir must be bundle-relative, got absolute '${dir}'`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new Error(`dir must not contain '..' segments: '${dir}'`);
  }
}
function jsonResponse(status2, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}
function errorResponse(status2, code, message, details) {
  return jsonResponse(status2, {
    error: details === void 0 ? { code, message } : { code, message, details }
  });
}
function errorFromCaught(err) {
  if (err instanceof VersionConflict) {
    return errorResponse(412, "VERSION_CONFLICT", err.message, { expected: err.expected, actual: err.actual });
  }
  if (isEnoent2(err)) {
    return errorResponse(404, "NOT_FOUND", err instanceof Error ? err.message : "not found");
  }
  if (err instanceof Error) {
    return errorResponse(400, "USAGE", err.message);
  }
  return errorResponse(500, "RUNTIME", String(err));
}
function writeOptionsFromHeaders(req) {
  const options2 = {};
  if (req.headers.get("If-None-Match") === "*") {
    options2.expectedVersion = null;
  } else {
    const ifMatch = req.headers.get("If-Match");
    if (ifMatch !== null) options2.expectedVersion = stripETagWrapper(ifMatch);
  }
  const actor = req.headers.get("X-Actor");
  if (actor) options2.actor = actor;
  const agent = req.headers.get("X-Agent");
  if (agent) options2.agent = agent;
  return options2;
}
function deleteOptionsFromHeaders(req) {
  const ifMatch = req.headers.get("If-Match");
  return ifMatch !== null ? { expectedVersion: stripETagWrapper(ifMatch) } : {};
}
function versionHeaders(version) {
  return { "X-Version": version, ETag: `"${version}"` };
}
var BUNDLE_PATH_RE = /^\/v0\/bundles\/([^/]+)\/(.*)$/;
function createRouter(bundle) {
  return buildRouter(bundle.backend ?? new FilesystemBackend(bundle.root));
}
function buildRouter(backend) {
  const bundle = { root: "", backend };
  async function handleReadDoc(id) {
    assertValidDocId(id);
    try {
      const { doc: doc2, version } = await backend.read(id);
      return jsonResponse(200, { id: doc2.id, frontmatter: doc2.frontmatter, body: doc2.body }, versionHeaders(version));
    } catch (err) {
      if (isEnoent2(err)) return errorResponse(404, "NOT_FOUND", `no concept document '${id}'`);
      throw err;
    }
  }
  async function handleHeadDoc(id) {
    try {
      assertValidDocId(id);
    } catch {
      return new Response(null, { status: 400 });
    }
    try {
      const { version } = await backend.read(id);
      return new Response(null, { status: 200, headers: versionHeaders(version) });
    } catch (err) {
      if (isEnoent2(err)) return new Response(null, { status: 404 });
      throw err;
    }
  }
  async function handleWriteDoc(id, req) {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return errorResponse(400, "USAGE", "request body must be JSON { frontmatter, body }");
    }
    if (payload === null || typeof payload !== "object" || payload.frontmatter === void 0) {
      return errorResponse(400, "USAGE", "request body must include a frontmatter object");
    }
    const options2 = writeOptionsFromHeaders(req);
    const result = await writeDocVersioned(
      bundle,
      { id, frontmatter: payload.frontmatter, body: payload.body ?? "" },
      options2
    );
    const status2 = options2.expectedVersion === null ? 201 : 200;
    return jsonResponse(status2, { version: result.version }, versionHeaders(result.version));
  }
  async function handleDeleteDoc(id, req) {
    assertValidDocId(id);
    const options2 = deleteOptionsFromHeaders(req);
    const deleted = await backend.delete(id, options2);
    return jsonResponse(200, { deleted });
  }
  async function handleVersions(id) {
    assertValidDocId(id);
    const history = await backend.versions(id);
    return jsonResponse(200, { versions: history });
  }
  async function handleReadMany(req) {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return errorResponse(400, "USAGE", "request body must be JSON { ids: string[] }");
    }
    if (!payload || !Array.isArray(payload.ids) || !payload.ids.every((x) => typeof x === "string")) {
      return errorResponse(400, "USAGE", "request body must include an ids: string[] array");
    }
    const ids = payload.ids;
    if (ids.length === 0) return jsonResponse(200, { results: [] });
    for (const id of ids) {
      try {
        assertValidDocId(id);
      } catch (err) {
        return errorResponse(400, "USAGE", err instanceof Error ? err.message : `invalid id '${id}'`, { id });
      }
    }
    const existsFlags = await Promise.all(ids.map((id) => backend.exists(id)));
    const missing = ids.filter((_, i) => !existsFlags[i]);
    if (missing.length > 0) {
      return errorResponse(404, "NOT_FOUND", `${missing.length} id(s) not found`, { missing });
    }
    const results = await backend.readMany(ids);
    return jsonResponse(200, {
      results: results.map((r) => ({ id: r.doc.id, frontmatter: r.doc.frontmatter, body: r.doc.body, version: r.version }))
    });
  }
  async function handleList(url) {
    const prefix = url.searchParams.get("prefix") ?? void 0;
    const type = url.searchParams.get("type") ?? void 0;
    const tags = url.searchParams.getAll("tag");
    const fields = url.searchParams.get("fields");
    const limitParam = url.searchParams.get("limit");
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : NaN;
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_LIST_LIMIT;
    const cursor = url.searchParams.get("cursor") ?? void 0;
    const heads = await queryHeads(bundle, { prefix, type, tags });
    const count = heads.length;
    let page = heads;
    if (cursor) {
      const idx = page.findIndex((r) => r.id === cursor);
      page = idx >= 0 ? page.slice(idx + 1) : page.filter((r) => r.id.localeCompare(cursor) > 0);
    }
    const limited = page.slice(0, limit);
    const nextCursor = page.length > limit ? limited[limited.length - 1]?.id ?? null : null;
    const docs = limited.map(
      ({ id, frontmatter, version }) => fields === "frontmatter" ? { id, version, frontmatter } : {
        id,
        version,
        type: frontmatter.type,
        title: frontmatter.title,
        timestamp: frontmatter.timestamp
      }
    );
    return jsonResponse(200, { count, docs, next_cursor: nextCursor });
  }
  async function handleReadReserved(dir, name) {
    assertSafeDir(dir);
    const result = await backend.readReserved(dir, name);
    if (result === null) return errorResponse(404, "NOT_FOUND", `no reserved file '${name}' at dir '${dir}'`);
    return jsonResponse(200, { content: result.content }, versionHeaders(result.version));
  }
  async function handleWriteReserved(dir, name, req) {
    assertSafeDir(dir);
    let payload;
    try {
      payload = await req.json();
    } catch {
      return errorResponse(400, "USAGE", "request body must be JSON { content }");
    }
    if (typeof payload.content !== "string") {
      return errorResponse(400, "USAGE", "request body must include a content: string field");
    }
    const options2 = writeOptionsFromHeaders(req);
    const version = await backend.writeReserved(dir, name, payload.content, options2);
    const status2 = options2.expectedVersion === null ? 201 : 200;
    return jsonResponse(status2, { version }, versionHeaders(version));
  }
  async function handleReadBlob(key) {
    assertSafeBlobKey(key);
    const result = await backend.readBlob(key);
    if (result === null) return errorResponse(404, "NOT_FOUND", `no blob '${key}'`);
    return new Response(result.bytes, {
      status: 200,
      headers: { "content-type": result.contentType, ...versionHeaders(result.version) }
    });
  }
  async function handleHeadBlob(key) {
    try {
      assertSafeBlobKey(key);
    } catch {
      return new Response(null, { status: 400 });
    }
    const result = await backend.readBlob(key);
    if (result === null) return new Response(null, { status: 404 });
    return new Response(null, {
      status: 200,
      headers: { "content-type": result.contentType, ...versionHeaders(result.version) }
    });
  }
  async function handleWriteBlob(key, req) {
    assertSafeBlobKey(key);
    const bytes = new Uint8Array(await req.arrayBuffer());
    const contentTypeHeader = req.headers.get("content-type");
    const contentType = contentTypeHeader && contentTypeHeader.trim() !== "" ? contentTypeHeader : void 0;
    const options2 = writeOptionsFromHeaders(req);
    const version = await backend.writeBlob(key, bytes, contentType, options2);
    const status2 = options2.expectedVersion === null ? 201 : 200;
    return jsonResponse(status2, { version }, versionHeaders(version));
  }
  async function handleDeleteBlob(key, req) {
    assertSafeBlobKey(key);
    const options2 = deleteOptionsFromHeaders(req);
    const deleted = await backend.deleteBlob(key, options2);
    return jsonResponse(200, { deleted });
  }
  async function handleListBlobs(url) {
    const prefix = url.searchParams.get("prefix") ?? void 0;
    const limitParam = url.searchParams.get("limit");
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : NaN;
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_LIST_LIMIT;
    const cursor = url.searchParams.get("cursor") ?? void 0;
    const keys = await backend.listBlobs(prefix);
    const count = keys.length;
    let page = keys;
    if (cursor) {
      const idx = page.findIndex((k) => k === cursor);
      page = idx >= 0 ? page.slice(idx + 1) : page.filter((k) => k.localeCompare(cursor) > 0);
    }
    const limited = page.slice(0, limit);
    const nextCursor = page.length > limit ? limited[limited.length - 1] ?? null : null;
    return jsonResponse(200, { count, keys: limited, next_cursor: nextCursor });
  }
  function handleCapabilities() {
    const declared = backend.capabilities?.();
    const caps = declared ?? {
      enforced_cas: backend instanceof MemoryBackend,
      blobs: true,
      // v0.1 — PUT/GET/HEAD /blobs/{key} + GET /blobs (list)
      projections: true,
      backlinks: false
      // deferred to v1 (docs/WIRE-PROTOCOL.md)
    };
    return jsonResponse(200, {
      history: caps.history ?? caps.enforced_cas,
      enforced_cas: caps.enforced_cas,
      projections: caps.projections ?? true,
      backlinks: caps.backlinks ?? false,
      blobs: caps.blobs
    });
  }
  return async function handle(req) {
    let url;
    try {
      url = new URL(req.url);
    } catch {
      return errorResponse(400, "USAGE", "invalid request URL");
    }
    if (url.pathname === "/v0/capabilities") {
      return handleCapabilities();
    }
    const match = BUNDLE_PATH_RE.exec(url.pathname);
    if (!match) return errorResponse(404, "NOT_FOUND", `no route for ${url.pathname}`);
    const rest = match[2] ?? "";
    try {
      if (rest === "docs") {
        if (req.method === "GET") return await handleList(url);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for /docs`);
      }
      if (rest === "docs:read-many") {
        if (req.method === "POST") return await handleReadMany(req);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for /docs:read-many`);
      }
      if (rest.startsWith("docs/")) {
        const tail = rest.slice("docs/".length);
        if (tail.endsWith("/versions") && req.method === "GET") {
          return await handleVersions(decodeId(tail.slice(0, -"/versions".length)));
        }
        const id = decodeId(tail);
        if (req.method === "GET") return await handleReadDoc(id);
        if (req.method === "PUT") return await handleWriteDoc(id, req);
        if (req.method === "HEAD") return await handleHeadDoc(id);
        if (req.method === "DELETE") return await handleDeleteDoc(id, req);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for a doc route`);
      }
      if (rest.startsWith("reserved/")) {
        const name = rest.slice("reserved/".length);
        if (name !== "index.md" && name !== "log.md") {
          return errorResponse(400, "USAGE", `reserved file name must be index.md or log.md, got '${name}'`);
        }
        const dir = url.searchParams.get("dir") ?? "";
        if (req.method === "GET") return await handleReadReserved(dir, name);
        if (req.method === "PUT") return await handleWriteReserved(dir, name, req);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for a reserved-file route`);
      }
      if (rest === "blobs") {
        if (req.method === "GET") return await handleListBlobs(url);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for /blobs`);
      }
      if (rest.startsWith("blobs/")) {
        const key = decodeBlobKey(rest.slice("blobs/".length));
        if (req.method === "GET") return await handleReadBlob(key);
        if (req.method === "PUT") return await handleWriteBlob(key, req);
        if (req.method === "HEAD") return await handleHeadBlob(key);
        if (req.method === "DELETE") return await handleDeleteBlob(key, req);
        return errorResponse(400, "USAGE", `unsupported method ${req.method} for a blob route`);
      }
      return errorResponse(404, "NOT_FOUND", `no route for ${url.pathname}`);
    } catch (err) {
      return errorFromCaught(err);
    }
  };
}

// ../server/src/serve.ts
import { createServer } from "node:http";
function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return Promise.resolve(void 0);
  return new Promise((resolve2, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve2(chunks.length > 0 ? Buffer.concat(chunks) : void 0));
    req.on("error", reject);
  });
}
async function requestFromIncomingMessage(req, origin) {
  const url = new URL(req.url ?? "/", origin);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === void 0) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }
  const body = await readBody(req);
  return new Request(url, { method: req.method ?? "GET", headers, body });
}
async function writeResponseToServerResponse(res, response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);
  const bytes = response.body ? Buffer.from(await response.arrayBuffer()) : void 0;
  res.end(bytes);
}
function serve(options2) {
  const router = createRouter(options2.bundle);
  const host = options2.host ?? "127.0.0.1";
  return new Promise((resolve2, reject) => {
    const server = createServer((req, res) => {
      const origin = `http://${req.headers.host ?? `${host}:0`}`;
      requestFromIncomingMessage(req, origin).then((request) => router(request)).then((response) => writeResponseToServerResponse(res, response)).catch((err) => {
        res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
      });
    });
    server.once("error", reject);
    server.listen(options2.port ?? 0, host, () => {
      const addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject(new Error("failed to bind a TCP address"));
        return;
      }
      resolve2({
        host,
        port: addr.port,
        close: () => new Promise((resolveClose, rejectClose) => {
          server.close((err) => err ? rejectClose(err) : resolveClose());
        })
      });
    });
  });
}

// src/commands/serve.ts
var SERVE_USAGE = `agentstate-lite serve \u2014 boot the reference wire-protocol server over a local bundle

Usage:
  agentstate-lite serve [--dir <path>] [--host <h>] [--port <p>]

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --host <h>            Host to bind (default: 127.0.0.1 \u2014 loopback-only; NO AUTH in v0)
  --port <p>            Port to bind (default: 4818; use 0 for an ephemeral port)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help

Connect a client once this is running:
  agentstate-lite list --remote http://127.0.0.1:<port>

Caveat: concurrent writes to the same target across local clients and processes are serialized.
A process crash can leave a runtime lock that fails closed until inspected and removed.
`;
var DEFAULT_SERVE_PORT = 4818;
function defaultWaitForShutdown() {
  return new Promise((resolve2) => {
    process.once("SIGINT", () => resolve2());
    process.once("SIGTERM", () => resolve2());
  });
}
async function serve2(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const bootServer = deps.bootServer ?? serve;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown;
  const { values } = parseOrUsage(
    () => parseArgs19({
      args: argv,
      options: {
        dir: { type: "string" },
        host: { type: "string" },
        port: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "serve"
  );
  if (values.help) {
    stdout(SERVE_USAGE);
    return;
  }
  let port = DEFAULT_SERVE_PORT;
  if (values.port !== void 0) {
    const raw = values.port.trim();
    if (!/^\d+$/.test(raw) || Number(raw) > 65535) {
      throw new CliError("USAGE", "--port must be an integer between 0 and 65535", {
        help: `${cliInvocation()} serve --port <p>`
      });
    }
    port = Number(raw);
  }
  const host = values.host?.trim() || "127.0.0.1";
  const bundle = await openBundle(values.dir);
  let handle;
  try {
    handle = await bootServer({ bundle, host, port });
  } catch (err) {
    throw mapBootError(err, port);
  }
  const url = `http://${handle.host}:${handle.port}`;
  stdout(
    render(
      {
        serve: "listening",
        url,
        root: bundle.root,
        auth: "none (v0 reference server; loopback-only default \u2014 see docs/WIRE-PROTOCOL.md)",
        concurrency: "lossless per target across same-user local processes; a crash-leftover lock fails closed until inspected and removed",
        help: [`${cliInvocation()} list --remote ${url}`]
      },
      resolveMode(values)
    )
  );
  await waitForShutdown();
  await handle.close();
}
function mapBootError(err, port) {
  if (err instanceof CliError) return err;
  if (err?.code === "EADDRINUSE") {
    return new CliError("RUNTIME", `port ${port} is already in use \u2014 something else is listening there`, {
      help: `${cliInvocation()} serve --port 0 (ephemeral port), or pass a different --port`
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message);
}

// src/commands/ui.ts
import { parseArgs as parseArgs20 } from "node:util";
import { spawn as spawn2 } from "node:child_process";

// ../ui-server/src/assets.ts
import { gunzipSync } from "node:zlib";
var CSP_HEADER = "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; frame-src 'self'; child-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";
function acceptsGzip(acceptEncoding) {
  return !!acceptEncoding && acceptEncoding.split(",").some((part) => part.trim().split(";")[0] === "gzip");
}
function serveAsset(assets, pathname, acceptEncoding) {
  const asset = assets[pathname] ?? assets["/index.html"];
  if (!asset) {
    return { status: 500, headers: { "content-type": "text/plain; charset=utf-8" }, body: new TextEncoder().encode("no ui assets embedded") };
  }
  const gzipBytes = Buffer.from(asset.gzipBase64, "base64");
  const headers = {
    "content-type": asset.contentType,
    "content-security-policy": CSP_HEADER,
    "x-content-type-options": "nosniff",
    // The shell document's URL may carry `?token=` on first load (before the SPA scrubs it via
    // history.replaceState) — no request initiated by the shell, above all the untrusted page
    // iframe's load, may ever carry that URL as a referrer (tasks/ui-pages-spike P1).
    "referrer-policy": "no-referrer"
  };
  if (acceptsGzip(acceptEncoding)) {
    headers["content-encoding"] = "gzip";
    return { status: 200, headers, body: gzipBytes };
  }
  return { status: 200, headers, body: gunzipSync(gzipBytes) };
}
function createEmbeddedAssetHandler(assets) {
  return (pathname, acceptEncoding) => serveAsset(assets, pathname, acceptEncoding);
}

// ../ui-server/src/events.ts
var HEARTBEAT_MS = 25e3;
var SseHub = class {
  clients = /* @__PURE__ */ new Set();
  heartbeat;
  closed = false;
  /**
   * Attach a freshly-opened SSE response: write the event-stream headers, register it, and
   * de-register it on close. `extraHeaders` carries the session cookie when the connecting
   * request authenticated via the URL token (mirrors the main server's cookie-grant path).
   *
   * After {@link close}, a late-arriving stream (an EventSource reconnect racing onto a
   * kept-alive socket mid-shutdown) is severed instead of registered — a post-close stream
   * would never be ended and would hold the http server's `close()` open forever.
   */
  add(res, extraHeaders = {}) {
    if (this.closed) {
      res.destroy();
      return;
    }
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      connection: "keep-alive",
      "x-accel-buffering": "no",
      ...extraHeaders
    });
    res.write(": connected\n\n");
    this.clients.add(res);
    res.on("close", () => this.clients.delete(res));
    this.ensureHeartbeat();
  }
  /** Serialize `payload` as one `data:` frame and write it to every live client (dropping any whose write throws). */
  broadcast(payload) {
    const frame = `data: ${JSON.stringify(payload)}

`;
    for (const res of this.clients) {
      try {
        res.write(frame);
      } catch {
        this.clients.delete(res);
      }
    }
  }
  /** Number of live SSE clients (test/observability). */
  size() {
    return this.clients.size;
  }
  /** End every stream, stop the heartbeat, and refuse any later {@link add} — called on server shutdown so no timer (or late reconnect) keeps the server alive. */
  close() {
    this.closed = true;
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = void 0;
    }
    for (const res of this.clients) {
      try {
        res.end();
      } catch {
      }
    }
    this.clients.clear();
  }
  ensureHeartbeat() {
    if (this.heartbeat) return;
    this.heartbeat = setInterval(() => {
      for (const res of this.clients) {
        try {
          res.write(": ping\n\n");
        } catch {
          this.clients.delete(res);
        }
      }
    }, HEARTBEAT_MS);
    this.heartbeat.unref?.();
  }
};

// ../ui-server/src/host.ts
var ALLOWED_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function hostnameOf(hostHeader) {
  const h = hostHeader.trim();
  if (h.startsWith("[")) {
    const end = h.indexOf("]");
    return end === -1 ? h : h.slice(1, end);
  }
  const colon = h.lastIndexOf(":");
  return colon === -1 ? h : h.slice(0, colon);
}
function isAllowedHost(hostHeader) {
  if (!hostHeader) return false;
  return ALLOWED_HOSTS.has(hostnameOf(hostHeader));
}

// ../ui-server/src/pages.ts
var PAGE_BLOB_PREFIX = PAGE_ENTRY_PREFIX;
var VIEW_BLOB_PREFIX = VIEW_ENTRY_PREFIX;
var PAGE_BLOB_PREFIXES = [PAGE_BLOB_PREFIX, VIEW_BLOB_PREFIX];
function pageCsp() {
  return [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    "img-src data:",
    "font-src data:",
    "connect-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
    "frame-ancestors 'self'"
  ].join("; ");
}

// ../ui-server/src/actions.ts
import { randomBytes as randomBytes2 } from "node:crypto";
var DEFAULT_LAUNCH_TTL_MS = 60 * 60 * 1e3;
var DEFAULT_NONCE_TTL_MS = 12e4;
var DEFAULT_MAX_LAUNCHES = 256;
var PageLaunchRegistry = class {
  byLaunch = /* @__PURE__ */ new Map();
  byNonce = /* @__PURE__ */ new Map();
  ttlMs;
  maxEntries;
  now;
  nonceTtlMs;
  constructor(ttlMs = DEFAULT_LAUNCH_TTL_MS, maxEntries = DEFAULT_MAX_LAUNCHES, now = Date.now, nonceTtlMs = DEFAULT_NONCE_TTL_MS) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.now = now;
    this.nonceTtlMs = nonceTtlMs;
  }
  mint(input) {
    this.sweepExpired();
    while (this.byLaunch.size >= Math.max(1, this.maxEntries)) {
      const oldest = this.byLaunch.keys().next().value;
      if (!oldest) break;
      this.revoke(oldest);
    }
    const launchId = randomBytes2(32).toString("base64url");
    const nonce = randomBytes2(32).toString("base64url");
    const launch = {
      ...input,
      bytes: input.bytes.slice(),
      launchId,
      nonce,
      nonceExpiresAt: this.now() + this.nonceTtlMs,
      expiresAt: this.now() + this.ttlMs
    };
    this.byLaunch.set(launchId, launch);
    this.byNonce.set(nonce, launchId);
    return launch;
  }
  resolveLaunch(launchId) {
    const launch = this.byLaunch.get(launchId);
    if (!launch) return null;
    if (this.now() > launch.expiresAt) {
      this.revoke(launchId);
      return null;
    }
    return launch;
  }
  resolveNonce(nonce) {
    const launchId = this.byNonce.get(nonce);
    const launch = launchId ? this.resolveLaunch(launchId) : null;
    if (!launch) return null;
    if (this.now() > launch.nonceExpiresAt) {
      this.byNonce.delete(nonce);
      return null;
    }
    return launch;
  }
  revoke(launchId) {
    const launch = this.byLaunch.get(launchId);
    if (!launch) return;
    this.byLaunch.delete(launchId);
    this.byNonce.delete(launch.nonce);
  }
  size() {
    this.sweepExpired();
    return this.byLaunch.size;
  }
  sweepExpired() {
    const now = this.now();
    for (const [launchId, launch] of this.byLaunch) {
      if (now > launch.expiresAt) this.revoke(launchId);
    }
  }
};
function ownRecord(source) {
  const target = {};
  for (const [key, value] of Object.entries(source)) {
    Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true });
  }
  return target;
}
function setOwn4(record, key, value) {
  Object.defineProperty(record, key, { value, enumerable: true, configurable: true, writable: true });
}
function scalarEqual(a, b) {
  return typeof a === typeof b && a === b;
}
function isActionScalar(value) {
  return typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isPlainRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function hasExactKeys(value, expected) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((key, index) => key === sortedExpected[index]);
}
function parseDocumentSetFieldAction(value) {
  if (!isPlainRecord(value) || !hasExactKeys(value, ["kind", "docId", "field", "value", "expectedVersion"])) {
    throw new Error("action must contain exactly kind, docId, field, value, and expectedVersion");
  }
  if (value.kind !== "document.set-field") throw new Error("unsupported action kind");
  const docId = typeof value.docId === "string" ? value.docId.trim() : "";
  assertSafeConceptId(docId);
  const field = typeof value.field === "string" ? value.field.trim() : "";
  if (!field || Buffer.byteLength(field, "utf8") > 128) throw new Error("field must be a non-empty string of at most 128 bytes");
  const expectedVersion = typeof value.expectedVersion === "string" ? value.expectedVersion.trim() : "";
  if (!expectedVersion || expectedVersion.length > 256) {
    throw new Error("expectedVersion must be a non-empty string of at most 256 characters");
  }
  const scalar = value.value;
  if (!isActionScalar(scalar) || typeof scalar === "string" && Buffer.byteLength(scalar, "utf8") > 4096) {
    throw new Error("value must be a string (at most 4 KiB), finite number, or boolean");
  }
  return { kind: "document.set-field", docId, field, value: scalar, expectedVersion };
}
function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isPlainRecord(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
function kindDigest(kind2) {
  return versionOfBytes(stableJson(kind2));
}
async function launchIsCurrent(bundle, launch) {
  try {
    const registryRead = await readDocVersioned(bundle, launch.registryId);
    if (registryRead.version !== launch.registryVersion) return false;
    const registration = parseRegistration(registryRead.doc.id, registryRead.doc.frontmatter);
    if (!registration || registration.type !== launch.registryType || registration.entry !== launch.entryKey || resolveBridgeCapability(registryRead.doc.frontmatter.bridge) !== launch.capability) {
      return false;
    }
    const blob = await readBlob(bundle, launch.entryKey);
    return blob !== null && blob.version === launch.contentVersion && blob.contentType === launch.contentType;
  } catch {
    return false;
  }
}
var DEFAULT_APPROVAL_TTL_MS = 12e4;
var DEFAULT_MAX_APPROVALS = 128;
var TrustedActionService = class {
  pending = /* @__PURE__ */ new Map();
  bundle;
  launches;
  actor;
  now;
  approvalTtlMs;
  maxApprovals;
  constructor(bundle, launches, actor, now = Date.now, approvalTtlMs = DEFAULT_APPROVAL_TTL_MS, maxApprovals = DEFAULT_MAX_APPROVALS) {
    this.bundle = bundle;
    this.launches = launches;
    this.actor = actor;
    this.now = now;
    this.approvalTtlMs = approvalTtlMs;
    this.maxApprovals = maxApprovals;
  }
  async prepare(launchId, rawAction) {
    const rejected = (message) => ({ status: "rejected", action: "document.set-field", message });
    const actor = this.actor?.trim();
    if (!actor) return rejected("set an action actor with ui --actor or AGENTSTATE_LITE_ACTOR before proposing writes");
    const launch = this.launches.resolveLaunch(launchId);
    if (!launch || launch.capability !== "bundle-propose" || !await launchIsCurrent(this.bundle, launch)) {
      if (launch) this.launches.revoke(launch.launchId);
      return { status: "revoked", action: "document.set-field", message: "the source View is no longer the exact launched content" };
    }
    let action;
    try {
      action = parseDocumentSetFieldAction(rawAction);
    } catch (error) {
      return rejected(error instanceof Error ? error.message : String(error));
    }
    if (["type", "timestamp", "actor"].includes(action.field)) return rejected(`field '${action.field}' is shell-managed and cannot be proposed`);
    let target;
    try {
      target = await readDocVersioned(this.bundle, action.docId);
    } catch (error) {
      if (error?.code === "ENOENT") return rejected(`document '${action.docId}' does not exist`);
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }
    if (target.version !== action.expectedVersion) {
      return {
        status: "conflict",
        action: "document.set-field",
        docId: action.docId,
        field: action.field,
        expectedVersion: action.expectedVersion,
        actualVersion: target.version
      };
    }
    let registry;
    try {
      registry = await loadKinds(this.bundle);
    } catch (error) {
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }
    const targetType = String(target.doc.frontmatter.type ?? "");
    const kind2 = registry.kinds.get(targetType);
    if (!kind2) return rejected(`document '${action.docId}' is not governed by a declared Kind`);
    if (!kind2.fields.required.includes(action.field) && !kind2.fields.optional.includes(action.field)) {
      return rejected(`field '${action.field}' is not declared by the '${kind2.governs}' Kind`);
    }
    const beforeRaw = target.doc.frontmatter[action.field];
    let before;
    if (beforeRaw === void 0 || beforeRaw === null) {
      before = null;
    } else if (!isActionScalar(beforeRaw)) {
      return rejected(`field '${action.field}' currently contains a non-scalar value; trusted scalar actions cannot replace it`);
    } else {
      before = beforeRaw;
    }
    if (scalarEqual(beforeRaw, action.value)) {
      return {
        status: "unchanged",
        action: "document.set-field",
        docId: action.docId,
        field: action.field,
        changed: false,
        version: target.version,
        confirmed: false,
        source: { registryId: launch.registryId, registryVersion: launch.registryVersion, contentVersion: launch.contentVersion }
      };
    }
    const timestamp = new Date(this.now()).toISOString();
    const candidate = ownRecord(target.doc.frontmatter);
    setOwn4(candidate, action.field, action.value);
    setOwn4(candidate, "timestamp", timestamp);
    setOwn4(candidate, "actor", actor);
    const violations = validateAgainstKind({ id: action.docId, frontmatter: candidate, body: target.doc.body }, kind2);
    if (violations.length > 0) return rejected(violations.map((warning) => warning.message).join("; "));
    let kindVersion;
    try {
      kindVersion = (await readDocVersioned(this.bundle, kind2.id)).version;
    } catch (error) {
      return { status: "failed", action: "document.set-field", message: error instanceof Error ? error.message : String(error) };
    }
    this.sweepExpired();
    if (this.pending.size >= this.maxApprovals) return rejected("the trusted shell has too many pending confirmations; cancel one and try again");
    const token = randomBytes2(32).toString("base64url");
    const expiresAt = this.now() + this.approvalTtlMs;
    this.pending.set(token, {
      token,
      expiresAt,
      launchId,
      action,
      timestamp,
      targetTitle: typeof target.doc.frontmatter.title === "string" ? target.doc.frontmatter.title : action.docId,
      targetType,
      before,
      kindId: kind2.id,
      kindVersion,
      kindDigest: kindDigest(kind2)
    });
    return {
      status: "prepared",
      approvalToken: token,
      expiresAt,
      confirmation: {
        source: {
          registryId: launch.registryId,
          title: launch.registryTitle,
          registryVersion: launch.registryVersion,
          contentVersion: launch.contentVersion
        },
        target: { docId: action.docId, title: this.pending.get(token).targetTitle, kind: targetType, version: target.version },
        field: action.field,
        before,
        after: action.value,
        actor,
        timestamp
      }
    };
  }
  cancel(token) {
    const pending = this.consume(token);
    return pending ? { status: "cancelled", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, changed: false, confirmed: false } : { status: "expired", action: "document.set-field", message: "the approval is unknown or expired" };
  }
  async commit(token) {
    const pending = this.consume(token);
    if (!pending) return { status: "expired", action: "document.set-field", message: "the approval is unknown or expired" };
    if (this.now() > pending.expiresAt) return { status: "expired", action: "document.set-field", docId: pending.action.docId, field: pending.action.field };
    const launch = this.launches.resolveLaunch(pending.launchId);
    if (!launch || launch.capability !== "bundle-propose" || !await launchIsCurrent(this.bundle, launch)) {
      if (launch) this.launches.revoke(launch.launchId);
      return { status: "revoked", action: "document.set-field", docId: pending.action.docId, field: pending.action.field };
    }
    try {
      const target = await readDocVersioned(this.bundle, pending.action.docId);
      if (target.version !== pending.action.expectedVersion) {
        return {
          status: "conflict",
          action: "document.set-field",
          docId: pending.action.docId,
          field: pending.action.field,
          expectedVersion: pending.action.expectedVersion,
          actualVersion: target.version
        };
      }
      const registry = await loadKinds(this.bundle);
      const kind2 = registry.kinds.get(pending.targetType);
      if (!kind2 || kind2.id !== pending.kindId) return { status: "revoked", action: "document.set-field", message: "the governing Kind changed" };
      const currentKindVersion = (await readDocVersioned(this.bundle, kind2.id)).version;
      if (currentKindVersion !== pending.kindVersion || kindDigest(kind2) !== pending.kindDigest) {
        return { status: "revoked", action: "document.set-field", message: "the governing Kind changed" };
      }
      const result = await mutateDocument({
        bundle: this.bundle,
        id: pending.action.docId,
        mode: "patch",
        registry,
        strict: true,
        actor: this.actor.trim(),
        persistActor: true,
        expectedVersion: pending.action.expectedVersion,
        buildCandidate: (existing) => {
          if (!existing) throw new DocumentNotFoundError(pending.action.docId);
          const frontmatter = ownRecord(existing.frontmatter);
          setOwn4(frontmatter, pending.action.field, pending.action.value);
          setOwn4(frontmatter, "timestamp", pending.timestamp);
          return { frontmatter, body: existing.body };
        }
      });
      return {
        status: "committed",
        action: "document.set-field",
        docId: pending.action.docId,
        field: pending.action.field,
        changed: result.changed,
        version: result.version,
        warnings: result.warnings,
        confirmed: true,
        source: { registryId: launch.registryId, registryVersion: launch.registryVersion, contentVersion: launch.contentVersion }
      };
    } catch (error) {
      if (error instanceof VersionConflict) {
        return {
          status: "conflict",
          action: "document.set-field",
          docId: pending.action.docId,
          field: pending.action.field,
          expectedVersion: error.expected ?? pending.action.expectedVersion,
          actualVersion: error.actual
        };
      }
      if (error instanceof DocumentNotFoundError) {
        return { status: "conflict", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, expectedVersion: pending.action.expectedVersion, actualVersion: null };
      }
      if (error instanceof KindConformanceError) {
        return { status: "rejected", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, message: error.message };
      }
      return { status: "failed", action: "document.set-field", docId: pending.action.docId, field: pending.action.field, message: error instanceof Error ? error.message : String(error) };
    }
  }
  size() {
    this.sweepExpired();
    return this.pending.size;
  }
  consume(token) {
    const pending = this.pending.get(token);
    if (pending) this.pending.delete(token);
    return pending;
  }
  sweepExpired() {
    const now = this.now();
    for (const [token, pending] of this.pending) {
      if (now > pending.expiresAt) this.pending.delete(token);
    }
  }
};

// ../ui-server/src/proxy.ts
var HOP_BY_HOP = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host"
]);
var RESPONSE_DROP = /* @__PURE__ */ new Set(["content-encoding", "content-length"]);
function copyHeaders(from, opts = {}) {
  const out = new Headers();
  for (const [key, value] of from) {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (opts.dropCookie && lower === "cookie") continue;
    if (opts.dropContentCoding && RESPONSE_DROP.has(lower)) continue;
    out.set(key, value);
  }
  return out;
}
function freshErrorResponse(status2, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
async function proxyToRemote(request, remoteBase, apiKey, signal) {
  const incomingUrl = new URL(request.url);
  const target = new URL(remoteBase + incomingUrl.pathname + incomingUrl.search);
  target.searchParams.delete("token");
  const headers = copyHeaders(request.headers, { dropCookie: true });
  if (apiKey) headers.set("authorization", `Bearer ${apiKey}`);
  else headers.delete("authorization");
  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const bodyBytes = hasBody ? await request.arrayBuffer() : void 0;
  let upstream;
  try {
    upstream = await fetch(new Request(target, { method, headers, body: bodyBytes, signal }));
  } catch (err) {
    return freshErrorResponse(502, "RUNTIME", `could not reach remote ${remoteBase} (${err instanceof Error ? err.message : String(err)})`);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: copyHeaders(upstream.headers, { dropContentCoding: true })
  });
}

// ../ui-server/src/session.ts
import { randomBytes as randomBytes3, timingSafeEqual } from "node:crypto";
var SESSION_COOKIE_NAME = "aslite_ui_session";
function mintSessionSecret() {
  return randomBytes3(32).toString("base64url");
}
function sessionCookieHeader(secret) {
  return `${SESSION_COOKIE_NAME}=${secret}; HttpOnly; SameSite=Strict; Path=/`;
}
function readCookie(cookieHeader, name) {
  if (!cookieHeader) return void 0;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return void 0;
}
function constantTimeEqual(a, b) {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
function checkAuth(secret, tokenParam, cookieHeader) {
  if (tokenParam && constantTimeEqual(tokenParam, secret)) return { ok: true, grantsCookie: true };
  const cookie = readCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (cookie && constantTimeEqual(cookie, secret)) return { ok: true, grantsCookie: false };
  return { ok: false };
}

// ../ui-server/src/server.ts
import { createServer as createServer2 } from "node:http";

// ../ui-server/src/watch.ts
import { watch as fsWatch } from "node:fs";
var REMOTE_BUNDLE = "default";
function diffSnapshots(prev, next) {
  const docsChanged = [];
  for (const [id, version] of next.docs) {
    if (prev.docs.get(id) !== version) docsChanged.push({ id, version });
  }
  const docsRemoved = [];
  for (const id of prev.docs.keys()) {
    if (!next.docs.has(id)) docsRemoved.push(id);
  }
  const blobsChanged = [];
  for (const [key, version] of next.blobs) {
    if (prev.blobs.get(key) !== version) blobsChanged.push({ key, version });
  }
  const blobsRemoved = [];
  for (const key of prev.blobs.keys()) {
    if (!next.blobs.has(key)) blobsRemoved.push(key);
  }
  return {
    docs: { changed: docsChanged, removed: docsRemoved },
    blobs: { changed: blobsChanged, removed: blobsRemoved }
  };
}
function isEmptyChange(e) {
  return e.docs.changed.length === 0 && e.docs.removed.length === 0 && e.blobs.changed.length === 0 && e.blobs.removed.length === 0;
}
async function snapshotBundle(bundle) {
  const heads = await queryHeads(bundle, {});
  const docs = new Map(heads.map((h) => [h.id, h.version]));
  const blobs2 = /* @__PURE__ */ new Map();
  const keys = [];
  for (const prefix of PAGE_BLOB_PREFIXES) {
    try {
      keys.push(...await listBlobs(bundle, prefix));
    } catch {
    }
  }
  for (const key of keys) {
    try {
      const r = await readBlob(bundle, key);
      if (r) blobs2.set(key, r.version);
    } catch {
    }
  }
  return { docs, blobs: blobs2 };
}
async function snapshotRemote(base, apiKey, signal) {
  const docs = /* @__PURE__ */ new Map();
  const headers = {};
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  let cursor;
  do {
    const url = new URL(`${base}/v0/bundles/${REMOTE_BUNDLE}/docs`);
    url.searchParams.set("fields", "frontmatter");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers, signal });
    if (!res.ok) throw new Error(`remote snapshot failed with status ${res.status}`);
    const body = await res.json();
    for (const d of body.docs) docs.set(d.id, d.version);
    cursor = body.next_cursor ?? void 0;
  } while (cursor);
  return { docs, blobs: /* @__PURE__ */ new Map() };
}
var DEFAULT_REMOTE_BOOT_TIMEOUT_MS = 5e3;
async function takeSnapshot(opts, signal) {
  return opts.mode === "dir" ? snapshotBundle(opts.bundle) : snapshotRemote(opts.remoteBase, opts.apiKey, signal);
}
async function startWatcher(opts) {
  const aborter = new AbortController();
  const bootSignal = opts.mode === "remote" ? AbortSignal.timeout(opts.bootTimeoutMs ?? DEFAULT_REMOTE_BOOT_TIMEOUT_MS) : aborter.signal;
  let last = await takeSnapshot(opts, bootSignal);
  let stopped = false;
  let running = false;
  let rerun = false;
  const emitDiff = async () => {
    if (stopped) return;
    if (running) {
      rerun = true;
      return;
    }
    running = true;
    try {
      do {
        rerun = false;
        const next = await takeSnapshot(opts, aborter.signal);
        if (stopped) return;
        const change = diffSnapshots(last, next);
        last = next;
        if (!isEmptyChange(change)) opts.onChange(change);
      } while (rerun && !stopped);
    } catch (err) {
      if (!stopped) opts.onError?.(err);
    } finally {
      running = false;
    }
  };
  if (opts.mode === "dir") {
    const debounceMs = opts.debounceMs ?? 150;
    let timer2;
    const trigger = () => {
      if (timer2) clearTimeout(timer2);
      timer2 = setTimeout(() => {
        timer2 = void 0;
        void emitDiff();
      }, debounceMs);
      timer2.unref?.();
    };
    let watcher;
    let pollFallback;
    const startPollFallback = () => {
      if (pollFallback) return;
      pollFallback = setInterval(() => void emitDiff(), 2e3);
      pollFallback.unref?.();
    };
    try {
      watcher = fsWatch(opts.bundle.root, { recursive: true }, () => trigger());
      watcher.on("error", () => {
        watcher?.close();
        watcher = void 0;
        startPollFallback();
      });
    } catch {
      startPollFallback();
    }
    return {
      stop: async () => {
        stopped = true;
        if (timer2) clearTimeout(timer2);
        watcher?.close();
        if (pollFallback) clearInterval(pollFallback);
        aborter.abort();
      }
    };
  }
  const pollMs = opts.pollMs ?? 3e3;
  const timer = setInterval(() => void emitDiff(), pollMs);
  timer.unref?.();
  return {
    stop: async () => {
      stopped = true;
      clearInterval(timer);
      aborter.abort();
    }
  };
}

// ../ui-server/src/server.ts
var HOST = "127.0.0.1";
var REMOTE_BUNDLE2 = "default";
function jsonError(status2, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function pageError(status2, message) {
  const body = `<!doctype html><meta charset="utf-8"><title>page unavailable</title><p>${escapeHtml(message)}</p>`;
  return new Response(body, {
    status: status2,
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": pageCsp(), "referrer-policy": "no-referrer" }
  });
}
async function readPageBlob(options2, key) {
  if (options2.mode === "dir") {
    const r = await readBlob(options2.bundle, key);
    return r ? { bytes: r.bytes, contentType: r.contentType, version: r.version } : null;
  }
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  const target = `${options2.remoteBase}/v0/bundles/${REMOTE_BUNDLE2}/blobs/${encoded}`;
  const headers = {};
  if (options2.apiKey) headers.authorization = `Bearer ${options2.apiKey}`;
  const res = await fetch(target, { headers });
  if (!res.ok) return null;
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { bytes, contentType: res.headers.get("content-type") ?? "application/octet-stream", version: res.headers.get("x-version") ?? blobVersion(bytes) };
}
async function remoteRegistryHeads(options2) {
  const headers = {};
  if (options2.apiKey) headers.authorization = `Bearer ${options2.apiKey}`;
  const heads = [];
  for (const type of PAGE_TYPE_NAMES) {
    let cursor;
    do {
      const url = new URL(`${options2.remoteBase}/v0/bundles/${REMOTE_BUNDLE2}/docs`);
      url.searchParams.set("fields", "frontmatter");
      url.searchParams.set("type", type);
      url.searchParams.set("limit", "200");
      if (cursor) url.searchParams.set("cursor", cursor);
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`type=${type} listing returned status ${response.status}`);
      const body = await response.json();
      if (!Array.isArray(body.docs)) throw new Error(`type=${type} listing returned malformed data`);
      heads.push(...body.docs);
      cursor = body.next_cursor ?? void 0;
    } while (cursor);
  }
  return heads;
}
async function servePageBytes(options2, runtime, nonce) {
  const launch = runtime.launches.resolveNonce(nonce);
  if (!launch) return pageError(403, "This view link is unknown or has expired. Reopen the view from the launcher.");
  const bundle = options2.mode === "dir" ? options2.bundle : options2.kindsBundle;
  let current = false;
  try {
    if (bundle) {
      current = await launchIsCurrent(bundle, launch);
    } else if (options2.mode === "remote") {
      const head = (await remoteRegistryHeads(options2)).find((candidate) => candidate.id === launch.registryId);
      const registration = head ? parseRegistration(head.id, head.frontmatter) : null;
      const blob = registration ? await readPageBlob(options2, registration.entry) : null;
      current = Boolean(
        head && registration && head.version === launch.registryVersion && registration.type === launch.registryType && registration.entry === launch.entryKey && resolveBridgeCapability(head.frontmatter.bridge) === launch.capability && blob && blob.version === launch.contentVersion && blob.contentType === launch.contentType
      );
    }
  } catch (error) {
    return pageError(502, `The bundle's View registry could not be read (${error instanceof Error ? error.message : String(error)}). Try again.`);
  }
  if (!current) {
    runtime.launches.revoke(launch.launchId);
    return pageError(403, "This view changed after it was opened. Reopen it from the launcher.");
  }
  return new Response(launch.bytes, {
    status: 200,
    headers: {
      "content-type": launch.contentType,
      "content-security-policy": pageCsp(),
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer"
    }
  });
}
async function handleMint(req, runtime, options2) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonError(400, "USAGE", "request body must be JSON { registryId }");
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return jsonError(400, "USAGE", "request body must contain exactly registryId");
  }
  const keys = Object.keys(payload).sort();
  if (keys.length !== 1 || keys[0] !== "registryId" && keys[0] !== "key") {
    return jsonError(400, "USAGE", "request body must contain exactly registryId");
  }
  const bundle = options2.mode === "dir" ? options2.bundle : options2.kindsBundle;
  let registryId = typeof payload.registryId === "string" ? payload.registryId.trim() : "";
  const legacyKey = typeof payload.key === "string" ? payload.key.trim() : "";
  if (!registryId && legacyKey) {
    try {
      assertSafeBlobKey(legacyKey);
    } catch (error) {
      return jsonError(400, "USAGE", error instanceof Error ? error.message : String(error));
    }
    const matches = [];
    try {
      const heads = bundle ? (await Promise.all(PAGE_TYPE_NAMES.map((type) => queryHeads(bundle, { type })))).flat() : await remoteRegistryHeads(options2);
      for (const head of heads) {
        const registration2 = parseRegistration(head.id, head.frontmatter);
        if (registration2?.entry === legacyKey) matches.push(registration2.id);
      }
    } catch (error) {
      return jsonError(502, "RUNTIME", `could not read the View registry (${error instanceof Error ? error.message : String(error)})`);
    }
    registryId = matches.sort()[0] ?? "";
    if (!registryId) return jsonError(403, "FORBIDDEN", `'${legacyKey}' is not the entry of any valid registered View`);
  }
  if (!registryId) return jsonError(400, "USAGE", "request body must include a non-empty registryId");
  let registryRead;
  try {
    if (bundle) {
      registryRead = await readDocVersioned(bundle, registryId);
    } else {
      const head = (await remoteRegistryHeads(options2)).find((candidate) => candidate.id === registryId);
      if (!head) return jsonError(404, "NOT_FOUND", `View registry '${registryId}' does not exist`);
      registryRead = { doc: { id: head.id, frontmatter: head.frontmatter, body: "" }, version: head.version };
    }
  } catch (err) {
    return jsonError(err?.code === "ENOENT" ? 404 : 502, "RUNTIME", err instanceof Error ? err.message : String(err));
  }
  const registration = parseRegistration(registryRead.doc.id, registryRead.doc.frontmatter);
  if (!registration) {
    return jsonError(403, "FORBIDDEN", `'${registryId}' is not a valid type:View (or legacy type:Page) registration`);
  }
  const blob = await readPageBlob(options2, registration.entry);
  if (!blob) return jsonError(404, "NOT_FOUND", `no View bytes found for '${registration.entry}'`);
  const launch = runtime.launches.mint({
    registryId: registration.id,
    registryType: registration.type,
    registryVersion: registryRead.version,
    registryTitle: typeof registryRead.doc.frontmatter.title === "string" ? registryRead.doc.frontmatter.title : registration.id,
    entryKey: registration.entry,
    contentType: blob.contentType,
    contentVersion: blob.version,
    bytes: blob.bytes,
    capability: resolveBridgeCapability(registryRead.doc.frontmatter.bridge)
  });
  return new Response(JSON.stringify({ nonce: launch.nonce, url: `/__page/${launch.nonce}`, launchId: launch.launchId }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
async function configResponse(options2) {
  const name = options2.mode === "dir" ? options2.bundle ? options2.resolveBundleDisplayName ? await options2.resolveBundleDisplayName(options2.bundle) : "bundle" : "bundle" : (() => {
    try {
      return new URL(options2.remoteBase).host;
    } catch {
      return options2.remoteBase ?? "remote";
    }
  })();
  return new Response(
    JSON.stringify({
      mode: options2.mode,
      remoteUrl: options2.mode === "remote" ? options2.remoteBase ?? null : null,
      root: options2.mode === "dir" ? options2.bundle?.root ?? null : options2.remoteBase ?? null,
      name
    }),
    { status: 200, headers: { "content-type": "application/json; charset=utf-8" } }
  );
}
async function kindsResponse(options2) {
  const bundle = options2.mode === "dir" ? options2.bundle : options2.kindsBundle;
  let kinds2 = [];
  if (bundle) {
    try {
      kinds2 = Array.from((await loadKinds(bundle)).kinds.values());
    } catch {
      kinds2 = [];
    }
  }
  return new Response(JSON.stringify({ kinds: kinds2 }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
async function edgesResponse(options2, url) {
  const bundle = options2.mode === "dir" ? options2.bundle : options2.kindsBundle;
  const filter = {};
  const from = url.searchParams.getAll("from").map((v) => v.trim()).filter(Boolean);
  if (from.length > 0) filter.from = from;
  const to = url.searchParams.getAll("to").map((v) => v.trim()).filter(Boolean);
  if (to.length > 0) filter.to = to;
  const text = url.searchParams.get("text")?.trim();
  if (text) filter.text = text;
  let links;
  try {
    links = bundle ? await queryEdges(bundle, filter) : [];
  } catch (err) {
    return jsonError(502, "RUNTIME", `could not read the bundle's edges (${err instanceof Error ? err.message : String(err)})`);
  }
  const edges = links.map((l) => ({ from: l.from, to: l.to, text: l.text }));
  return new Response(JSON.stringify({ edges, count: edges.length }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
function actionJson(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
function exactOwnKeys(value, keys) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}
var MAX_TRUSTED_ACTION_BODY_BYTES = 16 * 1024;
async function actionPayload(req, keys) {
  if (req.headers.get("x-requested-with") !== "agentstate-lite-ui") {
    return jsonError(403, "FORBIDDEN", "trusted actions require X-Requested-With: agentstate-lite-ui");
  }
  if (req.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return jsonError(415, "USAGE", "trusted action requests require application/json");
  }
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TRUSTED_ACTION_BODY_BYTES) {
    return jsonError(413, "USAGE", "trusted action request body must be at most 16 KiB");
  }
  let text;
  try {
    text = await req.text();
  } catch {
    return jsonError(400, "USAGE", "trusted action request body could not be read");
  }
  if (Buffer.byteLength(text, "utf8") > MAX_TRUSTED_ACTION_BODY_BYTES) {
    return jsonError(413, "USAGE", "trusted action request body must be at most 16 KiB");
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    return jsonError(400, "USAGE", "trusted action request body must be valid JSON");
  }
  return exactOwnKeys(value, keys) ? value : jsonError(400, "USAGE", `trusted action request must contain exactly ${keys.join(", ")}`);
}
async function prepareAction(req, options2, runtime) {
  const payload = await actionPayload(req, ["launchId", "action"]);
  if (payload instanceof Response) return payload;
  if (options2.mode !== "dir" || !runtime.actions) {
    const result = { status: "rejected", action: "document.set-field", message: "trusted View actions are available only in local --dir mode" };
    return actionJson(result);
  }
  const launchId = typeof payload.launchId === "string" ? payload.launchId : "";
  if (!launchId || launchId.length > 256) return jsonError(400, "USAGE", "launchId must be a non-empty string of at most 256 characters");
  return actionJson(await runtime.actions.prepare(launchId, payload.action));
}
async function finishAction(req, runtime, operation) {
  const payload = await actionPayload(req, ["approvalToken"]);
  if (payload instanceof Response) return payload;
  const token = typeof payload.approvalToken === "string" ? payload.approvalToken : "";
  if (!token || token.length > 256) return jsonError(400, "USAGE", "approvalToken must be a non-empty string of at most 256 characters");
  if (!runtime.actions) {
    return actionJson({ status: "rejected", action: "document.set-field", message: "trusted View actions are unavailable" });
  }
  return actionJson(operation === "commit" ? await runtime.actions.commit(token) : runtime.actions.cancel(token));
}
async function handleRequest(req, res, options2, runtime, sessionSecret) {
  if (!isAllowedHost(req.headers.host)) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "Host header is not in the loopback allowlist"));
    return;
  }
  const origin = `http://${req.headers.host}`;
  const request = await requestFromIncomingMessage(req, origin);
  const url = new URL(request.url);
  if (url.pathname.startsWith("/__page/") && url.pathname !== "/__page/mint") {
    const nonce = decodeURIComponent(url.pathname.slice("/__page/".length));
    await writeResponseToServerResponse(res, await servePageBytes(options2, runtime, nonce));
    return;
  }
  const auth = checkAuth(sessionSecret, url.searchParams.get("token"), request.headers.get("cookie"));
  if (!auth.ok) {
    await writeResponseToServerResponse(
      res,
      jsonError(403, "FORBIDDEN", "missing or invalid session \u2014 open the printed URL (with its ?token) again")
    );
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD" && !request.headers.get("x-requested-with")) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "a mutation requires an X-Requested-With header"));
    return;
  }
  if (url.pathname === "/events" && request.method === "GET") {
    const cookieHeaders = auth.grantsCookie ? { "set-cookie": sessionCookieHeader(sessionSecret) } : {};
    runtime.sse.add(res, cookieHeaders);
    return;
  }
  let response;
  if (url.pathname === "/__page/mint" && request.method === "POST") {
    response = await handleMint(request, runtime, options2);
  } else if (url.pathname === "/__ui/actions/prepare" && request.method === "POST") {
    response = await prepareAction(request, options2, runtime);
  } else if (url.pathname === "/__ui/actions/commit" && request.method === "POST") {
    response = await finishAction(request, runtime, "commit");
  } else if (url.pathname === "/__ui/actions/cancel" && request.method === "POST") {
    response = await finishAction(request, runtime, "cancel");
  } else if (url.pathname === "/__ui/config") {
    response = await configResponse(options2);
  } else if (url.pathname === "/__ui/kinds") {
    response = await kindsResponse(options2);
  } else if (url.pathname === "/__ui/edges") {
    response = await edgesResponse(options2, url);
  } else if (url.pathname.startsWith("/v0/")) {
    response = options2.mode === "dir" ? await options2.router(request) : await proxyToRemote(request, options2.remoteBase, options2.apiKey, runtime.shutdown.signal);
  } else {
    const asset = options2.serveAsset(url.pathname, request.headers.get("accept-encoding"));
    response = new Response(asset.body, { status: asset.status, headers: asset.headers });
  }
  if (auth.grantsCookie) response.headers.append("set-cookie", sessionCookieHeader(sessionSecret));
  await writeResponseToServerResponse(res, response);
}
async function bootWatcher(options2, sse) {
  const onChange = (e) => sse.broadcast(e);
  const onError = (err) => {
    process.stderr.write(`[ui watcher] ${err instanceof Error ? err.message : String(err)}
`);
  };
  try {
    return options2.mode === "dir" ? await startWatcher({ mode: "dir", bundle: options2.bundle, onChange, onError }) : await startWatcher({
      mode: "remote",
      remoteBase: options2.remoteBase,
      apiKey: options2.apiKey,
      bootTimeoutMs: options2.watcherBootTimeoutMs,
      onChange,
      onError
    });
  } catch (err) {
    onError(err);
    return void 0;
  }
}
var CLOSE_DRAIN_WATCHDOG_MS = 5e3;
async function bootUiServer(options2) {
  const sessionSecret = options2.sessionSecret ?? mintSessionSecret();
  const launches = new PageLaunchRegistry();
  const runtime = {
    launches,
    actions: options2.mode === "dir" && options2.bundle ? new TrustedActionService(options2.bundle, launches, options2.actor) : void 0,
    sse: new SseHub(),
    shutdown: new AbortController()
  };
  runtime.watcher = await bootWatcher(options2, runtime.sse);
  return new Promise((resolve2, reject) => {
    const inFlight = /* @__PURE__ */ new Set();
    const server = createServer2((req, res) => {
      const handled = handleRequest(req, res, options2, runtime, sessionSecret).catch((err) => {
        try {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
        } catch {
          res.destroy();
        }
      });
      inFlight.add(handled);
      void handled.finally(() => inFlight.delete(handled));
    });
    server.once("error", (err) => {
      void runtime.watcher?.stop();
      runtime.sse.close();
      reject(err);
    });
    server.listen(options2.port ?? 0, HOST, () => {
      const addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject(new Error("failed to bind a TCP address"));
        return;
      }
      resolve2({
        host: HOST,
        port: addr.port,
        token: sessionSecret,
        close: async () => {
          void runtime.watcher?.stop();
          runtime.sse.close();
          const listenerClosed = new Promise(
            (resolveClose, rejectClose) => server.close((err) => err ? rejectClose(err) : resolveClose())
          );
          listenerClosed.catch(() => {
          });
          server.closeAllConnections();
          runtime.shutdown.abort();
          const drained = Promise.allSettled([...inFlight]).then(() => true);
          const bounded = await Promise.race([
            drained,
            new Promise((resolveTimeout) => setTimeout(() => resolveTimeout(false), CLOSE_DRAIN_WATCHDOG_MS).unref())
          ]);
          if (!bounded) {
            process.stderr.write("[ui] close(): a request handler did not settle within the drain window; shutting down without it\n");
          }
          await listenerClosed;
        }
      });
    });
  });
}

// src/bundle-name.ts
import path16 from "node:path";
var BUNDLE_NAME_DOC_ID = "docs/bundle";
var BUNDLE_NAME_DOC_TYPE = "Bundle Name";
var FALLBACK_NAME = "bundle";
function nonEmptyString2(value) {
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return trimmed === "" ? void 0 : trimmed;
}
async function deriveBundleDisplayName(bundle) {
  try {
    const doc2 = await readDoc(bundle, BUNDLE_NAME_DOC_ID);
    if (nonEmptyString2(doc2.frontmatter.type) === BUNDLE_NAME_DOC_TYPE) {
      const explicit = nonEmptyString2(doc2.frontmatter.name) ?? nonEmptyString2(doc2.frontmatter.title);
      if (explicit) return { name: explicit, source: "explicit" };
    }
  } catch {
  }
  const base = path16.basename(bundle.root);
  if (base === CONVENTIONAL_BUNDLE_DIR_NAME) {
    const parent = path16.basename(path16.dirname(bundle.root));
    if (parent) return { name: parent, source: "conventional-parent" };
  }
  return { name: base || FALLBACK_NAME, source: "root-basename" };
}

// src/generated/ui-assets.generated.ts
var UI_ASSETS = {
  "/assets/cormorant-garamond-500-BVPaSuim.woff2": { contentType: "font/woff2", gzipBase64: "H4sIAAAAAAAC/wH8LwPQd09GMgABAAAAAC/8AA8AAAAAgYQAAC+gAAQAQgAAAAAAAAAAAAAAAAAAAAAAAAAAGkAbIBwwBmA/U1RBVEQAg2wRCAqB6mSBt3MBNgIkA4YoC4MWAAQgBYUeByAbemVFRoaNAwAR2WGKonRyMsT/ZQI9YLzaUBGcnTZa1ECnJhFW2/2U/exeW5/td/eIxBUTRBoB4KU/cBg4ozxWA4t5mv2vYfp9b/MISWZbn/9j/l0HdvksIjg6yWawM6H9FH3D82vz/f/uqDvgsv5FJFwRV8ARLaigpKCAVTGxYjM3M9bO7JWRW1vz/276926ewNNIbfPWJ+5JLpC2gbKOPnfye/NriG0FWqdUVE5TeP6/v6lllftIgJUgVjSrqO3jZ2c8z/+9n/ucNx90eIhaE2k10aqtUhdIgEOQFYFWL8Tz595PxBFlix+O1645uFne2dYuYSptdZUFG2wG8GMFEghj3Vg7JM50/m1atv+PDCN7QTpG+4CKyut31b1UW6ZMuryrUo3/F/z5o1lpRrJ35DGODwQH0tisgEYwY4HXkuwAUyfJB0hlEDqEDgC7XLtlrui2LAJUUddviu66MmWqi629b+XpTRtbjcCSzzMb2vvHuc34tSQGS0sTEuD80g0UAHyI7lRJEIP5kc5N5xjjnGt85lxnvXOXPc799ju+chBDNOLiEUDWN59yg+LQQoSgukkO1dKDHz3a0R8/fg0EV10/fwsE5BCXTa8gf9oJUB/XBiB++eopu8x+9+s5zgAtCP1PIV8sOEG0oD5X/b8B+k64wlD2ptzuD6oGTPTkJCgA+QUwpNw4q/sZEgD4Z2UkSKRhHBKrY4b8ifdRNKlZEsBMaTDoNr504nKDFwuEax/t80kjEy+JEpXF89NY68sFI3GTMBD/mvd5/pk/E0Dk3O/9mSnLpT3Mss0CXzljp+0V8e+s+Q6ZZrGpFhpsjCGGGma4EUYaZbTpZjjuqGPm2EEPZQPhpXAgICKjoKKhYxIQccKISSipqGnorLPIeqetdk5fLm4Z2nh18vHLkSskLCKmWKky5SpUqtVTL731sdZe3U6aYrb9DvjSQft84axdBtrilCV2+9oeJ0w0yXmfm+cbEwyy1ThjjTeXmYGRlYkFwi5ZgkRJSFKlSYfDwMXCxsdxGI+ClIycllCXZg0atWrSoh+PDu36GyBbQFCWTFFxefIVKXBEoRpVqvVQp0S9lVZZbqllVkAgg9ABUHwLAJQXAOU9YLkFgPuTAACA4pKnbRQ9kGc93DACvSEiAeh2GlkrRK4IwuB+L0ZcK05EXDH0NxFeFEeSA6CXsBXxQhoWY3SFuCARASqO/GaDNgQAb2YM0RK8eInKo/wGUO+lDRWR3YaDaM8EES4AuiPyJnEusweTXUMvdOwHjeRICsAlQhDpyg7rrATR4R0Np5SfjiMHciudEliGEWGAS4SA1oMiwbmTfNvVPD5WK7HiK8JKDOK+raS0bUe6iikbsIEAPEhY7mZBbBD0+/lZ74vYUSpvJj2MeZ4oUlBcaVCIKZN2liR5+nYEpiBgwCUCUwRdRFBEeRQHjWLb5FFTZESXPOlFotcLlC13O+wI/dJnAgM8SPAEBEli0GOmlzEhEMAlgtQbGsL8R+rC4K+681Xabuf7XidFj9j2uFvaG2ue1ue8ZbCzggZ3dMvqduPYgxxA+dX/0rreb2NsiiCO7T22piGwW6FWk7bDmAMa/VjDGENYrVKMdALdaZibkQqbpKLveFp8IrgnrEoj8kImUCwSBKY+oHESJKlcpg7ICFwmgLCwvB07Qbi9eBzPScUg8JrAlSefzI3kM0FAUplA2QKEAGEA9rBKvQUwTQIrAi8JAFV2e71kxQFNouAEFeIcl8BrZWNQLhYrrz7eFZFcHi1u4O9xYeBouMmFiK0P+0V5CzQjEWODtCpIJWz81VYLg7d4qj/c1359ZC0plID1OHMdKmaH9BXDWzsAZZqoOwXIsGheg4zAqXgN4DCzlyCVQCR9nG4H4JFFJehsvX7pgfqSBklQylc6I5e4xkU34CaXwt+qH1ELVVJoj9coKC9R07QCp7QU33D0WJdCwaUhgEnEhXHdm8VqqGCzzrRaXNS4mZU3Y13Rr24Aqlgk+/rYst/fvLfs5If1NkKFnCK84SfqkabEPQAAfG385skaz9jr13OVV52ScK2WsCR+EhILbbGZn2+nMEX14psUrCH2O+7UqYD5MnOS1g5YorPPflMyCBGPhA4C6SYfz+/0oO2F2gvZslRcXviAgdH9AjuPVVor7igz8jzYDbOc0/eJBYWxBqJau302RikVpyQx9EgUUqPcckBZI8Xn2tovhyUgnzdZYbVs5s9kkMr8z6wqJW/eQkkQdxJ4Fevsb4ZH1eW+TKmAPY0lD3PDHOKSXX1GJ7TmCZcYcGshDbwwqZ468bKXGcBCYgdus+/lOqJUjrrTdR+ZWDZevcAqc5vK3jne2cqlAZNdd91bpGMoYEL785JGKocUuXZ5UE0icXr6qlBDHQZ2clXptkqcwqkAGm/19Up3IpEgt/Ly2e6whgW2WCwGwDCjPgpkeT2Vn+T5Jz9V3IVYTQaqCxTRskDWwnfibA2QQcStObOKvSV4GSwn/e1+6rGiUgVMdfuYTfISJvRts6Nj9ptiNNElssdGOhoIk1tLh+GLPXA9Iq6VsXukht6ilIb2I6qJ40nOKsqn5b1rP9N6RP5cmlvbttP9jGWmvoNobvgjfAb1MGjqM9829tLkTQ/qOh9nu17BnRcmx1GENnN5eJmlPIeAVbMaJYNmHHvwlYEndwz3txaUEpCBKJ/HxFLurNapaKt/mDpgWCD0QiKjMHwaFvOtuRGwrXqL4rjjhK1jRoZ/Mh5MnRENQtvTswGmwi/TaTaEQdjNPrOKuclIhdUCbnpKwDmQDhk4xVr7GaXZ0F7YDcJNaDkahcGvlFpRMjTWtHhDLZSgpq4gVCE1b7pVs3n0+iqf3VSYGKXf08FyIL/GBQnjyzpmg6sw36CJpdhPEZivHvFDF5RftQiX4B985yRpDODXADiBmjY/xkoo+sR9LvlLxTZgi7Mk0C2MaF4uFk3rAtmbd7ILq8vIO3OXjTpXljDiMvjS1aiYbUkhOBX+tJbZ3xUEbARyUG81AGgkcJgXCB2tqPP4RlBsIKpfEvrPl1iv862P07HO2pVy7XcUsHI++gTNr6a0w+sYVZZTadKRRfXtSbLfbUk9Vj2Sea4TWjwWNb06qNAvmeQ2kEaRMjYAoe0PivwkuLLSwhi7w+cv9ioCKvqCggA+AP/Osgsq1raVoP/ojYPzcVnBLPxp3oCQGPOjAmKEHqkvENtt/jz43guDNSjU6VYplNUvJnCVdgxYTGDXVetWIgH0GBGL2KLyD9HyUvbLwJo+KMpc3GUYq5YnvOCtmDv8TIFBQyMUW2d4aZbgnQwJrsv9uOqwdcynajextB4tjKnarA/gOUyZX6lQd7P0b2qLqjKlz5oPRZoc5kNrFMB8frJPdeTDliZx9F7jZzzLZctd7gMRn73QbdvbKeMsx0wRry+fCU4a+cmOFUxcoolRZPd72/gzPfVn/eXk+WKq++Bnl9P8uBwB3dklevZ4BLRYR0Rm7DI03Iq8z58eOmyTIGN66nnjgcJErw3QsUxyu2zcAszB8GygRSbKyWBRst9+sYsl0MJzQRKGFY4DnO/wt+tfue/SH9NrRqQyYA1H4VbfcnBeacFrsajChIWYmJritrWtOBOxZex+QZCtAzJIuXU/WZuAZZj0XftgaDy0cA4rbLs62kN/a2hDcwcpbePazE3UG/eTgCdD4AurWIWNPOUJoyIPjQxz9bhRj82+nEA053tWXSpFzOjGEGPoWJGNYIFtmI9LCA+PnvskiwoSAujiioHXsjH2NEGxDKhkTf0qF0TjV1suj2MCNlVP10up/L0DA9FVyaAI8BBc4KlQJktZ9830PpIExYnH+dR06QKiOZX6DoWxL+InZWOFkKb0LcUytBgrf7IbDSth04yKpXnNaShkJfQSpHlIIgzajr1rjmo70rWlhNs+zfHnfpPSK6SyKX9A6rB0MAiEQqpnEUMliPquBrVF3CGGKuJ87Y9XxsfA4OmVbx0UQ5pAmNamzGAxCI0ZP1llwwRufy4Csh1zzEB0vNsKBllkbEqvGjxqiys0LyMyY+pqYcQ+AweYFBeP3QbHzaLHLZFikMBDm5weQAdaDqTBCzJ6xY248HnynjTZZaZ5kXtZs4JyOdUF5c/RAUqRYLJ6REBhQBNiwY20WbPW4eFWwNa1plk6ZvxwjiGHBRgaYYHLA8AOMdQXHwEhYTZw6dBiKSNQgfbqCfuEfhinKEPg3JktesInywQWVM2VDbM1UqTeHopwv9viWy3XKRtXNrObXR3YLSdVHEDCoQKiHevmVTUxpuda8mtYz+GVt4P57NKgXKyWEw7BOL1dcaRDZ9lV7MFi3P1bA1h+PFSb22+k+NzqekFxfESvElEyfVwcOB/jv5FBrlCfMfjkLM6BH5wns3hgiVYUKRfjPHl6ZXK3ZFydpHkVUk+dfqXFn2M67ss5XIfO01JC+S4Dhglgd8GFL9DdJ3smC/i5wDN8YJEKPkSl7y1gb+rRhsoZTsdJpVNOK66L85XZJxN8ovygvkIofjHRiNafkDWd3Yt1+FVPOqEyWI6lUqyFBO7mTw5OpGeM8fXhBBfENg3BfNlC0W+7WchqlRfd2OJP+egYhGyoTgPCYq1XERgi7oGC6VGeXEoe502Wk56TgfrGjUGIJq19iGjNjiaPpKMBtFnlsMR/ad60u5gfalMUKplXEYHU15zkMhccTjgD3ZIdPD2Rgb8c0qtJOmvoy9ShYtLkvFCHmbW4iuSS7RqNE9jX2XqdRTLRwFMkdNMd5dkStinVkLn138W0Dpf0ZwA/rUEmoKbS0pKSqnklcFx5Yo0nP3qQKe0ngdpY+VCZG1R+uhrQ2tioewWJJUv24qLq9yZbncQLTQqv2UKEIOxGg4PANK5lJWjy09WRWV8DxamA9/pJKJlegqoKbKzuLXaDpFVT+GucxEOo/S/SzPWnzhroPzQaRy/WTTZSCDvbx9mDjUz47edJRVG/4BUZHJJZoqij8OoTZrmQkNK+sH6dekxBDnpCx/DFgVG6U3w/eyq3Z/RCWFTMf3fIF2ifzV+6QSqzQ1tb6ZFL/cMOk4tNd3mTQotl+d0y0VQeddFmsSLuA1Dsw0xSy8+y3e3FPDIRuwmyvtELoe/VPHDWlauc7pUlSWtZhNu2ItoEEnRTHp6T4zXoJ+JHNqiS7StUEW7xicIh21QetyctWHOj4g6NrY4PROcX473cMiKsRYXv5fGiKPW4pK8UC5bnIz0av17CKYOprvxgcjQOIQXtFJ1uwyYM54vJsz10TjOCJ2yvXh9VmeOBT1Fbg9Fx04yH3+wEyRAmUd3JOaH7KF7RNf3qcPz+qWkWQpUSE9Vo91iGBUOQeaWbaTE68urqChdyi37gOA0wejI6aLC4pZ8AhIY5/LDyhIwgW7QWjwz4J7yz3sau0DwjLxx/XG20diiSUFPu1CvUPfkxFiJKpW/pq7gbSzYFNUpJhyb9oTztRTxxH84ciuXZKBBUd1E+hiYIK+FCuh4p1ASdigY+tFjrSWj3FVE/4SfzWGtstltmCeChSX67B+r2naprp9zRUKAudefxUMHWjbdPD70seyO8Ln/Fvyp5jd6UvuQ6VrjwaJkLFaOdRe7jjWaSwztaKEyQITzPY2MpXCvsdBmvFiXPo60LSHvqkSIq/LfLWmKPzfYNojDyGYlUCi3kGARMIGq5G8oAUrrBo0LXbzKBsYGsCq945PK58Sj1OSxHz/F6tLf1lQZr36pADWUZ5wyahIWrJqpvfeMaVaMTZV6pMqQ52MBSSHcnuJFBOdVEhHWDXj/FaaSbrOodc0IXoprMBTZjStRBEWOrwDBubH+xg5fAyWBvwU2oQtLJWQU8gxIsTq1l+LxSKn7T2orG9ypO6Q1m1DlbyXxVUhyq+KWZm7Rxd1qvfIn8E6q/N4CfIM6CE0c8M9UHVXleSISLUpKR0XAtyv3DJ7Lw/v2G/ZZ16FtuQDR+6yDYDdX4mCg9vRslomLVUf674xk3q2Zm4ol4UYkam5jg+vVm450STZJtCXOZ9ZIMJaJChMrkc1AC0JXs8NZozDGzzV7a0+gRFOHF4otsSISY6wf+Bf4RtRglouxTYm4Az8nIE1UrnCUl7R8YW3YIzyS+mQdzM+Nu6RRBSnEkGM2OFvWMG03rb31gft8GbFBQgZeJH7JRIipxHZUVzgmJ8DeR4gIcr3VVvGJ6ecw6rLZ0uC6fHOsKBMbVVGTO6F+cn6HQnlIOBlYN5HAgA6akQJrhJV1tbqgQq5jFZQV6DRv/tVoE/x1inWdtu8UNuiLBu3A3dK9r5/6iSbLPZy6yvJWhhCIDut8RItiDINdPmdyizSGzXXz9Pbd3ML1JBv8gyO+XGpuy06wNTaJyUj9LmwU0vhJ/eMyYyqBP2U9rpOsn+nYQrVYfxTcw9ZS8WRZI79C8P3/YHjJvNqqBAiWiMtUP6PO018XfCj5qzKhPD8tDjOI3hTc1TtdY5gQHVSrq84jAxOfvjMn7k1mPFGI/ygoWSqJH+Bf4RyOSG4f4EbHiYT15ZCd/ye/MQ8x7v9c7jrh17Eti5SN2OkCMG/LRqkYU41xUit+EN5BGjoILL/k7VRJ7cfZJqeSipAru9yGXJNJLLMA1jbzmtGliYhpAaPkyQdjQiJnm6nRspS9l0JfQGY27vmkUYyiDPqSuzUF56ZqdfPe02rwbeB2QCPm3V/PNDb2G10iWM0hyGi3r1uM0gTCvqop/Z4TS37wgiEqxejCwsKkPSE+ljf6QBBS+dbdUKVzMh5qlp/YuPLHFE5ry4CSlfslaexrhp8RU9ujlifsAyl+18ETNGjXKoFumqJdvAx/AxP5vOdt+F5YFimI/wrVQiy+SpKdfwnRLMsrTAOtR7FeTcxQM6Uz+bXzyL7BOD4mQcZHPfUMvaurxR0y5j16UYPOZ77vRdFBNvdaEVsJUKo4hzvWhRJRSl0Z9mJT29vWj5fhrRex5SmIgjVdE44s3Hkuifcc7ygbDO3+f/6u1SJVOondzOWTGr5m2878oOo50TafU5vVaUItIrM6U1C/bJl9NXEKY89waZJjYw2G/Tcryd+HcT2nnKUrBdnIjeQuHRpu1nUUXbiP1pYz8LIFCGvkdaCeEB5mLq7SDgkXe4U2FIxWZ0UHWoip1Z0auY2jvqjFmm6/R7x7Vo9Y/b0hxcUvX7JEh6YicHr3MzP22Ve1gvfm8RXA1c3e0CotcSHO0jZxFH0LXT/AR3dsiyMrZqxqMM2xe+p9XcSIyeQS5bzvGs0QHln18yFNqwUpZOGUq/VLPc4KX74yQCEVRRIs9ZLccuNO24/+asC9hnChe7q7BHKFkqyzmNxUw5cTx64xa0XgsUf6HIuq0SyMBhYb321EhGCLkH/lfBImQtQ7TRlAMJaJGwkvhOcFLghElolgE0WLdLEiEov+O8vnzk/ITBJ7eAncukabIe53HlKVO6DZqRePESdLH8qi7uLQki9/cAK7vWR8vrNIqU7DeIhUpewnd0KruU9peW5Z/5JcD5fD3tpxskzZoNJnza3QBTvjT9nQoKXkObi2cc39Rt4Ir+ag2qgIBQ47MbxijsztzKjGD8N2KiZV43Cg4nyoyk/xyyZ0x4FylNyebFEMIkBd3SMh4Ij7FuSC5DB2YW4IqxOE4JOAEMhWZCAkwIT8QCEiUW3k/8H9oUaFElBtElPIgwoNEqJh+l3+Be8gOPB/MZ7SQCJkUPhulo0RUOcnMjXn69XOGowOcmS2RgDZl90go01x/StXs5POGNQ2pqaxrq4eoKT9jqywFrem40oux1K3I+6XvYinw49WfkTfLgum9zdwubrCyqbjV8F0SpFL/5+EClTUvtWgeVV5YlB41Ul5ifH/UdeLZv8/PJdbgPJLzxeDRgzG5DKcfbt9B2/bBfiKnveW8jMtnykf7fiAj7/KHmJMU6CArJ5A0LFD1QkZPPCX8aCQH65LkEr8gZ3/BWyZEiSjhpJHBoViyZIxpzjsJVgTzhPFfvb9uwUSmoy6gqHJQSC7f7bfAkyW9FEl0Mk91cos2E8VMDbNP3ppwwPALenMuWcl9o3DdGrPPfN4QBCjyWyZ7s3zbVGDizb538W+dodfEavYjG9SM4QaBhU/2bPsEvhSGnmQm8QoRSudpTUJi99toYjzpJX8nuyOmnpSKV2SEtxe02royCX0XnjUqKkUTywejUcLNb04iu1HFWmQ3glXJMz6fiHdSh4WtlMSCkTLN7SENaApMnQjt+AjYADbGcE5wCLef1PDwX7wFzz/NFz3m44g4U8/aa8c+TS5W3fJVugmoctlp0ZcY7qBQyZWn6C746mWHnMb7Fcy+5Ua36Ktck9187T3BGSQ1yRbt3LrGhqbFNDjMbWZrXMXWw22qYwId2UBrEEOvVjQmwG09bQnadzBVM7TpQs6b10x5O8a69HC72CChsAV62vkZqP2Jv9tDNoW2fiUbfgH6/cb3s5Fyf8LcVV1yAnE0ug6yihtK44VDI1lTarJVndHSep2rsD7OL6LMhymdhJw+8hqKrXVDce2CurB9cJ+ySTqM/3XzRs8RZtXGqHxG7UelIIueZk4lXRh0nywUc8L/bVTVThyybTpYSSifYq6pMg4OxpyDm0qna4usNeQHE+lE4kg4n7qG483lGqJDs3PGVfvlg2M9+lvDutxBeuORu9YEEj4AW8ECfBre7w3YMJ8+KcFS5+5KB2JSOK9hjq8+SCsZNmhulVcFidAZAgNLK3M9Tl9Fo8lDnLf2YacdTy90ilXrOJKHihXF8cO6nfdaZPIU9eWfEGLUkwUQiyqPo7PWmbd/w7a5q4prsqvscr/68JBcoV+o0oSVuiJvnq9vHxMp0egwdR9QPpPep6QfMXlEE3wiFDcYtwL8RuaUu5XVBrMi32+LcxW8ARm0tFwadXDviUt4NndFyIyVhyxuXtoArAkThAQ8l/DfmvSs2hjkM/LTFIKScu9CvtD3FVlwAmfyRnbtwCkr/l48RlTn6tVlHo+6ONsSZ0ulZ+enh5p3Gdy5RWUuUdFIiTZguDg1NChXeuB6D8lHSvKk30xRbIjTBIkGLSK9QEm2/2qMiSb5SBAOBsNfp92Kh2zWSEmhU9oz4NSKRbx4qESzOjq9vn2iqdIUl4xtr55kmB8p87T0MWZkVNr11TaHPO63RNliaYA9/c00UasWI483tmpNQACJUD1c85C1+JoApkHl3iTcxo7ZrfaXLMqEdDJp9Z5rHEtw9JxG/g/T1ZAIxW8wHvaksDkXr2TKI/iJMDM5qQ6wUCIqa1Wjkgvk9O+xHqLJfgRBcA24EeoRMkiE1DdcLvI/2ae9oqtSElJ1xZaWO42O456TuwRMAZG2XdMDkvuUpJxrxqhpqleEwAZcMtd0SN1KylKQTy5vsv9nbmEyNjMZUxlG90kleBNdh+heoY1n6NTX/IW3yevQrAXZC7pfLOtfHEXbH+YL1JXh/0NnU6KuI7oGaVcaoe4VMsJgxzjAZXuC3MqAaxEpSqLJa8sKJRcg9sameUkV6sFFkrk2XuNEnwiFg1f6ZHavAe3yqE2hSXv2z+EPrtKMJ+/c2h1bPFZ7SNcmo2SN4iJ9TmUd82P/gyLYAEAMNbFITDTZRyIw+YSqHjIcEUdBeDIw0F2nEeoVXSXiLFWXZ2iJ02Cd6Tupbt01LgdhlAA6dyuWBA/SW1d4znkTR6nuy9qqPi16QUlZkmByYyPcRjS5h+qXIwSc26e/2rVEL8lVTvRMLXcZHRc8p90DRQi1WmHacPnHnL9bMitdht5Oqzz2OsaUeSs8+lqrz1PT23TKZM+LZyl6B61qkzUa8ckaA26OIO2yWDMUM7lfouEqeQFFus2EWNl7yfSbiJNS8BOknxkCtaK+81qALB5BHj+LvLFJ/MOsclttfZIdp/ypo/dDeYvmivglLXnJP8aoaKgLw6Vm6t7y7s5QQSLkBhAZl3wRL5+bE17zjcXsrywvi5Xb1C9+mqautRnVOWp1kcerLA/aIixA+AwlovIWDb3lCBOVeAw3m/dixjiO8vAAAhT2yjkwwOQ5TkzjsCZVqwZEb/lJizqk0hZnZMjL/85nyQuy1KZKGTZM5HKVlVcFe1gVtvGXJZvvtQSPElHzNxpBf4XJaWqbInqiaZFDIqQiXOF4sCitulZoJtGX09KtZBImIiW5wBSjoI/zXsxQmMBJ6ocRaAmzJgyvWfX8plj071sj6908sg2HlMC1yC7/Ey7vQ2rBhmHVI29/I1aO/1tMszsmJlLoDEiE9L/+5dDPgkME1r2zot+YQysYMB3uau6DpsEq1WQpe/w35mZzwe3smmERvIqpjOLXm5VrVAQOJFncfvdS+UlyKssUMw62k6z6ffTEPUUtzVWNjy4td+6YThW/oCQ3Jpii2Eg3CSZp1UflF0mpSozjSQ8n41RsKLUe1mPWKik3LdYDh/4raYpV9CGt0np0OanIJnWiWnn/+MnvZsWckXIahTZPl3dwuBpLL2LJTBXeTKjfPBqxd9F+oZksSMNuMeMkOAHm6mIzqKlYOsYUYyzJvNcbRyHyTiSSP8Ikmblb/VM28rNTKa/h1iEm78VP3zRmYVuCYyAVUgEQTH3h1c3vJr2hvCfepB82WSzd3F83vdvsDbaTTJBwgbwn+2PN32X3+bujQxTdguPHt/nrFi00cqEgnnbpuL+dB7vHJ+8Wt7wb4pH0CvTP0amZP9MphWlUj4fEOmxqFlXjukM9ZuiJGLmILMZivRDswqYplGM9SR+e5Hl7QKo4USF62wNqbXr5FAjU/feCfk/r7MlZFSTHfqQblUxDdiHBfgJZWxgfov7e057siyfiD8xFUyDSD5eLM7a1m3Eh4MGb8Ok71F95f+ayb53SU1QMGpVIbzjuJ3NUP1sOYEIaeZspGhCYlFMFrHnJ2k6Vtlr6y9y/SayPzGTb9Q38sKF3O9A0+wN0HaIvK+tBa059ZCGtR16Zd99wWg9/puYupNlT60Flw61BNHjLKvof+ujhCsy4A9DPr4hitZPoxvghjjcSDFGxJo4GkZzE6ho259erTMIdNs1MJv/lP8OXZ2m4oRjECIHNZqVQX0xupoiyuJsS005DyiaZtuRwlcVhG+MmuJJzPDq+zlT+rVw1TMAc+4TXqdJUS1eMZDKPc5Mbvj5LDJvnzgb3SW+JXV1hznD2rnNmuJ84UwsSczztCpO9JOSSlOcYzFh3G7mZYoxwP09Muw8pTBUld9qzyQC10HtGw2SUFbfcnv00Garyq5vjk99/e1k5hV6jJqc4pNo+sn+LUI7frvDGszM0g3KSDONyE38US84d2dzbS2Oe/9rEPVWnVqoVkRxntYix2pgtzRPLv4kKdZaglC2SbY9I5vJGmLW3P3IFKp3u1au6TeCvBinUJxN7mPa76Kkle0FdiloqTKdRSWDZZozEfa6XZz7/dOGeVrzbf0DJ/StH7HbNHNWuqVKiRJRzgsXz08e3MfALO/nc9hGEbe/PTZrZML1Fv/Iwhz/LGhzKktj8pGkXrwlF3iwFkPKhgI8+hHwBNMfPVAuHij93Eqi1UvYCMvEjwbJ10BEy2yQfLO7xnclJPi+iTyGR+95qlibn8a/eJhI/adW9gVUpa6LTgByL+ePf9aPDisWvZLqtfp5QNeSORF77uKew3Ogyx5UYZpAxA0PBK0tGT5u1NjPDWt3TkpnRw2qpyciw1NRY0132unhYWnlQ4sroU+DBqi+D4OPiPE4RR3FarrQFNMhuRLka3UM2bk0kURW2TRrB9caoZ7fZgguWIeppOWg3SmrF5eJCa6P4nsBJMUaNfnqJ2xikBniSEaiCUHda5DHGqL6QzxRRaf7JQHaj0vmUdYjxUCKpTO7JzNHKxNl+843V48JKsV+qz+w7oRL8tqPJohxKOYnnpQyMTCL8evGJRGzBOStABAkj8yCeDuvy0QrQBsCz032HGewlDpe7ZlR5g95YZSpR15RKSzXFLTWNRK5wd4K5oyy5F/HA9yp0LaSWZuwjHoGpAsYooOMZJy8TGuwFPXTOsr5drbUle9bO6S8zurCemjGzvN1xj6j+G63W7vdYdNkm1oLJ4inoFzlisOm6a/rAPaQyJDFsTyrph/zz8bfb6G4oW05eixhZWLq3IC7EV1IBp6JlksDgkIsWY8LCc7BvyKgLGC2ugjqtO7NSZ4ho9YbCeOa9in/sVU6tLD9o1Eh6XZMY7uVoS6kH+kg00jBbrLmfzsYcuW6wo9Vy65hQb8guVtj81S5TY26Wfkr1sEm1pWxRxJTLb63N7RQPcUrS4lhum1L3wWYzhS2sXl2UJRQCmGjk73RJIRGyusXYSSYkohLXD/wH4SxzN7ubZYfi33IFGitKQAVfjRYO1QRPFRqrjcOdpnL0pbB9Mw8SIOUkm0MeYUWvfIkwmsmnzyH59W0/8d5lcvgr6SxBI1yHzjmiVQ8TCHLM94ei0FD8zR4jmoSCSjxO2aDBRXAx2T7qNhFCRNJP0FgdlPP9TyRs2sN3bRspOM188Ws0H+2uh3nQhq25LUEgGH4zsWu/gjX6jlT55Wx0D6zX85mZcvlQCSRC+r4TZM7nDIYoC+6Gc+6oVFuFzMlN/DvRyZoFeTn++XbhEG3W6f1fCHt+dY24b0D+0raLvHcZHOFKOkvYhHbD4gHDW7J3Lfpmb0cV7ubgwXB7Utc+JWv0XanywEy4B9YZ+MwMpWyYxFEOWO5OhyEHXT/39vcR0DeFsZVJ38JgDaMzh4OGIqHHYNKUNpvLKfOfifkvtpaDAJneRGNsJq5isjh7bdmwPLeKfvg0wpRzyfs1AuEWiBtPJM7HUe+TFiUvgkF0/nwUDSYtSl8ktr7X7Uns+BMmLoYBOG8ePFQkLnYsc9rPwHSwto71vTBlKKDQWanCkNoq97NLVaI5pcb0r6RElZByCT2cmsPg2X887sFUFEVbPMGNkN1OIjsEIU2D/xqU2Oy+ovQDEl2PnmKPXWCVVEPMat1SZoCN9a42d7jsT127aUkJeTDZskO0BRmCFPbNfjbK7/12lKjOK68Ujxksct7gbKeiStJQXX15fOk3uoSxSUfC86mhlWgymBOHfitar4WmHLRS5SxS1yBgQ9tmQxoN7X9XYOSc8dQIUK8pCK5HshRo+ukuisVJAbT16Xs7UWVW2O1CFFlA2A3pCShOL2LQRQDbDOk09ASk0aG357ueWxibkT8TGJNvi10ll6GneX2vMdkSkpUcCvkvTJ3qv3CsT7KRsqW9Rps3gP9P1Doi6QayyeGQj7s4UcjZIMkV7k7zeiBUwVSIEwSSept9hPx/5mhxRJzITgFxfGPm+d51X/vwDaCAYhfZR0c/5yYhz2dJ7s0PgP857WN0x8LsKBLHPWq4BqQAtWMLi1psieIEltP89HOBxPMDfwPvR0/bT0k3O1kJEnCcpJPp6pRqOjVSu4t5HRo7BDG9WVtaYS6jjnuP8V9uaT7Pjc7YNOHmhmW508CbX0Qe/fls499hgkYnb5r49rQroxsDjR3CAcxiE6jvXnR0qAPlubEmvijet8iaZrlHKA3kjhV/E0j5SjRwl72LxIkDVpAbwf06UyxpVmmANqAdyztWIg2rcGpWWvbi7FzeeXWAo438NqlNNY9uJyK756Gkt4mxHe/IcPcf7GDFLEpVW6OvItskYtFqqlQFHn9QJqDZ2ae69+rJr5GS+3nreRyrNGQL+lr7+0IF/WPuUZHC7KGjgsW6GPU7cgW5rZWjLZrozx9RHrYNrikdovcXdHm9zV6Xpa7MZZV91oxSV9ff7R+hdXTo5OERPYcD3xStJpjlzLNluTXZWt1PMolbZ9O3xVsb6loCxnanwpgC2Vli4th///6lurqgfsx3f3IN6mi+1iacoJGqP8+2xoxZNnVAo1Ln5KusurDEyyk2KL/TQQLuJoAWiBGfl43j5emiWd5amS+rTK3MAsUnRNV0Ep1Kf9y8l0w2JcWDg1+/oVtbORUZtr6x4QuHjcVCeA1vAhsSoeamAtyRo0OAOWXYfsjT6fPPhsRS3c0QV87b+u8GQmITJKC6ctkWDgeTSWH5xhq+lvNi7vhfuFsTzU34hCaUgGRW4A5wOCaZjFK+v0an5T6f23PYfsjX6muvVoiluqe5HDCo0dEqrQhb2iK5ts7aoiFaf0GXL6PZm+Fv6fSFAwV6aUhmt8QK5Srmd9dB2nZSmiSyppGlFvidal7Ir7GrozJDvivobW3158TbQ46h4VxDazy3XmKRnLtiIeViqzo4oH26vVlWFjG1ZmdZ2nvEB6n9FWMjOSPzgsbOstIuw8nJKBHlv+Tf4D7go0Q0rYNMfUTSf5RI50XoZOqyKr3qEYfJk1zlpwkp3rVNDPL8hS2xFp+jK68kd8yI3ILi1mxrRzBL3y8eqZdPbEkxVUkjL84rcwdOJiWhIg3YNMgbizokrEcqbyRqt0ci/fiHx4lGxflH1omsomzgXz4YHzTjB+PNwZDpgl1y4sCdHYirAygNS/F79uCX4u5/Voojksq0o12yxMRG2A2ZWdV+nyXfru7p1TIrDKGo2uwuDDByqPNhSkuibeLnxQRxfpPeG+WWK3LD7aN8YHw1c2su3Jbz3LHrZOMHF7xeNb1xwB3NgY+Y7mkOD1NcypNr7uQIqaIOvbj9SxG/zSDybQXf1i7Fn1qHX4pbdyr2QqQecOFT/CyTr86T2mTZlAFmZ1JSI24tdbcmcFNKG7BQIPYNvH+/j0GiPBfiqjgzR0zMTcBV4rpRXTn9PE/ZAuo1yzTfltSju6A1j5ueHoUEUbjmLDPhxscLBQ6Tv5Cvo16d9nNqQgMuhTr77GkMa//AUlKzaFlKzPOcELj8AK/R4B/gXsmgZTEtkZmoYv8f/VxSr22NbyTTW9FTMloX2dcQHVvRd2fHyOOT11ZxbEIaCzuhJ5sJypI6d/Zx8HeqpE9sDu6WiR6yz0fqOsp3+HnRJJlZYWLRuXNgoDC6akUBCHq4EOJ95MkT7MP9QwkAWftgL/E79tMHjGXhxj3M5Uz6MibTTm9l2PzEhHPUQyqYr1Hh3JkW0Tb/2nb9EOQH8heYxAqTaxLbNdksl5qBZEf4vkGJPNgooJAEAAlSKGjs/pQw8ksSYRFb6L8bXd+Ifj9KbiR3WT6Q+W/IQv4GMmhAvlB8z2Y+DIB+eTAQQE+qIypI65+rBnkjyZPIYz/buNNdiYz5F0fhwGK9IzfqkPw3X+rIitlt2ZHnGFE/yiem+vUWbrbVL13wvxTQdYFUVv9UaocvtJE+LL5+roVpyNUtSKeQfO4AAiI3ZlQrJddmQ33ZzxX3opRfoX2B6u9Xjl1aZO9m3qUvMDCP43P+dQqnMfRr/Lt+a36AAKALfl5sTunjjG81CH8HgK/7x1wA+L+2npO3///Zu+kDACYUAEAB/h30AcY8gP3nEaPx16W/8031NGD8r5uyBwj/2LyA8qOFAFn/cyBxmleyLKFx6dNWwqZjTVFYb232o1P9U5L3qGKy8ik/6vnDvY4m7xFcd9Cy8X9andAZUtqXsDv1ytl6avzZdQcTvNBsK2UBYOUzkhdb8GnnGm5MmPkbTBpgvwSyu2wIiHkGCR6QJgDYTXIPP49I1LvE7sSfyN+8GN/znO+Eh4vp+RFjeWPnQfvGr66X8hV0dNf46E6tl2TZwPJoN06VlSR393GCUpHDJooXN3eJsgCWqQQ5i5blnLlIm52oeUIbNhIlj771eK2mSBw9CTTunTw6lPYUmPxidY/58uDH7F01+N5Dd7WTR5EQptOMOcHSNOBOJc4rgZ0s3FIioE6AP3mJzTO2w9At7Pg5YdjGTU5+MMh1UhQfIkk1qd0JcGzv/MjW1R2M3NxL7SWhHufvJPZ8LRZEntFJkodvi8CJyiTOGqZUR3Zh5tfxP1p1ooxL/gqFlxKIIAyKHmbITLn507jqxUoQz1USV7hSReF3HAiAdyCSGleWXxG2RrBon0sGT7f3cFSaDYenRmzPYWnsuXIsBA+ITYGEVgYktopvfipIqd6ELCNjG1MdLW1zGmZGJjbnS5OggQnVqcGFWjF0fKFwfmhXQy0csDgKbTJ+xnGlJp0julDlAqaODLhlqRy2Ct+5qSEjWC4o5Y6smVWxhpaFPhtKFv7yaw4ugCWwSVdEKNFux7cd+VqKH3q4oT75wSGsgylOiNAACEcljmrcmNwAXpgHAh2kXNyJF0bkqon+D1xgWaP2JihcZylCJytqVf+mOLSYEAGKWvXKerk08OAqCc+NHxD2MGzigESKzT1DVIKr4JajxSgkCwl2HANlr0jw0ZtYYaO5asRVE6T59chIyAQy1sOD/C8AAA==" },
  "/assets/fonts/CormorantGaramond-OFL.txt": { contentType: "text/plain; charset=utf-8", gzipBase64: "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" },
  "/assets/index-DBGaUGv2.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/assets/index-DbN0OP4L.css": { contentType: "text/css; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/2WQv07DMBDG9z7F4ZnUgBgY4gwIqQsCFh7Ata/JFceOfNeUvD12UwbE9On+/b7T19745GSZEAYZQ7dpq0CwsTcKo6oNtL7IiGLBDTYzilEnOTRPCvTvINoRjZoJz1PKosClKBjL4pm8DMbjTA6bS3ELFEnIhoadDWjuV4yQBOxsX65YrGATSLDVa3sD0LLLNAnUX40akz8FLD45MadMPUXg7IzSlsuDrCl6/G5ennf2czc/bI+sulaviAstUPyCjMEoliUgD4jyFzdkPPzj7d/u3j8eX7eOuWajr+Hsk1+KeJqBvFE5Jal+pa5L16leE/4Bfdq53XIBAAA=" }
};

// src/ui/assets.ts
var serveEmbeddedUiAsset = createEmbeddedAssetHandler(UI_ASSETS);

// src/ui/server.ts
function bootUiServer2(options2) {
  return bootUiServer({
    ...options2,
    serveAsset: serveEmbeddedUiAsset,
    resolveBundleDisplayName: async (bundle) => (await deriveBundleDisplayName(bundle)).name
  });
}

// src/ui/url-file.ts
import { readFile as readFile3, unlink as unlink2 } from "node:fs/promises";
import { homedir as homedir6 } from "node:os";
import { join as join6 } from "node:path";
var UI_URL_FILE_NAME = "ui-url";
function uiUrlFilePath(home2 = homedir6()) {
  return join6(credentialsDir(home2), UI_URL_FILE_NAME);
}
async function writeUiUrlFile(url, home2 = homedir6()) {
  try {
    await writeFileAtomic0600(credentialsDir(home2), UI_URL_FILE_NAME, url + "\n");
  } catch {
  }
}
async function clearUiUrlFile(url, home2 = homedir6()) {
  try {
    const current = (await readFile3(uiUrlFilePath(home2), "utf8")).trim();
    if (current === url.trim()) await unlink2(uiUrlFilePath(home2));
  } catch {
  }
}

// src/commands/ui.ts
var UI_USAGE = `agentstate-lite ui \u2014 boot the local web UI: a launcher for the bundle's views (type: View docs, framed sandboxed with live updates; legacy type: Page docs keep working)

Usage:
  agentstate-lite ui [--dir <path> | --remote <url>] [--port <n>] [--actor <name>] [--open]

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd) \u2014 mounts the
                         reference router in-process
  --remote <url>         Reverse-proxy /v0/* to a deployed remote instead (explicit only)
  --port <p>            Port to bind (default: 0 \u2014 an OS-assigned ephemeral port)
  --actor <name>        Advisory identity for human-confirmed local View actions. Precedence:
                         --actor > AGENTSTATE_LITE_ACTOR > absent. Read-only Views need none
  --open                Open the printed URL in a browser once the server is listening
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help

The shell header shows the bundle's DISPLAY NAME: an explicit name doc when one exists
(doc write docs/bundle --type "Bundle Name" --title "<name>" \u2014 rename later via doc update),
else the project folder's name for a conventional .agentstate-lite/ bundle, else the bundle
directory's name.

No --host flag in v1 \u2014 always binds 127.0.0.1 (loopback-only; a network-exposed key proxy is a
separate, unreviewed feature). The printed URL carries a per-run session token; the first load
exchanges it for an HttpOnly, SameSite=Strict cookie. One thing IS persisted: the current run's
tokenized URL is written to ~/.agentstate/ui-url (0600) for one-click re-entry \u2014 a live
credential while this run lasts, removed on clean shutdown; after a crash the leftover token is
dead (the server is gone, and the secret rotates next boot).
`;
function defaultWaitForShutdown2() {
  return new Promise((resolve2) => {
    process.once("SIGINT", () => resolve2());
    process.once("SIGTERM", () => resolve2());
  });
}
function defaultOpenBrowser(url) {
  try {
    const platform = process.platform;
    const [cmd, args] = platform === "darwin" ? ["open", [url]] : platform === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    spawn2(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
  }
}
function stablePortFor(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const span = 65536 - 49152;
  return 49152 + Math.abs(h) % span;
}
function mapBootError2(err, port) {
  if (err instanceof CliError) return err;
  if (err?.code === "EADDRINUSE") {
    return new CliError("RUNTIME", `port ${port} is already in use \u2014 something else is listening there`, {
      help: `${cliInvocation()} ui --port 0 (ephemeral port), or pass a different --port`
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message);
}
async function ui(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const bootUiServer3 = deps.bootUiServer ?? bootUiServer2;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown2;
  const openBrowser = deps.openBrowser ?? defaultOpenBrowser;
  const writeUrlFile = deps.writeUrlFile ?? ((url2) => writeUiUrlFile(url2));
  const clearUrlFile = deps.clearUrlFile ?? ((url2) => clearUiUrlFile(url2));
  const { values } = parseOrUsage(
    () => parseArgs20({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        port: { type: "string" },
        actor: { type: "string" },
        open: { type: "boolean" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "ui"
  );
  if (values.help) {
    stdout(UI_USAGE);
    return;
  }
  let port = 0;
  const explicitPort = values.port !== void 0;
  if (values.port !== void 0) {
    const raw = values.port.trim();
    if (!/^\d+$/.test(raw) || Number(raw) > 65535) {
      throw new CliError("USAGE", "--port must be an integer between 0 and 65535", {
        help: `${cliInvocation()} ui --port <p>`
      });
    }
    port = Number(raw);
  }
  const remoteFlag = await resolveRemoteFlag(values.remote, values.dir);
  const actor = resolveActor(values.actor, { help: `${cliInvocation()} ui --actor <name>` });
  let options2;
  let rootLabel;
  if (remoteFlag) {
    if (values.dir) {
      throw new CliError("USAGE", "--remote and --dir are mutually exclusive", {
        help: `${cliInvocation()} ui --remote <url>`
      });
    }
    let base;
    let origin;
    try {
      const resolved = normalizeServer(remoteFlag);
      base = resolved.base;
      origin = resolved.resource;
    } catch (err) {
      throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
        help: `${cliInvocation()} ui --remote http://127.0.0.1:4818`
      });
    }
    const envKey = process.env[API_KEY_ENV_VAR]?.trim();
    const apiKey = envKey || await getApiKeyForOrigin(origin);
    const kindsBundle = await openBundle(void 0, remoteFlag);
    options2 = { mode: "remote", port, remoteBase: base, apiKey, kindsBundle, actor };
    rootLabel = base;
  } else {
    const bundle = await openBundle(values.dir);
    const router = createRouter(bundle);
    options2 = { mode: "dir", port, router, bundle, actor };
    rootLabel = bundle.root;
  }
  let usedStablePort = false;
  if (!explicitPort) {
    options2.port = stablePortFor(rootLabel);
    usedStablePort = true;
  }
  let handle;
  try {
    handle = await bootUiServer3(options2);
  } catch (err) {
    if (usedStablePort && err?.code === "EADDRINUSE") {
      options2.port = 0;
      usedStablePort = false;
      try {
        handle = await bootUiServer3(options2);
      } catch (err2) {
        throw mapBootError2(err2, 0);
      }
    } else {
      throw mapBootError2(err, options2.port ?? port);
    }
  }
  const url = `http://${handle.host}:${handle.port}/?token=${handle.token}`;
  await writeUrlFile(url);
  stdout(
    render(
      {
        ui: "listening",
        url,
        mode: options2.mode,
        root: rootLabel,
        auth: "per-run session SECRET, minted fresh each boot; the first load exchanges the URL token for an HttpOnly, SameSite=Strict cookie. The current TOKENIZED URL \u2014 a live credential while this run lasts, since it embeds the token \u2014 is written to ~/.agentstate/ui-url (0600) for one-click re-entry and cleared on clean shutdown; a crash leaves only a stale URL whose token dies with this process (the secret rotates next boot)",
        help: [
          `open ${url} in a browser`,
          ...usedStablePort ? [`this host:port is stable for this bundle \u2014 on restart, reopen the freshly-printed URL (the token rotates each run)`] : []
        ]
      },
      resolveMode(values)
    )
  );
  if (values.open) openBrowser(url);
  await waitForShutdown();
  await handle.close();
  await clearUrlFile(url);
}

// src/commands/sync/orchestrate.ts
import path19 from "node:path";
import { parseArgs as parseArgs22 } from "node:util";

// src/commands/hook.ts
import {
  chmodSync,
  existsSync as existsSync6,
  lstatSync as lstatSync2,
  readFileSync as readFileSync4,
  realpathSync as realpathSync7,
  renameSync as renameSync2,
  rmSync as rmSync2,
  statSync as statSync4,
  writeFileSync as writeFileSync3
} from "node:fs";
import { homedir as homedir7 } from "node:os";
import { join as join8, dirname as dirname3 } from "node:path";
import { mkdirSync as mkdirSync2 } from "node:fs";
import { parseArgs as parseArgs21 } from "node:util";

// src/host-config.ts
import { join as join7 } from "node:path";
var HOST_CONFIG_ROOTS = {
  claude: { env: "CLAUDE_CONFIG_DIR", fallbackDirectory: ".claude" },
  codex: { env: "CODEX_HOME", fallbackDirectory: ".codex" }
};
function resolveHostConfigRoot(config, home2, env) {
  const configured = env[config.env];
  return configured === void 0 || configured.length === 0 ? join7(home2, config.fallbackDirectory) : configured;
}

// src/commands/hook.ts
var HOOK_USAGE = `agentstate-lite hook \u2014 manage the SessionStart board-aware hook

Usage:
  agentstate-lite hook install   [--scope project|global]
  agentstate-lite hook status    [--scope project|global]
  agentstate-lite hook uninstall [--scope project|global]

Installs (or removes) a SessionStart hook that runs \`session-start\` \u2014 a time-boxed best-effort
board pull, then the home view \u2014 as ambient context at the start of every agent session, for
Claude Code, Codex, AND OpenCode. Idempotent: re-installing the same hook is a no-op; uninstalling
an absent hook is a no-op. Re-run install after upgrading from a pre-session-start version: the
old hook rendered the home view without pulling the board first.

Options:
  --scope project   Write to the CURRENT project (default): .claude/, .codex/, .config/opencode/
  --scope global    Write to each host's configured USER home (environment override or default)
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;
var HOOK_MARKER = "agentstate-lite";
var NEW_BIN_COMMAND_RE = /^\s*(?:"(?:[^"]*\/)?aslite"|(?:[^\s"]*\/)?aslite)(?:\s|$)/;
function isManagedHookCommand(command) {
  return command.includes(HOOK_MARKER) || NEW_BIN_COMMAND_RE.test(command);
}
var HOOK_TIMEOUT_SECONDS = 10;
var HOOK_SUBCOMMAND = "session-start";
var OPENCODE_PLUGIN_FILENAME = "axi-agentstate-lite.js";
var OPENCODE_MANAGED_MARKER = `axi-sdk-js managed opencode plugin: ${HOOK_MARKER}`;
function sessionStartHookCommand(base = hookCommand()) {
  const quoted = /\s/.test(base) ? JSON.stringify(base) : base;
  const command = `${quoted} ${HOOK_SUBCOMMAND}`;
  if (!isManagedHookCommand(command)) {
    throw new Error(
      `composed hook command ${JSON.stringify(command)} would not be recognized as managed \u2014 refusing to install an orphan hook`
    );
  }
  return command;
}
function isManagedHook(hook2) {
  return typeof hook2?.command === "string" && isManagedHookCommand(hook2.command);
}
function computeSessionStartHookInstall(settings, spec) {
  const updated = structuredClone(settings);
  let changed = false;
  if (!updated.hooks) {
    updated.hooks = {};
    changed = true;
  }
  const hooks = updated.hooks;
  if (Array.isArray(hooks.session_start)) {
    const kept = hooks.session_start.filter((h) => !isManagedHook(h));
    if (kept.length !== hooks.session_start.length) {
      changed = true;
      if (kept.length === 0) delete hooks.session_start;
      else hooks.session_start = kept;
    }
  }
  if (!Array.isArray(hooks.SessionStart)) {
    hooks.SessionStart = [];
    changed = true;
  }
  const timeout = spec.timeoutSeconds ?? HOOK_TIMEOUT_SECONDS;
  let rewritten = false;
  const newGroups = [];
  for (const group of hooks.SessionStart) {
    if (!Array.isArray(group?.hooks)) {
      newGroups.push(group);
      continue;
    }
    const keptHooks = [];
    for (const h of group.hooks) {
      if (!isManagedHook(h)) {
        keptHooks.push(h);
        continue;
      }
      if (rewritten) {
        changed = true;
        continue;
      }
      rewritten = true;
      if (h.command !== spec.command || h.type !== "command" || h.timeout !== timeout) {
        changed = true;
        h.command = spec.command;
        h.type = "command";
        h.timeout = timeout;
      }
      keptHooks.push(h);
    }
    if (keptHooks.length !== group.hooks.length) {
      if (keptHooks.length === 0) continue;
      group.hooks = keptHooks;
    }
    newGroups.push(group);
  }
  hooks.SessionStart = newGroups;
  if (!rewritten) {
    hooks.SessionStart.push({
      matcher: "",
      hooks: [{ type: "command", command: spec.command, timeout }]
    });
    changed = true;
  }
  return changed ? [updated, true] : [settings, false];
}
function computeHookUninstall(settings) {
  const updated = structuredClone(settings);
  let changed = false;
  const hooks = updated.hooks;
  if (!hooks) return [settings, false];
  if (Array.isArray(hooks.session_start)) {
    const kept = hooks.session_start.filter((h) => !isManagedHook(h));
    if (kept.length !== hooks.session_start.length) {
      changed = true;
      if (kept.length === 0) delete hooks.session_start;
      else hooks.session_start = kept;
    }
  }
  if (Array.isArray(hooks.SessionStart)) {
    const newGroups = [];
    for (const group of hooks.SessionStart) {
      if (!Array.isArray(group?.hooks)) {
        newGroups.push(group);
        continue;
      }
      const keptHooks = group.hooks.filter((h) => !isManagedHook(h));
      if (keptHooks.length !== group.hooks.length) {
        changed = true;
        if (keptHooks.length === 0) continue;
        newGroups.push({ ...group, hooks: keptHooks });
      } else {
        newGroups.push(group);
      }
    }
    if (changed) hooks.SessionStart = newGroups;
  }
  return changed ? [updated, true] : [settings, false];
}
function readHookStatus(settings) {
  const hooks = settings.hooks;
  if (hooks) {
    if (Array.isArray(hooks.SessionStart)) {
      for (const group of hooks.SessionStart) {
        if (!Array.isArray(group?.hooks)) continue;
        for (const h of group.hooks) {
          if (isManagedHook(h)) return { installed: true, command: h.command };
        }
      }
    }
    if (Array.isArray(hooks.session_start)) {
      for (const h of hooks.session_start) {
        if (isManagedHook(h)) return { installed: true, command: h.command };
      }
    }
  }
  return { installed: false };
}
function targetsForBase(base) {
  return {
    claudeSettings: join8(base, ".claude", "settings.json"),
    codexHooks: join8(base, ".codex", "hooks.json"),
    codexConfig: join8(base, ".codex", "config.toml"),
    opencodePlugin: join8(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME)
  };
}
function configuredPath(value, fallback) {
  return value === void 0 || value.length === 0 ? fallback : value;
}
function globalHookTargets(home2 = homedir7(), env = process.env) {
  const claudeHome = resolveHostConfigRoot(HOST_CONFIG_ROOTS.claude, home2, env);
  const codexHome = resolveHostConfigRoot(HOST_CONFIG_ROOTS.codex, home2, env);
  const xdgConfigHome = configuredPath(env.XDG_CONFIG_HOME, join8(home2, ".config"));
  const opencodeHome = configuredPath(env.OPENCODE_CONFIG_DIR, join8(xdgConfigHome, "opencode"));
  return {
    claudeSettings: join8(claudeHome, "settings.json"),
    codexHooks: join8(codexHome, "hooks.json"),
    codexConfig: join8(codexHome, "config.toml"),
    opencodePlugin: join8(opencodeHome, "plugins", OPENCODE_PLUGIN_FILENAME)
  };
}
function targetSets(bases, deps) {
  if (bases !== void 0) return bases.map(targetsForBase);
  const cwd = deps.cwd ?? process.cwd();
  const home2 = deps.home ?? homedir7();
  const env = deps.env ?? process.env;
  return [targetsForBase(cwd), globalHookTargets(home2, env)];
}
function readSettings(path23) {
  if (!existsSync6(path23)) return {};
  try {
    return JSON.parse(readFileSync4(path23, "utf8"));
  } catch {
    return {};
  }
}
function isPlainObject3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readSettingsForInstall(path23) {
  if (!existsSync6(path23)) return { ok: true, settings: {} };
  let raw;
  try {
    raw = readFileSync4(path23, "utf8");
  } catch (err) {
    return { ok: false, reason: `unreadable (${err instanceof Error ? err.message : String(err)})` };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { ok: false, reason: `unparseable JSON (${err instanceof Error ? err.message : String(err)})` };
  }
  if (!isPlainObject3(parsed)) {
    return { ok: false, reason: "settings root is not a JSON object" };
  }
  const hooks = parsed.hooks;
  if (hooks !== void 0) {
    if (!isPlainObject3(hooks)) {
      return { ok: false, reason: "`hooks` is not a JSON object" };
    }
    if (hooks.SessionStart !== void 0) {
      if (!Array.isArray(hooks.SessionStart)) {
        return { ok: false, reason: "`hooks.SessionStart` exists but is not an array" };
      }
      for (const [i, group] of hooks.SessionStart.entries()) {
        if (!isPlainObject3(group)) {
          return { ok: false, reason: `\`hooks.SessionStart[${i}]\` is not an object` };
        }
        if (group.hooks !== void 0) {
          if (!Array.isArray(group.hooks)) {
            return { ok: false, reason: `\`hooks.SessionStart[${i}].hooks\` exists but is not an array` };
          }
          for (const [j, entry] of group.hooks.entries()) {
            if (!isPlainObject3(entry)) {
              return { ok: false, reason: `\`hooks.SessionStart[${i}].hooks[${j}]\` is not an object` };
            }
          }
        }
      }
    }
    if (hooks.session_start !== void 0) {
      if (!Array.isArray(hooks.session_start)) {
        return { ok: false, reason: "`hooks.session_start` exists but is not an array" };
      }
      for (const [i, entry] of hooks.session_start.entries()) {
        if (!isPlainObject3(entry)) {
          return { ok: false, reason: `\`hooks.session_start[${i}]\` is not an object` };
        }
      }
    }
  }
  return { ok: true, settings: parsed };
}
function resolveWriteDestination(path23) {
  let isLink = false;
  try {
    isLink = lstatSync2(path23).isSymbolicLink();
  } catch {
    return path23;
  }
  if (!isLink) return path23;
  try {
    return realpathSync7(path23);
  } catch {
    throw new Error(`dangling symlink at ${path23} \u2014 refusing to write through it; fix or remove the link`);
  }
}
function atomicWriteFileSync(path23, content) {
  const destination = resolveWriteDestination(path23);
  mkdirSync2(dirname3(destination), { recursive: true });
  const mode = existsSync6(destination) ? statSync4(destination).mode & 4095 : void 0;
  const tmp = `${destination}.tmp-${process.pid}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    writeFileSync3(tmp, content, mode !== void 0 ? { mode } : {});
    if (mode !== void 0) chmodSync(tmp, mode);
    renameSync2(tmp, destination);
  } catch (err) {
    rmSync2(tmp, { force: true });
    throw err;
  }
}
function writeSettings(path23, settings) {
  atomicWriteFileSync(path23, `${JSON.stringify(settings, null, 2)}
`);
}
function opencodePluginInstalled(path23) {
  if (!existsSync6(path23)) return false;
  try {
    return readFileSync4(path23, "utf8").includes(OPENCODE_MANAGED_MARKER);
  } catch {
    return false;
  }
}
function buildOpenCodePluginSource(base, timeoutSeconds = HOOK_TIMEOUT_SECONDS) {
  return `// ${OPENCODE_MANAGED_MARKER}
// Generated by \`agentstate-lite hook install\` (axi-sdk-js managed-marker compatible). It is safe
// to edit only if you remove the managed marker above.
import { spawn } from "node:child_process";

const command = ${JSON.stringify(base)};
const commandArgs = [${JSON.stringify(HOOK_SUBCOMMAND)}];
const marker = ${JSON.stringify(HOOK_MARKER)};
const ambientHeader = ${JSON.stringify(`## AXI ambient context: ${HOOK_MARKER}`)};
const timeoutMs = ${JSON.stringify(timeoutSeconds * 1e3)};

function runAxiSessionStart(cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      cwd: directoryOrFallback(cwd),
      env: process.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      resolve("error: " + marker + " ambient context timed out after " + timeoutMs + "ms");
    }, timeoutMs);

    child.stdout?.setEncoding("utf-8");
    child.stderr?.setEncoding("utf-8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve("error: " + marker + " ambient context failed: " + error.message);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }
      const message = (stderr || stdout || marker + " exited with code " + code).trim();
      resolve("error: " + marker + " ambient context failed: " + message);
    });
  });
}

function directoryOrFallback(directory) {
  return typeof directory === "string" && directory.length > 0
    ? directory
    : process.cwd();
}

export const AxiAgentstateLiteAmbientContextPlugin = async ({ directory }) => {
  const sessionCache = new Map();

  return {
    "experimental.chat.system.transform": async (input, output) => {
      const sessionID = input.sessionID ?? "__global__";
      let homeView = sessionCache.get(sessionID);
      if (homeView === undefined) {
        homeView = await runAxiSessionStart(directory);
        sessionCache.set(sessionID, homeView);
      }

      if (homeView.length === 0) return;
      output.system.push(ambientHeader + "\\n" + homeView);
    },
  };
};
`;
}
function hookNeedsUpdate(bases, deps = {}) {
  for (const targets of targetSets(bases, deps)) {
    for (const p of [targets.claudeSettings, targets.codexHooks]) {
      const s = readHookStatus(readSettings(p));
      if (s.installed && s.command !== void 0 && !s.command.includes(HOOK_SUBCOMMAND)) return true;
    }
    if (opencodePluginInstalled(targets.opencodePlugin)) {
      try {
        if (!readFileSync4(targets.opencodePlugin, "utf8").includes(HOOK_SUBCOMMAND)) return true;
      } catch {
      }
    }
  }
  return false;
}
function hookInstalled(bases, deps = {}) {
  for (const targets of targetSets(bases, deps)) {
    for (const p of [targets.claudeSettings, targets.codexHooks]) {
      if (readHookStatus(readSettings(p)).installed) return true;
    }
    if (opencodePluginInstalled(targets.opencodePlugin)) return true;
  }
  return false;
}
async function hook(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs21({
      args: argv,
      options: {
        scope: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "hook"
  );
  if (values.help) {
    stdout(HOOK_USAGE);
    return;
  }
  const sub = positionals[0];
  if (sub !== "install" && sub !== "status" && sub !== "uninstall") {
    throw new CliError(
      "USAGE",
      sub === void 0 ? "hook requires a subcommand (install|status|uninstall)" : `unknown hook subcommand: ${sub} (expected install|status|uninstall)`,
      { help: `${cliInvocation()} hook install|status|uninstall [--scope project|global]` }
    );
  }
  const scope = values.scope ?? "project";
  if (scope !== "project" && scope !== "global") {
    throw new CliError("USAGE", `unsupported hook scope: ${scope} (expected project|global)`, {
      help: `${cliInvocation()} hook ${sub} --scope project|global`
    });
  }
  const targets = deps.base !== void 0 ? targetsForBase(deps.base) : scope === "global" ? globalHookTargets(deps.home ?? homedir7(), deps.env ?? process.env) : targetsForBase(deps.cwd ?? process.cwd());
  const mode = resolveMode(values);
  if (sub === "status") {
    const claude = readHookStatus(readSettings(targets.claudeSettings));
    const codex = readHookStatus(readSettings(targets.codexHooks));
    const opencode = opencodePluginInstalled(targets.opencodePlugin);
    let wouldInstall;
    try {
      wouldInstall = sessionStartHookCommand(deps.commandBase);
    } catch {
      wouldInstall = void 0;
    }
    const display = claude.command ? collapseHomeDirectory2(claude.command) : wouldInstall;
    stdout(
      render(
        {
          hook: {
            action: "status",
            scope,
            installed: claude.installed || codex.installed || opencode,
            claude_code: claude.installed,
            codex: codex.installed,
            opencode,
            ...display !== void 0 ? { command: display } : {},
            targets: {
              claude_code: collapseHomeDirectory2(targets.claudeSettings),
              codex: collapseHomeDirectory2(targets.codexHooks),
              opencode: collapseHomeDirectory2(targets.opencodePlugin)
            }
          }
        },
        mode
      )
    );
    return;
  }
  if (sub === "install") {
    const errors = [];
    const refusals = [];
    const failTarget = (target, err) => refusals.push(
      `${collapseHomeDirectory2(target)}: ${err instanceof Error ? err.message : String(err)} \u2014 this target was not installed`
    );
    const commandBase = deps.commandBase ?? hookCommand();
    let command;
    try {
      command = sessionStartHookCommand(commandBase);
    } catch (err) {
      throw new CliError("RUNTIME", err instanceof Error ? err.message : String(err), {
        details: { command_base: collapseHomeDirectory2(commandBase) },
        help: "install from a channel whose executable resolves as aslite/agentstate-lite (e.g. npm install -g aslite), then re-run hook install"
      });
    }
    for (const target of [targets.claudeSettings, targets.codexHooks]) {
      try {
        const read = readSettingsForInstall(target);
        if (!read.ok) {
          refusals.push(`${collapseHomeDirectory2(target)}: ${read.reason} \u2014 nothing was written to this file`);
          continue;
        }
        const [updated, changed2] = computeSessionStartHookInstall(read.settings, {
          command,
          timeoutSeconds: HOOK_TIMEOUT_SECONDS
        });
        if (changed2) writeSettings(target, updated);
      } catch (err) {
        failTarget(target, err);
      }
    }
    const codexConfigPath = targets.codexConfig;
    try {
      const current = existsSync6(codexConfigPath) ? readFileSync4(codexConfigPath, "utf8") : "";
      const [updated, changed2] = computeCodexConfigUpdate(current);
      if (changed2) atomicWriteFileSync(codexConfigPath, updated);
    } catch (err) {
      failTarget(codexConfigPath, err);
    }
    try {
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync6(targets.opencodePlugin) ? readFileSync4(targets.opencodePlugin, "utf8") : void 0;
      if (current !== void 0 && !current.includes(OPENCODE_MANAGED_MARKER)) {
        errors.push(`${targets.opencodePlugin}: refusing to overwrite unmanaged OpenCode plugin`);
      } else if (current !== next) {
        atomicWriteFileSync(targets.opencodePlugin, next);
      }
    } catch (err) {
      failTarget(targets.opencodePlugin, err);
    }
    if (refusals.length > 0) {
      throw new CliError(
        "RUNTIME",
        `hook install failed for ${refusals.length} target(s); other targets were still processed`,
        {
          details: { refused: refusals, ...errors.length > 0 ? { errors } : {} },
          help: "fix or remove the named file(s), then re-run hook install"
        }
      );
    }
    const out = {
      action: "install",
      scope,
      installed: true,
      command,
      targets: {
        claude_code: collapseHomeDirectory2(targets.claudeSettings),
        codex: collapseHomeDirectory2(targets.codexHooks),
        opencode: collapseHomeDirectory2(targets.opencodePlugin)
      }
    };
    if (errors.length > 0) out.errors = errors;
    stdout(render({ hook: out }, mode));
    return;
  }
  let changed = false;
  for (const path23 of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path23));
    if (didChange) {
      writeSettings(path23, updated);
      changed = true;
    }
  }
  if (opencodePluginInstalled(targets.opencodePlugin)) {
    rmSync2(targets.opencodePlugin, { force: true });
    changed = true;
  }
  stdout(
    render(
      {
        hook: {
          action: "uninstall",
          scope,
          installed: false,
          changed,
          targets: {
            claude_code: collapseHomeDirectory2(targets.claudeSettings),
            codex: collapseHomeDirectory2(targets.codexHooks),
            opencode: collapseHomeDirectory2(targets.opencodePlugin)
          }
        }
      },
      mode
    )
  );
}

// src/sync-cli.ts
async function hookInstallHintOnce(key, inv, installed = hookInstalled) {
  try {
    if (installed()) return void 0;
    if (await defaultSyncStore.readHookHintedAt(key) !== null) return void 0;
    await defaultSyncStore.recordHookHinted(key);
    return `no SessionStart hook is installed \u2014 run \`${inv} hook install\` once and every new agent session will start with the board pulled and rendered`;
  } catch {
    return void 0;
  }
}

// src/commands/sync/establish.ts
import { existsSync as existsSync7, lstatSync as lstatSync3, readdirSync as readdirSync2, renameSync as renameSync3, rmSync as rmSync3 } from "node:fs";
import path17 from "node:path";

// src/sync-outcomes.ts
function upstreamHelp(inv) {
  return `if a teammate already shares this project's board, make sure your \`origin\` remote points at the SAME repository they pushed the \`board\` branch to; if nobody has started sharing this project's board yet, run \`${inv} sync --establish\` to start \u2014 until then a local-only board is a supported mode: every local command keeps working, and nothing leaves this machine`;
}
function syncInTreeRefusalMessage(inv, hasOrigin = true) {
  const establishRemedy = hasOrigin ? `run '${inv} sync --establish' to move the board to a dedicated '${BOARD_BRANCH}' branch` : `this repo has no '${BOARD_REMOTE}' remote yet \u2014 run 'git remote add ${BOARD_REMOTE} <url>', then '${inv} sync --establish' to move the board to a dedicated '${BOARD_BRANCH}' branch`;
  return `this board rides your code branch \u2014 '${BUNDLE_DIR}/' is committed with the code, so a full sync would have to publish the code branch itself; share board changes with your normal git commit/push, run '${inv} sync --pull-only' to fetch-and-report incoming board changes, or ${establishRemedy}`;
}
var SHOW_INCOMING_NO_UPSTREAM = "there is no fetched origin/board state to show \u2014 either this board is local-only (no remote board branch, so no incoming versions exist), or nothing has been fetched yet";
function boardNotPublishedMessage(inv) {
  return `the local board has not been published \u2014 bare sync never creates origin/${BOARD_BRANCH}; run '${inv} sync --establish' to publish it explicitly`;
}
function namespaceConflictMessage(conflicts) {
  return `establish refused: branches named '${BOARD_BRANCH}/\u2026' exist \u2014 git cannot create a '${BOARD_BRANCH}' branch alongside them: ${conflicts.join(", ")}`;
}
function markerUnavailableMessage(marker) {
  return `the establishment marker names an unavailable commit (${marker}); nothing was changed`;
}
function inTreeNoBasisNote(reason, ref) {
  const cause = reason === "detached-head" ? "the checkout is on a detached HEAD (no branch, so no tracking upstream)" : reason === "no-upstream" ? "the current branch has no upstream tracking configured" : `the branch's tracking ref '${ref ?? "?"}' does not resolve (never fetched, or deleted on the remote)`;
  return `${cause} \u2014 there is nothing to fetch from or compare against, so board freshness is unknown; sync will not guess an upstream`;
}
var BOARD_UP_TO_DATE = "up to date";
var BOARD_OFFLINE_NOTE = "board sync offline \u2014 showing last known state";
function boardFirstContactLine(inv) {
  return `not yet provisioned \u2014 run \`${inv} sync\` to set it up`;
}
var BOARD_IN_TREE_LINE = `rides this branch \u2014 '${BUNDLE_DIR}/' is committed with the code; teammates' board changes arrive with your normal 'git pull'`;
function inTreePullHintLine(n) {
  return `${n} incoming board ${n === 1 ? "change is" : "changes are"} not yet in this checkout \u2014 run 'git pull' to get ${n === 1 ? "it" : "them"}`;
}
function inTreeUnpushedLine(n) {
  return `${n} board ${n === 1 ? "commit" : "commits"} on this branch not yet pushed \u2014 'git push' shares ${n === 1 ? "it" : "them"}`;
}
function inTreeUncommittedLine(n) {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} \u2014 commit ${n === 1 ? "it" : "them"} with your normal git flow to share`;
}
function unpushedLine(n) {
  return `${n} local board ${n === 1 ? "commit" : "commits"} not yet pushed \u2014 run sync when online`;
}
function uncommittedLine(n) {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} \u2014 run sync to share ${n === 1 ? "it" : "them"}`;
}
var row = (r) => r;
var line = (message) => ({ message });
function unshallowCmd() {
  return `git fetch --unshallow ${BOARD_REMOTE}`;
}
var SYNC_OUTCOMES = {
  // ffSwallowToError family: `sync --pull-only`'s structured translation of the fail-soft pull's
  // swallow reasons (the SessionStart caller swallows the same reasons silently).
  "ff.git-missing": row({
    code: "GIT_MISSING",
    message: () => "sync needs git, which isn't installed on this machine",
    help: () => "install git (https://git-scm.com/downloads), then re-run the command"
  }),
  "ff.no-upstream.unpublished": row({
    code: "NO_UPSTREAM",
    message: (p) => boardNotPublishedMessage(p.inv),
    help: (p) => `${p.inv} sync --establish`
  }),
  "ff.no-upstream.unlinked": row({
    code: "NO_UPSTREAM",
    message: () => "the board branch isn't linked to a remote \u2014 there is nothing to pull from or push to (a local-only board is a supported mode; sharing needs a remote 'board' branch)",
    help: (p) => upstreamHelp(p.inv)
  }),
  "ff.auth": row({
    code: "AUTH_REQUIRED",
    message: () => "sync was denied access to the remote (or the repository is not visible to your credentials)",
    details: () => ({ best_effort: true })
  }),
  "ff.network": row({
    code: "TRANSIENT",
    message: () => "sync could not reach the remote \u2014 offline or the host is unreachable; retry",
    details: () => ({ retryable: true })
  }),
  "ff.busy": row({
    code: "GIT_BUSY",
    message: () => "another git process is using this repository \u2014 retry once it finishes",
    details: () => ({ retryable: true })
  }),
  "ff.diverged": row({
    code: "CONFLICT",
    message: (p) => `the board has local commits not yet pushed, and origin has moved too \u2014 \`sync --pull-only\` only fast-forwards; run \`${p.inv} sync\` (without --pull-only) to reconcile`
  }),
  "ff.conflict": row({
    code: "CONFLICT",
    message: (p) => `the board checkout has unresolved conflicts \u2014 run \`${p.inv} sync\` (without --pull-only) to reconcile`
  }),
  "ff.dirty": row({
    code: "RUNTIME",
    message: () => "the board checkout has uncommitted local changes that a fast-forward-only pull would overwrite \u2014 commit or discard them, or run a full sync instead of --pull-only"
  }),
  "ff.detached-head": row({
    code: "RUNTIME",
    message: () => "the board checkout is in a detached-HEAD state \u2014 sync needs the board branch checked out",
    details: () => ({ state: "detached-head" })
  }),
  "ff.not-a-repo": row({
    code: "RUNTIME",
    message: () => "the board checkout is not a git repository \u2014 run sync again to re-provision it"
  }),
  "ff.unclassified": row({
    code: "RUNTIME",
    message: (p) => `sync's pull step failed for an unclassified reason (${p.reason}) \u2014 re-run, or run without --pull-only`
  }),
  // Provisioning's local_board outcomes (bare sync never adopts or publishes a local branch).
  "sync.local-board.remote-exists": row({
    code: "CONFLICT",
    message: () => `both a local '${BOARD_BRANCH}' branch and origin/${BOARD_BRANCH} exist, but the local branch is not the managed board checkout \u2014 bare sync will not guess which history is safe`,
    help: (p) => `preserve or rename the local branch (for example: git branch -m ${BOARD_BRANCH} ${BOARD_BRANCH}-local-backup), then re-run '${p.inv} sync' to join origin/${BOARD_BRANCH}`
  }),
  "sync.local-board.unpublished": row({
    code: "NO_UPSTREAM",
    message: () => `a local '${BOARD_BRANCH}' branch exists but has not been explicitly adopted or published \u2014 bare sync will not check it out or create origin/${BOARD_BRANCH}`,
    help: (p) => `${p.inv} sync --establish`
  }),
  // Full sync's own no_upstream arm (the rebase step's decision table) — same state as
  // `ff.no-upstream.unpublished` (`--pull-only`'s translation), now the same copy (PR2 unification;
  // filed PR #92 item 5).
  "sync.full.no-upstream": row({
    code: "NO_UPSTREAM",
    message: (p) => boardNotPublishedMessage(p.inv),
    help: (p) => `${p.inv} sync --establish`
  }),
  // The in-tree board's write refusal + the viewer's no-comparison-basis refusal.
  "in-tree.sync-refusal": row({
    code: "USAGE",
    message: (p) => syncInTreeRefusalMessage(p.inv, p.hasOrigin),
    details: (p) => ({ path: p.boardPath, state: "in-tree" }),
    help: (p) => p.hasOrigin ? `${p.inv} sync --establish` : `git remote add ${BOARD_REMOTE} <url>`
  }),
  "in-tree.show-incoming.no-basis": row({
    code: "NO_UPSTREAM",
    message: (p) => `this board rides the current branch, and ${inTreeNoBasisNote(p.reason, p.ref)}`,
    details: () => ({ state: "in-tree" }),
    help: (p) => `configure tracking (git branch --set-upstream-to=<remote>/<branch>) or fetch once, then re-run ${p.inv} sync --show-incoming <id>`
  }),
  // The branch-mode viewer's own no-comparison-basis refusal: nothing has been fetched at all yet
  // (the in-tree row above covers the read-side-mode twin).
  "show-incoming.no-upstream": row({
    code: "NO_UPSTREAM",
    message: () => SHOW_INCOMING_NO_UPSTREAM,
    help: (p) => `on a shared board, run ${p.inv} sync --pull-only once to fetch origin/board, then re-run --show-incoming`
  }),
  // establish's refusal arms (committed-folder preconditions + the greenfield namespace guard).
  // guardCommittedPreconditions checks these, in order: on-board-branch, behind-origin,
  // committed-dirty, cleanup-branch-exists, namespace-conflict.committed, board-branch-mismatch.
  "establish.on-board-branch": row({
    code: "RUNTIME",
    message: () => `the current branch is '${BOARD_BRANCH}' \u2014 run establish from the branch that carries the committed folder ('${BOARD_BRANCH}' is the branch establishment creates)`
  }),
  "establish.behind-origin": row({
    code: "RUNTIME",
    message: (p) => `establish refused: '${p.branch}' is behind ${BOARD_REMOTE}/${p.branch} with board changes \u2014 establishing from this stale state would strand a teammate's board commits on the frozen folder forever`,
    details: (p) => ({ behind_board_commits: p.behind.length, commits: p.behind.slice(0, 20) }),
    help: (p) => `git pull, then re-run ${p.inv} sync --establish --yes`
  }),
  "establish.committed-dirty": row({
    code: "RUNTIME",
    message: () => `establish refused: ${BUNDLE_DIR}/ has uncommitted changes \u2014 commit (or discard) them first so the board branch carries the board's real current state`,
    details: (p) => ({ uncommitted: { shown: p.rows.length, total: p.total, rows: p.rows } }),
    help: (p) => `commit the board changes, then re-run ${p.inv} sync --establish --yes`
  }),
  "establish.cleanup-branch-exists": row({
    code: "RUNTIME",
    message: (p) => `a '${p.cleanupBranch}' branch already exists \u2014 if it is left over from an interrupted establishment, push it and open its PR (or delete it: git branch -D ${p.cleanupBranch}), then re-run`
  }),
  // Unified wording (PR2, filed PR #92 item 2): the greenfield guard previously carried a bare,
  // help-less message; it now matches the committed-case copy AND gains actionable help (greenfield
  // publication never needs --yes, so its remedy omits the flag the committed-case one carries).
  "establish.namespace-conflict.greenfield": row({
    code: "RUNTIME",
    message: (p) => namespaceConflictMessage(p.conflicts),
    details: (p) => ({ conflicting_branches: p.conflicts }),
    help: (p) => `delete or rename these branches, then re-run ${p.inv} sync --establish`
  }),
  "establish.namespace-conflict.committed": row({
    code: "RUNTIME",
    message: (p) => namespaceConflictMessage(p.conflicts),
    details: (p) => ({ conflicting_branches: p.conflicts }),
    help: (p) => `delete or rename these branches, then re-run ${p.inv} sync --establish --yes`
  }),
  "establish.local-branch-unrecognized": row({
    code: "RUNTIME",
    message: () => `a local '${BOARD_BRANCH}' branch already exists but is not the conventional board worktree; nothing was published`
  }),
  "establish.board-branch-mismatch": row({
    code: "RUNTIME",
    message: () => `a local '${BOARD_BRANCH}' branch already exists and does not match the committed folder \u2014 if it is left over from an interrupted establishment, delete it (git branch -D ${BOARD_BRANCH}); if it is used for something else, rename it \u2014 then re-run`
  }),
  "establish.detached-head.committed": row({
    code: "RUNTIME",
    message: () => `the repository is on a detached HEAD \u2014 check out the branch that carries the committed ${BUNDLE_DIR}/ folder, then re-run`
  }),
  "establish.detached-head.marker": row({
    code: "RUNTIME",
    message: (p) => `the repository is on a detached HEAD \u2014 check out the branch that carries the committed ${BUNDLE_DIR}/ folder, then re-run '${p.inv} sync --establish --yes'`
  }),
  // The committed-case marker (crash/lost-race provenance) refusal arms.
  "marker.shallow.refusal": row({
    code: "RUNTIME",
    message: () => `establish refused: this clone's git history is shallow (truncated), so the interrupted establishment's snapshot cannot be verified against origin/${BOARD_BRANCH}; nothing was changed`,
    details: (p) => ({ snapshot_commit: p.marker }),
    help: (p) => `${unshallowCmd()}  # then re-run ${p.inv} sync --establish`
  }),
  "marker.lost-race.conflict": row({
    code: "CONFLICT",
    message: (p) => p.markerValid ? `origin/${BOARD_BRANCH} does not contain this clone's interrupted establishment snapshot \u2014 a different board is published now; nothing was changed, and the committed folder here is untouched` : `this clone's establishment marker is invalid or unverifiable \u2014 it names a commit that cannot be found even after fetching, so establish cannot tie it to what origin/${BOARD_BRANCH} publishes; nothing was changed, and the committed folder here is untouched`,
    details: (p) => ({ snapshot_commit: p.marker }),
    help: (p) => `coordinate with whoever published origin/${BOARD_BRANCH}; to discard this clone's unpublished attempt: git branch -D ${BOARD_BRANCH}, then re-run '${p.inv} sync --establish' \u2014 the stale marker is cleared automatically once the branch is gone`
  }),
  "marker.offline.refusal": row({
    code: "TRANSIENT",
    message: () => `establish refused: could not reach '${BOARD_REMOTE}' \u2014 finishing the interrupted establishment re-creates the folder-removal commit, which must be cut from a fresh view of ${BOARD_REMOTE}; get online, then re-run`,
    details: () => ({ retryable: true })
  }),
  "marker.tree-changed.conflict": row({
    code: "CONFLICT",
    message: (p) => `${BUNDLE_DIR}/ changed on '${p.branch}' after the interrupted establishment pushed its snapshot \u2014 re-creating the folder-removal now would strand those newer board changes on the frozen folder; nothing was changed`,
    details: (p) => ({ snapshot_tree: p.snapshotTree, current_tree: p.currentTree }),
    help: (p) => `the newer changes stay recoverable in '${p.branch}' history; after the cleanup PR merges and this clone joins via '${p.inv} sync', re-apply them with doc update`
  }),
  // Unified wording (PR2, filed PR #92 item 3): three call sites test the identical treeOf()
  // failure; all now render markerUnavailableMessage (see its doc comment for the rationale).
  "marker.unavailable.tree": row({
    code: "RUNTIME",
    message: (p) => markerUnavailableMessage(p.marker)
  }),
  "marker.unavailable.commit.moved": row({
    code: "RUNTIME",
    message: (p) => markerUnavailableMessage(p.marker)
  }),
  "marker.unavailable.commit.changed": row({
    code: "RUNTIME",
    message: (p) => markerUnavailableMessage(p.marker)
  }),
  // Package-side rows: the factories stay the construction sites (thrown inside board-git);
  // these rows COMPOSE them so the agreement suite enumerates their arms. `top` must be a repo in
  // the row's state (the factory probes it for the remnant discrimination).
  "window.pre-share": row({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, true).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, true).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, true).details
  }),
  "window.pre-share.no-origin": row({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, false).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, false).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, false).details
  }),
  "window.remnant": row({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, true).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, true).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, true).details
  }),
  "window.dual-board": row({
    code: "CONFLICT",
    message: (p) => dualBoardError(p.boardPath).message,
    help: (p) => dualBoardError(p.boardPath).help,
    details: (p) => dualBoardError(p.boardPath).details
  }),
  "provision.foreign": row({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("foreign", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("foreign", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("foreign", p.boardPath, p.top).details
  }),
  "provision.foreign-checkout": row({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).details
  }),
  "provision.unrepairable": row({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).details
  }),
  "provision.wrong-branch": row({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).details
  })
};
function syncOutcomeError(key, params) {
  const r = SYNC_OUTCOMES[key];
  const details = r.details?.(params);
  const help = r.help?.(params);
  return new CliError(r.code, r.message(params), {
    ...details !== void 0 ? { details } : {},
    ...help !== void 0 ? { help } : {}
  });
}
var SYNC_OUTCOME_LINES = {
  "line.in-tree.no-basis": line(
    (p) => inTreeNoBasisNote(p.reason, p.ref)
  ),
  // establish's window notes for a clone with no local establishment work left (pull-first;
  // probed per state at the site — the remnant state renders the package factory's message).
  "line.window-note.landed": line(
    (p) => `this clone still carries the committed ${BUNDLE_DIR}/ folder and the folder-removal has already landed on '${p.branch}' \u2014 run 'git pull' (the folder vanishes), then '${p.inv} sync' (it returns as the live board)`
  ),
  "line.window-note.pending": line(
    (p) => `this clone still carries the committed ${BUNDLE_DIR}/ folder \u2014 once the folder-removal lands on the default branch: 'git pull' (the folder vanishes), then '${p.inv} sync' (it returns as the live board)`
  ),
  // alreadyShared's marker-state record FIELD templates (record assembly stays at the site).
  "line.marker.story.lost-race": line(
    () => `a different board is published on ${BOARD_REMOTE}/${BOARD_BRANCH} and this clone's earlier establishment snapshot is not part of it`
  ),
  "line.marker.story.unverifiable": line(
    () => `this clone's establishment marker is invalid or unverifiable (it names a commit that cannot be found even after fetching), and the board published on ${BOARD_REMOTE}/${BOARD_BRANCH} cannot be tied to it`
  ),
  "line.marker.cleared.removed": line(
    (p) => `${p.story} \u2014 its stale marker has been cleared (the only change made by this run)`
  ),
  "line.marker.cleared.failed": line(
    (p) => `${p.story} \u2014 its stale marker could NOT be removed (this run changed nothing); remove it by hand: rm ${p.markerPath}`
  ),
  "line.marker.lost-race.note": line(
    (p) => `${p.story} \u2014 this clone's earlier '--establish --yes' did not win; nothing has been changed by this run`
  ),
  "line.marker.lost-race.discard": line(
    (p) => `git branch -D ${BOARD_BRANCH}, then re-run '${p.inv} sync --establish' \u2014 the stale marker is cleared automatically once the branch is gone`
  ),
  "line.marker.shallow.note": line(
    (p) => `an earlier establishment on this clone was interrupted, but this clone's git history is shallow (truncated), so establish cannot verify whether that attempt's snapshot was published \u2014 deepen the history (${unshallowCmd()}), then re-run '${p.inv} sync --establish' (nothing has been changed by this run)`
  ),
  "line.marker.interrupted-offer.note": line(
    (p) => `an interrupted establishment left the board branch pushed but no folder-removal commit \u2014 re-run '${p.inv} sync --establish --yes' to re-create it on '${p.cleanupBranch}' (nothing has been changed by this run)`
  ),
  "line.marker.offline.note": line(
    (p) => `an earlier establishment on this clone was interrupted, but '${BOARD_REMOTE}' cannot be reached to verify what was published \u2014 get online, then re-run '${p.inv} sync --establish' (nothing has been changed by this run)`
  ),
  "line.marker.prepared.note": line(
    (p) => `the folder-removal commit is already prepared on '${p.cleanupBranch}' \u2014 push it and open its PR`
  ),
  // home's board-block lines (bound to the shared templates above).
  "line.home.first-contact": line((p) => boardFirstContactLine(p.inv)),
  "line.home.up-to-date": line(() => BOARD_UP_TO_DATE),
  "line.home.offline-note": line(() => BOARD_OFFLINE_NOTE),
  "line.home.in-tree": line(() => BOARD_IN_TREE_LINE),
  "line.home.unpushed": line((p) => unpushedLine(p.n)),
  "line.home.uncommitted": line((p) => uncommittedLine(p.n)),
  "line.home.in-tree.unpushed": line((p) => inTreeUnpushedLine(p.n)),
  "line.home.in-tree.uncommitted": line((p) => inTreeUncommittedLine(p.n)),
  "line.home.in-tree.pull-hint": line((p) => inTreePullHintLine(p.n)),
  // session-start's pull-skip notes (board-block `note` field entries — exit 0, fail-soft).
  "line.session-start.fetch-skipped": line(
    (p) => `board fetch skipped (${p.code}) \u2014 run \`${p.inv} sync --pull-only\` for the full story`
  ),
  "line.session-start.pull-skipped": line(
    (p) => `board pull skipped (${p.reason}) \u2014 run \`${p.inv} sync\` to reconcile`
  )
};
function syncOutcomeLine(key, params) {
  return SYNC_OUTCOME_LINES[key].message(params);
}
function ffSwallowToError(reason, inv, boardPath) {
  switch (reason) {
    case "git-missing":
      return syncOutcomeError("ff.git-missing", {});
    case "no-upstream": {
      const hasLocalBoard = boardPath !== void 0 && runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      return hasLocalBoard ? syncOutcomeError("ff.no-upstream.unpublished", { inv }) : syncOutcomeError("ff.no-upstream.unlinked", { inv });
    }
    case "auth":
      return syncOutcomeError("ff.auth", {});
    case "network":
      return syncOutcomeError("ff.network", {});
    case "busy":
      return syncOutcomeError("ff.busy", {});
    case "diverged":
      return syncOutcomeError("ff.diverged", { inv });
    case "conflict":
      return syncOutcomeError("ff.conflict", { inv });
    case "dirty":
      return syncOutcomeError("ff.dirty", {});
    case "detached-head":
      return syncOutcomeError("ff.detached-head", {});
    case "not-a-repo":
      return syncOutcomeError("ff.not-a-repo", {});
    default:
      return syncOutcomeError("ff.unclassified", { reason });
  }
}

// src/commands/sync/establish-committed.ts
var CLEANUP_BRANCH = "board-cleanup";
var ESTABLISH_COMMITTED_PREVIEW = "preview \u2014 nothing has been changed; re-run with --yes to execute";
var ESTABLISH_COMMITTED_ALREADY = "already established \u2014 a board branch already exists on origin";
var ESTABLISH_COMMITTED_DONE = "the board branch is live on origin \u2014 push the cleanup branch and open its PR to finish";
function bothWorldsLine(branch) {
  return `until the cleanup PR merges, this project is in a BOTH-WORLDS state: the shared board lives on the '${BOARD_BRANCH}' branch (live on ${BOARD_REMOTE}), while '${branch}' still carries the old committed folder. That folder is now a FROZEN SNAPSHOT that receives no further updates: treat it as read-only, don't write docs into it, and never merge '${BOARD_BRANCH}' into '${branch}'. Sync starts working on each clone once the PR merges and that clone runs 'git pull'`;
}
function rolloutNote(inv, branch) {
  return [
    `after your next 'git pull', ${BUNDLE_DIR}/ disappears from '${branch}' \u2014 nothing is lost: the next '${inv} sync' re-creates it from the shared board branch`,
    `from then on '${inv} sync' \u2014 not 'git pull' \u2014 updates the board`,
    `you may notice a '${BOARD_BRANCH}' branch on the remote \u2014 never merge it into '${branch}'`,
    `'git clean -fdx' on '${branch}' removes the board checkout (recoverable \u2014 the next sync re-creates it from ${BOARD_REMOTE}; unpushed board commits are why you sync first)`,
    `re-run '${inv} hook install' so session start stays board-aware`
  ];
}
function committedPreviewRecord(inv, branch) {
  return {
    establish: ESTABLISH_COMMITTED_PREVIEW,
    create: `a new '${BOARD_BRANCH}' branch whose ONE root commit carries the current committed files of ${BUNDLE_DIR}/ \u2014 files only: the folder's history stays on '${branch}'`,
    push: `the new '${BOARD_BRANCH}' branch to ${BOARD_REMOTE}, with tracking (git push -u ${BOARD_REMOTE} ${BOARD_BRANCH})`,
    commit: `ONE commit on a new local '${CLEANUP_BRANCH}' branch removing ${BUNDLE_DIR}/ from '${branch}' and adding it to .gitignore \u2014 NOT pushed: you push that branch and open the PR yourself; nothing on '${branch}' is pushed or changed`,
    after_merge: `once the PR merges, on every clone: 'git pull' makes ${BUNDLE_DIR}/ vanish from '${branch}', and the next '${inv} sync' re-creates it from the ${BOARD_BRANCH} branch \u2014 nothing is lost`,
    both_worlds: bothWorldsLine(branch),
    before_you_run: `every board writer should sync \u2014 at minimum commit \u2014 their board changes first: board work sitting uncommitted or unpushed on another machine cannot be detected from here, and it will NOT be on the new branch; worse, a clone whose unpushed board commits merge over the cleanup PR keeps those ${BUNDLE_DIR}/ paths tracked on '${branch}', and sync will refuse there until they are untracked (git rm -r --cached)`,
    verified: `this preview already checked the machine-checkable preconditions: ${BOARD_REMOTE} is reachable, '${branch}' is not behind ${BOARD_REMOTE}/${branch} on board changes, and no '${BOARD_BRANCH}/\u2026' branches exist (they would block creating the '${BOARD_BRANCH}' branch)`,
    rollout_note: rolloutNote(inv, branch),
    run: `${inv} sync --establish --yes`
  };
}
function committedNextSteps(inv, branch) {
  return [
    `push the cleanup branch: git push -u ${BOARD_REMOTE} ${CLEANUP_BRANCH}`,
    `open a PR from '${CLEANUP_BRANCH}' into '${branch}' and merge it`,
    `after the merge lands: 'git pull', then '${inv} sync' \u2014 ${BUNDLE_DIR}/ vanishes from '${branch}' and comes back as the live shared board`
  ];
}
function assertNotBehindOnBoard(top, inv, branch) {
  const behind = behindBoardCommits(top, branch);
  if (behind !== null && behind.length > 0) {
    throw syncOutcomeError("establish.behind-origin", { inv, branch, behind });
  }
}
function removalCommitMessage(inv, branch) {
  return `board: move ${BUNDLE_DIR}/ to the '${BOARD_BRANCH}' branch

The board now lives on its own '${BOARD_BRANCH}' branch (pushed to ${BOARD_REMOTE}) and is ignored on '${branch}'.
Once this lands: 'git pull' (the folder vanishes), then '${inv} sync' (it returns as the live shared board).
`;
}
function markerCommitResolves(top, marker) {
  return runGit(top, ["cat-file", "-e", `${marker}^{commit}`]).status === 0;
}
function clearStaleCommittedMarker(top) {
  const marker = readGitDirMarker(top, COMMITTED_MARKER_KEY);
  if (!marker) return;
  const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit) return;
  if (markerCommitResolves(top, marker) && isAncestor(top, marker, remoteCommit)) {
    clearGitDirMarker(top, COMMITTED_MARKER_KEY);
    return;
  }
  if (isShallowRepository(top)) return;
  if (localBranchExists(top, BOARD_BRANCH) && !isProvisioned(top)) return;
  clearGitDirMarker(top, COMMITTED_MARKER_KEY);
}
function guardCommittedPreconditions(top, inv, treeSha) {
  const branch = currentBranch(top);
  if (branch === "HEAD") {
    throw syncOutcomeError("establish.detached-head.committed", {});
  }
  if (branch === BOARD_BRANCH) {
    throw syncOutcomeError("establish.on-board-branch", {});
  }
  assertNotBehindOnBoard(top, inv, branch);
  const dirty = statusRows(top, BUNDLE_DIR);
  if (dirty.length > 0) {
    const shown = dirty.slice(0, 20);
    throw syncOutcomeError("establish.committed-dirty", { inv, rows: shown, total: dirty.length });
  }
  if (localBranchExists(top, CLEANUP_BRANCH)) {
    throw syncOutcomeError("establish.cleanup-branch-exists", { cleanupBranch: CLEANUP_BRANCH });
  }
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw syncOutcomeError("establish.namespace-conflict.committed", { inv, conflicts: namespaceConflicts });
  }
  let reuseBoardSha = null;
  if (localBranchExists(top, BOARD_BRANCH)) {
    const remnant = boardBranchRemnant(top);
    if (remnant.tree === treeSha && remnant.count === "1") {
      reuseBoardSha = remnant.sha;
    } else {
      throw syncOutcomeError("establish.board-branch-mismatch", {});
    }
  }
  return { branch, reuseBoardSha };
}
function executeCommittedEstablishment(top, inv, plan, treeSha, mode, stdout) {
  const { branch } = plan;
  const boardSha = plan.reuseBoardSha ?? createBoardRootCommit(top, treeSha, branch);
  writeGitDirMarker(top, COMMITTED_MARKER_KEY, boardSha);
  pushBoardUpstream(top);
  const removalSha = createRemovalCommit(top, removalCommitMessage(inv, branch));
  mustGit(top, ["branch", CLEANUP_BRANCH, removalSha]);
  clearGitDirMarker(top, COMMITTED_MARKER_KEY);
  const receipt = {
    established: ESTABLISH_COMMITTED_DONE,
    board_commit: boardSha,
    pushed: `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`,
    cleanup_branch: CLEANUP_BRANCH,
    cleanup_commit: removalSha,
    next_steps: committedNextSteps(inv, branch),
    both_worlds: bothWorldsLine(branch),
    tell_your_teammates: rolloutNote(inv, branch)
  };
  stdout(render(receipt, mode));
  return { already: false };
}
async function establishCommitted(top, inv, mode, yes, treeSha, stdout) {
  const fetchOk = fetchOrigin(top);
  if (refCommit(top, `refs/remotes/${BOARD_REF}`)) {
    await alreadyShared(top, inv, mode, yes, fetchOk, stdout);
    return { already: false };
  }
  if (!fetchOk) {
    throw new CliError(
      "TRANSIENT",
      `establish refused: could not reach '${BOARD_REMOTE}' \u2014 the committed-folder case verifies freshness against the remote and must push the board branch, neither of which can happen offline; get online, then re-run`,
      { details: { retryable: true } }
    );
  }
  const plan = guardCommittedPreconditions(top, inv, treeSha);
  if (!yes) {
    stdout(render(committedPreviewRecord(inv, plan.branch), mode));
    return { already: false };
  }
  return executeCommittedEstablishment(top, inv, plan, treeSha, mode, stdout);
}
async function alreadyShared(top, inv, mode, yes, fetchOk, stdout) {
  const rec = { establish: ESTABLISH_COMMITTED_ALREADY };
  const branch = currentBranch(top);
  const marker = readGitDirMarker(top, COMMITTED_MARKER_KEY);
  if (localBranchExists(top, CLEANUP_BRANCH)) {
    clearGitDirMarker(top, COMMITTED_MARKER_KEY);
    rec.note = syncOutcomeLine("line.marker.prepared.note", { cleanupBranch: CLEANUP_BRANCH });
    rec.next_steps = committedNextSteps(inv, branch === "HEAD" ? "the default branch" : branch);
  } else if (marker) {
    if (branch === "HEAD") {
      throw syncOutcomeError("establish.detached-head.marker", { inv });
    }
    const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    const markerValid = markerCommitResolves(top, marker);
    const contained = markerValid && remoteCommit !== void 0 && isAncestor(top, marker, remoteCommit);
    if (!contained && fetchOk && isShallowRepository(top)) {
      if (!yes) {
        rec.note = syncOutcomeLine("line.marker.shallow.note", { inv });
      } else {
        throw syncOutcomeError("marker.shallow.refusal", { inv, marker });
      }
    } else if (!contained && fetchOk) {
      const story = markerValid ? syncOutcomeLine("line.marker.story.lost-race", {}) : syncOutcomeLine("line.marker.story.unverifiable", {});
      if (!localBranchExists(top, BOARD_BRANCH)) {
        const cleared = clearGitDirMarkerVerified(top, COMMITTED_MARKER_KEY);
        rec.cleared = cleared ? syncOutcomeLine("line.marker.cleared.removed", { story }) : syncOutcomeLine("line.marker.cleared.failed", {
          story,
          markerPath: gitDirMarkerPath(top, COMMITTED_MARKER_KEY)
        });
        rec.note = windowNote(top, inv, branch);
      } else if (!yes) {
        rec.note = syncOutcomeLine("line.marker.lost-race.note", { story });
        rec.discard = syncOutcomeLine("line.marker.lost-race.discard", { inv });
      } else {
        throw syncOutcomeError("marker.lost-race.conflict", { inv, marker, markerValid });
      }
    } else if (!yes) {
      rec.note = contained ? syncOutcomeLine("line.marker.interrupted-offer.note", { inv, cleanupBranch: CLEANUP_BRANCH }) : syncOutcomeLine("line.marker.offline.note", { inv });
    } else if (!fetchOk) {
      throw syncOutcomeError("marker.offline.refusal", {});
    } else {
      assertNotBehindOnBoard(top, inv, branch);
      const markerTree = treeOf(top, marker);
      if (!markerTree) {
        throw syncOutcomeError("marker.unavailable.commit.changed", { marker });
      }
      const currentTree = folderTreeAtHead(top);
      if (currentTree !== markerTree) {
        throw syncOutcomeError("marker.tree-changed.conflict", {
          inv,
          branch,
          snapshotTree: markerTree,
          currentTree: currentTree ?? "absent"
        });
      }
      const removalSha = createRemovalCommit(top, removalCommitMessage(inv, branch));
      mustGit(top, ["branch", CLEANUP_BRANCH, removalSha]);
      clearGitDirMarker(top, COMMITTED_MARKER_KEY);
      rec.recovered = `an interrupted establishment left the board branch pushed but no folder-removal commit \u2014 it has been re-created on '${CLEANUP_BRANCH}'`;
      rec.cleanup_branch = CLEANUP_BRANCH;
      rec.cleanup_commit = removalSha;
      rec.next_steps = committedNextSteps(inv, branch);
      rec.both_worlds = bothWorldsLine(branch);
    }
  } else {
    rec.note = windowNote(top, inv, branch);
  }
  stdout(render(rec, mode));
}
function windowNote(top, inv, branch) {
  const guidance = boardWindowGuidance(top);
  if (guidance.state === "window-remnant") return guidance.message;
  const landedUpstream = pathLandedAbsentOnRemoteBranch(top, branch, BUNDLE_DIR);
  return landedUpstream ? syncOutcomeLine("line.window-note.landed", { inv, branch }) : syncOutcomeLine("line.window-note.pending", { inv });
}

// src/commands/sync/establish.ts
var ESTABLISH_DONE = "the shared board is live \u2014 .agentstate-lite/ now syncs over the 'board' branch";
var ESTABLISH_ALREADY = "already established";
function establishNextSteps(inv) {
  return [
    `teammates just run '${inv} sync' \u2014 it provisions automatically`,
    `'${inv} hook install' keeps session start board-aware`
  ];
}
function assertPlainBundleShape(bundlePath, inv) {
  const runInitHelp = `${inv} init --dir ${BUNDLE_DIR}`;
  if (!existsSync7(bundlePath)) {
    throw new CliError(
      "RUNTIME",
      `no '${BUNDLE_DIR}/' folder here to establish \u2014 run '${runInitHelp}' first, then re-run establish`,
      { help: runInitHelp }
    );
  }
  const root = lstatSync3(bundlePath);
  if (root.isSymbolicLink() || !root.isDirectory()) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' must be a real, plain directory \u2014 symlinks and non-directories are never followed by establish`
    );
  }
  if (existsSync7(path17.join(bundlePath, ".git"))) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' already contains its own '.git' \u2014 establish only operates on a plain bundle folder`
    );
  }
  if (readdirSync2(bundlePath).length === 0) {
    throw new CliError("RUNTIME", `'${bundlePath}' is empty \u2014 run '${runInitHelp}' first`, {
      help: runInitHelp
    });
  }
  const indexPath = path17.join(bundlePath, "index.md");
  if (!existsSync7(indexPath)) {
    throw new CliError(
      "RUNTIME",
      `'${bundlePath}' doesn't look like an OKF bundle (no index.md) \u2014 run '${runInitHelp}' first`,
      { help: runInitHelp }
    );
  }
  const index = lstatSync3(indexPath);
  if (index.isSymbolicLink() || !index.isFile()) {
    throw new CliError("RUNTIME", `'${indexPath}' must be a real file \u2014 establish never follows it through a symlink`);
  }
}
function assertFreshSource(top, boardPath, inv) {
  assertPlainBundleShape(boardPath, inv);
  if (folderPresentInCodeIndex(top)) {
    throw new CliError(
      "RUNTIME",
      `'${BUNDLE_DIR}/' is staged in the code branch's index \u2014 establish refuses to leave board files queued for a later code commit; unstage them, then re-run`,
      { help: `git restore --staged -- ${BUNDLE_DIR}` }
    );
  }
}
async function assertNotBoundElsewhere(top, boardPath) {
  const binding = await resolveProjectBinding(top);
  if (!binding) return;
  const boundIsConventional = path17.resolve(binding.target) === boardPath;
  if (boundIsConventional) return;
  throw new CliError(
    "RUNTIME",
    `a project binding (${binding.file}) points this project's bundle out of the git-sync tier (the conventional path is '${BUNDLE_DIR}/')`,
    { help: `fix or remove ${binding.file} if you want to share this bundle over the board branch` }
  );
}
function gitignoreNote(top) {
  const gi = ensureBoardGitignoreWorkingTree(top);
  return gi.changed ? `${gi.path} \u2014 appended '${GITIGNORE_ENTRY}' (uncommitted; commit it so teammates' clones stay clean)` : `${gi.path} \u2014 already ignores '${BUNDLE_DIR}/'`;
}
function removeVerifiedBackup(top, backupPath, expectedCommit, inv) {
  if (!existsSync7(backupPath)) return;
  assertPlainBundleShape(backupPath, inv);
  const backupSnapshot = snapshotBundleCommit(top, backupPath);
  const expectedTree = treeOf(top, expectedCommit);
  if (!expectedTree) throw new CliError("RUNTIME", `the establishment commit has no readable tree (${expectedCommit})`);
  if (backupSnapshot.tree !== expectedTree) {
    throw new CliError("CONFLICT", `the establishment backup at ${backupPath} changed; it was not removed`);
  }
  assertBundleBytesMatchCommit(top, backupPath, expectedCommit);
  rmSync3(backupPath, { recursive: true, force: false });
}
function finishLocalConversion(top, sourcePath, publishedCommit, expectedTree, inv) {
  const boardPath = path17.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit || !isAncestor(top, publishedCommit, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `origin/${BOARD_BRANCH} no longer contains this establishment's published snapshot \u2014 the local bundle is untouched`
    );
  }
  if (isProvisioned(top)) {
    const current = currentHead(boardPath);
    if (!isAncestor(top, publishedCommit, current)) {
      throw new CliError("CONFLICT", "the provisioned board does not contain the establishment snapshot");
    }
    assertBundleBytesMatchCommit(top, boardPath, publishedCommit);
    setBoardUpstream(boardPath);
    const note = gitignoreNote(top);
    removeVerifiedBackup(top, backupPath, publishedCommit, inv);
    clearGitDirMarker(top, ESTABLISH_MARKER_KEY);
    return { boardPath, boardCommit: current, gitignore: note };
  }
  assertPlainBundleShape(sourcePath, inv);
  const currentSnapshot = snapshotBundleCommit(top, sourcePath);
  if (currentSnapshot.tree !== expectedTree) {
    throw new CliError(
      "CONFLICT",
      `the local bundle changed after its establishment snapshot was created \u2014 nothing was moved; review the local changes, then re-run '${inv} sync --establish'`,
      { details: { expected_tree: expectedTree, actual_tree: currentSnapshot.tree } }
    );
  }
  if (sourcePath === boardPath) {
    if (existsSync7(backupPath)) {
      throw new CliError("RUNTIME", `establish recovery backup already exists at ${backupPath}; nothing was moved`);
    }
    renameSync3(boardPath, backupPath);
    sourcePath = backupPath;
  }
  try {
    const outcome = provisionBoardWorktree(top);
    if (outcome.kind !== "provisioned" && outcome.kind !== "already") {
      throw new CliError("RUNTIME", `board provisioning returned '${outcome.kind}' after publication`);
    }
    const provisionedPath = outcome.boardPath;
    const current = currentHead(provisionedPath);
    if (!isAncestor(top, publishedCommit, current)) {
      throw new CliError("CONFLICT", "the provisioned board does not contain the establishment snapshot");
    }
    if (runGit(provisionedPath, ["status", "--porcelain"]).stdout.trim()) {
      throw new CliError("RUNTIME", "the newly provisioned board worktree is unexpectedly dirty");
    }
    assertBundleBytesMatchCommit(top, provisionedPath, publishedCommit);
    setBoardUpstream(provisionedPath);
    const note = gitignoreNote(top);
    removeVerifiedBackup(top, sourcePath, publishedCommit, inv);
    clearGitDirMarker(top, ESTABLISH_MARKER_KEY);
    return { boardPath: provisionedPath, boardCommit: current, gitignore: note };
  } catch (err) {
    if (!existsSync7(boardPath) && existsSync7(backupPath)) renameSync3(backupPath, boardPath);
    throw err;
  }
}
async function renderEstablished(top, conversion, snapshot2, inv, mode, stdout, deps) {
  const key = resolveBundleKey(conversion.boardPath);
  await defaultSyncStore.refreshMarker(key);
  if (snapshot2.docs.length > 0) await defaultSyncStore.recordSelfActors(key, snapshot2.docs.map((d) => d.actor));
  await defaultSyncStore.writeCursor(key, { tier: "git", token: conversion.boardCommit });
  await defaultSyncStore.writeCache(key, {
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    delta: [],
    unpushedCount: unpushedCount(conversion.boardPath) ?? 0,
    uncommittedCount: 0
  });
  const receipt = {
    established: ESTABLISH_DONE,
    board_commit: conversion.boardCommit,
    committed: snapshot2.docs.length
  };
  const actor = singleActor(snapshot2.docs);
  if (actor) receipt.actor = actor;
  receipt.pushed = `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`;
  receipt.gitignore = conversion.gitignore;
  receipt.next_steps = establishNextSteps(inv);
  const hint = await hookInstallHintOnce(key, inv, deps.hookInstalled);
  if (hint) receipt.hint = hint;
  stdout(render(receipt, mode));
  return { already: false };
}
function readGreenfieldState(top) {
  const boardPath = path17.join(top, BUNDLE_DIR);
  return {
    boardPath,
    backupPath: `${boardPath}.establish-backup`,
    marker: readGitDirMarker(top, ESTABLISH_MARKER_KEY),
    remoteCommit: refCommit(top, `refs/remotes/${BOARD_REF}`),
    localCommit: refCommit(top, `refs/heads/${BOARD_BRANCH}`)
  };
}
function pushAndConfirmRemote(top, sha) {
  try {
    pushBoardCommit(top, sha);
  } catch (err) {
    if (!fetchOrigin(top) || !refCommit(top, `refs/remotes/${BOARD_REF}`)) throw err;
  }
  fetchOriginRequired(top);
  return refCommit(top, `refs/remotes/${BOARD_REF}`);
}
function resumeProvisionedEstablishment(top, st, remoteCommit, inv) {
  if (st.marker) {
    if (!isAncestor(top, st.marker, remoteCommit)) {
      throw new CliError(
        "CONFLICT",
        `the provisioned board does not contain the interrupted establishment snapshot (${st.marker})`
      );
    }
    const markerTree = treeOf(top, st.marker);
    if (!markerTree) {
      throw syncOutcomeError("marker.unavailable.tree", { marker: st.marker });
    }
    setBoardUpstream(st.boardPath);
    gitignoreNote(top);
    assertBundleBytesMatchCommit(top, st.boardPath, st.marker);
    removeVerifiedBackup(top, st.backupPath, st.marker, inv);
    clearGitDirMarker(top, ESTABLISH_MARKER_KEY);
  }
  return { already: true };
}
async function publishLocalBoardBranch(top, boardPath, inv, mode, stdout, deps) {
  if (!isProvisioned(top)) {
    const provisioned = provisionBoardWorktree(top);
    if (provisioned.kind !== "provisioned" && provisioned.kind !== "already") {
      throw new CliError("RUNTIME", "the local board branch could not be provisioned for explicit establishment");
    }
  }
  const indexPath = path17.join(boardPath, "index.md");
  if (!existsSync7(indexPath) || lstatSync3(indexPath).isSymbolicLink() || !lstatSync3(indexPath).isFile()) {
    throw new CliError("RUNTIME", `the local '${BOARD_BRANCH}' worktree is not a valid bundle (root index.md missing)`);
  }
  pushBoardUpstream(boardPath);
  fetchOriginRequired(top);
  const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit) throw new CliError("RUNTIME", "board push succeeded but origin/board could not be verified");
  const conversion = {
    boardPath,
    boardCommit: currentHead(boardPath),
    gitignore: gitignoreNote(top)
  };
  return renderEstablished(top, conversion, { docs: [] }, inv, mode, stdout, deps);
}
async function resumeInterruptedEstablishment(top, st, marker, inv, mode, stdout, deps) {
  const recoverySource = existsSync7(st.backupPath) ? st.backupPath : st.boardPath;
  const markerTree = treeOf(top, marker);
  if (!markerTree) {
    throw syncOutcomeError("marker.unavailable.commit.moved", { marker });
  }
  assertPlainBundleShape(recoverySource, inv);
  const currentSnapshot = snapshotBundleCommit(top, recoverySource);
  if (currentSnapshot.tree !== markerTree) {
    throw new CliError("CONFLICT", "the local bundle changed since the interrupted establishment snapshot; nothing was moved");
  }
  let remoteCommit = st.remoteCommit;
  if (!remoteCommit) {
    remoteCommit = pushAndConfirmRemote(top, marker);
  }
  if (!remoteCommit || !isAncestor(top, marker, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `a different origin/${BOARD_BRANCH} appeared while establishing; the local bundle remains untouched`
    );
  }
  const conversion = finishLocalConversion(top, recoverySource, marker, markerTree, inv);
  return renderEstablished(top, conversion, currentSnapshot, inv, mode, stdout, deps);
}
async function publishGreenfieldBoard(top, boardPath, inv, mode, stdout, deps) {
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw syncOutcomeError("establish.namespace-conflict.greenfield", { inv, conflicts: namespaceConflicts });
  }
  assertFreshSource(top, boardPath, inv);
  await assertNotBoundElsewhere(top, boardPath);
  const snapshot2 = snapshotBundleCommit(top, boardPath);
  writeGitDirMarker(top, ESTABLISH_MARKER_KEY, snapshot2.sha);
  const remoteCommit = pushAndConfirmRemote(top, snapshot2.sha);
  if (!remoteCommit || !isAncestor(top, snapshot2.sha, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `a teammate published a different origin/${BOARD_BRANCH} first; the local bundle remains untouched`,
      { details: { snapshot_commit: snapshot2.sha } }
    );
  }
  const conversion = finishLocalConversion(top, boardPath, snapshot2.sha, snapshot2.tree, inv);
  return renderEstablished(top, conversion, snapshot2, inv, mode, stdout, deps);
}
async function establishBoard(dir, inv, mode, stdout, deps, opts = {}) {
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError("RUNTIME", "not inside a git repository \u2014 establish needs a repo with an 'origin' remote");
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError(
      "RUNTIME",
      `this repository has no '${BOARD_REMOTE}' remote \u2014 establish needs one to publish the board`,
      { help: `git remote add ${BOARD_REMOTE} <url>  # then re-run ${inv} sync --establish` }
    );
  }
  const committedTree = folderTreeAtHead(top);
  if (committedTree !== null) {
    return establishCommitted(top, inv, mode, Boolean(opts.yes), committedTree, stdout);
  }
  fetchOriginRequired(top);
  clearStaleCommittedMarker(top);
  const st = readGreenfieldState(top);
  if (isProvisioned(top) && st.remoteCommit) {
    return resumeProvisionedEstablishment(top, st, st.remoteCommit, inv);
  }
  if (st.localCommit && !st.remoteCommit) {
    return publishLocalBoardBranch(top, st.boardPath, inv, mode, stdout, deps);
  }
  if (st.marker) {
    return resumeInterruptedEstablishment(top, st, st.marker, inv, mode, stdout, deps);
  }
  if (st.remoteCommit) {
    if (existsSync7(st.boardPath) || existsSync7(st.backupPath)) {
      throw new CliError(
        "CONFLICT",
        `origin/${BOARD_BRANCH} already exists while this clone also has a local bundle \u2014 establish will not guess that they are identical or replace either one`,
        { help: `move the local folder aside, run '${inv} sync' to join, then reconcile deliberately` }
      );
    }
    return { already: true };
  }
  if (st.localCommit) {
    throw syncOutcomeError("establish.local-branch-unrecognized", {});
  }
  if (existsSync7(st.backupPath)) {
    throw new CliError(
      "RUNTIME",
      `an establishment backup already exists at ${st.backupPath}, but this clone has no matching establishment marker; nothing was published or moved`
    );
  }
  return publishGreenfieldBoard(top, st.boardPath, inv, mode, stdout, deps);
}

// src/commands/sync/converge.ts
import { readFileSync as readFileSync5 } from "node:fs";
function cap2(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
var PUSH_FAIL_SAFETY_MESSAGE = "committed to the board locally \u2014 your work is saved. The push failed (offline or auth); re-run sync when you're back online or your access is restored.";
function pushFailureMessage(err) {
  const genericConnectivityFailure = err.code === "AUTH_REQUIRED" || err.code === "TRANSIENT" && err.details?.reason !== "non-fast-forward";
  if (genericConnectivityFailure) return PUSH_FAIL_SAFETY_MESSAGE;
  return `committed to the board locally \u2014 your work is saved. ${err.message}`;
}
function withUpstreamHelp(err, inv) {
  if (err.code === "NO_UPSTREAM" && err.help === void 0) {
    return new CliError("NO_UPSTREAM", err.message, { details: err.details, help: upstreamHelp(inv) });
  }
  return err;
}
function toCliError(err, op) {
  if (err instanceof CliError) return err;
  if (isBoardGitError(err)) return cliErrorFromBoardGit(err);
  return cliErrorFromBoardGit(
    classifyGitError({ args: [op], status: null, stdout: "", stderr: err instanceof Error ? err.message : String(err) })
  );
}
async function writeAwarenessCache(key, boardPath, changes, note) {
  await defaultSyncStore.writeCache(key, {
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
    ...note ? { note } : {}
  });
}
async function throwPostCommitFailure(err, committedThisRun, key, boardPath) {
  if (!committedThisRun) throw err;
  const wrapped = new CliError(err.code, pushFailureMessage(err), { details: err.details, help: err.help });
  await writeAwarenessCache(key, boardPath, []);
  throw wrapped;
}
function entryLabel(c) {
  return c.isDoc ? `doc ${c.entry}` : c.entry;
}
function convergeDocLine(c) {
  const label = entryLabel(c);
  if (c.exportPath === null) {
    return `${label} \u2014 teammate's version kept (your side deleted it; nothing to save)`;
  }
  if (!c.landed) {
    const recreate = c.isDoc && c.bodyExportPath !== null ? " \u2014 re-create with doc write" : "";
    return `${label} \u2014 teammate's deletion kept; yours saved at ${c.exportPath}${recreate}`;
  }
  const reconcile = c.isDoc && c.bodyExportPath !== null ? " \u2014 reconcile with doc update" : "";
  return `${label} \u2014 teammate's version kept; yours saved at ${c.exportPath}${reconcile}`;
}
function buildConvergeMessage(conflicts) {
  return conflicts.map(convergeDocLine).join("; ");
}
function convergeHelp(inv, id, bodyExportPath) {
  return `${inv} sync --show-incoming ${id} \u2192 ${inv} doc update ${id} --body-file ${bodyExportPath} \u2192 ${inv} sync`;
}
function recreateHelp(inv, id, bodyExportPath) {
  return `${inv} doc write ${id} --type <Type> --body-file ${bodyExportPath} \u2192 ${inv} sync`;
}
function pickHelp(inv, conflicts) {
  const reconcilable = conflicts.find((c) => c.isDoc && c.bodyExportPath !== null && c.landed);
  if (reconcilable) return convergeHelp(inv, reconcilable.entry, reconcilable.bodyExportPath);
  const recreatable = conflicts.find((c) => c.isDoc && c.bodyExportPath !== null);
  if (recreatable) return recreateHelp(inv, recreatable.entry, recreatable.bodyExportPath);
  return void 0;
}
function keptFrontmatter(boardPath, relPath) {
  const shown = runGit(boardPath, ["show", `HEAD:${relPath}`]);
  if (shown.status !== 0) return null;
  try {
    return parseMarkdown(shown.stdout, relPath).frontmatter;
  } catch {
    return null;
  }
}
function keptDocMeta(boardPath, relPath) {
  const frontmatter = keptFrontmatter(boardPath, relPath);
  if (!frontmatter) return {};
  const kind2 = fmValue(frontmatter.type);
  const title = fmValue(frontmatter.title);
  return {
    ...kind2 !== UNKNOWN_FIELD ? { kind: kind2 } : {},
    ...title !== UNKNOWN_FIELD ? { title } : {}
  };
}
function frontmatterDiffKeys(boardPath, c) {
  if (!c.isDoc || c.exportPath === null || !c.landed) return [];
  try {
    const local = parseMarkdown(readFileSync5(c.exportPath, "utf8"), c.relPath).frontmatter;
    const kept = keptFrontmatter(boardPath, c.relPath);
    if (!kept) return [];
    const keys = /* @__PURE__ */ new Set([...Object.keys(local), ...Object.keys(kept)]);
    keys.delete("timestamp");
    return [...keys].filter((k) => JSON.stringify(local[k]) !== JSON.stringify(kept[k])).sort();
  } catch {
    return [];
  }
}
function toConflictRows(boardPath, conflicts) {
  return conflicts.map((c) => {
    const row2 = c.isDoc ? { id: c.entry } : { path: c.entry };
    if (c.isDoc) Object.assign(row2, keptDocMeta(boardPath, c.relPath));
    row2.yours = c.exportPath !== null ? c.exportPath : "deleted locally \u2014 nothing to save";
    if (c.bodyExportPath !== null) row2.yours_body = c.bodyExportPath;
    const diff = frontmatterDiffKeys(boardPath, c);
    if (diff.length > 0) row2.frontmatter_differs = diff;
    row2.theirs = c.landed ? "kept" : "kept (deleted upstream)";
    return row2;
  });
}
function buildConvergeError(boardPath, resolved, inv, limit) {
  const conflicts = annotateLanded(boardPath, resolved);
  const rows = toConflictRows(boardPath, conflicts);
  const help = pickHelp(inv, conflicts);
  return new CliError("CONFLICT", buildConvergeMessage(conflicts), {
    details: { conflicts: cap2(rows, limit) },
    ...help ? { help } : {}
  });
}
function withProvisionAnnouncement(err, outcome) {
  const announcement = provisionAnnouncement(outcome);
  if (!announcement) return err;
  return new CliError(err.code, err.message, { details: { ...err.details, ...announcement }, help: err.help });
}
var UNKNOWN_FIELD = "unknown";
function fmValue(v) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN_FIELD;
}
function toIncomingRows(changes) {
  return changes.map((c) => ({ verb: c.verb, kind: c.kind, id: c.docId, title: c.title, actor: c.actor }));
}
function assignCounts(rec, commitDocs, pushed, originDelta, limit) {
  rec.committed = commitDocs.length;
  rec.pushed = pushed;
  rec.pulled = originDelta.length;
  const actor = singleActor(commitDocs);
  if (actor) rec.actor = actor;
  rec.incoming = cap2(toIncomingRows(originDelta), limit);
}
function buildPushFailurePartial(outcome, warning, commitDocs, originDelta, limit, reanchorNote) {
  const partial = {};
  const announcement = provisionAnnouncement(outcome);
  if (announcement) Object.assign(partial, announcement);
  partial.warning = warning;
  assignCounts(partial, commitDocs, 0, originDelta, limit);
  if (reanchorNote) partial.note = reanchorNote;
  return partial;
}
function buildSyncReceipt(input) {
  const { outcome, commitDocs, pushedCount, originDelta, limit, establishAlreadyNote, reanchorNote, hookHint } = input;
  const rec = {};
  if (establishAlreadyNote) rec.establish = establishAlreadyNote;
  const announcement = provisionAnnouncement(outcome);
  if (announcement) Object.assign(rec, announcement);
  if (commitDocs.length === 0 && originDelta.length === 0 && pushedCount === 0 && !reanchorNote) {
    rec.sync = "already up to date";
    if (hookHint) rec.hint = hookHint;
    return rec;
  }
  assignCounts(rec, commitDocs, pushedCount, originDelta, limit);
  if (reanchorNote) rec.note = reanchorNote;
  if (hookHint) rec.hint = hookHint;
  return rec;
}

// src/commands/sync/show-incoming.ts
import { promises as fs11 } from "node:fs";
import path18 from "node:path";
var SHOW_INCOMING_AS_OF = "last fetch";
var SHOW_INCOMING_ABSENT_STATE = "absent upstream \u2014 not on origin/board as of the last fetch (deleted upstream, or a new local doc)";
var SHOW_INCOMING_IN_TREE_ABSENT_STATE = `absent upstream \u2014 not under ${BUNDLE_DIR}/ on the branch's tracking upstream as of the last fetch (deleted upstream, or a new local doc)`;
function showIncomingInTreeNoBasis(inv, reason, ref) {
  return syncOutcomeError("in-tree.show-incoming.no-basis", { inv, reason, ref });
}
function attachBodyPreview(rec, body, byteHatch) {
  if (body.length > BODY_PREVIEW_LIMIT) {
    rec.body = body.slice(0, BODY_PREVIEW_LIMIT);
    rec.body_truncated = true;
    rec.body_chars = body.length;
    rec.help = [byteHatch];
  } else {
    rec.body = body;
  }
}
async function showIncoming(id, values, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d) => void process.stdout.write(d));
  const inv = cliInvocation();
  const mode = resolveMode(values);
  const out = values.out?.trim();
  const streamMode = out === "-";
  const run = async () => {
    const dir = retargetBoardInterior(values.dir ?? process.cwd());
    const top = repoTopLevel(dir);
    if (!top) {
      throw new CliError(
        "RUNTIME",
        "not inside a git repository \u2014 there is no fetched board state to show",
        { details: { state: "no-repo" } }
      );
    }
    if (path18.isAbsolute(id) || id.split("/").some((seg) => seg === "..")) {
      throw new CliError("USAGE", `--show-incoming needs a repo-relative doc id or path without '..' segments: ${id}`);
    }
    let readRef = `refs/remotes/${BOARD_REF}`;
    let pathPrefix = "";
    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0) {
        throw ffSwallowToError("no-upstream", inv, top);
      }
      if (folderTreeAtHead(top) !== null) {
        const resolution = resolveInTreeUpstream(top);
        if (resolution.state === "none") throw showIncomingInTreeNoBasis(inv, resolution.reason);
        const sha = inTreeUpstreamSha(top, resolution.config.ref);
        if (sha === null) throw showIncomingInTreeNoBasis(inv, "unusable-upstream", resolution.config.ref);
        readRef = sha;
        pathPrefix = `${BUNDLE_DIR}/`;
      } else {
        throw syncOutcomeError("show-incoming.no-upstream", { inv });
      }
    }
    const candidates = [];
    let conceptIdOk = true;
    try {
      assertSafeConceptId(id);
    } catch {
      conceptIdOk = false;
    }
    if (conceptIdOk) {
      const conceptRelPath = pathFromConceptId(id);
      candidates.push({ relPath: conceptRelPath, isDoc: !isReservedFile(conceptRelPath) });
    }
    if (candidates.every((c) => c.relPath !== id)) candidates.push({ relPath: id, isDoc: false });
    let hit = null;
    for (const probe of candidates) {
      const bytes2 = readDocBytesAtRef(top, readRef, `${pathPrefix}${probe.relPath}`);
      if (bytes2 === null) continue;
      hit = { probe, bytes: bytes2 };
      break;
    }
    if (hit === null) {
      const state = {
        sync: "show-incoming",
        id,
        as_of: SHOW_INCOMING_AS_OF,
        state: pathPrefix === "" ? SHOW_INCOMING_ABSENT_STATE : SHOW_INCOMING_IN_TREE_ABSENT_STATE
      };
      (streamMode ? stderr : stdout)(render(state, mode));
      return;
    }
    const bytes = hit.bytes;
    if (out) {
      const receipt = {
        sync: "show-incoming",
        id,
        as_of: SHOW_INCOMING_AS_OF,
        out,
        size_bytes: bytes.byteLength
      };
      if (streamMode) {
        writeStdoutBytes(bytes);
        stderr(render(receipt, mode));
        return;
      }
      await fs11.writeFile(out, bytes);
      stdout(render(receipt, mode));
      return;
    }
    const content = bytes.toString("utf8");
    const byteHatch = `${inv} sync --show-incoming ${id} --out <file>`;
    const rec = {};
    if (!hit.probe.isDoc) {
      rec.path = hit.probe.relPath;
      rec.as_of = SHOW_INCOMING_AS_OF;
      attachBodyPreview(rec, content, byteHatch);
    } else {
      let parsed = null;
      try {
        const { frontmatter, body } = parseMarkdown(content, hit.probe.relPath);
        parsed = { frontmatter, body };
      } catch {
        parsed = null;
      }
      rec.id = id;
      if (parsed) {
        const KNOWN_ORDER = ["type", "title", "description", "resource", "tags", "timestamp"];
        const RESERVED_OUTPUT = /* @__PURE__ */ new Set(["id", "as_of", "body", "body_truncated", "body_chars", "help"]);
        for (const key of KNOWN_ORDER) {
          if (parsed.frontmatter[key] !== void 0 && parsed.frontmatter[key] !== null) rec[key] = parsed.frontmatter[key];
        }
        for (const key of Object.keys(parsed.frontmatter)) {
          if (KNOWN_ORDER.includes(key) || RESERVED_OUTPUT.has(key)) continue;
          if (parsed.frontmatter[key] === void 0 || parsed.frontmatter[key] === null) continue;
          rec[key] = parsed.frontmatter[key];
        }
      }
      rec.as_of = SHOW_INCOMING_AS_OF;
      attachBodyPreview(rec, parsed ? parsed.body : content, byteHatch);
    }
    stdout(render(rec, mode));
  };
  if (!streamMode) {
    await run();
    return;
  }
  try {
    await run();
  } catch (err) {
    const { envelope } = toExit(err);
    stderr(renderErrorEnvelope(envelope));
    throw asHandled(err);
  }
}

// src/commands/sync/orchestrate.ts
var SYNC_USAGE = `agentstate-lite sync \u2014 share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --establish [--yes] [--dir <path>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]

Shares this repo's board (\`.agentstate-lite\`, kept on its own \`board\` branch) with your
teammates: ordinary sync commits pending local doc changes, pulls theirs, and pushes yours without
touching code files. The one-time \`--establish\` transition also appends the board path to the
root working-tree \`.gitignore\` and reports that edit. \`--pull-only\` skips commit + push and
only fast-forwards from origin
(never rebases) \u2014 the mode a read-only session uses to pick up incoming changes without
publishing local ones.

\`init\` creates a LOCAL bundle; sharing it is a separate, explicit act. \`sync --establish\` turns
this project's local \`.agentstate-lite/\` into the shared board: it snapshots and publishes the
bundle, then checks out the new \`board\` branch at the same path \u2014 never automatic, never inferred
from a bare \`sync\` (which never publishes a bundle nobody has chosen to share). Once established
(here or by a teammate), plain \`sync\` is everyone's setup AND ongoing verb: on a project that
already shares a board, it provisions the local checkout, then commits, pulls, and pushes ordinary
board changes.
\`--establish\` on an already-established project is a safe no-op that notes \`already established\`
and proceeds as an ordinary sync.

On a repo that has never had the board checkout materialized locally (a fresh clone, or the first
\`aslite\` invocation after one), sync provisions \`.agentstate-lite\` itself from \`origin/board\` \u2014
never silently: the receipt carries a \`provisioned: <path>\` line. If the checkout already exists
but its pointers went stale (e.g. it was moved or remounted at a different path), sync self-heals
it via \`git worktree repair\` and reports \`repaired: <path>\` the same way \u2014 a repair is a git
mutation too, and both lines appear even on an otherwise-empty run.

Three definitive empty states (exit 0): no git repo \u2014 or a repo with neither a board branch nor
a bundle \u2014 prints 'sync: nothing to sync'; a repo whose bundle is known to have no board branch
anywhere is a LOCAL-ONLY board; a clean shared board prints 'sync: already up to date'. If origin
cannot be checked and no board ref is available, sync reports the shared-board state as unknown
and recommends retrying when origin is reachable.
Otherwise the receipt reports { committed, pushed, pulled, actor, incoming } \u2014 \`incoming\` is the
enriched delta of docs that arrived this run (capped; --limit controls the row cap, default 20).

When a doc changed on BOTH sides, sync CONVERGES: your teammate's version is kept on the board,
YOUR version is saved to an export file named in the receipt, and the sync completes (the
board is never left mid-state; non-conflicted local changes still land). The run exits 5 with
one row per conflicted doc and the reconcile chain: \`sync --show-incoming <id>\` to view the kept
incoming version, \`doc update <id> --body-file <export-file>\` to write your merged version on
top, then \`sync\` again to share it.

\`sync --show-incoming <id>\` prints the board's incoming (upstream) version of one doc \u2014 the
state of \`origin/board\` as of the last fetch (it never fetches). Full doc-read semantics: large
bodies truncate and point at \`--out <file>\` (raw bytes to disk); \`--out -\` streams the raw
bytes to stdout with the receipt (or any error envelope) on stderr. A doc absent upstream renders
as an expected state, not an error.

If the push fails after a local commit already landed (offline, revoked/expired credentials, or a
locked repository), the receipt still reports what committed/pulled successfully \u2014 your work is
saved locally either way, and re-running sync retries the push.

A board can also ride IN-TREE: \`.agentstate-lite/\` committed WITH the code on the current
branch, with no dedicated \`board\` branch anywhere. That is a supported, read-side mode \u2014 sync
recognizes it and behaves accordingly: \`sync --pull-only\` fetches the branch's own tracking
upstream and reports incoming board doc changes (your normal \`git pull\` delivers them);
\`session-start\`/\`home\` show the same upstream awareness; \`--show-incoming <id>\` reads the
upstream version. Sharing YOUR board changes rides your normal commit/push \u2014 a full \`sync\`
refuses (it would have to publish the code branch itself) and \`sync --establish\` remains the
explicit conversion to a dedicated \`board\` branch. If the branch has no upstream (or a detached
HEAD), in-tree awareness honestly reports that there is no comparison basis rather than guessing.

Board-READING commands (\`list\`, \`doc read\`, \`status\`, \`home\`, \`link show\`) also keep a
provisioned board fresh opportunistically: when the board's awareness state is older than ~5
minutes, the read first runs the same fast-forward-only pull \`--pull-only\` uses (time-boxed to
~2s; never a rebase, never provisioning, silent on any failure) and then serves fresh state \u2014 so
the board checkout's HEAD can advance after a plain \`list\`. Reads never auto-push; sharing YOUR
changes is always this verb. Set AGENTSTATE_LITE_NO_AUTOPULL to any non-empty value to disable
the auto-pull (note: "0" disables it too \u2014 the variable's PRESENCE is the switch) for CI or
scripted runs that must never touch the network.

\`--establish\` also handles the project whose \`.agentstate-lite/\` folder is ALREADY COMMITTED
on the current branch: it creates the \`board\` branch carrying the folder's CURRENT files (files
only \u2014 the folder's history stays where it is), pushes it to origin with tracking, and prepares
ONE local commit on a new \`board-cleanup\` branch that removes the folder from the current branch
and gitignores it \u2014 you push that branch and open the PR yourself; nothing on the current branch
is pushed or changed. Until that PR merges the old committed folder is a frozen snapshot: sync no
longer updates it, so treat it as read-only. Without \`--yes\`, the committed case prints a
preview (a dry run, including the rollout note to send teammates) and changes nothing. It refuses
while \`.agentstate-lite/\` has uncommitted changes, when the current branch is behind origin on
commits touching the folder (pull first \u2014 a teammate's board commit must never be stranded on
the frozen copy), when origin is unreachable (the freshness check and the push both need it),
and when any \`board/...\` branch exists locally or on the remote (git cannot create a \`board\`
branch alongside them). It reports 'already established' (exit 0) once a board branch exists on
origin \u2014 with state-aware guidance, including re-creating the folder-removal commit when an
interrupted run left it missing. Coordinate first: every board writer syncs (at minimum commits)
their board work before anyone establishes.

Two edge states are ACCEPTED rather than auto-resolved. (1) On a case-insensitive filesystem, a
committed folder whose name differs from \`.agentstate-lite\` only by case (a state this CLI never
creates) can misroute establishment \u2014 rename it to the exact lowercase spelling first. (2) Deleting
the remote \`board\` branch in the middle of the both-worlds window (a deliberate, destructive,
out-of-band act) leaves the prepared cleanup PR pointing at a board that no longer exists \u2014 do not
merge that PR; re-run \`sync --establish\` to publish the board again first.

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --establish          Explicitly publish this project's bundle as its shared board (a folder
                       already committed on the branch is handled too \u2014 preview first)
  --yes                Execute the committed-folder establishment (without it, that case prints
                       a preview and changes nothing; the uncommitted case never needs it)
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --out <file>         With --show-incoming: write the raw bytes to <file> ('-' = raw to stdout)
  --dir <path>         Directory to run sync from (default: the cwd) \u2014 must be inside a git repo
  --limit <n>          Cap the incoming-delta row list to <n> rows (default: 20; 0 = unlimited)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;
var DEFAULT_LIMIT3 = 20;
var SYNC_LOCAL_ONLY_MESSAGE = "local-only board \u2014 no shared board branch exists, so there is nothing to pull or push";
function syncLocalOnlyNote(inv) {
  return `a supported mode: every local command works, and your board changes stay on this machine (sync committed nothing). To share the board with teammates, run \`${inv} sync --establish\` \u2014 it publishes the board as a 'board' branch on the repo's 'origin' remote (add one first if the repo has none); teammates then just run sync.`;
}
var SYNC_REMOTE_STATE_UNKNOWN_MESSAGE = "shared board state unknown \u2014 origin could not be checked, so sync cannot tell whether a remote board exists";
function syncRemoteStateUnknownNote(inv, hasLocalBundle) {
  const local = hasLocalBundle ? "your local bundle remains usable and sync committed nothing. " : "sync changed nothing. ";
  return local + `Retry \`${inv} sync\` when origin is available; a shared board may already exist.`;
}
var SYNC_IN_TREE_BOARD_LINE = `in-tree \u2014 board docs ride the current code branch (${BUNDLE_DIR}/ is committed with the code)`;
var SYNC_IN_TREE_NO_BASIS = "no-comparison-basis";
function inTreePullHint(behind) {
  return syncOutcomeLine("line.home.in-tree.pull-hint", { n: behind });
}
var SYNC_IN_TREE_CURRENT = "checkout is current with upstream";
async function syncInTree(run) {
  const top = repoTopLevel(run.dir);
  if (!top) throw new CliError("RUNTIME", "not inside a git repository");
  const boardPath = path19.join(top, BUNDLE_DIR);
  if (!run.pullOnly) {
    const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
    throw syncOutcomeError("in-tree.sync-refusal", { inv: run.inv, boardPath, hasOrigin });
  }
  const key = resolveBundleKey(boardPath);
  await defaultSyncStore.refreshMarker(key);
  const result = await inTreeFetchAndRecord(defaultSyncStore, top, key);
  if (result.state === "fetch-failed") throw result.failure;
  const rec = { board: SYNC_IN_TREE_BOARD_LINE };
  if (result.state === "no-upstream") {
    rec.state = SYNC_IN_TREE_NO_BASIS;
    rec.note = syncOutcomeLine("line.in-tree.no-basis", { reason: result.reason });
  } else if (result.state === "unusable-upstream") {
    rec.state = SYNC_IN_TREE_NO_BASIS;
    rec.note = syncOutcomeLine("line.in-tree.no-basis", { reason: "unusable-upstream", ref: result.ref });
  } else {
    rec.upstream = result.upstreamRef;
    rec.incoming = cap2(toIncomingRows(result.changes), run.limit);
    const notes = [];
    if (result.reanchored) notes.push(REANCHOR_NOTE);
    notes.push(result.behind > 0 ? inTreePullHint(result.behind) : SYNC_IN_TREE_CURRENT);
    rec.note = notes.join("; ");
  }
  const hookHint = await hookInstallHintOnce(key, run.inv, run.deps.hookInstalled);
  if (hookHint) rec.hint = hookHint;
  run.stdout(render(rec, run.mode));
}
async function sync(argv, deps = {}) {
  try {
    await syncCommand(argv, deps);
  } catch (err) {
    throw isBoardGitError(err) ? cliErrorFromBoardGit(err) : err;
  }
}
function parseSyncInvocation(argv, inv) {
  const { values } = parseOrUsage(
    () => parseArgs22({
      args: argv,
      options: {
        "pull-only": { type: "boolean" },
        establish: { type: "boolean" },
        "show-incoming": { type: "string" },
        migrate: { type: "boolean" },
        yes: { type: "boolean" },
        out: { type: "string" },
        dir: { type: "string" },
        limit: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "sync"
  );
  if (values.help) return { kind: "help" };
  if (values.migrate) {
    throw new CliError(
      "USAGE",
      "--migrate was retired \u2014 'sync --establish' now handles a committed .agentstate-lite/ folder too (preview first; --yes executes)",
      { help: `${inv} sync --establish` }
    );
  }
  if (values.yes && !values.establish) {
    throw new CliError("USAGE", "--yes only applies to sync --establish (it confirms the committed-folder case)", {
      help: `${inv} sync --establish --yes`
    });
  }
  if (values["show-incoming"] !== void 0) {
    const id = values["show-incoming"].trim();
    if (!id) {
      throw new CliError("USAGE", "--show-incoming was given an empty value \u2014 pass a doc id (or a reserved path like log.md)", {
        help: `${inv} sync --show-incoming <id>`
      });
    }
    if (values["pull-only"]) {
      throw new CliError("USAGE", "--show-incoming and --pull-only cannot be combined \u2014 the viewer never pulls");
    }
    if (values.establish) {
      throw new CliError("USAGE", "--show-incoming and --establish cannot be combined");
    }
    return { kind: "show-incoming", id, values };
  }
  if (values.out !== void 0) {
    throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
      help: `${inv} sync --show-incoming <id> --out <file>`
    });
  }
  if (values.establish && values["pull-only"]) {
    throw new CliError(
      "USAGE",
      "--establish and --pull-only cannot be combined \u2014 establishing always publishes"
    );
  }
  let limit = DEFAULT_LIMIT3;
  if (values.limit !== void 0) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)");
    }
    limit = Number(raw);
  }
  const dir = retargetBoardInterior(values.dir ?? process.cwd());
  return {
    kind: "run",
    options: { dir, pullOnly: Boolean(values["pull-only"]), limit, mode: resolveMode(values) },
    establish: Boolean(values.establish),
    yes: Boolean(values.yes)
  };
}
function provisionPhase(run) {
  const emptyState = (rec) => {
    run.stdout(render(rec, run.mode));
    return null;
  };
  const outcome = provisionBoardWorktree(run.dir, { allowLocalBranch: false });
  if (outcome.kind === "local_board") {
    throw outcome.remoteExists ? syncOutcomeError("sync.local-board.remote-exists", { inv: run.inv }) : syncOutcomeError("sync.local-board.unpublished", { inv: run.inv });
  }
  if (outcome.kind === "no_repo") {
    return emptyState({ sync: "nothing to sync" });
  }
  if (outcome.kind === "no_board") {
    const hasLocalBundle = hasLocalOnlyBundle(run.dir);
    if (outcome.remoteState === "unknown") {
      return emptyState({
        sync: SYNC_REMOTE_STATE_UNKNOWN_MESSAGE,
        note: syncRemoteStateUnknownNote(run.inv, hasLocalBundle)
      });
    }
    if (hasLocalBundle) {
      return emptyState({ sync: SYNC_LOCAL_ONLY_MESSAGE, note: syncLocalOnlyNote(run.inv) });
    }
    return emptyState({ sync: "nothing to sync" });
  }
  const boardPath = outcome.boardPath;
  if (outcome.kind === "repaired") {
    healStaleRebaseBeforeProvisioning(run.dir);
  }
  return { boardPath, key: resolveBundleKey(boardPath), outcome };
}
async function baselinePhase(board) {
  await defaultSyncStore.refreshMarker(board.key);
  const storedCursor = await defaultSyncStore.readCursor(board.key);
  const startHead = currentHead(board.boardPath);
  const preFetchOriginRef = resolveOriginRef(board.boardPath);
  return { storedCursor, startHead, preFetchOriginRef };
}
async function commitPhase(board, pullOnly) {
  let commitResult = { committed: false, docs: [] };
  if (!pullOnly) {
    commitResult = stageAndCommit(board.boardPath);
    if (commitResult.committed && commitResult.docs.length > 0) {
      await defaultSyncStore.recordSelfActors(board.key, commitResult.docs.map((d) => d.actor));
    }
  }
  return commitResult;
}
async function pullPhase(run, board, commitResult) {
  const { boardPath, key, outcome } = board;
  if (run.pullOnly) {
    const ff = ffPull(boardPath);
    if (ff.swallowed) {
      throw withProvisionAnnouncement(ffSwallowToError(ff.swallowed, run.inv, boardPath), outcome);
    }
    return;
  }
  const fail = (err) => throwPostCommitFailure(withProvisionAnnouncement(err, outcome), commitResult.committed, key, boardPath);
  let rebaseOutcome;
  try {
    rebaseOutcome = fetchRebaseResolving(boardPath, defaultSyncStore.exportsDir(key));
  } catch (rawErr) {
    throw await fail(withUpstreamHelp(toCliError(rawErr, "rebase"), run.inv));
  }
  if (rebaseOutcome.status === "resolved") {
    throw await fail(buildConvergeError(boardPath, rebaseOutcome.conflicts, run.inv, run.limit));
  }
  if (rebaseOutcome.status === "no_upstream") {
    throw await fail(syncOutcomeError("sync.full.no-upstream", { inv: run.inv }));
  }
}
async function deltaPhase(board, baseline) {
  const { boardPath, key } = board;
  const postFetchOriginRef = resolveOriginRef(boardPath);
  const originDelta = originDocsBetween(boardPath, baseline.preFetchOriginRef, postFetchOriginRef);
  const { storedCursor } = baseline;
  const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? baseline.startHead);
  if (delta.ok) {
    await defaultSyncStore.writeCursor(key, { tier: "git", token: postPullHead });
    return { originDelta, changes: delta.changes };
  }
  await defaultSyncStore.recordReanchor(
    key,
    { tier: "git", token: postPullHead },
    { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) }
  );
  return { originDelta, changes: [], reanchorNote: REANCHOR_NOTE };
}
async function pushPhase(run, board, commitResult, delta) {
  if (run.pullOnly) return 0;
  const ahead = unpushedCount(board.boardPath) ?? 0;
  try {
    push(board.boardPath);
    return ahead;
  } catch (err) {
    const classified = toCliError(err, "push");
    const warning = pushFailureMessage(classified);
    const partial = buildPushFailurePartial(
      board.outcome,
      warning,
      commitResult.docs,
      delta.originDelta,
      run.limit,
      delta.reanchorNote
    );
    run.stdout(render(partial, run.mode));
    await writeAwarenessCache(board.key, board.boardPath, delta.changes, delta.reanchorNote);
    throw asHandled(new CliError(classified.code, warning, { details: classified.details }));
  }
}
async function receiptPhase(run, board, commitResult, delta, pushedCount, establishAlreadyNote) {
  await writeAwarenessCache(board.key, board.boardPath, delta.changes, delta.reanchorNote);
  const hookHint = await hookInstallHintOnce(board.key, run.inv, run.deps.hookInstalled);
  const receipt = buildSyncReceipt({
    outcome: board.outcome,
    commitDocs: commitResult.docs,
    pushedCount,
    originDelta: delta.originDelta,
    limit: run.limit,
    establishAlreadyNote,
    reanchorNote: delta.reanchorNote,
    hookHint
  });
  run.stdout(render(receipt, run.mode));
}
async function syncCommand(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const inv = cliInvocation();
  const dispatch = parseSyncInvocation(argv, inv);
  if (dispatch.kind === "help") {
    stdout(SYNC_USAGE);
    return;
  }
  if (dispatch.kind === "show-incoming") {
    await showIncoming(dispatch.id, dispatch.values, deps);
    return;
  }
  const run = { ...dispatch.options, inv, stdout, deps };
  let establishAlreadyNote;
  if (dispatch.establish) {
    const establishOutcome = await establishBoard(run.dir, inv, run.mode, stdout, deps, { yes: dispatch.yes });
    if (!establishOutcome.already) return;
    establishAlreadyNote = ESTABLISH_ALREADY;
  }
  healStaleRebaseBeforeProvisioning(run.dir);
  const detection = detectBoardChannel(run.dir);
  if (detection.kind === "channel" && detection.channel.mode === "in-tree") {
    await syncInTree(run);
    return;
  }
  const board = provisionPhase(run);
  if (board === null) return;
  const baseline = await baselinePhase(board);
  const commitResult = await commitPhase(board, run.pullOnly);
  await pullPhase(run, board, commitResult);
  const delta = await deltaPhase(board, baseline);
  const pushedCount = await pushPhase(run, board, commitResult, delta);
  await receiptPhase(run, board, commitResult, delta, pushedCount, establishAlreadyNote);
}

// src/reference.ts
var DESCRIPTION = "read and write a local OKF knowledge bundle (context notes, docs, cross-links, live bundle Views)";
var COMMAND_GROUPS = [
  {
    group: "Bundle",
    commands: [
      {
        usage: "bundle locate [--dir <path>]",
        summary: "Resolve the exact canonical local bundle path and report why it won selection"
      },
      {
        usage: "catalog (add <label> [--dir <path>] | list | resolve <label-or-id> [--field path])",
        summary: "Register and deterministically resolve this user's explicitly named local workspaces"
      },
      {
        usage: "init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]",
        summary: "Create (or open) an OKF knowledge bundle in a directory \u2014 greenfield setup; a project that already shares a board is set up by sync, not init"
      },
      {
        usage: "index generate [--dir <path>] [--check] [--force] [--actor <name>]",
        summary: "Generate complete portable Markdown navigation explicitly; refuses curated indexes unless --force adopts them"
      },
      {
        usage: "status [--limit <n>] [--remote <url>]",
        summary: "Read-only bundle health report (kind lint, unresolved links, orphans, staleness, graph lints)"
      }
    ]
  },
  {
    group: "Documents & links",
    commands: [
      {
        usage: "doc write <id> --type <t> [--title <t>] [--body <s> | --body-file <p>] [--actor <n>] [--remote <url>]",
        summary: "Write a generic OKF concept document"
      },
      {
        usage: "doc update <id> [--<field> <value> ...] [--title <t>] [--tag <t>] [--type <t>] [--body <s> | --body-file <p>] [--expected-version <v>] [--actor <n>] [--remote <url>]",
        summary: "Patch given fields (incl. kind-declared fields like --status) of an existing doc, preserving the rest; optimistic-CAS with --expected-version"
      },
      {
        usage: "doc read <id> [--out (<path> | -) | --body-out (<path> | -) | --field <name>] [--remote <url>]",
        summary: "Read a doc, export its raw markdown, export its body with a same-read CAS version, or print one raw field for scripting"
      },
      {
        usage: "doc history <id> [--limit <n>] [--remote <url>]",
        summary: "Show a doc's version history (newest first, capped at 20 by default \u2014 --limit 0 for all; a history-keeping backend returns the full attributed chain, a local bundle just the current revision) \u2014 the tokens for --expected-version"
      },
      {
        usage: "doc delete <id> [--expected-version <v>] [--remote <url>]",
        summary: "Hard-delete a doc (idempotent: absent -> deleted:false, exit 0)"
      },
      {
        usage: "list [--type <t>] [--tag <t>] [--field <k=v>] [--prefix <p>] [--open] [--limit <n>] [--remote <url>]",
        summary: "Query concepts over their frontmatter (alias: query) \u2014 a comma in --field's value is set membership (OR); --open excludes terminal instances (declared kinds only)"
      },
      {
        usage: "link (add <from> <to> [--text <t>] [--actor <n>] | show <id> [--limit <n>] [--text <t>] | list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]) [--remote <url>]",
        summary: "Add a cross-link, show a concept's links + backlinks, or query the whole bundle's derived edge list filtered by from/to (id or prefix/, repeatable/union) and exact-match text"
      }
    ]
  },
  {
    group: "Artifacts",
    commands: [
      {
        usage: "promote <file> --doc-key <key> [--content-type <mime>] [--expected-version <v>] [--remote <url>]",
        summary: "Move a local file's bytes into the store (a .md key routes through the engine; else a blob)"
      },
      {
        usage: "pull --doc-key <key> --out (<path> | -) [--remote <url>]",
        summary: "Pull a doc's canonical form or a blob's raw bytes out of the store (the reverse of promote)"
      },
      {
        usage: "blobs [--prefix <p>] [--limit <n>] [--remote <url>]",
        summary: "List the store's blob (non-document) keys (documents are listed by 'list'/'query')"
      },
      {
        usage: "delete --doc-key <key> [--expected-version <v>] [--remote <url>]",
        summary: "Hard-delete a doc or blob by key (idempotent: absent -> deleted:false, exit 0)"
      }
    ]
  },
  {
    group: "Kinds",
    commands: [
      {
        usage: 'new "<Kind>" <id> --<field> <value> [...] [--body-file <path>] [--link "<type>=<target-id>" ...] [--no-prefix] [--actor <n>] [--remote <url>]',
        summary: "Create a new instance of a bundle-declared kind \u2014 initial Markdown may come from --body-file (otherwise declared sections are scaffolded); validates strictly, and repeatable --link wires typed cross-links in the same step"
      },
      {
        usage: "kinds [--remote <url>]",
        summary: "List the kind conventions this bundle declares (purpose, described fields, exact required body headings, typed-link vocabulary, horizon)"
      },
      {
        usage: 'kind field "<Kind>" (add <name> [--required] [--values <a,b,c>] | remove <name>) [--remote <url>]',
        summary: "Edit a kind's schema \u2014 add/remove a declared field or enum value on its convention (idempotent)"
      },
      {
        usage: "recipes [--remote <url>]",
        summary: "List built-in recipes and whether each is already applied to this bundle"
      },
      {
        usage: "recipe add <name-or-path> [--remote <url>]",
        summary: "Apply a recipe's content-free definitions \u2014 Kinds plus optional declared References and Views \u2014 idempotently"
      }
    ]
  },
  {
    group: "Remote",
    commands: [
      {
        usage: "serve [--dir <path>] [--host <h>] [--port <p>]",
        summary: "Boot the reference wire-protocol server over a local bundle (loopback, no auth)"
      },
      {
        usage: "ui [--dir <path> | --remote <url>] [--port <p>] [--open]",
        summary: `Boot the local web UI: a launcher for the bundle's views (type: View docs rendered in sandboxed iframes, with live updates; legacy Page docs keep working) \u2014 same origin, loopback-only. The header shows the bundle's display name \u2014 derived from the project folder unless set explicitly: doc write docs/bundle --type "Bundle Name" --title "<name>"`
      },
      {
        usage: "sync [--establish [--yes] | --pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]",
        summary: "Share the board branch with a remote \u2014 commits, pulls, and pushes (git tier; --pull-only skips commit+push). `init` makes a LOCAL bundle; --establish is the separate, explicit act that starts sharing it (creates the board branch, pushes; never automatic). A bundle folder already committed on the code branch is the same flag's hard case: preview first, --yes executes, and the folder's removal from the code branch rides a prepared side-branch commit you push and open as a PR. A bundle committed with code and NO board branch anywhere is the IN-TREE mode (read-side): full sync refuses (sharing rides your normal commit/push), --pull-only fetches the branch's tracking upstream and reports incoming board docs ('git pull' delivers them), and --establish converts to a dedicated board branch. A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch. Board-reading commands (list/doc read/status/home/link show) auto-run the ff-only pull when board state is >~5m stale \u2014 silent, bounded (~2s), never a push; AGENTSTATE_LITE_NO_AUTOPULL=<any value, even 0> disables it"
      }
    ]
  },
  {
    group: "Session",
    commands: [
      {
        usage: "session-start [--dir <path>]",
        summary: "The SessionStart hook payload: a time-boxed best-effort board pull, then the home view \u2014 every pull failure falls through to the render (exit 0)"
      },
      {
        usage: "hook install|status|uninstall [--scope project|global]",
        summary: "Install the SessionStart hook (runs session-start: pull the board, then render) for Claude Code, Codex, OpenCode"
      }
    ]
  }
];
function kindsPointer(invocation) {
  return `kinds are declared per-bundle \u2014 run \`${invocation} kinds\` to list them`;
}
function remoteEnvPointer() {
  return "bundle resolution: HTTP is activated only by explicit --remote <url>; otherwise an explicit --dir wins, then a committed .agentstate.json local-path binding at or above the cwd, then local discovery walks up for an enclosing or conventional project bundle. URL-valued bindings and the retired AGENTSTATE_LITE_REMOTE ambient default fail with guidance to pass --remote explicitly";
}
function commandReference(invocation) {
  const commands = {};
  for (const { group, commands: refs } of COMMAND_GROUPS) {
    commands[group] = refs.map((c) => `${c.usage} \u2014 ${c.summary}`);
  }
  return { commands, kinds: kindsPointer(invocation), remoteEnv: remoteEnvPointer() };
}
function commandName(usage2) {
  const stop = usage2.search(/[<[("]|\s--|\s-\w/);
  return (stop === -1 ? usage2 : usage2.slice(0, stop)).trim();
}
function compactCommandReference(invocation) {
  const commands = {};
  for (const { group, commands: refs } of COMMAND_GROUPS) {
    commands[group] = [...new Set(refs.map((c) => commandName(c.usage)))].join(", ");
  }
  return {
    commands,
    commands_help: `run \`${invocation} <command> --help\` (or \`${invocation} --help\`) for full usage`
  };
}
function wrapText(text, width = 96) {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wrapped = [];
  let line2 = "";
  for (const word of words) {
    const candidate = line2.length === 0 ? word : `${line2} ${word}`;
    if (candidate.length > width && line2.length > 0) {
      wrapped.push(line2);
      line2 = word;
    } else {
      line2 = candidate;
    }
  }
  if (line2.length > 0) wrapped.push(line2);
  return wrapped.join("\n");
}
function helpIndexText(invocation) {
  const ref = commandReference(invocation);
  const lines = [
    `${invocation} \u2014 ${DESCRIPTION}`,
    "",
    `Usage: ${invocation} <command> [options]`,
    `Run \`${invocation} <command> --help\` for a specific command's full reference.`
  ];
  for (const [group, commandLines] of Object.entries(ref.commands)) {
    lines.push("", `${group}:`);
    for (const commandLine of commandLines) {
      lines.push(`  ${commandLine}`);
    }
  }
  lines.push("", wrapText(ref.kinds), "", wrapText(ref.remoteEnv));
  return `${lines.join("\n")}
`;
}

// src/commands/home.ts
import { parseArgs as parseArgs23 } from "node:util";
import path21 from "node:path";

// src/catalog.ts
import { randomUUID as randomUUID3 } from "node:crypto";
import { chmod as chmod3, mkdir as mkdir3, open as open2, readFile as readFile4, stat, unlink as unlink3 } from "node:fs/promises";
import { homedir as homedir8 } from "node:os";
import path20 from "node:path";
var CATALOG_FILE_NAME = "catalog.json";
var CATALOG_LOCK_FILE_NAME = "catalog.lock";
var CATALOG_SCHEMA_VERSION = 1;
var DIR_MODE3 = 448;
var LOCK_MODE = 384;
var DEFAULT_LOCK_WAIT_MS = 2e3;
var DEFAULT_LOCK_POLL_MS = 25;
var STALE_LOCK_MIN_AGE_MS = 3e4;
var LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/;
var ID_PATTERN = /^bnd_[0-9a-f]{32}$/;
function catalogDir(home2) {
  return credentialsDir(home2);
}
function catalogPath(home2 = homedir8()) {
  return path20.join(catalogDir(home2), CATALOG_FILE_NAME);
}
function catalogLockPath(home2 = homedir8()) {
  return path20.join(catalogDir(home2), CATALOG_LOCK_FILE_NAME);
}
function isObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function hasExactKeys2(value, expected) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((key, index) => key === sortedExpected[index]);
}
function invalidCatalog(file, detail) {
  return new CliError("USAGE", `invalid workspace catalog ${file}: ${detail}`, {
    help: `repair or move ${file}, then retry`
  });
}
function assertCatalogLabel(label) {
  if (!LABEL_PATTERN.test(label) || label.startsWith("bnd_")) {
    throw new CliError(
      "USAGE",
      `invalid workspace label "${label}"; use 1-64 lowercase letters, numbers, dot, dash, or underscore, beginning and ending with a letter or number (the bnd_ prefix is reserved)`,
      { help: `${cliInvocation()} catalog add <label> [--dir <path>]` }
    );
  }
}
function validateEntry(value, file, index) {
  if (!isObject2(value) || !hasExactKeys2(value, ["id", "label", "locator"])) {
    throw invalidCatalog(file, `entries[${index}] must contain exactly id, label, and locator`);
  }
  if (typeof value.id !== "string" || !ID_PATTERN.test(value.id)) {
    throw invalidCatalog(file, `entries[${index}].id must match ${ID_PATTERN.source}`);
  }
  if (typeof value.label !== "string" || !LABEL_PATTERN.test(value.label) || value.label.startsWith("bnd_")) {
    throw invalidCatalog(file, `entries[${index}].label is not a valid workspace label`);
  }
  if (!isObject2(value.locator) || !hasExactKeys2(value.locator, ["kind", "path"])) {
    throw invalidCatalog(file, `entries[${index}].locator must contain exactly kind and path`);
  }
  if (value.locator.kind !== "local-path") {
    throw invalidCatalog(file, `entries[${index}].locator.kind must be "local-path"`);
  }
  if (typeof value.locator.path !== "string" || !path20.isAbsolute(value.locator.path) || path20.normalize(value.locator.path) !== value.locator.path) {
    throw invalidCatalog(file, `entries[${index}].locator.path must be a normalized absolute path`);
  }
  return {
    id: value.id,
    label: value.label,
    locator: { kind: "local-path", path: value.locator.path }
  };
}
function parseCatalog(raw, file) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw invalidCatalog(file, `invalid JSON (${err instanceof Error ? err.message : String(err)})`);
  }
  if (!isObject2(parsed)) throw invalidCatalog(file, "top level must be an object");
  if (parsed.schema_version !== CATALOG_SCHEMA_VERSION) {
    if (typeof parsed.schema_version === "number" && parsed.schema_version > CATALOG_SCHEMA_VERSION) {
      throw new CliError(
        "NOT_IMPLEMENTED",
        `workspace catalog ${file} uses newer schema version ${parsed.schema_version}; this CLI supports version ${CATALOG_SCHEMA_VERSION}`,
        { help: "upgrade agentstate-lite before modifying this catalog" }
      );
    }
    throw invalidCatalog(file, `schema_version must be ${CATALOG_SCHEMA_VERSION}`);
  }
  if (!hasExactKeys2(parsed, ["entries", "schema_version"]) || !Array.isArray(parsed.entries)) {
    throw invalidCatalog(file, "top level must contain exactly schema_version and entries[]");
  }
  const entries = parsed.entries.map((entry, index) => validateEntry(entry, file, index));
  const ids = /* @__PURE__ */ new Set();
  const labels = /* @__PURE__ */ new Set();
  const paths = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw invalidCatalog(file, `duplicate id "${entry.id}"`);
    if (labels.has(entry.label)) throw invalidCatalog(file, `duplicate label "${entry.label}"`);
    if (paths.has(entry.locator.path)) throw invalidCatalog(file, `duplicate path "${entry.locator.path}"`);
    ids.add(entry.id);
    labels.add(entry.label);
    paths.add(entry.locator.path);
  }
  return { schema_version: CATALOG_SCHEMA_VERSION, entries };
}
async function loadCatalog(home2 = homedir8(), signal) {
  const file = catalogPath(home2);
  let raw;
  try {
    if (!(await stat(file)).isFile()) {
      throw new CliError("RUNTIME", `workspace catalog ${file} is not a regular file`);
    }
    raw = await readFile4(file, { encoding: "utf8", signal });
  } catch (err) {
    if (err.code === "ENOENT") {
      return { schema_version: CATALOG_SCHEMA_VERSION, entries: [] };
    }
    if (err instanceof CliError) throw err;
    throw new CliError("RUNTIME", `could not read workspace catalog ${file}: ${err instanceof Error ? err.message : String(err)}`);
  }
  return parseCatalog(raw, file);
}
function defaultProcessExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code !== "ESRCH";
  }
}
function readLockMetadata(raw) {
  try {
    const value = JSON.parse(raw);
    if (!isObject2(value) || typeof value.pid !== "number" || !Number.isSafeInteger(value.pid) || value.pid <= 0 || typeof value.created_at_ms !== "number" || !Number.isFinite(value.created_at_ms) || typeof value.token !== "string" || value.token.length === 0) {
      return null;
    }
    return { pid: value.pid, created_at_ms: value.created_at_ms, token: value.token };
  } catch {
    return null;
  }
}
async function acquireCatalogLock(options2) {
  const home2 = options2.home ?? homedir8();
  const dir = catalogDir(home2);
  const lockPath = catalogLockPath(home2);
  const now = options2.now ?? Date.now;
  const pid = options2.pid ?? process.pid;
  const sleep = options2.sleep ?? ((ms) => new Promise((resolve2) => setTimeout(resolve2, ms)));
  const processExists2 = options2.processExists ?? defaultProcessExists;
  const waitMs = options2.lockWaitMs ?? DEFAULT_LOCK_WAIT_MS;
  const pollMs = options2.lockPollMs ?? DEFAULT_LOCK_POLL_MS;
  const token = randomUUID3();
  const started = now();
  await mkdir3(dir, { recursive: true, mode: DIR_MODE3 });
  await chmod3(dir, DIR_MODE3);
  while (true) {
    try {
      const handle = await open2(lockPath, "wx", LOCK_MODE);
      try {
        await handle.writeFile(JSON.stringify({ pid, created_at_ms: now(), token }) + "\n");
        await handle.chmod(LOCK_MODE);
        await handle.sync();
      } catch (err) {
        await handle.close().catch(() => {
        });
        await unlink3(lockPath).catch(() => {
        });
        throw err;
      }
      await handle.close();
      return async () => {
        try {
          const current = readLockMetadata(await readFile4(lockPath, "utf8"));
          if (current?.token === token) await unlink3(lockPath);
        } catch (err) {
          if (err.code !== "ENOENT") throw err;
        }
      };
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
    let owner = null;
    let malformedAgeMs = null;
    try {
      owner = readLockMetadata(await readFile4(lockPath, "utf8"));
      if (!owner) malformedAgeMs = now() - (await stat(lockPath)).mtimeMs;
    } catch (err) {
      if (err.code === "ENOENT") continue;
    }
    if (owner && now() - owner.created_at_ms >= STALE_LOCK_MIN_AGE_MS && !processExists2(owner.pid)) {
      throw new CliError("TRANSIENT", `stale workspace catalog lock at ${lockPath} belongs to absent PID ${owner.pid}`, {
        details: { retryable: true, stale: true, lock_path: lockPath, owner_pid: owner.pid },
        help: `remove ${lockPath} after confirming PID ${owner.pid} is absent, then retry`
      });
    }
    if (malformedAgeMs !== null && malformedAgeMs >= STALE_LOCK_MIN_AGE_MS) {
      throw new CliError("TRANSIENT", `stale malformed workspace catalog lock at ${lockPath}`, {
        details: { retryable: true, stale: true, malformed: true, lock_path: lockPath },
        help: `inspect and remove ${lockPath}, then retry`
      });
    }
    if (now() - started >= waitMs) {
      throw new CliError("TRANSIENT", `workspace catalog is busy (lock: ${lockPath})`, {
        details: { retryable: true, lock_path: lockPath, owner_pid: owner?.pid },
        help: `${cliInvocation()} catalog <command> ...`
      });
    }
    await sleep(pollMs);
  }
}
async function mutateCatalog(decide, options2) {
  const home2 = options2.home ?? homedir8();
  const release = await acquireCatalogLock({ ...options2, home: home2 });
  try {
    const current = await loadCatalog(home2);
    const result = await decide(current);
    if (result.changed) {
      if (!result.next) throw new Error("catalog mutation marked changed without a next state");
      const next = {
        schema_version: CATALOG_SCHEMA_VERSION,
        entries: [...result.next.entries].sort((a, b) => a.label.localeCompare(b.label))
      };
      await writeFileAtomic0600(catalogDir(home2), CATALOG_FILE_NAME, JSON.stringify(next, null, 2) + "\n");
    }
    return { value: result.value, changed: result.changed };
  } finally {
    await release();
  }
}
function generatedId(options2, existing) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const id = options2.createId?.() ?? `bnd_${randomUUID3().replaceAll("-", "")}`;
    if (!ID_PATTERN.test(id)) throw new Error(`catalog id generator returned invalid id: ${id}`);
    if (!existing.has(id)) return id;
  }
  throw new Error("catalog id generator exhausted collision retries");
}
async function addCatalogEntry(label, canonicalPath, options2 = {}) {
  assertCatalogLabel(label);
  if (!path20.isAbsolute(canonicalPath)) throw new CliError("USAGE", "workspace catalog paths must be absolute");
  const result = await mutateCatalog(async (current) => {
    const target = await resolveLocalBundleTarget(canonicalPath);
    if (target.canonicalRoot !== canonicalPath) {
      throw new CliError("NOT_FOUND", `workspace path is no longer canonical: ${canonicalPath}`, {
        help: `${cliInvocation()} bundle locate --dir ${canonicalPath}`
      });
    }
    const byLabel = current.entries.find((entry2) => entry2.label === label);
    const byPath = current.entries.find((entry2) => entry2.locator.path === canonicalPath);
    if (byLabel && byPath && byLabel.id === byPath.id) {
      return { value: byLabel, changed: false };
    }
    if (byLabel) {
      throw new CliError("ALREADY_EXISTS", `workspace label "${label}" already points to ${byLabel.locator.path}`, {
        details: { id: byLabel.id, label, path: byLabel.locator.path },
        help: `${cliInvocation()} catalog resolve ${label}`
      });
    }
    if (byPath) {
      throw new CliError("ALREADY_EXISTS", `workspace path ${canonicalPath} is already labeled "${byPath.label}"`, {
        details: { id: byPath.id, label: byPath.label, path: canonicalPath },
        help: `${cliInvocation()} catalog resolve ${byPath.label}`
      });
    }
    const entry = {
      id: generatedId(options2, new Set(current.entries.map((item) => item.id))),
      label,
      locator: { kind: "local-path", path: canonicalPath }
    };
    return {
      value: entry,
      changed: true,
      next: { schema_version: CATALOG_SCHEMA_VERSION, entries: [...current.entries, entry] }
    };
  }, options2);
  return { entry: result.value, changed: result.changed };
}
async function entryAvailable(entry) {
  try {
    const target = await resolveLocalBundleTarget(entry.locator.path);
    return target.canonicalRoot === entry.locator.path;
  } catch {
    return false;
  }
}
async function listCatalogEntries(home2 = homedir8()) {
  const catalog2 = await loadCatalog(home2);
  return Promise.all(
    [...catalog2.entries].sort((a, b) => a.label.localeCompare(b.label)).map(async (entry) => ({ ...entry, available: await entryAvailable(entry) }))
  );
}
function classifySelector(selector) {
  if (selector.startsWith("bnd_")) {
    if (!ID_PATTERN.test(selector)) {
      throw new CliError("USAGE", `invalid workspace catalog id "${selector}"`);
    }
    return "id";
  }
  assertCatalogLabel(selector);
  return "label";
}
async function resolveCatalogEntry(selector, home2 = homedir8()) {
  const catalog2 = await loadCatalog(home2);
  const kind2 = classifySelector(selector);
  const entry = catalog2.entries.find((item) => item[kind2] === selector);
  if (!entry) {
    throw new CliError("NOT_FOUND", `workspace "${selector}" is not registered`, {
      help: `${cliInvocation()} catalog list`
    });
  }
  if (!await entryAvailable(entry)) {
    throw new CliError("NOT_FOUND", `workspace "${entry.label}" is unavailable at ${entry.locator.path}`, {
      details: { id: entry.id, label: entry.label, path: entry.locator.path },
      help: `restore the bundle at ${entry.locator.path}, then retry`
    });
  }
  return { ...entry, available: true };
}

// src/commands/home.ts
var HOME_RECENT_LIMIT = 5;
var HOME_WORKSPACES_BUDGET_MS = 500;
var HOME_WORKSPACES_LIMIT = 15;
function rowTitle(id, title) {
  return typeof title === "string" ? title : id.split("/").pop() ?? id;
}
function summarizeDocs(docs, root) {
  const byType = {};
  for (const d of docs) {
    const t = typeof d.frontmatter.type === "string" ? d.frontmatter.type : "";
    byType[t] = (byType[t] ?? 0) + 1;
  }
  const sortedByType = Object.fromEntries(
    Object.entries(byType).sort(([ta, ca], [tb, cb]) => cb - ca || ta.localeCompare(tb))
  );
  const rows = docs.map((d) => ({
    id: d.id,
    type: typeof d.frontmatter.type === "string" ? d.frontmatter.type : "",
    title: rowTitle(d.id, d.frontmatter.title),
    timestamp: typeof d.frontmatter.timestamp === "string" ? d.frontmatter.timestamp : ""
  }));
  rows.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      if (a.timestamp !== b.timestamp) return a.timestamp < b.timestamp ? 1 : -1;
    } else if (a.timestamp !== b.timestamp) {
      return a.timestamp ? -1 : 1;
    }
    return a.id.localeCompare(b.id);
  });
  return {
    root,
    docs: docs.length,
    byType: sortedByType,
    recent: {
      shown: Math.min(rows.length, HOME_RECENT_LIMIT),
      total: rows.length,
      rows: rows.slice(0, HOME_RECENT_LIMIT)
    }
  };
}
async function defaultSummarizeBundle(dir) {
  let bundle;
  try {
    bundle = await openBundle(dir, void 0);
  } catch {
    return null;
  }
  try {
    const docs = await queryHeads(bundle);
    const { name, source } = await deriveBundleDisplayName(bundle);
    return { name, nameSource: source, ...summarizeDocs(docs, collapseHomeDirectory2(bundle.root)) };
  } catch {
    return { root: collapseHomeDirectory2(bundle.root), unreadable: true };
  }
}
async function discoverSummarizeBundle(startDir) {
  try {
    const root = await findBundleRoot(path21.resolve(startDir));
    return root ? defaultSummarizeBundle(root) : null;
  } catch {
    return null;
  }
}
async function defaultLoadWorkspaces(home2, signal) {
  return (await loadCatalog(home2, signal)).entries.map(({ label }) => ({ label })).sort((a, b) => a.label.localeCompare(b.label));
}
var BOARD_CHANGES_SHOWN_LIMIT = 10;
var IN_TREE_SINCE_FIELD = "since_this_machine_last_checked";
function hookUpdateNote(inv) {
  return `the installed SessionStart hook predates \`session-start\` \u2014 re-run \`${inv} hook install\` to pick up the board-aware hook`;
}
function actorPhrase(rows) {
  const actors = [];
  for (const r of rows) if (!actors.includes(r.actor)) actors.push(r.actor);
  if (actors.length <= 1) return actors[0] ?? "";
  return `${actors.slice(0, -1).join(", ")} and ${actors[actors.length - 1]}`;
}
function sinceLine(rows) {
  const n = rows.length;
  return `${n} board ${n === 1 ? "change" : "changes"} from ${actorPhrase(rows)}`;
}
function docLine(row2) {
  const kindPart = row2.kind && row2.kind !== "unknown" ? `${row2.kind} ` : "";
  return `${row2.actor} \xB7 ${row2.verb} ${kindPart}"${row2.title}"`;
}
function countOr(live, cached) {
  return live ?? cached ?? 0;
}
function buildBoardBlock(status2, pull2, inv) {
  if (!status2) return {};
  if (status2.state === "unprovisioned") return { firstContact: boardFirstContactLine(inv) };
  if (status2.state === "window") return { firstContact: status2.line };
  const inTree = status2.state === "in-tree";
  const rec = {};
  if (pull2?.announcement) Object.assign(rec, pull2.announcement);
  const rows = status2.cache?.delta ?? [];
  const visible = rows.filter((r) => !status2.selfActors.includes(r.actor));
  if (visible.length > 0) {
    rec[inTree ? IN_TREE_SINCE_FIELD : "since_this_machine_last_synced"] = sinceLine(visible);
    rec.changes = visible.slice(0, BOARD_CHANGES_SHOWN_LIMIT).map(docLine);
  }
  const unpushed = countOr(status2.unpushed, status2.cache?.unpushedCount);
  const uncommitted = countOr(status2.uncommitted, status2.cache?.uncommittedCount);
  if (unpushed > 0) rec.unpushed = inTree ? inTreeUnpushedLine(unpushed) : unpushedLine(unpushed);
  if (uncommitted > 0) rec.uncommitted = inTree ? inTreeUncommittedLine(uncommitted) : uncommittedLine(uncommitted);
  const notes = [];
  if (inTree && (status2.behind ?? 0) > 0) notes.push(inTreePullHintLine(status2.behind));
  if (pull2?.offline) notes.push(BOARD_OFFLINE_NOTE);
  if (pull2?.notes) notes.push(...pull2.notes);
  if (status2.cache?.note) notes.push(status2.cache.note);
  if (notes.length > 0) rec.note = notes.join("; ");
  if (status2.cache && !pull2?.refreshed && Object.keys(rec).length > 0) {
    rec.as_of = status2.cache.updatedAt;
  }
  if (Object.keys(rec).length === 0) return { block: inTree ? BOARD_IN_TREE_LINE : BOARD_UP_TO_DATE };
  return { block: rec };
}
async function defaultLoadBoardStatus(dir) {
  try {
    const top = repoTopLevel(retargetBoardInterior(dir ?? process.cwd()));
    if (!top) return null;
    const boardPath = path21.join(top, BUNDLE_DIR);
    if (!isProvisioned(top)) {
      const remoteRefExists = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
      const probed = remoteRefExists || runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      if (remoteRefExists && folderTreeAtHead(top) !== null && !hasWorktreeSignature(boardPath)) {
        try {
          detectBoardChannel(top, { remoteBoardState: () => "exists" });
        } catch (err) {
          if (isBoardGitError(err)) return { state: "window", line: err.message };
          throw err;
        }
      }
      if (probed) return { state: "unprovisioned" };
      if (folderTreeAtHead(top) !== null && !hasWorktreeSignature(boardPath)) {
        const key2 = resolveBundleKey(boardPath);
        const state2 = await defaultSyncStore.readSyncState(key2);
        const upstream = resolveInTreeUpstream(top);
        const sha = upstream.state === "ok" ? inTreeUpstreamSha(top, upstream.config.ref) : null;
        return {
          state: "in-tree",
          cache: state2.cache,
          selfActors: state2.selfActors ?? [],
          unpushed: sha === null ? null : inTreeUnpushedCount(top, sha),
          uncommitted: countUncommitted(top, BUNDLE_DIR),
          behind: sha === null ? null : inTreeBehindCount(top, sha)
        };
      }
      return null;
    }
    const key = resolveBundleKey(boardPath);
    const state = await defaultSyncStore.readSyncState(key);
    let uncommitted;
    try {
      uncommitted = countUncommitted(boardPath);
    } catch {
      uncommitted = null;
    }
    return {
      state: "provisioned",
      cache: state.cache,
      selfActors: state.selfActors ?? [],
      unpushed: unpushedCount(boardPath),
      uncommitted
    };
  } catch {
    return null;
  }
}
function buildHomeView(deps, summary, remote, binding, bindingError, board, hookUpdate, workspaces) {
  const inv = deps.invocation();
  const ref = commandReference(inv);
  const view = {
    "agentstate-lite": { bin: deps.binPath(), description: DESCRIPTION }
  };
  if (remote) {
    const remoteBlock = {
      url: remote,
      help: [
        `${inv} list --remote ${remote}`,
        `${inv} status --remote ${remote}`
      ]
    };
    if (binding && binding.target === remote) remoteBlock.via = binding.file;
    view.remote = remoteBlock;
  } else if (summary && "unreadable" in summary) {
    const bundleBlock = {
      root: summary.root,
      status: "unreadable",
      help: `a document in this bundle could not be read \u2014 run \`${deps.invocation()} list\` to surface the parse error`
    };
    if (binding) bundleBlock.via = binding.file;
    view.bundle = bundleBlock;
  } else if (summary) {
    const bundleBlock = {};
    if (summary.name) {
      bundleBlock.name = summary.name;
      if (summary.nameSource === "conventional-parent") {
        bundleBlock.name_help = `name derived from the project folder \u2014 set it explicitly: ${deps.invocation()} doc write ${BUNDLE_NAME_DOC_ID} --type "${BUNDLE_NAME_DOC_TYPE}" --title "<name>"`;
      }
    }
    bundleBlock.root = summary.root;
    bundleBlock.docs = summary.docs;
    bundleBlock.by_type = summary.byType;
    if (summary.docs > 0) {
      bundleBlock.recent = summary.recent;
      bundleBlock.next = [
        `${deps.invocation()} list`,
        `${deps.invocation()} status`
      ];
    } else {
      bundleBlock.help = `${deps.invocation()} new "Context Note" <id> \u2026 | ${deps.invocation()} doc write \u2026 \u2014 create the first doc`;
    }
    if (binding) bundleBlock.via = binding.file;
    view.bundle = bundleBlock;
  } else if (!board?.firstContact && board?.block === void 0) {
    view.getting_started = `no OKF bundle found in this directory \u2014 run \`${deps.invocation()} init\` to create one`;
    if (binding) {
      view.getting_started += ` (project binding ${binding.file} -> ${binding.target} did not resolve to a bundle)`;
    }
  }
  if (board?.firstContact) {
    view.board = board.firstContact;
  } else if (board?.block !== void 0) {
    view.board = board.block;
  }
  if (hookUpdate) {
    view.hook_update = hookUpdate;
  }
  if (bindingError) {
    view.project_binding_error = bindingError;
  }
  if (workspaces) view.workspaces = workspaces;
  const compact = compactCommandReference(inv);
  view.commands = compact.commands;
  view.commands_help = compact.commands_help;
  view.kinds = ref.kinds;
  view.remote_env = ref.remoteEnv;
  return view;
}
async function home(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  let remote;
  let dir;
  let jsonMode = false;
  try {
    const parsed = parseArgs23({
      args: argv,
      options: {
        remote: { type: "string" },
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    });
    remote = parsed.values.remote;
    dir = parsed.values.dir;
    jsonMode = Boolean(parsed.values.json);
  } catch {
  }
  let binding;
  let bindingError;
  if (!remote && !dir) {
    try {
      const found = await resolveProjectBinding();
      if (found) {
        binding = { file: found.file, target: found.target };
        dir = found.target;
      }
    } catch (err) {
      bindingError = err instanceof Error ? err.message : String(err);
    }
  }
  if (!remote && deps.boardPull === void 0) {
    try {
      await (deps.autoPull ?? ((d) => maybeAutoPull2(d, { requireBoardBundle: false })))(dir);
    } catch {
    }
  }
  const summarize = deps.summarizeBundle ?? (() => defaultSummarizeBundle(dir));
  let summary = null;
  if (!remote) {
    try {
      summary = await summarize();
    } catch {
      summary = null;
    }
  }
  const invocation = deps.invocation ?? cliInvocation;
  let workspaces;
  let workspaceTimer;
  const workspaceAbort = new AbortController();
  const loadWorkspaces = deps.loadWorkspaces ?? ((signal) => defaultLoadWorkspaces(void 0, signal));
  try {
    const timedOut = Symbol("workspace catalog timed out");
    const outcome = await Promise.race([
      loadWorkspaces(workspaceAbort.signal),
      new Promise((resolve2) => {
        workspaceTimer = setTimeout(
          () => resolve2(timedOut),
          deps.workspaceBudgetMs ?? HOME_WORKSPACES_BUDGET_MS
        );
      })
    ]);
    if (outcome === timedOut) {
      workspaceAbort.abort();
      workspaces = {
        status: "unavailable",
        note: "workspace catalog check timed out",
        help: `${invocation()} catalog list`
      };
    } else if (outcome.length > 0) {
      const entries = [...outcome].sort((a, b) => a.label.localeCompare(b.label)).slice(0, HOME_WORKSPACES_LIMIT);
      workspaces = {
        count: outcome.length,
        shown: entries.length,
        entries,
        help: outcome.length > entries.length ? `${invocation()} catalog list` : `${invocation()} catalog resolve <label-or-id> --field path`
      };
    }
  } catch {
    workspaces = {
      status: "unavailable",
      note: "workspace catalog could not be read",
      help: `${invocation()} catalog list`
    };
  } finally {
    if (workspaceTimer) clearTimeout(workspaceTimer);
  }
  let board;
  if (!remote) {
    try {
      const status2 = await (deps.loadBoardStatus ?? defaultLoadBoardStatus)(dir);
      board = buildBoardBlock(status2, deps.boardPull, invocation());
    } catch {
      board = void 0;
    }
  }
  let hookUpdate;
  try {
    if ((deps.hookNeedsUpdate ?? hookNeedsUpdate)()) hookUpdate = hookUpdateNote(invocation());
  } catch {
    hookUpdate = void 0;
  }
  stdout(
    render(
      buildHomeView(
        {
          binPath: deps.binPath ?? binPath,
          invocation
        },
        summary,
        remote,
        binding,
        bindingError,
        board,
        hookUpdate,
        workspaces
      ),
      // Honor --json (JSON is equally offline/never-throw); default remains TOON, the format the
      // SessionStart hook ingests as ambient context.
      jsonMode ? "json" : "default"
    )
  );
}

// src/commands/session-start.ts
import { parseArgs as parseArgs24 } from "node:util";
import path22 from "node:path";
var SESSION_START_PULL_BUDGET_MS = 7e3;
var SESSION_START_CONNECT_TIMEOUT_SECONDS = 5;
var MIN_USEFUL_BUDGET_MS = 250;
var SESSION_START_USAGE = `agentstate-lite session-start \u2014 the SessionStart hook payload (pull the board, then render home)

Usage:
  agentstate-lite session-start [--dir <path>] [--json]

Runs a time-boxed, best-effort pull of this repo's shared board (provisioning the checkout from
origin/board on a fresh clone \u2014 announced, never silent), then renders the home view with registered
workspace orientation and the board-awareness block: what changed since this machine last synced,
attributed per teammate, plus the unpushed/uncommitted backstop. Every pull failure \u2014 offline, auth,
a busy repo, a lost time box \u2014 falls through to the render (exit 0): you always get the last known
state, honestly labeled.

This is the command \`hook install\` wires as the SessionStart hook for Claude Code, Codex, and
OpenCode. Run it directly to see exactly what a new session will see.

Options:
  --dir <path>   Directory to run from (default: the cwd)
  --json         Emit compact JSON instead of TOON
  -h, --help     Show this help
`;
var OFFLINE_REASONS = /* @__PURE__ */ new Set(["network", "auth", "busy", "git-missing"]);
var OFFLINE_CODES = /* @__PURE__ */ new Set(["TRANSIENT", "AUTH_REQUIRED", "GIT_BUSY", "GIT_MISSING"]);
async function sessionStartPull(dir, budgetMs = SESSION_START_PULL_BUDGET_MS, now = Date.now) {
  const deadline = now() + budgetMs;
  const remaining = () => Math.max(0, deadline - now());
  try {
    const startDir = retargetBoardInterior(dir ?? process.cwd());
    if (remaining() < MIN_USEFUL_BUDGET_MS) return { offline: true };
    let detection;
    try {
      detection = detectBoardChannel(startDir, {
        budget: { fetchTimeoutMs: remaining(), connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS }
      });
    } catch {
      return void 0;
    }
    if (detection.kind === "indeterminate") return void 0;
    if (detection.channel.mode === "local-only") return void 0;
    if (detection.channel.mode === "in-tree") {
      const top = repoTopLevel(startDir);
      if (!top) return void 0;
      const boardPath2 = path22.join(top, BUNDLE_DIR);
      const key2 = resolveBundleKey(boardPath2);
      await defaultSyncStore.refreshMarker(key2);
      if (remaining() < MIN_USEFUL_BUDGET_MS) return { offline: true, boardPath: boardPath2 };
      const result = await inTreeFetchAndRecord(defaultSyncStore, top, key2, {
        fetchTimeoutMs: remaining(),
        connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS
      });
      if (result.state === "refreshed") return { offline: false, refreshed: true, boardPath: boardPath2 };
      if (result.state === "fetch-failed") {
        if (OFFLINE_CODES.has(result.failure.code)) return { offline: true, boardPath: boardPath2 };
        return {
          offline: false,
          boardPath: boardPath2,
          notes: [
            syncOutcomeLine("line.session-start.fetch-skipped", { code: result.failure.code, inv: cliInvocation() })
          ]
        };
      }
      return { offline: false, boardPath: boardPath2 };
    }
    let outcome;
    try {
      outcome = provisionBoardWorktree(startDir, {
        fetchTimeoutMs: remaining(),
        connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS,
        allowLocalBranch: false
      });
    } catch {
      return void 0;
    }
    if (outcome.kind === "no_repo" || outcome.kind === "no_board" || outcome.kind === "local_board") return void 0;
    const boardPath = outcome.boardPath;
    const announcement = provisionAnnouncement(outcome);
    const key = resolveBundleKey(boardPath);
    await defaultSyncStore.refreshMarker(key);
    if (remaining() < MIN_USEFUL_BUDGET_MS) {
      return { offline: true, boardPath, ...announcement ? { announcement } : {} };
    }
    const pulled = await pullBoardAndRecord2(boardPath, key, {
      fetchTimeoutMs: remaining(),
      connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS
    });
    if (pulled.swallowed !== void 0) {
      if (OFFLINE_REASONS.has(pulled.swallowed)) {
        return { offline: true, boardPath, ...announcement ? { announcement } : {} };
      }
      return {
        offline: false,
        boardPath,
        ...announcement ? { announcement } : {},
        notes: [syncOutcomeLine("line.session-start.pull-skipped", { reason: pulled.swallowed, inv: cliInvocation() })]
      };
    }
    return { offline: false, refreshed: true, boardPath, ...announcement ? { announcement } : {} };
  } catch {
    return { offline: true };
  }
}
async function sessionStart(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs24({
      args: argv,
      options: {
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "session-start"
  );
  if (values.help) {
    stdout(SESSION_START_USAGE);
    return;
  }
  const budgetMs = deps.budgetMs ?? SESSION_START_PULL_BUDGET_MS;
  const pull2 = deps.pull ?? sessionStartPull;
  let timer;
  let outcome;
  try {
    const raced = await Promise.race([
      Promise.resolve().then(() => pull2(values.dir, budgetMs)).catch(() => ({ offline: true })),
      new Promise((resolve2) => {
        timer = setTimeout(() => resolve2("timeout"), budgetMs);
      })
    ]);
    outcome = raced === "timeout" ? { offline: true } : raced;
  } catch {
    outcome = { offline: true };
  } finally {
    if (timer) clearTimeout(timer);
  }
  const homeArgv = [];
  if (values.dir !== void 0) homeArgv.push("--dir", values.dir);
  if (values.json) homeArgv.push("--json");
  const boardPath = outcome?.boardPath;
  const projectDir = values.dir;
  await home(homeArgv, {
    stdout,
    // ALWAYS a defined boardPull — session-start IS the pull step, so home's own opportunistic
    // trigger must never run under it. A pull that resolved to `undefined`
    // (no repo / no board anywhere / provisioning refused or threw) is handed to home as a plain
    // non-refreshing outcome: home's render ignores the offline flag unless a REAL provisioned
    // board is probed (buildBoardBlock's own contract), so the render is unchanged — but a fresh
    // network pull outside this command's budget race is now structurally impossible.
    boardPull: outcome ?? { offline: true },
    ...projectDir !== void 0 ? {
      summarizeBundle: () => boardPath !== void 0 ? defaultSummarizeBundle(boardPath) : discoverSummarizeBundle(projectDir)
    } : {}
  });
}

// src/commands/bundle.ts
import { parseArgs as parseArgs25 } from "node:util";
var BUNDLE_USAGE = `agentstate-lite bundle \u2014 inspect local bundle targeting

Usage:
  agentstate-lite bundle locate [--dir <path>]

Commands:
  locate                  Resolve the exact local bundle this invocation would use

Options:
  --dir <path>            Resolve this literal bundle root instead of project context
  --json                  Emit compact JSON instead of TOON
  -h, --help              Show this help

Resolution preserves normal CLI precedence: explicit --dir, then the nearest project binding,
then local discovery. A successful receipt contains a canonical absolute local path suitable for
passing back to ordinary commands with --dir. This command never reads or selects an HTTP remote.
`;
async function bundleCommand(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const cwd = deps.cwd ?? (() => process.cwd());
  const parsed = parseOrUsage(
    () => parseArgs25({
      args: argv,
      options: {
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "bundle locate"
  );
  if (parsed.values.help || parsed.positionals.length === 0) {
    stdout(BUNDLE_USAGE);
    return;
  }
  const [subcommand, ...extra] = parsed.positionals;
  if (subcommand !== "locate" || extra.length > 0) {
    throw new CliError("USAGE", `unknown bundle subcommand: ${subcommand ?? ""}`, {
      help: `${cliInvocation()} bundle locate --help`
    });
  }
  const target = await resolveLocalBundleTarget(parsed.values.dir, cwd());
  stdout(
    render(
      {
        schema_version: 1,
        locator: { kind: "local-path", path: target.canonicalRoot },
        selected_by: target.selectedBy,
        ...target.bindingFile ? { binding_file: target.bindingFile } : {},
        available: true
      },
      resolveMode(parsed.values)
    )
  );
}

// src/commands/catalog.ts
import { parseArgs as parseArgs26 } from "node:util";
import { homedir as homedir9 } from "node:os";
var CATALOG_USAGE = `agentstate-lite catalog \u2014 register and resolve this user's workspaces

Usage:
  agentstate-lite catalog add <label> [--dir <path>]
  agentstate-lite catalog list [--json]
  agentstate-lite catalog resolve <label-or-id> [--field path | --json]

Labels are user-defined or agent-defined on the user's behalf. They use 1-64 lowercase letters,
numbers, dots, dashes, or underscores, beginning and ending with a letter or number. Registration
is explicit: the catalog never crawls for or silently enrolls workspaces.

Commands:
  add       Register the resolved local bundle under a unique label (idempotent for the same pair)
  list      List registered workspaces and their currently derived availability
  resolve   Revalidate and return exactly one registered workspace

Options:
  --dir <path>   add: literal bundle root; otherwise normal project-local discovery applies
  --field path   resolve: print only the canonical path plus a newline
  --json         Emit compact JSON instead of TOON
  -h, --help     Show this help

The catalog only selects a target. Pass a resolved path explicitly to ordinary commands with
--dir; there is no process-global active workspace and no implicit cross-bundle operation.
`;
function entryReceipt(entry) {
  return {
    schema_version: 1,
    id: entry.id,
    label: entry.label,
    locator: entry.locator,
    available: entry.available
  };
}
function usage(message) {
  throw new CliError("USAGE", message, { help: `${cliInvocation()} catalog --help` });
}
async function catalog(argv, deps = {}) {
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  if (requestsPathField(argv)) {
    try {
      await catalogInner(argv, deps);
    } catch (err) {
      const { envelope, handled } = toExit(err);
      if (!handled) stderr(renderErrorEnvelope(envelope));
      throw handled ? err : asHandled(err);
    }
    return;
  }
  await catalogInner(argv, deps);
}
function requestsPathField(argv) {
  return argv.some((arg, index) => arg === "--field=path" || arg === "--field" && argv[index + 1] === "path");
}
async function catalogInner(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const cwd = deps.cwd ?? (() => process.cwd());
  const home2 = deps.home ?? homedir9;
  const parsed = parseOrUsage(
    () => parseArgs26({
      args: argv,
      options: {
        dir: { type: "string" },
        field: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "catalog"
  );
  if (parsed.values.help || parsed.positionals.length === 0) {
    stdout(CATALOG_USAGE);
    return;
  }
  const [subcommand, ...positionals] = parsed.positionals;
  if (subcommand === "add") {
    if (positionals.length !== 1) usage("catalog add requires exactly one <label>");
    if (parsed.values.field !== void 0) usage("--field is only valid with catalog resolve");
    const target = await resolveLocalBundleTarget(parsed.values.dir, cwd());
    const result = await addCatalogEntry(positionals[0], target.canonicalRoot, {
      ...deps.catalogOptions ?? {},
      home: home2()
    });
    stdout(
      render(
        {
          catalog: result.changed ? "added" : "unchanged",
          changed: result.changed,
          ...entryReceipt({ ...result.entry, available: true }),
          help: [`${cliInvocation()} catalog resolve ${result.entry.label} --field path`]
        },
        resolveMode(parsed.values)
      )
    );
    return;
  }
  if (subcommand === "list") {
    if (positionals.length !== 0) usage("catalog list takes no positional arguments");
    if (parsed.values.dir !== void 0) usage("--dir is only valid with catalog add");
    if (parsed.values.field !== void 0) usage("--field is only valid with catalog resolve");
    const entries = await listCatalogEntries(home2());
    stdout(
      render(
        {
          schema_version: 1,
          count: entries.length,
          entries,
          help: entries.length === 0 ? [`${cliInvocation()} catalog add <label> [--dir <path>]`] : [`${cliInvocation()} catalog resolve <label-or-id> --field path`]
        },
        resolveMode(parsed.values)
      )
    );
    return;
  }
  if (subcommand === "resolve") {
    if (positionals.length !== 1) usage("catalog resolve requires exactly one <label-or-id>");
    if (parsed.values.dir !== void 0) usage("--dir is only valid with catalog add");
    if (parsed.values.field !== void 0 && parsed.values.field !== "path") {
      usage('catalog resolve --field supports only "path"');
    }
    if (parsed.values.field !== void 0 && parsed.values.json) {
      usage("--field and --json are mutually exclusive");
    }
    const entry = await resolveCatalogEntry(positionals[0], home2());
    if (parsed.values.field === "path") {
      stdout(entry.locator.path + "\n");
      return;
    }
    stdout(
      render(
        {
          ...entryReceipt(entry),
          help: [`pass this path explicitly: ${cliInvocation()} <command> --dir <resolved-path>`]
        },
        resolveMode(parsed.values)
      )
    );
    return;
  }
  usage(`unknown catalog subcommand: ${subcommand}`);
}

// src/commands/index.ts
import { parseArgs as parseArgs27 } from "node:util";
var INDEX_USAGE = `agentstate-lite index \u2014 generate portable Markdown navigation

Usage:
  agentstate-lite index generate [--dir <path>] [--check] [--force] [--actor <name>]

Scans concept metadata once and plans the bundle's complete index.md hierarchy. A normal run
creates missing indexes and refreshes only files carrying AgentState's exact generated marker.
If any existing target is unmarked or malformed, the whole run refuses before writing anything;
--force is the explicit one-time adoption path and may replace curated prose.

--check performs the identical scan and ownership preflight but never writes. It exits 0 only when
the projection is clean; drift or refusal returns a structured CONFLICT (exit 5) whose details
carry the same capped per-path classification as a normal receipt.

Options:
  --dir <path>       Local bundle directory (default: discovered from the cwd)
  --check            Report drift/refusal without writing; clean is exit 0, otherwise exit 5
  --force            Adopt and replace unmarked/malformed index files explicitly
  --actor <name>     Attribute changed writes (overrides AGENTSTATE_LITE_ACTOR)
  --json             Emit compact JSON instead of TOON on success
  -h, --help         Show this help

This command is local-only. It never syncs and has no --remote mode.
`;
var PATH_LIMIT = 15;
function displayPath(dir) {
  return dir === "" ? "index.md" : `${dir}/index.md`;
}
function shellArg(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function generateCommand(options2 = {}) {
  const flags = [
    ...options2.check ? ["--check"] : [],
    ...options2.force ? ["--force"] : [],
    ...options2.dir !== void 0 ? ["--dir", shellArg(options2.dir)] : []
  ];
  return `${cliInvocation()} index generate${flags.length > 0 ? ` ${flags.join(" ")}` : ""}`;
}
function cappedPaths(dirs) {
  const paths = dirs.map(displayPath);
  return {
    shown: Math.min(paths.length, PATH_LIMIT),
    total: paths.length,
    rows: paths.slice(0, PATH_LIMIT).map((path23) => ({ path: path23 }))
  };
}
function dirsWith(targets, disposition) {
  return targets.filter((target) => target.disposition === disposition).map((target) => target.dir);
}
function classificationFields(prepared) {
  return {
    targets: prepared.targets.length,
    created: cappedPaths(dirsWith(prepared.targets, "missing")),
    updated: cappedPaths(dirsWith(prepared.targets, "generated")),
    unchanged: cappedPaths(dirsWith(prepared.targets, "unchanged")),
    adopted: cappedPaths(dirsWith(prepared.targets, "adopted")),
    refused: cappedPaths(dirsWith(prepared.targets, "refused"))
  };
}
function completedDirs(completed) {
  return completed.map((target) => target.dir);
}
function plannedChangeCount(prepared) {
  return prepared.targets.filter((target) => target.disposition !== "unchanged" && target.disposition !== "refused").length;
}
function refusalError(prepared, displayName, scanned, check, dir) {
  const details = {
    index: check ? "checked" : "refused",
    clean: false,
    writes: 0,
    display_name: displayName,
    scanned,
    ...classificationFields(prepared)
  };
  return new CliError("CONFLICT", "portable index generation refused: existing index files are not AgentState-owned", {
    details,
    help: check ? generateCommand({ dir, force: true }) : generateCommand({ dir, check: true })
  });
}
async function indexCommand(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs27({
      args: argv,
      options: {
        dir: { type: "string" },
        check: { type: "boolean" },
        force: { type: "boolean" },
        actor: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "index"
  );
  if (values.help || positionals.length === 0) {
    stdout(INDEX_USAGE);
    return;
  }
  if (positionals.length !== 1 || positionals[0] !== "generate") {
    throw new CliError("USAGE", `unknown index subcommand: ${positionals.join(" ")}`, {
      help: `${cliInvocation()} index --help`
    });
  }
  const actor = resolveActor(values.actor, {
    help: `${cliInvocation()} index generate --actor <name>`
  });
  const bundle = await openBundle(values.dir);
  const [{ name: displayName }, heads] = await Promise.all([
    deriveBundleDisplayName(bundle),
    queryHeads(bundle)
  ]);
  const plan = planIndexProjection(displayName, heads);
  const prepared = await prepareIndexProjection(bundle, plan, { force: values.force });
  if (!prepared.ready) {
    throw refusalError(prepared, displayName, heads.length, values.check ?? false, values.dir);
  }
  const wouldChange = plannedChangeCount(prepared);
  const fields = classificationFields(prepared);
  if (values.check) {
    const receipt = {
      index: "checked",
      clean: wouldChange === 0,
      writes: 0,
      would_change: wouldChange,
      display_name: displayName,
      scanned: heads.length,
      ...fields,
      help: [generateCommand({ dir: values.dir, force: values.force })]
    };
    if (wouldChange > 0) {
      throw new CliError("CONFLICT", "portable index projection is not current", {
        details: receipt,
        help: generateCommand({ dir: values.dir, force: values.force })
      });
    }
    stdout(render(receipt, resolveMode(values)));
    return;
  }
  try {
    const applied = await applyIndexProjection(bundle, prepared, { actor });
    const receipt = {
      index: applied.completed.length > 0 ? "generated" : "unchanged",
      changed: applied.completed.length > 0,
      writes: applied.completed.length,
      display_name: displayName,
      scanned: heads.length,
      ...fields,
      completed: cappedPaths(completedDirs(applied.completed)),
      pending: cappedPaths(applied.pending),
      help: [generateCommand({ dir: values.dir, check: true })]
    };
    stdout(render(receipt, resolveMode(values)));
  } catch (error) {
    if (!(error instanceof IndexProjectionWriteError)) throw error;
    const cause = classifyBundleError(error.cause);
    throw new CliError(cause.code, `${error.message}: ${cause.message}`, {
      details: {
        index: "partial",
        display_name: displayName,
        scanned: heads.length,
        ...fields,
        failed: displayPath(error.failed),
        completed: cappedPaths(completedDirs(error.completed)),
        pending: cappedPaths(error.pending),
        ...cause.details ?? {}
      },
      help: generateCommand({ dir: values.dir, force: values.force })
    });
  }
}

// src/cli.ts
import { parseArgs as parseArgs28 } from "node:util";
var KNOWN_COMMANDS = [
  "init",
  "bundle",
  "catalog",
  "index",
  "doc",
  "promote",
  "pull",
  "blobs",
  "delete",
  "link",
  "list",
  "query",
  "new",
  "kinds",
  "kind",
  "recipes",
  "recipe",
  "status",
  "serve",
  "ui",
  "sync",
  "hook",
  "session-start"
];
function helpReference() {
  return helpIndexText(cliInvocation());
}
function unknownCommandError(cmd) {
  return new CliError("USAGE", `unknown command: ${cmd} (known: ${KNOWN_COMMANDS.join(", ")})`, {
    help: `${cliInvocation()} --help`
  });
}
var wrap2 = (fn) => async (args) => {
  await fn(args);
  return "";
};
function isGlobalOnlyHomeInvocation(argv) {
  try {
    const { positionals } = parseArgs28({
      args: argv,
      options: {
        remote: { type: "string" },
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    });
    return positionals.length === 0;
  } catch {
    return false;
  }
}
function hoistLeadingGlobalFlags(argv) {
  let tokens;
  try {
    tokens = parseArgs28({
      args: argv,
      tokens: true,
      strict: false,
      allowPositionals: true,
      options: {
        remote: { type: "string" },
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      }
    }).tokens;
  } catch {
    return null;
  }
  const firstPositional = tokens?.find((t) => t.kind === "positional");
  if (!firstPositional) return null;
  const cmd = argv[firstPositional.index];
  if (cmd === void 0 || !KNOWN_COMMANDS.includes(cmd)) return null;
  return [...argv.slice(firstPositional.index), ...argv.slice(0, firstPositional.index)];
}
async function main(argv) {
  const command = argv[0];
  if (command === void 0) {
    await home(argv);
    return;
  }
  if (command === "--help" || command === "-h" || command === "help") {
    process.stdout.write(helpReference());
    return;
  }
  if (command.startsWith("-")) {
    if (isGlobalOnlyHomeInvocation(argv)) {
      await home(argv);
      return;
    }
    const hoisted = hoistLeadingGlobalFlags(argv);
    if (hoisted) {
      await main(hoisted);
      return;
    }
    const envelope = toEnvelope(
      new CliError(
        "USAGE",
        `options must follow the command (e.g. '${cliInvocation()} ${command} \u2026').`,
        {
          help: `${cliInvocation()} --help`
        }
      )
    );
    process.stdout.write(renderErrorEnvelope(envelope));
    process.exitCode = 2;
    return;
  }
  await runAxiCli({
    argv,
    description: DESCRIPTION,
    topLevelHelp: helpReference(),
    // Drop the SDK's mandatory lone trailing "\n" after each successful (void) command so command
    // output stays byte-identical; forward everything else (error envelopes, unknown-command output).
    stdout: { write: (c) => c === "\n" ? true : process.stdout.write(c) },
    commands: {
      init: wrap2(init),
      bundle: wrap2(bundleCommand),
      catalog: wrap2(catalog),
      index: wrap2(indexCommand),
      doc: wrap2(doc),
      promote: wrap2(promote),
      pull: wrap2(pull),
      blobs: wrap2(blobs),
      delete: wrap2(deleteCommand),
      link: wrap2(link),
      list: wrap2(list),
      // `query` is an alias of `list` (the list/query API surface).
      query: wrap2(list),
      new: wrap2(newCommand),
      kinds: wrap2(kinds),
      kind: wrap2(kind),
      recipes: wrap2(recipes),
      recipe: wrap2(recipe),
      status: wrap2(status),
      serve: wrap2(serve2),
      ui: wrap2(ui),
      sync: wrap2(sync),
      hook: wrap2(hook),
      // The SessionStart hook payload: time-boxed board pull, then the home render — in-process.
      "session-start": wrap2(sessionStart),
      // Explicit `home` handler so a SessionStart hook (or an agent) can also call `<bin> home`, not
      // only the bare zero-arg form. Not listed in COMMAND_GROUPS — the bare invocation is the primary
      // home surface (AXI §8); this is a defensive alias with identical output.
      home: wrap2(home),
      // Shadow the SDK's reserved built-in `update` command (npm self-update is nonsensical for a
      // committed skill-bundled .mjs). Registering a handler that throws the unknown-command USAGE
      // error restores a TOON envelope, exit 2. `update` is intentionally NOT in KNOWN_COMMANDS.
      update: async () => {
        throw unknownCommandError("update");
      }
    },
    // Required by AxiCliOptions; UNREACHED because the no-args path is pre-routed to the home view
    // above. Kept a trivial offline writer (the command reference) — no creds/network.
    home: async () => {
      process.stdout.write(helpReference());
      return "";
    },
    renderUnknownCommand: (cmd) => renderErrorEnvelope(toEnvelope(unknownCommandError(cmd))),
    formatError: (err) => {
      const { exitCode, envelope, handled } = toExit(err);
      return { output: handled ? "" : renderErrorEnvelope(envelope), exitCode };
    }
  });
}

// src/index.ts
await main(process.argv.slice(2));
/*! Bundled license information:

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
