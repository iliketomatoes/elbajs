function setImageSize(elbaIsland){

	var imgRatio = imageAspectRatio(elbaIsland);
	var containerRatio = containerAspectRatio();
	//centerImage(elbaIsland);
	console.log(imgRatio);

	console.log(getContainer(elbaIsland, options.container));	
	
	/*if (containerRatio > imgRatio) {
		elbaIsland.height = getWindowHeight();
		elbaIsland.width = getWindowHeight() * imgRatio;
	}else{
		elbaIsland.height = getWindowWidth() * imgRatio;
		elbaIsland.width = getWindowWidth();
	}*/
}	 

function centerImage(elbaIsland){
	//elbaIsland.left = 
}

function imageAspectRatio(img){
    var naturalWidth = img.width;
    var naturalHeight = img.height;

    return naturalHeight / naturalWidth;
}

//TODO
function containerAspectRatio(container){
    var containerWidth = getContainerWidth(container);
    var containerHeight = getContainerHeight(container);

    return containerHeight / containerWidth;
}
