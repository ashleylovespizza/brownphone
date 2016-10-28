var wpi = require('wiring-pi');
var Sound = require('node-aplay');
var events = require('events');
var fs = require('fs');
var eventEmitter = new events.EventEmitter();



/********************************************************
*********************  PIN CONFIG FOR KEYPAD HOOKUP *******************
********************************************************/
//// GPIO pin of the button
// check `gpio readall`  in the cli to check for the wPI numbers

var hangupPin = 15;
var pickedup = false;


// this seems insane but bear with me...
// pinGrid is laid out so each pin location is represented by a [row, col] boolean set
// third item is unix tiem of most recent button press
// pressing a number triggers both a row and col press
// so actual number pressed will be the only one with [true, true]
var pinGrid = [ [[false, false, 0], [false,false, 0], [false,false, 0]]
              , [[false, false, 0], [false,false, 0], [false,false, 0]]
              , [[false, false, 0], [false,false, 0], [false,false, 0]]
              , [[false, false, 0], [false,false, 0], [false,false, 0]]];

var row1Pin = 21
  , row2Pin = 22
  , row3Pin = 23
  , row4Pin = 24
  , col1Pin = 25
  , col2Pin = 28
  , col3Pin = 29;

  var rows = [row1Pin, row2Pin, row3Pin, row4Pin];
  var cols = [col1Pin, col2Pin, col3Pin];


// mapping for the number you're actually pressing to its row/col location
// -1 = *
// -2 = #
var numPad =  [ [1, 2, 3]
              , [4, 5, 6]
              , [7, 8, 9]
              , [-1, 0, -2]];


// keep track of timing...
var currNumPress = null;



//// SET UP PINS
wpi.setup('wpi');
wpi.pinMode(hangupPin, wpi.OUTPUT);
wpi.pullUpDnControl(hangupPin, wpi.PUD_UP);

wpi.pinMode(row1Pin, wpi.OUTPUT);
wpi.pullUpDnControl(row1Pin, wpi.PUD_UP);

wpi.pinMode(row2Pin, wpi.OUTPUT);
wpi.pullUpDnControl(row2Pin, wpi.PUD_UP);

wpi.pinMode(row3Pin, wpi.OUTPUT);
wpi.pullUpDnControl(row3Pin, wpi.PUD_UP);

wpi.pinMode(row4Pin, wpi.OUTPUT);
wpi.pullUpDnControl(row4Pin, wpi.PUD_UP);

wpi.pinMode(col1Pin, wpi.INPUT);
wpi.pullUpDnControl(col1Pin, wpi.PUD_UP);

wpi.pinMode(col2Pin, wpi.INPUT);
wpi.pullUpDnControl(col2Pin, wpi.PUD_UP);

wpi.pinMode(col3Pin, wpi.INPUT);
wpi.pullUpDnControl(col3Pin, wpi.PUD_UP);


/********************************************************
*********************  HANGUP CATCHER *******************
********************************************************/

wpi.wiringPiISR(hangupPin, wpi.INT_EDGE_BOTH, function(delta) {
        var readval = wpi.digitalRead(hangupPin);
        console.log(readval);
        if (readval == 0) {
            if (pickedup) {
                  console.log("phone hung up");
                  eventEmitter.emit("hangup");
            }
        } else {
            if (!pickedup) {
                  console.log("phone picked up");
                  eventEmitter.emit("pickup")
            }
        }

});


eventEmitter.on("pickup", function(){
      //start playing menu from the top
      console.log("caught pickup");

      pickedup = true;
    //  playMenuItem("init");
});



eventEmitter.on("hangup", function(){
      // kill playing menu
      console.log("ccaught hangup");
      pickedup = false;
   //   if (currSound != null) {
   //         currSound.stop();
   //   }
});




/********************************************************
*********************  KEYPAD CATCHER *******************
********************************************************/


setInterval(function(){ 
    wpi.digitalWrite(rows[0], 1);
    wpi.digitalWrite(rows[1], 1);
    wpi.digitalWrite(rows[2], 1);
    wpi.digitalWrite(rows[3], 1);
    
  //var wires = [21,22,23,24,25,28,29]
  for (i in rows) {
    wpi.digitalWrite(rows[0], 1);
    wpi.digitalWrite(rows[1], 1);
    wpi.digitalWrite(rows[2], 1);
    wpi.digitalWrite(rows[3], 1);
  //  var val = wpi.digitalRead(wires[i]);
    wpi.digitalWrite(rows[i], 0);
    //var reader = wpi.digitalRead(rows[i]);
     // console.log(rows[i]+" is "+reader);
    for (j in cols) {
      var reader = wpi.digitalRead(cols[j]);
  
  // this is still kinda stuck
  // base you need to see if a keypress is still ongoing...
  // so you need to test only the single combo you're on before reseting yo
      if (reader == 0 && currNumPress == null) {
        // BUTTON IS PRESSED!
        var numPress = numPad[i][j];
        console.log("PRESSED!!! "+numPress);
        currNumPress = numPress;
        eventEmitter.emit("numPress", String(numPress));
      }   else {
        console.log("reset");
        currNumPress = null;
      } 

    }
  }
}, 50);


function checkForPressGroundedCircuit() {
         var pressLocation = [];
         for (var i = 0; i < 4; i++) {
           for (var j = 0; j < 3; j++) {
             if (pinGrid[i][j][0] && pinGrid[i][j][1]) {
               pressLocation = [i, j];
             }
           }
         }

         if (pressLocation.length > 0) {
         //  console.log(pressLocation);
                  var numPress = numPad[pressLocation[0]][pressLocation[1]];
                 console.log("The number "+numPad[pressLocation[0]][pressLocation[1]]+" has been pressed!");
                  eventEmitter.emit("numPress", String(numPress));
         } else {
         }
}


