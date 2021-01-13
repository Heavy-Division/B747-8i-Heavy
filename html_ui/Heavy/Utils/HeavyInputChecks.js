const HeavyInputChecks = {};

HeavyInputChecks.speedRange = (input, min = 100, max = 399) => {
	let inputCheck = input;
	return isFinite(inputCheck) && inputCheck >= min && inputCheck <= max;
};

HeavyInputChecks.speedRangeWithAltitude = (input) => {
	let inputCheck = input.split('/');
	return HeavyInputChecks.speedRange(inputCheck[0]);
};