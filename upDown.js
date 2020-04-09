// include onoff to interact with GPIO
var Gpio = require('onoff').Gpio;

// declare all of the GPIO pins
var LED04 = new Gpio(4, 'out'),
	LED17 = new Gpio(17, 'out'),
	LED27 = new Gpio(27, 'out'),
	LED22 = new Gpio(22, 'out'),
	LED18 = new Gpio(18, 'out'),
	LED23 = new Gpio(23, 'out')
	LED24 = new Gpio(24, 'out'),
	LED25 = new Gpio(25, 'out');

// put all LED vars into an array
var leds = [LED04, LED17, LED27, LED22, LED18, LED23, LED24, LED25];

// declare the buttons
var upButton = new Gpio(20, 'in', 'rising', {debounceTimeout: 50});
var downButton = new Gpio(21, 'in', 'rising', {debounceTimeout: 10});

// current index
var currentIndex = 0;

function startGame() {	
	// start off with the first LED on
	LED04.writeSync(1);
	
	// Watch for hardware interrupts on downButton GPIO
	downButton.watch(function(err, value) {
		if (err) { //if an error
			console.error('There was an error', err); //output error message to console
			return;
		}
	
		currentIndex++;

		if (currentIndex > leds.length - 1) {
			currentIndex = 0;
			leds[leds.length - 1].writeSync(0);
			leds[currentIndex].writeSync(1);
		} else {
			leds[currentIndex].writeSync(1);
			leds[currentIndex - 1].writeSync(0);
		}
		
	});
	
	// Watch for hardware interrupts on upButton GPIO
	upButton.watch(function(err, value) {
		if (err) { //if an error
			console.error('There was an error', err); //output error message to console
			return;
		}
	
		currentIndex--;

		if (currentIndex < 0) {
			currentIndex = leds.length - 1;
			leds[0].writeSync(0);
			leds[currentIndex].writeSync(1);
		} else {
			leds[currentIndex].writeSync(1);
			leds[currentIndex + 1].writeSync(0);
		}
		
	});
}



// function to run when exiting program
function unexportOnClose() { 
	leds[currentIndex].writeSync(0);
	leds[currentIndex].unexport();
	upButton.unexport(); 
	downButton.unexport();
};

startGame();
process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c