/**
 * This is a extended version of the path evaluation code from Babel.
 *
 * The original can be found at:
 * https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/evaluation.ts
 *
 * The following extensions were made:
 * - It can accept a mapping from variable names to functions
 *   which when encountered will be evaluated instead of deopting.
 *   - The functions can be configured to accept the raw path instead of
 *     static values to handle dynamic values.
 * - It can handle object spreads when the spread value itself is statically evaluated.
 */ function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { parseSync } from "@babel/core";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
// This file contains Babels metainterpreter that can evaluate static code.
var VALID_CALLEES = [
    "String",
    "Number",
    "Math",
    "Object",
    "Array"
];
var INVALID_METHODS = [
    "random",
    "assign",
    "defineProperties",
    "defineProperty",
    "freeze",
    "seal",
    "splice"
];
function isValidCallee(val) {
    return VALID_CALLEES.includes(val);
}
function isInvalidMethod(val) {
    return INVALID_METHODS.includes(val);
}
/**
 * Deopts the evaluation
 */ function deopt(path, state) {
    if (!state.confident) return;
    state.deoptPath = path;
    state.confident = false;
}
function evaluateImportedFile(filePath, namedExport, state) {
    var fs = require("fs");
    var fileContents = fs.readFileSync(filePath, "utf8");
    // It's safe to use `.babelrc` here because we're only
    // interested in the JS runtime, and not the CSS.
    // TODO: in environments where `.babelrc` is not available,
    // we need to find a way to decide whether to use Flow or TS syntax extensions.
    var ast = parseSync(fileContents, {
        babelrc: true
    });
    if (!ast || ast.errors || !t.isNode(ast)) {
        state.confident = false;
        return;
    }
    var astNode = ast;
    var result;
    traverse(astNode, {
        ExportNamedDeclaration: function ExportNamedDeclaration(path) {
            var declaration = path.get("declaration");
            if (declaration.isVariableDeclaration()) {
                var decls = declaration.get("declarations");
                var finder = function(decl) {
                    if (decl.isVariableDeclarator()) {
                        var id = decl.get("id");
                        var init = decl.get("init");
                        if (id.isIdentifier() && id.node.name === namedExport && init != null && init.isExpression()) {
                            result = evaluateCached(init, state);
                        }
                    }
                };
                if (Array.isArray(decls)) {
                    decls.forEach(finder);
                } else {
                    finder(decls);
                }
            }
        }
    });
    if (state.confident) {
        return result;
    } else {
        state.confident = false;
        return;
    }
}
/**
 * We wrap the _evaluate method so we can track `seen` nodes, we push an item
 * to the map before we actually evaluate it so we can deopt on self recursive
 * nodes such as:
 *
 *   var g = a ? 1 : 2,
 *       a = g * this.foo
 */ function evaluateCached(path, state) {
    var node = path.node;
    var seen = state.seen;
    var existing = seen.get(node);
    if (existing != null) {
        if (existing.resolved) {
            return existing.value;
        } else {
            deopt(path, state);
            return;
        }
    } else {
        var item = {
            resolved: false
        };
        seen.set(node, item);
        var val = _evaluate(path, state);
        if (state.confident) {
            item.resolved = true;
            item.value = val;
        }
        return val;
    }
}
function _evaluate(path, state) {
    if (!state.confident) return;
    if (path.isArrowFunctionExpression()) {
        var body = path.get("body");
        var params = path.get("params");
        var identParams = params.filter(function(param) {
            return param.isIdentifier();
        }).map(function(paramPath) {
            return paramPath.node.name;
        });
        if (body.isExpression() && identParams.length === params.length) {
            var expr = body;
            return function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                var identifierEntries = identParams.map(function(ident, index) {
                    return [
                        ident,
                        args[index]
                    ];
                });
                var identifiersObj = Object.fromEntries(identifierEntries);
                var result = evaluate(expr, _object_spread_props(_object_spread({}, state.functions), {
                    identifiers: _object_spread({}, state.functions.identifiers, identifiersObj)
                }));
                return result.value;
            };
        }
    }
    if (path.isIdentifier()) {
        var _state_functions;
        var name = path.node.name;
        var _state_functions_identifiers;
        if (Object.keys((_state_functions_identifiers = (_state_functions = state.functions) === null || _state_functions === void 0 ? void 0 : _state_functions.identifiers) !== null && _state_functions_identifiers !== void 0 ? _state_functions_identifiers : {}).includes(name)) {
            return state.functions.identifiers[name];
        }
    }
    if (path.isTSAsExpression()) {
        var expr1 = path.get("expression");
        return evaluateCached(expr1, state);
    }
    if (path.isTSSatisfiesExpression()) {
        var expr2 = path.get("expression");
        return evaluateCached(expr2, state);
    }
    if (path.isSequenceExpression()) {
        var exprs = path.get("expressions");
        return evaluateCached(exprs[exprs.length - 1], state);
    }
    if (path.isStringLiteral() || path.isNumericLiteral() || path.isBooleanLiteral()) {
        return path.node.value;
    }
    if (path.isNullLiteral()) {
        return null;
    }
    if (path.isTemplateLiteral()) {
        return evaluateQuasis(path, path.node.quasis, state);
    }
    var maybeTag = path.isTaggedTemplateExpression() && path.get("tag");
    if (path.isTaggedTemplateExpression() && maybeTag && maybeTag.isMemberExpression()) {
        var tag = maybeTag;
        var object = tag.get("object");
        if (object.isIdentifier()) {
            var name1 = object.node.name;
            var property = tag.get("property");
            if (name1 === "String" && !path.scope.hasBinding(name1) && property.isIdentifier() && property.node.name === "raw") {
                return evaluateQuasis(path, path.node.quasi.quasis, state, true);
            }
        }
    }
    if (path.isConditionalExpression()) {
        var testResult = evaluateCached(path.get("test"), state);
        if (!state.confident) return;
        if (testResult) {
            return evaluateCached(path.get("consequent"), state);
        } else {
            return evaluateCached(path.get("alternate"), state);
        }
    }
    if (path.isExpressionWrapper()) {
        // TypeCastExpression, ExpressionStatement etc
        return evaluateCached(path.get("expression"), state);
    }
    // "foo".length
    if (path.isMemberExpression() && !path.parentPath.isCallExpression({
        callee: path.node
    })) {
        var object1 = evaluateCached(path.get("object"), state);
        if (!state.confident) {
            return;
        }
        var propPath = path.get("property");
        var property1;
        if (path.node.computed) {
            property1 = evaluateCached(propPath, state);
            if (!state.confident) {
                return;
            }
        } else if (propPath.isIdentifier()) {
            property1 = propPath.node.name;
        } else if (propPath.isStringLiteral()) {
            property1 = propPath.node.value;
        } else {
            return deopt(propPath, state);
        }
        return object1[property1];
    }
    if (path.isReferencedIdentifier()) {
        var _path_scope;
        var binding = (_path_scope = path.scope) === null || _path_scope === void 0 ? void 0 : _path_scope.getBinding(path.node.name);
        var bindingPath = binding === null || binding === void 0 ? void 0 : binding.path;
        if (binding && binding.constantViolations.length > 0) {
            return deopt(binding.path, state);
        }
        if (binding && path.node.start != null && binding.path.node.end != null && path.node.start < binding.path.node.end) {
            return deopt(binding.path, state);
        }
        if (binding && binding.hasValue) {
            return binding.value;
        } else {
            if (path.node.name === "undefined") {
                return binding ? deopt(binding.path, state) : undefined;
            } else if (path.node.name === "Infinity") {
                return binding ? deopt(binding.path, state) : Infinity;
            } else if (path.node.name === "NaN") {
                return binding ? deopt(binding.path, state) : NaN;
            }
            var resolved = path.resolve();
            if (resolved === path) {
                return deopt(path, state);
            } else {
                return evaluateCached(resolved, state);
            }
        }
    }
    if (path.isUnaryExpression({
        prefix: true
    })) {
        if (path.node.operator === "void") {
            // we don't need to evaluate the argument to know what this will return
            return undefined;
        }
        var argument = path.get("argument");
        if (path.node.operator === "typeof" && (argument.isFunction() || argument.isClass())) {
            return "function";
        }
        var arg = evaluateCached(argument, state);
        if (!state.confident) return;
        switch(path.node.operator){
            case "!":
                return !arg;
            case "+":
                return +arg;
            case "-":
                return -arg;
            case "~":
                return ~arg;
            case "typeof":
                return typeof arg === "undefined" ? "undefined" : _type_of(arg);
            // @ts-ignore - This is a valid unary operator
            case "void":
                return undefined;
            default:
                return deopt(path, state);
        }
    }
    if (path.isArrayExpression()) {
        var arrPath = path;
        var arr = [];
        var elems = arrPath.get("elements");
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = elems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var elem = _step.value;
                if (elem.isExpression()) {
                    var elemValue = evaluate(elem, state.functions);
                    if (elemValue.confident) {
                        arr.push(elemValue.value);
                    } else {
                        elemValue.deopt && deopt(elemValue.deopt, state);
                        return;
                    }
                } else if (elem.isSpreadElement()) {
                    var _arr;
                    var spreadExpression = evaluateCached(elem.get("argument"), state);
                    if (!state.confident) {
                        return deopt(elem, state);
                    }
                    (_arr = arr).push.apply(_arr, _to_consumable_array(spreadExpression));
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return arr;
    }
    if (path.isObjectExpression()) {
        var obj = {};
        var props = path.get("properties");
        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
        try {
            for(var _iterator1 = props[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                var prop = _step1.value;
                if (prop.isObjectMethod()) {
                    return deopt(prop, state);
                }
                if (prop.isSpreadElement()) {
                    var spreadExpression1 = evaluateCached(prop.get("argument"), state);
                    if (!state.confident) {
                        return deopt(prop, state);
                    }
                    Object.assign(obj, spreadExpression1);
                    continue;
                }
                if (prop.isObjectProperty()) {
                    var keyPath = prop.get("key");
                    var key = void 0;
                    if (keyPath.isPrivateName()) {
                        return deopt(keyPath, state);
                    }
                    if (prop.node.computed) {
                        var _evaluate = evaluate(keyPath, state.functions), confident = _evaluate.confident, resultDeopt = _evaluate.deopt, value = _evaluate.value;
                        if (!confident) {
                            resultDeopt && deopt(resultDeopt, state);
                            return;
                        }
                        key = value;
                    } else if (keyPath.isIdentifier()) {
                        key = keyPath.node.name;
                    } else if (keyPath.isStringLiteral()) {
                        key = keyPath.node.value;
                    } else {
                        // TODO: This is'nt handling all possible types that `keyPath` could be
                        var maybeKey = keyPath.node.value;
                        if (maybeKey != null && typeof maybeKey === "string" || typeof maybeKey === "number" || (typeof maybeKey === "undefined" ? "undefined" : _type_of(maybeKey)) === "symbol") {
                            key = maybeKey;
                        }
                    }
                    // todo(flow->ts): remove typecast
                    var valuePath = prop.get("value");
                    var value1 = evaluate(valuePath, state.functions);
                    if (!value1.confident) {
                        value1.deopt && deopt(value1.deopt, state);
                        return;
                    }
                    value1 = value1.value;
                    // @ts-ignore
                    obj[key] = value1;
                }
            }
        } catch (err) {
            _didIteratorError1 = true;
            _iteratorError1 = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                    _iterator1.return();
                }
            } finally{
                if (_didIteratorError1) {
                    throw _iteratorError1;
                }
            }
        }
        return obj;
    }
    if (path.isLogicalExpression()) {
        // If we are confident that the left side of an && is false, or the left
        // side of an || is true, we can be confident about the entire expression
        var wasConfident = state.confident;
        var left = evaluateCached(path.get("left"), state);
        var leftConfident = state.confident;
        state.confident = wasConfident;
        var right = evaluateCached(path.get("right"), state);
        var rightConfident = state.confident;
        switch(path.node.operator){
            case "||":
                // TODO consider having a "truthy type" that doesn't bail on
                // left uncertainty but can still evaluate to truthy.
                state.confident = leftConfident && (!!left || rightConfident);
                if (!state.confident) return;
                return left || right;
            case "&&":
                state.confident = leftConfident && (!left || rightConfident);
                if (!state.confident) return;
                return left && right;
            case "??":
                state.confident = leftConfident && !!(left !== null && left !== void 0 ? left : rightConfident);
                if (!state.confident) return;
                return left !== null && left !== void 0 ? left : right;
            default:
                path.node.operator;
        }
    }
    if (path.isBinaryExpression()) {
        var left1 = evaluateCached(path.get("left"), state);
        if (!state.confident) return;
        var right1 = evaluateCached(path.get("right"), state);
        if (!state.confident) return;
        switch(path.node.operator){
            case "-":
                return left1 - right1;
            case "+":
                return left1 + right1;
            case "/":
                return left1 / right1;
            case "*":
                return left1 * right1;
            case "%":
                return left1 % right1;
            case "**":
                return Math.pow(left1, right1);
            case "<":
                return left1 < right1;
            case ">":
                return left1 > right1;
            case "<=":
                return left1 <= right1;
            case ">=":
                return left1 >= right1;
            case "==":
                return left1 == right1; // eslint-disable-line eqeqeq
            case "!=":
                return left1 !== right1;
            case "===":
                return left1 === right1;
            case "!==":
                return left1 !== right1;
            case "|":
                return left1 | right1;
            case "&":
                return left1 & right1;
            case "^":
                return left1 ^ right1;
            case "<<":
                return left1 << right1;
            case ">>":
                return left1 >> right1;
            case ">>>":
                return left1 >>> right1;
            case "in":
                return left1 in right1;
            case "instanceof":
                return _instanceof(left1, right1);
            default:
                return;
        }
    }
    if (path.isCallExpression()) {
        var callee = path.get("callee");
        var context;
        var func;
        // Number(1);
        if (callee.isIdentifier() && !path.scope.getBinding(callee.node.name) && isValidCallee(callee.node.name)) {
            func = global[callee.node.name];
        } else if (callee.isIdentifier() && state.functions.identifiers[callee.node.name]) {
            func = state.functions.identifiers[callee.node.name];
        }
        if (callee.isMemberExpression()) {
            var object2 = callee.get("object");
            var property2 = callee.get("property");
            // Math.min(1, 2)
            if (object2.isIdentifier() && property2.isIdentifier()) {
                if (isValidCallee(object2.node.name) && !isInvalidMethod(property2.node.name)) {
                    context = global[object2.node.name];
                    func = context[property2.node.name];
                } else if (state.functions.memberExpressions[object2.node.name] && state.functions.memberExpressions[object2.node.name][property2.node.name]) {
                    context = state.functions.memberExpressions[object2.node.name];
                    func = context[property2.node.name];
                }
            }
            if (object2.isIdentifier() && property2.isStringLiteral() && state.functions.memberExpressions[object2.node.name] && state.functions.memberExpressions[object2.node.name][property2.node.value]) {
                context = state.functions.memberExpressions[object2.node.name];
                func = context[property2.node.value];
            }
            // "abc".charCodeAt(4)
            if ((object2.isStringLiteral() || object2.isNumericLiteral()) && property2.isIdentifier()) {
                var val = object2.node.value;
                var name2 = property2.node.name;
                func = val[property2.node.name];
            }
            var parsedObj = evaluate(object2, state.functions);
            if (parsedObj.confident && property2.isIdentifier()) {
                func = parsedObj.value[property2.node.name];
                context = parsedObj.value;
            }
            if (parsedObj.confident && property2.isStringLiteral()) {
                func = parsedObj.value[property2.node.value];
                context = parsedObj.value;
            }
        }
        if (func) {
            if (func.takesPath) {
                var _func;
                var args = path.get("arguments");
                return (_func = func).fn.apply(_func, _to_consumable_array(args));
            } else {
                var args1 = path.get("arguments").map(function(arg) {
                    return evaluateCached(arg, state);
                });
                if (!state.confident) return;
                if (func.fn) {
                    return func.fn.apply(context, args1);
                } else {
                    return func.apply(context, args1);
                }
            }
        }
    }
    deopt(path, state);
}
function evaluateQuasis(path, quasis, state) {
    var raw = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    var str = "";
    var i = 0;
    var exprs = path.isTemplateLiteral() ? path.get("expressions") : path.isTaggedTemplateExpression() ? path.get("quasi").get("expressions") : [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        // const exprs: Array<NodePath<t.Node>> = path.isTemplateLiteral()
        //   ? path.get('expressions')
        //   : (path as NodePath<t.TaggedTemplateExpression>)
        //       .get('quasi')
        //       .get('expressions');
        for(var _iterator = quasis[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var elem = _step.value;
            // not confident, evaluated an expression we don't like
            if (!state.confident) break;
            // add on element
            str += raw ? elem.value.raw : elem.value.cooked;
            // add on interpolated expression if it's present
            var expr = exprs[i++];
            if (expr) str += String(evaluateCached(expr, state));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (!state.confident) return;
    return str;
}
/**
 * Walk the input `node` and statically evaluate it.
 *
 * Returns an object in the form `{ confident, value, deopt }`. `confident`
 * indicates whether or not we had to drop out of evaluating the expression
 * because of hitting an unknown node that we couldn't confidently find the
 * value of, in which case `deopt` is the path of said node.
 *
 * Example:
 *
 *   evaluate(parse("5 + 5")) // { confident: true, value: 10 }
 *   evaluate(parse("!true")) // { confident: true, value: false }
 *   evaluate(parse("foo + foo")) // { confident: false, value: undefined, deopt: NodePath }
 *
 */ export function evaluate(path) {
    var functions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        identifiers: {},
        memberExpressions: {}
    };
    var state = {
        confident: true,
        deoptPath: null,
        seen: new Map(),
        functions: functions
    };
    var value = evaluateCached(path, state);
    if (!state.confident) value = undefined;
    return {
        confident: state.confident,
        deopt: state.deoptPath,
        value: value
    };
}
