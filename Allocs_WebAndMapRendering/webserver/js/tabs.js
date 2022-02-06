$.widget( "7dtd.tabbedContent", {
	options: {
		contentdiv: null,
		hidebuttondiv: null,
		menubardiv: null,
		hideOnStart: false,
		hideClass: "hidenav",
		currentTabClass: "current_tab",
		menuButtonClass: "menu_button",
		allowedMenuButtonClass: "allowed",
		contentDivClass: "contenttab",
	},
	
	_create: function () {
		var options = this.options;
		var self = this;
		
		if (options.contentdiv == null) {
			console.log ("contentdiv has to be set!");
		}
		
		if (options.hidebuttondiv == null) {
			console.log ("hidebuttondiv has to be set!");
		}
		
		if (options.menubardiv == null) {
			console.log ("menubardiv has to be set!");
		}
		
		var hidebarevent = function (event) {
			if (options.hidebuttondiv.hasClass (options.hideClass)) {
				$("*").removeClass (options.hideClass);
			} else {
				options.hidebuttondiv.addClass (options.hideClass);
				options.contentdiv.addClass (options.hideClass);
				options.menubardiv.addClass (options.hideClass);
			}
		};
		options.hidebuttondiv.on ('click.action', hidebarevent);
		
		this.element.find ("ul > li").addClass (options.menuButtonClass);

		options.contentdiv.children ("div").addClass (options.contentDivClass);
		this.element.on ('click.action', "ul > li", function (event) {
			var menuElement = $(this);
			var linkElement = menuElement.children ("a");
			var linkName = linkElement.attr ("href");
			self.openTab (linkName);
		});

		self.tabs = {};
		this.element.find (".menu_button").each (function () {
			self.tabs [$(this).children ("a").attr ("href")] = $(this);
		});
		
		if (options.hideOnStart == true) {
			hidebarevent ();
		}
	},
	
	applyPermissions: function () {
		var self = this;
		this.element.find (".menu_button").each (function () {
			if ($(this).children ("a").data ("permission")) {
				var perm = $(this).children ("a").data ("permission");
				if (HasPermission (perm)) {
					$(this).addClass (self.options.allowedMenuButtonClass);
				}
			} else {
				$(this).addClass (self.options.allowedMenuButtonClass);
			}
		});

		this.element.find ("." + self.options.allowedMenuButtonClass).first ().click ();
	},
	
	openTab: function (name) {
		if (name.indexOf ("#") != 0)
			name = "#" + name;
		
		if (!this.tabs.hasOwnProperty(name)) {
			console.log ("no tab named " + name + " in " + this);
			return;
		}

		var menuElement = $(".menu_button > a[href=" + name + "]").parent ();

		$("*").removeClass (this.options.currentTabClass);
		menuElement.addClass (this.options.currentTabClass);
		$(name).addClass (this.options.currentTabClass);
		var oldTab = this.currentTab;
		this.currentTab = name;
	
		if (oldTab != name) {
			this._trigger ("tabopened", null, { oldTab: oldTab, newTab: name } );
		}
	},
	
	currentOpenTab: function () {
		return this.currentTab;
	},
	
	isTabOpen: function (name) {
		if (name.indexOf ("#") != 0)
			name = "#" + name;

		return this.currentTab == name;
	},

/*
	value: function (value) {
		if ( value === undefined ) {
			return this.options.value;
		} else {
			this.options.value = this._constrain( value );
			var progress = this.options.value + "%";
			this.element.text( progress );
		}
	},
*/
});
