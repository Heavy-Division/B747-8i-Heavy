class Heavy_B747_8_FMC_HeavyMenuPage {

	showPage(fmc) {
		fmc.clearDisplay();
		let rows = [
			[FMCString.PageTitle.HEAVY],
			['', ''],
			['', FMCString.Prompt.HEAVY_IRS_RIGHT],
			['', ''],
			['', FMCString.Prompt.PAYLOAD_MANAGER_RIGHT],
			['', ''],
			['', FMCString.Prompt.SIM_RATE_MANAGER_RIGHT],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];

		fmc.setTemplate(rows);

		fmc.onRightInput[0] = () => {
			new Heavy_B747_8_FMC_HeavyIRSMenuPage(fmc).showPage();
		};

		fmc.onRightInput[1] = () => {
			new Heavy_B747_8_FMC_HeavyPayloadManager(fmc).showPage();
		};

		fmc.onRightInput[2] = () => {
			new Heavy_B747_8_FMC_HeavySimRateManager(fmc).showPage();
		};

		fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_MenuPage().showPage(fmc);
		};
	}
}