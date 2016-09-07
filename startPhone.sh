#!/bin/bash
echo "let's start the Matt Brown Phone"
amixer cset numid=1 200
cd /home/pi/brownphone/raspi
sudo forever start touchtone.js
