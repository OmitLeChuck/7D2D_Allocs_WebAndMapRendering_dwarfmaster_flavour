var lastLogLine = -1;

function StartLogModule () {
	var maxLinesPerRequest = 50;

	var timeout = null;
	var table = $("#tab_log > table");
	var lastRead = -1;
	
	
	var updateEvent = function() {
		$.getJSON( "../api/getlog?firstLine=" + (lastLogLine + 1) + "&lastLine=" + (lastLogLine + maxLinesPerRequest) )
		.done(function(data) {
			if (data.firstLine - lastLogLine - 1 > 0) {
				var row = $("<tr></tr>").appendTo (table);
				$('<td colspan="4">Missed ' + (data.firstLine - lastLogLine - 1) + ' log entries</td>').addClass ("logcol_missed").appendTo (row);
			}
			for (var i = 0; i < data.entries.length; i++) {
				var row = $("<tr></tr>").addClass (data.entries [i].type).attr ("id", "line" + (data.firstLine + i)).appendTo (table);
				$("<td>" + data.entries [i].date + " " + data.entries [i].time + "</td>").addClass ("logcol_datetime").appendTo (row);
				$("<td>" + data.entries [i].uptime + "</td>").addClass ("logcol_uptime").appendTo (row);
				$("<td>" + data.entries [i].type + "</td>").addClass ("logcol_type").appendTo (row);
				var msg = $("<td></td>").text(data.entries [i].msg).addClass ("logcol_msg").appendTo (row);
				if (data.entries [i].trace.length > 0) {
					msg.append ('<br><div class="trace"><span>' + data.entries [i].trace.replace (/\n/g, "</span><span>") + '</span></div><a class="tracebtn"></a>');
				}
			}

			if (data.entries.length > 0) {
				lastLogLine = data.lastLine;
			}
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log("Error fetching log lines");
		})
		.always(function() {
		});
		timeout = window.setTimeout(updateEvent, 2000);
	};
	
	var markAsRead = function() {
		lastRead = lastLogLine;
		table.find (".readmark").removeClass ("readmark");
		table.find ("#line" + (lastRead)).addClass ("readmark");
	};
	
	table.on ("click.action", ".tracebtn", function (event) {
		$(this).toggleClass ("visible");
		$(this).prev ().toggleClass ("visible");
	});
	
	$(".adminlog #markasread").on ("click.action", null, function (event) {
		markAsRead ();
	});
	
	
	tabs.on ("tabbedcontenttabopened", function (event, data) {
		if (data.newTab === "#tab_log") {
			updateEvent ();

			markAsRead ();
			var markedrow = $(".adminlog .readmark");
			if (markedrow.length > 0) {
				window.setTimeout (function () {
					$('html, body').scrollTop (markedrow.offset ().top);
				}, 20);
			}
		} else {
			window.clearTimeout (timeout);
		}
	});
	
	if (tabs.tabbedContent ("isTabOpen", "tab_log")) {
		updateEvent ();
	}

}


