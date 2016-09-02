//var wpi = require('wiring-pi');
var Sound = require('node-aplay');
var fs = require('fs');

var mySound;

var soundPath = "feed/sounds/";
// need to make sure to grab this on every cradle pickup... 
//    or maybe just have the app restart once a day?
var allsounds = fs.readdirSync(soundPath);
console.log(allsounds);

var test = new Sound('feed/sounds/new_1472780372380.wav')

for (var i=0; i<allsounds.length; i++){
	if (allsounds[i].substring(0,4) == 'new_') {
		//new file - rename, and play it!
		var newname = allsounds[i].substring(4);
	//	fs.rename(soundPath + allsounds[i], soundPath + newname);
		console.log("play newname "+soundPath + allsounds[i]);
		mySound = new Sound(soundPath + allsounds[i]);
		mySound.play();
		break;
	}
}

console.log("started, playing "+mySound);
mySound.play();
//
//// GPIO pin of the button
//var configPin = 7;
//
//wpi.setup('wpi');
//
//wpi.pinMode(configPin, wpi.INPUT);
//wpi.pullUpDnControl(configPin, wpi.PUD_UP);
//
//
//wpi.wiringPiISR(configPin, wpi.INT_EDGE_FALLING, function() {
////  if (wpi.digitalRead(configPin)) {
//       	console.log("push");
//       	testSound.play();
// // }
//});//