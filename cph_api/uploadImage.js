/*
	
This API must be running for the Admin page to work.

It does three things:

= 1 =
GET Request

It reads the gallery image directories and creates an array in alphabetical
order of all the image names. Each image name is followed by three flags to 
indicate sizes available. ex:
	"ernestOnTractor_study110",
	"ford_dumpTruck_orange111",

ernestOnTractor has the thumbnail and display images available.
ford_dumpTruck_orange has thumbnail, display and large images available.

the Admin page calls this endpoint when it loads to get a list of images available.

= 2 & 3 =
POST Request

This is called when the user makes edits in the Admin page.

When user saves a change then this script writes the change to pictureData.json. 
This is actually a symlink to the file in the gallery project.

This API also allows the user to upload image files. I have not used this for a 
long time and it may not work. Since the admin page will not be uploaded to the 
public server, this is not needed.


How to run:
	cd to the directory this file is in
	> node uploadImage.js
	or
	> node uploadImage.js debug

There is a page for testing the upload functionality. I don't know if it still works.
Run it like this:
	> node uploadImageasForm.js
*/

var http = require('http');
var path = require('path');

var server = http.createServer(function(req, res){
	logMsg("NEW REQUEST: " + req.method + ' -- ' + req.headers.referer + ' -- ' + req.headers['content-length']);

	switch (req.method) {
		case 'GET':
		listImageFiles(req, res);
		break;
	case 'POST':
		upload(req, res);
		break;
	}

}).listen(8125, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8125/');

/*
process.argv.forEach((val, index) => {
 console.log(`${index}: ${val}`);
});
*/

var hadError = function(err, res) {
	console.error(err); 
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Server Error');
}

var debug = process.argv[2] === "debug" ? 1 : 0;

var logMsg = function(msg) {
	debug && console.log(msg);
}

function listImageFiles(req, res, cb) {
	logMsg("in function listImageFiles()");
	var fs   = require('fs');
	var qs = req.url;
	
	var compress = function(data) {
console.log("Line 87", data);
		var sizes = ['thumbnail', 'display', 'large'], k, v, s;
		for(k in data) {
			if(!data.hasOwnProperty(k)) { continue; }
			var v = data[k];
			var newV = "";
			for (s = 0; s < sizes.length; s++) {
				newV += (v.indexOf(sizes[s]) > -1) ? '1' : '0';
			}
			data[k] = newV;
		}
	};

	var countFiles = function(fileType, files, fileCounter) {
		for (var i = 0; i < files.length; i++) {
			var file = files[i].split('.')[0];
			fileCounter[file] = fileCounter[file] || [];
			fileCounter[file].push(fileType);
		};
		return fileCounter;
	};

	var fileCounter = {};
	//var galleryImagesPath = '../cph_gallery/galleryImages';
	var galleryImagesPath = '../../cph/cph_gallery/galleryImages';

	var getThumbnailFiles = function(fileCounter, res) {
		fs.readdir(galleryImagesPath + '/thumbnail', function(err, data) {
			if(err) { return hadError(err, res); }
			fileCounter = countFiles('thumbnail', data, fileCounter);
			getDisplayFiles(fileCounter, res);
		});
	};
	
	var getDisplayFiles = function(fileCounter, res) {
		fs.readdir(galleryImagesPath + '/display', function(err, data) {
			if(err) { return hadError(err, res); }
			fileCounter = countFiles('display', data, fileCounter);
			getLargeFiles(fileCounter, res);
		});
	};
	
	var getLargeFiles = function(fileCounter, res) {
		fs.readdir(galleryImagesPath + '/large', function(err, data) {
			if(err) { return hadError(err, res); }
			fileCounter = countFiles('large', data, fileCounter);
			sendResponse(fileCounter, res);
		});
	};

	var convertToArray = function(data) {
		var ret = [];
		for (k in data) { ret.push(k + data[k]); }; 
		return ret.sort();
	}

	var sendResponse = function(fileCounter, res) {
		compress(fileCounter);
		fileCounter = convertToArray(fileCounter);
		logMsg("Image Files Count: " + fileCounter.length);
		//logMsg("Image Files: " + fileCounter);
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(fileCounter, null, 3));
	}

	getThumbnailFiles(fileCounter, res);
}

function upload(req, res) {
	logMsg("in function upload()");
	//logMsg(req);

	var fsx   = require('fs-extra');
	var formidable = require('formidable');
	var sizeOf = require('image-size');

	var validatePath = function(path) {
		var re = /^(thumbnail|display|large)\/[^/]+\.(jpg|jpeg|gif)$/;
		var x = path.match(re);
		return((x == null)? false : true); 
	}

	var form = new formidable.IncomingForm();
	
	// upload data file
	form.on('field', function(field){
console.log("Line 173 -- field: " + field);
		if(JSON.parse(field).galleries) {
			var fileName = "../admin/public/pictureData.json";
			var appDir = path.dirname(require.main.filename);
			fsx.outputFileSync(fileName, field);
			logMsg("uploaded JSON data to " + path.normalize(appDir + '/' + fileName) + ", length: " + field.length);
		}
		else {
			logMsg("ERROR -- rejected unrecognized data: " + field.substr(0, 50) + ", length: " + field.length);
		}
	});

/*
uploaded JSON data to /Users/198101/www/cph/cph_gallery/dddd.json, length: 4485
cph/admin/public
*/

	// upload image
	form.on('file', function(name, file){
		var tempPath = this.openedFiles[0].path;
        var fileName = this.openedFiles[0].name;
		if (!validatePath(fileName)) {
			logMsg("ERROR -- rejected image upload with invalid file path: " + fileName);
			global.statusCode = 403;
			global.end = 'Forbidden';
		}
		else {
			var newLocation = galleryImagesPath;

			fsx.copy(tempPath, newLocation + fileName, function(err) {  
				if (err) { 
					logMsg("ERROR copying file: " + err);
				}
				else     { 
					logMsg("uploaded image file to " + path.normalize(appDir + '/' + newLocation + fileName));
				}
				fsx.remove(tempPath);
			});
			var appDir = path.dirname(require.main.filename);
		}
	});
	
	form.on('end', function(){
		logMsg("request complete")
		if(global.statusCode) {res.statusCode = global.statusCode; }
		var end = global.end ? global.end : "request complete";
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.end(end);
	});
	
	//form.parse(req, function(err, fields, files){
	//form.parse(req);
form.parse(req, (err, fields, files) => {
  console.log('Line 121 fields:', fields);
  console.log('Line 122 files:', files);
});
}

