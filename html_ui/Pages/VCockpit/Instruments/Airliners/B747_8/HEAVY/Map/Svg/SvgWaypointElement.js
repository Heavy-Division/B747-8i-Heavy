class SvgWaypointElement extends SvgMapElement {
	constructor(source) {
		super();
		this.textOffsetRatio = 0.25;
		this.showText = true;
		this.minimize = false;
		this._alpha = NaN;
		this._textWidth = NaN;
		this._textHeight = NaN;
		this.needRepaint = false;
		this._lastX = 0;
		this._lastY = 0;
		this._lastMinimize = false;
		this._lastIsActiveWaypoint = false;
		this.source = source;
	}

	set isFlightPlanWaypoint(value) {
		this._isFlightPlanWaypoint = value;
	}

	get isFlightPlanWaypoint() {
		return this._isFlightPlanWaypoint || false;
	}

	get ident() {
		if (this._ident) {
			return this._ident;
		}
		if (this.source) {
			return this.source.ident;
		}
	}

	set ident(v) {
		this._ident = v;
	}

	get icao() {
		if (this._icao) {
			return this._icao;
		}
		if (this.source) {
			return this.source.icao;
		}
	}

	get icaoNoSpace() {
		if (this.source instanceof WayPoint) {
			return this.source.icaoNoSpace;
		}
		if (!this._icaoNoSpace) {
			if (this.icao) {
				this._icaoNoSpace = this.icao;
				while (this._icaoNoSpace.indexOf(' ') != -1) {
					this._icaoNoSpace = this._icaoNoSpace.replace(' ', '_');
				}
			}
		}
		if (this._icaoNoSpace) {
			return this._icaoNoSpace;
		}
	}

	set icao(v) {
		this._icao = v;
		this._icaoNoSpace = this._icao;
		while (this._icaoNoSpace.indexOf(' ') != -1) {
			this._icaoNoSpace.replace(' ', '_');
		}
	}

	get coordinates() {
		if (this._coordinates) {
			return this._coordinates;
		}
		if (this.source && this.source.coordinates) {
			return this.source.coordinates;
		}
	}

	set coordinates(v) {
		this._coordinates = v;
	}

	get bearing() {
		if (this._bearing) {
			return this._bearing;
		}
		if (this.source) {
			return this.source.bearing;
		}
	}

	set bearing(v) {
		this._bearing = v;
	}

	get distance() {
		if (this._distance) {
			return this._distance;
		}
		if (this.source) {
			return this.source.distance;
		}
	}

	set distance(v) {
		this._distance = v;
	}

	imageFileName() {
		if (this.source) {
			return this.source.imageFileName();
		}
	}

	createDraw(map) {
		let fontSize = map.config.waypointLabelFontSize;
		if (this.ident === 'DECEL') {
			fontSize = map.config.auxWaypointLabelFontSize;
		}
		let text = this.ident;
		let c = document.createElement('canvas');
		let ctx = c.getContext('2d');
		ctx.font = fontSize + 'px ' + map.config.waypointLabelFontFamily;
		this._textWidth = ctx.measureText(text).width;
		this._textHeight = fontSize * 0.675;

		c.setAttribute('width', (this._textWidth + map.config.waypointLabelBackgroundPaddingLeft + map.config.waypointLabelBackgroundPaddingRight).toFixed(0) + 'px');
		c.setAttribute('height', (this._textHeight + map.config.waypointLabelBackgroundPaddingTop + map.config.waypointLabelBackgroundPaddingBottom).toFixed(0) + 'px');

		let ident;
		let activeWaypoint = FlightPlanManager.DEBUG_INSTANCE.getActiveWaypoint(false, true);
		if (activeWaypoint) {
			ident = activeWaypoint.ident;
		}
		let isActiveWaypoint = this.source.ident === ident;
		this._refreshLabel(map, isActiveWaypoint);
		this._image = document.createElementNS(Avionics.SVG.NS, 'image');
		this._image.id = this.id(map);
		this._image.classList.add(this.class() + '-icon');
		this._image.setAttribute('hasTextBox', 'true');
		this._image.setAttribute('width', '100%');
		this._image.setAttribute('height', '100%');
		if (!isActiveWaypoint) {
			this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + this.imageFileName());
			if (this.ident === 'DECEL') {
				this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + 'ICON_MAP_AUX.png');
			}
			this.isFlightPlanWaypoint = false;
			let waypoints = [...FlightPlanManager.DEBUG_INSTANCE.getWaypoints(), ...FlightPlanManager.DEBUG_INSTANCE.getApproachWaypoints()];
			waypoints.forEach((waypoint) => {
				if (this.ident === waypoint.ident && !(this instanceof SvgNearestAirportElement)) {
					this.isFlightPlanWaypoint = true;
					this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + 'ICON_MAP_INTERSECTION_FLIGHTPLAN.png');
				}
			});
		} else {
			this.isFlightPlanWaypoint = !(this instanceof SvgNearestAirportElement);
			this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + 'ICON_MAP_INTERSECTION_FLIGHTPLAN_ACTIVE.png');
		}
		let iconSize = map.config.waypointIconSize;
		if (this.isFlightPlanWaypoint) {
			iconSize = map.config.flightPlanWaypointIconSize;
		}
		this.isFlightPlanWaypoint = false;

		this._lastIsActiveWaypoint = isActiveWaypoint;
		this._image.setAttribute('width', fastToFixed(iconSize, 0));
		this._image.setAttribute('height', fastToFixed(iconSize, 0));
		return this._image;
	}

	_refreshLabel(map, isActiveWaypoint) {
		let labelId = this.id(map) + '-text-' + map.index;
		let label = document.getElementById(labelId);
		if (label instanceof SVGForeignObjectElement) {
			this._label = label;
			this.needRepaint = true;
		}
		let fontSize = map.config.waypointLabelFontSize;

		if (this.ident === 'DECEL') {
			fontSize = map.config.auxWaypointLabelFontSize;
		}

		let text = this.ident;
		let canvas;
		if (!this._label) {
			this._label = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
			this._label.id = labelId;
			this._label.setAttribute('width', (this._textWidth + map.config.waypointLabelBackgroundPaddingLeft + map.config.waypointLabelBackgroundPaddingRight).toFixed(0) + 'px');
			this._label.setAttribute('height', (this._textHeight + map.config.waypointLabelBackgroundPaddingTop + map.config.waypointLabelBackgroundPaddingBottom).toFixed(0) + 'px');
			canvas = document.createElement('canvas');
			canvas.setAttribute('width', (this._textWidth + map.config.waypointLabelBackgroundPaddingLeft + map.config.waypointLabelBackgroundPaddingRight).toFixed(0) + 'px');
			canvas.setAttribute('height', (this._textHeight + map.config.waypointLabelBackgroundPaddingTop + map.config.waypointLabelBackgroundPaddingBottom).toFixed(0) + 'px');
			this._label.appendChild(canvas);
			map.textLayer.appendChild(this._label);
		} else {
			canvas = this._label.querySelector('canvas');
		}
		if (!canvas) {
			return;
		}
		let context = canvas.getContext('2d');
		context.clearRect(0, 0, this._textWidth + map.config.waypointLabelBackgroundPaddingLeft + map.config.waypointLabelBackgroundPaddingRight, this._textHeight + map.config.waypointLabelBackgroundPaddingTop + map.config.waypointLabelBackgroundPaddingBottom);
		if (map.config.waypointLabelUseBackground) {
			context.fillStyle = 'black';
			context.fillRect(0, 0, this._textWidth + map.config.waypointLabelBackgroundPaddingLeft + map.config.waypointLabelBackgroundPaddingRight, this._textHeight + map.config.waypointLabelBackgroundPaddingTop + map.config.waypointLabelBackgroundPaddingBottom);
		}
		if (!isActiveWaypoint) {
			if (this.source instanceof IntersectionInfo) {
				context.fillStyle = map.config.intersectionLabelColor;
			} else if (this.source instanceof VORInfo) {
				context.fillStyle = map.config.vorLabelColor;
			} else if (this.source instanceof NDBInfo) {
				context.fillStyle = map.config.ndbLabelColor;
			} else if (this.source instanceof AirportInfo) {
				context.fillStyle = map.config.airportLabelColor;
			} else {
				context.fillStyle = map.config.waypointLabelColor;
			}

			let waypoints = [...FlightPlanManager.DEBUG_INSTANCE.getWaypoints(), ...FlightPlanManager.DEBUG_INSTANCE.getApproachWaypoints()];
			waypoints.forEach((waypoint) => {
				if (this.ident === waypoint.ident && !(this instanceof SvgNearestAirportElement)) {
					context.fillStyle = 'white';
				} else if (this.ident === 'DECEL') {
					context.fillStyle = 'green';
				}
			});
		} else {
			context.fillStyle = 'magenta';
		}
		context.font = fontSize + 'px ' + map.config.waypointLabelFontFamily;
		context.fillText(text, map.config.waypointLabelBackgroundPaddingLeft, this._textHeight + map.config.waypointLabelBackgroundPaddingTop);
	}

	updateDraw(map) {
		if (this.coordinates) {
			map.coordinatesToXYToRef(this.coordinates, this);
		} else if (isFinite(this.source.latitudeFP) && isFinite(this.source.longitudeFP)) {
			map.coordinatesToXYToRef(new LatLongAlt(this.source.latitudeFP, this.source.longitudeFP), this);
		} else {
			let pos = map.bearingDistanceToXY(this.bearing, this.distance);
			this.x = pos.x;
			this.y = pos.y;
		}
		let wp = FlightPlanManager.DEBUG_INSTANCE.getActiveWaypoint(false, true);
		let isActiveWaypoint = this.source === wp || (wp && wp.icao === this.source.icao);
		if (isActiveWaypoint != this._lastIsActiveWaypoint) {
			this._refreshLabel(map, isActiveWaypoint);
			if (this._image) {
				if (!isActiveWaypoint) {
					this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + this.imageFileName());
					this.isFlightPlanWaypoint = false;
					let waypoints = [...FlightPlanManager.DEBUG_INSTANCE.getWaypoints(), ...FlightPlanManager.DEBUG_INSTANCE.getApproachWaypoints()];
					waypoints.forEach((waypoint) => {
						if (this.ident === waypoint.ident && !(this instanceof SvgNearestAirportElement)) {
							this.isFlightPlanWaypoint = true;
							this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + 'ICON_MAP_INTERSECTION_FLIGHTPLAN.png');
						}
					});
				} else {
					this.isFlightPlanWaypoint = true;
					this._image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', map.config.imagesDir + 'ICON_MAP_INTERSECTION_FLIGHTPLAN_ACTIVE.png');
				}
			}
			this._lastIsActiveWaypoint = isActiveWaypoint;
		}
		if (isFinite(this.x) && isFinite(this.y)) {
			let iconSize = map.config.waypointIconSize;
			if (this.isFlightPlanWaypoint) {
				iconSize = map.config.flightPlanWaypointIconSize;
			}
			this.isFlightPlanWaypoint = false;
			if (this._image && this._lastMinimize !== this.minimize) {
				if (this.minimize) {
					this._image.setAttribute('width', fastToFixed(iconSize * 0.5, 0));
					this._image.setAttribute('height', fastToFixed(iconSize * 0.5, 0));
				} else {
					this._image.setAttribute('width', fastToFixed(iconSize, 0));
					this._image.setAttribute('height', fastToFixed(iconSize, 0));
				}
				this._lastMinimize = this.minimize;
				this.needRepaint = true;
			}
			if (this.needRepaint || Math.abs(this._lastX - this.x) > 0.1 || Math.abs(this._lastY - this.y) > 0.1) {
				this._lastX = this.x;
				this._lastY = this.y;
				let x = (this.x - iconSize * 0.5 * (this.minimize ? 0.5 : 1));
				let y = (this.y - iconSize * 0.5 * (this.minimize ? 0.5 : 1));
				this.svgElement.setAttribute('x', x + '');
				this.svgElement.setAttribute('y', y + '');
				if (this.source instanceof AirportInfo) {
					let a = this.source.longestRunwayDirection;
					if (isNaN(a) && this.source.runways[0]) {
						a = this.source.runways[0].direction;
					}
					if (isFinite(a)) {
						this._alpha = a - 45;
					}
				}
				if (isFinite(this._alpha)) {
					this.svgElement.setAttribute('transform', 'rotate(' + this._alpha.toFixed(0) + ' ' + this.x.toFixed(0) + ' ' + this.y.toFixed(0) + ')');
				}
				if (!this._label) {
					let labelId = this.id(map) + '-text-' + map.index;
					let label = document.getElementById(labelId);
					if (label instanceof SVGForeignObjectElement) {
						let c = document.createElement('canvas');
						let ctx = c.getContext('2d');
						let fontSize = map.config.waypointLabelFontSize;
						if (this.ident === 'DECEL') {
							fontSize = map.config.auxWaypointLabelFontSize;
						}
						let text = this.ident;
						ctx.font = fontSize + 'px ' + map.config.waypointLabelFontFamily;
						this._textWidth = ctx.measureText(text).width;
						this._textHeight = fontSize * 0.675;
						this._label = label;
						this.needRepaint = true;
					}
				}
				if (this._label) {
					if (!isFinite(this._textWidth)) {
						let c = document.createElement('canvas');
						let ctx = c.getContext('2d');
						let fontSize = map.config.waypointLabelFontSize;
						if (this.ident === 'DECEL') {
							fontSize = map.config.auxWaypointLabelFontSize;
						}
						let text = this.ident;
						ctx.font = fontSize + 'px ' + map.config.waypointLabelFontFamily;
						this._textWidth = ctx.measureText(text).width;
					}
					if (!isFinite(this._textHeight)) {
						let fontSize = map.config.waypointLabelFontSize;
						if (this.ident === 'DECEL') {
							fontSize = map.config.auxWaypointLabelFontSize;
						}
						this._textHeight = fontSize * 0.675;
					}

					let textX = (x + iconSize * 0.5 - this._textWidth * 0.5 + map.config.waypointLabelDistanceX);
					let textY = y + map.config.waypointLabelDistance;
					this._label.setAttribute('x', textX + '');
					this._label.setAttribute('y', textY + '');
					this.needRepaint = false;
				} else {
					this.needRepaint = true;
				}
			}
		}
	}
}

//# sourceMappingURL=SvgWaypointElement.js.map