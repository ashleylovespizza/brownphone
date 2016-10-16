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
var hangupPin = 29;

var pickedup = false;


wpi.setup('wpi');
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




eventEmitter.on("hangup", function(){
      // kill playing menu
      console.log("ccaught hangup");
      pickedup = false;
      if (currSound != null) {
            currSound.stop();
      }
});
