'use strict';

var xCatelogue = function(options){
	// this.defaultOptions = {
	// 	element: null,

	// };
	this.element = null;
	this.catelogue = [];
	this.titles = {};
	this.selector = options.contentRootElement;
	if(this.selector){
		// try{
			this.element = document.querySelector(this.selector);
		// }catch(e){
			if(!this.element){
				throw new Error('contentRootElement must be a valid Selector');
			}
			this.updateCatelogue();
		// }
	}else{
		throw new Error('contentRootElement can not be found');
	}
	this.extractTitle();
};
xCatelogue.prototype.extractTitle = function(){
	// 考虑搜索引擎对h的规则，h1应当只有一个，所以从h2开始计算标题
	this.titles.h1 = Array.from(document.querySelectorAll(this.selector + ' h1'));
	this.titles.h2 = Array.from(document.querySelectorAll(this.selector + ' h2'));
	this.titles.h3 = Array.from(document.querySelectorAll(this.selector + ' h3'));
	setTitlesId(this.titles);
};
xCatelogue.prototype.generateCatelogue = function(){
	return '<div class="x-catelogue">' + catelogueToHTML(this.catelogue) + '</div>';
};
xCatelogue.prototype.updateCatelogue = function(){
	seekForHierarchy(this.element.children[0], {self: this.element, children: this.catelogue, parent: null});
};
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
				seekForHierarchy(nextElement, parentNode.parent);
			}
		}
	}
};

module.exports = xCatelogue;