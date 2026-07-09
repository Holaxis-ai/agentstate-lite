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
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
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
    var isObject = require_is_extendable();
    module2.exports = function extend(o) {
      if (!isObject(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject(obj)) {
          assign(o, obj);
        }
      }
      return o;
    };
    function assign(a, b) {
      for (var key2 in b) {
        if (hasOwn(b, key2)) {
          a[key2] = b[key2];
        }
      }
    }
    function hasOwn(obj, key2) {
      return Object.prototype.hasOwnProperty.call(obj, key2);
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
        var line = lines[i];
        var len = stack.length;
        var ln = line.trim();
        if (isDelimiter(ln, delim)) {
          if (ln.length === 3 && i !== 0) {
            if (len === 0 || len === 2) {
              content.push(line);
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
        content.push(line);
      }
      if (sections === null) {
        initSections(content.join("\n"));
      } else {
        closeSection(content.join("\n"));
      }
      file.sections = sections;
      return file;
    };
    function isDelimiter(line, delim) {
      if (line.slice(0, delim.length) !== delim) {
        return false;
      }
      if (line.charAt(delim.length + 1) === delim.slice(-1)) {
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
    function isObject(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key2, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key2 = sourceKeys[index];
          target[key2] = source[key2];
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
    module2.exports.isObject = isObject;
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
    function Mark(name, buffer, position, line, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line;
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
      var key2, object = data;
      for (key2 in object) {
        if (_hasOwnProperty.call(object, key2)) {
          if (object[key2] !== null) return false;
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
    function setProperty(object, key2, value) {
      if (key2 === "__proto__") {
        Object.defineProperty(object, key2, {
          configurable: true,
          enumerable: true,
          writable: true,
          value
        });
      } else {
        object[key2] = value;
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
      var sourceKeys, key2, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key2 = sourceKeys[index];
        if (state.maxTotalMergeKeys !== -1 && ++state.totalMergeKeys > state.maxTotalMergeKeys) {
          throwError(state, "merge keys exceeded maxTotalMergeKeys (" + state.maxTotalMergeKeys + ")");
        }
        if (!_hasOwnProperty.call(destination, key2)) {
          setProperty(destination, key2, source[key2]);
          overridableKeys[key2] = true;
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
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") result += ind;
        result += line;
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
        var prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line, width) {
      if (line === "" || line[0] === " ") return line;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
      } else {
        result += line.slice(start);
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
    exports2.define = function(obj, key2, val) {
      Reflect.defineProperty(obj, key2, {
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
      const open2 = opts.delimiters[0];
      const close = opts.delimiters[1];
      const matter2 = engine.stringify(data, options2).trim();
      let buf = "";
      if (matter2 !== "{}") {
        buf = newline(open2) + newline(matter2) + newline(close);
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
    var fs11 = __require("fs");
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
      const open2 = opts.delimiters[0];
      const close = "\n" + opts.delimiters[1];
      let str2 = file.content;
      if (opts.language) {
        file.language = opts.language;
      }
      const openLen = open2.length;
      if (!utils.startsWith(str2, open2, openLen)) {
        excerpt(file, opts);
        return file;
      }
      if (str2.charAt(openLen) === open2.slice(-1)) {
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
      const str2 = fs11.readFileSync(filepath, "utf8");
      const file = matter2(str2, options2);
      file.path = filepath;
      return file;
    };
    matter2.test = function(str2, options2) {
      return utils.startsWith(str2, defaults(options2).delimiters[0]);
    };
    matter2.language = function(str2, options2) {
      const opts = defaults(options2);
      const open2 = opts.delimiters[0];
      if (matter2.test(str2)) {
        str2 = str2.slice(open2.length);
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
    for (const key2 in value) if (Object.hasOwn(value, key2)) encodedValues[key2] = normalizeValue(value[key2]);
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
function isValidUnquotedKey(key2) {
  return /^[A-Z_][\w.]*$/i.test(key2);
}
function isIdentifierSegment(key2) {
  return /^[A-Z_]\w*$/i.test(key2);
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
function tryFoldKeyChain(key2, value, siblings, options2, rootLiteralKeys, pathPrefix, flattenDepth) {
  if (options2.keyFolding !== "safe") return;
  if (!isJsonObject(value)) return;
  const { segments, tail, leafValue } = collectSingleKeyChain(key2, value, flattenDepth ?? options2.flattenDepth);
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
function encodeKey(key2) {
  if (isValidUnquotedKey(key2)) return key2;
  return `"${escapeString(key2)}"`;
}
function encodeAndJoinPrimitives(values, delimiter2 = DEFAULT_DELIMITER) {
  return values.map((v) => encodePrimitive(v, delimiter2)).join(delimiter2);
}
function formatHeader(length, options2) {
  const key2 = options2?.key;
  const fields = options2?.fields;
  const delimiter2 = options2?.delimiter ?? ",";
  let header = "";
  if (key2 != null) header += encodeKey(key2);
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
  for (const [key2, val] of Object.entries(value)) yield* encodeKeyValuePairLines(key2, val, depth, options2, keys, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
}
function* encodeKeyValuePairLines(key2, value, depth, options2, siblings, rootLiteralKeys, pathPrefix, flattenDepth) {
  const currentPath = pathPrefix ? `${pathPrefix}.${key2}` : key2;
  const effectiveFlattenDepth = flattenDepth ?? options2.flattenDepth;
  if (options2.keyFolding === "safe" && siblings) {
    const foldResult = tryFoldKeyChain(key2, value, siblings, options2, rootLiteralKeys, pathPrefix, effectiveFlattenDepth);
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
  const encodedKey = encodeKey(key2);
  if (isJsonPrimitive(value)) yield indentedLine(depth, `${encodedKey}: ${encodePrimitive(value, options2.delimiter)}`, options2.indent);
  else if (isJsonArray(value)) yield* encodeArrayLines(key2, value, depth, options2);
  else if (isJsonObject(value)) {
    yield indentedLine(depth, `${encodedKey}:`, options2.indent);
    if (!isEmptyObject(value)) yield* encodeObjectLines(value, depth + 1, options2, rootLiteralKeys, currentPath, effectiveFlattenDepth);
  }
}
function* encodeArrayLines(key2, value, depth, options2) {
  if (value.length === 0) {
    yield indentedLine(depth, key2 != null ? `${encodeKey(key2)}: []` : "[]", options2.indent);
    return;
  }
  if (isArrayOfPrimitives(value)) {
    yield indentedLine(depth, encodeInlineArrayLine(value, options2.delimiter, key2), options2.indent);
    return;
  }
  if (isArrayOfArrays(value)) {
    if (value.every((arr) => isArrayOfPrimitives(arr))) {
      yield* encodeArrayOfArraysAsListItemsLines(key2, value, depth, options2);
      return;
    }
  }
  if (isArrayOfObjects(value)) {
    const header = extractTabularHeader(value);
    if (header) yield* encodeArrayOfObjectsAsTabularLines(key2, value, header, depth, options2);
    else yield* encodeMixedArrayAsListItemsLines(key2, value, depth, options2);
    return;
  }
  yield* encodeMixedArrayAsListItemsLines(key2, value, depth, options2);
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
  for (const row of rows) {
    if (Object.keys(row).length !== header.length) return false;
    for (const key2 of header) {
      if (!(key2 in row)) return false;
      if (!isJsonPrimitive(row[key2])) return false;
    }
  }
  return true;
}
function* writeTabularRowsLines(rows, header, depth, options2) {
  for (const row of rows) yield indentedLine(depth, encodeAndJoinPrimitives(header.map((key2) => row[key2]), options2.delimiter), options2.indent);
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
function transformChildren(value, replacer, path12) {
  if (isJsonObject(value)) return transformObject(value, replacer, path12);
  if (isJsonArray(value)) return transformArray(value, replacer, path12);
  return value;
}
function transformObject(obj, replacer, path12) {
  const result = {};
  for (const [key2, value] of Object.entries(obj)) {
    const childPath = [...path12, key2];
    const replacedValue = replacer(key2, value, childPath);
    if (replacedValue === void 0) continue;
    result[key2] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
  }
  return result;
}
function transformArray(arr, replacer, path12) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const childPath = [...path12, i];
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
function collapseHomeDirectory(path12, homeDir = homedir()) {
  if (!path12.startsWith(homeDir)) {
    return path12;
  }
  return `~${path12.slice(homeDir.length)}`;
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
  readFileSync: (path12, encoding) => readFileSync(path12, encoding)
};
function readNearestPackageJson(startPath, fs11 = nodeFs) {
  let dir = dirname(startPath);
  let previous = "";
  while (dir !== previous) {
    const packageJsonPath = join(dir, "package.json");
    if (fs11.existsSync(packageJsonPath)) {
      try {
        const parsed = JSON.parse(fs11.readFileSync(packageJsonPath, "utf-8"));
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
  const path12 = options2.entry.replaceAll("\\", "/");
  if (path12.includes("/_npx/") || /\/dlx-[^/]+\//.test(path12) || path12.includes("/pnpm/dlx/") || path12.includes("/bun/install/cache/")) {
    return { kind: "npx" };
  }
  const homebrewFormula = homebrewFormulaFromPath(path12, env);
  if (homebrewFormula) {
    return { kind: "homebrew", formula: homebrewFormula };
  }
  const pnpmHome = normalizePathRoot(env.PNPM_HOME);
  if (isPathInsideRoot(path12, pnpmHome) || isKnownPnpmGlobalStore(path12, env)) {
    return { kind: "pnpm-global" };
  }
  if (isKnownNpmGlobalInstall(path12, env)) {
    return { kind: "npm-global" };
  }
  return { kind: "unknown" };
}
function normalizePathRoot(path12) {
  const normalized = path12?.replaceAll("\\", "/").replace(/\/+$/, "");
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function isPathInsideRoot(path12, root) {
  return root !== void 0 && (path12 === root || path12.startsWith(`${root}/`));
}
function homebrewFormulaFromPath(path12, env) {
  for (const root of homebrewCellarRoots(env)) {
    if (!isPathInsideRoot(path12, root)) {
      continue;
    }
    const relative = path12.slice(root.length).replace(/^\/+/, "");
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
function isKnownPnpmGlobalStore(path12, env) {
  return pnpmGlobalStoreRoots(env).some((root) => {
    if (!isPathInsideRoot(path12, root)) {
      return false;
    }
    const relative = path12.slice(root.length).replace(/^\/+/, "");
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
function isKnownNpmGlobalInstall(path12, env) {
  return npmGlobalNodeModulesRoots(env).some((root) => isPathInsideRoot(path12, root)) || isKnownVersionManagerNpmGlobal(path12, env);
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
function isKnownVersionManagerNpmGlobal(path12, env) {
  return versionManagerNodeRoots(env).some((root) => isPathInsideRoot(path12, root) && path12.includes("/lib/node_modules/"));
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
  return new Promise((resolve3) => {
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
      resolve3({ ok: false, message: error.message });
    });
    child.on("close", (code) => {
      resolve3(code === 0 ? { ok: true } : { ok: false, message: `${plan.command} exited with code ${code}` });
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
function resolveInstalledVersion(invokedAs, realpath, fs11) {
  const installedEntry = resolveEntry(invokedAs, realpath);
  return installedEntry ? readNearestPackageJson(installedEntry, fs11).version : void 0;
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
  const realpath = options2.realpath ?? ((path12) => realpathSync(path12));
  const entry = resolveEntry(invokedAs, realpath);
  const fs11 = options2.fs ?? nodeFs;
  const fromPackageJson = entry ? readNearestPackageJson(entry, fs11) : {};
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
      installedVersion: resolveInstalledVersion(invokedAs, realpath, fs11),
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
    const line = updated[index];
    const section = line.match(/^\s*(\[{1,2})([^\]]+)(\]{1,2})\s*(?:#.*)?$/);
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
    const flag = line.match(/^\s*hooks\s*=\s*(true|false)\s*(?:#.*)?$/);
    if (!flag) {
      continue;
    }
    if (flag[1] === "true") {
      return [content, false];
    }
    updated[index] = line.replace(/false/, "true");
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
import { existsSync as existsSync2 } from "node:fs";
import path6 from "node:path";

// ../core/src/bundle.ts
import path3 from "node:path";

// ../core/src/backend.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// ../core/src/frontmatter.ts
var import_gray_matter = __toESM(require_gray_matter(), 1);
function normalizeFrontmatter(data) {
  const out = { ...data };
  for (const [key2, value] of Object.entries(out)) {
    if (value instanceof Date) {
      out[key2] = value.toISOString();
    } else if (key2 === "timestamp" && typeof value === "number" && Number.isFinite(value)) {
      out[key2] = new Date(value).toISOString();
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
  return import_gray_matter.default.stringify(body ?? "", data);
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
function resolveContentType(key2, override) {
  if (typeof override === "string" && override.trim() !== "") return override;
  return inferContentTypeFromDocKey(key2) ?? DEFAULT_BLOB_CONTENT_TYPE;
}

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
    throw new Error("Concept id must be a non-empty string.");
  }
  const norm = toPosix(id);
  if (norm.startsWith("/")) {
    throw new Error(`Concept id must be bundle-relative, got absolute '${id}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new Error(`Concept id must not contain '..' segments: '${id}'.`);
  }
}
function assertSafeBlobKey(key2) {
  if (typeof key2 !== "string" || key2.trim() === "") {
    throw new Error("Blob key must be a non-empty string.");
  }
  const norm = toPosix(key2);
  if (norm.startsWith("/")) {
    throw new Error(`Blob key must be bundle-relative, got absolute '${key2}'.`);
  }
  const segments = norm.split("/");
  if (segments.some((seg) => seg === "..")) {
    throw new Error(`Blob key must not contain '..' segments: '${key2}'.`);
  }
  if (segments.some((seg) => seg.startsWith("."))) {
    throw new Error(`Blob key must not contain dot-prefixed segments: '${key2}'.`);
  }
  const last = segments[segments.length - 1] ?? "";
  if (last === "") {
    throw new Error(`Blob key must name a file, not end with '/': '${key2}'.`);
  }
  if (segments.some((seg) => seg.toLowerCase().endsWith(".md"))) {
    throw new Error(
      `Blob key '${key2}' has a path segment ending in '.md' (checked case-insensitively, at any depth), which collides with the concept-document namespace \u2014 write it as a doc instead.`
    );
  }
}
function assertSafeReservedDir(dir) {
  if (typeof dir !== "string") {
    throw new Error("Reserved-file directory must be a string.");
  }
  const norm = toPosix(dir);
  if (norm.startsWith("/")) {
    throw new Error(`Reserved-file directory must be bundle-relative, got absolute '${dir}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new Error(`Reserved-file directory must not contain '..' segments: '${dir}'.`);
  }
}

// ../core/src/versioning.ts
import { createHash } from "node:crypto";
function sha256Hex(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
function contentVersion(doc2) {
  return `sha256:${sha256Hex(stringifyDoc(doc2.frontmatter, doc2.body ?? ""))}`;
}
function versionOfBytes(raw) {
  return `sha256:${sha256Hex(raw)}`;
}
function blobVersion(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
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
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}
async function pathIsFile(p) {
  try {
    return (await fs.stat(p)).isFile();
  } catch {
    return false;
  }
}
function isAbsentFileError(err) {
  const code = err?.code;
  return code === "ENOENT" || code === "EISDIR";
}
async function atomicWrite(filePath, content) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = path.join(dir, `.${path.basename(filePath)}.${process.pid}.${Date.now()}.${randomUUID()}.tmp`);
  if (typeof content === "string") {
    await fs.writeFile(tmp, content, "utf8");
  } else {
    await fs.writeFile(tmp, content);
  }
  await fs.rename(tmp, filePath);
}
async function safeReaddir(abs) {
  try {
    return await fs.readdir(abs, { withFileTypes: true });
  } catch {
    return [];
  }
}
async function walkMarkdown(root, sub = "") {
  const abs = path.join(root, sub);
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
  const abs = path.join(root, sub);
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
   * Per-resolved-path promise chain serializing writes WITHIN this process.
   *
   * `write()`/`writeReserved()`'s compare-and-swap is check-then-write across two
   * `await`s (read the current version, then `atomicWrite`): without serialization, N
   * concurrent writers targeting the SAME file can all observe the SAME pre-write
   * version, all pass the CAS check, and all proceed to write — every writer reports
   * success, only the last write survives, and no `VersionConflict` is ever thrown to
   * trigger a caller's retry loop. Queuing each write's full check-then-write critical
   * section behind this per-key chain makes that section atomic per file WITHIN one
   * process, so at most one writer can win a given `expectedVersion` and the rest
   * observe a genuine `VersionConflict`. Reads stay lock-free (they are already
   * consistent via atomic rename).
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
   * Scope: this closes the race WITHIN one process only. Two `serve` processes (or a
   * `serve` plus a direct local CLI invocation) over the same directory remain
   * best-effort — see `docs/` / `STATUS.md`; only a document-centric remote backend
   * with a real atomic conditional write closes the cross-process case.
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
  withLock(key2, fn) {
    const locks = _FilesystemBackend.locks;
    const tail = locks.get(key2) ?? Promise.resolve();
    const run = tail.then(fn, fn);
    const settled = run.then(
      () => void 0,
      () => void 0
    );
    locks.set(key2, settled);
    void settled.then(() => {
      if (locks.get(key2) === settled) locks.delete(key2);
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
    const rootResolved = path.resolve(this.root);
    const resolved = path.resolve(rootResolved, rel);
    if (resolved !== rootResolved && !resolved.startsWith(rootResolved + path.sep)) {
      throw new Error(`Path '${rel}' resolves outside the bundle root.`);
    }
    return resolved;
  }
  async read(id) {
    assertSafeConceptId(id);
    const rel = pathFromConceptId(id);
    const raw = await fs.readFile(this.abs(rel), "utf8");
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
      return versionOfBytes(await fs.readFile(absPath, "utf8"));
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
      await fs.unlink(target);
      return true;
    });
  }
  async versions(id) {
    assertSafeConceptId(id);
    const p = this.abs(pathFromConceptId(id));
    let raw;
    let mtime;
    try {
      raw = await fs.readFile(p, "utf8");
      mtime = (await fs.stat(p)).mtime;
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
    const content = await fs.readFile(p, "utf8");
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
      return blobVersion(await fs.readFile(absPath));
    } catch (err) {
      if (isAbsentFileError(err)) return null;
      throw err;
    }
  }
  async readBlob(key2) {
    assertSafeBlobKey(key2);
    let bytes;
    try {
      bytes = await fs.readFile(this.abs(key2));
    } catch (err) {
      if (isAbsentFileError(err)) return null;
      throw err;
    }
    return { bytes, contentType: resolveContentType(key2), version: blobVersion(bytes) };
  }
  async writeBlob(key2, bytes, _contentType, options2 = {}) {
    assertSafeBlobKey(key2);
    const target = this.abs(key2);
    return this.withLock(target, async () => {
      if (options2.expectedVersion !== void 0) {
        const current = await this.currentBlobVersionAt(target);
        if (current !== options2.expectedVersion) {
          throw new VersionConflict(key2, options2.expectedVersion, current);
        }
      }
      await atomicWrite(target, bytes);
      return blobVersion(bytes);
    });
  }
  async deleteBlob(key2, options2 = {}) {
    assertSafeBlobKey(key2);
    const target = this.abs(key2);
    return this.withLock(target, async () => {
      const current = await this.currentBlobVersionAt(target);
      if (current === null) return false;
      if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
        throw new VersionConflict(key2, options2.expectedVersion, current);
      }
      await fs.unlink(target);
      return true;
    });
  }
  async existsBlob(key2) {
    assertSafeBlobKey(key2);
    return pathIsFile(this.abs(key2));
  }
  async listBlobs(prefix) {
    const keys = await walkBlobs(this.root);
    const filtered = prefix ? keys.filter((k) => k.startsWith(prefix)) : keys;
    filtered.sort((a, b) => a.localeCompare(b));
    return filtered;
  }
};

// ../core/src/links.ts
import path2 from "node:path";
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
    resolved = path2.posix.join(fromDir, target);
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
  let rel = path2.posix.relative(fromDir, targetId);
  if (rel === "") rel = path2.posix.basename(targetId);
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

// ../core/src/bundle.ts
function backendFor(bundle) {
  return bundle.backend ?? new FilesystemBackend(bundle.root);
}
async function initBundle(root, options2 = {}) {
  const resolved = path3.resolve(root);
  const backend = new FilesystemBackend(resolved);
  if (await backend.readReserved("", "index.md") === null) {
    const okfVersion = options2.okfVersion ?? "0.1";
    const name = path3.basename(resolved);
    const body = `# ${name}

An Open Knowledge Format bundle.
`;
    await backend.writeReserved("", "index.md", stringifyWithData({ okf_version: okfVersion }, body));
  }
  return { root: resolved };
}
async function writeDocVersioned(bundle, doc2, options2) {
  assertSafeConceptId(doc2.id);
  const rel = pathFromConceptId(doc2.id);
  if (isReservedFile(rel)) {
    throw new Error(
      `'${doc2.id}' maps to a reserved file (${rel}); use the index/log accessors, not writeDoc.`
    );
  }
  const type = doc2.frontmatter?.type;
  if (typeof type !== "string" || type.trim() === "") {
    throw new Error(`OKF \xA79.2: frontmatter.type is required and must be non-empty (concept '${doc2.id}').`);
  }
  const existingTs = doc2.frontmatter.timestamp;
  const timestamp = typeof existingTs === "string" && existingTs.trim() !== "" ? existingTs : (/* @__PURE__ */ new Date()).toISOString();
  const { type: _t, timestamp: _ts, ...rest } = doc2.frontmatter;
  const frontmatter = { type, ...rest, timestamp };
  const saved = { id: doc2.id, frontmatter, body: doc2.body ?? "" };
  const version = await backendFor(bundle).write(doc2.id, saved, options2);
  return { doc: saved, version };
}
async function writeDoc(bundle, doc2, options2) {
  return (await writeDocVersioned(bundle, doc2, options2)).doc;
}
async function readDocVersioned(bundle, id) {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
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
    throw new Error(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
  }
  return backendFor(bundle).versions(id);
}
async function deleteDoc(bundle, id, options2) {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file (${rel}); reserved files cannot be deleted.`);
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
function matchesFilter(doc2, filter) {
  if (filter.prefix && !doc2.id.startsWith(filter.prefix)) return false;
  if (filter.type && doc2.frontmatter.type !== filter.type) return false;
  if (filter.tags && filter.tags.length > 0) {
    const tags = Array.isArray(doc2.frontmatter.tags) ? doc2.frontmatter.tags : [];
    if (!filter.tags.every((t) => tags.includes(t))) return false;
  }
  if (filter.fields) {
    const fm = doc2.frontmatter;
    for (const [k, want] of Object.entries(filter.fields)) {
      const raw = fm[k];
      const actual = raw === void 0 || raw === null ? [] : (Array.isArray(raw) ? raw : [raw]).map((v) => String(v));
      if (!actual.includes(want)) return false;
    }
  }
  return true;
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
async function backlinks(bundle, target) {
  const normalizedTarget = toPosix(target).replace(/^\.?\//, "").replace(/\.md$/, "");
  const docs = await query(bundle);
  const inbound = [];
  for (const doc2 of docs) {
    for (const link2 of parseLinksFromDoc(doc2)) {
      if (link2.to === normalizedTarget) inbound.push(link2);
    }
  }
  inbound.sort((a, b) => a.from.localeCompare(b.from) || a.text.localeCompare(b.text));
  return inbound;
}
async function readBlob(bundle, key2) {
  return backendFor(bundle).readBlob(key2);
}
async function writeBlob(bundle, key2, bytes, contentType, options2) {
  return backendFor(bundle).writeBlob(key2, bytes, contentType, options2);
}
async function listBlobs(bundle, prefix) {
  return backendFor(bundle).listBlobs(prefix);
}
async function deleteBlob(bundle, key2, options2) {
  return backendFor(bundle).deleteBlob(key2, options2);
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
    const key2 = reservedKey(dir, name);
    const existing = this.reserved.get(key2);
    const current = existing === void 0 ? null : versionOfBytes(existing);
    if (options2.expectedVersion !== void 0 && options2.expectedVersion !== current) {
      throw new VersionConflict(key2, options2.expectedVersion, current);
    }
    this.reserved.set(key2, content);
    return versionOfBytes(content);
  }
  // ── blobs: opaque bytes + a content-type ──────────────────────────────────
  async readBlob(key2) {
    assertSafeBlobKey(key2);
    const entry = this.blobs.get(key2);
    if (!entry) return null;
    return { bytes: new Uint8Array(entry.bytes), contentType: entry.contentType, version: entry.version };
  }
  async writeBlob(key2, bytes, contentType, options2 = {}) {
    assertSafeBlobKey(key2);
    const existing = this.blobs.get(key2);
    const current = existing?.version ?? null;
    if (options2.expectedVersion !== void 0 && options2.expectedVersion !== current) {
      throw new VersionConflict(key2, options2.expectedVersion, current);
    }
    const version = blobVersion(bytes);
    const resolvedType = resolveContentType(key2, contentType);
    if (existing && existing.version === version && existing.contentType === resolvedType) {
      return version;
    }
    this.blobs.set(key2, { bytes: new Uint8Array(bytes), contentType: resolvedType, version });
    return version;
  }
  async deleteBlob(key2, options2 = {}) {
    assertSafeBlobKey(key2);
    const existing = this.blobs.get(key2);
    const current = existing?.version ?? null;
    if (current === null) return false;
    if (options2.expectedVersion !== void 0 && current !== options2.expectedVersion) {
      throw new VersionConflict(key2, options2.expectedVersion, current);
    }
    this.blobs.delete(key2);
    return true;
  }
  async existsBlob(key2) {
    assertSafeBlobKey(key2);
    return this.blobs.has(key2);
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
    throw new Error(
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
function delay(ms) {
  return new Promise((resolve3) => setTimeout(resolve3, ms));
}
function encodeId(id) {
  return id.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}
function encodeBlobKey(key2) {
  return key2.split("/").map((seg) => encodeURIComponent(seg)).join("/");
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
          await delay(retryDelayMs(attempt));
          continue;
        }
        return res;
      } catch (err) {
        if (attempt < this.maxRetries) {
          await delay(retryDelayMs(attempt));
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
      for (const row of payload.docs) rows.push(mapRow(row));
      if (!payload.next_cursor) break;
      cursor = payload.next_cursor;
    }
    return rows;
  }
  async list(prefix) {
    const params = new URLSearchParams();
    if (prefix) params.set("prefix", prefix);
    return this.pageDocs(params, (row) => row.id, prefix ?? "");
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
      (row) => ({ id: row.id, frontmatter: row.frontmatter, version: row.version }),
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
  // No `Buffer` anywhere in this module, so it stays CF-Worker-clean end to end.
  // Content-type rides `Content-Type`; the version rides `X-Version`/`ETag` (extractVersion),
  // exactly like docs.
  async readBlob(key2) {
    const res = await this.send(`/blobs/${encodeBlobKey(key2)}`, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) throw await this.toError(res, key2);
    const version = extractVersion(res, `GET /blobs/${key2}`);
    const contentType = res.headers.get("content-type") ?? DEFAULT_BLOB_CONTENT_TYPE;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { bytes, contentType, version };
  }
  async writeBlob(key2, bytes, contentType, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = {};
    if (contentType) headers["content-type"] = contentType;
    if (options2.expectedVersion === null) headers["If-None-Match"] = "*";
    else if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    if (options2.actor) headers["X-Actor"] = options2.actor;
    const res = await this.send(`/blobs/${encodeBlobKey(key2)}`, {
      method: "PUT",
      headers,
      body: bytes
    });
    if (!res.ok) throw await this.toError(res, key2);
    const payload = await res.json();
    return payload.version;
  }
  /** `DELETE /blobs/{key}`, mirroring `delete`'s `If-Match`/no-404/no-actor posture exactly. */
  async deleteBlob(key2, options2 = {}) {
    assertValidExpectedVersion(options2.expectedVersion);
    const headers = {};
    if (options2.expectedVersion !== void 0) headers["If-Match"] = options2.expectedVersion;
    const res = await this.send(`/blobs/${encodeBlobKey(key2)}`, { method: "DELETE", headers });
    if (!res.ok) throw await this.toError(res, key2);
    const payload = await res.json();
    return payload.deleted;
  }
  async existsBlob(key2) {
    const res = await this.send(`/blobs/${encodeBlobKey(key2)}`, { method: "HEAD" });
    if (res.status === 404) return false;
    if (!res.ok) throw await this.toError(res, key2);
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
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
function toStringArrayLenient(value, path12, docId, warnings) {
  if (!Array.isArray(value)) {
    if (value !== void 0) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${docId}' has a non-list '${path12}' (${describeShape(value)}; expected a list of strings); ignoring it.`,
        field: path12,
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
        message: `kind convention '${docId}' has a non-scalar member (${describeShape(v)}) in '${path12}'; skipping it.`,
        field: path12,
        severity: "warning"
      });
    }
  }
  return out;
}
var RESERVED_FIELD_NAMES = /* @__PURE__ */ new Set(["type", "dir", "remote", "json", "help"]);
var VALID_FIELDS_KEYS = /* @__PURE__ */ new Set(["required", "optional", "values", "terminal"]);
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
    out[name] = body.slice(start, end).trim();
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
  for (const key2 of MISPLACED_TOP_LEVEL_KEYS) {
    if (key2 in fm) {
      warnings.push({
        code: "KIND_CONVENTION_MISPLACED_KEY",
        message: `kind convention '${doc2.id}' declares a top-level '${key2}' key, which core does not read; enum constraints go under 'fields.values.<field>: [...]', not '${key2}'.`,
        field: key2,
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
      message: `kind convention '${doc2.id}' has a non-map 'fields' key (${describeShape(fieldsSource)}; expected a map with required/optional/values); ignoring it.`,
      field: "fields",
      severity: "warning"
    });
  } else {
    fieldsRaw = fieldsSource;
    for (const key2 of Object.keys(fieldsRaw)) {
      if (!VALID_FIELDS_KEYS.has(key2)) {
        warnings.push({
          code: "KIND_CONVENTION_UNKNOWN_FIELDS_KEY",
          message: `kind convention '${doc2.id}' declares an unrecognized key 'fields.${key2}' (valid keys: fields.required, fields.optional, fields.values, fields.terminal); ignoring it.`,
          field: `fields.${key2}`,
          severity: "warning"
        });
      }
    }
  }
  const reservedFieldsIgnored = /* @__PURE__ */ new Set();
  const dropReserved = (name) => {
    if (!RESERVED_FIELD_NAMES.has(name)) return false;
    reservedFieldsIgnored.add(name);
    return true;
  };
  const required = toStringArrayLenient(fieldsRaw.required, "fields.required", doc2.id, warnings).filter(
    (f) => !dropReserved(f)
  );
  const optional = toStringArrayLenient(fieldsRaw.optional, "fields.optional", doc2.id, warnings).filter(
    (f) => !dropReserved(f)
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
        if (dropReserved(field)) continue;
        values[field] = toStringArrayLenient(allowed, `fields.values.${field}`, doc2.id, warnings);
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
        if (dropReserved(field)) continue;
        terminal[field] = toStringArrayLenient(terminalValues, `fields.terminal.${field}`, doc2.id, warnings);
      }
    }
  }
  for (const field of Object.keys(terminal)) {
    const allowed = values[field];
    if (!allowed) {
      warnings.push({
        code: "KIND_CONVENTION_TERMINAL_UNDECLARED_FIELD",
        message: `kind convention '${doc2.id}' declares 'fields.terminal.${field}' but '${field}' has no 'fields.values.${field}' enum declared.`,
        field: `fields.terminal.${field}`,
        severity: "warning"
      });
      continue;
    }
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
        parsed[name] = String(target).trim();
      }
      if (Object.keys(parsed).length > 0) links = parsed;
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
        parsed[name] = String(source).trim();
      }
      if (Object.keys(parsed).length > 0) expectsInbound = parsed;
    }
  }
  const sections = Array.isArray(fm.sections) ? fm.sections.filter((s) => typeof s === "string" && s.trim() !== "") : void 0;
  const title = typeof fm.title === "string" && fm.title.trim() !== "" ? fm.title.trim() : governs;
  const path12 = typeof fm.path === "string" && fm.path.trim() !== "" ? fm.path.trim() : void 0;
  const freshnessHorizon = typeof fm.freshness_horizon === "string" && fm.freshness_horizon.trim() !== "" ? fm.freshness_horizon.trim() : void 0;
  const kind2 = { id: doc2.id, title, governs, fields: { required, optional, values, terminal } };
  if (path12 !== void 0) kind2.path = path12;
  if (links !== void 0) kind2.links = links;
  if (expectsInbound !== void 0) kind2.expectsInbound = expectsInbound;
  if (sections && sections.length > 0) kind2.sections = sections;
  if (freshnessHorizon !== void 0) kind2.freshnessHorizon = freshnessHorizon;
  return { ok: true, kind: kind2, reservedFieldsIgnored: [...reservedFieldsIgnored].sort(), warnings };
}
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
    const { kind: kind2, reservedFieldsIgnored } = parsed;
    warnings.push(...parsed.warnings);
    if (reservedFieldsIgnored.length > 0) {
      warnings.push({
        code: "KIND_RESERVED_FIELD",
        message: `kind convention '${doc2.id}' declares reserved field name(s) ${reservedFieldsIgnored.join(", ")} (reserved by the CLI: type/dir/remote/json/help); ignoring them.`,
        field: reservedFieldsIgnored.join(","),
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
    if (!isPresent(fm[field])) {
      warnings.push({
        code: "KIND_FIELD_MISSING",
        message: `'${kind2.governs}' requires a non-empty '${field}' field (declared by ${kind2.id}).`,
        field,
        severity: "warning"
      });
    }
  }
  for (const [field, allowed] of Object.entries(kind2.fields.values)) {
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
      if (!(heading in sections)) {
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
function isTerminal(kind2, frontmatter) {
  const fm = frontmatter;
  for (const [field, terminalValues] of Object.entries(kind2.fields.terminal)) {
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
  if (Object.keys(kind2.fields.terminal).length > 0) fields.terminal = kind2.fields.terminal;
  const frontmatter = { type: CONVENTION_TYPE, title: kind2.title, governs: kind2.governs, timestamp };
  if (kind2.path !== void 0) frontmatter.path = kind2.path;
  if (kind2.links && Object.keys(kind2.links).length > 0) frontmatter.links = kind2.links;
  if (kind2.expectsInbound && Object.keys(kind2.expectsInbound).length > 0) {
    frontmatter.expects_inbound = kind2.expectsInbound;
  }
  frontmatter.fields = fields;
  if (kind2.sections && kind2.sections.length > 0) frontmatter.sections = kind2.sections;
  if (kind2.freshnessHorizon !== void 0) frontmatter.freshness_horizon = kind2.freshnessHorizon;
  return { id: kind2.id, frontmatter, body: prose };
}

// ../core/src/auth-wire.ts
var ROLES = ["admin", "writer", "reader"];
function isRole(value) {
  return ROLES.includes(value);
}

// src/bundle.ts
import { promises as fs2 } from "node:fs";
import path4 from "node:path";

// src/invocation.ts
import { fileURLToPath } from "node:url";
import { realpathSync as realpathSync2 } from "node:fs";
import { delimiter, join as join2 } from "node:path";
import { homedir as homedir2 } from "node:os";
var PACKAGE_NAME = "agentstate-lite";
var BIN_NAMES = ["agentstate-lite", "aslite"];
function collapseHomeDirectory2(p) {
  const home2 = homedir2();
  if (home2 && (p === home2 || p.startsWith(home2 + "/"))) {
    return "~" + p.slice(home2.length);
  }
  return p;
}
function realOrUndefined(p) {
  try {
    return realpathSync2(p);
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
      const resolved = realOrUndefined(join2(dir, name));
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
  if (err instanceof MalformedDocumentError) return new CliError("RUNTIME", err.message);
  if (err instanceof RemoteError) {
    if (err.code === "AUTH_REQUIRED") {
      return new CliError("AUTH_REQUIRED", err.message, {
        help: `${cliInvocation()} login --remote ${remoteUrl ?? "<url>"} --api-key <key>`
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
    return new CliError("USAGE", err.message);
  }
  return new CliError("USAGE", err instanceof Error ? err.message : String(err));
}
function toExit(err) {
  if (err instanceof CliError) {
    return { exitCode: err.exitCode, envelope: toEnvelope(err), handled: err.handled };
  }
  if (err instanceof RemoteError) {
    const cliErr = classifyBundleError(err);
    return { exitCode: cliErr.exitCode, envelope: toEnvelope(cliErr), handled: false };
  }
  const message = err instanceof Error ? err.message : String(err);
  return { exitCode: EXIT.RUNTIME, envelope: { error: { code: "RUNTIME", message } }, handled: false };
}
function firstGitLine(f) {
  const line = f.stderr.split("\n").find((l) => l.trim().length > 0) ?? f.stdout.split("\n").find((l) => l.trim().length > 0) ?? "";
  return line.trim();
}
function classifyGitError(f) {
  const op = f.args[0] ?? "git";
  const text = `${f.stderr}
${f.stdout}`;
  if (f.spawnErrorCode === "ENOENT") {
    return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
      details: { op },
      help: "install git (https://git-scm.com/downloads), then re-run the command"
    });
  }
  if (f.timedOut || f.spawnErrorCode === "ETIMEDOUT") {
    return new CliError("TRANSIENT", `git ${op} timed out \u2014 the network or repository may be slow; retry`, {
      details: { op, retryable: true }
    });
  }
  if (/index\.lock|Another git process seems to be running/i.test(text)) {
    return new CliError(
      "GIT_BUSY",
      "another git process is using this repository \u2014 retry once it finishes",
      { details: { op, retryable: true } }
    );
  }
  if (/'origin' does not appear to be a git repository/i.test(text) || /No such remote:? '?origin'?/i.test(text) || /invalid upstream ['"]?origin\//i.test(text) || /origin\/[^\s]+ - not something we can merge/i.test(text) || /couldn'?t find remote ref/i.test(text) || /src refspec [^\s]+ does not match any/i.test(text)) {
    return new CliError(
      "NO_UPSTREAM",
      "the board branch isn't linked to a remote yet \u2014 sync can't share it",
      { details: { op } }
    );
  }
  if (/authentication failed/i.test(text) || /could not read (Username|Password)/i.test(text) || /Permission denied \(publickey/i.test(text) || /returned error: 40[13]/i.test(text) || /Repository not found/i.test(text) || /does not appear to be a git repository/i.test(text) || /access denied|Invalid username or password/i.test(text)) {
    return new CliError(
      "AUTH_REQUIRED",
      `git ${op} was denied access to the remote (or the repository is not visible to your credentials)`,
      { details: { op, best_effort: true } }
    );
  }
  if (/You are not currently on a branch|HEAD detached/i.test(text)) {
    return new CliError(
      "RUNTIME",
      "the board worktree is in a detached-HEAD state \u2014 sync needs the board branch checked out",
      { details: { op, state: "detached-head" } }
    );
  }
  if (/needs merge/i.test(text) || /unmerged files/i.test(text) || /not possible because you have unmerged/i.test(text) || /Resolve all conflicts/i.test(text)) {
    return new CliError("CONFLICT", "the board worktree has unresolved conflicts", { details: { op } });
  }
  if (/Could not resolve host|unable to access|Connection (refused|timed out|reset)|Operation timed out|network is unreachable|Failed to connect/i.test(
    text
  )) {
    return new CliError("TRANSIENT", `git ${op} could not reach the remote \u2014 offline or the host is unreachable; retry`, {
      details: { op, retryable: true }
    });
  }
  const line = firstGitLine(f);
  return new CliError("RUNTIME", `git ${op} failed${line ? `: ${line}` : ""}`, {
    details: { op, exit_status: f.status }
  });
}
function asHandled(err) {
  if (err instanceof CliError) {
    return new CliError(err.code, err.message, {
      details: err.details,
      help: err.help,
      handled: true
    });
  }
  const message = err instanceof Error ? err.message : String(err);
  return new CliError("RUNTIME", message, { handled: true });
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
  const path12 = url.pathname.replace(/\/+$/, "");
  return { base: url.origin + path12, resource: url.origin };
}

// src/credentials.ts
import { chmod, mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { homedir as homedir3 } from "node:os";
import { join as join3 } from "node:path";
var CRED_DIR_NAME = ".agentstate";
var CRED_FILE_NAME = "okf-config.json";
var DIR_MODE = 448;
var FILE_MODE = 384;
function credentialsDir(home2 = homedir3()) {
  return join3(home2, CRED_DIR_NAME);
}
function credentialsPath(home2 = homedir3()) {
  return join3(credentialsDir(home2), CRED_FILE_NAME);
}
async function writeFileAtomic0600(dir, fileName, content) {
  await mkdir(dir, { recursive: true, mode: DIR_MODE });
  await chmod(dir, DIR_MODE);
  const path12 = join3(dir, fileName);
  const tmpPath = join3(dir, `.${fileName}.${randomBytes(8).toString("hex")}.tmp`);
  const handle = await open(tmpPath, "wx", FILE_MODE);
  try {
    await handle.writeFile(content);
    await handle.chmod(FILE_MODE);
  } finally {
    await handle.close();
  }
  try {
    await rename(tmpPath, path12);
  } catch (err) {
    await unlink(tmpPath).catch(() => {
    });
    throw err;
  }
}
async function saveCredentials(creds, home2 = homedir3()) {
  await writeFileAtomic0600(
    credentialsDir(home2),
    CRED_FILE_NAME,
    JSON.stringify(creds, null, 2) + "\n"
  );
}
async function loadCredentials(home2 = homedir3()) {
  let raw;
  try {
    raw = await readFile(credentialsPath(home2), "utf8");
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
async function getApiKeyForOrigin(origin, home2 = homedir3()) {
  const creds = await loadCredentials(home2);
  const key2 = creds?.remotes?.[origin]?.api_key;
  return isNonEmptyString(key2) ? key2 : void 0;
}
async function saveApiKeyForOrigin(origin, apiKey, home2 = homedir3()) {
  const existing = await loadCredentials(home2) ?? {};
  const next = {
    ...existing,
    remotes: { ...existing.remotes ?? {}, [origin]: { api_key: apiKey } }
  };
  await saveCredentials(next, home2);
}

// src/bundle.ts
async function exists(p) {
  try {
    await fs2.stat(p);
    return true;
  } catch {
    return false;
  }
}
function resolveTargetDir(dirFlag) {
  return path4.resolve(dirFlag ?? process.cwd());
}
async function findAncestorWithFile(start, filename) {
  let dir = path4.resolve(start);
  while (true) {
    if (await exists(path4.join(dir, filename))) return dir;
    const parent = path4.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
var CONVENTIONAL_BUNDLE_DIR_NAME = ".agentstate-lite";
async function findBundleRoot(start) {
  let dir = path4.resolve(start);
  while (true) {
    if (await exists(path4.join(dir, "index.md"))) return dir;
    const conventional = path4.join(dir, CONVENTIONAL_BUNDLE_DIR_NAME);
    if (await exists(path4.join(conventional, "index.md"))) return conventional;
    const parent = path4.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
var PROJECT_BINDING_FILE_NAME = ".agentstate.json";
function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
async function resolveProjectBinding(startDir = process.cwd()) {
  const dir = await findAncestorWithFile(startDir, PROJECT_BINDING_FILE_NAME);
  if (!dir) return null;
  const file = path4.join(dir, PROJECT_BINDING_FILE_NAME);
  let raw;
  try {
    raw = await fs2.readFile(file, "utf8");
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
      `malformed project binding ${file}: "bundle" must be a non-empty string (an http(s) URL or a filesystem path)`,
      { help: `fix or remove ${file}` }
    );
  }
  const trimmed = rawBundle.trim();
  if (isHttpUrl(trimmed)) {
    return { file, target: trimmed, isRemote: true };
  }
  return { file, target: path4.resolve(dir, trimmed), isRemote: false };
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
  if (remoteFlag) return remoteFlag;
  if (dirFlag) return void 0;
  const env = process.env[REMOTE_ENV_VAR]?.trim();
  if (env) return env;
  const binding = await resolveProjectBinding();
  return binding?.isRemote ? binding.target : void 0;
}
async function openBundle(dirFlag, remoteFlag) {
  if (remoteFlag) {
    if (dirFlag) {
      throw new CliError(
        "USAGE",
        "--remote and --dir are mutually exclusive",
        { help: `${cliInvocation()} <command> --remote <url>` }
      );
    }
    return openRemoteBundle(remoteFlag);
  }
  if (dirFlag) {
    const root2 = path4.resolve(dirFlag);
    if (!await exists(path4.join(root2, "index.md"))) {
      throw new CliError("NOT_FOUND", `no OKF bundle at ${root2} (no index.md)`, {
        help: `${cliInvocation()} init --dir ${dirFlag}`
      });
    }
    return { root: root2 };
  }
  const binding = await resolveProjectBinding();
  if (binding && !binding.isRemote) {
    const root2 = binding.target;
    if (!await exists(path4.join(root2, "index.md"))) {
      throw new CliError(
        "NOT_FOUND",
        `no OKF bundle at ${root2} (no index.md) \u2014 from project binding ${binding.file}`,
        { help: `${cliInvocation()} init --dir ${root2}` }
      );
    }
    return { root: root2 };
  }
  const root = await findBundleRoot(process.cwd());
  if (!root) {
    throw new CliError(
      "NOT_FOUND",
      `no OKF bundle found (no index.md, and no ${CONVENTIONAL_BUNDLE_DIR_NAME}/index.md, in the current directory or its ancestors)`,
      { help: `${cliInvocation()} init --dir ${CONVENTIONAL_BUNDLE_DIR_NAME}` }
    );
  }
  return { root };
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

// src/recipes.ts
var CONTEXT_NOTE_TYPE = "Context Note";
var CONTEXT_NOTE_KIND = {
  id: "conventions/context-note",
  title: CONTEXT_NOTE_TYPE,
  governs: CONTEXT_NOTE_TYPE,
  path: "context-notes/",
  fields: { required: ["title", "timestamp"], optional: ["description", "tags"], values: {}, terminal: {} },
  sections: ["Summary"],
  freshnessHorizon: "24h"
};
var CONTEXT_NOTE_SEED_BODY = '# Context Note\n\nAn agent\'s cross-session orientation note: what happened, what was decided, and what\'s still open. Create one with `new "Context Note" <id>` (scaffolds the `# Summary` section under `context-notes/`), read it with `doc read`, and edit it with `doc update` / `doc write`. `status` surfaces this kind\'s 24h freshness horizon across the bundle.\n\n## Declaring a kind convention\n\nA kind convention is a plain OKF doc (`type: Convention`) living under `conventions/`. Its FRONTMATTER is the only part core parses (this prose is not). Supported frontmatter keys:\n\n- `governs` (required, non-empty) \u2014 the `type` value this convention governs.\n- `title` (optional) \u2014 display title; defaults to `governs`.\n- `path` (optional) \u2014 canonical bundle-relative path prefix instances are scaffolded under (e.g. `roadmap/`).\n- `fields.required` \u2014 list of field names an instance MUST carry (non-empty).\n- `fields.optional` \u2014 list of field names an instance MAY carry.\n- `fields.values` \u2014 a MAP of `field name -> list of allowed values`. This is the ONLY place an enum constraint goes \u2014 never a top-level `enum:`/`enums:`/`values:`/`constraints:` key, and never a field named directly at the top level either.\n- `sections` \u2014 list of expected level-1 (`# Heading`) body-section names. Declare only the headings EVERY instance must carry (this Context Note kind declares just `Summary`, the one section `new "Context Note"` scaffolds and every instance carries).\n- `freshness_horizon` \u2014 `<n>(m|h|d)`, e.g. `24h`, `30d`, `15m`.\n\nWorked example (a `Roadmap Item` kind, with an enum-restricted field and expected sections):\n\n```yaml\n---\ntype: Convention\ntitle: Roadmap Item\ngoverns: Roadmap Item\npath: roadmap/\nfields:\n  required: [title, status]\n  optional: [horizon]\n  values:\n    status: [planned, active, done]\nsections: [Why, "Done when"]\nfreshness_horizon: 30d\n---\n```\n';
var CONTEXT_NOTES_SUMMARY = "Declares the built-in Context Note kind convention (title/timestamp required, 24h freshness horizon)";
var RECIPE_DESC_BODY = "# Context Notes\n\nInstalls the `Context Note` kind convention: a lightweight cross-session orientation note \u2014 what happened, what was decided, what's still open. Declares the `Context Note` type's required fields, the `# Summary` scaffold section, and a 24h freshness horizon.\n\nApplied by default on `init` (opt out with `init --recipe none`), or on demand with `recipe add context-notes`.\n";
var TASK_TYPE = "Task";
var TASK_KIND = {
  id: "conventions/task",
  title: TASK_TYPE,
  governs: TASK_TYPE,
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
    // The terminal declaration (tasks/status-terminal-declaration.md): done/canceled are the
    // states past which a Task is no longer open — machinery (list --open, the status sweep's
    // exclusion + sort) ships together with the declaration for every new bundle.
    terminal: { status: ["done", "canceled"] }
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
  fields: { required: ["title"], optional: [], values: {}, terminal: {} }
};
var ROADMAP_SEED_BODY = "# Roadmap\n\nThe spine document: a single top-level roadmap doc that CONTAINS the bundle's Roadmap\nItems via typed links carrying the text `contains` (`link add <roadmap> <item> --text\ncontains`), making the whole roadmap \u2192 item \u2192 task chain one filtered query per hop\n(`link show <id> --text contains`). Progress is DERIVED, never stored: list the\ncontained items and read their statuses.\n";
var ROADMAP_ITEM_KIND = {
  id: "conventions/roadmap-item",
  title: ROADMAP_ITEM_TYPE,
  governs: ROADMAP_ITEM_TYPE,
  path: "roadmap-items/",
  links: { contains: "Task" },
  fields: {
    required: ["title", "status"],
    optional: ["description", "sequence"],
    values: { status: ["queued", "active", "done"] },
    // Brian's ruling (task board `tasks/status-terminal-declaration.md`): a done Roadmap Item
    // hides from `list --open`, consistent with Task's done/canceled.
    terminal: { status: ["done"] }
  }
};
var ROADMAP_ITEM_SEED_BODY = '# Roadmap Item\n\nA durable line of work spanning multiple tasks \u2014 the granular form of the single\nroadmap spine doc. An item CONTAINS its tasks via links carrying the text `contains`;\nbacklinks from a task answer "which item owns this". An item\'s progress is DERIVED,\nnever stored: list its contained tasks and read their statuses (the rollup). `status`\ntracks the item itself: `queued` (not started) \u2192 `active` (any contained task moving)\n\u2192 `done` (all contained tasks done or canceled).\n';
var ROADMAP_SUMMARY = "Declares the Roadmap + Roadmap Item kind conventions (typed 'contains' links, roadmap \u2192 item \u2192 task; item status enum queued/active/done) \u2014 work-tracking's companion";
var ROADMAP_DESC_BODY = "# Roadmap\n\nInstalls the `Roadmap` and `Roadmap Item` kind conventions: roadmap-items-as-docs. A single\n`Roadmap` spine doc CONTAINS `Roadmap Item` docs; each item CONTAINS its `Task` docs \u2014 all\nvia typed links carrying the text `contains`, so the whole roadmap \u2192 item \u2192 task chain is\none filtered query per hop (`link show <id> --text contains`). An item's progress is derived\nfrom its contained tasks' statuses, never stored.\n\nApplied on demand with `recipe add roadmap` (not part of `init`'s default \u2014 that stays\n`context-notes`). Composes with the `work-tracking` recipe (the `Task` kind this recipe's\n`contains` vocabulary points at) \u2014 apply both for the full chain.\n\n## Pairing the Task kind (opt-in, one documented step)\n\nThe graph lint that answers \"which tasks have no owning Roadmap Item\" reads\n`expects_inbound` on the TASK kind's convention (`status` then reports\n`missing_expected_links`). A recipe applies via expect-absent CAS and never touches a doc\nthat already exists, so this recipe cannot patch your bundle's `conventions/task` \u2014 the\npairing is a deliberate one-step opt-in on the adopting bundle:\n\n```\nagentstate-lite pull --doc-key conventions/task.md --out task.md\n# edit task.md \u2014 add to the frontmatter:\n#   expects_inbound:\n#     contains: Roadmap Item\nagentstate-lite promote task.md --doc-key conventions/task.md --expected-version <version from the pull receipt>\n```\n\nWithout this step everything else still works (the `contains` vocabulary and its link-type\nvalidation come from THIS recipe's conventions); only the \"task lacks an owning item\" lint\nstays off.\n";
async function applyRecipe(bundle, recipe2, now = (/* @__PURE__ */ new Date()).toISOString()) {
  const docs = [];
  for (const d of recipe2.docs) {
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
  return {
    id: recipe2.id,
    version: recipe2.version,
    source: recipe2.source,
    docs,
    changed: docs.some((d) => d.changed),
    warnings: recipe2.warnings
  };
}
async function appliedDocIds(bundle) {
  const docs = await query(bundle, { prefix: CONVENTIONS_PREFIX });
  return new Set(docs.map((d) => d.id));
}
function isRecipeApplied(recipe2, appliedIds) {
  return recipe2.docs.every((doc2) => appliedIds.has(doc2.id));
}

// src/recipe-source.ts
import { promises as fs3 } from "node:fs";
import os from "node:os";
import path5 from "node:path";
var RESERVED_MANIFEST_KEYS = ["composes", "seeds", "requires"];
function nonEmptyString(v) {
  return typeof v === "string" ? v.trim() : "";
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
  const warnings = [];
  for (const key2 of RESERVED_MANIFEST_KEYS) {
    if (key2 in manifest) {
      warnings.push({
        code: "RECIPE_MANIFEST_RESERVED_KEY",
        message: `recipe '${id}' declares '${key2}:' in recipe.md, which this version does not apply (reserved for a future composition surface) \u2014 it is declared but NOT applied, not silently ignored.`,
        field: key2,
        severity: "warning"
      });
    }
  }
  const docs = [];
  const governsSeen = /* @__PURE__ */ new Map();
  const governsList = [];
  for (const file of files) {
    if (file.path === "recipe.md") continue;
    const conceptId = conceptIdFromPath(file.path);
    try {
      assertSafeConceptId(conceptId);
    } catch {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${id}' contains an unsafe path '${file.path}'` }
      };
    }
    if (!conceptId.startsWith(CONVENTIONS_PREFIX)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${id}' contains a file outside '${CONVENTIONS_PREFIX}': '${file.path}'`
        }
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
      warnings.push({
        code: "KIND_CONVENTION_MALFORMED",
        message: `recipe '${id}': skipped '${doc2.id}' (missing or empty 'governs' field).`,
        field: doc2.id,
        severity: "warning"
      });
      continue;
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
  return { ok: true, recipe: { id, title, version, summary, source, docs, governs: governsList, warnings } };
}
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
function looksLikePath(ref) {
  return ref.includes("/") || ref.startsWith("~");
}
function expandTilde(ref) {
  if (ref === "~") return os.homedir();
  if (ref.startsWith("~/")) return path5.join(os.homedir(), ref.slice(2));
  return ref;
}
function builtinRecipeSource() {
  return {
    kind: "builtin",
    async resolve(ref) {
      if (looksLikePath(ref)) return null;
      const files = BUILTIN_FILES[ref];
      if (!files) return null;
      return parseRecipeFiles(files, `builtin:${ref}`);
    }
  };
}
async function readRecipeDir(root) {
  const files = [];
  const manifestPath = path5.join(root, "recipe.md");
  const manifestStat = await fs3.stat(manifestPath).catch(() => null);
  if (manifestStat?.isFile()) {
    files.push({ path: "recipe.md", bytes: await fs3.readFile(manifestPath, "utf8") });
  }
  const conventionsRoot = path5.join(root, "conventions");
  const conventionsStat = await fs3.stat(conventionsRoot).catch(() => null);
  if (conventionsStat?.isDirectory()) {
    const rootReal = await fs3.realpath(root);
    await walkConventions(conventionsRoot, "conventions", rootReal, files);
  }
  return files;
}
async function walkConventions(dir, relPrefix, rootReal, out) {
  const entries = await fs3.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path5.join(dir, entry.name);
    const rel = `${relPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      await walkConventions(abs, rel, rootReal, out);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    if (!rel.endsWith(".md")) continue;
    const real = await fs3.realpath(abs).catch(() => null);
    if (!real || real !== rootReal && !real.startsWith(rootReal + path5.sep)) {
      throw new RecipeUnsafePathSignal(rel);
    }
    out.push({ path: rel, bytes: await fs3.readFile(abs, "utf8") });
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
      if (!looksLikePath(ref)) return null;
      const expanded = expandTilde(ref);
      const real = await fs3.realpath(path5.resolve(expanded)).catch(() => null);
      if (!real) {
        return { ok: false, error: { code: "RECIPE_NOT_FOUND", message: `no recipe folder at '${ref}'` } };
      }
      const stat = await fs3.stat(real).catch(() => null);
      if (!stat || !stat.isDirectory()) {
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
function resolveBuiltinSync(name) {
  const files = BUILTIN_FILES[name];
  if (!files) throw new Error(`resolveBuiltinSync: no built-in recipe named '${name}'`);
  const result = parseRecipeFiles(files, `builtin:${name}`);
  if (!result.ok) throw new Error(`resolveBuiltinSync: built-in '${name}' failed to parse: ${result.error.message}`);
  return result.recipe;
}
var CONTEXT_NOTES_RECIPE = resolveBuiltinSync("context-notes");

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
  let cur = path6.resolve(dir);
  for (; ; ) {
    if (existsSync2(path6.join(cur, ".git"))) return true;
    const parent = path6.dirname(cur);
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
    receipt.hint = `this directory is inside a git repo \u2014 if the project already shares a board, run \`${cliInvocation()} sync\` instead of init (sync sets up the existing shared board; init creates a new bundle)`;
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
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help`;
var DOC_USAGE = `agentstate-lite doc \u2014 write, patch, read, or delete a generic OKF concept document

Usage:
  agentstate-lite doc write   <id> --type <t> [options]        Create/overwrite a concept doc
  agentstate-lite doc update  <id> [options]                   Patch given fields of an existing doc
  agentstate-lite doc read    <id> [--out (<path> | -)]        Read a doc (or pull its raw bytes)
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
  --strict             If a kind convention governs --type, reject (exit 2) instead of writing with
                       warnings when the doc does not satisfy it (default: warn-and-write, exit 0 \u2014
                       see 'agentstate-lite kinds')
  --actor <name>       Attribute this write: persisted as the doc's own 'actor' frontmatter field
                       (the per-doc attribution sync and its receipts read) and recorded in version
                       history by a persisting backend. Note doc write is a FULL replace: omitting
                       --actor on an overwrite drops any existing actor field (reported in
                       dropped_fields). A present-but-blank value is a USAGE error (exit 2).
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
  --actor <name>         Attribute this write: sets the doc's 'actor' frontmatter field (overwriting
                         a previous actor; omitted = the existing actor is preserved verbatim) and
                         threads to version history (see 'doc history'). Not a patch by itself \u2014
                         pass it alongside the field(s) you are changing. A present-but-blank value
                         is a USAGE error (exit 2).

Passing NO patchable field at all is a USAGE error (exit 2) \u2014 there is nothing to do.
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc update tasks/42 --status done
  agentstate-lite doc update concepts/auth --title "Auth v2" --expected-version sha256:...
`;
var DOC_READ_USAGE = `agentstate-lite doc read \u2014 read a concept document (or pull its raw markdown bytes)

Usage:
  agentstate-lite doc read <id> [--out (<path> | -)] [options]

The default (no --out) render shows EVERY frontmatter field \u2014 the standard keys plus any
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
  --field <name>       Print ONE frontmatter field's raw value to stdout, newline-terminated, no
                       TOON envelope and no other output \u2014 for scripting, e.g. capturing
                       head_version for a follow-up --expected-version write. A scalar prints
                       as-is (no quotes); an array/object prints as compact JSON. id/type/
                       head_version work too (head_version is the store's CAS token, not
                       frontmatter). An absent field, or a missing doc, reports the error to
                       STDERR instead (stdout stays reserved for the raw value); an absent field's
                       error lists the fields that DO exist. Mutually exclusive with --out (both
                       reserve stdout).
${COMMON_OPTIONS}

Examples:
  agentstate-lite doc read concepts/auth
  agentstate-lite doc read concepts/auth --out ./auth.md
  agentstate-lite doc read concepts/auth --field head_version
`;
var DOC_HISTORY_USAGE = `agentstate-lite doc history \u2014 show a doc's attributed version chain (newest first)

Usage:
  agentstate-lite doc history <id> [options]

Lists version + actor + timestamp (and agent, when recorded) per revision, with a count. A
history-keeping backend (a remote deployment) returns the full chain and the real per-write
--actor; on an AUTH'D remote, actor is your authenticated principal (server-set, unforgeable) and
agent is the --actor label you declared under it. A local --dir bundle keeps no history, so it
returns just the single current revision and reports the file's OS owner as the actor (the
filesystem backend keeps no per-write history for --actor; the doc's own 'actor' frontmatter
field \u2014 which every write path persists when --actor is given \u2014 is where per-doc attribution
lives). The newest version is the token to pass to --expected-version for an optimistic doc
update/delete.
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
import { promises as fs4 } from "node:fs";

// src/kind-write.ts
function defaultTimestampAndValidateKind(candidate, registry, opts) {
  const fm = candidate.frontmatter;
  if (typeof fm.timestamp !== "string" || fm.timestamp.trim() === "") {
    fm.timestamp = (/* @__PURE__ */ new Date()).toISOString();
  }
  const kind2 = registry.kinds.get(String(fm.type));
  if (!kind2) return [];
  const warnings = validateAgainstKind(candidate, kind2);
  if (warnings.length > 0 && opts.strict) {
    throw new CliError(
      "USAGE",
      `'${candidate.id}' does not satisfy the '${kind2.governs}' kind: ${warnings.map((w) => w.message).join("; ")}`,
      // In a --strict REJECTION these validation issues CAUSED the failure, so surface them under
      // `violations` — NOT `warnings`, which reads as "advisory, write went through anyway". The
      // ValidationWarning type is deliberately advisory-only (severity "warning"|"info", no "error"),
      // so the rename conveys "these blocked the write" without inventing a severity the type forbids.
      { help: opts.helpOnReject, details: { violations: warnings } }
    );
  }
  return warnings;
}

// src/mutate.ts
var DEFAULT_MAX_ATTEMPTS = 5;
function classify(err, remoteUrl) {
  return classifyBundleError(err, remoteUrl);
}
function valuesEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((v, i) => valuesEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => valuesEqual(a[k], b[k]));
  }
  return false;
}
function isNoopPatch(existing, candidate, compareTimestamp) {
  if (candidate.body !== existing.body) return false;
  if (compareTimestamp) return valuesEqual(existing.frontmatter, candidate.frontmatter);
  const { timestamp: _a, ...restExisting } = existing.frontmatter;
  const { timestamp: _b, ...restCandidate } = candidate.frontmatter;
  return valuesEqual(restExisting, restCandidate);
}
async function mutateDoc(opts) {
  const { bundle, id, mode, registry, strict, helpOnKindReject, buildCandidate, errors } = opts;
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;
  const validate = (candidate) => defaultTimestampAndValidateKind({ id, ...candidate }, registry, { strict, helpOnReject: helpOnKindReject });
  if (mode === "create-only") {
    const candidate = await buildCandidate(void 0);
    const warnings = validate(candidate);
    try {
      const { doc: saved, version } = await writeDocVersioned(bundle, { id, ...candidate }, { expectedVersion: null, actor: opts.actor });
      return { doc: saved, version, warnings };
    } catch (err) {
      if (err instanceof VersionConflict) {
        throw errors.alreadyExists ? errors.alreadyExists() : new CliError("ALREADY_EXISTS", `'${id}' already exists`);
      }
      throw classify(err, opts.remoteUrl);
    }
  }
  if (mode === "overwrite") {
    const candidate = await buildCandidate(void 0);
    const warnings = validate(candidate);
    try {
      const { doc: saved, version } = await writeDocVersioned(bundle, { id, ...candidate }, opts.actor ? { actor: opts.actor } : void 0);
      return { doc: saved, version, warnings };
    } catch (err) {
      throw classify(err, opts.remoteUrl);
    }
  }
  for (let attempt = 0; ; attempt++) {
    let existing;
    let version;
    try {
      const read = await readDocVersioned(bundle, id);
      existing = read.doc;
      version = read.version;
    } catch (err) {
      if (err?.code === "ENOENT") {
        if (onAbsent === "fail") {
          throw errors.notFound ? errors.notFound() : new CliError("NOT_FOUND", `no concept document at id '${id}'`);
        }
        existing = void 0;
        version = null;
      } else {
        throw classify(err, opts.remoteUrl);
      }
    }
    if (opts.expectedVersion !== void 0 && version !== opts.expectedVersion) {
      const conflict = new VersionConflict(id, opts.expectedVersion, version);
      throw errors.staleHead ? errors.staleHead(conflict) : new CliError("STALE_HEAD", conflict.message);
    }
    const candidate = await buildCandidate(existing);
    if (existing && isNoopPatch(existing, candidate, compareTimestamp)) {
      return { doc: existing, changed: false, version, warnings: [] };
    }
    const warnings = validate(candidate);
    const writeVersion = opts.expectedVersion !== void 0 ? opts.expectedVersion : version;
    try {
      const { doc: saved, version: newVersion } = await writeDocVersioned(bundle, { id, ...candidate }, { expectedVersion: writeVersion, actor: opts.actor });
      return { doc: saved, changed: true, version: newVersion, warnings };
    } catch (err) {
      if (err instanceof VersionConflict) {
        if (opts.expectedVersion === void 0 && attempt < maxAttempts - 1) continue;
        throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
      }
      throw classify(err, opts.remoteUrl);
    }
  }
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
  if (values.actor !== void 0 && values.actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value \u2014 pass an actor identity or omit the flag.", {
      help: `${cliInvocation()} doc write ${id} --actor <name>`
    });
  }
  let body;
  let bodySourceGiven;
  if (values.body !== void 0) {
    body = values.body;
    bodySourceGiven = true;
  } else if (values["body-file"]) {
    body = await fs4.readFile(values["body-file"], "utf8");
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
  if (values.actor !== void 0) frontmatter.actor = values.actor.trim();
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
  let existing;
  try {
    existing = await readDoc(bundle, id);
  } catch (err) {
    if (err?.code !== "ENOENT") {
      throw classifyBundleError(err, values.remote);
    }
  }
  if (isConventionPath && existing && existing.frontmatter.type === "Convention") {
    const governs = typeof existing.frontmatter.governs === "string" && existing.frontmatter.governs.trim() ? existing.frontmatter.governs : "(unknown)";
    throw new CliError(
      "USAGE",
      `refusing to overwrite kind convention '${id}' with 'doc write' \u2014 it replaces the whole document and would drop the convention's schema (governs/fields/path), un-declaring the '${governs}' kind. To change its title/body, use 'doc update' (it preserves the schema). To change the schema fields, use '${cliInvocation()} kind field "${governs}" add/remove <name>' (or edit the convention's markdown frontmatter directly).`,
      { help: `${cliInvocation()} doc update ${id} --title <t>` }
    );
  }
  if (!bodySourceGiven && !blankBody && existing && existing.body.trim() !== "") {
    throw new CliError(
      "USAGE",
      `'${id}' already has a non-empty body and no body source was given (--body, --body-file, or piped stdin) \u2014 refusing to silently blank it. Pass a body source, run '${cliInvocation()} doc update ${id}' to patch other fields while preserving the body, or pass --blank-body to blank it deliberately.`,
      {
        help: `${cliInvocation()} doc update ${id}`,
        details: { existing_body_chars: existing.body.length }
      }
    );
  }
  const registry = await loadKinds(bundle);
  const result = await mutateDoc({
    bundle,
    id,
    mode: "overwrite",
    registry,
    remoteUrl: values.remote,
    strict: Boolean(values.strict),
    helpOnKindReject: `${cliInvocation()} kinds`,
    actor: values.actor?.trim(),
    buildCandidate: () => ({ frontmatter, body }),
    errors: {}
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
  const droppedFields = existing ? Object.keys(existing.frontmatter).filter((k) => k !== "timestamp" && !(k in frontmatter)) : [];
  if (droppedFields.length > 0) {
    receipt.dropped_fields = droppedFields;
    receipt.note = `'doc write' is a FULL replace and dropped ${droppedFields.length} frontmatter field(s) not re-supplied: ${droppedFields.join(", ")}. To change fields while preserving the rest (e.g. a status set by 'doc update' or 'new'), use '${cliInvocation()} doc update ${id}' instead.`;
  }
  if (result.warnings.length > 0) receipt.warnings = result.warnings;
  receipt.help = [`${cliInvocation()} doc read ${saved.id}`];
  stdout(render(receipt, resolveMode(values)));
}

// src/commands/doc/update.ts
import { promises as fs5 } from "node:fs";
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
var DOC_UPDATE_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["keep-timestamp", "strict", "json"]);
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
  if (p.actor !== void 0 && p.actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value \u2014 pass an actor identity or omit the flag.", {
      help: `${cliInvocation()} doc update ${id} --actor <name>`
    });
  }
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
    actor: p.actor?.trim(),
    expectedVersion: p.expectedVersion?.trim(),
    buildCandidate: async (existingDoc) => {
      const existing = existingDoc;
      const nextFrontmatter = { ...existing.frontmatter };
      if (p.title !== void 0) nextFrontmatter.title = p.title;
      if (p.description !== void 0) nextFrontmatter.description = p.description;
      if (p.tags && p.tags.length > 0) nextFrontmatter.tags = p.tags;
      if (p.type !== void 0) nextFrontmatter.type = p.type.trim();
      if (p.actor !== void 0) nextFrontmatter.actor = p.actor.trim();
      if (!p.keepTimestamp) nextFrontmatter.timestamp = (/* @__PURE__ */ new Date()).toISOString();
      let nextBody = existing.body;
      if (p.body !== void 0) nextBody = p.body;
      else if (p.bodyFile) nextBody = await fs5.readFile(p.bodyFile, "utf8");
      else if (stdinBody !== void 0) nextBody = stdinBody;
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
  receipt.help = [`${cliInvocation()} doc read ${result.doc.id}`];
  stdout(render(receipt, mode));
}

// src/commands/doc/read.ts
import { parseArgs as parseArgs4 } from "node:util";
import { promises as fs6 } from "node:fs";
import path7 from "node:path";
async function docRead(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d) => void process.stdout.write(d));
  const { values, positionals } = parseOrUsage(
    () => parseArgs4({
      args: argv,
      options: {
        out: { type: "string" },
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
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
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
    for (const key2 of KNOWN_ORDER) {
      if (fm[key2] !== void 0 && fm[key2] !== null) rec[key2] = fm[key2];
    }
    for (const key2 of Object.keys(fm)) {
      if (KNOWN_ORDER.includes(key2) || RESERVED_OUTPUT.has(key2)) continue;
      if (fm[key2] === void 0 || fm[key2] === null) continue;
      rec[key2] = fm[key2];
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
        bytes = await fs6.readFile(path7.join(bundle.root, rel));
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
    await fs6.writeFile(out, bytes);
    stdout(render(result, resolveMode(values)));
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
function resolveField(parsed, version, field, id) {
  if (field === "head_version") return version;
  if (field === "id") return parsed.id;
  const fm = parsed.frontmatter;
  if (fm[field] !== void 0 && fm[field] !== null) return fm[field];
  const available = [
    "id",
    "head_version",
    ...Object.keys(fm).filter((key2) => fm[key2] !== void 0 && fm[key2] !== null)
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
  const resolvedOut = path7.resolve(out);
  const root = bundle.root;
  const isInside = resolvedOut === root || resolvedOut.startsWith(root + path7.sep);
  if (!isInside) return void 0;
  if (isReservedFile(resolvedOut)) {
    return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) at a reserved OKF filename \u2014 the write will CLOBBER that reserved file (index.md/log.md is never re-parsed as a concept doc). Pass a path outside the bundle if that is not intended.`;
  }
  if (!resolvedOut.endsWith(".md")) return void 0;
  return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) \u2014 the exported file will be re-ingested as a new concept doc on the next bundle walk (list/query/view/status). Pass a path outside the bundle if that is not intended.`;
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
import { promises as fs7 } from "node:fs";
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
                            exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                    Emit compact JSON instead of TOON
  -h, --help                Show this help
`;
function isDocRouteKey(key2) {
  return key2.toLowerCase().endsWith(".md");
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
  const key2 = values["doc-key"]?.trim();
  if (!key2) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} promote ${file} --doc-key <key>`
    });
  }
  const docRoute = isDocRouteKey(key2);
  if (docRoute && values["content-type"] !== void 0) {
    throw new CliError(
      "USAGE",
      `--content-type is a blob-route-only option; '${key2}' ends in '.md' and routes through the doc engine, which passes through the file's OWN frontmatter instead (I9)`,
      { help: `${cliInvocation()} promote --help` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const expectedVersion = values["expected-version"] ?? null;
  if (docRoute) {
    await promoteDoc(file, key2, bundle, { expectedVersion, strict: Boolean(values.strict) }, stdout, mode, values.remote);
    return;
  }
  await promoteBlob(file, key2, bundle, { expectedVersion, contentType: values["content-type"] }, stdout, mode, values.remote);
}
async function promoteDoc(file, key2, bundle, opts, stdout, mode, remoteUrl) {
  let raw;
  try {
    raw = await fs7.readFile(file, "utf8");
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
  const canonicalPath = key2.slice(0, -3) + ".md";
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
    throw promoteWriteErrorToCliError(err, key2, file, remoteUrl);
  }
  const receipt = {
    promote: "written",
    route: "doc",
    key: key2,
    id: candidate.id,
    type: candidate.frontmatter.type,
    version,
    size_bytes: Buffer.byteLength(raw, "utf8")
  };
  if (warnings.length > 0) receipt.warnings = warnings;
  receipt.help = [`${cliInvocation()} pull --doc-key ${key2} --out <path>`];
  stdout(render(receipt, mode));
}
async function promoteBlob(file, key2, bundle, opts, stdout, mode, remoteUrl) {
  let bytes;
  try {
    bytes = await fs7.readFile(file);
  } catch (err) {
    throw promoteFileReadError(err, file);
  }
  let version;
  try {
    version = await writeBlob(bundle, key2, bytes, opts.contentType, { expectedVersion: opts.expectedVersion });
  } catch (err) {
    throw promoteWriteErrorToCliError(err, key2, file, remoteUrl);
  }
  const receipt = {
    promote: "written",
    route: "blob",
    key: key2,
    // The SAME resolution `writeBlob` used internally (`resolveContentType`, the ONE MIME source,
    // core's content-type.ts) — no extra round trip to read the blob back just to report it.
    content_type: resolveContentType(key2, opts.contentType),
    version,
    size_bytes: bytes.byteLength
  };
  receipt.help = [`${cliInvocation()} pull --doc-key ${key2} --out <path>`];
  stdout(render(receipt, mode));
}
function promoteFileReadError(err, file) {
  if (err?.code === "ENOENT") {
    return new CliError("USAGE", `no such file: '${file}'`, {
      help: `${cliInvocation()} promote <file> --doc-key <key>`
    });
  }
  return new CliError("USAGE", err instanceof Error ? err.message : String(err));
}
function promoteWriteErrorToCliError(err, key2, file, remoteUrl) {
  if (err instanceof CliError) return err;
  if (err instanceof VersionConflict) {
    const current = err.actual;
    if (err.expected === null) {
      return new CliError(
        "ALREADY_EXISTS",
        `'${key2}' already exists \u2014 promote with no --expected-version means expect-absent CREATE, not an overwrite. Pass --expected-version ${current ?? "<token>"} (from a prior pull/promote receipt) to update it.`,
        {
          help: `${cliInvocation()} promote ${file} --doc-key ${key2} --expected-version ${current ?? "<token>"}`,
          details: { expected: err.expected, actual: err.actual }
        }
      );
    }
    return new CliError(
      "STALE_HEAD",
      `'${key2}' has moved since --expected-version ${err.expected} was read (current: ${current ?? "absent"}) \u2014 re-pull, re-apply your edit, and re-promote with the current version.`,
      {
        help: `${cliInvocation()} pull --doc-key ${key2} --out <path>`,
        details: { expected: err.expected, actual: err.actual }
      }
    );
  }
  return classifyBundleError(err, remoteUrl);
}

// src/commands/pull.ts
import { parseArgs as parseArgs8 } from "node:util";
import { promises as fs8 } from "node:fs";
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
                         exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function isDocRouteKey2(key2) {
  return key2.toLowerCase().endsWith(".md");
}
async function pullDoc(bundle, key2, remoteUrl) {
  const canonicalPath = key2.slice(0, -3) + ".md";
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
async function pullBlob(bundle, key2, remoteUrl) {
  let result;
  try {
    result = await readBlob(bundle, key2);
  } catch (err) {
    throw classifyBundleError(err, remoteUrl);
  }
  if (result === null) {
    throw new CliError("NOT_FOUND", `no blob at key '${key2}'`, {
      help: `${cliInvocation()} promote <file> --doc-key ${key2}`
    });
  }
  const actual = blobVersion(result.bytes);
  if (actual !== result.version) {
    throw new CliError(
      "INTEGRITY_MISMATCH",
      `pulled bytes for '${key2}' hash to ${actual}, but the store reported ${result.version} \u2014 the transfer may have been corrupted; retry the pull`,
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
  const key2 = values["doc-key"]?.trim();
  if (!key2) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} pull --doc-key <key> --out <path>`
    });
  }
  const out = values.out?.trim();
  if (!out) {
    throw new CliError("USAGE", "--out (<path> | -) is required", {
      help: `${cliInvocation()} pull --doc-key ${key2} --out <path>`
    });
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const streamMode = out === "-";
  const docRoute = isDocRouteKey2(key2);
  const runToTarget = async () => {
    const result = docRoute ? await pullDoc(bundle, key2, values.remote) : await pullBlob(bundle, key2, values.remote);
    const receipt = { pull: "read", key: key2, ...result.fields, out };
    const version = result.fields.version;
    const fileHint = streamMode ? "<file>" : out;
    receipt.help = [`${cliInvocation()} promote ${fileHint} --doc-key ${key2} --expected-version ${version}`];
    if (streamMode) {
      writeStdoutBytes(result.bytes);
      stderr(render(receipt, mode));
      return;
    }
    const warning = inBundlePollutionWarning(bundle, out);
    if (warning) receipt.warning = warning;
    await fs8.writeFile(out, result.bytes);
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
                  (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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
                            exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                    Emit compact JSON instead of TOON
  -h, --help                Show this help
`;
function isDocRouteKey3(key2) {
  return key2.toLowerCase().endsWith(".md");
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
  const key2 = values["doc-key"]?.trim();
  if (!key2) {
    throw new CliError("USAGE", "--doc-key <key> is required", {
      help: `${cliInvocation()} delete --doc-key <key>`
    });
  }
  const rawExpected = values["expected-version"];
  if (rawExpected !== void 0 && rawExpected.trim() === "") {
    throw new CliError(
      "USAGE",
      "--expected-version was given an empty value \u2014 pass a real version token (from a prior read/write/pull receipt) or omit the flag for an unconditional delete.",
      { help: `${cliInvocation()} delete --doc-key ${key2} --expected-version <v>` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const expectedVersion = rawExpected?.trim();
  const docRoute = isDocRouteKey3(key2);
  let deleted;
  try {
    if (docRoute) {
      const canonicalPath = key2.slice(0, -3) + ".md";
      const id = conceptIdFromPath(canonicalPath);
      deleted = await deleteDoc(bundle, id, expectedVersion ? { expectedVersion } : void 0);
    } else {
      deleted = await deleteBlob(bundle, key2, expectedVersion ? { expectedVersion } : void 0);
    }
  } catch (err) {
    throw deleteErrorToCliError(err, key2, values.remote);
  }
  const receipt = {
    delete: "deleted",
    route: docRoute ? "doc" : "blob",
    key: key2,
    deleted
  };
  receipt.help = [`${cliInvocation()} list`];
  stdout(render(receipt, mode));
}
function deleteErrorToCliError(err, key2, remoteUrl) {
  if (err instanceof CliError) return err;
  if (err instanceof VersionConflict) {
    return new CliError(
      "STALE_HEAD",
      `'${key2}' has moved since --expected-version ${err.expected} was read (current: ${err.actual ?? "absent"}) \u2014 re-read and retry with the current version.`,
      {
        help: `${cliInvocation()} delete --doc-key ${key2} --expected-version ${err.actual ?? "<token>"}`,
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
var LINK_USAGE = `agentstate-lite link \u2014 add a cross-link or show a concept's links + backlinks

Usage:
  agentstate-lite link add <from> <to> [--text <t>]
  agentstate-lite link show <id> [--limit <n>] [--text <t>]

Idempotent: re-adding a link the source already carries is a no-op \u2014 exit 0, changed:false, no
duplicate link, no timestamp refresh.

Graph lint (link add only): if this bundle declares a kind's 'links' vocabulary (see 'kinds --help')
and --text matches a declared type, the just-written link is checked against the actual source/target
kinds; a mismatch or a same-spelling-different-case near miss attaches a 'warnings' array to the
success envelope (exit 0 \u2014 the link is already written). An untyped --text (no declared match, any
casing) or a conventions-free bundle never warns.

Options:
  --text <t>            (link add) Link display text (default: the target id)
                         (link show) Filter outbound links AND backlinks to those whose text is
                         EXACTLY <t> (case-sensitive, not a substring match); empty/missing value
                         is a usage error. outbound_count/backlink_count report the FILTERED
                         totals when set. A filter that matches nothing is a valid empty result,
                         not an error \u2014 its help line names the distinct link texts that ARE
                         present, so a near-miss (typo/case) is visible.
  --limit <n>          (link show) Cap each of the outbound/backlink lists (default: 50; 0 =
                         unlimited); outbound_count/backlink_count always report the true
                         (post-filter) totals
  --keep-timestamp      Preserve the source's existing timestamp (default: refresh to now,
                         since adding a cross-link is a meaningful change)
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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
  if (sub === "show") return linkShow(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(LINK_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown link subcommand: ${sub} (expected add|show)`, {
    help: `${cliInvocation()} link --help`
  });
}
async function addLink(bundle, from, to, opts = {}) {
  const text = opts.text?.trim() || to;
  const href = relativeHref(from, to);
  const normalizedTo = to.replace(/^\/+/, "").replace(/\.md$/, "");
  if (isReservedFile(pathFromConceptId(normalizedTo))) {
    throw new CliError(
      "USAGE",
      `'${to}' names a reserved OKF file (index.md/log.md), which is never a concept document and cannot be a link target`,
      { help: `${cliInvocation()} list` }
    );
  }
  for (let attempt = 0; ; attempt++) {
    let source;
    let version;
    try {
      ({ doc: source, version } = await readDocVersioned(bundle, from));
    } catch (err) {
      if (err?.code === "ENOENT") {
        throw new CliError("NOT_FOUND", `no source concept at id '${from}'`, {
          help: `${cliInvocation()} list`
        });
      }
      throw classifyBundleError(err, opts.remoteUrl);
    }
    const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo);
    if (already) {
      return { from: source.id, normalizedTo, href, text, changed: false };
    }
    const trimmed = source.body.replace(/\s*$/, "");
    const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})
`;
    const nextFrontmatter = opts.keepTimestamp ? source.frontmatter : { ...source.frontmatter, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    try {
      const saved = await writeDoc(
        bundle,
        { ...source, frontmatter: nextFrontmatter, body: nextBody },
        { expectedVersion: version }
      );
      const warnings = await lintLinkType(bundle, {
        sourceType: docType(source),
        text,
        to: normalizedTo,
        remoteUrl: opts.remoteUrl
      });
      return {
        from: saved.id,
        normalizedTo,
        href,
        text,
        changed: true,
        warnings: warnings.length > 0 ? warnings : void 0
      };
    } catch (err) {
      if (err instanceof VersionConflict && attempt < LINK_ADD_MAX_ATTEMPTS - 1) continue;
      if (err instanceof VersionConflict) {
        throw new CliError("STALE_HEAD", err.message, {
          help: `${cliInvocation()} link add ${from} ${to}`
        });
      }
      throw err;
    }
  }
}
async function linkAdd(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs11({
      args: argv,
      options: {
        text: { type: "string" },
        "keep-timestamp": { type: "boolean" },
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
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
  const result = await addLink(bundle, from, to, {
    text: values.text,
    keepTimestamp: values["keep-timestamp"],
    remoteUrl: values.remote
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
async function linkShow(argv, stdout) {
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
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
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
    if (textsPresent.length > 0) {
      const TEXTS_SHOWN = 8;
      const shown = textsPresent.slice(0, TEXTS_SHOWN).map((t) => `'${t}'`).join(", ");
      const more = textsPresent.length > TEXTS_SHOWN ? ` (+${textsPresent.length - TEXTS_SHOWN} more)` : "";
      help.push(
        `no links matched --text '${textFilter}' in either direction (exact match) \u2014 link texts present here: ${shown}${more}`
      );
    } else if (exists2) {
      help.push(`no links matched --text '${textFilter}' in either direction \u2014 this is a definitive empty result, not an error`);
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
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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
      const key2 = eq >= 0 ? entry.slice(0, eq).trim() : "";
      if (eq < 0 || key2 === "") {
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
            `--field ${key2} has an empty value \u2014 expected --field ${key2}=<value>, or comma-separated set membership --field ${key2}=a,b`,
            { help: `${cliInvocation()} list --field status=done` }
          );
        }
        throw new CliError(
          "USAGE",
          `--field ${key2} has an empty member in '${rawValue}' (comma is the set-membership separator \u2014 use 'a,b', not 'a,,b' or a leading/trailing comma)`,
          { help: `${cliInvocation()} list --field status=todo,in_progress` }
        );
      }
      if (members.length > 1) {
        orFieldSets[key2] = members;
        delete singleFields[key2];
      } else {
        singleFields[key2] = rawValue;
        delete orFieldSets[key2];
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
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
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
    const row = {
      id: d.id,
      type: typeof d.frontmatter.type === "string" ? d.frontmatter.type : "",
      title: typeof d.frontmatter.title === "string" ? d.frontmatter.title : d.id.split("/").pop() ?? d.id,
      timestamp: typeof d.frontmatter.timestamp === "string" ? d.frontmatter.timestamp : ""
    };
    for (const f of extraFields) row[f] = cell(d.frontmatter[f]);
    return row;
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
    const row = {
      id: d.id,
      title: typeof fm.title === "string" ? fm.title : d.id.split("/").pop() ?? d.id
    };
    for (const c of kindCols) row[c] = cell(fm[c]);
    return row;
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
var NEW_USAGE = `agentstate-lite new \u2014 create a new instance of a bundle-declared kind

Usage:
  agentstate-lite new "<Kind>" <id> --<field> <value> [--<field> <value> ...] [options]

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
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --actor <name>         Attribute this write: persisted as the doc's own 'actor' frontmatter field
                         (the per-doc attribution sync and its receipts read) and recorded in version
                         history by a persisting backend. Omitted = no actor field. A present-but-blank
                         value is a USAGE error (exit 2).
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
var NEW_CONTROL_OPTIONS = {
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  link: { type: "string", multiple: true },
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
  const req = kind2.fields.required.filter((f) => f !== "actor" && f !== "link");
  const opt = kind2.fields.optional.filter((f) => f !== "actor" && f !== "link");
  const flags = (fields) => fields.length > 0 ? fields.map((f) => `--${f} <v>`).join("  ") : "(none)";
  const enums = Object.entries(kind2.fields.values ?? {}).map(([f, vals]) => `  --${f} allowed:  ${vals.join(" | ")}`).join("\n");
  const sections = kind2.sections && kind2.sections.length > 0 ? kind2.sections.join(", ") : "(none)";
  const pathLine = kind2.path ? `Id:  auto-prefixed with '${kind2.path.replace(/\/+$/, "")}/' unless <id> already carries it` : "Id:  used as-is (this kind declares no path prefix)";
  const outboundLines = Object.entries(kind2.links ?? {}).map(
    ([t, target]) => `  this kind may link:     "${t}" \u2192 ${target}`
  );
  const inboundLines = inboundLinkDecls(registry, kind2).map(
    ({ source, linkType }) => `  other kinds link here:  ${source.governs} "${linkType}" \u2192 ${kind2.governs}`
  );
  const linksBlock = outboundLines.length + inboundLines.length > 0 ? `Links (typed edges declared by this bundle's conventions; write with --link "<type>=<target-id>" at create time, or link add --text "<type>" after the fact):
` + [...outboundLines, ...inboundLines].join("\n") + "\n" : "";
  return `${inv} new "${kind2.governs}" <id> \u2014 create a ${kind2.governs} instance

Fields (declared by the '${kind2.governs}' kind convention):
  required:  ${flags(req)}
  optional:  ${flags(opt)}
` + (enums ? enums + "\n" : "") + `Body sections scaffolded:  ${sections}
` + linksBlock + `${pathLine}

Repeat a flag to set an array value (e.g. --tag a --tag b). Validation is STRICT.
To ADD a field to this kind, edit its convention doc (${inv} kinds names it; then pull \u2192 edit fields.optional \u2192 promote).

Options:
  --actor <name>   Attribute the write (persisted as the doc's 'actor' frontmatter field)
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
  const { values, positionals } = parseOrUsage(() => {
    try {
      return parseArgs13({
        args: argv,
        allowPositionals: true,
        strict: true,
        options: { ...fieldOptions, ...NEW_CONTROL_OPTIONS }
      });
    } catch (err) {
      if (err?.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
        const raw = /'([^']+)'/.exec(err.message)?.[1] ?? "";
        const field = raw.replace(/^--?/, "");
        if (field === "body" || field === "body-file") {
          throw new CliError(
            "USAGE",
            `'new' does not take --${field} \u2014 a kind's body comes from its declared sections (scaffolded as empty '# Heading' blocks). Create the instance, then set content with '${cliInvocation()} doc update <id> --body <text>'; or use '${cliInvocation()} doc write' for a generic (non-kind) document.`,
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
  const dynamicValues = values;
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
  const actor = values.actor;
  if (actor !== void 0 && actor.trim() === "") {
    throw new CliError("USAGE", "--actor was given an empty value \u2014 pass an actor identity or omit the flag.", {
      help: `${cliInvocation()} new "<Kind>" <id> --actor <name>`
    });
  }
  const linkFlags = values.link ?? [];
  const parsedLinks = linkFlags.map(parseLinkFlagValue);
  const frontmatter = { type: kind2.governs };
  for (const field of fieldNames) {
    const vals = dynamicValues[field];
    if (vals === void 0 || vals.length === 0) continue;
    frontmatter[field] = vals.length === 1 ? vals[0] : vals;
  }
  if (actor !== void 0) frontmatter.actor = actor.trim();
  const body = (kind2.sections ?? []).map((heading) => `# ${heading}
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
    actor: actor?.trim(),
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
    timestamp: saved.frontmatter.timestamp ?? null,
    // The content-addressed version token of the created doc — the CAS basis for a later
    // optimistic `doc update --expected-version` (mirrors `doc write`/`doc history`).
    version: result.version
  };
  if (targetId !== id) {
    receipt.note = `id prefixed with the '${kind2.governs}' kind's path \u2192 '${targetId}' (you passed '${id}')`;
  }
  const linkResults = [];
  const satisfiedOutboundTypes = /* @__PURE__ */ new Set();
  let firstLinkFailure;
  for (const { type, target } of parsedLinks) {
    const warnings = [];
    if (kind2.links && Object.keys(kind2.links).length > 0 && !(type in kind2.links)) {
      warnings.push({
        code: "LINK_TYPE_UNDECLARED_FOR_KIND",
        message: `'${type}' is not declared in the '${kind2.governs}' kind's link vocabulary (declared: ${Object.keys(kind2.links).join(", ")}) \u2014 added anyway.`,
        field: "text",
        severity: "warning"
      });
    }
    try {
      const added = await addLink(bundle, saved.id, target, { text: type, remoteUrl: remote });
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
      const classified = err instanceof CliError ? err : classifyBundleError(err, remote);
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
kind's required/optional fields, allowed enum values, typed-link vocabulary, expected body
sections, and an optional freshness horizon. See 'agentstate-lite new --help' to create an
instance of a declared kind.

Declaring a kind convention (frontmatter keys core reads \u2014 everything else is unread prose):
  governs              string   required \u2014 the 'type' value this convention governs
  title                string   optional \u2014 display title (defaults to governs)
  path                 string   optional \u2014 bundle-relative path prefix for instances
  fields.required      list     field names an instance MUST carry
  fields.optional      list     field names an instance MAY carry
  fields.values        map      field name -> list of allowed values \u2014 the ONLY place an enum
                                 constraint goes; never a top-level enum/enums/values/constraints key
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
  expects_inbound      map      link type name -> expected SOURCE kind, declared on the kind the
                                 expectation is ABOUT (the link TARGET) \u2014 e.g. a 'Task' declaring
                                 {contains: "Roadmap Item"} expects every Task to have an inbound
                                 'contains' edge from a Roadmap Item. Drives the 'status' command's
                                 missing_expected_links lint; 'link add' also warns on a
                                 type-mismatched edge against any declared 'links'/'expects_inbound'
                                 vocabulary. Write-time is never blocked by this key.
  sections             list     expected level-1 '# Heading' body-section names
  freshness_horizon    string   '<n>(m|h|d)', e.g. 24h, 30d, 15m
A misshaped or misplaced key here is a non-fatal registry warning (visible in 'kinds'/'status'
output), never a silent no-op. See 'agentstate-lite doc read conventions/context-note' on any
--init'd bundle for a full worked example with a values: enum and sections:.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
function toRow(kind2) {
  const row = {
    governs: kind2.governs,
    required: kind2.fields.required,
    optional: kind2.fields.optional
  };
  if (Object.keys(kind2.fields.values).length > 0) row.values = kind2.fields.values;
  if (Object.keys(kind2.fields.terminal).length > 0) row.terminal = kind2.fields.terminal;
  if (kind2.links && Object.keys(kind2.links).length > 0) row.links = kind2.links;
  if (kind2.expectsInbound && Object.keys(kind2.expectsInbound).length > 0) row.expects_inbound = kind2.expectsInbound;
  if (kind2.path) row.path = kind2.path;
  if (kind2.sections && kind2.sections.length > 0) row.sections = kind2.sections;
  if (kind2.freshnessHorizon) {
    row.horizon = kind2.freshnessHorizon;
    const ms = freshnessHorizonMs(kind2);
    if (ms !== void 0) row.horizon_ms = ms;
  }
  return row;
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
  const conv = await readDoc(bundle, target.id);
  const fm = conv.frontmatter;
  const fieldsObj = fm.fields && typeof fm.fields === "object" && !Array.isArray(fm.fields) ? { ...fm.fields } : {};
  const required = toStringList(fieldsObj.required);
  const optional = toStringList(fieldsObj.optional);
  const valuesMap = fieldsObj.values && typeof fieldsObj.values === "object" && !Array.isArray(fieldsObj.values) ? { ...fieldsObj.values } : {};
  let changed = false;
  if (action === "add") {
    const targetList = values.required ? required : optional;
    const otherList = values.required ? optional : required;
    const otherIdx = otherList.indexOf(fieldName);
    if (otherIdx >= 0) {
      otherList.splice(otherIdx, 1);
      changed = true;
    }
    if (!targetList.includes(fieldName)) {
      targetList.push(fieldName);
      changed = true;
    }
    if (enumVals) {
      const prev = Array.isArray(valuesMap[fieldName]) ? valuesMap[fieldName].map(String) : void 0;
      if (!prev || prev.join("\0") !== enumVals.join("\0")) {
        valuesMap[fieldName] = enumVals;
        changed = true;
      }
    }
  } else {
    for (const list2 of [required, optional]) {
      const idx = list2.indexOf(fieldName);
      if (idx >= 0) {
        list2.splice(idx, 1);
        changed = true;
      }
    }
    if (fieldName in valuesMap) {
      delete valuesMap[fieldName];
      changed = true;
    }
  }
  if (changed) {
    const newFields = { ...fieldsObj };
    if (required.length > 0) newFields.required = required;
    else delete newFields.required;
    if (optional.length > 0) newFields.optional = optional;
    else delete newFields.optional;
    if (Object.keys(valuesMap).length > 0) newFields.values = valuesMap;
    else delete newFields.values;
    const newFm = { ...fm };
    if (Object.keys(newFields).length > 0) newFm.fields = newFields;
    else delete newFm.fields;
    await writeDoc(bundle, { id: target.id, frontmatter: newFm, body: conv.body }, { actor: values.actor?.trim() });
  }
  const after = changed ? (await loadKinds(bundle)).kinds.get(kindName) : target;
  const receipt = {
    kind: kindName,
    changed,
    action,
    field: fieldName,
    convention: target.id,
    required: after?.fields.required ?? required,
    optional: after?.fields.optional ?? optional
  };
  const resultValues = after?.fields.values ?? {};
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
recipe is a changed:false no-op). This command lists the BUILT-IN recipes shipped with the CLI;
an external recipe (a path) is not enumerated here, only path-addressed via 'recipe add <path>'.
'init' applies the default recipe ('context-notes') automatically unless '--recipe none' is
passed. See 'agentstate-lite kinds' for the LIVE per-bundle registry a recipe's docs feed into.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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

Applies a recipe's convention docs to the bundle. <name-or-path> is a built-in name (e.g.
'context-notes') or a path to a recipe folder (a path is anything containing '/' or starting
with '~' \u2014 a local folder literally named 'foo' is reachable only as './foo'). A recipe folder
is 'recipe.md' (type: Recipe manifest) plus one or more 'conventions/*.md' docs.

Idempotent: a doc the recipe would install that already exists is left untouched (changed:false
for that doc) rather than erroring or overwriting \u2014 re-running 'recipe add' on an already-applied
recipe is a changed:false no-op overall, and never clobbers a bundle author's own hand-edit. See
'agentstate-lite recipes' to list built-ins and which are already applied, and 'agentstate-lite
kinds' for the resulting live per-bundle registry.

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd)
  --remote <url>        Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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

This is a whole-bundle read (one registry load + one query, batched) \u2014 acceptable for an explicitly
batch-analysis command; over --remote it is one whole-bundle fetch, not a per-doc round trip.

Exit is ALWAYS 0 once the analysis runs: findings are reports, not errors. (A --fail-on-findings CI
flag is a recorded future item, not built here.)

Options:
  --limit <n>             Cap each finding category's row list to <n> rows (default: 20; 0 = unlimited)
  --dir <path>            Bundle directory (default: discovered from the cwd)
  --remote <url>          Talk to a wire-protocol server instead of a local bundle
                         (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set)
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
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const malformedRows = [];
  const [registry, docs] = await Promise.all([
    loadKinds(bundle),
    query(bundle, {}, { onSkip: (s) => malformedRows.push({ id: s.id, reason: s.reason }) })
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
    const row = { id: doc2.id };
    const declaresStatus = kind2.fields.required.includes("status") || kind2.fields.optional.includes("status");
    if (declaresStatus) row.status = doc2.frontmatter.status;
    row.missing = missing;
    const sortsFirst = terminalDeclared ? isTerminal(kind2, doc2.frontmatter) : row.status === "done";
    missingExpectedRanked.push({ row, sortsFirst });
  }
  missingExpectedRanked.sort((a, b) => {
    if (a.sortsFirst !== b.sortsFirst) return a.sortsFirst ? 1 : -1;
    return String(a.row.id).localeCompare(String(b.row.id));
  });
  const missingExpectedRows = missingExpectedRanked.map((e) => e.row);
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
  stdout(render(out, resolveMode(values)));
}

// src/commands/view.ts
import { parseArgs as parseArgs19 } from "node:util";

// ../viewer/src/generate.ts
import { promises as fs9 } from "node:fs";
import * as path8 from "node:path";

// ../viewer/src/bundle.ts
function asString(value) {
  return typeof value === "string" ? value : "";
}
function asStringArray(value) {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}
function baseName(root) {
  const parts = root.replace(/[/\\]+$/, "").split(/[/\\]/);
  return parts[parts.length - 1] || "bundle";
}
async function buildBundleData(source, name) {
  const bundle = typeof source === "string" ? { root: source } : source;
  const docs = await query(bundle);
  const nodes = [];
  const bodies = {};
  for (const doc2 of docs) {
    nodes.push({
      id: doc2.id,
      type: asString(doc2.frontmatter.type) || "Untyped",
      title: asString(doc2.frontmatter.title) || doc2.id,
      description: asString(doc2.frontmatter.description),
      resource: asString(doc2.frontmatter.resource),
      tags: asStringArray(doc2.frontmatter.tags),
      size: doc2.body.length
    });
    bodies[doc2.id] = doc2.body;
  }
  const known = new Set(nodes.map((n) => n.id));
  const edges = [];
  const seen = /* @__PURE__ */ new Set();
  for (const doc2 of docs) {
    for (const link2 of parseLinksFromDoc(doc2)) {
      if (!known.has(link2.to) || link2.to === doc2.id) continue;
      const key2 = `${doc2.id} ${link2.to}`;
      if (seen.has(key2)) continue;
      seen.add(key2);
      edges.push({ source: doc2.id, target: link2.to });
    }
  }
  return { name: name ?? baseName(bundle.root), nodes, edges, bodies };
}

// ../viewer/src/assets.ts
var VIZ_CSS = `
:root {
  --bg: #17181c;
  --panel: #202124;
  --edge: #5f6368;
  --text: #e8eaed;
  --muted: #9aa0a6;
  --accent: #8ab4f8;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  background: var(--bg);
  color: var(--text);
  font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #2b2c30;
  flex: 0 0 auto;
}
header .brand { font-weight: 700; letter-spacing: 0.02em; }
header #bundle-name { color: var(--muted); }
main { flex: 1 1 auto; display: flex; min-height: 0; }
#graph { flex: 1 1 60%; min-width: 0; background: radial-gradient(circle at 40% 30%, #1d1f24, var(--bg)); }
#detail {
  flex: 0 0 40%;
  max-width: 560px;
  overflow-y: auto;
  padding: 20px 24px;
  border-left: 1px solid #2b2c30;
  background: var(--panel);
}
#detail h1 { font-size: 20px; margin: 10px 0 2px; }
#detail h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-top: 24px; }
#detail .id { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; margin: 0 0 8px; }
#detail .desc { color: var(--text); }
#detail .chip { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 12px; color: #17181c; font-weight: 600; }
#detail .tags { margin: 8px 0; }
#detail .tag { display: inline-block; background: #2b2c30; color: var(--muted); border-radius: 6px; padding: 1px 7px; margin: 0 6px 6px 0; font-size: 12px; }
#detail .resource a, #detail a { color: var(--accent); }
#detail a.internal { border-bottom: 1px dotted var(--accent); text-decoration: none; }
#detail .body { margin-top: 16px; border-top: 1px solid #2b2c30; padding-top: 12px; }
#detail .body pre { background: #17181c; padding: 10px; border-radius: 6px; overflow-x: auto; }
#detail .body code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
#detail .backlinks ul { margin: 6px 0 0; padding-left: 18px; }
#detail .muted { color: var(--muted); }
`;
var VIZ_JS = `
(function () {
  var DATA = window.__BUNDLE__ || { name: "", nodes: [], edges: [], bodies: {} };
  var PALETTE = ["#4f8ef7", "#f7844f", "#4fce8b", "#c14ff7", "#f7d24f", "#f74f8b", "#4fd6f7", "#9b8cff"];

  var types = [];
  DATA.nodes.forEach(function (n) { if (types.indexOf(n.type) < 0) types.push(n.type); });
  types.sort();
  function colorFor(t) {
    var i = types.indexOf(t);
    return i < 0 ? "#9aa0a6" : PALETTE[i % PALETTE.length];
  }

  var byId = {};
  DATA.nodes.forEach(function (n) { byId[n.id] = n; });

  var backlinks = {};
  DATA.edges.forEach(function (e) {
    if (!backlinks[e.target]) backlinks[e.target] = [];
    backlinks[e.target].push(e.source);
  });

  function escapeHtml(s) {
    return String(s).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).split("'").join("&#39;");
  }

  function resolvePath(sourceId, href) {
    if (href.indexOf("://") >= 0) return null;
    var hashAt = href.indexOf("#");
    if (hashAt >= 0) href = href.slice(0, hashAt);
    if (href.slice(-3) !== ".md") return null;
    href = href.slice(0, -3);
    var parts;
    if (href.charAt(0) === "/") {
      parts = href.slice(1).split("/");
    } else {
      var base = sourceId.split("/");
      base.pop();
      parts = base.concat(href.split("/"));
    }
    var out = [];
    parts.forEach(function (p) {
      if (p === "" || p === ".") return;
      if (p === "..") { out.pop(); return; }
      out.push(p);
    });
    return out.join("/");
  }

  var elements = [];
  DATA.nodes.forEach(function (n) {
    var size = 26 + Math.min(60, Math.round((n.size || 0) / 40));
    elements.push({ data: { id: n.id, label: n.title || n.id, color: colorFor(n.type), size: size } });
  });
  DATA.edges.forEach(function (e, i) {
    elements.push({ data: { id: "edge-" + i, source: e.source, target: e.target } });
  });

  var cy = cytoscape({
    container: document.getElementById("graph"),
    elements: elements,
    style: [
      { selector: "node", style: {
        "background-color": "data(color)",
        "label": "data(label)",
        "width": "data(size)",
        "height": "data(size)",
        "font-size": 10,
        "color": "#e8eaed",
        "text-outline-color": "#17181c",
        "text-outline-width": 2,
        "text-valign": "bottom",
        "text-margin-y": 4
      } },
      { selector: "edge", style: {
        "width": 1.5,
        "line-color": "#5f6368",
        "target-arrow-color": "#5f6368",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "arrow-scale": 0.8
      } },
      { selector: "node.selected", style: { "border-width": 3, "border-color": "#e8eaed" } }
    ],
    layout: { name: "cose", animate: false, padding: 30 }
  });

  function renderDetail(id) {
    var panel = document.getElementById("detail");
    var n = byId[id];
    if (!n) { panel.innerHTML = '<p class="muted">Unknown concept: ' + escapeHtml(id) + "</p>"; return; }
    var h = "";
    h += '<span class="chip" style="background:' + colorFor(n.type) + '">' + escapeHtml(n.type) + "</span>";
    h += "<h1>" + escapeHtml(n.title || id) + "</h1>";
    h += '<p class="id">' + escapeHtml(id) + "</p>";
    if (n.description) h += '<p class="desc">' + escapeHtml(n.description) + "</p>";
    if (n.resource) h += '<p class="resource"><a href="' + escapeAttr(n.resource) + '" target="_blank" rel="noopener">' + escapeHtml(n.resource) + "</a></p>";
    if (n.tags && n.tags.length) {
      h += '<p class="tags">';
      n.tags.forEach(function (t) { h += '<span class="tag">' + escapeHtml(t) + "</span>"; });
      h += "</p>";
    }
    // Bundle bodies are untrusted (a shared viz.html renders someone else's markdown),
    // so marked.js output only ever reaches innerHTML through DOMPurify. If DOMPurify
    // failed to load (e.g. the CDN is blocked), fall back to plain escaped text rather
    // than ever assigning unsanitized HTML \u2014 safe-by-default, not safe-by-CDN-uptime.
    var rawBody = DATA.bodies[id] || "";
    var rendered;
    if (window.marked && window.marked.parse && window.DOMPurify && window.DOMPurify.sanitize) {
      rendered = window.DOMPurify.sanitize(window.marked.parse(rawBody));
    } else {
      rendered = escapeHtml(rawBody);
    }
    h += '<div class="body">' + rendered + "</div>";
    var bl = backlinks[id] || [];
    h += '<div class="backlinks"><h2>Cited by</h2>';
    if (!bl.length) {
      h += '<p class="muted">Nothing links here yet.</p>';
    } else {
      h += "<ul>";
      bl.forEach(function (s) {
        var sn = byId[s];
        h += '<li><a href="#" data-nav="' + escapeAttr(s) + '">' + escapeHtml((sn && sn.title) || s) + "</a></li>";
      });
      h += "</ul>";
    }
    h += "</div>";
    panel.innerHTML = h;

    var links = panel.querySelectorAll(".body a[href]");
    Array.prototype.forEach.call(links, function (a) {
      var target = resolvePath(id, a.getAttribute("href") || "");
      if (target && byId[target]) {
        a.setAttribute("data-nav", target);
        a.className = (a.className ? a.className + " " : "") + "internal";
      } else if ((a.getAttribute("href") || "").indexOf("://") >= 0) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
    });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-nav]"), function (a) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); navigate(a.getAttribute("data-nav")); });
    });
  }

  function navigate(id) {
    cy.nodes().removeClass("selected");
    var node = cy.getElementById(id);
    if (node && node.length) {
      node.addClass("selected");
      cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 1) }, { duration: 250 });
    }
    renderDetail(id);
    location.hash = encodeURIComponent(id);
  }

  cy.on("tap", "node", function (evt) { navigate(evt.target.id()); });

  var nameEl = document.getElementById("bundle-name");
  if (nameEl) nameEl.textContent = DATA.name;

  var initial = decodeURIComponent((location.hash || "").slice(1));
  if (initial && byId[initial]) navigate(initial);
  else if (DATA.nodes.length) renderDetail(DATA.nodes[0].id);
})();
`;

// ../viewer/src/template.ts
var HTML_SKELETON = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>__BUNDLE_NAME__ \xB7 OKF bundle</title>
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"></script>
<style>/*__VIZ_CSS__*/</style>
</head>
<body>
<header><span class="brand">agentstate-lite</span><span id="bundle-name"></span></header>
<main>
<div id="graph"></div>
<aside id="detail"></aside>
</main>
<script>window.__BUNDLE__ = /*__BUNDLE_DATA__*/;</script>
<script>/*__VIZ_JS__*/</script>
</body>
</html>
`;
function escapeHtmlText(s) {
  return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
function embedJson(data) {
  return JSON.stringify(data).split("</").join("<\\/");
}
function renderTemplate(data) {
  return HTML_SKELETON.split("__BUNDLE_NAME__").join(escapeHtmlText(data.name)).split("/*__VIZ_CSS__*/").join(VIZ_CSS).split("/*__BUNDLE_DATA__*/").join(embedJson(data)).split("/*__VIZ_JS__*/").join(VIZ_JS);
}

// ../viewer/src/generate.ts
async function generateVisualization(bundleSource, options2 = {}) {
  let data;
  let defaultOutDir;
  if (typeof bundleSource === "string") {
    const root = path8.resolve(bundleSource);
    const stat = await fs9.stat(root).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      throw new Error("bundle directory not found: " + root);
    }
    data = await buildBundleData(root, options2.name);
    defaultOutDir = root;
  } else {
    data = await buildBundleData(bundleSource, options2.name);
    defaultOutDir = process.cwd();
  }
  const html = renderTemplate(data);
  const out = path8.resolve(options2.out ?? path8.join(defaultOutDir, "viz.html"));
  await fs9.mkdir(path8.dirname(out), { recursive: true });
  const tmp = out + ".tmp-" + process.pid;
  await fs9.writeFile(tmp, html, "utf8");
  await fs9.rename(tmp, out);
  return { out, nodeCount: data.nodes.length, edgeCount: data.edges.length };
}

// src/commands/view.ts
var VIEW_USAGE = `agentstate-lite view \u2014 bake the bundle into one self-contained static HTML file

Usage:
  agentstate-lite view [--dir <path>] [--out <path>] [--name <label>]

Options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; falls back to AGENTSTATE_LITE_REMOTE if set).
                       --out then defaults to ./viz.html in the current directory \u2014 viz.html is
                       always written LOCALLY.
  --out <path>         Output HTML path (default: <root>/viz.html, or ./viz.html for --remote)
  --name <label>       Display label shown in the viewer header
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;
async function view(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs19({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        out: { type: "string" },
        name: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "view"
  );
  if (values.help) {
    stdout(VIEW_USAGE);
    return;
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const options2 = {};
  if (values.out?.trim()) options2.out = values.out.trim();
  if (values.name?.trim()) options2.name = values.name.trim();
  const result = await generateVisualization(bundle.backend ? bundle : bundle.root, options2);
  stdout(
    render(
      {
        view: "ok",
        out: result.out,
        nodes: result.nodeCount,
        edges: result.edgeCount,
        // The bundle DATA is inlined (self-contained, nothing leaves the page), but the render
        // libraries (Cytoscape/marked/DOMPurify) load from a CDN — so an OFFLINE recipient sees a
        // blank shell. State it here rather than let a shared file surprise them (comprehensive UX
        // audit finding); inlining the libs for true offline use is a deliberate, ~460 KB-per-file
        // tradeoff, not the default.
        note: "viz.html inlines the bundle data but loads its render libraries (Cytoscape/marked/DOMPurify) from a CDN \u2014 it needs network access to draw the graph and render markdown. Share it with recipients who are online.",
        help: [`open ${result.out}`]
      },
      resolveMode(values)
    )
  );
}

// src/commands/serve.ts
import { parseArgs as parseArgs20 } from "node:util";

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
  async function handleReadBlob(key2) {
    assertSafeBlobKey(key2);
    const result = await backend.readBlob(key2);
    if (result === null) return errorResponse(404, "NOT_FOUND", `no blob '${key2}'`);
    return new Response(result.bytes, {
      status: 200,
      headers: { "content-type": result.contentType, ...versionHeaders(result.version) }
    });
  }
  async function handleHeadBlob(key2) {
    try {
      assertSafeBlobKey(key2);
    } catch {
      return new Response(null, { status: 400 });
    }
    const result = await backend.readBlob(key2);
    if (result === null) return new Response(null, { status: 404 });
    return new Response(null, {
      status: 200,
      headers: { "content-type": result.contentType, ...versionHeaders(result.version) }
    });
  }
  async function handleWriteBlob(key2, req) {
    assertSafeBlobKey(key2);
    const bytes = new Uint8Array(await req.arrayBuffer());
    const contentTypeHeader = req.headers.get("content-type");
    const contentType = contentTypeHeader && contentTypeHeader.trim() !== "" ? contentTypeHeader : void 0;
    const options2 = writeOptionsFromHeaders(req);
    const version = await backend.writeBlob(key2, bytes, contentType, options2);
    const status2 = options2.expectedVersion === null ? 201 : 200;
    return jsonResponse(status2, { version }, versionHeaders(version));
  }
  async function handleDeleteBlob(key2, req) {
    assertSafeBlobKey(key2);
    const options2 = deleteOptionsFromHeaders(req);
    const deleted = await backend.deleteBlob(key2, options2);
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
      // `history` and `enforced_cas` have always been the SAME boolean on every adapter this
      // router has ever served (a backend either keeps real history + enforces CAS, or does
      // neither) — the seam's `capabilities()` shape deliberately doesn't grow a second field
      // for a distinction no adapter has ever needed; this preserves the wire's existing
      // `history` field from that one value rather than inventing a new one.
      history: caps.enforced_cas,
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
        const key2 = decodeBlobKey(rest.slice("blobs/".length));
        if (req.method === "GET") return await handleReadBlob(key2);
        if (req.method === "PUT") return await handleWriteBlob(key2, req);
        if (req.method === "HEAD") return await handleHeadBlob(key2);
        if (req.method === "DELETE") return await handleDeleteBlob(key2, req);
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
  return new Promise((resolve3, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve3(chunks.length > 0 ? Buffer.concat(chunks) : void 0));
    req.on("error", reject);
  });
}
async function requestFromIncomingMessage(req, origin) {
  const url = new URL(req.url ?? "/", origin);
  const headers = new Headers();
  for (const [key2, value] of Object.entries(req.headers)) {
    if (value === void 0) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key2, v);
    } else {
      headers.set(key2, value);
    }
  }
  const body = await readBody(req);
  return new Request(url, { method: req.method ?? "GET", headers, body });
}
async function writeResponseToServerResponse(res, response) {
  const headers = {};
  response.headers.forEach((value, key2) => {
    headers[key2] = value;
  });
  res.writeHead(response.status, headers);
  const bytes = response.body ? Buffer.from(await response.arrayBuffer()) : void 0;
  res.end(bytes);
}
function serve(options2) {
  const router = createRouter(options2.bundle);
  const host = options2.host ?? "127.0.0.1";
  return new Promise((resolve3, reject) => {
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
      resolve3({
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

Caveat: concurrent writes to the SAME doc from multiple clients hitting THIS server converge
losslessly (FilesystemBackend serializes same-process writes per doc); a SECOND server (or a
direct local CLI write) over the SAME directory is still best-effort \u2014 see STATUS.md.
`;
var DEFAULT_SERVE_PORT = 4818;
function defaultWaitForShutdown() {
  return new Promise((resolve3) => {
    process.once("SIGINT", () => resolve3());
    process.once("SIGTERM", () => resolve3());
  });
}
async function serve2(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const bootServer = deps.bootServer ?? serve;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown;
  const { values } = parseOrUsage(
    () => parseArgs20({
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
        concurrency: "lossless for concurrent writers hitting THIS server (same-process, per-doc serialized); still best-effort across a SECOND serve process or a direct local write to the same directory (see STATUS.md)",
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
import { parseArgs as parseArgs21 } from "node:util";
import { spawn as spawn2 } from "node:child_process";

// src/ui/server.ts
import { createServer as createServer2 } from "node:http";

// src/ui/host.ts
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

// src/ui/session.ts
import { randomBytes as randomBytes2, timingSafeEqual } from "node:crypto";
var SESSION_COOKIE_NAME = "aslite_ui_session";
function mintSessionSecret() {
  return randomBytes2(32).toString("base64url");
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

// src/ui/assets.ts
import { gunzipSync } from "node:zlib";

// src/generated/ui-assets.generated.ts
var UI_ASSETS = {
  "/assets/index-Co-oqpSn.css": { contentType: "text/css; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/5VTQZKjMAy87ytctdeYhWQyM2uO84X9gMECXDEWJYsJWSp/3zJkCFBz2RPYllqtbkkRIo8lOiQZygZaUM7WDQuj6XIv0NzGVlNtvUrzCj2r7NwNv7LkLHorg/ZBBiBbHcItMLSyt4fn5T3RXScb0AZo7LQx1tcqeTsTtCJLjvGbF0gGSBbIjK3KukEEdNaID+0/dfgDA69RRJONkYUM9i+oLMkixBe/e1KgJrNUio+PO1mi61sfRmND5/RNVQ6GvNbdFJRrZ2svLUMbphcZWBPn+AlUObzKQemecYs1xkCVilRkrxML6+XVGm7UdN4Gi+a44p38nlpnGFgyaR8qpFb1XQdU6gC5A2YgGTpdToqlR2hzjCe+Rf122EmJvedxCXidjJJXiD6qlzRd4jWZnQRTt8YSlGzRqxlxEiY5r7uIus5WfevRl42kje2DSl5if4vjUQ8x+74GFM1pmS2RisdA7GVaZ0hrNhlTwr7vOfd9wap0a91N9Va26DGKCoflb8PH6QLcok/hsLzsIZ/S+8rZkh90JONDsWfXq/FeaVb2ROD5Iy7cXrXTqkBgzX34dpbnJwlESPPmqp9FmqbH9J4QOIx8QkkAfmz18BjK03G1KtEeEUd6YZuKucI2X3QEY6HLS03Ye6Nmw/P/GITTRpK32bDdWv34Bz6VXwOEBAAA" },
  "/assets/index-Cv6K3vrL.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/2WQwU7EMAxE7/0K4zPdCCEhDkkve4QbXxASb2tIkxJ7s/TvUbfLAXGyPGM9j8bexRJ0XQgmndPQ2W1A8nl0SBk3gXwcOjuTegiTr0Lq8Kyn/hnB/BrZz+SwMV2WUhUhlKyU1eGFo04uUuNA/XW5B86s7FMvwSdyDztGWRMNfqSsol6pT6xkzS53AFZC5UVhy+pwLvGcCCHUIlIqj5xBanBovAipGM6Rvvtje3p5bPX18CE4WLMjrrTE+RMqJYeiayKZiPQvbqp0+scrffla3vIhiGzdmFs57yWuQ2cjN+DosJai27/IbTu6uWZv+AeZZTOtcgEAAA==" }
};

// src/ui/assets.ts
var CSP_HEADER = "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";
function acceptsGzip(acceptEncoding) {
  return !!acceptEncoding && acceptEncoding.split(",").some((part) => part.trim().split(";")[0] === "gzip");
}
function serveAsset(pathname, acceptEncoding) {
  const asset = UI_ASSETS[pathname] ?? UI_ASSETS["/index.html"];
  if (!asset) {
    return { status: 500, headers: { "content-type": "text/plain; charset=utf-8" }, body: new TextEncoder().encode("no ui assets embedded") };
  }
  const gzipBytes = Buffer.from(asset.gzipBase64, "base64");
  const headers = {
    "content-type": asset.contentType,
    "content-security-policy": CSP_HEADER,
    "x-content-type-options": "nosniff"
  };
  if (acceptsGzip(acceptEncoding)) {
    headers["content-encoding"] = "gzip";
    return { status: 200, headers, body: gzipBytes };
  }
  return { status: 200, headers, body: gunzipSync(gzipBytes) };
}

// src/ui/proxy.ts
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
  for (const [key2, value] of from) {
    const lower = key2.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (opts.dropCookie && lower === "cookie") continue;
    if (opts.dropContentCoding && RESPONSE_DROP.has(lower)) continue;
    out.set(key2, value);
  }
  return out;
}
function freshErrorResponse(status2, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
async function proxyToRemote(request, remoteBase, apiKey) {
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
    upstream = await fetch(new Request(target, { method, headers, body: bodyBytes }));
  } catch (err) {
    return freshErrorResponse(502, "RUNTIME", `could not reach remote ${remoteBase} (${err instanceof Error ? err.message : String(err)})`);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: copyHeaders(upstream.headers, { dropContentCoding: true })
  });
}

// src/ui/server.ts
var HOST = "127.0.0.1";
function jsonError(status2, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
async function handleRequest(req, res, options2, sessionSecret) {
  if (!isAllowedHost(req.headers.host)) {
    await writeResponseToServerResponse(res, jsonError(403, "FORBIDDEN", "Host header is not in the loopback allowlist"));
    return;
  }
  const origin = `http://${req.headers.host}`;
  const request = await requestFromIncomingMessage(req, origin);
  const url = new URL(request.url);
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
  let response;
  if (url.pathname === "/__ui/config") {
    response = new Response(
      JSON.stringify({ mode: options2.mode, remoteUrl: options2.mode === "remote" ? options2.remoteBase ?? null : null }),
      { status: 200, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  } else if (url.pathname.startsWith("/v0/")) {
    response = options2.mode === "dir" ? await options2.router(request) : await proxyToRemote(request, options2.remoteBase, options2.apiKey);
  } else {
    const asset = serveAsset(url.pathname, request.headers.get("accept-encoding"));
    response = new Response(asset.body, { status: asset.status, headers: asset.headers });
  }
  if (auth.grantsCookie) response.headers.append("set-cookie", sessionCookieHeader(sessionSecret));
  await writeResponseToServerResponse(res, response);
}
function bootUiServer(options2) {
  const sessionSecret = options2.sessionSecret ?? mintSessionSecret();
  return new Promise((resolve3, reject) => {
    const server = createServer2((req, res) => {
      void handleRequest(req, res, options2, sessionSecret).catch((err) => {
        res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
      });
    });
    server.once("error", reject);
    server.listen(options2.port ?? 0, HOST, () => {
      const addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject(new Error("failed to bind a TCP address"));
        return;
      }
      resolve3({
        host: HOST,
        port: addr.port,
        token: sessionSecret,
        close: () => new Promise((resolveClose, rejectClose) => server.close((err) => err ? rejectClose(err) : resolveClose()))
      });
    });
  });
}

// src/commands/ui.ts
var UI_USAGE = `agentstate-lite ui \u2014 boot the local web UI (board \xB7 doc detail \xB7 admin \xB7 graph)

Usage:
  agentstate-lite ui [--dir <path> | --remote <url>] [--port <n>] [--open]

Options:
  --dir <path>          Bundle directory (default: discovered from the cwd) \u2014 mounts the
                         reference router in-process
  --remote <url>         Reverse-proxy /v0/* to a deployed remote instead (also honors
                         AGENTSTATE_LITE_REMOTE when neither flag is given and --dir is not)
  --port <p>            Port to bind (default: 0 \u2014 an OS-assigned ephemeral port)
  --open                Open the printed URL in a browser once the server is listening
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help

No --host flag in v1 \u2014 always binds 127.0.0.1 (loopback-only; a network-exposed key proxy is a
separate, unreviewed feature). The printed URL carries a per-run session token; the first load
exchanges it for an HttpOnly, SameSite=Strict cookie \u2014 nothing is persisted beyond this process.
`;
function defaultWaitForShutdown2() {
  return new Promise((resolve3) => {
    process.once("SIGINT", () => resolve3());
    process.once("SIGTERM", () => resolve3());
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
  const bootUiServer2 = deps.bootUiServer ?? bootUiServer;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown2;
  const openBrowser = deps.openBrowser ?? defaultOpenBrowser;
  const { values } = parseOrUsage(
    () => parseArgs21({
      args: argv,
      options: {
        dir: { type: "string" },
        remote: { type: "string" },
        port: { type: "string" },
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
    options2 = { mode: "remote", port, remoteBase: base, apiKey };
    rootLabel = base;
  } else {
    const bundle = await openBundle(values.dir);
    const router = createRouter(bundle);
    options2 = { mode: "dir", port, router };
    rootLabel = bundle.root;
  }
  let handle;
  try {
    handle = await bootUiServer2(options2);
  } catch (err) {
    throw mapBootError2(err, port);
  }
  const url = `http://${handle.host}:${handle.port}/?token=${handle.token}`;
  stdout(
    render(
      {
        ui: "listening",
        url,
        mode: options2.mode,
        root: rootLabel,
        auth: "per-run session token embedded in the URL above; the first load exchanges it for an HttpOnly, SameSite=Strict cookie \u2014 nothing is persisted beyond this process",
        help: [`open ${url} in a browser`]
      },
      resolveMode(values)
    )
  );
  if (values.open) openBrowser(url);
  await waitForShutdown();
  await handle.close();
}

// src/commands/sync.ts
import { existsSync as existsSync4, readFileSync as readFileSync3, realpathSync as realpathSync4, statSync as statSync2 } from "node:fs";
import { promises as fs10 } from "node:fs";
import path10 from "node:path";
import { parseArgs as parseArgs22 } from "node:util";

// src/git.ts
import { spawnSync } from "node:child_process";
import {
  existsSync as existsSync3,
  mkdirSync,
  readdirSync,
  readFileSync as readFileSync2,
  realpathSync as realpathSync3,
  rmdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import path9 from "node:path";
var BOARD_BRANCH = "board";
var BOARD_REMOTE = "origin";
var BOARD_REF = `${BOARD_REMOTE}/${BOARD_BRANCH}`;
var BUNDLE_DIR = ".agentstate-lite";
var RELATIVE_WORKTREE_CONFIG = ["-c", "worktree.useRelativePaths=true"];
var SCRUBBED_GIT_VARS = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"];
var LOCAL_TIMEOUT_MS = 3e4;
var NETWORK_TIMEOUT_MS = 6e4;
function gitEnv(rebase, connectTimeoutSeconds = 10) {
  const env = { ...process.env };
  for (const v of SCRUBBED_GIT_VARS) delete env[v];
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
  const r = spawnSync("git", ["-C", dir, "-c", "core.quotepath=off", ...args], {
    env: gitEnv(opts.rebase ?? false, opts.connectTimeoutSeconds),
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
function repoTopLevel(dir) {
  if (!existsSync3(dir)) return null;
  const r = runGit(dir, ["rev-parse", "--show-toplevel"]);
  if (r.status !== 0) return null;
  const top = r.stdout.trim();
  return top.length > 0 ? top : null;
}
function worktreeGitPath(boardPath, relative) {
  const raw = mustGit(boardPath, ["rev-parse", "--git-path", relative]).trim();
  return path9.resolve(boardPath, raw);
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
  return realOrSame(path9.isAbsolute(raw) ? raw : path9.resolve(dir, raw));
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
    const headNamePath = path9.join(worktreeGitPath(boardPath, state), "head-name");
    if (!existsSync3(headNamePath)) continue;
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
  const boardPath = path9.join(top, BUNDLE_DIR);
  if (!existsSync3(boardPath) || !worktreeRootResolvesForOwner(boardPath, top)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}
function hasWorktreeSignature(dir) {
  const gitPath = path9.join(dir, ".git");
  if (!existsSync3(gitPath)) return false;
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
function provisionBoardWorktree(dir, budget = {}) {
  const top = repoTopLevel(dir);
  if (!top) return { kind: "no_repo" };
  const boardPath = path9.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };
  runGit(top, ["fetch", BOARD_REMOTE], {
    timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
    connectTimeoutSeconds: budget.connectTimeoutSeconds
  });
  const hasLocal = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
  const hasRemote = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  if (!hasLocal && !hasRemote) return { kind: "no_board" };
  if (existsSync3(boardPath)) {
    if (readdirSync(boardPath).length > 0) {
      if (hasRemote && !hasWorktreeSignature(boardPath) && runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0) {
        throw new CliError(
          "RUNTIME",
          `the '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE}, but '${BUNDLE_DIR}' here is still the pre-migration folder committed on this branch \u2014 the migration PR hasn't merged yet, or this clone hasn't pulled it: once it lands, run 'git pull', then run sync again`,
          {
            details: { path: boardPath, state: "pre-migration-window" },
            help: "git pull  # after the migration PR merges, then re-run sync"
          }
        );
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
      throw new CliError("RUNTIME", messages[reason].message, {
        details: { path: boardPath },
        help: messages[reason].help
      });
    }
    rmdirSync(boardPath);
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
  return { kind: "provisioned", boardPath };
}
function detectStaleRebase(boardPath) {
  return existsSync3(worktreeGitPath(boardPath, "rebase-merge")) || existsSync3(worktreeGitPath(boardPath, "rebase-apply"));
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
  return out.split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0).map((l) => {
    const [letter = "", ...rest] = l.split("	");
    return { letter: letter.trim().charAt(0), relPath: rest.join("	") };
  }).filter((r) => r.letter.length > 0 && r.relPath.length > 0);
}
function verbOf(letter) {
  if (letter === "A") return "added";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}
function enrichDocChange(boardPath, relPath, verb, rev) {
  const docId = conceptIdFromPath(relPath);
  let actor = UNKNOWN;
  let kind2 = UNKNOWN;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`]);
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
function commitSubject(docs) {
  if (docs.length === 0) return "board: bundle maintenance";
  const first = docs[0];
  if (docs.length === 1) return `board: ${first.actor} \u2014 ${first.verb} ${first.docId}`;
  const actors = [...new Set(docs.map((d) => d.actor))];
  if (actors.length === 1) return `board: ${actors[0]} \u2014 ${docs.length} docs`;
  return `board: ${docs.length} docs from ${actors.length} actors`;
}
function stageAndCommit(boardPath) {
  mustGit(boardPath, ["add", "-A"]);
  if (runGit(boardPath, ["diff", "--cached", "--quiet"]).status === 0) {
    return { committed: false, docs: [] };
  }
  const rows = nameStatusRows(mustGit(boardPath, ["diff", "--cached", "--name-status", "--no-renames"]));
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
  mustGit(boardPath, ["commit", "--no-verify", "-F", "-"], { input: message });
  const sha = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
  return { committed: true, sha, subject, docs };
}
var MAX_REBASE_STOPS = 1e3;
function fetchRebaseResolving(boardPath, exportDir) {
  mustGit(boardPath, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
  const r = runGit(boardPath, ["rebase", BOARD_REF], { rebase: true, timeoutMs: NETWORK_TIMEOUT_MS });
  if (r.status === 0) return { status: "clean" };
  if (!detectStaleRebase(boardPath)) throw classifyGitError(failureOf(["rebase", BOARD_REF], r));
  const listConflicted = () => mustGit(boardPath, ["diff", "--name-only", "-z", "--diff-filter=U"]).split("\0").filter((l) => l.length > 0);
  const byPath = /* @__PURE__ */ new Map();
  try {
    let stops = 0;
    while (detectStaleRebase(boardPath)) {
      if (++stops > MAX_REBASE_STOPS) {
        throw new CliError(
          "RUNTIME",
          `sync's converging rebase did not terminate after ${MAX_REBASE_STOPS} stops \u2014 aborting to leave the board unchanged`
        );
      }
      const conflicted = listConflicted();
      if (conflicted.length === 0) {
        runGit(boardPath, ["rebase", "--skip"], { rebase: true });
        continue;
      }
      for (const relPath of conflicted) {
        const local = runGitBytes(boardPath, ["show", `:3:${relPath}`]);
        let exportPath = null;
        let bodyExportPath = null;
        const isDoc = isConceptDocPath(relPath);
        if (local.status === 0) {
          exportPath = path9.join(exportDir, relPath);
          mkdirSync(path9.dirname(exportPath), { recursive: true, mode: 448 });
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
      const cont = runGit(boardPath, ["rebase", "--continue"], { rebase: true });
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
function fetchOrigin(top) {
  return runGit(top, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS }).status === 0;
}
function remoteBoardNamespaceBranches(top) {
  const r = runGit(top, ["ls-remote", "--heads", BOARD_REMOTE, `${BOARD_BRANCH}/*`], {
    timeoutMs: NETWORK_TIMEOUT_MS
  });
  if (r.status !== 0) throw classifyGitError(failureOf(["ls-remote"], r));
  return r.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).map((l) => l.split("	")[1] ?? "").filter((ref) => ref.startsWith("refs/heads/")).map((ref) => ref.slice("refs/heads/".length));
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
    const fetched = runGit(boardPath, ["fetch", BOARD_REMOTE], {
      timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
      connectTimeoutSeconds: budget.connectTimeoutSeconds
    });
    if (fetched.status !== 0) {
      fetchReason = swallowReason(classifyGitError(failureOf(["fetch"], fetched)));
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
    if (err instanceof CliError) return { updated: false, swallowed: swallowReason(err) };
    return { updated: false, swallowed: "runtime" };
  }
}
function changesSince(boardPath, token) {
  if (runGit(boardPath, ["cat-file", "-e", `${token}^{commit}`]).status !== 0) {
    return { ok: false, reason: "dangling" };
  }
  const rows = nameStatusRows(
    mustGit(boardPath, ["diff", "--name-status", "--no-renames", `${token}..HEAD`])
  );
  const changes = [];
  for (const { letter, relPath } of rows) {
    if (!isConceptDocPath(relPath)) continue;
    const verb = verbOf(letter);
    if (!verb) continue;
    changes.push(enrichDocChange(boardPath, relPath, verb, verb === "deleted" ? token : "HEAD"));
  }
  return { ok: true, changes };
}
function unpushedCount(boardPath) {
  if (runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
    return null;
  }
  const out = mustGit(boardPath, ["rev-list", "--count", `${BOARD_REF}..HEAD`]).trim();
  const n = Number.parseInt(out, 10);
  return Number.isFinite(n) ? n : 0;
}

// src/cursor.ts
import { chmod as chmod2, mkdir as mkdir2, readFile as readFile2 } from "node:fs/promises";
import { createHash as createHash2 } from "node:crypto";
import { homedir as homedir4 } from "node:os";
import { basename as basename3, join as join5, resolve as resolve2 } from "node:path";
var SYNC_STATE_DIR_NAME = "sync";
var DIR_MODE2 = 448;
var REANCHOR_NOTE = "delta unavailable (history rewritten)";
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
${resolve2(src.checkoutRoot)}`;
  }
  return `path
${resolve2(src.root)}`;
}
function syncStateDir(home2 = homedir4()) {
  return join5(credentialsDir(home2), SYNC_STATE_DIR_NAME);
}
function keyDigest(key2) {
  return createHash2("sha256").update(key2, "utf8").digest("hex").slice(0, 32);
}
function syncStatePath(key2, home2 = homedir4()) {
  return join5(syncStateDir(home2), `${keyDigest(key2)}.json`);
}
function syncExportsDir(key2, home2 = homedir4()) {
  return join5(syncStateDir(home2), "exports", keyDigest(key2));
}
var SELF_ACTORS_CAP = 64;
var EMPTY_STATE = { cursor: null, cache: null, marker: null, selfActors: null };
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
    const row = asDeltaRow(raw);
    if (row === null) return null;
    delta.push(row);
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
async function readSyncState(key2, home2 = homedir4()) {
  let raw;
  try {
    raw = await readFile2(syncStatePath(key2, home2), "utf8");
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
  if (parsed.key !== key2) return { ...EMPTY_STATE };
  return {
    cursor: asCursor(parsed.cursor),
    cache: asCache(parsed.cache),
    marker: asMarker(parsed.marker),
    selfActors: asSelfActors(parsed.selfActors)
  };
}
async function readCursor(key2, home2 = homedir4()) {
  return (await readSyncState(key2, home2)).cursor;
}
async function writeSyncState(key2, patch, home2 = homedir4()) {
  const next = { ...await readSyncState(key2, home2), ...patch };
  const parent = credentialsDir(home2);
  await mkdir2(parent, { recursive: true, mode: DIR_MODE2 });
  await chmod2(parent, DIR_MODE2);
  const path12 = syncStatePath(key2, home2);
  const record = {
    key: key2,
    cursor: next.cursor ?? void 0,
    cache: next.cache ?? void 0,
    marker: next.marker ?? void 0,
    selfActors: next.selfActors ?? void 0
  };
  await writeFileAtomic0600(syncStateDir(home2), basename3(path12), JSON.stringify(record, null, 2) + "\n");
  return next;
}
async function writeCursor(key2, cursor, home2 = homedir4()) {
  if (asCursor(cursor) === null) {
    throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
  }
  await writeSyncState(key2, { cursor }, home2);
}
async function writeCache(key2, cache, home2 = homedir4()) {
  if (asCache(cache) === null) {
    throw new TypeError(
      "cache must carry { updatedAt: ISO timestamp, delta: AwarenessDeltaRow[], unpushedCount, uncommittedCount }"
    );
  }
  await writeSyncState(key2, { cache }, home2);
}
async function refreshMarker(key2, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  const current = (await readSyncState(key2, home2)).marker;
  const marker = { ...current ?? {}, updatedAt: now().toISOString() };
  await writeSyncState(key2, { marker }, home2);
  return marker;
}
async function recordSelfActors(key2, actors, home2 = homedir4()) {
  const current = (await readSyncState(key2, home2)).selfActors ?? [];
  const merged = [...current];
  for (const a of actors) {
    if (typeof a !== "string" || a.length === 0 || a === "unknown") continue;
    if (!merged.includes(a)) merged.push(a);
  }
  const capped = merged.slice(-SELF_ACTORS_CAP);
  if (capped.length === current.length && capped.every((a, i) => a === current[i])) {
    return current;
  }
  await writeSyncState(key2, { selfActors: capped }, home2);
  return capped;
}
async function recordReanchor(key2, cursor, counts, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
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
  await writeSyncState(key2, { cursor, cache }, home2);
  return cache;
}

// src/commands/sync-migrate.ts
var MIGRATION_BRANCH = "board-migration";
var GITIGNORE_ENTRY = `${BUNDLE_DIR}/`;
var MIGRATE_PREVIEW = "preview \u2014 nothing has been changed; re-run with --yes to execute";
var MIGRATE_ALREADY = "already migrated \u2014 a board branch already exists on origin";
var MIGRATE_DONE = "the board branch is live on origin \u2014 push the migration branch and open its PR to finish";
function bothWorldsLine(branch) {
  return `until the migration PR merges, this project is in a BOTH-WORLDS state: the shared board lives on the '${BOARD_BRANCH}' branch (live on ${BOARD_REMOTE}), while '${branch}' still carries the old committed folder. That folder is now a FROZEN SNAPSHOT that receives no further updates: treat it as read-only, don't write docs into it, and never merge '${BOARD_BRANCH}' into '${branch}'. Sync starts working on each clone once the PR merges and that clone runs 'git pull'`;
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
function previewRecord(inv, branch) {
  return {
    migrate: MIGRATE_PREVIEW,
    create: `a new '${BOARD_BRANCH}' branch whose ONE root commit carries the current committed files of ${BUNDLE_DIR}/ \u2014 files only: the folder's history stays on '${branch}'`,
    push: `the new '${BOARD_BRANCH}' branch to ${BOARD_REMOTE}, with tracking (git push -u ${BOARD_REMOTE} ${BOARD_BRANCH})`,
    commit: `ONE commit on a new local '${MIGRATION_BRANCH}' branch removing ${BUNDLE_DIR}/ from '${branch}' and adding it to .gitignore \u2014 NOT pushed: you push that branch and open the PR yourself; nothing on '${branch}' is pushed or changed`,
    after_merge: `once the PR merges, on every clone: 'git pull' makes ${BUNDLE_DIR}/ vanish from '${branch}', and the next '${inv} sync' re-creates it from the ${BOARD_BRANCH} branch \u2014 nothing is lost`,
    both_worlds: bothWorldsLine(branch),
    before_you_run: `every founder should sync \u2014 at minimum commit \u2014 their board changes first: board work sitting uncommitted or unpushed on another machine cannot be detected from here, and it will NOT be on the new branch`,
    verified: `this preview already checked the machine-checkable preconditions: ${BOARD_REMOTE} is reachable, '${branch}' is not behind ${BOARD_REMOTE}/${branch} on board changes, and no '${BOARD_BRANCH}/\u2026' branches exist (they would block creating the '${BOARD_BRANCH}' branch)`,
    rollout_note: rolloutNote(inv, branch),
    run: `${inv} sync --migrate --yes`
  };
}
function nextSteps(inv, branch) {
  return [
    `push the migration branch: git push -u ${BOARD_REMOTE} ${MIGRATION_BRANCH}`,
    `open a PR from '${MIGRATION_BRANCH}' into '${branch}' and merge it`,
    `after the merge lands: 'git pull', then '${inv} sync' \u2014 ${BUNDLE_DIR}/ vanishes from '${branch}' and comes back as the live shared board`
  ];
}
function localBranchExists(top, name) {
  return runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`]).status === 0;
}
function failureOf2(args, r) {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}
function mustGit2(top, args, input) {
  const r = runGit(top, args, input !== void 0 ? { input } : {});
  if (r.status !== 0) throw classifyGitError(failureOf2(args, r));
  return r.stdout;
}
function folderTreeAtHead(top) {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", `HEAD:${BUNDLE_DIR}`]);
  if (r.status !== 0) return null;
  const sha = r.stdout.trim();
  const t = runGit(top, ["cat-file", "-t", sha]);
  if (t.status !== 0 || t.stdout.trim() !== "tree") return null;
  return sha;
}
function behindBoardCommits(top, branch) {
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  if (runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status !== 0) return null;
  return mustGit2(top, ["rev-list", `HEAD..${remoteRef}`, "--", BUNDLE_DIR]).split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
}
function assertNotBehindOnBoard(top, inv, branch) {
  const behind = behindBoardCommits(top, branch);
  if (behind !== null && behind.length > 0) {
    throw new CliError(
      "RUNTIME",
      `migration refused: '${branch}' is behind ${BOARD_REMOTE}/${branch} with board changes \u2014 migrating from this stale state would strand a teammate's board commits on the frozen folder forever`,
      {
        details: { behind_board_commits: behind.length, commits: behind.slice(0, 20) },
        help: `git pull, then re-run ${inv} sync --migrate --yes`
      }
    );
  }
}
function boardNamespaceConflicts(top) {
  const local = runGit(top, ["for-each-ref", "--format=%(refname:short)", `refs/heads/${BOARD_BRANCH}/`]);
  const localNames = local.status === 0 ? local.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).map((n) => `${n} (local)`) : [];
  const remoteNames = remoteBoardNamespaceBranches(top).map((n) => `${n} (on ${BOARD_REMOTE})`);
  return [...localNames, ...remoteNames];
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
function boardCommitMessage(branch) {
  return `board: bundle migrated from '${branch}' (files only)

One-time migration: the bundle's current files, moved onto the dedicated '${BOARD_BRANCH}' branch.
The folder's history stays on '${branch}'.
`;
}
function removalCommitMessage(inv, branch) {
  return `board: move ${BUNDLE_DIR}/ to the '${BOARD_BRANCH}' branch

The board now lives on its own '${BOARD_BRANCH}' branch (pushed to ${BOARD_REMOTE}) and is ignored on '${branch}'.
Once this lands: 'git pull' (the folder vanishes), then '${inv} sync' (it returns as the live shared board).
`;
}
function createBoardRootCommit(top, treeSha, branch) {
  const sha = mustGit2(top, ["commit-tree", treeSha], boardCommitMessage(branch)).trim();
  mustGit2(top, ["branch", BOARD_BRANCH, sha]);
  return sha;
}
function createRemovalCommit(top, inv, branch) {
  const headTree = mustGit2(top, ["rev-parse", "HEAD^{tree}"]).trim();
  const entries = parseLsTreeZ(mustGit2(top, ["ls-tree", "-z", headTree])).filter(
    (e) => e.name !== BUNDLE_DIR
  );
  const existing = entries.find((e) => e.name === ".gitignore");
  const base = existing ? mustGit2(top, ["cat-file", "blob", existing.sha]) : "";
  const updated = withIgnoreEntry(base);
  if (updated !== base) {
    const blob = mustGit2(top, ["hash-object", "-w", "--stdin"], updated).trim();
    if (existing) {
      existing.sha = blob;
    } else {
      entries.push({ mode: "100644", type: "blob", sha: blob, name: ".gitignore" });
    }
  }
  entries.sort((a, b) => treeSortKey(a) < treeSortKey(b) ? -1 : treeSortKey(a) > treeSortKey(b) ? 1 : 0);
  const mktreeInput = entries.map((e) => `${e.mode} ${e.type} ${e.sha}	${e.name}\0`).join("");
  const newTree = mustGit2(top, ["mktree", "-z"], mktreeInput).trim();
  return mustGit2(top, ["commit-tree", newTree, "-p", "HEAD"], removalCommitMessage(inv, branch)).trim();
}
async function migrateBoard(dir, opts, stdout) {
  const inv = cliInvocation();
  const mode = resolveMode({ json: opts.json });
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError(
      "RUNTIME",
      `not inside a git repository \u2014 there is no committed ${BUNDLE_DIR}/ folder to migrate`
    );
  }
  const fetchOk = fetchOrigin(top);
  if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0) {
    await alreadyMigrated(top, inv, mode, opts.yes, fetchOk, stdout);
    return;
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError(
      "RUNTIME",
      `this repository has no '${BOARD_REMOTE}' remote \u2014 migration publishes the board branch to ${BOARD_REMOTE}; add the remote, then re-run`
    );
  }
  if (!fetchOk) {
    throw new CliError(
      "TRANSIENT",
      `migration refused: could not reach '${BOARD_REMOTE}' \u2014 migration verifies freshness against the remote and must push the board branch, neither of which can happen offline; get online, then re-run`,
      { details: { retryable: true } }
    );
  }
  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";
  if (branch === "HEAD") {
    throw new CliError(
      "RUNTIME",
      `the repository is on a detached HEAD \u2014 check out the branch that carries the committed ${BUNDLE_DIR}/ folder, then re-run`
    );
  }
  if (branch === BOARD_BRANCH) {
    throw new CliError(
      "RUNTIME",
      `the current branch is '${BOARD_BRANCH}' \u2014 run the migration from the branch that carries the committed folder ('${BOARD_BRANCH}' is the branch the migration creates)`
    );
  }
  const treeSha = folderTreeAtHead(top);
  if (treeSha === null) {
    throw new CliError(
      "RUNTIME",
      `no committed ${BUNDLE_DIR}/ folder on the current branch \u2014 nothing to migrate`,
      {
        help: `${inv} init starts a fresh board; if a teammate already migrated this project, run ${inv} sync`
      }
    );
  }
  assertNotBehindOnBoard(top, inv, branch);
  const status2 = runGit(top, ["status", "--porcelain", "--", BUNDLE_DIR]);
  const dirty = (status2.status === 0 ? status2.stdout : "").split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0).map((l) => ({ status: l.slice(0, 2).trim(), path: l.slice(3) }));
  if (dirty.length > 0) {
    const shown = dirty.slice(0, 20);
    throw new CliError(
      "RUNTIME",
      `migration refused: ${BUNDLE_DIR}/ has uncommitted changes \u2014 commit (or discard) them first so the board branch carries the board's real current state`,
      {
        details: { uncommitted: { shown: shown.length, total: dirty.length, rows: shown } },
        help: `commit the board changes, then re-run ${inv} sync --migrate --yes`
      }
    );
  }
  if (localBranchExists(top, MIGRATION_BRANCH)) {
    throw new CliError(
      "RUNTIME",
      `a '${MIGRATION_BRANCH}' branch already exists \u2014 if it is left over from an interrupted migration, push it and open its PR (or delete it: git branch -D ${MIGRATION_BRANCH}), then re-run`
    );
  }
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError(
      "RUNTIME",
      `migration refused: branches named '${BOARD_BRANCH}/\u2026' exist \u2014 git cannot create a '${BOARD_BRANCH}' branch alongside them: ${namespaceConflicts.join(", ")}`,
      {
        details: { conflicting_branches: namespaceConflicts },
        help: `delete or rename these branches, then re-run ${inv} sync --migrate --yes`
      }
    );
  }
  let reuseBoardSha = null;
  if (localBranchExists(top, BOARD_BRANCH)) {
    const sha = mustGit2(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}`]).trim();
    const tree = mustGit2(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}^{tree}`]).trim();
    const count = mustGit2(top, ["rev-list", "--count", `refs/heads/${BOARD_BRANCH}`]).trim();
    if (tree === treeSha && count === "1") {
      reuseBoardSha = sha;
    } else {
      throw new CliError(
        "RUNTIME",
        `a local '${BOARD_BRANCH}' branch already exists and does not match the committed folder \u2014 if it is left over from an interrupted migration, delete it (git branch -D ${BOARD_BRANCH}); if it is used for something else, rename it \u2014 then re-run`
      );
    }
  }
  if (!opts.yes) {
    stdout(render(previewRecord(inv, branch), mode));
    return;
  }
  const boardSha = reuseBoardSha ?? createBoardRootCommit(top, treeSha, branch);
  pushBoardUpstream(top);
  const removalSha = createRemovalCommit(top, inv, branch);
  mustGit2(top, ["branch", MIGRATION_BRANCH, removalSha]);
  const receipt = {
    migrated: MIGRATE_DONE,
    board_commit: boardSha,
    pushed: `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`,
    removal_branch: MIGRATION_BRANCH,
    removal_commit: removalSha,
    next_steps: nextSteps(inv, branch),
    both_worlds: bothWorldsLine(branch),
    tell_your_teammates: rolloutNote(inv, branch)
  };
  stdout(render(receipt, mode));
}
async function alreadyMigrated(top, inv, mode, yes, fetchOk, stdout) {
  const rec = { migrate: MIGRATE_ALREADY };
  const folderTracked = folderTreeAtHead(top) !== null;
  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";
  if (localBranchExists(top, MIGRATION_BRANCH)) {
    rec.note = `the folder-removal commit is already prepared on '${MIGRATION_BRANCH}' \u2014 push it and open its PR`;
    rec.next_steps = nextSteps(inv, branch === "HEAD" ? "the default branch" : branch);
  } else if (folderTracked && localBranchExists(top, BOARD_BRANCH) && branch !== "HEAD") {
    if (!yes) {
      rec.note = `an interrupted migration left the board branch pushed but no folder-removal commit \u2014 re-run '${inv} sync --migrate --yes' to re-create it on '${MIGRATION_BRANCH}' (nothing has been changed by this run)`;
    } else if (!fetchOk) {
      throw new CliError(
        "TRANSIENT",
        `migration refused: could not reach '${BOARD_REMOTE}' \u2014 finishing the interrupted migration re-creates the folder-removal commit, which must be cut from a fresh view of ${BOARD_REMOTE}; get online, then re-run`,
        { details: { retryable: true } }
      );
    } else {
      assertNotBehindOnBoard(top, inv, branch);
      const removalSha = createRemovalCommit(top, inv, branch);
      mustGit2(top, ["branch", MIGRATION_BRANCH, removalSha]);
      rec.recovered = `an interrupted migration left the board branch pushed but no folder-removal commit \u2014 it has been re-created on '${MIGRATION_BRANCH}'`;
      rec.removal_branch = MIGRATION_BRANCH;
      rec.removal_commit = removalSha;
      rec.next_steps = nextSteps(inv, branch);
      rec.both_worlds = bothWorldsLine(branch);
    }
  } else if (folderTracked) {
    const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
    const remoteBranchKnown = branch !== "HEAD" && runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status === 0;
    const landedUpstream = remoteBranchKnown && runGit(top, ["cat-file", "-e", `${remoteRef}:${BUNDLE_DIR}`]).status !== 0;
    rec.note = landedUpstream ? `this clone still carries the committed ${BUNDLE_DIR}/ folder and the folder-removal has already landed on '${branch}' \u2014 run 'git pull' (the folder vanishes), then '${inv} sync' (it returns as the live board)` : `this clone still carries the committed ${BUNDLE_DIR}/ folder \u2014 once the folder-removal lands on the default branch: 'git pull' (the folder vanishes), then '${inv} sync' (it returns as the live board)`;
  }
  stdout(render(rec, mode));
}

// src/commands/sync.ts
var SYNC_USAGE = `agentstate-lite sync \u2014 share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]
  agentstate-lite sync --migrate [--yes] [--dir <path>] [--json]

Shares this repo's board (\`.agentstate-lite\`, kept on its own \`board\` branch) with your
teammates: commits any pending local doc changes, pulls theirs, and pushes yours \u2014 touching
nothing outside the board. \`--pull-only\` skips commit + push and only fast-forwards from origin
(never rebases) \u2014 the mode a read-only session uses to pick up incoming changes without
publishing local ones.

On a repo that has never had the board checkout materialized locally (a fresh clone, or the first
\`aslite\` invocation after one), sync provisions \`.agentstate-lite\` itself from \`origin/board\` \u2014
never silently: the receipt carries a \`provisioned: <path>\` line. If the checkout already exists
but its pointers went stale (e.g. it was moved or remounted at a different path), sync self-heals
it via \`git worktree repair\` and reports \`repaired: <path>\` the same way \u2014 a repair is a git
mutation too, and both lines appear even on an otherwise-empty run.

Two definitive empty states (exit 0): no git repo (or no board anywhere yet, local or on origin)
prints 'sync: nothing to sync'; a clean, already-current board prints 'sync: already up to date'.
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

\`sync --migrate\` is the ONE-TIME move for a project whose board is a folder committed on the
default branch: it creates a \`board\` branch carrying the folder's CURRENT files (files only \u2014
the folder's history stays where it is), pushes it to origin with tracking, and prepares ONE
local commit on a new \`board-migration\` branch that removes the folder from the current branch
and gitignores it \u2014 you push that branch and open the PR yourself; nothing on the current branch
is pushed or changed. Until that PR merges the old committed folder is a frozen snapshot: sync no
longer updates it, so treat it as read-only. Without \`--yes\`, \`--migrate\` prints a preview (a
dry run, including the rollout note to send teammates) and changes nothing. It refuses while
\`.agentstate-lite/\` has uncommitted changes, when the current branch is behind origin on
commits touching the folder (pull first \u2014 a teammate's board commit must never be stranded on
the frozen copy), when origin is unreachable (the freshness check and the push both need it),
and when any \`board/...\` branch exists locally or on the remote (git cannot create a \`board\`
branch alongside them). It reports 'already migrated' (exit 0) once a board branch exists on
origin \u2014 with state-aware guidance, including re-creating the folder-removal commit when an
interrupted run left it missing. Coordinate first: every founder syncs (at minimum commits)
their board work before anyone migrates.

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --migrate            One-time: move a committed .agentstate-lite/ folder onto its own board branch
  --yes                Execute --migrate (without it, --migrate prints a preview and changes nothing)
  --out <file>         With --show-incoming: write the raw bytes to <file> ('-' = raw to stdout)
  --dir <path>         Directory to run sync from (default: the cwd) \u2014 must be inside a git repo
  --limit <n>          Cap the incoming-delta row list to <n> rows (default: 20; 0 = unlimited)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;
var DEFAULT_LIMIT2 = 20;
function cap2(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
var PUSH_FAIL_SAFETY_MESSAGE = "committed to the board locally \u2014 your work is saved. The push failed (offline or auth); re-run sync when you're back online or your access is restored.";
function pushFailureMessage(err) {
  if (err.code === "AUTH_REQUIRED" || err.code === "TRANSIENT") return PUSH_FAIL_SAFETY_MESSAGE;
  return `committed to the board locally \u2014 your work is saved. ${err.message}`;
}
function upstreamHelp(inv) {
  return `if a teammate has already set this project up for sharing, make sure your \`origin\` remote points at the SAME repository they pushed the \`board\` branch to; if not, someone needs to run the (human-gated) migration once before ${inv} sync can share it`;
}
function withUpstreamHelp(err, inv) {
  if (err.code === "NO_UPSTREAM" && err.help === void 0) {
    return new CliError("NO_UPSTREAM", err.message, { details: err.details, help: upstreamHelp(inv) });
  }
  return err;
}
function toCliError(err, op) {
  if (err instanceof CliError) return err;
  return classifyGitError({ args: [op], status: null, stdout: "", stderr: err instanceof Error ? err.message : String(err) });
}
async function throwPostCommitFailure(err, committedThisRun, key2, boardPath) {
  if (!committedThisRun) throw err;
  const wrapped = new CliError(err.code, pushFailureMessage(err), { details: err.details, help: err.help });
  await writeCache(key2, {
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    delta: [],
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath)
  });
  throw wrapped;
}
function entryLabel(c) {
  return c.isDoc ? `doc ${c.entry}` : c.entry;
}
function annotateLanded(boardPath, conflicts) {
  return conflicts.map((c) => ({
    ...c,
    landed: runGit(boardPath, ["cat-file", "-e", `HEAD:${c.relPath}`]).status === 0
  }));
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
function keptDocMeta(boardPath, relPath) {
  const shown = runGit(boardPath, ["show", `HEAD:${relPath}`]);
  if (shown.status !== 0) return {};
  try {
    const { frontmatter } = parseMarkdown(shown.stdout, relPath);
    const kind2 = fmValue(frontmatter.type);
    const title = fmValue(frontmatter.title);
    return {
      ...kind2 !== UNKNOWN_FIELD ? { kind: kind2 } : {},
      ...title !== UNKNOWN_FIELD ? { title } : {}
    };
  } catch {
    return {};
  }
}
function frontmatterDiffKeys(boardPath, c) {
  if (!c.isDoc || c.exportPath === null || !c.landed) return [];
  try {
    const local = parseMarkdown(readFileSync3(c.exportPath, "utf8"), c.relPath).frontmatter;
    const shown = runGit(boardPath, ["show", `HEAD:${c.relPath}`]);
    if (shown.status !== 0) return [];
    const kept = parseMarkdown(shown.stdout, c.relPath).frontmatter;
    const keys = /* @__PURE__ */ new Set([...Object.keys(local), ...Object.keys(kept)]);
    keys.delete("timestamp");
    return [...keys].filter((k) => JSON.stringify(local[k]) !== JSON.stringify(kept[k])).sort();
  } catch {
    return [];
  }
}
function toConflictRows(boardPath, conflicts) {
  return conflicts.map((c) => {
    const row = c.isDoc ? { id: c.entry } : { path: c.entry };
    if (c.isDoc) Object.assign(row, keptDocMeta(boardPath, c.relPath));
    row.yours = c.exportPath !== null ? c.exportPath : "deleted locally \u2014 nothing to save";
    if (c.bodyExportPath !== null) row.yours_body = c.bodyExportPath;
    const diff = frontmatterDiffKeys(boardPath, c);
    if (diff.length > 0) row.frontmatter_differs = diff;
    row.theirs = c.landed ? "kept" : "kept (deleted upstream)";
    return row;
  });
}
function provisionAnnouncement(outcome) {
  if (outcome.kind === "provisioned") {
    return { provisioned: `${outcome.boardPath} \u2014 materialized from origin/board` };
  }
  if (outcome.kind === "repaired") {
    return { repaired: `${outcome.boardPath} \u2014 worktree pointers repaired` };
  }
  return void 0;
}
function withProvisionAnnouncement(err, outcome) {
  const announcement = provisionAnnouncement(outcome);
  if (!announcement) return err;
  return new CliError(err.code, err.message, { details: { ...err.details, ...announcement }, help: err.help });
}
function ffSwallowToError(reason, inv) {
  switch (reason) {
    case "git-missing":
      return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
        help: "install git (https://git-scm.com/downloads), then re-run the command"
      });
    case "no-upstream":
      return new CliError(
        "NO_UPSTREAM",
        "the board branch isn't linked to a remote yet \u2014 sync can't share it",
        { help: upstreamHelp(inv) }
      );
    case "auth":
      return new CliError(
        "AUTH_REQUIRED",
        "sync was denied access to the remote (or the repository is not visible to your credentials)",
        { details: { best_effort: true } }
      );
    case "network":
      return new CliError(
        "TRANSIENT",
        "sync could not reach the remote \u2014 offline or the host is unreachable; retry",
        { details: { retryable: true } }
      );
    case "busy":
      return new CliError(
        "GIT_BUSY",
        "another git process is using this repository \u2014 retry once it finishes",
        { details: { retryable: true } }
      );
    case "diverged":
      return new CliError(
        "CONFLICT",
        `the board has local commits not yet pushed, and origin has moved too \u2014 \`sync --pull-only\` only fast-forwards; run \`${inv} sync\` (without --pull-only) to reconcile`
      );
    case "conflict":
      return new CliError(
        "CONFLICT",
        `the board checkout has unresolved conflicts \u2014 run \`${inv} sync\` (without --pull-only) to reconcile`
      );
    case "dirty":
      return new CliError(
        "RUNTIME",
        "the board checkout has uncommitted local changes that a fast-forward-only pull would overwrite \u2014 commit or discard them, or run a full sync instead of --pull-only"
      );
    case "detached-head":
      return new CliError(
        "RUNTIME",
        "the board checkout is in a detached-HEAD state \u2014 sync needs the board branch checked out",
        { details: { state: "detached-head" } }
      );
    case "not-a-repo":
      return new CliError(
        "RUNTIME",
        "the board checkout is not a git repository \u2014 run sync again to re-provision it"
      );
    default:
      return new CliError(
        "RUNTIME",
        `sync's pull step failed for an unclassified reason (${reason}) \u2014 re-run, or run without --pull-only`
      );
  }
}
function realOrSame2(p) {
  try {
    return realpathSync4(p);
  } catch {
    return p;
  }
}
function healStaleRebaseBeforeProvisioning(dir) {
  try {
    const top = repoTopLevel(dir);
    if (!top) return;
    const candidateBoardPath = path10.join(top, BUNDLE_DIR);
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
function isLinkedWorktree(p) {
  const r = runGit(p, ["rev-parse", "--absolute-git-dir", "--git-common-dir"]);
  if (r.status !== 0) return false;
  const [gitDirRaw, commonDirRaw] = r.stdout.trim().split("\n");
  if (!gitDirRaw || !commonDirRaw) return false;
  const commonDir = path10.isAbsolute(commonDirRaw) ? commonDirRaw : path10.resolve(p, commonDirRaw);
  return realOrSame2(gitDirRaw) !== realOrSame2(commonDir);
}
function hasGitFileSignature(p) {
  try {
    return statSync2(path10.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}
function retargetStaleBoardInteriorByPath(dir) {
  let cur = path10.resolve(dir);
  for (; ; ) {
    if (path10.basename(cur) === BUNDLE_DIR && hasGitFileSignature(cur)) {
      return path10.dirname(cur);
    }
    const parent = path10.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
function retargetBoardInterior(dir) {
  try {
    const top = repoTopLevel(dir);
    if (top && path10.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path10.dirname(top);
    }
  } catch {
  }
  return retargetStaleBoardInteriorByPath(dir) ?? dir;
}
function currentHead(boardPath) {
  const r = runGit(boardPath, ["rev-parse", "HEAD"]);
  if (r.status !== 0) {
    throw classifyGitError({ args: ["rev-parse", "HEAD"], status: r.status, stdout: r.stdout, stderr: r.stderr });
  }
  return r.stdout.trim();
}
function countUncommitted(boardPath) {
  const r = runGit(boardPath, ["status", "--porcelain"]);
  if (r.status !== 0) return 0;
  return r.stdout.split("\n").filter((l) => l.trim().length > 0).length;
}
function resolveOriginRef(boardPath) {
  const r = runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  return r.status === 0 ? r.stdout.trim() : null;
}
var UNKNOWN_FIELD = "unknown";
function fmValue(v) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN_FIELD;
}
function isConceptDocRelPath(relPath) {
  return relPath.endsWith(".md") && !isReservedFile(relPath);
}
function nameStatusPairs(out) {
  return out.split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0).map((l) => {
    const [letter = "", ...rest] = l.split("	");
    return { letter: letter.trim().charAt(0), relPath: rest.join("	") };
  }).filter((r) => r.letter.length > 0 && r.relPath.length > 0);
}
function verbForLetter(letter) {
  if (letter === "A") return "added";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}
function enrichDocChangeAt(boardPath, relPath, verb, rev) {
  const docId = conceptIdFromPath(relPath);
  let actor = UNKNOWN_FIELD;
  let kind2 = UNKNOWN_FIELD;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`]);
  if (shown.status === 0) {
    try {
      const { frontmatter } = parseMarkdown(shown.stdout, relPath);
      actor = fmValue(frontmatter.actor);
      kind2 = fmValue(frontmatter.type);
      const t = fmValue(frontmatter.title);
      if (t !== UNKNOWN_FIELD) title = t;
    } catch {
    }
  }
  return { docId, actor, verb, kind: kind2, title };
}
function originDocsBetween(boardPath, fromRef, toRef) {
  if (!fromRef || !toRef || fromRef === toRef) return [];
  const r = runGit(boardPath, ["diff", "--name-status", "--no-renames", `${fromRef}..${toRef}`]);
  if (r.status !== 0) return [];
  const changes = [];
  for (const { letter, relPath } of nameStatusPairs(r.stdout)) {
    if (!isConceptDocRelPath(relPath)) continue;
    const verb = verbForLetter(letter);
    if (!verb) continue;
    changes.push(enrichDocChangeAt(boardPath, relPath, verb, verb === "deleted" ? fromRef : toRef));
  }
  return changes;
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
function toIncomingRows(changes) {
  return changes.map((c) => ({ verb: c.verb, kind: c.kind, id: c.docId, title: c.title, actor: c.actor }));
}
function toDeltaRows(changes) {
  return changes.map((c) => ({ docId: c.docId, verb: c.verb, kind: c.kind, title: c.title, actor: c.actor }));
}
async function sync(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const inv = cliInvocation();
  const { values } = parseOrUsage(
    () => parseArgs22({
      args: argv,
      options: {
        "pull-only": { type: "boolean" },
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
  if (values.help) {
    stdout(SYNC_USAGE);
    return;
  }
  if (values.migrate) {
    if (values["pull-only"]) {
      throw new CliError("USAGE", "--migrate and --pull-only cannot be combined \u2014 migration never pulls");
    }
    if (values["show-incoming"] !== void 0) {
      throw new CliError("USAGE", "--migrate and --show-incoming cannot be combined");
    }
    if (values.out !== void 0) {
      throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
        help: `${inv} sync --show-incoming <id> --out <file>`
      });
    }
    const migrateDir = retargetBoardInterior(values.dir ?? process.cwd());
    await migrateBoard(migrateDir, { yes: Boolean(values.yes), ...values.json !== void 0 ? { json: values.json } : {} }, stdout);
    return;
  }
  if (values.yes) {
    throw new CliError("USAGE", "--yes only applies to sync --migrate", {
      help: `${inv} sync --migrate --yes`
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
    await showIncoming(id, values, deps);
    return;
  }
  if (values.out !== void 0) {
    throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
      help: `${inv} sync --show-incoming <id> --out <file>`
    });
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
  const pullOnly = Boolean(values["pull-only"]);
  const mode = resolveMode(values);
  healStaleRebaseBeforeProvisioning(dir);
  const outcome = provisionBoardWorktree(dir);
  if (outcome.kind === "no_repo" || outcome.kind === "no_board") {
    stdout(render({ sync: "nothing to sync" }, mode));
    return;
  }
  const boardPath = outcome.boardPath;
  if (outcome.kind === "repaired") {
    healStaleRebaseBeforeProvisioning(dir);
  }
  const key2 = resolveBundleKey(boardPath);
  await refreshMarker(key2);
  const storedCursor = await readCursor(key2);
  const startHead = currentHead(boardPath);
  const preFetchOriginRef = resolveOriginRef(boardPath);
  let commitResult = { committed: false, docs: [] };
  if (!pullOnly) {
    commitResult = stageAndCommit(boardPath);
    if (commitResult.committed && commitResult.docs.length > 0) {
      await recordSelfActors(key2, commitResult.docs.map((d) => d.actor));
    }
  }
  if (pullOnly) {
    const ff = ffPull(boardPath);
    if (ff.swallowed) {
      throw withProvisionAnnouncement(ffSwallowToError(ff.swallowed, inv), outcome);
    }
  } else {
    let rebaseOutcome;
    try {
      rebaseOutcome = fetchRebaseResolving(boardPath, syncExportsDir(key2));
    } catch (rawErr) {
      const enriched = withProvisionAnnouncement(withUpstreamHelp(toCliError(rawErr, "rebase"), inv), outcome);
      throw await throwPostCommitFailure(enriched, commitResult.committed, key2, boardPath);
    }
    if (rebaseOutcome.status === "resolved") {
      const conflicts = annotateLanded(boardPath, rebaseOutcome.conflicts);
      const rows = toConflictRows(boardPath, conflicts);
      const help = pickHelp(inv, conflicts);
      const conflictErr = withProvisionAnnouncement(
        new CliError("CONFLICT", buildConvergeMessage(conflicts), {
          details: { conflicts: cap2(rows, limit) },
          ...help ? { help } : {}
        }),
        outcome
      );
      throw await throwPostCommitFailure(conflictErr, commitResult.committed, key2, boardPath);
    }
  }
  const postFetchOriginRef = resolveOriginRef(boardPath);
  const originDelta = originDocsBetween(boardPath, preFetchOriginRef, postFetchOriginRef);
  const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? startHead);
  let changes;
  let reanchorNote;
  if (delta.ok) {
    changes = delta.changes;
    await writeCursor(key2, { tier: "git", token: postPullHead });
  } else {
    changes = [];
    reanchorNote = REANCHOR_NOTE;
    await recordReanchor(
      key2,
      { tier: "git", token: postPullHead },
      { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) }
    );
  }
  let pushedCount = 0;
  if (!pullOnly) {
    const ahead = unpushedCount(boardPath) ?? 0;
    try {
      push(boardPath);
      pushedCount = ahead;
    } catch (err) {
      const classified = toCliError(err, "push");
      const warning = pushFailureMessage(classified);
      const partial = {};
      const announcement2 = provisionAnnouncement(outcome);
      if (announcement2) Object.assign(partial, announcement2);
      partial.warning = warning;
      partial.committed = commitResult.docs.length;
      partial.pushed = 0;
      partial.pulled = originDelta.length;
      const actor2 = singleActor(commitResult.docs);
      if (actor2) partial.actor = actor2;
      partial.incoming = cap2(toIncomingRows(originDelta), limit);
      if (reanchorNote) partial.note = reanchorNote;
      stdout(render(partial, mode));
      await writeCache(key2, {
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        delta: toDeltaRows(changes),
        unpushedCount: unpushedCount(boardPath) ?? 0,
        uncommittedCount: countUncommitted(boardPath),
        ...reanchorNote ? { note: reanchorNote } : {}
      });
      throw asHandled(new CliError(classified.code, warning, { details: classified.details }));
    }
  }
  await writeCache(key2, {
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
    ...reanchorNote ? { note: reanchorNote } : {}
  });
  const committedCount = commitResult.docs.length;
  const pulledCount = originDelta.length;
  if (committedCount === 0 && pulledCount === 0 && pushedCount === 0 && !reanchorNote) {
    const rec = {};
    const announcement2 = provisionAnnouncement(outcome);
    if (announcement2) Object.assign(rec, announcement2);
    rec.sync = "already up to date";
    stdout(render(rec, mode));
    return;
  }
  const receipt = {};
  const announcement = provisionAnnouncement(outcome);
  if (announcement) Object.assign(receipt, announcement);
  receipt.committed = committedCount;
  receipt.pushed = pushedCount;
  receipt.pulled = pulledCount;
  const actor = singleActor(commitResult.docs);
  if (actor) receipt.actor = actor;
  receipt.incoming = cap2(toIncomingRows(originDelta), limit);
  if (reanchorNote) receipt.note = reanchorNote;
  stdout(render(receipt, mode));
}
var SHOW_INCOMING_AS_OF = "last fetch";
var SHOW_INCOMING_ABSENT_STATE = "absent upstream \u2014 not on origin/board as of the last fetch (deleted upstream, or a new local doc)";
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
    if (path10.isAbsolute(id) || id.split("/").some((seg) => seg === "..")) {
      throw new CliError("USAGE", `--show-incoming needs a repo-relative doc id or path without '..' segments: ${id}`);
    }
    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      throw ffSwallowToError("no-upstream", inv);
    }
    const candidates = [];
    let conceptIdOk = true;
    try {
      assertSafeConceptId(id);
    } catch {
      conceptIdOk = false;
    }
    if (conceptIdOk) candidates.push({ relPath: pathFromConceptId(id), isDoc: true });
    if (candidates.every((c) => c.relPath !== id)) candidates.push({ relPath: id, isDoc: false });
    let hit = null;
    for (const probe of candidates) {
      if (runGit(top, ["cat-file", "-e", `refs/remotes/${BOARD_REF}:${probe.relPath}`]).status !== 0) {
        continue;
      }
      const shown = runGitBytes(top, ["show", `refs/remotes/${BOARD_REF}:${probe.relPath}`]);
      if (shown.status !== 0) {
        throw classifyGitError({ args: ["show"], status: shown.status, stdout: "", stderr: shown.stderr });
      }
      hit = { probe, bytes: shown.stdout };
      break;
    }
    if (hit === null) {
      const state = {
        sync: "show-incoming",
        id,
        as_of: SHOW_INCOMING_AS_OF,
        state: SHOW_INCOMING_ABSENT_STATE
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
      await fs10.writeFile(out, bytes);
      stdout(render(receipt, mode));
      return;
    }
    const content = bytes.toString("utf8");
    const byteHatch = `${inv} sync --show-incoming ${id} --out <file>`;
    const rec = {};
    if (!hit.probe.isDoc) {
      rec.path = id;
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
        for (const key2 of KNOWN_ORDER) {
          if (parsed.frontmatter[key2] !== void 0 && parsed.frontmatter[key2] !== null) rec[key2] = parsed.frontmatter[key2];
        }
        for (const key2 of Object.keys(parsed.frontmatter)) {
          if (KNOWN_ORDER.includes(key2) || RESERVED_OUTPUT.has(key2)) continue;
          if (parsed.frontmatter[key2] === void 0 || parsed.frontmatter[key2] === null) continue;
          rec[key2] = parsed.frontmatter[key2];
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

// src/commands/login.ts
import { parseArgs as parseArgs23 } from "node:util";
var LOGIN_USAGE = `agentstate-lite login \u2014 store an API key for a gated remote (offline write)

Usage:
  agentstate-lite login --remote <url> --api-key <key>

Stores an API key for a gated wire-protocol remote (a Cloudflare Worker deployment), keyed by the
remote's ORIGIN \u2014 one key per remote, so a staging and a production deployment can each carry their
own. The key is sent as Authorization: Bearer <key> on every --remote request to this origin. A
subsequent 'login --remote <url> --api-key' for the SAME origin overwrites only that origin's key;
every other stored origin survives. (To JOIN a bundle via an invite instead, use 'join'.)

Options:
  --remote <url>   Base URL of the gated remote (required)
  --api-key <key>  Opaque API key, stored verbatim (required)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;
async function login(argv, deps = {}) {
  const saveApiKey = deps.saveApiKey ?? ((origin2, apiKey2) => saveApiKeyForOrigin(origin2, apiKey2));
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs23({
      args: argv,
      options: {
        remote: { type: "string" },
        "api-key": { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "login"
  );
  if (values.help) {
    stdout(LOGIN_USAGE);
    return;
  }
  const remote = values.remote?.trim();
  const apiKey = values["api-key"]?.trim();
  if (!remote || !apiKey) {
    throw new CliError("USAGE", "login requires --remote <url> and --api-key <key>", {
      help: `${cliInvocation()} login --remote <url> --api-key <key>`
    });
  }
  let origin;
  try {
    origin = normalizeServer(remote).resource;
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} login --remote http://127.0.0.1:4818 --api-key <key>`
    });
  }
  await saveApiKey(origin, apiKey);
  stdout(
    render(
      { login: "ok", remote: origin, help: [`${cliInvocation()} list --remote ${origin}`] },
      resolveMode(values)
    )
  );
}

// src/commands/whoami.ts
import { parseArgs as parseArgs24 } from "node:util";

// src/auth-client.ts
async function resolveRemoteOnly(remoteFlag) {
  const remote = await resolveRemoteFlag(remoteFlag, void 0);
  if (!remote) {
    throw new CliError("USAGE", "--remote <url> is required (or set AGENTSTATE_LITE_REMOTE)", {
      help: `${cliInvocation()} <command> --remote <url>`
    });
  }
  try {
    const resolved = normalizeServer(remote);
    return { base: resolved.base, origin: resolved.resource };
  } catch (err) {
    throw new CliError("USAGE", err instanceof Error ? err.message : String(err), {
      help: `${cliInvocation()} <command> --remote https://your-worker.example.workers.dev`
    });
  }
}
async function resolveAuthToken(origin) {
  const envKey = process.env[API_KEY_ENV_VAR]?.trim();
  if (envKey) return envKey;
  return getApiKeyForOrigin(origin);
}
async function resolveAuthContext(remoteFlag) {
  const { base, origin } = await resolveRemoteOnly(remoteFlag);
  const authToken = await resolveAuthToken(origin);
  return { base, origin, authToken };
}
async function safeFetch(request) {
  try {
    return await globalThis.fetch(request);
  } catch (err) {
    throw new CliError(
      "RUNTIME",
      `could not reach ${request.url} (${err instanceof Error ? err.message : String(err)})`
    );
  }
}
async function toRemoteError(res) {
  let envelope = null;
  try {
    envelope = await res.json();
  } catch {
    envelope = null;
  }
  const message = envelope?.error?.message ?? `request failed with status ${res.status}`;
  const code = envelope?.error?.code ?? (res.status === 401 ? "AUTH_REQUIRED" : res.status >= 500 ? "RUNTIME" : "USAGE");
  return new RemoteError(message, code, res.status);
}
async function authRequest(base, path12, options2 = {}) {
  const headers = {};
  if (options2.body !== void 0) headers["content-type"] = "application/json";
  if (options2.authToken) headers["Authorization"] = `Bearer ${options2.authToken}`;
  const request = new Request(`${base}${path12}`, {
    method: options2.method ?? "GET",
    headers,
    body: options2.body !== void 0 ? JSON.stringify(options2.body) : void 0
  });
  const res = await safeFetch(request);
  if (!res.ok) throw await toRemoteError(res);
  return await res.json();
}

// src/commands/whoami.ts
var WHOAMI_USAGE = `agentstate-lite whoami \u2014 show which remotes you hold a key for, or (with --remote) the live remote identity

Usage:
  agentstate-lite whoami [--remote <url>]

Without --remote (and no AGENTSTATE_LITE_REMOTE default): OFFLINE \u2014 lists the remote origins
you hold a stored key for, without a network call.

With --remote <url> (or an AGENTSTATE_LITE_REMOTE default): GETs /v0/whoami against the
gated remote, using the ORIGIN-KEYED API key stored by 'join' or 'login --remote
--api-key' (or AGENTSTATE_LITE_API_KEY) \u2014 reports the resolved identity, its role per
bundle membership, and whether it authenticated as the root bootstrap identity.

Options:
  --remote <url>   Show the LIVE remote identity instead of the local credential file
                   (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;
async function whoami(argv, deps = {}) {
  const loadCreds = deps.loadCreds ?? loadCredentials;
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs24({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "whoami"
  );
  if (values.help) {
    stdout(WHOAMI_USAGE);
    return;
  }
  const remote = await resolveRemoteFlag(values.remote, void 0);
  if (remote) {
    return whoamiRemote(remote, resolveMode(values), stdout);
  }
  const creds = await loadCreds();
  const remoteOrigins = creds?.remotes ? Object.keys(creds.remotes).sort() : [];
  let projectBinding;
  try {
    const found = await resolveProjectBinding();
    if (found) projectBinding = { file: found.file, target: found.target };
  } catch {
  }
  if (remoteOrigins.length === 0) {
    const rec2 = {
      logged_in: false,
      remotes: [],
      help: [
        `${cliInvocation()} whoami --remote <url>  (check a gated remote identity)`,
        `${cliInvocation()} join --remote <url> --invite <token>  (join a shared bundle)`
      ]
    };
    if (projectBinding) rec2.project_binding = projectBinding;
    stdout(render(rec2, resolveMode(values)));
    return;
  }
  const rec = {
    logged_in: true,
    remotes: remoteOrigins,
    help: [`${cliInvocation()} whoami --remote ${remoteOrigins[0]}`]
  };
  if (projectBinding) rec.project_binding = projectBinding;
  stdout(render(rec, resolveMode(values)));
}
async function whoamiRemote(remoteFlag, mode, stdout) {
  const { base, origin } = await resolveRemoteOnly(remoteFlag);
  const authToken = await resolveAuthToken(origin);
  let body;
  try {
    body = await authRequest(base, "/v0/whoami", { authToken });
  } catch (err) {
    const classified = classifyBundleError(err, remoteFlag);
    if (classified.code === "AUTH_REQUIRED") {
      throw new CliError("AUTH_REQUIRED", classified.message, {
        help: `${cliInvocation()} join --remote ${origin} --invite <token> (or, if you already have a key: ${cliInvocation()} login --remote ${origin} --api-key <key>)`
      });
    }
    throw classified;
  }
  const rec = {
    remote: origin,
    user_id: body.user_id,
    display: body.display,
    method: body.method,
    memberships: body.memberships
  };
  if (body.bootstrap) {
    rec.bootstrap = true;
    rec.bootstrap_note = "no members are provisioned on this deployment yet \u2014 every valid key authenticates as the root admin; provision members (invite create / member set-role) to lock it down";
  }
  stdout(render(rec, mode));
}

// src/commands/join.ts
import { parseArgs as parseArgs25 } from "node:util";
var JOIN_USAGE = `agentstate-lite join \u2014 redeem an invite token to join a remote bundle

Usage:
  agentstate-lite join --remote <url> --invite <token> [--display <name>]

On success, the returned API key is stored in the local credentials file, keyed to the
remote's origin \u2014 it is NEVER printed. Every subsequent --remote command against this
origin then authenticates automatically (the same lookup 'login --remote --api-key' uses).

Options:
  --remote <url>    Base URL of the auth-gated remote deployment
                    (falls back to AGENTSTATE_LITE_REMOTE if set)
  --invite <token>  The invite token to redeem                              [required]
  --display <name>  Display name to record for the new user
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;
async function join6(argv, deps = {}) {
  const saveApiKey = deps.saveApiKey ?? ((origin2, apiKey) => saveApiKeyForOrigin(origin2, apiKey));
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs25({
      args: argv,
      options: {
        remote: { type: "string" },
        invite: { type: "string" },
        display: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "join"
  );
  if (values.help) {
    stdout(JOIN_USAGE);
    return;
  }
  const inviteToken = values.invite?.trim();
  if (!inviteToken) {
    throw new CliError("USAGE", "--invite <token> is required", {
      help: `${cliInvocation()} join --remote <url> --invite <token>`
    });
  }
  const { base, origin } = await resolveRemoteOnly(values.remote);
  const display = values.display?.trim();
  let result;
  try {
    result = await authRequest(base, "/v0/join", {
      method: "POST",
      body: { invite_token: inviteToken, ...display ? { display } : {} }
    });
  } catch (err) {
    if (err instanceof CliError) throw err;
    if (err instanceof RemoteError && err.code === "INVITE_INVALID") {
      throw new CliError("USAGE", `${err.message} \u2014 ask an admin for a new invite`);
    }
    throw classifyBundleError(err, values.remote);
  }
  await saveApiKey(origin, result.api_key);
  stdout(
    render(
      {
        joined: true,
        remote: origin,
        user_id: result.user_id,
        role: result.role,
        bundle: result.bundle,
        key_prefix: result.key_prefix,
        help: [`${cliInvocation()} whoami --remote ${origin}`]
      },
      resolveMode(values)
    )
  );
}

// src/commands/invite.ts
import { parseArgs as parseArgs26 } from "node:util";
var INVITE_USAGE = `agentstate-lite invite \u2014 create, list, or revoke join invites for a remote bundle

Usage:
  agentstate-lite invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]
  agentstate-lite invite list   --remote <url> [--fields <a,b,... | all>]
  agentstate-lite invite revoke --remote <url> <invite_id>

Requires an admin membership on the target remote (or the root bootstrap identity).
'invite create' prints the invite TOKEN once \u2014 it is the shareable secret; anyone holding
it can run 'join' to redeem it (unlike an API key, printing it here is correct: the
token IS meant to be handed to the intended joiner). 'invite revoke' is idempotent
(changed:false if already revoked or absent).

Options:
  --role <r>             Role the redeemer receives: admin | writer | reader  [create; required]
  --fields <a,b|all>     [list] Add columns to the minimal {id,role,expires_at,status} row, or 'all'
                         for the full record (bundle, created_by, redeemed_by, redeemed_at, \u2026)
  --expires-in <hours>   Invite lifetime in hours (default: server default, one week)
  --display-hint <s>     Suggested display name shown to the redeemer
  --remote <url>         Base URL of the auth-gated remote deployment
                         (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json                 Emit compact JSON instead of TOON
  -h, --help             Show this help
`;
async function invite(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "create") return inviteCreate(rest, stdout);
  if (sub === "list") return inviteList(rest, stdout);
  if (sub === "revoke") return inviteRevoke(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(INVITE_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown invite subcommand: ${sub} (expected create|list|revoke)`, {
    help: `${cliInvocation()} invite --help`
  });
}
async function inviteCreate(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs26({
      args: argv,
      options: {
        role: { type: "string" },
        "expires-in": { type: "string" },
        "display-hint": { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "invite create"
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }
  const role = values.role?.trim();
  if (!role || !isRole(role)) {
    throw new CliError("USAGE", `--role <r> is required and must be one of: ${ROLES.join(", ")}`, {
      help: `${cliInvocation()} invite create --remote <url> --role writer`
    });
  }
  let expiresInHours;
  if (values["expires-in"] !== void 0) {
    const n = Number(values["expires-in"]);
    if (!Number.isFinite(n) || n <= 0) {
      throw new CliError("USAGE", "--expires-in <hours> must be a positive number", {
        help: `${cliInvocation()} invite create --remote <url> --role ${role} --expires-in 24`
      });
    }
    expiresInHours = n;
  }
  const displayHint = values["display-hint"]?.trim();
  const { base, origin, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, "/v0/invites", {
      method: "POST",
      authToken,
      body: {
        role,
        ...expiresInHours !== void 0 ? { expires_in_hours: expiresInHours } : {},
        ...displayHint ? { display_hint: displayHint } : {}
      }
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = {
    invite_id: result.invite_id,
    bundle: result.bundle,
    role: result.role,
    expires_at: result.expires_at,
    token: result.token,
    help: [`${cliInvocation()} join --remote ${origin} --invite ${result.token}`]
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}
var INVITE_DEFAULT_COLS = ["id", "role", "expires_at", "status"];
var INVITE_ALL_COLS = [
  ...INVITE_DEFAULT_COLS,
  "bundle",
  "created_by",
  "redeemed_by",
  "redeemed_at",
  "display_hint"
];
function inviteStatus(inv) {
  if (inv.revokedAt) return "revoked";
  if (inv.redeemedAt || inv.redeemedBy) return "redeemed";
  return "pending";
}
function inviteCols(fieldsFlag) {
  if (fieldsFlag === void 0) return INVITE_DEFAULT_COLS;
  const req = fieldsFlag.trim().toLowerCase();
  if (req === "all" || req === "*") return INVITE_ALL_COLS;
  const extra = fieldsFlag.split(",").map((f) => f.trim()).filter((f) => f && !INVITE_DEFAULT_COLS.includes(f));
  return [...INVITE_DEFAULT_COLS, ...extra];
}
async function inviteList(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs26({
      args: argv,
      options: {
        fields: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "invite list"
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, "/v0/invites", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const cols = inviteCols(values.fields);
  const rows = result.invites.map((inv) => {
    const full = {
      id: inv.id,
      role: inv.role,
      expires_at: inv.expiresAt,
      status: inviteStatus(inv),
      bundle: inv.bundle,
      created_by: inv.createdBy,
      redeemed_by: inv.redeemedBy ?? "",
      redeemed_at: inv.redeemedAt ?? "",
      display_hint: inv.displayHint ?? ""
    };
    const row = {};
    for (const c of cols) if (c in full) row[c] = full[c];
    return row;
  });
  const rec = { count: result.count, invites: rows };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  rec.help = result.count === 0 ? [`no invites yet \u2014 create one with \`${cliInvocation()} invite create --remote ${remote} --role writer\``] : [
    `${cliInvocation()} invite revoke --remote ${remote} <invite_id>`,
    `pass \`--fields all\` for the full record (created_by, redeemed_by, \u2026)`
  ];
  stdout(render(rec, resolveMode(values)));
}
async function inviteRevoke(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs26({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "invite revoke"
  );
  if (values.help) {
    stdout(INVITE_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "invite revoke requires an <invite_id> positional", {
      help: `${cliInvocation()} invite revoke --remote <url> <invite_id>`
    });
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, `/v0/invites/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = { invite_id: result.invite_id, changed: result.changed };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}

// src/commands/member.ts
import { parseArgs as parseArgs27 } from "node:util";
var MEMBER_USAGE = `agentstate-lite member \u2014 list, change the role of, or remove a remote bundle's members

Usage:
  agentstate-lite member list     --remote <url>
  agentstate-lite member set-role --remote <url> <user_id> <role>
  agentstate-lite member remove   --remote <url> <user_id>

Requires an admin membership on the target remote (or the root bootstrap identity).
'member set-role' and 'member remove' are idempotent (changed:false on a repeat that
changes nothing). 'member remove' also revokes EVERY API key the removed user holds,
deployment-wide (single-bundle scope today) \u2014 see the returned revoked_keys count. The
server also refuses to demote or remove the LAST admin of a bundle (409, surfaced here as
a USAGE error \u2014 see 'invite'/'member' usage text for the deployment's single-bundle scope).

Options:
  --remote <url>   Base URL of the auth-gated remote deployment
                   (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json           Emit compact JSON instead of TOON
  -h, --help       Show this help
`;
async function member(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "list") return memberList(rest, stdout);
  if (sub === "set-role") return memberSetRole(rest, stdout);
  if (sub === "remove") return memberRemove(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(MEMBER_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown member subcommand: ${sub} (expected list|set-role|remove)`, {
    help: `${cliInvocation()} member --help`
  });
}
async function memberList(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs27({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "member list"
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, "/v0/members", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = { count: result.count, members: result.members };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  if (result.count > 0) {
    rec.help = [
      `${cliInvocation()} member set-role --remote ${remote} <user_id> <role>`,
      `${cliInvocation()} member remove --remote ${remote} <user_id>`
    ];
  }
  stdout(render(rec, resolveMode(values)));
}
async function memberSetRole(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs27({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "member set-role"
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }
  const userId = positionals[0]?.trim();
  const role = positionals[1]?.trim();
  if (!userId || !role) {
    throw new CliError("USAGE", "member set-role requires <user_id> and <role> positionals", {
      help: `${cliInvocation()} member set-role --remote <url> <user_id> <role>`
    });
  }
  if (!isRole(role)) {
    throw new CliError("USAGE", `<role> must be one of: ${ROLES.join(", ")}`, {
      help: `${cliInvocation()} member set-role --remote <url> ${userId} writer`
    });
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, `/v0/members/${encodeURIComponent(userId)}/role`, {
      method: "PUT",
      authToken,
      body: { role }
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = {
    user_id: result.user_id,
    bundle: result.bundle,
    role: result.role,
    changed: result.changed
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}
async function memberRemove(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs27({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "member remove"
  );
  if (values.help) {
    stdout(MEMBER_USAGE);
    return;
  }
  const userId = positionals[0]?.trim();
  if (!userId) {
    throw new CliError("USAGE", "member remove requires a <user_id> positional", {
      help: `${cliInvocation()} member remove --remote <url> <user_id>`
    });
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, `/v0/members/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      authToken
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = {
    user_id: result.user_id,
    bundle: result.bundle,
    changed: result.changed,
    revoked_keys: result.revoked_keys
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}

// src/commands/key.ts
import { parseArgs as parseArgs28 } from "node:util";
var KEY_USAGE = `agentstate-lite key \u2014 mint, list, or revoke API keys for a remote bundle

Usage:
  agentstate-lite key mint   --remote <url> [--label <s>]
  agentstate-lite key mint   --remote <url> --agent <name> [--label <s>]
  agentstate-lite key list   --remote <url> [--fields <a,b,... | all>]
  agentstate-lite key revoke --remote <url> <key_id>

A bare 'key mint' mints a key for the CALLER (self-mint; any member may do this).
'key mint --agent <name>' is admin-only: it creates a brand-new synthetic agent user and
mints its first key \u2014 there is no way to mint a credential for an EXISTING user (a human
joins via an invite only; see 'join').

The minted secret is printed EXACTLY ONCE in the mint receipt and is NEVER stored
automatically \u2014 save it yourself, e.g. via
'agentstate-lite login --remote <url> --api-key <key>' (substituting the printed value),
or your own secret store. 'key list' never shows the secret (prefix/last_four only).
'key revoke' is idempotent (changed:false if already revoked or absent).

Options:
  --label <s>     Human-readable label for the minted key
  --fields <a,b|all>  [list] Add columns to the minimal {id,key_prefix,label,status} row, or 'all'
                  for the full record (last_four, user_id, created_by, created_at, \u2026) \u2014 never the secret
  --agent <name>  Mint a NEW agent user's first key (admin-only)
  --remote <url>  Base URL of the auth-gated remote deployment
                  (falls back to AGENTSTATE_LITE_REMOTE if set)
  --json          Emit compact JSON instead of TOON
  -h, --help      Show this help
`;
async function key(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const sub = argv[0];
  const rest = argv.slice(1);
  if (sub === "mint") return keyMint(rest, stdout);
  if (sub === "list") return keyList(rest, stdout);
  if (sub === "revoke") return keyRevoke(rest, stdout);
  if (sub === "-h" || sub === "--help" || sub === void 0) {
    stdout(KEY_USAGE);
    return;
  }
  throw new CliError("USAGE", `unknown key subcommand: ${sub} (expected mint|list|revoke)`, {
    help: `${cliInvocation()} key --help`
  });
}
async function keyMint(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs28({
      args: argv,
      options: {
        label: { type: "string" },
        agent: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "key mint"
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }
  const label = values.label?.trim();
  const agent = values.agent?.trim();
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, "/v0/keys", {
      method: "POST",
      authToken,
      body: {
        ...agent ? { new_agent_label: agent } : {},
        ...label ? { label } : {}
      }
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const rec = {
    id: result.id,
    user_id: result.user_id,
    label: result.label,
    key_prefix: result.key_prefix,
    last_four: result.last_four,
    api_key: result.api_key,
    note: `save this key now \u2014 it will not be shown again. Store it with '${cliInvocation()} login --remote <url> --api-key <key>' (substitute the real url/key) or your own secret store.`
  };
  if (result.bootstrap) rec.bootstrap = true;
  stdout(render(rec, resolveMode(values)));
}
var KEY_DEFAULT_COLS = ["id", "key_prefix", "label", "status"];
var KEY_ALL_COLS = [
  ...KEY_DEFAULT_COLS,
  "last_four",
  "user_id",
  "created_by",
  "created_at",
  "revoked_at"
];
function keyCols(fieldsFlag) {
  if (fieldsFlag === void 0) return KEY_DEFAULT_COLS;
  const req = fieldsFlag.trim().toLowerCase();
  if (req === "all" || req === "*") return KEY_ALL_COLS;
  const extra = fieldsFlag.split(",").map((f) => f.trim()).filter((f) => f && !KEY_DEFAULT_COLS.includes(f));
  return [...KEY_DEFAULT_COLS, ...extra];
}
async function keyList(argv, stdout) {
  const { values } = parseOrUsage(
    () => parseArgs28({
      args: argv,
      options: {
        fields: { type: "string" },
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "key list"
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, "/v0/keys", { authToken });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  const cols = keyCols(values.fields);
  const rows = result.keys.map((k) => {
    const full = {
      id: k.id,
      key_prefix: k.keyPrefix,
      label: k.label ?? "",
      status: k.revokedAt ? "revoked" : "active",
      last_four: k.lastFour,
      user_id: k.userId,
      created_by: k.createdBy,
      created_at: k.createdAt,
      revoked_at: k.revokedAt ?? ""
    };
    const row = {};
    for (const c of cols) if (c in full) row[c] = full[c];
    return row;
  });
  const rec = { count: result.count, keys: rows };
  if (result.bootstrap) rec.bootstrap = true;
  const remote = values.remote ?? "<url>";
  rec.help = result.count === 0 ? [`no API keys yet \u2014 mint one with \`${cliInvocation()} key mint --remote ${remote}\``] : [
    `${cliInvocation()} key revoke --remote ${remote} <key_id>`,
    `pass \`--fields all\` for the full record (user_id, created_at, \u2026)`
  ];
  stdout(render(rec, resolveMode(values)));
}
async function keyRevoke(argv, stdout) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs28({
      args: argv,
      options: {
        remote: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" }
      },
      allowPositionals: true
    }),
    "key revoke"
  );
  if (values.help) {
    stdout(KEY_USAGE);
    return;
  }
  const id = positionals[0]?.trim();
  if (!id) {
    throw new CliError("USAGE", "key revoke requires a <key_id> positional", {
      help: `${cliInvocation()} key revoke --remote <url> <key_id>`
    });
  }
  const { base, authToken } = await resolveAuthContext(values.remote);
  let result;
  try {
    result = await authRequest(base, `/v0/keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
      authToken
    });
  } catch (err) {
    throw classifyBundleError(err, values.remote);
  }
  stdout(render({ id: result.id, changed: result.changed }, resolveMode(values)));
}

// src/reference.ts
var DESCRIPTION = "read and write a local OKF knowledge bundle (context notes, docs, cross-links, static-HTML view)";
var COMMAND_GROUPS = [
  {
    group: "Bundle",
    commands: [
      {
        usage: "init [--dir <path>] [--okf-version <v>] [--recipe <name-or-path>]",
        summary: "Create (or open) an OKF knowledge bundle in a directory \u2014 greenfield setup; a project that already shares a board is set up by sync, not init"
      },
      {
        usage: "view [--dir <path>] [--out <path>] [--name <label>] [--remote <url>]",
        summary: "Bake the bundle into one self-contained static HTML file"
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
        usage: "doc read <id> [--out (<path> | -) | --field <name>] [--remote <url>]",
        summary: "Read a doc (or pull its raw markdown bytes to disk, or print one raw field for scripting)"
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
        usage: "link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>]) [--remote <url>]",
        summary: "Add a cross-link, or show a concept's links + backlinks (each carrying link text; --text filters both directions by exact match)"
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
        usage: 'new "<Kind>" <id> --<field> <value> [...] [--link "<type>=<target-id>" ...] [--no-prefix] [--actor <n>] [--remote <url>]',
        summary: 'Create a new instance of a bundle-declared kind \u2014 e.g. new "Context Note" <id> for a note (validates strictly); repeatable --link wires typed cross-links in the same step'
      },
      {
        usage: "kinds [--remote <url>]",
        summary: "List the kind conventions this bundle declares (required/optional fields, typed-link vocabulary, horizon)"
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
        summary: "Apply a recipe's (built-in name or folder path) convention docs to the bundle (idempotent)"
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
        summary: "Boot the local web UI (board / doc detail / admin / graph) \u2014 same origin, loopback-only"
      },
      {
        // NOTE: `sync --migrate` (TEMPORARY, founders' one-time act — see commands/sync-migrate.ts)
        // is deliberately ABSENT here: it appears in `sync --help` only (discoverable, not taught),
        // so the skill channels and the compact reference never teach it.
        usage: "sync [--pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]",
        summary: "Share the board branch with a remote \u2014 commits, pulls, and pushes (git tier; --pull-only skips commit+push). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch"
      }
    ]
  },
  {
    group: "Identity",
    commands: [
      {
        usage: "login --remote <url> --api-key <key>",
        summary: "Store an API key for a gated --remote deployment (keyed by origin; join redeems an invite instead)"
      },
      {
        usage: "join --remote <url> --invite <token> [--display <name>]",
        summary: "Redeem an invite token to join a remote bundle (stores the returned API key; never prints it)"
      },
      {
        usage: "whoami [--remote <url>]",
        summary: "List the remote origins you hold a key for (offline), or (with --remote) the live remote identity + bundle memberships"
      }
    ]
  },
  {
    group: "Invites & members (admin)",
    commands: [
      {
        usage: "invite create --remote <url> --role <admin|writer|reader> [--expires-in <hours>] [--display-hint <s>]",
        summary: "Create a join invite for a remote bundle (prints the token once)"
      },
      {
        usage: "invite list --remote <url> [--fields <a,b|all>]",
        summary: "List invites (minimal id/role/expires/status by default; --fields all for the full record)"
      },
      {
        usage: "invite revoke --remote <url> <invite_id>",
        summary: "Revoke an invite (idempotent)"
      },
      {
        usage: "member list --remote <url>",
        summary: "List a remote bundle's members and their roles"
      },
      {
        usage: "member set-role --remote <url> <user_id> <role>",
        summary: "Change a member's role (idempotent)"
      },
      {
        usage: "member remove --remote <url> <user_id>",
        summary: "Remove a member and revoke all their API keys (idempotent)"
      }
    ]
  },
  {
    group: "API keys",
    commands: [
      {
        usage: "key mint --remote <url> [--label <s>]",
        summary: "Mint an API key for YOURSELF (self-serve; any member may do this)"
      },
      {
        usage: "key mint --remote <url> --agent <name> [--label <s>]",
        summary: "Mint a NEW agent user's first key (admin-only; prints the key once)"
      },
      {
        usage: "key list --remote <url> [--fields <a,b|all>]",
        summary: "List API keys (minimal id/prefix/label/status; --fields all for more \u2014 never the secret)"
      },
      {
        usage: "key revoke --remote <url> <key_id>",
        summary: "Revoke an API key you own, or (admin) any key (idempotent)"
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
  return `bundle resolution, in order: an explicit --remote/--dir flag wins outright; else AGENTSTATE_LITE_REMOTE=<url> sets a session remote default; else a committed .agentstate.json ({ "bundle": "<url-or-path>" }) at or above the cwd is read (a URL resolves like --remote, a path like --dir, relative to the file's own directory); else local discovery walks up from the cwd for index.md. Explicit beats ambient beats committed beats discovered: an explicit --dir always wins over BOTH the env default and the project binding, silently, no error \u2014 only an explicit --remote together with an explicit --dir is still a conflict`;
}
function commandReference(invocation) {
  const commands = {};
  for (const { group, commands: refs } of COMMAND_GROUPS) {
    commands[group] = refs.map((c) => `${c.usage} \u2014 ${c.summary}`);
  }
  return { commands, kinds: kindsPointer(invocation), remoteEnv: remoteEnvPointer() };
}
function commandName(usage) {
  const stop = usage.search(/[<[("]|\s--|\s-\w/);
  return (stop === -1 ? usage : usage.slice(0, stop)).trim();
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
  let line = "";
  for (const word of words) {
    const candidate = line.length === 0 ? word : `${line} ${word}`;
    if (candidate.length > width && line.length > 0) {
      wrapped.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line.length > 0) wrapped.push(line);
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
import { parseArgs as parseArgs30 } from "node:util";
import path11 from "node:path";

// src/commands/hook.ts
import { existsSync as existsSync5, readFileSync as readFileSync4, writeFileSync as writeFileSync2, rmSync } from "node:fs";
import { homedir as homedir5 } from "node:os";
import { join as join7, dirname as dirname3 } from "node:path";
import { mkdirSync as mkdirSync2 } from "node:fs";
import { parseArgs as parseArgs29 } from "node:util";
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
  --scope global    Write to the USER home (~/.claude, ~/.codex, ~/.config/opencode)
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
function targetsFor(base) {
  return {
    claudeSettings: join7(base, ".claude", "settings.json"),
    codexHooks: join7(base, ".codex", "hooks.json"),
    opencodePlugin: join7(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME)
  };
}
function readSettings(path12) {
  if (!existsSync5(path12)) return {};
  try {
    return JSON.parse(readFileSync4(path12, "utf8"));
  } catch {
    return {};
  }
}
function writeSettings(path12, settings) {
  mkdirSync2(dirname3(path12), { recursive: true });
  writeFileSync2(path12, `${JSON.stringify(settings, null, 2)}
`);
}
function opencodePluginInstalled(path12) {
  if (!existsSync5(path12)) return false;
  try {
    return readFileSync4(path12, "utf8").includes(OPENCODE_MANAGED_MARKER);
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
function hookNeedsUpdate(bases = [process.cwd(), homedir5()]) {
  for (const base of bases) {
    const targets = targetsFor(base);
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
async function hook(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs29({
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
  const base = deps.base ?? (scope === "global" ? homedir5() : process.cwd());
  const targets = targetsFor(base);
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
    const codexConfigPath = join7(base, ".codex", "config.toml");
    try {
      const current = existsSync5(codexConfigPath) ? readFileSync4(codexConfigPath, "utf8") : "";
      const [updated, changed2] = computeCodexConfigUpdate(current);
      if (changed2) {
        mkdirSync2(dirname3(codexConfigPath), { recursive: true });
        writeFileSync2(codexConfigPath, updated);
      }
    } catch (err) {
      errors.push(`${codexConfigPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    try {
      mkdirSync2(dirname3(targets.opencodePlugin), { recursive: true });
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync5(targets.opencodePlugin) ? readFileSync4(targets.opencodePlugin, "utf8") : void 0;
      if (current !== void 0 && !current.includes(OPENCODE_MANAGED_MARKER)) {
        errors.push(`${targets.opencodePlugin}: refusing to overwrite unmanaged OpenCode plugin`);
      } else if (current !== next) {
        writeFileSync2(targets.opencodePlugin, next);
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
  for (const path12 of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path12));
    if (didChange) {
      writeSettings(path12, updated);
      changed = true;
    }
  }
  if (opencodePluginInstalled(targets.opencodePlugin)) {
    rmSync(targets.opencodePlugin, { force: true });
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

// src/commands/home.ts
var HOME_RECENT_LIMIT = 5;
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
    return summarizeDocs(docs, collapseHomeDirectory2(bundle.root));
  } catch {
    return { root: collapseHomeDirectory2(bundle.root), unreadable: true };
  }
}
async function discoverSummarizeBundle(startDir) {
  try {
    const root = await findBundleRoot(path11.resolve(startDir));
    return root ? defaultSummarizeBundle(root) : null;
  } catch {
    return null;
  }
}
var BOARD_UP_TO_DATE = "up to date";
var BOARD_OFFLINE_NOTE = "board sync offline \u2014 showing last known state";
var BOARD_CHANGES_SHOWN_LIMIT = 10;
function boardFirstContactLine(inv) {
  return `not yet provisioned \u2014 run \`${inv} sync\` to set it up`;
}
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
function docLine(row) {
  const kindPart = row.kind && row.kind !== "unknown" ? `${row.kind} ` : "";
  return `${row.actor} \xB7 ${row.verb} ${kindPart}"${row.title}"`;
}
function unpushedLine(n) {
  return `${n} local board ${n === 1 ? "commit" : "commits"} not yet pushed \u2014 run sync when online`;
}
function uncommittedLine(n) {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} \u2014 run sync to share ${n === 1 ? "it" : "them"}`;
}
function countOr(live, cached) {
  return live ?? cached ?? 0;
}
function buildBoardBlock(status2, pull2, inv) {
  if (!status2) return {};
  if (status2.state === "unprovisioned") return { firstContact: boardFirstContactLine(inv) };
  const rec = {};
  if (pull2?.announcement) Object.assign(rec, pull2.announcement);
  const rows = status2.cache?.delta ?? [];
  const visible = rows.filter((r) => !status2.selfActors.includes(r.actor));
  if (visible.length > 0) {
    rec.since_this_machine_last_synced = sinceLine(visible);
    rec.changes = visible.slice(0, BOARD_CHANGES_SHOWN_LIMIT).map(docLine);
  }
  const unpushed = countOr(status2.unpushed, status2.cache?.unpushedCount);
  const uncommitted = countOr(status2.uncommitted, status2.cache?.uncommittedCount);
  if (unpushed > 0) rec.unpushed = unpushedLine(unpushed);
  if (uncommitted > 0) rec.uncommitted = uncommittedLine(uncommitted);
  const notes = [];
  if (pull2?.offline) notes.push(BOARD_OFFLINE_NOTE);
  if (pull2?.notes) notes.push(...pull2.notes);
  if (status2.cache?.note) notes.push(status2.cache.note);
  if (notes.length > 0) rec.note = notes.join("; ");
  if (status2.cache && !pull2?.refreshed && Object.keys(rec).length > 0) {
    rec.as_of = status2.cache.updatedAt;
  }
  if (Object.keys(rec).length === 0) return { block: BOARD_UP_TO_DATE };
  return { block: rec };
}
async function defaultLoadBoardStatus(dir) {
  try {
    const top = repoTopLevel(retargetBoardInterior(dir ?? process.cwd()));
    if (!top) return null;
    const boardPath = path11.join(top, BUNDLE_DIR);
    if (!isProvisioned(top)) {
      const probed = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0 || runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      return probed ? { state: "unprovisioned" } : null;
    }
    const key2 = resolveBundleKey(boardPath);
    const state = await readSyncState(key2);
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
function buildHomeView(creds, deps, summary, remote, remoteKeyStored, binding, bindingError, board, hookUpdate) {
  const inv = deps.invocation();
  let auth;
  if (remote && remoteKeyStored) {
    auth = {
      status: "key-stored",
      note: `an API key for this remote is stored locally; this home view is OFFLINE \u2014 run \`${inv} whoami --remote ${remote}\` to verify the live identity`
    };
  } else {
    auth = {
      status: "logged-out",
      help: `not logged in to any remote \u2014 local bundles need no login; for a shared remote, get its URL + an invite from a teammate \u2192 \`${inv} join --remote <url> --invite <token>\``
    };
  }
  const ref = commandReference(inv);
  const view2 = {
    "agentstate-lite": { bin: deps.binPath(), description: DESCRIPTION },
    auth
  };
  if (remote) {
    const remoteBlock = {
      url: remote,
      help: [
        `${inv} whoami --remote ${remote}`,
        `${inv} list --remote ${remote}`,
        `${inv} status --remote ${remote}`
      ]
    };
    if (binding && binding.target === remote) remoteBlock.via = binding.file;
    view2.remote = remoteBlock;
  } else if (summary && "unreadable" in summary) {
    const bundleBlock = {
      root: summary.root,
      status: "unreadable",
      help: `a document in this bundle could not be read \u2014 run \`${deps.invocation()} list\` to surface the parse error`
    };
    if (binding) bundleBlock.via = binding.file;
    view2.bundle = bundleBlock;
  } else if (summary) {
    const bundleBlock = {
      root: summary.root,
      docs: summary.docs,
      by_type: summary.byType
    };
    if (summary.docs > 0) {
      bundleBlock.recent = summary.recent;
      bundleBlock.next = [
        `${deps.invocation()} list`,
        `${deps.invocation()} status`,
        `${deps.invocation()} view`
      ];
    } else {
      bundleBlock.help = `${deps.invocation()} new "Context Note" <id> \u2026 | ${deps.invocation()} doc write \u2026 \u2014 create the first doc`;
    }
    if (binding) bundleBlock.via = binding.file;
    view2.bundle = bundleBlock;
  } else if (!board?.firstContact && board?.block === void 0) {
    view2.getting_started = `no OKF bundle found in this directory \u2014 run \`${deps.invocation()} init\` to create one`;
    if (binding) {
      view2.getting_started += ` (project binding ${binding.file} -> ${binding.target} did not resolve to a bundle)`;
    }
  }
  if (board?.firstContact) {
    view2.board = board.firstContact;
  } else if (board?.block !== void 0) {
    view2.board = board.block;
  }
  if (hookUpdate) {
    view2.hook_update = hookUpdate;
  }
  if (bindingError) {
    view2.project_binding_error = bindingError;
  }
  if (!remote) {
    const storedRemotes = creds?.remotes ? Object.keys(creds.remotes).sort() : [];
    if (storedRemotes.length > 0) {
      view2.remotes = {
        stored: storedRemotes,
        help: `you hold a key for these remote workspace(s) \u2014 reach one with \`${inv} list --remote <origin>\` (or \`${inv} whoami --remote <origin>\`)`
      };
    }
  }
  const compact = compactCommandReference(inv);
  view2.commands = compact.commands;
  view2.commands_help = compact.commands_help;
  view2.kinds = ref.kinds;
  view2.remote_env = ref.remoteEnv;
  return view2;
}
async function home(argv, deps = {}) {
  const loadCreds = deps.loadCreds ?? loadCredentials;
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  let remote;
  let dir;
  let jsonMode = false;
  try {
    const parsed = parseArgs30({
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
        if (found.isRemote) {
          remote = found.target;
        } else {
          dir = found.target;
        }
      }
    } catch (err) {
      bindingError = err instanceof Error ? err.message : String(err);
    }
  }
  const summarize = deps.summarizeBundle ?? (() => defaultSummarizeBundle(dir));
  let creds = null;
  try {
    creds = await loadCreds();
  } catch {
    creds = null;
  }
  let remoteKeyStored = false;
  if (remote) {
    try {
      remoteKeyStored = Boolean(creds?.remotes?.[normalizeServer(remote).resource]);
    } catch {
    }
  }
  let summary = null;
  if (!remote) {
    try {
      summary = await summarize();
    } catch {
      summary = null;
    }
  }
  const invocation = deps.invocation ?? cliInvocation;
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
        creds,
        {
          binPath: deps.binPath ?? binPath,
          invocation
        },
        summary,
        remote,
        remoteKeyStored,
        binding,
        bindingError,
        board,
        hookUpdate
      ),
      // Honor --json (JSON is equally offline/never-throw); default remains TOON, the format the
      // SessionStart hook ingests as ambient context.
      jsonMode ? "json" : "default"
    )
  );
}

// src/commands/session-start.ts
import { parseArgs as parseArgs31 } from "node:util";
var SESSION_START_PULL_BUDGET_MS = 7e3;
var SESSION_START_CONNECT_TIMEOUT_SECONDS = 5;
var MIN_USEFUL_BUDGET_MS = 250;
var SESSION_START_USAGE = `agentstate-lite session-start \u2014 the SessionStart hook payload (pull the board, then render home)

Usage:
  agentstate-lite session-start [--dir <path>] [--json]

Runs a time-boxed, best-effort pull of this repo's shared board (provisioning the checkout from
origin/board on a fresh clone \u2014 announced, never silent), then renders the home view with the
board-awareness block: what changed since this machine last synced, attributed per teammate, plus
the unpushed/uncommitted backstop. Every pull failure \u2014 offline, auth, a busy repo, a lost time
box \u2014 falls through to the render (exit 0): you always get the last known state, honestly labeled.

This is the command \`hook install\` wires as the SessionStart hook for Claude Code, Codex, and
OpenCode. Run it directly to see exactly what a new session will see.

Options:
  --dir <path>   Directory to run from (default: the cwd)
  --json         Emit compact JSON instead of TOON
  -h, --help     Show this help
`;
var OFFLINE_REASONS = /* @__PURE__ */ new Set(["network", "auth", "busy", "git-missing"]);
async function sessionStartPull(dir, budgetMs = SESSION_START_PULL_BUDGET_MS, now = Date.now) {
  const deadline = now() + budgetMs;
  const remaining = () => Math.max(0, deadline - now());
  try {
    const startDir = retargetBoardInterior(dir ?? process.cwd());
    if (remaining() < MIN_USEFUL_BUDGET_MS) return { offline: true };
    let outcome;
    try {
      outcome = provisionBoardWorktree(startDir, {
        fetchTimeoutMs: remaining(),
        connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS
      });
    } catch {
      return void 0;
    }
    if (outcome.kind === "no_repo" || outcome.kind === "no_board") return void 0;
    const boardPath = outcome.boardPath;
    const announcement = provisionAnnouncement(outcome);
    const key2 = resolveBundleKey(boardPath);
    await refreshMarker(key2);
    if (remaining() < MIN_USEFUL_BUDGET_MS) {
      return { offline: true, boardPath, ...announcement ? { announcement } : {} };
    }
    const storedCursor = await readCursor(key2);
    const startHead = currentHead(boardPath);
    const ff = ffPull(boardPath, {
      fetchTimeoutMs: remaining(),
      connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS
    });
    if (ff.swallowed) {
      if (OFFLINE_REASONS.has(ff.swallowed)) {
        return { offline: true, boardPath, ...announcement ? { announcement } : {} };
      }
      return {
        offline: false,
        boardPath,
        ...announcement ? { announcement } : {},
        notes: [`board pull skipped (${ff.swallowed}) \u2014 run \`${cliInvocation()} sync\` to reconcile`]
      };
    }
    const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
    const postPullHead = currentHead(boardPath);
    const delta = changesSince(boardPath, cursorToken ?? startHead);
    if (delta.ok) {
      await writeCursor(key2, { tier: "git", token: postPullHead });
      await writeCache(key2, {
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        delta: toDeltaRows(delta.changes),
        unpushedCount: unpushedCount(boardPath) ?? 0,
        uncommittedCount: countUncommitted(boardPath)
      });
    } else {
      await recordReanchor(
        key2,
        { tier: "git", token: postPullHead },
        { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) }
      );
    }
    return { offline: false, refreshed: true, boardPath, ...announcement ? { announcement } : {} };
  } catch {
    return { offline: true };
  }
}
async function sessionStart(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs31({
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
      new Promise((resolve3) => {
        timer = setTimeout(() => resolve3("timeout"), budgetMs);
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
    boardPull: outcome,
    ...projectDir !== void 0 ? {
      summarizeBundle: () => boardPath !== void 0 ? defaultSummarizeBundle(boardPath) : discoverSummarizeBundle(projectDir)
    } : {}
  });
}

// src/cli.ts
import { parseArgs as parseArgs32 } from "node:util";
var KNOWN_COMMANDS = [
  "init",
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
  "view",
  "serve",
  "ui",
  "sync",
  "login",
  "whoami",
  "join",
  "invite",
  "member",
  "key",
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
    const { positionals } = parseArgs32({
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
    tokens = parseArgs32({
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
      view: wrap2(view),
      serve: wrap2(serve2),
      ui: wrap2(ui),
      sync: wrap2(sync),
      login: wrap2(login),
      whoami: wrap2(whoami),
      join: wrap2(join6),
      invite: wrap2(invite),
      member: wrap2(member),
      key: wrap2(key),
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
