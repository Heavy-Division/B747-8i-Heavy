Include.addScript('/Heavy/Utils/HeavyDataStorage.js');

const HeavyWaypointConstraintsStorage = {};

HeavyWaypointConstraintsStorage.storagePrefix = '_WAYPOINT_';

HeavyWaypointConstraintsStorage.get = function (_key, _default) {
	return HeavyDataStorage.get(HeavyWaypointConstraintsStorage.storagePrefix + _key, _default);
};

HeavyWaypointConstraintsStorage.set = function (_key, _data) {
	HeavyDataStorage.set(HeavyWaypointConstraintsStorage.storagePrefix + _key, _data);
};

HeavyWaypointConstraintsStorage.store = function (_waypoint, _data) {
	console.log('NOT IMPLEMENTED');
};

HeavyWaypointConstraintsStorage.load = function (_waypoint, _data) {
	console.log('NOT IMPLEMENTED');
};