B747_8_PFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	let irsLState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
	let irsCState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
	let irsRState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');

	if(irsLState > 2 || irsCState > 2 || irsRState > 2){
		let vspeed = document.querySelector("jet-pfd-vspeed-indicator");
		vspeed.style.visibility = 'visible';

		let compass = document.querySelector("jet-pfd-hs-indicator");

		let compassTexts = compass.getElementsByTagName('text');
		Array.from(compassTexts).forEach((element) => {
			element.style.visibility = 'visible';
		});
		compass.style.visibility = 'visible';

		let selectedHeadingGroup = document.getElementById("selectedHeadingGroup");
		selectedHeadingGroup.style.visibility = 'visible';

		let currentTrack = document.getElementById("CurrentTrack");
		currentTrack.style.visibility = 'visible';

		let radioAltitude = document.getElementById("RadioAltitude");
		radioAltitude.style.visibility = 'visible';

		let groundRibbonGroup = document.getElementById("GroundRibbonGroup");
		groundRibbonGroup.style.visibility = 'visible';

		let groundLineGroup = document.getElementById("GroundLineGroup");
		groundLineGroup.style.visibility = 'visible';

		let fakeBlackMask = document.getElementById("FakeBlackMask");
		fakeBlackMask.style.visibility = 'hidden';
	} else {

		let fakeBlackMask = document.getElementById("FakeBlackMask");
		fakeBlackMask.style.visibility = 'visible';

		let vspeed = document.querySelector("jet-pfd-vspeed-indicator");
		vspeed.style.visibility = 'hidden';

		let compass = document.querySelector("jet-pfd-hs-indicator");


		let irsLSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_SWITCH_STATE', 'Number');
		let irsCSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_SWITCH_STATE', 'Number');
		let irsRSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_SWITCH_STATE', 'Number');
		let isIrsPositionSet = SimVar.GetSimVarValue('L:HEAVY_B747_8_IS_IRS_POSITION_SET', 'Boolean');

		if((irsLSwitchState > 0 || irsCSwitchState > 0 || irsRSwitchState > 0) && isIrsPositionSet) {
			let compassTexts = compass.getElementsByTagName('text');
			Array.from(compassTexts).forEach((element) => {
				element.style.visibility = 'hidden';
			});
			compass.style.visibility = 'visible';
			document.getElementById("VertBox").style.visibility = 'hidden'
			document.getElementById("VertText").style.visibility = 'hidden'
		} else {
			document.getElementById("VertBox").style.visibility = 'visible'
			document.getElementById("VertText").style.visibility = 'visible'
			compass.style.visibility = 'hidden';
		}


		// OK - hides heading on compass
		let selectedHeadingGroup = document.getElementById("selectedHeadingGroup");
		selectedHeadingGroup.style.visibility = 'hidden';

		// OK - hides track on compass
		let currentTrack = document.getElementById("CurrentTrack");
		currentTrack.style.visibility = 'hidden';


		let masks = document.getElementById("RadioAltitude");
		masks.style.visibility = 'hidden';

		// OK
		let groundRibbonGroup = document.getElementById("GroundRibbonGroup");
		groundRibbonGroup.style.visibility = 'hidden';

		// OK
		let groundLineGroup = document.getElementById("GroundLineGroup");
		groundLineGroup.style.visibility = 'hidden';
	}
}