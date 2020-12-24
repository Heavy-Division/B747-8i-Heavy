B747_8_MFD_MainPage.prototype.altitudeArcOffsets = [
	// [TOP, Triangle offset, Triangle]
	[110, 510, 525], // uncentered map
	[110, 330, 360]  // centered map
];

B747_8_MFD_MainPage.prototype.heavyIRSSimulator = new HeavyIRSSimulator();

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
	let isMapCentered = this.mapIsCentered | 0;

	if (!isFinite(distance)) {
		return this.altitudeArcOffsets[isMapCentered][2] - ((this.altitudeArcOffsets[isMapCentered][2] - this.altitudeArcOffsets[isMapCentered][0]) / this.map.zoomRanges[this.mapRange]) * this.calculateDistanceForDescending();
	}
	return this.altitudeArcOffsets[isMapCentered][2] - ((this.altitudeArcOffsets[isMapCentered][2] - this.altitudeArcOffsets[isMapCentered][0]) / this.map.zoomRanges[this.mapRange]) * distance;
};

B747_8_MFD_MainPage.prototype.updateAltitudeArc = function (_deltatime) {
	let altitudeArcPath = document.getElementById('altitudeArcPath');
	let altitudeArcPosition = this.calculateAltitudeArcPosition();
	let isMapCentered = this.mapIsCentered | 0;
	if (this.shouldBeAltitudeArcVisible() && altitudeArcPosition < this.altitudeArcOffsets[isMapCentered][2] && altitudeArcPosition > this.altitudeArcOffsets[isMapCentered][0]) {
		altitudeArcPath.setAttribute('transform', `translate(0, ${altitudeArcPosition})`);
		altitudeArcPath.style.visibility = 'visible';
	} else {
		altitudeArcPath.style.visibility = 'hidden';
	}
};

B747_8_MFD_MainPage.prototype.updateMapIfIrsNotAligned = function () {
	this.heavyIRSSimulator.update();

	if(this.heavyIRSSimulator.irsLState > 2 || this.heavyIRSSimulator.irsCState > 2 || this.heavyIRSSimulator.irsRState > 2){
		document.getElementById('align-times').style.visibility = 'hidden';
		document.getElementById('FakeMapBox').style.visibility = 'hidden';
		document.getElementById('FakeCompassBoxHdg').style.visibility = 'hidden';
		document.getElementById('FakeCompassBox').style.visibility = 'hidden';

		document.getElementById('Map').style.visibility = 'visible';
		document.getElementById('headingGroup').style.visibility = 'visible';
		document.getElementById('CourseInfo').style.visibility = 'visible';
		document.getElementById('selectedHeadingGroup').style.visibility = 'visible';
		document.getElementById('selectedTrackGroup').style.visibility = 'visible';
		document.getElementById('ILSGroup').style.visibility = 'visible';
		document.getElementById('currentRefGroup').style.visibility = 'visible';
		document.getElementById('RangeGroup').style.visibility = 'visible';

		document.getElementById('NDInfo').style.visibility = 'visible';

		let compassCircleGroup = document.getElementById('circleGroup');
		compassCircleGroup.querySelectorAll('text').forEach((element) => {
			element.style.visibility = 'visible';
		});
		return;
	}

	document.getElementById('align-times').style.visibility = 'visible';

	if(this.heavyIRSSimulator.irsLState > 0 || this.heavyIRSSimulator.irsCState > 0 || this.heavyIRSSimulator.irsRState > 0){
		document.getElementById('FakeCompassBoxHdg').style.visibility = 'hidden';
		document.getElementById('FakeCompassBox').style.visibility = 'visible';
	} else {
		document.getElementById('FakeCompassBoxHdg').style.visibility = 'visible';
		document.getElementById('FakeCompassBox').style.visibility = 'hidden';
	}

	document.getElementById('Map').style.visibility = 'hidden';

	document.getElementById('headingGroup').style.visibility = 'hidden';
	document.getElementById('CourseInfo').style.visibility = 'hidden';
	document.getElementById('selectedHeadingGroup').style.visibility = 'hidden';
	document.getElementById('selectedTrackGroup').style.visibility = 'hidden';
	document.getElementById('ILSGroup').style.visibility = 'hidden';
	document.getElementById('currentRefGroup').style.visibility = 'hidden';
	document.getElementById('RangeGroup').style.visibility = 'hidden';

	document.getElementById('NDInfo').style.visibility = 'hidden';

	let aligns = [document.getElementById('l-align'), document.getElementById('c-align'), document.getElementById('r-align')]


	if(this.heavyIRSSimulator.irsLState === 2 || this.heavyIRSSimulator.irsCState === 2 || this.heavyIRSSimulator.irsRState === 2){
		document.getElementById('time-to-align').style.visibility = 'visible';
	} else {
		document.getElementById('time-to-align').style.visibility = 'hidden';
	}

	aligns.forEach((element) =>{
		element.style.visibility = 'hidden';
		element.textContent = '';
	});

	let times = [];
	let position = 0;
	let now = Math.floor(Date.now() / 1000);
	if (this.heavyIRSSimulator.irsLState === 2){
		aligns[position].textContent = 'L ' +  Math.floor(((this.heavyIRSSimulator.initLAlignTime + this.heavyIRSSimulator.irsLTimeForAligning) - now) / 60) + '+ MIN';
		aligns[position].style.visibility = 'visible';
		position++
	}

	if (this.heavyIRSSimulator.irsCState === 2){
		aligns[position].textContent = 'C ' +  Math.floor(((this.heavyIRSSimulator.initCAlignTime + this.heavyIRSSimulator.irsCTimeForAligning) - now) / 60) + '+ MIN';
		aligns[position].style.visibility = 'visible';
		position++
	}

	if (this.heavyIRSSimulator.irsRState === 2){
		aligns[position].textContent = 'R ' +  Math.floor(((this.heavyIRSSimulator.initRAlignTime + this.heavyIRSSimulator.irsRTimeForAligning) - now) / 60) + '+ MIN';
		aligns[position].style.visibility = 'visible';
		position++
	}

	// Hides all texts from compass circle
	let compassCircleGroup = document.getElementById('circleGroup');
	compassCircleGroup.querySelectorAll('text').forEach((element) => {
		element.style.visibility = 'hidden';
	});
};

B747_8_MFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	this.updateMap(_deltatime);
	this.updateNDInfo(_deltatime);
	this.updateAltitudeArc(_deltatime);
	this.updateMapIfIrsNotAligned();
};