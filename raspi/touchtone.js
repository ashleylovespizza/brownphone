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
var row1Pin = 6
  , row2Pin = 10
  , row3Pin = 28
  , row4Pin = 27
  , col1Pin = 11
  , col2Pin = 26
  , col3Pin = 29
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

// mapping for the number you're actually pressing to its row/col location
// -1 = *
// -2 = #
var numPad =  [ [1, 2, 3]
       			  , [4, 5, 6]
       			  , [7, 8, 9]
       			  , [-1, 0, -2]];

var deltaVal = 1;
var lastPressTime = 0;
var timeThreshhold = 70;

var pickedup = false;


wpi.setup('wpi');
// pin setup stuff...
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


/********************************************************
*********************  HANGUP CATCHER *******************
********************************************************/
wpi.wiringPiISR(hangupPin, wpi.INT_EDGE_BOTH, function(delta) {
        var readval = wpi.digitalRead(hangupPin);
        if (readval == 1) {
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




/********************************************************
*********************  KEYPAD CATCHER *******************
********************************************************/

function resetPinGrid() {
       	pinGrid = [ [[false, false, 0], [false,false, 0], [false,false, 0]]
       			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
       			  , [[false, false, 0], [false,false, 0], [false,false, 0]]
       			  , [[false, false, 0], [false,false, 0], [false,false, 0]]];

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
       	//	console.log(pressLocation);
                  var numPress = numPad[pressLocation[0]][pressLocation[1]];
       		console.log("The number "+numPad[pressLocation[0]][pressLocation[1]]+" has been pressed!");
       		resetPinGrid();

                  eventEmitter.emit("numPress", String(numPress));
       	} else {
       	}
}

wpi.wiringPiISR(row1Pin, wpi.INT_EDGE_RISING, function(delta) {
       	if( wpi.digitalRead(row1Pin)){
       		var now = Number(Date.now());
       		//console.log("row 1: " + String(now - pinGrid[0][0][2])+", "+(now - pinGrid[0][1][2])+", "+(now - pinGrid[0][2][2]));
       		//console.log(" ")

       		if (   now - row1Last > timeThreshhold) {
       			//console.log("REAL PRESS!");

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
       			//console.log("row 2: "  );
       			//console.log(" ")

       			var now = Date.now();
       			if (   now - row2Last > timeThreshhold) {
       			//console.log("REAL PRESS!");
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
       			//console.log("row 3: "  );
       			//console.log(" ")

       			var now = Date.now();
       			if (   now - row3Last > timeThreshhold) {
       			//console.log("REAL PRESS!");
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
       			//console.log("row 4: "  );
       			//console.log(" ")

       			var now = Date.now();
       			if (   now - row4Last > timeThreshhold) {
       			//console.log("REAL PRESS!");
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
       		//console.log("col 1 : "+ String(now - pinGrid[0][0][2]) + ", "+ (now - pinGrid[1][0][2]) +" , "+(now - pinGrid[2][0][2]) +", "+(now - pinGrid[3][0][2]) );
       		//console.log(" ")
       		if (   now - col1Last > timeThreshhold) {
       			//console.log("REAL PRESS!");
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
       		//console.log("col 2 - "+now-col2Last);
       	//     	console.log("col 2: " + String(now - pinGrid[0][1][2])  +", "+ (now - pinGrid[1][1][2])  +", "+ (now - pinGrid[2][1][2])  + ", "+ (now - pinGrid[3][1][2]) );
       		//console.log(" ")

       		if (   now - col2Last > timeThreshhold) {
       			//console.log("REAL PRESS!");

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
       		//console.log("col 3: "+now-col3Last);

       		var now = Date.now();
       		if (   now - col3Last > timeThreshhold) {
       			//console.log("REAL PRESS!");
       	       	pinGrid[0][2][1] = true;
       	       	pinGrid[1][2][1] = true;
       	       	pinGrid[2][2][1] = true;
       	       	pinGrid[3][2][1] = true;
       	       	checkForPress();
       		}
       		col3Last = now;

       	}

});





/********************************************************
*********************  MENU SYSTEM FSM  *********************
********************************************************/

var recordings = [];
var recordingsPath = "/home/pi/brownphone/raspi/recordings";

// ------------------------------------------------------------------------
function loadRecordingsFeed() {
      fs.readdir(recordingsPath, function(err, items) {
          for (var i=0; i<recordings.length; i++) {
              recordings.push(items[i]);
          }
          console.log(recordings.length + " Recordings Loaded");
      });
}
// ------------------------------------------------------------------------


// to add new options, alter the menuSystem JSON object and make sure the sound files end up in the appropriate place
var adviceFiles = [];


// any non-accounted for assumptions automatically kick you back to init
var menuSystem = {
      "init": {
            "file": "menusystem/mainmenu.wav",
            "options": {
                  "1": "1_trees",
                  "2": "2_advice",
                  "3": "3_story",
                  "4": "4_fact",
                  "5": "5_lie",
                  "6": "6_hauntedhouse",
                  "7": "7_ewoks",
                  "8": "8_beachhouse",
                  "9": "9_about"
            }
      },
      "1_trees": {
            "file": "menusystem/1_trees_menu.wav",
            "options": {
                  "1": "1_1_tree_elm",
                  "2": "1_2_tree_juniper",
                  "3": "1_3_tree_weepingwillow",
                  "4": "1_4_tree_beech",
                  "5": "1_5_tree_waftingtrident",
                  "6": "1_6_tree_sugarmaple",
                  "7": "1_7_tree_birch",
                  "-2": "1_trees"
            }
      },
            "1_1_tree_elm": {
                  "file": "menusystem/1_1_tree_elm.wav",
                  "options":{
                        "parent": "1_trees"
                  }
            },
            "1_2_tree_juniper": {
                  "file": "menusystem/1_2_tree_juniper.wav",
                  "options":{
                        "parent": "1_trees"
                  }
            },
            "1_3_tree_weepingwillow": {
                  "file": "menusystem/1_3_tree_weepingwillow.wav",
                  "options":{
                        "parent": "1_trees"
                  }
            },
            "1_4_tree_beech": {
                  "file": "menusystem/1_4_tree_beech.wav",
                  "options":{
                        "parent": "1_trees",
                        "1": "1_4_1_beechnuts_deep",
                        "9": "1_trees"
                  }
            },
                  "1_4_1_beechnuts_deep": {
                        "file": "menusystem/1_4_1_beechnuts_deep.wav",
                        "options":{
                              "parent": "1_trees"
                        }
                  },

            "1_5_tree_waftingtrident": {
                  "file": "menusystem/1_5_tree_waftingtrident.wav",
                  "options":{
                        "parent": "1_trees"
                  }
            },
            "1_6_tree_sugarmaple": {
                  "file": "menusystem/1_6_tree_sugarmaple.wav",
                  "options":{
                        "parent": "1_trees"
                  }
            },
            "1_7_tree_birch": {
                  "file": "menusystem/1_7_tree_birch.wav",
                  "options":{
                        "parent": "1_trees",
                        "1": "1_7_1_birchwind",
                        "9": "1_trees"
                  }
            },
                   "1_7_1_birchwind": {
                        "file": "menusystem/1_7_1_birchwind.wav",
                        "options":{
                              "parent": "1_trees"
                        }
                  },
      "2_advice": {
            'file': adviceFiles,
            'options': {}
      },

      "3_story": {
      	"file": ["menusystem/3_story.wav","menusystem/3_story_2.wav","menusystem/3_story_3.wav"],
      	'options': {}
      },
      "4_fact": {
      	"file": ["menusystem/4_fact_1.wav","menusystem/4_fact_2.wav","menusystem/4_fact_3.wav","menusystem/4_fact_4.wav","menusystem/4_fact_5.wav","menusystem/4_fact_6.wav","menusystem/4_fact_7.wav","menusystem/4_fact_8.wav"],
      	'options': {}
      },
      "5_lie": {
      	"file": ["menusystem/5_lie_1.wav","menusystem/5_lie_2.wav","menusystem/5_lie_3.wav","menusystem/5_lie_4.wav","menusystem/5_lie_5.wav","menusystem/5_lie_6.wav"],
      	'options': {}
      },

      "6_hauntedhouse": {
            "file": ["menusystem/6_hauntedhouse.wav", "menusystem/6_hauntedhouse_b.wav"],
            "options": {}
      },
      "7_ewoks": {
            "file": "menusystem/7_ewoks.wav",
            "options": {}
      },
      "8_beachhouse": {
            "file": "menusystem/8_housesounds.wav",
            "options": {}
      },
      "9_about": {
            "file": "menusystem/9_about.wav",
            "options": {}
      },
      "test": {

      }
};
var currMenuItem;
var currSound = null;
var buttonTone = null;
var buttonToneFiles

// not working because it fires whether the sound completes naturally or i hit 'stop' on it...
///b le r r g g g
// currSound.on("complete", function(){
//       console.log("done playing!");
//       console.log(e);
//      //done playing!  go back to your parent, if that exists...
//       if ('parent' in menuSystem[currMenuItem]['options']) {
//             playMenuItem(menuSystem[currMenuItem]['options']['parent']);
//       } else {
//             // if nothing is specified, back to the top
//             playMenuItem("init");
//       }
// });

function playMenuItem(menuItem){
      if (currSound != null) {
            currSound.stop();
      } 
      var currSoundFile = menuSystem[menuItem]['file'];

      // for many random files
      if (typeof currSoundFile != 'string') {
            var len = currSoundFile.length;
            currSoundFile = menuSystem[menuItem]['file'][Math.floor(Math.random() * len)];
      }
      console.log("play menu item: "+currSoundFile);
      console.log("currSound: ");
      console.log(currSound);
      
      currSound = null;
      currSound = new Sound(currSoundFile);
      currMenuItem = menuItem;
      currSound.play();
}

eventEmitter.on("numPress", function(num){
       if(num in menuSystem[currMenuItem]['options']) {
      //  see if there's some special option for you
            console.log("tryin to play this index: "+menuSystem[currMenuItem]['options'][num])
            playMenuItem(menuSystem[currMenuItem]['options'][num]);
      } else if (num == "-1" || num == "-2") {
      // * always kicks you back up to the very top
            playMenuItem("init");
      }
      // implied fallthrough - nothign happens if you press a key not associated with anything
})

// when the phone is piced up 
// we want to load all the 
// recordings and play the init message
// ------------------------------------------------------------------------
eventEmitter.on("pickup", function(){
      //start playing menu from the top
      console.log("caught pickup");

      loadRecordingsFeed();

      //pickedup = true;
      //playMenuItem("init");
});

// ------------------------------------------------------------------------
eventEmitter.on("hangup", function(){
      // kill playing menu
      console.log("ccaught hangup");
      pickedup = false;
      if (currSound != null) {
            currSound.stop();
      }
});
