/**
 * Used for selecting arrival
 */

class Heavy_B747_8_FMC_ArrivalsPage {

	constructor(fmc) {
		// Holds FMC
		this.fmc = fmc;
		// Holds destination
		this.destination = fmc.flightPlanManager.getDestination();
		this.destinationIdent = '';
		this.approaches = [];
		this.arrivals = [];

		// Holds active approach (runway + approach type)
		this.activeApproach = undefined;
		// Hold selected approach (runway + approach type)
		this.selectedApproach = undefined;

		// Holds active arrival (STAR)
		this.activeArrival = undefined;
		// Holds selected arrival (STAR)
		this.selectedArrival = undefined;

		this.selectedTransition = undefined;
		this.activeTransition = undefined;

		this.init();
	}

	init() {
		if (this.destination) {
			this.destinationIdent = this.destination.ident;
			let airportInfo = this.destination.infos;
			if (airportInfo instanceof AirportInfo) {
				this.selectedApproach = airportInfo.approaches[this.fmc.flightPlanManager.getApproachIndex()];
				this.approaches = airportInfo.approaches;
				this.selectedArrival = airportInfo.arrivals[this.fmc.flightPlanManager.getArrivalProcIndex()];
				this.arrivals = airportInfo.arrivals;
			}
		}

		if (this.selectedApproach) {
			let selectedTransitionIndex = this.fmc.flightPlanManager.getApproachTransitionIndex();
			this.selectedTransition = this.selectedApproach.transitions[selectedTransitionIndex];
		}
	}

	showPage(currentPage = 0) {
		this.fmc.clearDisplay();
		let rows = this.getEmptyRows();
		let approaches = [];
		let stars = [];
		let transitions = [];

		console.log("In 1")

		if (this.fmc.getIsRouteActivated()) {
			console.log("In 2")
			if(this.selectedApproach){
				console.log("In 3")
				if (this.selectedTransition) {
					console.log("In 4")
					let innerTransitions = this.selectedApproach.transitions;
					for (let i = 0; i < innerTransitions.length; i++) {
						console.log("In 5")
						console.log(innerTransitions[i].name)
						if (innerTransitions[i].name === this.selectedTransition.name) {
							console.log("In 6")
							transitions.push(i);
						}
					}
				} else {
					console.log("In 7")
					let innerTransitions = this.selectedApproach.transitions;
					for (let i = 0; i < innerTransitions.length; i++) {
						console.log("In 8")
						console.log(innerTransitions[i].name)
						transitions.push(i);
					}
				}
			}
			console.log("In 9")
			if (this.selectedArrival && this.selectedApproach) {
				console.log("In 10")
				stars.push(this.getOriginalStarIndex(this.selectedArrival));
				approaches.push(this.getOriginalApproachIndex(this.selectedApproach));
			} else if (this.selectedArrival && !this.selectedApproach) {
				console.log("In 11")
				stars.push(this.getOriginalStarIndex(this.selectedArrival));
				approaches = this.getAvailableApproaches(this.selectedArrival);
			} else if (!this.selectedArrival && this.selectedApproach) {
				console.log("In 12")
				approaches.push(this.getOriginalApproachIndex(this.selectedApproach));
				stars = this.getAvailableStars(this.selectedApproach);
			} else {
				console.log("In 13")
				approaches = this.getAvailableApproaches();
				stars = this.getAvailableStars();
			}
		} else {
			console.log("In 14")
			approaches = this.getAvailableApproaches();
			stars = this.getAvailableStars();
		}

		let approachRowIndex = 0;
		let starRowIndex = 0;
		let transitionRowIndex = 0;
		let rowsPerPage = 5;
		let pageCount = Math.floor((approaches.length > stars.length ? approaches.length : stars.length) / rowsPerPage) + 1;
		console.log("In 15")
		if(approaches.length === 1){
			console.log("In 16")
			pageCount = Math.floor((transitions.length + 2 > stars.length ? transitions.length + 2 : stars.length) / rowsPerPage) + 1;
		}
		let startIndex = currentPage * rowsPerPage;
		let endIndex = startIndex + rowsPerPage;
		console.log("In 17")
		/* Old Implementation
		for (let i = startIndex; (i < endIndex) && i < approaches.length; i++) {
			let index = i;

			if (this.activeApproach && this.activeApproach.name === this.approaches[approaches[index]].name) {
				rows[approachRowIndex * 2][1] = FMCString.Prompt.ACT_BOTH + ' ' + Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
			} else if (this.selectedApproach && this.selectedApproach.name === this.approaches[approaches[index]].name) {
				rows[approachRowIndex * 2][1] = FMCString.Prompt.SEL_BOTH + ' ' + Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
			} else {
				rows[approachRowIndex * 2][1] =  Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
			}

			this.handleRightInput(approachRowIndex, approaches[index]);
			approachRowIndex++;
		}
		*/

		/**
		 * New implementation approach
		 */

		if (this.activeApproach || this.selectedApproach) {
			console.log("In 18")
			rows[0] = ['', FMCString.Prompt.SEL_BOTH + ' ' + Avionics.Utils.formatRunway(this.approaches[approaches[0]].name)];
			this.handleRightInput(approachRowIndex, approaches[0]);
			rows[1] = ['', 'TRANS'];

			console.log("------------" + this.selectedTransition)

			if (this.selectedTransition) {
				console.log("In 19")
				rows[2] = ['', '<SEL> ' + this.selectedTransition.waypoints[0].infos.icao.substr(5)];
				/*
				fmc.onRightInput[1] = () => {
					fmc.setApproachTransitionIndex(-1, () => {
						fmc.activateRoute();
						Heavy_B747_8_FMC_DepArrIndexPage.ShowArrivalPage(fmc, currentPage);
					});
				};
				*/
			} else {
				console.log("In 20")
				console.log("ELSE transition")
				console.log("Transition lenght: " + transitions.length)
				for (let i = startIndex; (i < endIndex - 1) && i < transitions.length; i++) {
					console.log(i)
					console.log("In 21")
					let index = i;
					rows[transitionRowIndex * 2][1] = this.selectedApproach.transitions[transitions[index]].waypoints[0].infos.icao.substr(5);


					//this.handleRightInput(approachRowIndex, approaches[index]);
					transitionRowIndex++;
				}
				console.log("In 22")
				/*
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

				 */
			}
			console.log("In 23")
		} else {
			console.log("In 24")
			for (let i = startIndex; (i < endIndex) && i < approaches.length; i++) {
				console.log("In 25")
				let index = i;

				if (this.activeApproach && this.activeApproach.name === this.approaches[approaches[index]].name) {
					console.log("In 26")
					rows[approachRowIndex * 2][1] = FMCString.Prompt.ACT_BOTH + ' ' + Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
				} else if (this.selectedApproach && this.selectedApproach.name === this.approaches[approaches[index]].name) {
					console.log("In 27")
					rows[approachRowIndex * 2][1] = FMCString.Prompt.SEL_BOTH + ' ' + Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
				} else {
					console.log("In 28")
					rows[approachRowIndex * 2][1] = Avionics.Utils.formatRunway(this.approaches[approaches[index]].name);
				}
				console.log("In 29")
				this.handleRightInput(approachRowIndex, approaches[index]);
				approachRowIndex++;
			}
		}
		console.log("In 30")

		for (let i = startIndex; (i < endIndex) && i < stars.length; i++) {
			console.log("In 31")
			let index = i;

			if (this.activeArrival && this.activeArrival.name === this.arrivals[stars[index]].name) {
				rows[starRowIndex * 2][0] = this.arrivals[stars[index]].name + ' ' + FMCString.Prompt.ACT_BOTH;
			} else if (this.selectedArrival && this.selectedArrival.name === this.arrivals[stars[index]].name) {
				rows[starRowIndex * 2][0] = this.arrivals[stars[index]].name + ' ' + FMCString.Prompt.SEL_BOTH;
			} else {
				rows[starRowIndex * 2][0] = this.arrivals[stars[index]].name;
			}

			console.log("In 32")

			this.handleLeftInput(starRowIndex, stars[index]);

			starRowIndex++;
		}
		console.log("In 33")
		this.fmc.setTemplate([
			[this.destinationIdent + ' ARRIVALS', (currentPage + 1).toFixed(0), pageCount.toFixed(0)],
			['STAR', 'APPROACH', 'RTE 1'],
			...rows,
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.ROUTE_RIGHT]
		]);

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

	handleRightInput(rowIndex, approachIndex) {
		this.fmc.onRightInput[rowIndex] = () => {

			/*
			if (this.isRunwayAndDepartureCompatible() && (this.selectedDeparture || this.activeDeparture)) {
				let departureIndex = -1;
				if (this.activeDeparture) {
					departureIndex = this.getOriginalSidIndex(this.activeDeparture);
				}

				if (this.selectedDeparture) {
					departureIndex = this.getOriginalSidIndex(this.selectedDeparture);
				}

				this.fmc.setOriginRunwayIndex(approachIndex, () => {
					this.fmc.setDepartureIndex(departureIndex, () => {
						this.fmc.activateRoute();
						this.showPage();
					});
				});

			} else {
				this.fmc.setOriginRunwayIndex(approachIndex, () => {
					this.fmc.activateRoute();
					this.showPage();
				});
			}
			*/
			if (this.selectedApproach && this.selectedApproach.name === this.approaches[approachIndex].name) {
				this.fmc.setApproachIndex(-1, () => {
					this.fmc.activateRoute();
					this.selectedApproach = undefined;
					this.selectedTransition = undefined;
					this.showPage();
				}, -1);
			} else {
				this.fmc.setApproachIndex(approachIndex, () => {
					this.fmc.activateRoute();
					this.selectedApproach = this.approaches[approachIndex];
					this.selectedTransition = undefined;
					this.showPage();
				}, -1);
			}
		};
	}

	handleLeftInput(rowIndex, arrivalIndex) {
		this.fmc.onLeftInput[rowIndex] = () => {
			//this.selectedArrival = this.arrivals[arrivalIndex];
			/*
						if (this.isRunwayAndDepartureCompatible() && (this.selectedDepartureRunway || this.activeDepartureRunway)) {

							let rIndex = -1;
							if (this.activeDepartureRunway) {
								rIndex = this.getOriginalRunwayIndex(this.activeDepartureRunway);
							}
							if (this.selectedDepartureRunway) {
								rIndex = this.getOriginalRunwayIndex(this.selectedDepartureRunway);
							}

							this.fmc.setOriginRunwayIndex(rIndex, () => {
								this.fmc.setDepartureIndex(arrivalIndex, () => {
									this.fmc.activateRoute();
									this.showPage();
								});
							});
						} else {
							this.fmc.setRunwayIndex(-1, () => {
								this.fmc.setDepartureIndex(arrivalIndex, () => {
									this.selectedDeparture = this.departures[arrivalIndex];
									this.fmc.activateRoute();
									this.showPage();
								});
							});
						}
						*/

			if (this.selectedArrival && this.selectedArrival.name === this.arrivals[arrivalIndex].name) {
				this.fmc.setArrivalProcIndex(-1, () => {
					this.fmc.activateRoute();
					this.selectedArrival = undefined;
					this.showPage();
				});
			} else {
				this.fmc.setArrivalProcIndex(arrivalIndex, () => {
					this.fmc.activateRoute();
					this.selectedArrival = this.arrivals[arrivalIndex];
					this.showPage();
				});
			}
		};
	}

	getOriginalApproachIndex(approach) {
		let approaches = this.approaches;
		for (let i = 0; i < approaches.length; i++) {
			if (approaches[i].name === approach.name) {
				return i;
			}
		}
	}

	getOriginalStarIndex(star) {
		let stars = this.arrivals;
		for (let i = 0; i < stars.length; i++) {
			if (stars[i].name === star.name) {
				return i;
			}
		}
	}

	getAvailableApproaches(arrival = undefined) {
		let availableApproaches = [];
		if (!arrival) {
			return Array.from(this.approaches.keys());
		} else {
			return Array.from(this.approaches.keys());
		}
		/*
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
		 */
	}

	getAvailableStars(approach = undefined) {
		let availableStars = [];
		if (!approach) {
			return Array.from(this.arrivals.keys());
		} else {
			return Array.from(this.arrivals.keys());
		}
		/*
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
		*/
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
}

/*
class Heavy_B747_8_FMC_ArrivalsPageOld {
	static ShowPage(fmc, airport, pageCurrent = 0, starSelection = false, selectedStarIndex = -1) {
		let airportInfo = airport.infos;
		if (airportInfo instanceof AirportInfo) {
			fmc.clearDisplay();
			console.log(airport);
			let selectedApproachCell = FMCString.Line.Dash['3'];
			let selectedApproach = fmc.flightPlanManager.getApproach();
			console.log(selectedApproach);
			if (selectedApproach) {
				selectedApproachCell = Avionics.Utils.formatRunway(selectedApproach.name);
			}
			let selectedStarCell = FMCString.Line.Dash['6'];
			let selectedDeparture = airportInfo.arrivals[fmc.flightPlanManager.getArrivalProcIndex()];
			if (selectedDeparture) {
				selectedStarCell = selectedDeparture.name;
			}
			let selectedTransitionCell = 'NONE';
			let approaches = airportInfo.approaches;
			let rows = [[''], [''], [''], [''], [''], [''], [''], ['']];
			if (!starSelection) {
				for (let i = 0; i < 3; i++) {
					let index = i + pageCurrent;
					let approach = approaches[index];
					if (approach) {
						rows[2 * i] = ['←' + Avionics.Utils.formatRunway(approach.name) + '[color]blue', '4242M[color]blue'];
						rows[2 * i + 1] = ['042[color]blue'];
						fmc.onLeftInput[i + 2] = () => {
							fmc.setApproachIndex(index, () => {
								Heavy_B747_8_FMC_ArrivalsPage.ShowPage(fmc, airport, 0, true);
							});
						};
					}
				}
			} else {
				for (let i = 0; i < 3; i++) {
					let index = i + pageCurrent;
					let star = airportInfo.arrivals[index];
					if (star) {
						let color = 'blue';
						if (selectedStarIndex === index) {
							color = 'green';
						}
						rows[2 * i] = ['←' + star.name + '[color]' + color];
						rows[2 * i + 1] = ['042[color]' + color];
						fmc.onLeftInput[i + 2] = () => {
							Heavy_B747_8_FMC_ArrivalsPage.ShowPage(fmc, airport, 0, true, index);
						};
					}
				}
				rows[0][1] = 'NONE→[color]blue';
				fmc.onRightInput[2] = () => {
					fmc.setArrivalIndex(selectedStarIndex, -1, () => {
						Heavy_B747_8_FMC_LegsPage.ShowPage1(fmc);
					});
				};
				console.log(selectedApproach);
				for (let i = 0; i < 2; i++) {
					let index = i + pageCurrent;
					let transition = selectedApproach.transitions[index];
					if (transition) {
						let name = transition.waypoints[0].infos.icao.substr(5);
						rows[2 * (i + 1)][1] = name + '→[color]blue';
						fmc.onRightInput[i + 1 + 2] = () => {
							fmc.setArrivalIndex(selectedStarIndex, index, () => {
								Heavy_B747_8_FMC_LegsPage.ShowPage1(fmc);
							});
						};
					}
				}
			}
			fmc.setTemplate([
				['ARRIVAL TO ' + airport.ident + ' →'],
				['APPR', 'STAR', 'VIA'],
				[selectedApproachCell + '[color]green', selectedStarCell + '[color]green', 'NONE[color]green'],
				['', 'TRANS'],
				['', selectedTransitionCell + '[color]green'],
				[starSelection ? 'STAR' : 'APPR', starSelection ? 'TRANS' : '', 'AVAILABLE'],
				rows[0],
				rows[1],
				rows[2],
				rows[3],
				rows[4],
				rows[5],
				[FMCString.Prompt.RETURN_LEFT]
			]);
			fmc.onLeftInput[5] = () => {
				Heavy_B747_8_FMC_LegsPage.ShowPage1(fmc);
			};
			fmc.onPrevPage = () => {
				pageCurrent++;
				if (starSelection) {
					pageCurrent = Math.min(pageCurrent, airportInfo.arrivals.length - 3);
				} else {
					pageCurrent = Math.min(pageCurrent, airportInfo.approaches.length - 3);
				}
				if (pageCurrent < 0) {
					pageCurrent = 0;
				}
				Heavy_B747_8_FMC_ArrivalsPage.ShowPage(fmc, airport, pageCurrent, starSelection, selectedStarIndex);
			};
			fmc.onNextPage = () => {
				pageCurrent--;
				if (pageCurrent < 0) {
					pageCurrent = 0;
				}
				Heavy_B747_8_FMC_ArrivalsPage.ShowPage(fmc, airport, pageCurrent, starSelection, selectedStarIndex);
			};
		}
	}
}
*/