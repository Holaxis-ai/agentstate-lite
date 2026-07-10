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
function transformChildren(value, replacer, path14) {
  if (isJsonObject(value)) return transformObject(value, replacer, path14);
  if (isJsonArray(value)) return transformArray(value, replacer, path14);
  return value;
}
function transformObject(obj, replacer, path14) {
  const result = {};
  for (const [key2, value] of Object.entries(obj)) {
    const childPath = [...path14, key2];
    const replacedValue = replacer(key2, value, childPath);
    if (replacedValue === void 0) continue;
    result[key2] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
  }
  return result;
}
function transformArray(arr, replacer, path14) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const childPath = [...path14, i];
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
function collapseHomeDirectory(path14, homeDir = homedir()) {
  if (!path14.startsWith(homeDir)) {
    return path14;
  }
  return `~${path14.slice(homeDir.length)}`;
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
  readFileSync: (path14, encoding) => readFileSync(path14, encoding)
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
  const path14 = options2.entry.replaceAll("\\", "/");
  if (path14.includes("/_npx/") || /\/dlx-[^/]+\//.test(path14) || path14.includes("/pnpm/dlx/") || path14.includes("/bun/install/cache/")) {
    return { kind: "npx" };
  }
  const homebrewFormula = homebrewFormulaFromPath(path14, env);
  if (homebrewFormula) {
    return { kind: "homebrew", formula: homebrewFormula };
  }
  const pnpmHome = normalizePathRoot(env.PNPM_HOME);
  if (isPathInsideRoot(path14, pnpmHome) || isKnownPnpmGlobalStore(path14, env)) {
    return { kind: "pnpm-global" };
  }
  if (isKnownNpmGlobalInstall(path14, env)) {
    return { kind: "npm-global" };
  }
  return { kind: "unknown" };
}
function normalizePathRoot(path14) {
  const normalized = path14?.replaceAll("\\", "/").replace(/\/+$/, "");
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function isPathInsideRoot(path14, root) {
  return root !== void 0 && (path14 === root || path14.startsWith(`${root}/`));
}
function homebrewFormulaFromPath(path14, env) {
  for (const root of homebrewCellarRoots(env)) {
    if (!isPathInsideRoot(path14, root)) {
      continue;
    }
    const relative = path14.slice(root.length).replace(/^\/+/, "");
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
function isKnownPnpmGlobalStore(path14, env) {
  return pnpmGlobalStoreRoots(env).some((root) => {
    if (!isPathInsideRoot(path14, root)) {
      return false;
    }
    const relative = path14.slice(root.length).replace(/^\/+/, "");
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
function isKnownNpmGlobalInstall(path14, env) {
  return npmGlobalNodeModulesRoots(env).some((root) => isPathInsideRoot(path14, root)) || isKnownVersionManagerNpmGlobal(path14, env);
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
function isKnownVersionManagerNpmGlobal(path14, env) {
  return versionManagerNodeRoots(env).some((root) => isPathInsideRoot(path14, root) && path14.includes("/lib/node_modules/"));
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
  const realpath = options2.realpath ?? ((path14) => realpathSync(path14));
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
function toStringArrayLenient(value, path14, docId, warnings) {
  if (!Array.isArray(value)) {
    if (value !== void 0) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${docId}' has a non-list '${path14}' (${describeShape(value)}; expected a list of strings); ignoring it.`,
        field: path14,
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
        message: `kind convention '${docId}' has a non-scalar member (${describeShape(v)}) in '${path14}'; skipping it.`,
        field: path14,
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
  const path14 = typeof fm.path === "string" && fm.path.trim() !== "" ? fm.path.trim() : void 0;
  const freshnessHorizon = typeof fm.freshness_horizon === "string" && fm.freshness_horizon.trim() !== "" ? fm.freshness_horizon.trim() : void 0;
  const kind2 = { id: doc2.id, title, governs, fields: { required, optional, values, terminal } };
  if (path14 !== void 0) kind2.path = path14;
  if (links !== void 0) kind2.links = links;
  if (expectsInbound !== void 0) kind2.expectsInbound = expectsInbound;
  if (sections && sections.length > 0) kind2.sections = sections;
  if (freshnessHorizon !== void 0) kind2.freshnessHorizon = freshnessHorizon;
  return { ok: true, kind: kind2, reservedFieldsIgnored: [...reservedFieldsIgnored].sort(), warnings };
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
  const path14 = url.pathname.replace(/\/+$/, "");
  return { base: url.origin + path14, resource: url.origin };
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
  const path14 = join3(dir, fileName);
  const tmpPath = join3(dir, `.${fileName}.${randomBytes(8).toString("hex")}.tmp`);
  const handle = await open(tmpPath, "wx", FILE_MODE);
  try {
    await handle.writeFile(content);
    await handle.chmod(FILE_MODE);
  } finally {
    await handle.close();
  }
  try {
    await rename(tmpPath, path14);
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
  const readExisting = async () => {
    try {
      const { doc: doc2, version } = await readDocVersioned(bundle, id);
      return { state: doc2, version };
    } catch (err) {
      if (err?.code === "ENOENT") return { state: void 0, version: null };
      throw classify(err, opts.remoteUrl);
    }
  };
  if (mode === "overwrite") {
    let savedDoc2;
    let warnings = [];
    try {
      const outcome = await versionedMutation({
        read: readExisting,
        decide: async (existing) => {
          const candidate = await buildCandidate(existing);
          warnings = validate(candidate);
          return { action: "write", next: { id, ...candidate }, result: void 0 };
        },
        write: async (next, expectedVersion) => {
          try {
            const { doc: saved, version } = await writeDocVersioned(bundle, next, {
              expectedVersion,
              actor: opts.actor
            });
            savedDoc2 = saved;
            return version;
          } catch (err) {
            if (err instanceof VersionConflict) throw err;
            throw classify(err, opts.remoteUrl);
          }
        },
        maxAttempts
      });
      return { doc: savedDoc2, version: outcome.version, warnings };
    } catch (err) {
      if (err instanceof VersionConflict) {
        throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
      }
      throw err;
    }
  }
  let lastReadVersion = null;
  let savedDoc;
  const hardCas = opts.expectedVersion !== void 0;
  try {
    const outcome = await versionedMutation({
      read: async () => {
        const read = await readExisting();
        lastReadVersion = read.version;
        if (read.state === void 0 && onAbsent === "fail") {
          throw errors.notFound ? errors.notFound() : new CliError("NOT_FOUND", `no concept document at id '${id}'`);
        }
        return read;
      },
      decide: async (existing) => {
        if (hardCas && lastReadVersion !== opts.expectedVersion) {
          const conflict = new VersionConflict(id, opts.expectedVersion, lastReadVersion);
          throw errors.staleHead ? errors.staleHead(conflict) : new CliError("STALE_HEAD", conflict.message);
        }
        const candidate = await buildCandidate(existing);
        if (existing && isNoopPatch(existing, candidate, compareTimestamp)) {
          return { action: "done", result: { doc: existing, warnings: [] } };
        }
        const warnings = validate(candidate);
        return { action: "write", next: { id, ...candidate }, result: { warnings } };
      },
      write: async (next, expectedVersion) => {
        const writeVersion = hardCas ? opts.expectedVersion : expectedVersion;
        try {
          const { doc: saved, version } = await writeDocVersioned(bundle, next, {
            expectedVersion: writeVersion,
            actor: opts.actor
          });
          savedDoc = saved;
          return version;
        } catch (err) {
          if (err instanceof VersionConflict) throw err;
          throw classify(err, opts.remoteUrl);
        }
      },
      // An EXPLICIT caller token makes a conflict terminal (hard CAS, no retry) — the whole point of
      // an optimistic "claim: update IFF unchanged". Without one, keep the pre-existing bounded-retry
      // behavior (a benign concurrent writer is retried, not failed).
      maxAttempts: hardCas ? 1 : maxAttempts
    });
    return outcome.wrote ? { doc: savedDoc, changed: true, version: outcome.version, warnings: outcome.result.warnings } : { doc: outcome.result.doc, changed: false, version: outcome.version, warnings: [] };
  } catch (err) {
    if (err instanceof VersionConflict) {
      throw errors.staleHead ? errors.staleHead(err) : new CliError("STALE_HEAD", err.message);
    }
    throw err;
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
    actor: values.actor?.trim(),
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
      droppedFields = fresh ? Object.keys(fresh.frontmatter).filter((k) => k !== "timestamp" && !(k in frontmatter)) : [];
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
  receipt.help = [`${cliInvocation()} doc read ${result.doc.id}`];
  stdout(render(receipt, mode));
}

// src/commands/doc/read.ts
import { parseArgs as parseArgs6 } from "node:util";
import { promises as fs7 } from "node:fs";
import path11 from "node:path";

// src/autopull.ts
import path10 from "node:path";
import { realpathSync as realpathSync5, statSync as statSync3 } from "node:fs";

// src/git.ts
import { spawnSync } from "node:child_process";
import {
  existsSync as existsSync3,
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
import { tmpdir } from "node:os";
import path7 from "node:path";
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
function repoTopLevel(dir) {
  if (!existsSync3(dir)) return null;
  const r = runGit(dir, ["rev-parse", "--show-toplevel"]);
  if (r.status !== 0) return null;
  const top = r.stdout.trim();
  return top.length > 0 ? top : null;
}
function worktreeGitPath(boardPath, relative) {
  const raw = mustGit(boardPath, ["rev-parse", "--git-path", relative]).trim();
  return path7.resolve(boardPath, raw);
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
  return realOrSame(path7.isAbsolute(raw) ? raw : path7.resolve(dir, raw));
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
    const headNamePath = path7.join(worktreeGitPath(boardPath, state), "head-name");
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
  const boardPath = path7.join(top, BUNDLE_DIR);
  if (!existsSync3(boardPath) || !worktreeRootResolvesForOwner(boardPath, top)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}
function hasWorktreeSignature(dir) {
  const gitPath = path7.join(dir, ".git");
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
  const boardPath = path7.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };
  runGit(top, ["fetch", "--prune", BOARD_REMOTE], {
    timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
    connectTimeoutSeconds: budget.connectTimeoutSeconds
  });
  const localBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]);
  const remoteBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  const hasLocal = localBoard.status === 0;
  const hasRemote = remoteBoard.status === 0;
  const localMatchesRemote = hasLocal && hasRemote && localBoard.stdout.trim().length > 0 && localBoard.stdout.trim() === remoteBoard.stdout.trim();
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
    if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote) {
      return { kind: "local_board", boardPath, remoteExists: hasRemote };
    }
    rmdirSync(boardPath);
  }
  if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote) {
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
  return { kind: "provisioned", boardPath, source: hasLocal ? "local" : "remote" };
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
function enrichDocChange(boardPath, relPath, verb, rev, runOptions = {}) {
  const docId = conceptIdFromPath(relPath);
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
function snapshotFilesystemFiles(root) {
  const files = [];
  const visit = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name.toLowerCase() === ".git") {
        throw new CliError(
          "RUNTIME",
          `the bundle contains nested git control data at '${relPath}' \u2014 establish refuses because Git can silently omit or collapse files below that boundary`,
          { details: { nested_git_paths: [relPath] } }
        );
      }
      if (entry.isDirectory()) visit(path7.join(dir, entry.name), relPath);
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(relPath);
      else {
        throw new CliError(
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
  for (const row of listed.stdout.split("\0").filter(Boolean)) {
    const tab = row.indexOf("	");
    if (tab < 0) continue;
    const [mode, type, oid] = row.slice(0, tab).split(" ");
    const relPath = row.slice(tab + 1);
    const absolute = path7.resolve(bundlePath, relPath);
    if (!absolute.startsWith(`${path7.resolve(bundlePath)}${path7.sep}`)) {
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
      const stat = lstatSync(absolute);
      const actual = mode === "120000" ? readlinkSync(absolute, { encoding: "buffer" }) : readFileSync2(absolute);
      if (mode === "120000" && !stat.isSymbolicLink() || mode !== "120000" && !stat.isFile()) {
        mismatches.push(relPath);
      } else if (!Buffer.from(actual).equals(stored.stdout)) {
        mismatches.push(relPath);
      }
    } catch {
      mismatches.push(relPath);
    }
  }
  if (mismatches.length > 0) {
    throw new CliError(
      "RUNTIME",
      `bundle bytes differ from the Git snapshot at '${mismatches[0]}' \u2014 a Git attribute, clean/smudge filter, EOL rule, or concurrent writer may be rewriting content; no source backup was removed`,
      { details: { byte_mismatches: mismatches.slice(0, 20) } }
    );
  }
}
function snapshotBundleCommit(top, bundlePath) {
  const gitDir = mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim();
  const filesystemFiles = snapshotFilesystemFiles(bundlePath);
  const scratch = mkdtempSync(path7.join(tmpdir(), "aslite-establish-index-"));
  const indexFile = path7.join(scratch, "index");
  const snapshotOptions = { gitDir, workTree: bundlePath, indexFile };
  try {
    mustGit(bundlePath, ["read-tree", "--empty"], snapshotOptions);
    mustGit(
      bundlePath,
      ["-c", "core.sparseCheckout=false", "-c", "core.sparseCheckoutCone=false", "add", "-f", "-A", "--", "."],
      snapshotOptions
    );
    const stagedRows = mustGit(bundlePath, ["ls-files", "--stage", "-z"], snapshotOptions).split("\0").filter(Boolean);
    const gitlinks = stagedRows.filter((row) => row.startsWith("160000 ")).map((row) => row.slice(row.indexOf("	") + 1));
    if (gitlinks.length > 0) {
      throw new CliError(
        "RUNTIME",
        `the bundle contains nested git checkout machinery at '${gitlinks[0]}' \u2014 establish refuses because Git would publish only a gitlink and omit that directory's files`,
        { details: { nested_git_paths: gitlinks } }
      );
    }
    const stagedFiles = stagedRows.map((row) => row.slice(row.indexOf("	") + 1)).sort();
    if (stagedFiles.length !== filesystemFiles.length || stagedFiles.some((file, index) => file !== filesystemFiles[index])) {
      const staged = new Set(stagedFiles);
      const filesystem = new Set(filesystemFiles);
      throw new CliError("RUNTIME", "Git did not capture every bundle file; nothing was published", {
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
        ["diff", "--cached", "--name-status", "--no-renames", emptyTree],
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
    const sha = mustGit(top, ["commit-tree", tree], { input: message }).trim();
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
          exportPath = path7.join(exportDir, relPath);
          mkdirSync(path7.dirname(exportPath), { recursive: true, mode: 448 });
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
  const gitignorePath = path7.join(top, ".gitignore");
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
import { basename as basename3, join as join4, resolve } from "node:path";
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
${resolve(src.checkoutRoot)}`;
  }
  return `path
${resolve(src.root)}`;
}
function syncStateDir(home2 = homedir4()) {
  return join4(credentialsDir(home2), SYNC_STATE_DIR_NAME);
}
function keyDigest(key2) {
  return createHash2("sha256").update(key2, "utf8").digest("hex").slice(0, 32);
}
function syncStatePath(key2, home2 = homedir4()) {
  return join4(syncStateDir(home2), `${keyDigest(key2)}.json`);
}
function syncExportsDir(key2, home2 = homedir4()) {
  return join4(syncStateDir(home2), "exports", keyDigest(key2));
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
    selfActors: asSelfActors(parsed.selfActors),
    autoPullAttemptAt: isTimestamp(parsed.autoPullAttemptAt) ? parsed.autoPullAttemptAt : null,
    hookHintedAt: isTimestamp(parsed.hookHintedAt) ? parsed.hookHintedAt : null
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
  const path14 = syncStatePath(key2, home2);
  const record = {
    key: key2,
    cursor: next.cursor ?? void 0,
    cache: next.cache ?? void 0,
    marker: next.marker ?? void 0,
    selfActors: next.selfActors ?? void 0,
    autoPullAttemptAt: next.autoPullAttemptAt ?? void 0,
    hookHintedAt: next.hookHintedAt ?? void 0
  };
  await writeFileAtomic0600(syncStateDir(home2), basename3(path14), JSON.stringify(record, null, 2) + "\n");
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
async function recordAutoPullAttempt(key2, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  await writeSyncState(key2, { autoPullAttemptAt: now().toISOString() }, home2);
}
async function readHookHintedAt(key2, home2 = homedir4()) {
  return (await readSyncState(key2, home2)).hookHintedAt;
}
async function recordHookHinted(key2, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  await writeSyncState(key2, { hookHintedAt: now().toISOString() }, home2);
}

// src/commands/sync.ts
import { existsSync as existsSync6, readFileSync as readFileSync5, realpathSync as realpathSync4, statSync as statSync2 } from "node:fs";
import { promises as fs6 } from "node:fs";
import path9 from "node:path";
import { parseArgs as parseArgs5 } from "node:util";

// src/commands/hook.ts
import { existsSync as existsSync4, readFileSync as readFileSync3, writeFileSync as writeFileSync2, rmSync as rmSync2 } from "node:fs";
import { homedir as homedir5 } from "node:os";
import { join as join5, dirname as dirname2 } from "node:path";
import { mkdirSync as mkdirSync2 } from "node:fs";
import { parseArgs as parseArgs4 } from "node:util";
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
    claudeSettings: join5(base, ".claude", "settings.json"),
    codexHooks: join5(base, ".codex", "hooks.json"),
    opencodePlugin: join5(base, ".config", "opencode", "plugins", OPENCODE_PLUGIN_FILENAME)
  };
}
function readSettings(path14) {
  if (!existsSync4(path14)) return {};
  try {
    return JSON.parse(readFileSync3(path14, "utf8"));
  } catch {
    return {};
  }
}
function writeSettings(path14, settings) {
  mkdirSync2(dirname2(path14), { recursive: true });
  writeFileSync2(path14, `${JSON.stringify(settings, null, 2)}
`);
}
function opencodePluginInstalled(path14) {
  if (!existsSync4(path14)) return false;
  try {
    return readFileSync3(path14, "utf8").includes(OPENCODE_MANAGED_MARKER);
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
        if (!readFileSync3(targets.opencodePlugin, "utf8").includes(HOOK_SUBCOMMAND)) return true;
      } catch {
      }
    }
  }
  return false;
}
function hookInstalled(bases = [process.cwd(), homedir5()]) {
  for (const base of bases) {
    const targets = targetsFor(base);
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
    () => parseArgs4({
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
    const codexConfigPath = join5(base, ".codex", "config.toml");
    try {
      const current = existsSync4(codexConfigPath) ? readFileSync3(codexConfigPath, "utf8") : "";
      const [updated, changed2] = computeCodexConfigUpdate(current);
      if (changed2) {
        mkdirSync2(dirname2(codexConfigPath), { recursive: true });
        writeFileSync2(codexConfigPath, updated);
      }
    } catch (err) {
      errors.push(`${codexConfigPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    try {
      mkdirSync2(dirname2(targets.opencodePlugin), { recursive: true });
      const next = buildOpenCodePluginSource(commandBase);
      const current = existsSync4(targets.opencodePlugin) ? readFileSync3(targets.opencodePlugin, "utf8") : void 0;
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
  for (const path14 of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path14));
    if (didChange) {
      writeSettings(path14, updated);
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

// src/commands/sync-migrate.ts
var MIGRATION_BRANCH = "board-migration";
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

// src/commands/sync-establish.ts
import {
  existsSync as existsSync5,
  lstatSync as lstatSync2,
  readFileSync as readFileSync4,
  readdirSync as readdirSync2,
  renameSync,
  rmSync as rmSync3,
  unlinkSync,
  writeFileSync as writeFileSync3
} from "node:fs";
import path8 from "node:path";
var ESTABLISH_DONE = "the shared board is live \u2014 .agentstate-lite/ now syncs over the 'board' branch";
var ESTABLISH_ALREADY = "already established";
var ESTABLISH_MARKER_KEY = "agentstate.establishCommit";
function establishNextSteps(inv) {
  return [
    `teammates just run '${inv} sync' \u2014 it provisions automatically`,
    `'${inv} hook install' keeps session start board-aware`
  ];
}
function failureOf3(args, r) {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}
function mustGit3(dir, args, input) {
  const r = runGit(dir, args, input !== void 0 ? { input } : {});
  if (r.status !== 0) throw classifyGitError(failureOf3(args, r));
  return r.stdout;
}
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
function readEstablishMarker(top) {
  try {
    const value = readFileSync4(establishMarkerPath(top), "utf8").trim();
    return /^[0-9a-f]{40,64}$/.test(value) ? value : void 0;
  } catch {
    return void 0;
  }
}
function writeEstablishMarker(top, commit) {
  const markerPath = establishMarkerPath(top);
  const temporary = `${markerPath}.tmp-${process.pid}`;
  writeFileSync3(temporary, `${commit}
`, { mode: 384 });
  renameSync(temporary, markerPath);
}
function clearEstablishMarker(top) {
  try {
    unlinkSync(establishMarkerPath(top));
  } catch {
  }
}
function establishMarkerPath(top) {
  return path8.join(mustGit3(top, ["rev-parse", "--absolute-git-dir"]).trim(), ESTABLISH_MARKER_KEY);
}
function folderCommittedAtHead(top) {
  return runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0;
}
function folderPresentInCodeIndex(top) {
  const r = runGit(top, ["ls-files", "--", BUNDLE_DIR]);
  return r.status === 0 && r.stdout.trim().length > 0;
}
function assertPlainBundleShape(bundlePath, inv) {
  const runInitHelp = `${inv} init --dir ${BUNDLE_DIR}`;
  if (!existsSync5(bundlePath)) {
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
  if (existsSync5(path8.join(bundlePath, ".git"))) {
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
  const indexPath = path8.join(bundlePath, "index.md");
  if (!existsSync5(indexPath)) {
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
  if (folderCommittedAtHead(top)) {
    throw new CliError(
      "RUNTIME",
      `'${BUNDLE_DIR}/' is already committed on this branch \u2014 use '${inv} sync --migrate' instead`,
      { help: `${inv} sync --migrate` }
    );
  }
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
  const boundIsConventional = !binding.isRemote && path8.resolve(binding.target) === boardPath;
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
  if (!existsSync5(backupPath)) return;
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
  const boardPath = path8.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  const remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit || !isAncestor(top, publishedCommit, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `origin/${BOARD_BRANCH} no longer contains this establishment's published snapshot \u2014 the local bundle is untouched`
    );
  }
  if (isProvisioned(top)) {
    const current = mustGit3(boardPath, ["rev-parse", "HEAD"]).trim();
    if (!isAncestor(top, publishedCommit, current)) {
      throw new CliError("CONFLICT", "the provisioned board does not contain the establishment snapshot");
    }
    assertBundleBytesMatchCommit(top, boardPath, publishedCommit);
    setBoardUpstream(boardPath);
    const note = gitignoreNote(top);
    removeVerifiedBackup(top, backupPath, publishedCommit, inv);
    clearEstablishMarker(top);
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
    if (existsSync5(backupPath)) {
      throw new CliError("RUNTIME", `establish recovery backup already exists at ${backupPath}; nothing was moved`);
    }
    renameSync(boardPath, backupPath);
    sourcePath = backupPath;
  }
  try {
    const outcome = provisionBoardWorktree(top);
    if (outcome.kind !== "provisioned" && outcome.kind !== "already") {
      throw new CliError("RUNTIME", `board provisioning returned '${outcome.kind}' after publication`);
    }
    const provisionedPath = outcome.boardPath;
    const current = mustGit3(provisionedPath, ["rev-parse", "HEAD"]).trim();
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
    clearEstablishMarker(top);
    return { boardPath: provisionedPath, boardCommit: current, gitignore: note };
  } catch (err) {
    if (!existsSync5(boardPath) && existsSync5(backupPath)) renameSync(backupPath, boardPath);
    throw err;
  }
}
async function renderEstablished(top, conversion, snapshot2, inv, mode, stdout, deps) {
  const key2 = resolveBundleKey(conversion.boardPath);
  await refreshMarker(key2);
  if (snapshot2.docs.length > 0) await recordSelfActors(key2, snapshot2.docs.map((d) => d.actor));
  await writeCursor(key2, { tier: "git", token: conversion.boardCommit });
  await writeCache(key2, {
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
  const hint = await hookInstallHintOnce(key2, inv, deps.hookInstalled);
  if (hint) receipt.hint = hint;
  stdout(render(receipt, mode));
  return { already: false };
}
async function establishBoard(dir, inv, mode, stdout, deps) {
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError("RUNTIME", "not inside a git repository \u2014 establish needs a repo with an 'origin' remote");
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError("RUNTIME", `this repository has no '${BOARD_REMOTE}' remote`);
  }
  fetchOriginRequired(top);
  const boardPath = path8.join(top, BUNDLE_DIR);
  const backupPath = `${boardPath}.establish-backup`;
  let marker = readEstablishMarker(top);
  let remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  const localCommit = refCommit(top, `refs/heads/${BOARD_BRANCH}`);
  if (isProvisioned(top) && remoteCommit) {
    if (marker) {
      if (!isAncestor(top, marker, remoteCommit)) {
        throw new CliError(
          "CONFLICT",
          `the provisioned board does not contain the interrupted establishment snapshot (${marker})`
        );
      }
      const markerTree = treeOf(top, marker);
      if (!markerTree) {
        throw new CliError("RUNTIME", `the establishment marker names an unavailable tree (${marker})`);
      }
      setBoardUpstream(boardPath);
      gitignoreNote(top);
      assertBundleBytesMatchCommit(top, boardPath, marker);
      removeVerifiedBackup(top, backupPath, marker, inv);
      clearEstablishMarker(top);
    }
    return { already: true };
  }
  if (localCommit && !remoteCommit) {
    if (!isProvisioned(top)) {
      const provisioned = provisionBoardWorktree(top);
      if (provisioned.kind !== "provisioned" && provisioned.kind !== "already") {
        throw new CliError("RUNTIME", "the local board branch could not be provisioned for explicit establishment");
      }
    }
    const indexPath = path8.join(boardPath, "index.md");
    if (!existsSync5(indexPath) || lstatSync2(indexPath).isSymbolicLink() || !lstatSync2(indexPath).isFile()) {
      throw new CliError("RUNTIME", `the local '${BOARD_BRANCH}' worktree is not a valid bundle (root index.md missing)`);
    }
    pushBoardUpstream(boardPath);
    fetchOriginRequired(top);
    remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    if (!remoteCommit) throw new CliError("RUNTIME", "board push succeeded but origin/board could not be verified");
    const conversion2 = {
      boardPath,
      boardCommit: mustGit3(boardPath, ["rev-parse", "HEAD"]).trim(),
      gitignore: gitignoreNote(top)
    };
    return renderEstablished(top, conversion2, { docs: [] }, inv, mode, stdout, deps);
  }
  const recoverySource = existsSync5(backupPath) ? backupPath : boardPath;
  if (marker) {
    const markerTree = treeOf(top, marker);
    if (!markerTree) {
      throw new CliError("RUNTIME", `the establishment marker names an unavailable commit (${marker}); nothing was moved`);
    }
    assertPlainBundleShape(recoverySource, inv);
    const currentSnapshot = snapshotBundleCommit(top, recoverySource);
    if (currentSnapshot.tree !== markerTree) {
      throw new CliError("CONFLICT", "the local bundle changed since the interrupted establishment snapshot; nothing was moved");
    }
    if (!remoteCommit) {
      try {
        pushBoardCommit(top, marker);
      } catch (err) {
        if (fetchOrigin(top)) remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
        if (!remoteCommit) {
          throw err;
        }
      }
      fetchOriginRequired(top);
      remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    }
    if (!remoteCommit || !isAncestor(top, marker, remoteCommit)) {
      throw new CliError(
        "CONFLICT",
        `a different origin/${BOARD_BRANCH} appeared while establishing; the local bundle remains untouched`
      );
    }
    const conversion2 = finishLocalConversion(top, recoverySource, marker, markerTree, inv);
    return renderEstablished(top, conversion2, currentSnapshot, inv, mode, stdout, deps);
  }
  if (remoteCommit) {
    if (existsSync5(boardPath) || existsSync5(backupPath)) {
      throw new CliError(
        "CONFLICT",
        `origin/${BOARD_BRANCH} already exists while this clone also has a local bundle \u2014 establish will not guess that they are identical or replace either one`,
        { help: `move the local folder aside, run '${inv} sync' to join, then reconcile deliberately` }
      );
    }
    return { already: true };
  }
  if (localCommit) {
    throw new CliError(
      "RUNTIME",
      `a local '${BOARD_BRANCH}' branch already exists but is not the conventional board worktree; nothing was published`
    );
  }
  if (existsSync5(backupPath)) {
    throw new CliError(
      "RUNTIME",
      `an establishment backup already exists at ${backupPath}, but this clone has no matching establishment marker; nothing was published or moved`
    );
  }
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError("RUNTIME", `branches named '${BOARD_BRANCH}/\u2026' block establishment: ${namespaceConflicts.join(", ")}`, {
      details: { conflicting_branches: namespaceConflicts }
    });
  }
  assertFreshSource(top, boardPath, inv);
  await assertNotBoundElsewhere(top, boardPath);
  const snapshot2 = snapshotBundleCommit(top, boardPath);
  writeEstablishMarker(top, snapshot2.sha);
  marker = snapshot2.sha;
  try {
    pushBoardCommit(top, snapshot2.sha);
  } catch (err) {
    if (fetchOrigin(top)) remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
    if (!remoteCommit) {
      throw err;
    }
  }
  fetchOriginRequired(top);
  remoteCommit = refCommit(top, `refs/remotes/${BOARD_REF}`);
  if (!remoteCommit || !isAncestor(top, snapshot2.sha, remoteCommit)) {
    throw new CliError(
      "CONFLICT",
      `a teammate published a different origin/${BOARD_BRANCH} first; the local bundle remains untouched`,
      { details: { snapshot_commit: snapshot2.sha } }
    );
  }
  const conversion = finishLocalConversion(top, boardPath, marker, snapshot2.tree, inv);
  return renderEstablished(top, conversion, snapshot2, inv, mode, stdout, deps);
}

// src/commands/sync.ts
var SYNC_USAGE = `agentstate-lite sync \u2014 share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --establish [--dir <path>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]
  agentstate-lite sync --migrate [--yes] [--dir <path>] [--json]

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

Board-READING commands (\`list\`, \`doc read\`, \`status\`, \`home\`, \`link show\`) also keep a
provisioned board fresh opportunistically: when the board's awareness state is older than ~5
minutes, the read first runs the same fast-forward-only pull \`--pull-only\` uses (time-boxed to
~2s; never a rebase, never provisioning, silent on any failure) and then serves fresh state \u2014 so
the board checkout's HEAD can advance after a plain \`list\`. Reads never auto-push; sharing YOUR
changes is always this verb. Set AGENTSTATE_LITE_NO_AUTOPULL to any non-empty value to disable
the auto-pull (note: "0" disables it too \u2014 the variable's PRESENCE is the switch) for CI or
scripted runs that must never touch the network.

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
  --establish          Explicitly publish a local bundle as this project's shared board
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --migrate            One-time: move a committed .agentstate-lite/ folder onto its own board branch
  --yes                Execute --migrate (without it, --migrate prints a preview and changes nothing)
  --out <file>         With --show-incoming: write the raw bytes to <file> ('-' = raw to stdout)
  --dir <path>         Directory to run sync from (default: the cwd) \u2014 must be inside a git repo
  --limit <n>          Cap the incoming-delta row list to <n> rows (default: 20; 0 = unlimited)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;
var DEFAULT_LIMIT = 20;
function cap(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
var PUSH_FAIL_SAFETY_MESSAGE = "committed to the board locally \u2014 your work is saved. The push failed (offline or auth); re-run sync when you're back online or your access is restored.";
function pushFailureMessage(err) {
  if (err.code === "AUTH_REQUIRED" || err.code === "TRANSIENT") return PUSH_FAIL_SAFETY_MESSAGE;
  return `committed to the board locally \u2014 your work is saved. ${err.message}`;
}
function upstreamHelp(inv) {
  return `if a teammate already shares this project's board, make sure your \`origin\` remote points at the SAME repository they pushed the \`board\` branch to; if nobody has started sharing this project's board yet, run \`${inv} sync --establish\` to start`;
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
    const local = parseMarkdown(readFileSync5(c.exportPath, "utf8"), c.relPath).frontmatter;
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
    const detail = outcome.source === "remote" ? "materialized from origin/board" : "materialized from the local board branch";
    return { provisioned: `${outcome.boardPath} \u2014 ${detail}` };
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
async function hookInstallHintOnce(key2, inv, installed = hookInstalled) {
  try {
    if (installed()) return void 0;
    if (await readHookHintedAt(key2) !== null) return void 0;
    await recordHookHinted(key2);
    return `no SessionStart hook is installed \u2014 run \`${inv} hook install\` once and every new agent session will start with the board pulled and rendered`;
  } catch {
    return void 0;
  }
}
function ffSwallowToError(reason, inv, boardPath) {
  switch (reason) {
    case "git-missing":
      return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
        help: "install git (https://git-scm.com/downloads), then re-run the command"
      });
    case "no-upstream": {
      const hasLocalBoard = boardPath !== void 0 && runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      if (hasLocalBoard) {
        return new CliError(
          "NO_UPSTREAM",
          `board not published yet \u2014 run '${inv} sync --establish' to publish it explicitly`,
          { help: `${inv} sync --establish` }
        );
      }
      return new CliError(
        "NO_UPSTREAM",
        "the board branch isn't linked to a remote yet \u2014 sync can't share it",
        { help: upstreamHelp(inv) }
      );
    }
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
    const candidateBoardPath = path9.join(top, BUNDLE_DIR);
    if (!existsSync6(candidateBoardPath)) return;
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
  const commonDir = path9.isAbsolute(commonDirRaw) ? commonDirRaw : path9.resolve(p, commonDirRaw);
  return realOrSame2(gitDirRaw) !== realOrSame2(commonDir);
}
function hasGitFileSignature(p) {
  try {
    return statSync2(path9.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}
function retargetStaleBoardInteriorByPath(dir) {
  let cur = path9.resolve(dir);
  for (; ; ) {
    if (path9.basename(cur) === BUNDLE_DIR && hasGitFileSignature(cur)) {
      return path9.dirname(cur);
    }
    const parent = path9.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
function retargetBoardInterior(dir) {
  try {
    const top = repoTopLevel(dir);
    if (top && path9.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path9.dirname(top);
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
    () => parseArgs5({
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
  if (values.help) {
    stdout(SYNC_USAGE);
    return;
  }
  if (values.migrate) {
    if (values["pull-only"]) {
      throw new CliError("USAGE", "--migrate and --pull-only cannot be combined \u2014 migration never pulls");
    }
    if (values.establish) {
      throw new CliError("USAGE", "--migrate and --establish cannot be combined \u2014 they are two different one-time moves");
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
    if (values.establish) {
      throw new CliError("USAGE", "--show-incoming and --establish cannot be combined");
    }
    await showIncoming(id, values, deps);
    return;
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
  let limit = DEFAULT_LIMIT;
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
  let establishAlreadyNote;
  if (values.establish) {
    const establishOutcome = await establishBoard(dir, inv, mode, stdout, deps);
    if (!establishOutcome.already) return;
    establishAlreadyNote = ESTABLISH_ALREADY;
  }
  healStaleRebaseBeforeProvisioning(dir);
  const outcome = provisionBoardWorktree(dir, { allowLocalBranch: false });
  if (outcome.kind === "local_board") {
    if (outcome.remoteExists) {
      throw new CliError(
        "CONFLICT",
        `both a local '${BOARD_BRANCH}' branch and origin/${BOARD_BRANCH} exist, but the local branch is not the managed board checkout \u2014 bare sync will not guess which history is safe`,
        {
          help: `preserve or rename the local branch (for example: git branch -m ${BOARD_BRANCH} ${BOARD_BRANCH}-local-backup), then re-run '${inv} sync' to join origin/${BOARD_BRANCH}`
        }
      );
    }
    throw new CliError(
      "NO_UPSTREAM",
      `a local '${BOARD_BRANCH}' branch exists but has not been explicitly adopted or published \u2014 bare sync will not check it out or create origin/${BOARD_BRANCH}`,
      { help: `${inv} sync --establish` }
    );
  }
  if (outcome.kind === "no_repo" || outcome.kind === "no_board") {
    const rec = { sync: "nothing to sync" };
    if (outcome.kind === "no_board") {
      const top2 = repoTopLevel(dir);
      const hasOrigin = top2 !== null && runGit(top2, ["remote", "get-url", BOARD_REMOTE]).status === 0;
      const hasFolder = top2 !== null && existsSync6(path9.join(top2, BUNDLE_DIR, "index.md"));
      if (hasOrigin && hasFolder) {
        rec.hint = `this project has a local bundle but no shared board yet \u2014 run \`${inv} sync --establish\` to start sharing it over a '${BOARD_BRANCH}' branch on origin`;
      }
    }
    stdout(render(rec, mode));
    return;
  }
  const boardPath = outcome.boardPath;
  const top = path9.dirname(boardPath);
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
      throw withProvisionAnnouncement(ffSwallowToError(ff.swallowed, inv, boardPath), outcome);
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
          details: { conflicts: cap(rows, limit) },
          ...help ? { help } : {}
        }),
        outcome
      );
      throw await throwPostCommitFailure(conflictErr, commitResult.committed, key2, boardPath);
    }
    if (rebaseOutcome.status === "no_upstream") {
      const noUpstream = withProvisionAnnouncement(
        new CliError(
          "NO_UPSTREAM",
          `the local board has not been published \u2014 bare sync never creates origin/${BOARD_BRANCH}; run '${inv} sync --establish' to publish it explicitly`,
          { help: `${inv} sync --establish` }
        ),
        outcome
      );
      throw await throwPostCommitFailure(noUpstream, commitResult.committed, key2, boardPath);
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
      partial.incoming = cap(toIncomingRows(originDelta), limit);
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
  const hookHint = await hookInstallHintOnce(key2, inv, deps.hookInstalled);
  if (committedCount === 0 && pulledCount === 0 && pushedCount === 0 && !reanchorNote) {
    const rec = {};
    if (establishAlreadyNote) rec.establish = establishAlreadyNote;
    const announcement2 = provisionAnnouncement(outcome);
    if (announcement2) Object.assign(rec, announcement2);
    rec.sync = "already up to date";
    if (hookHint) rec.hint = hookHint;
    stdout(render(rec, mode));
    return;
  }
  const receipt = {};
  if (establishAlreadyNote) receipt.establish = establishAlreadyNote;
  const announcement = provisionAnnouncement(outcome);
  if (announcement) Object.assign(receipt, announcement);
  receipt.committed = committedCount;
  receipt.pushed = pushedCount;
  receipt.pulled = pulledCount;
  const actor = singleActor(commitResult.docs);
  if (actor) receipt.actor = actor;
  receipt.incoming = cap(toIncomingRows(originDelta), limit);
  if (reanchorNote) receipt.note = reanchorNote;
  if (hookHint) receipt.hint = hookHint;
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
    if (path9.isAbsolute(id) || id.split("/").some((seg) => seg === "..")) {
      throw new CliError("USAGE", `--show-incoming needs a repo-relative doc id or path without '..' segments: ${id}`);
    }
    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      throw ffSwallowToError("no-upstream", inv, top);
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
      await fs6.writeFile(out, bytes);
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

// src/autopull.ts
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
    return statSync3(path10.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}
function findBoardCandidate(start) {
  let cur = path10.resolve(start);
  for (; ; ) {
    if (path10.basename(cur) === BUNDLE_DIR && hasGitFileSignature2(cur)) {
      return { top: path10.dirname(cur), boardPath: cur };
    }
    const candidate = path10.join(cur, BUNDLE_DIR);
    if (hasGitFileSignature2(candidate)) return { top: cur, boardPath: candidate };
    const parent = path10.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
async function pullBoardAndRecord(boardPath, key2, budget = {}, now = () => /* @__PURE__ */ new Date()) {
  const storedCursor = await readCursor(key2);
  const startHead = currentHead(boardPath);
  const ff = ffPull(boardPath, budget);
  if (ff.swallowed) {
    return { swallowed: ff.swallowed, refreshed: false };
  }
  const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? startHead);
  if (delta.ok) {
    await writeCursor(key2, { tier: "git", token: postPullHead });
    await writeCache(key2, {
      updatedAt: now().toISOString(),
      delta: toDeltaRows(delta.changes),
      unpushedCount: unpushedCount(boardPath) ?? 0,
      uncommittedCount: countUncommitted(boardPath)
    });
  } else {
    await recordReanchor(
      key2,
      { tier: "git", token: postPullHead },
      { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) },
      void 0,
      now
    );
  }
  return { refreshed: true };
}
async function maybeAutoPull(dir, opts = {}) {
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
      const root = dir !== void 0 ? path10.resolve(dir) : await findBundleRoot(start);
      if (!root || realOrSame3(root) !== realOrSame3(boardPath)) return "different-bundle";
    }
    const key2 = resolveBundleKey(boardPath);
    const state = await readSyncState(key2);
    const nowMs = now().getTime();
    const ageOk = (iso) => typeof iso === "string" && nowMs - Date.parse(iso) <= staleMs;
    if (ageOk(state.cache?.updatedAt)) return "fresh";
    if (ageOk(state.autoPullAttemptAt)) return "throttled";
    const gitTop = repoTopLevel(candidate.top);
    if (!gitTop || realOrSame3(path10.join(gitTop, BUNDLE_DIR)) !== realOrSame3(boardPath) || !isProvisioned(gitTop)) {
      return "no-board";
    }
    await recordAutoPullAttempt(key2, void 0, now);
    await refreshMarker(key2, void 0, now);
    const result = await pullBoardAndRecord(
      boardPath,
      key2,
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

// src/commands/doc/read.ts
async function docRead(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d) => void process.stdout.write(d));
  const { values, positionals } = parseOrUsage(
    () => parseArgs6({
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
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (deps.autoPull ?? maybeAutoPull)(values.dir);
  const bundle = await openBundle(values.dir, remote);
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
        bytes = await fs7.readFile(path11.join(bundle.root, rel));
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
  const resolvedOut = path11.resolve(out);
  const root = bundle.root;
  const isInside = resolvedOut === root || resolvedOut.startsWith(root + path11.sep);
  if (!isInside) return void 0;
  if (isReservedFile(resolvedOut)) {
    return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) at a reserved OKF filename \u2014 the write will CLOBBER that reserved file (index.md/log.md is never re-parsed as a concept doc). Pass a path outside the bundle if that is not intended.`;
  }
  if (!resolvedOut.endsWith(".md")) return void 0;
  return `--out ${out} resolves to ${resolvedOut}, which is INSIDE this bundle (${root}) \u2014 the exported file will be re-ingested as a new concept doc on the next bundle walk (list/query/view/status). Pass a path outside the bundle if that is not intended.`;
}

// src/commands/doc/history.ts
import { parseArgs as parseArgs7 } from "node:util";
async function docHistory(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs7({
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
import { parseArgs as parseArgs8 } from "node:util";
async function docDelete(argv, deps) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values, positionals } = parseOrUsage(
    () => parseArgs8({
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
import { parseArgs as parseArgs9 } from "node:util";
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
    () => parseArgs9({
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
    bytes = await fs8.readFile(file);
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
import { parseArgs as parseArgs10 } from "node:util";
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
    () => parseArgs10({
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
import { parseArgs as parseArgs11 } from "node:util";
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
    () => parseArgs11({
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
import { parseArgs as parseArgs12 } from "node:util";
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
    () => parseArgs12({
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
import { parseArgs as parseArgs13 } from "node:util";

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
  agentstate-lite link add <from> <to> [--text <t>]
  agentstate-lite link show <id> [--limit <n>] [--text <t>]
  agentstate-lite link list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]

Idempotent: re-adding a link the source already carries is a no-op \u2014 exit 0, changed:false, no
duplicate link, no timestamp refresh.

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
  const normalizedTo = to.replace(/^\/+/, "").replace(/\.md$/, "");
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
        const already = parseLinks(bundle, source).some((l) => l.to === normalizedTo);
        if (already) return { action: "done", result: { changed: false } };
        const trimmed = source.body.replace(/\s*$/, "");
        const nextBody = `${trimmed}${trimmed ? "\n\n" : ""}[${text}](${href})
`;
        const nextFrontmatter = opts.keepTimestamp ? source.frontmatter : { ...source.frontmatter, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
        sourceTypeAtWrite = docType(source);
        return {
          action: "write",
          next: { ...source, frontmatter: nextFrontmatter, body: nextBody },
          result: { changed: true }
        };
      },
      write: async (next, expectedVersion) => {
        try {
          const { doc: saved, version } = await writeDocVersioned(bundle, next, { expectedVersion });
          savedDoc = saved;
          return version;
        } catch (err) {
          if (err instanceof VersionConflict) throw err;
          if (err instanceof RemoteError) throw classifyBundleError(err, opts.remoteUrl);
          throw err;
        }
      },
      maxAttempts: LINK_ADD_MAX_ATTEMPTS
    });
    if (!outcome.wrote) {
      return { from: lastSource.id, normalizedTo, href, text, changed: false };
    }
    const warnings = await lintLinkType(bundle, {
      sourceType: sourceTypeAtWrite,
      text,
      to: normalizedTo,
      remoteUrl: opts.remoteUrl
    });
    return {
      from: savedDoc.id,
      normalizedTo,
      href,
      text,
      changed: true,
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
    () => parseArgs13({
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
async function linkShow(argv, stdout, autoPull) {
  const { values, positionals } = parseOrUsage(
    () => parseArgs13({
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
  if (!remote) await (autoPull ?? maybeAutoPull)(values.dir);
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
    () => parseArgs13({
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
import { parseArgs as parseArgs14 } from "node:util";
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
    () => parseArgs14({
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
  const remote = await resolveRemoteFlag(values.remote, values.dir);
  if (!remote) await (deps.autoPull ?? maybeAutoPull)(values.dir);
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
import { parseArgs as parseArgs15 } from "node:util";
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
    () => parseArgs15({ args: argv, strict: false, allowPositionals: true, options: NEW_CONTROL_OPTIONS }),
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
      return parseArgs15({
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
import { parseArgs as parseArgs16 } from "node:util";
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
import { parseArgs as parseArgs17 } from "node:util";
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
    () => parseArgs17({
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
      const fieldsObj = fm.fields && typeof fm.fields === "object" && !Array.isArray(fm.fields) ? { ...fm.fields } : {};
      const required = toStringList(fieldsObj.required);
      const optional = toStringList(fieldsObj.optional);
      const valuesMap = fieldsObj.values && typeof fieldsObj.values === "object" && !Array.isArray(fieldsObj.values) ? { ...fieldsObj.values } : {};
      if (action === "add") {
        const targetList = values.required ? required : optional;
        const otherList = values.required ? optional : required;
        const otherIdx = otherList.indexOf(fieldName);
        if (otherIdx >= 0) otherList.splice(otherIdx, 1);
        if (!targetList.includes(fieldName)) targetList.push(fieldName);
        if (enumVals) {
          const vals = enumVals;
          const prev = Array.isArray(valuesMap[fieldName]) ? valuesMap[fieldName].map(String) : void 0;
          const same = !!prev && prev.length === vals.length && prev.every((v, i) => v === vals[i]);
          if (!same) valuesMap[fieldName] = vals;
        }
      } else {
        for (const list2 of [required, optional]) {
          const idx = list2.indexOf(fieldName);
          if (idx >= 0) list2.splice(idx, 1);
        }
        if (fieldName in valuesMap) delete valuesMap[fieldName];
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
import { parseArgs as parseArgs18 } from "node:util";
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
    () => parseArgs18({
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
import { parseArgs as parseArgs19 } from "node:util";
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
    () => parseArgs19({
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
import { parseArgs as parseArgs20 } from "node:util";
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
var DEFAULT_LIMIT2 = 20;
function cap2(rows, limit) {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}
function docType2(doc2) {
  return typeof doc2.frontmatter.type === "string" ? doc2.frontmatter.type : "";
}
async function status(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs20({
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
  if (!remote) await (deps.autoPull ?? maybeAutoPull)(values.dir);
  const bundle = await openBundle(values.dir, remote);
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
  const malformed = cap2(malformedRows, limit);
  const lint = cap2(lintRows, limit);
  const unresolved = cap2(unresolvedRows, limit);
  const orphans = cap2(orphanRows, limit);
  const stale = cap2(staleRows, limit);
  const noTimestamp = cap2(noTimestampRows, limit);
  const registryLint = cap2(
    registry.warnings.map((w) => ({ ...w })),
    limit
  );
  const linkTypeViolations = cap2(linkTypeViolationRows, limit);
  const missingExpectedLinks = cap2(missingExpectedRows, limit);
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
import { parseArgs as parseArgs21 } from "node:util";

// ../viewer/src/generate.ts
import { promises as fs10 } from "node:fs";
import * as path12 from "node:path";

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
    const root = path12.resolve(bundleSource);
    const stat = await fs10.stat(root).catch(() => null);
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
  const out = path12.resolve(options2.out ?? path12.join(defaultOutDir, "viz.html"));
  await fs10.mkdir(path12.dirname(out), { recursive: true });
  const tmp = out + ".tmp-" + process.pid;
  await fs10.writeFile(tmp, html, "utf8");
  await fs10.rename(tmp, out);
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
    () => parseArgs21({
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
import { parseArgs as parseArgs22 } from "node:util";

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
    () => parseArgs22({
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
import { parseArgs as parseArgs23 } from "node:util";
import { spawn as spawn2 } from "node:child_process";

// src/ui/server.ts
import { createServer as createServer2 } from "node:http";
import { basename as basename4 } from "node:path";

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
  "/assets/cormorant-garamond-500-BVPaSuim.woff2": { contentType: "font/woff2", gzipBase64: "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" },
  "/assets/fonts/CormorantGaramond-OFL.txt": { contentType: "text/plain; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/6VXXZPbug1956/A7EMnO6P1JmlvO5M3rS3vaq4t+UrapHmkRdhiQ5EqSdnxv++Akj930+lHXqKlReDgADiApqY7WLltPHz++Ok38A3C1NjWWK49rKz5B9Ye4t43xjr4sJW+6deT2rSPU+4bbp10c6O9ezxdumesaqQDOobSbPyeWwTpQMkatUMBvRZog6cyXUDeoR5eXgwvRPAVrZNGw6fJp8lgbLxLZmrTSRSwRmX2EXAt6JArZ4DvuFR8rRD20jfAYR7/Adx/YY33nfvy+OhqKzvvJk6qibHbx3y+YIw9/O//WAhglWQwz7MKFuk0ycrkEj88wOe/whzXtuf2AJ8/fvzb/+WQrYokXj4tElY1CFvDlQOzCWS+IRI+5PPFPRD93oDzsu0V9wh7Y5XYS4FM4A6V6VrUnqzURim+NpZ7uUPYkKluqAAXBRN91xnrg7fwa22Re2k0w83GWB+g8JoLbGUdUqOk3vbSeVlDbdq219JLdEPavCHrOykQOGwsIp0yQ1FsLG9xb+wPkBr2jayb4M9Byw+wRnANtyiG5LdkBAW92XHrNVrXyI6FEjC+QesmLJCVzxfAlTJ7FwI4leNg2Rsy3DsUETjfC0kPrRFyIwdPzKKQzlu57j3dsojqANyBMnpL//sGD4FsbTw4owSsD3TYOlQ7dBOoGmTBWQRS16oXki7qAwi0cjeQTkG7CGquCc6610IREGzXKAQ93cDgWjwaO7gbql4fwB27buRXgG+4Dz9ZdGh3KJjmLboTXIqb4N4iCaBHhojt8+8uYo3Z4w5tQEtG1ggWFfJzj5PHkAPwhw6pOkbWBzIs/rOXFkP5bYw9Z8Jiy6U+CcWFAAiDLiDmXacOzJuBQFP3wUooSHLviFt/wm6C3kh7GcCEsVkyT7O0SvOsZHdXgnUHFjdoAxoy4zB0yEYqdOcohwTD9Kih7MUogfaDu38POxFYK+RWHaDl9gelz4Hr64bokKG62VAZCM70tsbBYQTrXioBo34NmRhDDv03YeyuGDM7SEDG26sYiKUh5a7DeizqwTnwjR/0mNWnYeA89yExH9w9Wc+t3ErN1VHbbvkh6cCasBBN19pfm7YzGkMNOXZZvbf8wYk/8rk8dt87Pm/apuUCyRoXoam8iUCgQi/1NmLUH/3aeel7OoCHh6NYUF0EhTEK6TjU62YM6AR6OGG3FETksG643pLRjbEtHyptfQCSyWMFXpNB2JnGPaDeSWs0cUzBDiP2bYhObjX1GJIbpKfOmq3lbUvPHutGy5ortreSsmjs2HAdWmdCaFAbfWJ8TNcVpgljq6RYpmWZ5hn8CaZ5NhubYoW2lS4MM+mgQYvrA2xpzJMWBdGmudFwu8XoCHp0bdaeSy31lnEa2idmr3yHSz0NfRLdQxTejKDFYDDI3ijDh+hK+oYZ4lCpK5WGXp/+DJuCu3TLzm5dvw6rzUjIxtBkoJTVRgtJhey+MPbpHjKUg4K9SaU29lgx0juQWsidFD1XF8UTManhVDnGwm1Ru+g01MaRIb1DtZkw9vn+3998l9CjtePo+G/mRXQzMJDXTUgIoxLiUg+Tk6/NDuGsFdp4WQ/ydql3QeMdjrPsKGwCRj5JfTzX4oEroxE8/vRHtWv6lusHi1yEba5BLqgnjCUyA4Kus6azkraZlteN1Hh+vUXPBfccNhKVcCFMukcOjGVrqWkTG5T8anwbh8c74/xF7qQ6wE7i/qxWvUM7YezP95CZN0n5dU56h+GXK51mpNPDuFDoHODPTslaeqB29qiply4acOy8I5LaWIuuo4LVW3arouNQsUjZH6VZ08rSdYr6Yqz8zso2EEKIaUSQSHe0J+gLwaCgaWL+5T5sBHqEPUb7joCPI3f8dLh496oPaZNTCsbtIWwhw1rYGmpx1MJYh2SLix1aL8MYPbBb2iPAnzV2oZ15/UObvUKxxZGlUf6k0Wcc7D3MQwlfgbZDmwzbw2162Dk9E8Z+G7i50beTHBl7IU7ReyMoYm3vAhOXLYvaS0u75tuVYhDBcGmg8Gq63u5gl30Jv9q92H+6e8Evdi923r1up0xFUyaLabRcf9atsTa0m+heqRDSzkgBcnM5kI+qc1Rn2l0ZoWmRBugsLaeLOF0mBatekuF7rMzn1be4SCAtYVXkX9NZMoO7uIS0vIvgW1q95K8VfIuLIs6q75DPIc6+w+9pNotY8vdVkZQl5AWky9UiTWYRpNl08TpLs2d4eq0gy+mLb5lWyQyqPFwdTaVJCfmcLZNi+hJnVfyULtLqewTztMrI5jwvIIZVXFTp9HURF7B6LVZ5mUCczSDLszSbF2n2nCyTrGL5HKb56nuRPr9UEaziKsmqCKoiniXLuPg9IoR59ZIUEF6ZQJpBlkPyNSEGXuLFAqqXhJ1swEu+mCUFPCWwSOOnRTLAyb5D4C+CWbyMn5PybJdeGyJgZwbownOSJUW8iKBcJdOUHtJslhbJtApcpbMkq+g0L2inKJM/XpOsSuMFG11E8O0lCS7SDOIM4imVBoSIs6qIyU6VF9UJyre0TCKIi7RMs2c2L/JlBJTCfE4xwmuZhHxlI15KC529LYi8ALrNhgBnSbxIs+eSYLx5d8L+BRsM1tAjEQAA" },
  "/assets/index-DnDMhxAc.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/assets/index-mU4vVBcF.css": { contentType: "text/css; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/12QMU/EMAyF9/4K45lehMTAkFQCndgYYQ+J72pIkyr29a7/HuV6DDBZfs/6/PTsXSxB15lg1CkNnW0Dks9Hh5SxCeTj0NmJ1EMYfRVShyc99E8I5tfIfiKHC9N5LlURQslKWR2eOeroIi0cqL8u98CZlX3qJfhE7mHDKGuiwR8pq6hX6hMrWbPJHYCVUHlWaFkdTiWeEiGEWkRK5SNnkBocGi9CKoZzpEu/z/u38fIcdl+CgzUb4kpLnL+hUnIouiaSkUj/4sZKh/+86f1x+XgJr7sg0roxt3I+S1yHzkZegKPDWoq2f5GXdnRzzdbwD0MNSpdyAQAA" }
};

// src/ui/assets.ts
var CSP_HEADER = "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; frame-src 'self'; child-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";
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

// src/ui/pages.ts
import { randomBytes as randomBytes3 } from "node:crypto";
var PAGE_BLOB_PREFIX = "pages/";
var DEFAULT_NONCE_TTL_MS = 120 * 1e3;
var DEFAULT_MAX_NONCES = 256;
var PageNonceRegistry = class {
  map = /* @__PURE__ */ new Map();
  ttlMs;
  maxEntries;
  constructor(ttlMs = DEFAULT_NONCE_TTL_MS, maxEntries = DEFAULT_MAX_NONCES) {
    this.ttlMs = ttlMs;
    this.maxEntries = Math.max(1, maxEntries);
  }
  /** Mint a fresh nonce authorizing exactly `key`. 32 random bytes, base64url. Sweeps expired entries and enforces the cap first. */
  mint(key2) {
    this.sweepExpired();
    while (this.map.size >= this.maxEntries) {
      const oldest = this.map.keys().next().value;
      if (oldest === void 0) break;
      this.map.delete(oldest);
    }
    const nonce = randomBytes3(32).toString("base64url");
    this.map.set(nonce, { key: key2, expiresAt: Date.now() + this.ttlMs });
    return nonce;
  }
  /** Resolve a nonce to its authorized blob key, or `null` if unknown/expired (an expired entry is deleted on read). */
  resolve(nonce) {
    const entry = this.map.get(nonce);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(nonce);
      return null;
    }
    return entry.key;
  }
  /** Drop every expired entry (Map iteration tolerates deletion of the current/remaining keys). */
  sweepExpired() {
    const now = Date.now();
    for (const [nonce, entry] of this.map) {
      if (now > entry.expiresAt) this.map.delete(nonce);
    }
  }
  /** Test/observability hook: number of live (un-swept) nonces. */
  size() {
    return this.map.size;
  }
};
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

// src/ui/events.ts
var HEARTBEAT_MS = 25e3;
var SseHub = class {
  clients = /* @__PURE__ */ new Set();
  heartbeat;
  /**
   * Attach a freshly-opened SSE response: write the event-stream headers, register it, and
   * de-register it on close. `extraHeaders` carries the session cookie when the connecting
   * request authenticated via the URL token (mirrors the main server's cookie-grant path).
   */
  add(res, extraHeaders = {}) {
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
  /** End every stream and stop the heartbeat — called on server shutdown so no timer keeps the process alive. */
  close() {
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

// src/ui/watch.ts
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
  for (const [key2, version] of next.blobs) {
    if (prev.blobs.get(key2) !== version) blobsChanged.push({ key: key2, version });
  }
  const blobsRemoved = [];
  for (const key2 of prev.blobs.keys()) {
    if (!next.blobs.has(key2)) blobsRemoved.push(key2);
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
  let keys = [];
  try {
    keys = await listBlobs(bundle, PAGE_BLOB_PREFIX);
  } catch {
    keys = [];
  }
  for (const key2 of keys) {
    try {
      const r = await readBlob(bundle, key2);
      if (r) blobs2.set(key2, r.version);
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

// src/ui/server.ts
var HOST = "127.0.0.1";
var REMOTE_BUNDLE2 = "default";
function jsonError(status2, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: status2,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
function pageError(status2, message) {
  const body = `<!doctype html><meta charset="utf-8"><title>page unavailable</title><p>${message}</p>`;
  return new Response(body, {
    status: status2,
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": pageCsp(), "referrer-policy": "no-referrer" }
  });
}
function encodeBlobKeyPath(key2) {
  return key2.split("/").map(encodeURIComponent).join("/");
}
async function readPageBlob(options2, key2) {
  if (options2.mode === "dir") {
    const r = await readBlob(options2.bundle, key2);
    return r ? { bytes: r.bytes, contentType: r.contentType } : null;
  }
  const target = `${options2.remoteBase}/v0/bundles/${REMOTE_BUNDLE2}/blobs/${encodeBlobKeyPath(key2)}`;
  const headers = {};
  if (options2.apiKey) headers.authorization = `Bearer ${options2.apiKey}`;
  const res = await fetch(target, { headers });
  if (!res.ok) return null;
  return { bytes: new Uint8Array(await res.arrayBuffer()), contentType: res.headers.get("content-type") ?? "application/octet-stream" };
}
async function servePageBytes(options2, runtime, nonce) {
  const key2 = runtime.nonces.resolve(nonce);
  if (!key2) return pageError(403, "This page link is unknown or has expired. Reopen the page from the launcher.");
  if (!(await registeredPageEntries(options2)).has(key2)) {
    return pageError(403, "This page is no longer registered in the bundle (its registry doc was removed or retargeted).");
  }
  const blob = await readPageBlob(options2, key2);
  if (!blob) return pageError(404, `No page bytes found for '${key2}'.`);
  return new Response(blob.bytes, {
    status: 200,
    headers: {
      "content-type": blob.contentType,
      "content-security-policy": pageCsp(),
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer"
    }
  });
}
async function registeredPageEntries(options2) {
  const entries = /* @__PURE__ */ new Set();
  if (options2.mode === "dir") {
    for (const head of await queryHeads(options2.bundle, { type: "Page" })) {
      const entry = head.frontmatter.entry;
      if (typeof entry === "string" && entry) entries.add(entry);
    }
    return entries;
  }
  const headers = {};
  if (options2.apiKey) headers.authorization = `Bearer ${options2.apiKey}`;
  let cursor;
  do {
    const url = new URL(`${options2.remoteBase}/v0/bundles/${REMOTE_BUNDLE2}/docs`);
    url.searchParams.set("fields", "frontmatter");
    url.searchParams.set("type", "Page");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers });
    if (!res.ok) break;
    const body = await res.json();
    for (const d of body.docs) {
      const entry = d.frontmatter.entry;
      if (typeof entry === "string" && entry) entries.add(entry);
    }
    cursor = body.next_cursor ?? void 0;
  } while (cursor);
  return entries;
}
async function handleMint(req, runtime, options2) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonError(400, "USAGE", "request body must be JSON { key }");
  }
  const key2 = typeof payload.key === "string" ? payload.key.trim() : "";
  if (!key2) return jsonError(400, "USAGE", "request body must include a non-empty page key");
  try {
    assertSafeBlobKey(key2);
  } catch (err) {
    return jsonError(400, "USAGE", err instanceof Error ? err.message : `unsafe page key '${key2}'`);
  }
  if (!key2.startsWith(PAGE_BLOB_PREFIX)) {
    return jsonError(403, "FORBIDDEN", `page keys must live under '${PAGE_BLOB_PREFIX}'; '${key2}' does not`);
  }
  const entries = await registeredPageEntries(options2);
  if (!entries.has(key2)) {
    return jsonError(403, "FORBIDDEN", `'${key2}' is not a registered page (no type:Page doc declares it as 'entry')`);
  }
  const nonce = runtime.nonces.mint(key2);
  return new Response(JSON.stringify({ nonce, url: `/__page/${nonce}` }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
function configResponse(options2) {
  const name = options2.mode === "dir" ? basename4(options2.bundle?.root ?? "") || "bundle" : (() => {
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
  } else if (url.pathname === "/__ui/config") {
    response = configResponse(options2);
  } else if (url.pathname === "/__ui/kinds") {
    response = await kindsResponse(options2);
  } else if (url.pathname === "/__ui/edges") {
    response = await edgesResponse(options2, url);
  } else if (url.pathname.startsWith("/v0/")) {
    response = options2.mode === "dir" ? await options2.router(request) : await proxyToRemote(request, options2.remoteBase, options2.apiKey);
  } else {
    const asset = serveAsset(url.pathname, request.headers.get("accept-encoding"));
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
async function bootUiServer(options2) {
  const sessionSecret = options2.sessionSecret ?? mintSessionSecret();
  const runtime = { nonces: new PageNonceRegistry(), sse: new SseHub() };
  runtime.watcher = await bootWatcher(options2, runtime.sse);
  return new Promise((resolve3, reject) => {
    const server = createServer2((req, res) => {
      void handleRequest(req, res, options2, runtime, sessionSecret).catch((err) => {
        res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: { code: "RUNTIME", message: err instanceof Error ? err.message : String(err) } }));
      });
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
      resolve3({
        host: HOST,
        port: addr.port,
        token: sessionSecret,
        close: () => new Promise((resolveClose, rejectClose) => {
          void runtime.watcher?.stop();
          runtime.sse.close();
          server.close((err) => err ? rejectClose(err) : resolveClose());
        })
      });
    });
  });
}

// src/ui/url-file.ts
import { readFile as readFile3, unlink as unlink2 } from "node:fs/promises";
import { homedir as homedir6 } from "node:os";
import { join as join7 } from "node:path";
var UI_URL_FILE_NAME = "ui-url";
function uiUrlFilePath(home2 = homedir6()) {
  return join7(credentialsDir(home2), UI_URL_FILE_NAME);
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
var UI_USAGE = `agentstate-lite ui \u2014 boot the local web UI: a launcher for the bundle's pages (type: Page docs, framed sandboxed with live updates)

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
exchanges it for an HttpOnly, SameSite=Strict cookie. One thing IS persisted: the current run's
tokenized URL is written to ~/.agentstate/ui-url (0600) for one-click re-entry \u2014 a live
credential while this run lasts, removed on clean shutdown; after a crash the leftover token is
dead (the server is gone, and the secret rotates next boot).
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
  const bootUiServer2 = deps.bootUiServer ?? bootUiServer;
  const waitForShutdown = deps.waitForShutdown ?? defaultWaitForShutdown2;
  const openBrowser = deps.openBrowser ?? defaultOpenBrowser;
  const writeUrlFile = deps.writeUrlFile ?? ((url2) => writeUiUrlFile(url2));
  const clearUrlFile = deps.clearUrlFile ?? ((url2) => clearUiUrlFile(url2));
  const { values } = parseOrUsage(
    () => parseArgs23({
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
    options2 = { mode: "remote", port, remoteBase: base, apiKey, kindsBundle };
    rootLabel = base;
  } else {
    const bundle = await openBundle(values.dir);
    const router = createRouter(bundle);
    options2 = { mode: "dir", port, router, bundle };
    rootLabel = bundle.root;
  }
  let usedStablePort = false;
  if (!explicitPort) {
    options2.port = stablePortFor(rootLabel);
    usedStablePort = true;
  }
  let handle;
  try {
    handle = await bootUiServer2(options2);
  } catch (err) {
    if (usedStablePort && err?.code === "EADDRINUSE") {
      options2.port = 0;
      usedStablePort = false;
      try {
        handle = await bootUiServer2(options2);
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

// src/commands/login.ts
import { parseArgs as parseArgs24 } from "node:util";
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
    () => parseArgs24({
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
import { parseArgs as parseArgs25 } from "node:util";

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
async function authRequest(base, path14, options2 = {}) {
  const headers = {};
  if (options2.body !== void 0) headers["content-type"] = "application/json";
  if (options2.authToken) headers["Authorization"] = `Bearer ${options2.authToken}`;
  const request = new Request(`${base}${path14}`, {
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
    () => parseArgs25({
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
import { parseArgs as parseArgs26 } from "node:util";
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
async function join8(argv, deps = {}) {
  const saveApiKey = deps.saveApiKey ?? ((origin2, apiKey) => saveApiKeyForOrigin(origin2, apiKey));
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  const { values } = parseOrUsage(
    () => parseArgs26({
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
import { parseArgs as parseArgs27 } from "node:util";
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
    () => parseArgs27({
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
    () => parseArgs27({
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
    () => parseArgs27({
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
import { parseArgs as parseArgs28 } from "node:util";
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
    () => parseArgs28({
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
    () => parseArgs28({
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
    () => parseArgs28({
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
import { parseArgs as parseArgs29 } from "node:util";
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
    () => parseArgs29({
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
    () => parseArgs29({
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
    () => parseArgs29({
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
        usage: "link (add <from> <to> [--text <t>] | show <id> [--limit <n>] [--text <t>] | list [--from <id|prefix/>] [--to <id|prefix/>] [--text <t>] [--limit <n>]) [--remote <url>]",
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
        summary: "Boot the local web UI: a launcher for the bundle's pages (type: Page docs rendered in sandboxed iframes, with live updates) \u2014 same origin, loopback-only"
      },
      {
        // NOTE: `sync --migrate` (TEMPORARY, founders' one-time act — see commands/sync-migrate.ts)
        // is deliberately ABSENT here: it appears in `sync --help` only (discoverable, not taught),
        // so the skill channels and the compact reference never teach it.
        usage: "sync [--establish | --pull-only | --show-incoming <id> [--out <file>]] [--dir <path>] [--limit <n>]",
        summary: "Share the board branch with a remote \u2014 commits, pulls, and pushes (git tier; --pull-only skips commit+push). `init` makes a LOCAL bundle; --establish is the separate, explicit act that starts sharing it (creates the board branch, pushes; never automatic). A doc changed on both sides converges: teammate's version kept, yours exported; --show-incoming <id> (exclusive with --pull-only) prints the incoming version as of the last fetch. Board-reading commands (list/doc read/status/home/link show) auto-run the ff-only pull when board state is >~5m stale \u2014 silent, bounded (~2s), never a push; AGENTSTATE_LITE_NO_AUTOPULL=<any value, even 0> disables it"
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
import path13 from "node:path";
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
    const root = await findBundleRoot(path13.resolve(startDir));
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
    const boardPath = path13.join(top, BUNDLE_DIR);
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
  if (!remote && deps.boardPull === void 0) {
    try {
      await (deps.autoPull ?? ((d) => maybeAutoPull(d, { requireBoardBundle: false })))(dir);
    } catch {
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
        connectTimeoutSeconds: SESSION_START_CONNECT_TIMEOUT_SECONDS,
        allowLocalBranch: false
      });
    } catch {
      return void 0;
    }
    if (outcome.kind === "no_repo" || outcome.kind === "no_board" || outcome.kind === "local_board") return void 0;
    const boardPath = outcome.boardPath;
    const announcement = provisionAnnouncement(outcome);
    const key2 = resolveBundleKey(boardPath);
    await refreshMarker(key2);
    if (remaining() < MIN_USEFUL_BUDGET_MS) {
      return { offline: true, boardPath, ...announcement ? { announcement } : {} };
    }
    const pulled = await pullBoardAndRecord(boardPath, key2, {
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
        notes: [`board pull skipped (${pulled.swallowed}) \u2014 run \`${cliInvocation()} sync\` to reconcile`]
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
    // ALWAYS a defined boardPull — session-start IS the pull step, so home's own opportunistic
    // trigger must never run under it (fix round LOW 4). A pull that resolved to `undefined`
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
      join: wrap2(join8),
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
