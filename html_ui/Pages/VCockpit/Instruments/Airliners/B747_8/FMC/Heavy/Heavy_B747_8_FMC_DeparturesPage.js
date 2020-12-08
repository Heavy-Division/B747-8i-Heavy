class Heavy_B747_8_FMC_DeparturesPage {

	static ShowPage2(fmc, currentPage = 1) {
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

		if ((selectedRunway && fmc.selectedRunway) || (selectedRunway && !fmc.activeRunway)) {
			rows[0] = ['', (fmc.getIsRouteActivated() ? FMCString.Prompt.SEL_BOTH : FMCString.Prompt.ACT_BOTH) + ' ' + Avionics.Utils.formatRunway(selectedRunway.designation)];
			fmc.onRightInput[0] = () => {
				fmc.setRunwayIndex(-1, (success) => {
					fmc.setSelectedRunway(undefined);
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
				if (!selectedDeparture || !fmc.selectedSID) {
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
						if (fmc.activeRunway && fmc.activeRunway.designation === runway.designation) {
							rows[2 * rowIndex] = ['', FMCString.Prompt.ACT_BOTH + ' ' + Avionics.Utils.formatRunway(runway.designation)];
						} else if (fmc.selectedRunway && fmc.selectedRunway.designation === runway.designation) {
							rows[2 * rowIndex] = ['', FMCString.Prompt.SEL_BOTH + ' ' + Avionics.Utils.formatRunway(runway.designation)];
						} else {
							rows[2 * rowIndex] = ['', Avionics.Utils.formatRunway(runway.designation)];
						}

						fmc.onRightInput[rowIndex] = () => {
							fmc.setSelectedRunway(runway);
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
		if ((selectedDeparture && fmc.selectedSID) || (selectedDeparture && !fmc.activeSID)) {
			rows[0][0] = selectedDeparture.name + (fmc.getIsRouteActivated() ? FMCString.Prompt.SEL_BOTH : FMCString.Prompt.ACT_BOTH);
			fmc.onLeftInput[0] = () => {
				fmc.setDepartureIndex(-1, () => {
					fmc.setSelectedSID(undefined);
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
				if (!selectedRunway || !fmc.selectedRunway) {
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
						if (fmc.activeSID && fmc.activeSID.name === departure.name) {
							rows[2 * rowIndex][0] = departure.name + ' ' + FMCString.Prompt.ACT_BOTH;
						} else if (fmc.selectedSID && fmc.selectedSID.name === departure.name) {
							rows[2 * rowIndex][0] = departure.name + ' ' + FMCString.Prompt.SEL_BOTH;
						} else {
							rows[2 * rowIndex][0] = departure.name;
						}
						fmc.onLeftInput[rowIndex] = () => {
							fmc.setSelectedSID(departure);
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
			if (currentPage > 1) {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, currentPage - 1);
			}
		};
		fmc.onNextPage = () => {
			if (currentPage < pageCount) {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, currentPage + 1);
			}
		};

		fmc.onExec = () => {
			fmc._isRouteActivated = false;
			SimVar.SetSimVarValue('L:FMC_EXEC_ACTIVE', 'number', 0);
			fmc.executeSelectedRunway();
			fmc.executeSelectedSID();
			Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, undefined);
		};
	}


	static ShowPage(fmc, currentPage = 0) {
		fmc.clearDisplay();
		let originIdent = '';
		let origin = fmc.flightPlanManager.getOrigin();
		let departureRunway = undefined;
		let selectedDeparture = undefined;
		if (origin) {
			let airportInfo = origin.infos;
			if (airportInfo instanceof AirportInfo) {
				originIdent = origin.ident;
				departureRunway = fmc.flightPlanManager.getDepartureRunway();
				selectedDeparture = airportInfo.departures[fmc.flightPlanManager.getDepartureProcIndex()];
			}
		}
		let rows = [
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', '']
		];
		let runways = [];
		let sids = [];

		//runways = Heavy_B747_8_FMC_DeparturesPage.getRunways(origin);

		if (!departureRunway) {
			sids = Heavy_B747_8_FMC_DeparturesPage.getSids(origin);
		} else {
			sids = Heavy_B747_8_FMC_DeparturesPage.getAvailableSids(origin, departureRunway);
		}

		if (!selectedDeparture) {
			runways = Heavy_B747_8_FMC_DeparturesPage.getRunways(origin);
		} else if (selectedDeparture && !departureRunway) {
			runways = Heavy_B747_8_FMC_DeparturesPage.getAvailableRunways(origin, selectedDeparture);
		} else if (departureRunway) {
			runways = [departureRunway];
		}

		let i;
		let runwayRowIndex = 0;
		let sidRowIndex = 0;
		let rowsPerPage = 5;
		let pageCount = Math.floor((runways.length > sids.length ? runways.length : sids.length) / rowsPerPage) + 1;
		let startIndex = currentPage * rowsPerPage;
		let endIndex = startIndex + rowsPerPage;
		for (i = startIndex; (i < endIndex) && i < runways.length; i++) {
			let index = i;
			rows[runwayRowIndex * 2][1] = Avionics.Utils.formatRunway(runways[index].designation);
			fmc.onRightInput[runwayRowIndex] = () => {
				fmc.setSelectedRunway(runways[index]);
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
			runwayRowIndex++;
		}

		for (i = startIndex; (i < endIndex) && i < sids.length; i++) {
			let index = i;
			if (fmc.activeSID && fmc.activeSID.name === sids[i].name) {
				rows[sidRowIndex * 2][0] = sids[i].name + ' ' + FMCString.Prompt.ACT_BOTH;
			} else if (fmc.selectedSID && fmc.selectedSID.name === sids[i].name) {
				rows[sidRowIndex * 2][0] = sids[i].name + ' ' + FMCString.Prompt.SEL_BOTH;
			} else {
				rows[sidRowIndex * 2][0] = sids[i].name;
			}

			//rows[sidRowIndex++ * 2][0] = sids[i].name + ' ' + FMCString.Prompt.SEL_BOTH;
			fmc.onLeftInput[sidRowIndex] = () => {
				console.log(sids[index].name);
				console.log(sids[index].name);
				fmc.setSelectedSID(sids[index]);
				fmc.setDepartureIndex(index, () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc);
				});
			};
			sidRowIndex++;
		}

		fmc.setTemplate([
			[originIdent + ' DEPARTURES', (currentPage + 1).toFixed(0), pageCount.toFixed(0)],
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
			if (currentPage + 1 < pageCount) {
				Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, currentPage + 1);
			}
		};
		/*
				fmc.onExec = () => {
					fmc._isRouteActivated = false;
					SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 0);
					fmc.executeSelectedRunway()
					fmc.executeSelectedSID()
					Heavy_B747_8_FMC_DeparturesPage.ShowPage(fmc, undefined);
				}
				*/
	}

	static getSids(origin) {
		if (origin) {
			let airportInfo = origin.infos;
			if (airportInfo instanceof AirportInfo) {
				return airportInfo.departures;
			}
		}
		return [];
	}

	static getRunways(origin) {
		if (origin) {
			let airportInfo = origin.infos;
			if (airportInfo instanceof AirportInfo) {
				return airportInfo.oneWayRunways;
			}
		}
		return [];
	}

	static getAvailableRunways(origin, sid) {
		let runways = [];
		let availableRunways = [];
		runways = this.getRunways(origin);
		for (let i = 0; i < runways.length; i++) {
			let index = i;
			for (let j = 0; j < sid.runwayTransitions.length; j++) {
				let index2 = j;
				if (sid.runwayTransitions[index2].name.indexOf(runways[index].designation) !== -1) {
					availableRunways.push(runways[index]);
					break;
				}
			}
		}
		return availableRunways;
	}

	static getAvailableSids(origin, runway) {
		let sids = [];
		let availableSids = [];
		sids = this.getSids(origin);
		for (let i = 0; i < sids.length; i++) {
			let index = i;
			for (let j = 0; j < sids[index].runwayTransitions.length; j++) {
				if (sids[index].runwayTransitions[j].name.indexOf(runway.designation) !== -1) {
					availableSids.push(sids[index]);
					break;
				}
			}
		}
		return availableSids;
	}

	static getOriginalSidIndex(origin, sid) {
		let sids = this.getSids(origin);
		for (let i; i < sids.length; i++) {
			if (sids[i].name === sid.name) {
				return i;
			}
		}
	}
}
