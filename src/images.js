function setImageSize(elbaIsland){



	var imgRatio = imageAspectRatio(elbaIsland);
	var containerRatio = containerAspectRatio();
	//centerImage(elbaIsland);
	console.log('img ratio -> ' + imgRatio);
	console.log('container ratio -> ' + containerRatio);
	//console.log(getContainer(elbaIsland, options.container));	
	
	//centerImage(elbaIsland);

    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = containerHeight;
    	elbaIsland.width = newWidth = containerHeight / imgRatio;
    }else{
    	elbaIsland.height = newHeight = containerWidth * imgRatio;
    	elbaIsland.width = newWidth = containerWidth;
    }

    centerImage(elbaIsland, newHeight, newWidth);
	/*if (containerRatio > imgRatio) {
		elbaIsland.height = getWindowHeight();
		elbaIsland.width = getWindowHeight() * imgRatio;
	}else{
		elbaIsland.height = getWindowWidth() * imgRatio;
		elbaIsland.width = getWindowWidth();
	}*/
}	 

/*function setImageData(img){

	img.setAttribute( 'data-natural-w', img.width);
	img.setAttribute( 'data-natural-h', img.height);
	
}*/

function centerImage(elbaIsland , newHeight, newWidth){
	//elbaIsland.left =
	console.log('elbaIsland.width -> ' + newWidth);
	console.log('elbaIsland.height -> ' + newHeight);

	var centerX = (getContainerWidth() - newWidth) / 2;
	var centerY = (getContainerHeight() - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
}

function imageAspectRatio(img){

    return img.naturalHeight / img.naturalWidth;
}

//TODO
function containerAspectRatio(){
    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    return containerHeight / containerWidth;
}

