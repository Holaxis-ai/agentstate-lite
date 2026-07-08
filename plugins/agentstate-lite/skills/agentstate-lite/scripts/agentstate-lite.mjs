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
      const delimiter3 = typeof opts.excerpt === "string" ? opts.excerpt : sep || opts.delimiters[0];
      const idx = file.content.indexOf(delimiter3);
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
function isSafeUnquoted(value, delimiter3 = DEFAULT_DELIMITER) {
  if (!value) return false;
  if (value !== value.trim()) return false;
  if (isBooleanOrNullLiteral(value) || isNumericLike(value)) return false;
  if (value.includes(":")) return false;
  if (value.includes('"') || value.includes("\\")) return false;
  if (/[[\]{}]/.test(value)) return false;
  if (/[\u0000-\u001F]/.test(value)) return false;
  if (value.includes(delimiter3)) return false;
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
function encodePrimitive(value, delimiter3) {
  if (value === null) return NULL_LITERAL;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  return encodeStringLiteral(value, delimiter3);
}
function encodeStringLiteral(value, delimiter3 = DEFAULT_DELIMITER) {
  if (isSafeUnquoted(value, delimiter3)) return value;
  return `"${escapeString(value)}"`;
}
function encodeKey(key2) {
  if (isValidUnquotedKey(key2)) return key2;
  return `"${escapeString(key2)}"`;
}
function encodeAndJoinPrimitives(values, delimiter3 = DEFAULT_DELIMITER) {
  return values.map((v) => encodePrimitive(v, delimiter3)).join(delimiter3);
}
function formatHeader(length, options2) {
  const key2 = options2?.key;
  const fields = options2?.fields;
  const delimiter3 = options2?.delimiter ?? ",";
  let header = "";
  if (key2 != null) header += encodeKey(key2);
  header += `[${length}${delimiter3 !== DEFAULT_DELIMITER ? delimiter3 : ""}]`;
  if (fields) {
    const quotedFields = fields.map((f) => encodeKey(f));
    header += `{${quotedFields.join(delimiter3)}}`;
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
function encodeInlineArrayLine(values, delimiter3, prefix) {
  const header = formatHeader(values.length, {
    key: prefix,
    delimiter: delimiter3
  });
  const joinedValue = encodeAndJoinPrimitives(values, delimiter3);
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
function transformChildren(value, replacer, path11) {
  if (isJsonObject(value)) return transformObject(value, replacer, path11);
  if (isJsonArray(value)) return transformArray(value, replacer, path11);
  return value;
}
function transformObject(obj, replacer, path11) {
  const result = {};
  for (const [key2, value] of Object.entries(obj)) {
    const childPath = [...path11, key2];
    const replacedValue = replacer(key2, value, childPath);
    if (replacedValue === void 0) continue;
    result[key2] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
  }
  return result;
}
function transformArray(arr, replacer, path11) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const childPath = [...path11, i];
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
function collapseHomeDirectory(path11, homeDir = homedir()) {
  if (!path11.startsWith(homeDir)) {
    return path11;
  }
  return `~${path11.slice(homeDir.length)}`;
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
  readFileSync: (path11, encoding) => readFileSync(path11, encoding)
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
  const path11 = options2.entry.replaceAll("\\", "/");
  if (path11.includes("/_npx/") || /\/dlx-[^/]+\//.test(path11) || path11.includes("/pnpm/dlx/") || path11.includes("/bun/install/cache/")) {
    return { kind: "npx" };
  }
  const homebrewFormula = homebrewFormulaFromPath(path11, env);
  if (homebrewFormula) {
    return { kind: "homebrew", formula: homebrewFormula };
  }
  const pnpmHome = normalizePathRoot(env.PNPM_HOME);
  if (isPathInsideRoot(path11, pnpmHome) || isKnownPnpmGlobalStore(path11, env)) {
    return { kind: "pnpm-global" };
  }
  if (isKnownNpmGlobalInstall(path11, env)) {
    return { kind: "npm-global" };
  }
  return { kind: "unknown" };
}
function normalizePathRoot(path11) {
  const normalized = path11?.replaceAll("\\", "/").replace(/\/+$/, "");
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function isPathInsideRoot(path11, root) {
  return root !== void 0 && (path11 === root || path11.startsWith(`${root}/`));
}
function homebrewFormulaFromPath(path11, env) {
  for (const root of homebrewCellarRoots(env)) {
    if (!isPathInsideRoot(path11, root)) {
      continue;
    }
    const relative = path11.slice(root.length).replace(/^\/+/, "");
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
function isKnownPnpmGlobalStore(path11, env) {
  return pnpmGlobalStoreRoots(env).some((root) => {
    if (!isPathInsideRoot(path11, root)) {
      return false;
    }
    const relative = path11.slice(root.length).replace(/^\/+/, "");
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
function isKnownNpmGlobalInstall(path11, env) {
  return npmGlobalNodeModulesRoots(env).some((root) => isPathInsideRoot(path11, root)) || isKnownVersionManagerNpmGlobal(path11, env);
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
function isKnownVersionManagerNpmGlobal(path11, env) {
  return versionManagerNodeRoots(env).some((root) => isPathInsideRoot(path11, root) && path11.includes("/lib/node_modules/"));
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
  return new Promise((resolve4) => {
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
      resolve4({ ok: false, message: error.message });
    });
    child.on("close", (code) => {
      resolve4(code === 0 ? { ok: true } : { ok: false, message: `${plan.command} exited with code ${code}` });
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
  const realpath = options2.realpath ?? ((path11) => realpathSync(path11));
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
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync2, realpathSync as realpathSync2, statSync, writeFileSync } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { basename as basename3, delimiter, dirname as dirname2, join as join2, resolve } from "node:path";
var OPENCODE_PLUGIN_MANAGED_PREFIX = "axi-sdk-js managed opencode plugin:";
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
function sanitizeOpenCodePluginFilePart(marker) {
  return marker.replace(/[^A-Za-z0-9._-]+/g, "_");
}
function sanitizeOpenCodeExportName(marker) {
  const name = marker.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join("");
  return `Axi${name || "Plugin"}AmbientContextPlugin`;
}
function buildOpenCodeAmbientPluginSource(marker, command, timeoutSeconds) {
  const exportName = sanitizeOpenCodeExportName(marker);
  const managedMarker = `${OPENCODE_PLUGIN_MANAGED_PREFIX} ${marker}`;
  return `// ${managedMarker}
// This file is generated by axi-sdk-js. It is safe to edit only if you remove the managed marker above.
import { spawn } from "node:child_process";

const command = ${JSON.stringify(command)};
const marker = ${JSON.stringify(marker)};
const ambientHeader = ${JSON.stringify(`## AXI ambient context: ${marker}`)};
const timeoutMs = ${JSON.stringify(timeoutSeconds * 1e3)};

function runAxiHomeView(cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, [], {
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

export const ${exportName} = async ({ directory }) => {
  const sessionCache = new Map();

  return {
    "experimental.chat.system.transform": async (input, output) => {
      const sessionID = input.sessionID ?? "__global__";
      let homeView = sessionCache.get(sessionID);
      if (homeView === undefined) {
        homeView = await runAxiHomeView(directory);
        sessionCache.set(sessionID, homeView);
      }

      if (homeView.length === 0) return;
      output.system.push(ambientHeader + "\\n" + homeView);
    },
  };
};
`;
}
function installOpenCodeAmbientPlugin(home2, marker, command, timeoutSeconds, onError) {
  const pluginPath = join2(home2, ".config", "opencode", "plugins", `axi-${sanitizeOpenCodePluginFilePart(marker)}.js`);
  const managedMarker = `${OPENCODE_PLUGIN_MANAGED_PREFIX} ${marker}`;
  const next = buildOpenCodeAmbientPluginSource(marker, command, timeoutSeconds);
  try {
    mkdirSync(dirname2(pluginPath), { recursive: true });
    const current = existsSync2(pluginPath) ? readFileSync2(pluginPath, "utf-8") : void 0;
    if (current !== void 0 && !current.includes(managedMarker)) {
      onError?.(`${pluginPath}: refusing to overwrite unmanaged OpenCode plugin`);
      return;
    }
    if (current !== next) {
      writeFileSync(pluginPath, next, "utf-8");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    onError?.(`${pluginPath}: ${message}`);
  }
}
function resolvePortableHookCommand(execPath, binaryNames, marker, context) {
  if (binaryNames.length === 0) {
    return execPath;
  }
  const resolvedExec = context.resolveRealPath(execPath);
  if (!resolvedExec) {
    return execPath;
  }
  for (const name of binaryNames) {
    if (!name.includes(marker)) {
      continue;
    }
    for (const dir of context.pathEntries) {
      if (!dir)
        continue;
      for (const ext of context.pathExtensions) {
        const candidate = join2(dir, `${name}${ext}`);
        const resolvedCandidate = context.resolveRealPath(candidate);
        if (resolvedCandidate && resolvedCandidate === resolvedExec) {
          return name;
        }
      }
    }
  }
  return execPath;
}
function buildDefaultPortableCommandContext() {
  const rawPath = process.env.PATH ?? process.env.Path ?? "";
  const pathEntries = rawPath.split(delimiter).filter(Boolean);
  const pathExtensions = process.platform === "win32" ? (process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";") : [""];
  return {
    pathEntries,
    pathExtensions,
    resolveRealPath: (absolutePath) => {
      try {
        const stat = statSync(absolutePath);
        if (!stat.isFile()) {
          return void 0;
        }
        return realpathSync2(absolutePath);
      } catch {
        return void 0;
      }
    }
  };
}
function shouldInstallHooksForNodeAxiExecPath(execPath, policy) {
  const normalized = resolve(execPath).replaceAll("\\", "/");
  if (!normalized.includes(policy.marker) || normalized.endsWith(".ts")) {
    return false;
  }
  const fileName = basename3(normalized);
  if (policy.binaryNames?.includes(fileName)) {
    return true;
  }
  return policy.distEntrypoints?.some((entrypoint) => normalized.endsWith(entrypoint.replaceAll("\\", "/"))) ?? false;
}
function inferHookOptions(execPath) {
  if (!execPath) {
    return void 0;
  }
  const normalized = execPath.replaceAll("\\", "/");
  const match = normalized.match(/(?:^|\/)dist\/bin\/([^/]+)\.js$/);
  if (match?.[1]) {
    const marker = match[1];
    return {
      execPath,
      marker,
      binaryNames: [marker],
      distEntrypoints: [`dist/bin/${marker}.js`]
    };
  }
  const fileName = normalized.split("/").pop() ?? "";
  if (!fileName || fileName.includes(".") || fileName === "node") {
    return void 0;
  }
  return {
    execPath,
    marker: fileName,
    binaryNames: [fileName],
    distEntrypoints: [`dist/bin/${fileName}.js`]
  };
}
function buildInferredHookInstallPolicy(marker, options2, inferred) {
  const binaryNames = options2.binaryNames ?? inferred.binaryNames;
  const distEntrypoints = options2.distEntrypoints ?? inferred.distEntrypoints;
  return (execPath) => shouldInstallHooksForNodeAxiExecPath(execPath, {
    marker,
    binaryNames,
    distEntrypoints
  });
}
function installSessionStartHooks(options2 = {}) {
  const inferred = inferHookOptions(options2.execPath ?? process.argv[1]);
  const marker = options2.marker ?? inferred?.marker;
  if (!marker) {
    return;
  }
  const execPath = resolve(options2.execPath ?? inferred?.execPath ?? process.argv[1] ?? "");
  if (!execPath) {
    return;
  }
  const defaultPolicyOptions = inferred ?? {
    execPath,
    marker,
    binaryNames: [marker],
    distEntrypoints: [`dist/bin/${marker}.js`]
  };
  const shouldInstall = options2.shouldInstall ?? buildInferredHookInstallPolicy(marker, options2, defaultPolicyOptions);
  if (shouldInstall && !shouldInstall(execPath)) {
    return;
  }
  const binaryNames = options2.binaryNames ?? inferred?.binaryNames ?? [];
  const command = resolvePortableHookCommand(execPath, binaryNames, marker, buildDefaultPortableCommandContext());
  const home2 = options2.homeDir ?? homedir2();
  const jsonTargets = [
    join2(home2, ".claude", "settings.json"),
    join2(home2, ".codex", "hooks.json")
  ];
  const codexConfigPath = join2(home2, ".codex", "config.toml");
  installOpenCodeAmbientPlugin(home2, marker, command, options2.timeoutSeconds ?? 10, options2.onError);
  for (const target of jsonTargets) {
    try {
      mkdirSync(dirname2(target), { recursive: true });
      const current = existsSync2(target) ? JSON.parse(readFileSync2(target, "utf-8")) : {};
      const [updated, changed] = computeSessionStartHookUpdate(current, {
        marker,
        command,
        timeoutSeconds: options2.timeoutSeconds
      });
      if (changed) {
        writeFileSync(target, `${JSON.stringify(updated, null, 2)}
`, "utf-8");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      options2.onError?.(`${target}: ${message}`);
    }
  }
  try {
    mkdirSync(dirname2(codexConfigPath), { recursive: true });
    const current = existsSync2(codexConfigPath) ? readFileSync2(codexConfigPath, "utf-8") : "";
    const [updated, changed] = computeCodexConfigUpdate(current);
    if (changed) {
      writeFileSync(codexConfigPath, updated, "utf-8");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    options2.onError?.(`${codexConfigPath}: ${message}`);
  }
}

// src/commands/init.ts
import { parseArgs } from "node:util";
import { existsSync as existsSync3 } from "node:fs";
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
  return new Promise((resolve4) => setTimeout(resolve4, ms));
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
function toStringArrayLenient(value, path11, docId, warnings) {
  if (!Array.isArray(value)) {
    if (value !== void 0) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${docId}' has a non-list '${path11}' (${describeShape(value)}; expected a list of strings); ignoring it.`,
        field: path11,
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
        message: `kind convention '${docId}' has a non-scalar member (${describeShape(v)}) in '${path11}'; skipping it.`,
        field: path11,
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
  const path11 = typeof fm.path === "string" && fm.path.trim() !== "" ? fm.path.trim() : void 0;
  const freshnessHorizon = typeof fm.freshness_horizon === "string" && fm.freshness_horizon.trim() !== "" ? fm.freshness_horizon.trim() : void 0;
  const kind2 = { id: doc2.id, title, governs, fields: { required, optional, values, terminal } };
  if (path11 !== void 0) kind2.path = path11;
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
import { realpathSync as realpathSync3 } from "node:fs";
import { delimiter as delimiter2, join as join3 } from "node:path";
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
    return realpathSync3(p);
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
  const dirs = (process.env.PATH ?? "").split(delimiter2).filter(Boolean);
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
  const path11 = url.pathname.replace(/\/+$/, "");
  return { base: url.origin + path11, resource: url.origin };
}

// src/credentials.ts
import { chmod, mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { homedir as homedir4 } from "node:os";
import { join as join4 } from "node:path";
var CRED_DIR_NAME = ".agentstate";
var CRED_FILE_NAME = "okf-config.json";
var DIR_MODE = 448;
var FILE_MODE = 384;
function credentialsDir(home2 = homedir4()) {
  return join4(home2, CRED_DIR_NAME);
}
function credentialsPath(home2 = homedir4()) {
  return join4(credentialsDir(home2), CRED_FILE_NAME);
}
async function writeFileAtomic0600(dir, fileName, content) {
  await mkdir(dir, { recursive: true, mode: DIR_MODE });
  await chmod(dir, DIR_MODE);
  const path11 = join4(dir, fileName);
  const tmpPath = join4(dir, `.${fileName}.${randomBytes(8).toString("hex")}.tmp`);
  const handle = await open(tmpPath, "wx", FILE_MODE);
  try {
    await handle.writeFile(content);
    await handle.chmod(FILE_MODE);
  } finally {
    await handle.close();
  }
  try {
    await rename(tmpPath, path11);
  } catch (err) {
    await unlink(tmpPath).catch(() => {
    });
    throw err;
  }
}
async function saveCredentials(creds, home2 = homedir4()) {
  await writeFileAtomic0600(
    credentialsDir(home2),
    CRED_FILE_NAME,
    JSON.stringify(creds, null, 2) + "\n"
  );
}
async function loadCredentials(home2 = homedir4()) {
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
async function getApiKeyForOrigin(origin, home2 = homedir4()) {
  const creds = await loadCredentials(home2);
  const key2 = creds?.remotes?.[origin]?.api_key;
  return isNonEmptyString(key2) ? key2 : void 0;
}
async function saveApiKeyForOrigin(origin, apiKey, home2 = homedir4()) {
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
    if (existsSync3(path6.join(cur, ".git"))) return true;
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
  const text = values.text?.trim() || to;
  const href = relativeHref(from, to);
  const normalizedTo = to.replace(/^\/+/, "").replace(/\.md$/, "");
  if (isReservedFile(pathFromConceptId(normalizedTo))) {
    throw new CliError(
      "USAGE",
      `'${to}' names a reserved OKF file (index.md/log.md), which is never a concept document and cannot be a link target`,
      { help: `${cliInvocation()} list` }
    );
  }
  const bundle = await openBundle(values.dir, await resolveRemoteFlag(values.remote, values.dir));
  const mode = resolveMode(values);
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
      throw classifyBundleError(err, values.remote);
    }
    const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo);
    if (already) {
      stdout(
        render(
          {
            link: "exists",
            from: source.id,
            to: normalizedTo,
            changed: false,
            help: [`${cliInvocation()} link show ${normalizedTo}`]
          },
          mode
        )
      );
      return;
    }
    const trimmed = source.body.replace(/\s*$/, "");
    const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})
`;
    const nextFrontmatter = values["keep-timestamp"] ? source.frontmatter : { ...source.frontmatter, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
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
        remoteUrl: values.remote
      });
      const receipt = {
        link: "added",
        from: saved.id,
        to,
        href,
        text,
        changed: true,
        help: [`${cliInvocation()} link show ${to}`]
      };
      if (warnings.length > 0) receipt.warnings = warnings;
      stdout(render(receipt, mode));
      return;
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
  --no-prefix           Use <id> verbatim \u2014 do NOT auto-prepend the kind's declared path prefix
  --json                Emit compact JSON instead of TOON
  -h, --help            Show this help
`;
var NEW_CONTROL_OPTIONS = {
  dir: { type: "string" },
  remote: { type: "string" },
  actor: { type: "string" },
  "no-prefix": { type: "boolean" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" }
};
function resolveInstanceId(kind2, id) {
  if (!kind2.path) return id;
  const prefix = kind2.path.replace(/\/+$/, "") + "/";
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
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
  const req = kind2.fields.required.filter((f) => f !== "actor");
  const opt = kind2.fields.optional.filter((f) => f !== "actor");
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
  const linksBlock = outboundLines.length + inboundLines.length > 0 ? `Links (typed edges declared by this bundle's conventions; write with link add --text "<type>"):
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
  const fieldNames = declaredFields.filter((f) => f !== "actor");
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
  const help = [`${cliInvocation()} doc read ${saved.id}`];
  const HINTS_PER_DIRECTION = 3;
  for (const { source, linkType } of inboundLinkDecls(registry, kind2).slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link from a ${source.governs}: ${cliInvocation()} link add ${kindIdPlaceholder(source, source.governs)} ${saved.id} --text "${linkType}"`
    );
  }
  for (const [linkType, target] of Object.entries(kind2.links ?? {}).slice(0, HINTS_PER_DIRECTION)) {
    help.push(
      `link to a ${target}: ${cliInvocation()} link add ${saved.id} ${kindIdPlaceholder(registry.kinds.get(target), target)} --text "${linkType}"`
    );
  }
  receipt.help = help;
  stdout(render(receipt, resolveMode({ json: Boolean(values.json) })));
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
  return new Promise((resolve4, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve4(chunks.length > 0 ? Buffer.concat(chunks) : void 0));
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
  return new Promise((resolve4, reject) => {
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
      resolve4({
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
  return new Promise((resolve4) => {
    process.once("SIGINT", () => resolve4());
    process.once("SIGTERM", () => resolve4());
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
  "/assets/index-Co-oqpSn.css": { contentType: "text/css; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/5VTzXKbMBC+9yk006tFAcdJKo55hb6AQIvRWGiZlYhxGb97JXAwMLn0Agjtrr4/CUL0Y4UGibuqgRaE0efGMyXpci9R3cZW0llbkRY1Wi+yUzf8ypIT6zV30jrugHR9cDfnoeW9Pjx/3hPZdbwBqYDGTiql7VkkbyeClmVJHt9FiRR2eYneYyuybmAOjVbsQ9pP6f7A4NdTWJONEQV3+i+ILMniiC9896RESWo5KW4+/vFAsG+tG5V2nZE3URsYirPspqJCBsqW60DATTvceUm+wE+g2uCVD0L2HrezxlgoUpay7HVCoS2/auUbMa23xazJV7iT3xN1H8hxT0GuGqkVfdcBVdJBYcD7oInrZDUpluahGuPK36J+u9lJhb3141LwOhnFrxB9FC9putSHx06Cia3SBJXXaMU8cRImOa1ZRF1nq7716MtGkkr3TiQvkd/ieNSDzb6vB7LmuGQryPgIxF6mdQfXatMxNex5z73vy6xattrcRIhrixajqHBYvjZ4jCzBLPqUBqvLfuRTelsbXfkHHO7xodiT9SreK82qngis/4gXbq/acXVASKDv3bdZnrc4ECHNN1f8LNM0zYPRBAYjHlcRgA3ohkcoj/nqqkR7WIz0gjakeDph2886grGU1eVMIWJKzIYX/xGE40aSt9mw3bX68Q8+lV8DhAQAAA==" },
  "/assets/index-Cv6K3vrL.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/2WQTU7DMBCF9z3F4DWuhZAQizibLumuJzD2NBlw7OCZpuT22E1ZIFZP8/e90eseQvayzgijTLHfdU0gujRYhUm1BrpQZUJx4EdXGMWqi5z1qwLzO0huQqsWwuuciyjwOQmmunilIKMNuJBHfSsegRIJuajZu4j2acMIScTeDfWKxQnqSIKd2do7gI59oVmg/WrVlMMlYvUpmTkXGigBF2+VcVwfZEMp4Lc+LC9vz0s57j9Y9Z3ZEDdapPQJBaNVLGtEHhHlL24seP7Hyzp/zae098wtG3MP5z2HtUqgBShYVXKW5lfrtnSfmi3hH5llM61yAQAA" }
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
  return new Promise((resolve4, reject) => {
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
      resolve4({
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
  return new Promise((resolve4) => {
    process.once("SIGINT", () => resolve4());
    process.once("SIGTERM", () => resolve4());
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
import { existsSync as existsSync5, readFileSync as readFileSync4, realpathSync as realpathSync5, statSync as statSync3 } from "node:fs";
import { promises as fs10 } from "node:fs";
import path10 from "node:path";
import { parseArgs as parseArgs22 } from "node:util";

// src/git.ts
import { spawnSync } from "node:child_process";
import {
  existsSync as existsSync4,
  mkdirSync as mkdirSync2,
  readdirSync,
  readFileSync as readFileSync3,
  realpathSync as realpathSync4,
  rmdirSync,
  statSync as statSync2,
  writeFileSync as writeFileSync2
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
function gitEnv(rebase) {
  const env = { ...process.env };
  for (const v of SCRUBBED_GIT_VARS) delete env[v];
  env.LC_ALL = "C";
  env.GIT_TERMINAL_PROMPT = "0";
  env.GIT_SSH_COMMAND = "ssh -o BatchMode=yes -o ConnectTimeout=10";
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
  const r = spawnSync("git", ["-C", dir, "-c", "core.quotepath=off", ...args], {
    env: gitEnv(opts.rebase ?? false),
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
  if (!existsSync4(dir)) return null;
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
    return realpathSync4(p);
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
    if (!existsSync4(headNamePath)) continue;
    try {
      if (readFileSync3(headNamePath, "utf8").trim() === `refs/heads/${BOARD_BRANCH}`) return true;
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
  if (!existsSync4(boardPath) || !worktreeRootResolvesForOwner(boardPath, top)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}
function hasWorktreeSignature(dir) {
  const gitPath = path9.join(dir, ".git");
  if (!existsSync4(gitPath)) return false;
  try {
    return statSync2(gitPath).isFile();
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
function provisionBoardWorktree(dir) {
  const top = repoTopLevel(dir);
  if (!top) return { kind: "no_repo" };
  const boardPath = path9.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };
  runGit(top, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
  const hasLocal = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
  const hasRemote = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  if (!hasLocal && !hasRemote) return { kind: "no_board" };
  if (existsSync4(boardPath)) {
    if (readdirSync(boardPath).length > 0) {
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
  return existsSync4(worktreeGitPath(boardPath, "rebase-merge")) || existsSync4(worktreeGitPath(boardPath, "rebase-apply"));
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
          mkdirSync2(path9.dirname(exportPath), { recursive: true, mode: 448 });
          writeFileSync2(exportPath, local.stdout, { mode: 384 });
          if (isDoc) {
            try {
              const decoded = local.stdout.toString("utf8");
              if (Buffer.from(decoded, "utf8").equals(local.stdout)) {
                const { body } = parseMarkdown(decoded, relPath);
                bodyExportPath = exportPath.replace(/\.md$/, ".body.md");
                writeFileSync2(bodyExportPath, body, { mode: 384 });
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
function ffPull(boardPath) {
  try {
    if (!repoTopLevel(boardPath)) return { updated: false, swallowed: "not-a-repo" };
    if (runGit(boardPath, ["symbolic-ref", "-q", "HEAD"]).status !== 0) {
      return { updated: false, swallowed: "detached-head" };
    }
    const before = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
    let fetchReason;
    const fetched = runGit(boardPath, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
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
import { homedir as homedir5 } from "node:os";
import { basename as basename4, join as join6, resolve as resolve3 } from "node:path";
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
${resolve3(src.checkoutRoot)}`;
  }
  return `path
${resolve3(src.root)}`;
}
function syncStateDir(home2 = homedir5()) {
  return join6(credentialsDir(home2), SYNC_STATE_DIR_NAME);
}
function keyDigest(key2) {
  return createHash2("sha256").update(key2, "utf8").digest("hex").slice(0, 32);
}
function syncStatePath(key2, home2 = homedir5()) {
  return join6(syncStateDir(home2), `${keyDigest(key2)}.json`);
}
function syncExportsDir(key2, home2 = homedir5()) {
  return join6(syncStateDir(home2), "exports", keyDigest(key2));
}
var EMPTY_STATE = { cursor: null, cache: null, marker: null };
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
async function readSyncState(key2, home2 = homedir5()) {
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
    marker: asMarker(parsed.marker)
  };
}
async function readCursor(key2, home2 = homedir5()) {
  return (await readSyncState(key2, home2)).cursor;
}
async function writeSyncState(key2, patch, home2 = homedir5()) {
  const next = { ...await readSyncState(key2, home2), ...patch };
  const parent = credentialsDir(home2);
  await mkdir2(parent, { recursive: true, mode: DIR_MODE2 });
  await chmod2(parent, DIR_MODE2);
  const path11 = syncStatePath(key2, home2);
  const record = {
    key: key2,
    cursor: next.cursor ?? void 0,
    cache: next.cache ?? void 0,
    marker: next.marker ?? void 0
  };
  await writeFileAtomic0600(syncStateDir(home2), basename4(path11), JSON.stringify(record, null, 2) + "\n");
  return next;
}
async function writeCursor(key2, cursor, home2 = homedir5()) {
  if (asCursor(cursor) === null) {
    throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
  }
  await writeSyncState(key2, { cursor }, home2);
}
async function writeCache(key2, cache, home2 = homedir5()) {
  if (asCache(cache) === null) {
    throw new TypeError(
      "cache must carry { updatedAt: ISO timestamp, delta: AwarenessDeltaRow[], unpushedCount, uncommittedCount }"
    );
  }
  await writeSyncState(key2, { cache }, home2);
}
async function recordReanchor(key2, cursor, counts, home2 = homedir5(), now = () => /* @__PURE__ */ new Date()) {
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

// src/commands/sync.ts
var SYNC_USAGE = `agentstate-lite sync \u2014 share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]

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

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
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
    const local = parseMarkdown(readFileSync4(c.exportPath, "utf8"), c.relPath).frontmatter;
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
    return realpathSync5(p);
  } catch {
    return p;
  }
}
function healStaleRebaseBeforeProvisioning(dir) {
  try {
    const top = repoTopLevel(dir);
    if (!top) return;
    const candidateBoardPath = path10.join(top, BUNDLE_DIR);
    if (!existsSync5(candidateBoardPath)) return;
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
    return statSync3(path10.join(p, ".git")).isFile();
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
  const storedCursor = await readCursor(key2);
  const startHead = currentHead(boardPath);
  const preFetchOriginRef = resolveOriginRef(boardPath);
  let commitResult = { committed: false, docs: [] };
  if (!pullOnly) {
    commitResult = stageAndCommit(boardPath);
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
async function authRequest(base, path11, options2 = {}) {
  const headers = {};
  if (options2.body !== void 0) headers["content-type"] = "application/json";
  if (options2.authToken) headers["Authorization"] = `Bearer ${options2.authToken}`;
  const request = new Request(`${base}${path11}`, {
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
async function join7(argv, deps = {}) {
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
        usage: 'new "<Kind>" <id> --<field> <value> [...] [--no-prefix] [--actor <n>] [--remote <url>]',
        summary: 'Create a new instance of a bundle-declared kind \u2014 e.g. new "Context Note" <id> for a note (validates strictly)'
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
        usage: "hook install|status|uninstall [--scope project|global]",
        summary: "Install the SessionStart home-view hook (Claude Code, Codex, OpenCode)"
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
    commands[group] = refs.map((c) => commandName(c.usage)).join(", ");
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
import { parseArgs as parseArgs29 } from "node:util";
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
function buildHomeView(creds, deps, summary, remote, remoteKeyStored, binding, bindingError) {
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
  } else {
    view2.getting_started = `no OKF bundle found in this directory \u2014 run \`${deps.invocation()} init\` to create one`;
    if (binding) {
      view2.getting_started += ` (project binding ${binding.file} -> ${binding.target} did not resolve to a bundle)`;
    }
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
    const parsed = parseArgs29({
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
  stdout(
    render(
      buildHomeView(
        creds,
        {
          binPath: deps.binPath ?? binPath,
          invocation: deps.invocation ?? cliInvocation
        },
        summary,
        remote,
        remoteKeyStored,
        binding,
        bindingError
      ),
      // Honor --json (JSON is equally offline/never-throw); default remains TOON, the format the
      // SessionStart hook ingests as ambient context.
      jsonMode ? "json" : "default"
    )
  );
}

// src/commands/hook.ts
import { existsSync as existsSync6, readFileSync as readFileSync5, writeFileSync as writeFileSync3, rmSync } from "node:fs";
import { homedir as homedir6 } from "node:os";
import { join as join8, dirname as dirname4 } from "node:path";
import { mkdirSync as mkdirSync3 } from "node:fs";
import { parseArgs as parseArgs30 } from "node:util";
var HOOK_USAGE = `agentstate-lite hook \u2014 manage the SessionStart home-view hook

Usage:
  agentstate-lite hook install   [--scope project|global]
  agentstate-lite hook status    [--scope project|global]
  agentstate-lite hook uninstall [--scope project|global]

Installs (or removes) a SessionStart hook that runs the home view as ambient context at the start of
every agent session \u2014 for Claude Code, Codex, AND OpenCode. Idempotent: re-installing the same hook
is a no-op; uninstalling an absent hook is a no-op.

Options:
  --scope project   Write to the CURRENT project (default): .claude/, .codex/, .config/opencode/
  --scope global    Write to the USER home (~/.claude, ~/.codex, ~/.config/opencode)
  --json            Emit compact JSON instead of TOON
  -h, --help        Show this help
`;
var HOOK_MARKER = "agentstate-lite";
var HOOK_TIMEOUT_SECONDS = 10;
var DIST_ENTRYPOINT = "dist/agentstate-lite.mjs";
var OPENCODE_PLUGIN_FILENAME = "axi-agentstate-lite.js";
var OPENCODE_MANAGED_MARKER = `axi-sdk-js managed opencode plugin: ${HOOK_MARKER}`;
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
    claudeSettings: join8(base, ".claude", "settings.json"),
    codexHooks: join8(base, ".codex", "hooks.json"),
    opencodePlugin: join8(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME)
  };
}
function readSettings(path11) {
  if (!existsSync6(path11)) return {};
  try {
    return JSON.parse(readFileSync5(path11, "utf8"));
  } catch {
    return {};
  }
}
function writeSettings(path11, settings) {
  mkdirSync3(dirname4(path11), { recursive: true });
  writeFileSync3(path11, `${JSON.stringify(settings, null, 2)}
`);
}
function opencodePluginInstalled(path11) {
  if (!existsSync6(path11)) return false;
  try {
    return readFileSync5(path11, "utf8").includes(OPENCODE_MANAGED_MARKER);
  } catch {
    return false;
  }
}
async function hook(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs30({
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
  const base = deps.base ?? (scope === "global" ? homedir6() : process.cwd());
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
            command: claude.command ? collapseHomeDirectory2(claude.command) : hookCommand(),
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
    installSessionStartHooks({
      marker: HOOK_MARKER,
      binaryNames: [...BIN_NAMES],
      distEntrypoints: [DIST_ENTRYPOINT],
      homeDir: base,
      timeoutSeconds: HOOK_TIMEOUT_SECONDS,
      shouldInstall: () => true,
      onError: (m) => errors.push(m)
    });
    const out = {
      action: "install",
      scope,
      installed: true,
      command: hookCommand(),
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
  for (const path11 of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path11));
    if (didChange) {
      writeSettings(path11, updated);
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

// src/cli.ts
import { parseArgs as parseArgs31 } from "node:util";
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
  "hook"
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
    const { positionals } = parseArgs31({
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
    tokens = parseArgs31({
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
      join: wrap2(join7),
      invite: wrap2(invite),
      member: wrap2(member),
      key: wrap2(key),
      hook: wrap2(hook),
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
