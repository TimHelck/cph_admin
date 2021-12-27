import React, { Component } from 'react';
import Picture from './Picture';

class PictureList extends Component {
	constructor() {
		super(...arguments);
		if(this.props.listType === "gallery") {
			this.state = { showDetails: false };
		} else {
			this.state = { showDetails: false };
		}
	}

	toggleDetails(e) {
		this.setState({showDetails: !this.state.showDetails});
		e.stopPropagation();
	}

	render() {
	
		let pictures;

		pictures = this.props.gallery.map((picture, i) => {
			let displayTitle =  picture.title || 'No Title Selected';
			let title =  picture.title || '';
			var path = this.props.path + '[' + i + ']';

			// originally key was the same as path, but that caused problem when inserting new node.
			// adding displayTitle helps, but is it the right approach? What if two nodes have the
			// same displayTitle? Perhaps a random number would be better.
			var key = path + displayTitle; 
			return <Picture 
				path            = {path}
				key             = {key}
				imageFile       = {picture.imageFile}
				fileSizes       = {picture.fileSizes}
				displayTitle    = {displayTitle}
				title           = {title}
				medium          = {picture.medium}
				client          = {picture.client}
				agency          = {picture.agency}
				date            = {picture.date}
				description     = {picture.description}
				longDescription = {picture.longDescription}
				worklog         = {picture.worklog}
				pubHistory      = {picture.pubHistory}
				caption         = {picture.caption}
				comment         = {picture.comment}
				saleHistory     = {picture.saleHistory}

				//imageFiles      = {this.props.imageFiles}		// remove, not used?
				imageData       = {this.props.imageData}
				pictures        = {picture.pictures}
				relatedPictures = {picture.relatedPictures}
				callbacks       = {this.props.callbacks}
			/>
		});
		
		var className = "pictureList " + this.props.listType + (this.state.showDetails? " isOpen" : " isClosed");
		let callbacks = this.props.callbacks;
		let deleteCallback, cutCallback;
		let galleryLevel = this.props.galleryLevel || '';
		let galleryDescription = '';
		if(galleryLevel === 'top') {
			deleteCallback = callbacks.deleteGallery;
			cutCallback    = callbacks.cutGallery;
			galleryDescription =
				<div className="pictureListData">
					<input type='textarea' className='description' defaultValue={this.props.description} />
					<button onClick={callbacks.saveGalleryDescription} className='save'>Save Gallery Description</button>
				</div>
			
		}
		else if (galleryLevel === 'subTop') {
			deleteCallback = callbacks.deleteSubGallery;
			cutCallback    = callbacks.cutSubGallery
		}
		else {
			deleteCallback = callbacks.deleteSubGallery;
			cutCallback    = callbacks.cutPicture;
		}
		return (
			<div className={className} data-path={this.props.path} >
				<h1 onClick={this.toggleDetails.bind(this)}>{this.props.title}</h1>	
				{galleryDescription}
				<div className='buttons'>
					<button onClick={callbacks.addNewTopPicture} className='add pictureNode'>Add New Picture</button>
					<button onClick={callbacks.insertPictureAtTop} className='insert pictureNode'>Insert Picture</button>
					<button onClick={deleteCallback} className='delete galleryNode'>Delete Gallery</button>
					<button onClick={cutCallback} className='cut galleryNode'>Cut Gallery</button>
				</div>
				<div>
				{pictures}
				</div>
			</div>
		);
	}
};

export default PictureList;
