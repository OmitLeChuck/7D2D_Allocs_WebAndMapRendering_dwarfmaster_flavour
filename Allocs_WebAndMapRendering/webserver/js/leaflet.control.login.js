L.Control.Login = L.Control.extend({
	options: {
		position: 'bottomleft'
	},

	onAdd: function (map) {
		var name = 'control-login',
		    container = L.DomUtil.create('div', name + ' leaflet-bar');
	
		this._map = map;
		this._div = container;
		
		if (userdata.loggedin == true) {
			container.innerHTML =
				"Logged in as: " + userdata.username + "<br/>\
				<a href=\"/session/logout\">Sign&nbsp;out</a>";
		} else {
			container.innerHTML =
				"Not logged in<br/>\
				<a href=\"/session/login\">\
				<img src=\"img/steamlogin.png\" title=\"Sign in through Steam\"></a>";
		}

		
		return container;
	},

	onRemove: function (map) {
	},

	_onMouseMove: function (e) {
		this._div.innerHTML = FormatCoord(e.latlng);
	}
});

