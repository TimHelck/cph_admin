var http = require('http');
var formidable = require('formidable');
var fs   = require('fs-extra');
var sizeOf = require('image-size');


var server = http.createServer(function(req, res){
	switch (req.method) {
		case 'GET':
		show(req, res);
		break;
	case 'POST':
		upload(req, res);
		break;
	}

}).listen(8125, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8125/');

	
function show(req, res) {
	var html = ''
	+ '<form method="post" action="/" enctype="multipart/form-data">'
	+ '<p><input type="file" name="file" id="fileInput" /></p>'
	+ '<p><label>New Name (Optional)<input type="text" name="newName" /></label></p>'
	+ '<p><input type="submit" value="Upload" /></p>'
	+ '</form>'
	+ '<script>'
	+ '    console.log("Line 30");'
	+ 'var fileInput = document.getElementById("fileInput");'
	+ 'fileInput.onchange = function(evt) { '
	+ '    console.log("Line 31");'
	+ '};'
	+ '/<script>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

function upload(req, res) {
	if (!isFormData(req)) {
		res.statusCode = 400;
		res.end('Bad Request');
		return;
	}
	
	var form = new formidable.IncomingForm();
	
	form.on('field', function(field, value){
		console.log("Line 40, field event: " + field + ' -- ' + value);
	});
	
	form.on('file', function(name, file){
		console.log("Line 45, file event");
		console.log(name);
		//console.log(file);
		var tempPath = this.openedFiles[0].path;
        var fileName = this.openedFiles[0].name;
		var newLocation = './uploads/';
		console.log("Line 44: " + tempPath + ' -- ' + fileName);
        fs.copy(tempPath, newLocation + fileName, function(err) {  
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
	});
	
	form.on('end', function(){
		res.end('upload complete!');
	});

	form.parse(req, function(err, fields, files){
		console.log("Line 56, parse");
		console.log(fields);
		console.log(files);
		res.end('upload complete!');
	});
	
	form.on('progress', function(bytesReceived, bytesExpected){
		var percent = Math.floor(bytesReceived / bytesExpected * 100);
		console.log("Line 56, progress event");
		console.log(percent);
	});

	form.parse(req);

}

function isFormData(req) {
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}


