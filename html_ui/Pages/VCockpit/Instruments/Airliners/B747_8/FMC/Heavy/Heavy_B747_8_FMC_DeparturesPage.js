class Heavy_B747_8_FMC_DeparturesPage {
	constructor(fmc) {
		// Holds FMC
		this.fmc = fmc;
		// Holds origin
		this.origin = fmc.flightPlanManager.getOrigin();
		this.originIdent = '';
		this.runways = [];
		this.departures = [];

		// Holds active runway
		this.activeDepartureRunway = undefined;
		// Hold selected runway
		this.selectedDepartureRunway = undefined;

		// Holds active departure
		this.activeDeparture = undefined;
		// Holds selected departure
		this.selectedDeparture = undefined;

		this.init();
	}

	init() {
		if (this.origin) {
			let airportInfo = this.origin.infos;
			if (airportInfo instanceof AirportInfo) {
				this.originIdent = this.origin.ident;
				this.runways = airportInfo.oneWayRunways;
				this.departures = airportInfo.departures;
				this.activeDepartureRunway = this.fmc.flightPlanManager.getDepartureRunway();
				this.activeDeparture = airportInfo.departures[this.fmc.flightPlanManager.getDepartureProcIndex()];
			}
		}
	}

	showPage(currentPage = 0) {
		this.fmc.clearDisplay();
		let runways = [];
		let sids = [];
		let rows = this.getEmptyRows();

		if (this.fmc.getIsRouteActivated()) {
			if (this.selectedDeparture && this.selectedDepartureRunway) {
				sids.push(this.getOriginalSidIndex(this.selectedDeparture));
				runways.push(this.getOriginalRunwayIndex(this.selectedDepartureRunway));
			} else if (this.selectedDeparture && !this.selectedDepartureRunway) {
				sids.push(this.getOriginalSidIndex(this.selectedDeparture));
				runways = this.getAvailableRunways(this.selectedDeparture);
			} else if (!this.selectedDeparture && this.selectedDepartureRunway) {
				runways.push(this.getOriginalRunwayIndex(this.selectedDepartureRunway));
				sids = this.getAvailableSids(this.selectedDepartureRunway);
			} else {
				sids = this.getAvailableSids();
				runways = this.getAvailableRunways();
			}
		} else {
			sids = this.getAvailableSids();
			runways = this.getAvailableRunways();
		}

		let runwayRowIndex = 0;
		let sidRowIndex = 0;
		let rowsPerPage = 5;
		let pageCount = Math.floor((runways.length > sids.length ? runways.length : sids.length) / rowsPerPage) + 1;
		let startIndex = currentPage * rowsPerPage;
		let endIndex = startIndex + rowsPerPage;

		for (let i = startIndex; (i < endIndex) && i < runways.length; i++) {
			let index = i;
			if (this.activeDepartureRunway && this.activeDepartureRunway.designation === this.runways[runways[index]].designation) {
				rows[runwayRowIndex * 2][1] = FMCString.Prompt.ACT_BOTH + ' ' + Avionics.Utils.formatRunway(this.runways[runways[index]].designation);
			} else if (this.selectedDepartureRunway && this.selectedDepartureRunway.designation === this.runways[runways[index]].designation) {
				rows[runwayRowIndex * 2][1] = FMCString.Prompt.SEL_BOTH + ' ' + Avionics.Utils.formatRunway(this.runways[runways[index]].designation);
			} else {
				rows[runwayRowIndex * 2][1] = Avionics.Utils.formatRunway(this.runways[runways[index]].designation);
			}

			this.handleRightInput(runwayRowIndex, runways[index]);

			runwayRowIndex++;
		}


		for (let i = startIndex; (i < endIndex) && i < sids.length; i++) {
			let index = i;
			if (this.activeDeparture && this.activeDeparture.name === this.departures[sids[index]].name) {
				rows[sidRowIndex * 2][0] = this.departures[sids[index]].name + ' ' + FMCString.Prompt.ACT_BOTH;
			} else if (this.selectedDeparture && this.selectedDeparture.name === this.departures[sids[index]].name) {
				rows[sidRowIndex * 2][0] = this.departures[sids[index]].name + ' ' + FMCString.Prompt.SEL_BOTH;
			} else {
				rows[sidRowIndex * 2][0] = this.departures[sids[index]].name;
			}

			this.handleLeftInput(sidRowIndex, sids[index]);

			sidRowIndex++;
		}

		this.fmc.setTemplate([
			[this.originIdent + ' DEPARTURES', (currentPage + 1).toFixed(0), pageCount.toFixed(0)],
			['SIDS', 'RUNWAYS', 'RTE 1'],
			...rows,
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.ROUTE_RIGHT]
		]);

		this.bindMainEvents();

		this.fmc.onPrevPage = () => {
			if (currentPage > 0) {
				this.showPage(currentPage - 1);
			}
		};
		this.fmc.onNextPage = () => {
			if (currentPage + 1 < pageCount) {
				this.showPage(currentPage + 1);
			}
		};
	}

	handleRightInput(rowIndex, runwayIndex) {
		this.fmc.onRightInput[rowIndex] = () => {
			this.selectedDepartureRunway = this.runways[runwayIndex];
			if (this.isRunwayAndDepartureCompatible() && (this.selectedDeparture || this.activeDeparture)) {

				let departureIndex = -1;
				if (this.activeDeparture) {
					departureIndex = this.getOriginalSidIndex(this.activeDeparture);
				}

				if (this.selectedDeparture) {
					departureIndex = this.getOriginalSidIndex(this.selectedDeparture);
				}

				this.fmc.setOriginRunwayIndex(runwayIndex, () => {
					this.fmc.setDepartureIndex(departureIndex, () => {
						this.fmc.activateRoute();
						this.showPage();
					});
				});

			} else {
				this.fmc.setOriginRunwayIndex(runwayIndex, () => {
					this.fmc.activateRoute();
					this.showPage();
				});
			}
		};
	}

	handleLeftInput(rowIndex, departureIndex) {
		this.fmc.onLeftInput[rowIndex] = () => {
			this.selectedDeparture = this.departures[departureIndex];

			if (this.isRunwayAndDepartureCompatible() && (this.selectedDepartureRunway || this.activeDepartureRunway)) {

				let rIndex = -1;
				if (this.activeDepartureRunway) {
					rIndex = this.getOriginalRunwayIndex(this.activeDepartureRunway);
				}
				if (this.selectedDepartureRunway) {
					rIndex = this.getOriginalRunwayIndex(this.selectedDepartureRunway);
				}

				this.fmc.setOriginRunwayIndex(rIndex, () => {
					this.fmc.setDepartureIndex(departureIndex, () => {
						this.fmc.activateRoute();
						this.showPage();
					});
				});
			} else {
				this.fmc.setRunwayIndex(-1, () => {
					this.fmc.setDepartureIndex(departureIndex, () => {
						this.selectedDeparture = this.departures[departureIndex];
						this.fmc.activateRoute();
						this.showPage();
					});
				});
			}
		};
	}

	isRunwayAndDepartureCompatible() {
		let runway;
		let departureIndex;
		if (!this.selectedDeparture && !this.activeDeparture) {
			return true;
		}

		if (!this.selectedDepartureRunway && !this.activeDepartureRunway) {
			return true;
		}

		if (this.activeDeparture) {
			departureIndex = this.getOriginalSidIndex(this.activeDeparture);
		}

		if (this.selectedDeparture) {
			departureIndex = this.getOriginalSidIndex(this.selectedDeparture);
		}

		if (this.activeDepartureRunway) {
			runway = this.activeDepartureRunway;
		}

		if (this.selectedDepartureRunway) {
			runway = this.selectedDepartureRunway;
		}

		if (!runway) {
			return false;
		}

		for (let i = 0; i < this.departures[departureIndex].runwayTransitions.length; i++) {
			if (this.departures[departureIndex].runwayTransitions[i].name.indexOf(runway.designation) !== -1) {
				return true;
			}
		}
		return false;
	}

	bindMainEvents() {
		this.fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_DepArrIndexPage.ShowPage1(this.fmc);
		};
		this.fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_RoutePage.ShowPage1(this.fmc);
		};

		this.fmc.onExec = () => {
			if (this.fmc.getIsRouteActivated()) {
				this.fmc.insertTemporaryFlightPlan(() => {
					this.fmc._isRouteActivated = false;
					this.updateDepartureAndRunwayVariables();
					SimVar.SetSimVarValue('L:FMC_EXEC_ACTIVE', 'number', 0);
					this.showPage();
				});
				if (this.fmc.refreshPageCallback) {
					this.fmc.refreshPageCallback();
				}
			}
		};
	}

	getEmptyRows() {
		return [
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
	}

	getAvailableRunways(sid = undefined) {
		let availableRunways = [];
		if (!sid) {
			return Array.from(this.runways.keys());
		}
		for (let i = 0; i < this.runways.length; i++) {
			let index = i;
			for (let j = 0; j < sid.runwayTransitions.length; j++) {
				if (sid.runwayTransitions[j].name.indexOf(this.runways[index].designation) !== -1) {
					availableRunways.push(index);
					break;
				}
			}
		}
		return availableRunways;
	}

	getAvailableSids(runway = undefined) {
		let availableSids = [];
		if (!runway) {
			return Array.from(this.departures.keys());
		}
		for (let i = 0; i < this.departures.length; i++) {
			let index = i;
			for (let j = 0; j < this.departures[index].runwayTransitions.length; j++) {
				if (this.departures[index].runwayTransitions[j].name.indexOf(runway.designation) !== -1) {
					availableSids.push(index);
					break;
				}
			}
		}
		return availableSids;
	}

	getOriginalRunwayIndex(runway) {
		let runways = this.runways;
		for (let i = 0; i < runways.length; i++) {
			if (runways[i].designation === runway.designation) {
				return i;
			}
		}
	}

	getOriginalSidIndex(sid) {
		let sids = this.departures;
		for (let i = 0; i < sids.length; i++) {
			if (sids[i].name === sid.name) {
				return i;
			}
		}
	}

	updateDepartureAndRunwayVariables() {
		if (this.origin) {
			let airportInfo = this.origin.infos;
			if (airportInfo instanceof AirportInfo) {
				this.activeDepartureRunway = this.fmc.flightPlanManager.getDepartureRunway();
				this.activeDeparture = this.departures[this.fmc.flightPlanManager.getDepartureProcIndex()];
			}
		}

		this.selectedDepartureRunway = undefined;
		this.selectedDeparture = undefined;
	}
}