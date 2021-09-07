var chatParams = new ChatParameters();
chatParams.possibleColors = chatParams.possibleColors.filter(function(value, index, arr){ return value !== "green"; });
chatParams.globalBadges = {"badge_sets":
    {"broadcaster":
        {"versions":
            {"1":
                {
                    "image_url_1x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
                    "image_url_2x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2",
                    "image_url_4x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/4"
                }
            }
        },
    "moderator":
        {"versions":
            {"1":
                {
                    "image_url_1x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
                    "image_url_2x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2",
                    "image_url_4x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/4"
                }
            }
        },
    "premium":
        {"versions":
            {"1":
                {
                    "image_url_1x": "https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1",
                    "image_url_2x": "https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/2",
                    "image_url_4x": "https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/4"
                }
            }
        }
    }
};
chatParams.channelInfo = {
    "zensmann" : {
        "badges": { "badge_sets": {} },
        "display": "Zensmann",
        "id": "123456789",
        "image": "https://static-cdn.jtvnw.net/jtv_user_pictures/f3a6e5dd-903c-4be7-899c-48de3f12319b-profile_image-300x300.png"
    },
    "otherchannel" : {
        "badges": { "badge_sets": {} },
        "display": "OtherChannel",
        "id": "123456789",
        "image": "https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-300x300.png"
    },
    "anotherchannel" : {
        "badges": { "badge_sets": {} },
        "display": "AnotherChannel",
        "id": "123456789",
        "image": "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png"
    }
};

var lastAnimationTimestamp;
var currentAnimationState;

function resizeCallback() {
    var sizeField = document.getElementById("previewSize");
    var prev = document.getElementById("preview");
    var width = parseInt(window.getComputedStyle(prev, null).getPropertyValue("width"));
    var height = parseInt(window.getComputedStyle(prev, null).getPropertyValue("height"));
    sizeField.innerText = width + " x " + height;
}

function ParseInputs() {
    var splits = document.getElementById("channelsInput").value.toLowerCase().split(/[;,]/)
    if (splits[0] !== "") {
        chatParams.passedChannelNames = splits;
    }
    else {
        chatParams.passedChannelNames = [];
    }

    // general
    //chatParams.channels = document.getElementById("channelsInput").value;
    chatParams.maxmessages = parseInt(document.getElementById("maxmessagesInput").value);
    chatParams.background = document.getElementById("usebackgroundcolorInput").checked ? document.getElementById("previewColorInput").value : null;

    splits = document.getElementById("ignoreInput").value.toLowerCase().split(/[;,]/)
    if (splits[0] !== "") {
        chatParams.hideList = splits;
    }
    else {
        chatParams.hideList = null;
    }
    chatParams.hideBotCommands = document.getElementById("hideCommandsInput").checked;
    chatParams.hideURL = document.getElementById("hideUrlsInput").checked;

    // messages
    chatParams.fontfamily = document.getElementById("fontSelector").value;
    chatParams.fontsize = parseInt(document.getElementById("fontsizeInput").value);
    chatParams.fontcolor = document.getElementById("textColorInput").value;
    chatParams.textAlign = document.getElementById("textalign").value;
    chatParams.coloredactions = document.getElementById("coloredActions").checked;
    chatParams.emotescale = parseFloat(document.getElementById("emotescaleInput").value);
    chatParams.space = parseInt(document.getElementById("spaceInput").value);
    chatParams.spaceAround = parseInt(document.getElementById("spaceAroundInput").value);
    chatParams.wraparoundname = document.getElementById("wrapText").checked;
    chatParams.channelboxspaceright = parseInt(document.getElementById("horizSpaceInput").value);
    chatParams.channelboxspacebottom = parseInt(document.getElementById("verticSpaceInput").value);
    chatParams.namespace = parseInt(document.getElementById("namespaceInput").value);

    // sender
    chatParams.showbadges = document.getElementById("showbadgesInput").checked;
    chatParams.badgespace = parseInt(document.getElementById("badgespaceInput").value);
    var usesenderstyle = document.getElementById("senderstyle").checked;
    chatParams.senderfamily = usesenderstyle ? document.getElementById("senderFontSelector").value : null;
    chatParams.sendersize = usesenderstyle ? parseInt(document.getElementById("sendersizeInput").value) : null;
    chatParams.senderAlign = document.getElementById("senderalign").value;

    // channel
    chatParams.showrecipient = document.getElementById("showrecipientInput").checked;
    chatParams.showrecipientimage = document.getElementById("showchannelImage").checked;
    var userecipientstyle = document.getElementById("recipientstyle").checked;
    chatParams.recipientfamily = userecipientstyle ? document.getElementById("recipientFontSelector").value : null;
    chatParams.recipientsize = userecipientstyle ? parseInt(document.getElementById("recipientsizeInput").value) : null;
    chatParams.recipientcolor = userecipientstyle ? document.getElementById("recipientcolorInput").value : null;
    chatParams.channelAlign = document.getElementById("channelalign").value;

    // highlighted messages
    var highlightmessages = document.getElementById("highlight").checked;
    chatParams.highlightMessageColor = highlightmessages ? document.getElementById("highlightfontcolorInput").value : null;
    if (highlightmessages) {
        splits = document.getElementById("highlightOnlyInput").value.toLowerCase().split(/[;,]/)
        if (splits[0] !== "") {
            chatParams.highlightOnly = splits;
        }
        else {
            chatParams.highlightOnly = null;
        }
    }
    else {
        chatParams.highlightOnly = null;
    }
    console.log(chatParams.highlightOnly);
    chatParams.highlightMessageBackground = highlightmessages ? document.getElementById("highlightbackgroundcolorInput").value : null;
    chatParams.highlightTransparency = 255 - Math.round(parseInt(document.getElementById("highlighttransparencyInput").value) / 100. * 255);

    // animation
    chatParams.fadetime = parseFloat(document.getElementById("fadetime").value);
    chatParams.showtime = parseFloat(document.getElementById("showtime").value);
}

function GenerateMessageInfo(channel, color, display_name, emotes, message_type, mod, msg_id, subscriber, turbo, premium, message) {
    var username = display_name.toLowerCase();
    var broadcaster = (channel.substring(1) === username);
    var badges = {};
    if (broadcaster) {
        badges["broadcaster"] = "1";
    }
    else if (mod) {
        badges["moderator"] = "1";
    }
    if (subscriber > 0) {
        badges["subscriber"] = subscriber.toString();
    }
    if (premium) {
        badges["premium"] = "1";
    }
    return {"channel": channel,
            "userstate": {"badge-info": null, "badge-info-raw": null, "badges": badges, "badges-raw": "", "color": color, "display-name": display_name, "emotes": emotes, "emotes-raw": "", "flags": null, "id": "", "message-type": message_type, "mod": (broadcaster ? false : mod), "msg-id": msg_id, "room-id": "", "subscriber": (subscriber > 0), "tmi-sent-ts": "", "turbo": turbo, "user-id": "", "user-type": (broadcaster ? "broadcaster" : (mod ? "mod" : "")), "username": username},
            "message": message,
            "self": broadcaster};
}

function GeneratePreview() {
    var content = document.getElementById("preview");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    content.style = "background:" + document.getElementById("previewColorInput").value + ";font-size:" + chatParams.fontsize + "px";

    var msgs =[];
    for (var i = chatParams.maxmessages; i > 9; --i) {
        msgs.push(["chat", GenerateMessageInfo("#zensmann", "#DAA520", "Zensmann", null, "chat", false, null, 0, false, false,  "This is text message #" + i + ".")]);
    }
    msgs.push(["action", GenerateMessageInfo("#zensmann", "#1E90FF", "Zens_bot", null, "action", false, null, 0, false, false,  "This is a response from the bot")]);
    msgs.push(["chat", GenerateMessageInfo("#zensmann", "#DAA520", "Zensmann", null, "chat", false, null, 0, false, false,  "!botcommand")]);
    msgs.push(["chat", GenerateMessageInfo("#zensmann", "#DAA520", "Zensmann", null, "chat", false, null, 0, false, false,  "This is a test message with a URL: https://twitch.tv/zensmann")]);
    msgs.push(["action", GenerateMessageInfo("#zensmann", "#DAA520", "Zensmann", null, "action", false, null, 0, false, false,  "shows a test action starting with /me")]);
    msgs.push(["chat", GenerateMessageInfo("#anotherchannel", "#DAA520", "Zensmann", null, "chat", true, "highlighted-message", 0, false, false, "This is a highlighted test message.")]);
    msgs.push(["chat", GenerateMessageInfo("#otherchannel", null, "AnotherChatter", null, "chat", true, null, 0, false, true, "This is a test message by another chatter in another channel chat, where he or she is a mod.")]);
    msgs.push(["chat", GenerateMessageInfo("#otherchannel", "#DAA520", "Zensmann", null, "chat", false, "highlighted-message", 0, false, false,  "This is a very very very long test message that does not contain any emotes. Line wrapping will occur normally and the lines will not spread any further, since there are no emotes included in this text. However this message does come from myself in a channel chat, where I do not have mod rights.")]);
    msgs.push(["chat", GenerateMessageInfo("#zensmann", null, "OtherChatter", {"25": ["36-40"], "425618": ["93-95"]}, "chat", true, null, 0, false, false,  "This is a long text message with an Kappa emote included. Furthermore I included another one LUL just for the lols. It comes from another chatter in my own chatroom. For demonstration purposes I assigned him both badges, so you can see how multiple badges are behaving.")]);
    msgs.push(["chat", GenerateMessageInfo("#zensmann", "#DAA520", "Zensmann", null, "chat", false, null, 0, false, false,  "This is a test message by myself in my own chat.")]);
    
    for (var i = Math.max(0, msgs.length - chatParams.maxmessages); i < msgs.length; ++i) {
        if (msgs[i][0] === "chat") {
            var msgBox = chatParams.createMessageContainer(msgs[i][1]["channel"], msgs[i][1]["userstate"], msgs[i][1]["message"]);
            if (msgBox !== null) {
                content.appendChild(msgBox);
            }
        }
        else if (msgs[i][0] === "action") {
            var msgBox = chatParams.createMessageContainer(msgs[i][1]["channel"], msgs[i][1]["userstate"], msgs[i][1]["message"]);
            if (msgBox !== null) {
                content.appendChild(msgBox);
            }
        }
        else {
            console.log("Unrecognized event format: " + msgs[i][0]);
        }
    }
}

function UpdateView() {
    ParseInputs();
    var userecipientstyle = document.getElementById("recipientstyle").checked;
    var usesenderstyle = document.getElementById("senderstyle").checked;
    var highlightmessages = document.getElementById("highlight").checked;
    document.getElementById("showchannelImage").disabled = !chatParams.showrecipient;
    document.getElementById("recipientstyle").disabled = !chatParams.showrecipient;
    document.getElementById("recipientcolorInput").disabled = !chatParams.showrecipient || !userecipientstyle;
    document.getElementById("recipientsizeInput").disabled = !chatParams.showrecipient || !userecipientstyle;
    document.getElementById("channelalign").disabled = !chatParams.showrecipient;
    document.getElementById("recipientFontSelector").disabled = !chatParams.showrecipient  || !userecipientstyle;
    document.getElementById("highlightfontcolorInput").disabled = !highlightmessages;
    document.getElementById("highlightbackgroundcolorInput").disabled = !highlightmessages;
    document.getElementById("highlighttransparencyInput").disabled = !highlightmessages;
    document.getElementById("highlightOnlyInput").disabled = !highlightmessages;
    document.getElementById("badgespaceInput").disabled = !chatParams.showbadges;
    document.getElementById("sendersizeInput").disabled = !usesenderstyle;
    document.getElementById("senderFontSelector").disabled = !usesenderstyle;
    document.getElementById("namespaceInput").disabled = chatParams.wraparoundname;
    document.getElementById("verticSpaceInput").disabled = !chatParams.wraparoundname;

    var selectedFontIndex = document.getElementById("fontSelector").selectedIndex;
    if (!usesenderstyle) {
        document.getElementById("sendersizeInput").value = chatParams.fontsize;
        document.getElementById("senderFontSelector").selectedIndex = selectedFontIndex;
    }
    if (!userecipientstyle) {
        document.getElementById("recipientsizeInput").value = chatParams.fontsize;
        document.getElementById("recipientFontSelector").selectedIndex = selectedFontIndex;
        document.getElementById("recipientcolorInput").value = chatParams.fontcolor;
    }

    var url = window.location.href.replace("configurator.html", "");
    url = window.location.href.replace("configurator", "");
    if (url.startsWith("file:///")) {
        url += "index.html"
    }
    var stateString = chatParams.createStyleString();
    if (stateString !== "") {
        url += "?state=" + stateString;
    }
    document.getElementById("url").innerText = url;
    if (chatParams.passedChannelNames.length == 0) {
        document.getElementById("urllink").href = "#";
        document.getElementById("urllink").removeAttribute("target");
    }
    else {
        document.getElementById("urllink").href = url;
        document.getElementById("urllink").target = "_blank";
    }
    GeneratePreview();
    resizeCallback();
    var content = document.getElementById("preview");
    for (var i = 0; i < content.children.length - 1; ++i) {
        content.children[i].style.opacity = "1.0";
    }
    lastAnimationTimestamp = Date.now();
    currentAnimationState = 1;
}

function CopyButton() {
    var tempText = document.createElement("textarea");
    var url = document.getElementById("url").innerText;
    tempText.value = url;
    tempText.setAttribute("readonly", "");
    tempText.style = "position:absolute;left:-9999px";
    document.body.appendChild(tempText);
    tempText.select();
    document.execCommand("copy");
    document.body.removeChild(tempText);
    alert("Copied following link to the clipboard:\n" + url);
}

function animateLastMessage() {
    var now = Date.now();
    var showtimeSet = chatParams.showtime != 0;
    var fadetimeSet = chatParams.fadetime != 0;
    var content = document.getElementById("preview");
    var lastChild = content.children[content.children.length - 1];
    if (currentAnimationState == 0 && (now - lastAnimationTimestamp) >= 3000) { // object is hidden
        lastChild.style.opacity = "1.0";
        lastAnimationTimestamp = now;
        if (fadetimeSet) {
            currentAnimationState = 1;
        }
        else {
            currentAnimationState = 2;
        }
    }
    if (currentAnimationState == 1 && (now - lastAnimationTimestamp) >= chatParams.fadetime * 1000) { // object is fading in
        lastAnimationTimestamp = now;
        currentAnimationState = 2;
    }
    else if (currentAnimationState == 2 && (now - lastAnimationTimestamp) >= (showtimeSet ? chatParams.showtime : 5) * 1000) { // object is visible
        if (fadetimeSet) {
            lastChild.style.opacity = "0.0";
            currentAnimationState = 3;
        }
        else {
            lastChild.classList.add("notransition");
            lastChild.style.opacity = "0.0";
            lastChild.offsetHeight;
            lastChild.classList.remove("notransition");
            currentAnimationState = 0;
        }
        lastAnimationTimestamp = now;
    }
    else if (currentAnimationState == 3 && (now - lastAnimationTimestamp) >= chatParams.fadetime * 1000) { // object is fading out
        lastChild.style.opacity = "0.0";
        currentAnimationState = 0;
    }
    setTimeout(animateLastMessage, 10);
}

function InitFonts() {
    var fontRequest = new XMLHttpRequest();
    fontRequest.onreadystatechange = function() {
        if (fontRequest.readyState == 4) {
            if (fontRequest.status == 200) {
                var fonts = JSON.parse(fontRequest.responseText);
                var cssLinkBase = "https://fonts.googleapis.com/css2?";
                var generalFont = document.getElementById("fontSelector");
                var senderFont = document.getElementById("senderFontSelector");
                var receiverFont = document.getElementById("recipientFontSelector");
                var fontArray = fonts["items"];
                var currentLink = cssLinkBase;
                var fontCount = 0;
                var maxFonts = 30;
                for (var i = 0; i < fontArray.length; ++i) {
                    var displayname = fontArray[i]["family"];
                    var cat = fontArray[i]["category"];

                    var key = "'" + displayname + "', " + (cat === "display" || cat === "handwriting" ? "cursive" : cat);
                    var cssKey = displayname.replace(/ /g, "+")
                    currentLink += "family=" + cssKey + "&";
                    ++fontCount;
                    if (fontCount >= maxFonts) {
                        currentLink += "display=swap";
                        var head = document.head;
                        var link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = currentLink;
                        head.appendChild(link);
                        currentLink = cssLinkBase;
                        fontCount = 0;
                    }

                    var selected = false;
                    if (key === chatParams.defaultFont) {
                        selected = true;
                    }
                    generalFont.options[generalFont.options.length] = new Option(displayname, key, null, selected);
                    senderFont.options[senderFont.options.length] = new Option(displayname, key, null, selected);
                    receiverFont.options[receiverFont.options.length] = new Option(displayname, key, null, selected);
                }
                if (fontCount > 0) {
                    currentLink += "display=swap";
                    var head = document.head;
                    var link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = currentLink;
                    head.appendChild(link);
                }
            }
        }
    }
    fontRequest.open("GET", "https://www.googleapis.com/webfonts/v1/webfonts?key=API_KEY", true);
    fontRequest.send();
}

InitFonts();

UpdateView();

currentAnimationState = 0;
lastAnimationTimestamp = Date.now();
setTimeout(animateLastMessage, 10);