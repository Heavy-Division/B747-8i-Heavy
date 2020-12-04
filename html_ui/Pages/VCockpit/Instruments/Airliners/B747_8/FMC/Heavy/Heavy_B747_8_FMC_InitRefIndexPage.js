class Heavy_B747_8_FMC_InitRefIndexPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			[FMCString.Prompt.INIT_REF_INDEX_LEFT],
			[''],
			[FMCString.Prompt.IDENT_LEFT, FMCString.Prompt.NAV_DATA_RIGHT],
			[''],
			[FMCString.Prompt.POS_LEFT],
			[''],
			[FMCString.Prompt.PERF_LEFT],
			[''],
			[FMCString.Prompt.THRUST_LIM_LEFT],
			[''],
			[FMCString.Prompt.TAKEOFF_LEFT],
			[''],
			[FMCString.Prompt.APPROACH_LEFT, FMCString.Prompt.MAINT_RIGHT]
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