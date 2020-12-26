class Heavy_B747_8_FMC_MenuPage {
	showPage(fmc) {
		fmc.clearDisplay();
		let rows = [
			['MENU'],
			['', 'EFIS CP'],
			['<FMC', '', '<ACT>'],
			['', 'EICAS CP'],
			['<ACARS'],
			['', 'CTL PNL'],
			['', 'OFF←→ON>'],
			[],
			[],
			[],
			['', FMCString.Prompt.HEAVY_RIGHT],
			[],
			['<CMC']
		];

		fmc.setTemplate(rows);
		fmc.onLeftInput[0] = () => {
			Heavy_B747_8_FMC_IdentPage.ShowPage1(fmc);
		};

		fmc.onRightInput[4] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(fmc);
		};
	}
}
