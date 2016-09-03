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


// -1 = *
// -2 = #
var numPad =  [ [1, 2, 3]
 			  , [4, 5, 6]
 			  , [7, 8, 9]
 			  , [-1, 0, -2]];

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

function resetPinGrid() {
    pinGrid = [ [0, 0, 0]
 			  , [0, 0, 0]
 			  , [0, 0, 0]
 			  , [0, 0, 0]];
	console.log("---------------------------");
}
function checkForPress() {
	var maxVal = 1;
	var maxLocation = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 3; j++) {
			if (pinGrid[i][j] > maxVal) {
				maxVal = pinGrid[i][j];
				maxLocation = [i, j];
			}
		}
	}
//	console.log(maxLocation);

	if (maxLocation.length > 0) {
		console.log(maxLocation);
		console.log("The number "+numPad[maxLocation[0]][maxLocation[1]]+" has been pressed!");
		resetPinGrid();
	} else {
		console.log("errr");
	}
}





wpi.wiringPiISR(row1Pin, wpi.INT_EDGE_FALLING, function() {
		if (wpi.digitalRead(row1Pin)) {
			console.log("row 1: ");
	       	pinGrid[0][0]++;
	       	pinGrid[0][1]++;
	       	pinGrid[0][2]++;
	       	checkForPress();
		}

});



wpi.wiringPiISR(col1Pin, wpi.INT_EDGE_FALLING, function() {
	if( wpi.digitalRead(col1Pin) ){
		console.log("col 1 ");
       	pinGrid[0][0]++;
       	pinGrid[1][0]++;
       	pinGrid[2][0]++;
       	pinGrid[3][0]++;
       	checkForPress();
	}
	
});


wpi.wiringPiISR(col2Pin, wpi.INT_EDGE_FALLING, function() {
	if ( wpi.digitalRead(col2Pin) ){
		console.log("col 2: ");
       	pinGrid[0][1]++;
       	pinGrid[1][1]++;
       	pinGrid[2][1]++;
       	pinGrid[3][1]++;
       	checkForPress();
	}
	
});

wpi.wiringPiISR(col3Pin, wpi.INT_EDGE_FALLING, function() {
	if (wpi.digitalRead(col3Pin)) {
		console.log("col 3: ");
       	pinGrid[0][2]++;
       	pinGrid[1][2]++;
       	pinGrid[2][2]++;
       	pinGrid[3][2]++;
       	checkForPress();
	}
	
});
