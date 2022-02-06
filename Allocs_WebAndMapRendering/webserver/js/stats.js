function DayName (days) {
	var daynames = [];
	daynames = liveMapConfig.time.weekdaynames;
	if (daynames[0]!=""){
		daynames.unshift("");
	}
	return daynames[DayOfWeek(days)];
}

function DayOfWeek (days) {
	return days % 7 > 0 ? days % 7 : 7;
}

function FormatServerTime (gametime) {
	var time = liveMapConfig.time.prefix + ' ' + gametime.days;
	//console.log(time);
	if(liveMapConfig.time.showweekdayname){
		time += " (" + DayName(gametime.days) + "), ";	
	} else {
		time += " ";
	}
	if (gametime.hours < 10)
		time += "0";
	time += gametime.hours;
	time += ":";
	if (gametime.minutes < 10)
		time += "0";
	time += gametime.minutes;
	return time;
}

function StartStatsModule () {
	
	var updateGameTimeEvent = function() {
		$.getJSON( "../api/getstats")
		.done(function(data) {
			$("#stats_time").html (FormatServerTime(data.gametime));
			$("#stats_players").html (data.players);
			$("#stats_hostiles").html (data.hostiles);
			$("#stats_animals").html (data.animals);
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log("Error fetching game stats");
		})
		.always(function() {
		});
		
		window.setTimeout(updateGameTimeEvent, 2000);
	};
	updateGameTimeEvent();
}

function StartUIUpdatesModule () {
	var updateGameTimeEvent = function() {
		$.getJSON( "../api/getwebuiupdates?latestLine=" + lastLogLine)
		.done(function(data) {
			$("#stats_time").html (FormatServerTime (data.gametime));
			$("#stats_players").html (data.players);
			$("#stats_hostiles").html (data.hostiles);
			$("#stats_animals").html (data.animals);
			$("#newlogcount").html (data.newlogs);
			if (data.newlogs > 0) {
				$("#newlogcount").addClass ("visible");
			} else {
				$("#newlogcount").removeClass ("visible");
			}
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log("Error fetching ui updates");
		})
		.always(function() {
		});
		window.setTimeout(updateGameTimeEvent, 2000);
	};
	updateGameTimeEvent();
}

