# Chapter 8 - Create a web dashboard

## Arduino

### Platformio
I begin to utilize platformio because I switched bench from Windows to Raspberry pi.

To install platformio

	$ pip install platformio

First, need to create standard folder structure that platformio command recognizes. The command is like "NPM".

	$ platformio init

Then, I can write Arduino program under 'src' folder. Platformio automatically find 'ino' file.
Before build arduino program, I needed to edit "platformio.ini" which is configuration how to build and upload program to specific board.

I have Arduino UNO compatible board. So, platformio.ini will be written like below.

	[env:uno]
	platform = atmelavr
	framework = arduino
	board = uno
	monitor_speed = 9600

### Add SimpleDHT library

To build chapter 8 arduino program, it needs "SimpleDHT" library which provides a class to handle Temp/Humidity sensor from Arduino.

For instalation the library, following step is required before build.

	$ platform lib install SimpleDHT

### Build

	$ platformio run

### Transfer sketch

	$ platformio run -t upload

### Serial monitor

	$ platformio serialports monitor



