elbajs
======

This is a pure javascript slider, responsive, serving lazy loading images according to the screen size, hardware accelerated.

Inspired by many sources such as bLazy and Superslides.

You can load it as a module since it is AMD ready. 

At the moment this plugin's size is 11.3 KB minified.

##INSTALL

Besides cloning this repo or downloading it, you can either get it through Bower.

```
bower install elbajs

```

##USAGE

Include the css into your page:
<pre lang="html">
&lt;link rel="stylesheet" href="path/to/elba.css"&gt;
</pre>

Include the script into your page:
<pre lang="html">
&lt;script src="path/to/elba.js"&gt;&lt;/script&gt;
</pre>

Add the markup for your gallery:
<pre lang="html">
&lt;figure id="your-carousel" class="elba-carousel"&gt;
    &lt;figure class="elba" data-src="http://yourpicdefault|http://yourpicdefault@2x" data-src-medium="http://yourpicmedium|http://yourpicmedium@2x" data-src-large="http://yourpiclarge|http://yourpiclarge@2x"&gt;
    &lt;figure&gt;
    ...
    &lt;figure class="elba" data-src="http://yourpicdefault|http://yourpicdefault@2x" data-src-medium="http://yourpicmedium|http://yourpicmedium@2x" data-src-large="http://yourpiclarge|http://yourpiclarge@2x"&gt;
    &lt;/figure&gt;
    ...
&lt;/figure&gt;	    	
</pre> 

As shown above you can optionally set multiple sources depending on the width of the device. A further option is declaring different sources for the same breakpoint, one for normal screens and the other one for retina screens, separating the sources with the default separator '|'.

Then activate the plugin: 
<pre lang="javascript">
	var gallery = new Elba( document.getElementById('your-carousel'), {
		/*****************************/
		/*REGISTERING THE BREAKPOINTS*/
		/*****************************/
        	breakpoints: [
        		{
        			width: 768, // min-width
					src: 'data-src-medium'
			},
        		 {
	        		width: 1080, // min-width
	         		src: 'data-src-large'
			}
		]});
</pre>

###AMD USAGE
Since it doesn't have dependencies, just write something like this:
<pre lang="javascript">
require(['elba'], function(elba){
	var gallery = new Elba( document.getElementById('your-carousel'), {
		breakpoints: [
			{
				width: 768, // min-width
				src: 'data-src-medium'
			},
			 {
	        	width: 1080, // min-width
	         	src: 'data-src-large'
			}
		]});
})		
</pre>

*The width is referred to the width of the gallery container, that can be smaller than the screen, according to your taste*  

##OPTIONS

When you make a new Elba class instance, you can override defaults options by passing an object { ... } as the second argument to the constructor.

Available options:

| Property         | Description                                                      | Type        | DEFAULT |
| ---------------- |----------------------------------------------------------------  | ----------- | ------- |
| separator        | Separator between sources for normal screens and retina screens  | String      |  '\|'    |
| breakpoints      | Array containing objects having *width* and *src* properties. If set to false Elba js will look for just the default *data-src* attribute     | Boolean/Array  | false |
| container        | Setting the parent container's class which will constrain the slide size |  String  |	'elba-wrapper' |	
| error            | Callback function in case of image unsuccesful load. //TODO | Boolean/Function | false        |
| success          | Callback function in case of image succesful load. //TODO | Boolean/Function | false        |
| duration         | The duration of the sliding animation. Expressed in milliseconds  | Number |	1000	|
| easing           | The easing of the animation. You can pick among 24 pre-set easings:| String | 'easeInOutCubic' |
| navigation       | Whether to set or not the arrows for the navigation      |  Boolean |	true	  |
| dots             | Whether to set or not the dots for the navigation      |  Boolean |	true	  |
| dotsContainer    | Append the dots to a custom HTML element by passing its ID      | Boolean/String |		false  |
| slideshow        | Interval between any slide. Set 0 to disable slideshow. Expressed in milliseconds      |  Number | 10000		  |		
|preload 		   | Number of pictures you want to load after the first one has been loaded | Number | 1 | 	

###List of predefined easings
1. easeInSine
2. easeOutSine
3. easeInOutSine
4. easeInQuad
5. easeOutQuad
6. easeInOutQuad
7. easeInCubic
8. easeOutCubic
9. easeInOutCubic
10. easeInQuart
11. easeOutQuart
12. easeInOutQuart
13. easeInQuint
14. easeOutQuint
15. easeInOutQuint
16. easeInExpo
17. easeOutExpo
18. easeInOutExpo
19. easeInCirc
20. easeOutCirc
21. easeInOutCirc
22. easeInBack
23. easeOutBack
24. easeInOutBack

##API
<pre lang="javascript">
	var gallery = new Elba( document.getElementById('your-carousel'), 
				{ 
					//Whatever options 
				});

	/**
	* Goes to the next slide.
	* @param {String}
	*/			
	gallery.goTo('right');

	/**
	* Goes to the previous slide.
	* @param {String}
	*/			
	gallery.goTo('left');

	/**
	* Goes to the xth slide.
	* @param {Number} starting from 1 to the [lenght]
	*/			
	gallery.goTo(x);

	/**
	* Starts the slideshow.
	*/			
	gallery.startSlideshow();

	/**
	* This method temporarly stops the slideshow,
	* which is restarted after a click on a navigation button.
	*/
	gallery.clearSlideshow();

	/**
	* This method permanently stops the slideshow.
	*/
	gallery.stopSlideshow();

	/**
	* This function returns the current index of the slideshow
	* @return {Number}
	*/
	gallery.getCurrent();

</pre>	

##BROWSER SUPPORT

Not tested yet, but working on all modern browser, IE9+.

##CHANGELOG

###v 0.2.0
Refactoring, conditional loading, active slideshow only if in viewport

###v 0.1.1
AMD ready

###v 0.1
Initial release

##ROADMAP
+ Better API
+ Touch events
+ Tests

##LICENSE
MIT
