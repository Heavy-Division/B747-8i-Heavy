class Heavy_B747_8_FMC_VerticalRevisionPage {
	static ShowPage(fmc, waypoint) {
		let waypointInfo = waypoint.infos;
		if (waypointInfo instanceof WayPointInfo) {
			fmc.clearDisplay();
			let waypointIdent = '---';
			if (waypoint) {
				waypointIdent = waypoint.ident;
			}
			let coordinates = '---';
			if (waypointInfo.coordinates) {
				coordinates = waypointInfo.coordinates.toDegreeString();
			}
			fmc.setTemplate([
				['LAT REV FROM ' + waypointIdent],
				['', '', coordinates + '[color]green'],
				['', 'FIX INFO>'],
				['', 'LL WING/INCR/NO'],
				['[][color]blue', '[ ]°/[ ]°/[][color]blue'],
				['', 'NEXT WPT'],
				['<HOLD', '[ ][color]blue'],
				['ENABLE[color]blue', 'NEW DEST'],
				['←ALTN[color]blue', '[ ][color]blue'],
				[''],
				['', 'AIRWAYS>'],
				[''],
				['<RETURN']
			]);
			fmc.onLeftInput[5] = () => {
				Heavy_B747_8_FMC_LegsPage.ShowPage1(fmc);
			};
		}
	}
}
