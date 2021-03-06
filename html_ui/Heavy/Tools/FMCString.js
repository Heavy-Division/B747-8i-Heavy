const FMCString = {
	Placeholder: {},
	PageTitle: {
		ECON: 'ECON',
		LIM_SPD: 'LIM SPD',
		MCP_SPD: 'MCP SPD',
		E_O: 'E/O',
		CLB: 'CLB',
		CRZ: 'CRZ',
		DES: 'DES',
		MOD: 'MOD',
		ACT: 'ACT',
		HEAVY_MENU: 'HEAVY MENU',
		HEAVY: 'HEAVY',
		HEAVY_IRS: 'HEAVY IRS',
		SIM_RATE_MANAGER: 'SIM RATE MANAGER',
		PAYLOAD_MANAGER: 'PAYLOAD MANAGER'
	},
	LineTitle: {
		CRZ_ALT: 'CRZ ALT',
		ECON_SPD: 'ECON SPD',
		SEL_SPD: 'SEL SPD',
		SPD_TRANS: 'SPD TRANS',
		SPD_RESTR: 'SPD RESTR',
		TRANS_ALT: 'TRANS ALT',
		MAX_ANGLE: 'MAX ANGLE',
		IRS_STATUS: 'IRS STATUS',
		ALIGN_TIME: 'ALIGN TIME',
		PAYLOAD: 'PAYLOAD',
		FOB: 'FOB',
		FUEL_ON_BOARD: 'FUEL ON BOARD',
		ZFW: 'ZFW',
		ZERO_FUEL_WEIGHT: 'ZERO FUEL WEIGHT',
		ZFWCG: 'ZFWCG',
		CG: 'CG'
	},
	Line: {
		Dash: {
			1: '-',
			2: '--',
			3: '---',
			4: '----',
			5: '-----',
			6: '------',
			7: '-------',
			8: '--------',
			9: '---------',
			10: '----------'
		},
		Box: {
			1: '□',
			2: '□□',
			3: '□□□',
			4: '□□□□',
			5: '□□□□□',
			6: '□□□□□□',
			7: '□□□□□□□',
			8: '□□□□□□□□',
			9: '□□□□□□□□□',
			10: '□□□□□□□□□□'
		},
		Underscore: {
			1: '_',
			2: '__',
			3: '___',
			4: '____',
			5: '_____'
		},
		OFF: 'OFF',
		INITED: 'INITED',
		ALIGNING: 'ALIGNING',
		ALIGNED: 'ALIGNED',
	},
	Scratchpad: {
		Error: {
			INVALID_ENTRY: 'INVALID ENTRY'
		}
	},
	Prompt: {
		HEAVY_RIGHT: 'HEAVY>',
		SIM_RATE_MANAGER_RIGHT: 'SIM RATE MANAGER>',
		PAYLOAD_MANAGER_RIGHT: 'PAYLOAD MANAGER>',
		HEAVY_IRS_RIGHT: 'IRS>',
		ALIGN_TIME_RIGHT: 'ALIGN TIME>',
		BACK_LEFT: '<BACK',
		INDEX_LEFT: '<INDEX',
		INIT_REF_INDEX_LEFT: 'INIT/REF INDEX',
		RETURN_LEFT: '<RETURN',
		ECON_LEFT: '<ECON',
		ENG_OUT_RIGHT: 'ENG OUT>',
		CLB_DIR_RIGHT: 'CLB DIR>',
		EMERGENCY_LEFT: '<EMERGENCY',
		REQUEST_LEFT: '<REQUEST',
		REQUEST_RIGHT: 'REQUEST>',
		VERIFY_RIGHT: 'VERIFY>',
		SEND_LEFT: '<SEND',
		SEND_RIGHT: 'SEND>',
		REPORT_LEFT: '<REPORT',
		LOG_LEFT: '<LOG',
		LOG_RIGHT: 'LOG>',
		LOGON_STATUS_LEFT: '<LOGON/STATUS',
		PRINT_LOG_LEFT: '<PRINT LOG',
		PRINT_LEFT: '<PRINT',
		ARM_RIGHT: 'ARM>',
		STANDBY_LEFT: '<STANDBY',
		REJECT_LEFT: '<REJECT',
		LOAD_RIGHT: 'LOAD>',
		LOAD_LEFT: '<LOAD',
		ACCEPT_RIGHT: 'ACCEPT>',
		POS_REPORT_RIGHT: 'POS REPORT>',
		POS_REPORT_LEFT: '<POS REPORT',
		WHEN_CAN_WE_RIGHT: 'WHEN CAN WE>',
		CLEARANCE_RIGHT: 'CLEARANCE>',
		VOICE_RIGHT: 'VOICE>',
		UPLINK_LEFT: '<UPLINK',
		FMC_LEFT: '<FMC',
		ACARS_LEFT: '<ACARS',
		SAT_LEFT: '<SAT',
		ACMS_LEFT: '<ACMS',
		CMC_LEFT: '<CMC',
		SELECT_RIGHT: 'SELECT>',
		MAP_RIGHT: 'MAP>',
		PLN_RIGHT: 'PLN>',
		APP_RIGHT: 'APP>',
		VOR_RIGHT: 'VOR>',
		CTR_RIGHT: 'CTR>',
		OPTIONS_RIGHT: 'OPTIONS>',
		WPT_RIGHT: 'WPT>',
		STA_RIGHT: 'STA>',
		ARPT_RIGHT: 'ARPT>',
		DATA_RIGHT: 'DATA>',
		ADF_RIGHT: 'ADF>',
		CONTROL_RIGHT: 'CONTROL>',
		WXR_LEFT: '<WXR',
		POS_LEFT: '<POS',
		MTRS_LEFT: '<MTRS',
		VOR_LEFT: '<VOR',
		ENG_LEFT: '<ENG',
		STAT_LEFT: '<STAT',
		CANC_LEFT: '<CANC',
		FUEL_RIGHT: 'FUEL>',
		GEAR_RIGHT: 'GEAR>',
		RCL_RIGHT: 'RCL>',
		SYNOPTICS_RIGHT: 'SYNOPTICS>',
		HYD_RIGHT: 'HYD>',
		DOORS_RIGHT: 'DOORS>',
		MODES_RIGHT: 'MODES>',
		ELEC_LEFT: '<ELEC',
		ECS_LEFT: '<ECS',
		CROSS_LOAD_LEFT: '<CROSS LOAD',
		PERF_FACTORS_LEFT: '<PERF FACTORS',
		IRS_MONITOR_LEFT: '<IRS MONITOR',
		INHIBIT_RIGHT: 'INHIBIT>',
		BRG_DIST_RIGHT: 'BRG/DIST>',
		PURGE_LEFT: '<PURGE',
		IDENT_LEFT: '<IDENT',
		PERF_LEFT: '<PERF',
		THRUST_LIM_LEFT: '<THRUST LIM',
		THRUST_LIM_RIGHT: 'THRUST LIM>',
		TAKEOFF_LEFT: '<TAKEOFF',
		TAKEOFF_RIGHT: 'TAKEOFF>',
		APPROACH_LEFT: '<APPROACH',
		NAV_DATA_RIGHT: 'NAV DATA>',
		MAINT_RIGHT: 'MAINT>',
		POS_INIT_RIGHT: 'POS INIT>',
		ROUTE_RIGHT: 'ROUTE>',
		ACTIVATE_RIGHT: 'ACTIVATE>',
		DEACTIVATE_RIGHT: 'DEACTIVATE>',
		PERF_INIT_RIGHT: 'PERF INIT>',
		RTE_2_LEFT: '<RTE 2',
		DEP_LEFT: '<DEP',
		ARR: 'ARR>',
		ERASE_LEFT: '<ERASE',
		CLB_RIGHT: 'CLB>',
		CLB_1_RIGHT: 'CLB 1>',
		CLB_2_RIGHT: 'CLB 2>',
		RTE_DATA_RIGHT: 'RTE DATA>',
		STEP_RIGHT: 'STEP>',
		RTE_2_LEGS_RIGHT: 'RTE 2 LEGS>',
		RTE_2_LEGS_LEFT: '<RTE 2 LEGS',
		GA_LEFT: '<GA',
		CON_LEFT: '<CON',
		CRZ_LEFT: '<CRZ',
		ALL_ENG_RIGHT: 'ALL ENG>',
		LCR_RIGHT: 'LCR>',
		E_O_SPD_LEFT: '<E/O SPD',
		RTA_PROGRESS_LEFT: '<RTA PROGRESS',
		ERASE_FIX_LEFT: '<ERASE FIX',
		LEGS_LEFT: '<LEGS',
		POS_REF_RIGHT: 'POS REF>',
		OFFPATH_DES_LEFT: '<OFFPATH DES',
		DES_DIR_RIGHT: 'DES DIR>',
		FORECAST_RIGHT: 'FORECAST>',
		DES_LEFT: '<DES',
		SELECT_ON_RIGHT: 'SELECT ON>',
		PPOS_RIGHT: 'PPOS>',
		NEXT_HOLD_LEFT: '<NEXT HOLD',
		EXIT_HOLD_RIGHT: 'EXIT HOLD>',
		AIRWAYS_RIGHT: 'AIRWAYS>',
		LAT_LON_RIGHT: 'LAT/LON>',
		SEL_BOTH: '<SEL>',
		ACT_BOTH: '<ACT>',
		EMERGENCY_SHUTDOWN_LEFT: '<EMERGENCY SHUTDOWN',
		FORCE_ALIGN_RIGHT: 'FORCE ALIGN>'
	},
	Common: {
		SLASH: '/',
		BACKSLASH: '\\',
		PERIOD: '.',
		COMMA: ',',
		BOX: '□',
		FMC_SEPARATOR: '------------------------',
		FLIGHT_LEVEL: 'FL'
	},
	Component: {
		SimRateManager: {
			RateMode: {
				OFF: 'OFF',
				LINEAR: 'LINEAR',
				NORMAL: 'NORMAL',
				AGGRESSIVE: 'AGGRESSIVE'
			}
		}
	}
};
