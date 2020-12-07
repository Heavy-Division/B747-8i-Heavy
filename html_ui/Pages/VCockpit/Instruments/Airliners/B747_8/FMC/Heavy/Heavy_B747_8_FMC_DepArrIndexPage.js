class Heavy_B747_8_FMC_DepArrIndexPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		let rowOrigin = [''];
		let origin = fmc.flightPlanManager.getOrigin();
		if (origin) {
			rowOrigin = ['<DEP', '', origin.ident];
			fmc.onLeftInput[0] = () => {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc);
			};
		}
		let rowDestination = [''];
		let destination = fmc.flightPlanManager.getDestination();
		if (destination) {
			rowDestination = ['', '<ARR', destination.ident];
			fmc.onRightInput[1] = () => {
				Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc);
			};
		}
		fmc.setTemplate([
			['DEP/ARR INDEX'],
			['', '', 'ACT FPLN'],
			rowOrigin,
			[''],
			rowDestination,
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			['']
		]);
	}

	static ShowArrivalPage(fmc, currentPage = 1) {
		fmc.clearDisplay();
		let destinationIdent = '';
		let destination = fmc.flightPlanManager.getDestination();
		if (destination) {
			destinationIdent = destination.ident;
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
		let approaches = [];
		let selectedApproach;
		let displayableApproachesCount = 0;
		let arrivals = [];
		let selectedArrival;
		let displayableArrivalsCount = 0;
		if (destination) {
			let airportInfo = destination.infos;
			if (airportInfo instanceof AirportInfo) {
				selectedApproach = airportInfo.approaches[fmc.flightPlanManager.getApproachIndex()];
				approaches = airportInfo.approaches;
				selectedArrival = airportInfo.arrivals[fmc.flightPlanManager.getArrivalProcIndex()];
				arrivals = airportInfo.arrivals;
			}
		}
		if (selectedApproach) {
			rows[0] = ['', '<SEL> ' + Avionics.Utils.formatRunway(selectedApproach.name)];
			fmc.onRightInput[0] = () => {
				fmc.setApproachIndex(-1, () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc);
				});
			};
			rows[1] = ['', 'TRANS'];
			let selectedTransitionIndex = fmc.flightPlanManager.getApproachTransitionIndex();
			let selectedTransition = selectedApproach.transitions[selectedTransitionIndex];
			if (selectedTransition) {
				rows[2] = ['', '<SEL> ' + selectedTransition.waypoints[0].infos.icao.substr(5)];
				fmc.onRightInput[1] = () => {
					fmc.setApproachTransitionIndex(-1, () => {
						fmc.activateRoute();
						Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc, currentPage);
					});
				};
			} else {
				for (let i = 0; i < 4; i++) {
					let index = i;
					let transition = selectedApproach.transitions[index];
					if (transition) {
						let name = transition.waypoints[0].infos.icao.substr(5);
						rows[2 * (i + 1)][1] = name;
						fmc.onRightInput[i + 1] = () => {
							fmc.setApproachTransitionIndex(index, () => {
								fmc.activateRoute();
								Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc, currentPage);
							});
						};
					}
				}
			}
		} else {
			let i = 0;
			let rowIndex = -5 * (currentPage - 1);
			while (i < approaches.length) {
				let approach = approaches[i];
				let appendRow = false;
				if (!selectedArrival) {
					appendRow = true;
					displayableApproachesCount++;
				} else {
					for (let j = 0; j < selectedArrival.runwayTransitions.length; j++) {
						if (selectedArrival.runwayTransitions[j].name.replace('RW', '') === approach.runway) {
							appendRow = true;
							displayableApproachesCount++;
							break;
						}
					}
					if (selectedArrival.runwayTransitions.length === 0) {
						appendRow = true;
						displayableApproachesCount++;
					}
				}
				if (appendRow) {
					if (rowIndex >= 0 && rowIndex < 5) {
						let ii = i;
						rows[2 * rowIndex] = ['', Avionics.Utils.formatRunway(approach.name)];
						fmc.onRightInput[rowIndex] = () => {
							fmc.setApproachIndex(ii, () => {
								fmc.activateRoute();
								Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc);
							});
						};
					}
					rowIndex++;
				}
				i++;
			}
		}
		if (selectedArrival) {
			rows[0][0] = selectedArrival.name + ' <SEL>';
			fmc.onLeftInput[0] = () => {
				fmc.setArrivalProcIndex(-1, () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc);
				});
			};
		} else {
			let i = 0;
			let rowIndex = -5 * (currentPage - 1);
			while (i < arrivals.length) {
				let arrival = arrivals[i];
				let appendRow = false;
				if (!selectedApproach) {
					appendRow = true;
					displayableArrivalsCount++;
				} else {
					for (let j = 0; j < arrival.runwayTransitions.length; j++) {
						if (arrival.runwayTransitions[j].name.replace('RW', '') === selectedApproach.runway) {
							appendRow = true;
							displayableArrivalsCount++;
							break;
						}
					}
					if (arrival.runwayTransitions.length === 0) {
						appendRow = true;
						displayableArrivalsCount++;
					}
				}
				if (appendRow) {
					if (rowIndex >= 0 && rowIndex < 5) {
						let ii = i;
						rows[2 * rowIndex][0] = arrival.name;
						fmc.onLeftInput[rowIndex] = () => {
							fmc.setArrivalProcIndex(ii, () => {
								fmc.activateRoute();
								Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc);
							});
						};
					}
					rowIndex++;
				}
				i++;
			}
		}
		let rowsCount = Math.max(displayableApproachesCount, displayableArrivalsCount);
		let pageCount = Math.floor(rowsCount / 5) + 1;
		fmc.setTemplate([
			[destinationIdent + ' ARRIVALS', currentPage.toFixed(0), pageCount.toFixed(0)],
			['STAR', 'APPROACH', 'RTE 1'],
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
				Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc, currentPage - 1);
			}
		};
		fmc.onNextPage = () => {
			if (currentPage < pageCount) {
				Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc, currentPage + 1);
			}
		};
	}
}
