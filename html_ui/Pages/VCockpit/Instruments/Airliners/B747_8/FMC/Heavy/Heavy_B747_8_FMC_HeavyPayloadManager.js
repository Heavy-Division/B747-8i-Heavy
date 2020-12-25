class Heavy_B747_8_FMC_HeavyPayloadManager {

	/*
FUEL TANK CENTER CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK CENTER2 CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK CENTER3 CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK LEFT MAIN CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK LEFT AUX CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK LEFT TIP CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK RIGHT MAIN CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK RIGHT AUX CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK RIGHT TIP CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK EXTERNAL1 CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK EXTERNAL2 CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL LEFT CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL RIGHT CAPACITY	Maximum capacity in volume	Gallons	N	-
FUEL TANK CENTER QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK CENTER2 QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK CENTER3 QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK LEFT MAIN QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK LEFT AUX QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK LEFT TIP QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK RIGHT MAIN QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK RIGHT AUX QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK RIGHT TIP QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK EXTERNAL1 QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL TANK EXTERNAL2 QUANTITY	Current quantity in volume	Gallons	Y	-
FUEL LEFT QUANTITY	Current quantity in volume	Gallons	N	-
FUEL RIGHT QUANTITY	Current quantity in volume	Gallons	N	-
FUEL TOTAL QUANTITY	Current quantity in volume	Gallons	N	-
FUEL WEIGHT PER GALLON
 */

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

	static get payloadVariables() {
		return {
			'PILOT': 'PAYLOAD STATION WEIGHT:1',
			'COPILOT': 'PAYLOAD STATION WEIGHT:2',
			'BUSINESS_CLASS_UPPER_DECK': 'PAYLOAD STATION WEIGHT:3',
			'FIRST_CLASS': 'PAYLOAD STATION WEIGHT:4',
			'BUSINESS_CLASS_MAIN_DECK': 'PAYLOAD STATION WEIGHT:5',
			'PREMIUM_ECONOMY': 'PAYLOAD STATION WEIGHT:6',
			'FORWARD_ECONOMY_CABIN': 'PAYLOAD STATION WEIGHT:7',
			'REAR_ECONOMY_CABIN': 'PAYLOAD STATION WEIGHT:8',
			'FORWARD_BAGGAGE': 'PAYLOAD STATION WEIGHT:9',
			'REAR_BAGGAGE': 'PAYLOAD STATION WEIGHT:10',
			'CREW': 'PAYLOAD STATION WEIGHT:11'
		};
	}

	static get payloadCapacity() {
		return {
			'PILOT': 'PAYLOAD STATION WEIGHT:1',
			'COPILOT': 'PAYLOAD STATION WEIGHT:2',
			'BUSINESS_CLASS_UPPER_DECK': 'PAYLOAD STATION WEIGHT:3',
			'FIRST_CLASS': 'PAYLOAD STATION WEIGHT:4',
			'BUSINESS_CLASS_MAIN_DECK': 'PAYLOAD STATION WEIGHT:5',
			'PREMIUM_ECONOMY': 'PAYLOAD STATION WEIGHT:6',
			'FORWARD_ECONOMY_CABIN': 'PAYLOAD STATION WEIGHT:7',
			'REAR_ECONOMY_CABIN': 'PAYLOAD STATION WEIGHT:8',
			'FORWARD_BAGGAGE': 'PAYLOAD STATION WEIGHT:9',
			'REAR_BAGGAGE': 'PAYLOAD STATION WEIGHT:10',
			'CREW': 'PAYLOAD STATION WEIGHT:11'
		};
	}

	static get centerOfGravity() {
		return this._centerOfGravity;
	}

	static set centerOfGravity(value) {
		this._centerOfGravity = value;
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

	constructor(fmc) {
		this.fmc = fmc;
		this.tankPriorityValues = [
			{'LEFT_MAIN': 0, 'RIGHT_MAIN': 0, 'LEFT_AUX': 0, 'RIGHT_AUX': 0},
			{'CENTER': 0},
			{'LEFT_TIP': 0, 'RIGHT_TIP': 0},
			{'STAB': 0}
		];

		this.payloadValues = [
			{'PILOT': 0, 'COPILOT': 0},
			{
				'BUSINESS_CLASS_UPPER_DECK': 0,
				'FIRST_CLASS': 0,
				'BUSINESS_CLASS_MAIN_DECK': 0,
				'FORWARD_ECONOMY_CABIN': 0,
				'FORWARD_BAGGAGE': 0
			},
			{'PREMIUM_ECONOMY': 0, 'REAR_ECONOMY_CABIN': 0, 'REAR_BAGGAGE': 0, 'CREW': 0}
		];
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
		let rows = HeavyArray.Fmc.EmptyRows;

		this.calculateTanks(60000);

		Heavy_B747_8_FMC_HeavyPayloadManager.tankPriority.forEach((tanks, index) => {
			tanks.forEach((tank) => {
				console.log(tank + ' ' + this.tankPriorityValues[index][tank]);
				SimVar.SetSimVarValue(Heavy_B747_8_FMC_HeavyPayloadManager.tankVariables[tank], 'Gallons', this.tankPriorityValues[index][tank]);
			});
		});

		console.log('Sim: ' + SimVar.GetSimVarValue('CG PERCENT', 'Percent'));
		console.log('Payload: ' + SimVar.GetSimVarValue('PAYLOAD STATION WEIGHT:1', 'Pounds'));
		console.log('Per gallor: ' + SimVar.GetSimVarValue('FUEL WEIGHT PER GALLON', 'Pounds'));
		console.log(Simplane.getTotalFuel());

		SimVar.GetSimVarValue('FUEL TOTAL QUANTITY WEIGHT', 'Pounds');


		rows[0][0] = FMCString.PageTitle.PAYLOAD_MANAGER;
		rows[12][0] = FMCString.Prompt.BACK_LEFT;

		this.fmc.setTemplate(rows);

		this.fmc.onLeftInput[5] = () => {
			new Heavy_B747_8_FMC_HeavyMenuPage().showPage(this.fmc);
		};
	}
}