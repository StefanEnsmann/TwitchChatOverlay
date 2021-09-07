class ChatParameters {
    globalBadges = null;
    channelInfo = null;
    assignedColors = {};

    possibleColors = ["blue", "coral", "dodgerblue", "springgreen", "yellowgreen", "green",
        "orangered", "red", "goldenrod", "hotpink", "cadetblue", "seagreen", "chocolate", "blueviolet", "firebrick"];
    badgeBaseSize = 18;
    emoteBaseSize = 28;

    //configurator only
    paramSeparator = "~";
    paramDelimiter = "$";
    channelSeparator = "+";

    // general
    passedChannelNames = [];
    maxmessages = 50;
    background = null;

    // messages
    fontfamily = "'Montserrat', sans-serif";
    defaultFont = this.fontfamily;
    fontsize = 20;
    fontcolor = "#000000";
    textAlign = "left";
    coloredactions = true;
    emotescale = 1;
    space = 5;
    spaceAround = 5;
    wraparoundname = true;
    channelboxspaceright = 5;
    channelboxspacebottom = 5;
    namespace = 200;

    // hide
    hideList = null;
    hideBotCommands = false;
    hideURL = false;

    // sender
    showbadges = true;
    badgespace = 3;
    sendersize = null;
    senderfamily = null;
    senderAlign = "left";

    // channel
    showrecipient = true;
    showrecipientimage = false;
    recipientfamily = null;
    recipientsize = null;
    recipientcolor = null;
    channelAlign = "left";

    // highlighted messages
    highlightMessageColor = null;
    highlightOnly = null;
    highlightMessageBackground = null;
    highlightTransparency = 30;

    // animation
    fadetime = null;
    showtime = null;
    transitionprop = null;

    constructor() {
        var root = document.documentElement;
        for (let opt of ["Transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition", "MsTransition"]) {
            if (opt in root.style) {
                this.transitionprop = opt;
                break;
            }
        }
    }

    get BadgeSize() {
        return Math.round(1.2 * (this.sendersize !== null ? this.sendersize : this.fontsize));
    }

    get ImageSize() {
        return Math.round(1.2 * (this.recipientsize !== null ? this.recipientsize : this.fontsize));
    }
    
    get EmoteSize() {
        return Math.round(this.emotescale * 1.2 * this.fontsize);
    }

    get RequestedFonts() {
        var format = function(s) { return s.split("'")[1]; };
        var fonts = [format(this.fontfamily)];
        if (this.senderfamily !== null) {
            fonts.push(format(this.senderfamily));
        }
        if (this.recipientfamily !== null) {
            fonts.push(format(this.recipientfamily));
        }
        return fonts;
    }

    formatBackground(container) {
        if (this.background !== null)
        container.style.background = this.background;
    }

    createMessageContainer(channel, tags, message) {
        if ((this.hideList !== null && this.hideList.includes(tags["username"])) || (this.hideBotCommands && message.trim().startsWith("!"))) {
            return null;
        }
        if (tags["color"] === null && this.assignedColors[tags["username"]] === undefined) {
            this.assignedColors[tags["username"]] = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
        }
        var isHighlightedMessage = this.highlightMessageBackground !== null && tags["msg-id"] !== undefined && tags["msg-id"] === "highlighted-message"
            && (this.highlightOnly === null || this.highlightOnly.includes(channel.substring(1)));

        var newMessage = document.createElement("div");
        newMessage.style.width = "calc(100% - " + (2 * this.spaceAround) + " + px)";
        newMessage.style.marginTop = this.space + "px";
        newMessage.style.padding = this.spaceAround + "px";
        if (isHighlightedMessage) {
            newMessage.style.background = this.highlightMessageBackground + this.highlightTransparency.toString(16).toUpperCase();
        }
        if (this.fadetime !== null && this.fadetime != 0) {
            newMessage.style[this.transitionprop] = "opacity " + this.fadetime + "s ease 0s";
            newMessage.style.opacity = "0.0";
        }

        // -----------------------------------------------------------------------------------------------------------
        // -----------------------------------------------------------------------------------------------------------

        var nameBox = document.createElement("div");
        nameBox.style.fontWeight = "bold";
        nameBox.style.marginRight = this.channelboxspaceright + "px";
        nameBox.style.marginBottom = this.channelboxspacebottom + "px";
        nameBox.style.float = "left";
        if (!this.wraparoundname) {
            nameBox.style.width = this.namespace + "px";
            nameBox.style.overflowX = "hidden";
            nameBox.style.whiteSpace = "nowrap";
        }

        var senderNameBox = document.createElement("div");
        nameBox.appendChild(senderNameBox);

        var usercolor = tags["color"];
        if (usercolor === null) {
            usercolor = this.assignedColors[tags["username"]];
        }
        senderNameBox.style.color = usercolor;
        senderNameBox.style.textAlign = this.senderAlign;
        if (this.sendersize !== null) {
            senderNameBox.style.fontSize = this.sendersize + "px";
        }
        else {
            senderNameBox.style.fontSize = this.fontsize + "px";
        }
        if (this.senderfamily !== null) {
            senderNameBox.style.fontFamily = this.senderfamily;
        }
        else {
            senderNameBox.style.fontFamily = this.fontfamily;
        }

        if (this.showbadges) {
            var resolution = (this.BadgeSize <= this.badgeBaseSize ? "1" : (this.BadgeSize <= 2 * this.badgeBaseSize ? "2" : "4"));
            for (var badge in tags["badges"]) {
                var img = document.createElement("img");
                if (badge === "subscriber") {
                    img.src = this.channelInfo[channel.substring(1)]["badges"]["badge_sets"][badge]["versions"][tags["badges"][badge]]["image_url_" + resolution + "x"];
                }
                else {
                    img.src = this.globalBadges["badge_sets"][badge]["versions"][tags["badges"][badge]]["image_url_" + resolution + "x"];
                }
                img.alt = badge;
                img.height = this.BadgeSize;
                img.style.marginRight = this.badgespace + "px";
                img.style.verticalAlign = "text-bottom";
                senderNameBox.innerHTML += img.outerHTML;
            }
        }
        senderNameBox.innerHTML += tags["display-name"];

        if (this.showrecipient) {
            var channelNameBox = document.createElement("div");
            nameBox.appendChild(channelNameBox);
            channelNameBox.style.fontStyle ="italic";
            channelNameBox.style.textAlign = this.channelAlign;
            if (this.recipientsize !== null) {
                channelNameBox.style.fontSize = this.recipientsize + "px";
            }
            else {
                channelNameBox.style.fontSize = this.fontsize + "px";
            }
            if (this.recipientfamily !== null) {
                channelNameBox.style.fontFamily = this.recipientfamily;
            }
            else {
                channelNameBox.style.fontFamily = this.fontfamily;
            }
            
            if (isHighlightedMessage) {
                channelNameBox.style.color = this.highlightMessageColor;
            }
            else if (this.recipientcolor !== null) {
                channelNameBox.style.color = this.recipientcolor;
            }
            else {
                channelNameBox.style.color = this.fontcolor;
            }
            if (this.showrecipientimage) {
                var img = document.createElement("img");
                img.src = this.channelInfo[channel.substring(1)]["image"];
                img.alt = "channel image";
                img.height = this.ImageSize;
                img.style.marginRight = this.badgespace + "px";
                img.style.verticalAlign = "text-bottom";
                channelNameBox.innerHTML += img.outerHTML;
            }
            channelNameBox.innerHTML += channel;
        }

        // -----------------------------------------------------------------------------------------------------------
        // -----------------------------------------------------------------------------------------------------------


        newMessage.appendChild(nameBox);

        var messageString = this.formatMessage(message, tags);
        var targetContainer = null;
        if (!this.wraparoundname) {
            var messageBox = document.createElement("div");
            messageBox.style.width = "calc(100% - " + (this.namespace + this.channelboxspaceright) + "px)";
            messageBox.style.float = "right";
            newMessage.appendChild(messageBox);
            targetContainer = messageBox;
        }
        else {
            targetContainer = newMessage;
        }

        if (this.coloredactions && tags["message-type"] === "action") {
            var usercolor = tags["color"];
            if (usercolor === null) {
                usercolor = this.assignedColors[tags["username"]];
            }
            targetContainer.style.color = usercolor;
        }
        else if (isHighlightedMessage) {
            targetContainer.style.color = this.highlightMessageColor;
        }
        else {
            targetContainer.style.color = this.fontcolor;
        }
        targetContainer.style.fontSize = this.fontsize + "px";
        targetContainer.style.textAlign = this.textAlign;
        targetContainer.style.wordWrap = "break-word";
        targetContainer.style.fontFamily = this.fontfamily;
        console.log(this.fontfamily);
        targetContainer.innerHTML += messageString;

        return newMessage;
    }

    formatMessage(message, tags) {
        if (this.hideURL) {
            var urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
            var find = null;
            do {
                find = urlPattern.exec(message);
                if (find !== null) {
                    message = message.replace(find[0], "***");
                }
            }
            while (find !== null);
        }
        var resolution = (this.EmoteSize <= this.badgeEmoteSize ? "1.0" : (this.EmoteSize <= 2 * this.badgeEmoteSize ? "2.0" : "3.0"));
        var cmp = function(a, b) { return b["start"] - a["start"]; };
        var replacementList = [];
        var emotes = tags["emotes"];
        
        for (var emotetype in emotes) {
            var emoteName = null;
            for (var i = 0; i < emotes[emotetype].length; ++i) {
                var startEnd = emotes[emotetype][i].split("-");
                startEnd = [parseInt(startEnd[0]), parseInt(startEnd[1])];
                if (emoteName === null) {
                    emoteName = message.substring(startEnd[0], startEnd[1] + 1);
                }
                replacementList.push({"start": startEnd[0], "end": startEnd[1], "id": emotetype, "name": emoteName});
            }
        }
        replacementList.sort(cmp);
        for (var i = 0; i < replacementList.length; ++i) {
            var src = "https://static-cdn.jtvnw.net/emoticons/v1/" + replacementList[i]["id"] + "/" + resolution;
            message = message.substring(0, replacementList[i]["start"]) +
            "<img src='" + src + "' alt='" + replacementList[i]["name"] + "' height=" +
            this.EmoteSize + "px " + 
            "style='vertical-align:text-bottom' />" +  
            message.substring(replacementList[i]["end"] + 1);
        }
        return message;
    }

    createStyleString() {
        var styleString = "";
        if (this.passedChannelNames.length > 0) {
            styleString += "c" + this.paramSeparator + /*this.codeCharacters(this.passedChannelNames.join(this.channelSeparator), true)*/ this.passedChannelNames.join(this.channelSeparator);
            if (this.maxmessages !== 50) {
                styleString += this.paramDelimiter + "m" + this.paramSeparator + this.maxmessages;
            }
            if (this.background !== null) {
                styleString += this.paramDelimiter + "bg" + this.paramSeparator + /*this.codeCharacters(this.background, true)*/ this.background;
            }

            if (this.hideList !== null) {
                styleString += this.paramDelimiter + "hl" + this.paramSeparator + this.hideList.join(this.channelSeparator);
            }
            if (this.hideBotCommands) {
                styleString += this.paramDelimiter + "hbc" + this.paramSeparator + "1";
            }
            if (this.hideURL) {
                styleString += this.paramDelimiter + "hu" + this.paramSeparator + "1";
            }

            if (this.textAlign !== "left") {
                styleString += this.paramDelimiter + "ta" + this.paramSeparator + this.textAlign;
            }
            if (!this.wraparoundname) {
                styleString += this.paramDelimiter + "w" + this.paramSeparator + "0";
            }
            if (!this.wraparoundname && this.namespace !== 200) {
                styleString += this.paramDelimiter + "n" + this.paramSeparator + this.namespace;
            }
            if (this.channelboxspaceright != 5) {
                styleString += this.paramDelimiter + "nr" + this.paramSeparator + this.channelboxspaceright;
            }
            if (this.wraparoundname && this.channelboxspacebottom != 5) {
                styleString += this.paramDelimiter + "nb" + this.paramSeparator + this.channelboxspacebottom;
            }
            if (this.fontfamily !== this.defaultFont) {
                styleString += this.paramDelimiter + "f" + this.paramSeparator + /*this.codeCharacters(this.fontfamily, true)*/ this.fontfamily;
            }
            if (this.fontsize !== 20) {
                styleString += this.paramDelimiter + "fs" + this.paramSeparator + this.fontsize;
            }
            if (this.fontcolor !== "#000000") {
                styleString += this.paramDelimiter + "fc" + this.paramSeparator + /*this.codeCharacters(this.fontcolor, true)*/ this.fontcolor;
            }
            if (this.space !== 5) {
                styleString += this.paramDelimiter + "s" + this.paramSeparator + this.space;
            }
            if (this.spaceAround !== 5) {
                styleString += this.paramDelimiter + "sp" + this.paramSeparator + this.spaceAround;
            }
            if (this.emotescale !== 1) {
                styleString += this.paramDelimiter + "es" + this.paramSeparator + this.emotescale;
            }
            if (!this.coloredactions) {
                styleString += this.paramDelimiter + "a" + this.paramSeparator + "0";
            }

            if (this.highlightMessageColor !== null && this.highlightMessageColor !== this.fontcolor) {
                styleString += this.paramDelimiter + "hc" + this.paramSeparator + /*this.codeCharacters(this.highlightMessageColor, true)*/ this.highlightMessageColor;
            }
            if (this.highlightMessageBackground !== null) {
                styleString += this.paramDelimiter + "hb" + this.paramSeparator + /*this.codeCharacters(this.highlightMessageBackground, true)*/ this.highlightMessageBackground;
            }
            if (this.highlightTransparency !== 30 && this.highlightMessageColor !== null) {
                styleString += this.paramDelimiter + "ht" + this.paramSeparator + this.highlightTransparency;
            }
            if (this.highlightOnly !== null && this.highlightMessageColor !== null) {
                styleString += this.paramDelimiter + "ho" + this.paramSeparator + /*this.codeCharacters(this.highlightOnly.join(this.channelSeparator), true)*/ this.highlightOnly.join(this.channelSeparator);
            }

            if (this.senderAlign !== "left") {
                styleString += this.paramDelimiter + "sa" + this.paramSeparator + this.senderAlign;
            }
            if (!this.showbadges) {
                styleString += this.paramDelimiter + "b" + this.paramSeparator + "0";
            }
            if (this.showbadges && this.badgespace !== 3) {
                styleString += this.paramDelimiter + "bs" + this.paramSeparator + this.badgespace;
            }
            if (this.senderfamily !== null && this.senderfamily !== this.fontfamily) {
                styleString += this.paramDelimiter + "sf" + this.paramSeparator + /*this.codeCharacters(this.senderfamily, true)*/ this.senderfamily;
            }
            if (this.sendersize !== null && this.sendersize !== this.fontsize) {
                styleString += this.paramDelimiter + "ss" + this.paramSeparator + this.sendersize;
            }


            if (!this.showrecipient) {
                styleString += this.paramDelimiter + "r" + this.paramSeparator + "0";
            }
            if (this.showrecipient && this.showrecipientimage) {
                styleString += this.paramDelimiter + "ri" + this.paramSeparator + "1";
            }
            if (this.showrecipient && this.channelAlign !== "left") {
                styleString += this.paramDelimiter + "ca" + this.paramSeparator + this.channelAlign;
            }
            if (this.showrecipient && this.recipientfamily !== null && this.recipientfamily !== this.fontfamily) {
                styleString += this.paramDelimiter + "rf" + this.paramSeparator + /*this.codeCharacters(this.recipientfamily, true)*/ this.recipientfamily;
            }
            if (this.showrecipient && this.recipientcolor !== null && this.recipientcolor !== this.fontcolor) {
                styleString += this.paramDelimiter + "rc" + this.paramSeparator + /*this.codeCharacters(this.recipientcolor, true)*/ this.recipientcolor;
            }
            if (this.showrecipient && this.recipientsize !== null && this.recipientsize !== this.fontsize) {
                styleString += this.paramDelimiter + "rs" + this.paramSeparator + this.recipientsize;
            }

            if (this.fadetime !== null && this.fadetime != 0) {
                styleString += this.paramDelimiter + "ft" + this.paramSeparator + this.fadetime;
            }
            if (this.showtime !== null && this.showtime != 0) {
                styleString += this.paramDelimiter + "st"  + this.paramSeparator + this.showtime;
            }
        }
        console.log("--------------------------");
        console.log(styleString);
        styleString = encodeURIComponent(styleString);
        console.log(styleString)
        console.log(decodeURIComponent(styleString));
        console.log("--------------------------");
        return styleString;
    }

    parseStyle(statusString) {
        // general
        var c = null; // channel list
        var m = null; // max messages
        var bg = null; // background color
    
        // messages
        var f = null; // font family
        var fs = null; // font size
        var fc = null; // font color
        var ta = null; // text align
        var a = null; // colored actions
        var es = null; // emote scale
        var s = null; // space
        var sp = null; // space around
        var w = null; // wraparound
        var nr = null; // space right
        var nb = null; // space bottom
        var n = null; // namespace

        // hide
        var hl = null; // hide list
        var hbc = null; // hide bot commands
        var hu = null; // hide urls
    
        // sender
        var b = null; // show badges
        var bs = null; // badge space
        var ss = null; // sender size
        var sf = null; // sender font family
        var sa = null; // sender text align
    
        // channel
        var r = null; // show recipient
        var ri = null; // show recipient image
        var rf = null; // recipient font family
        var rs = null; // recipient size
        var rc = null; // recipient color
        var ca = null; // recipient text align
    
        // highlighted messages
        var hc = null; // highlight font color
        var ho = null; // highlight only
        var hb = null; // highlight background
        var ht = null; // highlight transparency

        // generate clip preview
        var cp = null; // clip preview
        var cb = null; // clip background color
        var cs = null; // clip size
        var cfs = null; // clip font size
        var cfc = null; // clip font color
        var ccs = null; // clip creator size
        var ccc = null; // clip creator color
    
        // animation
        var ft = null; // fade time
        var st = null; // show time

        var colorRegExp = new RegExp("#[A-Fa-f0-9]{6}");
        var p = null;
        var v = null;
        var splits = null;
        var temp = null;
        console.log(statusString);
        statusString = decodeURIComponent(statusString);
        console.log(statusString);
        var params = statusString.split(this.paramDelimiter);
        for (let pv of params) {
            splits = pv.split(this.paramSeparator);
            p = splits[0];
            v = splits[1];
            switch (p) {
                case "c":
                    //temp = this.codeCharacters(v, false);
                    c = v.split(this.channelSeparator);
                    //console.log("c: " + c);
                    break;
                case "m":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        m = temp;
                    //console.log("m: " + m);
                    break;
                case "bg":
                    //temp = this.codeCharacters(v, false);
                    if (colorRegExp.test(v))
                        bg = v;
                    //console.log("bg: " + colorRegExp.test(temp) + " " + bg);
                    break;
                
                case "hl":
                    //temp = this.codeCharacters(v, false);
                    hl = v.split(this.channelSeparator);
                    //console.log("hl: " + hl);
                    break;
                case "hbc":
                    if (v === "0")
                        hbc = true;
                    //console.log("hbc: " + hbc);
                    break;
                case "hu":
                    if (v === "1")
                        hu = true;
                    //console.log("hu: " + hu);
                    break;
                
                case "f":
                    //temp = this.codeCharacters(v, false);
                    f = v.replace(/\+/g, " ");
                    //console.log("f: " + f);
                    break;
                case "fs":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        fs = temp;
                    //console.log("fs: " + fs);
                    break;
                case "fc":
                    //temp = this.codeCharacters(v, false);
                    if (colorRegExp.test(v))
                        fc = v;
                    //console.log("fc: " + colorRegExp.test(temp) + " " + fc);
                    break;
                case "ta":
                    if (["left", "right", "justify"].includes(v))
                        ta = v;
                    //console.log("ta: " + ta);
                    break;
                case "a":
                    if (v === "0")
                        a = false;
                    //console.log("a: " + a);
                    break;
                case "es":
                    temp = parseFloat(v);
                    if (temp !== undefined)
                        es = temp;
                    //console.log("es: " + es);
                    break;
                case "s":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        s = temp;
                    //console.log("s: " + s);
                    break;
                case "sp":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        sp = temp;
                    //console.log("sp: " + sp);
                    break;
                case "w":
                    if (v === "0")
                        w = false;
                    //console.log("w: " + w);
                    break;
                case "nr":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        nr = temp;
                    //console.log("nr: " + nr);
                    break;
                case "nb":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        nb = temp;
                    //console.log("nb: " + nb);
                    break;
                case "n":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        n = temp;
                    //console.log("n: " + n);
                    break;

                case "b":
                    if (v === "0")
                        b = false;
                    //console.log("b: " + b);
                    break;
                case "bs":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        bs = temp;
                    //console.log("bs: " + bs);
                    break;
                case "ss":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        ss = temp;
                    //console.log("ss: " + ss);
                    break;
                case "sf":
                    //temp = this.codeCharacters(v, false);
                    sf = v.replace(/\+/g, " ");
                    //console.log("sf: " + sf);
                    break;
                case "sa":
                    if (["left", "right"].includes(v))
                        sa = v;
                    //console.log("sa: " + sa);
                    break;

                case "r":
                    if (v === "0")
                        r = false;
                    //console.log("r: " + r);
                    break;
                case "ri":
                    if (v === "1")
                        ri = true;
                    //console.log("ri ": + ri);
                    break;
                case "rf":
                    //temp = this.codeCharacters(v, false);
                    rf = v.replace(/\+/g, " ");
                    //console.log("rf: " + rf);
                    break;
                case "rs":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        rs = temp;
                    //console.log("rs: " + rs);
                    break;
                case "rc":
                    //temp = this.codeCharacters(v, false);
                    if (colorRegExp.test(v))
                        rc = v;
                    //console.log("rc: " + colorRegExp.test(temp) + " " + rc);
                    break;
                case "ca":
                    if (["left", "right"].includes(v))
                        ca = v;
                    //console.log("ca: " + ca);
                    break;

                case "hc":
                    //temp = this.codeCharacters(v, false);
                    if (colorRegExp.test(v))
                        hc = v;
                    //console.log("hc: " + colorRegExp.test(temp) + " " + hc);
                    break;
                case "hb":
                    //temp = this.codeCharacters(v, false);
                    if (colorRegExp.test(v))
                        hb = v;
                    //console.log("hb: " + colorRegExp.test(temp) + " " + hb);
                    break;
                case "ho":
                    //temp = this.codeCharacters(v, false);
                    ho = v.split(this.channelSeparator);
                    //console.log("ho: " + ho);
                    break;
                case "ht":
                    temp = parseInt(v);
                    if (temp !== undefined)
                        ht = temp;
                    //console.log("ht: " + ht);
                    break;
                    
                case "ft":
                    temp = parseFloat(v);
                    if (temp !== undefined)
                        ft = temp;
                    //console.log("ft: " + ft);
                    break;
                case "st":
                    temp = parseFloat(v);
                    if (temp !== undefined)
                        st = temp;
                    //console.log("st: " + st);
                    break;
            }
        }
        console.log(c + " " + m + " " + bg);
        console.log(hl + " " + hbc + " " + hu);
        console.log(f + " " + fs + " " + fc + " " + ta + " " + a + " " + es + " " + s + " " + sp + " " + w + " " + nr + " " + nb + " " + n);
        console.log(b + " " + bs + " " + ss + " " + sf + " " + sa);
        console.log(r + " " + ri + " " + rf + " " + rs + " " + rc + " " + ca);
        console.log(hc + " " + hb + " " + ht + " " + ho);
        console.log(ft + " " + st);

        if (c !== null) {
            this.passedChannelNames = c;
        }
        if (m !== null) {
            this.maxmessages = m;
        }
        if (bg !== null) {
            this.background = bg;
        }

        if (hl !== null) {
            this.hideList = hl;
        }
        if (hbc !== null) {
            this.hideBotCommands = hbc;
        }
        if (hu !== null) {
            this.hideURL = hu;
        }

        if (f !== null) {
            this.fontfamily = f;
        }
        if (fs !== null) {
            this.fontsize = fs;
        }
        if (fc !== null) {
            this.fontcolor = fc;
        }
        if (ta !== null) {
            this.textAlign = ta;
        }
        if (a !== null) {
            this.coloredactions = a;
        }
        if (es !== null) {
            this.emotescale = es;
        }
        if (s !== null) {
            this.space = s;
        }
        if (sp !== null) {
            this.spaceAround = sp;
        }
        if (w !== null) {
            this.wraparoundname = w;
        }
        if (nr !== null) {
            this.channelboxspaceright = nr;
        }
        if (nb !== null) {
            this.channelboxspacebottom = nb;
        }
        if (n !== null) {
            this.namespace = n;
        }

        if (b !== null) {
            this.showbadges = b;
        }
        if (bs !== null) {
            this.badgespace = bs;
        }
        if (ss !== null) {
            this.sendersize = ss;
        }
        if (sf !== null) {
            this.senderfamily = sf;
        }
        if (sa !== null) {
            this.senderAlign = sa;
        }

        if (r !== null) {
            this.showrecipient = r;
        }
        if (ri !== null) {
            this.showrecipientimage = ri;
        }
        if (rf !== null) {
            this.recipientfamily = rf;
        }
        if (rs !== null) {
            this.recipientsize = rs;
        }
        if (rc !== null) {
            this.recipientcolor = rc;
        }
        if (ca !== null) {
            this.channelAlign = ca;
        }

        if (hc !== null) {
            this.highlightMessageColor = hc;
        }
        if (hb !== null) {
            this.highlightMessageBackground = hb;
        }
        if (ht !== null) {
            this.highlightTransparency = ht;
        }
        if (ho !== null) {
            this.highlightOnly = ho;
        }

        if (ft !== null) {
            this.fadetime = ft;
        }
        if (st !== null) {
            this.showtime = st;
        }
    }
};