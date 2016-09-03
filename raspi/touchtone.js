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

// this seems insane but bear with me...
// pinGrid is laid out so each pin location is represented by a [row, col] boolean set
// third item is unix tiem of most recent button press
// pressing a number triggers both a row and col press
// so actual number pressed will be the only one with [true, true]
var pinGrid = [ [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]];

var row1Last=0
  , row2Last=0
  , row3Last=0
  , row4Last=0
  , col1Last=0
  , col2Last=0
  , col3Last=0;
// -1 = *
// -2 = #
var numPad =  [ [1, 2, 3]
 			  , [4, 5, 6]
 			  , [7, 8, 9]
 			  , [-1, 0, -2]];

var deltaVal = 1;
var lastPressTime = 0;
var timeThreshhold = 70;

//TEST
// pinGrid[2][1]++;
// console.log(pinGrid);
// console.log(numPad[2][1]);

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
	pinGrid = [ [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
 			  , [[false, false, 0], [false,false, 0], [false,false, 0]]];
	console.log("---------------------------");
}


function checkForPress() {
	var pressLocation = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 3; j++) {
			if (pinGrid[i][j][0] && pinGrid[i][j][1]) {
				pressLocation = [i, j];
			}
		}
	}

	if (pressLocation.length > 0) {
		console.log(pressLocation);
		console.log("The number "+numPad[pressLocation[0]][pressLocation[1]]+" has been pressed!");
		resetPinGrid();
	} else {
	}
}





wpi.wiringPiISR(row1Pin, wpi.INT_EDGE_RISING, function(delta) {
	if( wpi.digitalRead(row1Pin)){
		var now = Number(Date.now());
		console.log("row 1: " + String(now - pinGrid[0][0][2])+", "+(now - pinGrid[0][1][2])+", "+(now - pinGrid[0][2][2]));
		console.log(" ")

		if (   now - row1Last > timeThreshhold) {
			console.log("REAL PRESS!");

	       	pinGrid[0][0][0] = true;
	       	pinGrid[0][1][0] = true;
	       	pinGrid[0][2][0] = true;
	       	checkForPress();
	    }

	    row1Last = now;
	}
});
wpi.wiringPiISR(row2Pin, wpi.INT_EDGE_RISING, function(delta) {
		if (wpi.digitalRead(row2Pin)){
			console.log("row 2: "  );
			console.log(" ")

			var now = Date.now();
			if (   now - row2Last > timeThreshhold) {
			console.log("REAL PRESS!");
		       	pinGrid[1][0][0] = true;
		       	pinGrid[1][1][0] = true;
		       	pinGrid[1][2][0] = true;
		       	checkForPress();
			}
			row2Last = now;

		}		
});
wpi.wiringPiISR(row3Pin, wpi.INT_EDGE_RISING, function(delta) {
		if (wpi.digitalRead(row3Pin)){
			console.log("row 3: "  );
			console.log(" ")

			var now = Date.now();
			if (   now - row3Last > timeThreshhold) {
			console.log("REAL PRESS!");
		       	pinGrid[2][0][0] = true;
		       	pinGrid[2][1][0] = true;
		       	pinGrid[2][2][0] = true;
		       	checkForPress();
			}
			row3Last = now;

		}		
});
wpi.wiringPiISR(row4Pin, wpi.INT_EDGE_RISING, function(delta) {
		if (wpi.digitalRead(row4Pin)){
			console.log("row 4: "  );
			console.log(" ")

			var now = Date.now();
			if (   now - row4Last > timeThreshhold) {
			console.log("REAL PRESS!");
		       	pinGrid[3][0][0] = true;
		       	pinGrid[3][1][0] = true;
		       	pinGrid[3][2][0] = true;
		       	checkForPress();
			}
			row4Last = now;

		}		
});



wpi.wiringPiISR(col1Pin, wpi.INT_EDGE_RISING, function(delta) {
	if (wpi.digitalRead(col1Pin) && delta > deltaVal){
		var now = Date.now();
		console.log("col 1 : "+ String(now - pinGrid[0][0][2]) + ", "+ (now - pinGrid[1][0][2]) +" , "+(now - pinGrid[2][0][2]) +", "+(now - pinGrid[3][0][2]) );
		console.log(" ")
		if (   now - col1Last > timeThreshhold) {
			console.log("REAL PRESS!");
	       	pinGrid[0][0][1] = true;
	       	pinGrid[1][0][1] = true;
	       	pinGrid[2][0][1] = true;
	       	pinGrid[3][0][1] = true;

	     	checkForPress();
		}
	    col1Last = now;
	}
});
wpi.wiringPiISR(col2Pin, wpi.INT_EDGE_RISING, function(delta) {
	if ( wpi.digitalRead(col2Pin) ){
		var now = Date.now();
		console.log("col 2 - "+now-col2Last);
	//	console.log("col 2: " + String(now - pinGrid[0][1][2])  +", "+ (now - pinGrid[1][1][2])  +", "+ (now - pinGrid[2][1][2])  + ", "+ (now - pinGrid[3][1][2]) );
		console.log(" ")

		if (   now - col2Last > timeThreshhold) {
			console.log("REAL PRESS!");

	  		pinGrid[0][1][1] = true;
	       	pinGrid[1][1][1] = true;
	       	pinGrid[2][1][1] = true;
	       	pinGrid[3][1][1] = true;
	      	checkForPress();
		}
	    col2Last = now;
	}
	
});

wpi.wiringPiISR(col3Pin, wpi.INT_EDGE_RISING, function(delta) {
	if (wpi.digitalRead(col3Pin)) {
		console.log("col 3: "+now-col3Last);
		
		var now = Date.now();
		if (   now - col3Last > timeThreshhold) {
			console.log("REAL PRESS!");
	       	pinGrid[0][2][1] = true;
	       	pinGrid[1][2][1] = true;
	       	pinGrid[2][2][1] = true;
	       	pinGrid[3][2][1] = true;
	       	checkForPress();
		}
		col3Last = now;

	}
	
});
