function GetSdtdTileLayer (mapinfo, initTime, isMiniMap) {
	if (typeof isMiniMap == 'undefined') isMiniMap = false;
	
	var tileLayer = L.tileLayer('../map/{z}/{x}/{y}.png?t={time}', {
		maxZoom: isMiniMap ? mapinfo.maxzoom : mapinfo.maxzoom + 1,
		minZoom: isMiniMap ? -1 : Math.max(0, mapinfo.maxzoom - 5),
		maxNativeZoom: mapinfo.maxzoom,
		minNativeZoom: 0,
		tileSize: mapinfo.tilesize,
		time: initTime
	});
	
	tileLayer.getTileUrl = function (coords) {
		coords.y = (-coords.y) - 1;
		return L.TileLayer.prototype.getTileUrl.bind (tileLayer) (coords);
	};

	
	return tileLayer;
}

