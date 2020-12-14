const HeavyArray = {
	SimRateManager: {
		get Modes() {
			return [FMCString.Component.SimRateManager.RateMode.OFF, FMCString.Component.SimRateManager.RateMode.LINEAR, FMCString.Component.SimRateManager.RateMode.NORMAL, FMCString.Component.SimRateManager.RateMode.AGGRESSIVE]
		}
	},
	Fmc: {
		get EmptyRows(){
			return [['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', '']];
		}
	}
};