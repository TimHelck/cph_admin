import React, { Component } from 'react';
import Gallery from './Gallery';
import 'whatwg-fetch';
import Request from 'superagent';

/* is rendered by App. It renders Gallery, 3 times on page load 
*  and everytime changes are saved.
*/
class DataContainer extends Component {

	constructor(props){
		super(props);
		this.state={ pictureData: {}};	
		this.callbacks = {
			saveModifiedPicture:     this.saveModifiedPicture.bind(this),
			saveGalleryDescription:  this.saveGalleryDescription.bind(this),
			saveAll:                 this.saveAll.bind(this),
			deletePicture:           this.deletePicture.bind(this),
			deleteSubGallery:        this.deleteSubGallery.bind(this),
			deleteGallery:           this.deleteGallery.bind(this),
			cutPicture:              this.cutPicture.bind(this),
			cutGallery:              this.cutGallery.bind(this),
			cutSubGallery:           this.cutSubGallery.bind(this),
			insertPicture:           this.insertPicture.bind(this),
			insertPictureAtTop:      this.insertPictureAtTop.bind(this),
			insertSubGallery:        this.insertSubGallery.bind(this),
			insertGallery:           this.insertGallery.bind(this),
			insertRelatedPictures:   this.insertRelatedPictures.bind(this),
			addNewPicture:           this.addNewPicture.bind(this),
			addNewTopPicture:        this.addNewTopPicture.bind(this),
			addNewRelatedPictures:   this.addNewRelatedPictures.bind(this),
			addNewSubGallery:        this.addNewSubGallery.bind(this),
			addNewGallery:           this.addNewGallery.bind(this),
			showImageSelector:       this.showImageSelector.bind(this)
			//setImage:                this.setImage.bind(this)
		};
	}

	// this function compares data AND updates it, so it needs a better name
	hasDataChanged(stateData, inputs) {
//console.log("hasDataChanged Line 41");
		var ret = false;
		//delete stateData.subEditPaneInput;
		for (let input of inputs) {
			if(input.type !== "submit") {    // probably not needed anymore
				for (let inputClassName of input.className.split(' ')) {

					
					if(inputClassName !== 'subEditPane' && stateData[inputClassName] != null) {
						if(stateData[inputClassName] !== input.value) {
							stateData[inputClassName] = input.value;
							ret = true;
						}
					}
					else if(input.value !== null) {
						stateData[inputClassName] = input.value;
						ret = true;
					}
				}
			}
		}
//console.log("hasDataChanged Line 62: " + ret);
		return ret;
	}

	saveModifiedPicture(event){
//console.log("saveModifiedPicture -- Line 66");

		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		var pnc = pn.querySelectorAll('input, textarea, select');
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		// use pathArray to point node to the part of state.pictureData that has the
		// (possibly) modified fields, then compare with the inputs in the DOM.
		while(pathArray.length && node) {
			node = node[pathArray.shift()];
		}
		var updateFlag = this.hasDataChanged(node, pnc);
		if(updateFlag) {
			this.setState({'pictureData': this.state.pictureData});
			this.saveStateToDisk(false);
		}
	}
	
	saveGalleryDescription(event) {
//console.log("saveGalleryDescription -- Line 90");
		var description = event.target.parentNode.children[0].value;
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			var x = pathArray.shift();
			node = node[x];
		}
		node.description = description;
		this.setState({'pictureData': this.state.pictureData});
		this.saveStateToDisk(false);
	}
	
	saveAll() {
//console.log("saveAll -- Line 107");
		this.setState({'pictureData': this.state.pictureData});
		this.saveStateToDisk(false);
	}


	deletePicture(event){
//console.log("deletePicture -- Line 113");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 100: ", pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
//console.log("Line 107: " + index);
		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
			this.saveStateToDisk(false);
		}
	}
		
	deleteGallery(event){
//console.log("deleteGallery Line 132");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 2 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray.shift(), 10);
		
		if(typeof index === 'number') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	}

	deleteSubGallery(event){
//console.log("deleteSubGallery -- Line 152");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		
		if(index === 'relatedPictures' || index === 'pictures') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	cutPicture(event){
//console.log("cutPicture -- Line 170");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
//console.log("Line 152: " , pn);
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
		this.state.clipboardPicture = node[index];
//console.log("Line 158: " + index);
//console.log("Line 159: " , this.state.pictureData);
		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 
	
	cutGallery(event){
//console.log("cutGallery -- Line 190");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 2 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray.shift(), 10);

		this.state.clipboardGallery = node[index];

		if(typeof index === 'number') {
			node.splice(index, 1);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	cutSubGallery(event){
//console.log("cutSubGallery -- Line 212");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		this.state.clipboardGallery = node[index];

		if(index === 'relatedPictures' || index === 'pictures') {
			delete(node[index]);
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	insertPictureAtTop(event){
//console.log("insertPictureAtTop -- Line 232");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 215: " , pn);
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 0 && node) {
			node = node[pathArray.shift()];
		}
		var index = 0;
		if(typeof index === 'number' && this.state.clipboardPicture) {
			node.splice(index, 0, this.state.clipboardPicture);
			delete this.state.clipboardPicture;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNodeAtTop -- unable to insert " + this.state.clipboardPicture.title + " at " + pn.dataset.path + "."); 
		}
	} 

	insertPicture(event){
//console.log("insertPicture -- Line 254");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 227: ", pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
//console.log("Line 241: ", pathArray);
		var index = parseInt(pathArray[0]) || 0;
//console.log("Line 235: " + index);
//console.log("Line 236: ", this.state.clip);
		if(typeof index === 'number' && this.state.clipboardPicture) {
			node.splice(index + 1, 0, this.state.clipboardPicture);
			delete this.state.clipboardPicture;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNode -- unable to insert " + this.state.clipboardPicture.title + " at " + pn.dataset.path + "."); 
		}
	} 
	

	insertSubGallery(event){
//console.log("insertSubGallery -- Line 279");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 227: ", pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node[index].pictures = this.state.clipboardGallery;
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
		
	} 
	
	insertGallery(event){
//console.log("insertGallery -- Line 297");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 0 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node.splice(index, 0, this.state.clipboardGallery);
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
	} 

	addNewGallery(event){
//console.log("addNewGallery -- Line 318");
		// this may not exactly be the React.js way of doing things.
		var newGalleryName = document.getElementById("newGalleryTitle").value;
		if(newGalleryName === '' || newGalleryName === 'REQUIRED FIELD') {
			document.getElementById("newGalleryTitle").value = 'REQUIRED FIELD';
			return;
		}
		document.getElementById("newGalleryTitle").value = '';

		var pn  = event.target.parentNode;
		if(typeof pn.dataset.path === 'undefined') { pn = pn.parentNode; }
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		while(pathArray.length > 0 && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(pathArray[0]) || 0;
		var newNode = { 
			"title": newGalleryName, 
			"pictures": new Array
		};

		if(typeof index === 'number') {
			node.splice(index, 0, newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
		
	} 

	insertRelatedPictures(event){
//console.log("insertRelatedPictures -- Line 350");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 316: ", pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]) || 0;
		if(typeof index === 'number' && this.state.clipboardGallery) {
			node[index].relatedPictures = this.state.clipboardGallery;
			delete this.state.clipboardGallery;
			this.setState({'pictureData': this.state.pictureData});
		}
		else {
			console.log("insertPictureNode -- unable to insert " + this.state.clipboardGallery.title + " at " + pn.dataset.path + "."); 
		}
	} 
	
	addNewPicture(event){
//console.log("addNewPicture -- Line 370");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 337: ", pn);
//console.log("Line 338: ", event.target);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = parseInt(pathArray[0]);
		if(typeof index === 'number') {
			var newNode = { 
				"imageFile": "imageRequired", 
				//"fileSizes":{ "th": 1, "reg": 1, "lg": 1 }, 
				"fileSizes":{}, 
				"title": "", 
				"medium": "", 
				"client": "",
				"agency": "",
				"date": "",
				"description": "",
				"longDescription": "",
				"worklog": "",
				"pubHistory": "",
				"caption": "",
				"comment": "",
				"saleHistory": ""

			};
			node.splice(index + 1, 0, newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	addNewTopPicture(event){
//console.log("addNewTopPicture Line 406");
		//var pn  = event.target.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 364: ", pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		while(pathArray.length > 1 && node) {
			node = node[pathArray.shift()];
		}
		var index = pathArray[0];
		if(index === 'relatedPictures' || index === 'pictures') {
			var newNode = { 
				"imageFile": "imageRequired", 
				//"fileSizes":{ "th": 1, "reg": 1, "lg": 1 }, 
				"fileSizes":{}, 
				"title": "", 
				"medium": "", 
				"description": "" 
			};
			node[index].unshift(newNode);
			this.setState({'pictureData': this.state.pictureData});
		}
	}
	
	addNewRelatedPictures(event){
//console.log("addNewRelatedPictures -- Line 432");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
//console.log("Line 385: " ,  event.target);
//console.log("Line 386: " ,  event.target.parentNode);
//console.log("Line 387: " ,  event.target.parentNode.parentNode);
//console.log("Line 388: " , pn);
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		var error;
		while(pathArray.length && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(index, 10);
//console.log("Line 396: " + index);
		if(node.pictures) {
			error = "There is already a Sub-gallery. You cannot have a Sub-gallery and a Related Pictures Gallery on the same node.";
		}
		else if(node.relatedPictures) {
			error = "Related Pictures Gallery already exists!!!";
		}
		if(error == null) {
			if(typeof index === 'number') {
				node.relatedPictures = new Array;
				this.setState({'pictureData': this.state.pictureData});
			}
		}	
		else {
			console.log("*** ERROR *** " + error);
		}
	}	
	
	addNewSubGallery(event){
//console.log("addnewSubGallery -- Line 467");
		//var pn  = event.target.parentNode.parentNode.parentNode;
		var pn  = event.target.closest("div[data-path]");
		var pathArray = pn.dataset.path.split(/\.|\[|\]/).filter(function(v){return v!==''});
		var node = this.state.pictureData;
		var index;
		var error;
		while(pathArray.length && node) {
			index = pathArray.shift();
			node = node[index];
		}
		index = parseInt(index, 10);
		if(node.relatedPictures) {
			error = "There is already a Related Pictures Gallery. You cannot have a Sub-gallery and a Related Pictures Gallery on the same node.";
		}
		else if(node.pictures) {
			error = "Sub-gallery already exists!!!";
		}
		if(error == null) {
			if(typeof index === 'number') {
				node.pictures = new Array;
				this.setState({'pictures': this.state.pictureData});
			}
		}
		else {
			console.log("*** ERROR *** " + error);
		}
	}	
	
	showImageSelector(event){
//console.log("showImageSelector -- Line 498");
		var n  = event.target;
//console.log("Line 441: " + n.nodeName);
//console.log(n);
		if(n.classList.contains("notTheFirstTime")) { // if user clicks the drop-down twice, no need to rebuild option list a second time
//console.log("Line 443");
			//this.setImage(event);
			return;
		}
		n.classList.add("notTheFirstTime");

		var n  = event.target;
		if(n.nodeName === "SELECT") {		// if user clicks image drop-down
		let imgData = Object.keys(this.state.imageData) || [];
//console.log(imgData);
			imgData.map((imageFile, i) => {
//console.log("Line 451");
				//var imageFileDisplay = imageFile.substr(0, imageFile.length-3);
				//var sizes = imageFile.substr(imageFile.length-3);
//console.log("Line 458: " + imageFileDisplay);
				//var newOption = new Option(imageFileDisplay, imageFileDisplay);
				var newOption = new Option(imageFile, imageFile);
				//newOption.sizes = sizes;
				n.options[i+1] = newOption;
				event.target.options[i+1] = newOption;
			});
		}
//console.log("Line 472");
//		this.setImage(event);
	}

/*
	setImage(event){
		var t    = event.target;
		if(t.nodeName === "OPTION") {			// I don't know how this is called
//console.log("Line 473 --= this was CALLED!!!");
			var pn   = event.target.parentNode;
			var ppn  = pn.parentNode;
			var pppn  = ppn.parentNode;
			var thumbnail = pppn.getElementsByClassName('thImage')[0];

			var imageData = event.target.value;
			var imgSrc = '../../galleryImages/thumbnail/' + imageFile + '.jpg';
			if(document.location.host.match(/localhost/)) {
				imgSrc = './newImageGallery/thumbnail/' + imageFile + '.jpg';
			}

			thumbnail.src = imgSrc;
			ppn.getElementsByClassName('th')[0].value  = t.sizes[0];
			ppn.getElementsByClassName('reg')[0].value  = t.sizes[1];
			ppn.getElementsByClassName('lg')[0].value  = t.sizes[2];
		}
	}
*/

	/* This reads pictureData.json which is the main source of data for cph_gallery. 
	*  pictureData is added to "state", and passed into all the modules as props.
	*  When users add, modify or delete galleries, pictures etc. the changes are 
	*  are added to "state" and then written to pictureData.json by calling the 
	*  function saveStateToDisk().
	*/
	loadPictureData() {
//console.log("loadPictureData Line 561");
	    var url = '../../galleryImages/pictureData.json';
		if(document.location.host.match(/localhost/)|| document.location.host.match(/127.0.0.1/) ) {
			url = './pictureData.json';
			//url = './galleryImages/pictureData.json';
		}
		//console.log("Line 524: " + url);
 	    return fetch(url)
		.then(response => response.json())
		.then(responseData => this.setState({pictureData: responseData}))
		.catch(error => console.log('Error fetching and parsing data', error));
	}

	/* pictureData is part of "state" and it is saved in the pictureData.json file.
	*  This function calls the cph_api to write to that file.
	*/
	saveStateToDisk(log){
//console.log("saveStateToDisk Line 573");
		var url = 'http://127.0.0.1:8125/';

		// merge imageData with pictureData so that image sizes will be set correctly:
		
		//var galleries = this.state.pictureData.galleries;
		this.mergeImageFileSizeData(this.state.pictureData.galleries);

		Request
		.post(url)
		.send(encodeURIComponent(JSON.stringify(this.state.pictureData)))
		.set('Accept', 'text/plain')
		.end(function(err, res){
			if (err || !res.ok) {
				console.log('ERROR -- unable to save this.state.pictureData to  ' + url);
			} else {
				console.log('this.state.pictureData succesfully saved to  ' + url);
			}
		});
	}


	mergeImageFileSizeData(data) {
//console.log("mergeImageFileSizeData Line 596");
		if(Array.isArray(data)) {
			//console.log("Line 550 -- is array");
			data.map((picture, i) => {
				//console.log("Line 552: " + picture.title);
				this.mergeImageFileSizeData(picture);
				
			});
		}
		else {
			if(data.imageFile) {	
				//console.log("Line 544: " + data.imageFile, this.state.imageData[data.imageFile]);
				data.fileSizes = this.state.imageData[data.imageFile];
				// if you need to remove a field from pictureData you can do it here
			}
			if(data.pictures) { this.mergeImageFileSizeData(data.pictures); }
			if(data.relatedPictures) { this.mergeImageFileSizeData(data.relatedPictures); }

		}

	}
/*
	getListOfImageFilesXXX() {
		var url = 'http://127.0.0.1:8125/';
		Request.get(url)
		.type('application/x-www-form-urlencoded')
		.then((response) => {
			this.setState({
			// I think that this should work, but it doesn't:
			// imageData: response.body
			imageData: JSON.parse(response.req.xhr.response)
		  });
		});
	}
*/

	/* This gets the list of image files from the cph_api. It gets a list of file names
	*  with ".jpg" stripped of, and 3 flags appended to indicate if image available as
	*  thumbnail, display and large. Ex:
	*      ...
	*      "1942_01_PanamaDumpTruck111",
	*      "1942_02_NightHaulAlbanyPost111",
	*      ...	
	*  good resource: https://www.youtube.com/watch?v=jZDc-o7Mkdc "React Basics Ep. 4: React Basics - Calling an API"
	*
	*  Mar 11 2017 -- changed request type from 'application/json' to 'application/x-www-form-urlencoded'
	*/
	
	getListOfImageFiles() {
		var url = 'http://127.0.0.1:8125/';
		Request.get(url)
		.type('application/x-www-form-urlencoded')
		.then((response) => {

			var imageDataArray = JSON.parse(response.req.xhr.response)
			var imageDataMap = {};
			imageDataArray.map((imageFile, i) => {
				var fileName = imageFile.substr(0, imageFile.length-3);
				var sizes = imageFile.substr(imageFile.length-3);
				var sizeMap = {th: sizes[0], reg:sizes[1], lg:sizes[2]};
				imageDataMap[fileName] = sizeMap;
			});
			this.setState({
				imageData: imageDataMap
			});
		});

	}

	componentDidMount(){
		this.loadPictureData()
		.then(this.getListOfImageFiles());
	}
	
	
	render() {
		return (<Gallery 
			galleries         = {this.state.pictureData.galleries} 
			//imageFiles      = {this.state.pictureData.imageFiles} 	// remove, not used?
			imageData         = {this.state.imageData} 
			callbacks         = {this.callbacks}
			clipboardPicture  = {this.state.clipboardPicture} 
			clipboardGallery  = {this.state.clipboardGallery} 
		/> );
		
	}
};

export default DataContainer;
