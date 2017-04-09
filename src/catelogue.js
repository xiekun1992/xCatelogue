(function(xCatelogue){
	if(typeof define === 'function' && define.amd){ //amd
		define('xCatelogue', xCatelogue);
	}else if(typeof module === 'object' && module.exports && typeof exports === 'object'){//commonjs
		module.exports = xCatelogue();
	}else if(typeof exports === 'object'){ //es6
		exports.xCatelogue = xCatelogue();
	}else{ //default
		this.xCatelogue = xCatelogue();
	}
})(function(){
	'use strict';

	var xCatelogue = function(options){
		this.element = null;
		this.catelogue = [];
		this.elementOffsetTop = [];
		this.titles = {};
		this.titleTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
		this.useCustomTitles = false;

		this.selector = options.contentContainer;
		this.showBackToTop = options.showBackToTop;
		if(Object.prototype.toString.call(options.customTitles) === '[object Array]' && options.customTitles.length > 0 && options.customTitleAttr){
			this.titleTags = options.customTitles;
			this.customTitleAttr = options.customTitleAttr;
			this.useCustomTitles = true;
		}

		if(typeof this.showBackToTop === 'undefined'){
			this.showBackToTop = true;
		}
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
		for(var i = 0; i < this.titleTags.length; i++){
			var t = this.titleTags[i].toLowerCase();
			var tFlag = t;
			if(this.useCustomTitles){
				tFlag = '*[' + this.customTitleAttr + '="' + t + '"]';
			}
			this.titles[t] = Array.prototype.slice.call(document.querySelectorAll(this.selector + ' ' + tFlag));
		}
		setTitlesId(this.titles);
	};
	xCatelogue.prototype.generateCatelogue = function(forceRefresh){
		if(forceRefresh || this.catelogue.length == 0){
			this.catelogue.length = 0;
			this.updateCatelogue();
		}
		return '<div class="x-catelogue">' + catelogueToHTML(this.catelogue, this.showBackToTop) + '</div>';
	};
	xCatelogue.prototype.updateCatelogue = function(){
		root = {self: this.element, children: this.catelogue, parent: null};
		var children = Array.prototype.slice.call(this.element.children);
		for(var i = 0; i < children.length; i++){
			var c = children[i];
			if(this.titleTags.indexOf(this.getTitleFlag(c)) != -1){
				// label offsetTop
				this.elementOffsetTop.push({offsetTop: countOffsetTop(c), id: c.getAttribute('id')});
			}
		}
		this.elementOffsetTop.push({offsetTop: Infinity});
		this.seekForHierarchy(this.element.children[0], root);
	};
	xCatelogue.prototype.bootstrap = function(){
		var as = Array.prototype.slice.call(document.querySelectorAll('.x-catelogue a'));
		clicked = false;
		for(var i = 0; i < as.length; i++){
			var a = as[i];
			if(a.getAttribute('href').indexOf('#') == 0){
				a.addEventListener('click', function(e){
					// console.log('click')
					clicked = true;
					highlight(e.target.getAttribute('href'));
				}, false);
			}
		}
		if(this.catelogue.length){
			onscroll.call(this);
			window.addEventListener('scroll', onscroll.bind(this));
		}

	};
	xCatelogue.prototype.seekForHierarchy = function(element, tree){
		if(element instanceof HTMLElement){
			var node = {self: element, children: [], parent: tree};

			var tagName = this.getTitleFlag(element);
			var tagNameIndex = this.titleTags.indexOf(tagName);
			var nextElement = element.nextElementSibling;

			if(tagNameIndex != -1){
				tree.children.push(node);
			}
			if(nextElement){
				var pos = this.titleTags.indexOf(this.getTitleFlag(nextElement));
				if(pos == -1){ //非标题标签
					this.seekForHierarchy(nextElement, (tagNameIndex != -1?node: tree));
				}else if(tagNameIndex != -1 && pos > tagNameIndex){ //子标题
					this.seekForHierarchy(nextElement, node);
				}else if(pos == tagNameIndex){ //同级标题
					this.seekForHierarchy(nextElement, tree);
				}else{ //父级标题
					var parentNode = tree;
					//非标题元素寻找下一元素的父级标题
					while(parentNode && this.titleTags.indexOf(this.getTitleFlag(parentNode.self)) >= this.titleTags.indexOf(this.getTitleFlag(nextElement))){
						parentNode = parentNode.parent;
					}
					if(tagNameIndex != -1){
						this.seekForHierarchy(nextElement, parentNode && parentNode.parent || root);
					}else{
						this.seekForHierarchy(nextElement, parentNode && parentNode || root);
					}
				}
			}
		}
	};
	xCatelogue.prototype.getTitleFlag = function(element){
		if(this.useCustomTitles){
			return element.getAttribute(this.customTitleAttr);
		}
		return element.tagName;
	};

	var highlight = function(hash){
		// console.log(hash)
		if(hash.length > 1){
			var as = Array.prototype.slice.call(document.querySelectorAll('.x-catelogue a'));
			for(var i = 0; i < as.length; i++){
				as[i].classList.remove('active');
			}
			var currentHash = document.querySelectorAll("a[href='" + hash + "']");
			currentHash && currentHash.forEach(function(h){
				h.classList.add('active');
			});
		}
	};
	 var onscroll = function(){
		// scroll会在click触发完成之后执行，使用哨兵clicked去除多余的highlight调用
		if(clicked) return clicked = false;
		// 滚动到底了
		var id;
		if(window.scrollY + window.innerHeight >= document.body.clientHeight){
			id = this.elementOffsetTop[this.elementOffsetTop.length - 2].id;
		}else{
			var pre = this.elementOffsetTop[0];
			for(var i = 0; i < this.elementOffsetTop.length; i++){
				var e = this.elementOffsetTop[i];
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
	};

	var root, clicked = false;

	var catelogueToHTML = function(catelogueDOM, appendBackToTop){
		var html = "";
		if(catelogueDOM.length > 0){
			for(var i in catelogueDOM){
				if(catelogueDOM.hasOwnProperty(i)){
					var o = catelogueDOM[i], childrenHtml = catelogueToHTML(o.children);
					html += '<li><a href="#' + o.self.getAttribute('id') + '">' + o.self.innerText + '</a>' + childrenHtml + '</li>';
				}
			}
			html = appendBackToTop?html + '<li><a href="javascript:window.scrollTo(0, 0)">回到顶部</a></li>': html;
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
	

	return xCatelogue;
});