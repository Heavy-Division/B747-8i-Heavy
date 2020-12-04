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
			['<INDEX']
		]);
		fmc.onLeftInput[5] = () => {
			B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
	}
}
