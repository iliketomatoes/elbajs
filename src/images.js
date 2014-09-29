function setImageSize(elbaIsland){

	var imgRatio = imageAspectRatio(elbaIsland);
	var containerRatio = containerAspectRatio();

    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = Math.ceil(containerHeight);
    	elbaIsland.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	elbaIsland.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	elbaIsland.width = newWidth = Math.ceil(containerWidth);
    }

    centerImage(elbaIsland, newHeight, newWidth);

}	 


function centerImage(elbaIsland , newHeight, newWidth){

	var centerX = (getContainerWidth() - newWidth) / 2;
	var centerY = (getContainerHeight() - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
}

function imageAspectRatio(img){

    return img.naturalHeight / img.naturalWidth;
}

function containerAspectRatio(){
    var containerWidth = getContainerWidth();
    var containerHeight = getContainerHeight();

    return containerHeight / containerWidth;
}

