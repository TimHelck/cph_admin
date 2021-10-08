import React, { Component } from 'react';
import PictureList from './PictureList';

class Picture extends Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = { showEditPane: false };
	}

	handleSubmit(event){
		var target = event.target ? event.target : event;
		this.props.onUserSubmit(target);
	}
	
	toggleDetails(e) {
		this.setState({showDetails: !this.state.showDetails});
		e.stopPropagation();
	}
	
	toggleEditPane(e) {
		this.setState({showEditPane: !this.state.showEditPane});
		e.stopPropagation();
	}
	
	render() {

	    var subPictureList = "";
	    var relatedPictureList = "";
		var className = "picture";
		if(this.props.pictures){

			var title = 'Sub-gallery for "' + this.props.title +'":';
			var path = this.props.path + '.pictures';
//console.log("Line 29 Picture: " + this.props.path + ' -- ' + path);
			className += " hasSubGallery";

			subPictureList = <PictureList 
				path         = {path}
				listType     = 'subGallery'
				title        = {title}
				description  = {this.props.description}
				//imageFiles   = {this.props.imageFiles}		// remove, not used?
				imageData    = {this.props.imageData}
				gallery      = {this.props.pictures}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'subTop'
			/>


		}
		else if(this.props.relatedPictures){
			var title = 'Related Pictures for "' + this.props.title +'":';
			var path = this.props.path + '.relatedPictures';
			var gallery = this.props.relatedPictures || [];
			className += " hasRelatedPictures";

//console.log("Line 52 Picture: " + this.props.path + ' -- ' + path);
			relatedPictureList = <PictureList 
				path         = {path}
				listType     = 'relatedPictures'
				title        = {title}
				description  = {this.props.description}
				//imageFiles   = {this.props.imageFiles}		// remove, not used?
				imageData    = {this.props.imageData}
				gallery      = {gallery}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'subTop'
			/>

		}
		var imageFile = this.props.imageFile;
		var imageData = this.props.imageData;
		var imgSrc = '../../galleryImages/thumbnail/' + imageFile + '.jpg';
		// remove?
		/*
		if(document.location.host.match(/localhost/)) {
			imgSrc = './newImageGallery/thumbnail/' + imageFile + '.jpg';
		}
		*/
		let callbacks = this.props.callbacks;

		// when page is initially loaded, the image dropdown only has the image from pictureData. 
		// If use clicks on it though, it will load all the images from imageData. 
		var options = <option key={imageFile} value={imageFile}>{imageFile}</option>


		if(this.props.pictures){
	
			return (
				<div className={className}>
					<div className='title'>{this.props.displayTitle} </div>
					<div className='pictureSubSection'>
						<div> <img className='thImage' src={imgSrc} /> </div>
						<div className='pictureData' data-path={this.props.path}>
							<div><label>Title</label><input type='text' className='title'  defaultValue={this.props.title} autoComplete='off'/></div>
							<div><label>Medium</label><input type='text' className='medium' defaultValue={this.props.medium} /></div>
							<div><label>Desc.</label><input type='textarea' className='description'     defaultValue={this.props.description} /></div>
							<div><label>Image</label><select className='imageFile' onClick={callbacks.showImageSelector} defaultValue={this.props.imageFile}>{options}</select></div>
							<button onClick={callbacks.saveModifiedPicture} className='save'>Save</button>
							<button onClick={callbacks.deletePicture} className='delete pictureNode'>Delete</button>
							<button onClick={callbacks.cutPicture} className='cut pictureNode'>Cut Picture</button>
							<button onClick={callbacks.insertPicture} className='insert pictureNode'>Insert Picture</button>
							<button onClick={callbacks.addNewPicture} className='add pictureNode'>Add New Picture</button>
							<button onClick={callbacks.addNewRelatedPictures} className='add galleryNode'>Add Related Pictures</button>
							<button onClick={callbacks.addNewSubGallery} className='add galleryNode'>Add Sub-gallery</button>
							<button onClick={callbacks.insertSubGallery} className='insert galleryNode'>Insert Sub-gallery</button>
							<button onClick={callbacks.insertRelatedPictures} className='insert galleryNode'>Insert Related Pictures</button>
						</div>
						{subPictureList}
						{relatedPictureList}
					</div>

				</div>
			);
		}

		else {
			var pictureDataClassName = "pictureData " + (this.state.showEditPane? " active" : " inactive")
			return (
				<div className={className}>
					<div className='title'>{this.props.displayTitle} </div>
					<div className='pictureSubSection'>
						<div> <img className='thImage' src={imgSrc} /> </div>
						<div className={pictureDataClassName} data-path={this.props.path}>
							<button onClick={this.toggleEditPane.bind(this)} className='edit'>{this.state.showEditPane? "CANCEL" : "EDIT"}</button>
							<div className='editPane'>

								<div><label>Title</label>    <input type='text' className='title'  defaultValue={this.props.title} autoComplete='off'/></div>
								<div><label>Client</label>   <input type='text' className='client' defaultValue={this.props.client} autoComplete='off'/></div>
								<div><label>Agency</label>   <input type='text' className='agency' defaultValue={this.props.agency} autoComplete='off'/></div>
								<div><label>Date</label>     <input type='text' className='date'   defaultValue={this.props.date} autoComplete='off'/></div>
								<div><label>Medium</label>   <input type='text' className='medium' defaultValue={this.props.medium} /></div>
								
								<div><label>Desc.</label>    <textarea className='description'     rows={5} defaultValue={this.props.description} /></div>
								<div><label>Desc2</label>    <input type='textarea' className='longDescription' rows={5} defaultValue={this.props.longDescription} /></div>
								<div><label>Worklog</label>  <input type='textarea' className='worklog'         rows={3} defaultValue={this.props.worklog} /></div>
								<div><label>Pub Hist</label> <input type='textarea' className='pubHistory'      rows={3} defaultValue={this.props.pubHistory} /></div>
								<div><label>Sale Hist</label><input type='textarea' className='saleHistory'     rows={3} defaultValue={this.props.saleHistory} /></div>
								<div><label>Image</label>    <select className='imageFile' onClick={callbacks.showImageSelector} defaultValue={this.props.imageFile}>{options}</select></div>
								
								<div className='buttons' onClick={this.toggleEditPane.bind(this)}>
									<button onClick={callbacks.saveModifiedPicture}   className='save'>Save</button>
									<button onClick={callbacks.deletePicture}         className='delete pictureNode'>Delete</button>
									<button onClick={callbacks.cutPicture}            className='cut pictureNode'>Cut Picture</button>
									<button onClick={callbacks.insertPicture}         className='insert pictureNode'>Insert Picture</button>
									<button onClick={callbacks.addNewPicture}         className='add pictureNode'>Add New Picture</button>
									<button onClick={callbacks.addNewRelatedPictures} className='add galleryNode'>Add Related Pictures</button>
									<button onClick={callbacks.addNewSubGallery}      className='add galleryNode'>Add Sub-gallery</button>
									<button onClick={callbacks.insertSubGallery}      className='insert galleryNode'>Insert Sub-gallery</button>
									<button onClick={callbacks.insertRelatedPictures} className='insert galleryNode'>Insert Related Pictures</button>
								</div>
							</div>
						</div>
						{subPictureList}
						{relatedPictureList}
					</div>

				</div>
			);
		}
	}
}


export default Picture;
