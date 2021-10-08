import React, { Component } from 'react';
import PictureList from './PictureList';

class Gallery extends Component {
/*
	handleImageChange(e) { 
		var fileInput = document.getElementById("fileInput");
		this.manageFileName(fileInput);
		this.showPreview(fileInput);
	}

	manageFileName(input) {
		if (input.files && input.files[0]) {
			var ext;
			var fileName = input.files[0].name.split('.');
			if(fileName.length > 1) {
				ext = '.' + fileName.pop();
				fileName = fileName.join('.'); 
			} else {
				fileName = fileName[0];
			}
			fileName = fileName.replace(/_th$/, '') + ext;
			document.getElementById("newName").value = fileName;
		}
	}

	showDimensions() {
		var imagePreview = document.getElementById('imagePreview')
		var width = imagePreview.src === '' ? 0 : imagePreview.width; 
		document.getElementById('imageWidth').innerHTML = width;
		document.getElementById('imageHeight').innerHTML = imagePreview.height;
		return imagePreview.width;
	}
	//showDimensions();
	
	setFileSize(width) {
		if(width >= 600)       { document.imageUpload.fileSize[2].checked=true; }
		else if (width > 144)  { document.imageUpload.fileSize[1].checked=true; }
		else if (width >= 100) { document.imageUpload.fileSize[0].checked=true; }
		else {[0,1,2].forEach(function(i){ document.imageUpload.fileSize[i].checked=false;});}
	}

	showPreview(input) {
		var that = this;
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			document.getElementById("imagePreview").addEventListener('load', function() {
				that.setFileSize(that.showDimensions());
			});
			reader.onload = function (e) {
				var imagePreview = document.getElementById('imagePreview')
				imagePreview.src = e.target.result;
				//showDimensions();
			}

			reader.readAsDataURL(input.files[0]);
		}
	}
*/
	/*
	Web resources
	https://www.new-bamboo.co.uk/blog/2012/01/10/ridiculously-simple-ajax-uploads-with-formdata/
	http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
	https://www.sitepoint.com/html5-ajax-file-upload/
	http://stackoverflow.com/questions/19661157/how-to-add-header-data-in-xmlhttprequest-when-using-formdata

	*/
/*
	handleSubmit(e) {
		e.preventDefault();
		var fileSize = document.imageUpload.fileSize.value;
		if(fileSize === '') {
			alert("Please select a File Size.");
			return false;
		}
		var file = document.imageUpload[0].files[0];
		var fileName = fileSize + "/" + document.imageUpload.newName.value;
		if(file.type !== "image/jpeg") { 
			alert("Please select an image file.");
			return false; 
		}
		
		var formData = new FormData();
		formData.append("upload", file, fileName);

		var xhr = new XMLHttpRequest();
		var url = '../../galleryImages/fileApi.php';
		if(document.location.host.match(/localhost/)) {
			url = 'http://127.0.0.1:8125/';
		}
		if (xhr.upload && file.type == "image/jpeg") {
			xhr.open("POST", url, true);
			xhr.send(formData);
		}
		return false;
	}


	handleCancel(e, position) {
		e.preventDefault();
		var imagePreview = document.getElementById('imagePreview')
		imagePreview.src = '';
		this.setFileSize(this.showDimensions());
		if(position === 'header') {
			document.getElementsByClassName('imageUploadModal')[0].classList.add("inactive");
		}

		return false;
	}
	
	openNewImageModal(e, position) {
		e.preventDefault();
		document.getElementsByClassName('imageUploadModal')[0].classList.remove("inactive");
		return false;
	}
*/
	render() {
		//create imageFile dropdown
		let imgData = this.props.imageData || [];
		
		// is this ever used?
/*		
		let options;
		options= imgData.map((imageFile, i) => {
			var imageFileDisplay = imageFile.substr(0, imageFile.length-3);
//console.log("Line 122 Gallery.js: " + i + ' -- ' + imageFile + ' -- ' + imageFileDisplay);
			return <option 
				key={imageFile}
				value={imageFile}
			>{imageFileDisplay}</option>
		});
		options.unshift(<option key='imageRequired' value='imageRequired' >imageRequired</option>);
*/
		let x = this.props.galleries || [];
		let  galleries;
		galleries = x.map((gallery, i) => {
//console.log("Line 131 Gallery.js: ", gallery);
			var path = 'galleries.' + i + '.pictures';
			//var path = 'galleries[' + i + '].pictures';
			var reactKey = path + gallery.title;
//console.log("    Line 157 Gallery.js: " + gallery.title + ' -- ' + (this.props.imageData && this.props.imageData[6]));
			return <PictureList 
				path         = {path}
				listType     = 'gallery'
				title        = {gallery.title}
				key          = {reactKey}
				description  = {gallery.description}
				gallery      = {gallery.pictures}
//				imageFiles   = {this.props.imageFiles}		// remove, not used?
				imageData    = {this.props.imageData}		// does not have data on initial page load
				callbacks    = {this.props.callbacks}
				galleryLevel = 'top'
			/>
		});
		let className = 'gallery';
		if     (this.props.clipboardPicture) { className += ' clipboardPicture'; }
		else if(this.props.clipboardGallery) { className += ' clipboardGallery'; }
		
		return (
				<div className={className} data-path='galleries'>
				<h1>Peter Helck</h1>
				<div className='buttons'>
					<span className='label'>New Gallery Name</span>
					<input type='text' className='title' id='newGalleryTitle' />
					<button onClick={this.props.callbacks.addNewGallery} className='add galleryNode'>Add New Gallery</button>
					<button onClick={this.props.callbacks.insertGallery} className='insert galleryNode'>Insert Gallery</button>
					<button onClick={this.props.callbacks.saveAll} className='save'>Save All</button>
				</div>
				{galleries}
			</div>
		);

/*		
		return (
				<div className={className} data-path='galleries'>
				<h1>Peter Helck</h1>
				<div className='buttons'>
					<span className='label'>New Gallery Name</span>
					<input type='text' className='title' id='newGalleryTitle' />
					<button onClick={this.props.callbacks.addNewGallery} className='add galleryNode'>Add New Gallery</button>
					<button onClick={this.props.callbacks.insertGallery} className='insert galleryNode'>Insert Gallery</button>
					<button onClick={this.openNewImageModal} className='insert newImage'>Upload New Image</button>
					<button onClick={this.props.callbacks.saveAll} className='save'>Save All</button>
				</div>
				<form method="post" id="dataUpload" name="dataUpload">
					<input type="hidden" id="dataUploadInput"></input>
				</form>
				<div className="imageUploadModal inactive">
					<form method="post" id="imageUpload" name="imageUpload">
						<div className="header">
							<h1>File Uploader</h1>
							<input type="file" name="file" id="fileInput"  onChange={(e)=>this.handleImageChange(e)} />
							<label htmlFor="fileInput" id="fileInputLabel">Choose a File</label>
							<button onClick={(e)=>this.handleCancel(e, "header")} className='cancel'>Cancel</button>
						</div>
						
						<div className="imageUploadPreview">
							<div><label>File Name (Editable)<input type="text" name="newName" id="newName" /></label></div>
							<div className="dimensions">
								<span>Image Width: </span><span className="frame"><span id="imageWidth" className="data">0</span></span>
								<span>Image Height: </span><span className="frame"><span id="imageHeight" className="data">0</span></span>
							</div>
							<div id="sizeSelector">
								<span>Save as size: </span>
								<span className="radio">
									<input type="radio" name="fileSize" value="thumbnail" />Thumbnail &mdash; <span>ideal width: 144</span>
								</span>
								<span className="radio">
									<input type="radio" name="fileSize" value="display" />Display &mdash; <span>ideal width: 576</span>
								</span>
								<span className="radio">
									<input type="radio" name="fileSize" value="large" />Large &mdash; <span>ideal width: &gt; 600</span>
								</span>
							</div>
							<div className="buttons">
								<input type="submit" value="Upload" onClick={(e)=>this.handleSubmit(e)} />
								<button onClick={(e)=>this.handleCancel(e, "preview")} className='cancel'>Cancel</button>
							</div>
							<div className="image">
								<img id="imagePreview"/>
							</div>
						</div>
					</form>
				</div>
				{galleries}
			</div>
		);
*/
	};
}

export default Gallery;
