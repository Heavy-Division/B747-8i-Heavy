class Heavy_B747_8_FMC_VNAVPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		let crzAltCell = FMCString.Line.Box["5"];
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
		let speedTransCell = FMCString.Line.Dash["3"];
		let speed = fmc.getCrzManagedSpeed();
		if (isFinite(speed)) {
			speedTransCell = speed.toFixed(0);
		}
		speedTransCell += FMCString.Common.SLASH;
		if (isFinite(fmc.transitionAltitude)) {
			speedTransCell += fmc.transitionAltitude.toFixed(0);
		} else {
			speedTransCell += FMCString.Line.Dash["5"];
		}
		fmc.setTemplate([
			[FMCString.PageTitle.CLB, "1", "3"],
			[FMCString.LineTitle.CRZ_ALT],
			[crzAltCell],
			[FMCString.LineTitle.ECON_SPD],
			[],
			[FMCString.LineTitle.SPD_TRANS, FMCString.LineTitle.TRANS_ALT],
			[speedTransCell],
			[FMCString.LineTitle.SPD_RESTR],
			[],
			[],
			["", FMCString.Prompt.ENG_OUT_RIGHT],
			[],
			[]
		]);
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
		};
	}

	static ShowPage2(fmc) {
		fmc.clearDisplay();
		let crzAltCell = FMCString.Line.Box["5"];
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
		let n1Cell = "--%";
		let n1Value = fmc.getThrustClimbLimit();
		if (isFinite(n1Value)) {
			n1Cell = n1Value.toFixed(1) + "%";
		}
		fmc.setTemplate([
			[FMCString.PageTitle.CRZ, "2", "3"],
			[FMCString.LineTitle.CRZ_ALT, "STEP TO"],
			[crzAltCell],
			[FMCString.LineTitle.ECON_SPD, "AT"],
			[],
			["N1"],
			[n1Cell],
			["STEP", "RECMD", "OPT MAX"],
			[],
			["", "1X @ TOD"],
			["", "OFF"],
			["PAUSE @ TOD"],
			["OFF", "<LRC"]
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
		let speedTransCell = FMCString.Line.Dash["3"];
		let speed = fmc.getDesManagedSpeed();
		if (isFinite(speed)) {
			speedTransCell = speed.toFixed(0);
		}
		speedTransCell += "/10000";
		fmc.setTemplate([
			[FMCString.PageTitle.DES, "3", "3"],
			["E/D AT"],
			[],
			[FMCString.LineTitle.ECON_SPD],
			[],
			[FMCString.LineTitle.SPD_TRANS, "WPT/ALT"],
			[speedTransCell],
			[FMCString.LineTitle.SPD_RESTR],
			[],
			["PAUSE @ DIST FROM DEST"],
			["OFF", "FORECAST>"],
			[],
			["<OFFPATH DES"]
		]);
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage2(fmc);
		};
	}
}
