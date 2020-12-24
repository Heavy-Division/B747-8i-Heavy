class Heavy_B747_8_FMC_HeavySimRateManager {

	constructor(fmc) {
		this.fmc = fmc;
		this.isSimRateManagerActive = false;
		this.autoRateMode = HeavyArray.SimRateManager.Modes;
		this.activeAutoRateMode = 2;
		this.isEditActivatedForAutoRateMode = false;
		this.linearModeRate = 4;
	}

	static get managedIntervalId() {
		return this._managedIntervalId || NaN;
	}

	static set managedIntervalId(id) {
		this._managedIntervalId = id;
	}

	static get slowDownIntervalId() {
		return this._slowDownIntervalId || NaN;
	}

	static set slowDownIntervalId(id) {
		this._slowDownIntervalId = id;
	}

	static get emergencyShutdown() {
		return this._emergencyShutdown || false;
	}

	static set emergencyShutdown(state) {
		this._emergencyShutdown = state;
	}

	static get emergencyShutdownTime() {
		return this._emergencyShutdownTime || null;
	}

	static set emergencyShutdownTime(time) {
		this._emergencyShutdownTime = time;
	}

	static get emergencyIntervalId() {
		return this._emergencyIntervalId || NaN;
	}

	static set emergencyIntervalId(id) {
		this._emergencyIntervalId = id;
	}

	static get MODE() {
		return {'SLOW_DOWN': 'SLOW_DOWN', 'PAUSE': 'PAUSE'};
	}

	showPageModeEditing() {
		this.fmc.clearDisplay();
		let mode = HeavyDataStorage.get('SIM_RATE_MODE', Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN);
		let modeString;
		switch (mode) {
			case Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN:
				modeString = 'SLOW DOWN';
				break;
			case Heavy_B747_8_FMC_HeavySimRateManager.MODE.PAUSE:
				modeString = 'PAUSE';
				break;
		}

		let rows = HeavyArray.Fmc.EmptyRows;
		rows[1][0] = 'MODE';
		rows[2][0] = modeString;
		rows[4][0] = '<SLOW DOWN[s-text]';
		rows[6][0] = '<PAUSE[s-text]';
		rows[12][0] = FMCString.Prompt.BACK_LEFT;

		this.fmc.setTemplate(rows);

		this.fmc.onLeftInput[1] = () => {
			HeavyDataStorage.set('SIM_RATE_MODE', Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN)
			this.showPage();
		};

		this.fmc.onLeftInput[2] = () => {
			HeavyDataStorage.set('SIM_RATE_MODE', Heavy_B747_8_FMC_HeavySimRateManager.MODE.PAUSE)
			this.showPage();
		};

		this.fmc.onLeftInput[5] = () => {
			this.showPage();
		};
	}

	/**
	 * Default page
	 */
	showPage() {
		this.fmc.clearDisplay();
		if (!isFinite(Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId) && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime) {
			this.activateEmergencyShutdown();
		}

		let mode = HeavyDataStorage.get('SIM_RATE_MODE', Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN);
		let modeString;
		switch (mode) {
			case Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN:
				modeString = 'SLOW DOWN';
				break;
			case Heavy_B747_8_FMC_HeavySimRateManager.MODE.PAUSE:
				modeString = 'PAUSE';
				break;
		}

		let rows = HeavyArray.Fmc.EmptyRows;
		rows[0][0] = FMCString.PageTitle.SIM_RATE_MANAGER;
		rows[1][0] = 'MODE';
		rows[2][0] = modeString;
		rows[1][1] = 'AUTO RATE';
		rows[2][1] = (this.isSimRateManagerActive ? FMCString.Prompt.ACT_BOTH : FMCString.Prompt.SEL_BOTH) + ' ' + this.autoRateMode[this.activeAutoRateMode];
		rows[8][0] = '<UNPAUSE';
		rows[10][0] = FMCString.Prompt.EMERGENCY_SHUTDOWN_LEFT;
		rows[12][0] = FMCString.Prompt.BACK_LEFT;
		rows[12][1] = (isFinite(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId) ? FMCString.Prompt.DEACTIVATE_RIGHT : FMCString.Prompt.ACTIVATE_RIGHT);

		this.prepareEventsForDefaultPage();
		this.fmc.setTemplate(rows);
	}

	/**
	 * Default page events
	 */
	prepareEventsForDefaultPage() {
		this.fmc.onLeftInput[0] = () => {
			this.showPageModeEditing();
		};
		this.fmc.onRightInput[0] = () => {
			this.isEditActivatedForAutoRateMode = true;
			this.showPageRateModeEditing();
		};
		this.fmc.onLeftInput[3] = () => {
			SimVar.SetSimVarValue('K:PAUSE_SET', 'Boolean', 0);
			this.showPage();
		};

		this.fmc.onLeftInput[4] = () => {
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;
			Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = NaN;
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime = performance.now();
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown = true;
			this.showPageEmergencyShutdown();
		};

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};

		this.fmc.onRightInput[5] = () => {
			if (isFinite(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId)) {
				this.deactivateAutoRate(false);
			} else {
				this.activateAutoRate();
			}
		};

	}

	/**
	 * Rate editing page
	 */
	showPageRateModeEditing() {
		let rows = HeavyArray.Fmc.EmptyRows;
		rows[0][0] = FMCString.PageTitle.SIM_RATE_MANAGER;
		rows[1][1] = 'AUTO RATE';
		rows[2][1] = (this.isSimRateManagerActive ? FMCString.Prompt.ACT_BOTH : FMCString.Prompt.SEL_BOTH) + ' ' + this.autoRateMode[this.activeAutoRateMode];
		rows[12][0] = FMCString.Prompt.BACK_LEFT;

		let rowIndex = 2;

		for (let i = 0; i < this.autoRateMode.length; i++) {
			rows[rowIndex * 2] = ['', this.autoRateMode[i] + '[s-text]>'];
			this.prepareEventsForRateModeEditingPage(rowIndex - 1, i);
			rowIndex++;
		}

		this.fmc.setTemplate(rows);
	}

	/**
	 * Rate editing page events
	 */
	prepareEventsForRateModeEditingPage(rowIndex, modeIndex) {
		this.fmc.onRightInput[rowIndex] = () => {
			this.activeAutoRateMode = modeIndex;
			this.isEditActivatedForAutoRateMode = false;
			this.showPage();
		};

		this.fmc.onRightInput[0] = () => {
			this.isEditActivatedForAutoRateMode = false;
			this.showPage();
		};
	}

	/**
	 * Emergency shutdown page
	 */
	showPageEmergencyShutdown() {
		if (!isFinite(Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId) && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime) {
			this.activateEmergencyShutdown();
		}
		let seconds = (((Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000) - performance.now()) / 1000).toFixed(2);
		seconds = (seconds > 0 ? seconds : '');

		let rows = HeavyArray.Fmc.EmptyRows;
		rows[0][0] = FMCString.PageTitle.SIM_RATE_MANAGER;
		rows[6][2] = 'EMERGENCY SHUTDOWN ACTIVE[color]red';
		rows[7][2] = seconds + '[color]red';
		rows[12][0] = FMCString.Prompt.BACK_LEFT;
		rows[12][1] = (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000 > performance.now() ? '' : FMCString.Prompt.DEACTIVATE_RIGHT);

		this.prepareEventsForEmergencyShutdownPage();

		this.fmc.setTemplate(rows);
	}

	/**
	 * Emergency shutdown page events
	 */
	prepareEventsForEmergencyShutdownPage() {
		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};
		if (!(Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000 > performance.now())) {
			this.fmc.onRightInput[5] = () => {
				Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime = null;
				Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown = false;
				this.showPage();
			};
		}
	}

	/**
	 * Activate emergency shutdown
	 *
	 * This function will start interval of emergency shutdown ("protect" FMC from inputs for 6 seconds)
	 * The interval switch back to emergency shutdown page every 100 milliseconds when user try to leave emergency shutdown page.
	 * User is able to deactivate emergency shutdown after 6 seconds or leave page without deactivating emergency shutdown.
	 */
	activateEmergencyShutdown() {
		let interval = {};
		interval.id = setInterval(this.emergencyInterval.bind(this, interval), 100);
		Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId = interval.id;
	}

	/**
	 * Emergency shutdown loop logic
	 *
	 * Protect FMC from user inputs (leaving emergency shutdown page). Interval is self-destroyed after 6 seconds.
	 * Need to be here and not in anonymous function because of binding interval ids for self-destroying.
	 */
	emergencyInterval(interval) {
		let thisIntervalId = interval.id;
		if (!(Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 6000 > performance.now())) {
			clearInterval(thisIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime = null;
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId = NaN;
		} else {
			this.showPageEmergencyShutdown();
		}
	}

	/**
	 * Activate Auto Rate
	 *
	 * This function will start interval of auto rate
	 */
	activateAutoRate() {
		SimVar.SetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean', 1).then(() => {
				let interval = {};
				interval.id = setInterval(this.autoRateInterval.bind(this, interval), 4000);
				Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = interval.id;
				this.showPage();
			}
		);
	}

	/**
	 * Auto Rate loop logic (activation)
	 *
	 * Manage sim rate during flight and deactivate auto rate when TOD or DECEL is reached.
	 * Need to be here and not in anonymous function because of binding interval ids for self-destroying.
	 * Interval will self-destruct after emergency shutdown activation.
	 */
	autoRateInterval(interval) {
		let thisIntervalId = interval.id;
		if (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown === true) {
			clearInterval(thisIntervalId);
			return;
		}

		let activated = SimVar.GetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean');
		if (activated) {

			if (this.shouldDeactivateBecauseOfTOD() || this.shouldDeactivateBecauseOfDecel()) {
				this.deactivateAutoRate();
			}

			let actualSimRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'Number');
			switch (this.activeAutoRateMode) {
				case 0:
					break;
				case 1:
					this.executeLinearMode(actualSimRate);
					break;
				case 2:
					this.executeNormalMode(actualSimRate);
					break;
				case 3:
					this.executeAggressiveMode(actualSimRate);
					break;
				default:
					break;
			}
		} else {
			clearInterval(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;
		}
	}

	/**
	 * Return true if DECEL waypoint is reached
	 */
	shouldDeactivateBecauseOfDecel() {
		if (SimVar.GetSimVarValue('L:FLIGHTPLAN_USE_DECEL_WAYPOINT', 'number') === 1) {
			if (this.fmc.flightPlanManager.decelWaypoint) {
				let planeCoordinates = new LatLong(SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude'), SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude'));
				let dist = Avionics.Utils.computeGreatCircleDistance(this.fmc.flightPlanManager.decelWaypoint.infos.coordinates, planeCoordinates);
				if (dist < 15) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Return true if TOD is reached
	 */
	shouldDeactivateBecauseOfTOD() {
		let currentAltitude = Simplane.getAltitude();
		let nextWaypoint = this.fmc.flightPlanManager.getActiveWaypoint();
		if (nextWaypoint && (nextWaypoint.legAltitudeDescription === 3 || nextWaypoint.legAltitudeDescription === 4)) {
			let targetAltitude = nextWaypoint.legAltitude1;
			if (nextWaypoint.legAltitudeDescription === 4) {
				targetAltitude = Math.max(nextWaypoint.legAltitude1, nextWaypoint.legAltitude2);
			}
			if (currentAltitude > targetAltitude + 40) {
				return true;
			}
		}
		return false;
	}

	executeLinearMode(actualSimRate) {
		if (actualSimRate < this.linearModeRate) {
			SimVar.SetSimVarValue('K:SIM_RATE_INCR', 'number', 1);
		}
		if (actualSimRate > this.linearModeRate) {
			SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
		}
	}

	executeNormalMode(actualSimRate) {
		let planeCoordinates = new LatLong(SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude'), SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude'));
		let previousWaypoint = this.fmc.flightPlanManager.getPreviousActiveWaypoint();
		let nextWaypoint = this.fmc.flightPlanManager.getActiveWaypoint();
		let previousDistance = Avionics.Utils.computeGreatCircleDistance(previousWaypoint.infos.coordinates, planeCoordinates);
		let nextDistance = Avionics.Utils.computeGreatCircleDistance(nextWaypoint.infos.coordinates, planeCoordinates);
		if (actualSimRate > 4) {
			let newActualSimRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'Number');
			while (newActualSimRate > 4) {
				SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
			}
		}
		if (nextDistance < 5 || previousDistance < 3) {
			if (actualSimRate > 2) {
				SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
			}
		} else {
			if (actualSimRate < 4) {
				SimVar.SetSimVarValue('K:SIM_RATE_INCR', 'number', 1);
			}
		}
	}

	executeAggressiveMode(actualSimRate) {
		let planeCoordinates = new LatLong(SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude'), SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude'));
		let previousWaypoint = this.fmc.flightPlanManager.getPreviousActiveWaypoint();
		let nextWaypoint = this.fmc.flightPlanManager.getActiveWaypoint();
		let previousDistance = Avionics.Utils.computeGreatCircleDistance(previousWaypoint.infos.coordinates, planeCoordinates);
		let nextDistance = Avionics.Utils.computeGreatCircleDistance(nextWaypoint.infos.coordinates, planeCoordinates);

		if (nextDistance < 9 || previousDistance < 3) {
			if (actualSimRate > 4) {
				SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
			}
		} else {
			if (actualSimRate < 8) {
				SimVar.SetSimVarValue('K:SIM_RATE_INCR', 'number', 1);
			}
		}
	}

	/**
	 * Activate Auto Rate
	 *
	 * This function will start interval of auto rate deactivation
	 */
	deactivateAutoRate(autoDeactivation = true) {
		SimVar.SetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean', 0).then(() => {
			let interval = {};
			interval.id = setInterval(this.autoRateIntervalDeactivation.bind(this, interval, autoDeactivation), 1000);
			Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = interval.id;
			clearInterval(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;
			this.showPage();
		});
	}

	/**
	 * Auto Rate loop logic (deactivation)
	 *
	 * Change sim rate to value 1. Interval will self-destruct when sim rate reach 1.
	 * Need to be here and not in anonymous function because of binding interval ids for self-destroying.
	 * Interval will self-destruct after emergency shutdown activation.
	 */
	autoRateIntervalDeactivation(interval, autoDeactivation = false) {
		let thisIntervalId = interval.id;
		if (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown === true) {
			clearInterval(thisIntervalId);
			return;
		}

		let actualSimRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'Number');
		if (actualSimRate > 1) {
			SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
		} else {
			clearInterval(thisIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = NaN;
			if (HeavyDataStorage.get('SIM_RATE_MODE', Heavy_B747_8_FMC_HeavySimRateManager.MODE.SLOW_DOWN) === Heavy_B747_8_FMC_HeavySimRateManager.MODE.PAUSE) {
				SimVar.SetSimVarValue('K:PAUSE_SET', 'Boolean', 1);
			}
		}
	}
}