'use strict';

$(document).ready(function($) {
    

    // ------------------------------------------------------------------------
    var $menu = $('.user-dropdown-menu');
    $(".user-image").click(function(event) {
        event.preventDefault();
        $menu.toggleClass('open');
    });


    // ------------------------------------------------------------------------
    function __log(e, data) {
        console.log(e + " " + (data || ''));
    }

    var audio_context;
    var recorder;
    var recording = false;
    var $form = $('form');
    var currAudioBlob = null;
    var $form = $("form");
    var $submitButton = $("#submit");
    var token = $('meta[name="csrf_token"]').attr('content');
    console.log('csrf_token: '+token);
    $submitButton.hide();

    $('#file-upload').change(function(event) {
        $submitButton.show();
    });
    $('.delete-recording').click(function(event) {
        event.preventDefault();
        var id = $(this).data('id');
        var data = {_method: 'DELETE', '_token': token, 'csrf_token': token};
        var $el = $('.recording-'+id);
        $.ajax({
            url: '/recordings/'+id,
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(e) {
            if(e.status > 200) {
                $el.fadeTo(200, 0, function() {
                 $(this).remove();   
                });
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        
    });
    $form.submit(function( event ) {
        event.preventDefault();
        console.log("Post Recording");
        if(!currAudioBlob && $('#file-upload').val() == "") {
            console.log("Missing recording");
            return;            
        }
        var data = new FormData($('form')[0]);
        if(currAudioBlob) {
            var blob = new Blob([currAudioBlob], {type: "audio/wav"});
            data.append('audio_name', moment().format('x')+"_audio.wav");
            data.append('audio_file', blob);
        }
        data.append('_token', token);
        data.append('csrf_token', token);
        
        $.ajax({
            url: '/submit',
            type: 'POST',
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false
        })
        .done(function(e) {
            console.log("success", e);
            if(e.status > 200) {
                document.location = '/';
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    // ------------------------------------------------------------------------
    function startUserMedia(stream) {
        var input = audio_context.createMediaStreamSource(stream);
         __log('Media stream created.');

        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');
    
        recorder = new Recorder(input);
        __log('Recorder initialised.');
    }

    // ------------------------------------------------------------------------
    try {
        
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;
      
        audio_context = new AudioContext;

        __log('Audio context set up.');
        __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        console.log("e: ", e)
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log('No live audio input: ', e);
    });

    // ------------------------------------------------------------------------
    var isRecording = false;
    var $recordButton = $('#recording');
    $recordButton.click(function(event) {
        event.preventDefault();
        console.log(currAudioBlob);
        // start recording
        if(!isRecording) {
            isRecording = true;
            recorder && recorder.record();
            __log('Recording...');
            $(this).html("Stop Recording");
        }

        // stop recording
        else {
            isRecording = false;   
            $(this).html(currAudioBlob ? "Re-Record" : "Start Recording");
            
            // stop
            recorder && recorder.stop();
            __log('Stopped recording.');
            if(currAudioBlob) {
                $submitButton.show();
            }
            submitOrRerecord();
        }
    });

    // ------------------------------------------------------------------------
    function submitOrRerecord() {

        recorder && recorder.exportWAV(function(blob) {

            currAudioBlob = blob;
            console.log("audio blob!");

            var sound_url = URL.createObjectURL(currAudioBlob);
            var audio_elt = document.createElement('audio');
            audio_elt.controls = true;
            audio_elt.src = sound_url;
            audio_elt.setAttribute('data-question', $(".record").attr('data-question'));


            $('#recording-col').html( $(audio_elt) );
            $recordButton.html(currAudioBlob ? "Re-Record" : "Start Recording");
            if(currAudioBlob) {
                $submitButton.show();
            }
            recorder.clear();
        });
  }

});

/*








  function __log(e, data) {
    console.log(e + " " + (data || ''));
  }

  var audio_context;
  var recorder;
  var recording=false;

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.');

    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    __log('Recorder initialised.');
  }

function toggleRecord(ev){
    var btn = $(ev.target);
    var spanverbiage = $(ev.target).parent().children('span').first();
         if(btn.hasClass('notRec')){

                 btn.removeClass("notRec");
                 btn.addClass("Rec");
                 // start recording now!
                 spanverbiage.html("Stop");
                 recording = true;
                 recorder && recorder.record();

                 __log('Recording...');
             } else {
                 btn.removeClass("Rec");
                 btn.addClass("notRec");

                 spanverbiage.html("Re-Record");

                  // stop
                 recording = false;
                 recorder && recorder.stop();

                 __log('Stopped recording.');
                 // create WAV download link using audio data blob
                 submitOrRerecord();

             }

     }
     */

/*
var Screensaver = require('./screensaver.js');

$(function() {
    /// dis nasty but trying to move fast here
    var currAudioBlob;

   //intro slide - only show 'let's go' when we're dang ready
   var nameField = false
   var emailField = false;
   function testFields(keycode) { if (nameField && emailField) { 
    $(".info button.hidden").removeClass("hidden");
    if(keycode == 13) {
        $.deck('next');
    }
    }}
   $("#name-input").keyup(function(){
    nameField = true;
    testFields(e.keyCode);
   });
   $("#email-input").keyup(function(e){
    emailField = true;
    testFields(e.keyCode);
   });
   $(document).keyup(function(e) {
     if(e.keyCode == 27) {
        $("#terms").addClass("hidden");
     }
   })


  

    
    $(document).bind('deck.change', function(event, from, to) {
	   console.log('Moving from slide ' + from + ' to ' + to);

        // submit full data packets on the 'thanks' slide
        if( $(".deck-next").hasClass('thanks')) {
            // attempt to submit data
            var question_attr = $(".thanks.deck-next").attr("data-question");

            var audio_blob = currAudioBlob;//$("audio[data-question='"+question_attr+"'").attr('src');



            var dataPacket = new FormData();

            dataPacket.append('question', $(".question[data-question='"+question_attr+"'] p.question-str").html());
            dataPacket.append('question_id', question_attr.substring(8,9));

            var response = $("#"+question_attr).val();
            if (response == undefined) { response = '50'; }
            dataPacket.append('response', response);


            var question_care = $("#"+question_attr+"_care").val();
            if (question_care == undefined) { question_care = '50'; }            
            dataPacket.append('strength', question_care);


            dataPacket.append('csrf_token', $('meta[name="csrf_token"]').attr('content'));
            var name = ($("#name-input").val().length == 0) ? "No name given" : $("#name-input").val();
            dataPacket.append('name', name);
            var email = ($("#email-input").val().length == 0) ? "No@email.address" : $("#email-input").val();
            dataPacket.append('email', email);
            console.log(audio_blob);
            dataPacket.append('audio_name', moment().format('x')+"_audio.wav");
            dataPacket.append('audio_file', audio_blob);

            // var dataPacket = {
            //     'timestamp': moment().format('MM/DD/YYYY HH:mm:ss a'),
            //     'question': $(".question[data-question='"+question_attr+"'] p.question-str").html(),
            //     'question_id': question_attr.substring(8,9),
            //     'response': $("#"+question_attr).val(),
            //     'strength': $("#"+question_attr+"_care").val(),
            //     'audio_file': audio_blob,
            //     'name': $("#name-input").val(),
            //     'email': $("#email-input").val()
            // };

            console.log(dataPacket);


            $.ajax({
                url: '/submit',
                type: 'POST',
                dataType: 'json',
                data: dataPacket,
                processData: false,
                contentType: false
               
            })
            .done(function(data, status, xhr) {
                console.log("SUCCESS");
                console.log("data", data);
                console.log("status", status);
                console.log("xhr", xhr);
                console.log("-----------");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function(xhr, status) {
                console.log("COMPLETE");
                console.log("status", status);
                console.log("xhr", xhr);
                console.log("-----------");
            });


    
        }


        if( $(".deck-next").hasClass('autoplay')) {
            setTimeout(function(){
                if ( $(".deck-current").hasClass('autoplay') ){
                    $.deck('next'); 
                }
            }, 1200);
        }

        if( $(".deck-next").hasClass('done')) {
            setTimeout(function(){
                if ( $(".deck-current").hasClass('done') ){
                    
                    window.location.href = "/";
                }
            }, 5200);
        }

	});



    //todo - turn off arrow listeners on slideshow
    //todo - hammerjs that ish


    /////////////
    // record stuff
    /////////

    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext;

      __log('Audio context set up.');
      __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        console.log("e: ", e)
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ', e);
    });






  function __log(e, data) {
    console.log(e + " " + (data || ''));
  }

  var audio_context;
  var recorder;
  var recording=false;

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.');

    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    __log('Recorder initialised.');
  }

function toggleRecord(ev){
    var btn = $(ev.target);
    var spanverbiage = $(ev.target).parent().children('span').first();
         if(btn.hasClass('notRec')){

                 btn.removeClass("notRec");
                 btn.addClass("Rec");
                 // start recording now!
                 spanverbiage.html("Stop");
                 recording = true;
                 recorder && recorder.record();

                 __log('Recording...');
             } else {
                 btn.removeClass("Rec");
                 btn.addClass("notRec");

                 spanverbiage.html("Re-Record");

                  // stop
                 recording = false;
                 recorder && recorder.stop();

                 __log('Stopped recording.');
                 // create WAV download link using audio data blob
                 submitOrRerecord();

             }

     }

  //  var recordButton = $('.recorder-button button');
   //   // record button clickers
     // recordButton.each(function(){
     //     var $this = $(this);
     //     var $spanVerbiage = $(this).parent().find('span').first();
     //     var mc = new Hammer(this);
     //     mc.on("tap", function() {
     //         if($this.hasClass('notRec')){

     //             $this.removeClass("notRec");
     //             $this.addClass("Rec");
     //             // start recording now!
     //             $spanVerbiage.html("Stop");
     //             recording = true;
     //             recorder && recorder.record();

     //             __log('Recording...');
     //         } else {
     //             $this.removeClass("Rec");
     //             $this.addClass("notRec");

     //             $spanVerbiage.html("Re-Record");

     //              // stop
     //             recording = false;
     //             recorder && recorder.stop();

     //             __log('Stopped recording.');
     //             // create WAV download link using audio data blob
     //             submitOrRerecord();

     //         }
     //     });
     // });



  function submitOrRerecord() {
    console.log("hey man!");
    console.log(recorder);

    recorder && recorder.exportWAV(function(blob) {
      currAudioBlob = blob;
      console.log("audio blob!");

      var thisQuestion = $(".record.deck-current").attr('data-question');

      var sound_url = URL.createObjectURL(currAudioBlob);
      var audio_elt = document.createElement('audio');
      audio_elt.controls = true;
      audio_elt.src = sound_url;
      audio_elt.setAttribute('data-question', $(".record").attr('data-question'));

      console.log(thisQuestion);
      var currQuestionsPlayer = $(".record[data-question='"+thisQuestion+"'] .playMostRecent");
      currQuestionsPlayer.html("");
      currQuestionsPlayer.append( $(audio_elt) );
     // currQuestionsPlayer.append($(audio_link));

      currQuestionsPlayer.find("audio").attr("data-question", thisQuestion);


      $(".deck-current.record button.next").removeClass("hidden");

        recorder.clear();

    });
  }




});*/