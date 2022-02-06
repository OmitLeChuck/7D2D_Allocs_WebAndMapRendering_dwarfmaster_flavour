//InitializeTabs ();
var tabs = $("#adminmenu").tabbedContent ({
	contentdiv: $("#admincontent"),
	hidebuttondiv: $(".adminnavbarhidebutton"),
	menubardiv: $(".adminnavbar"),
	hideOnStart: false,
});
SetupInventoryDialog ();
InitPermissions ();