(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xCatelogue"] = factory();
	else
		root["xCatelogue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var xCatelogue = function(options){
	// this.defaultOptions = {
	// 	element: null,

	// };
	this.titles = {};
	this.selector = options.contentRootElement;
	if(this.selector){
		try{
			var element = document.querySelector(this.selector);
		}catch(e){
			e.name = 'contentRootElement must be a valid Selector';
		}
	}else{
		throw new Error('contentRootElement can not be found');
	}
	this.extractTitle();
}
xCatelogue.prototype.extractTitle = function(){
	// 考虑搜索引擎对h的规则，h1应当只有一个，所以从h2开始计算标题
	this.titles.h1 = Array.from(document.querySelectorAll(this.selector + ' h1'));
	this.titles.h2 = Array.from(document.querySelectorAll(this.selector + ' h2'));
	this.titles.h3 = Array.from(document.querySelectorAll(this.selector + ' h3'));
	setTitlesId(this.titles);
}
xCatelogue.prototype.generateCatelogue = function(){

	seekForHierarchy(this.titles.h1);
	return '<div class="x-catelogue">' + catelogueToHTML(this.titles.h1) + '</div>';
}
var catelogueToHTML = function(h){
	var html = "";
	if(h.length > 0){
		h.forEach(function(o, i){
			html += '<li><a href="#' + o.getAttribute('id') + '">' + o.innerText + '</a></li>';
		});
		html = '<ul>' + html + '</ul>';
	}
	return html;
}
var setTitlesId = function(titles){
	for(var h in titles){
		if(titles.hasOwnProperty(h)){
			titles[h].forEach(function(o, i){
				o.setAttribute('id', 'xCategory' + h + '-' + i);
			});
		}
	}
}
var countOffsetTop = function(element){
	var offsetTop = element.offsetTop, offsetParent = element.offsetParent;
	return offsetParent && (offsetTop + countOffsetTop(offsetParent)) || offsetTop;
}
var seekForHierarchy = function(element){
	var titleTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	var tagNameIndex = titleTags.indexOf(element.tagName.toLowerCase()) + 1;
	titleTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(tagName);

	var subTitles = [];
	if(element.nextElementSibling.tagName.toLowerCase().indexOf(titleTags) != -1){ //是子标题
		subTitles.push(element.nextElementSibling);
	}else if(element.tagName === element.nextElementSibling.tagName){ //同级标题

	}

}


/***/ })
/******/ ]);
});