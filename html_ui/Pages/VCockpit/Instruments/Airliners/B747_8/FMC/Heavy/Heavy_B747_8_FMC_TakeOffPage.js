class Heavy_B747_8_FMC_TakeOffPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		fmc.updateVSpeeds();
		Heavy_B747_8_FMC_TakeOffPage._timer = 0;
		fmc.pageUpdate = () => {
			Heavy_B747_8_FMC_TakeOffPage._timer++;
			if (Heavy_B747_8_FMC_TakeOffPage._timer >= 15) {
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			}
		};
		let v1 = '---[color]blue';
		if (fmc.v1Speed) {
			v1 = fmc.v1Speed + 'KT[color]blue';
		}
		fmc.onRightInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.v1Speed = undefined;
				SimVar.SetSimVarValue('L:AIRLINER_V1_SPEED', 'Knots', -1);
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else if (value === '') {
				fmc._computeV1Speed();
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else {
				if (fmc.trySetV1Speed(value)) {
					Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let vR = '---[color]blue';
		if (fmc.vRSpeed) {
			vR = fmc.vRSpeed + 'KT[color]blue';
		}
		fmc.onRightInput[1] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.vRSpeed = undefined;
				SimVar.SetSimVarValue('L:AIRLINER_VR_SPEED', 'Knots', -1);
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else if (value === '') {
				fmc._computeVRSpeed();
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else {
				if (fmc.trySetVRSpeed(value)) {
					Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let v2 = '---[color]blue';
		if (fmc.v2Speed) {
			v2 = fmc.v2Speed + 'KT[color]blue';
		}
		fmc.onRightInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.v2Speed = undefined;
				SimVar.SetSimVarValue('L:AIRLINER_V2_SPEED', 'Knots', -1);
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else if (value === '') {
				fmc._computeV2Speed();
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			} else {
				if (fmc.trySetV2Speed(value)) {
					Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let flapsCell = '---';
		let flapsAngle = fmc.getTakeOffFlap();
		if (isFinite(flapsAngle) && flapsAngle >= 0) {
			flapsCell = flapsAngle.toFixed(0) + '°';
		} else {
			flapsCell = '□□°';
		}
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.setTakeOffFlap(value)) {
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			}
		};
		let thrRedCell = '';
		if (isFinite(fmc.thrustReductionAltitude)) {
			thrRedCell = fmc.thrustReductionAltitude.toFixed(0);
		} else {
			thrRedCell = '---';
		}
		thrRedCell += 'FT[color]blue';
		fmc.onLeftInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.trySetThrustReductionAccelerationAltitude(value)) {
				Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
			}
		};
		let runwayCell = '---';
		let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
		if (selectedRunway) {
			runwayCell = 'RW ' + Avionics.Utils.formatRunway(selectedRunway.designation);
		}
		let cgCell = '--%';
		if (isFinite(fmc.zeroFuelWeightMassCenter)) {
			cgCell = fmc.zeroFuelWeightMassCenter.toFixed(0) + '%';
		}
		fmc.onRightInput[3] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.setZeroFuelCG(value, (result) => {
				if (result) {
					Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
				}
			});
		};
		let trimCell = '';
		if (isFinite(fmc.takeOffTrim)) {
			trimCell = fmc.takeOffTrim.toFixed(1);
		}
		fmc.setTemplate([
			['TAKE OFF'],
			['FLAPS', 'V1'],
			[flapsCell, v1],
			['E/O ACCEL HT', 'VR'],
			['000FT', vR],
			['THR REDUCTION', 'V2'],
			[thrRedCell, v2],
			['WIND/SLOPE', 'CG', 'TRIM'],
			['H00/U0.0', cgCell, trimCell],
			['RW COND', 'POS'],
			['DRY', runwayCell],
			['__FMCSEPARATOR'],
			['<INDEX', 'THRUST LIM>']
		]);
		fmc.onLeftInput[5] = () => {
			B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_ThrustLimPage.ShowPage1(fmc);
		};
	}
}

Heavy_B747_8_FMC_TakeOffPage._timer = 0;
