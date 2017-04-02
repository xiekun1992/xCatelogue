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
