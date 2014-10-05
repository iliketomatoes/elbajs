elbajs
======

This is a pure javascript slider, responsive, serving lazy loading images according to the screen size.
Inspired by many sources such as bLazy and Superslides.

##INSTALL

Besides clongin this repo or downloading it, you can either get it through Bower.

```
bower install elbajs

```

##USAGE

Import the css:
<pre lang="html">
&lt;link rel="stylesheet" href="path/to/elba.css"&gt;
</pre>

Include the script into your page:
<pre lang="html">
&lt;script src="path/to/elba.js"&gt;&lt;/script&gt;
</pre>

Add the markup for your gallery:
<pre lang="html">
&lt;div id="your-carousel" class="elba-carousel"&gt;
    &lt;div class="elba" data-src="http://yourpicdefault [| http://yourpicdefault@2x]" [data-src-medium="http://yourpicmedium | http://yourpicmedium@2x"] [data-src-large="http://yourpiclarge | http://yourpiclarge@2x"]&gt;
    &lt;/div&gt;
    ...
    &lt;div class="elba" data-src="http://yourpicdefault [| http://yourpicdefault@2x]" [data-src-medium="http://yourpicmedium | http://yourpicmedium@2x"] [data-src-large="http://yourpiclarge | http://yourpiclarge@2x"]&gt;
    &lt;/div&gt;
    ...
&lt;/div&gt;	    	
</pre> 

Then activate the plugin: 
<pre lang="javascript">
	var gallery = new Elba( document.getElementById('carousel'), {
		/*****************************/
		/*REGISTERING THE BREAKPOINTS*/
		/*****************************/
        breakpoints: [{
	          width: 768 // min-width
			, src: 'data-src-medium'
	     }
           , {
	          width: 1080 // min-width
	        , src: 'data-src-large'
	}]
    });
</pre>

<b>The width is referred to the width of the gallery container, that can be smaller than the screen, according to your taste.</b>          	