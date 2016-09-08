var request = require("request");
var fs = require('fs');
var url = require('url');
var path = require("path");
var _ = require('lodash');
var request = require('request');

var recordingsPath = "./recordings";
var localFiles = [];
var feedURL = "http://thebrownphone.com/feed";

console.log("-----------------------------------------");
console.log(new Date());
console.log("-----------------------------------------");


// ------------------------------------------------------------------------
fs.readdir(recordingsPath, function(err, items) {
	if(items) {
	    localFiles = items;
	    console.log("Local Files "+localFiles.length);
	    // now pull down the web and see if we have new files
		pulldownFeed();
	}
});

// ------------------------------------------------------------------------
function download(url, filename) {
	request.get(url)
		   .on('error', function(err) {
		   		console.log("Error downloading");
  			})
	.pipe(fs.createWriteStream(recordingsPath+'/'+filename));
}

// ------------------------------------------------------------------------
function pulldownFeed() {
	console.log("Pull Down Feed");
	request({
	    url: feedURL,
	    json: true
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
			var json = response.body;

			// get the latest files
			var latestFiles = [];
			var latestFilenames = [];

			for (var i = 0; i < json.length; i++) {
				var u = json[i].audio_file;
				var filename = path.basename(u);
				console.log("filename: "+filename);
				latestFilenames.push(filename);
				latestFiles.push({filename:filename, url:u});
			}


			for (var i = 0; i < latestFiles.length; i++) {
				var newFilename = latestFiles[i].filename;
				var u = latestFiles[i].url;
				
				// does this file exist in the local list
				// if not download and save it localy
				var exist = _.indexOf(localFiles, newFilename);
				if(exist <= -1) {
					console.log("Download this file: "+u);	
					download(u, newFilename)
				}
				else {
					console.log("File already downloaded");
				}
			}

			// now check to see if any local files we have are no longer in the 
			// feed. if so we want to remove these file
			for (var i = 0; i < localFiles.length; i++) {
				var filename = localFiles[i];
				var exist = _.indexOf(latestFilenames, filename);
				if(exist <= -1) {
					console.log("Remove this file localy");
					fs.unlinkSync(recordingsPath+'/'+filename);
				}
			}
	    }
	    else {
	    	console.log("error");
	    }
	});
}

console.log("-----------------------------------------");
