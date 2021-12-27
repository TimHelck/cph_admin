import React, { Component } from 'react';
import PictureList from './PictureList';
import SubEditPane from './SubEditPane';

class Picture extends Component {
	constructor() {
		super();
		this.state = { showEditPane: false };
	}


	toggleEditPane(e) {
		this.setState({showEditPane: !this.state.showEditPane});
		e.stopPropagation();
	}

	render() {

	    var subPictureList = "";
	    var relatedPictureList = "";
		var subEditPane_pubHistory = "";
		var subEditPane_caption = "";
		var subEditPane_comment = "";
		var subEditPane_description = "";
		var subEditPane_worklog = "";
		var subEditPane_saleHistory = "";
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
				imageData    = {this.props.imageData}
				gallery      = {gallery}
				callbacks    = {this.props.callbacks}
				galleryLevel = 'subTop'
			/>

		}
		
		subEditPane_pubHistory = <SubEditPane
			label        = 'pubHistory'
			text         = {this.props.pubHistory}
			isArrayField = 'true'
		/>

		subEditPane_caption = <SubEditPane
			label        = 'caption'
			text         = {this.props.caption}
			isArrayField = 'false'
		/>

		subEditPane_comment = <SubEditPane
			label        = 'comment'
			text         = {this.props.comment}
			isArrayField = 'false'
		/>
		
		subEditPane_description = <SubEditPane
			label        = 'description'
			text         = {this.props.description}
			isArrayField = 'false'
		/>

		subEditPane_worklog = <SubEditPane
			label        = 'worklog'
			text         = {this.props.worklog}
			isArrayField = 'true'
		/>

		subEditPane_saleHistory = <SubEditPane
			label        = 'saleHistory'
			text         = {this.props.saleHistory}
			isArrayField = 'true'
		/>

		var imageFile = this.props.imageFile;
		var imageData = this.props.imageData;
		var imgSrc = '../../galleryImages/thumbnail/' + imageFile + '.jpg';

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
							<div><label>Desc.</label><input type='textarea' className='description'     defaultValue={this.props.description} /></div>
						
							{/*
							<div className="hasEditPane">
								<label>Description</label> 
								<span className={'descriptionDisplay display'}>{this.props.description}</span>
								{subEditPane_description}
							</div>
							*/}
							
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
								<div><label>Desc.</label><input type='textarea' className='description'     defaultValue={this.props.description} /></div>
								
								<div className="hasEditPane">
									<label>Caption</label> 
									<span className={'captionDisplay display'}>{this.props.caption}</span>
									{subEditPane_caption}
								</div>
								
								<div className="hasEditPane">
									<label>Comment</label> 
									<span className={'commentDisplay display'}>{this.props.comment}</span>
									{subEditPane_comment}
								</div>
																	
								<div className="hasEditPane">
									<label>Worklog</label> 
									<span className={'worklogDisplay display'}>{this.props.worklog}</span>
									{subEditPane_worklog}
								</div>

								<div className="hasEditPane">
									<label>Pub History</label> 
									<span className={'pubHistoryDisplay display'}>{this.props.pubHistory}</span>
									{subEditPane_pubHistory}
								</div>
								
								<div className="hasEditPane">
									<label>Sale History</label> 
									<span className={'saleHistoryDisplay display'}>{this.props.saleHistory}</span>
									{subEditPane_saleHistory}
								</div>
								
								<div><label>Image</label>    <select className='imageFile' onClick={callbacks.showImageSelector} defaultValue={this.props.imageFile}>{options}</select></div>
								
								<div className='buttons' onClick={this.toggleEditPane.bind(this)}>
									<button onClick={callbacks.saveModifiedPicture}   className='save'>Save</button>
									<button onClick={callbacks.deletePicture}         className='delete pictureNode'>Delete</button>
									<button onClick={callbacks.cutPicture}            className='cut    pictureNode'>Cut Picture</button>
									<button onClick={callbacks.insertPicture}         className='insert pictureNode'>Insert Picture</button>
									<button onClick={callbacks.addNewPicture}         className='add    pictureNode'>Add New Picture</button>
									<button onClick={callbacks.addNewRelatedPictures} className='add    galleryNode'>Add Related Pictures</button>
									<button onClick={callbacks.addNewSubGallery}      className='add    galleryNode'>Add Sub-gallery</button>
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
