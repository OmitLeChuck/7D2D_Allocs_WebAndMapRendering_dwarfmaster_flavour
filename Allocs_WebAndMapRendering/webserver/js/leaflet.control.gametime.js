L.Control.GameTime = L.Control.extend({
        options: {
                position: 'bottomright',
        },

        onAdd: function (map) {
                var name = 'control-gametime',
                    container = L.DomUtil.create('div', name + ' webmap-control');
				
                container.innerHTML = "Loading ..."
                L.DomEvent.on (container, 'mousemove', L.DomEvent.stopPropagation);
				container.classList.add('d-none');
                this._map = map;
                this._div = container;

                window.setTimeout($.proxy(this._updateGameTimeEvent, this), 0);

                return container;
        },

        onRemove: function (map) {
        },

        _updateGameTimeEvent: function() {
                var div = this._div;
                $.getJSON( "../api/getstats")
                .done(function(data) {
                        var time = "Day " + data.gametime.days + ", ";
                        if (data.gametime.hours < 10)
                                time += "0";
                        time += data.gametime.hours;
                        time += ":";
                        if (data.gametime.minutes < 10)
                                time += "0";
                        time += data.gametime.minutes;
                        div.innerHTML = time;
                })
                .fail(function(jqxhr, textStatus, error) {
                        console.log("Error fetching game stats");
                })
                .always(function() {
                });
                window.setTimeout($.proxy(this._updateGameTimeEvent, this), 2000);
        }

});

