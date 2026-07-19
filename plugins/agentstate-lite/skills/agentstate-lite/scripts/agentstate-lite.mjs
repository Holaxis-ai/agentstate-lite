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
function* encodeJsonValue(value, options2, depth) {
  if (isJsonPrimitive(value)) {
    const encodedPrimitive = encodePrimitive(value, options2.delimiter);
    if (encodedPrimitive !== "") yield encodedPrimitive;
    return;
  }
  if (isJsonArray(value)) yield* encodeArrayLines(void 0, value, depth, options2);
  else if (isJsonObject(value)) yield* encodeObjectLines(value, depth, options2);
}
function* encodeObjectLines(value, depth, options2, rootLiteralKeys, pathPrefix, remainingDepth) {
  const keys = Object.keys(value);
  if (depth === 0 && !rootLiteralKeys) rootLiteralKeys = new Set(keys.filter((k) => k.includes(".")));
  const effectiveFlattenDepth = remainingDepth ?? options2.flattenDepth;
  for (const [key, val] of Object.entries(value)) yield* encodeKeyValuePairLines(key, val, depth, options2, keys, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
}
function* encodeKeyValuePairLines(key, value, depth, options2, siblings, rootLiteralKeys, pathPrefix, flattenDepth) {
  const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
  const effectiveFlattenDepth = flattenDepth ?? options2.flattenDepth;
  if (options2.keyFolding === "safe" && siblings) {
    const foldResult = tryFoldKeyChain(key, value, siblings, options2, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
    if (foldResult) {
      const { foldedKey, remainder, leafValue, segmentCount } = foldResult;
      const encodedFoldedKey = encodeKey(foldedKey);
      if (remainder === void 0) {
        if (isJsonPrimitive(leafValue)) {
          yield indentedLine(depth, `${encodedFoldedKey}: ${encodePrimitive(leafValue, options2.delimiter)}`, options2.indent);
          return;
        } else if (isJsonArray(leafValue)) {
          yield* encodeArrayLines(foldedKey, leafValue, depth, options2);
          return;
        } else if (isJsonObject(leafValue) && isEmptyObject(leafValue)) {
          yield indentedLine(depth, `${encodedFoldedKey}:`, options2.indent);
          return;
        }
      }
      if (isJsonObject(remainder)) {
        yield indentedLine(depth, `${encodedFoldedKey}:`, options2.indent);
        const remainingDepth = effectiveFlattenDepth - segmentCount;
        const foldedPath = pathPrefix ? `${pathPrefix}.${foldedKey}` : foldedKey;
        yield* encodeObjectLines(remainder, depth + 1, options2, rootLiteralKeys, foldedPath, remainingDepth);
        return;
      }
    }
  }
  const encodedKey = encodeKey(key);
  if (isJsonPrimitive(value)) yield indentedLine(depth, `${encodedKey}: ${encodePrimitive(value, options2.delimiter)}`, options2.indent);
  else if (isJsonArray(value)) yield* encodeArrayLines(key, value, depth, options2);
  else if (isJsonObject(value)) {
    yield indentedLine(depth, `${encodedKey}:`, options2.indent);
    if (!isEmptyObject(value)) yield* encodeObjectLines(value, depth + 1, options2, rootLiteralKeys, currentPath, effectiveFlattenDepth);
  }
}
function* encodeArrayLines(key, value, depth, options2) {
  if (value.length === 0) {
    yield indentedLine(depth, key != null ? `${encodeKey(key)}: []` : "[]", options2.indent);
    return;
  }
  if (isArrayOfPrimitives(value)) {
    yield indentedLine(depth, encodeInlineArrayLine(value, options2.delimiter, key), options2.indent);
    return;
  }
  if (isArrayOfArrays(value)) {
    if (value.every((arr) => isArrayOfPrimitives(arr))) {
      yield* encodeArrayOfArraysAsListItemsLines(key, value, depth, options2);
      return;
    }
  }
  if (isArrayOfObjects(value)) {
    const header = extractTabularHeader(value);
    if (header) yield* encodeArrayOfObjectsAsTabularLines(key, value, header, depth, options2);
    else yield* encodeMixedArrayAsListItemsLines(key, value, depth, options2);
    return;
  }
  yield* encodeMixedArrayAsListItemsLines(key, value, depth, options2);
}
function* encodeArrayOfArraysAsListItemsLines(prefix, values, depth, options2) {
  yield indentedLine(depth, formatHeader(values.length, {
    key: prefix,
    delimiter: options2.delimiter
  }), options2.indent);
  for (const arr of values) if (isArrayOfPrimitives(arr)) {
    const arrayLine = encodeInlineArrayLine(arr, options2.delimiter);
    yield indentedListItem(depth + 1, arrayLine, options2.indent);
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
function* encodeArrayOfObjectsAsTabularLines(prefix, rows, header, depth, options2) {
  yield indentedLine(depth, formatHeader(rows.length, {
    key: prefix,
    fields: header,
    delimiter: options2.delimiter
  }), options2.indent);
  yield* writeTabularRowsLines(rows, header, depth + 1, options2);
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
function* writeTabularRowsLines(rows, header, depth, options2) {
  for (const row2 of rows) yield indentedLine(depth, encodeAndJoinPrimitives(header.map((key) => row2[key]), options2.delimiter), options2.indent);
}
function* encodeMixedArrayAsListItemsLines(prefix, items, depth, options2) {
  yield indentedLine(depth, formatHeader(items.length, {
    key: prefix,
    delimiter: options2.delimiter
  }), options2.indent);
  for (const item of items) yield* encodeListItemValueLines(item, depth + 1, options2);
}
function* encodeObjectAsListItemLines(obj, depth, options2) {
  if (isEmptyObject(obj)) {
    yield indentedLine(depth, "-", options2.indent);
    return;
  }
  const entries = Object.entries(obj);
  const [firstKey, firstValue] = entries[0];
  const restEntries = entries.slice(1);
  if (isJsonArray(firstValue) && isArrayOfObjects(firstValue)) {
    const header = extractTabularHeader(firstValue);
    if (header) {
      yield indentedListItem(depth, formatHeader(firstValue.length, {
        key: firstKey,
        fields: header,
        delimiter: options2.delimiter
      }), options2.indent);
      yield* writeTabularRowsLines(firstValue, header, depth + 2, options2);
      if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options2);
      return;
    }
  }
  const encodedKey = encodeKey(firstKey);
  if (isJsonPrimitive(firstValue)) yield indentedListItem(depth, `${encodedKey}: ${encodePrimitive(firstValue, options2.delimiter)}`, options2.indent);
  else if (isJsonArray(firstValue)) if (firstValue.length === 0) yield indentedListItem(depth, `${encodedKey}: []`, options2.indent);
  else if (isArrayOfPrimitives(firstValue)) yield indentedListItem(depth, `${encodedKey}${encodeInlineArrayLine(firstValue, options2.delimiter)}`, options2.indent);
  else {
    yield indentedListItem(depth, `${encodedKey}${formatHeader(firstValue.length, { delimiter: options2.delimiter })}`, options2.indent);
    for (const item of firstValue) yield* encodeListItemValueLines(item, depth + 2, options2);
  }
  else if (isJsonObject(firstValue)) {
    yield indentedListItem(depth, `${encodedKey}:`, options2.indent);
    if (!isEmptyObject(firstValue)) yield* encodeObjectLines(firstValue, depth + 2, options2);
  }
  if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options2);
}
function* encodeListItemValueLines(value, depth, options2) {
  if (isJsonPrimitive(value)) yield indentedListItem(depth, encodePrimitive(value, options2.delimiter), options2.indent);
  else if (isJsonArray(value)) if (isArrayOfPrimitives(value)) yield indentedListItem(depth, encodeInlineArrayLine(value, options2.delimiter), options2.indent);
  else {
    yield indentedListItem(depth, formatHeader(value.length, { delimiter: options2.delimiter }), options2.indent);
    for (const item of value) yield* encodeListItemValueLines(item, depth + 1, options2);
  }
  else if (isJsonObject(value)) yield* encodeObjectAsListItemLines(value, depth, options2);
}
function indentedLine(depth, content, indentSize) {
  return " ".repeat(indentSize * depth) + content;
}
function indentedListItem(depth, content, indentSize) {
  return indentedLine(depth, "- " + content, indentSize);
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
function isManagedHook(hook2, marker) {
  return typeof hook2?.command === "string" && hook2.command.includes(marker);
}
function computeSessionStartHookUpdate(settings, spec) {
  const updated = structuredClone(settings);
  let changed = false;
  if (!updated.hooks) {
    updated.hooks = {};
    changed = true;
  }
  if (Array.isArray(updated.hooks.session_start)) {
    const legacyHooks = updated.hooks.session_start.filter((hook2) => !isManagedHook(hook2, spec.marker));
    if (legacyHooks.length !== updated.hooks.session_start.length) {
      changed = true;
      if (legacyHooks.length === 0) {
        delete updated.hooks.session_start;
      } else {
        updated.hooks.session_start = legacyHooks;
      }
    }
  }
  if (!Array.isArray(updated.hooks.SessionStart)) {
    updated.hooks.SessionStart = [];
    changed = true;
  }
  for (const group of updated.hooks.SessionStart) {
    if (!Array.isArray(group.hooks)) {
      continue;
    }
    for (const hook2 of group.hooks) {
      if (!isManagedHook(hook2, spec.marker)) {
        continue;
      }
      const timeout = spec.timeoutSeconds ?? 10;
      const isCorrect = hook2.command === spec.command && hook2.type === "command" && hook2.timeout === timeout;
      if (isCorrect && !changed) {
        return [settings, false];
      }
      hook2.command = spec.command;
      hook2.type = "command";
      hook2.timeout = timeout;
      return [updated, true];
    }
  }
  updated.hooks.SessionStart.push({
    matcher: "",
    hooks: [
      {
        type: "command",
        command: spec.command,
        timeout: spec.timeoutSeconds ?? 10
      }
    ]
  });
  return [updated, true];
}
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
    const body = `# ${name}

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
  const { kind: kind2, warnings } = defaultTimestampAndValidateAgainstRegistry({ id, ...candidate }, registry);
  if (strict && kind2 && warnings.length > 0) {
    throw new KindConformanceError(id, kind2.governs, warnings);
  }
  return warnings;
}
async function mutateDocument(opts) {
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;
  const persistActor = opts.persistActor ?? false;
  if (opts.mode === "create-only") {
    const candidate = attributeCandidate(await opts.buildCandidate(void 0), opts.actor, persistActor);
    const warnings = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
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
        warnings = validateCandidate(opts.id, candidate, opts.registry, opts.strict);
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
      const warnings = validateCandidate(opts.id, attributed, opts.registry, opts.strict);
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
var PACKAGE_NAME = "agentstate-lite";
var BIN_NAMES = ["agentstate-lite", "aslite"];
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
  return segments.every((segment) => !segment.startsWith(".") && PAGE_SEGMENT.test(segment));
}
function isRegistryIdUnder(id, prefix) {
  if (typeof id !== "string" || id.endsWith(".md") || !hasSafePageSegments(id, prefix)) {
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
  constructor(rel) {
    super(`unsafe path '${rel}'`);
    this.rel = rel;
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
          return {
            ok: false,
            error: {
              code: "RECIPE_UNSAFE_PATH",
              message: `recipe folder '${ref}' contains a symlink escaping the recipe root: '${err.rel}'`
            }
          };
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
                         agentstate-lite doc read <id> --body-out ./body.md --json
                         # edit ./body.md; copy the receipt's version
                         agentstate-lite doc update <id> --body-file ./body.md \\
                           --expected-version <version>
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
  agentstate-lite doc read concepts/auth --body-out ./auth-body.md
  agentstate-lite doc read concepts/auth --field head_version
`;
var DOC_HISTORY_USAGE = `agentstate-lite doc history \u2014 show a doc's attributed version chain (newest first)

Usage:
  agentstate-lite doc history <id> [options]

Lists version + actor + timestamp (and agent, when recorded) per revision, with a count. A
history-keeping backend (a remote deployment) returns the full chain and its real per-write
attribution; on an AUTH'D remote, actor is your authenticated principal (server-set, unforgeable)
and agent is the resolved advisory actor label from --actor or AGENTSTATE_LITE_ACTOR. A local
--dir bundle keeps no history, so it returns just the single current revision and reports the
file's OS owner as the actor (the filesystem backend keeps no per-write advisory actor label in
history; the doc's own 'actor' frontmatter field \u2014 persisted from --actor or
AGENTSTATE_LITE_ACTOR \u2014 is where per-doc attribution lives). The newest version is the token to
pass to --expected-version for an optimistic doc update/delete.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc history concepts/auth
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
async function defaultReadStdin() {
  if (!hasRealStdinInput()) return void 0;
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
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
function kindConformanceCliError(error, help) {
  return new CliError("USAGE", error.message, {
    help,
    details: { violations: error.violations }
  });
}
function defaultTimestampAndValidateKind(candidate, registry, opts) {
  const { kind: kind2, warnings } = defaultTimestampAndValidateAgainstRegistry(candidate, registry);
  if (kind2 && warnings.length > 0 && opts.strict) {
    throw kindConformanceCliError(
      new KindConformanceError(candidate.id, kind2.governs, warnings),
      opts.helpOnReject
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
function translateMutationError(error, opts) {
  if (error instanceof KindConformanceError) {
    throw kindConformanceCliError(error, opts.helpOnKindReject);
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
    translateMutationError(error, opts);
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
  if (values.body !== void 0) {
    body = values.body;
    bodySourceGiven = true;
  } else if (values["body-file"]) {
    body = await fs5.readFile(values["body-file"], "utf8");
    bodySourceGiven = true;
  } else {
    const stdinBody = await readStdin();
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
  if (p.body === void 0 && !p.bodyFile && !otherFieldGiven) {
    const raw = await readStdin();
    stdinBody = raw !== void 0 && raw !== "" ? raw : void 0;
  }
  const anyFieldGiven = otherFieldGiven || p.body !== void 0 || Boolean(p.bodyFile) || stdinBody !== void 0;
  if (!anyFieldGiven) {
    throw new CliError(
      "USAGE",
      `doc update requires at least one field to patch (${DOC_UPDATE_FIELD_FLAGS.map((f) => `--${f}`).join("/")} or a kind-declared --<field>, e.g. --status)`,
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
async function docHistory(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs5({
      args: argv,
      options: {
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
  stdout(
    render(
      {
        id,
        count: versions.length,
        versions: versions.map(
          (v) => v.agent === void 0 ? { version: v.version, actor: v.actor, timestamp: v.timestamp } : { version: v.version, actor: v.actor, timestamp: v.timestamp, agent: v.agent }
        ),
        help: [`${cliInvocation()} doc update ${id} --expected-version ${versions[0].version}`]
      },
      resolveMode(values)
    )
  );
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
    helpOnReject: `${cliInvocation()} kinds`
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
  const DEFAULT_LIMIT3 = 100;
  let limit = DEFAULT_LIMIT3;
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
var LINK_USAGE = `agentstate-lite link \u2014 add a cross-link, show a concept's links + backlinks, or query the bundle's whole edge graph

Usage:
  agentstate-lite link add <from> <to> [--text <t>] [--actor <name>]
  agentstate-lite link show <id> [--limit <n>] [--text <t>]
  agentstate-lite link list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]

Idempotent: re-adding the same target with the same exact display text is a no-op \u2014 exit 0,
changed:false, no duplicate link, no timestamp refresh. Different text to the same target is a
distinct semantic edge and is added.

Graph lint (link add only): if this bundle declares a kind's 'links' vocabulary (see 'kinds --help')
and --text matches a declared type, the just-written link is checked against the actual source/target
kinds; a mismatch or a same-spelling-different-case near miss attaches a 'warnings' array to the
success envelope (exit 0 \u2014 the link is already written). An untyped --text (no declared match, any
casing) or a conventions-free bundle never warns.

link list queries the WHOLE bundle's derived edge list (the same edges 'show' computes per-concept),
filtered \u2014 the atom a blast-radius/containment/ontology question reduces to. --from/--to each accept
a single concept id, a trailing-slash prefix ('tasks/' matches every id starting with that literal
string \u2014 one rule, no glob), or are repeatable for a union (OR) within that one flag; giving BOTH
--from and --to ANDs them. Dangling edges (a link to a doc that doesn't exist yet) are included.

Options:
  --text <t>            (link add) Link display text (default: the target id)
                         (link show) Filter outbound links AND backlinks to those whose text is
                         EXACTLY <t> (case-sensitive, not a substring match); empty/missing value
                         is a usage error. outbound_count/backlink_count report the FILTERED
                         totals when set. A filter that matches nothing is a valid empty result,
                         not an error \u2014 its help line names the distinct link texts that ARE
                         present, so a near-miss (typo/case) is visible.
                         (link list) Same exact-match semantics, over the whole filtered edge set.
  --from <id|prefix/>   (link list) Restrict to edges whose source matches this id or prefix
                         (repeatable \u2014 union/OR across repeats)
  --to <id|prefix/>     (link list) Restrict to edges whose target matches this id or prefix
                         (repeatable \u2014 union/OR across repeats)
  --limit <n>          (link show) Cap each of the outbound/backlink lists (default: 50; 0 =
                         unlimited); outbound_count/backlink_count always report the true
                         (post-filter) totals
                         (link list) Cap the returned edge rows (default: 100; 0 = unlimited);
                         count always reports the true (post-filter) total
  --keep-timestamp      Preserve the source's existing timestamp (default: refresh to now,
                         since adding a cross-link is a meaningful change)
  --actor <name>        Attribute a newly-added link in the source doc and backend history.
                         Falls back to AGENTSTATE_LITE_ACTOR; an existing link remains a true no-op.
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; remote access is always explicit)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
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
    } catch (err) {
      warnings = [
        {
          code: "LINK_LINT_UNAVAILABLE",
          message: `link was written, but type-conformance guidance was unavailable: ${err instanceof Error ? err.message : String(err)}`,
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
    stdout(LINK_USAGE);
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
    stdout(LINK_USAGE);
    return;
  }
  const DEFAULT_LIMIT3 = 50;
  let limit = DEFAULT_LIMIT3;
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
    stdout(LINK_USAGE);
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
  const DEFAULT_LIMIT3 = 100;
  let limit = DEFAULT_LIMIT3;
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
  const DEFAULT_LIMIT3 = 100;
  let limit = DEFAULT_LIMIT3;
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
var DEFAULT_LIMIT = 20;
function cap(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
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
  let limit = DEFAULT_LIMIT;
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
  for (const doc2 of docs) {
    const kind2 = registry.kinds.get(docType2(doc2));
    if (!kind2) continue;
    for (const w of validateAgainstKind(doc2, kind2)) {
      lintRows.push({ id: doc2.id, field: w.field ?? "", code: w.code });
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
  if (malformed.total > 0) out.malformed_docs = malformed;
  if (lint.total > 0) out.kind_lint = lint;
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
async function takeSnapshot(opts, signal) {
  return opts.mode === "dir" ? snapshotBundle(opts.bundle) : snapshotRemote(opts.remoteBase, opts.apiKey, signal);
}
async function startWatcher(opts) {
  const aborter = new AbortController();
  let last = await takeSnapshot(opts, aborter.signal);
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
    return options2.mode === "dir" ? await startWatcher({ mode: "dir", bundle: options2.bundle, onChange, onError }) : await startWatcher({ mode: "remote", remoteBase: options2.remoteBase, apiKey: options2.apiKey, onChange, onError });
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
  "/assets/cormorant-garamond-500-BVPaSuim.woff2": { contentType: "font/woff2", gzipBase64: "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" },
  "/assets/fonts/CormorantGaramond-OFL.txt": { contentType: "text/plain; charset=utf-8", gzipBase64: "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" },
  "/assets/index-Bd5ti4PI.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/assets/index-Deq4emFk.css": { contentType: "text/css; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/12Qy07DMBBF9/2KwWtSC6lILOIsEEJixy8Ye5oM9SN4pin5e+ymLGB1Na9zR7e/89nJOiNMEsOw65tAsGk0CpNqDbS+SkSx4CZbGMWosxy7JwX6d5BsRKMWwsuciyhwOQmmunghL5PxuJDD7lrcAyUSsqFjZwOahw0jJAEHO9YrFivYBRLs9dbeAfTsCs0C7VejYvbngNWnZOZcaKQEXJxR2nJ9kDUlj9/ds38UOry/7T9ZDb3eEFdaoHSCgsEoljUgT4jyFzcVPP7nveDXAePrae+YWzb6Fs5H9msVTwuQN6rkLM2v1m3pNtVbwj9V0nbjcgEAAA==" }
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
import { existsSync as existsSync6, readFileSync as readFileSync4, writeFileSync as writeFileSync3, rmSync as rmSync2 } from "node:fs";
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
var HOOK_TIMEOUT_SECONDS = 10;
var HOOK_SUBCOMMAND = "session-start";
var OPENCODE_PLUGIN_FILENAME = "axi-agentstate-lite.js";
var OPENCODE_MANAGED_MARKER = `axi-sdk-js managed opencode plugin: ${HOOK_MARKER}`;
function sessionStartHookCommand(base = hookCommand()) {
  const quoted = /\s/.test(base) ? JSON.stringify(base) : base;
  return `${quoted} ${HOOK_SUBCOMMAND}`;
}
function isManagedHook2(hook2) {
  return typeof hook2?.command === "string" && hook2.command.includes(HOOK_MARKER);
}
function computeHookUninstall(settings) {
  const updated = structuredClone(settings);
  let changed = false;
  const hooks = updated.hooks;
  if (!hooks) return [settings, false];
  if (Array.isArray(hooks.session_start)) {
    const kept = hooks.session_start.filter((h) => !isManagedHook2(h));
    if (kept.length !== hooks.session_start.length) {
      changed = true;
      if (kept.length === 0) delete hooks.session_start;
      else hooks.session_start = kept;
    }
  }
  if (Array.isArray(hooks.SessionStart)) {
    const newGroups = [];
    for (const group of hooks.SessionStart) {
      if (!Array.isArray(group.hooks)) {
        newGroups.push(group);
        continue;
      }
      const keptHooks = group.hooks.filter((h) => !isManagedHook2(h));
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
        if (!Array.isArray(group.hooks)) continue;
        for (const h of group.hooks) {
          if (isManagedHook2(h)) return { installed: true, command: h.command };
        }
      }
    }
    if (Array.isArray(hooks.session_start)) {
      for (const h of hooks.session_start) {
        if (isManagedHook2(h)) return { installed: true, command: h.command };
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
function writeSettings(path23, settings) {
  mkdirSync2(dirname3(path23), { recursive: true });
  writeFileSync3(path23, `${JSON.stringify(settings, null, 2)}
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
            command: claude.command ? collapseHomeDirectory2(claude.command) : sessionStartHookCommand(),
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
    const commandBase = hookCommand();
    const command = sessionStartHookCommand(commandBase);
    for (const target of [targets.claudeSettings, targets.codexHooks]) {
      try {
        const [updated, changed2] = computeSessionStartHookUpdate(readSettings(target), {
          marker: HOOK_MARKER,
          command,
          timeoutSeconds: HOOK_TIMEOUT_SECONDS
        });
        if (changed2) writeSettings(target, updated);
      } catch (err) {
        errors.push(`${target}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    const codexConfigPath = targets.codexConfig;
    try {
      const current = existsSync6(codexConfigPath) ? readFileSync4(codexConfigPath, "utf8") : "";
      const [updated, changed2] = computeCodexConfigUpdate(current);
      if (changed2) {
        mkdirSync2(dirname3(codexConfigPath), { recursive: true });
        writeFileSync3(codexConfigPath, updated);
      }
    } catch (err) {
      errors.push(`${codexConfigPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    try {
      mkdirSync2(dirname3(targets.opencodePlugin), { recursive: true });
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync6(targets.opencodePlugin) ? readFileSync4(targets.opencodePlugin, "utf8") : void 0;
      if (current !== void 0 && !current.includes(OPENCODE_MANAGED_MARKER)) {
        errors.push(`${targets.opencodePlugin}: refusing to overwrite unmanaged OpenCode plugin`);
      } else if (current !== next) {
        writeFileSync3(targets.opencodePlugin, next);
      }
    } catch (err) {
      errors.push(`${targets.opencodePlugin}: ${err instanceof Error ? err.message : String(err)}`);
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
import { existsSync as existsSync7, lstatSync as lstatSync2, readdirSync as readdirSync2, renameSync as renameSync2, rmSync as rmSync3 } from "node:fs";
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
  const root = lstatSync2(bundlePath);
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
  const index = lstatSync2(indexPath);
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
    renameSync2(boardPath, backupPath);
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
    if (!existsSync7(boardPath) && existsSync7(backupPath)) renameSync2(backupPath, boardPath);
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
  if (!existsSync7(indexPath) || lstatSync2(indexPath).isSymbolicLink() || !lstatSync2(indexPath).isFile()) {
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
  if (err.code === "AUTH_REQUIRED" || err.code === "TRANSIENT") return PUSH_FAIL_SAFETY_MESSAGE;
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
var DEFAULT_LIMIT2 = 20;
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
  let limit = DEFAULT_LIMIT2;
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
        usage: "doc history <id> [--remote <url>]",
        summary: "Show a doc's attributed version history (newest first) \u2014 the tokens for --expected-version"
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

// src/cli.ts
import { parseArgs as parseArgs27 } from "node:util";
var KNOWN_COMMANDS = [
  "init",
  "bundle",
  "catalog",
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
    const { positionals } = parseArgs27({
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
    tokens = parseArgs27({
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
