#!/bin/bash
echo "let's start the Story Phone"
#amixer cset numid=1 200
amixer -c 0 cset numid=8,iface=MIXER,name='Mic Capture Volume' 7
cd /home/pi/storyphone/raspi
sudo forever start runStoryPhone.js
