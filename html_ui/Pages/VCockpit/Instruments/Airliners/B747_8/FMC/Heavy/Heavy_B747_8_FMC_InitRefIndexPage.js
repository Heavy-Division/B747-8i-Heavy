class Heavy_B747_8_FMC_InitRefIndexPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			['INIT/REF INDEX'],
			[''],
			['<IDENT', 'NAV DATA>'],
			[''],
			['<POS'],
			[''],
			['<PERF'],
			[''],
			['<THRUST LIM'],
			[''],
			['<TAKEOFF'],
			[''],
			['<APPROACH', 'MAINT>']
		]);
		fmc.onLeftInput[0] = () => {
			Heavy_B747_8_FMC_IdentPage.ShowPage1(fmc);
		};
		fmc.onRightInput[0] = () => {
			Heavy_B747_8_FMC_NavDataPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[1] = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[2] = () => {
			Heavy_B747_8_FMC_PerfInitPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[3] = () => {
			Heavy_B747_8_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[4] = () => {
			Heavy_B747_8_FMC_TakeOffPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[5] = () => {
			Heavy_B747_8_FMC_ApproachPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_MaintPage.ShowPage1(fmc);
		};
	}
}