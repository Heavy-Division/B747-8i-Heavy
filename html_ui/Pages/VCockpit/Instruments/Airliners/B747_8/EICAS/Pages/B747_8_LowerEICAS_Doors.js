var B747_8_LowerEICAS_Doors;
(function (B747_8_LowerEICAS_Doors) {
	class Display extends Airliners.EICASTemplateElement {
		constructor() {
			super();
			this.isInitialised = false;
		}

		get templateID() {
			return 'B747_8LowerEICASDoorsTemplate';
		}

		connectedCallback() {
			super.connectedCallback();
			TemplateElement.call(this, this.init.bind(this));
		}

		init() {

			this.fwdCargoRectangleElement = document.getElementById('rectangle-fwd-cargo');

			this.entry1LeftLineElement = document.getElementById('line-entry-1-left');
			this.entry1LeftOpenLineElement = document.getElementById('line-entry-1-left-open');
			this.entry1LeftRectangleElement = document.getElementById('rectangle-entry-1-left');
			this.entry1LeftStatusElement = document.getElementById('text-entry-1-left-status');

			this.entry5RightLineElement = document.getElementById('line-entry-5-right');
			this.entry5RightOpenLineElement = document.getElementById('line-entry-5-right-open');
			this.entry5RightRectangleElement = document.getElementById('rectangle-entry-5-right');
			this.entry5RightStatusElement = document.getElementById('text-entry-5-right-status');

			this.isInitialised = true;
		}

		update(_deltaTime) {
			if (!this.isInitialised) {
				return;
			}

			this.fwdCargoRectangleElement.style.visibility = (this.isFwdCargoOpened() ? 'visible' : 'hidden');

			if (this.isEntry1LeftOpened()) {
				this.entry1LeftLineElement.style.visibility = 'hidden';
				this.entry1LeftStatusElement.style.visibility = 'hidden';
				this.entry1LeftOpenLineElement.style.visibility = 'visible';
				this.entry1LeftRectangleElement.style.visibility = 'visible';
			} else {
				this.entry1LeftLineElement.style.visibility = 'visible';
				this.entry1LeftStatusElement.style.visibility = 'visible';
				this.entry1LeftOpenLineElement.style.visibility = 'hidden';
				this.entry1LeftRectangleElement.style.visibility = 'hidden';
			}

			if (this.isEntry5RightOpened()) {
				this.entry5RightLineElement.style.visibility = 'hidden';
				this.entry5RightStatusElement.style.visibility = 'hidden';
				this.entry5RightOpenLineElement.style.visibility = 'visible';
				this.entry5RightRectangleElement.style.visibility = 'visible';
			} else {
				this.entry5RightLineElement.style.visibility = 'visible';
				this.entry5RightStatusElement.style.visibility = 'visible';
				this.entry5RightOpenLineElement.style.visibility = 'hidden';
				this.entry5RightRectangleElement.style.visibility = 'hidden';
			}
		}

		isFwdCargoOpened() {
			return SimVar.GetSimVarValue('INTERACTIVE POINT OPEN:12', 'percent') > 20;
		}

		isEntry1LeftOpened() {
			return SimVar.GetSimVarValue('INTERACTIVE POINT OPEN:10', 'percent') > 20;
		}

		isEntry5RightOpened() {
			return SimVar.GetSimVarValue('INTERACTIVE POINT OPEN:1', 'percent') > 20;
		}

		isBaggageDoorOpened() {
			return this.isFwdCargoOpened();
		}

		isRampDoorOpened() {
			return this.isEntry1LeftOpened();
		}

		isCateringDoorOpened() {
			return this.isEntry5RightOpened();
		}

	}

	B747_8_LowerEICAS_Doors.Display = Display;
})(B747_8_LowerEICAS_Doors || (B747_8_LowerEICAS_Doors = {}));
customElements.define('b747-8-lower-eicas-doors', B747_8_LowerEICAS_Doors.Display);
