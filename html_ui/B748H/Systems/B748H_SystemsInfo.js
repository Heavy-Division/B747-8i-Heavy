class B748H_SystemsInfo {
	static get SYSTEM() {
		return {'IRS': 'B748H_IRS'};
	}

	constructor() {
		this.systems = {};
		this.systems[B748H_Systems.SYSTEM.IRS] = new B748H_IRSInfo();
	}

	getIRS(){
		return this.systems[B748H_Systems.SYSTEM.IRS];
	}

	getSystem(name) {
		if (this.systems.hasOwnProperty(name)) {
			return this.systems[name].instance;
		}
		return null;
	}
}