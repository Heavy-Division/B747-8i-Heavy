var B747_8_LowerEICAS_Elec;
(function (B747_8_LowerEICAS_Elec) {
	class Display extends Airliners.EICASTemplateElement {
		constructor() {
			super();
			this.isInitialised = false;
			this.engine = {
				1: {alternator: {on: null, active: null}, combustion: null},
				2: {alternator: {on: null, active: null}, combustion: null},
				3: {alternator: {on: null, active: null}, combustion: null},
				4: {alternator: {on: null, active: null}, combustion: null}
			};
			this.apu = {1: {}, 2: {}};
			this.external = {1: {}, 2: {}};
			this.bus = {1: {}, 2: {}, 3: {}, 4: {}, 'main': {}};
			this.cache = false;
		}

		get templateID() {
			return 'B747_8LowerEICASElecTemplate';
		}

		connectedCallback() {
			super.connectedCallback();
			TemplateElement.call(this, this.init.bind(this));
		}

		init() {
			this.elementFlowApu = [];
			this.elementFlowApu[1] = document.getElementById('flow-apu-1');
			this.elementFlowApu[2] = document.getElementById('flow-apu-2');

			this.elementFlowExternal = [];
			this.elementFlowExternal[1] = document.getElementById('flow-ext-1');
			this.elementFlowExternal[2] = document.getElementById('flow-ext-2');

			this.elementFlowBusUp = [];
			this.elementFlowBusUp[1] = document.getElementById('flow-bus-tie-1-up');
			this.elementFlowBusUp[2] = document.getElementById('flow-bus-tie-2-up');
			this.elementFlowBusUp[3] = document.getElementById('flow-bus-tie-2-up');
			this.elementFlowBusUp[4] = document.getElementById('flow-bus-tie-4-up');

			this.elementFlowBusDown = [];
			this.elementFlowBusDown[1] = document.getElementById('flow-bus-tie-1-down');
			this.elementFlowBusDown[2] = document.getElementById('flow-bus-tie-2-down');
			this.elementFlowBusDown[3] = document.getElementById('flow-bus-tie-3-down');
			this.elementFlowBusDown[4] = document.getElementById('flow-bus-tie-4-down');

			this.elementFlowGen = [];
			this.elementFlowGen[1] = document.getElementById('gen-1-flow');
			this.elementFlowGen[2] = document.getElementById('gen-2-flow');
			this.elementFlowGen[3] = document.getElementById('gen-3-flow');
			this.elementFlowGen[4] = document.getElementById('gen-4-flow');
			this.elementGenOff = [];
			this.elementGenOff[1] = document.getElementById('gen-1-off');
			this.elementGenOff[2] = document.getElementById('gen-2-off');
			this.elementGenOff[3] = document.getElementById('gen-3-off');
			this.elementGenOff[4] = document.getElementById('gen-4-off');
			this.elementFlowGenUp = [];
			this.elementFlowGenUp[1] = document.getElementById('flow-gen-1-up');
			this.elementFlowGenUp[2] = document.getElementById('flow-gen-2-up');
			this.elementFlowGenUp[3] = document.getElementById('flow-gen-3-up');
			this.elementFlowGenUp[4] = document.getElementById('flow-gen-4-up');

			this.elementBusIsln = [];
			this.elementBusIsln[1] = document.getElementById('bus-tie-1-isln');
			this.elementBusIsln[2] = document.getElementById('bus-tie-2-isln');
			this.elementBusIsln[3] = document.getElementById('bus-tie-3-isln');
			this.elementBusIsln[4] = document.getElementById('bus-tie-4-isln');

			this.elementFlowBus = [];
			this.elementFlowBus[1] = document.getElementById('bus-tie-1-flow');
			this.elementFlowBus[2] = document.getElementById('bus-tie-2-flow');
			this.elementFlowBus[3] = document.getElementById('bus-tie-3-flow');
			this.elementFlowBus[4] = document.getElementById('bus-tie-4-flow');

			this.elementBusInfoGroup = [];
			this.elementBusInfoGroup[1] = document.getElementById('bus-1-info-group');
			this.elementBusInfoGroup[2] = document.getElementById('bus-2-info-group');
			this.elementBusInfoGroup[3] = document.getElementById('bus-3-info-group');
			this.elementBusInfoGroup[4] = document.getElementById('bus-4-info-group');

			this.elementFlowSsb = document.getElementById('flow-ssb');
			this.elementOutlineSsbConnected = document.getElementById('ssb-outline-connected');
			this.elementOutlineSsbDisonnected = document.getElementById('ssb-outline-disconnected');


			this.isInitialised = true;
		}

		prepareSimVars() {
			this.apu['1'].active = SimVar.GetSimVarValue('APU GENERATOR ACTIVE:1', 'Boolean');
			this.apu['1'].on = SimVar.GetSimVarValue('APU GENERATOR SWITCH:1', 'Boolean');
			this.apu['1'].available = SimVar.GetSimVarValue('APU PCT RPM', 'Percent') > 95
			this.apu['2'].active = SimVar.GetSimVarValue('APU GENERATOR ACTIVE:2', 'Boolean');
			this.apu['2'].on = SimVar.GetSimVarValue('APU GENERATOR SWITCH:2', 'Boolean');
			this.apu['2'].available = SimVar.GetSimVarValue('APU PCT RPM', 'Percent') > 95

			this.external['1'].available = SimVar.GetSimVarValue('EXTERNAL POWER AVAILABLE:1', 'Boolean');
			this.external['1'].on = SimVar.GetSimVarValue('EXTERNAL POWER ON:1', 'Boolean');
			this.external['1'].active = (this.external['1'].available && this.external['1'].on);
			this.external['2'].available = SimVar.GetSimVarValue('EXTERNAL POWER AVAILABLE:2', 'Boolean');
			this.external['2'].on = SimVar.GetSimVarValue('EXTERNAL POWER ON:2', 'Boolean');
			this.external['2'].active = (this.external['2'].available && this.external['2'].on);

			this.bus['1'].connection = SimVar.GetSimVarValue('BUS CONNECTION ON:2', 'Boolean');
			this.bus['2'].connection = SimVar.GetSimVarValue('BUS CONNECTION ON:3', 'Boolean');
			this.bus['3'].connection = SimVar.GetSimVarValue('BUS CONNECTION ON:4', 'Boolean');
			this.bus['4'].connection = SimVar.GetSimVarValue('BUS CONNECTION ON:5', 'Boolean');
			this.bus['main'].voltage = SimVar.GetSimVarValue('ELECTRICAL MAIN BUS VOLTAGE:1', 'Volts');

			this.engine['1'].combustion = SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:1', 'Boolean');
			this.engine['2'].combustion = SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:2', 'Boolean');
			this.engine['3'].combustion = SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:3', 'Boolean');
			this.engine['4'].combustion = SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:4', 'Boolean');

			this.engine['1'].alternator.on = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:1', 'Boolean');
			this.engine['2'].alternator.on = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:2', 'Boolean');
			this.engine['3'].alternator.on = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:3', 'Boolean');
			this.engine['4'].alternator.on = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:4', 'Boolean');

			// Alternator is active when switch is ON and ENG COMBUSTION is 1.
			this.engine['1'].alternator.active = this.engine['1'].alternator.on && this.engine['1'].combustion;
			this.engine['2'].alternator.active = this.engine['2'].alternator.on && this.engine['2'].combustion;
			this.engine['3'].alternator.active = this.engine['3'].alternator.on && this.engine['3'].combustion;
			this.engine['4'].alternator.active = this.engine['4'].alternator.on && this.engine['4'].combustion;
		}

		/**
		 * voltage 1 -
		 * voltage 2 - ENG 1 ISLN
		 * voltage 3 - ENG 2 ISLN
		 * voltage 4 - ENG 3 ISLN
		 * voltage 5 - ENG 4 ISLN
		 * voltage 6 - battery
		 *
		 * @param number
		 * @returns {*}
		 */
		getApu(number) {
			return this.apu[number];
		}

		getEngine(number) {
			return this.engine[number];
		}

		getBus(number) {
			return this.bus[number];
		}

		getExternal(number) {
			return this.external[number];
		}

		showElement(element) {
			element.style.visibility = 'visible';
		}

		hideElement(element) {
			element.style.visibility = 'hidden';
		}

		update(_deltaTime) {
			if (!this.isInitialised) {
				return;
			}

			this.cache = false;
			this.prepareSimVars();

			// Is APU active
			[1, 2].forEach((number) => {
				if (this.getApu(number).on && this.getApu(number).active) {
					this.showElement(this.elementFlowApu[number]);
				} else {
					this.hideElement(this.elementFlowApu[number]);
				}
			});

			// Is External power active
			[1, 2].forEach((number) => {
				if (this.getExternal(number).active) {
					this.showElement(this.elementFlowExternal[number]);
				} else {
					this.hideElement(this.elementFlowExternal[number]);
				}
			});

			// SSB Logic
			/**
			 * condition 1) (APU 1 OR EXT 1 ON) && (APU 2 OR EXT 2 ON) -> disconnected
			 * condition 2) (APU 1 OR APU 2 ON) && (ALL ALTERNATORS OFF) -> connected
			 * condition 3) (APU 1 ON) && (ALTERNATOR 3 OR 4 ON) -> disconnected
			 * condition 4) (APU 2 ON) && (ALTERNATOR 1 OR 2 ON) -> disconnected
			 * condition 5) (APU INOP) -> connected
			 */

			if (
				(
					((this.getApu(1).on && this.getApu(1).active && this.getApu(1).available) || this.getExternal(1).active)
					&
					((this.getApu(2).on && this.getApu(2).active && this.getApu(2).available) || this.getExternal(2).active)
				)
				||
				(
					((this.getEngine(1).alternator.active && this.getBus(1).connection) || (this.getEngine(2).alternator.active && this.getBus(2).connection))
					&
					((this.getEngine(3).alternator.active && this.getBus(3).connection) || (this.getEngine(4).alternator.active && this.getBus(4).connection))
				)
				||
				(
					((this.getApu(1).on && this.getApu(1).active && this.getApu(1).available) && (this.getEngine(3).alternator.active && this.getBus(3).connection) || (this.getEngine(4).alternator.active && this.getBus(4).connection))
					||
					((this.getApu(2).on && this.getApu(2).active && this.getApu(2).available) && (this.getEngine(1).alternator.active && this.getBus(1).connection) || (this.getEngine(2).alternator.active && this.getBus(2).connection))
				)
			) {
				this.hideElement(this.elementFlowSsb);
				this.hideElement(this.elementOutlineSsbConnected);
				this.showElement(this.elementOutlineSsbDisonnected);
			} else {
				this.showElement(this.elementFlowSsb);
				this.showElement(this.elementOutlineSsbConnected);
				this.hideElement(this.elementOutlineSsbDisonnected);
			}

			// Is ALTERNATOR active
			[1, 2, 3, 4].forEach((number) => {
					if (this.getEngine(number).alternator.active) {
						this.showElement(this.elementFlowGen[number]);
						this.showElement(this.elementFlowGenUp[number]);
						this.hideElement(this.elementGenOff[number]);
					} else {
						this.hideElement(this.elementFlowGen[number]);
						this.hideElement(this.elementFlowGenUp[number]);
						this.showElement(this.elementGenOff[number]);
					}
				}
			);

			// Is BUS ISOLATED
			[1, 2, 3, 4].forEach((number) => {
				if (this.getBus(number).connection) {
					this.hideElement(this.elementBusIsln[number]);
					this.showElement(this.elementFlowBus[number]);
					this.showElement(this.elementFlowBusDown[number]);
				} else {
					this.hideElement(this.elementFlowBus[number]);
					this.hideElement(this.elementFlowBusDown[number]);
					this.showElement(this.elementBusIsln[number]);
				}
			});

			/**
			 * This should use "ELECTRICAL MAIN BUS VOLTAGE:index". Indexes 2 - 5
			 * Voltage = 0 - The bus is ISOLATED and ALTERNATOR is not ACTIVE
			 * Voltage > 0 - The bus is powered from ALTERNATOR (28 volts) or MAIN BUS (SYNC BUS) [External power (30.25 volts), APU (28 volts)]
			 * BUT -> It works only for ENG 1 (index 2) right now!!!! Indexes 3 - 5 is updated only by ISLN. Value is 0 volts when BUS is ISOLATED and ALTERNATOR active.
			 */
			[1,2,3,4].forEach((number) => {
				if (!(this.getEngine(number).alternator.active || (this.getBus('main').voltage > 0 && this.getBus(number).connection))) {
					this.elementBusInfoGroup[number].classList.add('bus-info-group-amber')
				} else {
					this.elementBusInfoGroup[number].classList.remove('bus-info-group-amber')
				}
			});
		}
	}

	B747_8_LowerEICAS_Elec.Display = Display;
})(B747_8_LowerEICAS_Elec || (B747_8_LowerEICAS_Elec = {}));
customElements.define('b747-8-lower-eicas-elec', B747_8_LowerEICAS_Elec.Display);
