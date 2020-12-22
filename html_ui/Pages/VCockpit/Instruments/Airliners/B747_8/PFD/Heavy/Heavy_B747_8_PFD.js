B747_8_PFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	let vspeed = document.querySelector("jet-pfd-vspeed-indicator");
	vspeed.style.visibility = 'hidden';

	let compass = document.querySelector("jet-pfd-hs-indicator");
	compass.style.visibility = 'hidden';

	//let horizon = document.querySelector("jet-pfd-attitude-indicator");
	//horizon.style.visibility = 'hidden';
	let horizon = document.getElementById("Pitch");
	horizon.style.visibility = 'hidden';
	let background = document.getElementById("Background");
	background.style.visibility = 'hidden';

	let masks = document.getElementById("RadioAltitude");
	masks.style.visibility = 'hidden';
	let attitude = document.getElementById("Attitude");
	//attitude.style.visibility = 'hidden';

	// Bank
	let bank = attitude.querySelectorAll('line');
	Array.from(bank).forEach((element) => {
		element.style.visibility = 'hidden';
	});


	let paths = attitude.querySelectorAll('path');
	Array.from(paths).forEach((element) => {
		if(element.style.fill === 'white' || element.style.fill === 'transparent'){
			element.style.visibility = 'hidden';
		}
	});

	let fma = document.querySelector("boeing-fma");
	fma.style.visibility = 'hidden';


	let groundRibbonGroup = document.getElementById("GroundRibbonGroup");
	groundRibbonGroup.style.visibility = 'hidden';

	let groundLineGroup = document.getElementById("GroundLineGroup");
	groundLineGroup.style.visibility = 'hidden';
}