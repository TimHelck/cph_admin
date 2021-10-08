import React, { Component } from 'react';
import PictureList from './PictureList';

class Gallery extends Component {

	render() {
		//create imageFile dropdown
		let imgData = this.props.imageData || [];
		
		// is this ever used?

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


	};
}

export default Gallery;
