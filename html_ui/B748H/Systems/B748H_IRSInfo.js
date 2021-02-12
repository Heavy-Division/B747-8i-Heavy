class B748H_IRSInfo {

	static get ALIGN_SPEED() {
		return {'INSTANT': 'INSTANT', 'FAST': 'FAST', 'NORMAL': 'NORMAL'};
	}

	constructor() {
		this.localVariables = B748H_LocalVariables.IRS;
	}

	getLState() {
		return SimVar.GetSimVarValue(this.localVariables.L.STATE, 'Number');
	}

	setLState(value) {
		SimVar.SetSimVarValue(this.localVariables.L.STATE, 'Number', value);
	}

	getCState() {
		return SimVar.GetSimVarValue(this.localVariables.C.STATE, 'Number');
	}

	setCState(value) {
		SimVar.SetSimVarValue(this.localVariables.C.STATE, 'Number', value);
	}

	getRState() {
		return SimVar.GetSimVarValue(this.localVariables.R.STATE, 'Number');
	}

	setRState(value) {
		SimVar.SetSimVarValue(this.localVariables.R.STATE, 'Number', value);
	}

	getLSwitchState() {
		return SimVar.GetSimVarValue(this.localVariables.L.SWITCH_STATE, 'Number');
	}

	setLSwitchState(value) {
		SimVar.SetSimVarValue(this.localVariables.L.SWITCH_STATE, 'Number', value);
	}

	getCSwitchState() {
		return SimVar.GetSimVarValue(this.localVariables.C.SWITCH_STATE, 'Number');
	}

	setCSwitchState(value) {
		SimVar.SetSimVarValue(this.localVariables.C.SWITCH_STATE, 'Number', value);
	}

	getRSwitchState() {
		return SimVar.GetSimVarValue(this.localVariables.R.SWITCH_STATE, 'Number');
	}

	setRSwitchState(value) {
		SimVar.SetSimVarValue(this.localVariables.R.SWITCH_STATE, 'Number', value);
	}

	getLInitTime(){
		return SimVar.GetSimVarValue(this.localVariables.L.INIT_TIME, "Number");
	}

	setLInitTime(value){
		SimVar.SetSimVarValue(this.localVariables.L.INIT_TIME, "String", value.toString());
	}

	getLTimeForAlign(){
		return SimVar.GetSimVarValue(this.localVariables.L.TIME_FOR_ALIGN, "Number");
	}

	setLTimeForAlign(value){
		SimVar.SetSimVarValue(this.localVariables.L.TIME_FOR_ALIGN, "String", value.toString());
	}

	getCInitTime(){
		return SimVar.GetSimVarValue(this.localVariables.C.INIT_TIME, "Number");
	}

	setCInitTime(value){
		SimVar.SetSimVarValue(this.localVariables.C.INIT_TIME, "String", value.toString());
	}

	getCTimeForAlign(){
		return SimVar.GetSimVarValue(this.localVariables.C.TIME_FOR_ALIGN, "Number");
	}

	setCTimeForAlign(value){
		SimVar.SetSimVarValue(this.localVariables.C.TIME_FOR_ALIGN, "String", value.toString());
	}

	getRInitTime(){
		return SimVar.GetSimVarValue(this.localVariables.R.INIT_TIME, "Number");
	}

	setRInitTime(value){
		SimVar.SetSimVarValue(this.localVariables.R.INIT_TIME, "String", value.toString());
	}

	getRTimeForAlign(){
		return SimVar.GetSimVarValue(this.localVariables.R.TIME_FOR_ALIGN, "Number");
	}

	setRTimeForAlign(value){
		SimVar.SetSimVarValue(this.localVariables.R.TIME_FOR_ALIGN, "String", value.toString());
	}

	isInited() {
		return SimVar.GetSimVarValue(this.localVariables.IS_INITED, 'Number');
	}

	setInited(value) {
		SimVar.SetSimVarValue(this.localVariables.IS_INITED, 'String', value.toString());
	}

	isPositionSet() {
		return SimVar.GetSimVarValue(this.localVariables.POSITION_SET, 'Number');
	}

	setPositionSet(value) {
		SimVar.SetSimVarValue(this.localVariables.POSITION_SET, 'Number', value);
	}
}