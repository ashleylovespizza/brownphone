var wpi = require('wiring-pi');
var Sound = require('node-aplay');
var Recording = require('node-arecord');
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
var _INTERVALMAX = 30;


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

var currSound = null;


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
   //   playMenuItem("init");
});



eventEmitter.on("hangup", function(){
      // kill playing menu
      console.log("caught hangup");
      pickedup = false;
   //   if (currSound != null) {
   //         currSound.stop();
   //   }
});




/********************************************************
*********************  KEYPAD CATCHER *******************
********************************************************/


eventEmitter.on("numPress", function(num){
      if (num == 1) {
        playMenuItem("whatever");
      } else if (num == 2) {
        startRecording("filename");
      }
      //  if(num in menuSystem[currMenuItem]['options']) {
      // //  see if there's some special option for you
      //       console.log("tryin to play this index: "+menuSystem[currMenuItem]['options'][num])
      //       playMenuItem(menuSystem[currMenuItem]['options'][num]);
      // } else if (num == "-1" || num == "-2") {
      // // * always kicks you back up to the very top
      //       playMenuItem("init");
      // }
      // // implied fallthrough - nothign happens if you press a key not associated with anything
})


var intervalMax = _INTERVALMAX;

setInterval(function(){ 
  wpi.digitalWrite(rows[0], 1);
  wpi.digitalWrite(rows[1], 1);
  wpi.digitalWrite(rows[2], 1);
  wpi.digitalWrite(rows[3], 1);
    
  for (i in rows) {
    wpi.digitalWrite(rows[0], 1);
    wpi.digitalWrite(rows[1], 1);
    wpi.digitalWrite(rows[2], 1);
    wpi.digitalWrite(rows[3], 1);

    wpi.digitalWrite(rows[i], 0);

    for (j in cols) {
      var reader = wpi.digitalRead(cols[j]);
  
      if (reader == 0 ) {
        // BUTTON IS PRESSED!

        var numPress = numPad[i][j];

        if (!(numPress == currNumPress && intervalMax > 0)) {
           console.log("PRESSED!!! "+numPress);
          currNumPress = numPress;
          eventEmitter.emit("numPress", String(numPress));
        }

        intervalMax = _INTERVALMAX;
       
      } else {
          intervalMax--;
      } 

    }
  }
}, 80);




function startRecording(filename) {

  var newsound = new Recording({
   debug: true,    // Show stdout 
   destination_folder: '/home/pi/storyphone/raspi/sounds/recordings',
   filename: filename+'.wav',
   alsa_format: 'dat',
   alsa_device: 'plughw:1,0',
   debug: true
  });
   
  newsound.record();
  setTimeout(function () {
      newsound.stop(); // stop after ten seconds 
  }, 5000);
   
  // you can also listen for various callbacks: 
  newsound.on('complete', function () {
      console.log('Done with recording!');
  });


}


function playMenuItem(menuItem){
      if (currSound != null) {
            currSound.stop();
      } 
      // var currSoundFile = menuSystem[menuItem]['file'];

      // // for many random files
      // if (typeof currSoundFile != 'string') {
      //       var len = currSoundFile.length;
      //       currSoundFile = menuSystem[menuItem]['file'][Math.floor(Math.random() * len)];
      // }
      // console.log("play menu item: "+currSoundFile);
      // console.log("currSound: ");
      // console.log(currSound);
      var currSoundFile = 'test2.wav';
      currSound = null;
      currSound = new Sound(currSoundFile);
      currMenuItem = menuItem;
      console.log("playing "+currSound);
      currSound.play();
}
