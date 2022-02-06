function StartPlayersModule () {
	var sortParamName = "sort";
	var filterParamName = "filter";
	
	
function prettyDate(date){
  var diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);
  if ( isNaN(day_diff) || day_diff < 0 ) { return ''; }
  return day_diff == 0 && (
    diff < 60 && 'just now' ||
    diff < 120 && '1 minute ago' ||
    diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
    diff < 7200 && '1 hour ago' ||
    diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago') ||
    day_diff == 1 && 'Yesterday' ||
    day_diff < 7 && day_diff + ' days ago' ||
    day_diff < 61 && Math.ceil( day_diff / 7 ) + ' weeks ago' ||
    day_diff < 730 && Math.floor( day_diff / 30 ) + ' months ago' ||
    Math.floor( day_diff / 365 ) + ' years ago';
}


	// Define columns to be shown
	var columns = [
		[ "steamid", "SteamID" ],
		[ "entityid", "EntityID" ],
		[ "ip", "IP" ],
		[ "name", "Name",
			function(text, data) {
				return $("<div>").text(text).html();
			}
		],
		[ "online", "Online", null,
			function(text, data) {
				// add text to data-attribute; this overrides the parser
				data.$cell.attr(data.config.textAttribute, text);
				if (text == 'false') {
					return "<img src=\"img/oxygen-icons/32x32/status/task-reject.png\" width=\"16\">";
				} else {
					return "<img src=\"img/oxygen-icons/32x32/status/task-complete.png\" width=\"16\">";
				}
			}
		],
		[ "position", "Position", function(inp) { return inp.x + "/" + inp.y + "/" + inp.z; } ],
		[ "totalplaytime", "Total Playtime", null,
			function(text, data) {
				// add text to data-attribute; this overrides the parser
				data.$cell.attr(data.config.textAttribute, text);
				var minutes = Math.floor(text / 60);
				var hours = Math.floor(minutes / 60);
				minutes = minutes % 60;
				if (hours > 0) {
					return hours + " hours " + minutes + " minutes";
				} else {
					return minutes + " minutes";
				}
			}
		],
		[ "lastonline", "Last Online", null,
			function(text, data) {
				var date = new Date(text);
				if (date instanceof Date && isFinite(date) ) {
					data.$cell.attr(data.config.textAttribute, text);
					return '<span class="players_dateonline" title="' + date.toLocaleString() + '">' + prettyDate(date) + '</span>';
				}
				return text;
			}
		],
		[ "ping", "Ping" ],
	];
	
	// Add column headers to <table>
	for (var i = 0; i < columns.length; i++) {
		$(".players_columns").append ("<td>" + columns[i][1] + "</td>");
	}
	
	// Set pager colspan accordingly
	$(".players_pager").attr ("colspan", columns.length);
	
	// Define header names array for tablesorter
	var headers = [];
	for (var c = 0; c < columns.length; c++) {
		headers.push (columns[c][1]);
	}
	
	// Build table formatter object
	var formatterSettings = {};
	for (var i = 0; i < columns.length; i++) {
		if (columns[i].length > 3 && columns[i][3] != null) {
			formatterSettings [i] = columns[i][3];
			//var formatter = columns[i][3];
			//var column
		}
	}
	

	function FindColumnIndexByField (fieldname) {
		for(var i = 0; i < columns.length; i++) {
			if(columns[i][0] === fieldname) {
				return i;
			}
		}
		return -1;
	}



	$(".players_tablesorter")
	.tablesorter({
		theme: 'default',
		widthFixed: true,
		sortLocaleCompare: true, // needed for accented characters in the data
		sortList: [ [FindColumnIndexByField("name"),0] ],
		widgets: ['zebra', 'formatter', 'filter'],
		widgetOptions: {
			formatter_column: formatterSettings
		}
	})
	.tablesorterPager({
		container: $(".players_pager"),

		// If you want to use ajaxUrl placeholders, here is an example:
		// ajaxUrl: "http:/mydatabase.com?page={page}&size={size}&{sortList:col}"
		// where {page} is replaced by the page number (or use {page+1} to get a one-based index),
		// {size} is replaced by the number of records to show,
		// {sortList:col} adds the sortList to the url into a "col" array, and {filterList:fcol} adds
		// the filterList to the url into an "fcol" array.
		// So a sortList = [[2,0],[3,0]] becomes "&col[2]=0&col[3]=0" in the url
		// and a filterList = [[2,Blue],[3,13]] becomes "&fcol[2]=Blue&fcol[3]=13" in the url
		ajaxUrl : '../api/getplayerlist?page={page}&rowsperpage={size}&{filterList:' + filterParamName + '}&{sortList:' + sortParamName + '}',

		customAjaxUrl: function(table, url) {
			var address = url.substring (0, url.indexOf ("?"));
			var queryString = url.substring (url.indexOf ("?") + 1);
			var params = queryString.split("&");
			for (var i = 0; i < params.length; i++) {
				var pair = params[i].split("=");
				
				if ((pair.length == 2) && (pair[0].indexOf ("[") >= 0)) {
					var paramName = pair[0].substring (0, pair[0].indexOf ("["));
					var paramIndex = pair[0].substring (pair[0].indexOf ("[") + 1, pair[0].indexOf ("]"));
					if ((paramName == sortParamName) || (paramName == filterParamName)) {
						paramIndex = columns[paramIndex][0];
						pair[0] = paramName + "[" + paramIndex + "]";
						params[i] = pair.join("=");
					}
				}
			}
			
			queryString = params.join("&");
			
			url = address + "?" + queryString;

		
			$(table).trigger('changingUrl', url);
			return url;
		},

		ajaxError: null,

		// add more ajax settings here
		// see http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings
		ajaxObject: {
			dataType: 'json'
		},

		ajaxProcessing: function(data){
			var rows = [];
			for (var i=0; i < data.players.length; i++) {
				var row = [];
				for (var c = 0; c < columns.length; c++) {
					var col = columns[c];
					var val = data.players[i][col[0]];
					if (col.length > 2 && col[2] != null) {
						val = col[2] (val);
					}
					row.push (val);
				}
				rows.push (row);
			}
			
			return {
				"total": data.total,
				"headers": headers,
				"rows": rows
			};
		},

		// Set this option to false if your table data is preloaded into the table, but you are still using ajax
		processAjaxOnInit: true,

		// output string - default is '{page}/{totalPages}';
		// possible variables: {size}, {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
		// also {page:input} & {startRow:input} will add a modifiable input in place of the value
		output: '{startRow} to {endRow} ({totalRows})',

		// apply disabled classname (cssDisabled option) to the pager arrows when the rows
		// are at either extreme is visible; default is true
		updateArrows: true,

		// starting page of the pager (zero based index)
		page: 0,

		// Number of visible rows - default is 10
		size: 25,

		// Saves the current pager page size and number (requires storage widget)
		savePages: false,

		// Reset pager to this page after filtering; set to desired page number (zero-based index),
		// or false to not change page at filter start
		pageReset: 0,

		// if true, the table will remain the same height no matter how many records are displayed.
		// The space is made up by an empty table row set to a height to compensate; default is false
		fixedHeight: false,

		// remove rows from the table to speed up the sort of large tables.
		// setting this to false, only hides the non-visible rows; needed if you plan to
		// add/remove rows with the pager enabled.
		removeRows: false,

		// If true, child rows will be counted towards the pager set size
		countChildRows: false,

		// css class names of pager arrows
		cssNext        : '.players_next',  // next page arrow
		cssPrev        : '.players_prev',  // previous page arrow
		cssFirst       : '.players_first', // go to first page arrow
		cssLast        : '.players_last',  // go to last page arrow
		cssGoto        : '.players_gotoPage', // page select dropdown - select dropdown that set the "page" option

		cssPageDisplay : '.players_pagedisplay', // location of where the "output" is displayed
		cssPageSize    : '.players_pagesize', // page size selector - select dropdown that sets the "size" option

		// class added to arrows when at the extremes; see the "updateArrows" option
		// (i.e. prev/first arrows are "disabled" when on the first page)
		cssDisabled    : 'disabled', // Note there is no period "." in front of this class name
		cssErrorRow    : 'tablesorter-errorRow' // error information row

	});
/*
	var $url = $('#players_url');
	$('.players_tablesorter').on('changingUrl', function(e, url){
		$url.html(url);
	});
*/
}


