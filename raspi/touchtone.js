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


var pinGrid = [ [0, 0, 0]
 			  , [0, 0, 0]
 			  , [0, 0, 0]
 			  , [0, 0, 0]];

//test
pinGrid[1][2] = 3;
console.log(pinGrid);

wpi.setup('wpi');

wpi.pinMode(row1Pin, wpi.INPUT);
wpi.pullUpDnControl(row1Pin, wpi.PUD_UP);

wpi.pinMode(row2Pin, wpi.INPUT);
wpi.pullUpDnControl(row2Pin, wpi.PUD_UP);

wpi.pinMode(row3Pin, wpi.INPUT);
wpi.pullUpDnControl(row3Pin, wpi.PUD_UP);

wpi.pinMode(row4Pin, wpi.INPUT);
wpi.pullUpDnControl(row4Pin, wpi.PUD_UP);

wpi.pinMode(col1Pin, wpi.INPUT);
wpi.pullUpDnControl(col1Pin, wpi.PUD_UP);

wpi.pinMode(col2Pin, wpi.INPUT);
wpi.pullUpDnControl(col2Pin, wpi.PUD_UP);

wpi.pinMode(col3Pin, wpi.INPUT);
wpi.pullUpDnControl(col3Pin, wpi.PUD_UP);

wpi.pinMode(hangupPin, wpi.INPUT);
wpi.pullUpDnControl(hangupPin, wpi.PUD_UP);




wpi.wiringPiISR(row1Pin, wpi.INT_EDGE_FALLING, function() {
       	console.log("row1");
});
