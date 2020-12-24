class Heavy_B747_8_FMC_HeavyIRSMenuPage {

	constructor(fmc) {
		this.fmc = fmc;
	}

	showPage() {
		this.fmc.clearDisplay();

		let irsLState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
		let irsCState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
		let irsRState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');
		let irsState = Math.max(irsLState, irsCState, irsRState);
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

		switch (HeavyDataStorage.get('IRS_ALIGN_SPEED', HeavyIRSSimulator.ALIGN_SPEED.NORMAL)) {
			case HeavyIRSSimulator.ALIGN_SPEED.INSTANT:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.INSTANT;
				break;
			case HeavyIRSSimulator.ALIGN_SPEED.FAST:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.FAST;
				break;
			case HeavyIRSSimulator.ALIGN_SPEED.NORMAL:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.NORMAL;
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
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_SWITCH_STATE', 'Number', 2);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_SWITCH_STATE', 'Number', 2);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_SWITCH_STATE', 'Number', 2);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 3);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 3);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 3);
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IS_IRS_INITED', 'Number', 2);
			this.showPage();
		};

		this.fmc.onRightInput[0] = () => {
			this.showAlignSpeedConfigurationPage();
		};

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};
	}

	showAlignSpeedConfigurationPage(){
		this.fmc.clearDisplay();

		let irsLState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
		let irsCState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
		let irsRState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');
		let irsState = Math.max(irsLState, irsCState, irsRState);
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

		switch (HeavyDataStorage.get('IRS_ALIGN_SPEED', HeavyIRSSimulator.ALIGN_SPEED.NORMAL)) {
			case HeavyIRSSimulator.ALIGN_SPEED.INSTANT:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.INSTANT;
				break;
			case HeavyIRSSimulator.ALIGN_SPEED.FAST:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.FAST;
				break;
			case HeavyIRSSimulator.ALIGN_SPEED.NORMAL:
				irsAlignSpeed = HeavyIRSSimulator.ALIGN_SPEED.NORMAL;
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
			HeavyDataStorage.set('IRS_ALIGN_SPEED', HeavyIRSSimulator.ALIGN_SPEED.INSTANT);
			this.showPage();
		};

		this.fmc.onRightInput[2] = () => {
			HeavyDataStorage.set('IRS_ALIGN_SPEED', HeavyIRSSimulator.ALIGN_SPEED.FAST);
			this.showPage();
		};

		this.fmc.onRightInput[3] = () => {
			HeavyDataStorage.set('IRS_ALIGN_SPEED', HeavyIRSSimulator.ALIGN_SPEED.NORMAL);
			this.showPage();
		};
	}
}