class Heavy_B747_8_FMC_HeavyPayloadManager {

	static get tankCapacity() {
		return {
			'CENTER': 17000,
			'STAB': 3300,
			'LEFT': 21284,
			'RIGHT': 21284,
			'LEFT_MAIN': 14430,
			'LEFT_AUX': 5320,
			'LEFT_TIP': 1534,
			'RIGHT_MAIN': 14430,
			'RIGHT_AUX': 5320,
			'RIGHT_TIP': 1534
		};
	}

	static get tankPriority() {
		return [['LEFT_MAIN', 'RIGHT_MAIN', 'LEFT_AUX', 'RIGHT_AUX'], ['CENTER'], ['LEFT_TIP', 'RIGHT_TIP'], ['STAB']];
	}

	static get tankVariables() {
		return {
			'CENTER': 'FUEL TANK CENTER QUANTITY',
			'STAB': 'FUEL TANK CENTER2 QUANTITY',
			'LEFT_MAIN': 'FUEL TANK LEFT MAIN QUANTITY',
			'LEFT_AUX': 'FUEL TANK LEFT AUX QUANTITY',
			'LEFT_TIP': 'FUEL TANK LEFT TIP QUANTITY',
			'RIGHT_MAIN': 'FUEL TANK RIGHT MAIN QUANTITY',
			'RIGHT_AUX': 'FUEL TANK RIGHT AUX QUANTITY',
			'RIGHT_TIP': 'FUEL TANK RIGHT TIP QUANTITY'
		};
	}

	static get payloadIndex() {
		return {
			'PILOT': 1,
			'COPILOT': 2,
			'BUSINESS_CLASS_UPPER_DECK': 3,
			'FIRST_CLASS': 4,
			'BUSINESS_CLASS_MAIN_DECK': 5,
			'PREMIUM_ECONOMY': 6,
			'FORWARD_ECONOMY_CABIN': 7,
			'REAR_ECONOMY_CABIN': 8,
			'FORWARD_BAGGAGE': 9,
			'REAR_BAGGAGE': 10,
			'CREW': 11
		};
	}

	static get isPayloadManagerExecuted() {
		return this._isPayloadManagerExecuted;
	}

	static set isPayloadManagerExecuted(value) {
		this._isPayloadManagerExecuted = value;
	}

	static get centerOfGravity() {
		return this._centerOfGravity;
	}

	static set centerOfGravity(value) {
		this._centerOfGravity = value;
	}

	static get requestedCenterOfGravity() {
		return this._requestedCenterOfGravity || null;
	}

	static set requestedCenterOfGravity(value) {
		this._requestedCenterOfGravity = value;
	}

	static get requestedFuel() {
		return this._requestedFuel || null;
	}

	static set requestedFuel(value) {
		this._requestedFuel = value;
	}

	static get requestedPayload() {
		return this._requestedPayload || null;
	}

	static set requestedPayload(value) {
		this._requestedPayload = value;
	}

	static get remainingPayload() {
		return this._remainingPayload || null;
	}

	static set remainingPayload(value) {
		this._remainingPayload = value;
	}

	static get zeroFuelCenterOfGravity() {
		return this._zeroFuelCenterOfGravity;
	}

	static set zeroFuelCenterOfGravity(value) {
		this._zeroFuelCenterOfGravity = value;
	}

	static get zeroFuelWeight() {
		return this._zeroFuelWeight;
	}

	static set zeroFuelWeight(value) {
		this._zeroFuelWeight = value;
	}

	static get getMaxFuel(){
		return 62868;
	}

	static get getMinFuel(){
		return 0;
	}

	static get getMaxPayload(){
		return 800000;
	}

	static get getMinPayload(){
		return 0;
	}

	static get getMaxCenterOfGravity(){
		return 100;
	}

	static get getMinCenterOfGravity(){
		return 0;
	}

	constructor(fmc) {
		this.fmc = fmc;
		this.tankPriorityValues = [];
		this.payloadValues = [];

		this.Init();
	}

	Init() {
		this.tankPriorityValues = [
			{
				'LEFT_MAIN': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.LEFT_MAIN),
				'RIGHT_MAIN': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.RIGHT_MAIN),
				'LEFT_AUX': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.LEFT_AUX),
				'RIGHT_AUX': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.RIGHT_AUX)
			},
			{'CENTER': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.CENTER)},
			{
				'LEFT_TIP': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.LEFT_TIP),
				'RIGHT_TIP': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.RIGHT_TIP)
			},
			{'STAB': this.getTankValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables.STAB)}
		];

		this.payloadValues = this.getPayloadValues();

		Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity = this.getCenterOfGravity();
	}

	getPayloadValues() {
		return [
			{
				'PILOT': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.PILOT),
				'COPILOT': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.COPILOT)
			},
			{
				'BUSINESS_CLASS_UPPER_DECK': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.BUSINESS_CLASS_UPPER_DECK),
				'FIRST_CLASS': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FIRST_CLASS),
				'BUSINESS_CLASS_MAIN_DECK': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.BUSINESS_CLASS_MAIN_DECK),
				'FORWARD_ECONOMY_CABIN': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FORWARD_ECONOMY_CABIN),
				'FORWARD_BAGGAGE': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FORWARD_BAGGAGE)
			},
			{
				'PREMIUM_ECONOMY': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.PREMIUM_ECONOMY),
				'REAR_ECONOMY_CABIN': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.REAR_ECONOMY_CABIN),
				'REAR_BAGGAGE': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.REAR_BAGGAGE),
				'CREW': this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.CREW)
			}
		];
	}

	getPayloadValue(index) {
		return SimVar.GetSimVarValue('PAYLOAD STATION WEIGHT:' + index, 'Pounds');
	}

	async setPayloadValue(index, value) {
		return SimVar.SetSimVarValue('PAYLOAD STATION WEIGHT:' + index, 'Pounds', value);
	}

	getTankValue(variable) {
		return SimVar.GetSimVarValue(variable, 'Gallons');
	}

	getCenterOfGravity() {
		return SimVar.GetSimVarValue('CG PERCENT', 'Percent');
	}

	getTotalPayload(useLbs = false) {
		let payload = 0;
		this.payloadValues.forEach((group) => {
			Object.values(group).forEach((sectionValue) => {
				payload = payload + sectionValue;
			});
		});
		return (useLbs ? payload : payload * 0.45359237);
	}

	getTotalFuel(useLbs = false) {
		let fuel = 0;
		this.tankPriorityValues.forEach((group) => {
			Object.values(group).forEach((sectionValue) => {
				fuel = fuel + sectionValue;
			});
		});
		return (useLbs ? fuel * SimVar.GetSimVarValue('FUEL WEIGHT PER GALLON', 'Pounds') : fuel);
	}


	calculateTanks(fuel) {
		this.tankPriorityValues[2].LEFT_TIP = 0;
		this.tankPriorityValues[0].LEFT_AUX = 0;
		this.tankPriorityValues[0].LEFT_MAIN = 0;
		this.tankPriorityValues[1].CENTER = 0;
		this.tankPriorityValues[0].RIGHT_MAIN = 0;
		this.tankPriorityValues[0].RIGHT_AUX = 0;
		this.tankPriorityValues[2].RIGHT_TIP = 0;
		this.tankPriorityValues[3].STAB = 0;

		fuel = this.calculateMainAndAuxTanks(fuel);
		fuel = this.calculateCenterTank(fuel);
		fuel = this.calculateTipTanks(fuel);
		fuel = this.calculateStabTank(fuel);

		Heavy_B747_8_FMC_HeavyPayloadManager.tankPriority.forEach((tanks, index) => {
			tanks.forEach((tank) => {
				SimVar.SetSimVarValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables[tank], 'Gallons', this.tankPriorityValues[index][tank]);
			});
		});
	}

	calculateMainAndAuxTanks(fuel) {
		let remainingFuel = 0;
		let tanksCapacity = (Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_MAIN * 2 + Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_AUX * 2);
		if (fuel > tanksCapacity) {
			remainingFuel = fuel - tanksCapacity;
			fuel = tanksCapacity;
		}

		if (fuel <= Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_AUX * 4) {
			let reminder = fuel % 4;
			let quotient = (fuel - reminder) / 4;

			this.tankPriorityValues[0].LEFT_AUX = quotient;
			this.tankPriorityValues[0].LEFT_MAIN = quotient;
			this.tankPriorityValues[0].RIGHT_MAIN = quotient;
			this.tankPriorityValues[0].RIGHT_AUX = quotient;

			if (reminder) {
				this.tankPriorityValues[0].LEFT_AUX++;
				reminder--;
			}
			if (reminder) {
				this.tankPriorityValues[0].LEFT_MAIN++;
				reminder--;
			}
			if (reminder) {
				this.tankPriorityValues[0].RIGHT_MAIN++;
				reminder--;
			}
			if (reminder) {
				this.tankPriorityValues[0].RIGHT_AUX++;
				reminder--;
			}
		} else {
			this.tankPriorityValues[0].LEFT_AUX = Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_AUX;
			this.tankPriorityValues[0].RIGHT_AUX = Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.RIGHT_AUX;
			fuel = fuel - (Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_AUX * 2);

			let reminder = fuel % 2;
			let quotient = (fuel - reminder) / 2;

			this.tankPriorityValues[0].LEFT_MAIN = quotient;
			this.tankPriorityValues[0].RIGHT_MAIN = quotient;

			if (reminder) {
				this.tankPriorityValues[0].LEFT_MAIN++;
				reminder--;
			}
			if (reminder) {
				this.tankPriorityValues[0].RIGHT_MAIN++;
				reminder--;
			}
		}

		return remainingFuel;
	}

	calculateCenterTank(fuel) {
		let remainingFuel = 0;
		let tankCapacity = Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.CENTER;

		if (fuel > tankCapacity) {
			remainingFuel = fuel - tankCapacity;
			fuel = tankCapacity;
		}

		this.tankPriorityValues[1].CENTER = fuel;

		return remainingFuel;
	}

	calculateTipTanks(fuel) {
		let remainingFuel = 0;
		let tanksCapacity = Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.LEFT_TIP * 2;

		if (fuel > tanksCapacity) {
			remainingFuel = fuel - tanksCapacity;
			fuel = tanksCapacity;
		}

		let reminder = fuel % 2;
		let quotient = (fuel - reminder) / 2;

		this.tankPriorityValues[2].LEFT_TIP = quotient;
		this.tankPriorityValues[2].RIGHT_TIP = quotient;

		if (reminder) {
			this.tankPriorityValues[2].LEFT_TIP++;
			reminder--;
		}
		if (reminder) {
			this.tankPriorityValues[2].RIGHT_TIP++;
			reminder--;
		}

		return remainingFuel;
	}

	calculateStabTank(fuel) {
		let remainingFuel = 0;
		let tankCapacity = Heavy_B747_8_FMC_HeavyPayloadManager.tankCapacity.STAB;

		if (fuel > tankCapacity) {
			remainingFuel = fuel - tankCapacity;
			fuel = tankCapacity;
		}

		this.tankPriorityValues[3].STAB = fuel;

		return remainingFuel;
	}

	showPage() {
		this.fmc.clearDisplay();

		this.payloadValues = this.getPayloadValues();

		if (!Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload) {
			Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload = this.getTotalPayload(true);
		}

		if (!Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel) {
			Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel = this.getTotalFuel();
		}

		if (Heavy_B747_8_FMC_HeavyPayloadManager.isPayloadManagerExecuted) {
			this.fmc.refreshPageCallback = () => {
				this.showPage();
			};
		}
		console.log('refresh');
		let rows = HeavyArray.Fmc.EmptyRows;

		rows[0][0] = FMCString.PageTitle.PAYLOAD_MANAGER;
		rows[1][0] = 'REQ VALUES';
		rows[1][1] = 'ACT VALUES';
		rows[3][0] = FMCString.LineTitle.CG;
		rows[3][1] = FMCString.LineTitle.CG;
		rows[4][0] = (Heavy_B747_8_FMC_HeavyPayloadManager.requestedCenterOfGravity ? Heavy_B747_8_FMC_HeavyPayloadManager.requestedCenterOfGravity.toFixed(2) + '%' : Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity.toFixed(2) + '%');
		rows[4][1] = this.getCenterOfGravity().toFixed(2) + '%';
		rows[5][0] = FMCString.LineTitle.FOB;
		rows[5][1] = FMCString.LineTitle.FOB;
		rows[6][0] = (Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel ? Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel.toFixed(2) + ' gal' : this.getTotalFuel().toFixed(2) + ' gal');
		rows[6][1] = this.getTotalFuel().toFixed(2) + ' gal';
		rows[7][0] = FMCString.LineTitle.PAYLOAD;
		rows[7][1] = FMCString.LineTitle.PAYLOAD;
		rows[8][0] = (Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload ? Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload.toFixed(0) + ' lb' : this.getTotalPayload(true).toFixed(0) + ' lb');
		rows[8][1] = this.getTotalPayload(true).toFixed(0) + ' lb';
		rows[9][0] = (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload ? 'REMAINING PAYLOAD' : '');
		rows[10][0] = (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload ? Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload + ' lb' : '');


		rows[12][0] = FMCString.Prompt.BACK_LEFT;


		this.fmc.onLeftInput[1] = () => {
			if(isFinite(parseFloat(this.fmc.inOut))){
				if(parseFloat(this.fmc.inOut) > Heavy_B747_8_FMC_HeavyPayloadManager.getMinCenterOfGravity && parseFloat(this.fmc.inOut) < Heavy_B747_8_FMC_HeavyPayloadManager.getMaxCenterOfGravity){
					Heavy_B747_8_FMC_HeavyPayloadManager.requestedCenterOfGravity = parseFloat(this.fmc.inOut);
					this.fmc.clearUserInput();
					this.showPage();
				} else {
					this.fmc.showErrorMessage("OUT OF RANGE")
					return false;
				}
			} else {
				this.fmc.showErrorMessage(this.fmc.defaultInputErrorMessage)
				return false;
			}
		};

		this.fmc.onLeftInput[2] = () => {
			if(isFinite(parseFloat(this.fmc.inOut))){
				if(parseFloat(this.fmc.inOut) > Heavy_B747_8_FMC_HeavyPayloadManager.getMinFuel && parseFloat(this.fmc.inOut) < Heavy_B747_8_FMC_HeavyPayloadManager.getMaxFuel){
					Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel = parseFloat(this.fmc.inOut);
					this.fmc.clearUserInput();
					this.showPage();
				} else {
					this.fmc.showErrorMessage("OUT OF RANGE")
					return false;
				}
			} else {
				this.fmc.showErrorMessage(this.fmc.defaultInputErrorMessage)
				return false;
			}
		};

		this.fmc.onLeftInput[3] = () => {
			if(isFinite(parseFloat(this.fmc.inOut))){
				if(parseFloat(this.fmc.inOut) > Heavy_B747_8_FMC_HeavyPayloadManager.getMinPayload && parseFloat(this.fmc.inOut) < Heavy_B747_8_FMC_HeavyPayloadManager.getMaxPayload){
					Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload = parseFloat(this.fmc.inOut);
					this.fmc.clearUserInput();
					this.showPage();
				} else {
					this.fmc.showErrorMessage("OUT OF RANGE")
					return false;
				}
			} else {
				this.fmc.showErrorMessage(this.fmc.defaultInputErrorMessage)
				return false;
			}
		};

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};

		if(Heavy_B747_8_FMC_HeavyPayloadManager.isPayloadManagerExecuted){
			rows[12][1] = 'RUNNING...'
		} else {
			rows[12][1] = 'EXECUTE>';
			this.fmc.onRightInput[5] = () => {
				Heavy_B747_8_FMC_HeavyPayloadManager.isPayloadManagerExecuted = true;
				if (Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel) {
					this.calculateTanks(Heavy_B747_8_FMC_HeavyPayloadManager.requestedFuel);
				} else {
					this.calculateTanks(this.getTotalFuel());
				}

				if (Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload) {
					this.calculatePayload(Heavy_B747_8_FMC_HeavyPayloadManager.requestedPayload);
				} else {
					this.calculatePayload(this.getTotalPayload(true));
				}
				this.showPage();
			};
		}

		this.fmc.setTemplate(rows);
	}

	async resetPayload() {
		await this.setPayloadValue(1, 0);
		await this.setPayloadValue(2, 0);
		await this.setPayloadValue(3, 0);
		await this.setPayloadValue(4, 0);
		await this.setPayloadValue(5, 0);
		await this.setPayloadValue(6, 0);
		await this.setPayloadValue(7, 0);
		await this.setPayloadValue(8, 0);
		await this.setPayloadValue(9, 0);
		await this.setPayloadValue(10, 0);
		await this.setPayloadValue(11, 0);
	}

	async calculatePayload(requestedPayload) {
		await this.resetPayload();
		Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload = requestedPayload;
		let amount = 0;
		let requestedCenterOfGravity = (Heavy_B747_8_FMC_HeavyPayloadManager.requestedCenterOfGravity ? Heavy_B747_8_FMC_HeavyPayloadManager.requestedCenterOfGravity : this.getCenterOfGravity());
		while (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload > 0) {
			Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity = this.getCenterOfGravity();
			if (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload > 30000) {
				amount = 1000;
			} else if (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload > 10000) {
				amount = 200;
			} else if (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload > 5000) {
				amount = 100;
			} else if (Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload > 50) {
				amount = 50;
			} else {
				amount = Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload;
			}

			if (Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity > requestedCenterOfGravity) {
				await this.increaseFrontPayload(amount, requestedCenterOfGravity);
				Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload = Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload - amount;
			} else {
				await this.increaseRearPayload(amount, requestedCenterOfGravity);
				Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload = Heavy_B747_8_FMC_HeavyPayloadManager.remainingPayload - amount;
			}
		}
		Heavy_B747_8_FMC_HeavyPayloadManager.isPayloadManagerExecuted = false;
	}

	async increaseFrontPayload(amount, requestedCenterOfGravity) {
		let keys = Object.keys(this.payloadValues[1]);
		let randomFront;
		let actualValue;
		if (Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity > (requestedCenterOfGravity + 0.05)) {
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FIRST_CLASS);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FIRST_CLASS, amount + actualValue);
		} else if (Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity > (requestedCenterOfGravity + 0.01)) {
			randomFront = keys[Math.floor(Math.random() * keys.length)];
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex[randomFront]);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex[randomFront], amount + actualValue);
		} else {
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FORWARD_ECONOMY_CABIN);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.FORWARD_ECONOMY_CABIN, amount + actualValue);
		}
	}

	async increaseRearPayload(amount, requestedCenterOfGravity) {
		let keys = Object.keys(this.payloadValues[2]);
		let randomRear;
		let actualValue;
		if (Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity < (requestedCenterOfGravity - 0.05)) {
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.REAR_ECONOMY_CABIN);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.REAR_ECONOMY_CABIN, amount + actualValue);
		} else if (Heavy_B747_8_FMC_HeavyPayloadManager.centerOfGravity < (requestedCenterOfGravity - 0.01)) {
			randomRear = keys[Math.floor(Math.random() * keys.length)];
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex[randomRear]);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex[randomRear], amount + actualValue);
		} else {
			actualValue = this.getPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.PREMIUM_ECONOMY);
			await this.setPayloadValue(Heavy_B747_8_FMC_HeavyPayloadManager.payloadIndex.PREMIUM_ECONOMY, amount + actualValue);
		}
	}
}