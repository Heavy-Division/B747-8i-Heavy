class Heavy_B747_8_FMC_MainDisplay extends B747_8_FMC_MainDisplay {

	constructor() {
		super(...arguments);
	}

	Init() {
		super.Init();
		this.registerMainButtonsActions();
	}

	registerMainButtonsActions() {
		this.onVNAV = () => {
			Heavy_B747_8_FMC_VNAVPage.ShowPage1(this);
		};
	}
}

registerInstrument("fmc-b747-8-main-display", Heavy_B747_8_FMC_MainDisplay);
