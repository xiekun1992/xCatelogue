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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************!*\
  !*** ./src/catelogue.js ***!
  \**************************/
/***/ function(module, exports) {

	'use strict';
	
	var xCatelogue = function(options){
		this.element = null;
		this.catelogue = [];
		this.elementOffsetTop = [];
		this.titles = {};
		this.selector = options.contentContainer;
		if(this.selector){
			this.element = document.querySelector(this.selector);
			if(!this.element){
				throw new Error('contentContainer must be a valid Selector');
			}
		}else{
			throw new Error('contentContainer can not be found');
		}
		this.extractTitle();
		if(options.catelogueContainer){
			this.catelogueContainer = document.querySelector(options.catelogueContainer);
			if(!this.element){
				throw new Error('catelogueContainer must be a valid Selector');
			}
			this.catelogueContainer.innerHTML += this.generateCatelogue();
		}
	};
	xCatelogue.prototype.extractTitle = function(){
		// 考虑搜索引擎对h的规则，h1应当只有一个，所以从h2开始计算标题
		this.titles.h1 = Array.from(document.querySelectorAll(this.selector + ' h1'));
		this.titles.h2 = Array.from(document.querySelectorAll(this.selector + ' h2'));
		this.titles.h3 = Array.from(document.querySelectorAll(this.selector + ' h3'));
		this.titles.h4 = Array.from(document.querySelectorAll(this.selector + ' h4'));
		this.titles.h5 = Array.from(document.querySelectorAll(this.selector + ' h5'));
		this.titles.h6 = Array.from(document.querySelectorAll(this.selector + ' h6'));
		setTitlesId(this.titles);
	};
	xCatelogue.prototype.generateCatelogue = function(forceRefresh){
		if(forceRefresh || this.catelogue.length == 0){
			this.catelogue.length = 0;
			this.updateCatelogue();
		}
		return '<div class="x-catelogue">' + catelogueToHTML(this.catelogue) + '</div>';
	};
	xCatelogue.prototype.updateCatelogue = function(){
		root = {self: this.element, children: this.catelogue, parent: null};
		for(var c of Array.from(this.element.children)){
			if(["H1", "H2", "H3", "H4", "H5", "H6"].indexOf(c.tagName) != -1){
				// label offsetTop
				this.elementOffsetTop.push({offsetTop: countOffsetTop(c), id: c.getAttribute('id')});
			}
		}
		this.elementOffsetTop.push({offsetTop: Infinity});
		seekForHierarchy(this.element.children[0], root);
	};
	xCatelogue.prototype.bootstrap = function(){
		var as = Array.from(document.querySelectorAll('.x-catelogue a')), clicked = false;
		for(var a of as){
			a.addEventListener('click', function(e){
				// console.log('click')
				clicked = true;
				highlight(e.target.getAttribute('href'));
			}, false);
		}
		onscroll();
		window.addEventListener('scroll', onscroll);
	
		function highlight(hash){
			// console.log(hash)
			if(hash.length > 1){
				var as = Array.from(document.querySelectorAll('.x-catelogue a'));
				for(var a of as){
					a.classList.remove('active');
				}
				var currentHash = document.querySelectorAll("a[href='" + hash + "']");
				currentHash && currentHash.forEach(function(h){
					h.classList.add('active');
				});
			}
		}
		function onscroll(){
			// scroll会在click触发完成之后执行，使用哨兵clicked去除多余的highlight调用
			if(clicked) return clicked = false;
			// 滚动到底了
			var id;
			if(window.scrollY + window.innerHeight == document.body.clientHeight){
				id = c.elementOffsetTop[c.elementOffsetTop.length - 2].id;
			}else{
				var pre = c.elementOffsetTop[0];
				for(var e of c.elementOffsetTop){
					// 计算出现的偏移量容错
					if(e.offsetTop == window.scrollY || e.offsetTop == window.scrollY + 1){
						// console.log(e);
						id = e.id;
						break;
					}else if(e.offsetTop > window.scrollY){
						id = pre.id;
						break;
					}else{
						pre = e;
					}
				}
			}
			highlight('#' + id);
		}
	};
	
	var root;
	
	var catelogueToHTML = function(h){
		var html = "";
		if(h.length > 0){
			for(var i in h){
				if(h.hasOwnProperty(i)){
					var o = h[i], childrenHtml = catelogueToHTML(o.children);
					html += '<li><a href="#' + o.self.getAttribute('id') + '">' + o.self.innerText + '</a>' + childrenHtml + '</li>';
				}
			}
			html = '<ul>' + html + '</ul>';
		}
		return html;
	};
	var setTitlesId = function(titles){
		for(var h in titles){
			if(titles.hasOwnProperty(h)){
				titles[h].forEach(function(o, i){
					o.setAttribute('id', 'xCategory' + h + '-' + i);
				});
			}
		}
	};
	var countOffsetTop = function(element){
		var offsetTop = element.offsetTop, offsetParent = element.offsetParent;
		return offsetParent && (offsetTop + countOffsetTop(offsetParent)) || offsetTop;
	};
	var seekForHierarchy = function(element, tree){
		if(element instanceof HTMLElement){
			var node = {self: element, children: [], parent: tree};
			tree.children.push(node);
	
			var titleTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
			var tagName = element.tagName;
			var tagNameIndex = titleTags.indexOf(tagName);
			
			var nextElement = element.nextElementSibling;
			if(nextElement){
				var pos = titleTags.indexOf(nextElement.tagName);
				if(pos == -1){ //非标题标签
					return ;
				}else if(pos > tagNameIndex){ //子标题
					// node.children.push(nextElement);
					seekForHierarchy(nextElement, node);
				}else if(pos == tagNameIndex){ //同级标题
					// peers.push(nextElement);
					seekForHierarchy(nextElement, tree);
				}else{ //父级标题
					var parentNode = tree;
					while(parentNode && parentNode.self.tagName != nextElement.tagName){
						parentNode = parentNode.parent;
					}
					seekForHierarchy(nextElement, parentNode && parentNode.parent || root);
				}
			}
		}
	};
	
	module.exports = xCatelogue;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=xcatelogue.js.map