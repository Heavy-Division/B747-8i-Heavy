Include.addScript("/JS/dataStorage.js");

const HeavyDataStorage = {};

HeavyDataStorage.storagePrefix = 'HEAVY_';

HeavyDataStorage.get = function (_key, _default) {
	return GetStoredData(HeavyDataStorage.storagePrefix + _key) || _default || false;
};

HeavyDataStorage.set = function (_key, _data) {
	SetStoredData(HeavyDataStorage.storagePrefix + _key, _data);
};