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
var recording = false;
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
var currMenuItem;
var currSound = null;
var playMode = "normal";

// any non-accounted for assumptions automatically kick you back to init
var menuSystem = {
      "init": {
            "file": "mainmenu.wav",
            "options": {
                  "1": "1_cambridgeStories",
                  "2": "2_chicagoStories",
                  "3": "3_sfStories",
                  "4": "4_story1",
                  "5": "5_story2",
                  "6": "6_story3",
                  "7": "7_randomStory",
                  "8": "8_ideofact",
                  "9": "9_cambridgefact",
                  "0": "0_song",
                  "-1": "init",
                  "-2": "init"
            }
      },
      "1_cambridgeStories": {
            "file": ["sounds/stories/cambridge/Ashley.wav","sounds/stories/cambridge/Bri.wav","sounds/stories/cambridge/Danny.wav","sounds/stories/cambridge/Fran.wav","sounds/stories/cambridge/Gian.wav","sounds/stories/cambridge/Grace.wav","sounds/stories/cambridge/Justin.wav","sounds/stories/cambridge/Lauren.wav","sounds/stories/cambridge/Marie.wav","sounds/stories/cambridge/Shaun.wav","sounds/stories/cambridge/Yael.wav"],
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
      "2_chicagoStories": {
            "file": ["sounds/stories/chicago/Michelle.wav"],
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
                  "-2": "init",
            }
      },
      "3_sfStories": {
            "file": ["sounds/stories/sf/chioma.wav","sounds/stories/sf/kim.wav","sounds/stories/sf/maura.wav","sounds/stories/sf/rohini.wav"],
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

      "4_story1": {
        "file": ["sounds/stories/new/story1/"],
        'options': {
        }
      },
      "5_story2": {
          "file": ["sounds/stories/new/story2/"],
          'options': {}
      },
      "6_story3": {
            "file": ["sounds/stories/new/story3/"]
            'options': {}
      },
      "7_randomStory": {
            "file": ["sounds/stories/new"],
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

      "8_ideofact": {
            "file": ["sounds/about_ideo.wav"],
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

      "9_cambridgefact": {
            "file": ["sounds/cambridge_1.wav","sounds/cambridge_2.wav","sounds/cambridge_3.wav","sounds/cambridge_4.wav","sounds/cambridge_5.wav"],
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
      "0_song": {
            "file": ["sounds/song_BeastofBurden.wav","sounds/song_BehindTheMask.wav","sounds/song_EyesWithoutAFace.wav","sounds/song_FantasticMan.wav","sounds/song_LittleRedCorvette.wav","sounds/song_StElmosFire.wav","sounds/song_YearoftheCat.wav"],
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
/*    if (recording) {
        eventEmitter.emit("stopRecording");
    } else {
      */
      // if (num == 1) {
      //   playMenuItem("whatever");
      // } else if (num == 2) {
      //   startRecording("filename");
      // }
      if (playMode == "normal") {
        if(num in menuSystem[currMenuItem]['options']) {
        //  see if there's some special option for you
          var playNext = menuSystem[currMenuItem]['options'][num];
          if (playNext === "4_story1" || playNext === "5_story2" || playNext === "6_story3") {
            // let's do some wacky ass storytelling shit
            beginStorytellingProcess(playNext);
          } else {
            // normal mode

            console.log("tryin to play this index: "+menuSystem[currMenuItem]['options'][num])
            playMenuItem(playNext);

          }

        }
      } else {
        // you're either recording or in freaky deaky storytelling mode rn
        // so deal with itttttt
      }
     
      // implied fallthrough - nothign happens if you press a key not associated with anything
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




function startRecording(filename) {

  var newsound = new Recording({
   debug: true,    // Show stdout 
   destination_folder: '/home/pi/storyphone/raspi/sounds/recordings',
   filename: filename+'.wav',
   alsa_format: 'cd',
   alsa_device: 'plughw:0'
  });
   
  newsound.record();
  recording = true;
  var defaultStop = setTimeout(function () {
      recording = false;
      newsound.stop(); // stop after 30 seconds 
  }, 30000);
   
  newsound.on('complete', function () {
      console.log('Done with recording!');
  });
  eventEmitter.on("stopRecording", function () {
    newsound.stop();
    if (recording) {
      clearTimeout(defaultStop);
      defaultStop = null;
      delete defaultStop;
    }
    recording = false;
  });

}

function beginStorytellingProcess(menuItem) {
  // starting a story
  // first play playStory_begin.wav
  //then play all story pieces
  // if you press star while that's happening, skip to last piece
  
  // then play playStory_end.wav
  // if you press pound, get out of storytelling mode and go back to "intro"
  // if you press any other key, go into recording mode
  // -- beginRecordingProcess
  // play recordStory_begin.wav
  // when that file finishes, begin recording - for 45 sec or until any key is pressed
  // when recording ends, save temporarily as storytelling#/newtemp.wav
  // play recordStory_end.wav
  // if you press "1", mv storytelling#/newtemp storytelling#/<unixteimstamp>.wav
  //   and then get out of storytelling mode and go back to "intro"
  // if yu press any other number, rm newtemp.wav and start again at beginRecordingProcess

}
function playMenuItem(menuItem){
      if (currSound != null) {
            currSound.stop();
      } 
      var currSoundFile = menuSystem[menuItem]['file'];

      // // for many random files
      if (typeof currSoundFile != 'string') {
            var len = currSoundFile.length;
            currSoundFile = menuSystem[menuItem]['file'][Math.floor(Math.random() * len)];
      }
      console.log("play menu item: "+currSoundFile);
      console.log("currSound: ");
      console.log(currSound);
      //  var currSoundFile = 'test2.wav';
      currSound = null;
      currSound = new Sound(currSoundFile);
      currMenuItem = menuItem;
      console.log("playing "+currSound);
      currSound.play();
}
