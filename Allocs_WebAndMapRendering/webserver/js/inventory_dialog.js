var ITEMICONBASEURL = "../itemicons/";

var BAG_COLS = 9;
var BAG_ROWS = 5;
var BELT_COLS = 10;
var INV_ITEM_WIDTH = 58;
var INV_ITEM_HEIGHT = 40;

function ShowInventoryDialog (steamid) {
	var SetCellItem = function (containerTypeName, cellIdent, itemdata) {
		var cell = $("#" + containerTypeName + "Field"+cellIdent);
		var text = $("#" + containerTypeName + "FieldText"+cellIdent);
		var qual = $("#" + containerTypeName + "FieldQuality"+cellIdent);

		cell.attr("style", "background-image: none;");
		cell.removeAttr("title");
		text.removeClass ("visible");
		qual.removeClass ("visible");

		if (itemdata !== null && itemdata !== undefined) {
			cell.attr("style", "background-image: url(" + ITEMICONBASEURL + itemdata.icon + "__" + itemdata.iconcolor + ".png);");
			if (itemdata.quality >= 0) {
				cell.attr("title", itemdata.name + " (quality: " + itemdata.quality + ")");
				qual.attr("style", "background-color: #"+ itemdata.qualitycolor);
				qual.addClass ("visible");
			} else {
				cell.attr("title", itemdata.name);
				text.text(itemdata.count);
				text.addClass ("visible");
			}
		}
	}
	
	var SetEquipmentItem = function (data, name, cellIdent) {
		if (data.equipment [name] == false) {
			SetCellItem ("equipment", cellIdent, null);
		} else {
			SetCellItem ("equipment", cellIdent, data.equipment [name] );
		}
	}
	
//	function linkId(steamid) {
//		var value = "https://steamid.io/lookup/"+steamid;
//	}
	
	$.getJSON( "../api/getplayerinventory", { steamid: steamid  })
	.done(function(data) {
		$("#invPlayerName").text(data.playername);
		$("#invSteamId").text(steamid);
		
		for (var y = 0; y < BAG_ROWS; y++) {
			for (var x = 0; x < BAG_COLS; x++) {
				SetCellItem ("bag", x + "_" + y, data.bag[y*BAG_COLS+x]);
			}
		}

		for (var x = 0; x < BELT_COLS; x++) {
			SetCellItem ("belt", x, data.belt[x]);
		}
		
		SetEquipmentItem (data, "head", "0_0");
		SetEquipmentItem (data, "eyes", "0_1");
		SetEquipmentItem (data, "face", "0_2");
		SetEquipmentItem (data, "armor", "1_0");
		SetEquipmentItem (data, "jacket", "1_1");
		SetEquipmentItem (data, "shirt", "1_2");
		SetEquipmentItem (data, "legarmor", "2_0");
		SetEquipmentItem (data, "pants", "2_1");
		SetEquipmentItem (data, "boots", "2_2");
		SetEquipmentItem (data, "gloves", "0_4");
		SetEquipmentItem (data, "backpack", "2_4");

		$( "#playerInventoryDialog" ).css("z-index", "1010").dialog({
			dialogClass: "playerInventoryDialog",
			modal: true,
			width: BAG_COLS*(INV_ITEM_WIDTH+14) + 3*(INV_ITEM_WIDTH+14) + 20,
			buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	})
	.fail(function(jqxhr, textStatus, error) {
		console.log("Error fetching player inventory");
	})
	.always(function() {
	});
}

function SetupInventoryDialog () {
	var CreateInvCell = function (containerTypeName, cellIdent) {
		return "<td class=\"invField\" id=\"" + containerTypeName + "Field"+cellIdent+"\">" +
			"<div class=\"invFieldQuality\" id=\"" + containerTypeName + "FieldQuality" + cellIdent + "\"></div>" +
			"<span class=\"invFieldText\" id=\"" + containerTypeName + "FieldText"+cellIdent+"\"></span>" +
			"</td>";
	}

	for (var y = 0; y < BAG_ROWS; y++) {
		$("#bagTable").append("<tr id=\"bagRow"+y+"\"></tr>");
		for (var x = 0; x < BAG_COLS; x++) {
			$("#bagRow"+y).append(CreateInvCell ("bag", x + "_" + y));
		}
	}

	$("#beltTable").append("<tr id=\"beltRow0\"></tr>");
	for (var x = 0; x < BELT_COLS; x++) {
		$("#beltRow0").append(CreateInvCell ("belt", x));
	}
	
	for (var y = 0; y < 5; y++) {
		$("#equipmentTable").append("<tr id=\"equipmentRow"+y+"\"></tr>");
		if (y == 3) {
			$("#equipmentRow"+y).append("<td colspan=\"3\"></td>");
		} else {
			for (var x = 0; x < 3; x++) {
				if (y == 4 && x == 1) {
					$("#equipmentRow"+y).append("<td></td>");
				} else {
					$("#equipmentRow"+y).append(CreateInvCell ("equipment", x + "_" + y));
				}
			}
		}
	}
}

