B747_8_PFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	this.extendHtmlElementsWithIrsState();
	let irsLState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.L.STATE, 'Number');
	let irsCState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.C.STATE, 'Number');
	let irsRState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.R.STATE, 'Number');
	let isIrsPositionSet = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.POSITION_SET, 'Boolean');

	if ((irsLState > 2 || irsCState > 2 || irsRState > 2) && isIrsPositionSet) {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'aligned');
			}
		});
	} else {
		let irsLSwitchState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.L.SWITCH_STATE, 'Number');
		let irsCSwitchState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.C.SWITCH_STATE, 'Number');
		let irsRSwitchState = SimVar.GetSimVarValue(B748H_LocalVariables.IRS.R.SWITCH_STATE, 'Number');
		if (irsLSwitchState > 0 || irsCSwitchState > 0 || irsRSwitchState > 0) {
			document.querySelectorAll('[irs-state]').forEach((element) => {
				if (element) {
					element.setAttribute('irs-state', 'aligning');
				}
			});
		} else {
			document.querySelectorAll('[irs-state]').forEach((element) => {
				if (element) {
					element.setAttribute('irs-state', 'inited');
				}
			});
		}
	}
};

B747_8_PFD_MainPage.prototype.extendHtmlElementsWithIrsState = function () {
	let compass = document.querySelector('jet-pfd-hs-indicator');
	let compassTexts = compass.getElementsByTagName('text');
	Array.from(compassTexts).forEach((element) => {
		if (element) {
			element.setAttribute('irs-state', 'off');
		}
	});

	let groundRibbonGroup = document.getElementById('GroundRibbonGroup');
	groundRibbonGroup.setAttribute('irs-state', 'off');


	let groundLineGroup = document.getElementById('GroundLineGroup');
	groundLineGroup.setAttribute('irs-state', 'off');

	let selectedHeadingGroup = document.getElementById('selectedHeadingGroup');
	selectedHeadingGroup.setAttribute('irs-state', 'off');

	let currentTrack = document.getElementById('CurrentTrack');
	currentTrack.setAttribute('irs-state', 'off');
};

B747_8_PFD_VSpeed.prototype.onUpdate = function (_deltaTime) {
	var vSpeed = Math.round(Simplane.getVerticalSpeed());
	this.vsi.setAttribute('vspeed', vSpeed.toString());
	if (Simplane.getAutoPilotVerticalSpeedHoldActive()) {
		var selVSpeed = Math.round(Simplane.getAutoPilotVerticalSpeedHoldValue());
		this.vsi.setAttribute('selected_vspeed', selVSpeed.toString());
		if(SimVar.GetSimVarValue(B748H_LocalVariables.VNAV.CUSTOM_VNAV_CLIMB_ENABLED, 'Number') === 1){
			this.vsi.setAttribute('selected_vspeed_active', 'false');
		} else {
			this.vsi.setAttribute('selected_vspeed_active', 'true');
		}
	} else {
		this.vsi.setAttribute('selected_vspeed_active', 'false');
	}
};