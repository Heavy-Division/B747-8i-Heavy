class Heavy_B747_8_FMC_NavDataPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();
		fmc.setTemplate([
			['NAV DATA'],
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
			Heavy_B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
	}
}
