class Heavy_B747_8_FMC_HeavySimRateManager {

	constructor(fmc) {
		this.fmc = fmc;
		this.isSimRateManagerActive = false;
		this.autoRateMode = ['OFF', 'LINEAR', 'NORMAL', 'AGGRESSIVE'];
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


	showPage() {
		this.fmc.clearDisplay();
		let activated = SimVar.GetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean');

		let rows = this.prepareRows();
		this.fmc.setTemplate(rows);
		if (!isFinite(Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId) && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime) {
			this.activateEmergencyShutdown();
		}

	}

	prepareRows() {
		if (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime || Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000 > performance.now()) {
			return this.prepareRowsForEmergencyShutdownActive();
		}
		if (this.isEditActivatedForAutoRateMode) {
			return this.prepareRowsForRateModeEditing();
		} else {
			return this.prepareDefaultsRows();
		}
	}

	prepareRowsForEmergencyShutdownActive() {
		let seconds = (((Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000) - performance.now()) / 1000).toFixed(2);
		seconds = (seconds > 0 ? seconds : '');
		let rows = [
			[FMCString.PageTitle.SIM_RATE_MANAGER],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', '', 'EMERGENCY SHUTDOWN ACTIVE[color]red'],
			['', '', seconds + '[color]red'],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT, (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 5000 > performance.now() ? '' : FMCString.Prompt.DEACTIVATE_RIGHT)]
		];
		this.prepareEventsForEmergencyShutdownActive();

		return rows;
	}

	prepareEventsForEmergencyShutdownActive() {
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

	prepareDefaultsRows() {
		let rows = [
			[FMCString.PageTitle.SIM_RATE_MANAGER],
			['', 'AUTO RATE'],
			['', (this.isSimRateManagerActive ? FMCString.Prompt.ACT_BOTH : FMCString.Prompt.SEL_BOTH) + ' ' + this.autoRateMode[this.activeAutoRateMode]],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.EMERGENCY_SHUTDOWN_LEFT, ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT, (isFinite(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId) ? FMCString.Prompt.DEACTIVATE_RIGHT : FMCString.Prompt.ACTIVATE_RIGHT)]
		];
		this.prepareEventsForDefaultView();

		return rows;
	}

	prepareEventsForDefaultView() {
		this.fmc.onRightInput[0] = () => {
			this.isEditActivatedForAutoRateMode = true;
			this.showPage();
		};

		this.fmc.onLeftInput[4] = () => {
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;
			Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = NaN;
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime = performance.now();
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown = true;
			this.showPage();
		};

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};

		this.fmc.onRightInput[5] = () => {
			if (isFinite(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId)) {
				this.deactivateAutoRate();
			} else {
				this.activateAutoRate();
			}
		};
	}

	prepareRowsForRateModeEditing() {
		let rows = [
			[FMCString.PageTitle.SIM_RATE_MANAGER],
			['', 'AUTO RATE'],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];

		rows[2] = ['', (this.isSimRateManagerActive ? FMCString.Prompt.ACT_BOTH : FMCString.Prompt.SEL_BOTH) + ' ' + this.autoRateMode[this.activeAutoRateMode]];

		let rowIndex = 2;

		for (let i = 0; i < this.autoRateMode.length; i++) {
			rows[rowIndex * 2] = ['', this.autoRateMode[i] + '[s-text]>'];
			this.prepareEventsForRateModeEditing(rowIndex - 1, i);
			rowIndex++;
		}

		return rows;
	}

	prepareEventsForRateModeEditing(rowIndex, modeIndex) {
		this.fmc.onRightInput[rowIndex] = () => {
			this.activeAutoRateMode = modeIndex;
			this.isEditActivatedForAutoRateMode = false;
			this.showPage();
		};

		this.fmc.onRightInput[0] = () => {
			this.isEditActivatedForAutoRateMode = true;
			this.showPage();
		};
	}

	startEmergencyInterval(id) {
		let thisIntervalId = id.id;
		if (!(Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime && Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime + 6000 > performance.now())) {
			clearInterval(thisIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdownTime = null;
			Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId = NaN;
		} else {
			this.showPage();
		}
	}

	activateEmergencyShutdown() {
		let id = {};
		id.id = setInterval(this.startEmergencyInterval.bind(this, id), 500);
		Heavy_B747_8_FMC_HeavySimRateManager.emergencyIntervalId = id.id;
	}

	startInterval(id) {
		let thisIntervalId = id.id;
		if (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown === true) {
			clearInterval(thisIntervalId);
		}

		let activated = SimVar.GetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean');
		if (activated) {
			let currentAltitude = Simplane.getAltitude();
			let nextWaypoint = this.fmc.flightPlanManager.getActiveWaypoint();
			if (nextWaypoint && (nextWaypoint.legAltitudeDescription === 3 || nextWaypoint.legAltitudeDescription === 4)) {
				let targetAltitude = nextWaypoint.legAltitude1;
				if (nextWaypoint.legAltitudeDescription === 4) {
					targetAltitude = Math.max(nextWaypoint.legAltitude1, nextWaypoint.legAltitude2);
				}
				if (currentAltitude > targetAltitude + 40) {
					this.deactivateAutoRate();
				}
			}

			if (SimVar.GetSimVarValue('L:FLIGHTPLAN_USE_DECEL_WAYPOINT', 'number') === 1) {
				if (this.fmc.flightPlanManager.decelWaypoint) {
					let lat = SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude');
					let long = SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude');
					let planeCoordinates = new LatLong(SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude'), SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude'));
					let dist = Avionics.Utils.computeGreatCircleDistance(this.fmc.flightPlanManager.decelWaypoint.infos.coordinates, planeCoordinates);
					if (dist < 15) {
						this.deactivateAutoRate();
					}
				}
			}

			let actualSimRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'Number');
			if (actualSimRate < this.linearModeRate) {
				SimVar.SetSimVarValue('K:SIM_RATE_INCR', 'number', 1);
			}
		} else {
			clearInterval(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;
		}
	}

	activateAutoRate() {
		SimVar.SetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean', 1).then(() => {
				let id = {};
				id.id = setInterval(this.startInterval.bind(this, id), 5000);
				Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = id.id;
				this.showPage();
			}
		);
	}

	deactivateAutoRate() {
		SimVar.SetSimVarValue('L:HEAVY_SIM_RATE_MANAGER_ACTIVATED', 'Boolean', 0).then(() => {
			clearInterval(Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId);
			Heavy_B747_8_FMC_HeavySimRateManager.managedIntervalId = NaN;

			Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = setInterval(() => {
				const thisIntervalId = Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId;
				if (Heavy_B747_8_FMC_HeavySimRateManager.emergencyShutdown === true) {
					clearInterval(thisIntervalId);
				}
				let actualSimRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'Number');
				if (actualSimRate > 1) {
					SimVar.SetSimVarValue('K:SIM_RATE_DECR', 'number', 1);
				} else {
					clearInterval(Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId);
					Heavy_B747_8_FMC_HeavySimRateManager.slowDownIntervalId = NaN;
				}

			}, 2000);
			this.showPage();
		});
	}
}