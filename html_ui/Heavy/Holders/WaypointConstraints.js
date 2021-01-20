class WaypointConstraints {

	/**
	 * Altitude constraint NONE type (Altitude description)
	 * @returns {number}
	 */
	static get ALTITUDE_CONSTRAINT_NONE() {
		return 0;
	}

	/**
	 * Altitude constraint EQUAL type (Altitude description)
	 * @returns {number}
	 */
	static get ALTITUDE_CONSTRAINT_EQUAL() {
		return 1;
	}

	/**
	 * Altitude constraint A type (Altitude description)
	 * @returns {number}
	 */
	static get ALTITUDE_CONSTRAINT_A() {
		return 2;
	}

	/**
	 * Altitude constraint B type (Altitude description)
	 * @returns {number}
	 */
	static get ALTITUDE_CONSTRAINT_B() {
		return 3;
	}

	/**
	 * Altitude constraint AB type (Altitude description)
	 * @returns {number}
	 */
	static get ALTITUDE_CONSTRAINT_AB() {
		return 4;
	}

	/**
	 * Constructor
	 */
	constructor(altitudeDescription = 0, legAltitude1 = 0, legAltitude2 = 0, speedConstraint = -1) {
		/**
		 * We use abbreviations for properties
		 * because we use JSON string for storing
		 * object in local data storage
		 */
		/**
		 * Altitude description
		 * @type {number}
		 * @private
		 */
		this._ad = altitudeDescription;
		/**
		 * Leg altitude 1
		 * @type {number}
		 * @private
		 */
		this._a1 = legAltitude1;
		/**
		 * Leg altitude 2
		 * @type {number}
		 * @private
		 */
		this._a2 = legAltitude2;
		/**
		 * Speed constraint
		 * @type {number}
		 * @private
		 */
		this._s = speedConstraint;
	}

	/**
	 * Leg altitude 1 getter
	 * @returns {number}
	 */
	get legAltitude1(){
		return this._a1;
	}

	/**
	 * Leg altitude 1 setter
	 * @param altitude
	 */
	set legAltitude1(altitude){
		this._a1 = altitude;
	}

	/**
	 * Leg altitude 2 getter
	 * @returns {number}
	 */
	get legAltitude2(){
		return this._a2;
	}

	/**
	 * Leg altitude 2 setter
	 * @param altitude
	 */
	set legAltitude2(altitude){
		this._a2 = altitude;
	}

	/**
	 * Speed constraint getter
	 * @returns {number}
	 */
	get speed(){
		return this._s;
	}

	/**
	 * Speed constraint setter
	 * @param speed
	 */
	set speed(speed){
		this._s = speed;
	}

	/**
	 * Leg altitude description getter
	 * @returns {number}
	 */
	get legAltitudeDescription(){
		return this._ad;
	}

	/**
	 * Leg altitude description setter
	 * @param type
	 */
	set legAltitudeDescription(type){
		if(!(type !== WaypointConstraints.ALTITUDE_CONSTRAINT_NONE || type !== WaypointConstraints.ALTITUDE_CONSTRAINT_EQUAL || type !== WaypointConstraints.ALTITUDE_CONSTRAINT_A || type !== WaypointConstraints.ALTITUDE_CONSTRAINT_B || type !== WaypointConstraints.ALTITUDE_CONSTRAINT_AB)){
			return;
		}
		this._ad = type
	}
}