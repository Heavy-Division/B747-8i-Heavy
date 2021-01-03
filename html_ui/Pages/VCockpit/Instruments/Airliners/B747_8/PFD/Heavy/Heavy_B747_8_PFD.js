B747_8_PFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	this.extendHtmlElementsWithIrsState();
	let irsLState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
	let irsCState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
	let irsRState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');
	let isIrsPositionSet = SimVar.GetSimVarValue('L:HEAVY_B747_8_IS_IRS_POSITION_SET', 'Boolean');

	if ((irsLState > 2 || irsCState > 2 || irsRState > 2)  && isIrsPositionSet) {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'aligned');
			}
		});
	} else {
		let irsLSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_SWITCH_STATE', 'Number');
		let irsCSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_SWITCH_STATE', 'Number');
		let irsRSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_SWITCH_STATE', 'Number');
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