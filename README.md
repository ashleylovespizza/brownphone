# brownphone

## Things To Know...

- All the good stuff is in raspi/touchtone.js

- to SSH into the raspberry pi, find its IP address. username is pi, password is raspberry
- To run things on the pi:
```
cd brownphone/raspi
sudo node touchtone.js
```

- All sound files that should be in raspi/menusystem/ can be found in https://www.dropbox.com/sh/wv4kleoj1qyzb0j/AADtO33RV00gw0wPpWjG8xw-a?dl=0
...and should be copied to the raspberry pi's install area - /brownphone/raspi/menusystem

- The node modules node-aplay and wiring-pi won't successfully install on your OS X setup - they're compiled for the Raspberry PI OS (which in our case is Rasbpian "Jessie" install).  This means a lot of the code you have to write directly on the Raspi. My best way of doing this was to have the raspi connected via ethernet to my router, then access it via a static IP (not sure if we can do this at IDEO due to firewall settings...), then ssh in.

- script for the touchtone menu is located in /info/script.txt. To alter structure, mess with the JSON packet in /raspi/touchtone.js

- cron stuff!  the script that starts the main file (touchtone.js) is in /brownphone/startPhone.sh. It's set to run in the cron:
@reboot /home/pi/brownphone/startPhone.sh
@reboot echo "it ran" > /home/pi/reboot.txt 2>&1
30 4 * * * /home/pi/brownphone/shutdown.sh


## TODO!

Things left to be done!
- On Raspi - a cron job using the node package `forever` to 
1. restart the Raspi nightly, and 
2. On restart, run
`amixer cset numid=1 0` -- set the system volume to be high enough
`cd /brownphone/raspi` -- change dirs to where our code is
`sudo forever start touchtone.js`  -- run that app FOREVER

- On Raspi - use the Raspberry Pi's Watchdog Timer to auto reboot upon hanging

- power supply is arriving at IDEO on Thursday, but any microusb supply should work


// ------------------------------------------------------------------------

add the check-feed.sh to the contab
crontab -e
* * * * * /home/pi/brownphone/check-feed.sh

save the file and reboot the contab
sudo service cron reload
sudo service cron start







