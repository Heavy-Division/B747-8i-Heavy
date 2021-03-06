class Heavy_B747_8_FMC_MainDisplay extends B747_8_FMC_MainDisplay {

	static get isCustomVNAVClimbEnabled() {
		return this._isCustomVNAVClimbEnabled || false;
	}

	static set isCustomVNAVClimbEnabled(value) {
		this._isCustomVNAVClimbEnabled = value;
	}

	constructor() {
		super(...arguments);
		this.clbSpeedRestrictionValue = NaN;
		this.clbSpeedRestrictionAltitude = NaN;
		this.clbSpeedRestrictionValueModified = NaN;
		this.clbSpeedRestrictionAltitudeModified = NaN;
		this.clbSpeedTransitionAltitude = 10000;
		this.clbSpeedTransitionValue = 250;
		this.clbSpeedTransitionAltitudeModified = 10000;
		this.clbSpeedTransitionValueModified = 250;
		this.transitionAltitude = 18000;
	}

	Init() {
		super.Init();
		this.registerMainButtonsActions();
	}

	onUpdate(_deltaTime) {
		super.onUpdate(_deltaTime);
		//this.flightPlanManager.updateFlightPlan();
		//this.flightPlanManager.updateCurrentApproach();
		//if (this.refreshPageCallback) {
		//	this.refreshPageCallback();
		//}
	}

	updateAutopilot() {
		let now = performance.now();
		let dt = now - this._lastUpdateAPTime;
		this._lastUpdateAPTime = now;
		if (isFinite(dt)) {
			this.updateAutopilotCooldown -= dt;
		}
		if (SimVar.GetSimVarValue('L:AIRLINER_FMC_FORCE_NEXT_UPDATE', 'number') === 1) {
			SimVar.SetSimVarValue('L:AIRLINER_FMC_FORCE_NEXT_UPDATE', 'number', 0);
			this.updateAutopilotCooldown = -1;
		}
		if (this.updateAutopilotCooldown < 0) {
			let currentApMasterStatus = SimVar.GetSimVarValue('AUTOPILOT MASTER', 'boolean');
			if (currentApMasterStatus != this._apMasterStatus) {
				this._apMasterStatus = currentApMasterStatus;
				this._forceNextAltitudeUpdate = true;
				if (currentApMasterStatus) {
					if (this.flightPlanManager.hasFlightPlan()) {
						this.activateLNAV();
						this.activateVNAV();
					} else {
						this.activateFLCH();
					}
				}
			}
			this._apHasDeactivated = !currentApMasterStatus && this._previousApMasterStatus;
			this._previousApMasterStatus = currentApMasterStatus;
			let currentAThrMasterStatus = Simplane.getAutoPilotThrottleActive(1);
			if (currentAThrMasterStatus != this._aThrStatus) {
				this._aThrStatus = currentAThrMasterStatus;
			}
			this._aThrHasActivated = currentAThrMasterStatus && !this._previousAThrStatus;
			this._previousAThrStatus = currentAThrMasterStatus;
			if (this.currentFlightPhase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
				let n1 = this.getThrustTakeOffLimit() / 100;
				SimVar.SetSimVarValue('AUTOPILOT THROTTLE MAX THRUST', 'number', n1);
			}
			if (!this.getIsAltitudeHoldActive()) {
				Coherent.call('AP_ALT_VAR_SET_ENGLISH', 1, Simplane.getAutoPilotDisplayedAltitudeLockValue(), this._forceNextAltitudeUpdate);
			}
			let vRef = 0;
			if (this.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_DESCENT) {
				vRef = 1.3 * Simplane.getStallSpeed();
			}
			SimVar.SetSimVarValue('L:AIRLINER_VREF_SPEED', 'knots', vRef);
			if (this._apHasDeactivated) {
				this.deactivateVNAV();
				if (!this.getIsSPDActive()) {
					this.activateSPD();
				}
			}
			if (this._aThrHasActivated) {
				if (this.getIsSPDActive()) {
					this.activateSPD();
				}
			}
			if (this._pendingLNAVActivation) {
				let altitude = Simplane.getAltitudeAboveGround();
				if (altitude > 50) {
					this._pendingLNAVActivation = false;
					this.doActivateLNAV();
				}
			}
			if (this._isLNAVActive) {
				let altitude = Simplane.getAltitudeAboveGround();
				if (altitude > 50) {
					this._pendingLNAVActivation = false;
					this.doActivateLNAV();
				}
			}
			if (this._pendingVNAVActivation) {
				let altitude = Simplane.getAltitudeAboveGround();
				if (altitude > 400) {
					this._pendingVNAVActivation = false;
					this.doActivateVNAV();
				}
			}
			if (currentApMasterStatus && SimVar.GetSimVarValue('L:AP_VNAV_ACTIVE', 'number') === 1) {
				let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
				let altitude = Simplane.getAltitude();
				let deltaAltitude = Math.abs(targetAltitude - altitude);
				if (deltaAltitude > 1000) {
					if (!Simplane.getAutoPilotFLCActive()) {
						SimVar.SetSimVarValue('K:FLIGHT_LEVEL_CHANGE_ON', 'Number', 1);
					}
				}
			}
			if (this.getIsFLCHActive() && !Simplane.getAutoPilotGlideslopeActive() && !Simplane.getAutoPilotGlideslopeHold()) {
				let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
				let altitude = Simplane.getAltitude();
				let deltaAltitude = Math.abs(targetAltitude - altitude);
				if (deltaAltitude < 150) {
					this.activateAltitudeHold(true);
				}
			}
			if (this.getIsVSpeedActive()) {
				let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
				let altitude = Simplane.getAltitude();
				let deltaAltitude = Math.abs(targetAltitude - altitude);
				if (deltaAltitude < 150) {
					this.activateAltitudeHold(true);
				}
			}
			if (this._pendingHeadingSelActivation) {
				let altitude = Simplane.getAltitudeAboveGround();
				if (altitude > 400) {
					this._pendingHeadingSelActivation = false;
					this.doActivateHeadingSel();
				}
			}
			if (this._pendingSPDActivation) {
				let altitude = Simplane.getAltitudeAboveGround();
				if (altitude > 400) {
					this._pendingSPDActivation = false;
					this.doActivateSPD();
				}
			}
			if (Simplane.getAutoPilotGlideslopeActive()) {
				if (this.getIsVNAVActive()) {
					this.deactivateVNAV();
				}
				if (this.getIsVSpeedActive()) {
					this.deactivateVSpeed();
				}
				if (this.getIsAltitudeHoldActive()) {
					this.deactivateAltitudeHold();
				}
				if (!this.getIsSPDActive()) {
					this.activateSPD();
				}
			}
			SimVar.SetSimVarValue('SIMVAR_AUTOPILOT_AIRSPEED_MIN_CALCULATED', 'knots', Simplane.getStallProtectionMinSpeed());
			SimVar.SetSimVarValue('SIMVAR_AUTOPILOT_AIRSPEED_MAX_CALCULATED', 'knots', Simplane.getMaxSpeed(Aircraft.B747_8));
			let currentAltitude = Simplane.getAltitude();
			let groundSpeed = Simplane.getGroundSpeed();
			let apTargetAltitude = Simplane.getAutoPilotAltitudeLockValue('feet');
			let planeHeading = Simplane.getHeadingMagnetic();
			let planeCoordinates = new LatLong(SimVar.GetSimVarValue('PLANE LATITUDE', 'degree latitude'), SimVar.GetSimVarValue('PLANE LONGITUDE', 'degree longitude'));
			if (this.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_CLIMB) {
				let activeWaypoint = this.flightPlanManager.getActiveWaypoint();
				if (activeWaypoint != this._activeWaypoint) {
					console.log('Update FMC Active Waypoint');
					if (this._activeWaypoint) {
						this._activeWaypoint.altitudeWasReached = Simplane.getAltitudeAboveGround();
						this._activeWaypoint.timeWasReached = SimVar.GetGlobalVarValue('LOCAL TIME', 'seconds');
						this._activeWaypoint.fuelWasReached = SimVar.GetSimVarValue('FUEL TOTAL QUANTITY', 'gallons') * SimVar.GetSimVarValue('FUEL WEIGHT PER GALLON', 'kilograms') / 1000;
					}
					this._activeWaypoint = activeWaypoint;
				}
			}
			if (this.getIsVNAVActive()) {
				let prevWaypoint = this.flightPlanManager.getPreviousActiveWaypoint();
				let nextWaypoint = this.flightPlanManager.getActiveWaypoint();
				if (nextWaypoint && (nextWaypoint.legAltitudeDescription === 3 || nextWaypoint.legAltitudeDescription === 4)) {
					let targetAltitude = nextWaypoint.legAltitude1;
					if (nextWaypoint.legAltitudeDescription === 4) {
						targetAltitude = Math.max(nextWaypoint.legAltitude1, nextWaypoint.legAltitude2);
					}
					let showTopOfDescent = false;
					let topOfDescentLat;
					let topOfDescentLong;
					this._hasReachedTopOfDescent = true;
					if (currentAltitude > targetAltitude + 40) {
						let vSpeed = 3000;
						let descentDuration = Math.abs(targetAltitude - currentAltitude) / vSpeed / 60;
						let descentDistance = descentDuration * groundSpeed;
						let distanceToTarget = Avionics.Utils.computeGreatCircleDistance(prevWaypoint.infos.coordinates, nextWaypoint.infos.coordinates);
						showTopOfDescent = true;
						let f = 1 - descentDistance / distanceToTarget;
						topOfDescentLat = Avionics.Utils.lerpAngle(planeCoordinates.lat, nextWaypoint.infos.lat, f);
						topOfDescentLong = Avionics.Utils.lerpAngle(planeCoordinates.long, nextWaypoint.infos.long, f);
						if (distanceToTarget + 1 > descentDistance) {
							this._hasReachedTopOfDescent = false;
						}
					}
					if (showTopOfDescent) {
						SimVar.SetSimVarValue('L:AIRLINER_FMS_SHOW_TOP_DSCNT', 'number', 1);
						SimVar.SetSimVarValue('L:AIRLINER_FMS_LAT_TOP_DSCNT', 'number', topOfDescentLat);
						SimVar.SetSimVarValue('L:AIRLINER_FMS_LONG_TOP_DSCNT', 'number', topOfDescentLong);
					} else {
						SimVar.SetSimVarValue('L:AIRLINER_FMS_SHOW_TOP_DSCNT', 'number', 0);
					}
					let selectedAltitude = Simplane.getAutoPilotSelectedAltitudeLockValue('feet');
					if (!this.flightPlanManager.getIsDirectTo() &&
						isFinite(nextWaypoint.legAltitude1) &&
						nextWaypoint.legAltitude1 < 20000 &&
						nextWaypoint.legAltitude1 > selectedAltitude &&
						Simplane.getAltitude() > nextWaypoint.legAltitude1 - 200) {
						Coherent.call('AP_ALT_VAR_SET_ENGLISH', 2, nextWaypoint.legAltitude1, this._forceNextAltitudeUpdate);
						this._forceNextAltitudeUpdate = false;
						SimVar.SetSimVarValue('L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT', 'number', 1);
					} else {
						let altitude = Simplane.getAutoPilotSelectedAltitudeLockValue('feet');
						if (isFinite(altitude)) {
							Coherent.call('AP_ALT_VAR_SET_ENGLISH', 2, this.cruiseFlightLevel * 100, this._forceNextAltitudeUpdate);
							this._forceNextAltitudeUpdate = false;
							SimVar.SetSimVarValue('L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT', 'number', 0);
						}
					}
				} else {
					let altitude = Simplane.getAutoPilotSelectedAltitudeLockValue('feet');
					if (isFinite(altitude)) {
						Coherent.call('AP_ALT_VAR_SET_ENGLISH', 2, this.cruiseFlightLevel * 100, this._forceNextAltitudeUpdate);
						this._forceNextAltitudeUpdate = false;
						SimVar.SetSimVarValue('L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT', 'number', 0);
					}
				}
			} else if (!this.getIsFLCHActive() && this.getIsSPDActive()) {
				this.setAPSpeedHoldMode();
			}
			if (this.getIsVNAVArmed() && !this.getIsVNAVActive()) {
				if (Simplane.getAutoPilotThrottleArmed()) {
					if (!this._hasSwitchedToHoldOnTakeOff) {
						let speed = Simplane.getIndicatedSpeed();
						if (speed > 65) {
							Coherent.call('GENERAL_ENG_THROTTLE_MANAGED_MODE_SET', ThrottleMode.HOLD);
							this._hasSwitchedToHoldOnTakeOff = true;
						}
					}
				}
			}
			if (this._isHeadingHoldActive) {
				Coherent.call('HEADING_BUG_SET', 2, this._headingHoldValue);
			}
			if (!this.flightPlanManager.isActiveApproach() && this.currentFlightPhase != FlightPhase.FLIGHT_PHASE_APPROACH) {
				let activeWaypoint = this.flightPlanManager.getActiveWaypoint();
				let nextActiveWaypoint = this.flightPlanManager.getNextActiveWaypoint();
				if (activeWaypoint && nextActiveWaypoint) {
					let pathAngle = nextActiveWaypoint.bearingInFP - activeWaypoint.bearingInFP;
					while (pathAngle < 180) {
						pathAngle += 360;
					}
					while (pathAngle > 180) {
						pathAngle -= 360;
					}
					let absPathAngle = 180 - Math.abs(pathAngle);
					let airspeed = Simplane.getIndicatedSpeed();
					if (airspeed < 400) {
						let turnRadius = airspeed * 360 / (1091 * 0.36 / airspeed) / 3600 / 2 / Math.PI;
						let activateDistance = Math.pow(90 / absPathAngle, 1.6) * turnRadius * 1.2;
						let distanceToActive = Avionics.Utils.computeGreatCircleDistance(planeCoordinates, activeWaypoint.infos.coordinates);
						if (distanceToActive < activateDistance) {
							this.flightPlanManager.setActiveWaypointIndex(this.flightPlanManager.getActiveWaypointIndex() + 1);
						}
					}
				}
			}
			if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_TAKEOFF) {
				if (this.getIsVNAVActive()) {
					let speed = this.getTakeOffManagedSpeed();
					this.setAPManagedSpeed(speed, Aircraft.B747_8);
				}
			} else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB) {
				if (this.getIsVNAVActive()) {

					if (this.refreshPageCallback) {
						this.refreshPageCallback();
					}
					let speed = this.getClbManagedSpeed();
					if (this.shouldEngageSpeedRestriction()) {
						speed = this.clbSpeedRestrictionValue;
					} else {
						this.clbSpeedRestrictionValueModified = NaN;
						this.clbSpeedRestrictionAltitudeModified = NaN;
						this.clbSpeedRestrictionValue = NaN;
						this.clbSpeedRestrictionAltitude = NaN;
					}
					this.setAPManagedSpeed(speed, Aircraft.B747_8);
					let altitude = Simplane.getAltitudeAboveGround();
					let n1 = 100;
					if (altitude < this.thrustReductionAltitude) {
						n1 = this.getThrustTakeOffLimit() / 100;
					} else {
						n1 = this.getThrustClimbLimit() / 100;
					}
					SimVar.SetSimVarValue('AUTOPILOT THROTTLE MAX THRUST', 'number', n1);

					this.executeCustomVNAVClimb();
				}
			} else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CRUISE) {
				if (this.getIsVNAVActive()) {
					SimVar.SetSimVarValue(B748H_LocalVariables.VNAV.CUSTOM_VNAV_CLIMB_ENABLED, 'Number', 0);
					let speed = this.getCrzManagedSpeed();
					this.setAPManagedSpeed(speed, Aircraft.B747_8);
					let altitude = Simplane.getAltitudeAboveGround();
					let n1 = 100;
					if (altitude < this.thrustReductionAltitude) {
						n1 = this.getThrustTakeOffLimit() / 100;
					} else {
						n1 = this.getThrustClimbLimit() / 100;
					}
					SimVar.SetSimVarValue('AUTOPILOT THROTTLE MAX THRUST', 'number', n1);
				}
			} else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_DESCENT) {
				if (this.getIsVNAVActive()) {
					let speed = this.getDesManagedSpeed();
					this.setAPManagedSpeed(speed, Aircraft.B747_8);
				}
			} else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_APPROACH) {
				if (this.getIsVNAVActive()) {
					let speed = this.getManagedApproachSpeed();
					this.setAPManagedSpeed(speed, Aircraft.B747_8);
				}
				if (Simplane.getAutoPilotThrottleActive()) {
					let altitude = Simplane.getAltitudeAboveGround();
					if (altitude < 25) {
						if (Simplane.getEngineThrottleMode(0) != ThrottleMode.IDLE) {
							Coherent.call('GENERAL_ENG_THROTTLE_MANAGED_MODE_SET', ThrottleMode.IDLE);
						}
					}
				}
			}
			this.updateAutopilotCooldown = this._apCooldown;
		}
	}

	executeCustomVNAVClimb() {
		/**
		 * Set LVAR (used for hiding VS hold rectangle on PFD)
		 */
		SimVar.SetSimVarValue(B748H_LocalVariables.VNAV.CUSTOM_VNAV_CLIMB_ENABLED, 'Number', 1);
		/**
		 * Disable FLCH mode
		 */
		SimVar.SetSimVarValue('K:FLIGHT_LEVEL_CHANGE_ON', 'Number', 0);

		/**
		 * Enable AIRSPEED mode
		 */
		SimVar.SetSimVarValue('K:AP_AIRSPEED_ON', 'Number', 1);

		/**
		 * Get vertical speed to next waypoint
		 */
		let rate = SimVar.GetSimVarValue('GPS WP VERTICAL SPEED', 'Feet per minute');

		/**
		 * Round (ceil) vertical speed
		 */
		rate = Math.ceil(rate / 50) * 50;
		/**
		 * Do not descent during climb
		 */
		if (rate < 0) {
			rate = 0;
		}

		/**
		 * Set vertical speed and add 150 feet per minute (better be on altitude sooner)
		 */
		SimVar.SetSimVarValue('K:AP_VS_VAR_SET_ENGLISH', 'Feet per minute', rate + 150);

		/**
		 * Enable AP vertical speed hold
		 * NOTE: K:AP_VS_ON can be used instead of K:AP_VS_HOLD
		 */
		SimVar.SetSimVarValue('K:AP_VS_HOLD', 'Number', 1);
	}

	executeSpeedRestriction() {
		this.clbSpeedRestrictionValue = this.clbSpeedRestrictionValueModified;
		this.clbSpeedRestrictionAltitude = this.clbSpeedRestrictionAltitudeModified;
		this.clbSpeedRestrictionValueModified = NaN;
		this.clbSpeedRestrictionAltitudeModified = NaN;
	}

	setSpeedRestriction(input) {
		let inputSplit = input.split('/');
		let speed = parseInt(inputSplit[0]);
		let altitude = parseInt(inputSplit[1]);
		if (isFinite(speed) && isFinite(altitude) && HeavyInputChecks.speedRange(speed)) {
			this.clbSpeedRestrictionValueModified = speed;
			this.clbSpeedRestrictionAltitudeModified = altitude;
			return true;
		}
		this.showErrorMessage(FMCString.Scratchpad.Error.INVALID_ENTRY);
		return false;
	}

	shouldEngageSpeedRestriction() {
		return isFinite(this.clbSpeedRestrictionValue) && isFinite(this.clbSpeedRestrictionAltitude) && Simplane.getAltitude() <= this.clbSpeedRestrictionAltitude;
	}

	setSpeedTransition(input) {
		let inputSplit = input.split('/');
		let speed = parseInt(inputSplit[0]);
		let altitude = parseInt(inputSplit[1]);
		if (isFinite(speed) && isFinite(altitude)) {
			this.clbSpeedTransitionValue = speed;
			this.clbSpeedTransitionAltitude = altitude;
			return true;
		}
		this.showErrorMessage(FMCString.Scratchpad.Error.INVALID_ENTRY);
		return false;
	}

	shouldEngageSpeedTransition() {
		return isFinite(this.clbSpeedTransitionValue) && isFinite(this.clbSpeedTransitionAltitude) && Simplane.getAltitude() >= this.clbSpeedTransitionAltitude;
	}

	executeSpeedTransition() {
		this.clbSpeedTransitionValue = this.clbSpeedTransitionValueModified;
		this.clbSpeedTransitionAltitude = this.clbSpeedTransitionAltitudeModified;
		this.clbSpeedTransitionValueModified = NaN;
		this.clbSpeedTransitionAltitudeModified = NaN;
	}


	registerMainButtonsActions() {
		this.onInit = () => {
			Heavy_B747_8_FMC_InitRefIndexPage.ShowPage1(this);
		};
		this.onLegs = () => {
			Heavy_B747_8_FMC_LegsPage.ShowPage1(this);
		};
		this.onRte = () => {
			Heavy_B747_8_FMC_RoutePage.ShowPage1(this);
		};
		this.onDepArr = () => {
			Heavy_B747_8_FMC_DepArrIndexPage.ShowPage1(this);
		};
		this.onRad = () => {
			Heavy_B747_8_FMC_NavRadioPage.ShowPage(this);
		};
		this.onVNAV = () => {
			Heavy_B747_8_FMC_VNAVPage.shouldResolvePage = true;
			Heavy_B747_8_FMC_VNAVPage.ShowPage1(this);
		};

		this.onMenu = () => {
			new Heavy_B747_8_FMC_MenuPage().showPage(this);
		};

		this.onProg = () => {
			Heavy_B747_8_FMC_ProgPage.ShowPage1(this);
		};
		Heavy_B747_8_FMC_IdentPage.ShowPage1(this);
	}

	async tryUpdateIrsCoordinatesDisplay(newIrsCoordinatesDisplay) {
		if (!this.dataManager.IsValidLatLon(newIrsCoordinatesDisplay)) {
			this.showErrorMessage(this.defaultInputErrorMessage);
			return false;
		}
		await SimVar.SetSimVarValue(B748H_LocalVariables.IRS.POSITION_SET, 'Boolean', true);
		this.initCoordinates = newIrsCoordinatesDisplay;
		this.lastPos = this.initCoordinates;
		return true;
	}
}

FMCMainDisplay.clrValue = 'DELETE';

FMCMainDisplay.prototype.insertWaypointsAlongAirway = async function(lastWaypointIdent, index, airwayName, callback = EmptyCallback.Boolean) {
	let realIndex = index - 1;
	let referenceWaypoint = this.flightPlanManager.getWaypoint(realIndex);
	if (referenceWaypoint) {
		let infos = referenceWaypoint.infos;
		if (infos instanceof WayPointInfo) {
			let airway = infos.airways.find(a => { return a.name === airwayName; });
			if (airway) {
				let firstIndex = airway.icaos.indexOf(referenceWaypoint.icao);
				let lastWaypointIcao = airway.icaos.find(icao => { return icao.indexOf(lastWaypointIdent) !== -1; });
				let lastIndex = airway.icaos.indexOf(lastWaypointIcao);
				if (firstIndex >= 0) {
					if (lastIndex >= 0) {
						let inc = 1;
						if (lastIndex < firstIndex) {
							inc = -1;
						}
						let count = Math.abs(lastIndex - firstIndex);
						for (let i = 1; i < count + 1; i++) {
							let asyncInsertWaypointByIcao = async (icao, index) => {
								return new Promise(resolve => {
									this.flightPlanManager.addWaypoint(icao, index, () => {
										resolve();
									});
								});
							};
							await asyncInsertWaypointByIcao(airway.icaos[firstIndex + i * inc], realIndex + i);
						}
						return callback(true);
					}
					this.showErrorMessage("2ND INDEX NOT FOUND");
					return callback(false);
				}
				this.showErrorMessage("1ST INDEX NOT FOUND");
				return callback(false);
			}
			this.showErrorMessage("NO REF WAYPOINT");
			return callback(false);
		}
		this.showErrorMessage("NO WAYPOINT INFOS");
		return callback(false);
	}
	this.showErrorMessage("NO REF WAYPOINT");
	return callback(false);
}

registerInstrument('fmc-b747-8-main-display', Heavy_B747_8_FMC_MainDisplay);
