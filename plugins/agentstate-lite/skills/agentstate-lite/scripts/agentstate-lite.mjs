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
    var isObject2 = require_is_extendable();
    module2.exports = function extend(o) {
      if (!isObject2(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject2(obj)) {
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
    function isObject2(subject) {
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
    module2.exports.isObject = isObject2;
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
  for (const row of rows) {
    if (Object.keys(row).length !== header.length) return false;
    for (const key of header) {
      if (!(key in row)) return false;
      if (!isJsonPrimitive(row[key])) return false;
    }
  }
  return true;
}
function* writeTabularRowsLines(rows, header, depth, options2) {
  for (const row of rows) yield indentedLine(depth, encodeAndJoinPrimitives(header.map((key) => row[key]), options2.delimiter), options2.indent);
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
function transformChildren(value, replacer, path15) {
  if (isJsonObject(value)) return transformObject(value, replacer, path15);
  if (isJsonArray(value)) return transformArray(value, replacer, path15);
  return value;
}
function transformObject(obj, replacer, path15) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const childPath = [...path15, key];
    const replacedValue = replacer(key, value, childPath);
    if (replacedValue === void 0) continue;
    result[key] = transformChildren(normalizeValue(replacedValue), replacer, childPath);
  }
  return result;
}
function transformArray(arr, replacer, path15) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const childPath = [...path15, i];
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
function collapseHomeDirectory(path15, homeDir = homedir()) {
  if (!path15.startsWith(homeDir)) {
    return path15;
  }
  return `~${path15.slice(homeDir.length)}`;
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
  readFileSync: (path15, encoding) => readFileSync(path15, encoding)
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
  const path15 = options2.entry.replaceAll("\\", "/");
  if (path15.includes("/_npx/") || /\/dlx-[^/]+\//.test(path15) || path15.includes("/pnpm/dlx/") || path15.includes("/bun/install/cache/")) {
    return { kind: "npx" };
  }
  const homebrewFormula = homebrewFormulaFromPath(path15, env);
  if (homebrewFormula) {
    return { kind: "homebrew", formula: homebrewFormula };
  }
  const pnpmHome = normalizePathRoot(env.PNPM_HOME);
  if (isPathInsideRoot(path15, pnpmHome) || isKnownPnpmGlobalStore(path15, env)) {
    return { kind: "pnpm-global" };
  }
  if (isKnownNpmGlobalInstall(path15, env)) {
    return { kind: "npm-global" };
  }
  return { kind: "unknown" };
}
function normalizePathRoot(path15) {
  const normalized = path15?.replaceAll("\\", "/").replace(/\/+$/, "");
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function isPathInsideRoot(path15, root) {
  return root !== void 0 && (path15 === root || path15.startsWith(`${root}/`));
}
function homebrewFormulaFromPath(path15, env) {
  for (const root of homebrewCellarRoots(env)) {
    if (!isPathInsideRoot(path15, root)) {
      continue;
    }
    const relative = path15.slice(root.length).replace(/^\/+/, "");
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
function isKnownPnpmGlobalStore(path15, env) {
  return pnpmGlobalStoreRoots(env).some((root) => {
    if (!isPathInsideRoot(path15, root)) {
      return false;
    }
    const relative = path15.slice(root.length).replace(/^\/+/, "");
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
function isKnownNpmGlobalInstall(path15, env) {
  return npmGlobalNodeModulesRoots(env).some((root) => isPathInsideRoot(path15, root)) || isKnownVersionManagerNpmGlobal(path15, env);
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
function isKnownVersionManagerNpmGlobal(path15, env) {
  return versionManagerNodeRoots(env).some((root) => isPathInsideRoot(path15, root) && path15.includes("/lib/node_modules/"));
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
  const realpath = options2.realpath ?? ((path15) => realpathSync(path15));
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
function assertSafeBlobKey(key) {
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error("Blob key must be a non-empty string.");
  }
  const norm = toPosix(key);
  if (norm.startsWith("/")) {
    throw new Error(`Blob key must be bundle-relative, got absolute '${key}'.`);
  }
  const segments = norm.split("/");
  if (segments.some((seg) => seg === "..")) {
    throw new Error(`Blob key must not contain '..' segments: '${key}'.`);
  }
  if (segments.some((seg) => seg.startsWith("."))) {
    throw new Error(`Blob key must not contain dot-prefixed segments: '${key}'.`);
  }
  const last = segments[segments.length - 1] ?? "";
  if (last === "") {
    throw new Error(`Blob key must name a file, not end with '/': '${key}'.`);
  }
  if (segments.some((seg) => seg.toLowerCase().endsWith(".md"))) {
    throw new Error(
      `Blob key '${key}' has a path segment ending in '.md' (checked case-insensitively, at any depth), which collides with the concept-document namespace \u2014 write it as a doc instead.`
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
  withLock(key, fn) {
    const locks = _FilesystemBackend.locks;
    const tail = locks.get(key) ?? Promise.resolve();
    const run = tail.then(fn, fn);
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
  async readBlob(key) {
    assertSafeBlobKey(key);
    let bytes;
    try {
      bytes = await fs.readFile(this.abs(key));
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
      await fs.unlink(target);
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
function toStringArrayLenient(value, path15, docId, warnings) {
  if (!Array.isArray(value)) {
    if (value !== void 0) {
      warnings.push({
        code: "KIND_CONVENTION_BAD_SHAPE",
        message: `kind convention '${docId}' has a non-list '${path15}' (${describeShape(value)}; expected a list of strings); ignoring it.`,
        field: path15,
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
        message: `kind convention '${docId}' has a non-scalar member (${describeShape(v)}) in '${path15}'; skipping it.`,
        field: path15,
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
  const path15 = typeof fm.path === "string" && fm.path.trim() !== "" ? fm.path.trim() : void 0;
  const freshnessHorizon = typeof fm.freshness_horizon === "string" && fm.freshness_horizon.trim() !== "" ? fm.freshness_horizon.trim() : void 0;
  const kind2 = {
    id: doc2.id,
    title,
    governs,
    fields: { required, optional, values, valueDescriptions, terminal, descriptions }
  };
  if (description !== void 0) kind2.description = description;
  if (path15 !== void 0) kind2.path = path15;
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

// src/bundle.ts
import { promises as fs2 } from "node:fs";
import path4 from "node:path";

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
  const path15 = url.pathname.replace(/\/+$/, "");
  return { base: url.origin + path15, resource: url.origin };
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
  const path15 = join3(dir, fileName);
  const tmpPath = join3(dir, `.${fileName}.${randomBytes(8).toString("hex")}.tmp`);
  const handle = await open(tmpPath, "wx", FILE_MODE);
  try {
    await handle.writeFile(content);
    await handle.chmod(FILE_MODE);
  } finally {
    await handle.close();
  }
  try {
    await rename(tmpPath, path15);
  } catch (err) {
    await unlink(tmpPath).catch(() => {
    });
    throw err;
  }
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
  const key = creds?.remotes?.[origin]?.api_key;
  return isNonEmptyString(key) ? key : void 0;
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
  return { file, target: path4.resolve(dir, trimmed) };
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
  if (!await exists(path4.join(root, "index.md"))) {
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
  try {
    return await fs2.realpath(root);
  } catch {
    throw new CliError("NOT_FOUND", notFoundMessage, { help });
  }
}
async function resolveLocalBundleTarget(dirFlag, startDir = process.cwd()) {
  if (dirFlag !== void 0) {
    const requested = path4.resolve(startDir, dirFlag);
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
async function applyRecipe(bundle, recipe2, now = (/* @__PURE__ */ new Date()).toISOString()) {
  await assertPageTargetsCompatible(bundle, recipe2, now);
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
  const pages = [];
  for (const page of recipe2.pages) {
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
  return {
    id: recipe2.id,
    version: recipe2.version,
    source: recipe2.source,
    docs,
    pages,
    changed: docs.some((d) => d.changed) || pages.some((page) => page.changed),
    warnings: recipe2.warnings
  };
}
async function assertPageTargetsCompatible(bundle, recipe2, now) {
  if (recipe2.pages.length === 0) return;
  const registryDocs = await query(bundle, { prefix: "pages-registry/" });
  const registries = new Map(registryDocs.map((doc2) => [doc2.id, doc2]));
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

// src/recipe-source.ts
import { promises as fs3 } from "node:fs";
import os from "node:os";
import path5 from "node:path";

// ../core/src/page.ts
var PAGE_SEGMENT = /^[A-Za-z0-9._-]+$/;
function hasSafePageSegments(value, prefix) {
  if (!value.startsWith(prefix) || value.length === prefix.length) return false;
  if (value.startsWith("/") || /[\\%?#]/.test(value)) return false;
  const segments = value.slice(prefix.length).split("/");
  return segments.every((segment) => !segment.startsWith(".") && PAGE_SEGMENT.test(segment));
}
function isPageRegistryId(id) {
  if (typeof id !== "string" || id.endsWith(".md") || !hasSafePageSegments(id, "pages-registry/")) {
    return false;
  }
  try {
    assertSafeConceptId(id);
    return true;
  } catch {
    return false;
  }
}
function isPageEntryKey(entry) {
  if (typeof entry !== "string" || !hasSafePageSegments(entry, "pages/")) return false;
  try {
    assertSafeBlobKey(entry);
    return true;
  } catch {
    return false;
  }
}

// src/recipe-source.ts
var RESERVED_MANIFEST_KEYS = ["composes", "seeds", "requires"];
function nonEmptyString(v) {
  return typeof v === "string" ? v.trim() : "";
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
    if (!isRecord(value)) {
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
    if (!registry.startsWith("pages-registry/") || !registry.endsWith(".md")) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${recipeId}': Page registry '${registry}' must be a .md file under 'pages-registry/'`
        }
      };
    }
    if (!entry.startsWith("pages/") || !entry.endsWith(".html")) {
      return {
        ok: false,
        error: {
          code: "RECIPE_UNSAFE_PATH",
          message: `recipe '${recipeId}': Page entry '${entry}' must be a .html file under 'pages/'`
        }
      };
    }
    const registryId = registry.slice(0, -3);
    if (!isPageRegistryId(registryId) || !isPageEntryKey(entry) || isReservedFile(registry)) {
      return {
        ok: false,
        error: { code: "RECIPE_UNSAFE_PATH", message: `recipe '${recipeId}' contains an unsafe Page path` }
      };
    }
    const registryTarget = registryId.toLowerCase();
    const entryTarget = entry.toLowerCase();
    if (registries.has(registryTarget) || entries.has(entryTarget)) {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${recipeId}' declares a duplicate Page registry or entry at pages[${index}]`
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
  const declaredPageFiles = new Set(pageDeclarations.pages.flatMap((page) => [page.registry, page.entry]));
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
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}' is missing declared Page file '${missingPath}'` }
      };
    }
    if (entryFile.bytes.trim() === "") {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': Page entry '${declaration.entry}' is empty` }
      };
    }
    const { frontmatter, body } = parseMarkdown(registryFile.bytes);
    if (frontmatter.type !== "Page") {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.registry}' must declare 'type: Page'`
        }
      };
    }
    if (!nonEmptyString(frontmatter.title)) {
      return {
        ok: false,
        error: { code: "RECIPE_MALFORMED", message: `recipe '${id}': '${declaration.registry}' needs a title` }
      };
    }
    if (frontmatter.bridge !== "none" && frontmatter.bridge !== "bundle-read") {
      return {
        ok: false,
        error: {
          code: "RECIPE_MALFORMED",
          message: `recipe '${id}': '${declaration.registry}' needs bridge: none or bridge: bundle-read`
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
  const recipe2 = { id, title, version, summary, source, docs, pages, governs: governsList, warnings };
  if (contentPolicy === "definitions-only") recipe2.contentPolicy = contentPolicy;
  return { ok: true, recipe: recipe2 };
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
  const rootReal = await fs3.realpath(root);
  const manifestPath = path5.join(root, "recipe.md");
  const manifestStat = await fs3.stat(manifestPath).catch(() => null);
  if (manifestStat?.isFile()) {
    const manifestReal = await fs3.realpath(manifestPath).catch(() => null);
    if (!manifestReal || manifestReal !== rootReal && !manifestReal.startsWith(rootReal + path5.sep)) {
      throw new RecipeUnsafePathSignal("recipe.md");
    }
    const bytes = await fs3.readFile(manifestPath, "utf8");
    files.push({ path: "recipe.md", bytes });
    const { frontmatter } = parseMarkdown(bytes);
    if (frontmatter.content_policy === "definitions-only" || frontmatter.pages !== void 0) {
      await walkRecipeFiles(root, "", rootReal, files, /* @__PURE__ */ new Set(["recipe.md"]));
      return files;
    }
  }
  const conventionsRoot = path5.join(root, "conventions");
  const conventionsStat = await fs3.stat(conventionsRoot).catch(() => null);
  if (conventionsStat?.isDirectory()) {
    await walkConventions(conventionsRoot, "conventions", rootReal, files);
  }
  return files;
}
async function walkRecipeFiles(dir, relPrefix, rootReal, out, skip) {
  const entries = await fs3.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path5.join(dir, entry.name);
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    if (skip.has(rel)) continue;
    if (entry.isDirectory()) {
      await walkRecipeFiles(abs, rel, rootReal, out, skip);
      continue;
    }
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    const real = await fs3.realpath(abs).catch(() => null);
    if (!real || real !== rootReal && !real.startsWith(rootReal + path5.sep)) {
      throw new RecipeUnsafePathSignal(rel);
    }
    const stat2 = await fs3.stat(real).catch(() => null);
    if (!stat2?.isFile()) throw new RecipeUnsafePathSignal(rel);
    out.push({ path: rel, bytes: await fs3.readFile(abs, "utf8") });
  }
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
      const stat2 = await fs3.stat(real).catch(() => null);
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
function attributeCandidate(candidate, actor, persistActor) {
  if (!persistActor || actor === void 0) return candidate;
  return { ...candidate, frontmatter: { ...candidate.frontmatter, actor } };
}
async function mutateDoc(opts) {
  const { bundle, id, mode, registry, strict, helpOnKindReject, buildCandidate, errors } = opts;
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const onAbsent = opts.onAbsent ?? "fail";
  const compareTimestamp = opts.compareTimestamp ?? false;
  const validate = (candidate) => defaultTimestampAndValidateKind({ id, ...candidate }, registry, { strict, helpOnReject: helpOnKindReject });
  if (mode === "create-only") {
    const candidate = attributeCandidate(await buildCandidate(void 0), opts.actor, opts.persistActor ?? false);
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
          const candidate = attributeCandidate(
            await buildCandidate(existing),
            opts.actor,
            opts.persistActor ?? false
          );
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
        const attributed = attributeCandidate(candidate, opts.actor, opts.persistActor ?? false);
        const warnings = validate(attributed);
        return { action: "write", next: { id, ...attributed }, result: { warnings } };
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
      if (err instanceof CliError && err.code === "TRANSIENT") return null;
      throw err;
    }
  };
  let remoteState = "absent";
  let remoteBoardKnownAbsent = false;
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
function keyDigest(key) {
  return createHash2("sha256").update(key, "utf8").digest("hex").slice(0, 32);
}
function syncStatePath(key, home2 = homedir4()) {
  return join4(syncStateDir(home2), `${keyDigest(key)}.json`);
}
function syncExportsDir(key, home2 = homedir4()) {
  return join4(syncStateDir(home2), "exports", keyDigest(key));
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
function isRecord2(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isTimestamp(v) {
  return typeof v === "string" && Number.isFinite(Date.parse(v));
}
function isCount(v) {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}
function asCursor(v) {
  if (!isRecord2(v)) return null;
  if (typeof v.tier !== "string" || v.tier.length === 0) return null;
  const token = v.token;
  const tokenOk = typeof token === "string" && token.length > 0 || typeof token === "number" && Number.isFinite(token);
  if (!tokenOk) return null;
  return { ...v };
}
function asDeltaRow(v) {
  if (!isRecord2(v)) return null;
  for (const field of ["docId", "verb", "kind", "title", "actor"]) {
    if (typeof v[field] !== "string") return null;
  }
  return { ...v };
}
function asCache(v) {
  if (!isRecord2(v)) return null;
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
  if (!isRecord2(v)) return null;
  if (!isTimestamp(v.updatedAt)) return null;
  return { ...v };
}
function asSelfActors(v) {
  if (!Array.isArray(v)) return null;
  if (!v.every((a) => typeof a === "string" && a.length > 0)) return null;
  return [...v];
}
async function readSyncState(key, home2 = homedir4()) {
  let raw;
  try {
    raw = await readFile2(syncStatePath(key, home2), "utf8");
  } catch {
    return { ...EMPTY_STATE };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ...EMPTY_STATE };
  }
  if (!isRecord2(parsed)) return { ...EMPTY_STATE };
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
async function readCursor(key, home2 = homedir4()) {
  return (await readSyncState(key, home2)).cursor;
}
async function writeSyncState(key, patch, home2 = homedir4()) {
  const next = { ...await readSyncState(key, home2), ...patch };
  const parent = credentialsDir(home2);
  await mkdir2(parent, { recursive: true, mode: DIR_MODE2 });
  await chmod2(parent, DIR_MODE2);
  const path15 = syncStatePath(key, home2);
  const record = {
    key,
    cursor: next.cursor ?? void 0,
    cache: next.cache ?? void 0,
    marker: next.marker ?? void 0,
    selfActors: next.selfActors ?? void 0,
    autoPullAttemptAt: next.autoPullAttemptAt ?? void 0,
    hookHintedAt: next.hookHintedAt ?? void 0
  };
  await writeFileAtomic0600(syncStateDir(home2), basename3(path15), JSON.stringify(record, null, 2) + "\n");
  return next;
}
async function writeCursor(key, cursor, home2 = homedir4()) {
  if (asCursor(cursor) === null) {
    throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
  }
  await writeSyncState(key, { cursor }, home2);
}
async function writeCache(key, cache, home2 = homedir4()) {
  if (asCache(cache) === null) {
    throw new TypeError(
      "cache must carry { updatedAt: ISO timestamp, delta: AwarenessDeltaRow[], unpushedCount, uncommittedCount }"
    );
  }
  await writeSyncState(key, { cache }, home2);
}
async function refreshMarker(key, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  const current = (await readSyncState(key, home2)).marker;
  const marker = { ...current ?? {}, updatedAt: now().toISOString() };
  await writeSyncState(key, { marker }, home2);
  return marker;
}
async function recordSelfActors(key, actors, home2 = homedir4()) {
  const current = (await readSyncState(key, home2)).selfActors ?? [];
  const merged = [...current];
  for (const a of actors) {
    if (typeof a !== "string" || a.length === 0 || a === "unknown") continue;
    if (!merged.includes(a)) merged.push(a);
  }
  const capped = merged.slice(-SELF_ACTORS_CAP);
  if (capped.length === current.length && capped.every((a, i) => a === current[i])) {
    return current;
  }
  await writeSyncState(key, { selfActors: capped }, home2);
  return capped;
}
async function recordReanchor(key, cursor, counts, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
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
  await writeSyncState(key, { cursor, cache }, home2);
  return cache;
}
async function recordAutoPullAttempt(key, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  await writeSyncState(key, { autoPullAttemptAt: now().toISOString() }, home2);
}
async function readHookHintedAt(key, home2 = homedir4()) {
  return (await readSyncState(key, home2)).hookHintedAt;
}
async function recordHookHinted(key, home2 = homedir4(), now = () => /* @__PURE__ */ new Date()) {
  await writeSyncState(key, { hookHintedAt: now().toISOString() }, home2);
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
function readSettings(path15) {
  if (!existsSync4(path15)) return {};
  try {
    return JSON.parse(readFileSync3(path15, "utf8"));
  } catch {
    return {};
  }
}
function writeSettings(path15, settings) {
  mkdirSync2(dirname2(path15), { recursive: true });
  writeFileSync2(path15, `${JSON.stringify(settings, null, 2)}
`);
}
function opencodePluginInstalled(path15) {
  if (!existsSync4(path15)) return false;
  try {
    return readFileSync3(path15, "utf8").includes(OPENCODE_MANAGED_MARKER);
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
  for (const path15 of [targets.claudeSettings, targets.codexHooks]) {
    const [updated, didChange] = computeHookUninstall(readSettings(path15));
    if (didChange) {
      writeSettings(path15, updated);
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
  const boundIsConventional = path8.resolve(binding.target) === boardPath;
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
  const key = resolveBundleKey(conversion.boardPath);
  await refreshMarker(key);
  if (snapshot2.docs.length > 0) await recordSelfActors(key, snapshot2.docs.map((d) => d.actor));
  await writeCursor(key, { tier: "git", token: conversion.boardCommit });
  await writeCache(key, {
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
  return `if a teammate already shares this project's board, make sure your \`origin\` remote points at the SAME repository they pushed the \`board\` branch to; if nobody has started sharing this project's board yet, run \`${inv} sync --establish\` to start \u2014 until then a local-only board is a supported mode: every local command keeps working, and nothing leaves this machine`;
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
async function throwPostCommitFailure(err, committedThisRun, key, boardPath) {
  if (!committedThisRun) throw err;
  const wrapped = new CliError(err.code, pushFailureMessage(err), { details: err.details, help: err.help });
  await writeCache(key, {
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
async function hookInstallHintOnce(key, inv, installed = hookInstalled) {
  try {
    if (installed()) return void 0;
    if (await readHookHintedAt(key) !== null) return void 0;
    await recordHookHinted(key);
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
        "the board branch isn't linked to a remote \u2014 there is nothing to pull from or push to (a local-only board is a supported mode; sharing needs a remote 'board' branch)",
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
var SYNC_LOCAL_ONLY_MESSAGE = "local-only board \u2014 no shared board branch exists, so there is nothing to pull or push";
function syncLocalOnlyNote(inv) {
  return `a supported mode: every local command works, and your board changes stay on this machine (sync committed nothing). To share the board with teammates, run \`${inv} sync --establish\` \u2014 it publishes the board as a 'board' branch on the repo's 'origin' remote (add one first if the repo has none); teammates then just run sync.`;
}
var SYNC_REMOTE_STATE_UNKNOWN_MESSAGE = "shared board state unknown \u2014 origin could not be checked, so sync cannot tell whether a remote board exists";
function syncRemoteStateUnknownNote(inv, hasLocalBundle) {
  const local = hasLocalBundle ? "your local bundle remains usable and sync committed nothing. " : "sync changed nothing. ";
  return local + `Retry \`${inv} sync\` when origin is available; a shared board may already exist.`;
}
function hasLocalOnlyBundle(dir) {
  const top = repoTopLevel(dir);
  if (!top) return false;
  return existsSync6(path9.join(top, BUNDLE_DIR, "index.md"));
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
  if (outcome.kind === "no_repo") {
    stdout(render({ sync: "nothing to sync" }, mode));
    return;
  }
  if (outcome.kind === "no_board") {
    const hasLocalBundle = hasLocalOnlyBundle(dir);
    if (outcome.remoteState === "unknown") {
      stdout(
        render(
          {
            sync: SYNC_REMOTE_STATE_UNKNOWN_MESSAGE,
            note: syncRemoteStateUnknownNote(inv, hasLocalBundle)
          },
          mode
        )
      );
      return;
    }
    if (hasLocalBundle) {
      stdout(render({ sync: SYNC_LOCAL_ONLY_MESSAGE, note: syncLocalOnlyNote(inv) }, mode));
      return;
    }
    stdout(render({ sync: "nothing to sync" }, mode));
    return;
  }
  const boardPath = outcome.boardPath;
  const top = path9.dirname(boardPath);
  if (outcome.kind === "repaired") {
    healStaleRebaseBeforeProvisioning(dir);
  }
  const key = resolveBundleKey(boardPath);
  await refreshMarker(key);
  const storedCursor = await readCursor(key);
  const startHead = currentHead(boardPath);
  const preFetchOriginRef = resolveOriginRef(boardPath);
  let commitResult = { committed: false, docs: [] };
  if (!pullOnly) {
    commitResult = stageAndCommit(boardPath);
    if (commitResult.committed && commitResult.docs.length > 0) {
      await recordSelfActors(key, commitResult.docs.map((d) => d.actor));
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
      rebaseOutcome = fetchRebaseResolving(boardPath, syncExportsDir(key));
    } catch (rawErr) {
      const enriched = withProvisionAnnouncement(withUpstreamHelp(toCliError(rawErr, "rebase"), inv), outcome);
      throw await throwPostCommitFailure(enriched, commitResult.committed, key, boardPath);
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
      throw await throwPostCommitFailure(conflictErr, commitResult.committed, key, boardPath);
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
      throw await throwPostCommitFailure(noUpstream, commitResult.committed, key, boardPath);
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
    await writeCursor(key, { tier: "git", token: postPullHead });
  } else {
    changes = [];
    reanchorNote = REANCHOR_NOTE;
    await recordReanchor(
      key,
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
      await writeCache(key, {
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        delta: toDeltaRows(changes),
        unpushedCount: unpushedCount(boardPath) ?? 0,
        uncommittedCount: countUncommitted(boardPath),
        ...reanchorNote ? { note: reanchorNote } : {}
      });
      throw asHandled(new CliError(classified.code, warning, { details: classified.details }));
    }
  }
  await writeCache(key, {
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
    ...reanchorNote ? { note: reanchorNote } : {}
  });
  const committedCount = commitResult.docs.length;
  const pulledCount = originDelta.length;
  const hookHint = await hookInstallHintOnce(key, inv, deps.hookInstalled);
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
var SHOW_INCOMING_NO_UPSTREAM = "there is no fetched origin/board state to show \u2014 either this board is local-only (no remote board branch, so no incoming versions exist), or nothing has been fetched yet";
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
      if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0) {
        throw ffSwallowToError("no-upstream", inv, top);
      }
      throw new CliError("NO_UPSTREAM", SHOW_INCOMING_NO_UPSTREAM, {
        help: `on a shared board, run ${inv} sync --pull-only once to fetch origin/board, then re-run --show-incoming`
      });
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
async function pullBoardAndRecord(boardPath, key, budget = {}, now = () => /* @__PURE__ */ new Date()) {
  const storedCursor = await readCursor(key);
  const startHead = currentHead(boardPath);
  const ff = ffPull(boardPath, budget);
  if (ff.swallowed) {
    return { swallowed: ff.swallowed, refreshed: false };
  }
  const cursorToken = storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string" ? storedCursor.token : void 0;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? startHead);
  if (delta.ok) {
    await writeCursor(key, { tier: "git", token: postPullHead });
    await writeCache(key, {
      updatedAt: now().toISOString(),
      delta: toDeltaRows(delta.changes),
      unpushedCount: unpushedCount(boardPath) ?? 0,
      uncommittedCount: countUncommitted(boardPath)
    });
  } else {
    await recordReanchor(
      key,
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
    const key = resolveBundleKey(boardPath);
    const state = await readSyncState(key);
    const nowMs = now().getTime();
    const ageOk = (iso) => typeof iso === "string" && nowMs - Date.parse(iso) <= staleMs;
    if (ageOk(state.cache?.updatedAt)) return "fresh";
    if (ageOk(state.autoPullAttemptAt)) return "throttled";
    const gitTop = repoTopLevel(candidate.top);
    if (!gitTop || realOrSame3(path10.join(gitTop, BUNDLE_DIR)) !== realOrSame3(boardPath) || !isProvisioned(gitTop)) {
      return "no-board";
    }
    await recordAutoPullAttempt(key, void 0, now);
    await refreshMarker(key, void 0, now);
    const result = await pullBoardAndRecord(
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
    () => parseArgs6({
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
  if (!remote) await (deps.autoPull ?? maybeAutoPull)(values.dir);
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
  const lexicalTarget = path11.resolve(bodyOut);
  const rootReal = await fs7.realpath(path11.resolve(bundle.root)).catch(() => path11.resolve(bundle.root));
  const effectiveTarget = await effectiveOutputPath(lexicalTarget);
  const inside = (candidate, base) => candidate === base || candidate.startsWith(base + path11.sep);
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
      return path11.join(await fs7.realpath(probe), ...missingSuffix);
    } catch {
      const parent = path11.dirname(probe);
      if (parent === probe) return absoluteTarget;
      missingSuffix.unshift(path11.basename(probe));
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
  return new CliError("USAGE", err instanceof Error ? err.message : String(err));
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
                  (mutually exclusive with --dir; remote access is always explicit)
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
          if (err instanceof RemoteError) throw classifyBundleError(err, opts.remoteUrl);
          throw err;
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
    () => parseArgs13({
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
  const { values, positionals, tokens } = parseOrUsage(() => {
    try {
      return parseArgs15({
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
  receipt.version = finalVersion;
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
  const row = {
    governs: kind2.governs,
    required: kind2.fields.required,
    optional: kind2.fields.optional
  };
  if (kind2.description) row.description = kind2.description;
  if (Object.keys(kind2.fields.descriptions).length > 0) row.descriptions = kind2.fields.descriptions;
  if (Object.keys(kind2.fields.values).length > 0) row.values = kind2.fields.values;
  if (Object.keys(kind2.fields.valueDescriptions ?? {}).length > 0) {
    row.value_descriptions = kind2.fields.valueDescriptions;
  }
  if (Object.keys(kind2.fields.terminal).length > 0) row.terminal = kind2.fields.terminal;
  if (kind2.links && Object.keys(kind2.links).length > 0) row.links = kind2.links;
  if (kind2.linkDescriptions && Object.keys(kind2.linkDescriptions).length > 0) {
    row.link_descriptions = kind2.linkDescriptions;
  }
  if (kind2.expectsInbound && Object.keys(kind2.expectsInbound).length > 0) row.expects_inbound = kind2.expectsInbound;
  if (kind2.path) row.path = kind2.path;
  if (kind2.sections && kind2.sections.length > 0) {
    row.sections = kind2.sections;
    row.required_headings = kind2.sections.map((section) => `# ${section}`);
  }
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
import { parseArgs as parseArgs18 } from "node:util";
var RECIPES_USAGE = `agentstate-lite recipes \u2014 list built-in recipes and whether each is applied

Usage:
  agentstate-lite recipes [--dir <path>] [--remote <url>]

A recipe is a folder ('recipe.md' manifest + 'conventions/*.md' docs) that 'recipe add
<name-or-path>' installs onto a bundle in one shot \u2014 idempotently (re-adding an already-applied
recipe is a changed:false no-op). A definitions-only portable recipe may also declare Page
registry/HTML pairs without carrying instances. This command lists the BUILT-IN recipes shipped
with the CLI; an external recipe (a path) is not enumerated here, only path-addressed via
'recipe add <path>'.
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

Applies a recipe's definitions to the bundle. <name-or-path> is a built-in name (e.g.
'context-notes') or a path to a recipe folder (a path is anything containing '/' or starting
with '~' \u2014 a local folder literally named 'foo' is reachable only as './foo'). A recipe folder
is 'recipe.md' (type: Recipe manifest) plus one or more 'conventions/*.md' docs. A portable recipe
may opt into 'content_policy: definitions-only' and explicitly declare self-contained Page
registry/HTML pairs; instance data and undeclared files are then rejected before any write.

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
  if (result.pages.length > 0) receipt.pages = result.pages;
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
                         (mutually exclusive with --dir; remote access is always explicit)
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
import { promises as fs11 } from "node:fs";
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
      const key = `${doc2.id} ${link2.to}`;
      if (seen.has(key)) continue;
      seen.add(key);
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
    const stat2 = await fs11.stat(root).catch(() => null);
    if (!stat2 || !stat2.isDirectory()) {
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
  await fs11.mkdir(path12.dirname(out), { recursive: true });
  const tmp = out + ".tmp-" + process.pid;
  await fs11.writeFile(tmp, html, "utf8");
  await fs11.rename(tmp, out);
  return { out, nodeCount: data.nodes.length, edgeCount: data.edges.length };
}

// src/commands/view.ts
var VIEW_USAGE = `agentstate-lite view \u2014 bake the bundle into one self-contained static HTML file

Usage:
  agentstate-lite view [--dir <path>] [--out <path>] [--name <label>]

Options:
  --dir <path>         Bundle directory (default: discovered from the cwd)
  --remote <url>       Talk to a wire-protocol server instead of a local bundle
                       (mutually exclusive with --dir; remote access is always explicit).
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
  "/assets/fonts/CormorantGaramond-OFL.txt": { contentType: "text/plain; charset=utf-8", gzipBase64: "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" },
  "/assets/index-Ci37R-Lw.css": { contentType: "text/css; charset=utf-8", gzipBase64: "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" },
  "/assets/index-GFlneHKb.js": { contentType: "application/javascript; charset=utf-8", gzipBase64: "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" },
  "/index.html": { contentType: "text/html; charset=utf-8", gzipBase64: "H4sIAAAAAAAC/12QwU7EMAxE7/0K4zPdCHGAQ9ILEiDBiT/IJt7WkCZV7G3p36NulwOcLM9Yz6OxN7EEXSeCQcfUNXYbkHzuHVLGTSAfu8aOpB7C4KuQOjzrqX1EML9G9iM5nJmWqVRFCCUrZXW4cNTBRZo5UHtZboEzK/vUSvCJ3N2OUdZEne8pq6hXahMrWbPLDYCVUHlS2LI6HEs8J0IItYiUyj1nkBocGi9CKoZzpO/25Tllen07Hj4FO2t2xIWWOH9BpeRQdE0kA5H+xQ2VTv95T3z/8NG+L4cgsnVjruUcS1y7xkaegaPDWopu/yLP29HVNXvDPyAz7jZyAQAA" }
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
  mint(key) {
    this.sweepExpired();
    while (this.map.size >= this.maxEntries) {
      const oldest = this.map.keys().next().value;
      if (oldest === void 0) break;
      this.map.delete(oldest);
    }
    const nonce = randomBytes3(32).toString("base64url");
    this.map.set(nonce, { key, expiresAt: Date.now() + this.ttlMs });
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
  let keys = [];
  try {
    keys = await listBlobs(bundle, PAGE_BLOB_PREFIX);
  } catch {
    keys = [];
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
function encodeBlobKeyPath(key) {
  return key.split("/").map(encodeURIComponent).join("/");
}
async function readPageBlob(options2, key) {
  if (options2.mode === "dir") {
    const r = await readBlob(options2.bundle, key);
    return r ? { bytes: r.bytes, contentType: r.contentType } : null;
  }
  const target = `${options2.remoteBase}/v0/bundles/${REMOTE_BUNDLE2}/blobs/${encodeBlobKeyPath(key)}`;
  const headers = {};
  if (options2.apiKey) headers.authorization = `Bearer ${options2.apiKey}`;
  const res = await fetch(target, { headers });
  if (!res.ok) return null;
  return { bytes: new Uint8Array(await res.arrayBuffer()), contentType: res.headers.get("content-type") ?? "application/octet-stream" };
}
async function servePageBytes(options2, runtime, nonce) {
  const key = runtime.nonces.resolve(nonce);
  if (!key) return pageError(403, "This page link is unknown or has expired. Reopen the page from the launcher.");
  if (!(await registeredPageEntries(options2)).has(key)) {
    return pageError(403, "This page is no longer registered in the bundle (its registry doc was removed or retargeted).");
  }
  const blob = await readPageBlob(options2, key);
  if (!blob) return pageError(404, `No page bytes found for '${key}'.`);
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
  const key = typeof payload.key === "string" ? payload.key.trim() : "";
  if (!key) return jsonError(400, "USAGE", "request body must include a non-empty page key");
  try {
    assertSafeBlobKey(key);
  } catch (err) {
    return jsonError(400, "USAGE", err instanceof Error ? err.message : `unsafe page key '${key}'`);
  }
  if (!key.startsWith(PAGE_BLOB_PREFIX)) {
    return jsonError(403, "FORBIDDEN", `page keys must live under '${PAGE_BLOB_PREFIX}'; '${key}' does not`);
  }
  const entries = await registeredPageEntries(options2);
  if (!entries.has(key)) {
    return jsonError(403, "FORBIDDEN", `'${key}' is not a registered page (no type:Page doc declares it as 'entry')`);
  }
  const nonce = runtime.nonces.mint(key);
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
  --remote <url>         Reverse-proxy /v0/* to a deployed remote instead (explicit only)
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

// src/reference.ts
var DESCRIPTION = "read and write a local OKF knowledge bundle (context notes, docs, cross-links, static-HTML view)";
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
        summary: "Apply a recipe's content-free definitions \u2014 Kinds and optional declared Pages \u2014 idempotently"
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
import { parseArgs as parseArgs24 } from "node:util";
import path14 from "node:path";

// src/catalog.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import { chmod as chmod3, mkdir as mkdir3, open as open2, readFile as readFile4, stat, unlink as unlink3 } from "node:fs/promises";
import { homedir as homedir7 } from "node:os";
import path13 from "node:path";
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
function catalogPath(home2 = homedir7()) {
  return path13.join(catalogDir(home2), CATALOG_FILE_NAME);
}
function catalogLockPath(home2 = homedir7()) {
  return path13.join(catalogDir(home2), CATALOG_LOCK_FILE_NAME);
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function hasExactKeys(value, expected) {
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
  if (!isObject(value) || !hasExactKeys(value, ["id", "label", "locator"])) {
    throw invalidCatalog(file, `entries[${index}] must contain exactly id, label, and locator`);
  }
  if (typeof value.id !== "string" || !ID_PATTERN.test(value.id)) {
    throw invalidCatalog(file, `entries[${index}].id must match ${ID_PATTERN.source}`);
  }
  if (typeof value.label !== "string" || !LABEL_PATTERN.test(value.label) || value.label.startsWith("bnd_")) {
    throw invalidCatalog(file, `entries[${index}].label is not a valid workspace label`);
  }
  if (!isObject(value.locator) || !hasExactKeys(value.locator, ["kind", "path"])) {
    throw invalidCatalog(file, `entries[${index}].locator must contain exactly kind and path`);
  }
  if (value.locator.kind !== "local-path") {
    throw invalidCatalog(file, `entries[${index}].locator.kind must be "local-path"`);
  }
  if (typeof value.locator.path !== "string" || !path13.isAbsolute(value.locator.path) || path13.normalize(value.locator.path) !== value.locator.path) {
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
  if (!isObject(parsed)) throw invalidCatalog(file, "top level must be an object");
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
  if (!hasExactKeys(parsed, ["entries", "schema_version"]) || !Array.isArray(parsed.entries)) {
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
async function loadCatalog(home2 = homedir7(), signal) {
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
    if (!isObject(value) || typeof value.pid !== "number" || !Number.isSafeInteger(value.pid) || value.pid <= 0 || typeof value.created_at_ms !== "number" || !Number.isFinite(value.created_at_ms) || typeof value.token !== "string" || value.token.length === 0) {
      return null;
    }
    return { pid: value.pid, created_at_ms: value.created_at_ms, token: value.token };
  } catch {
    return null;
  }
}
async function acquireCatalogLock(options2) {
  const home2 = options2.home ?? homedir7();
  const dir = catalogDir(home2);
  const lockPath = catalogLockPath(home2);
  const now = options2.now ?? Date.now;
  const pid = options2.pid ?? process.pid;
  const sleep = options2.sleep ?? ((ms) => new Promise((resolve3) => setTimeout(resolve3, ms)));
  const processExists = options2.processExists ?? defaultProcessExists;
  const waitMs = options2.lockWaitMs ?? DEFAULT_LOCK_WAIT_MS;
  const pollMs = options2.lockPollMs ?? DEFAULT_LOCK_POLL_MS;
  const token = randomUUID2();
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
    if (owner && now() - owner.created_at_ms >= STALE_LOCK_MIN_AGE_MS && !processExists(owner.pid)) {
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
  const home2 = options2.home ?? homedir7();
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
    const id = options2.createId?.() ?? `bnd_${randomUUID2().replaceAll("-", "")}`;
    if (!ID_PATTERN.test(id)) throw new Error(`catalog id generator returned invalid id: ${id}`);
    if (!existing.has(id)) return id;
  }
  throw new Error("catalog id generator exhausted collision retries");
}
async function addCatalogEntry(label, canonicalPath, options2 = {}) {
  assertCatalogLabel(label);
  if (!path13.isAbsolute(canonicalPath)) throw new CliError("USAGE", "workspace catalog paths must be absolute");
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
async function listCatalogEntries(home2 = homedir7()) {
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
async function resolveCatalogEntry(selector, home2 = homedir7()) {
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
    return summarizeDocs(docs, collapseHomeDirectory2(bundle.root));
  } catch {
    return { root: collapseHomeDirectory2(bundle.root), unreadable: true };
  }
}
async function discoverSummarizeBundle(startDir) {
  try {
    const root = await findBundleRoot(path14.resolve(startDir));
    return root ? defaultSummarizeBundle(root) : null;
  } catch {
    return null;
  }
}
async function defaultLoadWorkspaces(home2, signal) {
  return (await loadCatalog(home2, signal)).entries.map(({ label }) => ({ label })).sort((a, b) => a.label.localeCompare(b.label));
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
    const boardPath = path14.join(top, BUNDLE_DIR);
    if (!isProvisioned(top)) {
      const probed = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0 || runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      return probed ? { state: "unprovisioned" } : null;
    }
    const key = resolveBundleKey(boardPath);
    const state = await readSyncState(key);
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
  const view2 = {
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
  if (workspaces) view2.workspaces = workspaces;
  const compact = compactCommandReference(inv);
  view2.commands = compact.commands;
  view2.commands_help = compact.commands_help;
  view2.kinds = ref.kinds;
  view2.remote_env = ref.remoteEnv;
  return view2;
}
async function home(argv, deps = {}) {
  const stdout = deps.stdout ?? ((s) => void process.stdout.write(s));
  let remote;
  let dir;
  let jsonMode = false;
  try {
    const parsed = parseArgs24({
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
      await (deps.autoPull ?? ((d) => maybeAutoPull(d, { requireBoardBundle: false })))(dir);
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
      new Promise((resolve3) => {
        workspaceTimer = setTimeout(
          () => resolve3(timedOut),
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
import { parseArgs as parseArgs25 } from "node:util";
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
    const key = resolveBundleKey(boardPath);
    await refreshMarker(key);
    if (remaining() < MIN_USEFUL_BUDGET_MS) {
      return { offline: true, boardPath, ...announcement ? { announcement } : {} };
    }
    const pulled = await pullBoardAndRecord(boardPath, key, {
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
    () => parseArgs25({
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

// src/commands/bundle.ts
import { parseArgs as parseArgs26 } from "node:util";
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
    () => parseArgs26({
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
import { parseArgs as parseArgs27 } from "node:util";
import { homedir as homedir8 } from "node:os";
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
  const home2 = deps.home ?? homedir8;
  const parsed = parseOrUsage(
    () => parseArgs27({
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
import { parseArgs as parseArgs28 } from "node:util";
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
  "view",
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
