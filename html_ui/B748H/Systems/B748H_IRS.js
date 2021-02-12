Include.addScript('/Heavy/Utils/HeavyDataStorage.js');
Include.addScript('/B748H/Systems/B748H_IRSInfo.js');

class B748H_IRS extends B748H_IRSInfo {

	constructor() {
		super(...arguments);
		this.initLAlignTime = null;
		this.initCAlignTime = null;
		this.initRAlignTime = null;

		this.irsLTimeForAligning = this.generateTimeForAligning('L');
		this.irsCTimeForAligning = this.generateTimeForAligning('C');
		this.irsRTimeForAligning = this.generateTimeForAligning('R');

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
		this.irsId = Math.floor(Math.random() * 1000);
		this.init();
	}

	init() {
		this.irsLState = this.getLState();
		this.irsCState = this.getCState();
		this.irsRState = this.getRState();
		this.irsLSwitchState = this.getLSwitchState();
		this.irsCSwitchState = this.getCSwitchState();
		this.irsRSwitchState = this.getRSwitchState();
		this.isIrsInited = this.isInited();
	}

	update(_deltaTime) {
		this.updateVariables();
		this.checkAlignStates();
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
		let now = Math.floor(Date.now() / 1000);
		if (this.irsLSwitchState > 0 && this.irsLState < 1) {
			this.setLState(1);
			this.irsLState = 1;
			this.isIrsInited = now;
			this.setInited(now);
			this.irsLTimeForAligning = this.generateTimeForAligning('L');
		}

		if (this.irsCSwitchState > 0 && this.irsCState < 1) {
			this.setCState(1);
			this.irsCState = 1;
			this.isIrsInited = now;
			this.setInited(now);
			this.irsCTimeForAligning = this.generateTimeForAligning('C');
		}

		if (this.irsRSwitchState > 0 && this.irsRState < 1) {
			this.setRState(1);
			this.irsRState = 1;
			this.isIrsInited = now;
			this.setInited(now);
			this.irsRTimeForAligning = this.generateTimeForAligning('R');
		}
	}

	executeIRSDeinit() {
		this.initLAlignTime = null;
		this.initCAlignTime = null;
		this.initRAlignTime = null;
		this.irsLState = 0;
		this.irsCState = 0;
		this.irsRState = 0;
		this.setLTimeForAlign(0)
		this.setCTimeForAlign(0)
		this.setRTimeForAlign(0)

		this.setLInitTime(-1);
		this.setCInitTime(-1);
		this.setRInitTime(-1);
		this.setLState(0);
		this.setRState(0);
		this.setCState(0);
		this.setInited(0);
		SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
	}

	checkAlignStates() {
		if (this.irsLSwitchState === 0) {
			this.setLState(0);
			this.setLInitTime(-1);
			this.initLAlignTime = null;
			this.irsLState = 0;
		}

		if (this.irsCSwitchState === 0) {
			this.setCState(0);
			this.setCInitTime(-1);
			this.initCAlignTime = null;
			this.irsCState = 0;
		}

		if (this.irsRSwitchState === 0) {
			this.setRState(0);
			this.setRInitTime(-1);
			this.initRAlignTime = null;
			this.irsRState = 0;
		}

	}

	executeIRSAlign() {
		let nowSeconds = Math.floor(new Date().getTime() / 1000);
		if (this.irsLSwitchState > 0) {
			if (this.irsLState !== 3) {
				if (!this.initLAlignTime) {
					this.initLAlignTime = nowSeconds;
					this.setLInitTime(nowSeconds);
					this.setLState(2);
					SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
				} else {
					if (this.initLAlignTime + this.irsLTimeForAligning < nowSeconds) {
						this.setLState(3);
						SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
					}
				}
			}
		} else {
			this.setLState(0);
			this.setLInitTime(-1);
			this.initLAlignTime = null;
		}

		if (this.irsCSwitchState > 0) {
			if (this.irsCState !== 3) {
				if (!this.initCAlignTime) {
					this.initCAlignTime = nowSeconds;
					this.setCInitTime(nowSeconds);
					this.setCState(2);
					SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
				} else {
					if (this.initCAlignTime + this.irsCTimeForAligning < nowSeconds) {
						this.setCState(3);
						SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
					}
				}
			}
		} else {
			this.setCState(0);
			this.setCInitTime(-1);
			this.initCAlignTime = null;
		}

		if (this.irsRSwitchState > 0) {
			if (this.irsRState !== 3) {
				if (!this.initRAlignTime) {
					this.initRAlignTime = nowSeconds;
					this.setRInitTime(nowSeconds);
					this.setRState(2);
					SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
				} else {
					if (this.initRAlignTime + this.irsRTimeForAligning < nowSeconds) {
						this.setRState(3);
						SimVar.SetSimVarValue('L:FMC_UPDATE_CURRENT_PAGE', 'Number', 1);
					}
				}
			}
		} else {
			this.setRState(0);
			this.setRInitTime(-1);
			this.initRAlignTime = null;
		}
	}

	updateVariables() {
		this.irsLState = this.getLState();
		this.irsCState = this.getCState();
		this.irsRState = this.getRState();
		this.irsLSwitchState = this.getLSwitchState();
		this.irsCSwitchState = this.getCSwitchState();
		this.irsRSwitchState = this.getRSwitchState();
		this.isIrsPositionSet = this.isPositionSet();
	}

	shouldBeIRSInited() {
		return this.irsLSwitchState > 0 || this.irsCSwitchState > 0 || this.irsRSwitchState > 0;
	}

	shouldIRSStartAlign() {
		return (this.shouldBeIRSInited()) && (this.irsLState !== 3 || this.irsCState !== 3 || this.irsRState !== 3);
	}

	generateTimeForAligning(irsId, minimal, maximal) {
		if (!minimal && !maximal) {
			switch (HeavyDataStorage.get('B748H_IRS_ALIGN_SPEED', B748H_IRS.ALIGN_SPEED.NORMAL)) {
				case B748H_IRS.ALIGN_SPEED.INSTANT:
					minimal = 0;
					maximal = 0;
					break;
				case B748H_IRS.ALIGN_SPEED.FAST:
					minimal = 120;
					maximal = 180;
					break;
				case B748H_IRS.ALIGN_SPEED.NORMAL:
					minimal = 420;
					maximal = 480;
					break;
				default:
					minimal = 420;
					maximal = 480;
			}

		}

		let ret = Math.floor(Math.random() * (maximal - minimal + 1)) + minimal;

		if (irsId === 'L') {
			this.setLTimeForAlign(ret);
		} else if (irsId === 'C') {
			this.setCTimeForAlign(ret);
		} else if (irsId === 'R') {
			this.setRTimeForAlign(ret);
		}
		return ret;
	}

}