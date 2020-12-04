class Heavy_B747_8_FMC_MaintPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			['MAINT'],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[FMCString.Prompt.INDEX_LEFT]
		]);
		fmc.onLeftInput[5] = () => {
			B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
	}
}
