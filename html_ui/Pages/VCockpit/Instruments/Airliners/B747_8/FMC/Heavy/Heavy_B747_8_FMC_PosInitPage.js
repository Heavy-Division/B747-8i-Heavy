class Heavy_B747_8_FMC_PosInitPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();

		fmc.refreshPageCallback = function() {
			Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
		};

		let currPos = '';

		let isIrsInited = SimVar.GetSimVarValue('L:HEAVY_B747_8_IS_IRS_INITED', 'Number')

		if(isIrsInited > 100000){
			currPos = new LatLong(SimVar.GetSimVarValue('GPS POSITION LAT', 'degree latitude'), SimVar.GetSimVarValue('GPS POSITION LON', 'degree longitude')).toDegreeString();
		}

		console.log(currPos);
		let date = new Date();
		let dateString = date.getHours().toFixed(0).padStart(2, '0') + date.getMinutes().toFixed(0).padStart(2, '0') + 'z';
		let lastPos = '';
		if (fmc.lastPos) {
			lastPos = fmc.lastPos;
		}
		let refAirport = FMCString.Line.Box['4'];
		if (fmc.refAirport && fmc.refAirport.ident) {
			refAirport = fmc.refAirport.ident;
		}
		let refAirportCoordinates = '';
		if (fmc.refAirport && fmc.refAirport.infos && fmc.refAirport.infos.coordinates) {
			refAirportCoordinates = fmc.refAirport.infos.coordinates.toDegreeString();
		}
		let gate = FMCString.Line.Dash['5'];
		if (fmc.refGate) {
			gate = fmc.refGate;
		}
		let heading = '---°';
		if (fmc.refHeading) {
			heading = fmc.refHeading.toFixed(0).padStart(3, '0') + '°';
		}
		let irsPos = '□□□°□□.□ □□□□°□□.□';
		if (fmc.initCoordinates) {
			irsPos = fmc.initCoordinates;
		}
		fmc.setTemplate([
			['POS INIT', '1', '3'],
			['', 'LAST POS'],
			['', lastPos],
			['REF AIRPORT'],
			[refAirport, refAirportCoordinates],
			['GATE'],
			[gate],
			['UTC (GPS)', 'GPS POS'],
			[dateString, currPos],
			['SET HDG', 'SET IRS POS'],
			[heading, irsPos],
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.ROUTE_RIGHT]
		]);
		fmc.onRightInput[0] = () => {
			fmc.inOut = fmc.lastPos;
		};
		fmc.onLeftInput[1] = async () => {
			let value = fmc.inOut;
			fmc.inOut = '';
			if (await fmc.tryUpdateRefAirport(value)) {
				Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
			}
		};
		fmc.onRightInput[1] = () => {
			fmc.inOut = refAirportCoordinates;
		};
		fmc.onLeftInput[2] = async () => {
			let value = fmc.inOut;
			fmc.inOut = '';
			if (await fmc.tryUpdateGate(value)) {
				Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
			}
		};
		fmc.onRightInput[3] = () => {
			fmc.inOut = currPos;
		};
		fmc.onLeftInput[4] = async () => {
			let value = fmc.inOut;
			fmc.inOut = '';
			if (await fmc.tryUpdateHeading(value)) {
				Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
			}
		};
		fmc.onRightInput[4] = async () => {
			let value = fmc.inOut;
			fmc.inOut = '';
			if (await fmc.tryUpdateIrsCoordinatesDisplay(value)) {
				Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
			}
		};
		fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
		};
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage3(fmc);
		};
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage2(fmc);
		};
	}

	static ShowPage2(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			['POS REF', '2', '3'],
			['FMC POS (GPS L)', 'GS'],
			[''],
			['IRS(3)'],
			[''],
			['RNP/ACTUAL', 'DME DME'],
			[''],
			[''],
			[''],
			['-----------------', 'GPS NAV'],
			[FMCString.Prompt.PURGE_LEFT, FMCString.Prompt.INHIBIT_RIGHT],
			[''],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.BRG_DIST_RIGHT]
		]);
		fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
		};
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
		};
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage3(fmc);
		};
	}

	static ShowPage3(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			['POS REF', '3', '3'],
			['IRS L', 'GS'],
			['000°/0.0NM', '290KT'],
			['IRS C', 'GS'],
			['000°/0.0NM', '290KT'],
			['IRS R', 'GS'],
			['000°/0.0NM', '290KT'],
			['GPS L', 'GS'],
			['000°/0.0NM', '290KT'],
			['GPS R', 'GS'],
			['000°/0.0NM', '290KT'],
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.LAT_LON_RIGHT]
		]);
		fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
		};
		fmc.onPrevPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage2(fmc);
		};
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
		};
	}
}
