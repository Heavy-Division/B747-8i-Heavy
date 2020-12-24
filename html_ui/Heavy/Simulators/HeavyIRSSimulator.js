class HeavyIRSSimulator {
	constructor() {
		this.initLAlignTime = null;
		this.initCAlignTime = null;
		this.initRAlignTime = null;

		this.irsLTimeForAligning = this.generateTimeForAligning(420, 480);
		this.irsCTimeForAligning = this.generateTimeForAligning(420, 480);
		this.irsRTimeForAligning = this.generateTimeForAligning(420, 480);
		/**
		 * IRS States:
		 * 0 - off
		 * 1 - inited
		 * 2 - aligning
		 * 3 - aligned
		 */

		this.irsLState = 0;
		this.irsCState = 0;
		this.irsRState = 0;

		this.irsLSwitchState = 0;
		this.irsCSwitchState = 0;
		this.irsRSwitchState = 0;

		this.isIrsInited = 0;
		this.isIrsPositionSet = false;
		this.init();
	}

	init() {
		this.irsLState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
		this.irsCState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
		this.irsRState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');
		this.irsLSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number');
		this.irsCSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number');
		this.irsRSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number');
		this.isIrsInited = SimVar.GetSimVarValue('L:HEAVY_B747_8_IS_IRS_INITED', 'Number');

		//this.executeIRSDeinit();
	}

	update() {
		this.updateVariables();
		this.checkAlignStates()

		if (!this.shouldBeIRSInited()) {
			if (this.isIrsInited) {
				this.executeIRSDeinit();
			}
			return;
		} else {
			this.executeInit();
		}

		if (this.shouldIRSStartAlign()) {
			this.executeIRSAlign();
		}
	}

	executeInit() {

		if (this.irsLSwitchState > 0 && this.irsLState === 0) {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 1);
			this.irsLState = 1
		}

		if (this.irsCSwitchState > 0 && this.irsCState === 0) {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 1);
			this.irsCState = 1;
		}

		if (this.irsRSwitchState > 0 && this.irsRState === 0) {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 1);
			this.irsRState = 1;
		}

		if(!this.isIrsInited){
			this.isIrsInited = Math.floor(Date.now() / 1000)
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IS_IRS_INITED', 'Number', this.isIrsInited);
		}
	}

	executeIRSDeinit() {
		this.initTime = null;
		this.initLAlignTime = null;
		this.initCAlignTime = null;
		this.initRAlignTime = null;
		this.irsLState = 0;
		this.irsCState = 0;
		this.irsRState = 0;
		this.irsLTimeForAligning = this.generateTimeForAligning(420, 480);
		this.irsCTimeForAligning = this.generateTimeForAligning(420, 480);
		this.irsRTimeForAligning = this.generateTimeForAligning(420, 480);
		SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 0);
		SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 0);
		SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 0);
		SimVar.SetSimVarValue('L:HEAVY_B747_8_IS_IRS_INITED', 'Number', 0);
	}

	checkAlignStates(){
		if (this.irsLSwitchState === 0){
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 0);
			this.initLAlignTime = null
			this.irsLState = 0
		}

		if (this.irsCSwitchState === 0){
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 0);
			this.initCAlignTime = null
			this.irsCState = 0
		}

		if (this.irsRSwitchState === 0){
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 0);
			this.initRAlignTime = null
			this.irsRState = 0
		}

	}

	executeIRSAlign() {
		let nowSeconds = Math.floor(Date.now() / 1000);
		if (this.irsLSwitchState > 0) {
			if(this.irsLState !== 3){
				if (!this.initLAlignTime) {
					this.initLAlignTime = nowSeconds;

					SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 2);
					this.irsLState = 2
				} else {
					if (this.initLAlignTime + this.irsLTimeForAligning < nowSeconds) {
						SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 3);
						this.irsLState = 3
					}
				}
			}
		} else {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_L_STATE', 'Number', 0);
			this.initLAlignTime = null
			this.irsLState = 0
		}

		if (this.irsCSwitchState > 0) {
			if(this.irsCState !== 3){
				if (!this.initCAlignTime) {
					this.initCAlignTime = nowSeconds;
					SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 2);
					this.irsCState = 2;
				} else {
					if (this.initCAlignTime + this.irsCTimeForAligning < nowSeconds) {
						SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 3);
						this.irsCState = 3;
					}
				}
			}
		} else {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_C_STATE', 'Number', 0);
			this.initCAlignTime = null
			this.irsCState = 0
		}

		if (this.irsRSwitchState > 0) {
			if(this.irsRState !== 3){
				if (!this.initRAlignTime) {
					this.initRAlignTime = nowSeconds;
					SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 2);
					this.irsRState = 2;
				} else {
					if (this.initRAlignTime + this.irsRTimeForAligning < nowSeconds) {
						SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 3);
						this.irsRState = 3;
					}
				}
			}
		} else {
			SimVar.SetSimVarValue('L:HEAVY_B747_8_IRS_R_STATE', 'Number', 0);
			this.initRAlignTime = null
			this.irsRState = 0
		}
	}

	updateVariables() {
		this.irsLSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_L_SWITCH_STATE', 'Number');
		this.irsCSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_C_SWITCH_STATE', 'Number');
		this.irsRSwitchState = SimVar.GetSimVarValue('L:HEAVY_B747_8_IRS_R_SWITCH_STATE', 'Number');

		this.isIrsPositionSet = SimVar.GetSimVarValue('L:HEAVY_B747_8_IS_IRS_POSITION_SET', 'Boolean');
	}

	shouldBeIRSInited() {
		return this.irsLSwitchState > 0 || this.irsCSwitchState > 0 || this.irsRSwitchState > 0;
	}

	shouldIRSStartAlign() {
		return (this.shouldBeIRSInited() && this.isIrsPositionSet) && (this.irsLState !== 3 || this.irsCState !== 3 || this.irsRState !== 3);
	}

	generateTimeForAligning(minimal, maximal) {
		return Math.floor(Math.random() * (maximal - minimal + 1)) + minimal;
	}
}