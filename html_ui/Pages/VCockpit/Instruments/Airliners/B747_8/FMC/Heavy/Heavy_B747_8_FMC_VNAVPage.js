class Heavy_B747_8_FMC_VNAVPage {

	static get shouldResolvePage(){
		return this._shouldResolvePage;
	}

	static set shouldResolvePage(value){
		this._shouldResolvePage = value;
	}
	static pageResolver(fmc){
		Heavy_B747_8_FMC_VNAVPage.shouldResolvePage = false;
		if (fmc.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CRUISE){
			Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
		} else if (fmc.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_DESCENT){
			Heavy_B747_8_FMC_VNAVPage.ShowPage3(fmc);
		} else {
			Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
		}
	}

	static ShowPage1(fmc) {
		if(Heavy_B747_8_FMC_VNAVPage.shouldResolvePage){
			Heavy_B747_8_FMC_VNAVPage.pageResolver(fmc);
		} else {
			fmc.clearDisplay();
			let crzAltCell = FMCString.Line.Box['5'];
			if (fmc.cruiseFlightLevel) {
				crzAltCell = FMCString.Common.FLIGHT_LEVEL + fmc.cruiseFlightLevel;
			}
			fmc.onLeftInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (fmc.setCruiseFlightLevelAndTemperature(value)) {
					Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
				}
			};
			fmc.onLeftInput[3] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (value === FMCMainDisplay.clrValue){
					fmc.clbSpeedRestrictionValueModified = NaN;
					fmc.clbSpeedRestrictionAltitudeModified = NaN
					fmc.clbSpeedRestrictionValue = NaN
					fmc.clbSpeedRestrictionAltitude = NaN
				} else {
					if (fmc.setSpeedRestriction(value)) {
						//SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 1);
						if (isFinite(fmc.clbSpeedRestrictionValueModified) && isFinite(fmc.clbSpeedRestrictionAltitudeModified)) {
							fmc.executeSpeedRestriction();
						}
						Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
					}
				}
			};

			fmc.onRightInput[2] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				let altitude = HeavyInputUtils.inputToAltitude(value);
				if (altitude) {
					fmc.trySetTransAltitude(altitude);
				}
				Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
			};
			/*
					fmc.onLeftInput[2] = () => {
						let value = fmc.inOut;
						fmc.clearUserInput();
						if (fmc.setSpeedTransition(value)) {
							if (isFinite(fmc.clbSpeedTransitionValueModified) && isFinite(fmc.clbSpeedTransitionAltitudeModified)) {
								fmc.executeSpeedTransition();
							}
							Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
						}
					};
			*/
			/*
					fmc.onExec = () => {
						if(isFinite(fmc.clbSpeedRestrictionValueModified) && isFinite(fmc.clbSpeedRestrictionAltitudeModified)){
							fmc.executeSpeedRestriction()
						}
						Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
						SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 0);
					};
			*/
			fmc.refreshPageCallback = () => {
				Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
			};

			let speedTransCell = FMCString.Line.Dash['3'];

			let speed = '';
			let altitude = '';
			if (isFinite(fmc.clbSpeedTransitionValue) && isFinite(fmc.clbSpeedTransitionAltitude)) {
				speed = fmc.clbSpeedTransitionValue.toFixed(0);
				altitude = fmc.clbSpeedTransitionAltitude.toFixed(0);
			} else if (isFinite(fmc.getCrzManagedSpeed())) {
				speed = fmc.getCrzManagedSpeed();
				altitude = 10000;
			}
			speedTransCell = speed + FMCString.Common.SLASH + altitude;

			let speedRestrictionCell = FMCString.Line.Dash['3'] + FMCString.Common.SLASH + FMCString.Line.Dash['5'];

			if (isFinite(fmc.clbSpeedRestrictionValue) && isFinite(fmc.clbSpeedRestrictionAltitude)) {
				speedRestrictionCell = fmc.clbSpeedRestrictionValue + FMCString.Common.SLASH + fmc.clbSpeedRestrictionAltitude;
			}

			if (isFinite(fmc.clbSpeedRestrictionValueModified) && isFinite(fmc.clbSpeedRestrictionAltitudeModified)) {
				speedRestrictionCell = fmc.clbSpeedRestrictionValueModified + FMCString.Common.SLASH + fmc.clbSpeedRestrictionAltitudeModified;
			}

			let pageTitle = '';

			if (isFinite(fmc.clbSpeedRestrictionValueModified) || isFinite(fmc.clbSpeedRestrictionAltitudeModified)) {
				pageTitle += FMCString.PageTitle.MOD + ' ';
			} else {
				if (fmc.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB) {
					pageTitle += FMCString.PageTitle.ACT + ' ';
				}
			}

			if (isFinite(fmc.clbSpeedRestrictionValue) && isFinite(fmc.clbSpeedRestrictionAltitude) && fmc.shouldEngageSpeedRestriction()) {
				pageTitle += ' ' + fmc.clbSpeedRestrictionValue + 'KT ';
			} else {
				pageTitle += ' ' + fmc.getClbManagedSpeed().toFixed(0) + 'KT ';
			}

			pageTitle += FMCString.PageTitle.CLB;

			let alt = fmc.transitionAltitude.toFixed(0);

			fmc.setTemplate([
				[pageTitle, '1', '3'],
				[FMCString.LineTitle.CRZ_ALT],
				[crzAltCell],
				[FMCString.LineTitle.ECON_SPD],
				[],
				[FMCString.LineTitle.SPD_TRANS, FMCString.LineTitle.TRANS_ALT],
				[speedTransCell, alt],
				[FMCString.LineTitle.SPD_RESTR],
				[speedRestrictionCell],
				[],
				['', FMCString.Prompt.ENG_OUT_RIGHT],
				[],
				[]
			]);
			fmc.onNextPage = () => {
				Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
			};
		}

	}

	static ShowPage2(fmc) {
		fmc.clearDisplay();
		let crzAltCell = FMCString.Line.Box['5'];
		if (fmc.cruiseFlightLevel) {
			crzAltCell = FMCString.Common.FLIGHT_LEVEL + fmc.cruiseFlightLevel;
		}
		fmc.onRightInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.setCruiseFlightLevelAndTemperature(value)) {
				Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
			}
		};
		let n1Cell = '--%';
		let n1Value = fmc.getThrustClimbLimit();
		if (isFinite(n1Value)) {
			n1Cell = n1Value.toFixed(1) + '%';
		}
		fmc.setTemplate([
			[FMCString.PageTitle.CRZ, '2', '3'],
			[FMCString.LineTitle.CRZ_ALT, 'STEP TO'],
			[crzAltCell],
			[FMCString.LineTitle.ECON_SPD, 'AT'],
			[],
			['N1'],
			[n1Cell],
			['STEP', 'RECMD', 'OPT MAX'],
			[],
			['', '1X @ TOD'],
			['', 'OFF'],
			['PAUSE @ TOD'],
			['OFF', '<LRC']
		]);
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage1(fmc);
		};
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage3(fmc);
		};
	}

	static ShowPage3(fmc) {
		fmc.clearDisplay();
		let speedTransCell = FMCString.Line.Dash['3'];
		let speed = fmc.getDesManagedSpeed();
		if (isFinite(speed)) {
			speedTransCell = speed.toFixed(0);
		}
		speedTransCell += '/10000';
		fmc.setTemplate([
			[FMCString.PageTitle.DES, '3', '3'],
			['E/D AT'],
			[],
			[FMCString.LineTitle.ECON_SPD],
			[],
			[FMCString.LineTitle.SPD_TRANS, 'WPT/ALT'],
			[speedTransCell],
			[FMCString.LineTitle.SPD_RESTR],
			[],
			['PAUSE @ DIST FROM DEST'],
			['OFF', FMCString.Prompt.FORECAST_RIGHT],
			[],
			[FMCString.Prompt.OFFPATH_DES_LEFT]
		]);
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
		};
	}
}
