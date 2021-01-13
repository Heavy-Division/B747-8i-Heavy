class Heavy_B747_8_FMC_PerfInitPage {
	static ShowPage1(fmc) {
		fmc.updateFuelVars().then(() => {
			fmc.clearDisplay();
			Heavy_B747_8_FMC_PerfInitPage._timer = 0;
			fmc.pageUpdate = () => {
				Heavy_B747_8_FMC_PerfInitPage._timer++;
				if (Heavy_B747_8_FMC_PerfInitPage._timer >= 15) {
					Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
				}
			};
			let grossWeightCell = FMCString.Line.Box['3'] + FMCString.Common.PERIOD + FMCString.Line.Box['1'];
			if (isFinite(fmc.getFuelVarsUpdatedGrossWeight(true))) {
				grossWeightCell = fmc.getFuelVarsUpdatedGrossWeight(true).toFixed(1) + ' lb';
			}
			fmc.onLeftInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				fmc.setWeight(value, result => {
					if (result) {
						Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
					}
				}, true);
			};
			let crzAltCell = FMCString.Line.Box['5'];
			if (isFinite(fmc.cruiseFlightLevel)) {
				if (fmc.cruiseFlightLevel * 100 >= fmc.transitionAltitude) {
					crzAltCell = FMCString.Common.FLIGHT_LEVEL + fmc.cruiseFlightLevel.toFixed(0);
				} else {
					crzAltCell = fmc.cruiseFlightLevel * 100 + '';
				}
			}
			fmc.onRightInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (fmc.setCruiseFlightLevelAndTemperature(value)) {
					Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
				}
			};
			let blockFuelCell = FMCString.Line.Box['3'] + FMCString.Common.PERIOD + FMCString.Line.Box['1'];
			if (isFinite(fmc.getBlockFuel(true))) {
				blockFuelCell = fmc.getBlockFuel(true).toFixed(1) + ' lb';
			}
			let zeroFuelWeightCell = FMCString.Line.Box['3'] + FMCString.Common.PERIOD + FMCString.Line.Box['1'];
			if (isFinite(fmc.getZeroFuelWeight(true))) {
				zeroFuelWeightCell = fmc.getZeroFuelWeight(true).toFixed(1) + ' lb';
			}
			fmc.onLeftInput[2] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (fmc.trySetZeroFuelWeightZFWCG(value, true)) {
					Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
				}
			};
			let costIndex = FMCString.Line.Box['4'];
			if (isFinite(fmc.costIndex)) {
				costIndex = fmc.costIndex.toFixed(0);
			}
			fmc.onRightInput[1] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (fmc.tryUpdateCostIndex(value, 10000)) {
					Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
				}
			};
			let reservesCell = FMCString.Line.Box['3'] + FMCString.Common.PERIOD + FMCString.Line.Box['1'];
			let reserves = fmc.getFuelReserves();
			if (isFinite(reserves)) {
				reservesCell = reserves.toFixed(1) + ' lb';
			}
			fmc.onLeftInput[3] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				if (fmc.setFuelReserves(value, true)) {
					Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
				}
			};
			fmc.setTemplate([
				['PERF INIT'],
				['GR WT', 'CRZ ALT'],
				[grossWeightCell, crzAltCell],
				['FUEL', 'COST INDEX'],
				[blockFuelCell, costIndex],
				['ZFW', 'MIN FUEL TEMP'],
				[zeroFuelWeightCell, '-37°c'],
				['RESERVES', 'CRZ CG'],
				[reservesCell, '20.0%'],
				['DATA LINK', 'STEP SIZE'],
				['NO COMM', 'RVSM'],
				[FMCString.Common.FMC_SEPARATOR],
				[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.THRUST_LIM_RIGHT]
			]);
			fmc.onLeftInput[5] = () => {
				B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
			};
			fmc.onRightInput[5] = () => {
				Heavy_B747_8_FMC_ThrustLimPage.ShowPage1(fmc);
			};
		});
	}
}

Heavy_B747_8_FMC_PerfInitPage._timer = 0;