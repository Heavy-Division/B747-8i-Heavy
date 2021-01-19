class Heavy_B747_8_FMC_RoutePage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		let originCell = FMCString.Line.Box['4'];
		if (fmc && fmc.flightPlanManager) {
			let origin = fmc.flightPlanManager.getOrigin();
			if (origin) {
				originCell = origin.ident;
			} else if (fmc.tmpOrigin) {
				originCell = fmc.tmpOrigin;
			}
		}
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.updateRouteOrigin(value, (result) => {
				if (result) {
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				}
			});
		};
		let destinationCell = FMCString.Line.Box['4'];
		if (fmc && fmc.flightPlanManager) {
			let destination = fmc.flightPlanManager.getDestination();
			if (destination) {
				destinationCell = destination.ident;
			} else if (fmc.tmpDestination) {
				destinationCell = fmc.tmpDestination;
			}
		}
		fmc.onRightInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.updateRouteDestination(value, (result) => {
				if (result) {
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				}
			});
		};
		let flightNoCell = FMCString.Line.Dash['8'];
		let flightNoValue = SimVar.GetSimVarValue('ATC FLIGHT NUMBER', 'string');
		if (flightNoValue) {
			flightNoCell = flightNoValue;
		}
		fmc.onRightInput[1] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.updateFlightNo(value, (result) => {
				if (result) {
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				}
			});
		};
		let coRouteCell = FMCString.Line.Dash['8'];
		if (fmc.coRoute) {
			coRouteCell = fmc.coRoute;
		}
		fmc.onRightInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.updateCoRoute(value, (result) => {
				if (result) {
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				}
			});
		};
		let allRows = Heavy_B747_8_FMC_RoutePage._GetAllRows(fmc);
		let pageCount = (Math.floor(allRows.length / 4) + 2);
		let activateCell = '';
		if (fmc.flightPlanManager.getCurrentFlightPlanIndex() === 1) {
			if (!fmc.getIsRouteActivated()) {
				activateCell = FMCString.Prompt.ACTIVATE_RIGHT;
				fmc.onRightInput[5] = () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				};
			}
		}
		if (activateCell === '') {
			activateCell = FMCString.Prompt.PERF_INIT_RIGHT;
			fmc.onRightInput[5] = () => {
				fmc.activateRoute();
				FMCPerfInitPage.ShowPage1(fmc);
			};
		}
		let runwayCell = '';
		let runway = fmc.flightPlanManager.getDepartureRunway();
		if (runway) {
			runwayCell = Avionics.Utils.formatRunway(runway.designation);
		}
		fmc.onLeftInput[1] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.setOriginRunway(value, (result) => {
				if (result) {
					fmc._computeV1Speed();
					fmc._computeVRSpeed();
					fmc._computeV2Speed();
					Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
				}
			});
		};
		fmc.setTemplate([
			['RTE 1', '1', pageCount.toFixed(0)],
			['ORIGIN', 'DEST'],
			[originCell, destinationCell],
			['RUNWAY', 'FLT NO'],
			[runwayCell, flightNoCell],
			['REQUEST', 'CO ROUTE'],
			[FMCString.Prompt.SEND_LEFT, coRouteCell],
			[FMCString.Common.FMC_SEPARATOR],
			[''],
			[''],
			[''],
			[''],
			[FMCString.Prompt.RTE_2_LEFT, activateCell]
		]);
		fmc.onNextPage = () => {
			Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc);
		};
	}

	static ShowPage2(fmc, offset = 0, pendingAirway, discontinuity = -1) {
		fmc.clearDisplay();
		let rows = [[FMCString.Line.Dash['4']], [''], [''], [''], ['']];
		let allRows = Heavy_B747_8_FMC_RoutePage._GetAllRows(fmc);
		let page = (2 + (Math.floor(offset / 4)));
		let pageCount = (Math.floor(allRows.length / 4) + 2);
		let showInput = false;
		let discontinued = false;
		if (discontinuity >= allRows.length) {
			discontinuity = -1;
		}
		for (let i = 0; i < rows.length; i++) {
			let ii = i + offset + (discontinued ? -1 : 0);
			if (allRows[ii]) {
				rows[i] = [allRows[ii][0], allRows[ii][1]];
				let waypointFlightPlanIndex = ii + fmc.flightPlanManager.getDepartureWaypointsCount() + (fmc.flightPlanManager.getDepartureProcIndex() > -1 ? 0 : 1);
				if (!discontinued && i + offset === discontinuity) {
					rows[i] = [FMCString.Line.Dash['5'], FMCString.Line.Dash['5']];
					discontinued = true;
					fmc.onRightInput[i] = () => {
						let value = fmc.inOut;
						if (value.length > 0) {
							fmc.clearUserInput();
							fmc.insertWaypoint(value, waypointFlightPlanIndex, () => {
								Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset);
							});
						}
					};
				} else {
					fmc.onLeftInput[i] = () => {
						let value = fmc.inOut;
						if (value === 'DELETE') {
							fmc.inOut = '';
							let toDelete = allRows[ii][2] + fmc.flightPlanManager.getDepartureWaypointsCount() + (fmc.flightPlanManager.getDepartureProcIndex() > -1 ? 0 : 1);
							let count = allRows[ii][3];

							let departure = fmc.flightPlanManager.getDeparture();
							let lastDepartureWaypoint;
							if (departure) {
								let departureWaypoints = fmc.flightPlanManager.getDepartureWaypointsMap();
								lastDepartureWaypoint = departureWaypoints[departureWaypoints.length - 1];
								if (lastDepartureWaypoint && allRows[ii][1] === lastDepartureWaypoint.ident) {
									fmc.flightPlanManager.removeDeparture(() => {
										Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
									});
								} else {
									for (i = toDelete; i > toDelete - count; i--){
										fmc.removeWaypoint(i, () => {
											Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
										});
									}
								}
							} else {
								for (i = toDelete; i > toDelete - count; i--){
									fmc.removeWaypoint(i, () => {
										Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
									});
								}
							}
						}
					};
					fmc.onRightInput[i] = () => {
						let value = fmc.inOut;
						if (value === 'DELETE') {
							fmc.inOut = '';
							let toDelete = allRows[ii][2]  + fmc.flightPlanManager.getDepartureWaypointsCount() + (fmc.flightPlanManager.getDepartureProcIndex() > -1 ? 0 : 1);
							let count = allRows[ii][3];


							let departure = fmc.flightPlanManager.getDeparture();
							let lastDepartureWaypoint;
							if (departure) {
								let departureWaypoints = fmc.flightPlanManager.getDepartureWaypointsMap();
								lastDepartureWaypoint = departureWaypoints[departureWaypoints.length - 1];
								if (lastDepartureWaypoint && allRows[ii][1] === lastDepartureWaypoint.ident) {
									fmc.flightPlanManager.removeDeparture(() => {
										Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
									});
								} else {
									for (i = toDelete; i > toDelete - count; i--){
										fmc.removeWaypoint(i, () => {
											Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
										});
									}
								}
							} else {
								for (i = toDelete; i > toDelete - count; i--){
									fmc.removeWaypoint(i, () => {
										Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
									});
								}
							}
						} else if (value.length > 0) {
							fmc.clearUserInput();
							fmc.insertWaypoint(value, waypointFlightPlanIndex, () => {
								Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset);
							});
						}
					};
				}
			} else if (!showInput) {
				showInput = true;
				if (!pendingAirway) {
					rows[i] = [FMCString.Line.Dash['5'], FMCString.Line.Dash['5']];
					fmc.onRightInput[i] = async () => {
						let value = fmc.inOut;
						if (value.length > 0) {
							fmc.clearUserInput();
							fmc.insertWaypoint(value, fmc.flightPlanManager.getEnRouteWaypointsLastIndex() + 1, () => {
								Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset);
							});
						}
					};
					fmc.onLeftInput[i] = async () => {
						let value = fmc.inOut;
						if (value.length > 0) {
							fmc.clearUserInput();
							let lastWaypoint = fmc.flightPlanManager.getWaypoints()[fmc.flightPlanManager.getEnRouteWaypointsLastIndex()];
							if (lastWaypoint.infos instanceof IntersectionInfo || lastWaypoint.infos instanceof VORInfo || lastWaypoint.infos instanceof NDBInfo) {
								let airway = lastWaypoint.infos.airways.find(a => {
									return a.name === value;
								});
								if (airway) {
									Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset, airway);
								} else {
									fmc.showErrorMessage('NOT IN DATABASE');
								}
							}
						}
					};
				} else {
					rows[i] = [pendingAirway.name, FMCString.Line.Dash['5']];
					fmc.onRightInput[i] = () => {
						let value = fmc.inOut;
						if (value.length > 0) {
							fmc.clearUserInput();
							fmc.insertWaypointsAlongAirway(value, fmc.flightPlanManager.getEnRouteWaypointsLastIndex() + 1, pendingAirway.name, (result) => {
								if (result) {
									Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset);
								}
							});
						}
					};
					if (rows[i + 1]) {
						rows[i + 1] = [FMCString.Line.Dash['5']];
					}
				}
			}
		}
		let activateCell = '';
		if (fmc.flightPlanManager.getCurrentFlightPlanIndex() === 1) {
			if (!fmc.getIsRouteActivated()) {
				activateCell = FMCString.Prompt.ACTIVATE_RIGHT;
				fmc.onRightInput[5] = () => {
					fmc.activateRoute();
					Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc);
				};
			}
		} else {
			activateCell = FMCString.Prompt.PERF_INIT_RIGHT;
			fmc.onRightInput[5] = () => {
				fmc.activateRoute();
				FMCPerfInitPage.ShowPage1(fmc);
			};
		}
		fmc.setTemplate([
			['RTE 1', page.toFixed(0), pageCount.toFixed(0)],
			['VIA', 'TO'],
			rows[0],
			[''],
			rows[1],
			[''],
			rows[2],
			[''],
			rows[3],
			[''],
			rows[4],
			[''],
			[FMCString.Prompt.RTE_2_LEFT, activateCell]
		]);
		fmc.onPrevPage = () => {
			if (offset === 0) {
				Heavy_B747_8_FMC_RoutePage.ShowPage1(fmc);
			} else {
				Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset - 4, pendingAirway, discontinuity);
			}
		};
		fmc.onNextPage = () => {
			if (offset + 4 < allRows.length) {
				Heavy_B747_8_FMC_RoutePage.ShowPage2(fmc, offset + 4, pendingAirway, discontinuity);
			}
		};
	}

	static _GetAllRows(fmc) {
		let allRows = [];
		let flightPlan = fmc.flightPlanManager;
		if (flightPlan) {
			let departure = flightPlan.getDeparture();
			let lastDepartureWaypoint;
			if (departure) {
				let departureWaypoints = flightPlan.getDepartureWaypointsMap();
				lastDepartureWaypoint = departureWaypoints[departureWaypoints.length - 1];
				if (lastDepartureWaypoint) {
					allRows.push([departure.name, lastDepartureWaypoint.ident, 0, departureWaypoints.length]);
				}
			}
			let routeWaypoints = flightPlan.getEnRouteWaypoints();
			let lastAirwayName = '';
			let lastInserted = undefined;
			let airwayCount = 1;
			let popNext = true;
			for (let i = 0; i < routeWaypoints.length; i++) {
				let prev = routeWaypoints[i - 1];
				if (i === 0 && lastDepartureWaypoint) {
					prev = lastDepartureWaypoint;
				}
				let wp = routeWaypoints[i];
				let legIndex = (departure ? i + 1 : i);
				if (wp) {
					let prevAirway = IntersectionInfo.GetCommonAirway(prev, wp);
					if (!prevAirway) {
						airwayCount = 1;
						lastInserted = ['DIRECT', wp.ident, legIndex, airwayCount]
						allRows.push(lastInserted);
					} else {
						let prevIcaoIndex = prevAirway.icaos.indexOf(prev.icao);
						let actualIcaoIndex = prevAirway.icaos.indexOf(wp.icao);

						if(prevIcaoIndex + 1 === actualIcaoIndex || prevIcaoIndex - 1 === actualIcaoIndex){
							if (lastAirwayName === prevAirway.name) {
								if(popNext){
									airwayCount = airwayCount + 1
									allRows.pop();
								}
								popNext = true;
								lastInserted = [prevAirway.name, wp.ident, legIndex, airwayCount]
								lastAirwayName = prevAirway.name;
							} else {
								airwayCount = 1;
								lastInserted = ['DIRECT', wp.ident, legIndex, airwayCount]
								lastAirwayName = 'DIRECT';
							}
						} else {
							popNext = false;
							airwayCount = 1;
							lastInserted = ['DIRECT', wp.ident, legIndex, airwayCount]
							lastAirwayName = 'DIRECT';
						}
						lastAirwayName = prevAirway.name;
						allRows.push(lastInserted);

					}
				}
			}
		}
		return allRows;
	}
}
