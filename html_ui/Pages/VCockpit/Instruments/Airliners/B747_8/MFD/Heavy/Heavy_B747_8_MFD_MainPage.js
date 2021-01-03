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

B747_8_MFD_MainPage.prototype.extendMFDHtmlElementsWithIrsState = () => {
	[document.getElementById('headingGroup'),
		document.getElementById('CourseInfo'),
		document.getElementById('selectedHeadingGroup'),
		document.getElementById('selectedTrackGroup'),
		document.getElementById('ILSGroup'),
		document.getElementById('currentRefGroup'),
		document.getElementById('RangeGroup')
	].forEach((element) => {
		if (element) {
			element.setAttribute('irs-state', 'off');
		}
	});

	let compassCircleGroup = document.getElementById('circleGroup');
	if(compassCircleGroup){
		compassCircleGroup.querySelectorAll('text').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'off');
			}
		});
	}
};

B747_8_MFD_MainPage.prototype.updateMapIfIrsNotAligned = function () {
	this.extendMFDHtmlElementsWithIrsState();
	this.heavyIRSSimulator.update();

	if (this.heavyIRSSimulator.irsLState > 2 || this.heavyIRSSimulator.irsCState > 2 || this.heavyIRSSimulator.irsRState > 2) {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'aligned');
			}
		});
		return;
	} else if (this.heavyIRSSimulator.irsLState > 1 || this.heavyIRSSimulator.irsCState > 1 || this.heavyIRSSimulator.irsRState > 1) {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'aligning');
			}
		});

		let aligns = [document.getElementById('l-align'), document.getElementById('c-align'), document.getElementById('r-align')];

		aligns.forEach((element) => {
			element.style.visibility = 'hidden';
			element.textContent = '';
		});

		let times = [];
		let position = 0;
		let now = Math.floor(Date.now() / 1000);
		if (this.heavyIRSSimulator.irsLState === 2) {
			aligns[position].textContent = 'L ' + Math.floor(((this.heavyIRSSimulator.initLAlignTime + this.heavyIRSSimulator.irsLTimeForAligning) - now) / 60) + '+ MIN';
			aligns[position].style.visibility = 'visible';
			position++;
		}

		if (this.heavyIRSSimulator.irsCState === 2) {
			aligns[position].textContent = 'C ' + Math.floor(((this.heavyIRSSimulator.initCAlignTime + this.heavyIRSSimulator.irsCTimeForAligning) - now) / 60) + '+ MIN';
			aligns[position].style.visibility = 'visible';
			position++;
		}

		if (this.heavyIRSSimulator.irsRState === 2) {
			aligns[position].textContent = 'R ' + Math.floor(((this.heavyIRSSimulator.initRAlignTime + this.heavyIRSSimulator.irsRTimeForAligning) - now) / 60) + '+ MIN';
			aligns[position].style.visibility = 'visible';
			position++;
		}

	} else if (this.heavyIRSSimulator.irsLState > 0 || this.heavyIRSSimulator.irsCState > 0 || this.heavyIRSSimulator.irsRState > 0) {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'inited');
			}
		});
	} else {
		document.querySelectorAll('[irs-state]').forEach((element) => {
			if (element) {
				element.setAttribute('irs-state', 'off');
			}
		});
	}
};

B747_8_MFD_MainPage.prototype.onUpdate = function (_deltatime) {
	NavSystemPage.prototype.onUpdate.call(this, _deltatime);
	this.updateMap(_deltatime);
	this.updateNDInfo(_deltatime);
	this.updateAltitudeArc(_deltatime);
	this.updateMapIfIrsNotAligned();
};

B747_8_MFD_MainPage.prototype.updateNDInfo = function (_deltatime) {
	this.info.showSymbol(B747_8_ND_Symbol.WXR, this.wxRadarOn);
	this.info.showSymbol(B747_8_ND_Symbol.WXRINFO, this.wxRadarOn);
	this.info.showSymbol(B747_8_ND_Symbol.TERR, this.terrainOn);
	this.info.showSymbol(B747_8_ND_Symbol.STA, this.map.instrument.showVORs);
	this.info.showSymbol(B747_8_ND_Symbol.WPT, this.map.instrument.showIntersections);
	this.info.showSymbol(B747_8_ND_Symbol.ARPT, this.map.instrument.showAirports);
};