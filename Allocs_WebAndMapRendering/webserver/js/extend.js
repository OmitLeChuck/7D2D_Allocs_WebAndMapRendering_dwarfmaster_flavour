function applyConfig() {
    if (liveMapConfig.title.trim() != '') {
        $('title').html(liveMapConfig.title.trim());
    }
    if (liveMapConfig.favicon.trim() != '') {
        var fileExt = liveMapConfig.favicon.trim().split('.').pop().toLowerCase();
        if (fileExt == 'png') {
            $("link[rel='icon']").attr('href', liveMapConfig.favicon.trim());
        }
    }
    if (liveMapConfig.logo.trim() != '') {
        $('#imglogo').attr('src', liveMapConfig.logo.trim());
    }
    if (liveMapConfig.background.trim() != '') {
        $('body').css('background-image', liveMapConfig.background.trim());
    }
    if (!liveMapConfig.time.collapsed) {
        $('#collapseStats').addClass('show');
    }
    if (!liveMapConfig.onlineplayers.show) {
        $('#player_list_container').remove();
    }
    if (!liveMapConfig.onlineplayers.collapsed) {
        $('#player_list').addClass('show');
    }
    if (!liveMapConfig.next.show) {
        $('#next').remove();
    }
    if (!liveMapConfig.next.collapsed) {
        $('#next-times').addClass('show');
    }
    if (!liveMapConfig.next.bloodmoon.show) {
        $('#next-bn-head').remove();
        $('#next-bn-content').remove();
    }
    if (!liveMapConfig.next.bloodmoon.showtimeleft) {
        $('#next-bn-showtimeleft').remove();
    }
    if (!liveMapConfig.next.reboot.show) {
        $('#reboot-head').remove();
        $('#reboot-content').remove();
    }
    if (liveMapConfig.next.bloodmoon.name.trim() != '') {
        $('#next-bn-name').html(liveMapConfig.next.bloodmoon.name.trim());
    }
    if (liveMapConfig.next.reboot.name.trim() != '') {
        $('#reboot-name').html(liveMapConfig.next.reboot.name.trim());
    }
    if (liveMapConfig.menue.show) {
        $('#adminmenu').removeClass('d-none');
    }
    if (!liveMapConfig.menue.collapsed) {
        $('#menu-admin').addClass('show');
    }

    $.each(liveMapConfig.menue.defaultlinks, function (id, link) {
        if (link.name.trim() != "") {
            $('#link-' + id).html(link.name.trim());
        }
        if (link.permission.trim() != "") {
            $('#a-' + id).attr('data-permission', link.permission.trim());
        }
    });

    var defaultlinks = $("li[type='defaultlink']").html();
    var links = '';
    for (const link of liveMapConfig.menue.additionallinks) {
        if (!$("a[href='" + link.href + "']").length) {
            var icon = '';
            if (link.icon.class.trim() != "") {
                icon = '<i class="' + link.icon.class.trim() + '"></i>';
            }
            if (link.icon.color.trim() != "") {
                icon = '<span style="color:' + link.icon.color.trim() + '">' + icon + '</span>';
            }
            links += '<li class="menu_button allowed"><a href="' + link.href + '" target="_blank" data-permission="' + link.permission + '" class="text-light">' + icon + '&nbsp;-&nbsp;<small>' + link.name + '</small></a></li>';
        }
    }
    if (links.trim() != "") {
        $('#links').append(links);
    }

    if (liveMapConfig.steam.show) {
        $('#userstate').removeClass('d-none');
    }
    if (liveMapConfig.steam.offline.trim() != '') {
        $('#steam-offline').html(liveMapConfig.steam.offline.trim());
    }
    if (liveMapConfig.steam.online.trim() != '') {
        $('#steam-online').html(liveMapConfig.steam.online.trim());
    }

    if (liveMapConfig.steam.logoff.trim() != '') {
        $('#steam-logoff').html(liveMapConfig.steam.logoff.trim());
    }

    if (liveMapConfig.steam.login.trim() != '') {
        $('#steam-login').html(liveMapConfig.steam.login.trim());
    }

    if (liveMapConfig.steam.logintitle.trim() != '') {
        $('#steam-login-title').attr('title', liveMapConfig.steam.logintitle.trim());
    }
}


function nextEvents() {
    // next reboot
    if (liveMapConfig.next.reboot.show) {
        var currentDate = new Date();
        currentDate.setDate(1);
        var currentHour = currentDate.getHours();
        var currentMinute = currentDate.getMinutes();
        var nextRebootDate = new Date();
        for (const next of liveMapConfig.next.reboot.reboothours) {
            nextRebootDate.setDate(1);
            if (parseInt(next) == 0) {
                nextRebootDate.setDate(2);
            }
            nextRebootDate.setHours(parseInt(next));
            nextRebootDate.setMinutes(0);
            if (currentDate.getTime() <= nextRebootDate.getTime()) {
                var diff = parseInt(nextRebootDate.getTime() - currentDate.getTime());
                var seconds = Math.floor((nextRebootDate - (currentDate)) / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                next_reboot_time = minutes + "m";
                if (hours > 0) {
                    next_reboot_time = hours + "h" + next_reboot_time;
                }

                if (liveMapConfig.next.reboot.showtimeleft) {
                    document.getElementById('next_reboot').innerHTML = next + ":00";
                }
                document.getElementById('next_reboot_time').innerHTML = next_reboot_time;

                break;
            }
        }
        ;
    }
    // next bloodmoon
    if (liveMapConfig.next.bloodmoon.show) {
        var current = new Date();
        var newTime = new Date();
        var currentIngameTime = new Date();
        var nextBNTime = new Date();
        nextBNTime.setDate(current.getDate() + 7);
        nextBNTime.setHours(22);
        nextBNTime.setMinutes(0);
        nextBNTime.setSeconds(0);
        $.getJSON("../api/getstats")
            .done(function (data) {
                var time = data.gametime;
                var inGameDayOfWeek = time.days % 7 > 0 ? time.days % 7 : 7;
                currentIngameTime.setDate(current.getDate() + inGameDayOfWeek);
                currentIngameTime.setHours(time.hours);
                currentIngameTime.setMinutes(time.minutes);
                currentIngameTime.setSeconds(0);
                diffMinutes = Math.ceil(((nextBNTime.getTime() - currentIngameTime.getTime()) / 1000 / 60 / 60 / 24) * 90);
                newTime.setMinutes(current.getMinutes() + diffMinutes);
                var hours = newTime.getHours();
                var minutes = newTime.getMinutes();
                inminutes = parseInt(Math.floor(diffMinutes % 60));
                inhours = parseInt(Math.floor(diffMinutes / 60));
                next_bn_time = inminutes + "m";
                if (inhours > 0) {
                    next_bn_time = inhours + "h" + next_bn_time;
                }
                if (liveMapConfig.next.bloodmoon.showtimeleft) {
                    document.getElementById('next_bn_time').innerHTML = next_bn_time;
                }
                document.getElementById('next_bn').innerHTML = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
            })
            .fail(function (jqxhr, textStatus, error) {
                console.log("Error fetching time stats");
            })
            .always(function () {
            });
    }
}

function executeInterval() {
    nextEvents();
    $(function () {
        $("#data_info").load("data/info.html");
    });
}

applyConfig();
executeInterval();
const interval = setInterval(executeInterval, liveMapConfig.next.updateinterval * 1000);
