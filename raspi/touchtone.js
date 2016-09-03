var wpi = require('wiring-pi');

//// GPIO pin of the button
// check gpio readall in the cli to check for the wPI numbers
var row1Pin = 9
  , row2Pin = 7
  , row3Pin = 12
  , row4Pin = 3
  , col1Pin = 0
  , col2Pin = 2
  , col3Pin = 13
  , hangupPin = 8;



wpi.setup('wpi');

wpi.pinMode(configPin, wpi.INPUT);
wpi.pullUpDnControl(configPin, wpi.PUD_UP);


wpi.wiringPiISR(row1Pin, wpi.INT_EDGE_FALLING, function() {

       	console.log("row1");

});
