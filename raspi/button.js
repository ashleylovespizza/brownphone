var wpi = require('wiring-pi');
var Sound = require('node-aplay');

var testSound = new Sound('test.wav');
console.log("started");

// GPIO pin of the button
var configPin = 7;

wpi.setup('wpi');

wpi.pinMode(configPin, wpi.INPUT);
wpi.pullUpDnControl(configPin, wpi.PUD_UP);


wpi.wiringPiISR(configPin, wpi.INT_EDGE_FALLING, function() {
//  if (wpi.digitalRead(configPin)) {
       	console.log("push");
       	testSound.play();
 // }
});