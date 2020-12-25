class Heavy_B747_8_FMC_HeavyMenuPage {

	showPage(fmc) {
		fmc.clearDisplay();
		let rows = [
			[FMCString.PageTitle.HEAVY],
			['', ''],
			[FMCString.Prompt.HEAVY_IRS_LEFT, ''],
			['', ''],
			[FMCString.Prompt.PAYLOAD_MANAGER_LEFT, ''],
			['', ''],
			[FMCString.Prompt.SIM_RATE_MANAGER_LEFT, ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];

		fmc.setTemplate(rows);

		fmc.onLeftInput[0] = () => {
			new Heavy_B747_8_FMC_HeavyIRSMenuPage(fmc).showPage();
		};

		fmc.onLeftInput[1] = () => {
			new Heavy_B747_8_FMC_HeavyPayloadManager(fmc).showPage();
		};

		fmc.onLeftInput[2] = () => {
			new Heavy_B747_8_FMC_HeavySimRateManager(fmc).showPage();
		};

		fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_MenuPage().showPage(fmc);
		};
	}
}