# Allocs MapRendering and Webinterface - dwarfmaster Flavour
This 7 Days to die - Live - Map set up on the great work from Alloc and brings some visual overhauls and features.

It includes the *Bootstrap* - Framework which i used for postioning, collapsing and putting some colors to the map.
The next Framework i use is the _Font-Awesome_ (free Version) to show some nice icons.

**Other Features**

* List Players Online
* Time of the next Hordenight
* Time of the next planend Reboot
* Translation of the most Player-visible content (admin-content is still english)
* New Icons for Hostiles, Animals and Player
* Show Zone-Rects for Resets, Mines, Traders, PvP, ...
* configurable
	- Page-Title
	- Favicon
	- Background
	- Menue
	- Windows/Panels i.e. MiniMap on/off
	- Checkboxes i.e. Show live Players, Zombies, Animals on Map
	- Set Special Zones to show in the Map (Reset, Traders, PvP, PvE, ...)
	- Additonal Links
	- Special Users


## Requirements
You must be sure that you have the following Mods installed:

* Allocs command extensions
* Allocs server fixes

and make sure that you do **not** have installed the original Web-Map.
Things will get complicated then.

If you dont know where to find the above mods take a look a this url: http://7dtd.illy.bz 

#### `webpermissions.xml` - File 
Setup your `webpermissions.xml` like that to have fun with all functions from the map.
```
<?xml version="1.0" encoding="UTF-8"?>
<webpermissions>
	<admintokens>
		<!-- <token name="adminuser1" token="supersecrettoken" permission_level="0" /> -->
	</admintokens>
	<permissions>
		<permission module="webapi.getlog" permission_level="0"/>
		<permission module="webapi.executeconsolecommand" permission_level="0"/>
		<permission module="webapi.viewallplayers" permission_level="2000"/>
		<permission module="webapi.viewallclaims" permission_level="2000"/>
		<permission module="webapi.getplayerinventory" permission_level="0"/>
		<permission module="web.map" permission_level="2000"/>
		<permission module="webapi.getstats" permission_level="2000"/>
		<permission module="webapi.getplayersonline" permission_level="2000"/>
		<permission module="webapi.getplayerslocation" permission_level="2000"/>
		<permission module="webapi.getlandclaims" permission_level="2000"/>
		<permission module="webapi.gethostilelocation" permission_level="2000"/>
		<permission module="webapi.getanimalslocation" permission_level="2000"/>
	</permissions>
</webpermissions>
```

## Install

Download the master.zip and unpack it somewhere.
Make sure that you do **not** have installed the original Web-Map.
Things will get complicated then.

### Server-Install

Upload the directory which has the `ModInfo.xml` to your Mods - directory on your Server.

### Client-Install
If you want to use the map just for fun on your local machine, feel free.
You just have to copy the directory which has the `ModInfo.xml` to your Mods - directory

## Config

### `config.json` - File
Before you make changes and save them, you should proof the format of the json file.
You can do that with serveral tools or with online validation - services like: https://jsonformatter.curiousconcept.com/ 

If your configuration breaks anything, take look in the config.example.json to get any hints what the problem might be.

Here the most options explained.

* `title` - set the title of the page, which is shown in tab of the users browser
* `favicon` - set the image - icon for this tab. **attention** this file mus be a `PNG`
* `logo` - set the url for your logo or replace the `logo.png` file in the `img` directory
* `background` - set the background-image for your page or replace the `background.png` file in the `img` directory
* `time` - set format of the time shown in the first line after the logo
* `onlineplayers` - show on/off and collapsed at start on/off
  - `users` - set icon defaults and some special users
* `next` show on/off and the interval how often this panel will be updated in seconds
	- `bloodmoon` name, show on/off and show time left till bloodmoon on/off
	- `reboot` name, show on/off, show time left till bloodmoon on/off and define the hours where your reboot is planend
* `menue` - show on/off and collapsed at start on/off
	- `defaultlinks` - set names and permissions
	- `additionallinks`- set some Links that you want to show like donating or something
* `steam` - just a little translating
* `mouseposition`- show on/off will show the mous postion panel, and you can set your own names for postion and click
* `minimap`- show on/off
* `checkboxes`- global show on/off and set show on/off with name for each checkbox
* `colors`- set the colors for the zones
* `translations`- some translations if needed

### `data/*.json` - files

#### Zones
The zones representing the reset zones. There a 5 kinds of them:

* reset - the normal resetzone
* mine - the mining zones which are underlying some special reset times, maybe
* dailyreset
* pvp
* pve

Here is an *example*:
```
{
	"type": "mine",
	"name": "2",
	"x": "6",
	"z": "1"
}
```
the `x` and `z` you can find/see if you activate the `Zones`- Checkbox


#### Traders
The traders json is little bit different to the Zones because it needs coordinates to show.

**Example**:
```
{
	"name": "Joel",
	"x": "1836",
	"z": "-633"
}
```
This will show a rectangle with the center of `x` and `z`.
To find that coordinates there are serveral ways.

But the safest way to get them is the `prefabs.xml` in your map.
Just search for the word: `trader` inside that xml and you will right now have the coords and tha name of the trader as well.  

#### Donors
Just a small json array with Steam IDs to identify that a user has the donor state.
If you had your server on a linux - maschine you can gather this information with `xmlstarlet` and `jq` from your `serveradmin.xml` whre your _special users_ are normally defined.

**Example**:
```
xmlstarlet sel -t -v "//user[@permission_level='10' or @permission_level='0']/@userid" -n /path/to/serveradmin.xml | jq -R -c 'split("\n")' > /path/to/data/donors.json;
```
The `permission_level` for your Donors you might have set to another number, so you can/should edit that.

### `info.html`
This HTML file you can use to offer your players some Informations like:
* Rules
* Mods
* Reboot-Time
* News
* Whatever you want.

This file is loaded at startup of the page and is just static HTML.
I dont reallly know what would happen if you use JS oer something else in that.
What you could/should use is the complete power of HTML, Bootstrap and FontAwesome.
