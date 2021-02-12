class Heavy_B747_8_FMC_HeavyIRSMenuPage {

	constructor(fmc) {
		this.fmc = fmc;
		this.irsInfo = new B748H_IRSInfo();
	}

	showPage() {
		this.fmc.clearDisplay();
		this.fmc.refreshPageCallback = this.showPage;
		let irsState = Math.max(this.irsInfo.getLState(), this.irsInfo.getCState(), this.irsInfo.getRState());
		let irsStateString = '';
		switch (irsState) {
			case 0:
				irsStateString = FMCString.Line.OFF + '[color]red';
				break;
			case 1:
				irsStateString = FMCString.Line.INITED;
				break;
			case 2:
				irsStateString = FMCString.Line.ALIGNING + '[color]blue';
				break;
			case 3:
				irsStateString = FMCString.Line.ALIGNED + '[color]green';
				break;
		}

		let irsAlignSpeed;

		switch (HeavyDataStorage.get('B748H_IRS_ALIGN_SPEED', B748H_IRSInfo.ALIGN_SPEED.NORMAL)) {
			case B748H_IRSInfo.ALIGN_SPEED.INSTANT:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.INSTANT;
				break;
			case B748H_IRSInfo.ALIGN_SPEED.FAST:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.FAST;
				break;
			case B748H_IRSInfo.ALIGN_SPEED.NORMAL:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.NORMAL;
				break;
		}

		this.fmc.refreshPageCallback = () => {
			this.showPage();
		};

		let rows = [
			[FMCString.PageTitle.HEAVY_IRS],
			[FMCString.LineTitle.IRS_STATUS, FMCString.LineTitle.ALIGN_TIME],
			[irsStateString, irsAlignSpeed + '>'],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', ''],
			['', FMCString.Prompt.FORCE_ALIGN_RIGHT],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];

		this.fmc.setTemplate(rows);

		this.fmc.onRightInput[4] = () => {
			this.irsInfo.setLState(3);
			this.irsInfo.setCState(3);
			this.irsInfo.setRState(3);
			this.irsInfo.setLSwitchState(2);
			this.irsInfo.setCSwitchState(2);
			this.irsInfo.setRSwitchState(2);
			this.irsInfo.setInited(2);
			this.irsInfo.setPositionSet(1);
			this.showPage();
		};

		this.fmc.onRightInput[0] = () => {
			this.showAlignSpeedConfigurationPage();
		};

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};
	}

	showAlignSpeedConfigurationPage() {
		this.fmc.clearDisplay();

		let irsState = Math.max(this.irsInfo.getLState(), this.irsInfo.getCState(), this.irsInfo.getRState());
		let irsStateString = '';
		switch (irsState) {
			case 0:
				irsStateString = FMCString.Line.OFF + '[color]red';
				break;
			case 1:
				irsStateString = FMCString.Line.INITED;
				break;
			case 2:
				irsStateString = FMCString.Line.ALIGNING + '[color]blue';
				break;
			case 3:
				irsStateString = FMCString.Line.ALIGNED + '[color]green';
				break;
		}

		let irsAlignSpeed;

		switch (HeavyDataStorage.get('B748H_IRS_ALIGN_SPEED', B748H_IRSInfo.ALIGN_SPEED.NORMAL)) {
			case B748H_IRSInfo.ALIGN_SPEED.INSTANT:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.INSTANT;
				break;
			case B748H_IRSInfo.ALIGN_SPEED.FAST:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.FAST;
				break;
			case B748H_IRSInfo.ALIGN_SPEED.NORMAL:
				irsAlignSpeed = B748H_IRSInfo.ALIGN_SPEED.NORMAL;
				break;
		}


		let rows = [
			[FMCString.PageTitle.HEAVY_IRS],
			[FMCString.LineTitle.IRS_STATUS, FMCString.LineTitle.ALIGN_TIME],
			[irsStateString, irsAlignSpeed],
			['', ''],
			['', 'INSTANT>[s-text]'],
			['', ''],
			['', 'FAST>[s-text]'],
			['', ''],
			['', 'NORMAL>[s-text]'],
			['', ''],
			['', ''],
			['', ''],
			[FMCString.Prompt.BACK_LEFT]
		];

		this.fmc.setTemplate(rows);


		this.fmc.onRightInput[1] = () => {
			HeavyDataStorage.set('B748H_IRS_ALIGN_SPEED', B748H_IRSInfo.ALIGN_SPEED.INSTANT);
			this.showPage();
		};

		this.fmc.onRightInput[2] = () => {
			HeavyDataStorage.set('B748H_IRS_ALIGN_SPEED', B748H_IRSInfo.ALIGN_SPEED.FAST);
			this.showPage();
		};

		this.fmc.onRightInput[3] = () => {
			HeavyDataStorage.set('B748H_IRS_ALIGN_SPEED', B748H_IRSInfo.ALIGN_SPEED.NORMAL);
			this.showPage();
		};
	}
}