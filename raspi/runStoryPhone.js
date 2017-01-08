const wpi = require('wiring-pi');
const Sound = require('node-aplay');
const Recording = require('node-arecord');
const events = require('events');
const fs = require('fs');
const eventEmitter = new events.EventEmitter();



/********************************************************
*********************  PIN CONFIG FOR KEYPAD HOOKUP *******************
********************************************************/
//// GPIO pin of the button
// check `gpio readall`  in the cli to check for the wPI numbers

const storiesfolder = "sounds/stories/";
const hangupPin = 15;
const _INTERVALMAX = 30;

var pickedup = false;
var storiesFiles = [];
var currFilename = null;


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
var currMenuItem;
var currSound = null;
var globalTimeout = null;

var playMode = "normal";

// any non-accounted for assumptions automatically kick you back to init
var menuSystem = {
      "init": {
            "file": ["sounds/mainmenu_rain.wav", "sounds/mainmenu_fire.wav","sounds/mainmenu_city.wav","sounds/mainmenu_cave.wav","sounds/mainmenu_creaky.wav","sounds/mainmenu_beach.wav"],
            'options': {
                  "1": "1_recordStory",
                  "2": "2_playStory",
                  "3": "init",
                  "4": "init",
                  "5": "init",
                  "6": "init",
                  "7": "init",
                  "8": "init",
                  "9": "init",
                  "0": "init",
                  "-1": "init",
                  "-2": "init"
            }
      },
      "1_recordStory": {
            "file": "sounds/getReadyToRecord.wav",
            'options': {
                  "1": "finishRecording",
                  "2": "finishRecording",
                  "3": "finishRecording",
                  "4": "finishRecording",
                  "5": "finishRecording",
                  "6": "finishRecording",
                  "7": "finishRecording",
                  "8": "finishRecording",
                  "9": "finishRecording",
                  "0": "finishRecording",
                  "-1": "finishRecording",
                  "-2": "finishRecording",
            }
      },
      "2_playStory": {
            "file": ["sounds/stories/"],
            'options': {
                  "1": "init",
                  "2": "init",
                  "3": "init",
                  "4": "init",
                  "5": "init",
                  "6": "init",
                  "7": "init",
                  "8": "init",
                  "9": "init",
                  "0": "init",
                  "-1": "init",
                  "-2": "init"
            }
      },
      "finishRecording": {
        'file': "sounds/rerecord.wav",
        'options': {
              "1": "1_recordStory",
              "2": "init",
              "3": "init",
              "4": "init",
              "5": "init",
              "6": "init",
              "7": "init",
              "8": "init",
              "9": "init",
              "0": "init",
              "-1": "init",
              "-2": "init",
        }
      }
};

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
      //console.log("caught pickup");

      storiesFiles = [];
      fs.readdir(storiesfolder, function(err, files) {
        files.forEach(function(file) {
         // console.log(file);
          storiesFiles.push(storiesfolder + file);
        });
      })


      playMode = "normal";
      currFilename = null;
      pickedup = true;
      playMenuItem("init");
});



eventEmitter.on("hangup", function(){
      // kill playing menu
      console.log("caught hangup");
      pickedup = false;
      playMode = "normal";
      storiesFiles = null;
      currFilename = null;
      if (currSound != null) {
            currSound.stop();
      }
});




/********************************************************
*********************  KEYPAD CATCHER *******************
********************************************************/


eventEmitter.on("numPress", function(num){

  clearTimeout(globalTimeout);
  globalTimeout = null;

  if (!!pickedup) {
    // only let buttons do stuff if you're actually picked up, silly

    if (playMode == "recording") {
        eventEmitter.emit("stopRecording");
    } 

    
    if(num in menuSystem[currMenuItem]['options']) {
      var playNext = menuSystem[currMenuItem]['options'][num];
      console.log("tryin to play this index: "+menuSystem[currMenuItem]['options'][num])
      playMenuItem(playNext);

    }
  }
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




function startRecording() {
  var filename = (currFilename != null) ? currFilename : String(Date.now());
  console.log("a==========");
  console.log("here is the filename: "+filename);
  console.log("and here is the currFilename: "+currFilename);
  currFilename = filename;
  console.log("currFilename AGAIN: "+currFilename);
  console.log("a==========");
  var newsound = new Recording({
   debug: true,    // Show stdout 
   destination_folder: '/home/pi/storyphone/raspi/sounds/stories',
   filename: filename+'.wav',
   alsa_format: 'cd',
   alsa_device: 'plughw:0'
  });
   
  newsound.record();
  playMode = 'recording';
  var defaultStop = setTimeout(function () {
      
      eventEmitter.emit("stopRecording");

  }, 180000);
   
  newsound.on('complete', function () {
      console.log('Done with recording!');
  });
  eventEmitter.on("stopRecording", function () {
    newsound.stop();
    if (playMode == "recording") {

      clearTimeout(defaultStop);
      defaultStop = null;
      delete defaultStop;


      playMode = 'finishRecording';
      console.log("done recording "+currFilename+".wav");
    //  playMenuItem('finishRecording');

      //todo
    }
  });

}


function playMenuItem(menuItem){
      if (currSound != null) {
            currSound.stop();
      } 
      var currSoundFile = menuSystem[menuItem]['file'];

      // // for many random files
      if (typeof currSoundFile != 'string') {
            var len = currSoundFile.length;
            if (len === 1) {
              // special case - only for playing random story
              currSoundFile = storiesFiles[Math.floor(Math.random() * storiesFiles.length)]
              
            } else {
              // not actually using this in this rev of phone, but let's leave it in, if/else is cheap
              currSoundFile = menuSystem[menuItem]['file'][Math.floor(Math.random() * len)];

            }
      }

      console.log("play menu item: "+currSoundFile);
      console.log("currSound: " + currSoundFile);
      // console.log(currSound);

      // TESTING
      //  var currSoundFile = 'test2.wav';



      currSound = null;
      currSound = new Sound(currSoundFile);
      currMenuItem = menuItem;

      if (menuItem == "finishRecording") {
        // "just wait" - set up timer to automatically go back to menu if nobody does nothin
        globalTimeout = setTimeout(function() {
          //
          // go back to main menu - pretend to fire a button that isn't 1, ie don't rerecord
          eventEmitter.emit("numPress", '5');
        }, 16000);
      }

      // deal with weird recording situation
      if (menuItem == "1_recordStory") {
        // if (playMode == "finishRecording") {
        //   // we want to rerecord
        // }
        playMode = "begin_record";
        // still play currSoundFile, but add listener to begin recording when sound completes

        currSound.on('complete', function () {
            console.log('start ACTUALLY recording!');
            startRecording();
        });
        
      } else if (menuItem != "1_recordStory" && menuItem != "finishRecording" && playMode == "finishRecording") {
        console.log("RESET CURRFILENAME")
        currFilename = null;
      }


      console.log("playing "+currSound);
      currSound.play();
}
