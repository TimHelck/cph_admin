
function isValidMarkup(markup) {



	var parseTags = function(x) {
		tags = [];
		skipTheseTags = ['img', 'br'];
		i = 15
		while (x.length && i) {
			m = x.match(/[^<]*(<[^>]*>)(.*)/);
	//console.log("Line 18: " + m + ' ------- ' + x);
			if(m) {
				var tagName = m[1].match(/<(\/?[^ >\/]*)/)[1];
	//console.log("Line 22: " + tagName);
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
		console.log(JSON.stringify(tags));
		return tags;
	}

	var removeMatchingTags = function(tagsOrig) {
		//var tags = tagsOrig.slice();
		var tags = [].concat(tagsOrig);
		i = 5
		while(tags.length && i) {
			var tagsLength = tags.length;
			for(j=0;j<tags.length; j++) {
				var tag1 = tags[j];
				
				var tag2;
				if(tag1[0] !== '/') {
					if(j+1 < tags.length && tags[j+1][0] === '/') {
						tag2 = tags[j+1];
	//console.log("Line 12: " + tagName1 + ' -- ' + tagName2);
						if(tag1 === tag2.slice(1)) { 
							tags.splice(j, 2);						
						}
					}
				}
				
				//console.log("Line 18: " + j + " -- " + tag1);
			}
			//console.log("Line 20: " +  i + ' -- ' + JSON.stringify(tags));
			i--;
			if(tags.length === tagsLength) { break; }
		}
		return tags;
	};

	var tags = parseTags(markup);
	var crushedTags = removeMatchingTags(tags);
	var result = crushedTags.length ? false : true;
console.log("markupValidator.js Line 63: " + result + ' -- ' + JSON.stringify(crushedTags));
	return [result, crushedTags];

}


