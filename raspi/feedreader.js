var https = require('https');
var fs = require('fs');
var diff = require('deep-diff').diff;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var oldFeedJSON
   ,newFeedJSON;
var newSoundFiles = [];

//start();
//dontdownload();

downloadAll();

function start(){

	// rename old file to feed.json
	fs.rename('feed/new_feed.json', 'feed/feed.json');
	fs.readFile('feed/feed.json', 'utf8', function (err, data) {
		if (err) throw err;
		oldFeedJSON = JSON.parse(data);
		pullNewFeed();
	})
}



function pullNewFeed() {
	// pull down new file
	var localFeedFileName = "feed/new_feed.json"; //String(Date.now())+".json";
	var localFeed = fs.createWriteStream(localFeedFileName);
	var request = https.get('https://ff-understandings.herokuapp.com/feed', function(response){
		response.pipe(localFeed);
		localFeed.on('finish', function() {
	      localFeed.close(parseNewFeed);  // close() is async, call cb after close completes.
	    });
	});
}



function dontdownload() {
	fs.readFile('feed/feed.json', 'utf8', function (err, data) {
		if (err) throw err;
		oldFeedJSON = JSON.parse(data);
		parseNewFeed();
	})
}



function parseNewFeed() {
	fs.readFile('feed/new_feed.json', 'utf8', function (err, data) {
		if (err) throw err;
		newFeedJSON = JSON.parse(data);
		evaluateDiff();
	})
}



function evaluateDiff(){
	console.log(Object.size(oldFeedJSON));
	console.log(typeof oldFeedJSON);

	if (Object.size(oldFeedJSON) < Object.size(newFeedJSON)) {
		// more have been added, time to download
		var differences = diff(oldFeedJSON, newFeedJSON);
		for (var i=0; i<differences.length; i++) {
			var currdiff = differences[i];
			if (currdiff['kind'] != null && currdiff['kind'] == 'A' && currdiff['item'] != null) {
						
				newSoundFiles.push(currdiff['item']['rhs']['audio_file']);
			//console.log(currdiff);
			}

		}

		downloadDifference();
			
	} else {
		console.log("no diff");
	}
}

function downloadAll() {
	fs.readFile('feed/new_feed.json', 'utf8', function (err, data) {
		if (err) throw err;
		newFeedJSON = JSON.parse(data);
		
		for (var i in newFeedJSON) {
			newSoundFiles.push(newFeedJSON[i]['audio_file'])
		}
		console.log("about to download "+newSoundFiles.length()+" files");
		downloadDifference();
	})
}

function downloadDifference(){
	var newsoundURL = newSoundFiles.pop();

	if (newsoundURL != null) {
			// download new wav files
				// todo - might be nice to have these titled with their original .wav filenames
				var localWavFileName = "feed/sounds/busy_new_" + String(Date.now()) + ".wav"; //String(Date.now())+".json";
				var localFile = fs.createWriteStream(localWavFileName);
				var request = https.get(newsoundURL, function(response){
					response.pipe(localFile);
					localFile.on('finish', function() {
				        localFile.close();  // close() is async, call cb after close completes.

				        // rename now that it's no longer busy
				        var newWavFileName = localWavFileName.substring(17);
						console.log(newWavFileName)	;
						fs.rename(localWavFileName, 'feed/sounds/'+newWavFileName);
						console.log("downloaded "+newWavFileName);
						downloadDifference();
				    });
				});
	}
			
}


