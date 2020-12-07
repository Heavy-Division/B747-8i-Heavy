class Heavy_B747_8_FMC_DeparturesPage {
	static ShowPage(fmc, currentPage = 1) {
		fmc.clearDisplay();
		let originIdent = '';
		let origin = fmc.flightPlanManager.getOrigin();
		if (origin) {
			originIdent = origin.ident;
		}
		let rows = [
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			['']
		];
		let runways = [];
		let displayableRunwaysCount = 0;
		let departures = [];
		let selectedDeparture;
		let displayableDeparturesCount = 0;
		let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
		if (origin) {
			let airportInfo = origin.infos;
			if (airportInfo instanceof AirportInfo) {
				let departureRunway = fmc.flightPlanManager.getDepartureRunway();
				if (departureRunway) {
					selectedRunway = departureRunway;
				}
				runways = airportInfo.oneWayRunways;
				selectedDeparture = airportInfo.departures[fmc.flightPlanManager.getDepartureProcIndex()];
				departures = airportInfo.departures;
			}
		}
		if (selectedRunway) {
			rows[0] = ['', '<SEL> ' + Avionics.Utils.formatRunway(selectedRunway.designation)];
			fmc.onRightInput[0] = () => {
				fmc.setRunwayIndex(-1, (success) => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc);
				});
			};
		} else {
			let i = 0;
			let rowIndex = -5 * (currentPage - 1);
			while (i < runways.length) {
				let runway = runways[i];
				let appendRow = false;
				let index = i;
				if (!selectedDeparture) {
					appendRow = true;
					displayableRunwaysCount++;
				} else {
					for (let j = 0; j < selectedDeparture.runwayTransitions.length; j++) {
						if (selectedDeparture.runwayTransitions[j].name.indexOf(runway.designation) !== -1) {
							appendRow = true;
							displayableRunwaysCount++;
							index = j;
							break;
						}
					}
				}
				if (appendRow) {
					if (rowIndex >= 0 && rowIndex < 5) {
						rows[2 * rowIndex] = ['', Avionics.Utils.formatRunway(runway.designation)];
						fmc.onRightInput[rowIndex] = () => {
							if (fmc.flightPlanManager.getDepartureProcIndex() === -1) {
								fmc.setOriginRunwayIndex(index, () => {
									fmc.activateRoute();
									Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, undefined);
								});
							} else {
								fmc.setRunwayIndex(index, () => {
									fmc.activateRoute();
									Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, undefined);
								});
							}
						};
					}
					rowIndex++;
				}
				i++;
			}
		}
		if (selectedDeparture) {
			rows[0][0] = selectedDeparture.name + ' <SEL>';
			fmc.onLeftInput[0] = () => {
				fmc.setDepartureIndex(-1, () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc);
				});
			};
		} else {
			let i = 0;
			let rowIndex = -5 * (currentPage - 1);
			while (i < departures.length) {
				let departure = departures[i];
				let appendRow = false;
				if (!selectedRunway) {
					appendRow = true;
					displayableDeparturesCount++;
				} else {
					for (let j = 0; j < departure.runwayTransitions.length; j++) {
						if (departure.runwayTransitions[j].name.indexOf(selectedRunway.designation) !== -1) {
							appendRow = true;
							displayableDeparturesCount++;
							break;
						}
					}
				}
				if (appendRow) {
					if (rowIndex >= 0 && rowIndex < 5) {
						let ii = i;
						rows[2 * rowIndex][0] = departure.name;
						fmc.onLeftInput[rowIndex] = () => {
							fmc.setDepartureIndex(ii, () => {
								fmc.activateRoute();
								Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc);
							});
						};
					}
					rowIndex++;
				}
				i++;
			}
		}
		let rowsCount = Math.max(displayableRunwaysCount, displayableDeparturesCount);
		let pageCount = Math.floor(rowsCount / 5) + 1;
		fmc.setTemplate([
			[originIdent + ' DEPARTURES', currentPage.toFixed(0), pageCount.toFixed(0)],
			['SIDS', 'RUNWAYS', 'RTE 1'],
			...rows,
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.ROUTE_RIGHT]
		]);
		fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_DepArrIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
		};
		fmc.onPrevPage = () => {
			if (currentPage > 0) {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, currentPage - 1);
			}
		};
		fmc.onNextPage = () => {
			if (currentPage < pageCount) {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, currentPage + 1);
			}
		};
	}
}
