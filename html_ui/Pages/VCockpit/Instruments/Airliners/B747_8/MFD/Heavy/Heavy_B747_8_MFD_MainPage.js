B747_8_MFD_MainPage.prototype.getAbsoluteAltitudeDeltaForAltitudeArc = function () {
	return Math.abs(Simplane.getAutoPilotDisplayedAltitudeLockValue() - Simplane.getAltitude());
};

B747_8_MFD_MainPage.prototype.calculateDistanceForDescending = function (toFixed = -1) {
	let absoluteAltitudeDelta = this.getAbsoluteAltitudeDeltaForAltitudeArc();
	let verticalSpeed = Simplane.getVerticalSpeed();
	let absoluteVerticalSpeed = Math.abs(verticalSpeed);
	let indicatedSpeed = Simplane.getIndicatedSpeed();
	let nauticalMilesPerMinute = indicatedSpeed / 60;

	let distance = (absoluteAltitudeDelta / absoluteVerticalSpeed) * nauticalMilesPerMinute;
	return (toFixed < 0 ? distance : distance.toFixed(toFixed));
};

B747_8_MFD_MainPage.prototype.shouldBeAltitudeArcVisible = function () {
	return (Simplane.getAutoPilotActive()) &&
		(this.mapMode === Jet_NDCompass_Display.ARC) &&
		(this.getAbsoluteAltitudeDeltaForAltitudeArc() >= 150) &&
		(Simplane.getAltitudeAboveGround() >= 400);
};

B747_8_MFD_MainPage.prototype.calculateAltitudeArcPosition = function (distance = NaN) {
	let altitudeArcOffsets = [
		// [TOP, Triangle offset, Triangle]
		[110, 510, 525], // uncentered map
		[110, 330, 360]  // centered map
	];

	let isMapCentered = this.mapIsCentered | 0;

	if (!isFinite(distance)) {
		return altitudeArcOffsets[isMapCentered][2] - ((altitudeArcOffsets[isMapCentered][2] - altitudeArcOffsets[isMapCentered][0]) / this.map.zoomRanges[this.mapRange]) * this.calculateDistanceForDescending();
	}
	return altitudeArcOffsets[isMapCentered][2] - ((altitudeArcOffsets[isMapCentered][2] - altitudeArcOffsets[isMapCentered][0]) / this.map.zoomRanges[this.mapRange]) * distance;
};

B747_8_MFD_MainPage.prototype.updateAltitudeArc = function (_deltatime) {
	let altitudeArcPath = document.getElementById('altitudeArcPath');
	if (this.shouldBeAltitudeArcVisible()) {
		altitudeArcPath.setAttribute('transform', `translate(0, ${this.calculateAltitudeArcPosition()})`);
		altitudeArcPath.style.visibility = 'visible';
	} else {
		altitudeArcPath.style.visibility = 'hidden';
	}
};

B747_8_MFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	this.updateMap(_deltatime);
	this.updateNDInfo(_deltatime);
	this.updateAltitudeArc(_deltatime);
};