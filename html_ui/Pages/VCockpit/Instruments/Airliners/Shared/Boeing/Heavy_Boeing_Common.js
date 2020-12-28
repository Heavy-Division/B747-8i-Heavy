Boeing.ThrustModeDisplay.prototype.getText = (phase, mode) => {
	let text = '-';
	if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
		text = 'TO';
		if (mode === 1) {
			text += ' - 1';
		}
		if (mode === 2) {
			text += ' - 2';
		}
	} else if (phase <= FlightPhase.FLIGHT_PHASE_CLIMB) {
		text = 'CLB';
		if (mode === 1) {
			text += ' - 1';
		}
		if (mode === 2) {
			text += ' - 2';
		}
	} else if (phase <= FlightPhase.FLIGHT_PHASE_CRUISE) {
		text = 'CRZ';
	} else if (phase <= FlightPhase.FLIGHT_PHASE_DESCENT) {
		text = 'DES';
	}
	return text;
};