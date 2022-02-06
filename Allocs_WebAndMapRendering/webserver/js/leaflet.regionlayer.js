function GetRegionLayer (mapinfo) {
	var FormatRegionFileName = function(latlng) {
		return latlng.lat + "." + latlng.lng ;
		//return "r." + latlng.lat + "." + latlng.lng + ".7rg";
	}

	var regionLayer = L.gridLayer({
		maxZoom: mapinfo.maxzoom + 1,
		minZoom: 0,
		maxNativeZoom: mapinfo.maxzoom + 1,
		tileSize: mapinfo.tilesize,
	});

	regionLayer.createTile = function(tilePoint) {
		var blockWorldSize = mapinfo.tilesize * Math.pow(2, mapinfo.maxzoom - tilePoint.z);
		var tileLeft = tilePoint.x * blockWorldSize;
		var tileBottom = (-1-tilePoint.y) * blockWorldSize;
		var blockPos = L.latLng(tileLeft, tileBottom);

		var canvas = L.DomUtil.create('canvas', 'leaflet-tile');
		canvas.width = mapinfo.tilesize;
		canvas.height = mapinfo.tilesize;
		var ctx = canvas.getContext('2d');

		ctx.strokeStyle = "lightblue";
		ctx.fillStyle = "red";
		ctx.lineWidth = 2;
		ctx.font="30px Arial";

		var lineCount = blockWorldSize / mapinfo.regionsize;
		if (lineCount >= 1) {
			var pos = 0;
			while (pos < mapinfo.tilesize) {
				// Vertical
				ctx.beginPath();
				ctx.moveTo(pos, 0);
				ctx.lineTo(pos, mapinfo.tilesize);
				ctx.stroke();
		
				// Horizontal
				ctx.beginPath();
				ctx.moveTo(0, pos);
				ctx.lineTo(mapinfo.tilesize, pos);
				ctx.stroke();

				pos += mapinfo.tilesize / lineCount;
			}
			ctx.fillText( FormatRegionFileName(CoordToRegion(blockPos)) , 4, mapinfo.tilesize-5);
		} else {
			if ((tileLeft % mapinfo.regionsize) == 0) {
				// Vertical
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(0, mapinfo.tilesize);
				ctx.stroke();
			}
			if ((tileBottom % mapinfo.regionsize) == 0) {
				// Horizontal
				ctx.beginPath();
				ctx.moveTo(0, mapinfo.tilesize);
				ctx.lineTo(mapinfo.tilesize, mapinfo.tilesize);
				ctx.stroke();
			}
			if ((tileLeft % mapinfo.regionsize) == 0 && (tileBottom % mapinfo.regionsize) == 0) {
				ctx.fillText(FormatRegionFileName(CoordToRegion(blockPos)), 4, mapinfo.tilesize-5);
			}
		}
		return canvas;
	}
	
	return regionLayer;
}