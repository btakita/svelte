'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var acorn = require('acorn');
var acorn__default = _interopDefault(acorn);
var parse = _interopDefault(require('css-tree/lib/parser/index.js'));
var MagicString = require('magic-string');
var MagicString__default = _interopDefault(MagicString);

function assign(tar, src) {
	for (const k in src) tar[k] = src[k];
	return tar;
}

const now$1 = (typeof process !== 'undefined' && process.hrtime)
	? () => {
		const t = process.hrtime();
		return t[0] * 1e3 + t[1] / 1e6;
	}
	: () => self.performance.now();








function collapse_timings(timings) {
	const result = {};
	timings.forEach(timing => {
		result[timing.label] = Object.assign({
			total: timing.end - timing.start
		}, timing.children && collapse_timings(timing.children));
	});
	return result;
}

class Stats {
	
	
	
	
	

	constructor() {
		this.start_time = now$1();
		this.stack = [];
		this.current_children = this.timings = [];
	}

	start(label) {
		const timing = {
			label,
			start: now$1(),
			end: null,
			children: []
		};

		this.current_children.push(timing);
		this.stack.push(timing);

		this.current_timing = timing;
		this.current_children = timing.children;
	}

	stop(label) {
		if (label !== this.current_timing.label) {
			throw new Error(`Mismatched timing labels (expected ${this.current_timing.label}, got ${label})`);
		}

		this.current_timing.end = now$1();
		this.stack.pop();
		this.current_timing = this.stack[this.stack.length - 1];
		this.current_children = this.current_timing ? this.current_timing.children : this.timings;
	}

	render() {
		const timings = Object.assign({
			total: now$1() - this.start_time
		}, collapse_timings(this.timings));

		return {
			timings
		};
	}
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamicImportKey = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function () {
  function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

  return get;
}();

exports['default'] = dynamicImport;



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-underscore-dangle */


var DynamicImportKey = exports.DynamicImportKey = 'Import';

// NOTE: This allows `yield import()` to parse correctly.
acorn__default.tokTypes._import.startsExpr = true;

function parseDynamicImport() {
  var node = this.startNode();
  this.next();
  if (this.type !== acorn__default.tokTypes.parenL) {
    this.unexpected();
  }
  return this.finishNode(node, DynamicImportKey);
}

function parenAfter() {
  return (/^(\s|\/\/.*|\/\*[^]*?\*\/)*\(/.test(this.input.slice(this.pos))
  );
}

function dynamicImport(Parser) {
  return function (_Parser) {
    _inherits(_class, _Parser);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'parseStatement',
      value: function () {
        function parseStatement(context, topLevel, exports) {
          if (this.type === acorn__default.tokTypes._import && parenAfter.call(this)) {
            return this.parseExpressionStatement(this.startNode(), this.parseExpression());
          }
          return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'parseStatement', this).call(this, context, topLevel, exports);
        }

        return parseStatement;
      }()
    }, {
      key: 'parseExprAtom',
      value: function () {
        function parseExprAtom(refDestructuringErrors) {
          if (this.type === acorn__default.tokTypes._import) {
            return parseDynamicImport.call(this);
          }
          return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'parseExprAtom', this).call(this, refDestructuringErrors);
        }

        return parseExprAtom;
      }()
    }]);

    return _class;
  }(Parser);
}
});

var dynamicImport = unwrapExports(lib);
var lib_1 = lib.DynamicImportKey;

const Parser = acorn.Parser.extend(dynamicImport);

const parse$1 = (source) => Parser.parse(source, {
	sourceType: 'module',
	ecmaVersion: 9,
	preserveParens: true
});

const parse_expression_at = (source, index) => Parser.parseExpressionAt(source, index, {
	ecmaVersion: 9,
	preserveParens: true
});

const literals = new Map([['true', true], ['false', false], ['null', null]]);

function read_expression(parser) {
	const start = parser.index;

	const name = parser.read_until(/\s*}/);
	if (name && /^[a-z]+$/.test(name)) {
		const end = start + name.length;

		if (literals.has(name)) {
			return {
				type: 'Literal',
				start,
				end,
				value: literals.get(name),
				raw: name,
			};
		}

		return {
			type: 'Identifier',
			start,
			end: start + name.length,
			name,
		};
	}

	parser.index = start;

	try {
		const node = parse_expression_at(parser.template, parser.index);
		parser.index = node.end;

		return node;
	} catch (err) {
		parser.acorn_error(err);
	}
}

function repeat(str, i) {
	let result = '';
	while (i--) result += str;
	return result;
}

const script_closing_tag = '</script>';

function get_context(parser, attributes, start) {
	const context = attributes.find(attribute => attribute.name === 'context');
	if (!context) return 'default';

	if (context.value.length !== 1 || context.value[0].type !== 'Text') {
		parser.error({
			code: 'invalid-script',
			message: `context attribute must be static`
		}, start);
	}

	const value = context.value[0].data;

	if (value !== 'module') {
		parser.error({
			code: `invalid-script`,
			message: `If the context attribute is supplied, its value must be "module"`
		}, context.start);
	}

	return value;
}

function read_script(parser, start, attributes) {
	const script_start = parser.index;
	const script_end = parser.template.indexOf(script_closing_tag, script_start);

	if (script_end === -1) parser.error({
		code: `unclosed-script`,
		message: `<script> must have a closing tag`
	});

	const source =
		repeat(' ', script_start) + parser.template.slice(script_start, script_end);
	parser.index = script_end + script_closing_tag.length;

	let ast;

	try {
		ast = parse$1(source);
	} catch (err) {
		parser.acorn_error(err);
	}

	ast.start = script_start;
	return {
		start,
		end: parser.index,
		context: get_context(parser, attributes, start),
		content: ast,
	};
}

function walk(ast, { enter, leave }) {
	visit(ast, null, enter, leave);
}

let shouldSkip = false;
const context = { skip: () => shouldSkip = true };

const childKeys = {};

const toString = Object.prototype.toString;

function isArray(thing) {
	return toString.call(thing) === '[object Array]';
}

function visit(node, parent, enter, leave, prop, index) {
	if (!node) return;

	if (enter) {
		const _shouldSkip = shouldSkip;
		shouldSkip = false;
		enter.call(context, node, parent, prop, index);
		const skipped = shouldSkip;
		shouldSkip = _shouldSkip;

		if (skipped) return;
	}

	const keys = childKeys[node.type] || (
		childKeys[node.type] = Object.keys(node).filter(key => typeof node[key] === 'object')
	);

	for (let i = 0; i < keys.length; i += 1) {
		const key = keys[i];
		const value = node[key];

		if (isArray(value)) {
			for (let j = 0; j < value.length; j += 1) {
				visit(value[j], node, enter, leave, key, j);
			}
		}

		else if (value && value.type) {
			visit(value, node, enter, leave, key, null);
		}
	}

	if (leave) {
		leave(node, parent, prop, index);
	}
}

function read_style(parser, start, attributes) {
	const content_start = parser.index;
	const styles = parser.read_until(/<\/style>/);
	const content_end = parser.index;

	let ast;

	try {
		ast = parse(styles, {
			positions: true,
			offset: content_start,
		});
	} catch (err) {
		if (err.name === 'CssSyntaxError') {
			parser.error({
				code: `css-syntax-error`,
				message: err.message
			}, err.offset);
		} else {
			throw err;
		}
	}

	ast = JSON.parse(JSON.stringify(ast));

	// tidy up AST
	walk(ast, {
		enter: (node) => {
			// replace `ref:a` nodes
			if (node.type === 'Selector') {
				for (let i = 0; i < node.children.length; i += 1) {
					const a = node.children[i];
					const b = node.children[i + 1];

					if (is_ref_selector(a, b)) {
						parser.error({
							code: `invalid-ref-selector`,
							message: 'ref selectors are no longer supported'
						}, a.loc.start.offset);
					}
				}
			}

			if (node.loc) {
				node.start = node.loc.start.offset;
				node.end = node.loc.end.offset;
				delete node.loc;
			}
		}
	});

	parser.eat('</style>', true);
	const end = parser.index;

	return {
		start,
		end,
		attributes,
		children: ast.children,
		content: {
			start: content_start,
			end: content_end,
			styles,
		},
	};
}

function is_ref_selector(a, b) {
	if (!b) return false;

	return (
		a.type === 'TypeSelector' &&
		a.name === 'ref' &&
		b.type === 'PseudoClassSelector'
	);
}

// https://dev.w3.org/html5/html-author/charref
var entities = {
	CounterClockwiseContourIntegral: 8755,
	ClockwiseContourIntegral: 8754,
	DoubleLongLeftRightArrow: 10234,
	DiacriticalDoubleAcute: 733,
	NotSquareSupersetEqual: 8931,
	CloseCurlyDoubleQuote: 8221,
	DoubleContourIntegral: 8751,
	FilledVerySmallSquare: 9642,
	NegativeVeryThinSpace: 8203,
	NotPrecedesSlantEqual: 8928,
	NotRightTriangleEqual: 8941,
	NotSucceedsSlantEqual: 8929,
	CapitalDifferentialD: 8517,
	DoubleLeftRightArrow: 8660,
	DoubleLongRightArrow: 10233,
	EmptyVerySmallSquare: 9643,
	NestedGreaterGreater: 8811,
	NotDoubleVerticalBar: 8742,
	NotLeftTriangleEqual: 8940,
	NotSquareSubsetEqual: 8930,
	OpenCurlyDoubleQuote: 8220,
	ReverseUpEquilibrium: 10607,
	DoubleLongLeftArrow: 10232,
	DownLeftRightVector: 10576,
	LeftArrowRightArrow: 8646,
	NegativeMediumSpace: 8203,
	RightArrowLeftArrow: 8644,
	SquareSupersetEqual: 8850,
	leftrightsquigarrow: 8621,
	DownRightTeeVector: 10591,
	DownRightVectorBar: 10583,
	LongLeftRightArrow: 10231,
	Longleftrightarrow: 10234,
	NegativeThickSpace: 8203,
	PrecedesSlantEqual: 8828,
	ReverseEquilibrium: 8651,
	RightDoubleBracket: 10215,
	RightDownTeeVector: 10589,
	RightDownVectorBar: 10581,
	RightTriangleEqual: 8885,
	SquareIntersection: 8851,
	SucceedsSlantEqual: 8829,
	blacktriangleright: 9656,
	longleftrightarrow: 10231,
	DoubleUpDownArrow: 8661,
	DoubleVerticalBar: 8741,
	DownLeftTeeVector: 10590,
	DownLeftVectorBar: 10582,
	FilledSmallSquare: 9724,
	GreaterSlantEqual: 10878,
	LeftDoubleBracket: 10214,
	LeftDownTeeVector: 10593,
	LeftDownVectorBar: 10585,
	LeftTriangleEqual: 8884,
	NegativeThinSpace: 8203,
	NotReverseElement: 8716,
	NotTildeFullEqual: 8775,
	RightAngleBracket: 10217,
	RightUpDownVector: 10575,
	SquareSubsetEqual: 8849,
	VerticalSeparator: 10072,
	blacktriangledown: 9662,
	blacktriangleleft: 9666,
	leftrightharpoons: 8651,
	rightleftharpoons: 8652,
	twoheadrightarrow: 8608,
	DiacriticalAcute: 180,
	DiacriticalGrave: 96,
	DiacriticalTilde: 732,
	DoubleRightArrow: 8658,
	DownArrowUpArrow: 8693,
	EmptySmallSquare: 9723,
	GreaterEqualLess: 8923,
	GreaterFullEqual: 8807,
	LeftAngleBracket: 10216,
	LeftUpDownVector: 10577,
	LessEqualGreater: 8922,
	NonBreakingSpace: 160,
	NotRightTriangle: 8939,
	NotSupersetEqual: 8841,
	RightTriangleBar: 10704,
	RightUpTeeVector: 10588,
	RightUpVectorBar: 10580,
	UnderParenthesis: 9181,
	UpArrowDownArrow: 8645,
	circlearrowright: 8635,
	downharpoonright: 8642,
	ntrianglerighteq: 8941,
	rightharpoondown: 8641,
	rightrightarrows: 8649,
	twoheadleftarrow: 8606,
	vartriangleright: 8883,
	CloseCurlyQuote: 8217,
	ContourIntegral: 8750,
	DoubleDownArrow: 8659,
	DoubleLeftArrow: 8656,
	DownRightVector: 8641,
	LeftRightVector: 10574,
	LeftTriangleBar: 10703,
	LeftUpTeeVector: 10592,
	LeftUpVectorBar: 10584,
	LowerRightArrow: 8600,
	NotGreaterEqual: 8817,
	NotGreaterTilde: 8821,
	NotLeftTriangle: 8938,
	OverParenthesis: 9180,
	RightDownVector: 8642,
	ShortRightArrow: 8594,
	UpperRightArrow: 8599,
	bigtriangledown: 9661,
	circlearrowleft: 8634,
	curvearrowright: 8631,
	downharpoonleft: 8643,
	leftharpoondown: 8637,
	leftrightarrows: 8646,
	nLeftrightarrow: 8654,
	nleftrightarrow: 8622,
	ntrianglelefteq: 8940,
	rightleftarrows: 8644,
	rightsquigarrow: 8605,
	rightthreetimes: 8908,
	straightepsilon: 1013,
	trianglerighteq: 8885,
	vartriangleleft: 8882,
	DiacriticalDot: 729,
	DoubleRightTee: 8872,
	DownLeftVector: 8637,
	GreaterGreater: 10914,
	HorizontalLine: 9472,
	InvisibleComma: 8291,
	InvisibleTimes: 8290,
	LeftDownVector: 8643,
	LeftRightArrow: 8596,
	Leftrightarrow: 8660,
	LessSlantEqual: 10877,
	LongRightArrow: 10230,
	Longrightarrow: 10233,
	LowerLeftArrow: 8601,
	NestedLessLess: 8810,
	NotGreaterLess: 8825,
	NotLessGreater: 8824,
	NotSubsetEqual: 8840,
	NotVerticalBar: 8740,
	OpenCurlyQuote: 8216,
	ReverseElement: 8715,
	RightTeeVector: 10587,
	RightVectorBar: 10579,
	ShortDownArrow: 8595,
	ShortLeftArrow: 8592,
	SquareSuperset: 8848,
	TildeFullEqual: 8773,
	UpperLeftArrow: 8598,
	ZeroWidthSpace: 8203,
	curvearrowleft: 8630,
	doublebarwedge: 8966,
	downdownarrows: 8650,
	hookrightarrow: 8618,
	leftleftarrows: 8647,
	leftrightarrow: 8596,
	leftthreetimes: 8907,
	longrightarrow: 10230,
	looparrowright: 8620,
	nshortparallel: 8742,
	ntriangleright: 8939,
	rightarrowtail: 8611,
	rightharpoonup: 8640,
	trianglelefteq: 8884,
	upharpoonright: 8638,
	ApplyFunction: 8289,
	DifferentialD: 8518,
	DoubleLeftTee: 10980,
	DoubleUpArrow: 8657,
	LeftTeeVector: 10586,
	LeftVectorBar: 10578,
	LessFullEqual: 8806,
	LongLeftArrow: 10229,
	Longleftarrow: 10232,
	NotTildeEqual: 8772,
	NotTildeTilde: 8777,
	Poincareplane: 8460,
	PrecedesEqual: 10927,
	PrecedesTilde: 8830,
	RightArrowBar: 8677,
	RightTeeArrow: 8614,
	RightTriangle: 8883,
	RightUpVector: 8638,
	SucceedsEqual: 10928,
	SucceedsTilde: 8831,
	SupersetEqual: 8839,
	UpEquilibrium: 10606,
	VerticalTilde: 8768,
	VeryThinSpace: 8202,
	bigtriangleup: 9651,
	blacktriangle: 9652,
	divideontimes: 8903,
	fallingdotseq: 8786,
	hookleftarrow: 8617,
	leftarrowtail: 8610,
	leftharpoonup: 8636,
	longleftarrow: 10229,
	looparrowleft: 8619,
	measuredangle: 8737,
	ntriangleleft: 8938,
	shortparallel: 8741,
	smallsetminus: 8726,
	triangleright: 9657,
	upharpoonleft: 8639,
	DownArrowBar: 10515,
	DownTeeArrow: 8615,
	ExponentialE: 8519,
	GreaterEqual: 8805,
	GreaterTilde: 8819,
	HilbertSpace: 8459,
	HumpDownHump: 8782,
	Intersection: 8898,
	LeftArrowBar: 8676,
	LeftTeeArrow: 8612,
	LeftTriangle: 8882,
	LeftUpVector: 8639,
	NotCongruent: 8802,
	NotLessEqual: 8816,
	NotLessTilde: 8820,
	Proportional: 8733,
	RightCeiling: 8969,
	RoundImplies: 10608,
	ShortUpArrow: 8593,
	SquareSubset: 8847,
	UnderBracket: 9141,
	VerticalLine: 124,
	blacklozenge: 10731,
	exponentiale: 8519,
	risingdotseq: 8787,
	triangledown: 9663,
	triangleleft: 9667,
	CircleMinus: 8854,
	CircleTimes: 8855,
	Equilibrium: 8652,
	GreaterLess: 8823,
	LeftCeiling: 8968,
	LessGreater: 8822,
	MediumSpace: 8287,
	NotPrecedes: 8832,
	NotSucceeds: 8833,
	OverBracket: 9140,
	RightVector: 8640,
	Rrightarrow: 8667,
	RuleDelayed: 10740,
	SmallCircle: 8728,
	SquareUnion: 8852,
	SubsetEqual: 8838,
	UpDownArrow: 8597,
	Updownarrow: 8661,
	VerticalBar: 8739,
	backepsilon: 1014,
	blacksquare: 9642,
	circledcirc: 8858,
	circleddash: 8861,
	curlyeqprec: 8926,
	curlyeqsucc: 8927,
	diamondsuit: 9830,
	eqslantless: 10901,
	expectation: 8496,
	nRightarrow: 8655,
	nrightarrow: 8603,
	preccurlyeq: 8828,
	precnapprox: 10937,
	quaternions: 8461,
	straightphi: 981,
	succcurlyeq: 8829,
	succnapprox: 10938,
	thickapprox: 8776,
	updownarrow: 8597,
	Bernoullis: 8492,
	CirclePlus: 8853,
	EqualTilde: 8770,
	Fouriertrf: 8497,
	ImaginaryI: 8520,
	Laplacetrf: 8466,
	LeftVector: 8636,
	Lleftarrow: 8666,
	NotElement: 8713,
	NotGreater: 8815,
	Proportion: 8759,
	RightArrow: 8594,
	RightFloor: 8971,
	Rightarrow: 8658,
	TildeEqual: 8771,
	TildeTilde: 8776,
	UnderBrace: 9183,
	UpArrowBar: 10514,
	UpTeeArrow: 8613,
	circledast: 8859,
	complement: 8705,
	curlywedge: 8911,
	eqslantgtr: 10902,
	gtreqqless: 10892,
	lessapprox: 10885,
	lesseqqgtr: 10891,
	lmoustache: 9136,
	longmapsto: 10236,
	mapstodown: 8615,
	mapstoleft: 8612,
	nLeftarrow: 8653,
	nleftarrow: 8602,
	precapprox: 10935,
	rightarrow: 8594,
	rmoustache: 9137,
	sqsubseteq: 8849,
	sqsupseteq: 8850,
	subsetneqq: 10955,
	succapprox: 10936,
	supsetneqq: 10956,
	upuparrows: 8648,
	varepsilon: 949,
	varnothing: 8709,
	Backslash: 8726,
	CenterDot: 183,
	CircleDot: 8857,
	Congruent: 8801,
	Coproduct: 8720,
	DoubleDot: 168,
	DownArrow: 8595,
	DownBreve: 785,
	Downarrow: 8659,
	HumpEqual: 8783,
	LeftArrow: 8592,
	LeftFloor: 8970,
	Leftarrow: 8656,
	LessTilde: 8818,
	Mellintrf: 8499,
	MinusPlus: 8723,
	NotCupCap: 8813,
	NotExists: 8708,
	OverBrace: 9182,
	PlusMinus: 177,
	Therefore: 8756,
	ThinSpace: 8201,
	TripleDot: 8411,
	UnionPlus: 8846,
	backprime: 8245,
	backsimeq: 8909,
	bigotimes: 10754,
	centerdot: 183,
	checkmark: 10003,
	complexes: 8450,
	dotsquare: 8865,
	downarrow: 8595,
	gtrapprox: 10886,
	gtreqless: 8923,
	heartsuit: 9829,
	leftarrow: 8592,
	lesseqgtr: 8922,
	nparallel: 8742,
	nshortmid: 8740,
	nsubseteq: 8840,
	nsupseteq: 8841,
	pitchfork: 8916,
	rationals: 8474,
	spadesuit: 9824,
	subseteqq: 10949,
	subsetneq: 8842,
	supseteqq: 10950,
	supsetneq: 8843,
	therefore: 8756,
	triangleq: 8796,
	varpropto: 8733,
	DDotrahd: 10513,
	DotEqual: 8784,
	Integral: 8747,
	LessLess: 10913,
	NotEqual: 8800,
	NotTilde: 8769,
	PartialD: 8706,
	Precedes: 8826,
	RightTee: 8866,
	Succeeds: 8827,
	SuchThat: 8715,
	Superset: 8835,
	Uarrocir: 10569,
	UnderBar: 818,
	andslope: 10840,
	angmsdaa: 10664,
	angmsdab: 10665,
	angmsdac: 10666,
	angmsdad: 10667,
	angmsdae: 10668,
	angmsdaf: 10669,
	angmsdag: 10670,
	angmsdah: 10671,
	angrtvbd: 10653,
	approxeq: 8778,
	awconint: 8755,
	backcong: 8780,
	barwedge: 8965,
	bbrktbrk: 9142,
	bigoplus: 10753,
	bigsqcup: 10758,
	biguplus: 10756,
	bigwedge: 8896,
	boxminus: 8863,
	boxtimes: 8864,
	capbrcup: 10825,
	circledR: 174,
	circledS: 9416,
	cirfnint: 10768,
	clubsuit: 9827,
	cupbrcap: 10824,
	curlyvee: 8910,
	cwconint: 8754,
	doteqdot: 8785,
	dotminus: 8760,
	drbkarow: 10512,
	dzigrarr: 10239,
	elinters: 9191,
	emptyset: 8709,
	eqvparsl: 10725,
	fpartint: 10765,
	geqslant: 10878,
	gesdotol: 10884,
	gnapprox: 10890,
	hksearow: 10533,
	hkswarow: 10534,
	imagline: 8464,
	imagpart: 8465,
	infintie: 10717,
	integers: 8484,
	intercal: 8890,
	intlarhk: 10775,
	laemptyv: 10676,
	ldrushar: 10571,
	leqslant: 10877,
	lesdotor: 10883,
	llcorner: 8990,
	lnapprox: 10889,
	lrcorner: 8991,
	lurdshar: 10570,
	mapstoup: 8613,
	multimap: 8888,
	naturals: 8469,
	otimesas: 10806,
	parallel: 8741,
	plusacir: 10787,
	pointint: 10773,
	precneqq: 10933,
	precnsim: 8936,
	profalar: 9006,
	profline: 8978,
	profsurf: 8979,
	raemptyv: 10675,
	realpart: 8476,
	rppolint: 10770,
	rtriltri: 10702,
	scpolint: 10771,
	setminus: 8726,
	shortmid: 8739,
	smeparsl: 10724,
	sqsubset: 8847,
	sqsupset: 8848,
	subseteq: 8838,
	succneqq: 10934,
	succnsim: 8937,
	supseteq: 8839,
	thetasym: 977,
	thicksim: 8764,
	timesbar: 10801,
	triangle: 9653,
	triminus: 10810,
	trpezium: 9186,
	ulcorner: 8988,
	urcorner: 8989,
	varkappa: 1008,
	varsigma: 962,
	vartheta: 977,
	Because: 8757,
	Cayleys: 8493,
	Cconint: 8752,
	Cedilla: 184,
	Diamond: 8900,
	DownTee: 8868,
	Element: 8712,
	Epsilon: 917,
	Implies: 8658,
	LeftTee: 8867,
	NewLine: 10,
	NoBreak: 8288,
	NotLess: 8814,
	Omicron: 927,
	OverBar: 175,
	Product: 8719,
	UpArrow: 8593,
	Uparrow: 8657,
	Upsilon: 933,
	alefsym: 8501,
	angrtvb: 8894,
	angzarr: 9084,
	asympeq: 8781,
	backsim: 8765,
	because: 8757,
	bemptyv: 10672,
	between: 8812,
	bigcirc: 9711,
	bigodot: 10752,
	bigstar: 9733,
	boxplus: 8862,
	ccupssm: 10832,
	cemptyv: 10674,
	cirscir: 10690,
	coloneq: 8788,
	congdot: 10861,
	cudarrl: 10552,
	cudarrr: 10549,
	cularrp: 10557,
	curarrm: 10556,
	dbkarow: 10511,
	ddagger: 8225,
	ddotseq: 10871,
	demptyv: 10673,
	diamond: 8900,
	digamma: 989,
	dotplus: 8724,
	dwangle: 10662,
	epsilon: 949,
	eqcolon: 8789,
	equivDD: 10872,
	gesdoto: 10882,
	gtquest: 10876,
	gtrless: 8823,
	harrcir: 10568,
	intprod: 10812,
	isindot: 8949,
	larrbfs: 10527,
	larrsim: 10611,
	lbrksld: 10639,
	lbrkslu: 10637,
	ldrdhar: 10599,
	lesdoto: 10881,
	lessdot: 8918,
	lessgtr: 8822,
	lesssim: 8818,
	lotimes: 10804,
	lozenge: 9674,
	ltquest: 10875,
	luruhar: 10598,
	maltese: 10016,
	minusdu: 10794,
	napprox: 8777,
	natural: 9838,
	nearrow: 8599,
	nexists: 8708,
	notinva: 8713,
	notinvb: 8951,
	notinvc: 8950,
	notniva: 8716,
	notnivb: 8958,
	notnivc: 8957,
	npolint: 10772,
	nsqsube: 8930,
	nsqsupe: 8931,
	nvinfin: 10718,
	nwarrow: 8598,
	olcross: 10683,
	omicron: 959,
	orderof: 8500,
	orslope: 10839,
	pertenk: 8241,
	planckh: 8462,
	pluscir: 10786,
	plussim: 10790,
	plustwo: 10791,
	precsim: 8830,
	quatint: 10774,
	questeq: 8799,
	rarrbfs: 10528,
	rarrsim: 10612,
	rbrksld: 10638,
	rbrkslu: 10640,
	rdldhar: 10601,
	realine: 8475,
	rotimes: 10805,
	ruluhar: 10600,
	searrow: 8600,
	simplus: 10788,
	simrarr: 10610,
	subedot: 10947,
	submult: 10945,
	subplus: 10943,
	subrarr: 10617,
	succsim: 8831,
	supdsub: 10968,
	supedot: 10948,
	suphsub: 10967,
	suplarr: 10619,
	supmult: 10946,
	supplus: 10944,
	swarrow: 8601,
	topfork: 10970,
	triplus: 10809,
	tritime: 10811,
	uparrow: 8593,
	upsilon: 965,
	uwangle: 10663,
	vzigzag: 10650,
	zigrarr: 8669,
	Aacute: 193,
	Abreve: 258,
	Agrave: 192,
	Assign: 8788,
	Atilde: 195,
	Barwed: 8966,
	Bumpeq: 8782,
	Cacute: 262,
	Ccaron: 268,
	Ccedil: 199,
	Colone: 10868,
	Conint: 8751,
	CupCap: 8781,
	Dagger: 8225,
	Dcaron: 270,
	DotDot: 8412,
	Dstrok: 272,
	Eacute: 201,
	Ecaron: 282,
	Egrave: 200,
	Exists: 8707,
	ForAll: 8704,
	Gammad: 988,
	Gbreve: 286,
	Gcedil: 290,
	HARDcy: 1066,
	Hstrok: 294,
	Iacute: 205,
	Igrave: 204,
	Itilde: 296,
	Jsercy: 1032,
	Kcedil: 310,
	Lacute: 313,
	Lambda: 923,
	Lcaron: 317,
	Lcedil: 315,
	Lmidot: 319,
	Lstrok: 321,
	Nacute: 323,
	Ncaron: 327,
	Ncedil: 325,
	Ntilde: 209,
	Oacute: 211,
	Odblac: 336,
	Ograve: 210,
	Oslash: 216,
	Otilde: 213,
	Otimes: 10807,
	Racute: 340,
	Rarrtl: 10518,
	Rcaron: 344,
	Rcedil: 342,
	SHCHcy: 1065,
	SOFTcy: 1068,
	Sacute: 346,
	Scaron: 352,
	Scedil: 350,
	Square: 9633,
	Subset: 8912,
	Supset: 8913,
	Tcaron: 356,
	Tcedil: 354,
	Tstrok: 358,
	Uacute: 218,
	Ubreve: 364,
	Udblac: 368,
	Ugrave: 217,
	Utilde: 360,
	Vdashl: 10982,
	Verbar: 8214,
	Vvdash: 8874,
	Yacute: 221,
	Zacute: 377,
	Zcaron: 381,
	aacute: 225,
	abreve: 259,
	agrave: 224,
	andand: 10837,
	angmsd: 8737,
	angsph: 8738,
	apacir: 10863,
	approx: 8776,
	atilde: 227,
	barvee: 8893,
	barwed: 8965,
	becaus: 8757,
	bernou: 8492,
	bigcap: 8898,
	bigcup: 8899,
	bigvee: 8897,
	bkarow: 10509,
	bottom: 8869,
	bowtie: 8904,
	boxbox: 10697,
	bprime: 8245,
	brvbar: 166,
	bullet: 8226,
	bumpeq: 8783,
	cacute: 263,
	capand: 10820,
	capcap: 10827,
	capcup: 10823,
	capdot: 10816,
	ccaron: 269,
	ccedil: 231,
	circeq: 8791,
	cirmid: 10991,
	colone: 8788,
	commat: 64,
	compfn: 8728,
	conint: 8750,
	coprod: 8720,
	copysr: 8471,
	cularr: 8630,
	cupcap: 10822,
	cupcup: 10826,
	cupdot: 8845,
	curarr: 8631,
	curren: 164,
	cylcty: 9005,
	dagger: 8224,
	daleth: 8504,
	dcaron: 271,
	dfisht: 10623,
	divide: 247,
	divonx: 8903,
	dlcorn: 8990,
	dlcrop: 8973,
	dollar: 36,
	drcorn: 8991,
	drcrop: 8972,
	dstrok: 273,
	eacute: 233,
	easter: 10862,
	ecaron: 283,
	ecolon: 8789,
	egrave: 232,
	egsdot: 10904,
	elsdot: 10903,
	emptyv: 8709,
	emsp13: 8196,
	emsp14: 8197,
	eparsl: 10723,
	eqcirc: 8790,
	equals: 61,
	equest: 8799,
	female: 9792,
	ffilig: 64259,
	ffllig: 64260,
	forall: 8704,
	frac12: 189,
	frac13: 8531,
	frac14: 188,
	frac15: 8533,
	frac16: 8537,
	frac18: 8539,
	frac23: 8532,
	frac25: 8534,
	frac34: 190,
	frac35: 8535,
	frac38: 8540,
	frac45: 8536,
	frac56: 8538,
	frac58: 8541,
	frac78: 8542,
	gacute: 501,
	gammad: 989,
	gbreve: 287,
	gesdot: 10880,
	gesles: 10900,
	gtlPar: 10645,
	gtrarr: 10616,
	gtrdot: 8919,
	gtrsim: 8819,
	hairsp: 8202,
	hamilt: 8459,
	hardcy: 1098,
	hearts: 9829,
	hellip: 8230,
	hercon: 8889,
	homtht: 8763,
	horbar: 8213,
	hslash: 8463,
	hstrok: 295,
	hybull: 8259,
	hyphen: 8208,
	iacute: 237,
	igrave: 236,
	iiiint: 10764,
	iinfin: 10716,
	incare: 8453,
	inodot: 305,
	intcal: 8890,
	iquest: 191,
	isinsv: 8947,
	itilde: 297,
	jsercy: 1112,
	kappav: 1008,
	kcedil: 311,
	kgreen: 312,
	lAtail: 10523,
	lacute: 314,
	lagran: 8466,
	lambda: 955,
	langle: 10216,
	larrfs: 10525,
	larrhk: 8617,
	larrlp: 8619,
	larrpl: 10553,
	larrtl: 8610,
	latail: 10521,
	lbrace: 123,
	lbrack: 91,
	lcaron: 318,
	lcedil: 316,
	ldquor: 8222,
	lesdot: 10879,
	lesges: 10899,
	lfisht: 10620,
	lfloor: 8970,
	lharul: 10602,
	llhard: 10603,
	lmidot: 320,
	lmoust: 9136,
	loplus: 10797,
	lowast: 8727,
	lowbar: 95,
	lparlt: 10643,
	lrhard: 10605,
	lsaquo: 8249,
	lsquor: 8218,
	lstrok: 322,
	lthree: 8907,
	ltimes: 8905,
	ltlarr: 10614,
	ltrPar: 10646,
	mapsto: 8614,
	marker: 9646,
	mcomma: 10793,
	midast: 42,
	midcir: 10992,
	middot: 183,
	minusb: 8863,
	minusd: 8760,
	mnplus: 8723,
	models: 8871,
	mstpos: 8766,
	nVDash: 8879,
	nVdash: 8878,
	nacute: 324,
	ncaron: 328,
	ncedil: 326,
	nearhk: 10532,
	nequiv: 8802,
	nesear: 10536,
	nexist: 8708,
	nltrie: 8940,
	nprcue: 8928,
	nrtrie: 8941,
	nsccue: 8929,
	nsimeq: 8772,
	ntilde: 241,
	numero: 8470,
	nvDash: 8877,
	nvHarr: 10500,
	nvdash: 8876,
	nvlArr: 10498,
	nvrArr: 10499,
	nwarhk: 10531,
	nwnear: 10535,
	oacute: 243,
	odblac: 337,
	odsold: 10684,
	ograve: 242,
	ominus: 8854,
	origof: 8886,
	oslash: 248,
	otilde: 245,
	otimes: 8855,
	parsim: 10995,
	percnt: 37,
	period: 46,
	permil: 8240,
	phmmat: 8499,
	planck: 8463,
	plankv: 8463,
	plusdo: 8724,
	plusdu: 10789,
	plusmn: 177,
	preceq: 10927,
	primes: 8473,
	prnsim: 8936,
	propto: 8733,
	prurel: 8880,
	puncsp: 8200,
	qprime: 8279,
	rAtail: 10524,
	racute: 341,
	rangle: 10217,
	rarrap: 10613,
	rarrfs: 10526,
	rarrhk: 8618,
	rarrlp: 8620,
	rarrpl: 10565,
	rarrtl: 8611,
	ratail: 10522,
	rbrace: 125,
	rbrack: 93,
	rcaron: 345,
	rcedil: 343,
	rdquor: 8221,
	rfisht: 10621,
	rfloor: 8971,
	rharul: 10604,
	rmoust: 9137,
	roplus: 10798,
	rpargt: 10644,
	rsaquo: 8250,
	rsquor: 8217,
	rthree: 8908,
	rtimes: 8906,
	sacute: 347,
	scaron: 353,
	scedil: 351,
	scnsim: 8937,
	searhk: 10533,
	seswar: 10537,
	sfrown: 8994,
	shchcy: 1097,
	sigmaf: 962,
	sigmav: 962,
	simdot: 10858,
	smashp: 10803,
	softcy: 1100,
	solbar: 9023,
	spades: 9824,
	sqsube: 8849,
	sqsupe: 8850,
	square: 9633,
	squarf: 9642,
	ssetmn: 8726,
	ssmile: 8995,
	sstarf: 8902,
	subdot: 10941,
	subset: 8834,
	subsim: 10951,
	subsub: 10965,
	subsup: 10963,
	succeq: 10928,
	supdot: 10942,
	supset: 8835,
	supsim: 10952,
	supsub: 10964,
	supsup: 10966,
	swarhk: 10534,
	swnwar: 10538,
	target: 8982,
	tcaron: 357,
	tcedil: 355,
	telrec: 8981,
	there4: 8756,
	thetav: 977,
	thinsp: 8201,
	thksim: 8764,
	timesb: 8864,
	timesd: 10800,
	topbot: 9014,
	topcir: 10993,
	tprime: 8244,
	tridot: 9708,
	tstrok: 359,
	uacute: 250,
	ubreve: 365,
	udblac: 369,
	ufisht: 10622,
	ugrave: 249,
	ulcorn: 8988,
	ulcrop: 8975,
	urcorn: 8989,
	urcrop: 8974,
	utilde: 361,
	vangrt: 10652,
	varphi: 966,
	varrho: 1009,
	veebar: 8891,
	vellip: 8942,
	verbar: 124,
	wedbar: 10847,
	wedgeq: 8793,
	weierp: 8472,
	wreath: 8768,
	xoplus: 10753,
	xotime: 10754,
	xsqcup: 10758,
	xuplus: 10756,
	xwedge: 8896,
	yacute: 253,
	zacute: 378,
	zcaron: 382,
	zeetrf: 8488,
	AElig: 198,
	Acirc: 194,
	Alpha: 913,
	Amacr: 256,
	Aogon: 260,
	Aring: 197,
	Breve: 728,
	Ccirc: 264,
	Colon: 8759,
	Cross: 10799,
	Dashv: 10980,
	Delta: 916,
	Ecirc: 202,
	Emacr: 274,
	Eogon: 280,
	Equal: 10869,
	Gamma: 915,
	Gcirc: 284,
	Hacek: 711,
	Hcirc: 292,
	IJlig: 306,
	Icirc: 206,
	Imacr: 298,
	Iogon: 302,
	Iukcy: 1030,
	Jcirc: 308,
	Jukcy: 1028,
	Kappa: 922,
	OElig: 338,
	Ocirc: 212,
	Omacr: 332,
	Omega: 937,
	Prime: 8243,
	RBarr: 10512,
	Scirc: 348,
	Sigma: 931,
	THORN: 222,
	TRADE: 8482,
	TSHcy: 1035,
	Theta: 920,
	Tilde: 8764,
	Ubrcy: 1038,
	Ucirc: 219,
	Umacr: 362,
	Union: 8899,
	Uogon: 370,
	UpTee: 8869,
	Uring: 366,
	VDash: 8875,
	Vdash: 8873,
	Wcirc: 372,
	Wedge: 8896,
	Ycirc: 374,
	acirc: 226,
	acute: 180,
	aelig: 230,
	aleph: 8501,
	alpha: 945,
	amacr: 257,
	amalg: 10815,
	angle: 8736,
	angrt: 8735,
	angst: 8491,
	aogon: 261,
	aring: 229,
	asymp: 8776,
	awint: 10769,
	bcong: 8780,
	bdquo: 8222,
	bepsi: 1014,
	blank: 9251,
	blk12: 9618,
	blk14: 9617,
	blk34: 9619,
	block: 9608,
	boxDL: 9559,
	boxDR: 9556,
	boxDl: 9558,
	boxDr: 9555,
	boxHD: 9574,
	boxHU: 9577,
	boxHd: 9572,
	boxHu: 9575,
	boxUL: 9565,
	boxUR: 9562,
	boxUl: 9564,
	boxUr: 9561,
	boxVH: 9580,
	boxVL: 9571,
	boxVR: 9568,
	boxVh: 9579,
	boxVl: 9570,
	boxVr: 9567,
	boxdL: 9557,
	boxdR: 9554,
	boxdl: 9488,
	boxdr: 9484,
	boxhD: 9573,
	boxhU: 9576,
	boxhd: 9516,
	boxhu: 9524,
	boxuL: 9563,
	boxuR: 9560,
	boxul: 9496,
	boxur: 9492,
	boxvH: 9578,
	boxvL: 9569,
	boxvR: 9566,
	boxvh: 9532,
	boxvl: 9508,
	boxvr: 9500,
	breve: 728,
	bsemi: 8271,
	bsime: 8909,
	bsolb: 10693,
	bumpE: 10926,
	bumpe: 8783,
	caret: 8257,
	caron: 711,
	ccaps: 10829,
	ccirc: 265,
	ccups: 10828,
	cedil: 184,
	check: 10003,
	clubs: 9827,
	colon: 58,
	comma: 44,
	crarr: 8629,
	cross: 10007,
	csube: 10961,
	csupe: 10962,
	ctdot: 8943,
	cuepr: 8926,
	cuesc: 8927,
	cupor: 10821,
	cuvee: 8910,
	cuwed: 8911,
	cwint: 8753,
	dashv: 8867,
	dblac: 733,
	ddarr: 8650,
	delta: 948,
	dharl: 8643,
	dharr: 8642,
	diams: 9830,
	disin: 8946,
	doteq: 8784,
	dtdot: 8945,
	dtrif: 9662,
	duarr: 8693,
	duhar: 10607,
	eDDot: 10871,
	ecirc: 234,
	efDot: 8786,
	emacr: 275,
	empty: 8709,
	eogon: 281,
	eplus: 10865,
	epsiv: 949,
	eqsim: 8770,
	equiv: 8801,
	erDot: 8787,
	erarr: 10609,
	esdot: 8784,
	exist: 8707,
	fflig: 64256,
	filig: 64257,
	fllig: 64258,
	fltns: 9649,
	forkv: 10969,
	frasl: 8260,
	frown: 8994,
	gamma: 947,
	gcirc: 285,
	gescc: 10921,
	gimel: 8503,
	gneqq: 8809,
	gnsim: 8935,
	grave: 96,
	gsime: 10894,
	gsiml: 10896,
	gtcir: 10874,
	gtdot: 8919,
	harrw: 8621,
	hcirc: 293,
	hoarr: 8703,
	icirc: 238,
	iexcl: 161,
	iiint: 8749,
	iiota: 8489,
	ijlig: 307,
	imacr: 299,
	image: 8465,
	imath: 305,
	imped: 437,
	infin: 8734,
	iogon: 303,
	iprod: 10812,
	isinE: 8953,
	isins: 8948,
	isinv: 8712,
	iukcy: 1110,
	jcirc: 309,
	jmath: 567,
	jukcy: 1108,
	kappa: 954,
	lAarr: 8666,
	lBarr: 10510,
	langd: 10641,
	laquo: 171,
	larrb: 8676,
	lbarr: 10508,
	lbbrk: 10098,
	lbrke: 10635,
	lceil: 8968,
	ldquo: 8220,
	lescc: 10920,
	lhard: 8637,
	lharu: 8636,
	lhblk: 9604,
	llarr: 8647,
	lltri: 9722,
	lneqq: 8808,
	lnsim: 8934,
	loang: 10220,
	loarr: 8701,
	lobrk: 10214,
	lopar: 10629,
	lrarr: 8646,
	lrhar: 8651,
	lrtri: 8895,
	lsime: 10893,
	lsimg: 10895,
	lsquo: 8216,
	ltcir: 10873,
	ltdot: 8918,
	ltrie: 8884,
	ltrif: 9666,
	mDDot: 8762,
	mdash: 8212,
	micro: 181,
	minus: 8722,
	mumap: 8888,
	nabla: 8711,
	napos: 329,
	natur: 9838,
	ncong: 8775,
	ndash: 8211,
	neArr: 8663,
	nearr: 8599,
	ngsim: 8821,
	nhArr: 8654,
	nharr: 8622,
	nhpar: 10994,
	nlArr: 8653,
	nlarr: 8602,
	nless: 8814,
	nlsim: 8820,
	nltri: 8938,
	notin: 8713,
	notni: 8716,
	nprec: 8832,
	nrArr: 8655,
	nrarr: 8603,
	nrtri: 8939,
	nsime: 8772,
	nsmid: 8740,
	nspar: 8742,
	nsube: 8840,
	nsucc: 8833,
	nsupe: 8841,
	numsp: 8199,
	nwArr: 8662,
	nwarr: 8598,
	ocirc: 244,
	odash: 8861,
	oelig: 339,
	ofcir: 10687,
	ohbar: 10677,
	olarr: 8634,
	olcir: 10686,
	oline: 8254,
	omacr: 333,
	omega: 969,
	operp: 10681,
	oplus: 8853,
	orarr: 8635,
	order: 8500,
	ovbar: 9021,
	parsl: 11005,
	phone: 9742,
	plusb: 8862,
	pluse: 10866,
	pound: 163,
	prcue: 8828,
	prime: 8242,
	prnap: 10937,
	prsim: 8830,
	quest: 63,
	rAarr: 8667,
	rBarr: 10511,
	radic: 8730,
	rangd: 10642,
	range: 10661,
	raquo: 187,
	rarrb: 8677,
	rarrc: 10547,
	rarrw: 8605,
	ratio: 8758,
	rbarr: 10509,
	rbbrk: 10099,
	rbrke: 10636,
	rceil: 8969,
	rdquo: 8221,
	reals: 8477,
	rhard: 8641,
	rharu: 8640,
	rlarr: 8644,
	rlhar: 8652,
	rnmid: 10990,
	roang: 10221,
	roarr: 8702,
	robrk: 10215,
	ropar: 10630,
	rrarr: 8649,
	rsquo: 8217,
	rtrie: 8885,
	rtrif: 9656,
	sbquo: 8218,
	sccue: 8829,
	scirc: 349,
	scnap: 10938,
	scsim: 8831,
	sdotb: 8865,
	sdote: 10854,
	seArr: 8664,
	searr: 8600,
	setmn: 8726,
	sharp: 9839,
	sigma: 963,
	simeq: 8771,
	simgE: 10912,
	simlE: 10911,
	simne: 8774,
	slarr: 8592,
	smile: 8995,
	sqcap: 8851,
	sqcup: 8852,
	sqsub: 8847,
	sqsup: 8848,
	srarr: 8594,
	starf: 9733,
	strns: 175,
	subnE: 10955,
	subne: 8842,
	supnE: 10956,
	supne: 8843,
	swArr: 8665,
	swarr: 8601,
	szlig: 223,
	theta: 952,
	thkap: 8776,
	thorn: 254,
	tilde: 732,
	times: 215,
	trade: 8482,
	trisb: 10701,
	tshcy: 1115,
	twixt: 8812,
	ubrcy: 1118,
	ucirc: 251,
	udarr: 8645,
	udhar: 10606,
	uharl: 8639,
	uharr: 8638,
	uhblk: 9600,
	ultri: 9720,
	umacr: 363,
	uogon: 371,
	uplus: 8846,
	upsih: 978,
	uring: 367,
	urtri: 9721,
	utdot: 8944,
	utrif: 9652,
	uuarr: 8648,
	vBarv: 10985,
	vDash: 8872,
	varpi: 982,
	vdash: 8866,
	veeeq: 8794,
	vltri: 8882,
	vprop: 8733,
	vrtri: 8883,
	wcirc: 373,
	wedge: 8743,
	xcirc: 9711,
	xdtri: 9661,
	xhArr: 10234,
	xharr: 10231,
	xlArr: 10232,
	xlarr: 10229,
	xodot: 10752,
	xrArr: 10233,
	xrarr: 10230,
	xutri: 9651,
	ycirc: 375,
	Aopf: 120120,
	Ascr: 119964,
	Auml: 196,
	Barv: 10983,
	Beta: 914,
	Bopf: 120121,
	Bscr: 8492,
	CHcy: 1063,
	COPY: 169,
	Cdot: 266,
	Copf: 8450,
	Cscr: 119966,
	DJcy: 1026,
	DScy: 1029,
	DZcy: 1039,
	Darr: 8609,
	Dopf: 120123,
	Dscr: 119967,
	Edot: 278,
	Eopf: 120124,
	Escr: 8496,
	Esim: 10867,
	Euml: 203,
	Fopf: 120125,
	Fscr: 8497,
	GJcy: 1027,
	Gdot: 288,
	Gopf: 120126,
	Gscr: 119970,
	Hopf: 8461,
	Hscr: 8459,
	IEcy: 1045,
	IOcy: 1025,
	Idot: 304,
	Iopf: 120128,
	Iota: 921,
	Iscr: 8464,
	Iuml: 207,
	Jopf: 120129,
	Jscr: 119973,
	KHcy: 1061,
	KJcy: 1036,
	Kopf: 120130,
	Kscr: 119974,
	LJcy: 1033,
	Lang: 10218,
	Larr: 8606,
	Lopf: 120131,
	Lscr: 8466,
	Mopf: 120132,
	Mscr: 8499,
	NJcy: 1034,
	Nopf: 8469,
	Nscr: 119977,
	Oopf: 120134,
	Oscr: 119978,
	Ouml: 214,
	Popf: 8473,
	Pscr: 119979,
	QUOT: 34,
	Qopf: 8474,
	Qscr: 119980,
	Rang: 10219,
	Rarr: 8608,
	Ropf: 8477,
	Rscr: 8475,
	SHcy: 1064,
	Sopf: 120138,
	Sqrt: 8730,
	Sscr: 119982,
	Star: 8902,
	TScy: 1062,
	Topf: 120139,
	Tscr: 119983,
	Uarr: 8607,
	Uopf: 120140,
	Upsi: 978,
	Uscr: 119984,
	Uuml: 220,
	Vbar: 10987,
	Vert: 8214,
	Vopf: 120141,
	Vscr: 119985,
	Wopf: 120142,
	Wscr: 119986,
	Xopf: 120143,
	Xscr: 119987,
	YAcy: 1071,
	YIcy: 1031,
	YUcy: 1070,
	Yopf: 120144,
	Yscr: 119988,
	Yuml: 376,
	ZHcy: 1046,
	Zdot: 379,
	Zeta: 918,
	Zopf: 8484,
	Zscr: 119989,
	andd: 10844,
	andv: 10842,
	ange: 10660,
	aopf: 120146,
	apid: 8779,
	apos: 39,
	ascr: 119990,
	auml: 228,
	bNot: 10989,
	bbrk: 9141,
	beta: 946,
	beth: 8502,
	bnot: 8976,
	bopf: 120147,
	boxH: 9552,
	boxV: 9553,
	boxh: 9472,
	boxv: 9474,
	bscr: 119991,
	bsim: 8765,
	bsol: 92,
	bull: 8226,
	bump: 8782,
	cdot: 267,
	cent: 162,
	chcy: 1095,
	cirE: 10691,
	circ: 710,
	cire: 8791,
	comp: 8705,
	cong: 8773,
	copf: 120148,
	copy: 169,
	cscr: 119992,
	csub: 10959,
	csup: 10960,
	dArr: 8659,
	dHar: 10597,
	darr: 8595,
	dash: 8208,
	diam: 8900,
	djcy: 1106,
	dopf: 120149,
	dscr: 119993,
	dscy: 1109,
	dsol: 10742,
	dtri: 9663,
	dzcy: 1119,
	eDot: 8785,
	ecir: 8790,
	edot: 279,
	emsp: 8195,
	ensp: 8194,
	eopf: 120150,
	epar: 8917,
	epsi: 1013,
	escr: 8495,
	esim: 8770,
	euml: 235,
	euro: 8364,
	excl: 33,
	flat: 9837,
	fnof: 402,
	fopf: 120151,
	fork: 8916,
	fscr: 119995,
	gdot: 289,
	geqq: 8807,
	gjcy: 1107,
	gnap: 10890,
	gneq: 10888,
	gopf: 120152,
	gscr: 8458,
	gsim: 8819,
	gtcc: 10919,
	hArr: 8660,
	half: 189,
	harr: 8596,
	hbar: 8463,
	hopf: 120153,
	hscr: 119997,
	iecy: 1077,
	imof: 8887,
	iocy: 1105,
	iopf: 120154,
	iota: 953,
	iscr: 119998,
	isin: 8712,
	iuml: 239,
	jopf: 120155,
	jscr: 119999,
	khcy: 1093,
	kjcy: 1116,
	kopf: 120156,
	kscr: 120000,
	lArr: 8656,
	lHar: 10594,
	lang: 10216,
	larr: 8592,
	late: 10925,
	lcub: 123,
	ldca: 10550,
	ldsh: 8626,
	leqq: 8806,
	ljcy: 1113,
	lnap: 10889,
	lneq: 10887,
	lopf: 120157,
	lozf: 10731,
	lpar: 40,
	lscr: 120001,
	lsim: 8818,
	lsqb: 91,
	ltcc: 10918,
	ltri: 9667,
	macr: 175,
	male: 9794,
	malt: 10016,
	mlcp: 10971,
	mldr: 8230,
	mopf: 120158,
	mscr: 120002,
	nbsp: 160,
	ncap: 10819,
	ncup: 10818,
	ngeq: 8817,
	ngtr: 8815,
	nisd: 8954,
	njcy: 1114,
	nldr: 8229,
	nleq: 8816,
	nmid: 8740,
	nopf: 120159,
	npar: 8742,
	nscr: 120003,
	nsim: 8769,
	nsub: 8836,
	nsup: 8837,
	ntgl: 8825,
	ntlg: 8824,
	oast: 8859,
	ocir: 8858,
	odiv: 10808,
	odot: 8857,
	ogon: 731,
	oint: 8750,
	omid: 10678,
	oopf: 120160,
	opar: 10679,
	ordf: 170,
	ordm: 186,
	oror: 10838,
	oscr: 8500,
	osol: 8856,
	ouml: 246,
	para: 182,
	part: 8706,
	perp: 8869,
	phiv: 966,
	plus: 43,
	popf: 120161,
	prap: 10935,
	prec: 8826,
	prnE: 10933,
	prod: 8719,
	prop: 8733,
	pscr: 120005,
	qint: 10764,
	qopf: 120162,
	qscr: 120006,
	quot: 34,
	rArr: 8658,
	rHar: 10596,
	race: 10714,
	rang: 10217,
	rarr: 8594,
	rcub: 125,
	rdca: 10551,
	rdsh: 8627,
	real: 8476,
	rect: 9645,
	rhov: 1009,
	ring: 730,
	ropf: 120163,
	rpar: 41,
	rscr: 120007,
	rsqb: 93,
	rtri: 9657,
	scap: 10936,
	scnE: 10934,
	sdot: 8901,
	sect: 167,
	semi: 59,
	sext: 10038,
	shcy: 1096,
	sime: 8771,
	simg: 10910,
	siml: 10909,
	smid: 8739,
	smte: 10924,
	solb: 10692,
	sopf: 120164,
	spar: 8741,
	squf: 9642,
	sscr: 120008,
	star: 9734,
	subE: 10949,
	sube: 8838,
	succ: 8827,
	sung: 9834,
	sup1: 185,
	sup2: 178,
	sup3: 179,
	supE: 10950,
	supe: 8839,
	tbrk: 9140,
	tdot: 8411,
	tint: 8749,
	toea: 10536,
	topf: 120165,
	tosa: 10537,
	trie: 8796,
	tscr: 120009,
	tscy: 1094,
	uArr: 8657,
	uHar: 10595,
	uarr: 8593,
	uopf: 120166,
	upsi: 965,
	uscr: 120010,
	utri: 9653,
	uuml: 252,
	vArr: 8661,
	vBar: 10984,
	varr: 8597,
	vert: 124,
	vopf: 120167,
	vscr: 120011,
	wopf: 120168,
	wscr: 120012,
	xcap: 8898,
	xcup: 8899,
	xmap: 10236,
	xnis: 8955,
	xopf: 120169,
	xscr: 120013,
	xvee: 8897,
	yacy: 1103,
	yicy: 1111,
	yopf: 120170,
	yscr: 120014,
	yucy: 1102,
	yuml: 255,
	zdot: 380,
	zeta: 950,
	zhcy: 1078,
	zopf: 120171,
	zscr: 120015,
	zwnj: 8204,
	AMP: 38,
	Acy: 1040,
	Afr: 120068,
	And: 10835,
	Bcy: 1041,
	Bfr: 120069,
	Cap: 8914,
	Cfr: 8493,
	Chi: 935,
	Cup: 8915,
	Dcy: 1044,
	Del: 8711,
	Dfr: 120071,
	Dot: 168,
	ENG: 330,
	ETH: 208,
	Ecy: 1069,
	Efr: 120072,
	Eta: 919,
	Fcy: 1060,
	Ffr: 120073,
	Gcy: 1043,
	Gfr: 120074,
	Hat: 94,
	Hfr: 8460,
	Icy: 1048,
	Ifr: 8465,
	Int: 8748,
	Jcy: 1049,
	Jfr: 120077,
	Kcy: 1050,
	Kfr: 120078,
	Lcy: 1051,
	Lfr: 120079,
	Lsh: 8624,
	Map: 10501,
	Mcy: 1052,
	Mfr: 120080,
	Ncy: 1053,
	Nfr: 120081,
	Not: 10988,
	Ocy: 1054,
	Ofr: 120082,
	Pcy: 1055,
	Pfr: 120083,
	Phi: 934,
	Psi: 936,
	Qfr: 120084,
	REG: 174,
	Rcy: 1056,
	Rfr: 8476,
	Rho: 929,
	Rsh: 8625,
	Scy: 1057,
	Sfr: 120086,
	Sub: 8912,
	Sum: 8721,
	Sup: 8913,
	Tab: 9,
	Tau: 932,
	Tcy: 1058,
	Tfr: 120087,
	Ucy: 1059,
	Ufr: 120088,
	Vcy: 1042,
	Vee: 8897,
	Vfr: 120089,
	Wfr: 120090,
	Xfr: 120091,
	Ycy: 1067,
	Yfr: 120092,
	Zcy: 1047,
	Zfr: 8488,
	acd: 8767,
	acy: 1072,
	afr: 120094,
	amp: 38,
	and: 8743,
	ang: 8736,
	apE: 10864,
	ape: 8778,
	ast: 42,
	bcy: 1073,
	bfr: 120095,
	bot: 8869,
	cap: 8745,
	cfr: 120096,
	chi: 967,
	cir: 9675,
	cup: 8746,
	dcy: 1076,
	deg: 176,
	dfr: 120097,
	die: 168,
	div: 247,
	dot: 729,
	ecy: 1101,
	efr: 120098,
	egs: 10902,
	ell: 8467,
	els: 10901,
	eng: 331,
	eta: 951,
	eth: 240,
	fcy: 1092,
	ffr: 120099,
	gEl: 10892,
	gap: 10886,
	gcy: 1075,
	gel: 8923,
	geq: 8805,
	ges: 10878,
	gfr: 120100,
	ggg: 8921,
	glE: 10898,
	gla: 10917,
	glj: 10916,
	gnE: 8809,
	gne: 10888,
	hfr: 120101,
	icy: 1080,
	iff: 8660,
	ifr: 120102,
	int: 8747,
	jcy: 1081,
	jfr: 120103,
	kcy: 1082,
	kfr: 120104,
	lEg: 10891,
	lap: 10885,
	lat: 10923,
	lcy: 1083,
	leg: 8922,
	leq: 8804,
	les: 10877,
	lfr: 120105,
	lgE: 10897,
	lnE: 8808,
	lne: 10887,
	loz: 9674,
	lrm: 8206,
	lsh: 8624,
	map: 8614,
	mcy: 1084,
	mfr: 120106,
	mho: 8487,
	mid: 8739,
	nap: 8777,
	ncy: 1085,
	nfr: 120107,
	nge: 8817,
	ngt: 8815,
	nis: 8956,
	niv: 8715,
	nle: 8816,
	nlt: 8814,
	not: 172,
	npr: 8832,
	nsc: 8833,
	num: 35,
	ocy: 1086,
	ofr: 120108,
	ogt: 10689,
	ohm: 8486,
	olt: 10688,
	ord: 10845,
	orv: 10843,
	par: 8741,
	pcy: 1087,
	pfr: 120109,
	phi: 966,
	piv: 982,
	prE: 10931,
	pre: 10927,
	psi: 968,
	qfr: 120110,
	rcy: 1088,
	reg: 174,
	rfr: 120111,
	rho: 961,
	rlm: 8207,
	rsh: 8625,
	scE: 10932,
	sce: 10928,
	scy: 1089,
	sfr: 120112,
	shy: 173,
	sim: 8764,
	smt: 10922,
	sol: 47,
	squ: 9633,
	sub: 8834,
	sum: 8721,
	sup: 8835,
	tau: 964,
	tcy: 1090,
	tfr: 120113,
	top: 8868,
	ucy: 1091,
	ufr: 120114,
	uml: 168,
	vcy: 1074,
	vee: 8744,
	vfr: 120115,
	wfr: 120116,
	xfr: 120117,
	ycy: 1099,
	yen: 165,
	yfr: 120118,
	zcy: 1079,
	zfr: 120119,
	zwj: 8205,
	DD: 8517,
	GT: 62,
	Gg: 8921,
	Gt: 8811,
	Im: 8465,
	LT: 60,
	Ll: 8920,
	Lt: 8810,
	Mu: 924,
	Nu: 925,
	Or: 10836,
	Pi: 928,
	Pr: 10939,
	Re: 8476,
	Sc: 10940,
	Xi: 926,
	ac: 8766,
	af: 8289,
	ap: 8776,
	dd: 8518,
	ee: 8519,
	eg: 10906,
	el: 10905,
	gE: 8807,
	ge: 8805,
	gg: 8811,
	gl: 8823,
	gt: 62,
	ic: 8291,
	ii: 8520,
	in: 8712,
	it: 8290,
	lE: 8806,
	le: 8804,
	lg: 8822,
	ll: 8810,
	lt: 60,
	mp: 8723,
	mu: 956,
	ne: 8800,
	ni: 8715,
	nu: 957,
	oS: 9416,
	or: 8744,
	pi: 960,
	pm: 177,
	pr: 8826,
	rx: 8478,
	sc: 8827,
	wp: 8472,
	wr: 8768,
	xi: 958,
};

const windows_1252 = [
	8364,
	129,
	8218,
	402,
	8222,
	8230,
	8224,
	8225,
	710,
	8240,
	352,
	8249,
	338,
	141,
	381,
	143,
	144,
	8216,
	8217,
	8220,
	8221,
	8226,
	8211,
	8212,
	732,
	8482,
	353,
	8250,
	339,
	157,
	382,
	376,
];

const entity_pattern = new RegExp(
	`&(#?(?:x[\\w\\d]+|\\d+|${Object.keys(entities).join('|')}));?`,
	'g'
);

function decode_character_references(html) {
	return html.replace(entity_pattern, (match, entity) => {
		let code;

		// Handle named entities
		if (entity[0] !== '#') {
			code = entities[entity];
		} else if (entity[1] === 'x') {
			code = parseInt(entity.substring(2), 16);
		} else {
			code = parseInt(entity.substring(1), 10);
		}

		if (!code) {
			return match;
		}

		return String.fromCodePoint(validate_code(code));
	});
}

const NUL = 0;

// some code points are verboten. If we were inserting HTML, the browser would replace the illegal
// code points with alternatives in some cases - since we're bypassing that mechanism, we need
// to replace them ourselves
//
// Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
function validate_code(code) {
	// line feed becomes generic whitespace
	if (code === 10) {
		return 32;
	}

	// ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
	if (code < 128) {
		return code;
	}

	// code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
	// to correct the mistake or we'll end up with missing € signs and so on
	if (code <= 159) {
		return windows_1252[code - 128];
	}

	// basic multilingual plane
	if (code < 55296) {
		return code;
	}

	// UTF-16 surrogate halves
	if (code <= 57343) {
		return NUL;
	}

	// rest of the basic multilingual plane
	if (code <= 65535) {
		return code;
	}

	// supplementary multilingual plane 0x10000 - 0x1ffff
	if (code >= 65536 && code <= 131071) {
		return code;
	}

	// supplementary ideographic plane 0x20000 - 0x2ffff
	if (code >= 131072 && code <= 196607) {
		return code;
	}

	return NUL;
}

// Adapted from https://github.com/acornjs/acorn/blob/6584815dca7440e00de841d1dad152302fdd7ca5/src/tokenize.js
// Reproduced under MIT License https://github.com/acornjs/acorn/blob/master/LICENSE

function full_char_code_at(str, i) {
	let code = str.charCodeAt(i);
	if (code <= 0xd7ff || code >= 0xe000) return code;

	let next = str.charCodeAt(i + 1);
	return (code << 10) + next - 0x35fdc00;
}

const globals = new Set([
	'alert',
	'Array',
	'Boolean',
	'confirm',
	'console',
	'Date',
	'decodeURI',
	'decodeURIComponent',
	'document',
	'encodeURI',
	'encodeURIComponent',
	'Infinity',
	'Intl',
	'isFinite',
	'isNaN',
	'JSON',
	'Map',
	'Math',
	'NaN',
	'Number',
	'Object',
	'parseFloat',
	'parseInt',
	'process',
	'Promise',
	'prompt',
	'RegExp',
	'Set',
	'String',
	'undefined',
	'window',
]);

const reserved = new Set([
	'arguments',
	'await',
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'enum',
	'eval',
	'export',
	'extends',
	'false',
	'finally',
	'for',
	'function',
	'if',
	'implements',
	'import',
	'in',
	'instanceof',
	'interface',
	'let',
	'new',
	'null',
	'package',
	'private',
	'protected',
	'public',
	'return',
	'static',
	'super',
	'switch',
	'this',
	'throw',
	'true',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'with',
	'yield',
]);

const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;

function is_void(name) {
	return void_element_names.test(name) || name.toLowerCase() === '!doctype';
}

function is_valid(str) {
	let i = 0;

	while (i < str.length) {
		const code = full_char_code_at(str, i);
		if (!(i === 0 ? acorn.isIdentifierStart : acorn.isIdentifierChar)(code, true)) return false;

		i += code <= 0xffff ? 1 : 2;
	}

	return true;
}

function quote_name_if_necessary(name) {
	if (!is_valid(name)) return `"${name}"`;
	return name;
}

function quote_prop_if_necessary(name) {
	if (!is_valid(name)) return `["${name}"]`;
	return `.${name}`;
}

function sanitize(name) {
	return name
		.replace(/[^a-zA-Z0-9_]+/g, '_')
		.replace(/^_/, '')
		.replace(/_$/, '')
		.replace(/^[0-9]/, '_$&');
}

function fuzzymatch(name, names) {
	const set = new FuzzySet(names);
	const matches = set.get(name);

	return matches && matches[0] && matches[0][0] > 0.7 ? matches[0][1] : null;
}

// adapted from https://github.com/Glench/fuzzyset.js/blob/master/lib/fuzzyset.js
// BSD Licensed

const GRAM_SIZE_LOWER = 2;
const GRAM_SIZE_UPPER = 3;

// return an edit distance from 0 to 1
function _distance(str1, str2) {
	if (str1 === null && str2 === null)
		throw 'Trying to compare two null values';
	if (str1 === null || str2 === null) return 0;
	str1 = String(str1);
	str2 = String(str2);

	const distance = levenshtein(str1, str2);
	if (str1.length > str2.length) {
		return 1 - distance / str1.length;
	} else {
		return 1 - distance / str2.length;
	}
}

// helper functions
function levenshtein(str1, str2) {
	const current = [];
	let prev;
	let value;

	for (let i = 0; i <= str2.length; i++) {
		for (let j = 0; j <= str1.length; j++) {
			if (i && j) {
				if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
					value = prev;
				} else {
					value = Math.min(current[j], current[j - 1], prev) + 1;
				}
			} else {
				value = i + j;
			}

			prev = current[j];
			current[j] = value;
		}
	}

	return current.pop();
}

const non_word_regex = /[^\w, ]+/;

function iterate_grams(value, gram_size = 2) {
	const simplified = '-' + value.toLowerCase().replace(non_word_regex, '') + '-';
	const len_diff = gram_size - simplified.length;
	const results = [];

	if (len_diff > 0) {
		for (let i = 0; i < len_diff; ++i) {
			value += '-';
		}
	}
	for (let i = 0; i < simplified.length - gram_size + 1; ++i) {
		results.push(simplified.slice(i, i + gram_size));
	}
	return results;
}

function gram_counter(value, gram_size = 2) {
	// return an object where key=gram, value=number of occurrences
	const result = {};
	const grams = iterate_grams(value, gram_size);
	let i = 0;

	for (i; i < grams.length; ++i) {
		if (grams[i] in result) {
			result[grams[i]] += 1;
		} else {
			result[grams[i]] = 1;
		}
	}
	return result;
}

function sort_descending(a, b) {
	return b[0] - a[0];
}

class FuzzySet {
	__init() {this.exact_set = {};}
	__init2() {this.match_dict = {};}
	__init3() {this.items = {};}

	constructor(arr) {FuzzySet.prototype.__init.call(this);FuzzySet.prototype.__init2.call(this);FuzzySet.prototype.__init3.call(this);
		// initialization
		for (let i = GRAM_SIZE_LOWER; i < GRAM_SIZE_UPPER + 1; ++i) {
			this.items[i] = [];
		}

		// add all the items to the set
		for (let i = 0; i < arr.length; ++i) {
			this.add(arr[i]);
		}
	}

	add(value) {
		const normalized_value = value.toLowerCase();
		if (normalized_value in this.exact_set) {
			return false;
		}

		let i = GRAM_SIZE_LOWER;
		for (i; i < GRAM_SIZE_UPPER + 1; ++i) {
			this._add(value, i);
		}
	}

	_add(value, gram_size) {
		const normalized_value = value.toLowerCase();
		const items = this.items[gram_size] || [];
		const index = items.length;

		items.push(0);
		const gram_counts = gram_counter(normalized_value, gram_size);
		let sum_of_square_gram_counts = 0;
		let gram;
		let gram_count;

		for (gram in gram_counts) {
			gram_count = gram_counts[gram];
			sum_of_square_gram_counts += Math.pow(gram_count, 2);
			if (gram in this.match_dict) {
				this.match_dict[gram].push([index, gram_count]);
			} else {
				this.match_dict[gram] = [[index, gram_count]];
			}
		}
		const vector_normal = Math.sqrt(sum_of_square_gram_counts);
		items[index] = [vector_normal, normalized_value];
		this.items[gram_size] = items;
		this.exact_set[normalized_value] = value;
	};

	get(value) {
		const normalized_value = value.toLowerCase();
		const result = this.exact_set[normalized_value];

		if (result) {
			return [[1, result]];
		}

		let results = [];
		// start with high gram size and if there are no results, go to lower gram sizes
		for (
			let gram_size = GRAM_SIZE_UPPER;
			gram_size >= GRAM_SIZE_LOWER;
			--gram_size
		) {
			results = this.__get(value, gram_size);
			if (results) {
				return results;
			}
		}
		return null;
	}

	__get(value, gram_size) {
		const normalized_value = value.toLowerCase();
		const matches = {};
		const gram_counts = gram_counter(normalized_value, gram_size);
		const items = this.items[gram_size];
		let sum_of_square_gram_counts = 0;
		let gram;
		let gram_count;
		let i;
		let index;
		let other_gram_count;

		for (gram in gram_counts) {
			gram_count = gram_counts[gram];
			sum_of_square_gram_counts += Math.pow(gram_count, 2);
			if (gram in this.match_dict) {
				for (i = 0; i < this.match_dict[gram].length; ++i) {
					index = this.match_dict[gram][i][0];
					other_gram_count = this.match_dict[gram][i][1];
					if (index in matches) {
						matches[index] += gram_count * other_gram_count;
					} else {
						matches[index] = gram_count * other_gram_count;
					}
				}
			}
		}

		const vector_normal = Math.sqrt(sum_of_square_gram_counts);
		let results = [];
		let match_score;

		// build a results list of [score, str]
		for (const match_index in matches) {
			match_score = matches[match_index];
			results.push([
				match_score / (vector_normal * items[match_index][0]),
				items[match_index][1],
			]);
		}

		results.sort(sort_descending);

		let new_results = [];
		const end_index = Math.min(50, results.length);
		// truncate somewhat arbitrarily to 50
		for (let i = 0; i < end_index; ++i) {
			new_results.push([
				_distance(results[i][1], normalized_value),
				results[i][1],
			]);
		}
		results = new_results;
		results.sort(sort_descending);

		new_results = [];
		for (let i = 0; i < results.length; ++i) {
			if (results[i][0] == results[0][0]) {
				new_results.push([results[i][0], this.exact_set[results[i][1]]]);
			}
		}

		return new_results;
	};
}

function list(items, conjunction = 'or') {
	if (items.length === 1) return items[0];
	return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[
		items.length - 1
	]}`;
}

const valid_tag_name = /^\!?[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;

const meta_tags = new Map([
	['svelte:head', 'Head'],
	['svelte:options', 'Options'],
	['svelte:window', 'Window'],
	['svelte:body', 'Body']
]);

const valid_meta_tags = Array.from(meta_tags.keys()).concat('svelte:self', 'svelte:component');

const specials = new Map([
	[
		'script',
		{
			read: read_script,
			property: 'js',
		},
	],
	[
		'style',
		{
			read: read_style,
			property: 'css',
		},
	],
]);

const SELF = /^svelte:self(?=[\s\/>])/;
const COMPONENT = /^svelte:component(?=[\s\/>])/;

// based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
const disallowed_contents = new Map([
	['li', new Set(['li'])],
	['dt', new Set(['dt', 'dd'])],
	['dd', new Set(['dt', 'dd'])],
	[
		'p',
		new Set(
			'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split(
				' '
			)
		),
	],
	['rt', new Set(['rt', 'rp'])],
	['rp', new Set(['rt', 'rp'])],
	['optgroup', new Set(['optgroup'])],
	['option', new Set(['option', 'optgroup'])],
	['thead', new Set(['tbody', 'tfoot'])],
	['tbody', new Set(['tbody', 'tfoot'])],
	['tfoot', new Set(['tbody'])],
	['tr', new Set(['tr', 'tbody'])],
	['td', new Set(['td', 'th', 'tr'])],
	['th', new Set(['td', 'th', 'tr'])],
]);

function parent_is_head(stack) {
	let i = stack.length;
	while (i--) {
		const { type } = stack[i];
		if (type === 'Head') return true;
		if (type === 'Element' || type === 'InlineComponent') return false;
	}
	return false;
}

function tag(parser) {
	const start = parser.index++;

	let parent = parser.current();

	if (parser.eat('!--')) {
		const data = parser.read_until(/-->/);
		parser.eat('-->', true, 'comment was left open, expected -->');

		parser.current().children.push({
			start,
			end: parser.index,
			type: 'Comment',
			data,
		});

		return;
	}

	const is_closing_tag = parser.eat('/');

	const name = read_tag_name(parser);

	if (meta_tags.has(name)) {
		const slug = meta_tags.get(name).toLowerCase();
		if (is_closing_tag) {
			if (
				(name === 'svelte:window' || name === 'svelte:body') &&
				parser.current().children.length
			) {
				parser.error({
					code: `invalid-${name.slice(7)}-content`,
					message: `<${name}> cannot have children`
				}, parser.current().children[0].start);
			}
		} else {
			if (name in parser.meta_tags) {
				parser.error({
					code: `duplicate-${slug}`,
					message: `A component can only have one <${name}> tag`
				}, start);
			}

			if (parser.stack.length > 1) {
				parser.error({
					code: `invalid-${slug}-placement`,
					message: `<${name}> tags cannot be inside elements or blocks`
				}, start);
			}

			parser.meta_tags[name] = true;
		}
	}

	const type = meta_tags.has(name)
		? meta_tags.get(name)
		: (/[A-Z]/.test(name[0]) || name === 'svelte:self' || name === 'svelte:component') ? 'InlineComponent'
			: name === 'title' && parent_is_head(parser.stack) ? 'Title'
				: name === 'slot' && !parser.customElement ? 'Slot' : 'Element';

	const element = {
		start,
		end: null, // filled in later
		type,
		name,
		attributes: [],
		children: [],
	};

	parser.allow_whitespace();

	if (is_closing_tag) {
		if (is_void(name)) {
			parser.error({
				code: `invalid-void-content`,
				message: `<${name}> is a void element and cannot have children, or a closing tag`
			}, start);
		}

		parser.eat('>', true);

		// close any elements that don't have their own closing tags, e.g. <div><p></div>
		while (parent.name !== name) {
			if (parent.type !== 'Element')
				parser.error({
					code: `invalid-closing-tag`,
					message: `</${name}> attempted to close an element that was not open`
				}, start);

			parent.end = start;
			parser.stack.pop();

			parent = parser.current();
		}

		parent.end = parser.index;
		parser.stack.pop();

		return;
	} else if (disallowed_contents.has(parent.name)) {
		// can this be a child of the parent element, or does it implicitly
		// close it, like `<li>one<li>two`?
		if (disallowed_contents.get(parent.name).has(name)) {
			parent.end = start;
			parser.stack.pop();
		}
	}

	const unique_names = new Set();

	let attribute;
	while ((attribute = read_attribute(parser, unique_names))) {
		element.attributes.push(attribute);
		parser.allow_whitespace();
	}

	if (name === 'svelte:component') {
		const index = element.attributes.findIndex(attr => attr.type === 'Attribute' && attr.name === 'this');
		if (!~index) {
			parser.error({
				code: `missing-component-definition`,
				message: `<svelte:component> must have a 'this' attribute`
			}, start);
		}

		const definition = element.attributes.splice(index, 1)[0];
		if (definition.value === true || definition.value.length !== 1 || definition.value[0].type === 'Text') {
			parser.error({
				code: `invalid-component-definition`,
				message: `invalid component definition`
			}, definition.start);
		}

		element.expression = definition.value[0].expression;
	}

	// special cases – top-level <script> and <style>
	if (specials.has(name) && parser.stack.length === 1) {
		const special = specials.get(name);

		parser.eat('>', true);
		const content = special.read(parser, start, element.attributes);
		if (content) parser[special.property].push(content);
		return;
	}

	parser.current().children.push(element);

	const self_closing = parser.eat('/') || is_void(name);

	parser.eat('>', true);

	if (self_closing) {
		// don't push self-closing elements onto the stack
		element.end = parser.index;
	} else if (name === 'textarea') {
		// special case
		element.children = read_sequence(
			parser,
			() =>
				parser.template.slice(parser.index, parser.index + 11) === '</textarea>'
		);
		parser.read(/<\/textarea>/);
		element.end = parser.index;
	} else if (name === 'script') {
		// special case
		const start = parser.index;
		const data = parser.read_until(/<\/script>/);
		const end = parser.index;
		element.children.push({ start, end, type: 'Text', data });
		parser.eat('</script>', true);
		element.end = parser.index;
	} else if (name === 'style') {
		// special case
		const start = parser.index;
		const data = parser.read_until(/<\/style>/);
		const end = parser.index;
		element.children.push({ start, end, type: 'Text', data });
		parser.eat('</style>', true);
	} else {
		parser.stack.push(element);
	}
}

function read_tag_name(parser) {
	const start = parser.index;

	if (parser.read(SELF)) {
		// check we're inside a block, otherwise this
		// will cause infinite recursion
		let i = parser.stack.length;
		let legal = false;

		while (i--) {
			const fragment = parser.stack[i];
			if (fragment.type === 'IfBlock' || fragment.type === 'EachBlock') {
				legal = true;
				break;
			}
		}

		if (!legal) {
			parser.error({
				code: `invalid-self-placement`,
				message: `<svelte:self> components can only exist inside if-blocks or each-blocks`
			}, start);
		}

		return 'svelte:self';
	}

	if (parser.read(COMPONENT)) return 'svelte:component';

	const name = parser.read_until(/(\s|\/|>)/);

	if (meta_tags.has(name)) return name;

	if (name.startsWith('svelte:')) {
		const match = fuzzymatch(name.slice(7), valid_meta_tags);

		let message = `Valid <svelte:...> tag names are ${list(valid_meta_tags)}`;
		if (match) message += ` (did you mean '${match}'?)`;

		parser.error({
			code: 'invalid-tag-name',
			message
		}, start);
	}

	if (!valid_tag_name.test(name)) {
		parser.error({
			code: `invalid-tag-name`,
			message: `Expected valid tag name`
		}, start);
	}

	return name;
}

function read_attribute(parser, unique_names) {
	const start = parser.index;

	if (parser.eat('{')) {
		parser.allow_whitespace();

		if (parser.eat('...')) {
			const expression = read_expression(parser);

			parser.allow_whitespace();
			parser.eat('}', true);

			return {
				start,
				end: parser.index,
				type: 'Spread',
				expression
			};
		} else {
			const value_start = parser.index;

			const name = parser.read_identifier();
			parser.allow_whitespace();
			parser.eat('}', true);

			return {
				start,
				end: parser.index,
				type: 'Attribute',
				name,
				value: [{
					start: value_start,
					end: value_start + name.length,
					type: 'AttributeShorthand',
					expression: {
						start: value_start,
						end: value_start + name.length,
						type: 'Identifier',
						name
					}
				}]
			};
		}
	}

	let name = parser.read_until(/[\s=\/>"']/);
	if (!name) return null;

	let end = parser.index;

	parser.allow_whitespace();

	const colon_index = name.indexOf(':');
	const type = colon_index !== -1 && get_directive_type(name.slice(0, colon_index));

	if (unique_names.has(name)) {
		parser.error({
			code: `duplicate-attribute`,
			message: 'Attributes need to be unique'
		}, start);
	}

	if (type !== "EventHandler") {
		unique_names.add(name);
	}

	let value = true;
	if (parser.eat('=')) {
		value = read_attribute_value(parser);
		end = parser.index;
	} else if (parser.match_regex(/["']/)) {
		parser.error({
			code: `unexpected-token`,
			message: `Expected =`
		}, parser.index);
	}

	if (type) {
		const [directive_name, ...modifiers] = name.slice(colon_index + 1).split('|');

		if (type === 'Ref') {
			parser.error({
				code: `invalid-ref-directive`,
				message: `The ref directive is no longer supported — use \`bind:this={${directive_name}}\` instead`
			}, start);
		}

		if (value[0]) {
			if (value.length > 1 || value[0].type === 'Text') {
				parser.error({
					code: `invalid-directive-value`,
					message: `Directive value must be a JavaScript expression enclosed in curly braces`
				}, value[0].start);
			}
		}

		const directive = {
			start,
			end,
			type,
			name: directive_name,
			modifiers,
			expression: (value[0] && value[0].expression) || null
		};

		if (type === 'Transition') {
			const direction = name.slice(0, colon_index);
			directive.intro = direction === 'in' || direction === 'transition';
			directive.outro = direction === 'out' || direction === 'transition';
		}

		if (!directive.expression && (type === 'Binding' || type === 'Class')) {
			directive.expression = {
				start: directive.start + colon_index + 1,
				end: directive.end,
				type: 'Identifier',
				name: directive.name
			};
		}

		return directive;
	}

	return {
		start,
		end,
		type: 'Attribute',
		name,
		value,
	};
}

function get_directive_type(name) {
	if (name === 'use') return 'Action';
	if (name === 'animate') return 'Animation';
	if (name === 'bind') return 'Binding';
	if (name === 'class') return 'Class';
	if (name === 'on') return 'EventHandler';
	if (name === 'let') return 'Let';
	if (name === 'ref') return 'Ref';
	if (name === 'in' || name === 'out' || name === 'transition') return 'Transition';
}

function read_attribute_value(parser) {
	const quote_mark = parser.eat(`'`) ? `'` : parser.eat(`"`) ? `"` : null;

	const regex = (
		quote_mark === `'` ? /'/ :
			quote_mark === `"` ? /"/ :
				/(\/>|[\s"'=<>`])/
	);

	const value = read_sequence(parser, () => !!parser.match_regex(regex));

	if (quote_mark) parser.index += 1;
	return value;
}

function read_sequence(parser, done) {
	let current_chunk = {
		start: parser.index,
		end: null,
		type: 'Text',
		data: '',
	};

	const chunks = [];

	while (parser.index < parser.template.length) {
		const index = parser.index;

		if (done()) {
			current_chunk.end = parser.index;

			if (current_chunk.data) chunks.push(current_chunk);

			chunks.forEach(chunk => {
				if (chunk.type === 'Text')
					chunk.data = decode_character_references(chunk.data);
			});

			return chunks;
		} else if (parser.eat('{')) {
			if (current_chunk.data) {
				current_chunk.end = index;
				chunks.push(current_chunk);
			}

			parser.allow_whitespace();
			const expression = read_expression(parser);
			parser.allow_whitespace();
			parser.eat('}', true);

			chunks.push({
				start: index,
				end: parser.index,
				type: 'MustacheTag',
				expression,
			});

			current_chunk = {
				start: parser.index,
				end: null,
				type: 'Text',
				data: '',
			};
		} else {
			current_chunk.data += parser.template[parser.index++];
		}
	}

	parser.error({
		code: `unexpected-eof`,
		message: `Unexpected end of input`
	});
}

function error_on_assignment_pattern(parser) {
	if (parser.eat('=')) {
		parser.error({
			code: 'invalid-assignment-pattern',
			message: 'Assignment patterns are not supported'
		}, parser.index - 1);
	}
}

function error_on_rest_pattern_not_last(parser) {
	parser.error({
		code: 'rest-pattern-not-last',
		message: 'Rest destructuring expected to be last'
	}, parser.index);
}

function read_context(parser) {
	const context = {
		start: parser.index,
		end: null,
		type: null
	};

	if (parser.eat('[')) {
		context.type = 'ArrayPattern';
		context.elements = [];

		do {
			parser.allow_whitespace();

			const lastContext = context.elements[context.elements.length - 1];
			if (lastContext && lastContext.type === 'RestIdentifier') {
				error_on_rest_pattern_not_last(parser);
			}

			if (parser.template[parser.index] === ',') {
				context.elements.push(null);
			} else {
				context.elements.push(read_context(parser));
				parser.allow_whitespace();
			}
		} while (parser.eat(','));

		error_on_assignment_pattern(parser);
		parser.eat(']', true);
		context.end = parser.index;
	}

	else if (parser.eat('{')) {
		context.type = 'ObjectPattern';
		context.properties = [];

		do {
			parser.allow_whitespace();

			if (parser.eat('...')) {
				parser.allow_whitespace();

				const start = parser.index;
				const name = parser.read_identifier();
				const key = {
					start,
					end: parser.index,
					type: 'Identifier',
					name
				};
				const property = {
					start,
					end: parser.index,
					type: 'Property',
					kind: 'rest',
					shorthand: true,
					key,
					value: key
				};

				context.properties.push(property);

				parser.allow_whitespace();

				if (parser.eat(',')) {
					parser.error({
						code: `comma-after-rest`,
						message: `Comma is not permitted after the rest element`
					}, parser.index - 1);
				}

				break;
			}

			const start = parser.index;
			const name = parser.read_identifier();
			const key = {
				start,
				end: parser.index,
				type: 'Identifier',
				name
			};
			parser.allow_whitespace();

			const value = parser.eat(':')
				? (parser.allow_whitespace(), read_context(parser))
				: key;

			const property = {
				start,
				end: value.end,
				type: 'Property',
				kind: 'init',
				shorthand: value.type === 'Identifier' && value.name === name,
				key,
				value
			};

			context.properties.push(property);

			parser.allow_whitespace();
		} while (parser.eat(','));

		error_on_assignment_pattern(parser);
		parser.eat('}', true);
		context.end = parser.index;
	}

	else if (parser.eat('...')) {
		const name = parser.read_identifier();
		if (name) {
			context.type = 'RestIdentifier';
			context.end = parser.index;
			context.name = name;
		}

		else {
			parser.error({
				code: 'invalid-context',
				message: 'Expected a rest pattern'
			});
		}
	}

	else {
		const name = parser.read_identifier();
		if (name) {
			context.type = 'Identifier';
			context.end = parser.index;
			context.name = name;
		}

		else {
			parser.error({
				code: 'invalid-context',
				message: 'Expected a name, array pattern or object pattern'
			});
		}

		error_on_assignment_pattern(parser);
	}

	return context;
}

const whitespace = /[ \t\r\n]/;

const dimensions = /^(?:offset|client)(?:Width|Height)$/;

function trim_start(str) {
	let i = 0;
	while (whitespace.test(str[i])) i += 1;

	return str.slice(i);
}

function trim_end(str) {
	let i = str.length;
	while (whitespace.test(str[i - 1])) i -= 1;

	return str.slice(0, i);
}

function trim_whitespace(block, trim_before, trim_after) {
	if (!block.children || block.children.length === 0) return; // AwaitBlock

	const first_child = block.children[0];
	const last_child = block.children[block.children.length - 1];

	if (first_child.type === 'Text' && trim_before) {
		first_child.data = trim_start(first_child.data);
		if (!first_child.data) block.children.shift();
	}

	if (last_child.type === 'Text' && trim_after) {
		last_child.data = trim_end(last_child.data);
		if (!last_child.data) block.children.pop();
	}

	if (block.else) {
		trim_whitespace(block.else, trim_before, trim_after);
	}

	if (first_child.elseif) {
		trim_whitespace(first_child, trim_before, trim_after);
	}
}

function mustache(parser) {
	const start = parser.index;
	parser.index += 1;

	parser.allow_whitespace();

	// {/if}, {/each} or {/await}
	if (parser.eat('/')) {
		let block = parser.current();
		let expected;

		if (block.type === 'ElseBlock' || block.type === 'PendingBlock' || block.type === 'ThenBlock' || block.type === 'CatchBlock') {
			block.end = start;
			parser.stack.pop();
			block = parser.current();

			expected = 'await';
		}

		if (block.type === 'IfBlock') {
			expected = 'if';
		} else if (block.type === 'EachBlock') {
			expected = 'each';
		} else if (block.type === 'AwaitBlock') {
			expected = 'await';
		} else {
			parser.error({
				code: `unexpected-block-close`,
				message: `Unexpected block closing tag`
			});
		}

		parser.eat(expected, true);
		parser.allow_whitespace();
		parser.eat('}', true);

		while (block.elseif) {
			block.end = parser.index;
			parser.stack.pop();
			block = parser.current();

			if (block.else) {
				block.else.end = start;
			}
		}

		// strip leading/trailing whitespace as necessary
		const char_before = parser.template[block.start - 1];
		const char_after = parser.template[parser.index];
		const trim_before = !char_before || whitespace.test(char_before);
		const trim_after = !char_after || whitespace.test(char_after);

		trim_whitespace(block, trim_before, trim_after);

		block.end = parser.index;
		parser.stack.pop();
	} else if (parser.eat(':else')) {
		if (parser.eat('if')) {
			parser.error({
				code: 'invalid-elseif',
				message: `'elseif' should be 'else if'`
			});
		}

		parser.allow_whitespace();

		// :else if
		if (parser.eat('if')) {
			const block = parser.current();
			if (block.type !== 'IfBlock')
				parser.error({
					code: `invalid-elseif-placement`,
					message: 'Cannot have an {:else if ...} block outside an {#if ...} block'
				});

			parser.require_whitespace();

			const expression = read_expression(parser);

			parser.allow_whitespace();
			parser.eat('}', true);

			block.else = {
				start: parser.index,
				end: null,
				type: 'ElseBlock',
				children: [
					{
						start: parser.index,
						end: null,
						type: 'IfBlock',
						elseif: true,
						expression,
						children: [],
					},
				],
			};

			parser.stack.push(block.else.children[0]);
		}

		// :else
		else {
			const block = parser.current();
			if (block.type !== 'IfBlock' && block.type !== 'EachBlock') {
				parser.error({
					code: `invalid-else-placement`,
					message: 'Cannot have an {:else} block outside an {#if ...} or {#each ...} block'
				});
			}

			parser.allow_whitespace();
			parser.eat('}', true);

			block.else = {
				start: parser.index,
				end: null,
				type: 'ElseBlock',
				children: [],
			};

			parser.stack.push(block.else);
		}
	} else if (parser.eat(':then')) {
		// TODO DRY out this and the next section
		const pending_block = parser.current();
		if (pending_block.type === 'PendingBlock') {
			pending_block.end = start;
			parser.stack.pop();
			const await_block = parser.current();

			if (!parser.eat('}')) {
				parser.require_whitespace();
				await_block.value = parser.read_identifier();
				parser.allow_whitespace();
				parser.eat('}', true);
			}

			const then_block = {
				start,
				end: null,
				type: 'ThenBlock',
				children: [],
				skip: false
			};

			await_block.then = then_block;
			parser.stack.push(then_block);
		}
	} else if (parser.eat(':catch')) {
		const then_block = parser.current();
		if (then_block.type === 'ThenBlock') {
			then_block.end = start;
			parser.stack.pop();
			const await_block = parser.current();

			if (!parser.eat('}')) {
				parser.require_whitespace();
				await_block.error = parser.read_identifier();
				parser.allow_whitespace();
				parser.eat('}', true);
			}

			const catch_block = {
				start,
				end: null,
				type: 'CatchBlock',
				children: [],
				skip: false
			};

			await_block.catch = catch_block;
			parser.stack.push(catch_block);
		}
	} else if (parser.eat('#')) {
		// {#if foo}, {#each foo} or {#await foo}
		let type;

		if (parser.eat('if')) {
			type = 'IfBlock';
		} else if (parser.eat('each')) {
			type = 'EachBlock';
		} else if (parser.eat('await')) {
			type = 'AwaitBlock';
		} else {
			parser.error({
				code: `expected-block-type`,
				message: `Expected if, each or await`
			});
		}

		parser.require_whitespace();

		const expression = read_expression(parser);

		const block = type === 'AwaitBlock' ?
			{
				start,
				end: null,
				type,
				expression,
				value: null,
				error: null,
				pending: {
					start: null,
					end: null,
					type: 'PendingBlock',
					children: [],
					skip: true
				},
				then: {
					start: null,
					end: null,
					type: 'ThenBlock',
					children: [],
					skip: true
				},
				catch: {
					start: null,
					end: null,
					type: 'CatchBlock',
					children: [],
					skip: true
				},
			} :
			{
				start,
				end: null,
				type,
				expression,
				children: [],
			};

		parser.allow_whitespace();

		// {#each} blocks must declare a context – {#each list as item}
		if (type === 'EachBlock') {
			parser.eat('as', true);
			parser.require_whitespace();

			block.context = read_context(parser);

			parser.allow_whitespace();

			if (parser.eat(',')) {
				parser.allow_whitespace();
				block.index = parser.read_identifier();
				if (!block.index) parser.error({
					code: `expected-name`,
					message: `Expected name`
				});

				parser.allow_whitespace();
			}

			if (parser.eat('(')) {
				parser.allow_whitespace();

				block.key = read_expression(parser);
				parser.allow_whitespace();
				parser.eat(')', true);
				parser.allow_whitespace();
			}
		}

		let await_block_shorthand = type === 'AwaitBlock' && parser.eat('then');
		if (await_block_shorthand) {
			parser.require_whitespace();
			block.value = parser.read_identifier();
			parser.allow_whitespace();
		}

		parser.eat('}', true);

		parser.current().children.push(block);
		parser.stack.push(block);

		if (type === 'AwaitBlock') {
			let child_block;
			if (await_block_shorthand) {
				block.then.skip = false;
				child_block = block.then;
			} else {
				block.pending.skip = false;
				child_block = block.pending;
			}

			child_block.start = parser.index;
			parser.stack.push(child_block);
		}
	} else if (parser.eat('@html')) {
		// {@html content} tag
		parser.require_whitespace();

		const expression = read_expression(parser);

		parser.allow_whitespace();
		parser.eat('}', true);

		parser.current().children.push({
			start,
			end: parser.index,
			type: 'RawMustacheTag',
			expression,
		});
	} else if (parser.eat('@debug')) {
		let identifiers;

		// Implies {@debug} which indicates "debug all"
		if (parser.read(/\s*}/)) {
			identifiers = [];
		} else {
			const expression = read_expression(parser);

			identifiers = expression.type === 'SequenceExpression'
				? expression.expressions
				: [expression];

			identifiers.forEach(node => {
				if (node.type !== 'Identifier') {
					parser.error({
						code: 'invalid-debug-args',
						message: '{@debug ...} arguments must be identifiers, not arbitrary expressions'
					}, node.start);
				}
			});

			parser.allow_whitespace();
			parser.eat('}', true);
		}

		parser.current().children.push({
			start,
			end: parser.index,
			type: 'DebugTag',
			identifiers
		});
	} else {
		const expression = read_expression(parser);

		parser.allow_whitespace();
		parser.eat('}', true);

		parser.current().children.push({
			start,
			end: parser.index,
			type: 'MustacheTag',
			expression,
		});
	}
}

function text$1(parser) {
	const start = parser.index;

	let data = '';

	while (
		parser.index < parser.template.length &&
		!parser.match('<') &&
		!parser.match('{')
	) {
		data += parser.template[parser.index++];
	}

	parser.current().children.push({
		start,
		end: parser.index,
		type: 'Text',
		data: decode_character_references(data),
	});
}

function fragment(parser) {
	if (parser.match('<')) {
		return tag;
	}

	if (parser.match('{')) {
		return mustache;
	}

	return text$1;
}

function getLocator(source, options) {
    if (options === void 0) { options = {}; }
    var offsetLine = options.offsetLine || 0;
    var offsetColumn = options.offsetColumn || 0;
    var originalLines = source.split('\n');
    var start = 0;
    var lineRanges = originalLines.map(function (line, i) {
        var end = start + line.length + 1;
        var range = { start: start, end: end, line: i };
        start = end;
        return range;
    });
    var i = 0;
    function rangeContains(range, index) {
        return range.start <= index && index < range.end;
    }
    function getLocation(range, index) {
        return { line: offsetLine + range.line, column: offsetColumn + index - range.start, character: index };
    }
    function locate(search, startIndex) {
        if (typeof search === 'string') {
            search = source.indexOf(search, startIndex || 0);
        }
        var range = lineRanges[i];
        var d = search >= range.end ? 1 : -1;
        while (range) {
            if (rangeContains(range, search))
                return getLocation(range, search);
            i += d;
            range = lineRanges[i];
        }
    }
    return locate;
}
function locate(source, search, options) {
    if (typeof options === 'number') {
        throw new Error('locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument');
    }
    return getLocator(source, options)(search, options && options.startIndex);
}

function tabs_to_spaces(str) {
	return str.replace(/^\t+/, match => match.split('\t').join('  '));
}

function get_code_frame(
	source,
	line,
	column
) {
	const lines = source.split('\n');

	const frame_start = Math.max(0, line - 2);
	const frame_end = Math.min(line + 3, lines.length);

	const digits = String(frame_end + 1).length;

	return lines
		.slice(frame_start, frame_end)
		.map((str, i) => {
			const isErrorLine = frame_start + i === line;

			let line_num = String(i + frame_start + 1);
			while (line_num.length < digits) line_num = ` ${line_num}`;

			if (isErrorLine) {
				const indicator =
					repeat(' ', digits + 2 + tabs_to_spaces(str.slice(0, column)).length) + '^';
				return `${line_num}: ${tabs_to_spaces(str)}\n${indicator}`;
			}

			return `${line_num}: ${tabs_to_spaces(str)}`;
		})
		.join('\n');
}

class CompileError extends Error {
	
	
	
	
	
	

	toString() {
		return `${this.message} (${this.start.line}:${this.start.column})\n${this.frame}`;
	}
}

function error(message, props






) {
	const error = new CompileError(message);
	error.name = props.name;

	const start = locate(props.source, props.start, { offsetLine: 1 });
	const end = locate(props.source, props.end || props.start, { offsetLine: 1 });

	error.code = props.code;
	error.start = start;
	error.end = end;
	error.pos = props.start;
	error.filename = props.filename;

	error.frame = get_code_frame(props.source, start.line - 1, start.column);

	throw error;
}

class Parser$1 {
	
	
	

	__init() {this.index = 0;}
	__init2() {this.stack = [];}

	
	__init3() {this.css = [];}
	__init4() {this.js = [];}
	__init5() {this.meta_tags = {};}

	constructor(template, options) {Parser$1.prototype.__init.call(this);Parser$1.prototype.__init2.call(this);Parser$1.prototype.__init3.call(this);Parser$1.prototype.__init4.call(this);Parser$1.prototype.__init5.call(this);
		if (typeof template !== 'string') {
			throw new TypeError('Template must be a string');
		}

		this.template = template.replace(/\s+$/, '');
		this.filename = options.filename;
		this.customElement = options.customElement;

		this.html = {
			start: null,
			end: null,
			type: 'Fragment',
			children: [],
		};

		this.stack.push(this.html);

		let state = fragment;

		while (this.index < this.template.length) {
			state = state(this) || fragment;
		}

		if (this.stack.length > 1) {
			const current = this.current();

			const type = current.type === 'Element' ? `<${current.name}>` : 'Block';
			const slug = current.type === 'Element' ? 'element' : 'block';

			this.error({
				code: `unclosed-${slug}`,
				message: `${type} was left open`
			}, current.start);
		}

		if (state !== fragment) {
			this.error({
				code: `unexpected-eof`,
				message: 'Unexpected end of input'
			});
		}

		if (this.html.children.length) {
			let start = this.html.children[0] && this.html.children[0].start;
			while (/\s/.test(template[start])) start += 1;

			let end = this.html.children[this.html.children.length - 1] && this.html.children[this.html.children.length - 1].end;
			while (/\s/.test(template[end - 1])) end -= 1;

			this.html.start = start;
			this.html.end = end;
		} else {
			this.html.start = this.html.end = null;
		}
	}

	current() {
		return this.stack[this.stack.length - 1];
	}

	acorn_error(err) {
		this.error({
			code: `parse-error`,
			message: err.message.replace(/ \(\d+:\d+\)$/, '')
		}, err.pos);
	}

	error({ code, message }, index = this.index) {
		error(message, {
			name: 'ParseError',
			code,
			source: this.template,
			start: index,
			filename: this.filename
		});
	}

	eat(str, required, message) {
		if (this.match(str)) {
			this.index += str.length;
			return true;
		}

		if (required) {
			this.error({
				code: `unexpected-${this.index === this.template.length ? 'eof' : 'token'}`,
				message: message || `Expected ${str}`
			});
		}

		return false;
	}

	match(str) {
		return this.template.slice(this.index, this.index + str.length) === str;
	}

	match_regex(pattern) {
		const match = pattern.exec(this.template.slice(this.index));
		if (!match || match.index !== 0) return null;

		return match[0];
	}

	allow_whitespace() {
		while (
			this.index < this.template.length &&
			whitespace.test(this.template[this.index])
		) {
			this.index++;
		}
	}

	read(pattern) {
		const result = this.match_regex(pattern);
		if (result) this.index += result.length;
		return result;
	}

	read_identifier() {
		const start = this.index;

		let i = this.index;

		const code = full_char_code_at(this.template, i);
		if (!acorn.isIdentifierStart(code, true)) return null;

		i += code <= 0xffff ? 1 : 2;

		while (i < this.template.length) {
			const code = full_char_code_at(this.template, i);

			if (!acorn.isIdentifierChar(code, true)) break;
			i += code <= 0xffff ? 1 : 2;
		}

		const identifier = this.template.slice(this.index, this.index = i);

		if (reserved.has(identifier)) {
			this.error({
				code: `unexpected-reserved-word`,
				message: `'${identifier}' is a reserved word in JavaScript and cannot be used here`
			}, start);
		}

		return identifier;
	}

	read_until(pattern) {
		if (this.index >= this.template.length)
			this.error({
				code: `unexpected-eof`,
				message: 'Unexpected end of input'
			});

		const start = this.index;
		const match = pattern.exec(this.template.slice(start));

		if (match) {
			this.index = start + match.index;
			return this.template.slice(start, this.index);
		}

		this.index = this.template.length;
		return this.template.slice(start);
	}

	require_whitespace() {
		if (!whitespace.test(this.template[this.index])) {
			this.error({
				code: `missing-whitespace`,
				message: `Expected whitespace`
			});
		}

		this.allow_whitespace();
	}
}

function parse$2(
	template,
	options = {}
) {
	const parser = new Parser$1(template, options);

	// TODO we way want to allow multiple <style> tags —
	// one scoped, one global. for now, only allow one
	if (parser.css.length > 1) {
		parser.error({
			code: 'duplicate-style',
			message: 'You can only have one top-level <style> tag per component'
		}, parser.css[1].start);
	}

	const instance_scripts = parser.js.filter(script => script.context === 'default');
	const module_scripts = parser.js.filter(script => script.context === 'module');

	if (instance_scripts.length > 1) {
		parser.error({
			code: `invalid-script`,
			message: `A component can only have one instance-level <script> element`
		}, instance_scripts[1].start);
	}

	if (module_scripts.length > 1) {
		parser.error({
			code: `invalid-script`,
			message: `A component can only have one <script context="module"> element`
		}, module_scripts[1].start);
	}

	return {
		html: parser.html,
		css: parser.css[0],
		instance: instance_scripts[0],
		module: module_scripts[0]
	};
}

const start = /\n(\t+)/;

function deindent(
	strings,
	...values
) {
	const indentation = start.exec(strings[0])[1];
	const pattern = new RegExp(`^${indentation}`, 'gm');

	let result = strings[0].replace(start, '').replace(pattern, '');

	let current_indentation = get_current_indentation(result);

	for (let i = 1; i < strings.length; i += 1) {
		let expression = values[i - 1];
		const string = strings[i].replace(pattern, '');

		if (Array.isArray(expression)) {
			expression = expression.length ? expression.join('\n') : null;
		}

		// discard empty codebuilders
		if (expression && expression.is_empty && expression.is_empty()) {
			expression = null;
		}

		if (expression || expression === '') {
			const value = String(expression).replace(
				/\n/g,
				`\n${current_indentation}`
			);
			result += value + string;
		} else {
			let c = result.length;
			while (/\s/.test(result[c - 1])) c -= 1;
			result = result.slice(0, c) + string;
		}

		current_indentation = get_current_indentation(result);
	}

	return result.trim().replace(/\t+$/gm, '').replace(/{\n\n/gm, '{\n');
}

function get_current_indentation(str) {
	let a = str.length;
	while (a > 0 && str[a - 1] !== '\n') a -= 1;

	let b = a;
	while (b < str.length && /\s/.test(str[b])) b += 1;

	return str.slice(a, b);
}

function stringify(data, options = {}) {
	return JSON.stringify(escape$1(data, options));
}

function escape$1(data, { only_escape_at_symbol = false } = {}) {
	return data.replace(only_escape_at_symbol ? /@+/g : /(@+|#+)/g, (match) => {
		return match + match[0];
	});
}

const escaped$1 = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
};

function escape_html(html) {
	return String(html).replace(/[&<>]/g, match => escaped$1[match]);
}

function escape_template(str) {
	return str.replace(/(\${|`|\\)/g, '\\$1');
}

const whitespace$1 = /^\s+$/;
















class CodeBuilder {
	__init() {this.root = { type: 'root', children: [], parent: null };}
	
	

	constructor(str = '') {CodeBuilder.prototype.__init.call(this);
		this.current = this.last = this.root;
		this.add_line(str);
	}

	add_conditional(condition, body) {
		if (this.last.type === 'condition' && this.last.condition === condition) {
			if (body && !whitespace$1.test(body)) this.last.children.push({ type: 'line', line: body });
		} else {
			const next = this.last = { type: 'condition', condition, parent: this.current, children: [] };
			this.current.children.push(next);
			if (body && !whitespace$1.test(body)) next.children.push({ type: 'line', line: body });
		}
	}

	add_line(line) {
		if (line && !whitespace$1.test(line)) this.current.children.push(this.last = { type: 'line', line });
	}

	add_block(block) {
		if (block && !whitespace$1.test(block)) this.current.children.push(this.last = { type: 'line', line: block, block: true });
	}

	is_empty() { return !find_line(this.root); }

	push_condition(condition) {
		if (this.last.type === 'condition' && this.last.condition === condition) {
			this.current = this.last ;
		} else {
			const next = this.last = { type: 'condition', condition, parent: this.current, children: [] };
			this.current.children.push(next);
			this.current = next;
		}
	}

	pop_condition() {
		if (!this.current.parent) throw new Error(`Popping a condition that maybe wasn't pushed.`);
		this.current = this.current.parent;
	}

	toString() {
		return chunk_to_string(this.root);
	}
}

function find_line(chunk) {
	for (const c of chunk.children) {
		if (c.type === 'line' || find_line(c )) return true;
	}
	return false;
}

function chunk_to_string(chunk, level = 0, last_block, first) {
	if (chunk.type === 'line') {
		return `${last_block || (!first && chunk.block) ? '\n' : ''}${chunk.line.replace(/^/gm, repeat('\t', level))}`;
	} else if (chunk.type === 'condition') {
		let t = false;
		const lines = chunk.children.map((c, i) => {
			const str = chunk_to_string(c, level + 1, t, i === 0);
			t = c.type !== 'line' || c.block;
			return str;
		}).filter(l => !!l);

		if (!lines.length) return '';

		return `${last_block || (!first) ? '\n' : ''}${repeat('\t', level)}if (${chunk.condition}) {\n${lines.join('\n')}\n${repeat('\t', level)}}`;
	} else if (chunk.type === 'root') {
		let t = false;
		const lines = chunk.children.map((c, i) => {
			const str = chunk_to_string(c, 0, t, i === 0);
			t = c.type !== 'line' || c.block;
			return str;
		}).filter(l => !!l);

		if (!lines.length) return '';

		return lines.join('\n');
	}
}

class Block {
	
	
	
	

	

	
	

	

	

	














	__init() {this.event_listeners = [];}

	
	
	
	
	 // could have the method without the transition, due to siblings
	
	

	
	
	

	__init2() {this.has_update_method = false;}
	

	constructor(options) {Block.prototype.__init.call(this);Block.prototype.__init2.call(this);
		this.parent = options.parent;
		this.renderer = options.renderer;
		this.name = options.name;
		this.comment = options.comment;

		this.wrappers = [];

		// for keyed each blocks
		this.key = options.key;
		this.first = null;

		this.dependencies = new Set();

		this.bindings = options.bindings;

		this.builders = {
			init: new CodeBuilder(),
			create: new CodeBuilder(),
			claim: new CodeBuilder(),
			hydrate: new CodeBuilder(),
			mount: new CodeBuilder(),
			measure: new CodeBuilder(),
			fix: new CodeBuilder(),
			animate: new CodeBuilder(),
			intro: new CodeBuilder(),
			update: new CodeBuilder(),
			outro: new CodeBuilder(),
			destroy: new CodeBuilder(),
		};

		this.has_animation = false;
		this.has_intro_method = false; // a block could have an intro method but not intro transitions, e.g. if a sibling block has intros
		this.has_outro_method = false;
		this.outros = 0;

		this.get_unique_name = this.renderer.component.get_unique_name_maker();
		this.variables = new Map();

		this.aliases = new Map().set('ctx', this.get_unique_name('ctx'));
		if (this.key) this.aliases.set('key', this.get_unique_name('key'));
	}

	assign_variable_names() {
		const seen = new Set();
		const dupes = new Set();

		let i = this.wrappers.length;

		while (i--) {
			const wrapper = this.wrappers[i];

			if (!wrapper.var) continue;
			if (wrapper.parent && wrapper.parent.can_use_innerhtml) continue;

			if (seen.has(wrapper.var)) {
				dupes.add(wrapper.var);
			}

			seen.add(wrapper.var);
		}

		const counts = new Map();
		i = this.wrappers.length;

		while (i--) {
			const wrapper = this.wrappers[i];

			if (!wrapper.var) continue;

			if (dupes.has(wrapper.var)) {
				const i = counts.get(wrapper.var) || 0;
				counts.set(wrapper.var, i + 1);
				wrapper.var = this.get_unique_name(wrapper.var + i);
			} else {
				wrapper.var = this.get_unique_name(wrapper.var);
			}
		}
	}

	add_dependencies(dependencies) {
		dependencies.forEach(dependency => {
			this.dependencies.add(dependency);
		});

		this.has_update_method = true;
	}

	add_element(
		name,
		render_statement,
		claim_statement,
		parent_node,
		no_detach
	) {
		this.add_variable(name);
		this.builders.create.add_line(`${name} = ${render_statement};`);

		if (this.renderer.options.hydratable) {
			this.builders.claim.add_line(`${name} = ${claim_statement || render_statement};`);
		}

		if (parent_node) {
			this.builders.mount.add_line(`@append(${parent_node}, ${name});`);
			if (parent_node === 'document.head') this.builders.destroy.add_line(`@detach(${name});`);
		} else {
			this.builders.mount.add_line(`@insert(#target, ${name}, anchor);`);
			if (!no_detach) this.builders.destroy.add_conditional('detaching', `@detach(${name});`);
		}
	}

	add_intro(local) {
		this.has_intros = this.has_intro_method = true;
		if (!local && this.parent) this.parent.add_intro();
	}

	add_outro(local) {
		this.has_outros = this.has_outro_method = true;
		this.outros += 1;
		if (!local && this.parent) this.parent.add_outro();
	}

	add_animation() {
		this.has_animation = true;
	}

	add_variable(name, init) {
		if (name[0] === '#') {
			name = this.alias(name.slice(1));
		}

		if (this.variables.has(name) && this.variables.get(name) !== init) {
			throw new Error(
				`Variable '${name}' already initialised with a different value`
			);
		}

		this.variables.set(name, init);
	}

	alias(name) {
		if (!this.aliases.has(name)) {
			this.aliases.set(name, this.get_unique_name(name));
		}

		return this.aliases.get(name);
	}

	child(options) {
		return new Block(Object.assign({}, this, { key: null }, options, { parent: this }));
	}

	get_contents(local_key) {
		const { dev } = this.renderer.options;

		if (this.has_outros) {
			this.add_variable('#current');

			if (!this.builders.intro.is_empty()) {
				this.builders.intro.add_line(`#current = true;`);
				this.builders.mount.add_line(`#current = true;`);
			}

			if (!this.builders.outro.is_empty()) {
				this.builders.outro.add_line(`#current = false;`);
			}
		}

		if (this.autofocus) {
			this.builders.mount.add_line(`${this.autofocus}.focus();`);
		}

		this.render_listeners();

		const properties = new CodeBuilder();

		const method_name = (short, long) => dev ? `${short}: function ${this.get_unique_name(long)}` : short;

		if (local_key) {
			properties.add_block(`key: ${local_key},`);
		}

		if (this.first) {
			properties.add_block(`first: null,`);
			this.builders.hydrate.add_line(`this.first = ${this.first};`);
		}

		if (this.builders.create.is_empty() && this.builders.hydrate.is_empty()) {
			properties.add_line(`c: @noop,`);
		} else {
			const hydrate = !this.builders.hydrate.is_empty() && (
				this.renderer.options.hydratable
					? `this.h()`
					: this.builders.hydrate
			);

			properties.add_block(deindent`
				${method_name('c', 'create')}() {
					${this.builders.create}
					${hydrate}
				},
			`);
		}

		if (this.renderer.options.hydratable || !this.builders.claim.is_empty()) {
			if (this.builders.claim.is_empty() && this.builders.hydrate.is_empty()) {
				properties.add_line(`l: @noop,`);
			} else {
				properties.add_block(deindent`
					${method_name('l', 'claim')}(nodes) {
						${this.builders.claim}
						${this.renderer.options.hydratable && !this.builders.hydrate.is_empty() && `this.h();`}
					},
				`);
			}
		}

		if (this.renderer.options.hydratable && !this.builders.hydrate.is_empty()) {
			properties.add_block(deindent`
				${method_name('h', 'hydrate')}() {
					${this.builders.hydrate}
				},
			`);
		}

		if (this.builders.mount.is_empty()) {
			properties.add_line(`m: @noop,`);
		} else {
			properties.add_block(deindent`
				${method_name('m', 'mount')}(#target, anchor) {
					${this.builders.mount}
				},
			`);
		}

		if (this.has_update_method || this.maintain_context) {
			if (this.builders.update.is_empty() && !this.maintain_context) {
				properties.add_line(`p: @noop,`);
			} else {
				properties.add_block(deindent`
					${method_name('p', 'update')}(changed, ${this.maintain_context ? 'new_ctx' : 'ctx'}) {
						${this.maintain_context && `ctx = new_ctx;`}
						${this.builders.update}
					},
				`);
			}
		}

		if (this.has_animation) {
			properties.add_block(deindent`
				${method_name('r', 'measure')}() {
					${this.builders.measure}
				},

				${method_name('f', 'fix')}() {
					${this.builders.fix}
				},

				${method_name('a', 'animate')}() {
					${this.builders.animate}
				},
			`);
		}

		if (this.has_intro_method || this.has_outro_method) {
			if (this.builders.intro.is_empty()) {
				properties.add_line(`i: @noop,`);
			} else {
				properties.add_block(deindent`
					${method_name('i', 'intro')}(#local) {
						${this.has_outros && `if (#current) return;`}
						${this.builders.intro}
					},
				`);
			}

			if (this.builders.outro.is_empty()) {
				properties.add_line(`o: @noop,`);
			} else {
				properties.add_block(deindent`
					${method_name('o', 'outro')}(#local) {
						${this.builders.outro}
					},
				`);
			}
		}

		if (this.builders.destroy.is_empty()) {
			properties.add_line(`d: @noop`);
		} else {
			properties.add_block(deindent`
				${method_name('d', 'destroy')}(detaching) {
					${this.builders.destroy}
				}
			`);
		}

		return deindent`
			${this.variables.size > 0 &&
				`var ${Array.from(this.variables.keys())
					.map(key => {
						const init = this.variables.get(key);
						return init !== undefined ? `${key} = ${init}` : key;
					})
					.join(', ')};`}

			${!this.builders.init.is_empty() && this.builders.init}

			return {
				${properties}
			};
		`.replace(/(#+)(\w*)/g, (match, sigil, name) => {
			return sigil === '#' ? this.alias(name) : sigil.slice(1) + name;
		});
	}

	render_listeners(chunk = '') {
		if (this.event_listeners.length > 0) {
			this.add_variable(`#dispose${chunk}`);

			if (this.event_listeners.length === 1) {
				this.builders.hydrate.add_line(
					`#dispose${chunk} = ${this.event_listeners[0]};`
				);

				this.builders.destroy.add_line(
					`#dispose${chunk}();`
				);
			} else {
				this.builders.hydrate.add_block(deindent`
					#dispose${chunk} = [
						${this.event_listeners.join(',\n')}
					];
				`);

				this.builders.destroy.add_line(
					`@run_all(#dispose${chunk});`
				);
			}
		}
	}

	toString() {
		const local_key = this.key && this.get_unique_name('key');

		return deindent`
			${this.comment && `// ${this.comment}`}
			function ${this.name}(${this.key ? `${local_key}, ` : ''}ctx) {
				${this.get_contents(local_key)}
			}
		`;
	}
}

class Wrapper {
	
	
	

	
	

	
	

	constructor(
		renderer,
		block,
		parent,
		node
	) {
		this.node = node;

		// make these non-enumerable so that they can be logged sensibly
		// (TODO in dev only?)
		Object.defineProperties(this, {
			renderer: {
				value: renderer
			},
			parent: {
				value: parent
			}
		});

		this.can_use_innerhtml = !renderer.options.hydratable;

		block.wrappers.push(this);
	}

	cannot_use_innerhtml() {
		this.can_use_innerhtml = false;
		if (this.parent) this.parent.cannot_use_innerhtml();
	}

	get_or_create_anchor(block, parent_node, parent_nodes) {
		// TODO use this in EachBlock and IfBlock — tricky because
		// children need to be created first
		const needs_anchor = this.next ? !this.next.is_dom_node() : !parent_node || !this.parent.is_dom_node();
		const anchor = needs_anchor
			? block.get_unique_name(`${this.var}_anchor`)
			: (this.next && this.next.var) || 'null';

		if (needs_anchor) {
			block.add_element(
				anchor,
				`@empty()`,
				parent_nodes && `@empty()`,
				parent_node
			);
		}

		return anchor;
	}

	get_update_mount_node(anchor) {
		return (this.parent && this.parent.is_dom_node())
			? this.parent.var
			: `${anchor}.parentNode`;
	}

	is_dom_node() {
		return (
			this.node.type === 'Element' ||
			this.node.type === 'Text' ||
			this.node.type === 'MustacheTag'
		);
	}
}

function create_debugging_comment(
	node,
	component
) {
	const { locate, source } = component;

	let c = node.start;
	if (node.type === 'ElseBlock') {
		while (source[c - 1] !== '{') c -= 1;
		while (source[c - 1] === '{') c -= 1;
	}

	let d;

	if (node.type === 'InlineComponent' || node.type === 'Element') {
		d = node.children.length ? node.children[0].start : node.start;
		while (source[d - 1] !== '>') d -= 1;
	} else {
		d = node.expression ? node.expression.node.end : c;
		while (source[d] !== '}') d += 1;
		while (source[d] === '}') d += 1;
	}

	const start = locate(c);
	const loc = `(${start.line + 1}:${start.column})`;

	return `${loc} ${source.slice(c, d)}`.replace(/\s/g, ' ');
}

class AwaitBlockBranch extends Wrapper {
	
	
	
	

	__init() {this.var = null;}

	constructor(
		status,
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);AwaitBlockBranch.prototype.__init.call(this);
		this.block = block.child({
			comment: create_debugging_comment(node, this.renderer.component),
			name: this.renderer.component.get_unique_name(`create_${status}_block`)
		});

		this.fragment = new FragmentWrapper(
			renderer,
			this.block,
			this.node.children,
			parent,
			strip_whitespace,
			next_sibling
		);

		this.is_dynamic = this.block.dependencies.size > 0;
	}
}

class AwaitBlockWrapper extends Wrapper {
	

	
	
	

	__init2() {this.var = 'await_block';}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);AwaitBlockWrapper.prototype.__init2.call(this);
		this.cannot_use_innerhtml();

		block.add_dependencies(this.node.expression.dependencies);

		let is_dynamic = false;
		let has_intros = false;
		let has_outros = false;

		['pending', 'then', 'catch'].forEach(status => {
			const child = this.node[status];

			const branch = new AwaitBlockBranch(
				status,
				renderer,
				block,
				this,
				child,
				strip_whitespace,
				next_sibling
			);

			renderer.blocks.push(branch.block);

			if (branch.is_dynamic) {
				is_dynamic = true;
				// TODO should blocks update their own parents?
				block.add_dependencies(branch.block.dependencies);
			}

			if (branch.block.has_intros) has_intros = true;
			if (branch.block.has_outros) has_outros = true;

			this[status] = branch;
		});

		this.pending.block.has_update_method = is_dynamic;
		this.then.block.has_update_method = is_dynamic;
		this.catch.block.has_update_method = is_dynamic;

		this.pending.block.has_intro_method = has_intros;
		this.then.block.has_intro_method = has_intros;
		this.catch.block.has_intro_method = has_intros;

		this.pending.block.has_outro_method = has_outros;
		this.then.block.has_outro_method = has_outros;
		this.catch.block.has_outro_method = has_outros;

		if (has_outros) {
			block.add_outro();
		}
	}

	render(
		block,
		parent_node,
		parent_nodes
	) {
		const anchor = this.get_or_create_anchor(block, parent_node, parent_nodes);
		const update_mount_node = this.get_update_mount_node(anchor);

		const snippet = this.node.expression.render(block);

		const info = block.get_unique_name(`info`);
		const promise = block.get_unique_name(`promise`);

		block.add_variable(promise);

		block.maintain_context = true;

		const info_props = [
			'ctx',
			'current: null',
			this.pending.block.name && `pending: ${this.pending.block.name}`,
			this.then.block.name && `then: ${this.then.block.name}`,
			this.catch.block.name && `catch: ${this.catch.block.name}`,
			this.then.block.name && `value: '${this.node.value}'`,
			this.catch.block.name && `error: '${this.node.error}'`,
			this.pending.block.has_outro_method && `blocks: Array(3)`
		].filter(Boolean);

		block.builders.init.add_block(deindent`
			let ${info} = {
				${info_props.join(',\n')}
			};
		`);

		block.builders.init.add_block(deindent`
			@handle_promise(${promise} = ${snippet}, ${info});
		`);

		block.builders.create.add_block(deindent`
			${info}.block.c();
		`);

		if (parent_nodes && this.renderer.options.hydratable) {
			block.builders.claim.add_block(deindent`
				${info}.block.l(${parent_nodes});
			`);
		}

		const initial_mount_node = parent_node || '#target';
		const anchor_node = parent_node ? 'null' : 'anchor';

		const has_transitions = this.pending.block.has_intro_method || this.pending.block.has_outro_method;

		block.builders.mount.add_block(deindent`
			${info}.block.m(${initial_mount_node}, ${info}.anchor = ${anchor_node});
			${info}.mount = () => ${update_mount_node};
			${info}.anchor = ${anchor};
		`);

		if (has_transitions) {
			block.builders.intro.add_line(`${info}.block.i();`);
		}

		const conditions = [];
		const dependencies = this.node.expression.dynamic_dependencies();

		if (dependencies.length > 0) {
			conditions.push(
				`(${dependencies.map(dep => `'${dep}' in changed`).join(' || ')})`
			);
		}

		conditions.push(
			`${promise} !== (${promise} = ${snippet})`,
			`@handle_promise(${promise}, ${info})`
		);

		block.builders.update.add_line(
			`${info}.ctx = ctx;`
		);

		if (this.pending.block.has_update_method) {
			block.builders.update.add_block(deindent`
				if (${conditions.join(' && ')}) {
					// nothing
				} else {
					${info}.block.p(changed, @assign(@assign({}, ctx), ${info}.resolved));
				}
			`);
		} else {
			block.builders.update.add_block(deindent`
				${conditions.join(' && ')}
			`);
		}

		if (this.pending.block.has_outro_method) {
			block.builders.outro.add_block(deindent`
				for (let #i = 0; #i < 3; #i += 1) {
					const block = ${info}.blocks[#i];
					if (block) block.o();
				}
			`);
		}

		block.builders.destroy.add_block(deindent`
			${info}.block.d(${parent_node ? '' : 'detaching'});
			${info} = null;
		`);

		[this.pending, this.then, this.catch].forEach(branch => {
			branch.fragment.render(branch.block, null, 'nodes');
		});
	}
}

class BodyWrapper extends Wrapper {
	

	render(block, parent_node, parent_nodes) {
		this.node.handlers.forEach(handler => {
			const snippet = handler.render(block);

			block.builders.init.add_block(deindent`
				document.body.addEventListener("${handler.name}", ${snippet});
			`);

			block.builders.destroy.add_block(deindent`
				document.body.removeEventListener("${handler.name}", ${snippet});
			`);
		});
	}
}

function add_to_set(a, b) {
	b.forEach(item => {
		a.add(item);
	});
}

class DebugTagWrapper extends Wrapper {
	

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);
	}

	render(block, parent_node, parent_nodes) {
		const { renderer } = this;
		const { component } = renderer;

		if (!renderer.options.dev) return;

		const { code, var_lookup } = component;

		if (this.node.expressions.length === 0) {
			// Debug all
			code.overwrite(this.node.start + 1, this.node.start + 7, 'debugger', {
				storeName: true
			});
			const statement = `[✂${this.node.start + 1}-${this.node.start + 7}✂];`;

			block.builders.create.add_line(statement);
			block.builders.update.add_line(statement);
		} else {
			const { code } = component;
			code.overwrite(this.node.start + 1, this.node.start + 7, 'log', {
				storeName: true
			});
			const log = `[✂${this.node.start + 1}-${this.node.start + 7}✂]`;

			const dependencies = new Set();
			this.node.expressions.forEach(expression => {
				add_to_set(dependencies, expression.dependencies);
			});

			const condition = Array.from(dependencies).map(d => `changed.${d}`).join(' || ');

			const ctx_identifiers = this.node.expressions
				.filter(e => {
					const looked_up_var = var_lookup.get(e.node.name);
					return !(looked_up_var && looked_up_var.hoistable);
				})
				.map(e => e.node.name)
				.join(', ');
			const logged_identifiers = this.node.expressions.map(e => e.node.name).join(', ');

			block.builders.update.add_block(deindent`
				if (${condition}) {
					const { ${ctx_identifiers} } = ctx;
					console.${log}({ ${logged_identifiers} });
					debugger;
				}
			`);

			block.builders.create.add_block(deindent`
				{
					const { ${ctx_identifiers} } = ctx;
					console.${log}({ ${logged_identifiers} });
					debugger;
				}
			`);
		}
	}
}

function new_tail() {
	return '%%tail_head%%';
}

function attach_head(head, tail) {
	return tail.replace('%%tail_head%%', head);
}

class ElseBlockWrapper extends Wrapper {
	
	
	
	

	__init() {this.var = null;}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);ElseBlockWrapper.prototype.__init.call(this);
		this.block = block.child({
			comment: create_debugging_comment(node, this.renderer.component),
			name: this.renderer.component.get_unique_name(`create_else_block`)
		});

		this.fragment = new FragmentWrapper(
			renderer,
			this.block,
			this.node.children,
			parent,
			strip_whitespace,
			next_sibling
		);

		this.is_dynamic = this.block.dependencies.size > 0;
	}
}

class EachBlockWrapper extends Wrapper {
	
	
	
	
	











	
	

	__init2() {this.var = 'each';}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);EachBlockWrapper.prototype.__init2.call(this);		this.cannot_use_innerhtml();

		const { dependencies } = node.expression;
		block.add_dependencies(dependencies);

		this.block = block.child({
			comment: create_debugging_comment(this.node, this.renderer.component),
			name: renderer.component.get_unique_name('create_each_block'),
			key: node.key ,

			bindings: new Map(block.bindings)
		});

		// TODO this seems messy
		this.block.has_animation = this.node.has_animation;

		this.index_name = this.node.index || renderer.component.get_unique_name(`${this.node.context}_index`);

		const fixed_length =
			node.expression.node.type === 'ArrayExpression' &&
			node.expression.node.elements.every(element => element.type !== 'SpreadElement')
				? node.expression.node.elements.length
				: null;

		// hack the sourcemap, so that if data is missing the bug
		// is easy to find
		let c = this.node.start + 2;
		while (renderer.component.source[c] !== 'e') c += 1;
		renderer.component.code.overwrite(c, c + 4, 'length');

		const each_block_value = renderer.component.get_unique_name(`${this.var}_value`);
		const iterations = block.get_unique_name(`${this.var}_blocks`);

		this.vars = {
			create_each_block: this.block.name,
			each_block_value,
			get_each_context: renderer.component.get_unique_name(`get_${this.var}_context`),
			iterations,
			length: `[✂${c}-${c+4}✂]`,

			// optimisation for array literal
			fixed_length,
			data_length: fixed_length === null ? `${each_block_value}.[✂${c}-${c+4}✂]` : fixed_length,
			view_length: fixed_length === null ? `${iterations}.[✂${c}-${c+4}✂]` : fixed_length,

			// filled out later
			anchor: null
		};

		node.contexts.forEach(prop => {
			this.block.bindings.set(prop.key.name, {
				object: this.vars.each_block_value,
				property: this.index_name,
				snippet: attach_head(`${this.vars.each_block_value}[${this.index_name}]`, prop.tail)
			});
		});

		if (this.node.index) {
			this.block.get_unique_name(this.node.index); // this prevents name collisions (#1254)
		}

		renderer.blocks.push(this.block);

		this.fragment = new FragmentWrapper(renderer, this.block, node.children, this, strip_whitespace, next_sibling);

		if (this.node.else) {
			this.else = new ElseBlockWrapper(
				renderer,
				block,
				this,
				this.node.else,
				strip_whitespace,
				next_sibling
			);

			renderer.blocks.push(this.else.block);

			if (this.else.is_dynamic) {
				this.block.add_dependencies(this.else.block.dependencies);
			}
		}

		block.add_dependencies(this.block.dependencies);

		if (this.block.has_outros || (this.else && this.else.block.has_outros)) {
			block.add_outro();
		}
	}

	render(block, parent_node, parent_nodes) {
		if (this.fragment.nodes.length === 0) return;

		const { renderer } = this;
		const { component } = renderer;

		const needs_anchor = this.next
			? !this.next.is_dom_node() :
			!parent_node || !this.parent.is_dom_node();

		this.vars.anchor = needs_anchor
			? block.get_unique_name(`${this.var}_anchor`)
			: (this.next && this.next.var) || 'null';

		this.context_props = this.node.contexts.map(prop => `child_ctx.${prop.key.name} = ${attach_head('list[i]', prop.tail)};`);

		if (this.node.has_binding) this.context_props.push(`child_ctx.${this.vars.each_block_value} = list;`);
		if (this.node.has_binding || this.node.index) this.context_props.push(`child_ctx.${this.index_name} = i;`);

		const snippet = this.node.expression.render(block);

		block.builders.init.add_line(`var ${this.vars.each_block_value} = ${snippet};`);

		renderer.blocks.push(deindent`
			function ${this.vars.get_each_context}(ctx, list, i) {
				const child_ctx = Object.create(ctx);
				${this.context_props}
				return child_ctx;
			}
		`);

		if (this.node.key) {
			this.render_keyed(block, parent_node, parent_nodes, snippet);
		} else {
			this.render_unkeyed(block, parent_node, parent_nodes, snippet);
		}

		if (this.block.has_intro_method || this.block.has_outro_method) {
			block.builders.intro.add_block(deindent`
				for (var #i = 0; #i < ${this.vars.data_length}; #i += 1) ${this.vars.iterations}[#i].i();
			`);
		}

		if (needs_anchor) {
			block.add_element(
				this.vars.anchor,
				`@empty()`,
				parent_nodes && `@empty()`,
				parent_node
			);
		}

		if (this.else) {
			const each_block_else = component.get_unique_name(`${this.var}_else`);

			block.builders.init.add_line(`var ${each_block_else} = null;`);

			// TODO neaten this up... will end up with an empty line in the block
			block.builders.init.add_block(deindent`
				if (!${this.vars.data_length}) {
					${each_block_else} = ${this.else.block.name}(ctx);
					${each_block_else}.c();
				}
			`);

			block.builders.mount.add_block(deindent`
				if (${each_block_else}) {
					${each_block_else}.m(${parent_node || '#target'}, null);
				}
			`);

			const initial_mount_node = parent_node || `${this.vars.anchor}.parentNode`;

			if (this.else.block.has_update_method) {
				block.builders.update.add_block(deindent`
					if (!${this.vars.data_length} && ${each_block_else}) {
						${each_block_else}.p(changed, ctx);
					} else if (!${this.vars.data_length}) {
						${each_block_else} = ${this.else.block.name}(ctx);
						${each_block_else}.c();
						${each_block_else}.m(${initial_mount_node}, ${this.vars.anchor});
					} else if (${each_block_else}) {
						${each_block_else}.d(1);
						${each_block_else} = null;
					}
				`);
			} else {
				block.builders.update.add_block(deindent`
					if (${this.vars.data_length}) {
						if (${each_block_else}) {
							${each_block_else}.d(1);
							${each_block_else} = null;
						}
					} else if (!${each_block_else}) {
						${each_block_else} = ${this.else.block.name}(ctx);
						${each_block_else}.c();
						${each_block_else}.m(${initial_mount_node}, ${this.vars.anchor});
					}
				`);
			}

			block.builders.destroy.add_block(deindent`
				if (${each_block_else}) ${each_block_else}.d(${parent_node ? '' : 'detaching'});
			`);
		}

		this.fragment.render(this.block, null, 'nodes');

		if (this.else) {
			this.else.fragment.render(this.else.block, null, 'nodes');
		}
	}

	render_keyed(
		block,
		parent_node,
		parent_nodes,
		snippet
	) {
		const {
			create_each_block,
			length,
			anchor,
			iterations,
			view_length
		} = this.vars;

		const get_key = block.get_unique_name('get_key');
		const lookup = block.get_unique_name(`${this.var}_lookup`);

		block.add_variable(iterations, '[]');
		block.add_variable(lookup, `new Map()`);

		if (this.fragment.nodes[0].is_dom_node()) {
			this.block.first = this.fragment.nodes[0].var;
		} else {
			this.block.first = this.block.get_unique_name('first');
			this.block.add_element(
				this.block.first,
				`@empty()`,
				parent_nodes && `@empty()`,
				null
			);
		}

		block.builders.init.add_block(deindent`
			const ${get_key} = ctx => ${this.node.key.render()};

			for (var #i = 0; #i < ${this.vars.each_block_value}.${length}; #i += 1) {
				let child_ctx = ${this.vars.get_each_context}(ctx, ${this.vars.each_block_value}, #i);
				let key = ${get_key}(child_ctx);
				${lookup}.set(key, ${iterations}[#i] = ${create_each_block}(key, child_ctx));
			}
		`);

		const initial_mount_node = parent_node || '#target';
		const update_mount_node = this.get_update_mount_node(anchor);
		const anchor_node = parent_node ? 'null' : 'anchor';

		block.builders.create.add_block(deindent`
			for (#i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].c();
		`);

		if (parent_nodes && this.renderer.options.hydratable) {
			block.builders.claim.add_block(deindent`
				for (#i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].l(${parent_nodes});
			`);
		}

		block.builders.mount.add_block(deindent`
			for (#i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].m(${initial_mount_node}, ${anchor_node});
		`);

		const dynamic = this.block.has_update_method;

		const destroy = this.node.has_animation
			? `@fix_and_outro_and_destroy_block`
			: this.block.has_outros
				? `@outro_and_destroy_block`
				: `@destroy_block`;

		block.builders.update.add_block(deindent`
			const ${this.vars.each_block_value} = ${snippet};

			${this.block.has_outros && `@group_outros();`}
			${this.node.has_animation && `for (let #i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].r();`}
			${iterations} = @update_keyed_each(${iterations}, changed, ${get_key}, ${dynamic ? '1' : '0'}, ctx, ${this.vars.each_block_value}, ${lookup}, ${update_mount_node}, ${destroy}, ${create_each_block}, ${anchor}, ${this.vars.get_each_context});
			${this.node.has_animation && `for (let #i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].a();`}
			${this.block.has_outros && `@check_outros();`}
		`);

		if (this.block.has_outros) {
			block.builders.outro.add_block(deindent`
				for (#i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].o();
			`);
		}

		block.builders.destroy.add_block(deindent`
			for (#i = 0; #i < ${view_length}; #i += 1) ${iterations}[#i].d(${parent_node ? '' : 'detaching'});
		`);
	}

	render_unkeyed(
		block,
		parent_node,
		parent_nodes,
		snippet
	) {
		const {
			create_each_block,
			length,
			iterations,
			fixed_length,
			data_length,
			view_length,
			anchor
		} = this.vars;

		block.builders.init.add_block(deindent`
			var ${iterations} = [];

			for (var #i = 0; #i < ${data_length}; #i += 1) {
				${iterations}[#i] = ${create_each_block}(${this.vars.get_each_context}(ctx, ${this.vars.each_block_value}, #i));
			}
		`);

		const initial_mount_node = parent_node || '#target';
		const update_mount_node = this.get_update_mount_node(anchor);
		const anchor_node = parent_node ? 'null' : 'anchor';

		block.builders.create.add_block(deindent`
			for (var #i = 0; #i < ${view_length}; #i += 1) {
				${iterations}[#i].c();
			}
		`);

		if (parent_nodes && this.renderer.options.hydratable) {
			block.builders.claim.add_block(deindent`
				for (var #i = 0; #i < ${view_length}; #i += 1) {
					${iterations}[#i].l(${parent_nodes});
				}
			`);
		}

		block.builders.mount.add_block(deindent`
			for (var #i = 0; #i < ${view_length}; #i += 1) {
				${iterations}[#i].m(${initial_mount_node}, ${anchor_node});
			}
		`);

		const all_dependencies = new Set(this.block.dependencies);
		const { dependencies } = this.node.expression;
		dependencies.forEach((dependency) => {
			all_dependencies.add(dependency);
		});

		const outro_block = this.block.has_outros && block.get_unique_name('outro_block');
		if (outro_block) {
			block.builders.init.add_block(deindent`
				function ${outro_block}(i, detaching, local) {
					if (${iterations}[i]) {
						if (detaching) {
							@on_outro(() => {
								${iterations}[i].d(detaching);
								${iterations}[i] = null;
							});
						}

						${iterations}[i].o(local);
					}
				}
			`);
		}

		const condition = Array.from(all_dependencies)
			.map(dependency => `changed.${dependency}`)
			.join(' || ');

		const has_transitions = !!(this.block.has_intro_method || this.block.has_outro_method);

		if (condition !== '') {
			const for_loop_body = this.block.has_update_method
				? deindent`
					if (${iterations}[#i]) {
						${iterations}[#i].p(changed, child_ctx);
						${has_transitions && `${iterations}[#i].i(1);`}
					} else {
						${iterations}[#i] = ${create_each_block}(child_ctx);
						${iterations}[#i].c();
						${has_transitions && `${iterations}[#i].i(1);`}
						${iterations}[#i].m(${update_mount_node}, ${anchor});
					}
				`
				: deindent`
					${iterations}[#i] = ${create_each_block}(child_ctx);
					${iterations}[#i].c();
					${has_transitions && `${iterations}[#i].i(1);`}
					${iterations}[#i].m(${update_mount_node}, ${anchor});
				`;

			const start = this.block.has_update_method ? '0' : `${view_length}`;

			let remove_old_blocks;

			if (this.block.has_outros) {
				remove_old_blocks = deindent`
					@group_outros();
					for (; #i < ${view_length}; #i += 1) ${outro_block}(#i, 1, 1);
					@check_outros();
				`;
			} else {
				remove_old_blocks = deindent`
					for (${this.block.has_update_method ? `` : `#i = ${this.vars.each_block_value}.${length}`}; #i < ${view_length}; #i += 1) {
						${iterations}[#i].d(1);
					}
					${!fixed_length && `${view_length} = ${this.vars.each_block_value}.${length};`}
				`;
			}

			const update = deindent`
				${this.vars.each_block_value} = ${snippet};

				for (var #i = ${start}; #i < ${this.vars.each_block_value}.${length}; #i += 1) {
					const child_ctx = ${this.vars.get_each_context}(ctx, ${this.vars.each_block_value}, #i);

					${for_loop_body}
				}

				${remove_old_blocks}
			`;

			block.builders.update.add_block(deindent`
				if (${condition}) {
					${update}
				}
			`);
		}

		if (outro_block) {
			block.builders.outro.add_block(deindent`
				${iterations} = ${iterations}.filter(Boolean);
				for (let #i = 0; #i < ${view_length}; #i += 1) ${outro_block}(#i, 0);`
			);
		}

		block.builders.destroy.add_block(`@destroy_each(${iterations}, detaching);`);
	}
}

const svg_attributes = 'accent-height accumulate additive alignment-baseline allowReorder alphabetic amplitude arabic-form ascent attributeName attributeType autoReverse azimuth baseFrequency baseline-shift baseProfile bbox begin bias by calcMode cap-height class clip clipPathUnits clip-path clip-rule color color-interpolation color-interpolation-filters color-profile color-rendering contentScriptType contentStyleType cursor cx cy d decelerate descent diffuseConstant direction display divisor dominant-baseline dur dx dy edgeMode elevation enable-background end exponent externalResourcesRequired fill fill-opacity fill-rule filter filterRes filterUnits flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight format from fr fx fy g1 g2 glyph-name glyph-orientation-horizontal glyph-orientation-vertical glyphRef gradientTransform gradientUnits hanging height href horiz-adv-x horiz-origin-x id ideographic image-rendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength kerning keyPoints keySplines keyTimes lang lengthAdjust letter-spacing lighting-color limitingConeAngle local marker-end marker-mid marker-start markerHeight markerUnits markerWidth mask maskContentUnits maskUnits mathematical max media method min mode name numOctaves offset onabort onactivate onbegin onclick onend onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onrepeat onresize onscroll onunload opacity operator order orient orientation origin overflow overline-position overline-thickness panose-1 paint-order pathLength patternContentUnits patternTransform patternUnits pointer-events points pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits r radius refX refY rendering-intent repeatCount repeatDur requiredExtensions requiredFeatures restart result rotate rx ry scale seed shape-rendering slope spacing specularConstant specularExponent speed spreadMethod startOffset stdDeviation stemh stemv stitchTiles stop-color stop-opacity strikethrough-position strikethrough-thickness string stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width style surfaceScale systemLanguage tabindex tableValues target targetX targetY text-anchor text-decoration text-rendering textLength to transform type u1 u2 underline-position underline-thickness unicode unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical values version vert-adv-y vert-origin-x vert-origin-y viewBox viewTarget visibility width widths word-spacing writing-mode x x-height x1 x2 xChannelSelector xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y y1 y2 yChannelSelector z zoomAndPan'.split(' ');

const svg_attribute_lookup = new Map();

svg_attributes.forEach(name => {
	svg_attribute_lookup.set(name.toLowerCase(), name);
});

function fix_attribute_casing(name) {
	name = name.toLowerCase();
	return svg_attribute_lookup.get(name) || name;
}

const html = 'http://www.w3.org/1999/xhtml';
const mathml = 'http://www.w3.org/1998/Math/MathML';
const svg = 'http://www.w3.org/2000/svg';
const xlink = 'http://www.w3.org/1999/xlink';
const xml = 'http://www.w3.org/XML/1998/namespace';
const xmlns = 'http://www.w3.org/2000/xmlns';

const valid_namespaces = [
	'html',
	'mathml',
	'svg',
	'xlink',
	'xml',
	'xmlns',
	html,
	mathml,
	svg,
	xlink,
	xml,
	xmlns,
];

const namespaces = { html, mathml, svg, xlink, xml, xmlns };

class AttributeWrapper {
	
	

	constructor(parent, block, node) {
		this.node = node;
		this.parent = parent;

		if (node.dependencies.size > 0) {
			parent.cannot_use_innerhtml();

			block.add_dependencies(node.dependencies);

			// special case — <option value={foo}> — see below
			if (this.parent.node.name === 'option' && node.name === 'value') {
				let select = this.parent;
				while (select && (select.node.type !== 'Element' || select.node.name !== 'select')) select = select.parent;

				if (select && select.select_binding_dependencies) {
					select.select_binding_dependencies.forEach(prop => {
						this.node.dependencies.forEach((dependency) => {
							this.parent.renderer.component.indirect_dependencies.get(prop).add(dependency);
						});
					});
				}
			}
		}
	}

	render(block) {
		const element = this.parent;
		const name = fix_attribute_casing(this.node.name);

		let metadata = element.node.namespace ? null : attribute_lookup[name];
		if (metadata && metadata.applies_to && !~metadata.applies_to.indexOf(element.node.name))
			metadata = null;

		const is_indirectly_bound_value =
			name === 'value' &&
			(element.node.name === 'option' || // TODO check it's actually bound
				(element.node.name === 'input' &&
					element.node.bindings.find(
						(binding) =>
							/checked|group/.test(binding.name)
						)));

		const property_name = is_indirectly_bound_value
			? '__value'
			: metadata && metadata.property_name;

		// xlink is a special case... we could maybe extend this to generic
		// namespaced attributes but I'm not sure that's applicable in
		// HTML5?
		const method = /-/.test(element.node.name)
			? '@set_custom_element_data'
			: name.slice(0, 6) === 'xlink:'
				? '@xlink_attr'
				: '@attr';

		const is_legacy_input_type = element.renderer.component.compile_options.legacy && name === 'type' && this.parent.node.name === 'input';

		const is_dataset = /^data-/.test(name) && !element.renderer.component.compile_options.legacy && !element.node.namespace;
		const camel_case_name = is_dataset ? name.replace('data-', '').replace(/(-\w)/g, function (m) {
			return m[1].toUpperCase();
		}) : name;

		if (this.node.is_dynamic) {
			let value;

			// TODO some of this code is repeated in Tag.ts — would be good to
			// DRY it out if that's possible without introducing crazy indirection
			if (this.node.chunks.length === 1) {
				// single {tag} — may be a non-string
				value = this.node.chunks[0].render(block);
			} else {
				// '{foo} {bar}' — treat as string concatenation
				value =
					(this.node.chunks[0].type === 'Text' ? '' : `"" + `) +
					this.node.chunks
						.map((chunk) => {
							if (chunk.type === 'Text') {
								return stringify(chunk.data);
							} else {
								return chunk.get_precedence() <= 13
									? `(${chunk.render()})`
									: chunk.render();
							}
						})
						.join(' + ');
			}

			const is_select_value_attribute =
				name === 'value' && element.node.name === 'select';

			const should_cache = (this.node.should_cache || is_select_value_attribute);

			const last = should_cache && block.get_unique_name(
				`${element.var}_${name.replace(/[^a-zA-Z_$]/g, '_')}_value`
			);

			if (should_cache) block.add_variable(last);

			let updater;
			const init = should_cache ? `${last} = ${value}` : value;

			if (is_legacy_input_type) {
				block.builders.hydrate.add_line(
					`@set_input_type(${element.var}, ${init});`
				);
				updater = `@set_input_type(${element.var}, ${should_cache ? last : value});`;
			} else if (is_select_value_attribute) {
				// annoying special case
				const is_multiple_select = element.node.get_static_attribute_value('multiple');
				const i = block.get_unique_name('i');
				const option = block.get_unique_name('option');

				const if_statement = is_multiple_select
					? deindent`
						${option}.selected = ~${last}.indexOf(${option}.__value);`
					: deindent`
						if (${option}.__value === ${last}) {
							${option}.selected = true;
							break;
						}`;

				updater = deindent`
					for (var ${i} = 0; ${i} < ${element.var}.options.length; ${i} += 1) {
						var ${option} = ${element.var}.options[${i}];

						${if_statement}
					}
				`;

				block.builders.mount.add_block(deindent`
					${last} = ${value};
					${updater}
				`);
			} else if (property_name) {
				block.builders.hydrate.add_line(
					`${element.var}.${property_name} = ${init};`
				);
				updater = `${element.var}.${property_name} = ${should_cache ? last : value};`;
			} else if (is_dataset) {
				block.builders.hydrate.add_line(
					`${element.var}.dataset.${camel_case_name} = ${init};`
				);
				updater = `${element.var}.dataset.${camel_case_name} = ${should_cache ? last : value};`;
			} else {
				block.builders.hydrate.add_line(
					`${method}(${element.var}, "${name}", ${init});`
				);
				updater = `${method}(${element.var}, "${name}", ${should_cache ? last : value});`;
			}

			// only add an update if mutations are involved (or it's a select?)
			const dependencies = this.node.get_dependencies();
			if (dependencies.length > 0 || is_select_value_attribute) {
				const changed_check = (
					(block.has_outros ? `!#current || ` : '') +
					dependencies.map(dependency => `changed.${dependency}`).join(' || ')
				);

				const update_cached_value = `${last} !== (${last} = ${value})`;

				const condition = should_cache
					? (dependencies.length ? `(${changed_check}) && ${update_cached_value}` : update_cached_value)
					: changed_check;

				block.builders.update.add_conditional(
					condition,
					updater
				);
			}
		} else {
			const value = this.node.get_value(block);

			const statement = (
				is_legacy_input_type
					? `@set_input_type(${element.var}, ${value});`
					: property_name
						? `${element.var}.${property_name} = ${value};`
						: is_dataset
							? `${element.var}.dataset.${camel_case_name} = ${value};`
							: `${method}(${element.var}, "${name}", ${value === true ? '""' : value});`
			);

			block.builders.hydrate.add_line(statement);

			// special case – autofocus. has to be handled in a bit of a weird way
			if (this.node.is_true && name === 'autofocus') {
				block.autofocus = element.var;
			}
		}

		if (is_indirectly_bound_value) {
			const update_value = `${element.var}.value = ${element.var}.__value;`;

			block.builders.hydrate.add_line(update_value);
			if (this.node.is_dynamic) block.builders.update.add_line(update_value);
		}
	}

	stringify() {
		if (this.node.is_true) return '';

		const value = this.node.chunks;
		if (value.length === 0) return `=""`;

		return `="${value.map(chunk => {
			return chunk.type === 'Text'
				? chunk.data.replace(/"/g, '\\"')
				: `\${${chunk.render()}}`
		})}"`;
	}
}

// source: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
const attribute_lookup = {
	accept: { applies_to: ['form', 'input'] },
	'accept-charset': { property_name: 'acceptCharset', applies_to: ['form'] },
	accesskey: { property_name: 'accessKey' },
	action: { applies_to: ['form'] },
	align: {
		applies_to: [
			'applet',
			'caption',
			'col',
			'colgroup',
			'hr',
			'iframe',
			'img',
			'table',
			'tbody',
			'td',
			'tfoot',
			'th',
			'thead',
			'tr',
		],
	},
	allowfullscreen: { property_name: 'allowFullscreen', applies_to: ['iframe'] },
	alt: { applies_to: ['applet', 'area', 'img', 'input'] },
	async: { applies_to: ['script'] },
	autocomplete: { applies_to: ['form', 'input'] },
	autofocus: { applies_to: ['button', 'input', 'keygen', 'select', 'textarea'] },
	autoplay: { applies_to: ['audio', 'video'] },
	autosave: { applies_to: ['input'] },
	bgcolor: {
		property_name: 'bgColor',
		applies_to: [
			'body',
			'col',
			'colgroup',
			'marquee',
			'table',
			'tbody',
			'tfoot',
			'td',
			'th',
			'tr',
		],
	},
	border: { applies_to: ['img', 'object', 'table'] },
	buffered: { applies_to: ['audio', 'video'] },
	challenge: { applies_to: ['keygen'] },
	charset: { applies_to: ['meta', 'script'] },
	checked: { applies_to: ['command', 'input'] },
	cite: { applies_to: ['blockquote', 'del', 'ins', 'q'] },
	class: { property_name: 'className' },
	code: { applies_to: ['applet'] },
	codebase: { property_name: 'codeBase', applies_to: ['applet'] },
	color: { applies_to: ['basefont', 'font', 'hr'] },
	cols: { applies_to: ['textarea'] },
	colspan: { property_name: 'colSpan', applies_to: ['td', 'th'] },
	content: { applies_to: ['meta'] },
	contenteditable: { property_name: 'contentEditable' },
	contextmenu: {},
	controls: { applies_to: ['audio', 'video'] },
	coords: { applies_to: ['area'] },
	data: { applies_to: ['object'] },
	datetime: { property_name: 'dateTime', applies_to: ['del', 'ins', 'time'] },
	default: { applies_to: ['track'] },
	defer: { applies_to: ['script'] },
	dir: {},
	dirname: { property_name: 'dirName', applies_to: ['input', 'textarea'] },
	disabled: {
		applies_to: [
			'button',
			'command',
			'fieldset',
			'input',
			'keygen',
			'optgroup',
			'option',
			'select',
			'textarea',
		],
	},
	download: { applies_to: ['a', 'area'] },
	draggable: {},
	dropzone: {},
	enctype: { applies_to: ['form'] },
	for: { property_name: 'htmlFor', applies_to: ['label', 'output'] },
	formaction: { applies_to: ['input', 'button'] },
	headers: { applies_to: ['td', 'th'] },
	height: {
		applies_to: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'],
	},
	hidden: {},
	high: { applies_to: ['meter'] },
	href: { applies_to: ['a', 'area', 'base', 'link'] },
	hreflang: { applies_to: ['a', 'area', 'link'] },
	'http-equiv': { property_name: 'httpEquiv', applies_to: ['meta'] },
	icon: { applies_to: ['command'] },
	id: {},
	indeterminate: { applies_to: ['input'] },
	ismap: { property_name: 'isMap', applies_to: ['img'] },
	itemprop: {},
	keytype: { applies_to: ['keygen'] },
	kind: { applies_to: ['track'] },
	label: { applies_to: ['track'] },
	lang: {},
	language: { applies_to: ['script'] },
	loop: { applies_to: ['audio', 'bgsound', 'marquee', 'video'] },
	low: { applies_to: ['meter'] },
	manifest: { applies_to: ['html'] },
	max: { applies_to: ['input', 'meter', 'progress'] },
	maxlength: { property_name: 'maxLength', applies_to: ['input', 'textarea'] },
	media: { applies_to: ['a', 'area', 'link', 'source', 'style'] },
	method: { applies_to: ['form'] },
	min: { applies_to: ['input', 'meter'] },
	multiple: { applies_to: ['input', 'select'] },
	muted: { applies_to: ['audio', 'video'] },
	name: {
		applies_to: [
			'button',
			'form',
			'fieldset',
			'iframe',
			'input',
			'keygen',
			'object',
			'output',
			'select',
			'textarea',
			'map',
			'meta',
			'param',
		],
	},
	novalidate: { property_name: 'noValidate', applies_to: ['form'] },
	open: { applies_to: ['details'] },
	optimum: { applies_to: ['meter'] },
	pattern: { applies_to: ['input'] },
	ping: { applies_to: ['a', 'area'] },
	placeholder: { applies_to: ['input', 'textarea'] },
	poster: { applies_to: ['video'] },
	preload: { applies_to: ['audio', 'video'] },
	radiogroup: { applies_to: ['command'] },
	readonly: { property_name: 'readOnly', applies_to: ['input', 'textarea'] },
	rel: { applies_to: ['a', 'area', 'link'] },
	required: { applies_to: ['input', 'select', 'textarea'] },
	reversed: { applies_to: ['ol'] },
	rows: { applies_to: ['textarea'] },
	rowspan: { property_name: 'rowSpan', applies_to: ['td', 'th'] },
	sandbox: { applies_to: ['iframe'] },
	scope: { applies_to: ['th'] },
	scoped: { applies_to: ['style'] },
	seamless: { applies_to: ['iframe'] },
	selected: { applies_to: ['option'] },
	shape: { applies_to: ['a', 'area'] },
	size: { applies_to: ['input', 'select'] },
	sizes: { applies_to: ['link', 'img', 'source'] },
	span: { applies_to: ['col', 'colgroup'] },
	spellcheck: {},
	src: {
		applies_to: [
			'audio',
			'embed',
			'iframe',
			'img',
			'input',
			'script',
			'source',
			'track',
			'video',
		],
	},
	srcdoc: { applies_to: ['iframe'] },
	srclang: { applies_to: ['track'] },
	srcset: { applies_to: ['img'] },
	start: { applies_to: ['ol'] },
	step: { applies_to: ['input'] },
	style: { property_name: 'style.cssText' },
	summary: { applies_to: ['table'] },
	tabindex: { property_name: 'tabIndex' },
	target: { applies_to: ['a', 'area', 'base', 'form'] },
	title: {},
	type: {
		applies_to: [
			'button',
			'command',
			'embed',
			'object',
			'script',
			'source',
			'style',
			'menu',
		],
	},
	usemap: { property_name: 'useMap', applies_to: ['img', 'input', 'object'] },
	value: {
		applies_to: [
			'button',
			'option',
			'input',
			'li',
			'meter',
			'progress',
			'param',
			'select',
			'textarea',
		],
	},
	volume: { applies_to: ['audio', 'video'] },
	playbackRate: { applies_to: ['audio', 'video'] },
	width: {
		applies_to: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'],
	},
	wrap: { applies_to: ['textarea'] },
};

Object.keys(attribute_lookup).forEach(name => {
	const metadata = attribute_lookup[name];
	if (!metadata.property_name) metadata.property_name = name;
});

class StyleAttributeWrapper extends AttributeWrapper {
	
	

	render(block) {
		const style_props = optimize_style(this.node.chunks);
		if (!style_props) return super.render(block);

		style_props.forEach((prop) => {
			let value;

			if (is_dynamic(prop.value)) {
				const prop_dependencies = new Set();

				value =
					((prop.value.length === 1 || prop.value[0].type === 'Text') ? '' : `"" + `) +
					prop.value
						.map((chunk) => {
							if (chunk.type === 'Text') {
								return stringify(chunk.data);
							} else {
								const snippet = chunk.render();

								add_to_set(prop_dependencies, chunk.dependencies);

								return chunk.get_precedence() <= 13 ? `(${snippet})` : snippet;
							}
						})
						.join(' + ');

				if (prop_dependencies.size) {
					const dependencies = Array.from(prop_dependencies);
					const condition = (
						(block.has_outros ? `!#current || ` : '') +
						dependencies.map(dependency => `changed.${dependency}`).join(' || ')
					);

					block.builders.update.add_conditional(
						condition,
						`@set_style(${this.parent.var}, "${prop.key}", ${value});`
					);
				}
			} else {
				value = stringify(prop.value[0].data);
			}

			block.builders.hydrate.add_line(
				`@set_style(${this.parent.var}, "${prop.key}", ${value});`
			);
		});
	}
}

function optimize_style(value) {
	const props = [];
	let chunks = value.slice();

	while (chunks.length) {
		const chunk = chunks[0];

		if (chunk.type !== 'Text') return null;

		const key_match = /^\s*([\w-]+):\s*/.exec(chunk.data);
		if (!key_match) return null;

		const key = key_match[1];

		const offset = key_match.index + key_match[0].length;
		const remaining_data = chunk.data.slice(offset);

		if (remaining_data) {
			chunks[0] = {
				start: chunk.start + offset,
				end: chunk.end,
				type: 'Text',
				data: remaining_data
			};
		} else {
			chunks.shift();
		}

		const result = get_style_value(chunks);

		props.push({ key, value: result.value });
		chunks = result.chunks;
	}

	return props;
}

function get_style_value(chunks) {
	const value = [];

	let in_url = false;
	let quote_mark = null;
	let escaped = false;

	while (chunks.length) {
		const chunk = chunks.shift();

		if (chunk.type === 'Text') {
			let c = 0;
			while (c < chunk.data.length) {
				const char = chunk.data[c];

				if (escaped) {
					escaped = false;
				} else if (char === '\\') {
					escaped = true;
				} else if (char === quote_mark) {
					quote_mark = null;
				} else if (char === '"' || char === "'") {
					quote_mark = char;
				} else if (char === ')' && in_url) {
					in_url = false;
				} else if (char === 'u' && chunk.data.slice(c, c + 4) === 'url(') {
					in_url = true;
				} else if (char === ';' && !in_url && !quote_mark) {
					break;
				}

				c += 1;
			}

			if (c > 0) {
				value.push({
					type: 'Text',
					start: chunk.start,
					end: chunk.start + c,
					data: chunk.data.slice(0, c)
				});
			}

			while (/[;\s]/.test(chunk.data[c])) c += 1;
			const remaining_data = chunk.data.slice(c);

			if (remaining_data) {
				chunks.unshift({
					start: chunk.start + c,
					end: chunk.end,
					type: 'Text',
					data: remaining_data
				});

				break;
			}
		}

		else {
			value.push(chunk);
		}
	}

	return {
		chunks,
		value
	};
}

function is_dynamic(value) {
	return value.length > 1 || value[0].type !== 'Text';
}

function unwrap_parens(node) {
	while (node.type === 'ParenthesizedExpression') node = node.expression;
	return node;
}

function get_object(node) {
	node = unwrap_parens(node);
	while (node.type === 'MemberExpression') node = node.object;
	return node;
}

function flatten_reference(node) {
	if (node.type === 'Expression') throw new Error('bad');
	const nodes = [];
	const parts = [];
	const prop_end = node.end;

	while (node.type === 'MemberExpression') {
		if (node.computed) return null;

		nodes.unshift(node.property);
		parts.unshift(node.property.name);

		node = node.object;
	}

	const prop_start = node.end;
	const name = node.type === 'Identifier'
		? node.name
		: node.type === 'ThisExpression' ? 'this' : null;

	if (!name) return null;

	parts.unshift(name);
	nodes.unshift(node);

	return { name, nodes, parts, keypath: `${name}[✂${prop_start}-${prop_end}✂]` };
}

// TODO this should live in a specific binding
const read_only_media_attributes = new Set([
	'duration',
	'buffered',
	'seekable',
	'played'
]);

function get_tail(node) {
	const end = node.end;
	while (node.type === 'MemberExpression') node = node.object;
	return { start: node.end, end };
}

class BindingWrapper {
	
	

	
	





	
	
	

	constructor(block, node, parent) {
		this.node = node;
		this.parent = parent;

		const { dependencies } = this.node.expression;

		block.add_dependencies(dependencies);

		// TODO does this also apply to e.g. `<input type='checkbox' bind:group='foo'>`?
		if (parent.node.name === 'select') {
			parent.select_binding_dependencies = dependencies;
			dependencies.forEach((prop) => {
				parent.renderer.component.indirect_dependencies.set(prop, new Set());
			});
		}

		if (node.is_contextual) {
			// we need to ensure that the each block creates a context including
			// the list and the index, if they're not otherwise referenced
			const { name } = get_object(this.node.expression.node);
			const each_block = this.parent.node.scope.get_owner(name);

			(each_block ).has_binding = true;
		}

		this.object = get_object(this.node.expression.node).name;

		// TODO unfortunate code is necessary because we need to use `ctx`
		// inside the fragment, but not inside the <script>
		const contextless_snippet = this.parent.renderer.component.source.slice(this.node.expression.node.start, this.node.expression.node.end);

		// view to model
		this.handler = get_event_handler(this, parent.renderer, block, this.object, contextless_snippet);

		this.snippet = this.node.expression.render(block);

		const type = parent.node.get_static_attribute_value('type');

		this.is_readonly = (
			dimensions.test(this.node.name) ||
			(parent.node.is_media_node() && read_only_media_attributes.has(this.node.name)) ||
			(parent.node.name === 'input' && type === 'file') // TODO others?
		);

		this.needs_lock = this.node.name === 'currentTime'; // TODO others?
	}

	get_dependencies() {
		const dependencies = new Set(this.node.expression.dependencies);

		this.node.expression.dependencies.forEach((prop) => {
			const indirect_dependencies = this.parent.renderer.component.indirect_dependencies.get(prop);
			if (indirect_dependencies) {
				indirect_dependencies.forEach(indirect_dependency => {
					dependencies.add(indirect_dependency);
				});
			}
		});

		return dependencies;
	}

	is_readonly_media_attribute() {
		return read_only_media_attributes.has(this.node.name);
	}

	render(block, lock) {
		if (this.is_readonly) return;

		const { parent } = this;

		let update_conditions = this.needs_lock ? [`!${lock}`] : [];

		const dependency_array = [...this.node.expression.dependencies];

		if (dependency_array.length === 1) {
			update_conditions.push(`changed.${dependency_array[0]}`);
		} else if (dependency_array.length > 1) {
			update_conditions.push(
				`(${dependency_array.map(prop => `changed.${prop}`).join(' || ')})`
			);
		}

		if (parent.node.name === 'input') {
			const type = parent.node.get_static_attribute_value('type');

			if (type === null || type === "" || type === "text") {
				update_conditions.push(`(${parent.var}.${this.node.name} !== ${this.snippet})`);
			}
		}

		// model to view
		let update_dom = get_dom_updater(parent, this);

		// special cases
		switch (this.node.name) {
			case 'group':
				const binding_group = get_binding_group(parent.renderer, this.node.expression.node);

				block.builders.hydrate.add_line(
					`ctx.$$binding_groups[${binding_group}].push(${parent.var});`
				);

				block.builders.destroy.add_line(
					`ctx.$$binding_groups[${binding_group}].splice(ctx.$$binding_groups[${binding_group}].indexOf(${parent.var}), 1);`
				);
				break;

			case 'currentTime':
			case 'playbackRate':
			case 'volume':
				update_conditions.push(`!isNaN(${this.snippet})`);
				break;

			case 'paused':
				// this is necessary to prevent audio restarting by itself
				const last = block.get_unique_name(`${parent.var}_is_paused`);
				block.add_variable(last, 'true');

				update_conditions.push(`${last} !== (${last} = ${this.snippet})`);
				update_dom = `${parent.var}[${last} ? "pause" : "play"]();`;
				break;

			case 'value':
				if (parent.node.get_static_attribute_value('type') === 'file') {
					update_dom = null;
				}
		}

		if (update_dom) {
			block.builders.update.add_line(
				update_conditions.length ? `if (${update_conditions.join(' && ')}) ${update_dom}` : update_dom
			);
		}

		if (!/(currentTime|paused)/.test(this.node.name)) {
			block.builders.mount.add_block(update_dom);
		}
	}
}

function get_dom_updater(
	element,
	binding
) {
	const { node } = element;

	if (binding.is_readonly_media_attribute()) {
		return null;
	}

	if (binding.node.name === 'this') {
		return null;
	}

	if (node.name === 'select') {
		return node.get_static_attribute_value('multiple') === true ?
			`@select_options(${element.var}, ${binding.snippet})` :
			`@select_option(${element.var}, ${binding.snippet})`;
	}

	if (binding.node.name === 'group') {
		const type = node.get_static_attribute_value('type');

		const condition = type === 'checkbox'
			? `~${binding.snippet}.indexOf(${element.var}.__value)`
			: `${element.var}.__value === ${binding.snippet}`;

		return `${element.var}.checked = ${condition};`
	}

	return `${element.var}.${binding.node.name} = ${binding.snippet};`;
}

function get_binding_group(renderer, value) {
	const { parts } = flatten_reference(value); // TODO handle cases involving computed member expressions
	const keypath = parts.join('.');

	// TODO handle contextual bindings — `keypath` should include unique ID of
	// each block that provides context
	let index = renderer.binding_groups.indexOf(keypath);
	if (index === -1) {
		index = renderer.binding_groups.length;
		renderer.binding_groups.push(keypath);
	}

	return index;
}

function mutate_store(store, value, tail) {
	return tail
		? `${store}.update($$value => ($$value${tail} = ${value}, $$value));`
		: `${store}.set(${value});`;
}

function get_event_handler(
	binding,
	renderer,
	block,
	name,
	snippet
) {
	const value = get_value_from_dom(renderer, binding.parent, binding);
	const store = binding.object[0] === '$' ? binding.object.slice(1) : null;

	let tail = '';
	if (binding.node.expression.node.type === 'MemberExpression') {
		const { start, end } = get_tail(binding.node.expression.node);
		tail = renderer.component.source.slice(start, end);
	}

	if (binding.node.is_contextual) {
		const { object, property, snippet } = block.bindings.get(name);

		return {
			uses_context: true,
			mutation: store
				? mutate_store(store, value, tail)
				: `${snippet}${tail} = ${value};`,
			contextual_dependencies: new Set([object, property])
		};
	}

	const mutation = store
		? mutate_store(store, value, tail)
		: `${snippet} = ${value};`;

	if (binding.node.expression.node.type === 'MemberExpression') {
		return {
			uses_context: binding.node.expression.uses_context,
			mutation,
			contextual_dependencies: binding.node.expression.contextual_dependencies,
			snippet
		};
	}

	return {
		uses_context: false,
		mutation,
		contextual_dependencies: new Set()
	};
}

function get_value_from_dom(
	renderer,
	element,
	binding
) {
	const { node } = element;
	const { name } = binding.node;

	if (name === 'this') {
		return `$$node`;
	}

	// <select bind:value='selected>
	if (node.name === 'select') {
		return node.get_static_attribute_value('multiple') === true ?
			`@select_multiple_value(this)` :
			`@select_value(this)`;
	}

	const type = node.get_static_attribute_value('type');

	// <input type='checkbox' bind:group='foo'>
	if (name === 'group') {
		const binding_group = get_binding_group(renderer, binding.node.expression.node);
		if (type === 'checkbox') {
			return `@get_binding_group_value($$binding_groups[${binding_group}])`;
		}

		return `this.__value`;
	}

	// <input type='range|number' bind:value>
	if (type === 'range' || type === 'number') {
		return `@to_number(this.${name})`;
	}

	if ((name === 'buffered' || name === 'seekable' || name === 'played')) {
		return `@time_ranges_to_array(this.${name})`
	}

	// everything else
	return `this.${name}`;
}

function add_event_handlers(
	block,
	target,
	handlers
) {
	handlers.forEach(handler => {
		let snippet = handler.render(block);
		if (handler.modifiers.has('preventDefault')) snippet = `@prevent_default(${snippet})`;
		if (handler.modifiers.has('stopPropagation')) snippet = `@stop_propagation(${snippet})`;

		const opts = ['passive', 'once', 'capture'].filter(mod => handler.modifiers.has(mod));

		if (opts.length) {
			const opts_string = (opts.length === 1 && opts[0] === 'capture')
				? 'true'
				: `{ ${opts.map(opt => `${opt}: true`).join(', ')} }`;

			block.event_listeners.push(
				`@listen(${target}, "${handler.name}", ${snippet}, ${opts_string})`
			);
		} else {
			block.event_listeners.push(
				`@listen(${target}, "${handler.name}", ${snippet})`
			);
		}
	});
}

function add_actions(
	component,
	block,
	target,
	actions
) {
	actions.forEach(action => {
		const { expression } = action;
		let snippet, dependencies;

		if (expression) {
			snippet = expression.render(block);
			dependencies = expression.dynamic_dependencies();
		}

		const name = block.get_unique_name(
			`${action.name.replace(/[^a-zA-Z0-9_$]/g, '_')}_action`
		);

		block.add_variable(name);

		const fn = component.qualify(action.name);

		block.builders.mount.add_line(
			`${name} = ${fn}.call(null, ${target}${snippet ? `, ${snippet}` : ''}) || {};`
		);

		if (dependencies && dependencies.length > 0) {
			let conditional = `typeof ${name}.update === 'function' && `;
			const deps = dependencies.map(dependency => `changed.${dependency}`).join(' || ');
			conditional += dependencies.length > 1 ? `(${deps})` : deps;

			block.builders.update.add_conditional(
				conditional,
				`${name}.update.call(null, ${snippet});`
			);
		}

		block.builders.destroy.add_line(
			`if (${name} && typeof ${name}.destroy === 'function') ${name}.destroy();`
		);
	});
}

function get_context_merger(lets) {
	if (lets.length === 0) return null;

	const input = lets.map(l => l.value ? `${l.name}: ${l.value}` : l.name).join(', ');

	const names = new Set();
	lets.forEach(l => {
		l.names.forEach(name => {
			names.add(name);
		});
	});

	const output = Array.from(names).join(', ');

	return `({ ${input} }) => ({ ${output} })`;
}

const events = [
	{
		event_names: ['input'],
		filter: (node, name) =>
			node.name === 'textarea' ||
			node.name === 'input' && !/radio|checkbox|range/.test(node.get_static_attribute_value('type'))
	},
	{
		event_names: ['change'],
		filter: (node, name) =>
			node.name === 'select' ||
			node.name === 'input' && /radio|checkbox/.test(node.get_static_attribute_value('type'))
	},
	{
		event_names: ['change', 'input'],
		filter: (node, name) =>
			node.name === 'input' && node.get_static_attribute_value('type') === 'range'
	},

	{
		event_names: ['resize'],
		filter: (node, name) =>
			dimensions.test(name)
	},

	// media events
	{
		event_names: ['timeupdate'],
		filter: (node, name) =>
			node.is_media_node() &&
			(name === 'currentTime' || name === 'played')
	},
	{
		event_names: ['durationchange'],
		filter: (node, name) =>
			node.is_media_node() &&
			name === 'duration'
	},
	{
		event_names: ['play', 'pause'],
		filter: (node, name) =>
			node.is_media_node() &&
			name === 'paused'
	},
	{
		event_names: ['progress'],
		filter: (node, name) =>
			node.is_media_node() &&
			name === 'buffered'
	},
	{
		event_names: ['loadedmetadata'],
		filter: (node, name) =>
			node.is_media_node() &&
			(name === 'buffered' || name === 'seekable')
	},
	{
		event_names: ['volumechange'],
		filter: (node, name) =>
			node.is_media_node() &&
			name === 'volume'
	},
	{
		event_names: ['ratechange'],
		filter: (node, name) =>
			node.is_media_node() &&
			name === 'playbackRate'
	},

];

class ElementWrapper extends Wrapper {
	
	
	
	
	

	
	

	

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);
		this.var = node.name.replace(/[^a-zA-Z0-9_$]/g, '_');

		this.class_dependencies = [];

		this.attributes = this.node.attributes.map(attribute => {
			if (attribute.name === 'slot') {
				// TODO make separate subclass for this?
				let owner = this.parent;
				while (owner) {
					if (owner.node.type === 'InlineComponent') {
						break;
					}

					if (owner.node.type === 'Element' && /-/.test(owner.node.name)) {
						break;
					}

					owner = owner.parent;
				}

				if (owner && owner.node.type === 'InlineComponent') {
					const name = attribute.get_static_value();

					if (!(owner ).slots.has(name)) {
						const child_block = block.child({
							comment: create_debugging_comment(node, this.renderer.component),
							name: this.renderer.component.get_unique_name(`create_${sanitize(name)}_slot`)
						});

						const lets = this.node.lets;
						const seen = new Set(lets.map(l => l.name));

						(owner ).node.lets.forEach(l => {
							if (!seen.has(l.name)) lets.push(l);
						});

						const fn = get_context_merger(lets);

						(owner ).slots.set(name, {
							block: child_block,
							scope: this.node.scope,
							fn
						});
						this.renderer.blocks.push(child_block);
					}

					this.slot_block = (owner ).slots.get(name).block;
					block = this.slot_block;
				}
			}
			if (attribute.name === 'style') {
				return new StyleAttributeWrapper(this, block, attribute);
			}
			return new AttributeWrapper(this, block, attribute);
		});

		// ordinarily, there'll only be one... but we need to handle
		// the rare case where an element can have multiple bindings,
		// e.g. <audio bind:paused bind:currentTime>
		this.bindings = this.node.bindings.map(binding => new BindingWrapper(block, binding, this));

		if (node.intro || node.outro) {
			if (node.intro) block.add_intro(node.intro.is_local);
			if (node.outro) block.add_outro(node.outro.is_local);
		}

		if (node.animation) {
			block.add_animation();
		}

		// add directive and handler dependencies
		[node.animation, node.outro, ...node.actions, ...node.classes].forEach(directive => {
			if (directive && directive.expression) {
				block.add_dependencies(directive.expression.dependencies);
			}
		});

		node.handlers.forEach(handler => {
			if (handler.expression) {
				block.add_dependencies(handler.expression.dependencies);
			}
		});

		if (this.parent) {
			if (node.actions.length > 0) this.parent.cannot_use_innerhtml();
			if (node.animation) this.parent.cannot_use_innerhtml();
			if (node.bindings.length > 0) this.parent.cannot_use_innerhtml();
			if (node.classes.length > 0) this.parent.cannot_use_innerhtml();
			if (node.intro || node.outro) this.parent.cannot_use_innerhtml();
			if (node.handlers.length > 0) this.parent.cannot_use_innerhtml();

			if (this.node.name === 'option') this.parent.cannot_use_innerhtml();

			if (renderer.options.dev) {
				this.parent.cannot_use_innerhtml(); // need to use add_location
			}
		}

		this.fragment = new FragmentWrapper(renderer, block, node.children, this, strip_whitespace, next_sibling);

		if (this.slot_block) {
			block.parent.add_dependencies(block.dependencies);

			// appalling hack
			const index = block.parent.wrappers.indexOf(this);
			block.parent.wrappers.splice(index, 1);
			block.wrappers.push(this);
		}
	}

	render(block, parent_node, parent_nodes) {
		const { renderer } = this;

		if (this.node.name === 'noscript') return;

		if (this.slot_block) {
			block = this.slot_block;
		}

		const node = this.var;
		const nodes = parent_nodes && block.get_unique_name(`${this.var}_nodes`); // if we're in unclaimable territory, i.e. <head>, parent_nodes is null

		block.add_variable(node);
		const render_statement = this.get_render_statement();
		block.builders.create.add_line(
			`${node} = ${render_statement};`
		);

		if (renderer.options.hydratable) {
			if (parent_nodes) {
				block.builders.claim.add_block(deindent`
					${node} = ${this.get_claim_statement(parent_nodes)};
					var ${nodes} = @children(${this.node.name === 'template' ? `${node}.content` : node});
				`);
			} else {
				block.builders.claim.add_line(
					`${node} = ${render_statement};`
				);
			}
		}

		if (parent_node) {
			block.builders.mount.add_line(
				`@append(${parent_node}, ${node});`
			);

			if (parent_node === 'document.head') {
				block.builders.destroy.add_line(`@detach(${node});`);
			}
		} else {
			block.builders.mount.add_line(`@insert(#target, ${node}, anchor);`);

			// TODO we eventually need to consider what happens to elements
			// that belong to the same outgroup as an outroing element...
			block.builders.destroy.add_conditional('detaching', `@detach(${node});`);
		}

		// insert static children with textContent or innerHTML
		if (!this.node.namespace && this.can_use_innerhtml && this.fragment.nodes.length > 0) {
			if (this.fragment.nodes.length === 1 && this.fragment.nodes[0].node.type === 'Text') {
				block.builders.create.add_line(
					`${node}.textContent = ${stringify(this.fragment.nodes[0].data)};`
				);
			} else {
				const inner_html = escape$1(
					this.fragment.nodes
						.map(to_html)
						.join('')
				);

				block.builders.create.add_line(
					`${node}.innerHTML = \`${inner_html}\`;`
				);
			}
		} else {
			this.fragment.nodes.forEach((child) => {
				child.render(
					block,
					this.node.name === 'template' ? `${node}.content` : node,
					nodes
				);
			});
		}

		const event_handler_or_binding_uses_context = (
			this.bindings.some(binding => binding.handler.uses_context) ||
			this.node.handlers.some(handler => handler.uses_context) ||
			this.node.actions.some(action => action.uses_context)
		);

		if (event_handler_or_binding_uses_context) {
			block.maintain_context = true;
		}

		this.add_bindings(block);
		this.add_event_handlers(block);
		this.add_attributes(block);
		this.add_transitions(block);
		this.add_animation(block);
		this.add_actions(block);
		this.add_classes(block);

		if (nodes && this.renderer.options.hydratable) {
			block.builders.claim.add_line(
				`${nodes}.forEach(@detach);`
			);
		}

		function to_html(wrapper) {
			if (wrapper.node.type === 'Text') {
				const { parent } = wrapper.node;

				const raw = parent && (
					parent.name === 'script' ||
					parent.name === 'style'
				);

				return raw
					? wrapper.node.data
					: escape_html(wrapper.node.data)
						.replace(/\\/g, '\\\\')
						.replace(/`/g, '\\`')
						.replace(/\$/g, '\\$');
			}

			if (wrapper.node.name === 'noscript') return '';

			let open = `<${wrapper.node.name}`;

			(wrapper ).attributes.forEach((attr) => {
				open += ` ${fix_attribute_casing(attr.node.name)}${attr.stringify()}`;
			});

			if (is_void(wrapper.node.name)) return open + '>';

			return `${open}>${wrapper.fragment.nodes.map(to_html).join('')}</${wrapper.node.name}>`;
		}

		if (renderer.options.dev) {
			const loc = renderer.locate(this.node.start);
			block.builders.hydrate.add_line(
				`@add_location(${this.var}, ${renderer.file_var}, ${loc.line}, ${loc.column}, ${this.node.start});`
			);
		}
	}

	get_render_statement() {
		const { name, namespace } = this.node;

		if (namespace === 'http://www.w3.org/2000/svg') {
			return `@svg_element("${name}")`;
		}

		if (namespace) {
			return `document.createElementNS("${namespace}", "${name}")`;
		}

		return `@element("${name}")`;
	}

	get_claim_statement(nodes) {
		const attributes = this.node.attributes
			.filter((attr) => attr.type === 'Attribute')
			.map((attr) => `${quote_name_if_necessary(attr.name)}: true`)
			.join(', ');

		const name = this.node.namespace
			? this.node.name
			: this.node.name.toUpperCase();

		return `@claim_element(${nodes}, "${name}", ${attributes
			? `{ ${attributes} }`
			: `{}`}, ${this.node.namespace === namespaces.svg ? true : false})`;
	}

	add_bindings(block) {
		const { renderer } = this;

		if (this.bindings.length === 0) return;

		renderer.component.has_reactive_assignments = true;

		const lock = this.bindings.some(binding => binding.needs_lock) ?
			block.get_unique_name(`${this.var}_updating`) :
			null;

		if (lock) block.add_variable(lock, 'false');

		const groups = events
			.map(event => ({
				events: event.event_names,
				bindings: this.bindings
					.filter(binding => binding.node.name !== 'this')
					.filter(binding => event.filter(this.node, binding.node.name))
			}))
			.filter(group => group.bindings.length);

		groups.forEach(group => {
			const handler = renderer.component.get_unique_name(`${this.var}_${group.events.join('_')}_handler`);

			renderer.component.add_var({
				name: handler,
				internal: true,
				referenced: true
			});

			// TODO figure out how to handle locks
			const needs_lock = group.bindings.some(binding => binding.needs_lock);

			const dependencies = new Set();
			const contextual_dependencies = new Set();

			group.bindings.forEach(binding => {
				// TODO this is a mess
				add_to_set(dependencies, binding.get_dependencies());
				add_to_set(contextual_dependencies, binding.node.expression.contextual_dependencies);
				add_to_set(contextual_dependencies, binding.handler.contextual_dependencies);

				binding.render(block, lock);
			});

			// media bindings — awkward special case. The native timeupdate events
			// fire too infrequently, so we need to take matters into our
			// own hands
			let animation_frame;
			if (group.events[0] === 'timeupdate') {
				animation_frame = block.get_unique_name(`${this.var}_animationframe`);
				block.add_variable(animation_frame);
			}

			const has_local_function = contextual_dependencies.size > 0 || needs_lock || animation_frame;

			let callee;

			// TODO dry this out — similar code for event handlers and component bindings
			if (has_local_function) {
				// need to create a block-local function that calls an instance-level function
				block.builders.init.add_block(deindent`
					function ${handler}() {
						${animation_frame && deindent`
						cancelAnimationFrame(${animation_frame});
						if (!${this.var}.paused) ${animation_frame} = requestAnimationFrame(${handler});`}
						${needs_lock && `${lock} = true;`}
						ctx.${handler}.call(${this.var}${contextual_dependencies.size > 0 ? ', ctx' : ''});
					}
				`);

				callee = handler;
			} else {
				callee = `ctx.${handler}`;
			}

			this.renderer.component.partly_hoisted.push(deindent`
				function ${handler}(${contextual_dependencies.size > 0 ? `{ ${Array.from(contextual_dependencies).join(', ')} }` : ``}) {
					${group.bindings.map(b => b.handler.mutation)}
					${Array.from(dependencies).filter(dep => dep[0] !== '$').map(dep => `${this.renderer.component.invalidate(dep)};`)}
				}
			`);

			group.events.forEach(name => {
				if (name === 'resize') {
					// special case
					const resize_listener = block.get_unique_name(`${this.var}_resize_listener`);
					block.add_variable(resize_listener);

					block.builders.mount.add_line(
						`${resize_listener} = @add_resize_listener(${this.var}, ${callee}.bind(${this.var}));`
					);

					block.builders.destroy.add_line(
						`${resize_listener}.cancel();`
					);
				} else {
					block.event_listeners.push(
						`@listen(${this.var}, "${name}", ${callee})`
					);
				}
			});

			const some_initial_state_is_undefined = group.bindings
				.map(binding => `${binding.snippet} === void 0`)
				.join(' || ');

			if (this.node.name === 'select' || group.bindings.find(binding => binding.node.name === 'indeterminate' || binding.is_readonly_media_attribute())) {
				const callback = has_local_function ? handler : `() => ${callee}.call(${this.var})`;
				block.builders.hydrate.add_line(
					`if (${some_initial_state_is_undefined}) @add_render_callback(${callback});`
				);
			}

			if (group.events[0] === 'resize') {
				block.builders.hydrate.add_line(
					`@add_render_callback(() => ${callee}.call(${this.var}));`
				);
			}
		});

		if (lock) {
			block.builders.update.add_line(`${lock} = false;`);
		}

		const this_binding = this.bindings.find(b => b.node.name === 'this');
		if (this_binding) {
			const name = renderer.component.get_unique_name(`${this.var}_binding`);

			renderer.component.add_var({
				name,
				internal: true,
				referenced: true
			});

			const { handler, object } = this_binding;

			const args = [];
			for (const arg of handler.contextual_dependencies) {
				args.push(arg);
				block.add_variable(arg, `ctx.${arg}`);
			}

			renderer.component.partly_hoisted.push(deindent`
				function ${name}(${['$$node', 'check'].concat(args).join(', ')}) {
					${handler.snippet ? `if ($$node || (!$$node && ${handler.snippet} === check)) ` : ''}${handler.mutation}
					${renderer.component.invalidate(object)};
				}
			`);

			block.builders.mount.add_line(`@add_binding_callback(() => ctx.${name}(${[this.var, 'null'].concat(args).join(', ')}));`);
			block.builders.destroy.add_line(`ctx.${name}(${['null', this.var].concat(args).join(', ')});`);
			block.builders.update.add_line(deindent`
				if (changed.items) {
					ctx.${name}(${['null', this.var].concat(args).join(', ')});
					${args.map(a => `${a} = ctx.${a}`).join(', ')};
					ctx.${name}(${[this.var, 'null'].concat(args).join(', ')});
				}`
			);
		}
	}

	add_attributes(block) {
		if (this.node.attributes.find(attr => attr.type === 'Spread')) {
			this.add_spread_attributes(block);
			return;
		}

		this.attributes.forEach((attribute) => {
			if (attribute.node.name === 'class' && attribute.node.is_dynamic) {
				this.class_dependencies.push(...attribute.node.dependencies);
			}
			attribute.render(block);
		});
	}

	add_spread_attributes(block) {
		const levels = block.get_unique_name(`${this.var}_levels`);
		const data = block.get_unique_name(`${this.var}_data`);

		const initial_props = [];
		const updates = [];

		this.node.attributes
			.filter(attr => attr.type === 'Attribute' || attr.type === 'Spread')
			.forEach(attr => {
				const condition = attr.dependencies.size > 0
					? `(${[...attr.dependencies].map(d => `changed.${d}`).join(' || ')})`
					: null;

				if (attr.is_spread) {
					const snippet = attr.expression.render(block);

					initial_props.push(snippet);

					updates.push(condition ? `${condition} && ${snippet}` : snippet);
				} else {
					const snippet = `{ ${quote_name_if_necessary(attr.name)}: ${attr.get_value(block)} }`;
					initial_props.push(snippet);

					updates.push(condition ? `${condition} && ${snippet}` : snippet);
				}
			});

		block.builders.init.add_block(deindent`
			var ${levels} = [
				${initial_props.join(',\n')}
			];

			var ${data} = {};
			for (var #i = 0; #i < ${levels}.length; #i += 1) {
				${data} = @assign(${data}, ${levels}[#i]);
			}
		`);

		block.builders.hydrate.add_line(
			`@set_attributes(${this.var}, ${data});`
		);

		block.builders.update.add_block(deindent`
			@set_attributes(${this.var}, @get_spread_update(${levels}, [
				${updates.join(',\n')}
			]));
		`);
	}

	add_event_handlers(block) {
		add_event_handlers(block, this.var, this.node.handlers);
	}

	add_transitions(
		block
	) {
		const { intro, outro } = this.node;
		if (!intro && !outro) return;

		const { component } = this.renderer;

		if (intro === outro) {
			// bidirectional transition
			const name = block.get_unique_name(`${this.var}_transition`);
			const snippet = intro.expression
				? intro.expression.render(block)
				: '{}';

			block.add_variable(name);

			const fn = component.qualify(intro.name);

			const intro_block = deindent`
				@add_render_callback(() => {
					if (!${name}) ${name} = @create_bidirectional_transition(${this.var}, ${fn}, ${snippet}, true);
					${name}.run(1);
				});
			`;

			const outro_block = deindent`
				if (!${name}) ${name} = @create_bidirectional_transition(${this.var}, ${fn}, ${snippet}, false);
				${name}.run(0);
			`;

			if (intro.is_local) {
				block.builders.intro.add_block(deindent`
					if (#local) {
						${intro_block}
					}
				`);

				block.builders.outro.add_block(deindent`
					if (#local) {
						${outro_block}
					}
				`);
			} else {
				block.builders.intro.add_block(intro_block);
				block.builders.outro.add_block(outro_block);
			}

			block.builders.destroy.add_conditional('detaching', `if (${name}) ${name}.end();`);
		}

		else {
			const intro_name = intro && block.get_unique_name(`${this.var}_intro`);
			const outro_name = outro && block.get_unique_name(`${this.var}_outro`);

			if (intro) {
				block.add_variable(intro_name);
				const snippet = intro.expression
					? intro.expression.render(block)
					: '{}';

				const fn = component.qualify(intro.name);

				let intro_block;

				if (outro) {
					intro_block = deindent`
						@add_render_callback(() => {
							if (${outro_name}) ${outro_name}.end(1);
							if (!${intro_name}) ${intro_name} = @create_in_transition(${this.var}, ${fn}, ${snippet});
							${intro_name}.start();
						});
					`;

					block.builders.outro.add_line(`if (${intro_name}) ${intro_name}.invalidate();`);
				} else {
					intro_block = deindent`
						if (!${intro_name}) {
							@add_render_callback(() => {
								${intro_name} = @create_in_transition(${this.var}, ${fn}, ${snippet});
								${intro_name}.start();
							});
						}
					`;
				}

				if (intro.is_local) {
					intro_block = deindent`
						if (#local) {
							${intro_block}
						}
					`;
				}

				block.builders.intro.add_block(intro_block);
			}

			if (outro) {
				block.add_variable(outro_name);
				const snippet = outro.expression
					? outro.expression.render(block)
					: '{}';

				const fn = component.qualify(outro.name);

				if (!intro) {
					block.builders.intro.add_block(deindent`
						if (${outro_name}) ${outro_name}.end(1);
					`);
				}

				// TODO hide elements that have outro'd (unless they belong to a still-outroing
				// group) prior to their removal from the DOM
				let outro_block = deindent`
					${outro_name} = @create_out_transition(${this.var}, ${fn}, ${snippet});
				`;

				if (outro_block) {
					outro_block = deindent`
						if (#local) {
							${outro_block}
						}
					`;
				}

				block.builders.outro.add_block(outro_block);

				block.builders.destroy.add_conditional('detaching', `if (${outro_name}) ${outro_name}.end();`);
			}
		}
	}

	add_animation(block) {
		if (!this.node.animation) return;

		const { component } = this.renderer;

		const rect = block.get_unique_name('rect');
		const stop_animation = block.get_unique_name('stop_animation');

		block.add_variable(rect);
		block.add_variable(stop_animation, '@noop');

		block.builders.measure.add_block(deindent`
			${rect} = ${this.var}.getBoundingClientRect();
		`);

		block.builders.fix.add_block(deindent`
			@fix_position(${this.var});
			${stop_animation}();
		`);

		const params = this.node.animation.expression ? this.node.animation.expression.render(block) : '{}';

		const name = component.qualify(this.node.animation.name);

		block.builders.animate.add_block(deindent`
			${stop_animation}();
			${stop_animation} = @create_animation(${this.var}, ${rect}, ${name}, ${params});
		`);
	}

	add_actions(block) {
		add_actions(this.renderer.component, block, this.var, this.node.actions);
	}

	add_classes(block) {
		this.node.classes.forEach(class_directive => {
			const { expression, name } = class_directive;
			let snippet, dependencies;
			if (expression) {
				snippet = expression.render(block);
				dependencies = expression.dependencies;
			} else {
				snippet = `${quote_prop_if_necessary(name)}`;
				dependencies = new Set([name]);
			}
			const updater = `@toggle_class(${this.var}, "${name}", ${snippet});`;

			block.builders.hydrate.add_line(updater);

			if ((dependencies && dependencies.size > 0) || this.class_dependencies.length) {
				const all_dependencies = this.class_dependencies.concat(...dependencies);
				const deps = all_dependencies.map(dependency => `changed${quote_prop_if_necessary(dependency)}`).join(' || ');
				const condition = all_dependencies.length > 1 ? `(${deps})` : deps;

				block.builders.update.add_conditional(
					condition,
					updater
				);
			}
		});
	}

	add_css_class(class_name = this.component.stylesheet.id) {
		const class_attribute = this.attributes.find(a => a.name === 'class');
		if (class_attribute && !class_attribute.is_true) {
			if (class_attribute.chunks.length === 1 && class_attribute.chunks[0].type === 'Text') {
				(class_attribute.chunks[0] ).data += ` ${class_name}`;
			} else {
				(class_attribute.chunks ).push(
					new Text(this.component, this, this.scope, {
						type: 'Text',
						data: ` ${class_name}`
					})
				);
			}
		} else {
			this.attributes.push(
				new Attribute(this.component, this, this.scope, {
					type: 'Attribute',
					name: 'class',
					value: [{ type: 'Text', data: class_name }]
				})
			);
		}
	}
}

class HeadWrapper extends Wrapper {
	

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);

		this.can_use_innerhtml = false;

		this.fragment = new FragmentWrapper(
			renderer,
			block,
			node.children,
			this,
			strip_whitespace,
			next_sibling
		);
	}

	render(block, parent_node, parent_nodes) {
		this.fragment.render(block, 'document.head', null);
	}
}

function is_else_if(node) {
	return (
		node && node.children.length === 1 && node.children[0].type === 'IfBlock'
	);
}

class IfBlockBranch extends Wrapper {
	
	
	
	

	__init() {this.var = null;}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);IfBlockBranch.prototype.__init.call(this);
		this.condition = (node ).expression && (node ).expression.render(block);

		this.block = block.child({
			comment: create_debugging_comment(node, parent.renderer.component),
			name: parent.renderer.component.get_unique_name(
				(node ).expression ? `create_if_block` : `create_else_block`
			)
		});

		this.fragment = new FragmentWrapper(renderer, this.block, node.children, parent, strip_whitespace, next_sibling);

		this.is_dynamic = this.block.dependencies.size > 0;
	}
}

class IfBlockWrapper extends Wrapper {
	
	

	__init2() {this.var = 'if_block';}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);IfBlockWrapper.prototype.__init2.call(this);
		this.cannot_use_innerhtml();

		this.branches = [];

		const blocks = [];
		let is_dynamic = false;
		let has_intros = false;
		let has_outros = false;

		const create_branches = (node) => {
			const branch = new IfBlockBranch(
				renderer,
				block,
				this,
				node,
				strip_whitespace,
				next_sibling
			);

			this.branches.push(branch);

			blocks.push(branch.block);
			block.add_dependencies(node.expression.dependencies);

			if (branch.block.dependencies.size > 0) {
				is_dynamic = true;
				block.add_dependencies(branch.block.dependencies);
			}

			if (branch.block.has_intros) has_intros = true;
			if (branch.block.has_outros) has_outros = true;

			if (is_else_if(node.else)) {
				create_branches(node.else.children[0]);
			} else if (node.else) {
				const branch = new IfBlockBranch(
					renderer,
					block,
					this,
					node.else,
					strip_whitespace,
					next_sibling
				);

				this.branches.push(branch);

				blocks.push(branch.block);

				if (branch.block.dependencies.size > 0) {
					is_dynamic = true;
					block.add_dependencies(branch.block.dependencies);
				}

				if (branch.block.has_intros) has_intros = true;
				if (branch.block.has_outros) has_outros = true;
			}
		};

		create_branches(this.node);

		blocks.forEach(block => {
			block.has_update_method = is_dynamic;
			block.has_intro_method = has_intros;
			block.has_outro_method = has_outros;
		});

		renderer.blocks.push(...blocks);
	}

	render(
		block,
		parent_node,
		parent_nodes
	) {
		const name = this.var;

		const needs_anchor = this.next ? !this.next.is_dom_node() : !parent_node || !this.parent.is_dom_node();
		const anchor = needs_anchor
			? block.get_unique_name(`${name}_anchor`)
			: (this.next && this.next.var) || 'null';

		const has_else = !(this.branches[this.branches.length - 1].condition);
		const if_name = has_else ? '' : `if (${name}) `;

		const dynamic = this.branches[0].block.has_update_method; // can use [0] as proxy for all, since they necessarily have the same value
		const has_intros = this.branches[0].block.has_intro_method;
		const has_outros = this.branches[0].block.has_outro_method;
		const has_transitions = has_intros || has_outros;

		const vars = { name, anchor, if_name, has_else, has_transitions };

		if (this.node.else) {
			if (has_outros) {
				this.render_compound_with_outros(block, parent_node, parent_nodes, dynamic, vars);

				block.builders.outro.add_line(`if (${name}) ${name}.o();`);
			} else {
				this.render_compound(block, parent_node, parent_nodes, dynamic, vars);
			}
		} else {
			this.render_simple(block, parent_node, parent_nodes, dynamic, vars);

			if (has_outros) {
				block.builders.outro.add_line(`if (${name}) ${name}.o();`);
			}
		}

		block.builders.create.add_line(`${if_name}${name}.c();`);

		if (parent_nodes && this.renderer.options.hydratable) {
			block.builders.claim.add_line(
				`${if_name}${name}.l(${parent_nodes});`
			);
		}

		if (has_intros || has_outros) {
			block.builders.intro.add_line(`if (${name}) ${name}.i();`);
		}

		if (needs_anchor) {
			block.add_element(
				anchor,
				`@empty()`,
				parent_nodes && `@empty()`,
				parent_node
			);
		}

		this.branches.forEach(branch => {
			branch.fragment.render(branch.block, null, 'nodes');
		});
	}

	render_compound(
		block,
		parent_node,
		parent_nodes,
		dynamic,
		{ name, anchor, has_else, if_name, has_transitions }
	) {
		const select_block_type = this.renderer.component.get_unique_name(`select_block_type`);
		const current_block_type = block.get_unique_name(`current_block_type`);
		const current_block_type_and = has_else ? '' : `${current_block_type} && `;

		block.builders.init.add_block(deindent`
			function ${select_block_type}(ctx) {
				${this.branches
					.map(({ condition, block }) => `${condition ? `if (${condition}) ` : ''}return ${block.name};`)
					.join('\n')}
			}
		`);

		block.builders.init.add_block(deindent`
			var ${current_block_type} = ${select_block_type}(ctx);
			var ${name} = ${current_block_type_and}${current_block_type}(ctx);
		`);

		const initial_mount_node = parent_node || '#target';
		const anchor_node = parent_node ? 'null' : 'anchor';
		block.builders.mount.add_line(
			`${if_name}${name}.m(${initial_mount_node}, ${anchor_node});`
		);

		const update_mount_node = this.get_update_mount_node(anchor);

		const change_block = deindent`
			${if_name}${name}.d(1);
			${name} = ${current_block_type_and}${current_block_type}(ctx);
			if (${name}) {
				${name}.c();
				${has_transitions && `${name}.i(1);`}
				${name}.m(${update_mount_node}, ${anchor});
			}
		`;

		if (dynamic) {
			block.builders.update.add_block(deindent`
				if (${current_block_type} === (${current_block_type} = ${select_block_type}(ctx)) && ${name}) {
					${name}.p(changed, ctx);
				} else {
					${change_block}
				}
			`);
		} else {
			block.builders.update.add_block(deindent`
				if (${current_block_type} !== (${current_block_type} = ${select_block_type}(ctx))) {
					${change_block}
				}
			`);
		}

		block.builders.destroy.add_line(`${if_name}${name}.d(${parent_node ? '' : 'detaching'});`);
	}

	// if any of the siblings have outros, we need to keep references to the blocks
	// (TODO does this only apply to bidi transitions?)
	render_compound_with_outros(
		block,
		parent_node,
		parent_nodes,
		dynamic,
		{ name, anchor, has_else, has_transitions }
	) {
		const select_block_type = this.renderer.component.get_unique_name(`select_block_type`);
		const current_block_type_index = block.get_unique_name(`current_block_type_index`);
		const previous_block_index = block.get_unique_name(`previous_block_index`);
		const if_block_creators = block.get_unique_name(`if_block_creators`);
		const if_blocks = block.get_unique_name(`if_blocks`);

		const if_current_block_type_index = has_else
			? ''
			: `if (~${current_block_type_index}) `;

		block.add_variable(current_block_type_index);
		block.add_variable(name);

		block.builders.init.add_block(deindent`
			var ${if_block_creators} = [
				${this.branches.map(branch => branch.block.name).join(',\n')}
			];

			var ${if_blocks} = [];

			function ${select_block_type}(ctx) {
				${this.branches
					.map(({ condition }, i) => `${condition ? `if (${condition}) ` : ''}return ${i};`)
					.join('\n')}
				${!has_else && `return -1;`}
			}
		`);

		if (has_else) {
			block.builders.init.add_block(deindent`
				${current_block_type_index} = ${select_block_type}(ctx);
				${name} = ${if_blocks}[${current_block_type_index}] = ${if_block_creators}[${current_block_type_index}](ctx);
			`);
		} else {
			block.builders.init.add_block(deindent`
				if (~(${current_block_type_index} = ${select_block_type}(ctx))) {
					${name} = ${if_blocks}[${current_block_type_index}] = ${if_block_creators}[${current_block_type_index}](ctx);
				}
			`);
		}

		const initial_mount_node = parent_node || '#target';
		const anchor_node = parent_node ? 'null' : 'anchor';

		block.builders.mount.add_line(
			`${if_current_block_type_index}${if_blocks}[${current_block_type_index}].m(${initial_mount_node}, ${anchor_node});`
		);

		const update_mount_node = this.get_update_mount_node(anchor);

		const destroy_old_block = deindent`
			@group_outros();
			@on_outro(() => {
				${if_blocks}[${previous_block_index}].d(1);
				${if_blocks}[${previous_block_index}] = null;
			});
			${name}.o(1);
			@check_outros();
		`;

		const create_new_block = deindent`
			${name} = ${if_blocks}[${current_block_type_index}];
			if (!${name}) {
				${name} = ${if_blocks}[${current_block_type_index}] = ${if_block_creators}[${current_block_type_index}](ctx);
				${name}.c();
			}
			${has_transitions && `${name}.i(1);`}
			${name}.m(${update_mount_node}, ${anchor});
		`;

		const change_block = has_else
			? deindent`
				${destroy_old_block}

				${create_new_block}
			`
			: deindent`
				if (${name}) {
					${destroy_old_block}
				}

				if (~${current_block_type_index}) {
					${create_new_block}
				} else {
					${name} = null;
				}
			`;

		if (dynamic) {
			block.builders.update.add_block(deindent`
				var ${previous_block_index} = ${current_block_type_index};
				${current_block_type_index} = ${select_block_type}(ctx);
				if (${current_block_type_index} === ${previous_block_index}) {
					${if_current_block_type_index}${if_blocks}[${current_block_type_index}].p(changed, ctx);
				} else {
					${change_block}
				}
			`);
		} else {
			block.builders.update.add_block(deindent`
				var ${previous_block_index} = ${current_block_type_index};
				${current_block_type_index} = ${select_block_type}(ctx);
				if (${current_block_type_index} !== ${previous_block_index}) {
					${change_block}
				}
			`);
		}

		block.builders.destroy.add_line(deindent`
			${if_current_block_type_index}${if_blocks}[${current_block_type_index}].d(${parent_node ? '' : 'detaching'});
		`);
	}

	render_simple(
		block,
		parent_node,
		parent_nodes,
		dynamic,
		{ name, anchor, if_name, has_transitions }
	) {
		const branch = this.branches[0];

		block.builders.init.add_block(deindent`
			var ${name} = (${branch.condition}) && ${branch.block.name}(ctx);
		`);

		const initial_mount_node = parent_node || '#target';
		const anchor_node = parent_node ? 'null' : 'anchor';

		block.builders.mount.add_line(
			`if (${name}) ${name}.m(${initial_mount_node}, ${anchor_node});`
		);

		const update_mount_node = this.get_update_mount_node(anchor);

		const enter = dynamic
			? deindent`
				if (${name}) {
					${name}.p(changed, ctx);
					${has_transitions && `${name}.i(1);`}
				} else {
					${name} = ${branch.block.name}(ctx);
					${name}.c();
					${has_transitions && `${name}.i(1);`}
					${name}.m(${update_mount_node}, ${anchor});
				}
			`
			: deindent`
				if (!${name}) {
					${name} = ${branch.block.name}(ctx);
					${name}.c();
					${has_transitions && `${name}.i(1);`}
					${name}.m(${update_mount_node}, ${anchor});
				${has_transitions && `} else {
					${name}.i(1);`}
				}
			`;

		// no `p()` here — we don't want to update outroing nodes,
		// as that will typically result in glitching
		const exit = branch.block.has_outro_method
			? deindent`
				@group_outros();
				@on_outro(() => {
					${name}.d(1);
					${name} = null;
				});

				${name}.o(1);
				@check_outros();
			`
			: deindent`
				${name}.d(1);
				${name} = null;
			`;

		block.builders.update.add_block(deindent`
			if (${branch.condition}) {
				${enter}
			} else if (${name}) {
				${exit}
			}
		`);

		block.builders.destroy.add_line(`${if_name}${name}.d(${parent_node ? '' : 'detaching'});`);
	}
}

function stringify_props(props) {
	if (!props.length) return '{}';

	const joined = props.join(', ');
	if (joined.length > 40) {
		// make larger data objects readable
		return `{\n\t${props.join(',\n\t')}\n}`;
	}

	return `{ ${joined} }`;
}

class InlineComponentWrapper extends Wrapper {
	
	__init() {this.slots = new Map();}
	
	

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);InlineComponentWrapper.prototype.__init.call(this);
		this.cannot_use_innerhtml();

		if (this.node.expression) {
			block.add_dependencies(this.node.expression.dependencies);
		}

		this.node.attributes.forEach(attr => {
			block.add_dependencies(attr.dependencies);
		});

		this.node.bindings.forEach(binding => {
			if (binding.is_contextual) {
				// we need to ensure that the each block creates a context including
				// the list and the index, if they're not otherwise referenced
				const { name } = get_object(binding.expression.node);
				const each_block = this.node.scope.get_owner(name);

				(each_block ).has_binding = true;
			}

			block.add_dependencies(binding.expression.dependencies);
		});

		this.node.handlers.forEach(handler => {
			if (handler.expression) {
				block.add_dependencies(handler.expression.dependencies);
			}
		});

		this.var = (
			this.node.name === 'svelte:self' ? renderer.component.name :
			this.node.name === 'svelte:component' ? 'switch_instance' :
			sanitize(this.node.name)
		).toLowerCase();

		if (this.node.children.length) {
			const default_slot = block.child({
				comment: create_debugging_comment(node, renderer.component),
				name: renderer.component.get_unique_name(`create_default_slot`)
			});

			this.renderer.blocks.push(default_slot);

			const fn = get_context_merger(this.node.lets);

			this.slots.set('default', {
				block: default_slot,
				scope: this.node.scope,
				fn
			});
			this.fragment = new FragmentWrapper(renderer, default_slot, node.children, this, strip_whitespace, next_sibling);

			const dependencies = new Set();

			// TODO is this filtering necessary? (I *think* so)
			default_slot.dependencies.forEach(name => {
				if (!this.node.scope.is_let(name)) {
					dependencies.add(name);
				}
			});

			block.add_dependencies(dependencies);
		}

		block.add_outro();
	}

	render(
		block,
		parent_node,
		parent_nodes
	) {
		const { renderer } = this;
		const { component } = renderer;

		const name = this.var;

		const component_opts = [];

		const statements = [];
		const updates = [];

		let props;
		const name_changes = block.get_unique_name(`${name}_changes`);

		const uses_spread = !!this.node.attributes.find(a => a.is_spread);

		const slot_props = Array.from(this.slots).map(([name, slot]) => `${quote_name_if_necessary(name)}: [${slot.block.name}${slot.fn ? `, ${slot.fn}` : ''}]`);

		const initial_props = slot_props.length > 0
			? [`$$slots: ${stringify_props(slot_props)}`, `$$scope: { ctx }`]
			: [];

		const attribute_object = uses_spread
			? stringify_props(initial_props)
			: stringify_props(
				this.node.attributes.map(attr => `${quote_name_if_necessary(attr.name)}: ${attr.get_value(block)}`).concat(initial_props)
			);

		if (this.node.attributes.length || this.node.bindings.length || initial_props.length) {
			if (!uses_spread && this.node.bindings.length === 0) {
				component_opts.push(`props: ${attribute_object}`);
			} else {
				props = block.get_unique_name(`${name}_props`);
				component_opts.push(`props: ${props}`);
			}
		}

		if (this.fragment) {
			const default_slot = this.slots.get('default');

			this.fragment.nodes.forEach((child) => {
				child.render(default_slot.block, null, 'nodes');
			});
		}

		if (component.compile_options.dev) {
			// TODO this is a terrible hack, but without it the component
			// will complain that options.target is missing. This would
			// work better if components had separate public and private
			// APIs
			component_opts.push(`$$inline: true`);
		}

		const fragment_dependencies = new Set(this.fragment ? ['$$scope'] : []);
		this.slots.forEach(slot => {
			slot.block.dependencies.forEach(name => {
				const is_let = slot.scope.is_let(name);
				const variable = renderer.component.var_lookup.get(name);

				if (is_let) fragment_dependencies.add(name);

				if (!variable) return;
				if (variable.mutated || variable.reassigned) fragment_dependencies.add(name);
				if (!variable.module && variable.writable && variable.export_name) fragment_dependencies.add(name);
			});
		});

		const non_let_dependencies = Array.from(fragment_dependencies).filter(name => !this.node.scope.is_let(name));

		if (!uses_spread && (this.node.attributes.filter(a => a.is_dynamic).length || this.node.bindings.length || non_let_dependencies.length > 0)) {
			updates.push(`var ${name_changes} = {};`);
		}

		if (this.node.attributes.length) {
			if (uses_spread) {
				const levels = block.get_unique_name(`${this.var}_spread_levels`);

				const initial_props = [];
				const changes = [];

				const all_dependencies = new Set();

				this.node.attributes.forEach(attr => {
					add_to_set(all_dependencies, attr.dependencies);
				});

				this.node.attributes.forEach(attr => {
					const { name, dependencies } = attr;

					const condition = dependencies.size > 0 && (dependencies.size !== all_dependencies.size)
						? `(${Array.from(dependencies).map(d => `changed.${d}`).join(' || ')})`
						: null;

					if (attr.is_spread) {
						const value = attr.expression.render(block);
						initial_props.push(value);

						changes.push(condition ? `${condition} && ${value}` : value);
					} else {
						const obj = `{ ${quote_name_if_necessary(name)}: ${attr.get_value(block)} }`;
						initial_props.push(obj);

						changes.push(condition ? `${condition} && ${obj}` : obj);
					}
				});

				block.builders.init.add_block(deindent`
					var ${levels} = [
						${initial_props.join(',\n')}
					];
				`);

				statements.push(deindent`
					for (var #i = 0; #i < ${levels}.length; #i += 1) {
						${props} = @assign(${props}, ${levels}[#i]);
					}
				`);

				const conditions = Array.from(all_dependencies).map(dep => `changed.${dep}`).join(' || ');

				updates.push(deindent`
					var ${name_changes} = ${all_dependencies.size === 1 ? `${conditions}` : `(${conditions})`} ? @get_spread_update(${levels}, [
						${changes.join(',\n')}
					]) : {};
				`);
			} else {
				this.node.attributes
					.filter((attribute) => attribute.is_dynamic)
					.forEach((attribute) => {
						if (attribute.dependencies.size > 0) {
							updates.push(deindent`
								if (${[...attribute.dependencies]
									.map(dependency => `changed.${dependency}`)
									.join(' || ')}) ${name_changes}${quote_prop_if_necessary(attribute.name)} = ${attribute.get_value(block)};
							`);
						}
					});
				}
		}

		if (non_let_dependencies.length > 0) {
			updates.push(`if (${non_let_dependencies.map(n => `changed.${n}`).join(' || ')}) ${name_changes}.$$scope = { changed, ctx };`);
		}

		const munged_bindings = this.node.bindings.map(binding => {
			component.has_reactive_assignments = true;

			if (binding.name === 'this') {
				const fn = component.get_unique_name(`${this.var}_binding`);

				component.add_var({
					name: fn,
					internal: true,
					referenced: true
				});

				let lhs;
				let object;

				if (binding.is_contextual && binding.expression.node.type === 'Identifier') {
					// bind:x={y} — we can't just do `y = x`, we need to
					// to `array[index] = x;
					const { name } = binding.expression.node;
					const { object, property, snippet } = block.bindings.get(name);
					lhs = snippet;

					// TODO we need to invalidate... something
				} else {
					object = flatten_reference(binding.expression.node).name;
					lhs = component.source.slice(binding.expression.node.start, binding.expression.node.end).trim();
				}

				component.partly_hoisted.push(deindent`
					function ${fn}($$component) {
						${lhs} = $$component;
						${object && component.invalidate(object)}
					}
				`);

				block.builders.destroy.add_line(`ctx.${fn}(null);`);
				return `@add_binding_callback(() => ctx.${fn}(${this.var}));`;
			}

			const name = component.get_unique_name(`${this.var}_${binding.name}_binding`);

			component.add_var({
				name,
				internal: true,
				referenced: true
			});

			const updating = block.get_unique_name(`updating_${binding.name}`);
			block.add_variable(updating);

			const snippet = binding.expression.render(block);

			statements.push(deindent`
				if (${snippet} !== void 0) {
					${props}${quote_prop_if_necessary(binding.name)} = ${snippet};
				}`
			);

			updates.push(deindent`
				if (!${updating} && ${[...binding.expression.dependencies].map((dependency) => `changed.${dependency}`).join(' || ')}) {
					${name_changes}${quote_prop_if_necessary(binding.name)} = ${snippet};
				}
			`);

			const contextual_dependencies = Array.from(binding.expression.contextual_dependencies);
			const dependencies = Array.from(binding.expression.dependencies);

			let lhs = component.source.slice(binding.expression.node.start, binding.expression.node.end).trim();

			if (binding.is_contextual && binding.expression.node.type === 'Identifier') {
				// bind:x={y} — we can't just do `y = x`, we need to
				// to `array[index] = x;
				const { name } = binding.expression.node;
				const { object, property, snippet } = block.bindings.get(name);
				lhs = snippet;
				contextual_dependencies.push(object, property);
			}

			const value = block.get_unique_name('value');
			const args = [value];
			if (contextual_dependencies.length > 0) {
				args.push(`{ ${contextual_dependencies.join(', ')} }`);

				block.builders.init.add_block(deindent`
					function ${name}(${value}) {
						ctx.${name}.call(null, ${value}, ctx);
						${updating} = true;
						@add_flush_callback(() => ${updating} = false);
					}
				`);

				block.maintain_context = true; // TODO put this somewhere more logical
			} else {
				block.builders.init.add_block(deindent`
					function ${name}(${value}) {
						ctx.${name}.call(null, ${value});
						${updating} = true;
						@add_flush_callback(() => ${updating} = false);
					}
				`);
			}

			const body = deindent`
				function ${name}(${args.join(', ')}) {
					${lhs} = ${value};
					${component.invalidate(dependencies[0])};
				}
			`;

			component.partly_hoisted.push(body);

			return `@add_binding_callback(() => @bind(${this.var}, '${binding.name}', ${name}));`;
		});

		const munged_handlers = this.node.handlers.map(handler => {
			const snippet = handler.render(block);
			return `${name}.$on("${handler.name}", ${snippet});`;
		});

		if (this.node.name === 'svelte:component') {
			const switch_value = block.get_unique_name('switch_value');
			const switch_props = block.get_unique_name('switch_props');

			const snippet = this.node.expression.render(block);

			block.builders.init.add_block(deindent`
				var ${switch_value} = ${snippet};

				function ${switch_props}(ctx) {
					${(this.node.attributes.length || this.node.bindings.length) && deindent`
					${props && `let ${props} = ${attribute_object};`}`}
					${statements}
					return ${stringify_props(component_opts)};
				}

				if (${switch_value}) {
					var ${name} = new ${switch_value}(${switch_props}(ctx));

					${munged_bindings}
					${munged_handlers}
				}
			`);

			block.builders.create.add_line(
				`if (${name}) ${name}.$$.fragment.c();`
			);

			if (parent_nodes && this.renderer.options.hydratable) {
				block.builders.claim.add_line(
					`if (${name}) ${name}.$$.fragment.l(${parent_nodes});`
				);
			}

			block.builders.mount.add_block(deindent`
				if (${name}) {
					@mount_component(${name}, ${parent_node || '#target'}, ${parent_node ? 'null' : 'anchor'});
				}
			`);

			const anchor = this.get_or_create_anchor(block, parent_node, parent_nodes);
			const update_mount_node = this.get_update_mount_node(anchor);

			if (updates.length) {
				block.builders.update.add_block(deindent`
					${updates}
				`);
			}

			block.builders.update.add_block(deindent`
				if (${switch_value} !== (${switch_value} = ${snippet})) {
					if (${name}) {
						@group_outros();
						const old_component = ${name};
						@on_outro(() => {
							old_component.$destroy();
						});
						old_component.$$.fragment.o(1);
						@check_outros();
					}

					if (${switch_value}) {
						${name} = new ${switch_value}(${switch_props}(ctx));

						${munged_bindings}
						${munged_handlers}

						${name}.$$.fragment.c();
						${name}.$$.fragment.i(1);
						@mount_component(${name}, ${update_mount_node}, ${anchor});
					} else {
						${name} = null;
					}
				}
			`);

			block.builders.intro.add_block(deindent`
				if (${name}) ${name}.$$.fragment.i(#local);
			`);

			if (updates.length) {
				block.builders.update.add_block(deindent`
					else if (${switch_value}) {
						${name}.$set(${name_changes});
					}
				`);
			}

			block.builders.outro.add_line(
				`if (${name}) ${name}.$$.fragment.o(#local);`
			);

			block.builders.destroy.add_line(`if (${name}) ${name}.$destroy(${parent_node ? '' : 'detaching'});`);
		} else {
			const expression = this.node.name === 'svelte:self'
				? '__svelte:self__' // TODO conflict-proof this
				: component.qualify(this.node.name);

			block.builders.init.add_block(deindent`
				${(this.node.attributes.length || this.node.bindings.length) && deindent`
				${props && `let ${props} = ${attribute_object};`}`}
				${statements}
				var ${name} = new ${expression}(${stringify_props(component_opts)});

				${munged_bindings}
				${munged_handlers}
			`);

			block.builders.create.add_line(`${name}.$$.fragment.c();`);

			if (parent_nodes && this.renderer.options.hydratable) {
				block.builders.claim.add_line(
					`${name}.$$.fragment.l(${parent_nodes});`
				);
			}

			block.builders.mount.add_line(
				`@mount_component(${name}, ${parent_node || '#target'}, ${parent_node ? 'null' : 'anchor'});`
			);

			block.builders.intro.add_block(deindent`
				${name}.$$.fragment.i(#local);
			`);

			if (updates.length) {
				block.builders.update.add_block(deindent`
					${updates}
					${name}.$set(${name_changes});
				`);
			}

			block.builders.destroy.add_block(deindent`
				${name}.$destroy(${parent_node ? '' : 'detaching'});
			`);

			block.builders.outro.add_line(
				`${name}.$$.fragment.o(#local);`
			);
		}
	}
}

class Tag extends Wrapper {
	

	constructor(renderer, block, parent, node) {
		super(renderer, block, parent, node);
		this.cannot_use_innerhtml();

		block.add_dependencies(node.expression.dependencies);
	}

	rename_this_method(
		block,
		update
	) {
		const dependencies = this.node.expression.dynamic_dependencies();
		const snippet = this.node.expression.render(block);

		const value = this.node.should_cache && block.get_unique_name(`${this.var}_value`);
		const content = this.node.should_cache ? value : snippet;

		if (this.node.should_cache) block.add_variable(value, snippet);

		if (dependencies.length > 0) {
			const changed_check = (
				(block.has_outros ? `!#current || ` : '') +
				dependencies.map((dependency) => `changed.${dependency}`).join(' || ')
			);

			const update_cached_value = `${value} !== (${value} = ${snippet})`;

			const condition =this.node.should_cache
				? `(${changed_check}) && ${update_cached_value}`
				: changed_check;

			block.builders.update.add_conditional(
				condition,
				update(content)
			);
		}

		return { init: content };
	}
}

class MustacheTagWrapper extends Tag {
	__init() {this.var = 't';}

	constructor(renderer, block, parent, node) {
		super(renderer, block, parent, node);MustacheTagWrapper.prototype.__init.call(this);		this.cannot_use_innerhtml();
	}

	render(block, parent_node, parent_nodes) {
		const { init } = this.rename_this_method(
			block,
			value => `@set_data(${this.var}, ${value});`
		);

		block.add_element(
			this.var,
			`@text(${init})`,
			parent_nodes && `@claim_text(${parent_nodes}, ${init})`,
			parent_node
		);
	}
}

class RawMustacheTagWrapper extends Tag {
	__init() {this.var = 'raw';}

	constructor(
		renderer,
		block,
		parent,
		node
	) {
		super(renderer, block, parent, node);RawMustacheTagWrapper.prototype.__init.call(this);		this.cannot_use_innerhtml();
	}

	render(block, parent_node, parent_nodes) {
		const name = this.var;

		// TODO use is_dom_node instead of type === 'Element'?
		const needs_anchor_before = this.prev ? this.prev.node.type !== 'Element' : !parent_node;
		const needs_anchor_after = this.next ? this.next.node.type !== 'Element' : !parent_node;

		const anchor_before = needs_anchor_before
			? block.get_unique_name(`${name}_before`)
			: (this.prev && this.prev.var) || 'null';

		const anchor_after = needs_anchor_after
			? block.get_unique_name(`${name}_after`)
			: (this.next && this.next.var) || 'null';

		let detach;
		let insert;
		let use_innerhtml = false;

		if (anchor_before === 'null' && anchor_after === 'null') {
			use_innerhtml = true;
			detach = `${parent_node}.innerHTML = '';`;
			insert = content => `${parent_node}.innerHTML = ${content};`;
		} else if (anchor_before === 'null') {
			detach = `@detach_before(${anchor_after});`;
			insert = content => `${anchor_after}.insertAdjacentHTML("beforebegin", ${content});`;
		} else if (anchor_after === 'null') {
			detach = `@detach_after(${anchor_before});`;
			insert = content => `${anchor_before}.insertAdjacentHTML("afterend", ${content});`;
		} else {
			detach = `@detach_between(${anchor_before}, ${anchor_after});`;
			insert = content => `${anchor_before}.insertAdjacentHTML("afterend", ${content});`;
		}

		const { init } = this.rename_this_method(
			block,
			content => deindent`
				${!use_innerhtml && detach}
				${insert(content)}
			`
		);

		// we would have used comments here, but the `insertAdjacentHTML` api only
		// exists for `Element`s.
		if (needs_anchor_before) {
			block.add_element(
				anchor_before,
				`@element('noscript')`,
				parent_nodes && `@element('noscript')`,
				parent_node,
				true
			);
		}

		function add_anchor_after() {
			block.add_element(
				anchor_after,
				`@element('noscript')`,
				parent_nodes && `@element('noscript')`,
				parent_node
			);
		}

		if (needs_anchor_after && anchor_before === 'null') {
			// anchor_after needs to be in the DOM before we
			// insert the HTML...
			add_anchor_after();
		}

		block.builders.mount.add_line(insert(init));

		if (!parent_node) {
			block.builders.destroy.add_conditional('detaching', needs_anchor_before
				? `${detach}\n@detach(${anchor_before});`
				: detach);
		}

		if (needs_anchor_after && anchor_before !== 'null') {
			// ...otherwise it should go afterwards
			add_anchor_after();
		}
	}
}

function snip(expression) {
	return `[✂${expression.node.start}-${expression.node.end}✂]`;
}

function stringify_attribute(attribute, is_ssr) {
	return attribute.chunks
		.map((chunk) => {
			if (chunk.type === 'Text') {
				return escape_template(escape$1(chunk.data).replace(/"/g, '&quot;'));
			}

			return is_ssr
				? '${@escape(' + snip(chunk) + ')}'
				: '${' + snip(chunk) + '}';
		})
		.join('');
}

function get_slot_data(values, is_ssr) {
	return Array.from(values.values())
		.filter(attribute => attribute.name !== 'name')
		.map(attribute => {
			const value = attribute.is_true
				? 'true'
				: attribute.chunks.length === 0
					? '""'
					: attribute.chunks.length === 1 && attribute.chunks[0].type !== 'Text'
						? snip(attribute.chunks[0])
						: '`' + stringify_attribute(attribute, is_ssr) + '`';

			return `${attribute.name}: ${value}`;
		});
}

class SlotWrapper extends Wrapper {
	
	

	__init() {this.var = 'slot';}
	__init2() {this.dependencies = new Set(['$$scope']);}

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);SlotWrapper.prototype.__init.call(this);SlotWrapper.prototype.__init2.call(this);		this.cannot_use_innerhtml();

		this.fragment = new FragmentWrapper(
			renderer,
			block,
			node.children,
			parent,
			strip_whitespace,
			next_sibling
		);

		this.node.values.forEach(attribute => {
			add_to_set(this.dependencies, attribute.dependencies);
		});

		block.add_dependencies(this.dependencies);

		// we have to do this, just in case
		block.add_intro();
		block.add_outro();
	}

	render(
		block,
		parent_node,
		parent_nodes
	) {
		const { renderer } = this;

		const { slot_name } = this.node;

		let get_slot_changes;
		let get_slot_context;

		if (this.node.values.size > 0) {
			get_slot_changes = renderer.component.get_unique_name(`get_${sanitize(slot_name)}_slot_changes`);
			get_slot_context = renderer.component.get_unique_name(`get_${sanitize(slot_name)}_slot_context`);

			const context_props = get_slot_data(this.node.values, false);
			const changes_props = [];

			const dependencies = new Set();

			this.node.values.forEach(attribute => {
				attribute.chunks.forEach(chunk => {
					if ((chunk ).dependencies) {
						add_to_set(dependencies, (chunk ).dependencies);
						add_to_set(dependencies, (chunk ).contextual_dependencies);
					}
				});

				if (attribute.dependencies.size > 0) {
					changes_props.push(`${attribute.name}: ${[...attribute.dependencies].join(' || ')}`);
				}
			});

			const arg = dependencies.size > 0 ? `{ ${Array.from(dependencies).join(', ')} }` : '{}';

			renderer.blocks.push(deindent`
				const ${get_slot_changes} = (${arg}) => (${stringify_props(changes_props)});
				const ${get_slot_context} = (${arg}) => (${stringify_props(context_props)});
			`);
		} else {
			get_slot_changes = 'null';
			get_slot_context = 'null';
		}

		const slot = block.get_unique_name(`${sanitize(slot_name)}_slot`);
		const slot_definition = block.get_unique_name(`${sanitize(slot_name)}_slot`);

		block.builders.init.add_block(deindent`
			const ${slot_definition} = ctx.$$slots${quote_prop_if_necessary(slot_name)};
			const ${slot} = @create_slot(${slot_definition}, ctx, ${get_slot_context});
		`);

		let mount_before = block.builders.mount.toString();

		block.builders.create.push_condition(`!${slot}`);
		block.builders.claim.push_condition(`!${slot}`);
		block.builders.hydrate.push_condition(`!${slot}`);
		block.builders.mount.push_condition(`!${slot}`);
		block.builders.update.push_condition(`!${slot}`);
		block.builders.destroy.push_condition(`!${slot}`);

		const listeners = block.event_listeners;
		block.event_listeners = [];
		this.fragment.render(block, parent_node, parent_nodes);
		block.render_listeners(`_${slot}`);
		block.event_listeners = listeners;

		block.builders.create.pop_condition();
		block.builders.claim.pop_condition();
		block.builders.hydrate.pop_condition();
		block.builders.mount.pop_condition();
		block.builders.update.pop_condition();
		block.builders.destroy.pop_condition();

		block.builders.create.add_line(
			`if (${slot}) ${slot}.c();`
		);

		block.builders.claim.add_line(
			`if (${slot}) ${slot}.l(${parent_nodes});`
		);

		const mount_leadin = block.builders.mount.toString() !== mount_before
			? `else`
			: `if (${slot})`;

		block.builders.mount.add_block(deindent`
			${mount_leadin} {
				${slot}.m(${parent_node || '#target'}, ${parent_node ? 'null' : 'anchor'});
			}
		`);

		block.builders.intro.add_line(
			`if (${slot} && ${slot}.i) ${slot}.i(#local);`
		);

		block.builders.outro.add_line(
			`if (${slot} && ${slot}.o) ${slot}.o(#local);`
		);

		let update_conditions = [...this.dependencies].map(name => `changed.${name}`).join(' || ');
		if (this.dependencies.size > 1) update_conditions = `(${update_conditions})`;

		block.builders.update.add_block(deindent`
			if (${slot} && ${slot}.p && ${update_conditions}) {
				${slot}.p(@get_slot_changes(${slot_definition}, ctx, changed, ${get_slot_changes}), @get_slot_context(${slot_definition}, ctx, ${get_slot_context}));
			}
		`);

		block.builders.destroy.add_line(
			`if (${slot}) ${slot}.d(detaching);`
		);
	}
}

// Whitespace inside one of these elements will not result in
// a whitespace node being created in any circumstances. (This
// list is almost certainly very incomplete)
const elements_without_text = new Set([
	'audio',
	'datalist',
	'dl',
	'optgroup',
	'select',
	'video',
]);

// TODO this should probably be in Fragment
function should_skip(node) {
	if (/\S/.test(node.data)) return false;

	const parent_element = node.find_nearest(/(?:Element|InlineComponent|Head)/);
	if (!parent_element) return false;

	if (parent_element.type === 'Head') return true;
	if (parent_element.type === 'InlineComponent') return parent_element.children.length === 1 && node === parent_element.children[0];

	return parent_element.namespace || elements_without_text.has(parent_element.name);
}

class TextWrapper extends Wrapper {
	
	
	
	

	constructor(
		renderer,
		block,
		parent,
		node,
		data
	) {
		super(renderer, block, parent, node);

		this.skip = should_skip(this.node);
		this.data = data;
		this.var = this.skip ? null : 't';
	}

	render(block, parent_node, parent_nodes) {
		if (this.skip) return;

		block.add_element(
			this.var,
			this.node.use_space ? `@space()` : `@text(${stringify(this.data)})`,
			parent_nodes && `@claim_text(${parent_nodes}, ${stringify(this.data)})`,
			parent_node
		);
	}
}

class TitleWrapper extends Wrapper {
	

	constructor(
		renderer,
		block,
		parent,
		node,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);
	}

	render(block, parent_node, parent_nodes) {
		const is_dynamic = !!this.node.children.find(node => node.type !== 'Text');

		if (is_dynamic) {
			let value;

			const all_dependencies = new Set();

			// TODO some of this code is repeated in Tag.ts — would be good to
			// DRY it out if that's possible without introducing crazy indirection
			if (this.node.children.length === 1) {
				// single {tag} — may be a non-string
				const { expression } = this.node.children[0];
				value = expression.render(block);
				add_to_set(all_dependencies, expression.dependencies);
			} else {
				// '{foo} {bar}' — treat as string concatenation
				value =
					(this.node.children[0].type === 'Text' ? '' : `"" + `) +
					this.node.children
						.map((chunk) => {
							if (chunk.type === 'Text') {
								return stringify(chunk.data);
							} else {
								const snippet = chunk.expression.render(block);

								chunk.expression.dependencies.forEach(d => {
									all_dependencies.add(d);
								});

								return chunk.expression.get_precedence() <= 13 ? `(${snippet})` : snippet;
							}
						})
						.join(' + ');
			}

			const last = this.node.should_cache && block.get_unique_name(
				`title_value`
			);

			if (this.node.should_cache) block.add_variable(last);

			let updater;
			const init = this.node.should_cache ? `${last} = ${value}` : value;

			block.builders.init.add_line(
				`document.title = ${init};`
			);
			updater = `document.title = ${this.node.should_cache ? last : value};`;

			if (all_dependencies.size) {
				const dependencies = Array.from(all_dependencies);
				const changed_check = (
					(block.has_outros ? `!#current || ` : '') +
					dependencies.map(dependency => `changed.${dependency}`).join(' || ')
				);

				const update_cached_value = `${last} !== (${last} = ${value})`;

				const condition = this.node.should_cache ?
					(dependencies.length ? `(${changed_check}) && ${update_cached_value}` : update_cached_value) :
					changed_check;

				block.builders.update.add_conditional(
					condition,
					updater
				);
			}
		} else {
			const value = stringify(this.node.children[0].data);
			block.builders.hydrate.add_line(`document.title = ${value};`);
		}
	}
}

const associated_events = {
	innerWidth: 'resize',
	innerHeight: 'resize',
	outerWidth: 'resize',
	outerHeight: 'resize',

	scrollX: 'scroll',
	scrollY: 'scroll',
};

const properties = {
	scrollX: 'pageXOffset',
	scrollY: 'pageYOffset'
};

const readonly = new Set([
	'innerWidth',
	'innerHeight',
	'outerWidth',
	'outerHeight',
	'online',
]);

class WindowWrapper extends Wrapper {
	

	constructor(renderer, block, parent, node) {
		super(renderer, block, parent, node);
	}

	render(block, parent_node, parent_nodes) {
		const { renderer } = this;
		const { component } = renderer;

		const events = {};
		const bindings = {};

		add_actions(component, block, 'window', this.node.actions);
		add_event_handlers(block, 'window', this.node.handlers);

		this.node.bindings.forEach(binding => {
			// in dev mode, throw if read-only values are written to
			if (readonly.has(binding.name)) {
				renderer.readonly.add(binding.expression.node.name);
			}

			bindings[binding.name] = binding.expression.node.name;

			// bind:online is a special case, we need to listen for two separate events
			if (binding.name === 'online') return;

			const associated_event = associated_events[binding.name];
			const property = properties[binding.name] || binding.name;

			if (!events[associated_event]) events[associated_event] = [];
			events[associated_event].push({
				name: binding.expression.node.name,
				value: property
			});
		});

		const scrolling = block.get_unique_name(`scrolling`);
		const clear_scrolling = block.get_unique_name(`clear_scrolling`);
		const scrolling_timeout = block.get_unique_name(`scrolling_timeout`);

		Object.keys(events).forEach(event => {
			const handler_name = block.get_unique_name(`onwindow${event}`);
			const props = events[event];

			if (event === 'scroll') {
				// TODO other bidirectional bindings...
				block.add_variable(scrolling, 'false');
				block.add_variable(clear_scrolling, `() => { ${scrolling} = false }`);
				block.add_variable(scrolling_timeout);

				const condition = [
					bindings.scrollX && `"${bindings.scrollX}" in this._state`,
					bindings.scrollY && `"${bindings.scrollY}" in this._state`
				].filter(Boolean).join(' || ');

 				const x = bindings.scrollX && `this._state.${bindings.scrollX}`;
				const y = bindings.scrollY && `this._state.${bindings.scrollY}`;

				renderer.meta_bindings.add_block(deindent`
					if (${condition}) {
						window.scrollTo(${x || 'window.pageXOffset'}, ${y || 'window.pageYOffset'});
					}
					${x && `${x} = window.pageXOffset;`}
					${y && `${y} = window.pageYOffset;`}
				`);

				block.event_listeners.push(deindent`
					@listen(window, "${event}", () => {
						${scrolling} = true;
						clearTimeout(${scrolling_timeout});
						${scrolling_timeout} = setTimeout(${clear_scrolling}, 100);
						ctx.${handler_name}();
					})
				`);
			} else {
				props.forEach(prop => {
					renderer.meta_bindings.add_line(
						`this._state.${prop.name} = window.${prop.value};`
					);
				});

				block.event_listeners.push(deindent`
					@listen(window, "${event}", ctx.${handler_name})
				`);
			}

			component.add_var({
				name: handler_name,
				internal: true,
				referenced: true
			});

			component.partly_hoisted.push(deindent`
				function ${handler_name}() {
					${props.map(prop => `${prop.name} = window.${prop.value}; $$invalidate('${prop.name}', ${prop.name});`)}
				}
			`);

			block.builders.init.add_block(deindent`
				@add_render_callback(ctx.${handler_name});
			`);

			component.has_reactive_assignments = true;
		});

		// special case... might need to abstract this out if we add more special cases
		if (bindings.scrollX || bindings.scrollY) {
			block.builders.update.add_block(deindent`
				if (${
					[bindings.scrollX, bindings.scrollY].filter(Boolean).map(
						b => `changed.${b}`
					).join(' || ')
				} && !${scrolling}) {
					${scrolling} = true;
					clearTimeout(${scrolling_timeout});
					window.scrollTo(${
						bindings.scrollX ? `ctx.${bindings.scrollX}` : `window.pageXOffset`
					}, ${
						bindings.scrollY ? `ctx.${bindings.scrollY}` : `window.pageYOffset`
					});
					${scrolling_timeout} = setTimeout(${clear_scrolling}, 100);
				}
			`);
		}

		// another special case. (I'm starting to think these are all special cases.)
		if (bindings.online) {
			const handler_name = block.get_unique_name(`onlinestatuschanged`);
			const name = bindings.online;

			component.add_var({
				name: handler_name,
				internal: true,
				referenced: true
			});

			component.partly_hoisted.push(deindent`
				function ${handler_name}() {
					${name} = navigator.onLine; $$invalidate('${name}', ${name});
				}
			`);

			block.builders.init.add_block(deindent`
				@add_render_callback(ctx.${handler_name});
			`);

			block.event_listeners.push(
				`@listen(window, "online", ctx.${handler_name})`,
				`@listen(window, "offline", ctx.${handler_name})`
			);

			component.has_reactive_assignments = true;
		}
	}
}

const wrappers = {
	AwaitBlock: AwaitBlockWrapper,
	Body: BodyWrapper,
	Comment: null,
	DebugTag: DebugTagWrapper,
	EachBlock: EachBlockWrapper,
	Element: ElementWrapper,
	Head: HeadWrapper,
	IfBlock: IfBlockWrapper,
	InlineComponent: InlineComponentWrapper,
	MustacheTag: MustacheTagWrapper,
	Options: null,
	RawMustacheTag: RawMustacheTagWrapper,
	Slot: SlotWrapper,
	Text: TextWrapper,
	Title: TitleWrapper,
	Window: WindowWrapper
};

function link(next, prev) {
	prev.next = next;
	if (next) next.prev = prev;
}

class FragmentWrapper {
	

	constructor(
		renderer,
		block,
		nodes,
		parent,
		strip_whitespace,
		next_sibling
	) {
		this.nodes = [];

		let last_child;
		let window_wrapper;

		let i = nodes.length;
		while (i--) {
			const child = nodes[i];

			if (!child.type) {
				throw new Error(`missing type`)
			}

			if (!(child.type in wrappers)) {
				throw new Error(`TODO implement ${child.type}`);
			}

			// special case — this is an easy way to remove whitespace surrounding
			// <svelte:window/>. lil hacky but it works
			if (child.type === 'Window') {
				window_wrapper = new WindowWrapper(renderer, block, parent, child);
				continue;
			}

			if (child.type === 'Text') {
				let { data } = child;

				// We want to remove trailing whitespace inside an element/component/block,
				// *unless* there is no whitespace between this node and its next sibling
				if (this.nodes.length === 0) {
					const should_trim = (
						next_sibling ? (next_sibling.node.type === 'Text' && /^\s/.test(next_sibling.data)) : !child.has_ancestor('EachBlock')
					);

					if (should_trim) {
						data = trim_end(data);
						if (!data) continue;
					}
				}

				// glue text nodes (which could e.g. be separated by comments) together
				if (last_child && last_child.node.type === 'Text') {
					last_child.data = data + last_child.data;
					continue;
				}

				const wrapper = new TextWrapper(renderer, block, parent, child, data);
				if (wrapper.skip) continue;

				this.nodes.unshift(wrapper);

				link(last_child, last_child = wrapper);
			} else {
				const Wrapper = wrappers[child.type];
				if (!Wrapper) continue;

				const wrapper = new Wrapper(renderer, block, parent, child, strip_whitespace, last_child || next_sibling);
				this.nodes.unshift(wrapper);

				link(last_child, last_child = wrapper);
			}
		}

		if (strip_whitespace) {
			const first = this.nodes[0] ;

			if (first && first.node.type === 'Text') {
				first.data = trim_start(first.data);
				if (!first.data) {
					first.var = null;
					this.nodes.shift();

					if (this.nodes[0]) {
						this.nodes[0].prev = null;
					}
				}
			}
		}

		if (window_wrapper) {
			this.nodes.unshift(window_wrapper);
			link(last_child, window_wrapper);
		}
	}

	render(block, parent_node, parent_nodes) {
		for (let i = 0; i < this.nodes.length; i += 1) {
			this.nodes[i].render(block, parent_node, parent_nodes);
		}
	}
}

class Renderer {
	 // TODO Maybe Renderer shouldn't know about Component?
	

	__init() {this.blocks = [];}
	__init2() {this.readonly = new Set();}
	__init3() {this.meta_bindings = new CodeBuilder();} // initial values for e.g. window.innerWidth, if there's a <svelte:window> meta tag
	__init4() {this.binding_groups = [];}

	
	

	

	constructor(component, options) {Renderer.prototype.__init.call(this);Renderer.prototype.__init2.call(this);Renderer.prototype.__init3.call(this);Renderer.prototype.__init4.call(this);
		this.component = component;
		this.options = options;
		this.locate = component.locate; // TODO messy

		this.file_var = options.dev && this.component.get_unique_name('file');

		// main block
		this.block = new Block({
			renderer: this,
			name: null,
			key: null,

			bindings: new Map(),

			dependencies: new Set(),
		});

		this.block.has_update_method = true;

		this.fragment = new FragmentWrapper(
			this,
			this.block,
			component.fragment.children,
			null,
			true,
			null
		);

		this.blocks.forEach(block => {
			if (typeof block !== 'string') {
				block.assign_variable_names();
			}
		});

		this.block.assign_variable_names();

		this.fragment.render(this.block, null, 'nodes');
	}
}

function isReference(node, parent) {
    if (node.type === 'MemberExpression') {
        return !node.computed && isReference(node.object, node);
    }
    if (node.type === 'Identifier') {
        // the only time we could have an identifier node without a parent is
        // if it's the entire body of a function without a block statement –
        // i.e. an arrow function expression like `a => a`
        if (!parent)
            return true;
        if (parent.type === 'MemberExpression')
            return parent.computed || node === parent.object;
        if (parent.type === 'MethodDefinition')
            return parent.computed;
        // disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
        if (parent.type === 'Property')
            return parent.computed || node === parent.value;
        // disregard the `bar` in `export { foo as bar }`
        if (parent.type === 'ExportSpecifier' && node !== parent.local)
            return false;
        // disregard the foo in `foo: bar`
        if (parent.type === 'LabeledStatement')
            return false;
        return true;
    }
    return false;
}

function create_scopes(expression) {
	const map = new WeakMap();

	const globals = new Map();
	let scope = new Scope(null, false);

	walk(expression, {
		enter(node, parent) {
			if (node.type === 'ImportDeclaration') {
				node.specifiers.forEach(specifier => {
					scope.declarations.set(specifier.local.name, specifier);
				});
			} else if (/Function/.test(node.type)) {
				if (node.type === 'FunctionDeclaration') {
					scope.declarations.set(node.id.name, node);
					scope = new Scope(scope, false);
					map.set(node, scope);
				} else {
					scope = new Scope(scope, false);
					map.set(node, scope);
					if (node.id) scope.declarations.set(node.id.name, node);
				}

				node.params.forEach((param) => {
					extract_names(param).forEach(name => {
						scope.declarations.set(name, node);
					});
				});
			} else if (/For(?:In|Of)?Statement/.test(node.type)) {
				scope = new Scope(scope, true);
				map.set(node, scope);
			} else if (node.type === 'BlockStatement') {
				scope = new Scope(scope, true);
				map.set(node, scope);
			} else if (/(Class|Variable)Declaration/.test(node.type)) {
				scope.add_declaration(node);
			} else if (node.type === 'Identifier' && isReference(node, parent)) {
				if (!scope.has(node.name) && !globals.has(node.name)) {
					globals.set(node.name, node);
				}
			}
		},

		leave(node) {
			if (map.has(node)) {
				scope = scope.parent;
			}
		},
	});

	scope.declarations.forEach((node, name) => {
		globals.delete(name);
	});

	return { map, scope, globals };
}

class Scope {
	
	

	__init() {this.declarations = new Map();}
	__init2() {this.initialised_declarations = new Set();}

	constructor(parent, block) {Scope.prototype.__init.call(this);Scope.prototype.__init2.call(this);
		this.parent = parent;
		this.block = block;
	}

	add_declaration(node) {
		if (node.kind === 'var' && this.block && this.parent) {
			this.parent.add_declaration(node);
		} else if (node.type === 'VariableDeclaration') {
			node.declarations.forEach((declarator) => {
				extract_names(declarator.id).forEach(name => {
					this.declarations.set(name, node);
					if (declarator.init) this.initialised_declarations.add(name);
				});
			});
		} else {
			this.declarations.set(node.id.name, node);
		}
	}

	find_owner(name) {
		if (this.declarations.has(name)) return this;
		return this.parent && this.parent.find_owner(name);
	}

	has(name) {
		return (
			this.declarations.has(name) || (this.parent && this.parent.has(name))
		);
	}
}

function extract_names(param) {
	return extract_identifiers(param).map(node => node.name);
}

function extract_identifiers(param) {
	const nodes = [];
	extractors[param.type] && extractors[param.type](nodes, param);
	return nodes;
}

const extractors = {
	Identifier(nodes, param) {
		nodes.push(param);
	},

	ObjectPattern(nodes, param) {
		param.properties.forEach((prop) => {
			if (prop.type === 'RestElement') {
				nodes.push(prop.argument);
			} else {
				extractors[prop.value.type](nodes, prop.value);
			}
		});
	},

	ArrayPattern(nodes, param) {
		param.elements.forEach((element) => {
			if (element) extractors[element.type](nodes, element);
		});
	},

	RestElement(nodes, param) {
		extractors[param.argument.type](nodes, param.argument);
	},

	AssignmentPattern(nodes, param) {
		extractors[param.left.type](nodes, param.left);
	}
};

function nodes_match(a, b) {
	if (!!a !== !!b) return false;
	if (Array.isArray(a) !== Array.isArray(b)) return false;

	if (a && typeof a === 'object') {
		if (Array.isArray(a)) {
			if (a.length !== b.length) return false;
			return a.every((child, i) => nodes_match(child, b[i]));
		}

		const a_keys = Object.keys(a).sort();
		const b_keys = Object.keys(b).sort();

		if (a_keys.length !== b_keys.length) return false;

		let i = a_keys.length;
		while (i--) {
			const key = a_keys[i];
			if (b_keys[i] !== key) return false;

			if (key === 'start' || key === 'end') continue;

			if (!nodes_match(a[key], b[key])) {
				return false;
			}
		}

		return true;
	}

	return a === b;
}

function dom(
	component,
	options
) {
	const { name, code } = component;

	const renderer = new Renderer(component, options);
	const { block } = renderer;

	block.has_outro_method = true;

	// prevent fragment being created twice (#1063)
	if (options.customElement) block.builders.create.add_line(`this.c = @noop;`);

	const builder = new CodeBuilder();

	if (component.compile_options.dev) {
		builder.add_line(`const ${renderer.file_var} = ${JSON.stringify(component.file)};`);
	}

	const css = component.stylesheet.render(options.filename, !options.customElement);
	const styles = component.stylesheet.has_styles && stringify(options.dev ?
		`${css.code}\n/*# sourceMappingURL=${css.map.toUrl()} */` :
		css.code, { only_escape_at_symbol: true });

	if (styles && component.compile_options.css !== false && !options.customElement) {
		builder.add_block(deindent`
			function @add_css() {
				var style = @element("style");
				style.id = '${component.stylesheet.id}-style';
				style.textContent = ${styles};
				@append(document.head, style);
			}
		`);
	}

	// fix order
	// TODO the deconflicted names of blocks are reversed... should set them here
	const blocks = renderer.blocks.slice().reverse();

	blocks.forEach(block => {
		builder.add_block(block.toString());
	});

	if (options.dev && !options.hydratable) {
		block.builders.claim.add_line(
			'throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");'
		);
	}

	// TODO injecting CSS this way is kinda dirty. Maybe it should be an
	// explicit opt-in, or something?
	const should_add_css = (
		!options.customElement &&
		component.stylesheet.has_styles &&
		options.css !== false
	);

	const uses_props = component.var_lookup.has('$$props');
	const $$props = uses_props ? `$$new_props` : `$$props`;
	const props = component.vars.filter(variable => !variable.module && variable.export_name);
	const writable_props = props.filter(variable => variable.writable);

	const set = (uses_props || writable_props.length > 0 || component.slots.size > 0)
		? deindent`
			${$$props} => {
				${uses_props && component.invalidate('$$props', `$$props = @assign(@assign({}, $$props), $$new_props)`)}
				${writable_props.map(prop =>
				`if ('${prop.export_name}' in $$props) ${component.invalidate(prop.name, `${prop.name} = $$props.${prop.export_name}`)};`
				)}
				${component.slots.size > 0 &&
				`if ('$$scope' in ${$$props}) ${component.invalidate('$$scope', `$$scope = ${$$props}.$$scope`)};`}
			}
		`
		: null;

	const body = [];

	const not_equal = component.component_options.immutable ? `@not_equal` : `@safe_not_equal`;
	let dev_props_check;

	props.forEach(x => {
		const variable = component.var_lookup.get(x.name);

		if (!variable.writable || component.component_options.accessors) {
			body.push(deindent`
				get ${x.export_name}() {
					return ${x.hoistable ? x.name : 'this.$$.ctx.' + x.name};
				}
			`);
		} else if (component.compile_options.dev) {
			body.push(deindent`
				get ${x.export_name}() {
					throw new Error("<${component.tag}>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
				}
			`);
		}

		if (component.component_options.accessors) {
			if (variable.writable && !renderer.readonly.has(x.name)) {
				body.push(deindent`
					set ${x.export_name}(${x.name}) {
						this.$set({ ${x.name === x.export_name ? x.name : `${x.export_name}: ${x.name}`} });
						@flush();
					}
				`);
			} else if (component.compile_options.dev) {
				body.push(deindent`
					set ${x.export_name}(value) {
						throw new Error("<${component.tag}>: Cannot set read-only property '${x.export_name}'");
					}
				`);
			}
		} else if (component.compile_options.dev) {
			body.push(deindent`
				set ${x.export_name}(value) {
					throw new Error("<${component.tag}>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
				}
			`);
		}
	});

	if (component.compile_options.dev) {
		// TODO check no uunexpected props were passed, as well as
		// checking that expected ones were passed
		const expected = props.filter(prop => !prop.initialised);

		if (expected.length) {
			dev_props_check = deindent`
				const { ctx } = this.$$;
				const props = ${options.customElement ? `this.attributes` : `options.props || {}`};
				${expected.map(prop => deindent`
				if (ctx.${prop.name} === undefined && !('${prop.export_name}' in props)) {
					console.warn("<${component.tag}> was created without expected prop '${prop.export_name}'");
				}`)}
			`;
		}
	}

	// instrument assignments
	if (component.ast.instance) {
		let scope = component.instance_scope;
		let map = component.instance_scope_map;

		let pending_assignments = new Set();

		walk(component.ast.instance.content, {
			enter: (node, parent) => {
				if (map.has(node)) {
					scope = map.get(node);
				}
			},

			leave(node, parent) {
				if (map.has(node)) {
					scope = scope.parent;
				}

				if (node.type === 'AssignmentExpression' || node.type === 'UpdateExpression') {
					const assignee = node.type === 'AssignmentExpression' ? node.left : node.argument;
					let names = [];

					if (assignee.type === 'MemberExpression') {
						const left_object_name = get_object(assignee).name;
						left_object_name && (names = [left_object_name]);
					} else {
						names = extract_names(assignee);
					}

					if (node.operator === '=' && nodes_match(node.left, node.right)) {
						const dirty = names.filter(name => {
							return name[0] === '$' || scope.find_owner(name) === component.instance_scope;
						});

						if (dirty.length) component.has_reactive_assignments = true;

						code.overwrite(node.start, node.end, dirty.map(n => component.invalidate(n)).join('; '));
					} else {
						const single = (
							node.type === 'AssignmentExpression' &&
							assignee.type === 'Identifier' &&
							parent.type === 'ExpressionStatement' &&
							assignee.name[0] !== '$'
						);

						names.forEach(name => {
							const owner = scope.find_owner(name);
							if (owner && owner !== component.instance_scope) return;

							const variable = component.var_lookup.get(name);
							if (variable && (variable.hoistable || variable.global || variable.module)) return;

							if (single && !(variable.subscribable && variable.reassigned)) {
								code.prependRight(node.start, `$$invalidate('${name}', `);
								code.appendLeft(node.end, `)`);
							} else {
								pending_assignments.add(name);
							}

							component.has_reactive_assignments = true;
						});
					}
				}

				if (pending_assignments.size > 0) {
					if (node.type === 'ArrowFunctionExpression') {
						const insert = Array.from(pending_assignments).map(name => component.invalidate(name)).join('; ');
						pending_assignments = new Set();

						code.prependRight(node.body.start, `{ const $$result = `);
						code.appendLeft(node.body.end, `; ${insert}; return $$result; }`);

						pending_assignments = new Set();
					}

					else if (/Statement/.test(node.type)) {
						const insert = Array.from(pending_assignments).map(name => component.invalidate(name)).join('; ');

						if (/^(Break|Continue|Return)Statement/.test(node.type)) {
							if (node.argument) {
								code.overwrite(node.start, node.argument.start, `var $$result = `);
								code.appendLeft(node.argument.end, `; ${insert}; return $$result`);
							} else {
								code.prependRight(node.start, `${insert}; `);
							}
						} else if (parent && /(If|For(In|Of)?|While)Statement/.test(parent.type) && node.type !== 'BlockStatement') {
							code.prependRight(node.start, '{ ');
							code.appendLeft(node.end, `${code.original[node.end - 1] === ';' ? '' : ';'} ${insert}; }`);
						} else {
							code.appendLeft(node.end, `${code.original[node.end - 1] === ';' ? '' : ';'} ${insert};`);
						}

						pending_assignments = new Set();
					}
				}
			}
		});

		if (pending_assignments.size > 0) {
			throw new Error(`TODO this should not happen!`);
		}

		component.rewrite_props(({ name, reassigned }) => {
			const value = `$${name}`;

			const callback = `$value => { ${value} = $$value; $$invalidate('${value}', ${value}) }`;

			if (reassigned) {
				return `$$subscribe_${name}()`;
			}

			const subscribe = component.helper('subscribe');

			let insert = `${subscribe}($$self, ${name}, $${callback})`;
			if (component.compile_options.dev) {
				const validate_store = component.helper('validate_store');
				insert = `${validate_store}(${name}, '${name}'); ${insert}`;
			}

			return insert;
		});
	}

	const args = ['$$self'];
	if (props.length > 0 || component.has_reactive_assignments || component.slots.size > 0) {
		args.push('$$props', '$$invalidate');
	}

	builder.add_block(deindent`
		function create_fragment(ctx) {
			${block.get_contents()}
		}

		${component.module_javascript}

		${component.fully_hoisted.length > 0 && component.fully_hoisted.join('\n\n')}
	`);

	const filtered_declarations = component.vars
		.filter(v => ((v.referenced || v.export_name) && !v.hoistable))
		.map(v => v.name);

	if (uses_props) filtered_declarations.push(`$$props: $$props = ${component.helper('exclude_internal_props')}($$props)`);

	const filtered_props = props.filter(prop => {
		const variable = component.var_lookup.get(prop.name);

		if (variable.hoistable) return false;
		if (prop.name[0] === '$') return false;
		return true;
	});

	const reactive_stores = component.vars.filter(variable => variable.name[0] === '$' && variable.name[1] !== '$');

	if (component.slots.size > 0) {
		filtered_declarations.push('$$slots', '$$scope');
	}

	if (renderer.binding_groups.length > 0) {
		filtered_declarations.push(`$$binding_groups`);
	}

	const has_definition = (
		component.javascript ||
		filtered_props.length > 0 ||
		uses_props ||
		component.partly_hoisted.length > 0 ||
		filtered_declarations.length > 0 ||
		component.reactive_declarations.length > 0
	);

	const definition = has_definition
		? component.alias('instance')
		: 'null';

	const all_reactive_dependencies = new Set();
	component.reactive_declarations.forEach(d => {
		add_to_set(all_reactive_dependencies, d.dependencies);
	});

	const reactive_store_subscriptions = reactive_stores
		.filter(store => {
			const variable = component.var_lookup.get(store.name.slice(1));
			return !variable || variable.hoistable;
		})
		.map(({ name }) => deindent`
			${component.compile_options.dev && `@validate_store(${name.slice(1)}, '${name.slice(1)}');`}
			@subscribe($$self, ${name.slice(1)}, $$value => { ${name} = $$value; $$invalidate('${name}', ${name}); });
		`);

	const resubscribable_reactive_store_unsubscribers = reactive_stores
		.filter(store => {
			const variable = component.var_lookup.get(store.name.slice(1));
			return variable && variable.reassigned;
		})
		.map(({ name }) => `$$self.$$.on_destroy.push(() => $$unsubscribe_${name.slice(1)}());`);

	if (has_definition) {
		const reactive_declarations = [];
		const fixed_reactive_declarations = []; // not really 'reactive' but whatever

		component.reactive_declarations
			.forEach(d => {
				let uses_props;

				const condition = Array.from(d.dependencies)
					.filter(n => {
						if (n === '$$props') {
							uses_props = true;
							return false;
						}

						const variable = component.var_lookup.get(n);
						return variable && (variable.writable || variable.mutated);
					})
					.map(n => `$$dirty.${n}`).join(' || ');

				let snippet = `[✂${d.node.body.start}-${d.node.end}✂]`;
				if (condition) snippet = `if (${condition}) { ${snippet} }`;

				if (condition || uses_props) {
					reactive_declarations.push(snippet);
				} else {
					fixed_reactive_declarations.push(snippet);
				}
			});

		const injected = Array.from(component.injected_reactive_declaration_vars).filter(name => {
			const variable = component.var_lookup.get(name);
			return variable.injected && variable.name[0] !== '$';
		});

		const reactive_store_declarations = reactive_stores.map(variable => {
			const $name = variable.name;
			const name = $name.slice(1);

			const store = component.var_lookup.get(name);
			if (store && store.reassigned) {
				return `${$name}, $$unsubscribe_${name} = @noop, $$subscribe_${name} = () => { $$unsubscribe_${name}(); $$unsubscribe_${name} = ${name}.subscribe($$value => { ${$name} = $$value; $$invalidate('${$name}', ${$name}); }) }`
			}

			return $name;
		});

		builder.add_block(deindent`
			function ${definition}(${args.join(', ')}) {
				${reactive_store_declarations.length > 0 && `let ${reactive_store_declarations.join(', ')};`}

				${reactive_store_subscriptions}

				${resubscribable_reactive_store_unsubscribers}

				${component.javascript}

				${component.slots.size && `let { $$slots = {}, $$scope } = $$props;`}

				${renderer.binding_groups.length > 0 && `const $$binding_groups = [${renderer.binding_groups.map(_ => `[]`).join(', ')}];`}

				${component.partly_hoisted.length > 0 && component.partly_hoisted.join('\n\n')}

				${set && `$$self.$set = ${set};`}

				${injected.length && `let ${injected.join(', ')};`}

				${reactive_declarations.length > 0 && deindent`
				$$self.$$.update = ($$dirty = { ${Array.from(all_reactive_dependencies).map(n => `${n}: 1`).join(', ')} }) => {
					${reactive_declarations}
				};
				`}

				${fixed_reactive_declarations}

				return ${stringify_props(filtered_declarations)};
			}
		`);
	}

	const prop_names = `[${props.map(v => JSON.stringify(v.export_name)).join(', ')}]`;

	if (options.customElement) {
		builder.add_block(deindent`
			class ${name} extends @SvelteElement {
				constructor(options) {
					super();

					${css.code && `this.shadowRoot.innerHTML = \`<style>${escape$1(css.code, { only_escape_at_symbol: true }).replace(/\\/g, '\\\\')}${options.dev ? `\n/*# sourceMappingURL=${css.map.toUrl()} */` : ''}</style>\`;`}

					@init(this, { target: this.shadowRoot }, ${definition}, create_fragment, ${not_equal}, ${prop_names});

					${dev_props_check}

					if (options) {
						if (options.target) {
							@insert(options.target, this, options.anchor);
						}

						${(props.length > 0 || uses_props) && deindent`
						if (options.props) {
							this.$set(options.props);
							@flush();
						}`}
					}
				}

				${props.length > 0 && deindent`
				static get observedAttributes() {
					return ${JSON.stringify(props.map(x => x.export_name))};
				}`}

				${body.length > 0 && body.join('\n\n')}
			}
		`);

		if (component.tag != null) {
			builder.add_block(deindent`
				customElements.define("${component.tag}", ${name});
			`);
		}
	} else {
		const superclass = options.dev ? 'SvelteComponentDev' : 'SvelteComponent';

		builder.add_block(deindent`
			class ${name} extends @${superclass} {
				constructor(options) {
					super(${options.dev && `options`});
					${should_add_css && `if (!document.getElementById("${component.stylesheet.id}-style")) @add_css();`}
					@init(this, options, ${definition}, create_fragment, ${not_equal}, ${prop_names});

					${dev_props_check}
				}

				${body.length > 0 && body.join('\n\n')}
			}
		`);
	}

	return builder.toString();
}

function AwaitBlock(node, renderer, options) {
	renderer.append('${(function(__value) { if(@is_promise(__value)) return `');

	renderer.render(node.pending.children, options);

	renderer.append('`; return function(' + (node.value || '') + ') { return `');

	renderer.render(node.then.children, options);

	const snippet = snip(node.expression);
	renderer.append(`\`;}(__value);}(${snippet})) }`);
}

function Comment(node, renderer, options) {
	if (options.preserveComments) {
		renderer.append(`<!--${node.data}-->`);
	}
}

function DebugTag(node, renderer, options) {
	if (!options.dev) return;

	const filename = options.file || null;
	const { line, column } = options.locate(node.start + 1);

	const obj = node.expressions.length === 0
		? `{}`
		: `{ ${node.expressions
			.map(e => e.node.name)
			.join(', ')} }`;

	const str = '${@debug(' + `${filename && stringify(filename)}, ${line}, ${column}, ${obj})}`;

	renderer.append(str);
}

function EachBlock(node, renderer, options) {
	const snippet = snip(node.expression);

	const { start, end } = node.context_node;

	const ctx = node.index
		? `([✂${start}-${end}✂], ${node.index})`
		: `([✂${start}-${end}✂])`;

	const open = `\${${node.else ? `${snippet}.length ? ` : ''}@each(${snippet}, ${ctx} => \``;
	renderer.append(open);

	renderer.render(node.children, options);

	const close = `\`)`;
	renderer.append(close);

	if (node.else) {
		renderer.append(` : \``);
		renderer.render(node.else.children, options);
		renderer.append(`\``);
	}

	renderer.append('}');
}

function get_slot_scope(lets) {
	if (lets.length === 0) return '';
	return `{ ${lets.map(l => l.value ? `${l.name}: ${l.value}` : l.name).join(', ')} }`;
}

// source: https://gist.github.com/ArjanSchouten/0b8574a6ad7f5065a5e7
const boolean_attributes = new Set([
	'async',
	'autocomplete',
	'autofocus',
	'autoplay',
	'border',
	'challenge',
	'checked',
	'compact',
	'contenteditable',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'frameborder',
	'hidden',
	'indeterminate',
	'ismap',
	'loop',
	'multiple',
	'muted',
	'nohref',
	'noresize',
	'noshade',
	'novalidate',
	'nowrap',
	'open',
	'readonly',
	'required',
	'reversed',
	'scoped',
	'scrolling',
	'seamless',
	'selected',
	'sortable',
	'spellcheck',
	'translate'
]);

function Element(node, renderer, options) {
	let opening_tag = `<${node.name}`;
	let textarea_contents; // awkward special case

	const slot = node.get_static_attribute_value('slot');
	const component = node.find_nearest(/InlineComponent/);
	if (slot && component) {
		const slot = node.attributes.find((attribute) => attribute.name === 'slot');
		const slot_name = slot.chunks[0].data;
		const target = renderer.targets[renderer.targets.length - 1];
		target.slot_stack.push(slot_name);
		target.slots[slot_name] = '';

		const lets = node.lets;
		const seen = new Set(lets.map(l => l.name));

		component.lets.forEach(l => {
			if (!seen.has(l.name)) lets.push(l);
		});

		options.slot_scopes.set(slot_name, get_slot_scope(node.lets));
	}

	const class_expression = node.classes.map((class_directive) => {
		const { expression, name } = class_directive;
		const snippet = expression ? snip(expression) : `ctx${quote_prop_if_necessary(name)}`;
		return `${snippet} ? "${name}" : ""`;
	}).join(', ');

	let add_class_attribute = class_expression ? true : false;

	if (node.attributes.find(attr => attr.is_spread)) {
		// TODO dry this out
		const args = [];
		node.attributes.forEach(attribute => {
			if (attribute.is_spread) {
				args.push(snip(attribute.expression));
			} else {
				if (attribute.name === 'value' && node.name === 'textarea') {
					textarea_contents = stringify_attribute(attribute, true);
				} else if (attribute.is_true) {
					args.push(`{ ${quote_name_if_necessary(attribute.name)}: true }`);
				} else if (
					boolean_attributes.has(attribute.name) &&
					attribute.chunks.length === 1 &&
					attribute.chunks[0].type !== 'Text'
				) {
					// a boolean attribute with one non-Text chunk
					args.push(`{ ${quote_name_if_necessary(attribute.name)}: ${snip(attribute.chunks[0])} }`);
				} else {
					args.push(`{ ${quote_name_if_necessary(attribute.name)}: \`${stringify_attribute(attribute, true)}\` }`);
				}
			}
		});

		opening_tag += "${@spread([" + args.join(', ') + "])}";
	} else {
		node.attributes.forEach((attribute) => {
			if (attribute.type !== 'Attribute') return;

			if (attribute.name === 'value' && node.name === 'textarea') {
				textarea_contents = stringify_attribute(attribute, true);
			} else if (attribute.is_true) {
				opening_tag += ` ${attribute.name}`;
			} else if (
				boolean_attributes.has(attribute.name) &&
				attribute.chunks.length === 1 &&
				attribute.chunks[0].type !== 'Text'
			) {
				// a boolean attribute with one non-Text chunk
				opening_tag += '${' + snip(attribute.chunks[0]) + ' ? " ' + attribute.name + '" : "" }';
			} else if (attribute.name === 'class' && class_expression) {
				add_class_attribute = false;
				opening_tag += ` class="\${[\`${stringify_attribute(attribute, true)}\`, ${class_expression}].join(' ').trim() }"`;
			} else if (attribute.chunks.length === 1 && attribute.chunks[0].type !== 'Text') {
				const { name } = attribute;
				const snippet = snip(attribute.chunks[0]);

				opening_tag += '${(v => v == null ? "" : ` ' + name + '="${@escape(' + snippet + ')}"`)(' + snippet + ')}';
			} else {
				opening_tag += ` ${attribute.name}="${stringify_attribute(attribute, true)}"`;
			}
		});
	}

	node.bindings.forEach(binding => {
		const { name, expression } = binding;

		if (name === 'group') ; else {
			const snippet = snip(expression);
			opening_tag += ' ${(v => v ? ("' + name + '" + (v === true ? "" : "=" + JSON.stringify(v))) : "")(' + snippet + ')}';
		}
	});

	if (add_class_attribute) {
		opening_tag += `\${((v) => v ? ' class="' + v + '"' : '')([${class_expression}].join(' ').trim())}`;
	}

	opening_tag += '>';

	renderer.append(opening_tag);

	if (node.name === 'textarea' && textarea_contents !== undefined) {
		renderer.append(textarea_contents);
	} else {
		renderer.render(node.children, options);
	}

	if (!is_void(node.name)) {
		renderer.append(`</${node.name}>`);
	}
}

function Head(node, renderer, options) {
	renderer.append('${($$result.head += `');

	renderer.render(node.children, options);

	renderer.append('`, "")}');
}

function HtmlTag(node, renderer, options) {
	renderer.append('${' + snip(node.expression) + '}');
}

function IfBlock(node, renderer, options) {
	const snippet = snip(node.expression);

	renderer.append('${ ' + snippet + ' ? `');

	renderer.render(node.children, options);

	renderer.append('` : `');

	if (node.else) {
		renderer.render(node.else.children, options);
	}

	renderer.append('` }');
}

function stringify_attribute$1(chunk) {
	if (chunk.type === 'Text') {
		return escape_template(escape$1(chunk.data));
	}

	return '${@escape(' + snip(chunk) + ')}';
}

function get_attribute_value(attribute) {
	if (attribute.is_true) return `true`;
	if (attribute.chunks.length === 0) return `''`;

	if (attribute.chunks.length === 1) {
		const chunk = attribute.chunks[0];
		if (chunk.type === 'Text') {
			return stringify(chunk.data);
		}

		return snip(chunk);
	}

	return '`' + attribute.chunks.map(stringify_attribute$1).join('') + '`';
}

function InlineComponent(node, renderer, options) {
	const binding_props = [];
	const binding_fns = [];

	node.bindings.forEach(binding => {
		renderer.has_bindings = true;

		// TODO this probably won't work for contextual bindings
		const snippet = snip(binding.expression);

		binding_props.push(`${binding.name}: ${snippet}`);
		binding_fns.push(`${binding.name}: $$value => { ${snippet} = $$value; $$settled = false }`);
	});

	const uses_spread = node.attributes.find(attr => attr.is_spread);

	let props;

	if (uses_spread) {
		props = `Object.assign(${
			node.attributes
				.map(attribute => {
					if (attribute.is_spread) {
						return snip(attribute.expression);
					} else {
						return `{ ${attribute.name}: ${get_attribute_value(attribute)} }`;
					}
				})
				.concat(binding_props.map(p => `{ ${p} }`))
				.join(', ')
		})`;
	} else {
		props = stringify_props(
			node.attributes
				.map(attribute => `${attribute.name}: ${get_attribute_value(attribute)}`)
				.concat(binding_props)
		);
	}

	const bindings = stringify_props(binding_fns);

	const expression = (
		node.name === 'svelte:self'
			? '__svelte:self__' // TODO conflict-proof this
			: node.name === 'svelte:component'
				? `((${snip(node.expression)}) || @missing_component)`
				: node.name
	);

	const slot_fns = [];

	if (node.children.length) {
		const target = {
			slots: { default: '' },
			slot_stack: ['default']
		};

		renderer.targets.push(target);

		const slot_scopes = new Map();
		slot_scopes.set('default', get_slot_scope(node.lets));

		renderer.render(node.children, Object.assign({}, options, {
			slot_scopes
		}));

		Object.keys(target.slots).forEach(name => {
			const slot_scope = slot_scopes.get(name);

			slot_fns.push(
				`${quote_name_if_necessary(name)}: (${slot_scope}) => \`${target.slots[name]}\``
			);
		});

		renderer.targets.pop();
	}

	const slots = stringify_props(slot_fns);

	renderer.append(`\${@validate_component(${expression}, '${node.name}').$$render($$result, ${props}, ${bindings}, ${slots})}`);
}

function Slot(node, renderer, options) {
	const prop = quote_prop_if_necessary(node.slot_name);

	const slot_data = get_slot_data(node.values, true);

	const arg = slot_data.length > 0 ? `{ ${slot_data.join(', ')} }` : '';

	renderer.append(`\${$$slots${prop} ? $$slots${prop}(${arg}) : \``);

	renderer.render(node.children, options);

	renderer.append(`\`}`);
}

function Tag$1(node, renderer, options) {
	const snippet = snip(node.expression);

	renderer.append(
		node.parent &&
		node.parent.type === 'Element' &&
		node.parent.name === 'style'
			? '${' + snippet + '}'
			: '${@escape(' + snippet + ')}'
	);
}

function Text$1(node, renderer, options) {
	let text = node.data;
	if (
		!node.parent ||
		node.parent.type !== 'Element' ||
		(node.parent.name !== 'script' && node.parent.name !== 'style')
	) {
		// unless this Text node is inside a <script> or <style> element, escape &,<,>
		text = escape_html(text);
	}
	renderer.append(escape$1(escape_template(text)));
}

function Title(node, renderer, options) {
	renderer.append(`<title>`);

	renderer.render(node.children, options);

	renderer.append(`</title>`);
}

function noop$1(){}

const handlers = {
	AwaitBlock,
	Body: noop$1,
	Comment,
	DebugTag,
	EachBlock,
	Element,
	Head,
	IfBlock,
	InlineComponent,
	MustacheTag: Tag$1, // TODO MustacheTag is an anachronism
	Options: noop$1,
	RawMustacheTag: HtmlTag,
	Slot,
	Text: Text$1,
	Title,
	Window: noop$1
};

class Renderer$1 {constructor() { Renderer$1.prototype.__init.call(this);Renderer$1.prototype.__init2.call(this);Renderer$1.prototype.__init3.call(this); }
	__init() {this.has_bindings = false;}
	__init2() {this.code = '';}
	__init3() {this.targets = [];}

	append(code) {
		if (this.targets.length) {
			const target = this.targets[this.targets.length - 1];
			const slot_name = target.slot_stack[target.slot_stack.length - 1];
			target.slots[slot_name] += code;
		} else {
			this.code += code;
		}
	}

	render(nodes, options) {
		nodes.forEach(node => {
			const handler = handlers[node.type];

			if (!handler) {
				throw new Error(`No handler for '${node.type}' nodes`);
			}

			handler(node, this, options);
		});
	}
}

function ssr(
	component,
	options
) {
	const renderer = new Renderer$1();

	const { name } = component;

	// create $$render function
	renderer.render(trim(component.fragment.children), Object.assign({
		locate: component.locate
	}, options));

	// TODO concatenate CSS maps
	const css = options.customElement ?
		{ code: null, map: null } :
		component.stylesheet.render(options.filename, true);

	const reactive_stores = component.vars.filter(variable => variable.name[0] === '$' && variable.name[1] !== '$');
	const reactive_store_values = reactive_stores
		.map(({ name }) => {
			const store_name = name.slice(1);
			const store = component.var_lookup.get(store_name);
			if (store && store.hoistable) return;

			const assignment = `${name} = @get_store_value(${store_name});`;

			return component.compile_options.dev
				? `@validate_store(${store_name}, '${store_name}'); ${assignment}`
				: assignment;
		});

	// TODO remove this, just use component.vars everywhere
	const props = component.vars.filter(variable => !variable.module && variable.export_name);

	if (component.javascript) {
		component.rewrite_props(({ name }) => {
			const value = `$${name}`;

			const get_store_value = component.helper('get_store_value');

			let insert = `${value} = ${get_store_value}(${name})`;
			if (component.compile_options.dev) {
				const validate_store = component.helper('validate_store');
				insert = `${validate_store}(${name}, '${name}'); ${insert}`;
			}

			return insert;
		});
	}

	// TODO only do this for props with a default value
	const parent_bindings = component.javascript
		? props.map(prop => {
			return `if ($$props.${prop.export_name} === void 0 && $$bindings.${prop.export_name} && ${prop.name} !== void 0) $$bindings.${prop.export_name}(${prop.name});`;
		})
		: [];

	const reactive_declarations = component.reactive_declarations.map(d => {
		let snippet = `[✂${d.node.body.start}-${d.node.end}✂]`;

		if (d.declaration) {
			const declared = extract_names(d.declaration);
			const injected = declared.filter(name => {
				return name[0] !== '$' && component.var_lookup.get(name).injected;
			});

			const self_dependencies = injected.filter(name => d.dependencies.has(name));

			if (injected.length) {
				// in some cases we need to do `let foo; [expression]`, in
				// others we can do `let [expression]`
				const separate = (
					self_dependencies.length > 0 ||
					declared.length > injected.length ||
					d.node.body.expression.type === 'ParenthesizedExpression'
				);

				snippet = separate
					? `let ${injected.join(', ')}; ${snippet}`
					: `let ${snippet}`;
			}
		}

		return snippet;
	});

	const main = renderer.has_bindings
		? deindent`
			let $$settled;
			let $$rendered;

			do {
				$$settled = true;

				${reactive_store_values}

				${reactive_declarations}

				$$rendered = \`${renderer.code}\`;
			} while (!$$settled);

			return $$rendered;
		`
		: deindent`
			${reactive_store_values}

			${reactive_declarations}

			return \`${renderer.code}\`;`;

	const blocks = [
		reactive_stores.length > 0 && `let ${reactive_stores
			.map(({ name }) => {
				const store_name = name.slice(1);
				const store = component.var_lookup.get(store_name);
				if (store && store.hoistable) {
					const get_store_value = component.helper('get_store_value');
					return `${name} = ${get_store_value}(${store_name})`;
				}
				return name;
			})
			.join(', ')};`,
		component.javascript,
		parent_bindings.join('\n'),
		css.code && `$$result.css.add(#css);`,
		main
	].filter(Boolean);

	return (deindent`
		${css.code && deindent`
		const #css = {
			code: ${css.code ? stringify(css.code) : `''`},
			map: ${css.map ? stringify(css.map.toString()) : 'null'}
		};`}

		${component.module_javascript}

		${component.fully_hoisted.length > 0 && component.fully_hoisted.join('\n\n')}

		const ${name} = @create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
			${blocks.join('\n\n')}
		});
	`).trim();
}

function trim(nodes) {
	let start = 0;
	for (; start < nodes.length; start += 1) {
		const node = nodes[start];
		if (node.type !== 'Text') break;

		node.data = node.data.replace(/^\s+/, '');
		if (node.data) break;
	}

	let end = nodes.length;
	for (; end > start; end -= 1) {
		const node = nodes[end - 1];
		if (node.type !== 'Text') break;

		node.data = node.data.replace(/\s+$/, '');
		if (node.data) break;
	}

	return nodes.slice(start, end);
}

const wrappers$1 = { esm, cjs };






function create_module(
	code,
	format,
	name,
	banner,
	sveltePath = 'svelte',
	helpers,
	imports,
	module_exports,
	source
) {
	const internal_path = `${sveltePath}/internal`;

	if (format === 'esm') {
		return esm(code, name, banner, sveltePath, internal_path, helpers, imports, module_exports, source);
	}

	if (format === 'cjs') return cjs(code, name, banner, sveltePath, internal_path, helpers, imports, module_exports);

	throw new Error(`options.format is invalid (must be ${list(Object.keys(wrappers$1))})`);
}

function edit_source(source, sveltePath) {
	return source === 'svelte' || source.startsWith('svelte/')
		? source.replace('svelte', sveltePath)
		: source;
}

function esm(
	code,
	name,
	banner,
	sveltePath,
	internal_path,
	helpers,
	imports,
	module_exports,
	source
) {
	const internal_imports = helpers.length > 0 && (
		`import ${stringify_props(helpers.map(h => h.name === h.alias ? h.name : `${h.name} as ${h.alias}`).sort())} from ${JSON.stringify(internal_path)};`
	);

	const user_imports = imports.length > 0 && (
		imports
			.map((declaration) => {
				const import_source = edit_source(declaration.source.value, sveltePath);

				return (
					source.slice(declaration.start, declaration.source.start) +
					JSON.stringify(import_source) +
					source.slice(declaration.source.end, declaration.end)
				);
			})
			.join('\n')
	);

	return deindent`
		${banner}
		${internal_imports}
		${user_imports}

		${code}

		export default ${name};
		${module_exports.length > 0 && `export { ${module_exports.map(e => e.name === e.as ? e.name : `${e.name} as ${e.as}`).join(', ')} };`}`;
}

function cjs(
	code,
	name,
	banner,
	sveltePath,
	internal_path,
	helpers,
	imports,
	module_exports
) {
	const declarations = helpers.map(h => `${h.alias === h.name ? h.name : `${h.name}: ${h.alias}`}`).sort();

	const internal_imports = helpers.length > 0 && (
		`const ${stringify_props(declarations)} = require(${JSON.stringify(internal_path)});\n`
	);

	const requires = imports.map(node => {
		let lhs;

		if (node.specifiers[0].type === 'ImportNamespaceSpecifier') {
			lhs = node.specifiers[0].local.name;
		} else {
			const properties = node.specifiers.map(s => {
				if (s.type === 'ImportDefaultSpecifier') {
					return `default: ${s.local.name}`;
				}

				return s.local.name === s.imported.name
					? s.local.name
					: `${s.imported.name}: ${s.local.name}`;
			});

			lhs = `{ ${properties.join(', ')} }`;
		}

		const source = edit_source(node.source.value, sveltePath);

		return `const ${lhs} = require("${source}");`
	});

	const exports = [`exports.default = ${name};`].concat(
		module_exports.map(x => `exports.${x.as} = ${x.name};`)
	);

	return deindent`
		${banner}
		"use strict";

		${internal_imports}
		${requires}

		${code}

		${exports}`
}

const UNKNOWN = {};

function gather_possible_values(node, set) {
	if (node.type === 'Literal') {
		set.add(node.value);
	}

	else if (node.type === 'ConditionalExpression') {
		gather_possible_values(node.consequent, set);
		gather_possible_values(node.alternate, set);
	}

	else {
		set.add(UNKNOWN);
	}
}

class Selector {
	
	
	
	
	

	constructor(node, stylesheet) {
		this.node = node;
		this.stylesheet = stylesheet;

		this.blocks = group_selectors(node);

		// take trailing :global(...) selectors out of consideration
		let i = this.blocks.length;
		while (i > 0) {
			if (!this.blocks[i - 1].global) break;
			i -= 1;
		}

		this.local_blocks = this.blocks.slice(0, i);
		this.used = this.blocks[0].global;
	}

	apply(node, stack) {
		const to_encapsulate = [];

		apply_selector(this.stylesheet, this.local_blocks.slice(), node, stack.slice(), to_encapsulate);

		if (to_encapsulate.length > 0) {
			to_encapsulate.filter((_, i) => i === 0 || i === to_encapsulate.length - 1).forEach(({ node, block }) => {
				this.stylesheet.nodes_with_css_class.add(node);
				block.should_encapsulate = true;
			});

			this.used = true;
		}
	}

	minify(code) {
		let c = null;
		this.blocks.forEach((block, i) => {
			if (i > 0) {
				if (block.start - c > 1) {
					code.overwrite(c, block.start, block.combinator.name || ' ');
				}
			}

			c = block.end;
		});
	}

	transform(code, attr) {
		function encapsulate_block(block) {
			let i = block.selectors.length;
			while (i--) {
				const selector = block.selectors[i];
				if (selector.type === 'PseudoElementSelector' || selector.type === 'PseudoClassSelector') continue;

				if (selector.type === 'TypeSelector' && selector.name === '*') {
					code.overwrite(selector.start, selector.end, attr);
				} else {
					code.appendLeft(selector.end, attr);
				}

				break;
			}
		}

		this.blocks.forEach((block, i) => {
			if (block.global) {
				const selector = block.selectors[0];
				const first = selector.children[0];
				const last = selector.children[selector.children.length - 1];
				code.remove(selector.start, first.start).remove(last.end, selector.end);
			}

			if (block.should_encapsulate) encapsulate_block(block);
		});
	}

	validate(component) {
		this.blocks.forEach((block) => {
			let i = block.selectors.length;
			while (i-- > 1) {
				const selector = block.selectors[i];
				if (selector.type === 'PseudoClassSelector' && selector.name === 'global') {
					component.error(selector, {
						code: `css-invalid-global`,
						message: `:global(...) must be the first element in a compound selector`
					});
				}
			}
		});

		let start = 0;
		let end = this.blocks.length;

		for (; start < end; start += 1) {
			if (!this.blocks[start].global) break;
		}

		for (; end > start; end -= 1) {
			if (!this.blocks[end - 1].global) break;
		}

		for (let i = start; i < end; i += 1) {
			if (this.blocks[i].global) {
				component.error(this.blocks[i].selectors[0], {
					code: `css-invalid-global`,
					message: `:global(...) can be at the start or end of a selector sequence, but not in the middle`
				});
			}
		}
	}
}

function apply_selector(stylesheet, blocks, node, stack, to_encapsulate) {
	const block = blocks.pop();
	if (!block) return false;

	if (!node) {
		return blocks.every(block => block.global);
	}

	let i = block.selectors.length;

	while (i--) {
		const selector = block.selectors[i];

		if (selector.type === 'PseudoClassSelector' && selector.name === 'global') {
			// TODO shouldn't see this here... maybe we should enforce that :global(...)
			// cannot be sandwiched between non-global selectors?
			return false;
		}

		if (selector.type === 'PseudoClassSelector' || selector.type === 'PseudoElementSelector') {
			continue;
		}

		if (selector.type === 'ClassSelector') {
			if (!attribute_matches(node, 'class', selector.name, '~=', false) && !class_matches(node, selector.name)) return false;
		}

		else if (selector.type === 'IdSelector') {
			if (!attribute_matches(node, 'id', selector.name, '=', false)) return false;
		}

		else if (selector.type === 'AttributeSelector') {
			if (!attribute_matches(node, selector.name.name, selector.value && unquote(selector.value), selector.matcher, selector.flags)) return false;
		}

		else if (selector.type === 'TypeSelector') {
			// remove toLowerCase() in v2, when uppercase elements will be forbidden
			if (node.name.toLowerCase() !== selector.name.toLowerCase() && selector.name !== '*') return false;
		}

		else {
			// bail. TODO figure out what these could be
			to_encapsulate.push({ node, block });
			return true;
		}
	}

	if (block.combinator) {
		if (block.combinator.type === 'WhiteSpace') {
			while (stack.length) {
				if (apply_selector(stylesheet, blocks.slice(), stack.pop(), stack, to_encapsulate)) {
					to_encapsulate.push({ node, block });
					return true;
				}
			}

			if (blocks.every(block => block.global)) {
				to_encapsulate.push({ node, block });
				return true;
			}

			return false;
		} else if (block.combinator.name === '>') {
			if (apply_selector(stylesheet, blocks, stack.pop(), stack, to_encapsulate)) {
				to_encapsulate.push({ node, block });
				return true;
			}

			return false;
		}

		// TODO other combinators
		to_encapsulate.push({ node, block });
		return true;
	}

	to_encapsulate.push({ node, block });
	return true;
}

const operators = {
	'=' : (value, flags) => new RegExp(`^${value}$`, flags),
	'~=': (value, flags) => new RegExp(`\\b${value}\\b`, flags),
	'|=': (value, flags) => new RegExp(`^${value}(-.+)?$`, flags),
	'^=': (value, flags) => new RegExp(`^${value}`, flags),
	'$=': (value, flags) => new RegExp(`${value}$`, flags),
	'*=': (value, flags) => new RegExp(value, flags)
};

function attribute_matches(node, name, expected_value, operator, case_insensitive) {
	const spread = node.attributes.find(attr => attr.type === 'Spread');
	if (spread) return true;

	const attr = node.attributes.find((attr) => attr.name === name);
	if (!attr) return false;
	if (attr.is_true) return operator === null;
	if (attr.chunks.length > 1) return true;
	if (!expected_value) return true;

	const pattern = operators[operator](expected_value, case_insensitive ? 'i' : '');
	const value = attr.chunks[0];

	if (!value) return false;
	if (value.type === 'Text') return pattern.test(value.data);

	const possible_values = new Set();
	gather_possible_values(value.node, possible_values);
	if (possible_values.has(UNKNOWN)) return true;

	for (const x of Array.from(possible_values)) { // TypeScript for-of is slightly unlike JS
		if (pattern.test(x)) return true;
	}

	return false;
}

function class_matches(node, name) {
	return node.classes.some(function(class_directive) {
		return class_directive.name === name;
	});
}

function unquote(value) {
	if (value.type === 'Identifier') return value.name;
	const str = value.value;
	if (str[0] === str[str.length - 1] && str[0] === "'" || str[0] === '"') {
		return str.slice(1, str.length - 1);
	}
	return str;
}

class Block$1 {
	
	
	
	
	
	

	constructor(combinator) {
		this.combinator = combinator;
		this.global = false;
		this.selectors = [];

		this.start = null;
		this.end = null;

		this.should_encapsulate = false;
	}

	add(selector) {
		if (this.selectors.length === 0) {
			this.start = selector.start;
			this.global = selector.type === 'PseudoClassSelector' && selector.name === 'global';
		}

		this.selectors.push(selector);
		this.end = selector.end;
	}
}

function group_selectors(selector) {
	let block = new Block$1(null);

	const blocks = [block];

	selector.children.forEach((child, i) => {
		if (child.type === 'WhiteSpace' || child.type === 'Combinator') {
			block = new Block$1(child);
			blocks.push(block);
		} else {
			block.add(child);
		}
	});

	return blocks;
}

function remove_css_prefix(name) {
	return name.replace(/^-((webkit)|(moz)|(o)|(ms))-/, '');
}

const is_keyframes_node = (node) => remove_css_prefix(node.name) === 'keyframes';

// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash$1(str) {
	let hash = 5381;
	let i = str.length;

	while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
	return (hash >>> 0).toString(36);
}

class Rule {
	
	
	
	

	constructor(node, stylesheet, parent) {
		this.node = node;
		this.parent = parent;
		this.selectors = node.selector.children.map((node) => new Selector(node, stylesheet));
		this.declarations = node.block.children.map((node) => new Declaration(node));
	}

	apply(node, stack) {
		this.selectors.forEach(selector => selector.apply(node, stack)); // TODO move the logic in here?
	}

	is_used(dev) {
		if (this.parent && this.parent.node.type === 'Atrule' && is_keyframes_node(this.parent.node)) return true;
		if (this.declarations.length === 0) return dev;
		return this.selectors.some(s => s.used);
	}

	minify(code, dev) {
		let c = this.node.start;
		let started = false;

		this.selectors.forEach((selector, i) => {
			if (selector.used) {
				const separator = started ? ',' : '';
				if ((selector.node.start - c) > separator.length) {
					code.overwrite(c, selector.node.start, separator);
				}

				selector.minify(code);
				c = selector.node.end;

				started = true;
			}
		});

		code.remove(c, this.node.block.start);

		c = this.node.block.start + 1;
		this.declarations.forEach((declaration, i) => {
			const separator = i > 0 ? ';' : '';
			if ((declaration.node.start - c) > separator.length) {
				code.overwrite(c, declaration.node.start, separator);
			}

			declaration.minify(code);

			c = declaration.node.end;
		});

		code.remove(c, this.node.block.end - 1);
	}

	transform(code, id, keyframes) {
		if (this.parent && this.parent.node.type === 'Atrule' && is_keyframes_node(this.parent.node)) return true;

		const attr = `.${id}`;

		this.selectors.forEach(selector => selector.transform(code, attr));
		this.declarations.forEach(declaration => declaration.transform(code, keyframes));
	}

	validate(component) {
		this.selectors.forEach(selector => {
			selector.validate(component);
		});
	}

	warn_on_unused_selector(handler) {
		this.selectors.forEach(selector => {
			if (!selector.used) handler(selector);
		});
	}
}

class Declaration {
	

	constructor(node) {
		this.node = node;
	}

	transform(code, keyframes) {
		const property = this.node.property && remove_css_prefix(this.node.property.toLowerCase());
		if (property === 'animation' || property === 'animation-name') {
			this.node.value.children.forEach((block) => {
				if (block.type === 'Identifier') {
					const name = block.name;
					if (keyframes.has(name)) {
						code.overwrite(block.start, block.end, keyframes.get(name));
					}
				}
			});
		}
	}

	minify(code) {
		if (!this.node.property) return; // @apply, and possibly other weird cases?

		const c = this.node.start + this.node.property.length;
		const first = this.node.value.children
			? this.node.value.children[0]
			: this.node.value;

		let start = first.start;
		while (/\s/.test(code.original[start])) start += 1;

		if (start - c > 1) {
			code.overwrite(c, start, ':');
		}
	}
}

class Atrule {
	
	

	constructor(node) {
		this.node = node;
		this.children = [];
	}

	apply(node, stack) {
		if (this.node.name === 'media' || this.node.name === 'supports') {
			this.children.forEach(child => {
				child.apply(node, stack);
			});
		}

		else if (is_keyframes_node(this.node)) {
			this.children.forEach((rule) => {
				rule.selectors.forEach(selector => {
					selector.used = true;
				});
			});
		}
	}

	is_used(dev) {
		return true; // TODO
	}

	minify(code, dev) {
		if (this.node.name === 'media') {
			const expression_char = code.original[this.node.expression.start];
			let c = this.node.start + (expression_char === '(' ? 6 : 7);
			if (this.node.expression.start > c) code.remove(c, this.node.expression.start);

			this.node.expression.children.forEach((query) => {
				// TODO minify queries
				c = query.end;
			});

			code.remove(c, this.node.block.start);
		} else if (is_keyframes_node(this.node)) {
			let c = this.node.start + this.node.name.length + 1;
			if (this.node.expression.start - c > 1) code.overwrite(c, this.node.expression.start, ' ');
			c = this.node.expression.end;
			if (this.node.block.start - c > 0) code.remove(c, this.node.block.start);
		} else if (this.node.name === 'supports') {
			let c = this.node.start + 9;
			if (this.node.expression.start - c > 1) code.overwrite(c, this.node.expression.start, ' ');
			this.node.expression.children.forEach((query) => {
				// TODO minify queries
				c = query.end;
			});
			code.remove(c, this.node.block.start);
		}

		// TODO other atrules

		if (this.node.block) {
			let c = this.node.block.start + 1;

			this.children.forEach(child => {
				if (child.is_used(dev)) {
					code.remove(c, child.node.start);
					child.minify(code, dev);
					c = child.node.end;
				}
			});

			code.remove(c, this.node.block.end - 1);
		}
	}

	transform(code, id, keyframes) {
		if (is_keyframes_node(this.node)) {
			this.node.expression.children.forEach(({ type, name, start, end }) => {
				if (type === 'Identifier') {
					if (name.startsWith('-global-')) {
						code.remove(start, start + 8);
					} else {
						code.overwrite(start, end, keyframes.get(name));
					}
				}
			});
		}

		this.children.forEach(child => {
			child.transform(code, id, keyframes);
		});
	}

	validate(component) {
		this.children.forEach(child => {
			child.validate(component);
		});
	}

	warn_on_unused_selector(handler) {
		if (this.node.name !== 'media') return;

		this.children.forEach(child => {
			child.warn_on_unused_selector(handler);
		});
	}
}

class Stylesheet {
	
	
	
	

	
	

	__init() {this.children = [];}
	__init2() {this.keyframes = new Map();}

	__init3() {this.nodes_with_css_class = new Set();}

	constructor(source, ast, filename, dev) {Stylesheet.prototype.__init.call(this);Stylesheet.prototype.__init2.call(this);Stylesheet.prototype.__init3.call(this);
		this.source = source;
		this.ast = ast;
		this.filename = filename;
		this.dev = dev;

		if (ast.css && ast.css.children.length) {
			this.id = `svelte-${hash$1(ast.css.content.styles)}`;

			this.has_styles = true;

			const stack = [];
			let current_atrule = null;

			walk(ast.css, {
				enter: (node) => {
					if (node.type === 'Atrule') {
						const last = stack[stack.length - 1];

						const atrule = new Atrule(node);
						stack.push(atrule);

						// this is an awkward special case — @apply (and
						// possibly other future constructs)
						if (last && !(last instanceof Atrule)) return;

						if (current_atrule) {
							current_atrule.children.push(atrule);
						} else {
							this.children.push(atrule);
						}

						if (is_keyframes_node(node)) {
							node.expression.children.forEach((expression) => {
								if (expression.type === 'Identifier' && !expression.name.startsWith('-global-')) {
									this.keyframes.set(expression.name, `${this.id}-${expression.name}`);
								}
							});
						}

						current_atrule = atrule;
					}

					if (node.type === 'Rule') {
						const rule = new Rule(node, this, current_atrule);
						stack.push(rule);

						if (current_atrule) {
							current_atrule.children.push(rule);
						} else {
							this.children.push(rule);
						}
					}
				},

				leave: (node) => {
					if (node.type === 'Rule' || node.type === 'Atrule') stack.pop();
					if (node.type === 'Atrule') current_atrule = stack[stack.length - 1] ;
				}
			});
		} else {
			this.has_styles = false;
		}
	}

	apply(node) {
		if (!this.has_styles) return;

		const stack = [];
		let parent = node;
		while (parent = parent.parent) {
			if (parent.type === 'Element') stack.unshift(parent );
		}

		for (let i = 0; i < this.children.length; i += 1) {
			const child = this.children[i];
			child.apply(node, stack);
		}
	}

	reify() {
		this.nodes_with_css_class.forEach((node) => {
			node.add_css_class();
		});
	}

	render(file, should_transform_selectors) {
		if (!this.has_styles) {
			return { code: null, map: null };
		}

		const code = new MagicString__default(this.source);

		walk(this.ast.css, {
			enter: (node) => {
				code.addSourcemapLocation(node.start);
				code.addSourcemapLocation(node.end);
			}
		});

		if (should_transform_selectors) {
			this.children.forEach((child) => {
				child.transform(code, this.id, this.keyframes);
			});
		}

		let c = 0;
		this.children.forEach(child => {
			if (child.is_used(this.dev)) {
				code.remove(c, child.node.start);
				child.minify(code, this.dev);
				c = child.node.end;
			}
		});

		code.remove(c, this.source.length);

		return {
			code: code.toString(),
			map: code.generateMap({
				includeContent: true,
				source: this.filename,
				file
			})
		};
	}

	validate(component) {
		this.children.forEach(child => {
			child.validate(component);
		});
	}

	warn_on_unused_selectors(component) {
		this.children.forEach(child => {
			child.warn_on_unused_selector((selector) => {
				component.warn(selector.node, {
					code: `css-unused-selector`,
					message: `Unused CSS selector`
				});
			});
		});
	}
}

const test = typeof process !== 'undefined' && process.env.TEST;

class Node {
	
	
	
	
	

	
	

	
	
	

	constructor(component, parent, scope, info) {
		this.start = info.start;
		this.end = info.end;
		this.type = info.type;

		// this makes properties non-enumerable, which makes logging
		// bearable. might have a performance cost. TODO remove in prod?
		Object.defineProperties(this, {
			component: {
				value: component
			},
			parent: {
				value: parent
			}
		});
	}

	cannot_use_innerhtml() {
		if (this.can_use_innerhtml !== false) {
			this.can_use_innerhtml = false;
			if (this.parent) this.parent.cannot_use_innerhtml();
		}
	}

	find_nearest(selector) {
		if (selector.test(this.type)) return this;
		if (this.parent) return this.parent.find_nearest(selector);
	}

	get_static_attribute_value(name) {
		const attribute = this.attributes.find(
			(attr) => attr.type === 'Attribute' && attr.name.toLowerCase() === name
		);

		if (!attribute) return null;

		if (attribute.is_true) return true;
		if (attribute.chunks.length === 0) return '';

		if (attribute.chunks.length === 1 && attribute.chunks[0].type === 'Text') {
			return attribute.chunks[0].data;
		}

		return null;
	}

	has_ancestor(type) {
		return this.parent ?
			this.parent.type === type || this.parent.has_ancestor(type) :
			false;
	}
}

class AbstractBlock extends Node {
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
	}

	warn_if_empty_block() {
		if (!this.children || this.children.length > 1) return;

		const child = this.children[0];

		if (!child || (child.type === 'Text' && !/[^ \r\n\f\v\t]/.test(child.data))) {
			this.component.warn(this, {
				code: 'empty-block',
				message: 'Empty block'
			});
		}
	}
}

class PendingBlock extends AbstractBlock {

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
		this.children = map_children(component, parent, scope, info.children);

		if (!info.skip) {
			this.warn_if_empty_block();
		}
	}
}

class ThenBlock extends AbstractBlock {
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.scope = scope.child();
		this.scope.add(parent.value, parent.expression.dependencies, this);
		this.children = map_children(component, parent, this.scope, info.children);

		if (!info.skip) {
			this.warn_if_empty_block();
		}
	}
}

class CatchBlock extends AbstractBlock {
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.scope = scope.child();
		this.scope.add(parent.error, parent.expression.dependencies, this);
		this.children = map_children(component, parent, this.scope, info.children);

		if (!info.skip) {
			this.warn_if_empty_block();
		}
	}
}

const binary_operators = {
	'**': 15,
	'*': 14,
	'/': 14,
	'%': 14,
	'+': 13,
	'-': 13,
	'<<': 12,
	'>>': 12,
	'>>>': 12,
	'<': 11,
	'<=': 11,
	'>': 11,
	'>=': 11,
	'in': 11,
	'instanceof': 11,
	'==': 10,
	'!=': 10,
	'===': 10,
	'!==': 10,
	'&': 9,
	'^': 8,
	'|': 7
};

const logical_operators = {
	'&&': 6,
	'||': 5
};

const precedence = {
	Literal: () => 21,
	Identifier: () => 21,
	ParenthesizedExpression: () => 20,
	MemberExpression: () => 19,
	NewExpression: () => 19, // can be 18 (if no args) but makes no practical difference
	CallExpression: () => 19,
	UpdateExpression: () => 17,
	UnaryExpression: () => 16,
	BinaryExpression: (node) => binary_operators[node.operator],
	LogicalExpression: (node) => logical_operators[node.operator],
	ConditionalExpression: () => 4,
	AssignmentExpression: () => 3,
	YieldExpression: () => 2,
	SpreadElement: () => 1,
	SequenceExpression: () => 0
};

class Expression {
	__init() {this.type = 'Expression';}
	
	
	
	
	
	__init2() {this.dependencies = new Set();}
	__init3() {this.contextual_dependencies = new Set();}

	
	
	

	
	__init4() {this.declarations = [];}
	__init5() {this.uses_context = false;}

	

	constructor(component, owner, template_scope, info) {Expression.prototype.__init.call(this);Expression.prototype.__init2.call(this);Expression.prototype.__init3.call(this);Expression.prototype.__init4.call(this);Expression.prototype.__init5.call(this);
		// TODO revert to direct property access in prod?
		Object.defineProperties(this, {
			component: {
				value: component
			}
		});

		this.node = info;
		this.template_scope = template_scope;
		this.owner = owner;
		this.is_synthetic = owner.is_synthetic;

		const { dependencies, contextual_dependencies } = this;

		let { map, scope } = create_scopes(info);
		this.scope = scope;
		this.scope_map = map;

		const expression = this;
		let function_expression;

		// discover dependencies, but don't change the code yet
		walk(info, {
			enter(node, parent, key) {
				// don't manipulate shorthand props twice
				if (key === 'value' && parent.shorthand) return;

				if (map.has(node)) {
					scope = map.get(node);
				}

				if (!function_expression && /FunctionExpression/.test(node.type)) {
					function_expression = node;
				}

				if (isReference(node, parent)) {
					const { name, nodes } = flatten_reference(node);

					if (scope.has(name)) return;

					if (globals.has(name) && !component.var_lookup.has(name)) return;

					if (name[0] === '$' && template_scope.names.has(name.slice(1))) {
						component.error(node, {
							code: `contextual-store`,
							message: `Stores must be declared at the top level of the component (this may change in a future version of Svelte)`
						});
					}

					if (template_scope.is_let(name)) {
						if (!function_expression) {
							dependencies.add(name);
						}
					} else if (template_scope.names.has(name)) {
						expression.uses_context = true;

						contextual_dependencies.add(name);

						if (!function_expression) {
							template_scope.dependencies_for_name.get(name).forEach(name => dependencies.add(name));
						}
					} else {
						if (!function_expression) {
							dependencies.add(name);
						}

						component.add_reference(name);
						component.warn_if_undefined(name, nodes[0], template_scope);
					}

					this.skip();
				}

				// track any assignments from template expressions as mutable
				let names;
				let deep = false;

				if (function_expression) {
					if (node.type === 'AssignmentExpression') {
						deep = node.left.type === 'MemberExpression';
						names = deep
							? [get_object(node.left).name]
							: extract_names(node.left);
					} else if (node.type === 'UpdateExpression') {
						const { name } = get_object(node.argument);
						names = [name];
					}
				}

				if (names) {
					names.forEach(name => {
						if (template_scope.names.has(name)) {
							template_scope.dependencies_for_name.get(name).forEach(name => {
								const variable = component.var_lookup.get(name);
								if (variable) variable[deep ? 'mutated' : 'reassigned'] = true;
							});
						} else {
							component.add_reference(name);

							const variable = component.var_lookup.get(name);
							if (variable) variable[deep ? 'mutated' : 'reassigned'] = true;
						}
					});
				}
			},

			leave(node) {
				if (map.has(node)) {
					scope = scope.parent;
				}

				if (node === function_expression) {
					function_expression = null;
				}
			}
		});
	}

	dynamic_dependencies() {
		return Array.from(this.dependencies).filter(name => {
			if (this.template_scope.is_let(name)) return true;
			if (name === '$$props') return true;

			const variable = this.component.var_lookup.get(name);
			if (!variable) return false;

			if (variable.mutated || variable.reassigned) return true; // dynamic internal state
			if (!variable.module && variable.writable && variable.export_name) return true; // writable props
		});
	}

	get_precedence() {
		return this.node.type in precedence ? precedence[this.node.type](this.node) : 0;
	}

	// TODO move this into a render-dom wrapper?
	render(block) {
		if (this.rendered) return this.rendered;

		const {
			component,
			declarations,
			scope_map: map,
			template_scope,
			owner,
			is_synthetic
		} = this;
		let scope = this.scope;

		const { code } = component;

		let function_expression;
		let pending_assignments = new Set();

		let dependencies;
		let contextual_dependencies;

		// rewrite code as appropriate
		walk(this.node, {
			enter(node, parent, key) {
				// don't manipulate shorthand props twice
				if (key === 'value' && parent.shorthand) return;

				code.addSourcemapLocation(node.start);
				code.addSourcemapLocation(node.end);

				if (map.has(node)) {
					scope = map.get(node);
				}

				if (isReference(node, parent)) {
					const { name, nodes } = flatten_reference(node);

					if (scope.has(name)) return;
					if (globals.has(name) && !component.var_lookup.has(name)) return;

					if (function_expression) {
						if (template_scope.names.has(name)) {
							contextual_dependencies.add(name);

							template_scope.dependencies_for_name.get(name).forEach(dependency => {
								dependencies.add(dependency);
							});
						} else {
							dependencies.add(name);
							component.add_reference(name);
						}
					} else if (!is_synthetic && is_contextual(component, template_scope, name)) {
						code.prependRight(node.start, key === 'key' && parent.shorthand
							? `${name}: ctx.`
							: 'ctx.');
					}

					if (node.type === 'MemberExpression') {
						nodes.forEach(node => {
							code.addSourcemapLocation(node.start);
							code.addSourcemapLocation(node.end);
						});
					}

					this.skip();
				}

				if (function_expression) {
					if (node.type === 'AssignmentExpression') {
						const names = node.left.type === 'MemberExpression'
							? [get_object(node.left).name]
							: extract_names(node.left);

						if (node.operator === '=' && nodes_match(node.left, node.right)) {
							const dirty = names.filter(name => {
								return !scope.declarations.has(name);
							});

							if (dirty.length) component.has_reactive_assignments = true;

							code.overwrite(node.start, node.end, dirty.map(n => component.invalidate(n)).join('; '));
						} else {
							names.forEach(name => {
								if (scope.declarations.has(name)) return;

								const variable = component.var_lookup.get(name);
								if (variable && variable.hoistable) return;

								pending_assignments.add(name);
							});
						}
					} else if (node.type === 'UpdateExpression') {
						const { name } = get_object(node.argument);

						if (scope.declarations.has(name)) return;

						const variable = component.var_lookup.get(name);
						if (variable && variable.hoistable) return;

						pending_assignments.add(name);
					}
				} else {
					if (node.type === 'AssignmentExpression') ;

					if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
						function_expression = node;
						dependencies = new Set();
						contextual_dependencies = new Set();
					}
				}
			},

			leave(node, parent) {
				if (map.has(node)) scope = scope.parent;

				if (node === function_expression) {
					if (pending_assignments.size > 0) {
						if (node.type !== 'ArrowFunctionExpression') {
							// this should never happen!
							throw new Error(`Well that's odd`);
						}

						// TOOD optimisation — if this is an event handler,
						// the return value doesn't matter
					}

					const name = component.get_unique_name(
						sanitize(get_function_name(node, owner))
					);

					const args = contextual_dependencies.size > 0
						? [`{ ${Array.from(contextual_dependencies).join(', ')} }`]
						: [];

					let original_params;

					if (node.params.length > 0) {
						original_params = code.slice(node.params[0].start, node.params[node.params.length - 1].end);
						args.push(original_params);
					}

					let body = code.slice(node.body.start, node.body.end).trim();
					if (node.body.type !== 'BlockStatement') {
						if (pending_assignments.size > 0) {
							const dependencies = new Set();
							pending_assignments.forEach(name => {
								if (template_scope.names.has(name)) {
									template_scope.dependencies_for_name.get(name).forEach(dependency => {
										dependencies.add(dependency);
									});
								} else {
									dependencies.add(name);
								}
							});

							const insert = Array.from(dependencies).map(name => component.invalidate(name)).join('; ');
							pending_assignments = new Set();

							component.has_reactive_assignments = true;

							body = deindent`
								{
									const $$result = ${body};
									${insert};
									return $$result;
								}
							`;
						} else {
							body = `{\n\treturn ${body};\n}`;
						}
					}

					const fn = deindent`
						function ${name}(${args.join(', ')}) ${body}
					`;

					if (dependencies.size === 0 && contextual_dependencies.size === 0) {
						// we can hoist this out of the component completely
						component.fully_hoisted.push(fn);
						code.overwrite(node.start, node.end, name);

						component.add_var({
							name,
							internal: true,
							hoistable: true,
							referenced: true
						});
					}

					else if (contextual_dependencies.size === 0) {
						// function can be hoisted inside the component init
						component.partly_hoisted.push(fn);
						code.overwrite(node.start, node.end, `ctx.${name}`);

						component.add_var({
							name,
							internal: true,
							referenced: true
						});
					}

					else {
						// we need a combo block/init recipe
						component.partly_hoisted.push(fn);
						code.overwrite(node.start, node.end, name);

						component.add_var({
							name,
							internal: true,
							referenced: true
						});

						declarations.push(deindent`
							function ${name}(${original_params ? '...args' : ''}) {
								return ctx.${name}(ctx${original_params ? ', ...args' : ''});
							}
						`);
					}

					function_expression = null;
					dependencies = null;
					contextual_dependencies = null;
				}

				if (/Statement/.test(node.type)) {
					if (pending_assignments.size > 0) {
						const has_semi = code.original[node.end - 1] === ';';

						const insert = (
							(has_semi ? ' ' : '; ') +
							Array.from(pending_assignments).map(name => component.invalidate(name)).join('; ')
						);

						if (/^(Break|Continue|Return)Statement/.test(node.type)) {
							if (node.argument) {
								code.overwrite(node.start, node.argument.start, `var $$result = `);
								code.appendLeft(node.argument.end, `${insert}; return $$result`);
							} else {
								code.prependRight(node.start, `${insert}; `);
							}
						} else if (parent && /(If|For(In|Of)?|While)Statement/.test(parent.type) && node.type !== 'BlockStatement') {
							code.prependRight(node.start, '{ ');
							code.appendLeft(node.end, `${insert}; }`);
						} else {
							code.appendLeft(node.end, `${insert};`);
						}

						component.has_reactive_assignments = true;
						pending_assignments = new Set();
					}
				}
			}
		});

		if (declarations.length > 0) {
			block.maintain_context = true;
			declarations.forEach(declaration => {
				block.builders.init.add_block(declaration);
			});
		}

		return this.rendered = `[✂${this.node.start}-${this.node.end}✂]`;
	}
}

function get_function_name(node, parent) {
	if (parent.type === 'EventHandler') {
		return `${parent.name}_handler`;
	}

	if (parent.type === 'Action') {
		return `${parent.name}_function`;
	}

	return 'func';
}

function is_contextual(component, scope, name) {
	if (name === '$$props') return true;

	// if it's a name below root scope, it's contextual
	if (!scope.is_top_level(name)) return true;

	const variable = component.var_lookup.get(name);

	// hoistables, module declarations, and imports are non-contextual
	if (!variable || variable.hoistable) return false;

	// assume contextual
	return true;
}

class AwaitBlock$1 extends Node {
	
	
	

	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.expression = new Expression(component, this, scope, info.expression);

		this.value = info.value;
		this.error = info.error;

		this.pending = new PendingBlock(component, this, scope, info.pending);
		this.then = new ThenBlock(component, this, scope, info.then);
		this.catch = new CatchBlock(component, this, scope, info.catch);
	}
}

class EventHandler extends Node {
	
	
	
	
	__init() {this.uses_context = false;}
	__init2() {this.can_make_passive = false;}

	constructor(component, parent, template_scope, info) {
		super(component, parent, template_scope, info);EventHandler.prototype.__init.call(this);EventHandler.prototype.__init2.call(this);
		this.name = info.name;
		this.modifiers = new Set(info.modifiers);

		if (info.expression) {
			this.expression = new Expression(component, this, template_scope, info.expression);
			this.uses_context = this.expression.uses_context;

			if (/FunctionExpression/.test(info.expression.type) && info.expression.params.length === 0) {
				// TODO make this detection more accurate — if `event.preventDefault` isn't called, and
				// `event` is passed to another function, we can make it passive
				this.can_make_passive = true;
			} else if (info.expression.type === 'Identifier') {
				let node = component.node_for_declaration.get(info.expression.name);

				if (node && node.type === 'VariableDeclaration') {
					// for `const handleClick = () => {...}`, we want the [arrow] function expression node
					const declarator = node.declarations.find(d => d.id.name === info.expression.name);
					node = declarator && declarator.init;
				}

				if (node && /Function/.test(node.type) && node.params.length === 0) {
					this.can_make_passive = true;
				}
			}
		} else {
			const name = component.get_unique_name(`${this.name}_handler`);

			component.add_var({
				name,
				internal: true,
				referenced: true
			});

			component.partly_hoisted.push(deindent`
				function ${name}(event) {
					@bubble($$self, event);
				}
			`);

			this.handler_name = name;
		}
	}

	// TODO move this? it is specific to render-dom
	render(block) {
		if (this.expression) return this.expression.render(block);

		// this.component.add_reference(this.handler_name);
		return `ctx.${this.handler_name}`;
	}
}

class Body extends Node {
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.handlers = [];

		info.attributes.forEach(node => {
			if (node.type === 'EventHandler') {
				this.handlers.push(new EventHandler(component, this, scope, node));
			}
		});
	}
}

class Comment$1 extends Node {
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
		this.data = info.data;
	}
}

class ElseBlock extends AbstractBlock {
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
		this.children = map_children(component, this, scope, info.children);

		this.warn_if_empty_block();
	}
}

function unpack_destructuring(contexts, node, tail) {
	if (!node) return;

	if (node.type === 'Identifier' || node.type === 'RestIdentifier') {
		contexts.push({
			key: node,
			tail
		});
	} else if (node.type === 'ArrayPattern') {
		node.elements.forEach((element, i) => {
			if (element && element.type === 'RestIdentifier') {
				unpack_destructuring(contexts, element, `${tail}.slice(${i})`);
			} else {
				unpack_destructuring(contexts, element, `${tail}[${i}]`);
			}
		});
	} else if (node.type === 'ObjectPattern') {
		const used_properties = [];

		node.properties.forEach((property) => {
			if (property.kind === 'rest') {
				unpack_destructuring(
					contexts,
					property.value,
					`@object_without_properties(${tail}, ${JSON.stringify(used_properties)})`
				);
			} else {
				used_properties.push(property.key.name);

				unpack_destructuring(contexts, property.value,`${tail}.${property.key.name}`);
			}
		});
	}
}

class EachBlock$1 extends AbstractBlock {
	

	
	

	
	
	
	
	
	
	
	__init() {this.has_binding = false;}

	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);EachBlock$1.prototype.__init.call(this);
		this.expression = new Expression(component, this, scope, info.expression);
		this.context = info.context.name || 'each'; // TODO this is used to facilitate binding; currently fails with destructuring
		this.context_node = info.context;
		this.index = info.index;

		this.scope = scope.child();

		this.contexts = [];
		unpack_destructuring(this.contexts, info.context, new_tail());

		this.contexts.forEach(context => {
			this.scope.add(context.key.name, this.expression.dependencies, this);
		});

		this.key = info.key
			? new Expression(component, this, this.scope, info.key)
			: null;

		if (this.index) {
			// index can only change if this is a keyed each block
			const dependencies = this.key ? this.expression.dependencies : [];
			this.scope.add(this.index, dependencies, this);
		}

		this.has_animation = false;

		this.children = map_children(component, this, this.scope, info.children);

		if (this.has_animation) {
			if (this.children.length !== 1) {
				const child = this.children.find(child => !!child.animation);
				component.error(child.animation, {
					code: `invalid-animation`,
					message: `An element that use the animate directive must be the sole child of a keyed each block`
				});
			}
		}

		this.warn_if_empty_block();

		this.else = info.else
			? new ElseBlock(component, this, this.scope, info.else)
			: null;
	}
}

class Attribute$1 extends Node {
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		if (info.type === 'Spread') {
			this.name = null;
			this.is_spread = true;
			this.is_true = false;
			this.is_synthetic = false;

			this.expression = new Expression(component, this, scope, info.expression);
			this.dependencies = this.expression.dependencies;
			this.chunks = null;

			this.is_dynamic = true; // TODO not necessarily
			this.is_static = false;
			this.should_cache = false; // TODO does this mean anything here?
		}

		else {
			this.name = info.name;
			this.is_true = info.value === true;
			this.is_static = true;
			this.is_synthetic = info.synthetic;

			this.dependencies = new Set();

			this.chunks = this.is_true
				? []
				: info.value.map(node => {
					if (node.type === 'Text') return node;

					this.is_static = false;

					const expression = new Expression(component, this, scope, node.expression);

					add_to_set(this.dependencies, expression.dependencies);
					return expression;
				});

			this.is_dynamic = this.dependencies.size > 0;

			this.should_cache = this.is_dynamic
				? this.chunks.length === 1
					? this.chunks[0].node.type !== 'Identifier' || scope.names.has(this.chunks[0].node.name)
					: true
				: false;
		}
	}

	get_dependencies() {
		if (this.is_spread) return this.expression.dynamic_dependencies();

		const dependencies = new Set();
		this.chunks.forEach(chunk => {
			if (chunk.type === 'Expression') {
				add_to_set(dependencies, chunk.dynamic_dependencies());
			}
		});

		return Array.from(dependencies);
	}

	get_value(block) {
		if (this.is_true) return true;
		if (this.chunks.length === 0) return `""`;

		if (this.chunks.length === 1) {
			return this.chunks[0].type === 'Text'
				? stringify(this.chunks[0].data)
				: this.chunks[0].render(block);
		}

		return (this.chunks[0].type === 'Text' ? '' : `"" + `) +
			this.chunks
				.map(chunk => {
					if (chunk.type === 'Text') {
						return stringify(chunk.data);
					} else {
						return chunk.get_precedence() <= 13 ? `(${chunk.render()})` : chunk.render();
					}
				})
				.join(' + ');
	}

	get_static_value() {
		if (this.is_spread || this.is_dynamic) return null;

		return this.is_true
			? true
			: this.chunks[0]
				? this.chunks[0].data
				: '';
	}
}

class Binding extends Node {
	
	
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		if (info.expression.type !== 'Identifier' && info.expression.type !== 'MemberExpression') {
			component.error(info, {
				code: 'invalid-directive-value',
				message: 'Can only bind to an identifier (e.g. `foo`) or a member expression (e.g. `foo.bar` or `foo[baz]`)'
			});
		}

		this.name = info.name;
		this.expression = new Expression(component, this, scope, info.expression);

		let obj;
		let prop;

		const { name } = get_object(this.expression.node);
		this.is_contextual = scope.names.has(name);

		// make sure we track this as a mutable ref
		if (scope.is_let(name)) {
			component.error(this, {
				code: 'invalid-binding',
				message: 'Cannot bind to a variable declared with the let: directive'
			});
		} else if (this.is_contextual) {
			scope.dependencies_for_name.get(name).forEach(name => {
				const variable = component.var_lookup.get(name);
				variable[this.expression.node.type === 'MemberExpression' ? 'mutated' : 'reassigned'] = true;
			});
		} else {
			const variable = component.var_lookup.get(name);

			if (!variable || variable.global) component.error(this.expression.node, {
				code: 'binding-undeclared',
				message: `${name} is not declared`
			});

			variable[this.expression.node.type === 'MemberExpression' ? 'mutated' : 'reassigned'] = true;
		}

		if (this.expression.node.type === 'MemberExpression') {
			prop = `[✂${this.expression.node.property.start}-${this.expression.node.property.end}✂]`;
			if (!this.expression.node.computed) prop = `'${prop}'`;
			obj = `[✂${this.expression.node.object.start}-${this.expression.node.object.end}✂]`;
		} else {
			obj = 'ctx';
			prop = `'${name}'`;
		}

		this.obj = obj;
		this.prop = prop;
	}
}

class Transition extends Node {
	
	
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		component.warn_if_undefined(info.name, info, scope);

		this.name = info.name;
		component.qualify(info.name);

		this.directive = info.intro && info.outro ? 'transition' : info.intro ? 'in' : 'out';
		this.is_local = info.modifiers.includes('local');

		if ((info.intro && parent.intro) || (info.outro && parent.outro)) {
			const parent_transition = (parent.intro || parent.outro);

			const message = this.directive === parent_transition.directive
				? `An element can only have one '${this.directive}' directive`
				: `An element cannot have both ${describe(parent_transition)} directive and ${describe(this)} directive`;

			component.error(info, {
				code: `duplicate-transition`,
				message
			});
		}

		this.expression = info.expression
			? new Expression(component, this, scope, info.expression)
			: null;
	}
}

function describe(transition) {
	return transition.directive === 'transition'
		? `a 'transition'`
		: `an '${transition.directive}'`;
}

class Animation extends Node {
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		component.warn_if_undefined(info.name, info, scope);

		this.name = info.name;
		component.qualify(info.name);

		if (parent.animation) {
			component.error(this, {
				code: `duplicate-animation`,
				message: `An element can only have one 'animate' directive`
			});
		}

		const block = parent.parent;
		if (!block || block.type !== 'EachBlock' || !block.key) {
			// TODO can we relax the 'immediate child' rule?
			component.error(this, {
				code: `invalid-animation`,
				message: `An element that use the animate directive must be the immediate child of a keyed each block`
			});
		}

		block.has_animation = true;

		this.expression = info.expression
			? new Expression(component, this, scope, info.expression)
			: null;
	}
}

class Action extends Node {
	
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		component.warn_if_undefined(info.name, info, scope);

		this.name = info.name;
		component.qualify(info.name);

		this.expression = info.expression
			? new Expression(component, this, scope, info.expression)
			: null;

		this.uses_context = this.expression && this.expression.uses_context;
	}
}

class Class extends Node {
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.name = info.name;

		this.expression = info.expression
			? new Expression(component, this, scope, info.expression)
			: null;
	}
}

class Text$2 extends Node {
	
	
	__init() {this.use_space = false;}

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);Text$2.prototype.__init.call(this);		this.data = info.data;

		if (!component.component_options.preserveWhitespace && !/\S/.test(info.data)) {
			let node = parent;
			while (node) {
				if (node.type === 'Element' && node.name === 'pre') {
					return;
				}
				node = node.parent;
			}

			this.use_space = true;
		}
	}
}

const applicable = new Set(['Identifier', 'ObjectExpression', 'ArrayExpression', 'Property']);

class Let extends Node {
	
	
	
	__init() {this.names = [];}

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);Let.prototype.__init.call(this);
		this.name = info.name;
		this.value = info.expression && `[✂${info.expression.start}-${info.expression.end}✂]`;

		if (info.expression) {
			walk(info.expression, {
				enter: node => {
					if (!applicable.has(node.type)) {
						component.error(node, {
							code: 'invalid-let',
							message: `let directive value must be an identifier or an object/array pattern`
						});
					}

					if (node.type === 'Identifier') {
						this.names.push(node.name);
					}
				}
			});
		} else {
			this.names.push(this.name);
		}
	}
}

const svg$1 = /^(?:altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color-profile|cursor|defs|desc|discard|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|foreignObject|g|glyph|glyphRef|hatch|hatchpath|hkern|image|line|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|solidcolor|stop|svg|switch|symbol|text|textPath|tref|tspan|unknown|use|view|vkern)$/;

const aria_attributes = 'activedescendant atomic autocomplete busy checked colindex controls current describedby details disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid keyshortcuts label labelledby level live modal multiline multiselectable orientation owns placeholder posinset pressed readonly relevant required roledescription rowindex selected setsize sort valuemax valuemin valuenow valuetext'.split(' ');
const aria_attribute_set = new Set(aria_attributes);

const aria_roles = 'alert alertdialog application article banner button cell checkbox columnheader combobox command complementary composite contentinfo definition dialog directory document feed figure form grid gridcell group heading img input landmark link list listbox listitem log main marquee math menu menubar menuitem menuitemcheckbox menuitemradio navigation none note option presentation progressbar radio radiogroup range region roletype row rowgroup rowheader scrollbar search searchbox section sectionhead select separator slider spinbutton status structure switch tab table tablist tabpanel term textbox timer toolbar tooltip tree treegrid treeitem widget window'.split(' ');
const aria_role_set = new Set(aria_roles);

const a11y_required_attributes = {
	a: ['href'],
	area: ['alt', 'aria-label', 'aria-labelledby'],

	// html-has-lang
	html: ['lang'],

	// iframe-has-title
	iframe: ['title'],
	img: ['alt'],
	object: ['title', 'aria-label', 'aria-labelledby']
};

const a11y_distracting_elements = new Set([
	'blink',
	'marquee'
]);

const a11y_required_content = new Set([
	// anchor-has-content
	'a',

	// heading-has-content
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6'
]);

const invisible_elements = new Set(['meta', 'html', 'script', 'style']);

const valid_modifiers = new Set([
	'preventDefault',
	'stopPropagation',
	'capture',
	'once',
	'passive'
]);

const passive_events = new Set([
	'wheel',
	'touchstart',
	'touchmove',
	'touchend',
	'touchcancel'
]);

function get_namespace(parent, element, explicit_namespace) {
	const parent_element = parent.find_nearest(/^Element/);

	if (!parent_element) {
		return explicit_namespace || (svg$1.test(element.name)
			? namespaces.svg
			: null);
	}

	if (element.name.toLowerCase() === 'svg') return namespaces.svg;
	if (parent_element.name.toLowerCase() === 'foreignobject') return null;

	return parent_element.namespace;
}

class Element$1 extends Node {
	
	
	
	__init() {this.attributes = [];}
	__init2() {this.actions = [];}
	__init3() {this.bindings = [];}
	__init4() {this.classes = [];}
	__init5() {this.handlers = [];}
	__init6() {this.lets = [];}
	__init7() {this.intro = null;}
	__init8() {this.outro = null;}
	__init9() {this.animation = null;}
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);Element$1.prototype.__init.call(this);Element$1.prototype.__init2.call(this);Element$1.prototype.__init3.call(this);Element$1.prototype.__init4.call(this);Element$1.prototype.__init5.call(this);Element$1.prototype.__init6.call(this);Element$1.prototype.__init7.call(this);Element$1.prototype.__init8.call(this);Element$1.prototype.__init9.call(this);		this.name = info.name;

		this.namespace = get_namespace(parent, this, component.namespace);

		if (this.name === 'textarea') {
			if (info.children.length > 0) {
				const value_attribute = info.attributes.find(node => node.name === 'value');
				if (value_attribute) {
					component.error(value_attribute, {
						code: `textarea-duplicate-value`,
						message: `A <textarea> can have either a value attribute or (equivalently) child content, but not both`
					});
				}

				// this is an egregious hack, but it's the easiest way to get <textarea>
				// children treated the same way as a value attribute
				info.attributes.push({
					type: 'Attribute',
					name: 'value',
					value: info.children
				});

				info.children = [];
			}
		}

		if (this.name === 'option') {
			// Special case — treat these the same way:
			//   <option>{foo}</option>
			//   <option value={foo}>{foo}</option>
			const value_attribute = info.attributes.find((attribute) => attribute.name === 'value');

			if (!value_attribute) {
				info.attributes.push({
					type: 'Attribute',
					name: 'value',
					value: info.children,
					synthetic: true
				});
			}
		}

		info.attributes.forEach(node => {
			switch (node.type) {
				case 'Action':
					this.actions.push(new Action(component, this, scope, node));
					break;

				case 'Attribute':
				case 'Spread':
					// special case
					if (node.name === 'xmlns') this.namespace = node.value[0].data;

					this.attributes.push(new Attribute$1(component, this, scope, node));
					break;

				case 'Binding':
					this.bindings.push(new Binding(component, this, scope, node));
					break;

				case 'Class':
					this.classes.push(new Class(component, this, scope, node));
					break;

				case 'EventHandler':
					this.handlers.push(new EventHandler(component, this, scope, node));
					break;

				case 'Let':
					this.lets.push(new Let(component, this, scope, node));
					break;

				case 'Transition':
					const transition = new Transition(component, this, scope, node);
					if (node.intro) this.intro = transition;
					if (node.outro) this.outro = transition;
					break;

				case 'Animation':
					this.animation = new Animation(component, this, scope, node);
					break;

				default:
					throw new Error(`Not implemented: ${node.type}`);
			}
		});

		if (this.lets.length > 0) {
			this.scope = scope.child();

			this.lets.forEach(l => {
				const dependencies = new Set([l.name]);

				l.names.forEach(name => {
					this.scope.add(name, dependencies, this);
				});
			});
		} else {
			this.scope = scope;
		}

		this.children = map_children(component, this, this.scope, info.children);

		this.validate();

		component.stylesheet.apply(this);
	}

	validate() {
		if (a11y_distracting_elements.has(this.name)) {
			// no-distracting-elements
			this.component.warn(this, {
				code: `a11y-distracting-elements`,
				message: `A11y: Avoid <${this.name}> elements`
			});
		}

		if (this.name === 'figcaption') {
			let { parent } = this;
			let is_figure_parent = false;

			while (parent) {
				if (parent.name === 'figure') {
					is_figure_parent = true;
					break;
				}
				if (parent.type === 'Element') {
					break;
				}
				parent = parent.parent;
			}

			if (!is_figure_parent) {
				this.component.warn(this, {
					code: `a11y-structure`,
					message: `A11y: <figcaption> must be an immediate child of <figure>`
				});
			}
		}

		if (this.name === 'figure') {
			const children = this.children.filter(node => {
				if (node.type === 'Comment') return false;
				if (node.type === 'Text') return /\S/.test(node.data);
				return true;
			});

			const index = children.findIndex(child => child.name === 'figcaption');

			if (index !== -1 && (index !== 0 && index !== children.length - 1)) {
				this.component.warn(children[index], {
					code: `a11y-structure`,
					message: `A11y: <figcaption> must be first or last child of <figure>`
				});
			}
		}

		this.validate_attributes();
		this.validate_bindings();
		this.validate_content();
		this.validate_event_handlers();
	}

	validate_attributes() {
		const { component } = this;

		const attribute_map = new Map();

		this.attributes.forEach(attribute => {
			if (attribute.is_spread) return;

			const name = attribute.name.toLowerCase();

			// aria-props
			if (name.startsWith('aria-')) {
				if (invisible_elements.has(this.name)) {
					// aria-unsupported-elements
					component.warn(attribute, {
						code: `a11y-aria-attributes`,
						message: `A11y: <${this.name}> should not have aria-* attributes`
					});
				}

				const type = name.slice(5);
				if (!aria_attribute_set.has(type)) {
					const match = fuzzymatch(type, aria_attributes);
					let message = `A11y: Unknown aria attribute 'aria-${type}'`;
					if (match) message += ` (did you mean '${match}'?)`;

					component.warn(attribute, {
						code: `a11y-unknown-aria-attribute`,
						message
					});
				}

				if (name === 'aria-hidden' && /^h[1-6]$/.test(this.name)) {
					component.warn(attribute, {
						code: `a11y-hidden`,
						message: `A11y: <${this.name}> element should not be hidden`
					});
				}
			}

			// aria-role
			if (name === 'role') {
				if (invisible_elements.has(this.name)) {
					// aria-unsupported-elements
					component.warn(attribute, {
						code: `a11y-misplaced-role`,
						message: `A11y: <${this.name}> should not have role attribute`
					});
				}

				const value = attribute.get_static_value();
				if (value && !aria_role_set.has(value)) {
					const match = fuzzymatch(value, aria_roles);
					let message = `A11y: Unknown role '${value}'`;
					if (match) message += ` (did you mean '${match}'?)`;

					component.warn(attribute, {
						code: `a11y-unknown-role`,
						message
					});
				}
			}

			// no-access-key
			if (name === 'accesskey') {
				component.warn(attribute, {
					code: `a11y-accesskey`,
					message: `A11y: Avoid using accesskey`
				});
			}

			// no-autofocus
			if (name === 'autofocus') {
				component.warn(attribute, {
					code: `a11y-autofocus`,
					message: `A11y: Avoid using autofocus`
				});
			}

			// scope
			if (name === 'scope' && this.name !== 'th') {
				component.warn(attribute, {
					code: `a11y-misplaced-scope`,
					message: `A11y: The scope attribute should only be used with <th> elements`
				});
			}

			// tabindex-no-positive
			if (name === 'tabindex') {
				const value = attribute.get_static_value();
				if (!isNaN(value) && +value > 0) {
					component.warn(attribute, {
						code: `a11y-positive-tabindex`,
						message: `A11y: avoid tabindex values above zero`
					});
				}
			}

			if (name === 'slot') {
				if (!attribute.is_static) {
					component.error(attribute, {
						code: `invalid-slot-attribute`,
						message: `slot attribute cannot have a dynamic value`
					});
				}

				if (component.slot_outlets.has(name)) {
					component.error(attribute, {
						code: `duplicate-slot-attribute`,
						message: `Duplicate '${name}' slot`
					});

					component.slot_outlets.add(name);
				}

				let ancestor = this.parent;
				do {
					if (ancestor.type === 'InlineComponent') break;
					if (ancestor.type === 'Element' && /-/.test(ancestor.name)) break;

					if (ancestor.type === 'IfBlock' || ancestor.type === 'EachBlock') {
						const type = ancestor.type === 'IfBlock' ? 'if' : 'each';
						const message = `Cannot place slotted elements inside an ${type}-block`;

						component.error(attribute, {
							code: `invalid-slotted-content`,
							message
						});
					}
				} while (ancestor = ancestor.parent);

				if (!ancestor) {
					component.error(attribute, {
						code: `invalid-slotted-content`,
						message: `Element with a slot='...' attribute must be a descendant of a component or custom element`
					});
				}
			}

			attribute_map.set(attribute.name, attribute);
		});

		// handle special cases
		if (this.name === 'a') {
			const attribute = attribute_map.get('href') || attribute_map.get('xlink:href');

			if (attribute) {
				const value = attribute.get_static_value();

				if (value === '' || value === '#') {
					component.warn(attribute, {
						code: `a11y-invalid-attribute`,
						message: `A11y: '${value}' is not a valid ${attribute.name} attribute`
					});
				}
			} else {
				component.warn(this, {
					code: `a11y-missing-attribute`,
					message: `A11y: <a> element should have an href attribute`
				});
			}
		}

		else {
			const required_attributes = a11y_required_attributes[this.name];
			if (required_attributes) {
				const has_attribute = required_attributes.some(name => attribute_map.has(name));

				if (!has_attribute) {
					should_have_attribute(this, required_attributes);
				}
			}

			if (this.name === 'input') {
				const type = attribute_map.get('type');
				if (type && type.get_static_value() === 'image') {
					should_have_attribute(
						this,
						['alt', 'aria-label', 'aria-labelledby'],
						'input type="image"'
					);
				}
			}
		}
	}

	validate_bindings() {
		const { component } = this;

		const check_type_attribute = () => {
			const attribute = this.attributes.find(
				(attribute) => attribute.name === 'type'
			);

			if (!attribute) return null;

			if (!attribute.is_static) {
				component.error(attribute, {
					code: `invalid-type`,
					message: `'type' attribute cannot be dynamic if input uses two-way binding`
				});
			}

			const value = attribute.get_static_value();

			if (value === true) {
				component.error(attribute, {
					code: `missing-type`,
					message: `'type' attribute must be specified`
				});
			}

			return value;
		};

		this.bindings.forEach(binding => {
			const { name } = binding;

			if (name === 'value') {
				if (
					this.name !== 'input' &&
					this.name !== 'textarea' &&
					this.name !== 'select'
				) {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'value' is not a valid binding on <${this.name}> elements`
					});
				}

				if (this.name === 'select') {
					const attribute = this.attributes.find(
						(attribute) => attribute.name === 'multiple'
					);

					if (attribute && !attribute.is_static) {
						component.error(attribute, {
							code: `dynamic-multiple-attribute`,
							message: `'multiple' attribute cannot be dynamic if select uses two-way binding`
						});
					}
				} else {
					check_type_attribute();
				}
			} else if (name === 'checked' || name === 'indeterminate') {
				if (this.name !== 'input') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'${name}' is not a valid binding on <${this.name}> elements`
					});
				}

				const type = check_type_attribute();

				if (type !== 'checkbox') {
					let message = `'${name}' binding can only be used with <input type="checkbox">`;
					if (type === 'radio') message += ` — for <input type="radio">, use 'group' binding`;
					component.error(binding, { code: `invalid-binding`, message });
				}
			} else if (name === 'group') {
				if (this.name !== 'input') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'group' is not a valid binding on <${this.name}> elements`
					});
				}

				const type = check_type_attribute();

				if (type !== 'checkbox' && type !== 'radio') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'group' binding can only be used with <input type="checkbox"> or <input type="radio">`
					});
				}
			} else if (name == 'files') {
				if (this.name !== 'input') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'files' is not a valid binding on <${this.name}> elements`
					});
				}

				const type = check_type_attribute();

				if (type !== 'file') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'files' binding can only be used with <input type="file">`
					});
				}
			} else if (
				name === 'currentTime' ||
				name === 'duration' ||
				name === 'paused' ||
				name === 'buffered' ||
				name === 'seekable' ||
				name === 'played' ||
				name === 'volume' ||
				name === 'playbackRate'
			) {
				if (this.name !== 'audio' && this.name !== 'video') {
					component.error(binding, {
						code: `invalid-binding`,
						message: `'${name}' binding can only be used with <audio> or <video>`
					});
				}
			} else if (dimensions.test(name)) {
				if (this.name === 'svg' && (name === 'offsetWidth' || name === 'offsetHeight')) {
					component.error(binding, {
						code: 'invalid-binding',
						message: `'${binding.name}' is not a valid binding on <svg>. Use '${name.replace('offset', 'client')}' instead`
					});
				} else if (svg$1.test(this.name)) {
					component.error(binding, {
						code: 'invalid-binding',
						message: `'${binding.name}' is not a valid binding on SVG elements`
					});
				} else if (is_void(this.name)) {
					component.error(binding, {
						code: 'invalid-binding',
						message: `'${binding.name}' is not a valid binding on void elements like <${this.name}>. Use a wrapper element instead`
					});
				}
			} else if (name !== 'this') {
				component.error(binding, {
					code: `invalid-binding`,
					message: `'${binding.name}' is not a valid binding`
				});
			}
		});
	}

	validate_content() {
		if (!a11y_required_content.has(this.name)) return;

		if (this.children.length === 0) {
			this.component.warn(this, {
				code: `a11y-missing-content`,
				message: `A11y: <${this.name}> element should have child content`
			});
		}
	}

	validate_event_handlers() {
		const { component } = this;

		this.handlers.forEach(handler => {
			if (handler.modifiers.has('passive') && handler.modifiers.has('preventDefault')) {
				component.error(handler, {
					code: 'invalid-event-modifier',
					message: `The 'passive' and 'preventDefault' modifiers cannot be used together`
				});
			}

			handler.modifiers.forEach(modifier => {
				if (!valid_modifiers.has(modifier)) {
					component.error(handler, {
						code: 'invalid-event-modifier',
						message: `Valid event modifiers are ${list(Array.from(valid_modifiers))}`
					});
				}

				if (modifier === 'passive') {
					if (passive_events.has(handler.name)) {
						if (handler.can_make_passive) {
							component.warn(handler, {
								code: 'redundant-event-modifier',
								message: `Touch event handlers that don't use the 'event' object are passive by default`
							});
						}
					} else {
						component.warn(handler, {
							code: 'redundant-event-modifier',
							message: `The passive modifier only works with wheel and touch events`
						});
					}
				}

				if (component.compile_options.legacy && (modifier === 'once' || modifier === 'passive')) {
					// TODO this could be supported, but it would need a few changes to
					// how event listeners work
					component.error(handler, {
						code: 'invalid-event-modifier',
						message: `The '${modifier}' modifier cannot be used in legacy mode`
					});
				}
			});

			if (passive_events.has(handler.name) && handler.can_make_passive && !handler.modifiers.has('preventDefault')) {
				// touch/wheel events should be passive by default
				handler.modifiers.add('passive');
			}
		});
	}

	is_media_node() {
		return this.name === 'audio' || this.name === 'video';
	}

	add_css_class(class_name = this.component.stylesheet.id) {
		const class_attribute = this.attributes.find(a => a.name === 'class');
		if (class_attribute && !class_attribute.is_true) {
			if (class_attribute.chunks.length === 1 && class_attribute.chunks[0].type === 'Text') {
				(class_attribute.chunks[0] ).data += ` ${class_name}`;
			} else {
				(class_attribute.chunks).push(
					new Text$2(this.component, this, this.scope, {
						type: 'Text',
						data: ` ${class_name}`
					})
				);
			}
		} else {
			this.attributes.push(
				new Attribute$1(this.component, this, this.scope, {
					type: 'Attribute',
					name: 'class',
					value: [{ type: 'Text', data: class_name }]
				})
			);
		}
	}
}

function should_have_attribute(
	node,
	attributes,
	name = node.name
) {
	const article = /^[aeiou]/.test(attributes[0]) ? 'an' : 'a';
	const sequence = attributes.length > 1 ?
		attributes.slice(0, -1).join(', ') + ` or ${attributes[attributes.length - 1]}` :
		attributes[0];

	node.component.warn(node, {
		code: `a11y-missing-attribute`,
		message: `A11y: <${name}> element should have ${article} ${sequence} attribute`
	});
}

class Head$1 extends Node {
	
	 // TODO

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		if (info.attributes.length) {
			component.error(info.attributes[0], {
				code: `invalid-attribute`,
				message: `<svelte:head> should not have any attributes or directives`
			});
		}

		this.children = map_children(component, parent, scope, info.children.filter(child => {
			return (child.type !== 'Text' || /\S/.test(child.data));
		}));
	}
}

class IfBlock$1 extends AbstractBlock {
	
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.expression = new Expression(component, this, scope, info.expression);
		this.children = map_children(component, this, scope, info.children);

		this.else = info.else
			? new ElseBlock(component, this, scope, info.else)
			: null;

		this.warn_if_empty_block();
	}
}

class InlineComponent$1 extends Node {
	
	
	
	__init() {this.attributes = [];}
	__init2() {this.bindings = [];}
	__init3() {this.handlers = [];}
	__init4() {this.lets = [];}
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);InlineComponent$1.prototype.__init.call(this);InlineComponent$1.prototype.__init2.call(this);InlineComponent$1.prototype.__init3.call(this);InlineComponent$1.prototype.__init4.call(this);
		if (info.name !== 'svelte:component' && info.name !== 'svelte:self') {
			const name = info.name.split('.')[0]; // accommodate namespaces
			component.warn_if_undefined(name, info, scope);
			component.add_reference(name);
		}

		this.name = info.name;

		this.expression = this.name === 'svelte:component'
			? new Expression(component, this, scope, info.expression)
			: null;

		info.attributes.forEach(node => {
			switch (node.type) {
				case 'Action':
					component.error(node, {
						code: `invalid-action`,
						message: `Actions can only be applied to DOM elements, not components`
					});

				case 'Attribute':
					if (node.name === 'slot') {
						component.error(node, {
							code: `invalid-prop`,
							message: `'slot' is reserved for future use in named slots`
						});
					}
					// fallthrough
				case 'Spread':
					this.attributes.push(new Attribute$1(component, this, scope, node));
					break;

				case 'Binding':
					this.bindings.push(new Binding(component, this, scope, node));
					break;

				case 'Class':
					component.error(node, {
						code: `invalid-class`,
						message: `Classes can only be applied to DOM elements, not components`
					});

				case 'EventHandler':
					this.handlers.push(new EventHandler(component, this, scope, node));
					break;

				case 'Let':
					this.lets.push(new Let(component, this, scope, node));
					break;

				case 'Transition':
					component.error(node, {
						code: `invalid-transition`,
						message: `Transitions can only be applied to DOM elements, not components`
					});

				default:
					throw new Error(`Not implemented: ${node.type}`);
			}
		});

		if (this.lets.length > 0) {
			this.scope = scope.child();

			this.lets.forEach(l => {
				const dependencies = new Set([l.name]);

				l.names.forEach(name => {
					this.scope.add(name, dependencies, this);
				});
			});
		} else {
			this.scope = scope;
		}

		this.children = map_children(component, this, this.scope, info.children);
	}
}

class Tag$2 extends Node {
	
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
		this.expression = new Expression(component, this, scope, info.expression);

		this.should_cache = (
			info.expression.type !== 'Identifier' ||
			(this.expression.dependencies.size && scope.names.has(info.expression.name))
		);
	}
}

class MustacheTag extends Tag$2 {}

class Options extends Node {
	
}

class RawMustacheTag extends Tag$2 {}

class DebugTag$1 extends Node {
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);

		this.expressions = info.identifiers.map(node => {
			return new Expression(component, parent, scope, node);
		});
	}
}

class Slot$1 extends Element$1 {
	
	
	
	
	__init() {this.values = new Map();}

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);Slot$1.prototype.__init.call(this);
		info.attributes.forEach(attr => {
			if (attr.type !== 'Attribute') {
				component.error(attr, {
					code: `invalid-slot-directive`,
					message: `<slot> cannot have directives`
				});
			}

			if (attr.name === 'name') {
				if (attr.value.length !== 1 || attr.value[0].type !== 'Text') {
					component.error(attr, {
						code: `dynamic-slot-name`,
						message: `<slot> name cannot be dynamic`
					});
				}

				this.slot_name = attr.value[0].data;
				if (this.slot_name === 'default') {
					component.error(attr, {
						code: `invalid-slot-name`,
						message: `default is a reserved word — it cannot be used as a slot name`
					});
				}
			}

			this.values.set(attr.name, new Attribute$1(component, this, scope, attr));
		});

		if (!this.slot_name) this.slot_name = 'default';

		if (this.slot_name === 'default') {
			// if this is the default slot, add our dependencies to any
			// other slots (which inherit our slot values) that were
			// previously encountered
			component.slots.forEach((slot) => {
				this.values.forEach((attribute, name) => {
					if (!slot.values.has(name)) {
						slot.values.set(name, attribute);
					}
				});
			});
		} else if (component.slots.has('default')) {
			// otherwise, go the other way — inherit values from
			// a previously encountered default slot
			const default_slot = component.slots.get('default');
			default_slot.values.forEach((attribute, name) => {
				if (!this.values.has(name)) {
					this.values.set(name, attribute);
				}
			});
		}

		component.slots.set(this.slot_name, this);
	}
}

class Title$1 extends Node {
	
	 // TODO
	

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);
		this.children = map_children(component, parent, scope, info.children);

		if (info.attributes.length > 0) {
			component.error(info.attributes[0], {
				code: `illegal-attribute`,
				message: `<title> cannot have attributes`
			});
		}

		info.children.forEach(child => {
			if (child.type !== 'Text' && child.type !== 'MustacheTag') {
				component.error(child, {
					code: 'illegal-structure',
					message: `<title> can only contain text and {tags}`
				});
			}
		});

		this.should_cache = info.children.length === 1
			? (
				info.children[0].type !== 'Identifier' ||
				scope.names.has(info.children[0].name)
			)
			: true;
	}
}

const valid_bindings = [
	'innerWidth',
	'innerHeight',
	'outerWidth',
	'outerHeight',
	'scrollX',
	'scrollY',
	'online'
];

class Window extends Node {
	
	__init() {this.handlers = [];}
	__init2() {this.bindings = [];}
	__init3() {this.actions = [];}

	constructor(component, parent, scope, info) {
		super(component, parent, scope, info);Window.prototype.__init.call(this);Window.prototype.__init2.call(this);Window.prototype.__init3.call(this);
		info.attributes.forEach(node => {
			if (node.type === 'EventHandler') {
				this.handlers.push(new EventHandler(component, this, scope, node));
			}

			else if (node.type === 'Binding') {
				if (node.expression.type !== 'Identifier') {
					const { parts } = flatten_reference(node.expression);

					// TODO is this constraint necessary?
					component.error(node.expression, {
						code: `invalid-binding`,
						message: `Bindings on <svelte:window> must be to top-level properties, e.g. '${parts[parts.length - 1]}' rather than '${parts.join('.')}'`
					});
				}

				if (!~valid_bindings.indexOf(node.name)) {
					const match = (
						node.name === 'width' ? 'innerWidth' :
						node.name === 'height' ? 'innerHeight' :
						fuzzymatch(node.name, valid_bindings)
					);

					const message = `'${node.name}' is not a valid binding on <svelte:window>`;

					if (match) {
						component.error(node, {
							code: `invalid-binding`,
							message: `${message} (did you mean '${match}'?)`
						});
					} else {
						component.error(node, {
							code: `invalid-binding`,
							message: `${message} — valid bindings are ${list(valid_bindings)}`
						});
					}
				}

				this.bindings.push(new Binding(component, this, scope, node));
			}

			else if (node.type === 'Action') {
				this.actions.push(new Action(component, this, scope, node));
			}
		});
	}
}

function get_constructor(type) {
	switch (type) {
		case 'AwaitBlock': return AwaitBlock$1;
		case 'Body': return Body;
		case 'Comment': return Comment$1;
		case 'EachBlock': return EachBlock$1;
		case 'Element': return Element$1;
		case 'Head': return Head$1;
		case 'IfBlock': return IfBlock$1;
		case 'InlineComponent': return InlineComponent$1;
		case 'MustacheTag': return MustacheTag;
		case 'Options': return Options;
		case 'RawMustacheTag': return RawMustacheTag;
		case 'DebugTag': return DebugTag$1;
		case 'Slot': return Slot$1;
		case 'Text': return Text$2;
		case 'Title': return Title$1;
		case 'Window': return Window;
		default: throw new Error(`Not implemented: ${type}`);
	}
}

function map_children(component, parent, scope, children) {
	let last = null;
	return children.map(child => {
		const constructor = get_constructor(child.type);
		const node = new constructor(component, parent, scope, child);

		if (last) last.next = node;
		node.prev = last;
		last = node;

		return node;
	});
}

class TemplateScope {
	
	
	__init() {this.owners = new Map();}
	

	constructor(parent) {TemplateScope.prototype.__init.call(this);
		this.parent = parent;
		this.names = new Set(parent ? parent.names : []);
		this.dependencies_for_name = new Map(parent ? parent.dependencies_for_name : []);
	}

	add(name, dependencies, owner) {
		this.names.add(name);
		this.dependencies_for_name.set(name, dependencies);
		this.owners.set(name, owner);
		return this;
	}

	child() {
		const child = new TemplateScope(this);
		return child;
	}

	is_top_level(name) {
		return !this.parent || !this.names.has(name) && this.parent.is_top_level(name);
	}

	get_owner(name) {
		return this.owners.get(name) || (this.parent && this.parent.get_owner(name));
	}

	is_let(name) {
		const owner = this.get_owner(name);
		return owner && (owner.type === 'Element' || owner.type === 'InlineComponent');
	}
}

class Fragment extends Node {
	
	
	

	constructor(component, info) {
		const scope = new TemplateScope();
		super(component, null, scope, info);

		this.scope = scope;
		this.children = map_children(component, this, scope, info.children);
	}
}

// This file is automatically generated
var internal_exports = new Set(["create_animation","fix_position","handle_promise","append","insert","detach","detach_between","detach_before","detach_after","destroy_each","element","object_without_properties","svg_element","text","space","empty","listen","prevent_default","stop_propagation","attr","set_attributes","set_custom_element_data","xlink_attr","get_binding_group_value","to_number","time_ranges_to_array","children","claim_element","claim_text","set_data","set_input_type","set_style","select_option","select_options","select_value","select_multiple_value","add_resize_listener","toggle_class","custom_event","destroy_block","outro_and_destroy_block","fix_and_outro_and_destroy_block","update_keyed_each","measure","current_component","set_current_component","beforeUpdate","onMount","afterUpdate","onDestroy","createEventDispatcher","setContext","getContext","bubble","clear_loops","loop","dirty_components","intros","schedule_update","tick","add_binding_callback","add_render_callback","add_flush_callback","flush","get_spread_update","invalid_attribute_name_character","spread","escaped","escape","each","missing_component","validate_component","debug","create_ssr_component","get_store_value","group_outros","check_outros","on_outro","create_in_transition","create_out_transition","create_bidirectional_transition","noop","identity","assign","is_promise","add_location","run","blank_object","run_all","is_function","safe_not_equal","not_equal","validate_store","subscribe","create_slot","get_slot_context","get_slot_changes","exclude_internal_props","now","set_now","bind","mount_component","init","SvelteElement","SvelteComponent","SvelteComponentDev"]);

function remove_indentation(code, node) {
	const indent = code.getIndentString();
	const pattern = new RegExp(`^${indent}`, 'gm');

	const excluded = [];

	walk(node, {
		enter(node) {
			if (node.type === 'TemplateElement') {
				excluded.push(node);
			}
		}
	});

	const str = code.original.slice(node.start, node.end);

	let match;
	while (match = pattern.exec(str)) {
		const index = node.start + match.index;
		while (excluded[0] && excluded[0].end < index) excluded.shift();
		if (excluded[0] && excluded[0].start < index) continue;

		code.remove(index, index + indent.length);
	}
}

function add_indentation(code, node, levels = 1) {
	const base_indent = code.getIndentString();
	const indent = repeat(base_indent, levels);
	const pattern = /\n/gm;

	const excluded = [];

	walk(node, {
		enter(node) {
			if (node.type === 'TemplateElement') {
				excluded.push(node);
			}
		}
	});

	const str = code.original.slice(node.start, node.end);

	let match;
	while (match = pattern.exec(str)) {
		const index = node.start + match.index;
		while (excluded[0] && excluded[0].end < index) excluded.shift();
		if (excluded[0] && excluded[0].start < index) continue;

		code.appendLeft(index + 1, indent);
	}
}

// We need to tell estree-walker that it should always
// look for an `else` block, otherwise it might get
// the wrong idea about the shape of each/if blocks
childKeys.EachBlock = childKeys.IfBlock = ['children', 'else'];
childKeys.Attribute = ['value'];
childKeys.ExportNamedDeclaration = ['declaration', 'specifiers'];

function remove_node(code, start, end, body, node) {
	const i = body.indexOf(node);
	if (i === -1) throw new Error('node not in list');

	let a;
	let b;

	if (body.length === 1) {
		// remove everything, leave {}
		a = start;
		b = end;
	} else if (i === 0) {
		// remove everything before second node, including comments
		a = start;
		while (/\s/.test(code.original[a])) a += 1;

		b = body[i].end;
		while (/[\s,]/.test(code.original[b])) b += 1;
	} else {
		// remove the end of the previous node to the end of this one
		a = body[i - 1].end;
		b = node.end;
	}

	code.remove(a, b);
	return;
}

class Component {
	
	

	
	
	
	
	
	
	
	
	

	
	
	
	

	__init() {this.vars = [];}
	__init2() {this.var_lookup = new Map();}

	__init3() {this.imports = [];}
	
	

	__init4() {this.hoistable_nodes = new Set();}
	__init5() {this.node_for_declaration = new Map();}
	__init6() {this.partly_hoisted = [];}
	__init7() {this.fully_hoisted = [];}
	__init8() {this.reactive_declarations = [];}
	__init9() {this.reactive_declaration_nodes = new Set();}
	__init10() {this.has_reactive_assignments = false;}
	__init11() {this.injected_reactive_declaration_vars = new Set();}
	__init12() {this.helpers = new Set();}

	__init13() {this.indirect_dependencies = new Map();}

	
	

	// TODO this does the same as component.locate! remove one or the other
	




	

	__init14() {this.aliases = new Map();}
	__init15() {this.used_names = new Set();}
	__init16() {this.globally_used_names = new Set();}

	__init17() {this.slots = new Map();}
	__init18() {this.slot_outlets = new Set();}

	constructor(
		ast,
		source,
		name,
		compile_options,
		stats,
		warnings
	) {Component.prototype.__init.call(this);Component.prototype.__init2.call(this);Component.prototype.__init3.call(this);Component.prototype.__init4.call(this);Component.prototype.__init5.call(this);Component.prototype.__init6.call(this);Component.prototype.__init7.call(this);Component.prototype.__init8.call(this);Component.prototype.__init9.call(this);Component.prototype.__init10.call(this);Component.prototype.__init11.call(this);Component.prototype.__init12.call(this);Component.prototype.__init13.call(this);Component.prototype.__init14.call(this);Component.prototype.__init15.call(this);Component.prototype.__init16.call(this);Component.prototype.__init17.call(this);Component.prototype.__init18.call(this);
		this.name = name;

		this.stats = stats;
		this.warnings = warnings;
		this.ast = ast;
		this.source = source;
		this.compile_options = compile_options;

		this.file = compile_options.filename && (
			typeof process !== 'undefined' ? compile_options.filename.replace(process.cwd(), '').replace(/^[\/\\]/, '') : compile_options.filename
		);
		this.locate = getLocator(this.source);

		this.code = new MagicString__default(source);

		// styles
		this.stylesheet = new Stylesheet(source, ast, compile_options.filename, compile_options.dev);
		this.stylesheet.validate(this);

		this.component_options = process_component_options(this, this.ast.html.children);
		this.namespace = namespaces[this.component_options.namespace] || this.component_options.namespace;

		if (compile_options.customElement) {
			if (this.component_options.tag === undefined && compile_options.tag === undefined) {
				const svelteOptions = ast.html.children.find(child => child.name === 'svelte:options');
				this.warn(svelteOptions, {
					code: 'custom-element-no-tag',
					message: `No custom element 'tag' option was specified. To automatically register a custom element, specify a name with a hyphen in it, e.g. <svelte:options tag="my-thing"/>. To hide this warning, use <svelte:options tag={null}/>`
				});
			}
			this.tag = this.component_options.tag || compile_options.tag;
		} else {
			this.tag = this.name;
		}

		this.walk_module_js();
		this.walk_instance_js_pre_template();

		this.fragment = new Fragment(this, ast.html);
		this.name = this.get_unique_name(name);

		this.walk_instance_js_post_template();

		if (!compile_options.customElement) this.stylesheet.reify();

		this.stylesheet.warn_on_unused_selectors(this);
	}

	add_var(variable) {
		this.vars.push(variable);
		this.var_lookup.set(variable.name, variable);
	}

	add_reference(name) {
		const variable = this.var_lookup.get(name);

		if (variable) {
			variable.referenced = true;
		} else if (name === '$$props') {
			this.add_var({
				name,
				injected: true,
				referenced: true
			});
		} else if (name[0] === '$') {
			this.add_var({
				name,
				injected: true,
				referenced: true,
				mutated: true,
				writable: true
			});

			const subscribable_name = name.slice(1);
			this.add_reference(subscribable_name);

			const variable = this.var_lookup.get(subscribable_name);
			if (variable) variable.subscribable = true;
		} else {
			this.used_names.add(name);
		}
	}

	add_sourcemap_locations(node) {
		walk(node, {
			enter: (node) => {
				this.code.addSourcemapLocation(node.start);
				this.code.addSourcemapLocation(node.end);
			},
		});
	}

	alias(name) {
		if (!this.aliases.has(name)) {
			this.aliases.set(name, this.get_unique_name(name));
		}

		return this.aliases.get(name);
	}

	helper(name) {
		this.helpers.add(name);
		return this.alias(name);
	}

	generate(result) {
		let js = null;
		let css = null;

		if (result) {
			const { compile_options, name } = this;
			const { format = 'esm' } = compile_options;

			const banner = `/* ${this.file ? `${this.file} ` : ``}generated by Svelte v${"3.4.1"} */`;

			result = result
				.replace(/__svelte:self__/g, this.name)
				.replace(compile_options.generate === 'ssr' ? /(@+|#+)(\w*(?:-\w*)?)/g : /(@+)(\w*(?:-\w*)?)/g, (match, sigil, name) => {
					if (sigil === '@') {
						if (internal_exports.has(name)) {
							if (compile_options.dev && internal_exports.has(`${name}Dev`)) name = `${name}Dev`;
							this.helpers.add(name);
						}

						return this.alias(name);
					}

					return sigil.slice(1) + name;
				});

			const imported_helpers = Array.from(this.helpers)
				.sort()
				.map(name => {
					const alias = this.alias(name);
					return { name, alias };
				});

			const module = create_module(
				result,
				format,
				name,
				banner,
				compile_options.sveltePath,
				imported_helpers,
				this.imports,
				this.vars.filter(variable => variable.module && variable.export_name).map(variable => ({
					name: variable.name,
					as: variable.export_name
				})),
				this.source
			);

			const parts = module.split('✂]');
			const final_chunk = parts.pop();

			const compiled = new MagicString.Bundle({ separator: '' });

			function add_string(str) {
				compiled.addSource({
					content: new MagicString__default(str),
				});
			}

			const { filename } = compile_options;

			// special case — the source file doesn't actually get used anywhere. we need
			// to add an empty file to populate map.sources and map.sourcesContent
			if (!parts.length) {
				compiled.addSource({
					filename,
					content: new MagicString__default(this.source).remove(0, this.source.length),
				});
			}

			const pattern = /\[✂(\d+)-(\d+)$/;

			parts.forEach((str) => {
				const chunk = str.replace(pattern, '');
				if (chunk) add_string(chunk);

				const match = pattern.exec(str);

				const snippet = this.code.snip(+match[1], +match[2]);

				compiled.addSource({
					filename,
					content: snippet,
				});
			});

			add_string(final_chunk);

			css = compile_options.customElement ?
				{ code: null, map: null } :
				this.stylesheet.render(compile_options.cssOutputFilename, true);

			js = {
				code: compiled.toString(),
				map: compiled.generateMap({
					includeContent: true,
					file: compile_options.outputFilename,
				})
			};
		}

		return {
			js,
			css,
			ast: this.ast,
			warnings: this.warnings,
			vars: this.vars.filter(v => !v.global && !v.internal).map(v => ({
				name: v.name,
				export_name: v.export_name || null,
				injected: v.injected || false,
				module: v.module || false,
				mutated: v.mutated || false,
				reassigned: v.reassigned || false,
				referenced: v.referenced || false,
				writable: v.writable || false
			})),
			stats: this.stats.render()
		};
	}

	get_unique_name(name) {
		if (test) name = `${name}$`;
		let alias = name;
		for (
			let i = 1;
			reserved.has(alias) ||
			this.var_lookup.has(alias) ||
			this.used_names.has(alias) ||
			this.globally_used_names.has(alias);
			alias = `${name}_${i++}`
		);
		this.used_names.add(alias);
		return alias;
	}

	get_unique_name_maker() {
		const local_used_names = new Set();

		function add(name) {
			local_used_names.add(name);
		}

		reserved.forEach(add);
		internal_exports.forEach(add);
		this.var_lookup.forEach((value, key) => add(key));

		return (name) => {
			if (test) name = `${name}$`;
			let alias = name;
			for (
				let i = 1;
				this.used_names.has(alias) ||
				local_used_names.has(alias);
				alias = `${name}_${i++}`
			);
			local_used_names.add(alias);
			this.globally_used_names.add(alias);
			return alias;
		};
	}

	error(
		pos


,
		e 



	) {
		error(e.message, {
			name: 'ValidationError',
			code: e.code,
			source: this.source,
			start: pos.start,
			end: pos.end,
			filename: this.compile_options.filename
		});
	}

	warn(
		pos


,
		warning



	) {
		if (!this.locator) {
			this.locator = getLocator(this.source, { offsetLine: 1 });
		}

		const start = this.locator(pos.start);
		const end = this.locator(pos.end);

		const frame = get_code_frame(this.source, start.line - 1, start.column);

		this.warnings.push({
			code: warning.code,
			message: warning.message,
			frame,
			start,
			end,
			pos: pos.start,
			filename: this.compile_options.filename,
			toString: () => `${warning.message} (${start.line + 1}:${start.column})\n${frame}`,
		});
	}

	extract_imports(content) {
		const { code } = this;

		content.body.forEach(node => {
			if (node.type === 'ImportDeclaration') {
				// imports need to be hoisted out of the IIFE
				remove_node(code, content.start, content.end, content.body, node);
				this.imports.push(node);
			}
		});
	}

	extract_exports(content) {
		const { code } = this;

		content.body.forEach(node => {
			if (node.type === 'ExportDefaultDeclaration') {
				this.error(node, {
					code: `default-export`,
					message: `A component cannot have a default export`
				});
			}

			if (node.type === 'ExportNamedDeclaration') {
				if (node.source) {
					this.error(node, {
						code: `not-implemented`,
						message: `A component currently cannot have an export ... from`
					});
				}
				if (node.declaration) {
					if (node.declaration.type === 'VariableDeclaration') {
						node.declaration.declarations.forEach(declarator => {
							extract_names(declarator.id).forEach(name => {
								const variable = this.var_lookup.get(name);
								variable.export_name = name;
							});
						});
					} else {
						const { name } = node.declaration.id;

						const variable = this.var_lookup.get(name);
						variable.export_name = name;
					}

					code.remove(node.start, node.declaration.start);
				} else {
					remove_node(code, content.start, content.end, content.body, node);
					node.specifiers.forEach(specifier => {
						const variable = this.var_lookup.get(specifier.local.name);

						if (variable) {
							variable.export_name = specifier.exported.name;
						}
					});
				}
			}
		});
	}

	extract_javascript(script) {
		const nodes_to_include = script.content.body.filter(node => {
			if (this.hoistable_nodes.has(node)) return false;
			if (this.reactive_declaration_nodes.has(node)) return false;
			if (node.type === 'ImportDeclaration') return false;
			if (node.type === 'ExportDeclaration' && node.specifiers.length > 0) return false;
			return true;
		});

		if (nodes_to_include.length === 0) return null;

		let a = script.content.start;
		while (/\s/.test(this.source[a])) a += 1;

		let b = a;

		let result = '';

		script.content.body.forEach((node, i) => {
			if (this.hoistable_nodes.has(node) || this.reactive_declaration_nodes.has(node)) {
				if (a !== b) result += `[✂${a}-${b}✂]`;
				a = node.end;
			}

			b = node.end;
		});

		// while (/\s/.test(this.source[a - 1])) a -= 1;

		b = script.content.end;
		while (/\s/.test(this.source[b - 1])) b -= 1;

		if (a < b) result += `[✂${a}-${b}✂]`;

		return result || null;
	}

	walk_module_js() {
		const component = this;
		const script = this.ast.module;
		if (!script) return;

		walk(script.content, {
			enter(node) {
				if (node.type === 'LabeledStatement' && node.label.name === '$') {
					component.warn(node, {
						code: 'module-script-reactive-declaration',
						message: '$: has no effect in a module script'
					});
				}
			}
		});

		this.add_sourcemap_locations(script.content);

		let { scope, globals: globals$$1 } = create_scopes(script.content);
		this.module_scope = scope;

		scope.declarations.forEach((node, name) => {
			if (name[0] === '$') {
				this.error(node, {
					code: 'illegal-declaration',
					message: `The $ prefix is reserved, and cannot be used for variable and import names`
				});
			}

			this.add_var({
				name,
				module: true,
				hoistable: true,
				writable: node.kind === 'var' || node.kind === 'let'
			});
		});

		globals$$1.forEach((node, name) => {
			if (name[0] === '$') {
				this.error(node, {
					code: 'illegal-subscription',
					message: `Cannot reference store value inside <script context="module">`
				});
			} else {
				this.add_var({
					name,
					global: true
				});
			}
		});

		this.extract_imports(script.content);
		this.extract_exports(script.content);
		remove_indentation(this.code, script.content);
		this.module_javascript = this.extract_javascript(script);
	}

	walk_instance_js_pre_template() {
		const script = this.ast.instance;
		if (!script) return;

		this.add_sourcemap_locations(script.content);

		// inject vars for reactive declarations
		script.content.body.forEach(node => {
			if (node.type !== 'LabeledStatement') return;
			if (node.body.type !== 'ExpressionStatement') return;

			const expression = unwrap_parens(node.body.expression);
			if (expression.type !== 'AssignmentExpression') return;

			extract_names(expression.left).forEach(name => {
				if (!this.var_lookup.has(name) && name[0] !== '$') {
					this.injected_reactive_declaration_vars.add(name);
				}
			});
		});

		let { scope: instance_scope, map, globals: globals$$1 } = create_scopes(script.content);
		this.instance_scope = instance_scope;
		this.instance_scope_map = map;

		instance_scope.declarations.forEach((node, name) => {
			if (name[0] === '$') {
				this.error(node, {
					code: 'illegal-declaration',
					message: `The $ prefix is reserved, and cannot be used for variable and import names`
				});
			}

			this.add_var({
				name,
				initialised: instance_scope.initialised_declarations.has(name),
				hoistable: /^Import/.test(node.type),
				writable: node.kind === 'var' || node.kind === 'let'
			});

			this.node_for_declaration.set(name, node);
		});

		globals$$1.forEach((node, name) => {
			if (this.var_lookup.has(name)) return;

			if (this.injected_reactive_declaration_vars.has(name)) {
				this.add_var({
					name,
					injected: true,
					writable: true,
					reassigned: true,
					initialised: true
				});
			} else if (name === '$$props') {
				this.add_var({
					name,
					injected: true
				});
			} else if (name[0] === '$') {
				this.add_var({
					name,
					injected: true,
					mutated: true,
					writable: true
				});

				this.add_reference(name.slice(1));

				const variable = this.var_lookup.get(name.slice(1));
				if (variable) variable.subscribable = true;
			} else {
				this.add_var({
					name,
					global: true
				});
			}
		});

		this.extract_imports(script.content);
		this.extract_exports(script.content);
		this.track_mutations();
	}

	walk_instance_js_post_template() {
		const script = this.ast.instance;
		if (!script) return;

		this.hoist_instance_declarations();
		this.extract_reactive_declarations();
		this.extract_reactive_store_references();
		this.javascript = this.extract_javascript(script);
	}

	// TODO merge this with other walks that are independent
	track_mutations() {
		const component = this;
		const { instance_scope, instance_scope_map: map } = this;

		let scope = instance_scope;

		walk(this.ast.instance.content, {
			enter(node, parent) {
				if (map.has(node)) {
					scope = map.get(node);
				}

				let names;
				let deep = false;

				if (node.type === 'AssignmentExpression') {
					deep = node.left.type === 'MemberExpression';

					names = deep
						? [get_object(node.left).name]
						: extract_names(node.left);
				} else if (node.type === 'UpdateExpression') {
					names = [get_object(node.argument).name];
				}

				if (names) {
					names.forEach(name => {
						if (scope.find_owner(name) === instance_scope) {
							const variable = component.var_lookup.get(name);
							variable[deep ? 'mutated' : 'reassigned'] = true;
						}
					});
				}
			},

			leave(node) {
				if (map.has(node)) {
					scope = scope.parent;
				}
			}
		});
	}

	extract_reactive_store_references() {
		// TODO this pattern happens a lot... can we abstract it
		// (or better still, do fewer AST walks)?
		const component = this;
		let { instance_scope: scope, instance_scope_map: map } = this;

		walk(this.ast.instance.content, {
			enter(node, parent) {
				if (map.has(node)) {
					scope = map.get(node);
				}

				if (node.type === 'LabeledStatement' && node.label.name === '$' && parent.type !== 'Program') {
					component.warn(node, {
						code: 'non-top-level-reactive-declaration',
						message: '$: has no effect outside of the top-level'
					});
				}

				if (isReference(node, parent)) {
					const object = get_object(node);
					const { name } = object;

					if (name[0] === '$' && !scope.has(name)) {
						component.warn_if_undefined(name, object, null);
					}
				}
			},

			leave(node) {
				if (map.has(node)) {
					scope = scope.parent;
				}
			}
		});
	}

	invalidate(name, value) {
		const variable = this.var_lookup.get(name);

		if (variable && (variable.subscribable && variable.reassigned)) {
			return `$$subscribe_${name}(), $$invalidate('${name}', ${value || name})`;
		}

		if (name[0] === '$' && name[1] !== '$') {
			return `${name.slice(1)}.set(${name})`
		}

		if (value) {
			return `$$invalidate('${name}', ${value})`;
		}

		// if this is a reactive declaration, invalidate dependencies recursively
		const deps = new Set([name]);

		deps.forEach(name => {
			const reactive_declarations = this.reactive_declarations.filter(x => x.assignees.has(name));
			reactive_declarations.forEach(declaration => {
				declaration.dependencies.forEach(name => {
					deps.add(name);
				});
			});
		});

		return Array.from(deps).map(n => `$$invalidate('${n}', ${n})`).join(', ');
	}

	rewrite_props(get_insert) {
		const component = this;
		const { code, instance_scope, instance_scope_map: map } = this;
		let scope = instance_scope;

		const coalesced_declarations = [];
		let current_group;

		walk(this.ast.instance.content, {
			enter(node, parent) {
				if (/Function/.test(node.type)) {
					current_group = null;
					return this.skip();
				}

				if (map.has(node)) {
					scope = map.get(node);
				}

				if (node.type === 'VariableDeclaration') {
					if (node.kind === 'var' || scope === instance_scope) {
						node.declarations.forEach((declarator, i) => {
							const next = node.declarations[i + 1];

							if (declarator.id.type !== 'Identifier') {
								const inserts = [];

								extract_names(declarator.id).forEach(name => {
									const variable = component.var_lookup.get(name);

									if (variable.export_name) {
										component.error(declarator, {
											code: 'destructured-prop',
											message: `Cannot declare props in destructured declaration`
										});
									}

									if (variable.subscribable) {
										inserts.push(get_insert(variable));
									}
								});

								if (inserts.length > 0) {
									if (next) {
										code.overwrite(declarator.end, next.start, `; ${inserts.join('; ')}; ${node.kind} `);
									} else {
										code.appendLeft(declarator.end, `; ${inserts.join('; ')}`);
									}
								}

								return;
							}

							const { name } = declarator.id;
							const variable = component.var_lookup.get(name);

							if (variable.export_name) {
								if (current_group && current_group.kind !== node.kind) {
									current_group = null;
								}

								const insert = variable.subscribable
									? get_insert(variable)
									: null;

								if (!current_group || (current_group.insert && insert)) {
									current_group = { kind: node.kind, declarators: [declarator], insert };
									coalesced_declarations.push(current_group);
								} else if (insert) {
									current_group.insert = insert;
									current_group.declarators.push(declarator);
								} else {
									current_group.declarators.push(declarator);
								}

								if (variable.writable && variable.name !== variable.export_name) {
									code.prependRight(declarator.id.start, `${variable.export_name}: `);
								}

								if (next) {
									const next_variable = component.var_lookup.get(next.id.name);
									const new_declaration = !next_variable.export_name
										|| (current_group.insert && next_variable.subscribable);

									if (new_declaration) {
										code.overwrite(declarator.end, next.start, ` ${node.kind} `);
									}
								}
							} else {
								current_group = null;

								if (variable.subscribable) {
									let insert = get_insert(variable);

									if (next) {
										code.overwrite(declarator.end, next.start, `; ${insert}; ${node.kind} `);
									} else {
										code.appendLeft(declarator.end, `; ${insert}`);
									}
								}
							}
						});
					}
				} else {
					if (node.type !== 'ExportNamedDeclaration') {
						if (!parent || parent.type === 'Program') current_group = null;
					}
				}
			},

			leave(node) {
				if (map.has(node)) {
					scope = scope.parent;
				}
			}
		});

		coalesced_declarations.forEach(group => {
			const writable = group.kind === 'var' || group.kind === 'let';

			let c = 0;
			let combining = false;

			group.declarators.forEach(declarator => {
				const { id } = declarator;

				if (combining) {
					code.overwrite(c, id.start, ', ');
				} else {
					if (writable) code.appendLeft(id.start, '{ ');
					combining = true;
				}

				c = declarator.end;
			});

			if (combining) {
				const insert = group.insert
					? `; ${group.insert}`
					: '';

				const suffix = `${writable ? ` } = $$props` : ``}${insert}` + (code.original[c] === ';' ? `` : `;`);
				code.appendLeft(c, suffix);
			}
		});
	}

	hoist_instance_declarations() {
		// we can safely hoist variable declarations that are
		// initialised to literals, and functions that don't
		// reference instance variables other than other
		// hoistable functions. TODO others?

		const { hoistable_nodes, var_lookup, injected_reactive_declaration_vars } = this;

		const top_level_function_declarations = new Map();

		this.ast.instance.content.body.forEach(node => {
			if (node.type === 'VariableDeclaration') {
				const all_hoistable = node.declarations.every(d => {
					if (!d.init) return false;
					if (d.init.type !== 'Literal') return false;

					const v = this.var_lookup.get(d.id.name);
					if (v.reassigned) return false
					if (v.export_name) return false

					if (this.var_lookup.get(d.id.name).reassigned) return false;
					if (this.vars.find(variable => variable.name === d.id.name && variable.module)) return false;

					return true;
				});

				if (all_hoistable) {
					node.declarations.forEach(d => {
						const variable = this.var_lookup.get(d.id.name);
						variable.hoistable = true;
					});

					hoistable_nodes.add(node);
					this.fully_hoisted.push(`[✂${node.start}-${node.end}✂]`);
				}
			}

			if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration') {
				top_level_function_declarations.set(node.declaration.id.name, node);
			}

			if (node.type === 'FunctionDeclaration') {
				top_level_function_declarations.set(node.id.name, node);
			}
		});

		const checked = new Set();
		let walking = new Set();

		const is_hoistable = fn_declaration => {
			if (fn_declaration.type === 'ExportNamedDeclaration') {
				fn_declaration = fn_declaration.declaration;
			}

			const instance_scope = this.instance_scope;
			let scope = this.instance_scope;
			let map = this.instance_scope_map;

			let hoistable = true;

			// handle cycles
			walking.add(fn_declaration);

			walk(fn_declaration, {
				enter(node, parent) {
					if (map.has(node)) {
						scope = map.get(node);
					}

					if (isReference(node, parent)) {
						const { name } = flatten_reference(node);
						const owner = scope.find_owner(name);

						if (node.type === 'Identifier' && injected_reactive_declaration_vars.has(name)) {
							hoistable = false;
						} else if (name[0] === '$' && !owner) {
							hoistable = false;
						} else if (owner === instance_scope) {
							if (name === fn_declaration.id.name) return;

							const variable = var_lookup.get(name);
							if (variable.hoistable) return;

							if (top_level_function_declarations.has(name)) {
								const other_declaration = top_level_function_declarations.get(name);

								if (walking.has(other_declaration)) {
									hoistable = false;
								} else if (other_declaration.type === 'ExportNamedDeclaration' && walking.has(other_declaration.declaration)) {
									hoistable = false;
								} else if (!is_hoistable(other_declaration)) {
									hoistable = false;
                }
							}

							else {
								hoistable = false;
							}
						}

						this.skip();
					}
				},

				leave(node) {
					if (map.has(node)) {
						scope = scope.parent;
					}
				}
			});

			checked.add(fn_declaration);
			walking.delete(fn_declaration);

			return hoistable;
		};

		for (const [name, node] of top_level_function_declarations) {
			if (is_hoistable(node)) {
				const variable = this.var_lookup.get(name);
				variable.hoistable = true;
				hoistable_nodes.add(node);

				remove_indentation(this.code, node);

				this.fully_hoisted.push(`[✂${node.start}-${node.end}✂]`);
			}
		}
	}

	extract_reactive_declarations() {
		const component = this;

		const unsorted_reactive_declarations = [];

		this.ast.instance.content.body.forEach(node => {
			if (node.type === 'LabeledStatement' && node.label.name === '$') {
				this.reactive_declaration_nodes.add(node);

				const assignees = new Set();
				const assignee_nodes = new Set();
				const dependencies = new Set();

				let scope = this.instance_scope;
				let map = this.instance_scope_map;

				walk(node.body, {
					enter(node, parent) {
						if (map.has(node)) {
							scope = map.get(node);
						}

						if (node.type === 'AssignmentExpression') {
							extract_identifiers(get_object(node.left)).forEach(node => {
								assignee_nodes.add(node);
								assignees.add(node.name);
							});
						} else if (node.type === 'UpdateExpression') {
							const identifier = get_object(node.argument);
							assignees.add(identifier.name);
						} else if (isReference(node, parent)) {
							const identifier = get_object(node);
							if (!assignee_nodes.has(identifier)) {
								const { name } = identifier;
								const owner = scope.find_owner(name);
								const component_var = component.var_lookup.get(name);
								const is_writable_or_mutated = component_var && (component_var.writable || component_var.mutated);
								if (
									(!owner || owner === component.instance_scope) &&
									(name[0] === '$' || is_writable_or_mutated)
								) {
									dependencies.add(name);
								}
							}

							this.skip();
						}
					},

					leave(node) {
						if (map.has(node)) {
							scope = scope.parent;
						}
					}
				});

				add_indentation(this.code, node.body, 2);

				const expression = node.body.expression && unwrap_parens(node.body.expression);
				const declaration = expression && expression.left;

				unsorted_reactive_declarations.push({ assignees, dependencies, node, declaration });
			}
		});

		const lookup = new Map();
		let seen;

		unsorted_reactive_declarations.forEach(declaration => {
			declaration.assignees.forEach(name => {
				if (!lookup.has(name)) {
					lookup.set(name, []);
				}

				// TODO warn or error if a name is assigned to in
				// multiple reactive declarations?
				lookup.get(name).push(declaration);
			});
		});

		const add_declaration = declaration => {
			if (seen.has(declaration)) {
				this.error(declaration.node, {
					code: 'cyclical-reactive-declaration',
					message: 'Cyclical dependency detected'
				});
			}

			if (this.reactive_declarations.indexOf(declaration) !== -1) {
				return;
			}

			seen.add(declaration);

			declaration.dependencies.forEach(name => {
				if (declaration.assignees.has(name)) return;
				const earlier_declarations = lookup.get(name);
				if (earlier_declarations) earlier_declarations.forEach(declaration => {
					add_declaration(declaration);
				});
			});

			this.reactive_declarations.push(declaration);
		};

		unsorted_reactive_declarations.forEach(declaration => {
			seen = new Set();
			add_declaration(declaration);
		});
	}

	qualify(name) {
		if (name === `$$props`) return `ctx.$$props`;

		const variable = this.var_lookup.get(name);

		if (!variable) return name;

		this.add_reference(name); // TODO we can probably remove most other occurrences of this

		if (variable.hoistable) return name;

		return `ctx.${name}`;
	}

	warn_if_undefined(name, node, template_scope) {
		if (name[0] === '$') {
			name = name.slice(1);
			this.has_reactive_assignments = true; // TODO does this belong here?

			if (name[0] === '$') return; // $$props
		}

		if (this.var_lookup.has(name) && !this.var_lookup.get(name).global) return;
		if (template_scope && template_scope.names.has(name)) return;
		if (globals.has(name)) return;

		let message = `'${name}' is not defined`;
		if (!this.ast.instance) message += `. Consider adding a <script> block with 'export let ${name}' to declare a prop`;

		this.warn(node, {
			code: 'missing-declaration',
			message
		});
	}
}

function process_component_options(component, nodes) {
	const component_options = {
		immutable: component.compile_options.immutable || false,
		accessors: 'accessors' in component.compile_options
			? component.compile_options.accessors
			: !!component.compile_options.customElement,
		preserveWhitespace: !!component.compile_options.preserveWhitespace
	};

	const node = nodes.find(node => node.name === 'svelte:options');

	function get_value(attribute, code, message) {
		const { value } = attribute;
		const chunk = value[0];

		if (!chunk) return true;

		if (value.length > 1) {
			component.error(attribute, { code, message });
		}

		if (chunk.type === 'Text') return chunk.data;

		if (chunk.expression.type !== 'Literal') {
			component.error(attribute, { code, message });
		}

		return chunk.expression.value;
	}

	if (node) {
		node.attributes.forEach(attribute => {
			if (attribute.type === 'Attribute') {
				const { name } = attribute;

				switch (name) {
					case 'tag': {
						const code = 'invalid-tag-attribute';
						const message = `'tag' must be a string literal`;
						const tag = get_value(attribute, code, message);

						if (typeof tag !== 'string' && tag !== null) component.error(attribute, { code, message });

						if (tag && !/^[a-zA-Z][a-zA-Z0-9]*-[a-zA-Z0-9-]+$/.test(tag)) {
							component.error(attribute, {
								code: `invalid-tag-property`,
								message: `tag name must be two or more words joined by the '-' character`
							});
						}

						component_options.tag = tag;
						break;
					}

					case 'namespace': {
						const code = 'invalid-namespace-attribute';
						const message = `The 'namespace' attribute must be a string literal representing a valid namespace`;
						const ns = get_value(attribute, code, message);

						if (typeof ns !== 'string') component.error(attribute, { code, message });

						if (valid_namespaces.indexOf(ns) === -1) {
							const match = fuzzymatch(ns, valid_namespaces);
							if (match) {
								component.error(attribute, {
									code: `invalid-namespace-property`,
									message: `Invalid namespace '${ns}' (did you mean '${match}'?)`
								});
							} else {
								component.error(attribute, {
									code: `invalid-namespace-property`,
									message: `Invalid namespace '${ns}'`
								});
							}
						}

						component_options.namespace = ns;
						break;
					}

					case 'accessors':
					case 'immutable':
					case 'preserveWhitespace':
						const code = `invalid-${name}-value`;
						const message = `${name} attribute must be true or false`;
						const value = get_value(attribute, code, message);

						if (typeof value !== 'boolean') component.error(attribute, { code, message });

						component_options[name] = value;
						break;

					default:
						component.error(attribute, {
							code: `invalid-options-attribute`,
							message: `<svelte:options> unknown attribute`
						});
				}
			}

			else {
				component.error(attribute, {
					code: `invalid-options-attribute`,
					message: `<svelte:options> can only have static 'tag', 'namespace', 'accessors', 'immutable' and 'preserveWhitespace' attributes`
				});
			}
		});
	}

	return component_options;
}

const valid_options = [
	'format',
	'name',
	'filename',
	'generate',
	'outputFilename',
	'cssOutputFilename',
	'sveltePath',
	'dev',
	'accessors',
	'immutable',
	'hydratable',
	'legacy',
	'customElement',
	'tag',
	'css',
	'preserveComments',
	'preserveWhitespace'
];

function validate_options(options, warnings) {
	const { name, filename } = options;

	Object.keys(options).forEach(key => {
		if (valid_options.indexOf(key) === -1) {
			const match = fuzzymatch(key, valid_options);
			let message = `Unrecognized option '${key}'`;
			if (match) message += ` (did you mean '${match}'?)`;

			throw new Error(message);
		}
	});

	if (name && !/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
		throw new Error(`options.name must be a valid identifier (got '${name}')`);
	}

	if (name && /^[a-z]/.test(name)) {
		const message = `options.name should be capitalised`;
		warnings.push({
			code: `options-lowercase-name`,
			message,
			filename,
			toString: () => message,
		});
	}
}

function get_name(filename) {
	if (!filename) return null;
	const parts = filename.split(/[\/\\]/);

	if (parts.length > 1 && /^index\.\w+/.test(parts[parts.length - 1])) {
		parts.pop();
	}

	const base = parts.pop()
		.replace(/\..+/, "")
		.replace(/[^a-zA-Z_$0-9]+/g, '_')
		.replace(/^_/, '')
		.replace(/_$/, '')
		.replace(/^(\d)/, '_$1');

	return base[0].toUpperCase() + base.slice(1);
}

function compile(source, options = {}) {
	options = assign({ generate: 'dom', dev: false }, options);

	const stats = new Stats();
	const warnings = [];

	let ast;

	validate_options(options, warnings);

	stats.start('parse');
	ast = parse$2(source, options);
	stats.stop('parse');

	stats.start('create component');
	const component = new Component(
		ast,
		source,
		options.name || get_name(options.filename) || 'Component',
		options,
		stats,
		warnings
	);
	stats.stop('create component');

	const js = options.generate === false
		? null
		: options.generate === 'ssr'
			? ssr(component, options)
			: dom(component, options);

	return component.generate(js);
}

function parse_attribute_value(value) {
	return /^['"]/.test(value) ?
		value.slice(1, -1) :
		value;
}

function parse_attributes(str) {
	const attrs = {};
	str.split(/\s+/).filter(Boolean).forEach(attr => {
		const [name, value] = attr.split('=');
		attrs[name] = value ? parse_attribute_value(value) : true;
	});
	return attrs;
}







async function replace_async(str, re, func) {
	const replacements = [];
	str.replace(re, (...args) => {
		replacements.push(
			func(...args).then(
				res =>
					({
						offset: args[args.length - 2],
						length: args[0].length,
						replacement: res,
					})
			)
		);
		return '';
	});
	let out = '';
	let last_end = 0;
	for (const { offset, length, replacement } of await Promise.all(
		replacements
	)) {
		out += str.slice(last_end, offset) + replacement;
		last_end = offset + length;
	}
	out += str.slice(last_end);
	return out;
}

async function preprocess(
	source,
	preprocessor,
	options
) {
	const filename = (options && options.filename) || preprocessor.filename; // legacy
	const dependencies = [];

	const preprocessors = Array.isArray(preprocessor) ? preprocessor : [preprocessor];

	const markup = preprocessors.map(p => p.markup).filter(Boolean);
	const script = preprocessors.map(p => p.script).filter(Boolean);
	const style = preprocessors.map(p => p.style).filter(Boolean);

	for (const fn of markup) {
		const processed = await fn({
			content: source,
			filename
		});
		if (processed && processed.dependencies) dependencies.push(...processed.dependencies);
		source = processed ? processed.code : source;
	}

	for (const fn of script) {
		source = await replace_async(
			source,
			/<script(\s[^]*?)?>([^]*?)<\/script>/gi,
			async (match, attributes = '', content) => {
				const processed = await fn({
					content,
					attributes: parse_attributes(attributes),
					filename
				});
				if (processed && processed.dependencies) dependencies.push(...processed.dependencies);
				return processed ? `<script${attributes}>${processed.code}</script>` : match;
			}
		);
	}

	for (const fn of style) {
		source = await replace_async(
			source,
			/<style(\s[^]*?)?>([^]*?)<\/style>/gi,
			async (match, attributes = '', content) => {
				const processed = await fn({
					content,
					attributes: parse_attributes(attributes),
					filename
				});
				if (processed && processed.dependencies) dependencies.push(...processed.dependencies);
				return processed ? `<style${attributes}>${processed.code}</style>` : match;
			}
		);
	}

	return {
		// TODO return separated output, in future version where svelte.compile supports it:
		// style: { code: styleCode, map: styleMap },
		// script { code: scriptCode, map: scriptMap },
		// markup { code: markupCode, map: markupMap },

		code: source,
		dependencies: [...new Set(dependencies)],

		toString() {
			return source;
		}
	};
}

const VERSION = '3.4.1';

exports.VERSION = VERSION;
exports.compile = compile;
exports.parse = parse$2;
exports.preprocess = preprocess;
exports.walk = walk;
//# sourceMappingURL=compiler.js.map
