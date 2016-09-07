/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

eval("throw new Error(\"Module build failed: SyntaxError: Unexpected token (159:1)\\n    at Parser.pp$4.raise (/Users/aholtgraver/Projects/brownphone/node_modules/buble/node_modules/acorn/dist/acorn.js:2221:15)\\n    at Parser.pp.unexpected (/Users/aholtgraver/Projects/brownphone/node_modules/buble/node_modules/acorn/dist/acorn.js:603:10)\\n    at Parser.pp.jsx_parseIdentifier (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:464:14)\\n    at Parser.pp.jsx_parseNamespacedName (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:473:23)\\n    at Parser.pp.jsx_parseElementName (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:486:23)\\n    at Parser.pp.jsx_parseOpeningElementAt (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:560:24)\\n    at Parser.pp.jsx_parseElementAt (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:583:33)\\n    at Parser.pp.jsx_parseElement (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:632:19)\\n    at Parser.parseExprAtom (/Users/aholtgraver/Projects/brownphone/node_modules/buble/dist/buble.umd.js:654:25)\\n    at Parser.pp$3.parseExprSubscripts (/Users/aholtgraver/Projects/brownphone/node_modules/buble/node_modules/acorn/dist/acorn.js:1715:21)\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);