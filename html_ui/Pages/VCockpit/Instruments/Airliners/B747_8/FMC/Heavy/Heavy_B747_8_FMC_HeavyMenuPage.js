class Heavy_B747_8_FMC_HeavyMenuPage {

	showPage(fmc) {
		fmc.clearDisplay();
		let rows = [
			[FMCString.PageTitle.HEAVY],
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
			new Heavy_B747_8_FMC_MenuPage().showPage(fmc);
		};
	}
}