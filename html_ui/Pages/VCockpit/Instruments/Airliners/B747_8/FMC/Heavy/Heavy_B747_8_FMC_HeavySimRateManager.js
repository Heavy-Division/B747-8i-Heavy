class Heavy_B747_8_FMC_HeavySimRateManager {
	showPage(fmc) {
		fmc.clearDisplay();
		let rows = [
			[FMCString.PageTitle.SIM_RATE_MANAGER],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];
		fmc.setTemplate(rows);

		fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(fmc);
		};
	}
}