'use strict';

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
