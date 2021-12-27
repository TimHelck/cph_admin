
function isValidMarkup(markup) {

	var parseTags = function(x) {
		tags = [];
		skipTheseTags = ['img', 'br'];
		i = 1500 // to protect agains endless loop
		while (x.length && i) {
			//need to match multil-line text. "[\s\S]*" does that, ".*" does not. 
			m = x.match(/[^<]*(<[^>]*>)([\s\S]*)/);
	console.log("markupValidator Line 18: " + m + ' ------- ' + x);
			if(m) {
				var tagName = m[1].match(/<(\/?[^ >\/]*)/)[1];
	console.log("markupValidator Line 22: " + tagName);
				if(skipTheseTags.indexOf(tagName) === -1 && skipTheseTags.indexOf(tagName.slice(1)) === -1) {
					tags.push(tagName);
				}
				x = m[2] ? m[2] : '';
			}
			else {
				x = '';
			}
	//console.log("Line 24: " + i);		
			i--;
		}
	console.log("markupValidator Line 25: " + JSON.stringify(tags));
		return tags;
	}

	var removeMatchingTags = function(tagsOrig) {
		var tags = [].concat(tagsOrig);
		i = 1500
		while(tags.length && i) {
			var tagsLength = tags.length;
			for(j=0;j<tags.length; j++) {
				var tag1 = tags[j];
				
				var tag2;
				if(tag1[0] !== '/') {
					if(j+1 < tags.length && tags[j+1][0] === '/') {
						tag2 = tags[j+1];
						if(tag1 === tag2.slice(1)) { 
							tags.splice(j, 2);						
						}
					}
				}
				
			}
			i--;
			if(tags.length === tagsLength) { break; }
		}
		return tags;
	};

	var tags = parseTags(markup);
	var crushedTags = removeMatchingTags(tags);
	var result = crushedTags.length ? false : true;
//console.log("markupValidator.js Line 63: " + result + ' -- ' + JSON.stringify(crushedTags));
	return [result, JSON.stringify(crushedTags)];

}

// see Onur Yilirum's response
// https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not


function parseString(str) {
    try {
        return [null, JSON.parse(str)];
    } catch (err) {
        return [err];
    }
}

function getArrayFromData(x) {
console.log("markupValidator Line 76: " + x);
	if(typeof x === 'string') {
		const [err, result] = parseString(x);
console.log("markupValidator Line 78: " + err + ' -- ' + result);
		if (err) { return false; }
		else if(Object.prototype.toString.call(result) === '[object Array]') {
			return [null, result];
		}
		else { return [err, false]; }
	}
	else if(Object.prototype.toString.call(x) === '[object Array]') {
		return [null, x];
	}
	else { return [err, false]; }
}

function getSerializedValidArray(x) {
	
	// check if x represents an array:

	var strArray = getArrayFromData(x);
console.log("markupValidator Line 106: " + strArray);
	if(!strArray) { return [x, null]; }
	
	// check that each element is a string and has valid markup:
	/*
	for(i = 0; i < strArray.length; i++) {
		var markup = strArray[i];
		if(typeof markup !== 'string' || !isValidMarkup(markup)) {
			return [markup, null ];
		}
	}
	*/
	// return JSON string
	return [null, JSON.stringify(strArray)]; 
}




