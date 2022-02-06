var CoordToChunk = function(latlng) {
	var x = Math.floor(((latlng.lat + 16777216) / mapinfo.chunksize) - (16777216 / mapinfo.chunksize));
	var y = Math.floor(((latlng.lng + 16777216) / mapinfo.chunksize) - (16777216 / mapinfo.chunksize));
	return L.latLng(x, y);
}

var CoordToRegion = function(latlng) {
	var x = Math.floor(((latlng.lat + 16777216) / mapinfo.regionsize) - (16777216 / mapinfo.regionsize));
	var y = Math.floor(((latlng.lng + 16777216) / mapinfo.regionsize) - (16777216 / mapinfo.regionsize));
	return L.latLng(x, y);
}

