class B747_8_PFD extends BaseAirliners {
	constructor() {
		super();
		this.initDuration = 7000;
	}

	get templateID() {
		return 'B747_8_PFD';
	}

	get IsGlassCockpit() {
		return true;
	}

	connectedCallback() {
		super.connectedCallback();
		this.pageGroups = [
			new NavSystemPageGroup('Main', this, [
				new B747_8_PFD_MainPage()
			])
		];
		this.maxUpdateBudget = 12;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	onUpdate(_deltaTime) {
		super.onUpdate(_deltaTime);
	}
}

class B747_8_PFD_MainElement extends NavSystemElement {
	init(root) {
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
	}

	onExit() {
	}

	onEvent(_event) {
	}
}

class B747_8_PFD_MainPage extends NavSystemPage {
	constructor() {
		super('Main', 'Mainframe', new B747_8_PFD_MainElement());
		this.element = new NavSystemElementGroup([
			new B747_8_PFD_Attitude(),
			new B747_8_PFD_VSpeed(),
			new B747_8_PFD_Airspeed(),
			new B747_8_PFD_Altimeter(),
			new B747_8_PFD_Compass(),
			new B747_8_PFD_ILS(),
			new B747_8_PFD_FMA()
		]);
	}

	init() {
		super.init();
	}

	onEvent(_event) {
		super.onEvent(_event);
	}

	onUpdate(_deltatime) {
		super.onUpdate(_deltatime);
		this.extendHtmlElementsWithIrsState();
		let irsInfo = new B748H_IRSInfo();
		let irsLState = irsInfo.getLState();
		let irsCState = irsInfo.getCState();
		let irsRState = irsInfo.getRState();
		let isIrsPositionSet = irsInfo.isPositionSet();
		console.log(isIrsPositionSet)

		if ((irsLState > 2 || irsCState > 2 || irsRState > 2) && isIrsPositionSet) {
			document.querySelectorAll('[irs-state]').forEach((element) => {
				if (element) {
					element.setAttribute('irs-state', 'aligned');
				}
			});
		} else {
			let irsLSwitchState = irsInfo.getLSwitchState();
			let irsCSwitchState = irsInfo.getCSwitchState();
			let irsRSwitchState = irsInfo.getRSwitchState();
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
	}

	extendHtmlElementsWithIrsState() {
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
	}
}

class B747_8_PFD_VSpeed extends NavSystemElement {
	init(root) {
		this.vsi = this.gps.getChildById('VSpeed');
		this.vsi.aircraft = Aircraft.B747_8;
		this.vsi.gps = this.gps;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		var vSpeed = Math.round(Simplane.getVerticalSpeed());
		this.vsi.setAttribute('vspeed', vSpeed.toString());
		if (Simplane.getAutoPilotVerticalSpeedHoldActive()) {
			var selVSpeed = Math.round(Simplane.getAutoPilotVerticalSpeedHoldValue());
			this.vsi.setAttribute('selected_vspeed', selVSpeed.toString());
			if (SimVar.GetSimVarValue(B748H_LocalVariables.VNAV.CUSTOM_VNAV_CLIMB_ENABLED, 'Number') === 1) {
				this.vsi.setAttribute('selected_vspeed_active', 'false');
			} else {
				this.vsi.setAttribute('selected_vspeed_active', 'true');
			}
		} else {
			this.vsi.setAttribute('selected_vspeed_active', 'false');
		}
	}

	onExit() {
	}

	onEvent(_event) {
	}
}

class B747_8_PFD_Airspeed extends NavSystemElement {
	constructor() {
		super();
	}

	init(root) {
		this.airspeed = this.gps.getChildById('Airspeed');
		this.airspeed.aircraft = Aircraft.B747_8;
		this.airspeed.gps = this.gps;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		this.airspeed.update(_deltaTime);
	}

	onExit() {
	}

	onEvent(_event) {
	}
}

class B747_8_PFD_Altimeter extends NavSystemElement {
	constructor() {
		super();
		this.isMTRSActive = false;
		this.minimumReference = 200;
	}

	init(root) {
		this.altimeter = this.gps.getChildById('Altimeter');
		this.altimeter.aircraft = Aircraft.B747_8;
		this.altimeter.gps = this.gps;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		this.altimeter.update(_deltaTime);
	}

	onExit() {
	}

	onEvent(_event) {
		switch (_event) {
			case 'BARO_INC':
				SimVar.SetSimVarValue('K:KOHLSMAN_INC', 'number', 1);
				break;
			case 'BARO_DEC':
				SimVar.SetSimVarValue('K:KOHLSMAN_DEC', 'number', 1);
				break;
			case 'MTRS':
				this.isMTRSActive = !this.isMTRSActive;
				this.altimeter.showMTRS(this.isMTRSActive);
				break;
			case 'Mins_INC':
				this.minimumReference += 50;
				this.altimeter.minimumReferenceValue = this.minimumReference;
				break;
			case 'Mins_DEC':
				this.minimumReference -= 50;
				this.altimeter.minimumReferenceValue = this.minimumReference;
				break;
			case 'Mins_Press':
				this.minimumReference = 200;
				this.altimeter.minimumReferenceValue = this.minimumReference;
				break;
		}
	}
}

class B747_8_PFD_Attitude extends NavSystemElement {
	constructor() {
		super(...arguments);
		this.isFPVActive = false;
	}

	init(root) {
		this.hsi = this.gps.getChildById('Horizon');
		this.hsi.aircraft = Aircraft.B747_8;
		this.hsi.gps = this.gps;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		if (this.hsi) {
			this.hsi.update(_deltaTime);
			var xyz = Simplane.getOrientationAxis();
			if (xyz) {
				this.hsi.setAttribute('pitch', (xyz.pitch / Math.PI * 180).toString());
				this.hsi.setAttribute('bank', (xyz.bank / Math.PI * 180).toString());
			}
			this.hsi.setAttribute('slip_skid', Simplane.getInclinometer().toString());
			this.hsi.setAttribute('radio_altitude', Simplane.getAltitudeAboveGround().toString());
			this.hsi.setAttribute('radio_decision_height', this.gps.radioNav.getRadioDecisionHeight().toString());
		}
	}

	onExit() {
	}

	onEvent(_event) {
		switch (_event) {
			case 'FPV':
				this.isFPVActive = !this.isFPVActive;
				this.hsi.showFPV(this.isFPVActive);
				break;
		}
	}
}

class B747_8_PFD_Compass extends NavSystemElement {
	init(root) {
		this.svg = this.gps.getChildById('Compass');
		this.svg.aircraft = Aircraft.B747_8;
		this.svg.gps = this.gps;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		this.svg.update(_deltaTime);
	}

	onExit() {
	}

	onEvent(_event) {
	}

	showILS(_val) {
		if (this.svg) {
			this.svg.showILS(_val);
		}
	}
}

class B747_8_PFD_FMA extends NavSystemElement {
	init(root) {
		this.fma = this.gps.querySelector('boeing-fma');
		this.fma.aircraft = Aircraft.B747_8;
		this.fma.gps = this.gps;
		this.isInitialized = true;
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		if (this.fma != null) {
			this.fma.update(_deltaTime);
		}
	}

	onExit() {
	}

	onEvent(_event) {
	}
}

class B747_8_PFD_ILS extends NavSystemElement {
	constructor() {
		super(...arguments);
		this.altWentAbove500 = false;
	}

	init(root) {
		this.ils = this.gps.getChildById('ILS');
		this.ils.aircraft = Aircraft.B747_8;
		this.ils.gps = this.gps;
		this.ils.showNavInfo(true);
	}

	onEnter() {
	}

	onUpdate(_deltaTime) {
		if (!this.altWentAbove500) {
			let altitude = Simplane.getAltitudeAboveGround();
			if (altitude >= 500)
				this.altWentAbove500 = true;
		}
		if (this.ils) {
			let showIls = false;
			let localizer = this.gps.radioNav.getBestILSBeacon(false);
			if ((localizer.id != 0 && this.altWentAbove500) || (this.gps.currFlightPlanManager.isActiveApproach() && Simplane.getAutoPilotApproachType() == 10)) {
				showIls = true;
			}
			this.ils.showLocalizer(showIls);
			this.ils.showGlideslope(showIls);
			this.ils.update(_deltaTime);
		}
	}

	onExit() {
	}

	onEvent(_event) {
	}
}

registerInstrument('b747-8-pfd-element', B747_8_PFD);
//# sourceMappingURL=B747_8_PFD.js.map