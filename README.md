# xCatelogue
html page content extract catelogue by javascript

<pre>
  var catelogueObj = new xCatelogue({
    contentContainer: '#content',
    catelogueContainer: '#catelogue'
  });
  catelogueObj.bootstrap();
</pre>
or
<pre>
  var catelogue = document.querySelector('#catelogue');
  var catelogueObj = new xCatelogue({
    contentContainer: '#content'
  });
  catelogue.innerHTML += catelogue.generateCatelogue();
  catelogueObj.bootstrap();
</pre>

## options<br>
<code>contentContainer</code> string, html element selector, this element wrapped contents<br>
<code>catelogueContainer</code> stirng, html element selector, this element used to maintain catelogue<br>
<code>showBackToTop</code> boolean, if a back to top link append to catelogue element<br>
<code>customTitleAttr</code> string, a element attribute name, used to identify the custom title<br>
<code>customTitles</code> string, the value of the <code>customTitleAttr</code>, like: <code>h1, h2, h3, h4, h5, h6</code><br>