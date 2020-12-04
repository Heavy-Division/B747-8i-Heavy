class Heavy_B747_8_FMC_IdentPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		let model = SimVar.GetSimVarValue('ATC MODEL', 'string', 'FMC');
		if (!model) {
			model = 'unkn.';
		}
		let date = fmc.getNavDataDateRange();
		fmc.setTemplate([
			['IDENT'],
			['MODEL', 'ENGINES'],
			['747-8i', 'GEnx-2B67B'],
			['NAV DATA', 'ACTIVE'],
			['AIRAC', date.toString()],
			['DRAG/FF'],
			[''],
			['OP PROGRAM', 'CO DATA'],
			['AW-P010-0-0', 'VS1001'],
			['OPC'],
			['AW-C010-0-0', ''],
			[FMCString.Common.FMC_SEPARATOR],
			[FMCString.Prompt.INDEX_LEFT, FMCString.Prompt.POS_INIT_RIGHT]
		]);
		fmc.onLeftInput[5] = () => {
			B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			Heavy_B747_8_FMC_PosInitPage.ShowPage1(fmc);
		};
	}
}
